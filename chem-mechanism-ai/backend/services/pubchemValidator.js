const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

const FORMULA_CACHE = new Map();

async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function lookupFormula(name) {
  const key = name.toLowerCase().trim();
  if (FORMULA_CACHE.has(key)) return FORMULA_CACHE.get(key);

  try {
    const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(key)}/property/MolecularFormula,MolecularWeight,Charge/JSON`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      FORMULA_CACHE.set(key, null);
      return null;
    }
    const data = await res.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) {
      FORMULA_CACHE.set(key, null);
      return null;
    }
    const result = {
      formula: props.MolecularFormula || null,
      weight: props.MolecularWeight || null,
      charge: props.Charge ?? 0,
    };
    FORMULA_CACHE.set(key, result);
    return result;
  } catch {
    FORMULA_CACHE.set(key, null);
    return null;
  }
}

function parseFormulaToAtomCounts(formula) {
  if (!formula) return {};
  const counts = {};
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let m;
  while ((m = regex.exec(formula)) !== null) {
    if (!m[1]) continue;
    const el = m[1];
    const n = m[2] ? parseInt(m[2], 10) : 1;
    counts[el] = (counts[el] || 0) + n;
  }
  return counts;
}

function countAtomsInMolecule(mol) {
  const counts = {};
  (mol.atoms || []).forEach(a => {
    const el = a.element || 'X';
    counts[el] = (counts[el] || 0) + 1;
  });
  return counts;
}

function compareAtomCounts(aiCounts, pubchemCounts) {
  const errors = [];
  const allElements = new Set([...Object.keys(aiCounts), ...Object.keys(pubchemCounts)]);
  for (const el of allElements) {
    const ai = aiCounts[el] || 0;
    const pc = pubchemCounts[el] || 0;
    if (ai !== pc) {
      errors.push(`${el}: AI has ${ai}, PubChem has ${pc}`);
    }
  }
  return errors;
}

async function validateWithPubChem(mechanism) {
  const warnings = [];
  const enrichments = {};

  const allMolecules = [
    ...(mechanism.reactants || []).map(m => ({ ...m, role: 'reactant' })),
    ...(mechanism.products  || []).map(m => ({ ...m, role: 'product' })),
  ];

  const lookupPromises = allMolecules.map(async (mol) => {
    const name = mol.name || mol.formula || '';
    if (!name) return;

    const pubchem = await lookupFormula(name);
    if (!pubchem) {
      if (mol.formula) {
        const altPubchem = await lookupFormula(mol.formula);
        if (altPubchem) {
          return { mol, pubchem: altPubchem };
        }
      }
      warnings.push(`PubChem lookup failed for "${name}" — cannot verify`);
      return null;
    }
    return { mol, pubchem };
  });

  const results = await Promise.all(lookupPromises);

  for (const result of results) {
    if (!result) continue;
    const { mol, pubchem } = result;

    if (pubchem.formula) {
      enrichments[mol.id] = {
        verifiedFormula: pubchem.formula,
        molecularWeight: pubchem.weight,
      };

      const aiCounts = countAtomsInMolecule(mol);
      const pcCounts = parseFormulaToAtomCounts(pubchem.formula);
      const atomErrors = compareAtomCounts(aiCounts, pcCounts);
      if (atomErrors.length > 0) {
        warnings.push(
          `${mol.role} "${mol.name}" atom count mismatch: ${atomErrors.join(', ')} — AI atoms may be incorrect`
        );
      }
    }
  }

  const reactantAtoms = {};
  const productAtoms = {};

  (mechanism.reactants || []).forEach(mol => {
    const counts = countAtomsInMolecule(mol);
    for (const [el, n] of Object.entries(counts)) {
      reactantAtoms[el] = (reactantAtoms[el] || 0) + n;
    }
  });

  (mechanism.products || []).forEach(mol => {
    const counts = countAtomsInMolecule(mol);
    for (const [el, n] of Object.entries(counts)) {
      productAtoms[el] = (productAtoms[el] || 0) + n;
    }
  });

  const balanceErrors = compareAtomCounts(reactantAtoms, productAtoms);
  if (balanceErrors.length > 0) {
    warnings.push(`Atom balance check failed (reactants ≠ products): ${balanceErrors.join(', ')}`);
  }

  let reactantCharge = 0;
  let productCharge = 0;
  (mechanism.reactants || []).forEach(mol => {
    (mol.atoms || []).forEach(a => { reactantCharge += (a.charge || 0); });
  });
  (mechanism.products || []).forEach(mol => {
    (mol.atoms || []).forEach(a => { productCharge += (a.charge || 0); });
  });
  if (reactantCharge !== productCharge) {
    warnings.push(`Charge balance failed: reactants total charge ${reactantCharge}, products total charge ${productCharge}`);
  }

  return { warnings, enrichments };
}

module.exports = { validateWithPubChem, lookupFormula };
