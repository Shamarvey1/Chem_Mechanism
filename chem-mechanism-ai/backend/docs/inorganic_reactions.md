# Inorganic Chemical Reactions
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Neutralization Reactions (Acid-Base)

**Full Name:** Acid-Base Neutralization
**Also known as:** Neutralization, acid base reaction, proton transfer, Bronsted-Lowry acid-base
**Reaction equation:** Acid + Base -> Salt + Water

### Key Characteristics
- Strong acid + Strong base: complete reaction, neutral pH = 7
- Enthalpy of neutralization: approximately -57.3 kJ/mol for strong acid + strong base
- Net ionic equation: H+(aq) + OH-(aq) -> H2O(l)
- Strong acids: HCl, HBr, HI, HNO3, H2SO4, HClO4
- Strong bases: NaOH, KOH, Ba(OH)2, Ca(OH)2, LiOH

### Prototype: Sodium Hydroxide + Hydrochloric Acid
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
1. BOND_BREAK: bond=bond-H2-Cl1. The H-Cl bond breaks heterolytically. Proton H+ is released. Chloride Cl- forms.
2. PROTON_TRANSFER: hydrogen_atom=H2, from_atom=Cl1, to_atom=O1. The proton transfers from HCl to the hydroxide oxygen of NaOH.
3. BOND_FORM: atom1=O1, atom2=H2, order=1. New O-H bond forms, creating water (H2O).
4. BOND_BREAK: bond=bond-Na1-O1. The ionic bond between Na+ and OH- breaks in solution, releasing Na+ ion.
5. CHARGE_CHANGE: atom=Cl1, new_charge=-1. Chloride becomes Cl- ion. Sodium Na1 retains +1 charge. NaCl forms as an ionic product.

### Example: KOH + HBr Neutralization
Reaction name: Neutralization of KOH and HBr
Equation: KOH + HBr -> KBr + H2O
Reactants: Potassium hydroxide (KOH), Hydrobromic acid (HBr)
Products: Potassium bromide (KBr), Water (H2O)

### Example: NaOH + H2SO4 Neutralization
Reaction name: Neutralization of NaOH and sulfuric acid
Equation: 2NaOH + H2SO4 -> Na2SO4 + 2H2O
Reactants: Sodium hydroxide (NaOH), Sulfuric acid (H2SO4)
Products: Sodium sulfate (Na2SO4), Water (H2O)

---

## Redox Reactions (Oxidation-Reduction)

**Full Name:** Oxidation-Reduction Reaction
**Also known as:** Redox reaction, single displacement, electron transfer, electrochemical reaction
**Reaction equation:** oxidizing agent + reducing agent -> products with transferred electrons

### Key Characteristics
- Oxidation: loss of electrons, increase in oxidation state
- Reduction: gain of electrons, decrease in oxidation state
- OIL RIG: Oxidation Is Loss, Reduction Is Gain
- Activity series determines which metal displaces another

### Prototype: Iron + Copper Sulfate (Redox)
Reaction name: Redox reaction of iron and copper sulfate
Also known as: Fe CuSO4 reaction, iron copper sulfate displacement, single displacement redox
Equation: Fe + CuSO4 -> FeSO4 + Cu
Reactants: Iron metal (Fe), Copper sulfate solution (CuSO4)
Products: Iron(II) sulfate (FeSO4), Copper metal (Cu)
Atoms: Fe1 (iron, charge 0), Cu1 (copper, charge +2), S1 (sulfur), O1 O2 O3 O4 (oxygens of sulfate)
Mechanism steps:
1. OXIDATION_REDUCTION: oxidized_atom=Fe1, reduced_atom=Cu1. Iron (Fe) donates 2 electrons to copper ion (Cu2+). Iron is oxidized from 0 to +2. Copper is reduced from +2 to 0.
2. CHARGE_CHANGE: atom=Fe1, new_charge=2. Iron becomes Fe2+ (iron(II) ion), entering solution as FeSO4.
3. CHARGE_CHANGE: atom=Cu1, new_charge=0. Copper ion Cu2+ is reduced to neutral copper metal Cu, deposited as solid.

### Example: Zinc + Hydrochloric Acid (Redox)
Reaction name: Redox reaction of zinc and HCl
Also known as: Zn HCl reaction, zinc acid reaction, hydrogen gas evolution
Equation: Zn + 2HCl -> ZnCl2 + H2
Reactants: Zinc metal (Zn), Hydrochloric acid (HCl)
Products: Zinc chloride (ZnCl2), Hydrogen gas (H2)
Mechanism steps:
1. OXIDATION_REDUCTION: oxidized_atom=Zn1, reduced_atom=H1. Zinc is oxidized (0 to +2), hydrogen ions are reduced (+1 to 0).
2. CHARGE_CHANGE: atom=Zn1, new_charge=2. Zinc becomes Zn2+.
3. BOND_FORM: atom1=H1, atom2=H2, order=1. Two hydrogen atoms combine to form H2 gas.

### Example: Sodium + Water (Redox)
Reaction name: Reaction of sodium with water
Also known as: Na water reaction, alkali metal water, sodium hydroxide hydrogen
Equation: 2Na + 2H2O -> 2NaOH + H2
Reactants: Sodium metal (Na), Water (H2O)
Products: Sodium hydroxide (NaOH), Hydrogen gas (H2)

---

## Precipitation Reactions

**Full Name:** Precipitation Reaction (Double Displacement)
**Also known as:** Precipitate formation, double displacement, metathesis reaction, salt formation
**Reaction equation:** AB + CD -> AD(ppt) + CB

### Key Characteristics
- Two soluble ionic compounds react in solution
- One product is insoluble (precipitate)
- Net ionic equation eliminates spectator ions
- Solubility rules determine which product precipitates

### Prototype: Silver Nitrate + Sodium Chloride
Reaction name: Precipitation of silver chloride from silver nitrate and sodium chloride
Also known as: AgNO3 NaCl reaction, silver chloride precipitation, AgCl formation
Equation: AgNO3 + NaCl -> AgCl + NaNO3
Reactants: Silver nitrate (AgNO3), Sodium chloride (NaCl)
Products: Silver chloride precipitate (AgCl), Sodium nitrate (NaNO3)
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=Cl1, electrophile_atom=Ag1. Chloride ion and silver ion combine in solution.
2. BOND_FORM: atom1=Ag1, atom2=Cl1, order=1. Ag-Cl ionic bond forms, creating AgCl precipitate (insoluble white solid).
3. CHARGE_CHANGE: atom=Ag1, new_charge=0. Silver ion Ag+ combines with Cl- to form neutral AgCl solid precipitate.

### Example: Barium Chloride + Sodium Sulfate
Reaction name: Precipitation of barium sulfate
Equation: BaCl2 + Na2SO4 -> BaSO4(ppt) + 2NaCl
Products: Barium sulfate (white precipitate), Sodium chloride
