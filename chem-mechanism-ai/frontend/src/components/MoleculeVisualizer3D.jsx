import { useMemo, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { buildInitialGraph, applyMechanismSteps } from '../utils/moleculeGraph';

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
  default:{ color:'#b0b0b0', emissive:'#808080', radius:0.42 },
};
const elCfg = el => ELEMENT_CONFIG[el] || ELEMENT_CONFIG.default;

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
      const a = (2*Math.PI)/3;
      return [[1,0,0],[Math.cos(a),Math.sin(a),0],[Math.cos(2*a),Math.sin(2*a),0]];
    }
    return [
      vNorm([1,0,-1/Math.SQRT2]), vNorm([-1,0,-1/Math.SQRT2]),
      vNorm([0,1,1/Math.SQRT2]),  vNorm([0,-1,1/Math.SQRT2]),
    ];
  }
  const fwd = vNorm(inDir);
  if (count === 1) return [fwd];
  const arb  = Math.abs(fwd[1]) < 0.9 ? [0,1,0] : [1,0,0];
  const side = vNorm(vCross(fwd,arb));
  const up2  = vCross(side,fwd);
  if (count === 2) return [vNorm(vAddSc(fwd,side,Math.tan(Math.PI/3))),vNorm(vAddSc(fwd,side,-Math.tan(Math.PI/3)))];
  if (count === 3) return [fwd,vNorm(vAddSc(fwd,side,1)),vNorm(vAddSc(fwd,side,-1))];
  const ca = Math.PI/3.5;
  return Array.from({length:count},(_,i)=>{
    const phi=2*Math.PI*i/count, s=Math.sin(ca), c=Math.cos(ca);
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
    if (adj[b.atom1]!==undefined && adj[b.atom2]!==undefined) {
      adj[b.atom1].push(b.atom2);
      adj[b.atom2].push(b.atom1);
    }
  });
  const isH     = id => atoms.find(a=>a.id===id)?.element==='H';
  const isHeavy = id => !isH(id);
  const heavy   = atoms.filter(a=>a.element!=='H');
  const cands   = heavy.length ? heavy : atoms;
  const root    = cands.reduce((best,a)=>{
    const d =(adj[a.id]||[]).filter(isHeavy).length;
    const bd=(adj[best.id]||[]).filter(isHeavy).length;
    return d>bd ? a : best;
  });
  const visited=new Set([root.id]);
  pos[root.id]=[cx,0,0];
  const queue=[{id:root.id,inDir:null}];
  while (queue.length) {
    const {id,inDir}=queue.shift();
    const p=pos[id];
    const unv=(adj[id]||[]).filter(n=>!visited.has(n));
    if (!unv.length) continue;
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

function findConnectedComponents(atoms, bonds) {
  const adj={};
  atoms.forEach(a=>{ adj[a.id]=[]; });
  bonds.forEach(b=>{
    if (adj[b.atom1]!==undefined && adj[b.atom2]!==undefined) {
      adj[b.atom1].push(b.atom2);
      adj[b.atom2].push(b.atom1);
    }
  });
  const visited=new Set();
  const components=[];
  atoms.forEach(atom=>{
    if (visited.has(atom.id)) return;
    const comp=[];
    const queue=[atom.id];
    visited.add(atom.id);
    while (queue.length) {
      const id=queue.shift();
      comp.push(id);
      (adj[id]||[]).forEach(n=>{ if(!visited.has(n)){visited.add(n);queue.push(n);} });
    }
    components.push(comp);
  });
  return components;
}

function compute3DLayoutForStep(atoms, bonds) {
  if (!atoms.length) return {};

  
  const components = findConnectedComponents(atoms, bonds);

  
  const sorted = [...components].sort((a,b)=>b.length-a.length);

  const SPACING = 5.5;
  const startX  = -((sorted.length-1)*SPACING)/2;
  const positions = {};

  sorted.forEach((compIds,idx)=>{
    const cx = startX + idx*SPACING;
    const compAtoms = atoms.filter(a=>compIds.includes(a.id));
    const compBonds = bonds.filter(b=>compIds.includes(b.atom1)&&compIds.includes(b.atom2));
    const pos = layoutMolecule(compAtoms, compBonds, cx);
    Object.assign(positions, pos);
  });

  return positions;
}

function Atom3D({ atom, position, isActive }) {
  const cfg = elCfg(atom.element);
  const [x,y,z] = position;
  const haloRef = useRef();

  useFrame(({clock})=>{
    if (isActive && haloRef.current) {
      const t=clock.getElapsedTime();
      haloRef.current.scale.setScalar(1+0.15*Math.sin(t*4));
      haloRef.current.material.opacity=0.2+0.2*Math.sin(t*4);
    }
  });

  const label =
    atom.charge>0 ? `${atom.element}+` :
    atom.charge<0 ? `${atom.element}-` :
    atom.element;

  return (
    <group position={[x,y,z]}>
      {}
      {isActive && (
        <mesh ref={haloRef}>
          <sphereGeometry args={[cfg.radius*1.6,16,16]}/>
          <meshBasicMaterial color="#facc15" transparent opacity={0.22} depthWrite={false}/>
        </mesh>
      )}
      {}
      {atom.charge!==0 && (
        <mesh>
          <sphereGeometry args={[cfg.radius*1.35,16,16]}/>
          <meshBasicMaterial color={atom.charge>0?'#3b82f6':'#ef4444'} transparent opacity={0.20} depthWrite={false}/>
        </mesh>
      )}
      {}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[cfg.radius,32,32]}/>
        <meshStandardMaterial color={cfg.color} emissive={cfg.emissive} emissiveIntensity={0.15} roughness={0.35} metalness={0.1}/>
      </mesh>
      {}
      <Text
        position={[0,cfg.radius+0.22,0]}
        fontSize={label.length>2?0.18:0.23}
        color="#f1f5f9" anchorX="center" anchorY="bottom"
        outlineWidth={0.022} outlineColor="#000000" renderOrder={10}
      >
        {label}
      </Text>
    </group>
  );
}

function Bond3D({ atom1Pos, atom2Pos, order=1, status }) {
  const [x1,y1,z1]=atom1Pos, [x2,y2,z2]=atom2Pos;
  const mid=[(x1+x2)/2,(y1+y2)/2,(z1+z2)/2];
  const dx=x2-x1,dy=y2-y1,dz=z2-z1;
  const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
  if (len<0.01) return null;

  const dir=new THREE.Vector3(dx,dy,dz).normalize();
  const up=new THREE.Vector3(0,1,0);
  const quat=new THREE.Quaternion().setFromUnitVectors(up,dir);
  const rot=new THREE.Euler().setFromQuaternion(quat);

  const matRef=useRef();
  useFrame(({clock})=>{
    if (!matRef.current) return;
    const t=clock.getElapsedTime();
    if (status==='breaking') {
      matRef.current.opacity=0.35+0.4*Math.abs(Math.sin(t*5));
      matRef.current.transparent=true;
    } else if (status==='forming') {
      matRef.current.opacity=0.45+0.55*Math.abs(Math.sin(t*4));
      matRef.current.transparent=true;
    } else {
      matRef.current.opacity=1;
      matRef.current.transparent=false;
    }
  });

  const color = status==='breaking'?'#ef4444' : status==='forming'?'#3b82f6' : '#94a3b8';
  const R=0.09, O=0.14;
  const pd=new THREE.Vector3(dx,dy,dz).normalize();
  const arb=Math.abs(pd.y)<0.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
  const perp=new THREE.Vector3().crossVectors(pd,arb).normalize().multiplyScalar(O);

  const cyl=(off=[0,0,0],k='c')=>(
    <mesh key={k} position={[mid[0]+off[0],mid[1]+off[1],mid[2]+off[2]]}
          rotation={[rot.x,rot.y,rot.z]} castShadow>
      <cylinderGeometry args={[R,R,len,12]}/>
      <meshStandardMaterial ref={matRef} color={color} roughness={0.5} metalness={0.1}
        transparent={status==='breaking'||status==='forming'}
      />
    </mesh>
  );

  if (order===1) return cyl();
  if (order===2) return <group>{cyl([perp.x,perp.y,perp.z],'a')}{cyl([-perp.x,-perp.y,-perp.z],'b')}</group>;
  return <group>{cyl([0,0,0],'c0')}{cyl([perp.x,perp.y,perp.z],'c1')}{cyl([-perp.x,-perp.y,-perp.z],'c2')}</group>;
}

function ElectronArrow3D({ fromPos, toPos, color='#a855f7' }) {
  const [x1,y1,z1]=fromPos,[x2,y2,z2]=toPos;
  const ctrlX=(x1+x2)/2, ctrlY=Math.max(y1,y2)+1.6, ctrlZ=(z1+z2)/2+0.5;
  const curve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(x1,y1,z1),
    new THREE.Vector3(ctrlX,ctrlY,ctrlZ),
    new THREE.Vector3(x2,y2,z2),
  ]);
  const pts=curve.getPoints(50);
  const lineRef=useRef();
  useFrame(({clock})=>{
    if (lineRef.current?.material) {
      lineRef.current.material.opacity=0.6+0.4*Math.abs(Math.sin(clock.getElapsedTime()*3));
    }
  });
  const last=pts[pts.length-1], prev=pts[pts.length-5];
  const aDir=new THREE.Vector3().subVectors(last,prev).normalize();
  const aUp=new THREE.Vector3(0,1,0);
  const aQ=new THREE.Quaternion().setFromUnitVectors(aUp,aDir);
  const aRot=new THREE.Euler().setFromQuaternion(aQ);
  return (
    <group>
      <Line ref={lineRef}
        points={pts.map(p=>[p.x,p.y,p.z])}
        color={color} lineWidth={2.8}
        dashed dashSize={0.18} gapSize={0.09}
      />
      <mesh position={[last.x,last.y,last.z]} rotation={[aRot.x,aRot.y,aRot.z]}>
        <coneGeometry args={[0.08,0.28,8]}/>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6}/>
      </mesh>
    </group>
  );
}

function getArrowParams(activeStepData, positions) {
  if (!activeStepData?.targets) return null;
  const {action,targets}=activeStepData;
  const get=id=>positions[id];
  const arrow=(from,to,color)=>{
    const fp=get(from),tp=get(to);
    return fp&&tp ? {fromPos:fp,toPos:tp,color} : null;
  };
  switch(action){
    case 'NUCLEOPHILE_ATTACK':  return arrow(targets.nucleophile_atom, targets.electrophile_atom,'#a855f7');
    case 'BASE_ABSTRACTION':    return arrow(targets.base_atom,        targets.hydrogen_atom,     '#10b981');
    case 'ELECTRON_PAIR_MOVE':  return targets.from_atom&&targets.to_atom
                                       ? arrow(targets.from_atom,targets.to_atom,'#f59e0b') : null;
    case 'PROTON_TRANSFER':     return arrow(targets.hydrogen_atom, targets.to_atom,              '#06b6d4');
    case 'RESONANCE':           return arrow(targets.from_atom,     targets.to_atom,              '#ec4899');
    case 'OXIDATION_REDUCTION': return arrow(targets.reduced_atom,  targets.oxidized_atom,        '#818cf8');
    default: return null;
  }
}

function getActiveAtomIds(activeStepData) {
  const ids=new Set();
  if (!activeStepData?.targets) return ids;
  ['nucleophile_atom','electrophile_atom','base_atom','hydrogen_atom',
   'atom','atom1','atom2','from_atom','to_atom','oxidized_atom','reduced_atom']
  .forEach(f=>{ if(activeStepData.targets[f]) ids.add(activeStepData.targets[f]); });
  return ids;
}

function CameraSetup({ atomCount }) {
  useThree(({camera})=>{
    const z=Math.max(9, atomCount*0.8+5);
    camera.position.set(0,2.5,z);
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function Scene({ initialGraph, steps, currentStep }) {
  
  const { atoms, bonds, activeStepData } = useMemo(
    () => applyMechanismSteps(initialGraph, steps, currentStep),
    [initialGraph, steps, currentStep]
  );

  
  
  
  
  
  
  
  
  
  const positions = useMemo(
    () => compute3DLayoutForStep(atoms, bonds),
    [atoms, bonds]
  );

  const activeIds  = useMemo(()=>getActiveAtomIds(activeStepData), [activeStepData]);
  const arrowParam = useMemo(()=>getArrowParams(activeStepData, positions), [activeStepData, positions]);
  const totalAtoms = initialGraph.atoms.length;

  return (
    <>
      {}
      <ambientLight intensity={0.65} color="#ddeeff"/>
      <directionalLight position={[6,8,5]}    intensity={1.25} color="#ffffff" castShadow shadow-mapSize={[1024,1024]}/>
      <directionalLight position={[-4,-3,-6]}  intensity={0.45} color="#aaccff"/>
      <pointLight       position={[0,-5,0]}    intensity={0.25} color="#fffbe6"/>

      <CameraSetup atomCount={totalAtoms}/>
      <OrbitControls enablePan enableZoom enableRotate dampingFactor={0.12} enableDamping minDistance={3} maxDistance={50}/>

      {}
      {bonds.map(bond=>{
        const p1=positions[bond.atom1], p2=positions[bond.atom2];
        if (!p1||!p2) return null;
        return <Bond3D key={bond.id} atom1Pos={p1} atom2Pos={p2} order={bond.order||1} status={bond.status}/>;
      })}

      {}
      {atoms.map(atom=>{
        const pos=positions[atom.id];
        if (!pos) return null;
        return <Atom3D key={atom.id} atom={atom} position={pos} isActive={activeIds.has(atom.id)}/>;
      })}

      {}
      {arrowParam && (
        <ElectronArrow3D fromPos={arrowParam.fromPos} toPos={arrowParam.toPos} color={arrowParam.color}/>
      )}
    </>
  );
}

const ACTION_STYLE = {
  NUCLEOPHILE_ATTACK:  { bg:'#2e1065', text:'#c084fc', label:'Nucleophile Attack'  },
  ELECTROPHILE_ATTACK: { bg:'#431407', text:'#f97316', label:'Electrophile Attack' },
  BASE_ABSTRACTION:    { bg:'#052e16', text:'#4ade80', label:'Base Abstraction'    },
  BOND_BREAK:          { bg:'#450a0a', text:'#f87171', label:'Bond Break'          },
  BOND_FORM:           { bg:'#172554', text:'#60a5fa', label:'Bond Form'           },
  ELECTRON_PAIR_MOVE:  { bg:'#451a03', text:'#fbbf24', label:'Electron Pair Move'  },
  PROTON_TRANSFER:     { bg:'#164e63', text:'#67e8f9', label:'Proton Transfer'     },
  CHARGE_CHANGE:       { bg:'#1e1b4b', text:'#818cf8', label:'Charge Change'       },
  REARRANGEMENT:       { bg:'#4a1942', text:'#f0abfc', label:'Rearrangement'       },
  RESONANCE:           { bg:'#500724', text:'#fb7185', label:'Resonance'           },
  OXIDATION_REDUCTION: { bg:'#1c2841', text:'#93c5fd', label:'Redox'               },
};

function MoleculeVisualizer3D({ reactionData, currentStep=0 }) {
  const steps        = reactionData?.steps || [];
  const reactionType = reactionData?.reaction?.type  || '';
  const activeStep   = steps[currentStep];
  const actionStyle  = ACTION_STYLE[activeStep?.action] || { bg:'#1e293b', text:'#94a3b8', label:activeStep?.action||'' };

  const initialGraph = useMemo(()=>buildInitialGraph(reactionData), [reactionData]);
  if (!initialGraph.atoms.length) return null;

  return (
    <div style={{ width:'100%', marginTop:'1.5rem', fontFamily:'Inter,system-ui,sans-serif' }}>
      <div style={{
        width:'100%', borderRadius:'12px', border:'1px solid #1e293b',
        overflow:'hidden', boxShadow:'0 4px 24px -4px rgba(0,0,0,0.45)',
        backgroundColor:'#0b0e14',
      }}>

        {}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'0.75rem 1.25rem', borderBottom:'1px solid #1e2530' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="21" r="1.5"/>
              <circle cx="3" cy="12" r="1.5"/><circle cx="21" cy="12" r="1.5"/>
              <line x1="12" y1="4.5" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="19.5"/>
              <line x1="4.5" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="19.5" y2="12"/>
            </svg>
            <span style={{ fontSize:'0.9rem', fontWeight:700, color:'#f1f5f9' }}>3D Molecular View</span>
          </div>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            {activeStep && (
              <span style={{ fontSize:'0.72rem', fontWeight:700, color:actionStyle.text,
                             backgroundColor:actionStyle.bg, padding:'0.2rem 0.6rem',
                             borderRadius:'999px', letterSpacing:'0.04em' }}>
                {actionStyle.label}
              </span>
            )}
            {reactionType && (
              <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#60a5fa',
                             backgroundColor:'#1e3a5f', padding:'0.2rem 0.6rem',
                             borderRadius:'999px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                {reactionType}
              </span>
            )}
          </div>
        </div>

        {}
        {activeStep && (
          <div style={{ padding:'0.45rem 1.25rem', background:'#0f1117',
                        borderBottom:'1px solid #1e2530', display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#475569',
                           background:'#1e293b', padding:'0.1rem 0.45rem', borderRadius:'4px' }}>
              Step {currentStep+1}/{steps.length}
            </span>
            <span style={{ fontSize:'0.78rem', color:'#94a3b8', lineHeight:1.4 }}>
              {activeStep.explanation}
            </span>
          </div>
        )}

        {}
        <div style={{ padding:'0.28rem 1.25rem', background:'#0b0e14',
                      borderBottom:'1px solid #1e2530', display:'flex', gap:'1.2rem', flexWrap:'wrap' }}>
          {[['#ef4444','Breaking'],['#3b82f6','Forming'],['#facc15','Active atom'],['#a855f7','Electron flow']].map(([c,label])=>(
            <span key={label} style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.67rem', color:'#64748b' }}>
              <span style={{ width:8,height:8,borderRadius:'50%',background:c,display:'inline-block' }}/>
              {label}
            </span>
          ))}
          <span style={{ fontSize:'0.67rem', color:'#334155', marginLeft:'auto' }}>
            Drag · Scroll · Right-drag
          </span>
        </div>

        {}
        <div style={{ width:'100%', height:'440px' }}>
          <Canvas shadows gl={{ antialias:true, alpha:false }}
            camera={{ fov:45, near:0.1, far:1000 }}
            style={{ background:'linear-gradient(145deg,#0f1117 0%,#141c2b 60%,#0a1020 100%)' }}>
            <Suspense fallback={null}>
              <Scene initialGraph={initialGraph} steps={steps} currentStep={currentStep}/>
            </Suspense>
          </Canvas>
        </div>

        {}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'0.5rem',
                      padding:'0.55rem 1.25rem', borderTop:'1px solid #1e2530' }}>
          {(reactionData?.reactants||[]).map((mol,i)=>(
            <span key={mol.id} style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
              {i>0 && <span style={{ color:'#475569', fontSize:'0.85rem' }}>+</span>}
              <span style={{ fontSize:'0.78rem', fontFamily:'monospace', fontWeight:700,
                             color:'#93c5fd', backgroundColor:'#1e3a5f',
                             padding:'0.1rem 0.45rem', borderRadius:'4px' }}>
                {mol.formula||mol.name}
              </span>
              {mol.name&&mol.formula && <span style={{ fontSize:'0.7rem', color:'#64748b' }}>{mol.name}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoleculeVisualizer3D;
