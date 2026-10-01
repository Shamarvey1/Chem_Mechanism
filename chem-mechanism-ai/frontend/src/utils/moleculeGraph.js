export function buildInitialGraph(reactionData) {
  const atoms = [];
  const bonds = [];
  const molecules = [];
  const reactants = reactionData?.reactants || [];

  reactants.forEach((mol, molIdx) => {
    const molAtoms = mol.atoms || [];
    const molBonds = mol.bonds || [];
    molecules.push({
      id: mol.id || `R${molIdx + 1}`,
      name: mol.name || '',
      formula: mol.formula || '',
      atomIds: molAtoms.map(a => a.id),
    });
    molAtoms.forEach(a => {
      if (!atoms.some(ex => ex.id === a.id)) {
        atoms.push({
          id: a.id,
          element: a.element || 'C',
          charge: typeof a.charge === 'number' ? a.charge : 0,
          moleculeId: mol.id || `R${molIdx + 1}`,
        });
      }
    });
    molBonds.forEach(b => {
      const exists = bonds.some(
        ex => ex.id === b.id ||
              (ex.atom1 === b.atom1 && ex.atom2 === b.atom2) ||
              (ex.atom1 === b.atom2 && ex.atom2 === b.atom1)
      );
      if (!exists) {
        bonds.push({
          id: b.id || `${b.atom1}-${b.atom2}`,
          atom1: b.atom1,
          atom2: b.atom2,
          order: b.order || 1,
          moleculeId: mol.id || `R${molIdx + 1}`,
        });
      }
    });
  });

  return { atoms, bonds, molecules };
}

export function applyMechanismSteps(initialGraph, steps, currentStep) {
  const atoms = initialGraph.atoms.map(a => ({ ...a }));
  let bonds   = initialGraph.bonds.map(b => ({ ...b }));

  const activeStepData = steps[currentStep] || null;

  try {
  for (let s = 0; s <= currentStep; s++) {
    const stepObj = steps[s];
    if (!stepObj) continue;
    const { action, targets } = stepObj;
    const isCurrent = s === currentStep;

    const hasBond = (a1, a2) => bonds.some(b =>
      (b.atom1 === a1 && b.atom2 === a2) || (b.atom1 === a2 && b.atom2 === a1)
    );

    const matchBondRef = (ref) => (b) => {
      if (!b || !ref) return false;
      const norm = typeof ref === 'string' ? ref.trim() : '';
      if (norm && (b.id === norm || b.id?.trim() === norm)) return true;
      if (norm && (
        `${b.atom1}-${b.atom2}` === norm ||
        `${b.atom2}-${b.atom1}` === norm
      )) return true;
      if (norm) {
        const rb = initialGraph.bonds.find(x => x.id === norm || x.id?.trim() === norm);
        if (rb && (
          (b.atom1 === rb.atom1 && b.atom2 === rb.atom2) ||
          (b.atom1 === rb.atom2 && b.atom2 === rb.atom1)
        )) return true;
      }
      return false;
    };

    if (action === 'BOND_BREAK') {
      const ref = targets?.bond || targets?.from_bond || targets?.bond_id || targets?.bond_broken;
      const pred = matchBondRef(ref);
      if (isCurrent) bonds = bonds.map(b => pred(b) ? { ...b, status: 'breaking' } : b);
      else           bonds = bonds.filter(b => !pred(b));
    }

    else if (action === 'BOND_FORM') {
      const { atom1, atom2, order = 1 } = targets || {};
      if (atom1 && atom2) {
        const idx = bonds.findIndex(b =>
          (b.atom1 === atom1 && b.atom2 === atom2) ||
          (b.atom1 === atom2 && b.atom2 === atom1)
        );
        const newStatus = isCurrent ? 'forming' : undefined;
        if (idx >= 0) bonds[idx] = { ...bonds[idx], order, status: newStatus };
        else bonds.push({ id: `${atom1}-${atom2}`, atom1, atom2, order, status: newStatus });
      }
    }

    else if (action === 'NUCLEOPHILE_ATTACK' || action === 'RESONANCE') {
      // Arrow-only — actual bond changes come from subsequent BOND_FORM / BOND_BREAK steps
    }

    else if (action === 'BASE_ABSTRACTION') {
      const { base_atom, hydrogen_atom: H } = targets || {};
      if (!H) continue;
      const hBond = bonds.find(b =>
        (b.atom1 === H || b.atom2 === H) &&
        b.atom1 !== base_atom && b.atom2 !== base_atom
      );
      if (isCurrent) {
        if (hBond) bonds = bonds.map(b => b.id === hBond.id ? { ...b, status: 'breaking' } : b);
        if (base_atom && !hasBond(base_atom, H))
          bonds.push({ id: `${base_atom}-${H}`, atom1: base_atom, atom2: H, order: 1, status: 'forming' });
      } else {
        if (hBond) bonds = bonds.filter(b => b.id !== hBond.id);
        if (base_atom && !hasBond(base_atom, H))
          bonds.push({ id: `${base_atom}-${H}`, atom1: base_atom, atom2: H, order: 1 });
      }
    }

    else if (action === 'PROTON_TRANSFER') {
      const { hydrogen_atom: H, from_atom, to_atom } = targets || {};
      if (!H) continue;
      if (isCurrent) {
        if (from_atom) {
          bonds = bonds.map(b =>
            ((b.atom1 === H && b.atom2 === from_atom) || (b.atom1 === from_atom && b.atom2 === H))
              ? { ...b, status: 'breaking' } : b
          );
        }
        if (to_atom && !hasBond(to_atom, H))
          bonds.push({ id: `${to_atom}-${H}`, atom1: to_atom, atom2: H, order: 1, status: 'forming' });
      } else {
        if (from_atom)
          bonds = bonds.filter(b =>
            !((b.atom1 === H && b.atom2 === from_atom) || (b.atom1 === from_atom && b.atom2 === H))
          );
        if (to_atom && !hasBond(to_atom, H))
          bonds.push({ id: `${to_atom}-${H}`, atom1: to_atom, atom2: H, order: 1 });
      }
    }

    else if (action === 'ELECTRON_PAIR_MOVE') {
      const ref = targets?.from_bond || targets?.bond;
      if (!ref) continue;
      const pred = matchBondRef(ref);
      if (isCurrent) bonds = bonds.map(b => pred(b) ? { ...b, status: 'breaking' } : b);
      else           bonds = bonds.filter(b => !pred(b));
    }

    else if (action === 'ELECTROPHILE_ATTACK') {
      const { pi_atom1, pi_atom2 } = targets || {};
      if (pi_atom1 && pi_atom2) {
        const pred = b =>
          (b.atom1 === pi_atom1 && b.atom2 === pi_atom2) ||
          (b.atom1 === pi_atom2 && b.atom2 === pi_atom1);
        if (isCurrent) bonds = bonds.map(b => pred(b) ? { ...b, status: 'breaking' } : b);
        else bonds = bonds.map(b => pred(b) && b.order >= 2 ? { ...b, order: b.order - 1, status: undefined } : b);
      }
    }

    else if (action === 'CHARGE_CHANGE') {
      const { atom: atomId, new_charge } = targets || {};
      if (atomId && typeof new_charge === 'number') {
        const a = atoms.find(a => a.id === atomId);
        if (a) a.charge = new_charge;
      }
    }

    else if (action === 'REARRANGEMENT') {
      const { migrating_atom, from_atom, to_atom } = targets || {};
      if (migrating_atom && from_atom && to_atom) {
        const pred = b =>
          (b.atom1 === migrating_atom && b.atom2 === from_atom) ||
          (b.atom1 === from_atom && b.atom2 === migrating_atom);
        if (isCurrent) {
          bonds = bonds.map(b => pred(b) ? { ...b, status: 'breaking' } : b);
          if (!hasBond(migrating_atom, to_atom))
            bonds.push({ id: `${migrating_atom}-${to_atom}`, atom1: migrating_atom, atom2: to_atom, order: 1, status: 'forming' });
        } else {
          bonds = bonds.filter(b => !pred(b));
          if (!hasBond(migrating_atom, to_atom))
            bonds.push({ id: `${migrating_atom}-${to_atom}`, atom1: migrating_atom, atom2: to_atom, order: 1 });
        }
      }
    }

    else if (action === 'OXIDATION_REDUCTION') {
      if (!isCurrent) {
        const { oxidized_atom, reduced_atom } = targets || {};
        const hasFollowingChargeChange = (atomId) =>
          steps.some((st, idx) => idx > s && st.action === 'CHARGE_CHANGE' && st.targets?.atom === atomId);
        if (oxidized_atom && !hasFollowingChargeChange(oxidized_atom)) {
          const a = atoms.find(a => a.id === oxidized_atom);
          if (a) a.charge = Math.abs(a.charge) + 2;
        }
        if (reduced_atom && !hasFollowingChargeChange(reduced_atom)) {
          const a = atoms.find(a => a.id === reduced_atom);
          if (a) a.charge = 0;
        }
      }
    }
  }
  } catch (err) {
    console.warn('[moleculeGraph] Step application error (non-fatal):', err.message);
  }

  return { atoms, bonds, activeStepData };
}


export function buildProductGraph(reactionData) {
  const atoms = [];
  const bonds = [];
  const molecules = [];
  const products = reactionData?.products || [];

  products.forEach((mol, molIdx) => {
    const molId = mol.id || `P${molIdx + 1}`;
    molecules.push({ id: molId, name: mol.name || '', formula: mol.formula || '' });
    (mol.atoms || []).forEach(a => {
      if (!atoms.some(ex => ex.id === a.id)) {
        atoms.push({
          id: a.id,
          element: a.element || 'C',
          charge: typeof a.charge === 'number' ? a.charge : 0,
          moleculeId: molId,
        });
      }
    });
    (mol.bonds || []).forEach(b => {
      const dup = bonds.some(ex =>
        (ex.atom1 === b.atom1 && ex.atom2 === b.atom2) ||
        (ex.atom1 === b.atom2 && ex.atom2 === b.atom1)
      );
      if (!dup) {
        bonds.push({ id: b.id || `${b.atom1}-${b.atom2}`, atom1: b.atom1, atom2: b.atom2, order: b.order || 1 });
      }
    });
  });

  return { atoms, bonds, molecules };
}
