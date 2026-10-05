const OpenAI = require('openai');
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
let _client = null;
const getClient = () => {
  if (!_client) {
    _client = new OpenAI({
      baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
      apiKey:  process.env.GROQ_API_KEY,
    });
  }
  return _client;
};
const CLASSIFIER_PROMPT = `Classify the given chemical reaction into exactly one category.
The input can be a balanced equation, a reaction name, or a description.
Return ONLY valid JSON: {"category":"<CATEGORY>","explanation":"<one sentence>"}
Categories and when to use them:
  ORGANIC       — C-H compounds: SN1, SN2, E1, E2, addition, EAS, aldol, Diels-Alder, esterification, hydrolysis, rearrangement
  NEUTRALIZATION — acid + base -> salt + water (NaOH+HCl, KOH+HBr, Ca(OH)2+HCl, NaOH+H2SO4, etc.)
  PRECIPITATION  — double displacement producing insoluble salt (AgNO3+NaCl->AgCl, BaCl2+Na2SO4->BaSO4)
  REDOX          — single displacement or electron transfer (Fe+CuSO4, Zn+HCl, Na+H2O, Al+CuCl2)
  COMBUSTION     — hydrocarbon/organic + O2 (CH4+O2, C3H8+O2, C6H6+O2)
  COMBINATION    — elements or compounds combining (2H2+O2, N2+3H2, 2Na+Cl2, SO3+H2O)
  DECOMPOSITION  — compound splitting (H2O2->H2O+O2, CaCO3->CaO+CO2, 2HgO->Hg+O2)
  ACID_BASE      — organic acid-base or Lewis acid-base (CH3COOH+NaOH, BF3+NH3, NH3+H2O)
  OTHER          — anything not in the above (coordination chemistry, biochemistry, etc.)
Examples (equations):
  "NaOH + HCl -> NaCl + H2O"     → NEUTRALIZATION
  "CH3Br + OH- -> CH3OH + Br-"   → ORGANIC
  "Fe + CuSO4 -> FeSO4 + Cu"     → REDOX
  "AgNO3 + NaCl -> AgCl + NaNO3" → PRECIPITATION
  "CH4 + 2O2 -> CO2 + 2H2O"      → COMBUSTION
  "2H2 + O2 -> 2H2O"             → COMBINATION
  "2H2O2 -> 2H2O + O2"           → DECOMPOSITION
  "BF3 + NH3 -> F3B-NH3"         → ACID_BASE
Examples (names/descriptions):
  "SN2 reaction"                  → ORGANIC
  "combustion of methane"         → COMBUSTION
  "esterification"                → ORGANIC
  "Grignard reaction"             → ORGANIC
  "neutralization"                → NEUTRALIZATION
  "rusting of iron"               → REDOX
  "decomposition of hydrogen peroxide" → DECOMPOSITION
  "Haber process"                 → COMBINATION`;
const CLASSIFIER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['category', 'explanation'],
  properties: {
    category: {
      type: 'string',
      enum: ['ORGANIC','NEUTRALIZATION','PRECIPITATION','REDOX','COMBUSTION','COMBINATION','DECOMPOSITION','ACID_BASE','OTHER'],
    },
    explanation: { type: 'string' },
  }, 
};
async function classifyReaction(reactionInput) {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: CLASSIFIER_PROMPT },
      { role: 'user',   content: `Classify this reaction: "${reactionInput}"\n\nYOU MUST RETURN A JSON OBJECT EXACTLY MATCHING THIS SCHEMA:\n${JSON.stringify(CLASSIFIER_SCHEMA, null, 2)}` },
    ],
    temperature: 0,
    max_tokens: 500,
  });
  const rawContent = completion.choices[0].message.content.trim();
  const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/) || rawContent.match(/```\n([\s\S]*?)\n```/);
  const cleanContent = jsonMatch ? jsonMatch[1] : rawContent;
  return JSON.parse(cleanContent);
}
module.exports = { classifyReaction };
