import React, { useState, useEffect, useMemo } from 'react';
function buildInitialGraph(reactionData) {
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
      atomIds: molAtoms.map((a) => a.id),
    });
    molAtoms.forEach((a) => {
      if (!atoms.some((existing) => existing.id === a.id)) {
        atoms.push({
          id: a.id,
          element: a.element || 'C',
          charge: typeof a.charge === 'number' ? a.charge : 0,
          moleculeId: mol.id || `R${molIdx + 1}`,
        });
      }
    });
    molBonds.forEach((b) => {
      const alreadyExists = bonds.some(
        (existing) =>
          existing.id === b.id ||
          (existing.atom1 === b.atom1 && existing.atom2 === b.atom2) ||
          (existing.atom1 === b.atom2 && existing.atom2 === b.atom1)
      );
      if (!alreadyExists) {
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
function computeOutAngles(count, inAngle) {
  if (count === 0) return [];
  if (inAngle === null) {
    if (count === 1) return [0];
    if (count === 2) return [0, Math.PI];
    if (count === 3) return [0, (-2 * Math.PI) / 3, (2 * Math.PI) / 3];
    return Array.from({ length: count }, (_, i) => (Math.PI / 2) * i);
  }
  const fwd = inAngle;
  if (count === 1) return [fwd];
  const spread = Math.min((count - 1) * (Math.PI / 3), Math.PI * 0.85);
  const step   = count > 1 ? spread / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) => fwd - spread / 2 + i * step);
}
function computeLayout(graph, width = 640, height = 300) {
  const positions = {};
  const { atoms, bonds, molecules } = graph;
  if (atoms.length === 0) return positions;
  const adj = {};
  atoms.forEach(a => { adj[a.id] = []; });
  bonds.forEach(b => {
    if (adj[b.atom1] !== undefined && adj[b.atom2] !== undefined) {
      adj[b.atom1].push(b.atom2);
      adj[b.atom2].push(b.atom1);
    }
  });
  const BOND_LEN   = 72;  
  const H_BOND_LEN = 46;  
  const numMols    = Math.max(1, molecules.length);
  const molWidth   = width / numMols;
  const isHeavy    = id => atoms.find(a => a.id === id)?.element !== 'H';
  molecules.forEach((mol, molIdx) => {
    const cx = (molIdx + 0.5) * molWidth;
    const cy = height / 2;
    const molAtoms = atoms.filter(a => a.moleculeId === mol.id);
    if (!molAtoms.length) return;
    if (molAtoms.length === 1) {
      positions[molAtoms[0].id] = { x: cx, y: cy };
      return;
    }
    const heavyCandidates = molAtoms.filter(a => a.element !== 'H');
    const candidates = heavyCandidates.length > 0 ? heavyCandidates : molAtoms;
    const root = candidates.reduce((best, a) => {
      const deg     = (adj[a.id] || []).filter(isHeavy).length;
      const bestDeg = (adj[best.id] || []).filter(isHeavy).length;
      return deg > bestDeg ? a : best;
    });
    const visited = new Set([root.id]);
    positions[root.id] = { x: cx, y: cy };
    const queue = [{ id: root.id, inAngle: null }];
    while (queue.length > 0) {
      const { id, inAngle } = queue.shift();
      const pos = positions[id];
      const unvisited = (adj[id] || []).filter(nId => !visited.has(nId));
      if (!unvisited.length) continue;
      const sorted = [
        ...unvisited.filter(isHeavy),
        ...unvisited.filter(nId => !isHeavy(nId)),
      ];
      const outAngles = computeOutAngles(sorted.length, inAngle);
      sorted.forEach((nId, i) => {
        visited.add(nId);
        const nAtom = atoms.find(a => a.id === nId);
        const isH   = nAtom?.element === 'H';
        const dist  = isH ? H_BOND_LEN : BOND_LEN;
        const angle = outAngles[i];
        positions[nId] = {
          x: pos.x + dist * Math.cos(angle),
          y: pos.y + dist * Math.sin(angle),
        };
        queue.push({ id: nId, inAngle: angle });
      });
    }
  });
  return positions;
}
function buildProductGraph(reactionData) {
  const atoms     = [];
  const bonds     = [];
  const molecules = [];
  const products  = reactionData?.products || [];
  products.forEach((mol, molIdx) => {
    const molId = mol.id || `P${molIdx + 1}`;
    molecules.push({
      id:      molId,
      name:    mol.name    || '',
      formula: mol.formula || '',
      atomIds: (mol.atoms || []).map(a => a.id),
    });
    (mol.atoms || []).forEach(a => {
      if (!atoms.some(ex => ex.id === a.id)) {
        atoms.push({
          id:         a.id,
          element:    a.element || 'C',
          charge:     typeof a.charge === 'number' ? a.charge : 0,
          moleculeId: molId,
        });
      }
    });
    (mol.bonds || []).forEach(b => {
      const exists = bonds.some(
        ex => ex.id === b.id ||
              (ex.atom1 === b.atom1 && ex.atom2 === b.atom2) ||
              (ex.atom1 === b.atom2 && ex.atom2 === b.atom1)
      );
      if (!exists) {
        bonds.push({
          id:         b.id || `${b.atom1}-${b.atom2}`,
          atom1:      b.atom1,
          atom2:      b.atom2,
          order:      b.order || 1,
          moleculeId: molId,
        });
      }
    });
  });
  return { atoms, bonds, molecules };
}
function applyMechanismSteps(initialGraph, steps, currentStep) {
  const atoms = initialGraph.atoms.map((a) => ({ ...a }));
  let bonds = initialGraph.bonds.map((b) => ({ ...b }));
  const activeStepData = steps[currentStep] || null;
  for (let s = 0; s <= currentStep; s++) {
    const stepObj = steps[s];
    if (!stepObj) continue;
    const { action, targets } = stepObj;
    const isCurrent = s === currentStep;
    const findBondPredicate = (targetRef, t) => {
      return (bond) => {
        if (!bond) return false;
        const normTarget = typeof targetRef === 'string' ? targetRef.trim() : '';
        if (normTarget && (bond.id === normTarget || bond.id?.trim() === normTarget)) {
          return true;
        }
        if (normTarget && (
          `${bond.atom1}-${bond.atom2}` === normTarget ||
          `${bond.atom2}-${bond.atom1}` === normTarget
        )) {
          return true;
        }
        if (t?.atom1 && t?.atom2) {
          if (
            (bond.atom1 === t.atom1 && bond.atom2 === t.atom2) ||
            (bond.atom1 === t.atom2 && bond.atom2 === t.atom1)
          ) {
            return true;
          }
        }
        if (t?.from_atom && t?.to_atom) {
          if (
            (bond.atom1 === t.from_atom && bond.atom2 === t.to_atom) ||
            (bond.atom1 === t.to_atom && bond.atom2 === t.from_atom)
          ) {
            return true;
          }
        }
        if (normTarget) {
          const refBond = initialGraph.bonds.find((b) => b.id === normTarget || b.id?.trim() === normTarget);
          if (refBond) {
            if (
              (bond.atom1 === refBond.atom1 && bond.atom2 === refBond.atom2) ||
              (bond.atom1 === refBond.atom2 && bond.atom2 === refBond.atom1)
            ) {
              return true;
            }
          }
        }
        if (normTarget && normTarget.includes('-')) {
          const [e1, e2] = normTarget.split('-').map((x) => x.trim());
          const a1 = initialGraph.atoms.find((a) => a.id === bond.atom1);
          const a2 = initialGraph.atoms.find((a) => a.id === bond.atom2);
          if (a1 && a2) {
            if (
              (a1.element === e1 && a2.element === e2) ||
              (a1.element === e2 && a2.element === e1)
            ) {
              return true;
            }
          }
        }
        return false;
      };
    };
    if (action === 'BOND_BREAK') {
      const targetBond =
        targets?.bond ||
        targets?.from_bond ||
        targets?.bond_id ||
        targets?.bondId ||
        targets?.bond_broken ||
        targets?.broken_bond;
      const matchesBond = findBondPredicate(targetBond, targets);
      if (isCurrent) {
        bonds = bonds.map((bond) =>
          matchesBond(bond)
            ? { ...bond, status: 'breaking' }
            : bond
        );
      } else {
        bonds = bonds.filter((bond) => !matchesBond(bond));
      }
    } else if (action === 'BOND_FORM') {
      const { atom1, atom2, order = 1 } = targets || {};
      if (atom1 && atom2) {
        const existingIdx = bonds.findIndex(
          (b) =>
            (b.atom1 === atom1 && b.atom2 === atom2) ||
            (b.atom1 === atom2 && b.atom2 === atom1)
        );
        if (existingIdx >= 0) {
          bonds[existingIdx] = {
            ...bonds[existingIdx],
            order,
            status: isCurrent ? 'forming' : 'formed',
          };
        } else {
          bonds.push({
            id: `${atom1}-${atom2}`,
            atom1,
            atom2,
            order,
            status: isCurrent ? 'forming' : 'formed',
          });
        }
      }
    }
    else if (action === 'ELECTRON_PAIR_MOVE') {
      const fromBond = targets?.from_bond || targets?.bond;
      const toAtom = targets?.to_atom;
      const hasSubsequentBondBreak = steps.some(
        (st, idx) => idx > s && st.action === 'BOND_BREAK'
      );
      if (!hasSubsequentBondBreak && fromBond) {
        const matchesBond = findBondPredicate(fromBond, targets);
        if (isCurrent) {
          bonds = bonds.map((bond) =>
            matchesBond(bond)
              ? { ...bond, status: 'breaking' }
              : bond
          );
        } else {
          bonds = bonds.filter((bond) => !matchesBond(bond));
        }
      }
      if (toAtom) {
        const atom = atoms.find((a) => a.id === toAtom);
        if (atom && typeof atom.charge === 'number') {
          atom.charge = -1;
        }
      }
    }
    else if (action === 'PROTON_TRANSFER') {
      const hydrogenAtom = targets?.hydrogen_atom;
      const fromAtom = targets?.from_atom;
      const toAtom = targets?.to_atom;
      if (!hydrogenAtom) continue;
      if (fromAtom) {
        bonds = bonds.filter(
          (bond) =>
            !(
              (bond.atom1 === hydrogenAtom && bond.atom2 === fromAtom) ||
              (bond.atom1 === fromAtom && bond.atom2 === hydrogenAtom)
            )
        );
      }
      if (toAtom) {
        const alreadyExists = bonds.some(
          (bond) =>
            (bond.atom1 === toAtom && bond.atom2 === hydrogenAtom) ||
            (bond.atom1 === hydrogenAtom && bond.atom2 === toAtom)
        );
        if (!alreadyExists) {
          bonds.push({
            id: `${toAtom}-${hydrogenAtom}`,
            atom1: toAtom,
            atom2: hydrogenAtom,
            order: 1,
            status: isCurrent ? 'forming' : 'formed',
          });
        }
      }
    }
    else if (action === 'BASE_ABSTRACTION') {
    }
    else if (action === 'NUCLEOPHILE_ATTACK') {
    }
    else if (action === 'ELECTROPHILE_ATTACK') {
      const { pi_atom1, pi_atom2 } = targets || {};
      if (pi_atom1 && pi_atom2) {
        const matchesPiBond = (b) =>
          (b.atom1 === pi_atom1 && b.atom2 === pi_atom2) ||
          (b.atom1 === pi_atom2 && b.atom2 === pi_atom1);
        if (isCurrent) {
          bonds = bonds.map((b) => matchesPiBond(b) ? { ...b, status: 'breaking' } : b);
        } else {
          bonds = bonds.map((b) => {
            if (matchesPiBond(b) && b.order === 2) {
              return { ...b, order: 1, status: undefined };
            }
            return b;
          });
        }
      }
    }
    else if (action === 'CHARGE_CHANGE') {
      const { atom: atomId, new_charge } = targets || {};
      if (atomId && typeof new_charge === 'number') {
        const a = atoms.find((a) => a.id === atomId);
        if (a) a.charge = new_charge;
      }
    }
    else if (action === 'REARRANGEMENT') {
      const { migrating_atom, from_atom, to_atom } = targets || {};
      if (migrating_atom && from_atom && to_atom) {
        bonds = bonds.filter(
          (b) =>
            !(
              (b.atom1 === migrating_atom && b.atom2 === from_atom) ||
              (b.atom1 === from_atom && b.atom2 === migrating_atom)
            )
        );
        const alreadyExists = bonds.some(
          (b) =>
            (b.atom1 === migrating_atom && b.atom2 === to_atom) ||
            (b.atom1 === to_atom && b.atom2 === migrating_atom)
        );
        if (!alreadyExists) {
          bonds.push({
            id: `${migrating_atom}-${to_atom}`,
            atom1: migrating_atom,
            atom2: to_atom,
            order: 1,
            status: isCurrent ? 'forming' : 'formed',
          });
        }
      }
    }
    else if (action === 'RESONANCE') {
    }
    else if (action === 'OXIDATION_REDUCTION') {
      const { oxidized_atom, reduced_atom } = targets || {};
      if (oxidized_atom) {
        const a = atoms.find((a) => a.id === oxidized_atom);
        if (a && typeof a.charge === 'number') a.charge += 1;
      }
      if (reduced_atom) {
        const a = atoms.find((a) => a.id === reduced_atom);
        if (a && typeof a.charge === 'number') a.charge -= 1;
      }
    }
  } 
  console.log('=== MECHANISM DEBUG ===');
  console.log('Current step:', currentStep + 1);
  console.log('Active action:', activeStepData?.action);
  console.log(
    'Current bonds:',
    bonds.map((b) => ({
      id: b.id,
      atom1: b.atom1,
      atom2: b.atom2,
      order: b.order,
      status: b.status,
    }))
  );
  return {
    atoms,
    bonds,
    activeStepData,
  };
}
function renderMechanismArrow(activeStepData, atomPositions, bonds) {
  if (!activeStepData || !atomPositions) return null;
  const { action, targets } = activeStepData;
  if (!targets) return null;
  if (action === 'NUCLEOPHILE_ATTACK') {
    const nuc = atomPositions[targets.nucleophile_atom];
    const elec = atomPositions[targets.electrophile_atom];
    if (nuc && elec) {
      const dx = elec.x - nuc.x;
      const dy = elec.y - nuc.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = nuc.x + leftX * 16;
      const startY = nuc.y - 10;
      const endX = elec.x + leftX * 18;
      const endY = elec.y;
      const midX = (nuc.x + elec.x) / 2;
      const midY = (nuc.y + elec.y) / 2;
      const ctrlX = midX + leftX * 50;
      const ctrlY = midY + leftY * 50;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#2563eb',
      };
    }
  }
  if (action === 'BASE_ABSTRACTION') {
    const base = atomPositions[targets.base_atom];
    const h = atomPositions[targets.hydrogen_atom];
    if (base && h) {
      const dx = h.x - base.x;
      const dy = h.y - base.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = base.x + leftX * 16;
      const startY = base.y - 10;
      const endX = h.x + leftX * 16;
      const endY = h.y;
      const midX = (base.x + h.x) / 2;
      const midY = (base.y + h.y) / 2;
      const ctrlX = midX + leftX * 45;
      const ctrlY = midY + leftY * 45;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#8b5cf6',
      };
    }
  }
  if (action === 'ELECTRON_PAIR_MOVE') {
    const fromBondId = targets.from_bond || targets.bond;
    const toAtomId = targets.to_atom;
    const dest = atomPositions[toAtomId];
    const normBondId = typeof fromBondId === 'string' ? fromBondId.trim() : '';
    const bond = bonds.find(
      (b) =>
        b.id === normBondId ||
        b.id?.trim() === normBondId ||
        `${b.atom1}-${b.atom2}` === normBondId ||
        `${b.atom2}-${b.atom1}` === normBondId
    );
    if (dest && bond && atomPositions[bond.atom1] && atomPositions[bond.atom2]) {
      const a1 = atomPositions[bond.atom1];
      const a2 = atomPositions[bond.atom2];
      const midX = (a1.x + a2.x) / 2;
      const midY = (a1.y + a2.y) / 2;
      const dx = dest.x - midX;
      const dy = dest.y - midY;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = midX + leftX * 6;
      const startY = midY + leftY * 6;
      const endX = dest.x + leftX * 16 - ux * 4;
      const endY = dest.y + leftY * 16 - uy * 4;
      const ctrlX = (midX + dest.x) / 2 + leftX * 30;
      const ctrlY = (midY + dest.y) / 2 + leftY * 30;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#2563eb',
      };
    }
  }
  if (action === 'PROTON_TRANSFER') {
    const fromId = targets.from_atom || targets.atom1;
    const toId = targets.to_atom || targets.atom2;
    const fromAtom = atomPositions[fromId];
    const toAtom = atomPositions[toId];
    if (fromAtom && toAtom) {
      const dx = toAtom.x - fromAtom.x;
      const dy = toAtom.y - fromAtom.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = fromAtom.x + leftX * 16;
      const startY = fromAtom.y - 10;
      const endX = toAtom.x + leftX * 18;
      const endY = toAtom.y;
      const midX = (fromAtom.x + toAtom.x) / 2;
      const midY = (fromAtom.y + toAtom.y) / 2;
      const ctrlX = midX + leftX * 50;
      const ctrlY = midY + leftY * 50;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#10b981',
      };
    }
  }
  if (action === 'ELECTROPHILE_ATTACK') {
    const { electrophile_atom, pi_atom1, pi_atom2 } = targets;
    const elec = atomPositions[electrophile_atom];
    const pa1 = atomPositions[pi_atom1];
    const pa2 = atomPositions[pi_atom2];
    if (elec && pa1 && pa2) {
      const midX = (pa1.x + pa2.x) / 2;
      const midY = (pa1.y + pa2.y) / 2;
      const dx = elec.x - midX;
      const dy = elec.y - midY;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = midX + leftX * 8;
      const startY = midY + leftY * 8;
      const endX = elec.x - ux * 14;
      const endY = elec.y - uy * 14;
      const ctrlX = (midX + elec.x) / 2 + leftX * 40;
      const ctrlY = (midY + elec.y) / 2 + leftY * 40;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#f97316', 
      };
    }
  }
  if (action === 'CHARGE_CHANGE') {
    const { atom: atomId } = targets;
    const pos = atomPositions[atomId];
    if (pos) {
      const r = 28;
      return {
        path: `M ${pos.x - r} ${pos.y} A ${r} ${r} 0 1 1 ${pos.x + 1} ${pos.y - r}`,
        color: '#a855f7', 
      };
    }
  }
  if (action === 'REARRANGEMENT') {
    const { migrating_atom, from_atom, to_atom } = targets;
    const fromPos = atomPositions[from_atom];
    const toPos = atomPositions[to_atom];
    if (fromPos && toPos) {
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = fromPos.x + leftX * 14;
      const startY = fromPos.y + leftY * 14;
      const endX = toPos.x + leftX * 14 - ux * 14;
      const endY = toPos.y + leftY * 14 - uy * 14;
      const ctrlX = (fromPos.x + toPos.x) / 2 + leftX * 55;
      const ctrlY = (fromPos.y + toPos.y) / 2 + leftY * 55;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#f59e0b', 
      };
    }
  }
  if (action === 'RESONANCE') {
    const { from_atom, to_atom } = targets;
    const fromPos = atomPositions[from_atom];
    const toPos = atomPositions[to_atom];
    if (fromPos && toPos) {
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = fromPos.x + leftX * 12;
      const startY = fromPos.y + leftY * 12;
      const endX = toPos.x + leftX * 12 - ux * 14;
      const endY = toPos.y + leftY * 12 - uy * 14;
      const ctrlX = (fromPos.x + toPos.x) / 2 + leftX * 42;
      const ctrlY = (fromPos.y + toPos.y) / 2 + leftY * 42;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#14b8a6', 
      };
    }
  }
  if (action === 'OXIDATION_REDUCTION') {
    const { oxidized_atom, reduced_atom } = targets;
    const fromPos = atomPositions[oxidized_atom];
    const toPos = atomPositions[reduced_atom];
    if (fromPos && toPos) {
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const leftX = uy;
      const leftY = -ux;
      const startX = fromPos.x + leftX * 14;
      const startY = fromPos.y + leftY * 14;
      const endX = toPos.x + leftX * 14 - ux * 14;
      const endY = toPos.y + leftY * 14 - uy * 14;
      const ctrlX = (fromPos.x + toPos.x) / 2 + leftX * 50;
      const ctrlY = (fromPos.y + toPos.y) / 2 + leftY * 50;
      return {
        path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
        color: '#ef4444', 
      };
    }
  }
  return null;
}
function MoleculeVisualizer({ reactionData, currentStep = 0 }) {
  const reactionType = reactionData?.reaction?.type;
  const steps = reactionData?.steps || [];
  const currentStepData = steps[currentStep] || steps[0];
  const initialGraph = useMemo(() => {
    return buildInitialGraph(reactionData);
  }, [reactionData]);
  const atomPositions = useMemo(() => {
  return computeLayout(initialGraph, 640, 290);
}, [initialGraph]);
  const { atoms: currentAtoms, bonds: currentBonds } = useMemo(() => {
    return applyMechanismSteps(initialGraph, steps, currentStep);
  }, [initialGraph, steps, currentStep]);
  const mechanismArrow = useMemo(() => {
    return renderMechanismArrow(currentStepData, atomPositions, currentBonds);
  }, [currentStepData, atomPositions, currentBonds]);
  const formatAction = (action) => {
    if (!action) return 'Mechanism Step';
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  const stepNumber = currentStepData?.step || currentStep + 1;
  const stepActionText = formatAction(currentStepData?.action);
  const stepExplanation = currentStepData?.explanation;
  const activeAtomIds = useMemo(() => {
    const ids = new Set();
    if (!currentStepData?.targets) return ids;
    const t = currentStepData.targets;
    const fields = [
      'nucleophile_atom', 'electrophile_atom',  
      'base_atom', 'hydrogen_atom',              
      'atom1', 'atom2',                          
      'from_atom', 'to_atom',                    
      'pi_atom1', 'pi_atom2',                    
      'atom',                                    
      'migrating_atom',                          
      'oxidized_atom', 'reduced_atom',           
    ];
    fields.forEach((f) => { if (t[f]) ids.add(t[f]); });
    return ids;
  }, [currentStepData]);
  const products    = reactionData?.products || [];
  const isLastStep  = steps.length > 0 && currentStep === steps.length - 1;
  const productGraph     = useMemo(() => buildProductGraph(reactionData), [reactionData]);
  const productPositions = useMemo(() => computeLayout(productGraph, 640, 220), [productGraph]);
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '1.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginTop: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <style>{`
        @keyframes drawCurvedArrow {
          0% { stroke-dashoffset: 280; opacity: 0.2; }
          15% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes pulseHighlight {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
        @keyframes popInCharge {
          0% { opacity: 0; transform: scale(0.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animated-mechanism-arrow {
          stroke-dasharray: 280;
          stroke-dashoffset: 280;
          animation: drawCurvedArrow 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .pulsing-atom-halo {
          transform-origin: center;
          animation: pulseHighlight 1.8s ease-in-out infinite;
        }
        .charge-pop-in {
          animation: popInCharge 0.3s ease-out forwards;
        }
        .products-panel {
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
      `}</style>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Reaction Mechanism
        </h2>
        {reactionType && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            borderRadius: '999px'
          }}>
            {reactionType}
          </span>
        )}
      </div>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#2563eb',
        marginBottom: stepExplanation ? '0.35rem' : '1.25rem'
      }}>
        Step {stepNumber}: {stepActionText}
      </h3>
      {stepExplanation && (
        <p style={{
          fontSize: '0.92rem',
          color: '#475569',
          marginBottom: '1.25rem',
          lineHeight: 1.5
        }}>
          {stepExplanation}
        </p>
      )}
      <div style={{
        width: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        overflowX: 'auto'
      }}>
        <svg
          viewBox="0 0 640 300"
          style={{ width: '100%', maxWidth: '640px', height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <marker
              id="electron-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
            </marker>
            <marker
              id="purple-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#8b5cf6" />
            </marker>
            <marker
              id="green-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
            </marker>
            <marker
              id="orange-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f97316" />
            </marker>
            <marker
              id="amber-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
            <marker
              id="teal-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#14b8a6" />
            </marker>
            <marker
              id="red-arrowhead"
              viewBox="0 0 10 10"
              refX="6" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
            </marker>
          </defs>
          {initialGraph.molecules.length > 1 &&
            initialGraph.molecules.slice(0, -1).map((mol, idx) => {
              const plusX = ((idx + 1) / initialGraph.molecules.length) * 640;
              return (
                <text
                  key={`plus-${idx}`}
                  x={plusX}
                  y={155}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="24"
                  fontWeight="400"
                >
                  +
                </text>
              );
            })}
          {currentBonds.map((bond) => {
            const p1 = atomPositions[bond.atom1];
            const p2 = atomPositions[bond.atom2];
            if (!p1 || !p2) return null;
            const isBreaking = bond.status === 'breaking';
            const isForming = bond.status === 'forming';
            const stroke = isBreaking ? '#ef4444' : isForming ? '#2563eb' : '#94a3b8';
            const strokeWidth = isForming ? 3 : isBreaking ? 2 : 2.5;
            if (bond.order === 2) {
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const dist = Math.hypot(dx, dy) || 1;
              const px = (-dy / dist) * 3.5;
              const py = (dx / dist) * 3.5;
              return (
                <g key={bond.id}>
                  <line
                    x1={p1.x + px}
                    y1={p1.y + py}
                    x2={p2.x + px}
                    y2={p2.y + py}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isBreaking ? '5 4' : undefined}
                  />
                  <line
                    x1={p1.x - px}
                    y1={p1.y - py}
                    x2={p2.x - px}
                    y2={p2.y - py}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isBreaking ? '5 4' : undefined}
                  />
                </g>
              );
            }
            return (
              <line
                key={bond.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={isBreaking ? '5 4' : undefined}
                opacity={isBreaking ? 0.65 : 1}
              />
            );
          })}
          {mechanismArrow && (
            <path
              key={`arrow-${currentStep}`}
              d={mechanismArrow.path}
              fill="none"
              stroke={mechanismArrow.color}
              strokeWidth="2.75"
              strokeLinecap="round"
              markerEnd={
                mechanismArrow.color === '#8b5cf6' ? 'url(#purple-arrowhead)'
                : mechanismArrow.color === '#10b981' ? 'url(#green-arrowhead)'
                : mechanismArrow.color === '#f97316' ? 'url(#orange-arrowhead)'
                : mechanismArrow.color === '#f59e0b' ? 'url(#amber-arrowhead)'
                : mechanismArrow.color === '#14b8a6' ? 'url(#teal-arrowhead)'
                : mechanismArrow.color === '#ef4444' ? 'url(#red-arrowhead)'
                : mechanismArrow.color === '#a855f7' ? 'url(#purple-arrowhead)'
                : 'url(#electron-arrowhead)'
              }
              className="animated-mechanism-arrow"
            />
          )}
          {currentAtoms.map((atom) => {
            const pos = atomPositions[atom.id];
            if (!pos) return null;
            const isH  = atom.element === 'H';
            const isC  = atom.element === 'C';
            const isBr = atom.element === 'Br';
            const isO  = atom.element === 'O';
            const isN  = atom.element === 'N';
            const isCl = atom.element === 'Cl';
            const isF  = atom.element === 'F';
            const isI  = atom.element === 'I';
            const isS  = atom.element === 'S';
            const isP  = atom.element === 'P';
            const isMetal = ['Na', 'K', 'Fe', 'Cu', 'Zn', 'Mg', 'Al', 'Ca', 'Li'].includes(atom.element);
            const isActive = activeAtomIds.has(atom.id);
            const radius = isH ? 13 : 17;
            const fill = isC ? '#f1f5f9'
              : isBr  ? '#fef3c7'
              : isO   ? '#fee2e2'
              : isN   ? '#e0e7ff'
              : isCl  ? '#dcfce7'
              : isF   ? '#ecfdf5'
              : isI   ? '#faf5ff'
              : isS   ? '#fffbeb'
              : isP   ? '#fff7ed'
              : isMetal ? '#f0f9ff'
              : '#ffffff';
            const stroke = isC ? '#64748b'
              : isBr  ? '#d97706'
              : isO   ? '#ef4444'
              : isN   ? '#3b82f6'
              : isCl  ? '#16a34a'
              : isF   ? '#059669'
              : isI   ? '#7c3aed'
              : isS   ? '#ca8a04'
              : isP   ? '#ea580c'
              : isMetal ? '#0369a1'
              : '#cbd5e1';
            const strokeWidth = isH ? 1.5 : 2;
            const textColor = isC ? '#0f172a'
              : isBr  ? '#92400e'
              : isO   ? '#b91c1c'
              : isN   ? '#1e40af'
              : isCl  ? '#166534'
              : isF   ? '#065f46'
              : isI   ? '#5b21b6'
              : isS   ? '#92400e'
              : isP   ? '#9a3412'
              : isMetal ? '#075985'
              : '#475569';
            const fontSize = isH ? 11 : 13;
            const fontWeight = isH ? 600 : 700;
            const dy = isH ? 4 : 5;
            return (
              <g id={atom.id} key={atom.id} transform={`translate(${pos.x}, ${pos.y})`}>
                {isActive && (
                  <circle
                    r={radius + 6}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="pulsing-atom-halo"
                  />
                )}
                <circle r={radius} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                <text
                  textAnchor="middle"
                  dy={dy}
                  fill={textColor}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                >
                  {atom.element}
                </text>
                {atom.charge !== 0 && (
                  <g className="charge-pop-in">
                    <circle
                      cx="12"
                      cy="-12"
                      r="6.5"
                      fill={atom.charge > 0 ? '#2563eb' : '#ef4444'}
                    />
                    <text
                      x="12"
                      y="-9"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="700"
                    >
                      {atom.charge > 0 ? '+' : '−'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {}
      {isLastStep && productGraph.atoms.length > 0 && (
        <div
          className="products-panel"
          style={{
            marginTop: '1.25rem',
            borderRadius: '10px',
            border: '1.5px solid #bbf7d0',
            backgroundColor: '#f0fdf4',
            padding: '1rem 1.25rem',
          }}
        >
          {}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '22px', height: '22px', borderRadius: '50%',
              backgroundColor: '#16a34a', flexShrink: 0,
            }}>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#14532d' }}>
              Reaction Complete — Products Formed
            </h3>
            {reactionData?.reaction?.type && (
              <span style={{
                marginLeft: 'auto', padding: '0.15rem 0.5rem',
                backgroundColor: '#bbf7d0', color: '#14532d',
                borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
              }}>
                {reactionData.reaction.type}
              </span>
            )}
          </div>
          {}
          {productGraph.molecules.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '0.1rem' }}>
              {productGraph.molecules.map((mol) => (
                <div key={mol.id} style={{ textAlign: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#166534' }}>
                    {mol.formula || mol.name}
                  </span>
                  {mol.name && mol.formula && (
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#4b7c5e', fontWeight: 500 }}>
                      {mol.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {}
          <div style={{
            width: '100%', backgroundColor: '#ffffff',
            borderRadius: '8px', border: '1px solid #d1fae5',
            padding: '0.5rem', overflowX: 'auto',
          }}>
            <svg viewBox="0 0 640 220" style={{ width: '100%', maxWidth: '640px', height: 'auto', overflow: 'visible' }}>
              {}
              {productGraph.molecules.length > 1 &&
                productGraph.molecules.slice(0, -1).map((mol, idx) => {
                  const plusX = ((idx + 1) / productGraph.molecules.length) * 640;
                  return (
                    <text key={`pplus-${idx}`} x={plusX} y={115}
                      textAnchor="middle" fill="#94a3b8" fontSize="22" fontWeight="400">+</text>
                  );
                })}
              {}
              {productGraph.bonds.map((bond) => {
                const p1 = productPositions[bond.atom1];
                const p2 = productPositions[bond.atom2];
                if (!p1 || !p2) return null;
                const stroke = '#16a34a';  
                const sw = bond.order === 2 ? 2 : 2.5;
                if (bond.order === 2) {
                  const dx = p2.x - p1.x, dy = p2.y - p1.y;
                  const dist = Math.hypot(dx, dy) || 1;
                  const px = (-dy / dist) * 3.5, py = (dx / dist) * 3.5;
                  return (
                    <g key={bond.id}>
                      <line x1={p1.x + px} y1={p1.y + py} x2={p2.x + px} y2={p2.y + py} stroke={stroke} strokeWidth={sw} />
                      <line x1={p1.x - px} y1={p1.y - py} x2={p2.x - px} y2={p2.y - py} stroke={stroke} strokeWidth={sw} />
                    </g>
                  );
                }
                return (
                  <line key={bond.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={stroke} strokeWidth={sw} />
                );
              })}
              {}
              {productGraph.atoms.map((atom) => {
                const pos = productPositions[atom.id];
                if (!pos) return null;
                const isH    = atom.element === 'H';
                const isC    = atom.element === 'C';
                const isBr   = atom.element === 'Br';
                const isO    = atom.element === 'O';
                const isN    = atom.element === 'N';
                const isCl   = atom.element === 'Cl';
                const isF    = atom.element === 'F';
                const isI    = atom.element === 'I';
                const isS    = atom.element === 'S';
                const isP    = atom.element === 'P';
                const isMetal = ['Na','K','Fe','Cu','Zn','Mg','Al','Ca','Li'].includes(atom.element);
                const radius = isH ? 13 : 17;
                const fill = isC ? '#f0fdf4' : isBr ? '#fef3c7' : isO ? '#fee2e2'
                  : isN ? '#e0e7ff' : isCl ? '#dcfce7' : isF ? '#ecfdf5'
                  : isI ? '#faf5ff' : isS ? '#fffbeb' : isP ? '#fff7ed'
                  : isMetal ? '#f0f9ff' : '#ffffff';
                const stroke = isC ? '#16a34a' : isBr ? '#d97706' : isO ? '#ef4444'
                  : isN ? '#3b82f6' : isCl ? '#16a34a' : isF ? '#059669'
                  : isI ? '#7c3aed' : isS ? '#ca8a04' : isP ? '#ea580c'
                  : isMetal ? '#0369a1' : '#86efac';
                const textColor = isC ? '#14532d' : isBr ? '#92400e' : isO ? '#b91c1c'
                  : isN ? '#1e40af' : isCl ? '#166534' : isF ? '#065f46'
                  : isI ? '#5b21b6' : isS ? '#92400e' : isP ? '#9a3412'
                  : isMetal ? '#075985' : '#4b7c5e';
                return (
                  <g key={atom.id} transform={`translate(${pos.x}, ${pos.y})`}>
                    <circle r={radius} fill={fill} stroke={stroke} strokeWidth={isH ? 1.5 : 2} />
                    <text textAnchor="middle" dy={isH ? 4 : 5} fill={textColor}
                      fontSize={isH ? 11 : 13} fontWeight={isH ? 600 : 700}>
                      {atom.element}
                    </text>
                    {atom.charge !== 0 && (
                      <g>
                        <circle cx="12" cy="-12" r="6.5"
                          fill={atom.charge > 0 ? '#2563eb' : '#ef4444'} />
                        <text x="12" y="-9" textAnchor="middle"
                          fill="#ffffff" fontSize="9" fontWeight="700">
                          {atom.charge > 0 ? '+' : '−'}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          {}
          <p style={{ margin: '0.6rem 0 0', fontSize: '0.8rem', color: '#4b7c5e', lineHeight: 1.5 }}>
            <strong>Reaction:</strong> {reactionData?.reaction?.input}
          </p>
        </div>
      )}
    </div>
  );
}
export default MoleculeVisualizer;
