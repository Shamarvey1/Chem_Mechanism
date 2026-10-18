
const OpenAI = require('openai');
const { validateMechanism }   = require('./mechanismValidator');
const { classifyReaction }    = require('./reactionClassifier');
const { validateWithPubChem } = require('./pubchemValidator');
const { generateJeeQuestions } = require('./jeeQuestionGenerator');
const { buildRagContext }     = require('./ragService');
const { getDocumentIndex }    = require('./documentIngestionAgent');

const PRIMARY_MODEL  = process.env.GROQ_MODEL         || 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = process.env.GROQ_MODEL_FALLBACK || 'openai/gpt-oss-20b';
const GROQ_BASE_URL  = 'https://api.groq.com/openai/v1';

// ── Helpers ────────────────────────────────────────────────────────────────────

function is429RateLimit(err) {
  const msg = (err?.message || '').toLowerCase();
  return (
    err?.status === 429 ||
    msg.includes('429') ||
    msg.includes('rate_limit') ||
    msg.includes('request too large') ||
    msg.includes('otpm') ||
    msg.includes('output tokens per minute')
  );
}

// Strip Qwen3 <think>...</think> blocks (thinking model leakage) from response
function cleanModelOutput(text) {
  if (!text) return text;
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

// Remove Qwen-only /no_think directive — other models don't understand it and return empty
function makePromptModelSafe(prompt, model) {
  if (!model.toLowerCase().includes('qwen')) {
    return prompt.replace(/^\/no_think\s*/i, '').trim();
  }
  return prompt;
}

// Pre-warm document index on startup
(async () => {
  try {
    await getDocumentIndex();
  } catch (e) {
    console.warn('[ReactionService] Could not pre-warm document vector index:', e.message);
  }
})();

// ── Main service ───────────────────────────────────────────────────────────────

const analyzeReaction = async (reaction) => {
  if (!reaction || !reaction.trim()) {
    throw new Error('Reaction string is required and must not be empty.');
  }

  const [classification, ragContext] = await Promise.all([
    classifyReaction(reaction),
    buildRagContext(reaction),
  ]);
  console.log(`[Router] "${reaction}" → ${classification.category} (${classification.explanation})`);

  // ── Route primary API key by reaction category ─────────────────────────────
  let primaryApiKey = process.env.GROQ_API_KEY;
  if (classification.category === 'ORGANIC') {
    primaryApiKey = process.env.GROQ_API_KEY_ORGANIC || primaryApiKey;
  } else if (classification.category === 'COMBUSTION' || classification.category === 'COMBINATION') {
    primaryApiKey = process.env.GROQ_API_KEY_COMBUSTION || primaryApiKey;
  } else {
    primaryApiKey = process.env.GROQ_API_KEY_INORGANIC || primaryApiKey;
  }

  if (!primaryApiKey) {
    throw new Error('No Groq API key configured. Please set GROQ_API_KEY in your .env file.');
  }

  // ── Fallback uses a DIFFERENT API key ──────────────────────────────────────
  // When the primary key's OTPM budget is exhausted, the fallback uses a fresh
  // key with its own rate-limit bucket so it isn't blocked too.
  const allKeys = [
    process.env.GROQ_API_KEY_ORGANIC,
    process.env.GROQ_API_KEY_INORGANIC,
    process.env.GROQ_API_KEY_COMBUSTION,
    process.env.GROQ_API_KEY,
  ].filter(Boolean);
  const fallbackApiKey = allKeys.find(k => k !== primaryApiKey) || primaryApiKey;

  const primaryGroq  = new OpenAI({ apiKey: primaryApiKey,  baseURL: GROQ_BASE_URL });
  const fallbackGroq = new OpenAI({ apiKey: fallbackApiKey, baseURL: GROQ_BASE_URL });

  const domainLabel = classification.category === 'ORGANIC' ? 'ORGANIC'
    : (classification.category === 'COMBUSTION' || classification.category === 'COMBINATION' ? 'COMBUSTION' : 'INORGANIC');
  console.log(`[Router] API Key Domain: ${domainLabel} | Fallback key: ${fallbackApiKey === primaryApiKey ? 'same (only one key available)' : 'different ✓'}`);
  console.log(`[RAG] Document context: ${ragContext.hasDocumentContext
    ? `✓ Found (score: ${ragContext.topScore.toFixed(3)}, chunks: ${ragContext.retrievedChunks.length})`
    : '✗ No match — using LLM knowledge only'}`);

  const userMessage = `Analyze and generate the full mechanism for this chemical reaction:
"${reaction}"
If this is a reaction name or description (e.g. "Grignard Reaction", "E1 elimination", "SN2"), identify the specific reactants and equation first.
IMPORTANT: The chemistry document excerpts provided in your system prompt describe the EXACT mechanism for this or similar reactions. Use those atom IDs, bond patterns, and mechanism steps as your blueprint.
Return ONLY valid JSON. No markdown fences. No explanation outside JSON.`;

  const messages = [
    { role: 'system', content: ragContext.systemPrompt },
    { role: 'user',   content: userMessage },
  ];

  // Apply model-specific prompt safety per attempt
  const getSafeMessages = (model) => messages.map((m, i) =>
    i === 0 ? { ...m, content: makePromptModelSafe(m.content, model) } : m
  );

  const MAX_ATTEMPTS = 3;
  let parsed      = null;
  let attempts    = 0;
  let activeModel = PRIMARY_MODEL;
  let activeGroq  = primaryGroq;
  const reflectionLogs = [];

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`[Agent: Specialist] Attempt ${attempts}/${MAX_ATTEMPTS} — model: ${activeModel}`);
    let rawContent;
    try {
      const completion = await activeGroq.chat.completions.create({
        model:       activeModel,
        temperature: attempts === 1 ? 0 : 0.15,
        // qwen/qwen3.8-27b on-demand OTPM limit = 1000 tokens/min; stay under it.
        // Fallback model gets a larger budget from its separate key.
        max_tokens:  activeModel === PRIMARY_MODEL ? 1000 : 2500,
        messages:    getSafeMessages(activeModel),
      });

      const msg = completion.choices?.[0]?.message;
      // Strip <think>...</think> blocks — Qwen3 thinking model may leak them
      rawContent = cleanModelOutput(msg?.content?.trim());

      if (!rawContent) {
        if (activeModel !== FALLBACK_MODEL) {
          console.warn(`[Agent: Specialist] ⚠ Empty response from "${activeModel}" — switching to fallback "${FALLBACK_MODEL}" (separate key)...`);
          activeModel = FALLBACK_MODEL;
          activeGroq  = fallbackGroq;
          attempts--;
          continue;
        }
        throw new Error('Both primary and fallback models returned empty responses. The API keys may be rate-limited. Please wait a moment and try again.');
      }

    } catch (apiError) {
      // 429 / OTPM exhausted → switch to fallback with a different key
      if (is429RateLimit(apiError) && activeModel !== FALLBACK_MODEL) {
        console.warn(`[Agent: Specialist] ⚠ 429 on "${activeModel}" — switching to "${FALLBACK_MODEL}" with separate API key...`);
        activeModel = FALLBACK_MODEL;
        activeGroq  = fallbackGroq;
        attempts--;
        continue;
      }
      throw new Error(`Groq API request failed: ${apiError.message}`);
    }

    // ── JSON parse ─────────────────────────────────────────────────────────────
    try {
      const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/) || rawContent.match(/```\n([\s\S]*?)\n```/);
      const cleanContent = jsonMatch ? jsonMatch[1] : rawContent;
      parsed = JSON.parse(cleanContent);
    } catch (parseError) {
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error(`Model returned invalid JSON after ${MAX_ATTEMPTS} attempts.`);
      }
      messages.push({ role: 'assistant', content: rawContent });
      messages.push({ role: 'user', content: '[Critic] Your response was not valid JSON. Return ONLY a raw JSON object, no markdown.' });
      continue;
    }

    parsed._category = classification.category;

    // ── Mechanism validation ───────────────────────────────────────────────────
    const validation = validateMechanism(parsed);
    if (validation.valid) {
      console.log(`[Agent: Critic] ✓ Mechanism valid on attempt ${attempts}.${attempts > 1 ? ' (Self-corrected)' : ''}`);
      break;
    }
    console.warn(`[Agent: Critic] Attempt ${attempts} failed: ${validation.errors.join('; ')}`);
    reflectionLogs.push({ attempt: attempts, errors: validation.errors });
    if (attempts >= MAX_ATTEMPTS) {
      console.warn('[Agent: Critic] Using best-effort result after max attempts.');
      parsed._validationWarnings = validation.errors;
      break;
    }
    messages.push({ role: 'assistant', content: rawContent });
    messages.push({
      role: 'user',
      content: `[Critic Agent Feedback] Your mechanism has these errors:\n${validation.errors.map(e => `• ${e}`).join('\n')}\n\nFix ALL errors. Atom IDs in steps.targets must match atoms defined in reactants. Return corrected JSON only.`,
    });
  }

  // ── Parallel post-processing ───────────────────────────────────────────────
  try {
    const [pubchemResult, jeeQuestions] = await Promise.all([
      Promise.race([
        validateWithPubChem(parsed),
        new Promise(resolve => setTimeout(() => resolve({ warnings: ['PubChem timed out'], enrichments: {} }), 3000)),
      ]).catch(err => {
        console.warn(`[PubChem] Error: ${err.message}`);
        return { warnings: ['PubChem lookup unavailable'], enrichments: {} };
      }),
      generateJeeQuestions(reaction, parsed).catch(err => {
        console.warn(`[JEE] Error: ${err.message}`);
        return [];
      }),
    ]);

    parsed._pubchem = {
      verified:    pubchemResult.warnings?.length === 0,
      warnings:    pubchemResult.warnings   || [],
      enrichments: pubchemResult.enrichments || {},
    };
    parsed._pubchem.warnings.forEach(w => console.log(`  [PubChem] ⚠ ${w}`));
    if (parsed._pubchem.warnings.length === 0) console.log('[PubChem] ✓ All molecules verified.');

    parsed.jeeQuestions = jeeQuestions;
    console.log(`[JEE] Generated ${jeeQuestions?.length || 0} question(s).`);
  } catch (err) {
    console.error(`[ParallelTasks] Critical error: ${err.message}`);
    if (!parsed._pubchem)     parsed._pubchem     = { verified: false, warnings: [], enrichments: {} };
    if (!parsed.jeeQuestions) parsed.jeeQuestions = [];
  }

  parsed._agentTrace = {
    attempts,
    selfCorrected:          attempts > 1,
    reflections:            reflectionLogs,
    routerCategory:         classification.category,
    ragUsed:                ragContext.hasDocumentContext,
    ragTopScore:            ragContext.topScore,
    ragChunksFound:         ragContext.retrievedChunks.length,
    ragSources:             ragContext.retrievedChunks.map(c => c.source),
    pubchemVerified:        parsed._pubchem?.verified || false,
    jeeQuestionCount:       parsed.jeeQuestions?.length || 0,
    modelUsed:              activeModel,
    modelFallbackTriggered: activeModel !== PRIMARY_MODEL,
    timestamp:              new Date().toISOString(),
  };
  return parsed;
};

module.exports = { analyzeReaction };
