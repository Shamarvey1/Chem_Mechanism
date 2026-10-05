# Organic Elimination Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## E2 Reaction — Bimolecular Elimination

**Full Name:** Bimolecular Elimination
**Also known as:** E2, concerted elimination, anti-periplanar elimination
**Reaction equation:** R-CH-CH-X + Base -> R-CH=CH + Base-H + X-

### Key Characteristics
- Concerted one-step mechanism: base abstracts beta-H simultaneously with C-X bond breaking
- Second-order kinetics: rate = k[substrate][base]
- Anti-periplanar geometry required: H and X must be 180 degrees apart
- Strong bulky bases favor E2 (KOH, NaOEt, t-BuOK)
- Zaitsev's rule: more substituted alkene is major product
- Hofmann product with bulky bases: less substituted alkene preferred

### Prototype: Bromoethane + Hydroxide (E2)
Reaction name: E2 elimination of bromoethane
Equation: CH3CH2Br + OH- -> CH2=CH2 + Br- + H2O
Reactants: Bromoethane (CH3CH2Br), Hydroxide ion (OH-)
Products: Ethylene (CH2=CH2), Bromide ion (Br-), Water (H2O)
Atoms in CH3CH2Br: C1 (alpha carbon bearing Br), C2 (beta carbon), Br1 (bromine), H1 H2 H3 (on C1), H4 H5 H6 (on C2), O1 H7 (hydroxide)
Bonds: bond-C1-Br1 (C-Br order 1), bond-C1-C2 (C-C order 1), bond-C2-H4 (C-H order 1)
Mechanism steps:
1. BASE_ABSTRACTION: base_atom=O1, hydrogen_atom=H4. Hydroxide base abstracts the beta hydrogen (H4) from C2. This is the rate-determining step.
2. ELECTRON_PAIR_MOVE: from_bond=bond-C2-H4, to_atom=C2. The electrons from the C2-H bond shift to C2, forming the pi bond.
3. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond breaks heterolytically as the pi bond forms. Bromide leaves.
4. BOND_FORM: atom1=C1, atom2=C2, order=2. The carbon-carbon double bond (pi bond) forms, giving ethylene.

---

## E1 Reaction — Unimolecular Elimination

**Full Name:** Unimolecular Elimination
**Also known as:** E1, E1 elimination, carbocation elimination
**Reaction equation:** R-X -> R+ + X- (slow), then R+ -> alkene + H+ (fast)

### Key Characteristics
- Two-step mechanism: carbocation formation then proton loss
- First-order kinetics: rate = k[substrate] only
- Carbocation intermediate
- Often competes with SN1 under same conditions
- Best with tertiary substrates
- Weak bases, polar protic solvents, high temperature favor E1
- Zaitsev product (more substituted alkene) is major product

### Prototype: tert-Butyl Bromide Elimination (E1)
Reaction name: E1 elimination of tert-butyl bromide
Also known as: E1 elimination, elimination of 2-bromo-2-methylpropane
Equation: (CH3)3CBr -> (CH3)2C=CH2 + HBr
Reactants: 2-bromo-2-methylpropane (tert-butyl bromide), tBuBr
Products: 2-methylpropene (isobutylene), (CH3)2C=CH2, HBr
Atoms: C1 (central carbon with Br), C2 C3 C4 (methyl carbons), Br1 (bromine), H atoms on methyl groups
Bonds: bond-C1-Br1 (C-Br order 1), bond-C1-C2 (C-C order 1), bond-C2-H3 (C-H order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond undergoes heterolytic cleavage. This is the rate-determining slow step. Bromine takes the electrons.
2. CHARGE_CHANGE: atom=C1, new_charge=1. Central carbon C1 becomes a planar carbocation with formal charge +1.
3. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromine becomes bromide ion (Br-) with charge -1.
4. BASE_ABSTRACTION: base_atom=Br1, hydrogen_atom=H3. The bromide ion (acting as a weak base) or solvent abstracts a beta hydrogen from an adjacent methyl carbon C2.
5. BOND_BREAK: bond=bond-C2-H3. The C-H bond on the beta carbon breaks as electrons shift to form pi bond.
6. BOND_FORM: atom1=C1, atom2=C2, order=2. The carbon-carbon double bond (pi bond) forms between C1 and C2, giving the alkene product 2-methylpropene.

### Example: 2-Bromopropane Elimination (E1)
Reaction name: E1 elimination of 2-bromopropane
Equation: CH3CHBrCH3 -> CH3CH=CH2 + HBr
Products: Propene, HBr

---

## E1cb Reaction — Elimination Unimolecular Conjugate Base

**Full Name:** Unimolecular Elimination via Conjugate Base
**Characteristics:** Base abstracts proton first (forming carbanion), then leaving group departs
**Favored by:** Very poor leaving groups, very acidic beta-hydrogens, strong bases

---

## Comparison: E1 vs E2 vs SN1 vs SN2

| Feature | E2 | E1 | SN2 | SN1 |
|---|---|---|---|---|
| Steps | 1 (concerted) | 2 | 1 (concerted) | 2 |
| Rate law | k[S][B] | k[S] | k[S][Nu] | k[S] |
| Best substrate | 2° or 3° | 3° | 1° | 3° |
| Base/Nucleophile | Strong base | Weak base | Strong Nu | Weak Nu |
| Solvent | Aprotic | Protic | Aprotic | Protic |
| Temperature | High temp favors E | High temp favors E | Low temp | Low temp |
