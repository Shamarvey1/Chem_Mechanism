
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

// qwen/qwen3.8-27b on-demand OTPM limit = 1000 output tokens/min
// We set max_tokens just below this so the API doesn't reject the request.
// Fallback model uses a separate API key with its own OTPM budget → 2500 tokens.
const PRIMARY_MAX_TOKENS  = 950;
const FALLBACK_MAX_TOKENS = 2500;

// ── Helpers ─────────────────────────────────────────────────────────────────

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

// Qwen3 thinking model leaks <think>...</think> blocks into content — strip them
function cleanModelOutput(text) {
  if (!text) return text;
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

// /no_think is a Qwen-only directive — other models return empty when they see it
function makePromptModelSafe(prompt, model) {
  if (!model.toLowerCase().includes('qwen')) {
    return prompt.replace(/^\/no_think\s*/i, '').trim();
  }
  return prompt;
}

// Robust JSON extraction: handles markdown fences, leading/trailing text, and
// truncated JSON from models hitting their token limit.
function extractJSON(text) {
  if (!text) return null;

  // 1. Try direct parse first (cleanest case)
  try { return JSON.parse(text); } catch {}

  // 2. Try stripping markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]); } catch {}
  }

  // 3. Try finding the outermost JSON object (handles prose before/after)
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }

  // 4. If the JSON appears truncated (no closing brace), it means the model
  //    hit its token limit mid-output. Return null so the caller can switch
  //    to the fallback model with a higher token budget.
  return null;
}

// Pre-warm document index at startup
(async () => {
  try {
    await getDocumentIndex();
  } catch (e) {
    console.warn('[ReactionService] Could not pre-warm document index:', e.message);
  }
})();

// ── Main service ─────────────────────────────────────────────────────────────

const analyzeReaction = async (reaction) => {
  if (!reaction || !reaction.trim()) {
    throw new Error('Reaction string is required and must not be empty.');
  }

  const [classification, ragContext] = await Promise.all([
    classifyReaction(reaction),
    buildRagContext(reaction),
  ]);
  console.log(`[Router] "${reaction}" → ${classification.category} (${classification.explanation})`);

  // Route primary API key by reaction category
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

  // Fallback uses a DIFFERENT API key — separate OTPM budget so when the
  // primary key is exhausted the fallback can still make requests.
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
  console.log(`[Router] Domain: ${domainLabel} | Fallback key: ${fallbackApiKey === primaryApiKey ? 'same' : 'different ✓'}`);
  console.log(`[RAG] ${ragContext.hasDocumentContext
    ? `✓ Found (score: ${ragContext.topScore.toFixed(3)}, chunks: ${ragContext.retrievedChunks.length})`
    : '✗ No match — LLM knowledge only'}`);

  const userMessage = `Analyze and generate the full mechanism for this chemical reaction:
"${reaction}"
If this is a reaction name or abbreviation (e.g. "E2 elimination", "SN2", "Grignard"), identify specific real reactants first.
Return ONLY valid JSON matching the schema. No markdown. No explanation outside the JSON object.`;

  const messages = [
    { role: 'system', content: ragContext.systemPrompt },
    { role: 'user',   content: userMessage },
  ];

  const getSafeMessages = (model) => messages.map((m, i) =>
    i === 0 ? { ...m, content: makePromptModelSafe(m.content, model) } : m
  );

  // Helper: switch to fallback model + client
  const switchToFallback = (reason) => {
    console.warn(`[Agent: Specialist] ⚠ Switching to fallback "${FALLBACK_MODEL}" (separate key). Reason: ${reason}`);
    activeModel = FALLBACK_MODEL;
    activeGroq  = fallbackGroq;
  };

  const MAX_ATTEMPTS = 3;
  let parsed      = null;
  let attempts    = 0;
  let activeModel = PRIMARY_MODEL;
  let activeGroq  = primaryGroq;
  const reflectionLogs = [];

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    const maxTok = activeModel === PRIMARY_MODEL ? PRIMARY_MAX_TOKENS : FALLBACK_MAX_TOKENS;
    console.log(`[Agent: Specialist] Attempt ${attempts}/${MAX_ATTEMPTS} | model: ${activeModel} | max_tokens: ${maxTok}`);

    let rawContent;
    try {
      const completion = await activeGroq.chat.completions.create({
        model:       activeModel,
        temperature: attempts === 1 ? 0 : 0.15,
        max_tokens:  maxTok,
        messages:    getSafeMessages(activeModel),
      });

      const msg      = completion.choices?.[0]?.message;
      const finish   = completion.choices?.[0]?.finish_reason;
      rawContent     = cleanModelOutput(msg?.content?.trim());

      console.log(`[Agent: Specialist] finish_reason: ${finish} | content length: ${rawContent?.length || 0}`);

      // Empty response → switch to fallback
      if (!rawContent) {
        if (activeModel !== FALLBACK_MODEL) {
          switchToFallback('empty response');
          attempts--;
          continue;
        }
        throw new Error('Both models returned empty responses. The API may be rate-limited — please try again in a moment.');
      }

      // finish_reason=length means JSON was truncated by token limit
      // → switch to fallback which has a 2500-token budget
      if (finish === 'length' && activeModel !== FALLBACK_MODEL) {
        switchToFallback(`response truncated at ${maxTok} tokens (finish_reason=length)`);
        attempts--;
        continue;
      }

    } catch (apiError) {
      if (is429RateLimit(apiError) && activeModel !== FALLBACK_MODEL) {
        switchToFallback(`429 rate-limit: ${apiError.message}`);
        attempts--;
        continue;
      }
      throw new Error(`Groq API request failed: ${apiError.message}`);
    }

    // ── Robust JSON extraction ──────────────────────────────────────────────
    parsed = extractJSON(rawContent);

    if (!parsed) {
      // Could not extract any JSON → response was truncated or garbled
      if (activeModel !== FALLBACK_MODEL) {
        switchToFallback('could not extract valid JSON from response (likely truncated)');
        // Reset messages to original — don't carry corrupt content into fallback
        while (messages.length > 2) messages.pop();
        attempts--;
        continue;
      }
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error('Model returned invalid JSON after all attempts. Please try a more specific reaction name.');
      }
      // On fallback model, push corrective feedback and retry
      messages.push({ role: 'assistant', content: rawContent });
      messages.push({ role: 'user', content: 'Your response was not valid JSON. Return ONLY a raw JSON object starting with { and ending with }. No markdown fences. No explanation.' });
      continue;
    }

    parsed._category = classification.category;

    // ── Mechanism validation ────────────────────────────────────────────────
    const validation = validateMechanism(parsed);
    if (validation.valid) {
      console.log(`[Agent: Critic] ✓ Valid on attempt ${attempts}${attempts > 1 ? ' (self-corrected)' : ''}.`);
      break;
    }

    console.warn(`[Agent: Critic] Attempt ${attempts} invalid: ${validation.errors.join('; ')}`);
    reflectionLogs.push({ attempt: attempts, errors: validation.errors });

    if (attempts >= MAX_ATTEMPTS) {
      console.warn('[Agent: Critic] Using best-effort result.');
      parsed._validationWarnings = validation.errors;
      break;
    }

    messages.push({ role: 'assistant', content: rawContent });
    messages.push({
      role: 'user',
      content: `[Critic] Fix these errors:\n${validation.errors.map(e => `• ${e}`).join('\n')}\nEvery atom ID in steps.targets must exist in reactants. Return corrected JSON only.`,
    });
  }

  // ── Post-processing ─────────────────────────────────────────────────────
  try {
    const [pubchemResult, jeeQuestions] = await Promise.all([
      Promise.race([
        validateWithPubChem(parsed),
        new Promise(resolve => setTimeout(() => resolve({ warnings: ['PubChem timed out'], enrichments: {} }), 3000)),
      ]).catch(err => ({ warnings: [`PubChem error: ${err.message}`], enrichments: {} })),
      generateJeeQuestions(reaction, parsed).catch(err => {
        console.warn(`[JEE] ${err.message}`);
        return [];
      }),
    ]);

    parsed._pubchem = {
      verified:    pubchemResult.warnings?.length === 0,
      warnings:    pubchemResult.warnings   || [],
      enrichments: pubchemResult.enrichments || {},
    };
    pubchemResult.warnings?.forEach(w => console.log(`  [PubChem] ⚠ ${w}`));
    if (!pubchemResult.warnings?.length) console.log('[PubChem] ✓ Verified.');

    parsed.jeeQuestions = jeeQuestions;
    console.log(`[JEE] ${jeeQuestions?.length || 0} question(s) generated.`);
  } catch (err) {
    console.error(`[PostProcess] ${err.message}`);
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
