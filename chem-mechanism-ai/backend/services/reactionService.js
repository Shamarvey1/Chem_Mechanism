
const OpenAI = require('openai');
const { validateMechanism }  = require('./mechanismValidator');
const { classifyReaction }   = require('./reactionClassifier');
const { validateWithPubChem } = require('./pubchemValidator');
const { generateJeeQuestions } = require('./jeeQuestionGenerator');
const { buildRagContext }    = require('./ragService');
const { getDocumentIndex }   = require('./documentIngestionAgent');
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
(async () => {
  try {
    await getDocumentIndex();
  } catch (e) {
    console.warn('[ReactionService] Could not pre-warm document vector index:', e.message);
  }
})();
const analyzeReaction = async (reaction) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in the environment variables.');
  }
  if (!reaction || !reaction.trim()) {
    throw new Error('Reaction string is required and must not be empty.');
  }
  const groq = new OpenAI({
    apiKey:  process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  const classification = await classifyReaction(reaction);
  console.log(`[Router] "${reaction}" → ${classification.category} (${classification.explanation})`);
  const ragContext = await buildRagContext(reaction);
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
  const reflectionLogs = [];
  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`[Agent: Specialist] Generating mechanism (Attempt ${attempts}/${MAX_ATTEMPTS})...`);
    let rawContent;
    try {
      const completion = await groq.chat.completions.create({
        model:  MODEL,
        temperature: attempts === 1 ? 0 : 0.15,
        max_tokens: 8192,
        messages,
      });
      rawContent = completion.choices?.[0]?.message?.content?.trim();
      if (!rawContent) throw new Error('Groq returned an empty response.');
    } catch (apiError) {
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
      throw new Error(`Mechanism validation failed after ${MAX_ATTEMPTS} attempts: ${validation.errors.join('; ')}`);
    }

    messages.push({ role: 'assistant', content: rawContent });
    messages.push({
      role: 'user',
      content: `[Critic Agent Feedback] Your mechanism has these errors:\n${validation.errors.map(e => `• ${e}`).join('\n')}\n\nFix ALL errors. Atom IDs in steps.targets must match atoms defined in reactants. Return corrected JSON only.`,
    });
  }
  try {
    const pubchemResult = await validateWithPubChem(parsed);
    parsed._pubchem = {
      verified: pubchemResult.warnings.length === 0,
      warnings: pubchemResult.warnings,
      enrichments: pubchemResult.enrichments,
    };
    if (pubchemResult.warnings.length > 0) {
      pubchemResult.warnings.forEach(w => console.log(`  [PubChem] ⚠ ${w}`));
    } else {
      console.log(`[PubChem] ✓ All molecules verified.`);
    }
  } catch (pubchemErr) {
    parsed._pubchem = { verified: false, warnings: ['PubChem lookup unavailable'], enrichments: {} };
  }
  try {
    parsed.jeeQuestions = await generateJeeQuestions(reaction, parsed);
    console.log(`[JEE] Generated ${parsed.jeeQuestions?.length || 0} question(s).`);
  } catch (jeeErr) {
    console.warn(`[JEE] Error: ${jeeErr.message}`);
    parsed.jeeQuestions = [];
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
    timestamp: new Date().toISOString(),
  };
  return parsed;
};
module.exports = { analyzeReaction };
