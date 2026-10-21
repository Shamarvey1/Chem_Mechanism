const OpenAI = require('openai');
const { validateMechanism }   = require('./mechanismValidator');
const { classifyReaction }    = require('./reactionClassifier');
const { validateWithPubChem } = require('./pubchemValidator');
const { generateJeeQuestions } = require('./jeeQuestionGenerator');
const { buildRagContext }     = require('./ragService');
const { getDocumentIndex }    = require('./documentIngestionAgent');

const PRIMARY_MODEL  = process.env.GROQ_MODEL         || 'openai/gpt-oss-20b';
const FALLBACK_MODEL = process.env.GROQ_MODEL_FALLBACK || 'qwen/qwen3.8-27b';
const GROQ_BASE_URL  = 'https://api.groq.com/openai/v1';

function getModelMaxTokens(model) {
  const m = (model || '').toLowerCase();
  if (m.includes('qwen')) {
    // qwen on-demand has a strict 1000 OTPM limit
    return 950;
  }
  // gpt-oss-20b has an 8000 TPM limit
  return 3500;
}

function is429RateLimit(err) {
  const msg = (err?.message || '').toLowerCase();
  return (
    err?.status === 429 ||
    msg.includes('429') ||
    msg.includes('rate_limit') ||
    msg.includes('request too large') ||
    msg.includes('otpm') ||
    msg.includes('tpm') ||
    msg.includes('tokens per minute')
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanModelOutput(text) {
  if (!text) return text;
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();
}

function makePromptModelSafe(prompt, model) {
  if (!model.toLowerCase().includes('qwen')) {
    return prompt.replace(/^\/no_think\s*/i, '').trim();
  }
  return prompt;
}

function extractJSON(text) {
  if (!text) return null;

  // 1. Direct parse (cleanest path)
  try { return JSON.parse(text); } catch {}

  // 2. Strip markdown fences ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]); } catch {}
  }

  // 3. Find outermost { ... } — handles prose before/after JSON
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }

  // 4. Trailing commas repair
  if (start !== -1 && end > start) {
    try {
      const repaired = text.slice(start, end + 1).replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(repaired);
    } catch {}
  }

  return null;
}

// Check mechanism has both bond breaking/abstraction and bond forming steps
function isCompleteMechanism(parsed) {
  const steps = parsed?.steps;
  if (!Array.isArray(steps) || steps.length === 0) return false;
  const actions = steps.map(s => (s.action || '').toUpperCase());
  const hasBreak = actions.some(a =>
    a === 'BOND_BREAK' || a === 'BASE_ABSTRACTION' || a === 'OXIDATION_REDUCTION'
  );
  const hasForm = actions.some(a =>
    a === 'BOND_FORM' || a === 'NUCLEOPHILE_ATTACK' || a === 'ELECTROPHILE_ATTACK'
  );
  return hasBreak && hasForm;
}

(async () => {
  try {
    await getDocumentIndex();
  } catch (e) {
    console.warn('[ReactionService] Could not pre-warm document index:', e.message);
  }
})();

const analyzeReaction = async (reaction) => {
  if (!reaction || !reaction.trim()) {
    throw new Error('Reaction string is required and must not be empty.');
  }

  const [classification, ragContext] = await Promise.all([
    classifyReaction(reaction),
    buildRagContext(reaction),
  ]);
  console.log(`[Router] "${reaction}" → ${classification.category} (${classification.explanation})`);

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

  const allKeys = [
    process.env.GROQ_API_KEY_ORGANIC,
    process.env.GROQ_API_KEY_INORGANIC,
    process.env.GROQ_API_KEY_COMBUSTION,
    process.env.GROQ_API_KEY,
  ].filter(Boolean);

  // Fallback key: pick an alternate key if possible to guarantee fresh TPM bucket
  const fallbackApiKey = allKeys.find(k => k !== primaryApiKey) || primaryApiKey;

  const primaryGroq  = new OpenAI({ apiKey: primaryApiKey,  baseURL: GROQ_BASE_URL });
  const fallbackGroq = new OpenAI({ apiKey: fallbackApiKey, baseURL: GROQ_BASE_URL });

  const domainLabel = classification.category === 'ORGANIC' ? 'ORGANIC'
    : (classification.category === 'COMBUSTION' || classification.category === 'COMBINATION' ? 'COMBUSTION' : 'INORGANIC');
  console.log(`[Router] Domain: ${domainLabel} | Model: ${PRIMARY_MODEL} | Fallback key: ${fallbackApiKey === primaryApiKey ? 'same' : 'different ✓'}`);
  console.log(`[RAG] ${ragContext.hasDocumentContext
    ? `✓ Found (score: ${ragContext.topScore.toFixed(3)}, chunks: ${ragContext.retrievedChunks.length})`
    : '✗ No match — LLM knowledge only'}`);

  const userMessage = `Analyze and generate the full mechanism for this chemical reaction:
"${reaction}"
If this is a reaction name or abbreviation (e.g. "E2 elimination", "SN2", "Grignard"), identify specific real reactants first.
Return ONLY valid JSON matching the schema. No markdown. No explanation outside the JSON object.`;

  const baseMessages = [
    { role: 'system', content: ragContext.systemPrompt },
    { role: 'user',   content: userMessage },
  ];

  let messages = [...baseMessages];

  const getSafeMessages = (model, msgs) => msgs.map((m, i) =>
    i === 0 ? { ...m, content: makePromptModelSafe(m.content, model) } : m
  );

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
    const maxTok = getModelMaxTokens(activeModel);
    console.log(`[Agent: Specialist] Attempt ${attempts}/${MAX_ATTEMPTS} | model: ${activeModel} | max_tokens: ${maxTok}`);

    let rawContent;
    try {
      const requestParams = {
        model:       activeModel,
        temperature: attempts === 1 ? 0 : 0.15,
        max_tokens:  maxTok,
        messages:    getSafeMessages(activeModel, messages),
      };

      if (activeModel.toLowerCase().includes('gpt-oss')) {
        // Enforce low reasoning effort so reasoning tokens do not consume JSON budget
        requestParams.reasoning_effort = 'low';
      }

      const completion = await activeGroq.chat.completions.create(requestParams);
      const msg        = completion.choices?.[0]?.message;
      const finish     = completion.choices?.[0]?.finish_reason;
      rawContent       = cleanModelOutput(msg?.content?.trim());

      console.log(`[Agent: Specialist] finish_reason: ${finish} | content length: ${rawContent?.length || 0}`);

      if (!rawContent) {
        if (activeModel !== FALLBACK_MODEL) {
          switchToFallback('empty response');
          messages = [...baseMessages];
          attempts--;
          continue;
        }
        throw new Error('Both models returned empty responses. The API may be rate-limited — please try again in a moment.');
      }

      if (finish === 'length') {
        if (activeModel !== FALLBACK_MODEL) {
          switchToFallback(`response truncated at ${maxTok} tokens (finish_reason=length)`);
          messages = [...baseMessages];
          attempts--;
          continue;
        } else {
          console.warn(`[Agent: Specialist] ⚠ Fallback hit token limit (${maxTok}). Retrying with concise prompt.`);
        }
      }

    } catch (apiError) {
      if (is429RateLimit(apiError)) {
        if (activeModel !== FALLBACK_MODEL) {
          console.warn(`[Agent: Specialist] ⚠ 429 on "${activeModel}" — waiting 2s and switching to fallback...`);
          await sleep(2000);
          switchToFallback(`429 rate-limit: ${apiError.message}`);
          messages = [...baseMessages];
          attempts--;
          continue;
        } else {
          console.warn(`[Agent: Specialist] ⚠ 429 on fallback — waiting 3.5s for token reset...`);
          await sleep(3500);
          messages = [...baseMessages];
          continue;
        }
      }
      throw new Error(`Groq API request failed: ${apiError.message}`);
    }

    parsed = extractJSON(rawContent);

    if (!parsed) {
      if (activeModel !== FALLBACK_MODEL) {
        switchToFallback('could not extract valid JSON (truncated or garbled)');
        messages = [...baseMessages];
        attempts--;
        continue;
      }
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error('Model returned invalid JSON after all attempts. Please try a more specific reaction name.');
      }
      // Reset messages to clean prompt instead of carrying broken truncated assistant text
      messages = [
        ...baseMessages,
        {
          role: 'user',
          content: 'The previous response was not valid JSON. Return ONLY a single raw JSON object starting with { and ending with }. No markdown fences. Ensure all quotes and braces are properly closed.'
        }
      ];
      continue;
    }

    // Check mechanism completeness: ensure both bond breaking and product bond forming steps exist
    if (!isCompleteMechanism(parsed)) {
      console.warn(`[Agent: Specialist] ⚠ Mechanism has ${parsed?.steps?.length || 0} steps but is missing BOND_FORM or BOND_BREAK.`);
      if (activeModel !== FALLBACK_MODEL) {
        switchToFallback(`incomplete mechanism (${parsed?.steps?.length || 0} steps)`);
        messages = [...baseMessages];
        parsed = null;
        attempts--;
        continue;
      }
      if (attempts < MAX_ATTEMPTS) {
        messages = [
          ...baseMessages,
          {
            role: 'user',
            content: `[Critic] The mechanism is incomplete — it has ${parsed?.steps?.length || 0} steps but is missing product BOND_FORM steps. Products like CO2 and H2O must be formed by explicit BOND_FORM steps. You MUST include ALL steps from reactants to final products. Return complete corrected JSON.`
          }
        ];
        parsed = null;
        continue;
      }
    }

    parsed._category = classification.category;

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

    messages = [
      ...baseMessages,
      { role: 'assistant', content: rawContent },
      {
        role: 'user',
        content: `[Critic] Fix these errors:\n${validation.errors.map(e => `• ${e}`).join('\n')}\nEvery atom ID in steps.targets must exist in reactants. Return corrected JSON only.`,
      }
    ];
  }

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
