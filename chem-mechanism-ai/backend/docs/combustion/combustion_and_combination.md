# Combustion, Combination, and Decomposition Reactions
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Combustion Reactions

**Full Name:** Combustion Reaction
**Also known as:** Burning, hydrocarbon oxidation, exothermic oxidation
**Reaction equation:** CH4 + 2O2 -> CO2 + 2H2O + heat

### Key Characteristics
- Rapid, highly exothermic redox reaction between fuel and oxidizer (O2)
- Complete combustion converts all carbon to carbon dioxide (CO2) and all hydrogen to water (H2O)
- Carbon is oxidized from -4 oxidation state in methane to +4 in CO2
- Oxygen is reduced from 0 in O2 to -2 in CO2 and H2O

### Prototype: Methane Combustion
Reaction name: Combustion of methane
Equation: CH4 + 2O2 -> CO2 + 2H2O
Reactants: Methane (CH4), Oxygen molecule 1 (O2), Oxygen molecule 2 (O2)
Products: Carbon dioxide (CO2), Water molecule 1 (H2O), Water molecule 2 (H2O)
Atoms in CH4: C1 (carbon), H1 H2 H3 H4 (hydrogens on C1)
Bonds in CH4: bond-C1-H1 (order 1), bond-C1-H2 (order 1), bond-C1-H3 (order 1), bond-C1-H4 (order 1)
Atoms in Oxygen molecule 1: O1 O2 (oxygen atoms)
Bonds in Oxygen molecule 1: bond-O1-O2 (order 2)
Atoms in Oxygen molecule 2: O3 O4 (oxygen atoms)
Bonds in Oxygen molecule 2: bond-O3-O4 (order 2)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-H1. First C-H bond of methane breaks homolytically at high temperature.
2. BOND_BREAK: bond=bond-C1-H2. Second C-H bond breaks.
3. BOND_BREAK: bond=bond-C1-H3. Third C-H bond breaks.
4. BOND_BREAK: bond=bond-C1-H4. Fourth C-H bond breaks, releasing all hydrogen atoms.
5. BOND_BREAK: bond=bond-O1-O2. First O=O double bond breaks, freeing oxygen atoms for oxidation.
6. BOND_BREAK: bond=bond-O3-O4. Second O=O double bond breaks.
7. OXIDATION_REDUCTION: oxidized_atom=C1, reduced_atom=O1. Carbon C1 transfers electron density to electronegative oxygen O1.
8. BOND_FORM: atom1=C1, atom2=O1, order=2. First carbon-oxygen double bond of CO2 forms.
9. BOND_FORM: atom1=C1, atom2=O2, order=2. Second carbon-oxygen double bond of CO2 forms, completing carbon dioxide.
10. BOND_FORM: atom1=O3, atom2=H1, order=1. First O-H single bond of water molecule 1 forms.
11. BOND_FORM: atom1=O3, atom2=H2, order=1. Second O-H single bond completes water molecule 1.
12. BOND_FORM: atom1=O4, atom2=H3, order=1. First O-H single bond of water molecule 2 forms.
13. BOND_FORM: atom1=O4, atom2=H4, order=1. Second O-H single bond completes water molecule 2.

---

## Combination (Synthesis) Reactions

**Full Name:** Combination Reaction (Synthesis)
**Also known as:** Synthesis reaction, direct combination, water synthesis
**Reaction equation:** 2H2 + O2 -> 2H2O

### Prototype: Hydrogen + Oxygen (Water Synthesis)
Reaction name: Combination of hydrogen and oxygen to form water
Equation: 2H2 + O2 -> 2H2O
Reactants: Hydrogen molecule 1 (H2), Hydrogen molecule 2 (H2), Oxygen molecule (O2)
Products: Water molecule 1 (H2O), Water molecule 2 (H2O)
Atoms in H2 molecule 1: H1 H2 (hydrogens)
Bonds in H2 molecule 1: bond-H1-H2 (order 1)
Atoms in H2 molecule 2: H3 H4 (hydrogens)
Bonds in H2 molecule 2: bond-H3-H4 (order 1)
Atoms in O2 molecule: O1 O2 (oxygens)
Bonds in O2 molecule: bond-O1-O2 (order 2)
Mechanism steps:
1. BOND_BREAK: bond=bond-H1-H2. H-H bond in first hydrogen molecule breaks.
2. BOND_BREAK: bond=bond-H3-H4. H-H bond in second hydrogen molecule breaks.
3. BOND_BREAK: bond=bond-O1-O2. O=O double bond in oxygen breaks.
4. OXIDATION_REDUCTION: oxidized_atom=H1, reduced_atom=O1. Electron transfer from hydrogen to electronegative oxygen.
5. BOND_FORM: atom1=O1, atom2=H1, order=1. First O-H bond of water molecule 1 forms.
6. BOND_FORM: atom1=O1, atom2=H2, order=1. Second O-H bond of water molecule 1 forms, completing first H2O.
7. BOND_FORM: atom1=O2, atom2=H3, order=1. First O-H bond of water molecule 2 forms.
8. BOND_FORM: atom1=O2, atom2=H4, order=1. Second O-H bond of water molecule 2 forms, completing second H2O.

---

## Decomposition Reactions

**Full Name:** Decomposition Reaction
**Also known as:** Thermal decomposition, catalytic breakdown
**Reaction equation:** 2H2O2 -> 2H2O + O2

### Prototype: Hydrogen Peroxide Decomposition
Reaction name: Decomposition of hydrogen peroxide
Equation: 2H2O2 -> 2H2O + O2
Reactants: Hydrogen peroxide molecule 1 (H2O2), Hydrogen peroxide molecule 2 (H2O2)
Products: Water molecule 1 (H2O), Water molecule 2 (H2O), Oxygen gas (O2)
Atoms in H2O2 molecule 1: O1 O2 (oxygens), H1 H2 (hydrogens)
Bonds in H2O2 molecule 1: bond-O1-O2 (order 1), bond-O1-H1 (order 1), bond-O2-H2 (order 1)
Atoms in H2O2 molecule 2: O3 O4 (oxygens), H3 H4 (hydrogens)
Bonds in H2O2 molecule 2: bond-O3-O4 (order 1), bond-O3-H3 (order 1), bond-O4-H4 (order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-O1-O2. Peroxide O-O single bond in molecule 1 breaks.
2. BOND_BREAK: bond=bond-O3-O4. Peroxide O-O single bond in molecule 2 breaks.
3. BOND_BREAK: bond=bond-O2-H2. O-H bond on oxygen O2 breaks.
4. BOND_BREAK: bond=bond-O4-H4. O-H bond on oxygen O4 breaks.
5. OXIDATION_REDUCTION: oxidized_atom=O2, reduced_atom=O1. Disproportionation: O2 is oxidized to O2 gas; O1 is reduced to water.
6. BOND_FORM: atom1=O2, atom2=O4, order=2. Two oxygen radicals combine to form the stable O=O double bond of oxygen gas (O2).
7. BOND_FORM: atom1=O1, atom2=H2, order=1. Hydrogen transfers to oxygen O1, completing water molecule 1 (H2O).
8. BOND_FORM: atom1=O3, atom2=H4, order=1. Hydrogen transfers to oxygen O3, completing water molecule 2 (H2O).
