const ALLOWED_ACTIONS = new Set([
  'NUCLEOPHILE_ATTACK',
  'BOND_BREAK',
  'BOND_FORM',
  'ELECTRON_PAIR_MOVE',
  'PROTON_TRANSFER',
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
  let hasAtomData = false;

  const collectAtoms = (molecules) => {
    for (const mol of molecules) {
      if (mol && Array.isArray(mol.atoms)) {
        for (const atom of mol.atoms) {
          if (atom && typeof atom.id === 'string' && atom.id.trim()) {
            knownAtomIds.add(atom.id.trim());
            hasAtomData = true;
          }
        }
      }
    }
  };

  collectAtoms(mechanism.reactants);
  collectAtoms(mechanism.products);

  const checkAtomExists = (atomId, fieldName, stepIndex) => {
    if (hasAtomData && atomId) {
      if (!knownAtomIds.has(atomId)) {
        errors.push(
          `Step ${stepIndex + 1}: Referenced atom "${atomId}" in "${fieldName}" does not exist in molecule atom data.`
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

      case 'BOND_BREAK': {
        if (!targets.bond || typeof targets.bond !== 'string' || !targets.bond.trim()) {
          errors.push(`Step ${stepNumber}: BOND_BREAK requires a valid bond identifier in "targets.bond".`);
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
        if (!targets.from_bond || typeof targets.from_bond !== 'string' || !targets.from_bond.trim()) {
          errors.push(`Step ${stepNumber}: ELECTRON_PAIR_MOVE requires "targets.from_bond".`);
        }

        if (!targets.to_atom || typeof targets.to_atom !== 'string' || !targets.to_atom.trim()) {
          errors.push(`Step ${stepNumber}: ELECTRON_PAIR_MOVE requires "targets.to_atom".`);
        } else {
          checkAtomExists(targets.to_atom, 'to_atom', index);
        }
        break;
      }

      case 'PROTON_TRANSFER': {
        if (!targets.atom1 || typeof targets.atom1 !== 'string') {
          errors.push(`Step ${stepNumber}: PROTON_TRANSFER requires "targets.atom1".`);
        } else {
          checkAtomExists(targets.atom1, 'atom1', index);
        }

        if (!targets.atom2 || typeof targets.atom2 !== 'string') {
          errors.push(`Step ${stepNumber}: PROTON_TRANSFER requires "targets.atom2".`);
        } else {
          checkAtomExists(targets.atom2, 'atom2', index);
        }
        break;
      }

      default:
        break;
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = { validateMechanism };
