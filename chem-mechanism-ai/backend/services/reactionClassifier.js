const OpenAI = require('openai');
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const getClient = () => {
  const classifierKey = process.env.GROQ_API_KEY_CLASSIFIER
    || process.env.GROQ_API_KEY_INORGANIC
    || process.env.GROQ_API_KEY;
  return new OpenAI({
    baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
    apiKey:  classifierKey,
  });
};

const KEYWORD_RULES = [
  {
    category: 'ORGANIC',
    patterns: [
      /\b(sn1|sn2|e1|e2|grignard|aldol|diels.?alder|esterif|hydrolysis|substitution|elimination|addition|eas|markovnikov|anti.?markovnikov|rearrangement|beckmann|hofmann|cannizzaro|wittig|friedel.?crafts|nucleophil|electrophil|carbocation|carbanion|radical|alkyl|alkene|alkyne|benzene|phenyl|methyl|ethyl|propyl|acetyl|acyl|ether|ester|alcohol|aldehyde|ketone|amide|amine|carboxylic|halide|bromide|iodide|chloride|grign|ch3|c2h5|c6h5|br-|oh-|cn-)/i,
    ],
  },
  {
    category: 'COMBUSTION',
    patterns: [
      /\b(combustion|burning|burns?)\b/i,
      /\+\s*o2\s*(->|→|=)/i,
      /\b(ch4|c2h6|c3h8|c4h10|c6h6|c8h18)\s*\+\s*o2/i,
    ],
  },
  {
    category: 'NEUTRALIZATION',
    patterns: [
      /\b(neutrali[sz]ation)\b/i,
      /(naoh|koh|ca\(oh\)2|mg\(oh\)2|lih|lioh).+(hcl|hbr|hi|hno3|h2so4|h3po4|hf)/i,
      /(hcl|hbr|hi|hno3|h2so4|h3po4|hf).+(naoh|koh|ca\(oh\)2|lioh)/i,
    ],
  },
  {
    category: 'PRECIPITATION',
    patterns: [
      /\b(precipitation|precipitate)\b/i,
      /(agno3|bacl2|pbno3).+(nacl|na2so4|ki|kbr)/i,
      /(nacl|na2so4|ki|kbr).+(agno3|bacl2)/i,
      /->.*\b(agcl|baso4|pbi2|caso4|pbso4)\b/i,
    ],
  },
  {
    category: 'REDOX',
    patterns: [
      /\b(redox|oxidation|reduction|rusting?|corrosion|displacement|single.?displacement|electron.?transfer)\b/i,
      /\b(fe|zn|al|cu|na|mg|k)\s*\+\s*(cuso4|feso4|agno3|hcl|h2so4)/i,
      /\b(kmno4|k2cr2o7|h2o2)\b/i,
    ],
  },
  {
    category: 'COMBINATION',
    patterns: [
      /\b(haber|combination|synthesis)\b.*\b(process|reaction)?\b/i,
      /^\s*(2h2|n2|2na|so3|2mg|4fe)\s*\+/i,
      /\b(n2\s*\+\s*3h2|2h2\s*\+\s*o2|2na\s*\+\s*cl2|so3\s*\+\s*h2o)\b/i,
    ],
  },
  {
    category: 'DECOMPOSITION',
    patterns: [
      /\b(decomposition|decompose|thermal.?decomposition|electrolysis)\b/i,
      /\b(h2o2|caco3|kmno4|kclo3|h2co3|2hgo|2nabr)\s*(->|→|=)/i,
    ],
  },
  {
    category: 'ACID_BASE',
    patterns: [
      /\b(lewis.?acid|lewis.?base|acid.?base|bronsted|proton.?transfer)\b/i,
      /\b(bf3|alcl3|fecl3)\s*\+\s*(nh3|h2o|pyridine)/i,
      /\b(ch3cooh|acetic.?acid)\s*\+\s*(naoh|nh3|koh)/i,
    ],
  },
];

function classifyByKeyword(input) {
  const norm = input.toLowerCase().replace(/\s+/g, ' ');
  for (const rule of KEYWORD_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(norm)) {
        return { category: rule.category, explanation: `Matched by keyword classifier: ${rule.category.toLowerCase()} reaction pattern detected.` };
      }
    }
  }
  return null;
}

const CLASSIFIER_PROMPT = `Classify the given chemical reaction into exactly one category.
The input can be a balanced equation, a reaction name, or a description.
Return ONLY valid JSON: {"category":"<CATEGORY>","explanation":"<one sentence>"}
Categories: ORGANIC, NEUTRALIZATION, PRECIPITATION, REDOX, COMBUSTION, COMBINATION, DECOMPOSITION, ACID_BASE, OTHER.`;

async function classifyReaction(reactionInput) {
  // Fast path: keyword matching (no API call needed)
  const fast = classifyByKeyword(reactionInput);
  if (fast) {
    console.log(`[Classifier] ⚡ Fast keyword match → ${fast.category}`);
    return fast;
  }
  // Slow path: LLM fallback for edge cases (rare)
  console.log(`[Classifier] No keyword match, falling back to LLM...`);
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: CLASSIFIER_PROMPT },
      { role: 'user',   content: `Classify this reaction: "${reactionInput}". Return JSON only: {"category":"...","explanation":"..."}` },
    ],
    temperature: 0,
    max_tokens: 80,
  });
  const rawContent = completion.choices[0].message.content.trim();
  const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/) || rawContent.match(/```\n([\s\S]*?)\n```/);
  const cleanContent = jsonMatch ? jsonMatch[1] : rawContent;
  return JSON.parse(cleanContent);
}
module.exports = { classifyReaction };
