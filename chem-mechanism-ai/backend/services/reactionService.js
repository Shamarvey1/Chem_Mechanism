const OpenAI = require('openai');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `You are an expert organic chemistry tutor specializing in reaction mechanisms.

When given a chemical reaction, you will:
1. Identify the reaction type (e.g., SN2, SN1, E2, addition, elimination, etc.)
2. List all reactants with their chemical roles (nucleophile, electrophile, base, etc.)
3. List all products
4. Explain the mechanism step by step

You MUST return ONLY a single valid JSON object. No markdown. No explanation outside the JSON. No code fences. No triple backticks.

The JSON must match this exact structure:
{
  "reaction": {
    "input": "<the original reaction string>",
    "type": "<reaction type>"
  },
  "reactants": [
    { "name": "<name>", "formula": "<formula>", "role": "<role>" }
  ],
  "products": [
    { "name": "<name>", "formula": "<formula>" }
  ],
  "steps": [
    {
      "step": <number>,
      "action": "<short action title>",
      "explanation": "<clear, beginner-friendly explanation>"
    }
  ]
}`;

const analyzeReaction = async (reaction) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in the environment variables.');
  }

  if (!reaction || !reaction.trim()) {
    throw new Error('Reaction string is required and must not be empty.');
  }

  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const userMessage = `Analyze this chemical reaction and return the mechanism as JSON:\n\n${reaction}`;

  let rawContent;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
    });

    rawContent = completion.choices[0].message.content.trim();
  } catch (apiError) {
    throw new Error(`Groq API request failed: ${apiError.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (parseError) {
    throw new Error(
      `Model returned invalid JSON. Raw response was:\n${rawContent}`
    );
  }

  return parsed;
};

module.exports = { analyzeReaction };
