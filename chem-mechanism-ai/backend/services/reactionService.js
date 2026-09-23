const OpenAI = require('openai');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `You are an expert organic chemistry tutor specializing in reaction mechanisms.

When given a chemical reaction:
1. Identify the reaction type (SN2, SN1, E2, addition, elimination, etc.)
2. List all reactants with atoms, bonds, and chemical roles
3. List all products with atoms and bonds
4. Explain the mechanism step by step using these action types only:
   NUCLEOPHILE_ATTACK, BOND_BREAK, BOND_FORM, ELECTRON_PAIR_MOVE, PROTON_TRANSFER

Atom ID rules:
- Use C1, C2 for carbons; Br1 for bromine; O1 for oxygen; H1, H2, H3 for hydrogens
- Preserve atom IDs consistently across reactants, steps, and products
- Do not invent atoms that are not chemically present

For CH3Br + OH- -> CH3OH + Br-, use:
- C1 = carbon, Br1 = bromine, O1 = oxygen of OH-, H1/H2/H3 = methyl hydrogens, H4 = OH hydrogen`;

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
        required: ['id', 'name', 'formula', 'role', 'atoms', 'bonds'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          formula: { type: 'string' },
          role: { type: 'string' },
          atoms: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'element', 'charge'],
              properties: {
                id: { type: 'string' },
                element: { type: 'string' },
                charge: { type: ['string', 'null'] },
              },
            },
          },
          bonds: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'atom1', 'atom2', 'order'],
              properties: {
                id: { type: 'string' },
                atom1: { type: 'string' },
                atom2: { type: 'string' },
                order: { type: 'number' },
              },
            },
          },
        },
      },
    },

    products: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'formula', 'role', 'atoms', 'bonds'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          formula: { type: 'string' },
          role: { type: 'string' },
          atoms: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'element', 'charge'],
              properties: {
                id: { type: 'string' },
                element: { type: 'string' },
                charge: { type: ['string', 'null'] },
              },
            },
          },
          bonds: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'atom1', 'atom2', 'order'],
              properties: {
                id: { type: 'string' },
                atom1: { type: 'string' },
                atom2: { type: 'string' },
                order: { type: 'number' },
              },
            },
          },
        },
      },
    },

    steps: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['step', 'action', 'targets', 'explanation'],
        properties: {
          step: { type: 'number' },
          action: {
            type: 'string',
            enum: [
              'NUCLEOPHILE_ATTACK',
              'BOND_BREAK',
              'BOND_FORM',
              'ELECTRON_PAIR_MOVE',
              'PROTON_TRANSFER',
            ],
          },
          targets: {
            type: 'object',
            additionalProperties: false,
            required: [
              'nucleophile_atom',
              'electrophile_atom',
              'bond',
              'from_bond',
              'to_atom',
              'atom1',
              'atom2',
              'order',
            ],
            properties: {
              nucleophile_atom: { type: ['string', 'null'] },
              electrophile_atom: { type: ['string', 'null'] },
              bond: { type: ['string', 'null'] },
              from_bond: { type: ['string', 'null'] },
              to_atom: { type: ['string', 'null'] },
              atom1: { type: ['string', 'null'] },
              atom2: { type: ['string', 'null'] },
              order: { type: ['number', 'null'] },
            },
          },
          explanation: { type: 'string' },
        },
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
