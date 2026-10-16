
const OpenAI = require('openai');
const { validateMechanism }  = require('./mechanismValidator');
const { classifyReaction }   = require('./reactionClassifier');
const { validateWithPubChem } = require('./pubchemValidator');
const { generateJeeQuestions } = require('./jeeQuestionGenerator');
const { buildRagContext }    = require('./ragService');
const { getDocumentIndex }   = require('./documentIngestionAgent');
const PRIMARY_MODEL  = process.env.GROQ_MODEL          || 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = process.env.GROQ_MODEL_FALLBACK  || 'llama-3.1-8b-instant';


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
(async () => {
  try {
    await getDocumentIndex();
  } catch (e) {
    console.warn('[ReactionService] Could not pre-warm document vector index:', e.message);
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

  let routedApiKey = process.env.GROQ_API_KEY; 
  if (classification.category === 'ORGANIC') {
    routedApiKey = process.env.GROQ_API_KEY_ORGANIC || routedApiKey;
  } else if (classification.category === 'COMBUSTION' || classification.category === 'COMBINATION') {
    routedApiKey = process.env.GROQ_API_KEY_COMBUSTION || routedApiKey;
  } else {
    routedApiKey = process.env.GROQ_API_KEY_INORGANIC || routedApiKey;
  }

  if (!routedApiKey) {
    throw new Error('No Groq API key configured. Please set GROQ_API_KEY in your .env file.');
  }

  const groq = new OpenAI({
    apiKey:  routedApiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  console.log(`[Router] Selected API Key Domain: ${classification.category === 'ORGANIC' ? 'ORGANIC' : (classification.category === 'COMBUSTION' || classification.category === 'COMBINATION' ? 'COMBUSTION' : 'INORGANIC')}`);
  console.log(`[RAG] Document context: ${ragContext.hasDocumentContext ? `✓ Found (score: ${ragContext.topScore.toFixed(3)}, chunks: ${ragContext.retrievedChunks.length})` : '✗ No match — using LLM knowledge only'}`);
  const userMessage = `Analyze and generate the full mechanism for this chemical reaction:
"${reaction}"
If this is a reaction name or description (e.g. "Grignard Reaction", "E1 elimination", "SN2"), identify the specific reactants and equation first.
IMPORTANT: The chemistry document excerpts provided in your system prompt describe the EXACT mechanism for this or similar reactions. Use those atom IDs, bond patterns, and mechanism steps as your blueprint.
Return ONLY valid JSON. No markdown fences. No explanation outside JSON.`;
  const messages = [
    { role: 'system', content: ragContext.systemPrompt },
    { role: 'user',   content: userMessage },
  ];
  const MAX_ATTEMPTS = 3;
  let parsed = null;
  let attempts = 0;
  let activeModel = PRIMARY_MODEL; // tracks which model is actually running
  const reflectionLogs = [];
  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`[Agent: Specialist] Generating mechanism (Attempt ${attempts}/${MAX_ATTEMPTS}) with model: ${activeModel}`);
    let rawContent;
    try {
      const completion = await groq.chat.completions.create({
        model:       activeModel,
        temperature: attempts === 1 ? 0 : 0.15,
        max_tokens:  2500,
        messages,
      });
      let msg = completion.choices?.[0]?.message;
      rawContent = msg?.content?.trim();
      if (!rawContent) throw new Error('Groq returned an empty response.');
    } catch (apiError) {

      if (is429RateLimit(apiError) && activeModel !== FALLBACK_MODEL) {
        console.warn(`[Agent: Specialist] ⚠ 429 rate-limit on "${activeModel}". Switching to fallback model "${FALLBACK_MODEL}" and retrying...`);
        activeModel = FALLBACK_MODEL;
        attempts--; 
        continue;
      }
      throw new Error(`Groq API request failed: ${apiError.message}`);
    }
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
   
    const validation = validateMechanism(parsed);
    if (validation.valid) {
      console.log(`[Agent: Critic] ✓ Mechanism valid on attempt ${attempts}.${attempts > 1 ? ' (Self-corrected)' : ''}`);
      break;
    }
    console.warn(`[Agent: Critic] Attempt ${attempts} failed: ${validation.errors.join('; ')}`);
    reflectionLogs.push({ attempt: attempts, errors: validation.errors });
    if (attempts >= MAX_ATTEMPTS) {
      console.warn(`[Agent: Critic] Using best-effort result after ${MAX_ATTEMPTS} attempts. Errors: ${validation.errors.join('; ')}`);
      parsed._validationWarnings = validation.errors;
      break;
    }

    messages.push({ role: 'assistant', content: rawContent });
    messages.push({
      role: 'user',
      content: `[Critic Agent Feedback] Your mechanism has these errors:\n${validation.errors.map(e => `• ${e}`).join('\n')}\n\nFix ALL errors. Atom IDs in steps.targets must match atoms defined in reactants. Return corrected JSON only.`,
    });
  }
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
      })
    ]);

    parsed._pubchem = {
      verified: pubchemResult.warnings?.length === 0,
      warnings: pubchemResult.warnings || [],
      enrichments: pubchemResult.enrichments || {},
    };
    if (parsed._pubchem.warnings.length > 0) {
      parsed._pubchem.warnings.forEach(w => console.log(`  [PubChem] ⚠ ${w}`));
    } else {
      console.log(`[PubChem] ✓ All molecules verified.`);
    }

    parsed.jeeQuestions = jeeQuestions;
    console.log(`[JEE] Generated ${jeeQuestions?.length || 0} question(s).`);
  } catch (err) {
    console.error(`[ParallelTasks] Critical error: ${err.message}`);
    if (!parsed._pubchem) parsed._pubchem = { verified: false, warnings: [], enrichments: {} };
    if (!parsed.jeeQuestions) parsed.jeeQuestions = [];
  }
  parsed._agentTrace = {
    attempts,
    selfCorrected: attempts > 1,
    reflections: reflectionLogs,
    routerCategory: classification.category,
    ragUsed: ragContext.hasDocumentContext,
    ragTopScore: ragContext.topScore,
    ragChunksFound: ragContext.retrievedChunks.length,
    ragSources: ragContext.retrievedChunks.map(c => c.source),
    pubchemVerified: parsed._pubchem?.verified || false,
    jeeQuestionCount: parsed.jeeQuestions?.length || 0,
    modelUsed: activeModel,
    modelFallbackTriggered: activeModel !== PRIMARY_MODEL,
    timestamp: new Date().toISOString(),
  };
  return parsed;
};
module.exports = { analyzeReaction };
