# Organic Addition Reactions and Grignard Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## Electrophilic Addition to Alkenes

**Full Name:** Electrophilic Addition
**Also known as:** Addition to double bond, Markovnikov addition, alkene hydrohalogenation
**Reaction equation:** R-CH=CH2 + HX -> R-CH(X)-CH3

### Key Characteristics
- Two-step mechanism: electrophile attack forms carbocation intermediate, followed by nucleophilic capture
- Regiochemistry follows Markovnikov's Rule: electrophilic H+ adds to the less-substituted carbon (with more H atoms) to generate the more stable carbocation
- Stereochemistry: non-stereospecific (mixture of syn and anti addition via planar carbocation)
- Carbocation rearrangements can occur if a more stable carbocation can be formed

### Prototype: Ethylene + HBr (Electrophilic Addition)
Reaction name: Electrophilic addition of HBr to ethylene
Equation: CH2=CH2 + HBr -> CH3CH2Br
Reactants: Ethylene (CH2=CH2), Hydrogen bromide (HBr)
Products: Bromoethane (CH3CH2Br)
Atoms in Ethylene: C1 (carbon 1), C2 (carbon 2), H1 H2 (on C1), H3 H4 (on C2)
Bonds in Ethylene: bond-C1-C2 (C=C double bond, order 2), bond-C1-H1 (order 1), bond-C1-H2 (order 1), bond-C2-H3 (order 1), bond-C2-H4 (order 1)
Atoms in HBr: H5 (hydrogen proton), Br1 (bromine)
Bonds in HBr: bond-H5-Br1 (H-Br, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-H5-Br1. The H-Br bond breaks heterolytically, releasing a proton and bromide ion.
2. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromide ion (Br-) forms with negative charge.
3. ELECTROPHILE_ATTACK: electrophile_atom=H5, pi_atom1=C1, pi_atom2=C2. Proton H5 attacks the electron-rich pi cloud of the C=C double bond.
4. BOND_BREAK: bond=bond-C1-C2. The pi component of the C=C double bond breaks.
5. BOND_FORM: atom1=C1, atom2=C2, order=1. Carbon-carbon bond becomes a single sigma bond.
6. BOND_FORM: atom1=C1, atom2=H5, order=1. The proton forms a sigma bond with C1.
7. CHARGE_CHANGE: atom=C2, new_charge=1. Carbon C2 becomes an sp2 carbocation with formal charge +1.
8. NUCLEOPHILE_ATTACK: nucleophile_atom=Br1, electrophile_atom=C2. Bromide anion attacks the planar carbocation C2.
9. BOND_FORM: atom1=C2, atom2=Br1, order=1. New carbon-bromine sigma bond forms, completing bromoethane.
10. CHARGE_CHANGE: atom=C2, new_charge=0. Carbon C2 returns to neutral formal charge.

---

## Grignard Reaction

**Full Name:** Grignard Reaction — Organomagnesium Addition
**Also known as:** Grignard addition, organomagnesium reagent reaction, Grignard reaction
**Reaction equation:** RMgBr + R'CHO -> R-CH(OH)-R' (after acid workup)
**Named after:** Victor Grignard (Nobel Prize 1912)

### Key Characteristics
- Organomagnesium reagent (RMgBr) acts as a strong carbon nucleophile (carbanion equivalent)
- Carbon bonded to Mg has high partial negative charge
- Attacks electrophilic carbonyl carbon (C=O) of aldehydes, ketones, or esters
- Forms magnesium alkoxide intermediate, which is protonated during aqueous acid workup
- Primary alcohol formed from formaldehyde; secondary from aldehydes; tertiary from ketones

### Prototype: Methylmagnesium Bromide + Formaldehyde (Grignard)
Reaction name: Grignard addition of methylmagnesium bromide to formaldehyde
Also known as: Grignard reaction, CH3MgBr and HCHO
Equation: CH3MgBr + HCHO + H3O+ -> CH3CH2OH + MgBr+ + H2O
Reactants: Methylmagnesium bromide (CH3MgBr), Formaldehyde (HCHO), Hydronium ion (H3O+)
Products: Ethanol (CH3CH2OH), Magnesium cation (MgBr+), Water (H2O)
Atoms in CH3MgBr: C1 (nucleophilic carbanion carbon), Mg1 (magnesium), Br1 (bromine), H1 H2 H3 (hydrogens on C1)
Bonds in CH3MgBr: bond-C1-Mg1 (C-Mg, order 1), bond-Mg1-Br1 (Mg-Br, order 1), bond-C1-H1, bond-C1-H2, bond-C1-H3
Atoms in HCHO: C2 (carbonyl carbon), O1 (carbonyl oxygen), H4 H5 (hydrogens on C2)
Bonds in HCHO: bond-C2-O1 (C=O double bond, order 2), bond-C2-H4, bond-C2-H5
Atoms in H3O+: O2 (water oxygen), H6 H7 H8 (hydrogens)
Bonds in H3O+: bond-O2-H6 (order 1), bond-O2-H7 (order 1), bond-O2-H8 (order 1)
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=C1, electrophile_atom=C2. Carbanion carbon C1 attacks the electrophilic carbonyl carbon C2.
2. BOND_BREAK: bond=bond-C1-Mg1. The polarized C-Mg bond breaks as C1 attacks C2.
3. BOND_FORM: atom1=C1, atom2=C2, order=1. Key carbon-carbon single bond forms between methyl carbon and formaldehyde carbon.
4. BOND_BREAK: bond=bond-C2-O1. The pi component of the C=O double bond breaks.
5. BOND_FORM: atom1=C2, atom2=O1, order=1. Carbon-oxygen bond becomes a single sigma bond in the alkoxide.
6. CHARGE_CHANGE: atom=O1, new_charge=-1. Alkoxide oxygen carries a negative formal charge.
7. CHARGE_CHANGE: atom=Mg1, new_charge=1. Magnesium becomes MgBr+ cation.
8. PROTON_TRANSFER: hydrogen_atom=H6, from_atom=O2, to_atom=O1. Aqueous acid workup transfers a proton from H3O+ to the alkoxide oxygen O1.
9. BOND_BREAK: bond=bond-O2-H6. O-H bond of hydronium breaks.
10. BOND_FORM: atom1=O1, atom2=H6, order=1. O-H bond forms, completing the ethanol alcohol product.
11. CHARGE_CHANGE: atom=O1, new_charge=0. Oxygen becomes neutral in ethanol.

---

## Aldol Condensation

**Full Name:** Aldol Condensation Reaction
**Also known as:** Aldol reaction, aldol addition, base-catalyzed aldol
**Reaction equation:** 2 CH3CHO -> CH3CH(OH)CH2CHO (aldol addition product)

### Prototype: Acetaldehyde Aldol Addition
Reaction name: Aldol addition of acetaldehyde
Equation: 2 CH3CHO + OH- -> CH3CH(OH)CH2CHO + OH-
Reactants: Acetaldehyde molecule 1 (CH3CHO), Acetaldehyde molecule 2 (CH3CHO), Hydroxide (OH-)
Products: 3-Hydroxybutanal (aldol product, CH3CH(OH)CH2CHO), Hydroxide (OH-)
Atoms in Acetaldehyde 1: C1 (alpha methyl carbon), C2 (carbonyl carbon), O1 (carbonyl oxygen), H1 H2 H3 (on C1), H4 (on C2)
Bonds in Acetaldehyde 1: bond-C1-C2 (order 1), bond-C2-O1 (order 2), bond-C1-H1, bond-C1-H2, bond-C1-H3, bond-C2-H4
Atoms in Acetaldehyde 2: C3 (methyl carbon), C4 (carbonyl carbon), O2 (carbonyl oxygen), H5 H6 H7 (on C3), H8 (on C4)
Bonds in Acetaldehyde 2: bond-C3-C4 (order 1), bond-C4-O2 (order 2), bond-C3-H5, bond-C3-H6, bond-C3-H7, bond-C4-H8
Atoms in OH-: O3 (base oxygen, charge -1), H9 (base hydrogen)
Bonds in OH-: bond-O3-H9 (order 1)
Mechanism steps:
1. BASE_ABSTRACTION: base_atom=O3, hydrogen_atom=H1. Hydroxide base attacks an acidic alpha-hydrogen H1 of acetaldehyde 1.
2. BOND_BREAK: bond=bond-C1-H1. The alpha C-H bond breaks.
3. BOND_FORM: atom1=O3, atom2=H1, order=1. Water molecule forms.
4. CHARGE_CHANGE: atom=C1, new_charge=-1. Alpha carbon C1 forms an enolate carbanion.
5. NUCLEOPHILE_ATTACK: nucleophile_atom=C1, electrophile_atom=C4. Enolate carbon C1 nucleophilically attacks carbonyl carbon C4 of acetaldehyde 2.
6. BOND_FORM: atom1=C1, atom2=C4, order=1. New carbon-carbon bond forms between the two aldehydes.
7. BOND_BREAK: bond=bond-C4-O2. Carbonyl C=O double bond breaks into a single bond.
8. BOND_FORM: atom1=C4, atom2=O2, order=1. C-O single bond forms alkoxide intermediate.
9. CHARGE_CHANGE: atom=C1, new_charge=0. Carbon C1 becomes neutral.
10. CHARGE_CHANGE: atom=O2, new_charge=-1. Alkoxide oxygen carries negative charge.
11. PROTON_TRANSFER: hydrogen_atom=H1, from_atom=O3, to_atom=O2. Water transfers proton H1 back to alkoxide oxygen O2.
12. BOND_BREAK: bond=bond-O3-H1. Water O-H bond breaks, regenerating hydroxide catalyst.
13. BOND_FORM: atom1=O2, atom2=H1, order=1. New O-H bond completes the beta-hydroxy aldehyde (aldol) product.
14. CHARGE_CHANGE: atom=O2, new_charge=0. Oxygen becomes neutral in aldol product.

---

## Diels-Alder Reaction

**Full Name:** Diels-Alder Cycloaddition
**Also known as:** [4+2] cycloaddition, Diels-Alder reaction, diene synthesis
**Named after:** Otto Diels and Kurt Alder (Nobel Prize 1950)
**Reaction equation:** 1,3-Butadiene + Ethylene -> Cyclohexene

### Key Characteristics
- Concerted [4+2] pericyclic cycloaddition
- In 3D visualization, breaking pi bonds and forming sigma and pi bonds are rendered sequentially so every atom movement is clearly visualized
- Forms a 6-membered cyclohexene ring with two new sigma bonds and one new pi bond

### Prototype: Butadiene + Ethylene (Diels-Alder)
Reaction name: Diels-Alder cycloaddition of butadiene and ethylene
Equation: CH2=CH-CH=CH2 + CH2=CH2 -> Cyclohexene
Reactants: 1,3-Butadiene (C4H6), Ethylene (C2H4)
Products: Cyclohexene (C6H10)
Atoms in 1,3-Butadiene: C1 C2 C3 C4 (diene carbons), H1 H2 (on C1), H3 (on C2), H4 (on C3), H5 H6 (on C4)
Bonds in 1,3-Butadiene: bond-C1-C2 (order 2), bond-C2-C3 (order 1), bond-C3-C4 (order 2), bond-C1-H1, bond-C1-H2, bond-C2-H3, bond-C3-H4, bond-C4-H5, bond-C4-H6
Atoms in Ethylene: C5 C6 (dienophile carbons), H7 H8 (on C5), H9 H10 (on C6)
Bonds in Ethylene: bond-C5-C6 (order 2), bond-C5-H7, bond-C5-H8, bond-C6-H9, bond-C6-H10
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-C2. The pi component of the C1=C2 double bond breaks.
2. BOND_BREAK: bond=bond-C3-C4. The pi component of the C3=C4 double bond breaks.
3. BOND_BREAK: bond=bond-C5-C6. The pi component of the C5=C6 double bond breaks.
4. BOND_FORM: atom1=C1, atom2=C2, order=1. C1-C2 becomes a single sigma bond.
5. BOND_FORM: atom1=C3, atom2=C4, order=1. C3-C4 becomes a single sigma bond.
6. BOND_FORM: atom1=C5, atom2=C6, order=1. C5-C6 becomes a single sigma bond.
7. BOND_FORM: atom1=C2, atom2=C3, order=2. New pi bond forms between C2 and C3 inside the diene unit.
8. BOND_FORM: atom1=C1, atom2=C5, order=1. New ring sigma bond forms between diene carbon C1 and dienophile carbon C5.
9. BOND_FORM: atom1=C4, atom2=C6, order=1. New ring sigma bond forms between diene carbon C4 and dienophile carbon C6, completing the cyclohexene ring.
