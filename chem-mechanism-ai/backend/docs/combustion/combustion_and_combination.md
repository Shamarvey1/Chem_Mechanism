# Combustion, Combination, and Decomposition Reactions
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Combustion Reactions

**Full Name:** Combustion Reaction
**Also known as:** Burning, combustion, oxidation with oxygen, exothermic oxidation
**Reaction equation:** hydrocarbon + O2 -> CO2 + H2O + heat

### Key Characteristics
- Highly exothermic reactions
- Complete combustion: produces only CO2 and H2O
- Incomplete combustion: produces CO, soot (carbon)
- Requires oxygen (O2) as oxidizer
- Hydrocarbons and organic fuels undergo combustion

### Prototype: Methane Combustion
Reaction name: Combustion of methane
Also known as: CH4 combustion, burning of methane, natural gas combustion, methane oxygen reaction
Equation: CH4 + 2O2 -> CO2 + 2H2O
Reactants: Methane (CH4), Oxygen (O2)
Products: Carbon dioxide (CO2), Water (H2O)
Atoms in CH4: C1 (carbon), H1 H2 H3 H4 (hydrogens)
Atoms in O2: O1 O2 (oxygen atoms, one O2 molecule), O3 O4 (second O2 molecule)
Products atoms: C1 (carbon in CO2), O5 O6 (oxygens in CO2), O7 H5 H6 (in first H2O), O8 H7 H8 (in second H2O)
Bonds in CH4: bond-C1-H1 bond-C1-H2 bond-C1-H3 bond-C1-H4 (C-H, order 1)
Bonds in O2: bond-O1-O2 (O=O, order 2), bond-O3-O4 (O=O, order 2)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-H1. C-H bond breaks homolytically under high temperature conditions (initiation).
2. OXIDATION_REDUCTION: oxidized_atom=C1, reduced_atom=O1. Carbon C1 is oxidized (from -4 to +4 oxidation state). Oxygen O1 is reduced (from 0 to -2).
3. BOND_BREAK: bond=bond-O1-O2. O2 double bond breaks to provide oxygen atoms for bond formation.
4. BOND_FORM: atom1=C1, atom2=O1, order=2. Carbon forms double bond with first oxygen, beginning CO2 formation.
5. BOND_FORM: atom1=C1, atom2=O2, order=2. Carbon forms second double bond with oxygen to complete CO2.
6. BOND_FORM: atom1=O3, atom2=H1, order=1. Hydrogen combines with oxygen to form water.
7. BOND_FORM: atom1=O3, atom2=H2, order=1. Second hydrogen adds to oxygen to complete first water molecule.

### Example: Propane Combustion
Reaction name: Combustion of propane
Also known as: C3H8 combustion, propane burning, LPG combustion
Equation: C3H8 + 5O2 -> 3CO2 + 4H2O
Reactants: Propane (C3H8), Oxygen (O2)
Products: Carbon dioxide (CO2), Water (H2O)

### Example: Ethanol Combustion
Reaction name: Combustion of ethanol
Equation: C2H5OH + 3O2 -> 2CO2 + 3H2O
Reactants: Ethanol (C2H5OH), Oxygen (O2)

### Example: Glucose Combustion (Cellular Respiration)
Reaction name: Combustion of glucose, cellular respiration
Equation: C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP
Reactants: Glucose (C6H12O6), Oxygen (O2)
Products: Carbon dioxide, Water, Energy (ATP)

---

## Combination (Synthesis) Reactions

**Full Name:** Combination Reaction (Synthesis Reaction)
**Also known as:** Synthesis reaction, combination, direct union, formation reaction
**Reaction equation:** A + B -> AB

### Key Characteristics
- Two or more substances combine to form a single product
- Can combine elements or compounds
- Many are exothermic

### Prototype: Hydrogen + Oxygen (Water Synthesis)
Reaction name: Combination of hydrogen and oxygen to form water
Also known as: H2 O2 reaction, water synthesis, hydrogen combustion, Haber-type synthesis
Equation: 2H2 + O2 -> 2H2O
Reactants: Hydrogen gas (H2), Oxygen gas (O2)
Products: Water (H2O)
Mechanism steps:
1. BOND_BREAK: bond=bond-H1-H2. H-H bond breaks homolytically.
2. BOND_BREAK: bond=bond-O1-O2. O=O bond breaks.
3. BOND_FORM: atom1=O1, atom2=H1, order=1. O-H bond forms.
4. BOND_FORM: atom1=O1, atom2=H2, order=1. Second O-H bond forms, completing one water molecule.

### Example: Haber Process (Ammonia Synthesis)
Reaction name: Haber process, Haber-Bosch process, ammonia synthesis
Also known as: N2 H2 reaction, nitrogen fixation, industrial ammonia, Haber process
Equation: N2 + 3H2 -> 2NH3
Reactants: Nitrogen gas (N2), Hydrogen gas (H2)
Products: Ammonia (NH3)
Conditions: High temperature (400-500°C), High pressure (150-300 atm), Iron catalyst

### Example: Sodium + Chlorine
Reaction name: Reaction of sodium and chlorine to form sodium chloride
Equation: 2Na + Cl2 -> 2NaCl
Reactants: Sodium metal (Na), Chlorine gas (Cl2)
Products: Sodium chloride (NaCl)

---

## Decomposition Reactions

**Full Name:** Decomposition Reaction
**Also known as:** Decomposition, thermal decomposition, electrolytic decomposition, photolysis
**Reaction equation:** AB -> A + B

### Key Characteristics
- A single compound breaks apart into two or more simpler substances
- Opposite of combination reaction
- Often require energy input (heat, electricity, light)

### Prototype: Hydrogen Peroxide Decomposition
Reaction name: Decomposition of hydrogen peroxide
Also known as: H2O2 decomposition, hydrogen peroxide breakdown, catalytic decomposition
Equation: 2H2O2 -> 2H2O + O2
Reactants: Hydrogen peroxide (H2O2)
Products: Water (H2O), Oxygen gas (O2)
Catalyst: MnO2 (manganese dioxide) or catalase enzyme
Mechanism steps:
1. BOND_BREAK: bond=bond-O1-O2. The O-O peroxide bond (weak, ~146 kJ/mol) breaks homolytically.
2. OXIDATION_REDUCTION: oxidized_atom=O1, reduced_atom=O2. One oxygen is oxidized (from -1 to 0, going to O2), one is reduced (from -1 to -2, going to H2O).
3. BOND_FORM: atom1=O3, atom2=O4, order=2. Two oxygen radicals combine to form O2 gas.
4. BOND_FORM: atom1=O1, atom2=H1, order=1. Hydrogen bonds with oxygen to form water.

### Example: Calcium Carbonate Decomposition
Reaction name: Thermal decomposition of calcium carbonate (limestone)
Also known as: CaCO3 decomposition, limestone heating, lime kiln reaction
Equation: CaCO3 -> CaO + CO2
Reactants: Calcium carbonate (CaCO3)
Products: Calcium oxide/quicklime (CaO), Carbon dioxide (CO2)
Conditions: High temperature (900°C)

### Example: Mercury(II) Oxide Decomposition
Reaction name: Decomposition of mercury(II) oxide
Equation: 2HgO -> 2Hg + O2
Reactants: Mercury(II) oxide (HgO)
Products: Mercury metal (Hg), Oxygen gas (O2)
Historical note: Lavoisier used this reaction to discover oxygen in 1774
