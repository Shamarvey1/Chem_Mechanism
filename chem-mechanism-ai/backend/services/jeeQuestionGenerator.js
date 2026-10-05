const path = require('path');
const OpenAI = require('openai');
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
let QUESTION_BANK = [];
try {
  QUESTION_BANK = require(path.join(__dirname, '../data/jeeQuestionBank.json'));
} catch (err) {
  console.warn('[JEE Generator] Could not load jeeQuestionBank.json:', err.message);
  QUESTION_BANK = [];
}
let _client = null;
const getClient = () => {
  if (!_client) {
    _client = new OpenAI({
      baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return _client;
};
const JEE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'examType', 'topic', 'difficulty', 'question', 'options', 'correctAnswer', 'explanation', 'conceptTested'],
        properties: {
          id: { type: 'string' },
          examType: { type: 'string', enum: ['JEE Main', 'JEE Advanced'] },
          examCitation: { type: 'string' },
          topic: { type: 'string' },
          difficulty: { type: 'string', enum: ['Moderate', 'Challenging', 'Advanced'] },
          question: { type: 'string' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['key', 'text'],
              properties: {
                key: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
                text: { type: 'string' },
              },
            },
          },
          correctAnswer: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
          explanation: { type: 'string' },
          conceptTested: { type: 'string' },
        },
      },
    },
  },
};
function findQuestionsFromBank(reactionInput, category, reactionData) {
  if (!Array.isArray(QUESTION_BANK) || QUESTION_BANK.length === 0) {
    return [];
  }
  const normInput = (reactionInput || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const normCategory = (category || '').toLowerCase();
  // Extract formula tokens and molecule names
  const reactantTokens = (reactionData?.reactants || []).flatMap(r => [
    (r.name || '').toLowerCase(),
    (r.formula || '').toLowerCase()
  ]).filter(Boolean);
  const productTokens = (reactionData?.products || []).flatMap(p => [
    (p.name || '').toLowerCase(),
    (p.formula || '').toLowerCase()
  ]).filter(Boolean);
  const allTokens = new Set([
    ...normInput.split(/\s+/).filter(t => t.length > 1),
    normCategory,
    ...reactantTokens,
    ...productTokens
  ]);
  const scored = [];
  for (const q of QUESTION_BANK) {
    const tags = (q.tags || []).map(t => t.toLowerCase());
    let score = 0;
    for (const tag of tags) {
      if (allTokens.has(tag)) {
        score += 3;
      } else if (normInput.includes(tag)) {
        score += 2;
      }
    }
    if (score >= 3) {
      scored.push({
        question: {
          ...q,
          source: 'QUESTION_BANK',
        },
        score,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.question);
}
function getFallbackJeeQuestions(reactionInput, category) {
  const norm = (reactionInput || '').toLowerCase();
  if (norm.includes('naoh') && norm.includes('hcl')) {
    return QUESTION_BANK.filter(q => q.tags?.includes('naoh') && q.tags?.includes('hcl')).slice(0, 3);
  }
  if (category === 'ORGANIC' || norm.includes('sn2') || norm.includes('ch3br')) {
    return QUESTION_BANK.filter(q => q.tags?.includes('sn2')).slice(0, 3);
  }
  return QUESTION_BANK.slice(0, 2);
}
async function generateJeeQuestions(reactionInput, reactionData) {
  const category = reactionData?._category || reactionData?.reaction?.type || 'GENERAL';
  const bankMatches = findQuestionsFromBank(reactionInput, category, reactionData);
  if (bankMatches && bankMatches.length >= 2) {
    console.log(`[JEE Bank] ⚡ Retrieved ${bankMatches.length} authentic JEE PYQ(s) from Question Bank for "${reactionInput}"`);
    return bankMatches;
  }
  console.log(`[JEE Generator] Generating dynamic JEE questions via LLM for "${reactionInput}"...`);
  const steps = reactionData?.steps || [];
  const reactants = (reactionData?.reactants || []).map(r => `${r.name} (${r.formula})`).join(' + ');
  const products = (reactionData?.products || []).map(p => `${p.name} (${p.formula})`).join(' + ');
  const mechanismSummary = steps.map(s => `Step ${s.step}: ${s.action} - ${s.explanation}`).join('\n');
  try {
    const client = getClient();
    const systemPrompt = `You are an elite Indian Institute of Technology (IIT-JEE) Chemistry question setter with deep expertise in JEE Main and JEE Advanced syllabus.
Your task is to generate 2 to 3 highly relevant, authentic JEE questions specifically testing the chemistry, mechanism, stereochemistry, reagents, or kinetics of the chemical reaction provided.
REQUIREMENTS:
1. Every question must directly connect to the given reaction and its mechanism steps:
   - 1 JEE Main question: Conceptual / rate law / intermediate / identifying reagent / enthalpy.
   - 1-2 JEE Advanced questions: Multi-concept reasoning, stereochemistry (inversion/retention), carbocation/carbanion stability, solvent effect, electron pushing / curved arrow mechanism, or conductometric/kinetic behavior.
2. Provide exactly 4 clear options (A, B, C, D) for each question. Only ONE option must be correct.
3. Include an in-depth, pedagogical explanation explaining WHY the correct option is right, and pointing out the common pitfalls students fall into.
4. Output ONLY valid JSON adhering to the specified schema. No markdown, no prose outside the JSON.`;
    const userPrompt = `Generate JEE questions for this reaction:
Reaction Input: "${reactionInput}"
Category: ${category}
Reactants: ${reactants || 'N/A'}
Products: ${products || 'N/A'}
Mechanism Steps:
${mechanismSummary || 'N/A'}`;
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      max_completion_tokens: 3000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'jee_questions_schema',
          strict: true,
          schema: JEE_SCHEMA,
        },
      },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });
    const raw = completion.choices?.[0]?.message?.content?.trim();
    if (!raw) {
      console.warn('[JEE Generator] Empty response from model, using bank fallbacks.');
      return getFallbackJeeQuestions(reactionInput, category);
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed.questions.map(q => ({ ...q, source: 'AI_GENERATED' }));
    }
    return getFallbackJeeQuestions(reactionInput, category);
  } catch (err) {
    console.warn(`[JEE Generator] Failed to generate dynamic JEE questions (${err.message}). Using bank fallbacks.`);
    return getFallbackJeeQuestions(reactionInput, category);
  }
}
module.exports = { generateJeeQuestions, findQuestionsFromBank, getFallbackJeeQuestions };
