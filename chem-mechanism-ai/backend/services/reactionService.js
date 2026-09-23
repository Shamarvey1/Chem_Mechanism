const OpenAI = require('openai');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `You are an expert organic chemistry tutor specializing in reaction mechanisms.

When given a chemical reaction:
1. Identify the reaction type (SN2, SN1, E2, addition, elimination, etc.)
2. List all reactants (id, name, formula)
3. List all products (id, name, formula)
4. Explain the mechanism step by step.

Mechanism action rules:
- NUCLEOPHILE_ATTACK: targets must contain only "nucleophile_atom" and "electrophile_atom"
- BOND_BREAK: targets must contain only "bond"
- ELECTRON_PAIR_MOVE: targets must contain only "from_bond" and "to_atom"
- BOND_FORM: targets must contain only "atom1", "atom2", and "order" (number)
- PROTON_TRANSFER: targets must contain only "from_atom" and "to_atom"

Do NOT include irrelevant target fields in a step.

For CH3Br + OH- -> CH3OH + Br-:
- Step 1: NUCLEOPHILE_ATTACK (nucleophile_atom: "O1", electrophile_atom: "C1")
- Step 2: BOND_BREAK (bond: "C1-Br1")
- Step 3: ELECTRON_PAIR_MOVE (from_bond: "C1-Br1", to_atom: "Br1")
- Step 4: BOND_FORM (atom1: "C1", atom2: "O1", order: 1)`;

const MECHANISM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['reaction', 'reactants', 'products', 'steps'],
  properties: {
    reaction: {
      type: 'object',
      additionalProperties: false,
      required: ['input', 'type'],
      properties: {
        input: { type: 'string' },
        type: { type: 'string' },
      },
    },

    reactants: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'formula'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          formula: { type: 'string' },
        },
      },
    },

    products: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'formula'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          formula: { type: 'string' },
        },
      },
    },

    steps: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['step', 'action', 'targets', 'explanation'],
            properties: {
              step: { type: 'number' },
              action: { type: 'string', enum: ['NUCLEOPHILE_ATTACK'] },
              targets: {
                type: 'object',
                additionalProperties: false,
                required: ['nucleophile_atom', 'electrophile_atom'],
                properties: {
                  nucleophile_atom: { type: 'string' },
                  electrophile_atom: { type: 'string' },
                },
              },
              explanation: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['step', 'action', 'targets', 'explanation'],
            properties: {
              step: { type: 'number' },
              action: { type: 'string', enum: ['BOND_BREAK'] },
              targets: {
                type: 'object',
                additionalProperties: false,
                required: ['bond'],
                properties: {
                  bond: { type: 'string' },
                },
              },
              explanation: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['step', 'action', 'targets', 'explanation'],
            properties: {
              step: { type: 'number' },
              action: { type: 'string', enum: ['ELECTRON_PAIR_MOVE'] },
              targets: {
                type: 'object',
                additionalProperties: false,
                required: ['from_bond', 'to_atom'],
                properties: {
                  from_bond: { type: 'string' },
                  to_atom: { type: 'string' },
                },
              },
              explanation: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['step', 'action', 'targets', 'explanation'],
            properties: {
              step: { type: 'number' },
              action: { type: 'string', enum: ['BOND_FORM'] },
              targets: {
                type: 'object',
                additionalProperties: false,
                required: ['atom1', 'atom2', 'order'],
                properties: {
                  atom1: { type: 'string' },
                  atom2: { type: 'string' },
                  order: { type: 'number' },
                },
              },
              explanation: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['step', 'action', 'targets', 'explanation'],
            properties: {
              step: { type: 'number' },
              action: { type: 'string', enum: ['PROTON_TRANSFER'] },
              targets: {
                type: 'object',
                additionalProperties: false,
                required: ['from_atom', 'to_atom'],
                properties: {
                  from_atom: { type: 'string' },
                  to_atom: { type: 'string' },
                },
              },
              explanation: { type: 'string' },
            },
          },
        ],
      },
    },
  },
};

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
      max_completion_tokens: 4096,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'chemical_reaction_mechanism',
          strict: true,
          schema: MECHANISM_SCHEMA,
        },
      },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
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
