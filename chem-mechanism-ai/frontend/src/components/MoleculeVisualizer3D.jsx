import { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { buildInitialGraph, applyMechanismSteps, buildProductGraph } from '../utils/moleculeGraph';

const LERP_SPEED  = 4.5;
const ARROW_SPEED = 1.4;
const ANIM_MS     = 700;

const ELEMENT_CONFIG = {
  H:   { color:'#d8d8d8', emissive:'#444444', radius:0.28 },
  C:   { color:'#303030', emissive:'#181818', radius:0.40 },
  N:   { color:'#3050f8', emissive:'#0a20c8', radius:0.38 },
  O:   { color:'#ff2010', emissive:'#aa0000', radius:0.36 },
  F:   { color:'#90e050', emissive:'#50a010', radius:0.32 },
  Cl:  { color:'#1ff01f', emissive:'#00b000', radius:0.44 },
  Br:  { color:'#a52828', emissive:'#741818', radius:0.52 },
  I:   { color:'#940094', emissive:'#640064', radius:0.58 },
  S:   { color:'#e8e820', emissive:'#c8c800', radius:0.50 },
  P:   { color:'#ff8000', emissive:'#c85000', radius:0.48 },
  Na:  { color:'#ab5cf2', emissive:'#7b2cc2', radius:0.54 },
  K:   { color:'#8f40d4', emissive:'#5f10a4', radius:0.62 },
  Ca:  { color:'#3d9970', emissive:'#1d7750', radius:0.58 },
  Mg:  { color:'#8aff00', emissive:'#4aaf00', radius:0.52 },
  Fe:  { color:'#e06000', emissive:'#903000', radius:0.52 },
  Cu:  { color:'#c87533', emissive:'#884503', radius:0.50 },
  Zn:  { color:'#7d80b0', emissive:'#4d5080', radius:0.52 },
  Ag:  { color:'#c0c0c0', emissive:'#909090', radius:0.54 },
  Ba:  { color:'#00c900', emissive:'#008900', radius:0.62 },
  default:{ color:'#b0b0b0', emissive:'#808080', radius:0.42 },
};
const elCfg = el => ELEMENT_CONFIG[el] || ELEMENT_CONFIG.default;

const CATEGORY_FX = {
  COMBUSTION:    { color:'#f97316', glow:'#ef4444' },
  REDOX:         { color:'#818cf8', glow:'#6366f1' },
  NEUTRALIZATION:{ color:'#06b6d4', glow:'#0891b2' },
  PRECIPITATION: { color:'#10b981', glow:'#059669' },
  ORGANIC:       { color:'#a855f7', glow:'#7c3aed' },
  ACID_BASE:     { color:'#f59e0b', glow:'#d97706' },
  default:       { color:'#a855f7', glow:'#7c3aed' },
};
const getCategoryFx = cat => CATEGORY_FX[cat] || CATEGORY_FX.default;

const vNorm  = ([x,y,z]) => { const l=Math.sqrt(x*x+y*y+z*z)||1; return [x/l,y/l,z/l]; };
const vCross = ([ax,ay,az],[bx,by,bz]) => [ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx];
const vAdd   = ([ax,ay,az],[bx,by,bz]) => [ax+bx,ay+by,az+bz];
const vScale = ([x,y,z],s) => [x*s,y*s,z*s];
const vAddSc = (a,b,s) => vAdd(a,vScale(b,s));

function computeOutDirs(count, inDir) {
  if (count === 0) return [];
  if (inDir === null) {
    if (count === 1) return [[1,0,0]];
    if (count === 2) return [[1,0,0],[-1,0,0]];
    if (count === 3) {
      const a=(2*Math.PI)/3;
      return [[1,0,0],[Math.cos(a),Math.sin(a),0],[Math.cos(2*a),Math.sin(2*a),0]];
    }
    return [vNorm([1,0,-1/Math.SQRT2]),vNorm([-1,0,-1/Math.SQRT2]),vNorm([0,1,1/Math.SQRT2]),vNorm([0,-1,1/Math.SQRT2])];
  }
  const fwd=vNorm(inDir);
  if (count===1) return [fwd];
  const arb=Math.abs(fwd[1])<0.9?[0,1,0]:[1,0,0];
  const side=vNorm(vCross(fwd,arb));
  const up2=vCross(side,fwd);
  if (count===2) return [vNorm(vAddSc(fwd,side,Math.tan(Math.PI/3))),vNorm(vAddSc(fwd,side,-Math.tan(Math.PI/3)))];
  if (count===3) return [fwd,vNorm(vAddSc(fwd,side,1)),vNorm(vAddSc(fwd,side,-1))];
  const ca=Math.PI/3.5;
  return Array.from({length:count},(_,i)=>{
    const phi=2*Math.PI*i/count,s=Math.sin(ca),c=Math.cos(ca);
    return vNorm([fwd[0]*c+(side[0]*Math.cos(phi)+up2[0]*Math.sin(phi))*s,
                  fwd[1]*c+(side[1]*Math.cos(phi)+up2[1]*Math.sin(phi))*s,
                  fwd[2]*c+(side[2]*Math.cos(phi)+up2[2]*Math.sin(phi))*s]);
  });
}

function layoutMolecule(atoms, bonds, cx=0) {
  const pos={};
  if (!atoms.length) return pos;
  const adj={};
  atoms.forEach(a=>{ adj[a.id]=[]; });
  bonds.forEach(b=>{
    if (adj[b.atom1]!==undefined&&adj[b.atom2]!==undefined){
      adj[b.atom1].push(b.atom2);
      adj[b.atom2].push(b.atom1);
    }
  });
  const isH=id=>atoms.find(a=>a.id===id)?.element==='H';
  const isHeavy=id=>!isH(id);
  const heavy=atoms.filter(a=>a.element!=='H');
  const cands=heavy.length?heavy:atoms;
  const root=cands.reduce((best,a)=>{
    const d=(adj[a.id]||[]).filter(isHeavy).length;
    const bd=(adj[best.id]||[]).filter(isHeavy).length;
    return d>bd?a:best;
  });
  const visited=new Set([root.id]);
  pos[root.id]=[cx,0,0];
  const queue=[{id:root.id,inDir:null}];
  while(queue.length){
    const {id,inDir}=queue.shift();
    const p=pos[id];
    const unv=(adj[id]||[]).filter(n=>!visited.has(n));
    if(!unv.length) continue;
    const sorted=[...unv.filter(isHeavy),...unv.filter(n=>!isHeavy(n))];
    const dirs=computeOutDirs(sorted.length,inDir);
    sorted.forEach((nId,i)=>{
      visited.add(nId);
      const isHAtom=atoms.find(a=>a.id===nId)?.element==='H';
      const dist=isHAtom?1.09:1.54;
      const dir=dirs[i]||[1,0,0];
      pos[nId]=vAdd(p,vScale(dir,dist));
      queue.push({id:nId,inDir:dir});
    });
  }
  return pos;
}

function findSmartGroups(atoms, bonds, initialBonds) {
  const parent = {};
  atoms.forEach(a => { parent[a.id] = a.id; });
  const find = id => parent[id] === id ? id : (parent[id] = find(parent[id]));
  const union = (a, b) => { parent[find(a)] = find(b); };

  bonds.forEach(b => { if(parent[b.atom1]!==undefined && parent[b.atom2]!==undefined) union(b.atom1, b.atom2); });

  const isBondedInInitial = id => (initialBonds||[]).some(b => b.atom1===id || b.atom2===id);
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
  if(!atoms.length) return {};
  const groups = findSmartGroups(atoms, bonds, initialBonds);
  const sorted = [...groups].sort((a,b) => b.length - a.length);
  const SPACING = 5.5;
  const startX = -((sorted.length-1)*SPACING)/2;
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
  const ids=new Set();
  if(!activeStepData?.targets) return ids;
  ['nucleophile_atom','electrophile_atom','base_atom','hydrogen_atom',
   'atom','atom1','atom2','from_atom','to_atom','oxidized_atom','reduced_atom']
  .forEach(f=>{ if(activeStepData.targets[f]) ids.add(activeStepData.targets[f]); });
  return ids;
}

function getArrowParams(activeStepData, positions) {
  if(!activeStepData?.targets) return null;
  const {action,targets}=activeStepData;
  const get=id=>positions[id];
  const arrow=(from,to,color)=>{
    const fp=get(from),tp=get(to);
    return fp&&tp?{fromPos:fp,toPos:tp,color}:null;
  };
  switch(action){
    case 'NUCLEOPHILE_ATTACK':  return arrow(targets.nucleophile_atom,targets.electrophile_atom,'#a855f7');
    case 'BASE_ABSTRACTION':    return arrow(targets.base_atom,targets.hydrogen_atom,'#10b981');
    case 'ELECTRON_PAIR_MOVE':  return targets.from_atom&&targets.to_atom?arrow(targets.from_atom,targets.to_atom,'#f59e0b'):null;
    case 'PROTON_TRANSFER':     return arrow(targets.hydrogen_atom,targets.to_atom,'#06b6d4');
    case 'RESONANCE':           return arrow(targets.from_atom,targets.to_atom,'#ec4899');
    case 'OXIDATION_REDUCTION': return arrow(targets.reduced_atom,targets.oxidized_atom,'#818cf8');
    default: return null;
  }
}

function Atom3D({ atom, position, isActive, category }) {
  const cfg=elCfg(atom.element);
  const meshRef=useRef();
  const haloRef=useRef();
  const fx=getCategoryFx(category);
  const lerpPos=useRef(new THREE.Vector3(...(position||[0,0,0])));
  const targetPos=new THREE.Vector3(...(position||[0,0,0]));

  useFrame(({clock},delta)=>{
    if(!meshRef.current) return;
    lerpPos.current.lerp(targetPos, Math.min(1, LERP_SPEED*delta));
    meshRef.current.position.copy(lerpPos.current);
    if(haloRef.current){
      haloRef.current.position.copy(lerpPos.current);
      if(isActive){
        const t=clock.getElapsedTime();
        const s=1+0.18*Math.sin(t*4.5);
        haloRef.current.scale.setScalar(s);
        haloRef.current.material.opacity=0.18+0.18*Math.sin(t*4.5);
      }
    }
  });

  const label=atom.charge>0?`${atom.element}+`:atom.charge<0?`${atom.element}-`:atom.element;

  return (
    <group>
      {isActive&&(
        <mesh ref={haloRef} position={position}>
          <sphereGeometry args={[cfg.radius*1.7,16,16]}/>
          <meshBasicMaterial color={fx.glow} transparent opacity={0.2} depthWrite={false}/>
        </mesh>
      )}
      {atom.charge!==0&&(
        <mesh position={position}>
          <sphereGeometry args={[cfg.radius*1.38,14,14]}/>
          <meshBasicMaterial color={atom.charge>0?'#3b82f6':'#ef4444'} transparent opacity={0.18} depthWrite={false}/>
        </mesh>
      )}
      <mesh ref={meshRef} position={position} castShadow receiveShadow>
        <sphereGeometry args={[cfg.radius,32,32]}/>
        <meshStandardMaterial color={cfg.color} emissive={isActive?fx.glow:cfg.emissive} emissiveIntensity={isActive?0.4:0.15} roughness={0.35} metalness={0.1}/>
      </mesh>
      <Text position={[position[0],position[1]+cfg.radius+0.24,position[2]]}
        fontSize={label.length>2?0.18:0.23} color="#f1f5f9"
        anchorX="center" anchorY="bottom" outlineWidth={0.022} outlineColor="#000000" renderOrder={10}>
        {label}
      </Text>
    </group>
  );
}

function Bond3D({ atom1Pos, atom2Pos, order=1, status }) {
  const matRefs=[useRef(),useRef(),useRef()];
  const [x1,y1,z1]=atom1Pos,[x2,y2,z2]=atom2Pos;
  const mid=[(x1+x2)/2,(y1+y2)/2,(z1+z2)/2];
  const dx=x2-x1,dy=y2-y1,dz=z2-z1;
  const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
  if(len<0.01) return null;
  const dir=new THREE.Vector3(dx,dy,dz).normalize();
  const up=new THREE.Vector3(0,1,0);
  const quat=new THREE.Quaternion().setFromUnitVectors(up,dir);
  const rot=new THREE.Euler().setFromQuaternion(quat);
  const color=status==='breaking'?'#ef4444':status==='forming'?'#3b82f6':'#94a3b8';
  const R=0.09,O=0.14;
  const pd=new THREE.Vector3(dx,dy,dz).normalize();
  const arb2=Math.abs(pd.y)<0.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
  const perp=new THREE.Vector3().crossVectors(pd,arb2).normalize().multiplyScalar(O);

  useFrame(({clock})=>{
    const t=clock.getElapsedTime();
    matRefs.forEach(r=>{
      if(!r.current) return;
      if(status==='breaking'){
        r.current.opacity=0.3+0.5*Math.abs(Math.sin(t*6));
        r.current.transparent=true;
        r.current.color.set('#ef4444');
      } else if(status==='forming'){
        r.current.opacity=0.4+0.6*Math.abs(Math.sin(t*4));
        r.current.transparent=true;
        r.current.color.set('#3b82f6');
      } else {
        r.current.opacity=1;
        r.current.transparent=false;
        r.current.color.set('#94a3b8');
      }
    });
  });

  const cyl=(off,k,mRef)=>(
    <mesh key={k} position={[mid[0]+off[0],mid[1]+off[1],mid[2]+off[2]]} rotation={[rot.x,rot.y,rot.z]} castShadow>
      <cylinderGeometry args={[R,R,len,12]}/>
      <meshStandardMaterial ref={mRef} color={color} roughness={0.5} metalness={0.1}/>
    </mesh>
  );
  if(order===1) return cyl([0,0,0],'c0',matRefs[0]);
  if(order===2) return <group>{cyl([perp.x,perp.y,perp.z],'c1',matRefs[0])}{cyl([-perp.x,-perp.y,-perp.z],'c2',matRefs[1])}</group>;
  return <group>{cyl([0,0,0],'c0',matRefs[0])}{cyl([perp.x,perp.y,perp.z],'c1',matRefs[1])}{cyl([-perp.x,-perp.y,-perp.z],'c2',matRefs[2])}</group>;
}

function ElectronArrow3D({ fromPos, toPos, color='#a855f7', category }) {
  const [x1,y1,z1]=fromPos,[x2,y2,z2]=toPos;
  const ctrlX=(x1+x2)/2,ctrlY=Math.max(y1,y2)+1.8,ctrlZ=(z1+z2)/2+0.6;
  const curve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(x1,y1,z1),
    new THREE.Vector3(ctrlX,ctrlY,ctrlZ),
    new THREE.Vector3(x2,y2,z2),
  ]);
  const allPts=curve.getPoints(60);
  const progressRef=useRef(0);
  const visiblePtsRef=useRef([]);
  const lineRef=useRef();
  const headRef=useRef();

  useFrame((_,delta)=>{
    progressRef.current=Math.min(1,progressRef.current+delta*ARROW_SPEED);
    const p=progressRef.current;
    const count=Math.max(2,Math.floor(p*allPts.length));
    visiblePtsRef.current=allPts.slice(0,count).map(pt=>[pt.x,pt.y,pt.z]);
    if(lineRef.current){
      lineRef.current.material.opacity=0.5+0.4*Math.sin(Date.now()*0.003);
    }
    if(headRef.current&&count>1){
      const tip=allPts[count-1];
      const prev=allPts[Math.max(0,count-4)];
      const d=new THREE.Vector3().subVectors(tip,prev).normalize();
      const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d);
      headRef.current.position.set(tip.x,tip.y,tip.z);
      headRef.current.quaternion.copy(q);
    }
  });

  const fx=getCategoryFx(category);

  return (
    <group>
      <Line ref={lineRef}
        points={allPts.slice(0,Math.max(2,Math.floor(0.01*allPts.length))).map(p=>[p.x,p.y,p.z])}
        color={color} lineWidth={3}
        dashed dashSize={0.15} gapSize={0.07}
      />
      <mesh ref={headRef} position={[x1,y1,z1]}>
        <coneGeometry args={[0.09,0.3,8]}/>
        <meshStandardMaterial color={color} emissive={fx.glow} emissiveIntensity={0.7}/>
      </mesh>
    </group>
  );
}

function CameraSetup({ atomCount }) {
  useThree(({camera})=>{
    const z=Math.max(9,atomCount*0.8+5);
    camera.position.set(0,2.5,z);
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function Scene({ initialGraph, productGraph, steps, currentStep, category }) {
  const isLastStep = steps.length > 0 && currentStep === steps.length - 1;

  const { atoms, bonds, activeStepData } = useMemo(
    () => applyMechanismSteps(initialGraph, steps, currentStep),
    [initialGraph, steps, currentStep]
  );

  const layoutAtoms  = isLastStep ? productGraph.atoms  : atoms;
  const layoutBonds  = isLastStep ? productGraph.bonds  : bonds;
  const layoutInitialBonds = isLastStep ? [] : initialGraph.bonds;

  const positions = useMemo(
    () => compute3DLayoutForStep(layoutAtoms, layoutBonds, layoutInitialBonds),
    [layoutAtoms, layoutBonds, layoutInitialBonds]
  );

  const activeIds  = useMemo(() => getActiveAtomIds(activeStepData),  [activeStepData]);
  const arrowParam = useMemo(() => getArrowParams(activeStepData, positions), [activeStepData, positions]);
  const totalAtoms = initialGraph.atoms.length;

  return (
    <>
      <ambientLight intensity={0.65} color="#ddeeff"/>
      <directionalLight position={[6,8,5]} intensity={1.25} color="#ffffff" castShadow shadow-mapSize={[1024,1024]}/>
      <directionalLight position={[-4,-3,-6]} intensity={0.45} color="#aaccff"/>
      <pointLight position={[0,-5,0]} intensity={0.25} color="#fffbe6"/>
      <CameraSetup atomCount={totalAtoms}/>
      <OrbitControls enablePan enableZoom enableRotate dampingFactor={0.12} enableDamping minDistance={3} maxDistance={60}/>

      {bonds.map(bond=>{
        const p1=positions[bond.atom1],p2=positions[bond.atom2];
        if(!p1||!p2) return null;
        return <Bond3D key={bond.id} atom1Pos={p1} atom2Pos={p2} order={bond.order||1} status={bond.status}/>;
      })}

      {atoms.map(atom=>{
        const pos=positions[atom.id];
        if(!pos) return null;
        return <Atom3D key={atom.id} atom={atom} position={pos} isActive={activeIds.has(atom.id)} category={category}/>;
      })}

      {arrowParam&&(
        <ElectronArrow3D
          key={`arrow-${currentStep}`}
          fromPos={arrowParam.fromPos}
          toPos={arrowParam.toPos}
          color={arrowParam.color}
          category={category}
        />
      )}
    </>
  );
}

const ACTION_STYLE={
  NUCLEOPHILE_ATTACK:  {bg:'#2e1065',text:'#c084fc',label:'Nucleophile Attack'},
  ELECTROPHILE_ATTACK: {bg:'#431407',text:'#f97316',label:'Electrophile Attack'},
  BASE_ABSTRACTION:    {bg:'#052e16',text:'#4ade80',label:'Base Abstraction'},
  BOND_BREAK:          {bg:'#450a0a',text:'#f87171',label:'Bond Break'},
  BOND_FORM:           {bg:'#172554',text:'#60a5fa',label:'Bond Form'},
  ELECTRON_PAIR_MOVE:  {bg:'#451a03',text:'#fbbf24',label:'Electron Pair Move'},
  PROTON_TRANSFER:     {bg:'#164e63',text:'#67e8f9',label:'Proton Transfer'},
  CHARGE_CHANGE:       {bg:'#1e1b4b',text:'#818cf8',label:'Charge Change'},
  REARRANGEMENT:       {bg:'#4a1942',text:'#f0abfc',label:'Rearrangement'},
  RESONANCE:           {bg:'#500724',text:'#fb7185',label:'Resonance'},
  OXIDATION_REDUCTION: {bg:'#1c2841',text:'#93c5fd',label:'Redox'},
};

function MoleculeVisualizer3D({ reactionData, currentStep=0, onStepChange }) {
  const steps        =reactionData?.steps||[];
  const reactionType =reactionData?.reaction?.type||'';
  const category     =reactionData?._category||'';
  const activeStep   =steps[currentStep];
  const actionStyle  =ACTION_STYLE[activeStep?.action]||{bg:'#1e293b',text:'#94a3b8',label:activeStep?.action||''};
  const [locked,setLocked]=useState(false);

  const initialGraph  = useMemo(() => buildInitialGraph(reactionData),  [reactionData]);
  const productGraph  = useMemo(() => buildProductGraph(reactionData),   [reactionData]);
  if(!initialGraph.atoms.length) return null;

  const goStep=(dir)=>{
    if(locked) return;
    const next=currentStep+dir;
    if(next<0||next>=steps.length) return;
    setLocked(true);
    onStepChange?.(next);
    setTimeout(()=>setLocked(false),ANIM_MS);
  };

  const fx=getCategoryFx(category);

  return (
    <div style={{width:'100%',marginTop:'1.5rem',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{width:'100%',borderRadius:'12px',border:'1px solid #1e293b',overflow:'hidden',
        boxShadow:'0 4px 24px -4px rgba(0,0,0,0.45)',backgroundColor:'#0b0e14'}}>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0.75rem 1.25rem',borderBottom:'1px solid #1e2530'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.55rem'}}>
            <span style={{fontSize:'0.9rem',fontWeight:700,color:'#f1f5f9'}}>3D Mechanism View</span>
            {category&&(
              <span style={{fontSize:'0.65rem',fontWeight:700,color:fx.color,
                background:'#111827',padding:'0.1rem 0.45rem',borderRadius:'999px',
                border:`1px solid ${fx.color}`,letterSpacing:'0.06em'}}>
                {category}
              </span>
            )}
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
            {activeStep&&(
              <span style={{fontSize:'0.72rem',fontWeight:700,color:actionStyle.text,
                backgroundColor:actionStyle.bg,padding:'0.2rem 0.6rem',
                borderRadius:'999px',letterSpacing:'0.04em'}}>
                {actionStyle.label}
              </span>
            )}
            {reactionType&&(
              <span style={{fontSize:'0.72rem',fontWeight:700,color:'#60a5fa',
                backgroundColor:'#1e3a5f',padding:'0.2rem 0.6rem',
                borderRadius:'999px',letterSpacing:'0.06em',textTransform:'uppercase'}}>
                {reactionType}
              </span>
            )}
          </div>
        </div>

        {activeStep&&(
          <div style={{padding:'0.45rem 1.25rem',background:'#0f1117',
            borderBottom:'1px solid #1e2530',display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <span style={{fontSize:'0.72rem',fontWeight:700,color:'#475569',
              background:'#1e293b',padding:'0.1rem 0.45rem',borderRadius:'4px',whiteSpace:'nowrap'}}>
              Step {currentStep+1}/{steps.length}
            </span>
            <span style={{fontSize:'0.78rem',color:'#94a3b8',lineHeight:1.4}}>
              {activeStep.explanation}
            </span>
          </div>
        )}

        <div style={{padding:'0.28rem 1.25rem',background:'#0b0e14',
          borderBottom:'1px solid #1e2530',display:'flex',gap:'1.2rem',flexWrap:'wrap',alignItems:'center'}}>
          {[['#ef4444','Breaking'],['#3b82f6','Forming'],['#facc15','Active atom'],[fx.color,'Electron flow']].map(([c,label])=>(
            <span key={label} style={{display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.67rem',color:'#64748b'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:c,display:'inline-block'}}/>
              {label}
            </span>
          ))}
          <span style={{fontSize:'0.67rem',color:'#334155',marginLeft:'auto'}}>Drag · Scroll · Right-drag</span>
        </div>

        <div style={{width:'100%',height:'440px'}}>
          <Canvas shadows gl={{antialias:true,alpha:false}}
            camera={{fov:45,near:0.1,far:1000}}
            style={{background:'linear-gradient(145deg,#0f1117 0%,#141c2b 60%,#0a1020 100%)'}}>
            <Suspense fallback={null}>
              <Scene
                initialGraph={initialGraph}
                productGraph={productGraph}
                steps={steps}
                currentStep={currentStep}
                category={category}
              />
            </Suspense>
          </Canvas>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0.65rem 1.25rem',borderTop:'1px solid #1e2530',gap:'1rem',flexWrap:'wrap'}}>

          <div style={{display:'flex',gap:'0.5rem'}}>
            {(reactionData?.reactants||[]).map((mol,i)=>(
              <span key={mol.id} style={{display:'flex',alignItems:'center',gap:'0.35rem'}}>
                {i>0&&<span style={{color:'#475569',fontSize:'0.85rem'}}>+</span>}
                <span style={{fontSize:'0.78rem',fontFamily:'monospace',fontWeight:700,
                  color:'#93c5fd',backgroundColor:'#1e3a5f',
                  padding:'0.1rem 0.45rem',borderRadius:'4px'}}>
                  {mol.formula||mol.name}
                </span>
              </span>
            ))}
          </div>

          {onStepChange&&steps.length>1&&(
            <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
              <button onClick={()=>goStep(-1)} disabled={locked||currentStep===0}
                style={{padding:'0.3rem 0.9rem',borderRadius:'6px',border:'1px solid #334155',
                  background:locked||currentStep===0?'#0f172a':'#1e293b',
                  color:locked||currentStep===0?'#334155':'#94a3b8',
                  cursor:locked||currentStep===0?'not-allowed':'pointer',
                  fontSize:'0.78rem',fontWeight:600,transition:'all 0.2s'}}>
                ← Prev
              </button>
              <span style={{fontSize:'0.72rem',color:'#475569',minWidth:'60px',textAlign:'center'}}>
                {currentStep+1} / {steps.length}
              </span>
              <button onClick={()=>goStep(1)} disabled={locked||currentStep===steps.length-1}
                style={{padding:'0.3rem 0.9rem',borderRadius:'6px',border:'1px solid #334155',
                  background:locked||currentStep===steps.length-1?'#0f172a':'#1e293b',
                  color:locked||currentStep===steps.length-1?'#334155':'#94a3b8',
                  cursor:locked||currentStep===steps.length-1?'not-allowed':'pointer',
                  fontSize:'0.78rem',fontWeight:600,transition:'all 0.2s'}}>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoleculeVisualizer3D;
