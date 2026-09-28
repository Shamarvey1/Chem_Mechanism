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

  const findBondPredicate = (targetRef, t) => bond => {
    if (!bond) return false;
    const norm = typeof targetRef === 'string' ? targetRef.trim() : '';
    if (norm && (bond.id === norm || bond.id?.trim() === norm)) return true;
    if (norm && (
      `${bond.atom1}-${bond.atom2}` === norm ||
      `${bond.atom2}-${bond.atom1}` === norm
    )) return true;
    if (t?.atom1 && t?.atom2) {
      if ((bond.atom1 === t.atom1 && bond.atom2 === t.atom2) ||
          (bond.atom1 === t.atom2 && bond.atom2 === t.atom1)) return true;
    }
    if (t?.from_atom && t?.to_atom) {
      if ((bond.atom1 === t.from_atom && bond.atom2 === t.to_atom) ||
          (bond.atom1 === t.to_atom   && bond.atom2 === t.from_atom)) return true;
    }
    if (norm) {
      const refBond = initialGraph.bonds.find(b => b.id === norm || b.id?.trim() === norm);
      if (refBond) {
        if ((bond.atom1 === refBond.atom1 && bond.atom2 === refBond.atom2) ||
            (bond.atom1 === refBond.atom2 && bond.atom2 === refBond.atom1)) return true;
      }
    }
    if (norm && norm.includes('-')) {
      const [e1, e2] = norm.split('-').map(x => x.trim());
      const a1 = initialGraph.atoms.find(a => a.id === bond.atom1);
      const a2 = initialGraph.atoms.find(a => a.id === bond.atom2);
      if (a1 && a2) {
        if ((a1.element === e1 && a2.element === e2) ||
            (a1.element === e2 && a2.element === e1)) return true;
      }
    }
    return false;
  };

  for (let s = 0; s <= currentStep; s++) {
    const stepObj = steps[s];
    if (!stepObj) continue;
    const { action, targets } = stepObj;
    const isCurrent = s === currentStep;

    if (action === 'BOND_BREAK') {
      const targetBond = targets?.bond || targets?.from_bond || targets?.bond_id || targets?.bondId || targets?.bond_broken || targets?.broken_bond;
      const match = findBondPredicate(targetBond, targets);
      if (isCurrent) bonds = bonds.map(b => match(b) ? { ...b, status: 'breaking' } : b);
      else           bonds = bonds.filter(b => !match(b));
    }

    else if (action === 'BOND_FORM') {
      const { atom1, atom2, order = 1 } = targets || {};
      if (atom1 && atom2) {
        const idx = bonds.findIndex(b =>
          (b.atom1 === atom1 && b.atom2 === atom2) ||
          (b.atom1 === atom2 && b.atom2 === atom1)
        );
        if (idx >= 0) {
          bonds[idx] = { ...bonds[idx], order, status: isCurrent ? 'forming' : 'formed' };
        } else {
          bonds.push({ id: `${atom1}-${atom2}`, atom1, atom2, order, status: isCurrent ? 'forming' : 'formed' });
        }
      }
    }

    else if (action === 'ELECTRON_PAIR_MOVE') {
      const fromBond = targets?.from_bond || targets?.bond;
      const toAtom   = targets?.to_atom;
      const hasSubsequentBreak = steps.some((st, idx) => idx > s && st.action === 'BOND_BREAK');
      if (!hasSubsequentBreak && fromBond) {
        const match = findBondPredicate(fromBond, targets);
        if (isCurrent) bonds = bonds.map(b => match(b) ? { ...b, status: 'breaking' } : b);
        else           bonds = bonds.filter(b => !match(b));
      }
      if (toAtom) {
        const a = atoms.find(a => a.id === toAtom);
        if (a && typeof a.charge === 'number') a.charge = -1;
      }
    }

    else if (action === 'PROTON_TRANSFER') {
      const { hydrogen_atom: H, from_atom, to_atom } = targets || {};
      if (!H) continue;
      if (from_atom) {
        bonds = bonds.filter(b =>
          !((b.atom1 === H && b.atom2 === from_atom) || (b.atom1 === from_atom && b.atom2 === H))
        );
      }
      if (to_atom) {
        const exists = bonds.some(b =>
          (b.atom1 === to_atom && b.atom2 === H) || (b.atom1 === H && b.atom2 === to_atom)
        );
        if (!exists) bonds.push({ id: `${to_atom}-${H}`, atom1: to_atom, atom2: H, order: 1, status: isCurrent ? 'forming' : 'formed' });
      }
    }

    else if (action === 'ELECTROPHILE_ATTACK') {
      const { pi_atom1, pi_atom2 } = targets || {};
      if (pi_atom1 && pi_atom2) {
        const matchPi = b =>
          (b.atom1 === pi_atom1 && b.atom2 === pi_atom2) ||
          (b.atom1 === pi_atom2 && b.atom2 === pi_atom1);
        if (isCurrent) bonds = bonds.map(b => matchPi(b) ? { ...b, status: 'breaking' } : b);
        else bonds = bonds.map(b => matchPi(b) && b.order === 2 ? { ...b, order: 1, status: undefined } : b);
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
        bonds = bonds.filter(b =>
          !((b.atom1 === migrating_atom && b.atom2 === from_atom) ||
            (b.atom1 === from_atom && b.atom2 === migrating_atom))
        );
        const exists = bonds.some(b =>
          (b.atom1 === migrating_atom && b.atom2 === to_atom) ||
          (b.atom1 === to_atom && b.atom2 === migrating_atom)
        );
        if (!exists) bonds.push({ id: `${migrating_atom}-${to_atom}`, atom1: migrating_atom, atom2: to_atom, order: 1, status: isCurrent ? 'forming' : 'formed' });
      }
    }

    else if (action === 'OXIDATION_REDUCTION') {
      const { oxidized_atom, reduced_atom } = targets || {};
      if (oxidized_atom) { const a = atoms.find(a => a.id === oxidized_atom); if (a) a.charge += 1; }
      if (reduced_atom)  { const a = atoms.find(a => a.id === reduced_atom);  if (a) a.charge -= 1; }
    }
  }

  return { atoms, bonds, activeStepData };
}
