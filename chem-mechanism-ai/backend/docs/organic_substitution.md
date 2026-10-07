# Organic Nucleophilic Substitution Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## SN2 Reaction — Bimolecular Nucleophilic Substitution

**Full Name:** Bimolecular Nucleophilic Substitution
**Also known as:** SN2, backside attack, Walden inversion
**Reaction equation:** R-X + Nu- -> R-Nu + X-

### Key Characteristics
- Concerted one-step mechanism: bond breaking and bond forming happen simultaneously
- Second-order kinetics: rate = k[substrate][nucleophile]
- Stereochemistry: Walden inversion at the carbon center
- Best with primary alkyl halides; poor with tertiary
- Strong, unhindered nucleophiles (OH-, CN-, I-, RS-) favor SN2
- Polar aprotic solvents (acetone, DMSO) favor SN2
- Leaving groups: halides (Br-, Cl-, I-), tosylate, mesylate

### Prototype: Bromomethane + Hydroxide
Reaction name: SN2 substitution of bromomethane
Equation: CH3Br + OH- -> CH3OH + Br-
Reactants: Bromomethane (CH3Br), Hydroxide ion (OH-)
Products: Methanol (CH3OH), Bromide ion (Br-)
Atoms in CH3Br: C1 (carbon), H1 (hydrogen), H2 (hydrogen), H3 (hydrogen), Br1 (bromine)
Bonds in CH3Br: bond-C1-Br1 (C-Br, order 1), bond-C1-H1 (C-H, order 1), bond-C1-H2 (C-H, order 1), bond-C1-H3 (C-H, order 1)
Atoms in OH-: O1 (oxygen, charge -1), H4 (hydrogen)
Bonds in OH-: bond-O1-H4 (O-H, order 1)
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond breaks as the leaving group detaches, clearing space.
2. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromine becomes bromide anion Br-.
3. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=C1. The oxygen of hydroxide now approaches the electrophilic carbon C1.
4. BOND_FORM: atom1=O1, atom2=C1, order=1. The new C-O bond forms as the atoms get close.

### Example: Chloromethane + Hydroxide (SN2)
Reaction name: SN2 substitution of chloromethane
Equation: CH3Cl + OH- -> CH3OH + Cl-
Reactants: Chloromethane (CH3Cl), Hydroxide ion (OH-)
Products: Methanol (CH3OH), Chloride ion (Cl-)
Mechanism: Identical to CH3Br but with C-Cl bond breaking. Cl- is the leaving group.

### Example: Bromoethane + Hydroxide (SN2)
Reaction name: SN2 substitution of bromoethane
Equation: C2H5Br + OH- -> C2H5OH + Br-
Reactants: Bromoethane (C2H5Br), Hydroxide (OH-)
Products: Ethanol (C2H5OH), Bromide (Br-)

---

## SN1 Reaction — Unimolecular Nucleophilic Substitution

**Full Name:** Unimolecular Nucleophilic Substitution
**Also known as:** SN1, carbocation mechanism, solvolysis
**Reaction equation:** R-X -> R+ + X- then R+ + Nu -> R-Nu

### Key Characteristics
- Two-step mechanism: slow ionization then fast nucleophilic capture
- First-order kinetics: rate = k[substrate] only
- Forms a carbocation intermediate
- Stereochemistry: racemization
- Best with tertiary alkyl halides
- Carbocation stability order: tertiary > secondary > primary

### Prototype: tert-Butyl Bromide Solvolysis (SN1)
Reaction name: SN1 solvolysis of tert-butyl bromide
Equation: (CH3)3CBr + H2O -> (CH3)3COH + HBr
Reactants: 2-bromo-2-methylpropane, Water
Products: 2-methyl-2-propanol (tert-butanol), HBr
Atoms in (CH3)3CBr: C1 (central carbon), C2 C3 C4 (methyl carbons), Br1 (bromine), H atoms
Mechanism steps:
1. BOND_BREAK: bond=bond-C1-Br1. The C-Br bond undergoes slow heterolytic cleavage. Rate-determining step.
2. CHARGE_CHANGE: atom=C1, new_charge=1. Central carbon becomes carbocation (charge +1).
3. CHARGE_CHANGE: atom=Br1, new_charge=-1. Bromine becomes bromide ion (charge -1).
4. NUCLEOPHILE_ATTACK: nucleophile_atom=O1, electrophile_atom=C1. Water oxygen attacks the carbocation. Fast step.
5. PROTON_TRANSFER: hydrogen_atom=H4, from_atom=O1, to_atom=O2. Proton transfer to solvent restores neutral oxygen, forming the alcohol.
