const OpenAI = require('openai');
const { validateMechanism } = require('./mechanismValidator');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const SYSTEM_PROMPT = `
You are an expert chemistry tutor. Return ONLY valid JSON matching the schema.
Support ALL reaction types: SN1/SN2/E1/E2, neutralization, precipitation, combustion, redox, decomposition, combination, single/double displacement, Lewis acid-base, addition, esterification, hydrolysis.

IONIC COMPOUND RULES (CRITICAL):
- Ionic compounds: metal cation has charge set, ZERO covalent bonds to counter-ion.
- NaOH → Na1 (charge:+1, no bonds), O1 (charge:-1), H1; bonds: [O1-H1 order:1]
- KOH  → K1 (charge:+1, no bonds), O1 (charge:-1), H1; bonds: [O1-H1 order:1]
- NaCl → Na1 (charge:+1), Cl1 (charge:-1); bonds: []
- CaCl2 → Ca1 (charge:+2), Cl1 (charge:-1), Cl2 (charge:-1); bonds: []
- MgO  → Mg1 (charge:+2), O1 (charge:-2); bonds: []
- AgNO3 → Ag1 (charge:+1, no bonds), NO3 group bonded covalently; Ag1 has no bonds.
- NEVER put Na-O, K-O, Ca-Cl, Mg-O, Na-Cl, Ba-Cl bonds in ionic compounds.
- HCl → H (charge:0) covalently bonded to Cl (charge:0). bond id:bond1 order:1.
- HBr → H-Br covalent bond order:1.
- H2SO4 → S bonded to 4 O; two S=O (order:2), two S-OH (order:1 each).
- H2O → O-H1 order:1, O-H2 order:1. O charge:0.

ATOM IDs: element+number (Na1, O1, H1, H2). Same atom keeps same id in reactants, steps, and products.
BOND IDs: unique strings like bond1, bond2, or bond-H2-Cl1.

11 ACTIONS (targets shown):
1. NUCLEOPHILE_ATTACK   { nucleophile_atom, electrophile_atom }
2. ELECTROPHILE_ATTACK  { electrophile_atom, pi_atom1, pi_atom2 }
3. BASE_ABSTRACTION     { base_atom, hydrogen_atom }
4. BOND_BREAK           { bond: "<exact bond id from reactants>" }
5. BOND_FORM            { atom1, atom2, order }
6. ELECTRON_PAIR_MOVE   { from_bond, to_atom }
7. PROTON_TRANSFER      { hydrogen_atom, from_atom, to_atom }
8. CHARGE_CHANGE        { atom, new_charge }
9. REARRANGEMENT        { migrating_atom, from_atom, to_atom }
10. RESONANCE           { from_atom, to_atom }
11. OXIDATION_REDUCTION { oxidized_atom, reduced_atom }

NEUTRALIZATION EXAMPLE (NaOH + HCl -> NaCl + H2O):
Reactants:
  NaOH: id:mol1 atoms:[{id:Na1,element:Na,charge:1},{id:O1,element:O,charge:-1},{id:H1,element:H,charge:0}] bonds:[{id:bond1,atom1:O1,atom2:H1,order:1}]
  HCl:  id:mol2 atoms:[{id:H2,element:H,charge:0},{id:Cl1,element:Cl,charge:0}] bonds:[{id:bond2,atom1:H2,atom2:Cl1,order:1}]
Steps:
  1. BOND_BREAK {bond:bond2} — H2-Cl1 bond breaks (HCl ionizes)
  2. CHARGE_CHANGE {atom:Cl1,new_charge:-1} — Cl becomes Cl-
  3. PROTON_TRANSFER {hydrogen_atom:H2,from_atom:Cl1,to_atom:O1} — H+ moves to OH-
  4. CHARGE_CHANGE {atom:O1,new_charge:0} — O becomes neutral in H2O
  5. BOND_FORM {atom1:O1,atom2:H2,order:1} — O-H bond in water forms
Products:
  H2O:  atoms:[O1 charge:0, H1 charge:0, H2 charge:0] bonds:[O1-H1 order:1, O1-H2 order:1]
  NaCl: atoms:[Na1 charge:+1, Cl1 charge:-1] bonds:[]

SN2 EXAMPLE (CH3Br + OH- -> CH3OH + Br-):
  1. NUCLEOPHILE_ATTACK {nucleophile_atom:O1, electrophile_atom:C1}
  2. ELECTRON_PAIR_MOVE {from_bond:bond-C1-Br1, to_atom:Br1}
  3. BOND_BREAK {bond:bond-C1-Br1}
  4. BOND_FORM {atom1:C1, atom2:O1, order:1}

COMBUSTION (CH4 + 2O2 -> CO2 + 2H2O):
  1. OXIDATION_REDUCTION {oxidized_atom:C1, reduced_atom:O3}
  2. BOND_BREAK all C-H bonds
  3. BOND_FORM C=O (order:2), O-H (order:1)

PRECIPITATION (AgNO3 + NaCl -> AgCl + NaNO3):
  1. BOND_FORM {atom1:Ag1,atom2:Cl1,order:1}
  2. CHARGE_CHANGE {atom:Ag1,new_charge:0}
  3. CHARGE_CHANGE {atom:Cl1,new_charge:0}

REDOX (Fe + CuSO4 -> FeSO4 + Cu):
  1. OXIDATION_REDUCTION {oxidized_atom:Fe1,reduced_atom:Cu1}
  2. CHARGE_CHANGE {atom:Fe1,new_charge:2}
  3. CHARGE_CHANGE {atom:Cu1,new_charge:0}

PRODUCT RULES:
- C=C → order:2, C=O → order:2, C-H/O-H/N-H → order:1
- Ionic salts in products: list atoms with charges, bonds:[]
- Cl-, Br-, I- products: charge:-1, NO bonds
- H2O: O charge:0, exactly two O-H bonds order:1
- CO2: two C=O bonds each order:2

Return ONLY valid JSON. No markdown, no explanation.
`;

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
          step:        { type: 'number' },
          action:      {
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
            required: ['atom','atom1','atom2','base_atom','bond','electrophile_atom','from_atom','from_bond','hydrogen_atom','migrating_atom','new_charge','nucleophile_atom','order','oxidized_atom','pi_atom1','pi_atom2','reduced_atom','to_atom'],
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
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  const userMessage = `
Analyze this chemical reaction:

${reaction}

Remember:
- Preserve atom IDs across reactants and products.
- Do not invent new IDs for existing atoms.
- Make every mechanism target reference valid atom or bond IDs.
`;

  let rawContent;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0,
      max_completion_tokens: 16384,

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'chemical_reaction_mechanism',
          strict: true,
          schema: MECHANISM_SCHEMA,
        },
      },

      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    rawContent = completion.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      throw new Error('Groq returned an empty response.');
    }
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

  const validation = validateMechanism(parsed);

  if (!validation.valid) {
    throw new Error(
      `Mechanism validation failed: ${validation.errors.join('; ')}`
    );
  }

  return parsed;
};

module.exports = {
  analyzeReaction,
};
