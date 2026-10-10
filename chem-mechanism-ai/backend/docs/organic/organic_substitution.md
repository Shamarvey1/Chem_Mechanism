# Organic Nucleophilic Substitution Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## SN2 Reaction — Bimolecular Nucleophilic Substitution

**Full Name:** Bimolecular Nucleophilic Substitution
**Also known as:** SN2, backside attack, Walden inversion, bimolecular substitution
**Reaction equation:** R-X + Nu- -> R-Nu + X-

### Key Characteristics
- Concerted one-step mechanism: bond breaking and bond forming occur in a single concerted event
- For 3D visualization, sequential micro-steps are used: leaving group bond breaks first, nucleophile attacks, new bond forms
- Second-order kinetics: rate = k[substrate][nucleophile]
- Stereochemistry: Walden inversion at the carbon center
- Best with primary alkyl halides; unreactive with tertiary due to steric hindrance
- Strong, unhindered nucleophiles (OH-, CN-, I-, RS-) favor SN2
- Polar aprotic solvents (acetone, DMSO, DMF) favor SN2

### Prototype: Bromomethane + Hydroxide (SN2)
Reaction name: SN2 substitution of bromomethane
Equation: CH3Br + OH- -> CH3OH + Br-
Reactants: Bromomethane (CH3Br), Hydroxide ion (OH-)
Products: Methanol (CH3OH), Bromide ion (Br-)
Atoms in CH3Br: C1 (carbon), H1 H2 H3 (hydrogens on C1), Br1 (bromine leaving group)
Bonds in CH3Br: bond-C1-Br1 (C-Br, order 1), bond-C1-H1 (C-H, order 1), bond-C1-H2 (C-H, order 1), bond-C1-H3 (C-H, order 1)
Atoms in OH-: O1 (oxygen, charge -1), H4 (hydrogen)
Bonds in OH-: bond-O1-H4 (O-H, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond breaks heterolytically as bromide begins to depart.
2. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromine departs with negative charge as bromide ion (Br-).
3. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=C1. Hydroxide oxygen attacks electrophilic carbon C1 from the backside (180 degrees from departing Br).
4. BOND_FORM: atom1=O1, atom2=C1, order=1. New carbon-oxygen single bond forms, giving methanol.
5. CHARGE_CHANGE: atom=O1, new_charge=0. Oxygen becomes neutral in the final methanol product.

### Prototype: Chloromethane + Hydroxide (SN2)
Reaction name: SN2 substitution of chloromethane
Equation: CH3Cl + OH- -> CH3OH + Cl-
Reactants: Chloromethane (CH3Cl), Hydroxide ion (OH-)
Products: Methanol (CH3OH), Chloride ion (Cl-)
Atoms in CH3Cl: C1 (carbon), H1 H2 H3 (hydrogens), Cl1 (chlorine leaving group)
Bonds in CH3Cl: bond-C1-Cl1 (C-Cl, order 1), bond-C1-H1 (C-H, order 1), bond-C1-H2 (C-H, order 1), bond-C1-H3 (C-H, order 1)
Atoms in OH-: O1 (oxygen, charge -1), H4 (hydrogen)
Bonds in OH-: bond-O1-H4 (O-H, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Cl1. The C-Cl bond breaks heterolytically as chloride departs.
2. CHARGE_CHANGE: atom=Cl1, new_charge=-1. Chlorine departs as chloride ion (Cl-).
3. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=C1. Hydroxide oxygen attacks carbon C1 from backside.
4. BOND_FORM: atom1=O1, atom2=C1, order=1. New C-O single bond forms, giving methanol.
5. CHARGE_CHANGE: atom=O1, new_charge=0. Oxygen becomes neutral in methanol.

### Prototype: Bromoethane + Hydroxide (SN2)
Reaction name: SN2 substitution of bromoethane
Equation: CH3CH2Br + OH- -> CH3CH2OH + Br-
Reactants: Bromoethane (CH3CH2Br), Hydroxide (OH-)
Products: Ethanol (CH3CH2OH), Bromide (Br-)
Atoms in CH3CH2Br: C1 (carbon bearing Br), C2 (methyl carbon), Br1 (bromine), H1 H2 (on C1), H3 H4 H5 (on C2)
Bonds in CH3CH2Br: bond-C1-Br1 (C-Br, order 1), bond-C1-C2 (C-C, order 1), bond-C1-H1, bond-C1-H2, bond-C2-H3, bond-C2-H4, bond-C2-H5
Atoms in OH-: O1 (oxygen, charge -1), H6 (hydrogen)
Bonds in OH-: bond-O1-H6 (O-H, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond breaks heterolytically.
2. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromide departs with charge -1.
3. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=C1. Hydroxide attacks C1 carbon.
4. BOND_FORM: atom1=O1, atom2=C1, order=1. New C-O bond forms, producing ethanol.
5. CHARGE_CHANGE: atom=O1, new_charge=0. Oxygen becomes neutral.

---

## SN1 Reaction — Unimolecular Nucleophilic Substitution

**Full Name:** Unimolecular Nucleophilic Substitution
**Also known as:** SN1, carbocation substitution, unimolecular substitution, solvolysis
**Reaction equation:** R-X -> R+ + X- (slow), then R+ + Nu -> R-Nu (fast)

### Key Characteristics
- Two-step mechanism: slow rate-determining ionization to form planar carbocation intermediate, followed by nucleophilic capture
- First-order kinetics: rate = k[substrate] only
- Carbocation intermediate is sp2-hybridized and planar
- Stereochemistry: racemization (attack can occur with equal probability from either face)
- Best with tertiary alkyl halides; secondary react slowly; primary do not react via SN1
- Carbocation stability: 3° > 2° > 1° > methyl
- Polar protic solvents (H2O, MeOH, EtOH) favor SN1 by stabilizing ions

### Prototype: tert-Butyl Bromide Solvolysis (SN1)
Reaction name: SN1 solvolysis of tert-butyl bromide
Also known as: SN1 of 2-bromo-2-methylpropane, t-butyl bromide hydrolysis
Equation: (CH3)3CBr + H2O -> (CH3)3COH + HBr
Reactants: 2-bromo-2-methylpropane ((CH3)3CBr), Water (H2O)
Products: 2-methyl-2-propanol ((CH3)3COH, tert-butanol), Hydrogen bromide (HBr)
Atoms in (CH3)3CBr: C1 (central sp3 carbon), C2 C3 C4 (methyl carbons), Br1 (bromine), H1 H2 H3 (on C2), H4 H5 H6 (on C3), H7 H8 H9 (on C4)
Bonds in (CH3)3CBr: bond-C1-Br1 (C-Br, order 1), bond-C1-C2 (C-C, order 1), bond-C1-C3 (C-C, order 1), bond-C1-C4 (C-C, order 1)
Atoms in H2O: O1 (water oxygen), H10 (hydrogen), H11 (hydrogen)
Bonds in H2O: bond-O1-H10 (O-H, order 1), bond-O1-H11 (O-H, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. Heterolytic cleavage of C-Br bond. This is the slow rate-determining step.
2. CHARGE_CHANGE: atom=C1, new_charge=1. Central carbon C1 forms a stable tertiary planar carbocation (+1).
3. CHARGE_CHANGE: atom=Br1, new_charge=-1. Leaving group departs as bromide anion (Br-).
4. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=C1. Water oxygen attacks the planar carbocation C1 (fast step).
5. BOND_FORM: atom1=C1, atom2=O1, order=1. New carbon-oxygen single bond forms, giving the alkyloxonium ion intermediate.
6. PROTON_TRANSFER: hydrogen_atom=H10, from_atom=O1, to_atom=Br1. Bromide abstracts a proton H10 from the oxonium oxygen.
7. BOND_BREAK: bond=bond-O1-H10. The O-H bond breaks heterolytically.
8. CHARGE_CHANGE: atom=O1, new_charge=0. Oxygen becomes neutral, completing tert-butanol.
9. BOND_FORM: atom1=Br1, atom2=H10, order=1. Hydrogen bromide (HBr) forms.
