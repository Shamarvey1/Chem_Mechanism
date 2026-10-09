# Organic Addition Reactions and Grignard Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## Electrophilic Addition to Alkenes

**Full Name:** Electrophilic Addition
**Also known as:** Addition to double bond, Markovnikov addition
**Reaction equation:** alkene + HX -> alkyl halide

### Prototype: Ethylene + HBr
Reaction name: Electrophilic addition of HBr to ethylene
Equation: CH2=CH2 + HBr -> CH3CH2Br
Reactants: Ethylene (CH2=CH2), Hydrogen bromide (HBr)
Products: Bromoethane (CH3CH2Br)
Mechanism steps:
1. ELECTROPHILE_ATTACK: electrophile_atom=H1, pi_atom1=C1, pi_atom2=C2. The proton H+ from HBr attacks the pi electrons of the double bond.
2. BOND_BREAK: bond=bond-pi-C1-C2. The pi bond breaks. The electrons are used to form the C-H bond.
3. CHARGE_CHANGE: atom=C2, new_charge=1. One carbon becomes a carbocation (Markovnikov: more substituted carbon).
4. NUCLEOPHILE_ATTACK: nucleophile_atom=Br1, electrophile_atom=C2. Bromide ion attacks the carbocation.
5. BOND_FORM: atom1=C2, atom2=Br1, order=1. New C-Br bond forms, giving bromoethane.

### Markovnikov's Rule
Proton adds to the carbon bearing more hydrogen atoms; halide adds to the more substituted carbon.

---

## Grignard Reaction

**Full Name:** Grignard Reaction — Organomagnesium Addition
**Also known as:** Grignard addition, organomagnesium reagent reaction, Grignard reagent addition to carbonyl
**Reaction equation:** RMgBr + R'CHO -> R-CH(OH)-R' (after workup)
**Named after:** Victor Grignard (Nobel Prize 1912)

### Key Characteristics
- Grignard reagent (RMgBr) acts as a carbanion nucleophile (carbon nucleophile)
- The carbon attached to Mg has partial negative character (C-Mg bond is polarized)
- Attacks electrophilic carbonyl carbon (C=O)
- Must be done in anhydrous (dry) conditions — Grignard reagent destroyed by water/protic solvents
- Final product is an alcohol (after acid workup with H3O+)
- Reaction done in dry ether (Et2O) or THF solvent
- Grignard + formaldehyde gives primary alcohol
- Grignard + aldehyde gives secondary alcohol
- Grignard + ketone gives tertiary alcohol
- Grignard + CO2 gives carboxylic acid (after workup)
- Grignard + ester gives tertiary alcohol

### Prototype: Methylmagnesium Bromide + Formaldehyde (Grignard)
Reaction name: Grignard addition of methylmagnesium bromide to formaldehyde
Also known as: Grignard reaction, CH3MgBr and HCHO, methylmagnesium bromide formaldehyde addition
Equation: CH3MgBr + HCHO -> CH3CH2OH (after H3O+ workup)
Reactants: Methylmagnesium bromide (CH3MgBr), Formaldehyde (HCHO)
Products: Ethanol (CH3CH2OH), MgBr(OH) (magnesium salt)
Atoms in CH3MgBr: C1 (carbon bonded to Mg), Mg1 (magnesium), Br1 (bromine), H1 H2 H3 (on C1)
Bonds in CH3MgBr: bond-C1-Mg1 (C-Mg, order 1), bond-Mg1-Br1 (Mg-Br, order 1), bond-C1-H1 bond-C1-H2 bond-C1-H3 (C-H bonds)
Atoms in HCHO: C2 (carbonyl carbon), O1 (carbonyl oxygen), H4 H5 (hydrogens)
Bonds in HCHO: bond-C2-O1 (C=O, order 2), bond-C2-H4 bond-C2-H5 (C-H bonds)
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=C1, electrophile_atom=C2. The carbanion carbon C1 of the Grignard reagent attacks the electrophilic carbonyl carbon C2 of formaldehyde. This is the key carbon-carbon bond forming step.
2. BOND_FORM: atom1=C1, atom2=C2, order=1. A new carbon-carbon single bond forms between the Grignard carbon and the carbonyl carbon.
3. ELECTRON_PAIR_MOVE: from_bond=bond-C2-O1, to_atom=O1. The pi electrons of the C=O bond shift to the oxygen atom, forming an alkoxide intermediate.
4. CHARGE_CHANGE: atom=O1, new_charge=-1. The oxygen becomes an alkoxide anion (O-) bonded to MgBr to form the magnesium alkoxide intermediate.
5. PROTON_TRANSFER: hydrogen_atom=H6, from_atom=O2, to_atom=O1. During aqueous acid workup, a proton from H3O+ protonates the alkoxide oxygen, giving the final alcohol product (ethanol).

### Example: Phenylmagnesium Bromide + Acetone (Grignard)
Reaction name: Grignard addition of phenylmagnesium bromide to acetone
Equation: PhMgBr + (CH3)2CO -> Ph-C(CH3)2-OH (after workup)
Products: 2-phenyl-2-propanol (tertiary alcohol)

### Example: Ethylmagnesium Bromide + Benzaldehyde (Grignard)
Reaction name: Grignard addition to benzaldehyde
Equation: C2H5MgBr + PhCHO -> Ph-CH(OH)-C2H5 (after workup)
Products: 1-phenylpropan-1-ol (secondary alcohol)

---

## Aldol Condensation

**Full Name:** Aldol Condensation Reaction
**Also known as:** Aldol reaction, aldol addition, crossed aldol condensation, intramolecular aldol
**Reaction equation:** 2 CH3CHO -> CH3CH(OH)CH2CHO (aldol), then -> CH3CH=CHCHO + H2O (condensation)

### Key Characteristics
- Alpha carbon of one carbonyl compound attacks the carbonyl carbon of another
- Base-catalyzed (NaOH) or acid-catalyzed (H+)
- Product is a beta-hydroxy carbonyl compound (aldol product)
- Dehydration of aldol product gives an alpha,beta-unsaturated carbonyl (condensation product)
- Crossed aldol uses two different carbonyl compounds

### Prototype: Acetaldehyde Aldol (Base Catalyzed)
Reaction name: Aldol condensation of acetaldehyde
Equation: 2 CH3CHO -[NaOH]-> CH3CH(OH)CH2CHO
Mechanism steps:
1. BASE_ABSTRACTION: base_atom=O1 (hydroxide), hydrogen_atom=H1 (alpha hydrogen on C2). Base removes alpha hydrogen, forming enolate.
2. NUCLEOPHILE_ATTACK: nucleophile_atom=C2 (enolate carbon), electrophile_atom=C3 (carbonyl of second aldehyde). Carbon nucleophile attacks the second carbonyl carbon.
3. BOND_FORM: atom1=C2, atom2=C3, order=1. New C-C bond forms between the two acetaldehyde units.
4. PROTON_TRANSFER: hydrogen_atom=H2, from_atom=O2, to_atom=O3. Protonation of the alkoxide intermediate gives the beta-hydroxy aldehyde (aldol product).

---

## Diels-Alder Reaction

**Full Name:** Diels-Alder Cycloaddition
**Also known as:** [4+2] cycloaddition, Diels-Alder, diene synthesis, pericyclic reaction
**Named after:** Otto Diels and Kurt Alder (Nobel Prize 1950)
**Reaction equation:** diene + dienophile -> cyclohexene

### Key Characteristics
- Concerted pericyclic [4+2] cycloaddition reaction
- One step with no intermediates — highly stereospecific
- Diene must be in s-cis conformation
- Electron-withdrawing groups on dienophile activate it
- Syn addition (endo rule for stereo)
- Endo product is kinetically favored

### Prototype: Butadiene + Ethylene Diels-Alder
Reaction name: Diels-Alder cycloaddition of butadiene and ethylene
Also known as: Diels-Alder reaction, [4+2] cycloaddition
Equation: CH2=CH-CH=CH2 + CH2=CH2 -> cyclohexene
Reactants: 1,3-Butadiene (diene), Ethylene (dienophile)
Products: Cyclohexene
Mechanism steps:
1. ELECTRON_PAIR_MOVE: from_bond=bond-C1-C2, to_atom=C4. Pi electrons of diene shift in concerted fashion.
2. BOND_FORM: atom1=C1, atom2=C5, order=1. New sigma bond forms between C1 of diene and C5 of dienophile.
3. BOND_FORM: atom1=C4, atom2=C6, order=1. New sigma bond forms between C4 of diene and C6 of dienophile.
4. BOND_FORM: atom1=C2, atom2=C3, order=2. New pi bond forms in the center of the ring.
