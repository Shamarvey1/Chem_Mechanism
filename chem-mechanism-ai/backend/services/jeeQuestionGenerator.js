const OpenAI = require('openai');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

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

function getFallbackJeeQuestions(reactionInput, category) {
  const norm = (reactionInput || '').toLowerCase();
  
  if (norm.includes('naoh') && norm.includes('hcl')) {
    return [
      {
        id: 'jee-naoh-hcl-1',
        examType: 'JEE Main',
        topic: 'Thermochemistry & Neutralization',
        difficulty: 'Moderate',
        question: 'When 100 mL of 0.1 M HCl is completely neutralized by 100 mL of 0.1 M NaOH, the enthalpy of neutralization ΔH° is approximately -57.1 kJ/mol. Why does the value remain almost identical for any strong acid with a strong base?',
        options: [
          { key: 'A', text: 'Because both salts formed are completely insoluble in water.' },
          { key: 'B', text: 'Because the net ionic reaction in all cases is H⁺(aq) + OH⁻(aq) → H₂O(l).' },
          { key: 'C', text: 'Because the hydration energy of Na⁺ and Cl⁻ exactly cancels out the bond enthalpy.' },
          { key: 'D', text: 'Because strong electrolytes do not dissociate until temperature exceeds 100°C.' }
        ],
        correctAnswer: 'B',
        explanation: 'In the neutralization of any strong acid by a strong base in dilute aqueous solution, both reactants are 100% dissociated. Na⁺ and Cl⁻ are spectator ions. The only net chemical reaction taking place is H⁺(aq) + OH⁻(aq) → H₂O(l), which always releases approximately 57.1 to 57.3 kJ per mole of water formed.',
        conceptTested: 'Net ionic equation and enthalpy of neutralization of strong acids/bases'
      },
      {
        id: 'jee-naoh-hcl-2',
        examType: 'JEE Advanced',
        topic: 'Ionic Equilibrium & Conductivity',
        difficulty: 'Challenging',
        question: 'During the conductometric titration of aqueous HCl with aqueous NaOH, what happens to the electrical conductivity of the solution prior to reaching the equivalence point?',
        options: [
          { key: 'A', text: 'Conductivity increases continuously due to the addition of Na⁺ ions.' },
          { key: 'B', text: 'Conductivity remains constant because equal charges are exchanged.' },
          { key: 'C', text: 'Conductivity drops sharply because highly mobile H⁺ ions (Grotthuss mechanism) are replaced by less mobile Na⁺ ions.' },
          { key: 'D', text: 'Conductivity drops to exactly zero at all points before the equivalence point.' }
        ],
        correctAnswer: 'C',
        explanation: 'H⁺ has an anomalously high ionic molar conductivity (λ° ≈ 349.6 S·cm²/mol) due to the Grotthuss proton-hopping mechanism in water. As NaOH is added before equivalence, H⁺ is converted to neutral H₂O, and replaced by Na⁺ which has a much lower molar conductivity (λ° ≈ 50.1 S·cm²/mol). Thus, conductivity decreases sharply until the equivalence point, after which excess OH⁻ causes it to rise again.',
        conceptTested: 'Conductometric titration curves and ionic mobilities in aqueous solution'
      }
    ];
  }

  if (category === 'ORGANIC' || norm.includes('sn2') || norm.includes('ch3br')) {
    return [
      {
        id: 'jee-org-1',
        examType: 'JEE Main',
        topic: 'Nucleophilic Substitution (SN2)',
        difficulty: 'Moderate',
        question: 'For the bimolecular nucleophilic substitution (SN2) of an alkyl halide, what is the effect on the reaction rate if the concentration of the nucleophile is doubled and the concentration of the alkyl halide is halved?',
        options: [
          { key: 'A', text: 'The rate doubles.' },
          { key: 'B', text: 'The rate is halved.' },
          { key: 'C', text: 'The rate remains unchanged.' },
          { key: 'D', text: 'The rate increases by a factor of 4.' }
        ],
        correctAnswer: 'C',
        explanation: 'The rate law for an SN2 reaction is Rate = k[R-X][Nu⁻]. Since it is first order in both the alkyl halide and the nucleophile: Rate\' = k (0.5 [R-X]) (2 [Nu⁻]) = k [R-X][Nu⁻] = Rate. Therefore, the overall rate remains unchanged.',
        conceptTested: 'SN2 kinetics, rate law and reaction order'
      },
      {
        id: 'jee-org-2',
        examType: 'JEE Advanced',
        topic: 'Stereochemistry & Solvent Effects in SN2',
        difficulty: 'Challenging',
        question: 'When (R)-2-bromobutane is treated with sodium iodide (NaI) in acetone, which statement is strictly correct regarding the mechanism and stereochemical outcome?',
        options: [
          { key: 'A', text: 'It proceeds via a planar carbocation intermediate producing a racemic mixture.' },
          { key: 'B', text: 'It proceeds via a single-step concerted mechanism with backside attack, giving complete Walden inversion to (S)-2-iodobutane.' },
          { key: 'C', text: 'Retention of configuration occurs because I⁻ is a larger nucleophile than Br⁻.' },
          { key: 'D', text: 'Acetone acts as a protic solvent that strongly solvates I⁻ through hydrogen bonding.' }
        ],
        correctAnswer: 'B',
        explanation: 'Acetone is a polar aprotic solvent, which does not hydrogen-bond with I⁻, leaving it as a bare, potent nucleophile (Finkelstein reaction). The reaction proceeds via a concerted SN2 pathway through a pentacoordinated transition state with backside nucleophilic displacement, yielding 100% Walden inversion to form (S)-2-iodobutane. NaBr precipitates out, driving the reaction forward.',
        conceptTested: 'Walden inversion, polar aprotic solvents, and Finkelstein reaction'
      }
    ];
  }

  return [
    {
      id: 'jee-gen-1',
      examType: 'JEE Main',
      topic: 'Reaction Mechanism & Energetics',
      difficulty: 'Moderate',
      question: `For the reaction "${reactionInput || 'given reaction'}", which of the following statements best describes the role of the activation energy (Ea) in determining the reaction pathway?`,
      options: [
        { key: 'A', text: 'Ea determines the equilibrium constant Keq of the reaction.' },
        { key: 'B', text: 'A lower Ea corresponds to a faster reaction rate according to the Arrhenius equation k = A·e^(-Ea/RT).' },
        { key: 'C', text: 'Ea is always zero for exothermic reactions.' },
        { key: 'D', text: 'Increasing temperature increases the activation energy of the reaction.' }
      ],
      correctAnswer: 'B',
      explanation: 'According to transition state theory and the Arrhenius equation k = A·e^(-Ea/RT), activation energy represents the energy barrier that reactants must overcome to form the transition state. Lower activation energy increases the rate constant k, allowing more molecules to react per second.',
      conceptTested: 'Arrhenius equation, activation energy, and kinetics'
    },
    {
      id: 'jee-gen-2',
      examType: 'JEE Advanced',
      topic: 'Chemical Equilibrium & Le Chatelier Principle',
      difficulty: 'Challenging',
      question: 'Consider the elementary mechanism steps of this reaction. According to the Principle of Microscopic Reversibility:',
      options: [
        { key: 'A', text: 'The reverse reaction must proceed through the exact same transition states and intermediates in reverse order.' },
        { key: 'B', text: 'The forward and reverse reactions always have the same activation energy.' },
        { key: 'C', text: 'Catalysts alter the chemical pathway of the forward reaction but not the reverse reaction.' },
        { key: 'D', text: 'Elementary steps with high molecularity always occur faster in reverse.' }
      ],
      correctAnswer: 'A',
      explanation: 'The Principle of Microscopic Reversibility states that at equilibrium, the rate of any elementary process is equal to the rate of its exact reverse process. Consequently, the lowest-energy pathway in the forward direction is also the lowest-energy pathway in the reverse direction, passing through the identical transition states and intermediates.',
      conceptTested: 'Principle of microscopic reversibility and reaction coordinates'
    }
  ];
}

async function generateJeeQuestions(reactionInput, reactionData) {
  const category = reactionData?._category || reactionData?.reaction?.type || 'GENERAL';
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
      console.warn('[JEE Generator] Empty response from model, using fallbacks.');
      return getFallbackJeeQuestions(reactionInput, category);
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed.questions;
    }
    return getFallbackJeeQuestions(reactionInput, category);
  } catch (err) {
    console.warn(`[JEE Generator] Failed to generate dynamic JEE questions (${err.message}). Using curated fallbacks.`);
    return getFallbackJeeQuestions(reactionInput, category);
  }
}

module.exports = { generateJeeQuestions, getFallbackJeeQuestions };
