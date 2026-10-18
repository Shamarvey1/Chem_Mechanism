# Inorganic Chemical Reactions — 3D Mechanism Reference
# Charge convention: OXIDATION STATES throughout (consistent for all inorganic reactions)
# H in compounds = +1, O in compounds = -2 (except H2O2 where O = -1), elemental forms = 0
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Redox Reactions (Single Displacement / Electron Transfer)

### Prototype A: Iron + Copper Sulfate (Redox)
Reaction name: Redox reaction of iron and copper sulfate
Also known as: Fe CuSO4, iron copper sulfate displacement, single displacement redox
Equation: Fe + CuSO4 -> FeSO4 + Cu
Reactants: Iron metal (Fe), Copper(II) sulfate (CuSO4)
Products: Iron(II) sulfate (FeSO4), Copper metal (Cu)

ELECTRON FLOW: Fe⁰ donates 2 electrons to Cu²⁺
  Fe⁰  →  Fe²⁺  +  2e⁻    (Fe is OXIDISED — loses electrons)
  Cu²⁺ +  2e⁻  →  Cu⁰     (Cu is REDUCED  — gains electrons)
  Electron arrow: Fe → Cu²⁺

Atoms in Fe:
  Fe1 (iron, charge 0)

Atoms in CuSO4 (oxidation states: Cu=+2, S=+6, O=-2):
  Cu1 (copper,  charge +2)
  S1  (sulfur,  charge +6)
  O1  (oxygen,  charge -2)   ← bonded to both Cu and S (bridging O)
  O2  (oxygen,  charge -2)   ← bonded to both Cu and S (bridging O)
  O3  (oxygen,  charge -2)   ← terminal S=O (double bond)
  O4  (oxygen,  charge -2)   ← terminal S=O (double bond)
Charge check: Cu(+2) + S(+6) + 4×O(-2) = +2+6-8 = 0 ✓ (neutral molecule)

Bonds in CuSO4:
  bond-Cu1-O1  (Cu–O ionic, order 1)
  bond-Cu1-O2  (Cu–O ionic, order 1)
  bond-S1-O1   (S–O single, order 1)
  bond-S1-O2   (S–O single, order 1)
  bond-S1-O3   (S–O double, order 2)
  bond-S1-O4   (S–O double, order 2)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-Cu1-O1. First Cu–O ionic bond breaks; Cu²⁺ begins to dissociate from sulfate in solution.
2. BOND_BREAK: bond=bond-Cu1-O2. Second Cu–O ionic bond breaks; Cu²⁺ ion is fully free in solution. Sulfate SO₄²⁻ is also free.
3. OXIDATION_REDUCTION: oxidized_atom=Fe1, reduced_atom=Cu1. Fe⁰ metal donates 2 electrons to free Cu²⁺. Electron flow direction: Fe → Cu²⁺.
4. CHARGE_CHANGE: atom=Fe1, new_charge=2. Fe⁰ oxidised to Fe²⁺ (loses 2 electrons).
5. CHARGE_CHANGE: atom=Cu1, new_charge=0. Cu²⁺ reduced to Cu⁰ (gains 2 electrons); copper metal precipitates out of solution.
6. BOND_FORM: atom1=Fe1, atom2=O1, order=1. Free Fe²⁺ forms first ionic bond with sulfate oxygen O1.
7. BOND_FORM: atom1=Fe1, atom2=O2, order=1. Fe²⁺ forms second ionic bond with sulfate oxygen O2; FeSO4 complex is complete.

---

### Prototype B: Zinc + Hydrochloric Acid (Redox)
Reaction name: Redox reaction of zinc and hydrochloric acid
Also known as: Zn HCl, zinc acid, zinc hydrogen gas, single displacement acid metal
Equation: Zn + 2HCl -> ZnCl2 + H2
Reactants: Zinc metal (Zn), Hydrochloric acid × 2 molecules (HCl)
Products: Zinc chloride (ZnCl2), Hydrogen gas (H2)

ELECTRON FLOW: Zn⁰ donates 2 electrons (one to each H⁺)
  Zn⁰  →  Zn²⁺  +  2e⁻    (Zn is OXIDISED — loses 2 electrons)
  2H⁺  +  2e⁻  →  H₂      (H is REDUCED   — each H⁺ gains 1 electron → H⁰ → H₂)
  Electron arrow: Zn → H⁺

Atoms in Zn:
  Zn1 (zinc, charge 0)

Atoms in HCl (molecule 1)  — oxidation states: H=+1, Cl=-1:
  H1  (hydrogen, charge +1)
  Cl1 (chlorine,  charge -1)
Bonds in HCl (molecule 1):
  bond-H1-Cl1 (H–Cl covalent, order 1)

Atoms in HCl (molecule 2)  — oxidation states: H=+1, Cl=-1:
  H2  (hydrogen, charge +1)
  Cl2 (chlorine,  charge -1)
Bonds in HCl (molecule 2):
  bond-H2-Cl2 (H–Cl covalent, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-H1-Cl1. First H–Cl bond breaks heterolytically. H1 (charge +1) and Cl1 (charge -1) separate; no charge change needed (already ionic).
2. BOND_BREAK: bond=bond-H2-Cl2. Second H–Cl bond breaks heterolytically. H2 (charge +1) and Cl2 (charge -1) separate; no charge change needed.
3. OXIDATION_REDUCTION: oxidized_atom=Zn1, reduced_atom=H1. Zn⁰ donates first electron to H1⁺; electron flow: Zn → H1⁺.
4. CHARGE_CHANGE: atom=H1, new_charge=0. H1⁺ reduced to neutral H1⁰ atom (gained 1 electron from Zn).
5. OXIDATION_REDUCTION: oxidized_atom=Zn1, reduced_atom=H2. Zn⁰ donates second electron to H2⁺; electron flow: Zn → H2⁺.
6. CHARGE_CHANGE: atom=H2, new_charge=0. H2⁺ reduced to neutral H2⁰ atom (gained 1 electron from Zn).
7. CHARGE_CHANGE: atom=Zn1, new_charge=2. Zn⁰ fully oxidised to Zn²⁺ after donating both electrons.
8. BOND_FORM: atom1=H1, atom2=H2, order=1. Two neutral H atoms bond together; H–H single bond of hydrogen gas (H₂) is released.
9. BOND_FORM: atom1=Zn1, atom2=Cl1, order=1. Zn²⁺ forms first ionic bond with Cl⁻.
10. BOND_FORM: atom1=Zn1, atom2=Cl2, order=1. Zn²⁺ forms second ionic bond with Cl⁻; ZnCl₂ is complete.

---

## Neutralization Reactions (Acid-Base / Proton Transfer)

### Prototype: Sodium Hydroxide + Hydrochloric Acid
Reaction name: Neutralization of HCl and NaOH
Also known as: NaOH HCl neutralization, hydrochloric acid sodium hydroxide, acid base neutralization, strong acid strong base
Equation: NaOH + HCl -> NaCl + H2O
Reactants: Sodium hydroxide (NaOH), Hydrochloric acid (HCl)
Products: Sodium chloride (NaCl), Water (H2O)

ELECTRON FLOW: This is a proton transfer (Brønsted-Lowry acid-base), NOT a redox reaction.
  No oxidation states change. H⁺ is transferred from HCl to OH⁻.
  HCl → H⁺ + Cl⁻    (acid donates proton)
  OH⁻ + H⁺ → H₂O    (base accepts proton)
  No CHARGE_CHANGE steps needed — all atoms stay at their initial oxidation states throughout.

Atoms in NaOH — oxidation states: Na=+1, O=-2, H=+1:
  Na1 (sodium,   charge +1)
  O1  (oxygen,   charge -2)
  H1  (hydrogen, charge +1)   ← H in O–H bond, oxidation state +1
Charge check: Na(+1) + O(-2) + H(+1) = 0 ✓ (neutral molecule)

Bonds in NaOH:
  bond-Na1-O1 (Na–O ionic,    order 1)
  bond-O1-H1  (O–H covalent,  order 1)

Atoms in HCl — oxidation states: H=+1, Cl=-1:
  H2  (hydrogen, charge +1)   ← H in H–Cl bond, oxidation state +1
  Cl1 (chlorine,  charge -1)  ← Cl in H–Cl bond, oxidation state -1
Charge check: H(+1) + Cl(-1) = 0 ✓ (neutral molecule)

Bonds in HCl:
  bond-H2-Cl1 (H–Cl covalent, order 1)

Mechanism steps (3D-safe, sequential):
NOTE: No CHARGE_CHANGE steps in this reaction — all atoms keep their oxidation states. Only bonds change.
1. BOND_BREAK: bond=bond-Na1-O1. NaOH fully dissociates in aqueous solution; Na⁺ and OH⁻ ions separate. (Na stays +1, O stays -2, H1 stays +1 — all unchanged.)
2. BOND_BREAK: bond=bond-H2-Cl1. HCl fully ionises in aqueous solution; H⁺ (H2, charge +1) and Cl⁻ (Cl1, charge -1) are free. (Charges already correct from initial definition — no change.)
3. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=H2. Hydroxide O (electron-rich, charge -2) attacks the free H⁺ proton (H2, charge +1). Electron pair flows from O1 → H2.
4. BOND_FORM: atom1=O1, atom2=H2, order=1. New O–H bond forms. O1 is now bonded to BOTH H1 (existing) and H2 (new); water molecule (H₂O) is complete. O stays -2, both H atoms stay +1.
5. BOND_FORM: atom1=Na1, atom2=Cl1, order=1. Free Na⁺ and free Cl⁻ form ionic bond; NaCl (table salt) is produced in solution.

---

## Precipitation Reactions (Double Displacement / Metathesis)

### Prototype: Silver Nitrate + Sodium Chloride
Reaction name: Precipitation of silver chloride from silver nitrate and sodium chloride
Also known as: AgNO3 NaCl precipitation, silver chloride precipitate, metathesis, double displacement
Equation: AgNO3 + NaCl -> AgCl(ppt) + NaNO3
Reactants: Silver nitrate (AgNO3), Sodium chloride (NaCl)
Products: Silver chloride precipitate (AgCl), Sodium nitrate (NaNO3)

ELECTRON FLOW: This is a double displacement / metathesis — NOT a redox reaction.
  No oxidation states change. Ions simply swap partners.
  Ag⁺ and Cl⁻ pair up (AgCl precipitate — insoluble); Na⁺ and NO₃⁻ remain in solution.

Atoms in AgNO3 — oxidation states: Ag=+1, N=+5, O=-2:
  Ag1 (silver,   charge +1)
  N1  (nitrogen, charge +5)
  O1  (oxygen,   charge -2)
  O2  (oxygen,   charge -2)
  O3  (oxygen,   charge -2)
Charge check: Ag(+1) + N(+5) + 3×O(-2) = +1+5-6 = 0 ✓

Bonds in AgNO3:
  bond-Ag1-O1 (Ag–O ionic,   order 1)
  bond-N1-O1  (N–O single,   order 1)
  bond-N1-O2  (N–O double,   order 2)
  bond-N1-O3  (N–O single,   order 1)

Atoms in NaCl — oxidation states: Na=+1, Cl=-1:
  Na1 (sodium,   charge +1)
  Cl1 (chlorine, charge -1)
Charge check: Na(+1) + Cl(-1) = 0 ✓

Bonds in NaCl:
  bond-Na1-Cl1 (Na–Cl ionic, order 1)

Mechanism steps (3D-safe, sequential):
NOTE: No CHARGE_CHANGE steps — this is metathesis; no oxidation state changes occur.
1. BOND_BREAK: bond=bond-Ag1-O1. Ag⁺ dissociates from nitrate anion (AgNO3 fully ionises in solution). Ag1 stays +1.
2. BOND_BREAK: bond=bond-Na1-Cl1. NaCl fully dissociates in solution; Na⁺ and Cl⁻ are free ions. Na1 stays +1, Cl1 stays -1.
3. NUCLEOPHILE_ATTACK: nucleophile_atom=Cl1, electrophile_atom=Ag1. Cl⁻ (nucleophile, charge -1) is electrostatically drawn to Ag⁺ (electrophile, charge +1). Driving force: extreme insolubility of AgCl (Ksp = 1.8×10⁻¹⁰).
4. BOND_FORM: atom1=Ag1, atom2=Cl1, order=1. Ag⁺–Cl⁻ ionic bond forms; insoluble AgCl lattice nucleates and precipitates out of solution.
5. BOND_FORM: atom1=Na1, atom2=O1, order=1. Free Na⁺ associates with free nitrate anion (O1 is the nitrate bridge); NaNO3 remains dissolved in solution.

---

## Decomposition Reactions

### Prototype: Hydrogen Peroxide Decomposition
Reaction name: Decomposition of hydrogen peroxide
Also known as: H2O2 decomposition, catalytic decomposition, disproportionation
Equation: 2H2O2 -> 2H2O + O2
Reactants: Hydrogen peroxide × 2 molecules (H2O2)
Products: Water × 2 (H2O), Oxygen gas (O2)

ELECTRON FLOW: This is a DISPROPORTIONATION — O is simultaneously oxidised AND reduced.
  In H₂O₂: O oxidation state = -1 (SPECIAL CASE — NOT -2 like in H₂O)
  In H₂O:  O oxidation state = -2  (REDUCED from -1 to -2; O gains 1 electron)
  In O₂:   O oxidation state =  0  (OXIDISED from -1 to 0;  O loses 1 electron)
  H stays at +1 throughout — H is NOT involved in the redox.

Atoms in H2O2 (molecule 1) — oxidation states: H=+1, O=-1 (peroxide!):
  H1a (hydrogen, charge +1)   ← H in H–O bond, oxidation state +1
  O1a (oxygen,   charge -1)   ← PEROXIDE oxygen, oxidation state -1 (NOT -2)
  O2a (oxygen,   charge -1)   ← PEROXIDE oxygen, oxidation state -1
  H2a (hydrogen, charge +1)   ← H in O–H bond, oxidation state +1
Charge check: H(+1) + O(-1) + O(-1) + H(+1) = 0 ✓

Bonds in H2O2 (molecule 1):
  bond-H1a-O1a (H–O, order 1)
  bond-O1a-O2a (O–O peroxide single bond, order 1)   ← THIS is the weak bond that breaks
  bond-O2a-H2a (O–H, order 1)

Atoms in H2O2 (molecule 2) — oxidation states: H=+1, O=-1:
  H1b (hydrogen, charge +1)
  O1b (oxygen,   charge -1)
  O2b (oxygen,   charge -1)
  H2b (hydrogen, charge +1)
Charge check: H(+1) + O(-1) + O(-1) + H(+1) = 0 ✓

Bonds in H2O2 (molecule 2):
  bond-H1b-O1b (H–O, order 1)
  bond-O1b-O2b (O–O peroxide single bond, order 1)
  bond-O2b-H2b (O–H, order 1)

Mechanism steps (3D-safe, sequential):
Step outcome: O1a and O1b become water oxygens (reduced, -1→-2). O2a and O2b become O2 (oxidised, -1→0). H2a and H2b are transferred to the water oxygens.
1. BOND_BREAK: bond=bond-O1a-O2a. Weak O–O peroxide bond in molecule 1 breaks homolytically (one electron to each O).
2. BOND_BREAK: bond=bond-O1b-O2b. Weak O–O peroxide bond in molecule 2 breaks homolytically.
3. BOND_BREAK: bond=bond-O2a-H2a. O2a loses its H2a; H2a is released to be captured by a water oxygen. (O2a is becoming O2; it cannot keep H.)
4. BOND_BREAK: bond=bond-O2b-H2b. O2b loses its H2b for the same reason.
5. OXIDATION_REDUCTION: oxidized_atom=O2a, reduced_atom=O1a. O2a is oxidised (-1→0); O1a is reduced (-1→-2). Electron flow: O1a ← electron ← O2a.
6. CHARGE_CHANGE: atom=O2a, new_charge=0. O2a oxidised from -1 to 0.
7. CHARGE_CHANGE: atom=O1a, new_charge=-2. O1a reduced from -1 to -2; becomes a water oxygen.
8. OXIDATION_REDUCTION: oxidized_atom=O2b, reduced_atom=O1b. O2b is oxidised (-1→0); O1b is reduced (-1→-2). Electron flow: O1b ← electron ← O2b.
9. CHARGE_CHANGE: atom=O2b, new_charge=0. O2b oxidised from -1 to 0.
10. CHARGE_CHANGE: atom=O1b, new_charge=-2. O1b reduced from -1 to -2; becomes a water oxygen.
11. BOND_FORM: atom1=O2a, atom2=O2b, order=2. Two oxidised O⁰ atoms combine; O=O double bond forms; molecular oxygen (O₂) is released as gas.
12. BOND_FORM: atom1=O1a, atom2=H2b, order=1. Reduced O1a²⁻ (already bonded to H1a) picks up H2b; first water molecule (O1a bonded to H1a and H2b) is complete.
13. BOND_FORM: atom1=O1b, atom2=H2a, order=1. Reduced O1b²⁻ (already bonded to H1b) picks up H2a; second water molecule (O1b bonded to H1b and H2a) is complete.

---

## Combination Reactions

### Prototype: Haber Process — Nitrogen + Hydrogen -> Ammonia
Reaction name: Haber process synthesis of ammonia
Also known as: Haber, N2 H2 ammonia, nitrogen fixation, combination reaction, synthesis reaction
Equation: N2 + 3H2 -> 2NH3
Reactants: Nitrogen gas (N2), Hydrogen gas × 3 molecules (H2)
Products: Ammonia × 2 molecules (NH3)

ELECTRON FLOW: This is a combination reaction involving oxidation state changes (NOT ionic redox).
  N in N₂: oxidation state = 0 (elemental)
  H in H₂: oxidation state = 0 (elemental)
  N in NH₃: oxidation state = -3  (N is REDUCED — gains electrons from H)
  H in NH₃: oxidation state = +1  (H is OXIDISED — loses electrons to N)
  Electron flow direction: H → N (N is more electronegative; pulls electron density from H)

Atoms in N2 — elemental form, charge 0:
  N1 (nitrogen, charge 0)
  N2 (nitrogen, charge 0)
Bonds in N2:
  bond-N1-N2 (N≡N triple bond, order 3)   ← rate-determining bond to break

Atoms in H2 (molecule 1) — elemental form, charge 0:
  H1a (hydrogen, charge 0)
  H1b (hydrogen, charge 0)
Bonds in H2 (molecule 1):
  bond-H1a-H1b (H–H single, order 1)

Atoms in H2 (molecule 2) — elemental form, charge 0:
  H2a (hydrogen, charge 0)
  H2b (hydrogen, charge 0)
Bonds in H2 (molecule 2):
  bond-H2a-H2b (H–H single, order 1)

Atoms in H2 (molecule 3) — elemental form, charge 0:
  H3a (hydrogen, charge 0)
  H3b (hydrogen, charge 0)
Bonds in H2 (molecule 3):
  bond-H3a-H3b (H–H single, order 1)

Mechanism steps (3D-safe, sequential):
N1 will bond with H1a, H2a, H3a → first NH3
N2 will bond with H1b, H2b, H3b → second NH3
1. BOND_BREAK: bond=bond-H1a-H1b. First H–H bond breaks (surface-activated on iron catalyst).
2. BOND_BREAK: bond=bond-H2a-H2b. Second H–H bond breaks.
3. BOND_BREAK: bond=bond-H3a-H3b. Third H–H bond breaks.
4. BOND_BREAK: bond=bond-N1-N2. N≡N triple bond breaks completely — rate-determining step.
5. CHARGE_CHANGE: atom=N1, new_charge=-3. N1 becomes N³⁻ as it will accept electron density from 3 H atoms (oxidation state changes 0→-3).
6. CHARGE_CHANGE: atom=N2, new_charge=-3. N2 becomes N³⁻ symmetrically.
7. CHARGE_CHANGE: atom=H1a, new_charge=1. H1a oxidised from 0→+1 as electron density shifts to N.
8. CHARGE_CHANGE: atom=H2a, new_charge=1. H2a oxidised from 0→+1.
9. CHARGE_CHANGE: atom=H3a, new_charge=1. H3a oxidised from 0→+1.
10. CHARGE_CHANGE: atom=H1b, new_charge=1. H1b oxidised from 0→+1.
11. CHARGE_CHANGE: atom=H2b, new_charge=1. H2b oxidised from 0→+1.
12. CHARGE_CHANGE: atom=H3b, new_charge=1. H3b oxidised from 0→+1.
13. BOND_FORM: atom1=N1, atom2=H1a, order=1. N1 bonds with H1a; first N–H bond of NH3 molecule 1.
14. BOND_FORM: atom1=N1, atom2=H2a, order=1. N1 bonds with H2a; second N–H bond.
15. BOND_FORM: atom1=N1, atom2=H3a, order=1. N1 bonds with H3a; third N–H bond; first NH3 is complete.
16. BOND_FORM: atom1=N2, atom2=H1b, order=1. N2 bonds with H1b; first N–H bond of NH3 molecule 2.
17. BOND_FORM: atom1=N2, atom2=H2b, order=1. N2 bonds with H2b; second N–H bond.
18. BOND_FORM: atom1=N2, atom2=H3b, order=1. N2 bonds with H3b; third N–H bond; second NH3 is complete.
