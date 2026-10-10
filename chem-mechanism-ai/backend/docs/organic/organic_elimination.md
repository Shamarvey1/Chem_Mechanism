# Organic Elimination Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## E2 Reaction — Bimolecular Elimination

**Full Name:** Bimolecular Elimination
**Also known as:** E2, concerted elimination, anti-periplanar elimination, bimolecular beta-elimination
**Reaction equation:** R-CH2-CH2-X + Base- -> R-CH=CH2 + Base-H + X-

### Key Characteristics
- Concerted one-step mechanism in chemistry: base abstracts beta-hydrogen simultaneously with C-X bond breaking and pi bond formation
- In 3D visualization, animated via ordered sequential micro-steps: leaving group departs, base abstracts proton, water forms, and pi bond forms
- Second-order kinetics: rate = k[substrate][base]
- Anti-periplanar geometry required: beta-H and leaving group X must be 180 degrees apart
- Strong bases favor E2 (OH-, RO-, NaOEt, t-BuOK)
- Zaitsev's rule: more substituted alkene is the major thermodynamic product

### Prototype: Bromoethane + Hydroxide (E2)
Reaction name: E2 elimination of bromoethane
Equation: CH3CH2Br + OH- -> CH2=CH2 + Br- + H2O
Reactants: Bromoethane (CH3CH2Br), Hydroxide ion (OH-)
Products: Ethylene (CH2=CH2), Bromide ion (Br-), Water (H2O)
Atoms in CH3CH2Br: C1 (alpha carbon bearing Br), C2 (beta carbon), Br1 (bromine leaving group), H1 H2 (hydrogens on C1), H3 H4 H5 (hydrogens on C2)
Bonds in CH3CH2Br: bond-C1-Br1 (C-Br, order 1), bond-C1-C2 (C-C, order 1), bond-C1-H1 (order 1), bond-C1-H2 (order 1), bond-C2-H3 (order 1), bond-C2-H4 (order 1), bond-C2-H5 (order 1)
Atoms in OH-: O1 (oxygen, charge -1), H6 (hydrogen)
Bonds in OH-: bond-O1-H6 (O-H, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond breaks heterolytically as bromide departs.
2. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromide departs with negative charge (Br-).
3. BASE_ABSTRACTION: base_atom=O1, hydrogen_atom=H3. The hydroxide base attacks the beta hydrogen H3 on C2.
4. BOND_BREAK: bond=bond-C2-H3. The beta carbon-hydrogen bond breaks.
5. BOND_FORM: atom1=O1, atom2=H3, order=1. New O-H bond forms between hydroxide and abstracted proton, creating water (H2O).
6. CHARGE_CHANGE: atom=O1, new_charge=0. Hydroxide oxygen becomes neutral water.
7. BOND_FORM: atom1=C1, atom2=C2, order=2. Carbon-carbon double bond (pi bond) forms between C1 and C2, yielding ethylene (CH2=CH2).

---

## E1 Reaction — Unimolecular Elimination

**Full Name:** Unimolecular Elimination
**Also known as:** E1, E1 elimination, carbocation elimination, unimolecular beta-elimination
**Reaction equation:** R-X -> R+ + X- (slow), then R+ -> alkene + H+ (fast)

### Key Characteristics
- Two-step mechanism: slow rate-determining carbocation formation, followed by fast proton abstraction
- First-order kinetics: rate = k[substrate] only
- Planar carbocation intermediate
- Often competes with SN1 in polar protic solvents
- Favored by tertiary substrates, weak bases, and elevated temperatures
- Zaitsev's rule: more substituted alkene is preferred

### Prototype: tert-Butyl Bromide Elimination (E1)
Reaction name: E1 elimination of tert-butyl bromide
Also known as: E1 elimination, elimination of 2-bromo-2-methylpropane
Equation: (CH3)3CBr -> (CH3)2C=CH2 + HBr
Reactants: 2-bromo-2-methylpropane ((CH3)3CBr, tert-butyl bromide)
Products: 2-methylpropene (isobutylene, (CH3)2C=CH2), Hydrogen bromide (HBr)
Atoms in (CH3)3CBr: C1 (central carbon with Br), C2 C3 C4 (methyl carbons), Br1 (bromine), H1 H2 H3 (hydrogens on C2), H4 H5 H6 (hydrogens on C3), H7 H8 H9 (hydrogens on C4)
Bonds in (CH3)3CBr: bond-C1-Br1 (C-Br, order 1), bond-C1-C2 (C-C, order 1), bond-C1-C3 (C-C, order 1), bond-C1-C4 (C-C, order 1), bond-C2-H1, bond-C2-H2, bond-C2-H3
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond undergoes heterolytic cleavage. This is the rate-determining step.
2. CHARGE_CHANGE: atom=C1, new_charge=1. Central carbon C1 forms a planar carbocation with formal charge +1.
3. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromine departs as bromide ion (Br-) with charge -1.
4. BASE_ABSTRACTION: base_atom=Br1, hydrogen_atom=H3. The bromide ion acts as a weak base and abstracts a beta hydrogen H3 from methyl carbon C2.
5. BOND_BREAK: bond=bond-C2-H3. The beta C-H bond breaks heterolytically.
6. BOND_FORM: atom1=Br1, atom2=H3, order=1. Hydrogen bromide (HBr) forms.
7. CHARGE_CHANGE: atom=Br1, new_charge=0. Bromide becomes neutral HBr.
8. BOND_FORM: atom1=C1, atom2=C2, order=2. The carbon-carbon double bond (pi bond) forms between C1 and C2, producing 2-methylpropene.
9. CHARGE_CHANGE: atom=C1, new_charge=0. Central carbon returns to neutral formal charge.

### Example: 2-Bromopropane Elimination (E1)
Reaction name: E1 elimination of 2-bromopropane
Equation: CH3CHBrCH3 -> CH3CH=CH2 + HBr
Reactants: 2-bromopropane (CH3CHBrCH3)
Products: Propene (CH3CH=CH2), Hydrogen bromide (HBr)
Atoms in 2-bromopropane: C1 (methyl carbon), C2 (CH-Br carbon), C3 (methyl carbon), Br1 (bromine), H1 H2 H3 (on C1), H4 (on C2), H5 H6 H7 (on C3)
Bonds: bond-C2-Br1 (order 1), bond-C1-C2 (order 1), bond-C2-C3 (order 1), bond-C1-H1 (order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C2-Br1. Slow C-Br bond cleavage gives secondary carbocation at C2.
2. CHARGE_CHANGE: atom=C2, new_charge=1. C2 becomes secondary carbocation (+1).
3. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromide departs (-1).
4. BASE_ABSTRACTION: base_atom=Br1, hydrogen_atom=H1. Bromide abstracts beta hydrogen H1 from C1.
5. BOND_BREAK: bond=bond-C1-H1. C1-H1 bond breaks.
6. BOND_FORM: atom1=Br1, atom2=H1, order=1. HBr forms.
7. BOND_FORM: atom1=C1, atom2=C2, order=2. Carbon-carbon double bond forms between C1 and C2, giving propene.
8. CHARGE_CHANGE: atom=C2, new_charge=0. Carbon C2 becomes neutral.
