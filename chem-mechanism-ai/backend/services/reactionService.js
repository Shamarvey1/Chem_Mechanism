const OpenAI = require('openai');
const { validateMechanism } = require('./mechanismValidator');
const { classifyReaction } = require('./reactionClassifier');

const ORGANIC_PROMPT       = require('./prompts/organic');
const NEUTRALIZATION_PROMPT = require('./prompts/neutralization');
const REDOX_PROMPT         = require('./prompts/redox');
const PRECIPITATION_PROMPT = require('./prompts/precipitation');
const COMBUSTION_PROMPT    = require('./prompts/combustion');
const ACID_BASE_PROMPT     = require('./prompts/acidBase');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const PROMPT_ROUTER = {
  ORGANIC:        ORGANIC_PROMPT,
  NEUTRALIZATION: NEUTRALIZATION_PROMPT,
  REDOX:          REDOX_PROMPT,
  PRECIPITATION:  PRECIPITATION_PROMPT,
  COMBUSTION:     COMBUSTION_PROMPT,
  COMBINATION:    COMBUSTION_PROMPT,
  DECOMPOSITION:  COMBUSTION_PROMPT,
  ACID_BASE:      ACID_BASE_PROMPT,
  OTHER:          NEUTRALIZATION_PROMPT,
};

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
        type:  { type: 'string' },
      },
    },

    reactants: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'formula', 'atoms', 'bonds'],
        properties: {
          id:      { type: 'string' },
          name:    { type: 'string' },
          formula: { type: 'string' },
          atoms: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'element', 'charge'],
              properties: {
                id:      { type: 'string' },
                element: { type: 'string' },
                charge:  { type: 'number' },
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
                id:    { type: 'string' },
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
        required: ['id', 'name', 'formula', 'atoms', 'bonds'],
        properties: {
          id:      { type: 'string' },
          name:    { type: 'string' },
          formula: { type: 'string' },
          atoms: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'element', 'charge'],
              properties: {
                id:      { type: 'string' },
                element: { type: 'string' },
                charge:  { type: 'number' },
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
                id:    { type: 'string' },
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
          step:   { type: 'number' },
          action: {
            type: 'string',
            enum: [
              'NUCLEOPHILE_ATTACK','ELECTROPHILE_ATTACK','BASE_ABSTRACTION',
              'BOND_BREAK','BOND_FORM','ELECTRON_PAIR_MOVE','PROTON_TRANSFER',
              'CHARGE_CHANGE','REARRANGEMENT','RESONANCE','OXIDATION_REDUCTION',
            ],
          },
          targets: {
            type: 'object',
            additionalProperties: false,
            required: [
              'atom','atom1','atom2','base_atom','bond','electrophile_atom',
              'from_atom','from_bond','hydrogen_atom','migrating_atom','new_charge',
              'nucleophile_atom','order','oxidized_atom','pi_atom1','pi_atom2',
              'reduced_atom','to_atom',
            ],
            properties: {
              nucleophile_atom:  { type: 'string' },
              electrophile_atom: { type: 'string' },
              pi_atom1:          { type: 'string' },
              pi_atom2:          { type: 'string' },
              base_atom:         { type: 'string' },
              hydrogen_atom:     { type: 'string' },
              bond:              { type: 'string' },
              atom1:             { type: 'string' },
              atom2:             { type: 'string' },
              order:             { type: 'number' },
              from_bond:         { type: 'string' },
              to_atom:           { type: 'string' },
              from_atom:         { type: 'string' },
              atom:              { type: 'string' },
              new_charge:        { type: 'number' },
              migrating_atom:    { type: 'string' },
              oxidized_atom:     { type: 'string' },
              reduced_atom:      { type: 'string' },
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
    apiKey:  process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const classification = await classifyReaction(reaction);
  console.log(`[Router] "${reaction}" → ${classification.category} (${classification.explanation})`);

  const systemPrompt = PROMPT_ROUTER[classification.category] || NEUTRALIZATION_PROMPT;

  const userMessage = `Analyze this chemical reaction:\n\n${reaction}\n\nRemember: preserve atom IDs across reactants and products. Every mechanism target must reference valid atom or bond IDs from the reactants.`;

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
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
    });
    rawContent = completion.choices?.[0]?.message?.content?.trim();
    if (!rawContent) throw new Error('Groq returned an empty response.');
  } catch (apiError) {
    throw new Error(`Groq API request failed: ${apiError.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (parseError) {
    throw new Error(`Model returned invalid JSON. Raw response:\n${rawContent}`);
  }

  parsed._category = classification.category;

  const validation = validateMechanism(parsed);
  if (!validation.valid) {
    throw new Error(`Mechanism validation failed: ${validation.errors.join('; ')}`);
  }

  return parsed;
};

module.exports = { analyzeReaction };
