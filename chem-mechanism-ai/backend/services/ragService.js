
const { retrieve, hasConfidentMatch } = require('./retrievalAgent');
const SCHEMA_INSTRUCTION = `
You must return a JSON object with EXACTLY this structure:
{
  "_thinking": "brief plan of atoms and steps (under 100 words)",
  "reaction": {
    "input": "the reaction equation or name",
    "type": "reaction type e.g. SN2, E1, Grignard, Combustion"
  },
  "reactants": [
    {
      "id": "R1",
      "name": "molecule name",
      "formula": "molecular formula",
      "atoms": [
        { "id": "C1", "element": "C", "charge": 0 },
        { "id": "H1", "element": "H", "charge": 0 },
        { "id": "Br1", "element": "Br", "charge": 0 }
      ],
      "bonds": [
        { "id": "bond-C1-Br1", "atom1": "C1", "atom2": "Br1", "order": 1 }
      ]
    }
  ],
  "products": [
    {
      "id": "P1",
      "name": "product name",
      "formula": "molecular formula",
      "atoms": [
        { "id": "C1", "element": "C", "charge": 0 }
      ],
      "bonds": [
        { "id": "bond-C1-O1", "atom1": "C1", "atom2": "O1", "order": 1 }
      ]
    }
  ],
  "steps": [
    {
      "step": 1,
      "action": "NUCLEOPHILE_ATTACK",
      "targets": {
        "atom": null, "atom1": null, "atom2": null, "base_atom": null, "bond": null,
        "electrophile_atom": "C1", "from_atom": null, "from_bond": null,
        "hydrogen_atom": null, "migrating_atom": null, "new_charge": null,
        "nucleophile_atom": "O1", "order": null, "oxidized_atom": null,
        "pi_atom1": null, "pi_atom2": null, "reduced_atom": null, "to_atom": null
      },
      "explanation": "The nucleophile oxygen attacks the electrophilic carbon in a backside attack."
    }
  ]
}
CRITICAL RULES:
- Every atom ID used in steps.targets MUST exist in the reactants atoms array
- Every bond ID in BOND_BREAK must exist in a reactant's bonds array
- All unused targets fields must be null (not omitted)
- The "action" field must be exactly one of: NUCLEOPHILE_ATTACK, ELECTROPHILE_ATTACK, BASE_ABSTRACTION, BOND_BREAK, BOND_FORM, ELECTRON_PAIR_MOVE, PROTON_TRANSFER, CHARGE_CHANGE, REARRANGEMENT, RESONANCE, OXIDATION_REDUCTION
- VISUALIZER RULE: To prevent visual glitches in the 3D visualizer, DO NOT combine BOND_BREAK and BOND_FORM in the same step or assume they happen simultaneously. Even for concerted reactions like SN2, you MUST separate them into sequential micro-steps. ALWAYS output BOND_BREAK steps before BOND_FORM steps, so atoms detach and move away before new atoms connect.
`;
function buildGroundedSystemPrompt(retrievedChunks) {
  if (!retrievedChunks || retrievedChunks.length === 0) {
    return buildFallbackSystemPrompt();
  }
  const contextSection = retrievedChunks
    .map((chunk, i) => `--- CHEMISTRY DOCUMENT EXCERPT ${i + 1} (from: ${chunk.source}) ---\n${chunk.content}`)
    .join('\n\n');
  return `You are an expert chemistry AI that generates precise 3D molecular mechanism visualizations.
RETRIEVED CHEMISTRY KNOWLEDGE (from verified chemistry documents):
${contextSection}
TASK: Using the chemistry document excerpts above as your PRIMARY SOURCE OF TRUTH, generate the mechanism JSON for the requested reaction. 
- Follow the exact mechanism steps described in the documents
- Use the atom IDs and bond patterns described in the documents
- Do NOT invent chemistry that contradicts the documents
- If the documents describe the atoms, bonds, and steps, follow them exactly
${SCHEMA_INSTRUCTION}`;
}
function buildFallbackSystemPrompt() {
  return `You are an expert chemistry AI that generates precise 3D molecular mechanism visualizations.
No specific document was found for this reaction. Use your chemistry knowledge to generate an accurate mechanism.
${SCHEMA_INSTRUCTION}`;
}
async function buildRagContext(query) {
  const retrievedChunks = await retrieve(query);
  const hasDocumentContext = retrievedChunks.length > 0;
  const systemPrompt = hasDocumentContext
    ? buildGroundedSystemPrompt(retrievedChunks)
    : buildFallbackSystemPrompt();
  return {
    systemPrompt,
    retrievedChunks,
    hasDocumentContext,
    topScore: retrievedChunks[0]?.score || 0,
  };
}
module.exports = { buildRagContext };
