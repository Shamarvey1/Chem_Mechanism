# Inorganic Chemical Reactions — 3D Mechanism Reference
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Redox Reactions (Single Displacement / Electron Transfer)

### Prototype A: Iron + Copper Sulfate (Redox)
Reaction name: Redox reaction of iron and copper sulfate
Also known as: Fe CuSO4, iron copper sulfate displacement, single displacement redox
Equation: Fe + CuSO4 -> FeSO4 + Cu
Reactants: Iron metal (Fe), Copper(II) sulfate (CuSO4)
Products: Iron(II) sulfate (FeSO4), Copper metal (Cu)

Atoms in Fe:
  Fe1 (iron, charge 0)

Atoms in CuSO4:
  Cu1 (copper, charge +2)
  S1  (sulfur, charge +6)
  O1  (oxygen, charge -2)
  O2  (oxygen, charge -2)
  O3  (oxygen, charge -2)
  O4  (oxygen, charge -2)

Bonds in CuSO4:
  bond-Cu1-O1  (Cu–O ionic, order 1)
  bond-Cu1-O2  (Cu–O ionic, order 1)
  bond-S1-O1   (S–O single, order 1)
  bond-S1-O2   (S–O single, order 1)
  bond-S1-O3   (S–O double, order 2)
  bond-S1-O4   (S–O double, order 2)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-Cu1-O1. First Cu–O ionic bond breaks; CuSO4 begins to dissociate in solution.
2. BOND_BREAK: bond=bond-Cu1-O2. Second Cu–O ionic bond breaks; Cu2+ ion is now free in solution.
3. OXIDATION_REDUCTION: oxidized_atom=Fe1, reduced_atom=Cu1. Free Fe metal donates 2 electrons to the free Cu2+ ion.
4. CHARGE_CHANGE: atom=Fe1, new_charge=2. Iron is oxidised to Fe2+ cation.
5. CHARGE_CHANGE: atom=Cu1, new_charge=0. Copper(II) is reduced to neutral Cu metal and precipitates.
6. BOND_FORM: atom1=Fe1, atom2=O1, order=1. Fe2+ forms first ionic bond with sulfate oxygen O1.
7. BOND_FORM: atom1=Fe1, atom2=O2, order=1. Fe2+ forms second ionic bond with sulfate oxygen O2, completing the FeSO4 ion pair.

---

### Prototype B: Zinc + Hydrochloric Acid (Redox)
Reaction name: Redox reaction of zinc and hydrochloric acid
Also known as: Zn HCl, zinc acid, zinc hydrogen gas, single displacement acid metal
Equation: Zn + 2HCl -> ZnCl2 + H2
Reactants: Zinc metal (Zn), Hydrochloric acid × 2 molecules (HCl)
Products: Zinc chloride (ZnCl2), Hydrogen gas (H2)

Atoms in Zn:
  Zn1 (zinc, charge 0)

Atoms in HCl (molecule 1):
  H1  (hydrogen, charge 0)
  Cl1 (chlorine, charge 0)
Bonds in HCl (molecule 1):
  bond-H1-Cl1 (H–Cl covalent, order 1)

Atoms in HCl (molecule 2):
  H2  (hydrogen, charge 0)
  Cl2 (chlorine, charge 0)
Bonds in HCl (molecule 2):
  bond-H2-Cl2 (H–Cl covalent, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-H1-Cl1. First H–Cl bond breaks heterolytically in aqueous solution.
2. CHARGE_CHANGE: atom=H1, new_charge=1.  H1 becomes H+ proton.
3. CHARGE_CHANGE: atom=Cl1, new_charge=-1. Cl1 becomes Cl- anion.
4. BOND_BREAK: bond=bond-H2-Cl2. Second H–Cl bond breaks heterolytically.
5. CHARGE_CHANGE: atom=H2, new_charge=1.  H2 becomes H+ proton.
6. CHARGE_CHANGE: atom=Cl2, new_charge=-1. Cl2 becomes Cl- anion.
7. OXIDATION_REDUCTION: oxidized_atom=Zn1, reduced_atom=H1. Zinc donates 2 electrons; both H+ ions are reduced.
8. CHARGE_CHANGE: atom=Zn1, new_charge=2. Zinc becomes Zn2+ cation.
9. CHARGE_CHANGE: atom=H1, new_charge=0. H1 is reduced back to neutral hydrogen atom.
10. CHARGE_CHANGE: atom=H2, new_charge=0. H2 is reduced back to neutral hydrogen atom.
11. BOND_FORM: atom1=H1, atom2=H2, order=1. Two neutral H atoms combine; H–H single bond of hydrogen gas (H2) forms.
12. BOND_FORM: atom1=Zn1, atom2=Cl1, order=1. Zn2+ forms first ionic bond with Cl-.
13. BOND_FORM: atom1=Zn1, atom2=Cl2, order=1. Zn2+ forms second ionic bond with Cl-; ZnCl2 is complete.

---

## Neutralization Reactions (Acid-Base / Proton Transfer)

### Prototype: Sodium Hydroxide + Hydrochloric Acid
Reaction name: Neutralization of HCl and NaOH
Also known as: NaOH HCl neutralization, hydrochloric acid sodium hydroxide, acid base neutralization, strong acid strong base
Equation: NaOH + HCl -> NaCl + H2O
Reactants: Sodium hydroxide (NaOH), Hydrochloric acid (HCl)
Products: Sodium chloride (NaCl), Water (H2O)

Atoms in NaOH:
  Na1 (sodium,  charge +1)
  O1  (oxygen,  charge -2)
  H1  (hydrogen, charge 0)
Bonds in NaOH:
  bond-Na1-O1 (Na–O ionic, order 1)
  bond-O1-H1  (O–H covalent, order 1)

Atoms in HCl:
  H2  (hydrogen, charge 0)
  Cl1 (chlorine,  charge 0)
Bonds in HCl:
  bond-H2-Cl1 (H–Cl covalent, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-Na1-O1. Ionic bond between Na+ and hydroxide dissociates in aqueous solution; Na+ enters solution.
2. CHARGE_CHANGE: atom=Na1, new_charge=1. Na+ cation is free in solution.
3. BOND_BREAK: bond=bond-H2-Cl1. Covalent H–Cl bond breaks heterolytically; HCl fully ionises.
4. CHARGE_CHANGE: atom=Cl1, new_charge=-1. Chlorine becomes Cl- anion in solution.
5. CHARGE_CHANGE: atom=H2, new_charge=1. Hydrogen becomes H+ proton in solution.
6. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=H2. Hydroxide oxygen (strong nucleophile) attacks the free H+ proton.
7. BOND_BREAK: bond=bond-O1-H1. Existing O–H bond in hydroxide breaks as OH- captures new proton (net: O binds two H atoms to form H2O). Note: this step models O rehybridisation; in 3D it shows the old OH repositioning.
8. BOND_FORM: atom1=O1, atom2=H2, order=1. New O–H bond forms; water molecule (H2O) is completed.
9. BOND_FORM: atom1=Na1, atom2=Cl1, order=1. Na+ and Cl- form ionic bond; NaCl (table salt) is produced.

---

## Precipitation Reactions (Double Displacement / Metathesis)

### Prototype: Silver Nitrate + Sodium Chloride
Reaction name: Precipitation of silver chloride from silver nitrate and sodium chloride
Also known as: AgNO3 NaCl precipitation, silver chloride precipitate, metathesis, double displacement
Equation: AgNO3 + NaCl -> AgCl(ppt) + NaNO3
Reactants: Silver nitrate (AgNO3), Sodium chloride (NaCl)
Products: Silver chloride precipitate (AgCl), Sodium nitrate (NaNO3)

Atoms in AgNO3:
  Ag1 (silver,   charge +1)
  N1  (nitrogen, charge +5)
  O1  (oxygen,   charge -2)
  O2  (oxygen,   charge -2)
  O3  (oxygen,   charge -2)
Bonds in AgNO3:
  bond-Ag1-O1 (Ag–O ionic, order 1)
  bond-N1-O1  (N–O single, order 1)
  bond-N1-O2  (N–O double, order 2)
  bond-N1-O3  (N–O single, order 1)

Atoms in NaCl:
  Na1 (sodium,   charge +1)
  Cl1 (chlorine, charge -1)
Bonds in NaCl:
  bond-Na1-Cl1 (Na–Cl ionic, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-Ag1-O1. Ag+ dissociates from nitrate anion in aqueous solution.
2. CHARGE_CHANGE: atom=Ag1, new_charge=1. Silver is free as Ag+ cation.
3. BOND_BREAK: bond=bond-Na1-Cl1. NaCl fully dissociates; Na+ and Cl- are free ions in solution.
4. CHARGE_CHANGE: atom=Na1, new_charge=1. Na+ cation free in solution.
5. NUCLEOPHILE_ATTACK: nucleophile_atom=Cl1, electrophile_atom=Ag1. Cl- ion (nucleophile) is drawn to Ag+ (electrophile) — the driving force is the extreme insolubility of AgCl.
6. BOND_FORM: atom1=Ag1, atom2=Cl1, order=1. Ag–Cl ionic bond forms; insoluble AgCl precipitate nucleates and falls out of solution.
7. BOND_FORM: atom1=Na1, atom2=O1, order=1. Na+ interacts with the free nitrate anion in solution, forming NaNO3 (remains dissolved).

---

## Decomposition Reactions

### Prototype: Hydrogen Peroxide Decomposition
Reaction name: Decomposition of hydrogen peroxide
Also known as: H2O2 decomposition, catalytic decomposition, disproportionation
Equation: 2H2O2 -> 2H2O + O2
Reactants: Hydrogen peroxide × 2 molecules (H2O2)
Products: Water (H2O), Oxygen gas (O2)

Atoms in H2O2 (molecule 1):
  O1a (oxygen,   charge 0)
  O2a (oxygen,   charge 0)
  H1a (hydrogen, charge 0)
  H2a (hydrogen, charge 0)
Bonds in H2O2 (molecule 1):
  bond-H1a-O1a (H–O, order 1)
  bond-O1a-O2a (O–O peroxide, order 1)
  bond-O2a-H2a (O–H, order 1)

Atoms in H2O2 (molecule 2):
  O1b (oxygen,   charge 0)
  O2b (oxygen,   charge 0)
  H1b (hydrogen, charge 0)
  H2b (hydrogen, charge 0)
Bonds in H2O2 (molecule 2):
  bond-H1b-O1b (H–O, order 1)
  bond-O1b-O2b (O–O peroxide, order 1)
  bond-O2b-H2b (O–H, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-O1a-O2a. The weak O–O peroxide bond in molecule 1 breaks homolytically.
2. OXIDATION_REDUCTION: oxidized_atom=O2a, reduced_atom=O1a. Disproportionation: one oxygen is oxidised (+2→0), the other is reduced (−1→−2).
3. BOND_BREAK: bond=bond-O1b-O2b. The weak O–O peroxide bond in molecule 2 breaks.
4. OXIDATION_REDUCTION: oxidized_atom=O2b, reduced_atom=O1b. Second molecule disproportionates.
5. BOND_FORM: atom1=O2a, atom2=O2b, order=2. Two oxidised oxygen atoms form O=O double bond; molecular oxygen (O2) is released.
6. BOND_FORM: atom1=O1a, atom2=H1b, order=1. Reduced O1a picks up hydrogen; first H2O molecule begins to form.
7. BOND_FORM: atom1=O1b, atom2=H1a, order=1. Reduced O1b picks up hydrogen; second H2O molecule forms.

---

## Combination Reactions

### Prototype: Haber Process — Nitrogen + Hydrogen -> Ammonia
Reaction name: Haber process synthesis of ammonia
Also known as: Haber, N2 H2 ammonia, nitrogen fixation, combination reaction, synthesis reaction
Equation: N2 + 3H2 -> 2NH3
Reactants: Nitrogen gas (N2), Hydrogen gas × 3 molecules (H2)
Products: Ammonia × 2 molecules (NH3)

Atoms in N2:
  N1 (nitrogen, charge 0)
  N2 (nitrogen, charge 0)
Bonds in N2:
  bond-N1-N2 (N≡N triple, order 3)

Atoms in H2 (molecule 1):
  H1a (hydrogen, charge 0)
  H1b (hydrogen, charge 0)
Bonds in H2 (molecule 1):
  bond-H1a-H1b (H–H single, order 1)

Atoms in H2 (molecule 2):
  H2a (hydrogen, charge 0)
  H2b (hydrogen, charge 0)
Bonds in H2 (molecule 2):
  bond-H2a-H2b (H–H single, order 1)

Atoms in H2 (molecule 3):
  H3a (hydrogen, charge 0)
  H3b (hydrogen, charge 0)
Bonds in H2 (molecule 3):
  bond-H3a-H3b (H–H single, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-H1a-H1b. First H–H bond breaks (activated on iron catalyst surface).
2. BOND_BREAK: bond=bond-H2a-H2b. Second H–H bond breaks.
3. BOND_BREAK: bond=bond-H3a-H3b. Third H–H bond breaks.
4. BOND_BREAK: bond=bond-N1-N2. Triple N≡N bond breaks; this is the rate-determining step of the Haber process.
5. BOND_FORM: atom1=N1, atom2=H1a, order=1. N1 bonds with first H atom.
6. BOND_FORM: atom1=N1, atom2=H2a, order=1. N1 bonds with second H atom.
7. BOND_FORM: atom1=N1, atom2=H3a, order=1. N1 bonds with third H atom; first NH3 molecule is complete.
8. BOND_FORM: atom1=N2, atom2=H1b, order=1. N2 bonds with fourth H atom.
9. BOND_FORM: atom1=N2, atom2=H2b, order=1. N2 bonds with fifth H atom.
10. BOND_FORM: atom1=N2, atom2=H3b, order=1. N2 bonds with sixth H atom; second NH3 molecule is complete.
