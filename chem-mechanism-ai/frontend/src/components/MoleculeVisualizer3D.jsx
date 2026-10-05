import { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { buildInitialGraph, applyMechanismSteps } from '../utils/moleculeGraph';
const ELEMENT_CONFIG = {
  H: { color: '#d6e5ef', legendColor: '#d6e5ef', emissive: '#5b6772', radius: 0.28 },
  C: { color: '#4c5770', legendColor: '#6e7a94', emissive: '#1c2230', radius: 0.55 },
  N: { color: '#4b7bec', legendColor: '#4b7bec', emissive: '#183680', radius: 0.50 },
  O: { color: '#27bfd5', legendColor: '#46c5d5', emissive: '#0e5963', radius: 0.52 },
  F: { color: '#5ecb9f', legendColor: '#5ecb9f', emissive: '#1e563f', radius: 0.44 },
  Cl: { color: '#75b98b', legendColor: '#75b98b', emissive: '#2a4f36', radius: 0.60 },
  Br: { color: '#9270dc', legendColor: '#a087d8', emissive: '#422a70', radius: 0.67 },
  I: { color: '#845ec2', legendColor: '#845ec2', emissive: '#38205c', radius: 0.70 },
  S: { color: '#e5c058', legendColor: '#e5c058', emissive: '#574719', radius: 0.56 },
  P: { color: '#e89255', legendColor: '#e89255', emissive: '#5e3316', radius: 0.54 },
  Na: { color: '#a27bf0', legendColor: '#a27bf0', emissive: '#492a80', radius: 0.56 },
  K: { color: '#8d65e2', legendColor: '#8d65e2', emissive: '#3b236e', radius: 0.62 },
  Ca: { color: '#48a999', legendColor: '#48a999', emissive: '#174740', radius: 0.58 },
  Mg: { color: '#55c57a', legendColor: '#55c57a', emissive: '#1f5431', radius: 0.54 },
  Fe: { color: '#d97d52', legendColor: '#d97d52', emissive: '#592d18', radius: 0.54 },
  Cu: { color: '#cf8860', legendColor: '#cf8860', emissive: '#52311f', radius: 0.52 },
  Zn: { color: '#828aa8', legendColor: '#828aa8', emissive: '#2b3045', radius: 0.52 },
  Ag: { color: '#c5d0e0', legendColor: '#c5d0e0', emissive: '#556070', radius: 0.54 },
  Ba: { color: '#52b788', legendColor: '#52b788', emissive: '#1b4d38', radius: 0.62 },
  default: { color: '#7a869a', legendColor: '#7a869a', emissive: '#2c3545', radius: 0.45 },
};
const elCfg = el => ELEMENT_CONFIG[el] || ELEMENT_CONFIG.default;
const ELEMENT_NAMES = {
  H: 'Hydrogen',
  C: 'Carbon',
  N: 'Nitrogen',
  O: 'Oxygen',
  F: 'Fluorine',
  Cl: 'Chlorine',
  Br: 'Bromine',
  I: 'Iodine',
  S: 'Sulfur',
  P: 'Phosphorus',
  Na: 'Sodium',
  K: 'Potassium',
  Ca: 'Calcium',
  Mg: 'Magnesium',
  Fe: 'Iron',
  Cu: 'Copper',
  Zn: 'Zinc',
  Ag: 'Silver',
  Ba: 'Barium',
};
const CATEGORY_FX = {
  COMBUSTION: { color: '#f97316', glow: '#ef4444' },
  REDOX: { color: '#818cf8', glow: '#6366f1' },
  NEUTRALIZATION: { color: '#06b6d4', glow: '#0891b2' },
  PRECIPITATION: { color: '#10b981', glow: '#059669' },
  ORGANIC: { color: '#a855f7', glow: '#7c3aed' },
  ACID_BASE: { color: '#f59e0b', glow: '#d97706' },
  default: { color: '#a855f7', glow: '#7c3aed' },
};
const getCategoryFx = cat => CATEGORY_FX[cat] || CATEGORY_FX.default;
const vNorm = ([x, y, z]) => { const l = Math.sqrt(x * x + y * y + z * z) || 1; return [x / l, y / l, z / l]; };
const vCross = ([ax, ay, az], [bx, by, bz]) => [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
const vAdd = ([ax, ay, az], [bx, by, bz]) => [ax + bx, ay + by, az + bz];
const vScale = ([x, y, z], s) => [x * s, y * s, z * s];
const vAddSc = (a, b, s) => vAdd(a, vScale(b, s));
function computeOutDirs(count, inDir) {
  if (count === 0) return [];
  if (inDir === null) {
    if (count === 1) return [[1, 0, 0]];
    if (count === 2) return [[1, 0, 0], [-1, 0, 0]];
    if (count === 3) {
      const a = (2 * Math.PI) / 3;
      return [[1, 0, 0], [Math.cos(a), Math.sin(a), 0], [Math.cos(2 * a), Math.sin(2 * a), 0]];
    }
    return [vNorm([1, 0, -1 / Math.SQRT2]), vNorm([-1, 0, -1 / Math.SQRT2]), vNorm([0, 1, 1 / Math.SQRT2]), vNorm([0, -1, 1 / Math.SQRT2])];
  }
  const fwd = vNorm(inDir);
  if (count === 1) return [fwd];
  const arb = Math.abs(fwd[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const side = vNorm(vCross(fwd, arb));
  const up2 = vCross(side, fwd);
  if (count === 2) return [vNorm(vAddSc(fwd, side, Math.tan(Math.PI / 3))), vNorm(vAddSc(fwd, side, -Math.tan(Math.PI / 3)))];
  if (count === 3) return [fwd, vNorm(vAddSc(fwd, side, 1)), vNorm(vAddSc(fwd, side, -1))];
  const ca = Math.PI / 3.5;
  return Array.from({ length: count }, (_, i) => {
    const phi = 2 * Math.PI * i / count, s = Math.sin(ca), c = Math.cos(ca);
    return vNorm([fwd[0] * c + (side[0] * Math.cos(phi) + up2[0] * Math.sin(phi)) * s,
    fwd[1] * c + (side[1] * Math.cos(phi) + up2[1] * Math.sin(phi)) * s,
    fwd[2] * c + (side[2] * Math.cos(phi) + up2[2] * Math.sin(phi)) * s]);
  });
}
function layoutMolecule(atoms, bonds, cx = 0) {
  const pos = {};
  if (!atoms.length) return pos;
  const adj = {};
  atoms.forEach(a => { adj[a.id] = []; });
  bonds.forEach(b => {
    if (adj[b.atom1] !== undefined && adj[b.atom2] !== undefined) {
      adj[b.atom1].push(b.atom2);
      adj[b.atom2].push(b.atom1);
    }
  });
  const isH = id => atoms.find(a => a.id === id)?.element === 'H';
  const isHeavy = id => !isH(id);
  const heavy = atoms.filter(a => a.element !== 'H');
  const cands = heavy.length ? heavy : atoms;
  const root = cands.reduce((best, a) => {
    const d = (adj[a.id] || []).filter(isHeavy).length;
    const bd = (adj[best.id] || []).filter(isHeavy).length;
    return d > bd ? a : best;
  });
  const visited = new Set([root.id]);
  pos[root.id] = [cx, 0, 0];
  const queue = [{ id: root.id, inDir: null }];
  while (queue.length) {
    const { id, inDir } = queue.shift();
    const p = pos[id];
    const unv = (adj[id] || []).filter(n => !visited.has(n));
    if (!unv.length) continue;
    const sorted = [...unv.filter(isHeavy), ...unv.filter(n => !isHeavy(n))];
    const dirs = computeOutDirs(sorted.length, inDir);
    sorted.forEach((nId, i) => {
      visited.add(nId);
      const isHAtom = atoms.find(a => a.id === nId)?.element === 'H';
      const dist = isHAtom ? 1.09 : 1.54;
      const dir = dirs[i] || [1, 0, 0];
      pos[nId] = vAdd(p, vScale(dir, dist));
      queue.push({ id: nId, inDir: dir });
    });
  }
  return pos;
}
function findSmartGroups(atoms, bonds, initialBonds) {
  const parent = {};
  atoms.forEach(a => { parent[a.id] = a.id; });
  const find = id => parent[id] === id ? id : (parent[id] = find(parent[id]));
  const union = (a, b) => { parent[find(a)] = find(b); };
  bonds.forEach(b => { if (parent[b.atom1] !== undefined && parent[b.atom2] !== undefined) union(b.atom1, b.atom2); });
  const isBondedInInitial = id => (initialBonds || []).some(b => b.atom1 === id || b.atom2 === id);
  const atomHasBond = new Set();
  bonds.forEach(b => { atomHasBond.add(b.atom1); atomHasBond.add(b.atom2); });
  const molGroups = {};
  atoms.forEach(a => {
    const mid = a.moleculeId || '__none__';
    if (!molGroups[mid]) molGroups[mid] = [];
    molGroups[mid].push(a.id);
  });
  Object.values(molGroups).forEach(ids => {
    const bondedInMol = ids.filter(id => atomHasBond.has(id));
    ids.forEach(id => {
      if (atomHasBond.has(id)) return;
      if (isBondedInInitial(id)) return;
      if (bondedInMol.length > 0) {
        union(id, bondedInMol[0]);
      } else {
        union(id, ids[0]);
      }
    });
  });
  const groups = {};
  atoms.forEach(a => {
    const root = find(a.id);
    if (!groups[root]) groups[root] = [];
    groups[root].push(a.id);
  });
  return Object.values(groups);
}
function compute3DLayoutForStep(atoms, bonds, initialBonds) {
  if (!atoms.length) return {};
  const groups = findSmartGroups(atoms, bonds, initialBonds);
  const sorted = [...groups].sort((a, b) => b.length - a.length);
  const SPACING = 5.5;
  const startX = -((sorted.length - 1) * SPACING) / 2;
  const positions = {};
  sorted.forEach((groupIds, idx) => {
    const cx = startX + idx * SPACING;
    const gAtoms = atoms.filter(a => groupIds.includes(a.id));
    const gBonds = bonds.filter(b => groupIds.includes(b.atom1) && groupIds.includes(b.atom2));
    Object.assign(positions, layoutMolecule(gAtoms, gBonds, cx));
  });
  return positions;
}
function getActiveAtomIds(activeStepData) {
  const ids = new Set();
  if (!activeStepData?.targets) return ids;
  ['nucleophile_atom', 'electrophile_atom', 'base_atom', 'hydrogen_atom',
    'atom', 'atom1', 'atom2', 'from_atom', 'to_atom', 'oxidized_atom', 'reduced_atom']
    .forEach(f => { if (activeStepData.targets[f]) ids.add(activeStepData.targets[f]); });
  return ids;
}
function getArrowParams(activeStepData, positions) {
  if (!activeStepData?.targets) return null;
  const { action, targets } = activeStepData;
  const get = id => positions[id];
  const arrow = (from, to, color) => {
    const fp = get(from), tp = get(to);
    return fp && tp ? { fromPos: fp, toPos: tp, color } : null;
  };
  switch (action) {
    case 'NUCLEOPHILE_ATTACK': return arrow(targets.nucleophile_atom, targets.electrophile_atom, '#a855f7');
    case 'BASE_ABSTRACTION': return arrow(targets.base_atom, targets.hydrogen_atom, '#10b981');
    case 'ELECTRON_PAIR_MOVE': return targets.from_atom && targets.to_atom ? arrow(targets.from_atom, targets.to_atom, '#f59e0b') : null;
    case 'PROTON_TRANSFER': return arrow(targets.hydrogen_atom, targets.to_atom, '#06b6d4');
    case 'RESONANCE': return arrow(targets.from_atom, targets.to_atom, '#ec4899');
    case 'OXIDATION_REDUCTION': return arrow(targets.reduced_atom, targets.oxidized_atom, '#818cf8');
    default: return null;
  }
}
function Atom3D({ atom, position, isActive, category }) {
  const cfg = elCfg(atom.element);
  const meshRef = useRef();
  const haloRef = useRef();
  const fx = getCategoryFx(category);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.position.set(position[0], position[1], position[2]);
    if (haloRef.current) {
      haloRef.current.position.set(position[0], position[1], position[2]);
      if (isActive) {
        const t = clock.getElapsedTime();
        const s = 1 + 0.18 * Math.sin(t * 4.5);
        haloRef.current.scale.setScalar(s);
        haloRef.current.material.opacity = 0.18 + 0.18 * Math.sin(t * 4.5);
      }
    }
  });
  const label = atom.charge > 0 ? `${atom.element}+` : atom.charge < 0 ? `${atom.element}-` : atom.element;
  return (
    <group>
      {isActive && (
        <mesh ref={haloRef} position={position}>
          <sphereGeometry args={[cfg.radius * 1.7, 16, 16]} />
          <meshBasicMaterial color={fx.glow} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      )}
      {atom.charge !== 0 && (
        <mesh position={position}>
          <sphereGeometry args={[cfg.radius * 1.38, 14, 14]} />
          <meshBasicMaterial color={atom.charge > 0 ? '#3b82f6' : '#ef4444'} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}
      <mesh ref={meshRef} position={position} castShadow receiveShadow>
        <sphereGeometry args={[cfg.radius, 32, 32]} />
        <meshStandardMaterial
          color={cfg.color}
          emissive={isActive ? fx.glow : (cfg.emissive || '#000000')}
          emissiveIntensity={isActive ? 0.35 : 0.08}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      <Text position={[position[0], position[1] + cfg.radius + 0.24, position[2]]}
        fontSize={label.length > 2 ? 0.18 : 0.23} color="#f1f5f9"
        anchorX="center" anchorY="bottom" outlineWidth={0.022} outlineColor="#000000" renderOrder={10}>
        {label}
      </Text>
    </group>
  );
}
function Bond3D({ atom1Pos, atom2Pos, order = 1, status, opacity = 1, radiusFactor = 1 }) {
  const matRefs = [useRef(), useRef(), useRef()];
  const [x1, y1, z1] = atom1Pos, [x2, y2, z2] = atom2Pos;
  const mid = [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const dir = new THREE.Vector3(dx, dy, dz).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
  const rot = new THREE.Euler().setFromQuaternion(quat);
  const color = status === 'breaking' ? '#ef4444' : status === 'forming' ? '#27bfd5' : '#8895ae';
  const R = 0.09 * Math.max(0.15, radiusFactor), O = 0.14;
  const pd = new THREE.Vector3(dx, dy, dz).normalize();
  const arb2 = Math.abs(pd.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const perp = new THREE.Vector3().crossVectors(pd, arb2).normalize().multiplyScalar(O);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    matRefs.forEach(r => {
      if (!r.current) return;
      if (status === 'breaking') {
        r.current.opacity = Math.max(0, opacity * (0.4 + 0.6 * Math.abs(Math.sin(t * 6))));
        r.current.transparent = true;
        r.current.color.set('#ef4444');
      } else if (status === 'forming') {
        r.current.opacity = Math.min(1, opacity * (0.5 + 0.5 * Math.abs(Math.sin(t * 4))));
        r.current.transparent = true;
        r.current.color.set('#27bfd5');
      } else {
        r.current.opacity = opacity;
        r.current.transparent = opacity < 0.99;
        r.current.color.set('#8895ae');
      }
    });
  });
  if (len < 0.01) return null;
  const cyl = (off, k, mRef) => (
    <mesh key={k} position={[mid[0] + off[0], mid[1] + off[1], mid[2] + off[2]]} rotation={[rot.x, rot.y, rot.z]} castShadow>
      <cylinderGeometry args={[R, R, len, 12]} />
      <meshStandardMaterial ref={mRef} color={color} roughness={0.5} metalness={0.1} transparent={opacity < 0.99} opacity={opacity} />
    </mesh>
  );
  if (order === 1) return cyl([0, 0, 0], 'c0', matRefs[0]);
  if (order === 2) return <group>{cyl([perp.x, perp.y, perp.z], 'c1', matRefs[0])}{cyl([-perp.x, -perp.y, -perp.z], 'c2', matRefs[1])}</group>;
  return <group>{cyl([0, 0, 0], 'c0', matRefs[0])}{cyl([perp.x, perp.y, perp.z], 'c1', matRefs[1])}{cyl([-perp.x, -perp.y, -perp.z], 'c2', matRefs[2])}</group>;
}
function ElectronArrow3D({ fromPos, toPos, color = '#a855f7', category, opacity = 1 }) {
  const lineRef = useRef();
  const headRef = useRef();
  const geoRef = useRef();
  const beadRef = useRef();
  const curveRef = useRef(null);
  const allPtsRef = useRef([]);
  const [x1, y1, z1] = fromPos;
  const [x2, y2, z2] = toPos;
  useMemo(() => {
    const ctrlX = (x1 + x2) / 2;
    const ctrlY = Math.max(y1, y2) + 1.8;
    const ctrlZ = (z1 + z2) / 2 + 0.5;
    curveRef.current = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(ctrlX, ctrlY, ctrlZ),
      new THREE.Vector3(x2, y2, z2),
    ]);
    allPtsRef.current = curveRef.current.getPoints(64);
  }, [x1, y1, z1, x2, y2, z2]);
  const TOTAL = 65;
  const initPositions = useMemo(() => new Float32Array(TOTAL * 3), []);
  useFrame(({ clock }) => {
    const pts = allPtsRef.current;
    if (!pts || pts.length < 2) return;
    if (geoRef.current && geoRef.current.attributes.position) {
      const pos = geoRef.current.attributes.position.array;
      for (let i = 0; i < pts.length; i++) {
        pos[i * 3] = pts[i].x;
        pos[i * 3 + 1] = pts[i].y;
        pos[i * 3 + 2] = pts[i].z;
      }
      geoRef.current.attributes.position.needsUpdate = true;
      geoRef.current.setDrawRange(0, pts.length);
    }
    if (headRef.current && pts.length > 1) {
      const tip = pts[pts.length - 1];
      const prev = pts[Math.max(0, pts.length - 4)] || pts[0];
      const d = new THREE.Vector3().subVectors(tip, prev).normalize();
      if (d.length() > 0.001) {
        headRef.current.position.set(tip.x, tip.y, tip.z);
        headRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      }
    }
    if (beadRef.current && curveRef.current) {
      const tPulse = (clock.getElapsedTime() * 0.8) % 1;
      const pt = curveRef.current.getPoint(tPulse);
      beadRef.current.position.set(pt.x, pt.y, pt.z);
    }
  });
  const fx = getCategoryFx(category);
  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry ref={geoRef} onUpdate={g => g.setDrawRange(0, 0)}>
          <bufferAttribute
            attach="attributes.position"
            array={initPositions}
            count={TOTAL}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.85 * opacity} linewidth={2} />
      </line>
      <mesh ref={headRef} position={[x1, y1, z1]}>
        <coneGeometry args={[0.10, 0.32, 8]} />
        <meshStandardMaterial color={color} emissive={fx.glow} emissiveIntensity={0.9} transparent opacity={opacity} />
      </mesh>
      <mesh ref={beadRef} position={[x1, y1, z1]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
function CameraSetup({ atomCount }) {
  useThree(({ camera }) => {
    const z = Math.max(9, atomCount * 0.8 + 5);
    camera.position.set(0, 2.5, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}
function Scene({ initialGraph, steps, progress = 0, category }) {
  const milestones = useMemo(() => {
    if (!steps || steps.length === 0) return [];
    return steps.map((_, idx) => {
      const state = applyMechanismSteps(initialGraph, steps, idx);
      const pos = compute3DLayoutForStep(state.atoms, state.bonds, initialGraph?.bonds || []);
      return { state, pos };
    });
  }, [initialGraph, steps]);
  const numMilestones = milestones.length;
  const interpolated = useMemo(() => {
    if (numMilestones === 0) return { positions: {}, bonds: [], activeStepData: null, currentIdx: 0, arrowOpacity: 1 };
    if (numMilestones === 1) {
      return {
        positions: milestones[0].pos,
        bonds: milestones[0].state.bonds,
        activeStepData: milestones[0].state.activeStepData,
        currentIdx: 0,
        arrowOpacity: 1,
      };
    }
    const totalTransitions = numMilestones - 1;
    const v = progress * totalTransitions;
    const k = Math.min(Math.floor(v), totalTransitions - 1);
    const k2 = k + 1;
    const rawFrac = Math.max(0, Math.min(1, v - k));
    const s = rawFrac * rawFrac * (3 - 2 * rawFrac);
    const posK = milestones[k]?.pos || {};
    const posK2 = milestones[k2]?.pos || {};
    const interpPos = {};
    initialGraph.atoms.forEach(a => {
      const p1 = posK[a.id] || [0, 0, 0];
      const p2 = posK2[a.id] || p1;
      interpPos[a.id] = [
        p1[0] + (p2[0] - p1[0]) * s,
        p1[1] + (p2[1] - p1[1]) * s,
        p1[2] + (p2[2] - p1[2]) * s,
      ];
    });
    const bondsMap = new Map();
    (milestones[k]?.state?.bonds || []).forEach(b => {
      bondsMap.set(b.id, {
        ...b,
        status: b.status,
        opacity: b.status === 'breaking' ? Math.max(0, 1 - s) : 1,
        radiusFactor: b.status === 'breaking' ? Math.max(0.1, 1 - 0.7 * s) : 1,
      });
    });
    (milestones[k2]?.state?.bonds || []).forEach(b => {
      if (bondsMap.has(b.id)) {
        if (b.status === 'forming') {
          const existing = bondsMap.get(b.id);
          existing.status = 'forming';
          existing.opacity = Math.min(1, s);
          existing.radiusFactor = Math.min(1, 0.3 + 0.7 * s);
        }
      } else {
        bondsMap.set(b.id, {
          ...b,
          status: 'forming',
          opacity: Math.min(1, s),
          radiusFactor: Math.min(1, 0.3 + 0.7 * s),
        });
      }
    });
    const activeState = rawFrac < 0.5 ? milestones[k] : milestones[k2];
    const arrowOpacity = Math.sin(rawFrac * Math.PI);
    return {
      positions: interpPos,
      bonds: Array.from(bondsMap.values()).filter(b => b.opacity > 0.02),
      activeStepData: activeState?.state?.activeStepData || null,
      currentIdx: rawFrac < 0.5 ? k : k2,
      arrowOpacity,
    };
  }, [milestones, numMilestones, progress, initialGraph]);
  const activeIds = useMemo(() => getActiveAtomIds(interpolated.activeStepData), [interpolated.activeStepData]);
  const arrowParam = useMemo(() => getArrowParams(interpolated.activeStepData, interpolated.positions), [interpolated.activeStepData, interpolated.positions]);
  const totalAtoms = initialGraph.atoms.length;
  return (
    <>
      <ambientLight intensity={0.65} color="#ddeeff" />
      <directionalLight position={[6, 8, 5]} intensity={1.25} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, -3, -6]} intensity={0.45} color="#aaccff" />
      <pointLight position={[0, -5, 0]} intensity={0.25} color="#fffbe6" />
      <CameraSetup atomCount={totalAtoms} />
      <OrbitControls enablePan enableZoom enableRotate dampingFactor={0.12} enableDamping minDistance={3} maxDistance={60} />
      {interpolated.bonds.map(bond => {
        const p1 = interpolated.positions[bond.atom1], p2 = interpolated.positions[bond.atom2];
        if (!p1 || !p2) return null;
        return (
          <Bond3D
            key={bond.id}
            atom1Pos={p1}
            atom2Pos={p2}
            order={bond.order || 1}
            status={bond.status}
            opacity={bond.opacity}
            radiusFactor={bond.radiusFactor}
          />
        );
      })}
      {initialGraph.atoms.map(atom => {
        const pos = interpolated.positions[atom.id];
        if (!pos) return null;
        return <Atom3D key={atom.id} atom={atom} position={pos} isActive={activeIds.has(atom.id)} category={category} />;
      })}
      {arrowParam && interpolated.arrowOpacity > 0.05 && (
        <ElectronArrow3D
          key={`arrow-${interpolated.currentIdx}`}
          fromPos={arrowParam.fromPos}
          toPos={arrowParam.toPos}
          color={arrowParam.color}
          category={category}
          opacity={interpolated.arrowOpacity}
        />
      )}
    </>
  );
}
const ACTION_STYLE = {
  NUCLEOPHILE_ATTACK: { bg: '#2e1065', text: '#c084fc', label: 'Nucleophile Attack' },
  ELECTROPHILE_ATTACK: { bg: '#431407', text: '#f97316', label: 'Electrophile Attack' },
  BASE_ABSTRACTION: { bg: '#052e16', text: '#4ade80', label: 'Base Abstraction' },
  BOND_BREAK: { bg: '#450a0a', text: '#f87171', label: 'Bond Break' },
  BOND_FORM: { bg: '#172554', text: '#60a5fa', label: 'Bond Form' },
  ELECTRON_PAIR_MOVE: { bg: '#451a03', text: '#fbbf24', label: 'Electron Pair Move' },
  PROTON_TRANSFER: { bg: '#164e63', text: '#67e8f9', label: 'Proton Transfer' },
  CHARGE_CHANGE: { bg: '#1e1b4b', text: '#818cf8', label: 'Charge Change' },
  REARRANGEMENT: { bg: '#4a1942', text: '#f0abfc', label: 'Rearrangement' },
  RESONANCE: { bg: '#500724', text: '#fb7185', label: 'Resonance' },
  OXIDATION_REDUCTION: { bg: '#1c2841', text: '#93c5fd', label: 'Redox' },
};
function MoleculeVisualizer3D({
  reactionData,
  progress = 0,
  onProgressChange,
  currentStep = 0,
  isPlaying = false,
  onPlayToggle,
  playbackSpeed = 1,
  onSpeedChange,
  onRestart,
}) {
  const steps = reactionData?.steps || [];
  const reactionType = reactionData?.reaction?.type || '';
  const category = reactionData?._category || '';
  const activeStep = steps[currentStep] || steps[0];
  const actionStyle = ACTION_STYLE[activeStep?.action] || { bg: '#1e293b', text: '#94a3b8', label: activeStep?.action || 'Reaction State' };
  const initialGraph = useMemo(() => buildInitialGraph(reactionData), [reactionData]);
  const presentElements = useMemo(() => {
    if (!initialGraph?.atoms) return [];
    return Array.from(new Set(initialGraph.atoms.map(a => a.element)));
  }, [initialGraph]);
  if (!initialGraph.atoms.length) return null;
  const pubchem = reactionData?._pubchem || null;
  return (
    <section className="visualizer" style={{ marginTop: '22px' }}>
      {}
      <div className="visualizer-top">
        <div className="simulation-title">
          <span className="live-dot" />
          <span>{reactionData?.reaction?.name || reactionData?.reaction?.input || '3D Molecular Simulation'}</span>
          <span className="divider" />
          <span className="simulation-subtitle">{category || 'Concerted Mechanism'}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {pubchem?.verified && (
            <span
              className="mechanism-badge"
              style={{
                color: '#34d399',
                borderColor: 'rgba(52,211,153,0.35)',
                background: 'rgba(52,211,153,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Formulas & charges verified against NIH PubChem"
            >
              PUBCHEM VERIFIED
            </span>
          )}
          <span className="mechanism-badge">{reactionType || category || 'MECHANISM'}</span>
        </div>
      </div>
      {}
      <div className="molecular-stage">
        <div className="scene-glow" />
        {activeStep && (
          <div className="stage-description">
            <div className="stage-index">
              STAGE 0{currentStep + 1} / 0{Math.max(1, steps.length)} &bull; {actionStyle.label.toUpperCase()}
            </div>
            <h2>{activeStep.name || actionStyle.label}</h2>
            <p>{activeStep.explanation}</p>
          </div>
        )}
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 45, near: 0.1, far: 1000 }}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          <Suspense fallback={null}>
            <Scene
              initialGraph={initialGraph}
              steps={steps}
              progress={progress}
              category={category}
            />
          </Suspense>
        </Canvas>
        <div className="scene-bottom">
          <div className="orbit-hint" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            <span>Drag to rotate &bull; Scroll to zoom &bull; Right-click to pan</span>
          </div>
          <div className="atom-legend">
            {presentElements.map(el => (
              <span key={el}>
                <i style={{ background: elCfg(el).legendColor || elCfg(el).color }} />
                {ELEMENT_NAMES[el] || el}
              </span>
            ))}
          </div>
        </div>
      </div>
      {}
      <div className="simulation-controls">
        <button className="play-button" type="button" onClick={onPlayToggle}>
          {isPlaying ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {progress >= 0.99 ? 'Replay' : 'Play'}
            </>
          )}
        </button>
        <button
          className="restart-button"
          type="button"
          onClick={onRestart || (() => onProgressChange?.(0))}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Restart
        </button>
        {}
        <div className="timeline">
          <input
            type="range"
            min="0"
            max="1000"
            value={Math.round(progress * 1000)}
            onChange={(e) => onProgressChange?.(Number(e.target.value) / 1000)}
            aria-label="Reaction timeline"
            style={{
              background: `linear-gradient(to right, #9e87ed ${progress * 100}%, rgba(255, 255, 255, 0.12) ${progress * 100}%)`,
            }}
          />
          <div className="timeline-labels">
            {steps.map((s, idx) => (
              <span
                key={idx}
                className={idx === currentStep ? 'current' : ''}
                onClick={() => onStepChange?.(idx)}
                style={{ cursor: 'pointer' }}
              >
                {s.name || `Step ${idx + 1}`}
              </span>
            ))}
          </div>
        </div>
        {}
        <div className="time-display">
          {`0${Math.floor(progress * 5.9)}:${String(Math.floor((progress * 5.9 * 100) % 100)).padStart(2, '0')}`}
        </div>
        {}
        <div className="speed-selector" style={{ position: 'relative', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <select
            value={playbackSpeed}
            onChange={(e) => onSpeedChange?.(Number(e.target.value))}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              minWidth: '60px',
              textAlign: 'center'
            }}
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
            <option value={4}>4.0x</option>
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '6px', pointerEvents: 'none', color: '#94a3b8' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </section>
  );
}
export default MoleculeVisualizer3D;
