const ALLOWED_ACTIONS = new Set([
  'NUCLEOPHILE_ATTACK',
  'ELECTROPHILE_ATTACK',
  'BASE_ABSTRACTION',
  'BOND_BREAK',
  'BOND_FORM',
  'ELECTRON_PAIR_MOVE',
  'PROTON_TRANSFER',
  'CHARGE_CHANGE',
  'REARRANGEMENT',
  'RESONANCE',
  'OXIDATION_REDUCTION',
]);
const validateMechanism = (mechanism) => {
  const errors = [];
  if (!mechanism || typeof mechanism !== 'object') {
    return {
      valid: false,
      errors: ['Mechanism object is required.'],
    };
  }
  if (!mechanism.reaction || typeof mechanism.reaction !== 'object') {
    errors.push('Mechanism must contain a valid "reaction" object.');
  }
  if (!Array.isArray(mechanism.reactants)) {
    errors.push('Mechanism "reactants" must be an array.');
  }
  if (!Array.isArray(mechanism.products)) {
    errors.push('Mechanism "products" must be an array.');
  }
  if (!Array.isArray(mechanism.steps)) {
    errors.push('Mechanism "steps" must be an array.');
  }
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }
  const knownAtomIds = new Set();
  const knownBondIds = new Set();
  let hasAtomData = false;
  let hasBondData = false;
  const collectMolecularData = (molecules) => {
  for (const mol of molecules) {
    if (!mol || typeof mol !== 'object') continue;
    if (Array.isArray(mol.atoms)) {
      for (const atom of mol.atoms) {
        if (atom && typeof atom.id === 'string' && atom.id.trim()) {
          knownAtomIds.add(atom.id.trim());
          hasAtomData = true;
        }
      }
    }
    if (Array.isArray(mol.bonds)) {
      for (const bond of mol.bonds) {
        if (!bond || typeof bond !== 'object') continue;
        if (
          typeof bond.id === 'string' &&
          bond.id.trim() &&
          typeof bond.atom1 === 'string' &&
          typeof bond.atom2 === 'string'
        ) {
          knownBondIds.add(bond.id.trim());
          knownBondIds.add(`${bond.atom1}-${bond.atom2}`);
          knownBondIds.add(`${bond.atom2}-${bond.atom1}`);
          hasBondData = true;
        }
      }
    }
  }
};
  collectMolecularData(mechanism.reactants);
  collectMolecularData(mechanism.products);
  const checkAtomExists = (atomId, fieldName, stepIndex) => {
    if (hasAtomData && atomId) {
      if (!knownAtomIds.has(atomId)) {
        errors.push(
          `Step ${stepIndex + 1}: Referenced atom "${atomId}" in "${fieldName}" does not exist in molecule atom data.`
        );
      }
    }
  };
  const checkBondExists = (bondId, fieldName, stepIndex) => {
  if (hasBondData && bondId) {
    const normalizedBondId = bondId.trim();
    if (!knownBondIds.has(normalizedBondId)) {
      errors.push(
        `Step ${stepIndex + 1}: Referenced bond "${normalizedBondId}" in "${fieldName}" does not exist in molecule bond data.`
      );
    }
  }
};
  mechanism.steps.forEach((stepObj, index) => {
    const stepNumber = stepObj && typeof stepObj.step === 'number' ? stepObj.step : index + 1;
    if (!stepObj || typeof stepObj !== 'object') {
      errors.push(`Step ${stepNumber}: Step must be an object.`);
      return;
    }
    const { action, targets } = stepObj;
    if (!action || typeof action !== 'string' || !ALLOWED_ACTIONS.has(action)) {
      errors.push(
        `Step ${stepNumber}: Unknown or missing action "${action}". Allowed actions are: ${Array.from(ALLOWED_ACTIONS).join(', ')}.`
      );
      return;
    }
    if (!targets || typeof targets !== 'object') {
      errors.push(`Step ${stepNumber}: Step targets object is required.`);
      return;
    }
    switch (action) {
      case 'NUCLEOPHILE_ATTACK': {
        if (!targets.nucleophile_atom || typeof targets.nucleophile_atom !== 'string') {
          errors.push(`Step ${stepNumber}: NUCLEOPHILE_ATTACK requires "targets.nucleophile_atom".`);
        } else {
          checkAtomExists(targets.nucleophile_atom, 'nucleophile_atom', index);
        }
        if (!targets.electrophile_atom || typeof targets.electrophile_atom !== 'string') {
          errors.push(`Step ${stepNumber}: NUCLEOPHILE_ATTACK requires "targets.electrophile_atom".`);
        } else {
          checkAtomExists(targets.electrophile_atom, 'electrophile_atom', index);
        }
        break;
      }
      case 'BASE_ABSTRACTION': {
        if (!targets.base_atom || typeof targets.base_atom !== 'string') {
          errors.push(`Step ${stepNumber}: BASE_ABSTRACTION requires "targets.base_atom".`);
        } else {
          checkAtomExists(targets.base_atom, 'base_atom', index);
        }
        if (!targets.hydrogen_atom || typeof targets.hydrogen_atom !== 'string') {
          errors.push(`Step ${stepNumber}: BASE_ABSTRACTION requires "targets.hydrogen_atom".`);
        } else {
          checkAtomExists(targets.hydrogen_atom, 'hydrogen_atom', index);
        }
        break;
      }
      case 'BOND_BREAK': {
        if (
          !targets.bond ||
          typeof targets.bond !== 'string' ||
          !targets.bond.trim()
        ) {
          errors.push(
            `Step ${stepNumber}: BOND_BREAK requires a valid bond identifier in "targets.bond".`
          );
        } else {
          checkBondExists(targets.bond, 'bond', index);
        }
        break;
      }
      case 'BOND_FORM': {
        if (!targets.atom1 || typeof targets.atom1 !== 'string') {
          errors.push(`Step ${stepNumber}: BOND_FORM requires "targets.atom1".`);
        } else {
          checkAtomExists(targets.atom1, 'atom1', index);
        }
        if (!targets.atom2 || typeof targets.atom2 !== 'string') {
          errors.push(`Step ${stepNumber}: BOND_FORM requires "targets.atom2".`);
        } else {
          checkAtomExists(targets.atom2, 'atom2', index);
        }
        if (
          targets.order === undefined ||
          targets.order === null ||
          typeof targets.order !== 'number' ||
          Number.isNaN(targets.order) ||
          targets.order <= 0
        ) {
          errors.push(`Step ${stepNumber}: BOND_FORM requires a valid numeric bond order in "targets.order".`);
        }
        break;
      }
      case 'ELECTRON_PAIR_MOVE': {
        if (
          !targets.from_bond ||
          typeof targets.from_bond !== 'string' ||
          !targets.from_bond.trim()
        ) {
          errors.push(
            `Step ${stepNumber}: ELECTRON_PAIR_MOVE requires "targets.from_bond".`
          );
        } else {
          checkBondExists(targets.from_bond, 'from_bond', index);
        }
        if (
          !targets.to_atom ||
          typeof targets.to_atom !== 'string' ||
          !targets.to_atom.trim()
        ) {
          errors.push(
            `Step ${stepNumber}: ELECTRON_PAIR_MOVE requires "targets.to_atom".`
          );
        } else {
          checkAtomExists(targets.to_atom, 'to_atom', index);
        }
        break;
      }
      case 'PROTON_TRANSFER': {
        const hasExplicitHydrogen = typeof targets.hydrogen_atom === 'string' && targets.hydrogen_atom.trim();
        const hasFromAtom = typeof targets.from_atom === 'string' && targets.from_atom.trim();
        const hasToAtom = typeof targets.to_atom === 'string' && targets.to_atom.trim();
        const hasAtom1 = typeof targets.atom1 === 'string' && targets.atom1.trim();
        const hasAtom2 = typeof targets.atom2 === 'string' && targets.atom2.trim();
        if (hasExplicitHydrogen && hasFromAtom && hasToAtom) {
          checkAtomExists(targets.hydrogen_atom, 'hydrogen_atom', index);
          checkAtomExists(targets.from_atom, 'from_atom', index);
          checkAtomExists(targets.to_atom, 'to_atom', index);
        } else if (hasAtom1 && hasAtom2) {
          checkAtomExists(targets.atom1, 'atom1', index);
          checkAtomExists(targets.atom2, 'atom2', index);
        } else {
          errors.push(
            `Step ${stepNumber}: PROTON_TRANSFER requires either "targets.hydrogen_atom", "targets.from_atom", "targets.to_atom" or "targets.atom1", "targets.atom2".`
          );
        }
        break;
      }
      default:
        if (action === 'ELECTROPHILE_ATTACK') {
          if (!targets.electrophile_atom) {
            errors.push(`Step ${stepNumber}: ELECTROPHILE_ATTACK requires "targets.electrophile_atom".`);
          } else { checkAtomExists(targets.electrophile_atom, 'electrophile_atom', index); }
          if (!targets.pi_atom1) {
            errors.push(`Step ${stepNumber}: ELECTROPHILE_ATTACK requires "targets.pi_atom1".`);
          } else { checkAtomExists(targets.pi_atom1, 'pi_atom1', index); }
          if (!targets.pi_atom2) {
            errors.push(`Step ${stepNumber}: ELECTROPHILE_ATTACK requires "targets.pi_atom2".`);
          } else { checkAtomExists(targets.pi_atom2, 'pi_atom2', index); }
        }
        else if (action === 'CHARGE_CHANGE') {
          if (!targets.atom) {
            errors.push(`Step ${stepNumber}: CHARGE_CHANGE requires "targets.atom".`);
          } else { checkAtomExists(targets.atom, 'atom', index); }
          if (typeof targets.new_charge !== 'number') {
            errors.push(`Step ${stepNumber}: CHARGE_CHANGE requires a numeric "targets.new_charge".`);
          }
        }
        else if (action === 'REARRANGEMENT') {
          if (!targets.migrating_atom) {
            errors.push(`Step ${stepNumber}: REARRANGEMENT requires "targets.migrating_atom".`);
          } else { checkAtomExists(targets.migrating_atom, 'migrating_atom', index); }
          if (!targets.from_atom) {
            errors.push(`Step ${stepNumber}: REARRANGEMENT requires "targets.from_atom".`);
          } else { checkAtomExists(targets.from_atom, 'from_atom', index); }
          if (!targets.to_atom) {
            errors.push(`Step ${stepNumber}: REARRANGEMENT requires "targets.to_atom".`);
          } else { checkAtomExists(targets.to_atom, 'to_atom', index); }
        }
        else if (action === 'RESONANCE') {
          if (!targets.from_atom) {
            errors.push(`Step ${stepNumber}: RESONANCE requires "targets.from_atom".`);
          } else { checkAtomExists(targets.from_atom, 'from_atom', index); }
          if (!targets.to_atom) {
            errors.push(`Step ${stepNumber}: RESONANCE requires "targets.to_atom".`);
          } else { checkAtomExists(targets.to_atom, 'to_atom', index); }
        }
        else if (action === 'OXIDATION_REDUCTION') {
          if (!targets.oxidized_atom) {
            errors.push(`Step ${stepNumber}: OXIDATION_REDUCTION requires "targets.oxidized_atom".`);
          } else { checkAtomExists(targets.oxidized_atom, 'oxidized_atom', index); }
          if (!targets.reduced_atom) {
            errors.push(`Step ${stepNumber}: OXIDATION_REDUCTION requires "targets.reduced_atom".`);
          } else { checkAtomExists(targets.reduced_atom, 'reduced_atom', index); }
        }
        break;
    }
  });
  return {
    valid: errors.length === 0,
    errors,
  };
};
module.exports = { validateMechanism };
