# Advanced Organic Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## Fischer Esterification

**Full Name:** Fischer Esterification
**Also known as:** Esterification, acid catalyzed esterification, RCOOH ROH reaction
**Reaction equation:** RCOOH + R'OH -> RCOOR' + H2O

### Key Characteristics
- Carboxylic acid reacts with alcohol in presence of acid catalyst to form ester and water
- Reversible equilibrium driven forward by excess reagent or removal of water
- Carbonyl oxygen is activated, followed by alcohol nucleophilic attack

### Prototype: Acetic Acid + Methanol Esterification
Reaction name: Fischer esterification of acetic acid with methanol
Equation: CH3COOH + CH3OH -> CH3COOCH3 + H2O
Reactants: Acetic acid (CH3COOH), Methanol (CH3OH)
Products: Methyl acetate (CH3COOCH3), Water (H2O)
Atoms in CH3COOH: C1 (methyl carbon), C2 (carbonyl carbon), O1 (carbonyl oxygen), O2 (hydroxyl oxygen), H1 H2 H3 (on C1), H4 (on O2)
Bonds in CH3COOH: bond-C1-C2 (order 1), bond-C2-O1 (order 2), bond-C2-O2 (order 1), bond-O2-H4 (order 1), bond-C1-H1, bond-C1-H2, bond-C1-H3
Atoms in CH3OH: C3 (methyl carbon), O3 (alcohol oxygen), H5 H6 H7 (on C3), H8 (on O3)
Bonds in CH3OH: bond-C3-O3 (order 1), bond-O3-H8 (order 1), bond-C3-H5, bond-C3-H6, bond-C3-H7
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=O3, electrophile_atom=C2. Alcohol oxygen O3 attacks the electrophilic carbonyl carbon C2.
2. BOND_FORM: atom1=C2, atom2=O3, order=1. New C-O bond forms, producing tetrahedral intermediate.
3. BOND_BREAK: bond=bond-C2-O1. Carbonyl pi bond opens.
4. BOND_FORM: atom1=C2, atom2=O1, order=1. C-O bond becomes single bond.
5. CHARGE_CHANGE: atom=O1, new_charge=-1. Alkoxide oxygen carries negative charge.
6. PROTON_TRANSFER: hydrogen_atom=H8, from_atom=O3, to_atom=O2. Proton transfers from alcohol oxygen to hydroxyl oxygen.
7. BOND_BREAK: bond=bond-O3-H8. O3-H8 bond breaks.
8. BOND_FORM: atom1=O2, atom2=H8, order=1. O2-H8 bond forms, turning OH into good leaving group H2O.
9. BOND_BREAK: bond=bond-C2-O2. Water molecule departs from C2.
10. BOND_BREAK: bond=bond-C2-O1. C-O single bond reforms double bond.
11. BOND_FORM: atom1=C2, atom2=O1, order=2. Carbonyl C=O double bond reforms, completing methyl acetate ester.
12. CHARGE_CHANGE: atom=O1, new_charge=0. Carbonyl oxygen becomes neutral.

---

## Electrophilic Halogenation of Alkenes

**Full Name:** Halogenation of Alkenes (Electrophilic Addition)
**Also known as:** Bromination of alkene, halogen addition to double bond
**Reaction equation:** CH2=CH2 + Br2 -> BrCH2-CH2Br

### Key Characteristics
- Electrophilic addition of molecular halogen (Br2 or Cl2) across a carbon-carbon double bond
- Yields vicinal dihalide (1,2-dibromoalkane) with anti-stereochemistry via halonium ion intermediate
- Decolorization of bromine water is classic qualitative test for unsaturation

### Prototype: Ethylene + Bromine (Halogenation)
Reaction name: Bromination of ethylene
Equation: CH2=CH2 + Br2 -> BrCH2CH2Br
Reactants: Ethylene (CH2=CH2), Bromine (Br2)
Products: 1,2-Dibromoethane (BrCH2CH2Br)
Atoms in Ethylene: C1 C2 (alkene carbons), H1 H2 (on C1), H3 H4 (on C2)
Bonds in Ethylene: bond-C1-C2 (order 2), bond-C1-H1, bond-C1-H2, bond-C2-H3, bond-C2-H4
Atoms in Br2: Br1 Br2 (bromine atoms)
Bonds in Br2: bond-Br1-Br2 (order 1)
Mechanism steps:
1. ELECTROPHILE_ATTACK: electrophile_atom=Br1, pi_atom1=C1, pi_atom2=C2. Bromine electrophile attacks the alkene double bond pi cloud.
2. BOND_BREAK: bond=bond-Br1-Br2. The Br-Br bond breaks heterolytically.
3. CHARGE_CHANGE: atom=Br2, new_charge=-1. Bromide ion (Br-) departs with negative charge.
4. BOND_BREAK: bond=bond-C1-C2. The alkene pi bond breaks.
5. BOND_FORM: atom1=C1, atom2=C2, order=1. Carbon-carbon bond becomes a single sigma bond.
6. BOND_FORM: atom1=C1, atom2=Br1, order=1. First carbon-bromine sigma bond forms.
7. CHARGE_CHANGE: atom=C2, new_charge=1. Carbon C2 becomes an sp2 carbocation (+1).
8. NUCLEOPHILE_ATTACK: nucleophile_atom=Br2, electrophile_atom=C2. Bromide anion attacks carbocation C2 from the opposite face.
9. BOND_FORM: atom1=C2, atom2=Br2, order=1. Second carbon-bromine bond forms, completing 1,2-dibromoethane.
10. CHARGE_CHANGE: atom=C2, new_charge=0. Carbon C2 becomes neutral.

---

## Carbonyl Reduction with Hydride

**Full Name:** Nucleophilic Addition of Hydride to Carbonyl
**Also known as:** Carbonyl reduction, aldehyde reduction, NaBH4 reduction
**Reaction equation:** HCHO + H- + H+ -> CH3OH

### Prototype: Formaldehyde Hydride Reduction
Reaction name: Hydride reduction of formaldehyde to methanol
Equation: HCHO + H- + H+ -> CH3OH
Reactants: Formaldehyde (HCHO), Hydride ion (H-), Proton (H+)
Products: Methanol (CH3OH)
Atoms in Formaldehyde: C1 (carbonyl carbon), O1 (carbonyl oxygen), H1 H2 (on C1)
Bonds in Formaldehyde: bond-C1-O1 (order 2), bond-C1-H1 (order 1), bond-C1-H2 (order 1)
Atoms in Reagents: H3 (hydride nucleophile, charge -1), H4 (proton electrophile, charge +1)
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=H3, electrophile_atom=C1. Hydride ion attacks the electrophilic carbonyl carbon C1.
2. BOND_FORM: atom1=C1, atom2=H3, order=1. New C-H bond forms on carbon.
3. BOND_BREAK: bond=bond-C1-O1. Carbonyl pi bond breaks.
4. BOND_FORM: atom1=C1, atom2=O1, order=1. C-O single bond forms alkoxide ion (methoxide).
5. CHARGE_CHANGE: atom=O1, new_charge=-1. Oxygen carries negative charge.
6. CHARGE_CHANGE: atom=H3, new_charge=0. Hydride becomes neutral.
7. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=H4. Alkoxide oxygen captures proton during aqueous workup.
8. BOND_FORM: atom1=O1, atom2=H4, order=1. O-H bond forms, completing methanol (CH3OH).
9. CHARGE_CHANGE: atom=O1, new_charge=0. Oxygen becomes neutral.
10. CHARGE_CHANGE: atom=H4, new_charge=0. Proton becomes neutral.
