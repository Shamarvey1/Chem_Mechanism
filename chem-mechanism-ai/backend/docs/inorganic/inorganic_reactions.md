# Inorganic Chemical Reactions
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Neutralization Reactions (Acid-Base)

**Full Name:** Acid-Base Neutralization
**Also known as:** Neutralization, acid base reaction, proton transfer, Bronsted-Lowry acid-base
**Reaction equation:** Acid + Base -> Salt + Water

### Key Characteristics
- Complete reaction between strong acid and strong base
- Net ionic equation: H+(aq) + OH-(aq) -> H2O(l)
- Highly exothermic with standard enthalpy of neutralization approximately -57.3 kJ/mol

### Prototype: Sodium Hydroxide + Hydrochloric Acid (Neutralization)
Reaction name: Neutralization of HCl and NaOH
Also known as: NaOH HCl neutralization, hydrochloric acid sodium hydroxide, acid base neutralization
Equation: NaOH + HCl -> NaCl + H2O
Reactants: Sodium hydroxide (NaOH), Hydrochloric acid (HCl)
Products: Sodium chloride (NaCl), Water (H2O)
Atoms in NaOH: Na1 (sodium, charge +1), O1 (oxygen), H1 (hydrogen)
Bonds in NaOH: bond-Na1-O1 (ionic, order 1), bond-O1-H1 (O-H, order 1)
Atoms in HCl: H2 (hydrogen), Cl1 (chlorine)
Bonds in HCl: bond-H2-Cl1 (H-Cl, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-H2-Cl1. The covalent H-Cl bond breaks heterolytically in aqueous solution.
2. CHARGE_CHANGE: atom=Cl1, new_charge=-1. Chlorine becomes chloride anion (Cl-).
3. BOND_BREAK: bond=bond-Na1-O1. Ionic attraction between Na+ and OH- dissociates in water.
4. CHARGE_CHANGE: atom=Na1, new_charge=1. Sodium enters solution as Na+ cation.
5. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=H2. Hydroxide oxygen attacks the free proton H2+.
6. BOND_FORM: atom1=O1, atom2=H2, order=1. New O-H bond forms, completing neutral water (H2O).
7. BOND_FORM: atom1=Na1, atom2=Cl1, order=1. Ionic bond forms between Na+ and Cl-, yielding salt (NaCl).

---

## Redox Reactions (Oxidation-Reduction)

**Full Name:** Oxidation-Reduction Reaction
**Also known as:** Redox reaction, single displacement, electron transfer
**Reaction equation:** Fe + CuSO4 -> FeSO4 + Cu

### Prototype: Iron + Copper Sulfate (Redox)
Reaction name: Redox reaction of iron and copper sulfate
Equation: Fe + CuSO4 -> FeSO4 + Cu
Reactants: Iron metal (Fe), Copper sulfate (CuSO4)
Products: Iron(II) sulfate (FeSO4), Copper metal (Cu)
Atoms in Fe: Fe1 (iron, charge 0)
Atoms in CuSO4: Cu1 (copper, charge +2), S1 (sulfur, charge +6), O1 O2 O3 O4 (oxygen, charge -2)
Bonds in CuSO4: bond-Cu1-O1 (ionic, order 1), bond-S1-O1 (order 1), bond-S1-O2 (order 1), bond-S1-O3 (order 2), bond-S1-O4 (order 2)
Mechanism steps:
1. OXIDATION_REDUCTION: oxidized_atom=Fe1, reduced_atom=Cu1. Iron (Fe) donates 2 electrons to copper(II) cation.
2. CHARGE_CHANGE: atom=Fe1, new_charge=2. Iron is oxidized to Fe2+ cation.
3. CHARGE_CHANGE: atom=Cu1, new_charge=0. Copper(II) is reduced to neutral copper metal (Cu).
4. BOND_BREAK: bond=bond-Cu1-O1. Ionic bond between Cu and sulfate breaks as Cu precipitates.
5. BOND_FORM: atom1=Fe1, atom2=O1, order=1. Fe2+ forms ionic bond with sulfate oxygen, entering solution as FeSO4.

### Prototype: Zinc + Hydrochloric Acid (Redox)
Reaction name: Redox reaction of zinc and HCl
Equation: Zn + 2HCl -> ZnCl2 + H2
Reactants: Zinc metal (Zn), Hydrochloric acid (HCl)
Products: Zinc chloride (ZnCl2), Hydrogen gas (H2)
Atoms in Zn: Zn1 (zinc, charge 0)
Atoms in HCl: H1 H2 (hydrogens), Cl1 Cl2 (chlorines)
Bonds in HCl: bond-H1-Cl1 (order 1), bond-H2-Cl2 (order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-H1-Cl1. First H-Cl bond breaks.
2. BOND_BREAK: bond=bond-H2-Cl2. Second H-Cl bond breaks.
3. OXIDATION_REDUCTION: oxidized_atom=Zn1, reduced_atom=H1. Zinc is oxidized, hydrogens are reduced.
4. CHARGE_CHANGE: atom=Zn1, new_charge=2. Zinc becomes Zn2+ cation.
5. CHARGE_CHANGE: atom=Cl1, new_charge=-1. First chlorine becomes Cl- anion.
6. CHARGE_CHANGE: atom=Cl2, new_charge=-1. Second chlorine becomes Cl- anion.
7. BOND_FORM: atom1=H1, atom2=H2, order=1. Two hydrogen atoms form H-H single bond of hydrogen gas (H2).
8. BOND_FORM: atom1=Zn1, atom2=Cl1, order=1. First Zn-Cl ionic bond forms.
9. BOND_FORM: atom1=Zn1, atom2=Cl2, order=1. Second Zn-Cl ionic bond forms, completing ZnCl2.

---

## Precipitation Reactions

**Full Name:** Precipitation Reaction (Double Displacement)
**Also known as:** Precipitation, metathesis reaction, AgCl precipitate
**Reaction equation:** AgNO3 + NaCl -> AgCl(ppt) + NaNO3

### Prototype: Silver Nitrate + Sodium Chloride
Reaction name: Precipitation of silver chloride from silver nitrate and sodium chloride
Equation: AgNO3 + NaCl -> AgCl + NaNO3
Reactants: Silver nitrate (AgNO3), Sodium chloride (NaCl)
Products: Silver chloride precipitate (AgCl), Sodium nitrate (NaNO3)
Atoms in AgNO3: Ag1 (silver, charge +1), N1 (nitrogen, charge +5), O1 O2 O3 (oxygen, charge -2)
Bonds in AgNO3: bond-Ag1-O1 (ionic, order 1), bond-N1-O1 (order 1), bond-N1-O2 (order 2), bond-N1-O3 (order 1)
Atoms in NaCl: Na1 (sodium, charge +1), Cl1 (chlorine, charge -1)
Bonds in NaCl: bond-Na1-Cl1 (ionic, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-Ag1-O1. Silver ion dissociates from nitrate in aqueous solution.
2. BOND_BREAK: bond=bond-Na1-Cl1. Sodium ion dissociates from chloride in aqueous solution.
3. NUCLEOPHILE_ATTACK: nucleophile_atom=Cl1, electrophile_atom=Ag1. Chloride ion approaches silver ion.
4. BOND_FORM: atom1=Ag1, atom2=Cl1, order=1. Ag-Cl ionic lattice bond forms, precipitating insoluble AgCl.
5. BOND_FORM: atom1=Na1, atom2=O1, order=1. Sodium ion interacts with nitrate ion in solution.
