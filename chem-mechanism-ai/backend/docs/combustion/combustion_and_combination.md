# Combustion, Combination, and Decomposition Reactions
Source: LibreTexts Chemistry, OpenStax General Chemistry (Public Domain)

---

## Combustion Reactions

**Full Name:** Combustion Reaction
**Also known as:** Burning, hydrocarbon oxidation, exothermic oxidation, methane combustion, natural gas burning
**Reaction equation:** CH4 + 2O2 -> CO2 + 2H2O + heat

### Key Characteristics
- Rapid, highly exothermic redox reaction between fuel and oxidizer (O2)
- Complete combustion converts all carbon to carbon dioxide (CO2) and all hydrogen to water (H2O)
- Carbon is oxidized from -4 oxidation state in CH4 to +4 in CO2
- Oxygen is reduced from 0 in O2 to -2 in CO2 and H2O

### Prototype: Methane Combustion
Reaction name: Combustion of methane
Also known as: CH4 + 2O2, methane burns, combustion of natural gas, CH4 combustion
Equation: CH4 + 2O2 -> CO2 + 2H2O
Reactants: Methane (CH4), Oxygen molecule 1 (O2), Oxygen molecule 2 (O2)
Products: Carbon dioxide (CO2), Water molecule 1 (H2O), Water molecule 2 (H2O)

Atoms in CH4:
  C1 (carbon, charge 0)
  H1 (hydrogen, charge 0)
  H2 (hydrogen, charge 0)
  H3 (hydrogen, charge 0)
  H4 (hydrogen, charge 0)
Bonds in CH4:
  bond-C1-H1 (C-H single, order 1)
  bond-C1-H2 (C-H single, order 1)
  bond-C1-H3 (C-H single, order 1)
  bond-C1-H4 (C-H single, order 1)

Atoms in Oxygen molecule 1:
  O1 (oxygen, charge 0)
  O2 (oxygen, charge 0)
Bonds in Oxygen molecule 1:
  bond-O1-O2 (O=O double, order 2)

Atoms in Oxygen molecule 2:
  O3 (oxygen, charge 0)
  O4 (oxygen, charge 0)
Bonds in Oxygen molecule 2:
  bond-O3-O4 (O=O double, order 2)

Mechanism steps (3D-safe, sequential — ALL bond breaks BEFORE bond forms):
1.  BOND_BREAK: bond=bond-C1-H1. First C-H bond of methane breaks homolytically at ignition temperature; radical H1 is released.
2.  BOND_BREAK: bond=bond-C1-H2. Second C-H bond breaks; radical H2 is released.
3.  BOND_BREAK: bond=bond-C1-H3. Third C-H bond breaks; radical H3 is released.
4.  BOND_BREAK: bond=bond-C1-H4. Fourth C-H bond breaks; all four hydrogen atoms are now free radicals.
5.  BOND_BREAK: bond=bond-O1-O2. First O=O double bond breaks homolytically; O1 and O2 become reactive oxygen radicals.
6.  BOND_BREAK: bond=bond-O3-O4. Second O=O double bond breaks; O3 and O4 become reactive oxygen radicals.
7.  OXIDATION_REDUCTION: oxidized_atom=C1, reduced_atom=O1. Carbon is oxidised (+4); oxygen O1 is reduced (-2). Electron density shifts from C to O.
8.  BOND_FORM: atom1=C1, atom2=O1, order=2. First C=O double bond forms — carbon bonds to O1.
9.  BOND_FORM: atom1=C1, atom2=O2, order=2. Second C=O double bond forms — carbon bonds to O2, completing CO2.
10. BOND_FORM: atom1=O3, atom2=H1, order=1. Oxygen radical O3 bonds with hydrogen radical H1 — first O-H bond of water molecule 1.
11. BOND_FORM: atom1=O3, atom2=H2, order=1. O3 bonds with H2 — second O-H bond completes water molecule 1 (H2O).
12. BOND_FORM: atom1=O4, atom2=H3, order=1. Oxygen radical O4 bonds with hydrogen radical H3 — first O-H bond of water molecule 2.
13. BOND_FORM: atom1=O4, atom2=H4, order=1. O4 bonds with H4 — second O-H bond completes water molecule 2 (H2O).

---

## Combination (Synthesis) Reactions

**Full Name:** Combination Reaction (Synthesis)
**Also known as:** Synthesis reaction, direct combination, water synthesis, hydrogen oxygen reaction
**Reaction equation:** 2H2 + O2 -> 2H2O

### Prototype: Hydrogen + Oxygen (Water Synthesis)
Reaction name: Combination of hydrogen and oxygen to form water
Also known as: 2H2 O2 water synthesis, hydrogen combustion, hydrogen burns
Equation: 2H2 + O2 -> 2H2O
Reactants: Hydrogen molecule 1 (H2), Hydrogen molecule 2 (H2), Oxygen molecule (O2)
Products: Water molecule 1 (H2O), Water molecule 2 (H2O)

Atoms in H2 molecule 1:
  H1 (hydrogen, charge 0)
  H2 (hydrogen, charge 0)
Bonds in H2 molecule 1:
  bond-H1-H2 (H-H single, order 1)

Atoms in H2 molecule 2:
  H3 (hydrogen, charge 0)
  H4 (hydrogen, charge 0)
Bonds in H2 molecule 2:
  bond-H3-H4 (H-H single, order 1)

Atoms in O2 molecule:
  O1 (oxygen, charge 0)
  O2 (oxygen, charge 0)
Bonds in O2 molecule:
  bond-O1-O2 (O=O double, order 2)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-H1-H2. H-H single bond in first hydrogen molecule breaks homolytically.
2. BOND_BREAK: bond=bond-H3-H4. H-H single bond in second hydrogen molecule breaks.
3. BOND_BREAK: bond=bond-O1-O2. O=O double bond in oxygen molecule breaks; O1 and O2 are now reactive radicals.
4. OXIDATION_REDUCTION: oxidized_atom=H1, reduced_atom=O1. Electron density transfers from hydrogen to electronegative oxygen.
5. BOND_FORM: atom1=O1, atom2=H1, order=1. First O-H bond of water molecule 1 forms.
6. BOND_FORM: atom1=O1, atom2=H2, order=1. Second O-H bond completes water molecule 1 (H2O).
7. BOND_FORM: atom1=O2, atom2=H3, order=1. First O-H bond of water molecule 2 forms.
8. BOND_FORM: atom1=O2, atom2=H4, order=1. Second O-H bond completes water molecule 2 (H2O).

---

## Decomposition Reactions

**Full Name:** Decomposition Reaction
**Also known as:** Thermal decomposition, catalytic breakdown, hydrogen peroxide decomposition
**Reaction equation:** 2H2O2 -> 2H2O + O2

### Prototype: Hydrogen Peroxide Decomposition
Reaction name: Decomposition of hydrogen peroxide
Also known as: H2O2 decomposition, catalytic decomposition, disproportionation
Equation: 2H2O2 -> 2H2O + O2
Reactants: Hydrogen peroxide molecule 1 (H2O2), Hydrogen peroxide molecule 2 (H2O2)
Products: Water molecule 1 (H2O), Water molecule 2 (H2O), Oxygen gas (O2)

Atoms in H2O2 molecule 1:
  O1 (oxygen, charge 0)
  O2 (oxygen, charge 0)
  H1 (hydrogen, charge 0)
  H2 (hydrogen, charge 0)
Bonds in H2O2 molecule 1:
  bond-O1-O2 (O-O peroxide single, order 1)
  bond-O1-H1 (O-H single, order 1)
  bond-O2-H2 (O-H single, order 1)

Atoms in H2O2 molecule 2:
  O3 (oxygen, charge 0)
  O4 (oxygen, charge 0)
  H3 (hydrogen, charge 0)
  H4 (hydrogen, charge 0)
Bonds in H2O2 molecule 2:
  bond-O3-O4 (O-O peroxide single, order 1)
  bond-O3-H3 (O-H single, order 1)
  bond-O4-H4 (O-H single, order 1)

Mechanism steps (3D-safe, sequential):
1. BOND_BREAK: bond=bond-O1-O2. Weak peroxide O-O bond in molecule 1 breaks homolytically.
2. BOND_BREAK: bond=bond-O3-O4. Weak peroxide O-O bond in molecule 2 breaks.
3. BOND_BREAK: bond=bond-O2-H2. O-H bond on oxygen O2 (the oxidised fragment) breaks; H2 is freed.
4. BOND_BREAK: bond=bond-O4-H4. O-H bond on oxygen O4 breaks; H4 is freed.
5. OXIDATION_REDUCTION: oxidized_atom=O2, reduced_atom=O1. Disproportionation: O2 and O4 are oxidised to O2 gas; O1 and O3 are reduced to water oxygen.
6. BOND_FORM: atom1=O2, atom2=O4, order=2. Two oxidised oxygen radicals combine; O=O double bond forms — molecular oxygen (O2 gas) produced.
7. BOND_FORM: atom1=O1, atom2=H2, order=1. Reduced O1 picks up freed H2; first O-H bond of water molecule 1 forms.
8. BOND_FORM: atom1=O3, atom2=H4, order=1. Reduced O3 picks up freed H4; first O-H bond of water molecule 2 forms.
