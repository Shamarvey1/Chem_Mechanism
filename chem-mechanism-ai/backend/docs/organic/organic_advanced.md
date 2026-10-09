# Advanced Organic Reactions
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## Esterification Reaction

**Full Name:** Fischer Esterification
**Also known as:** Esterification, Fischer esterification, acid catalyzed esterification, RCOOH ROH reaction
**Reaction equation:** RCOOH + R'OH -> RCOOR' + H2O (acid catalyst)

### Key Characteristics
- Carboxylic acid reacts with alcohol to form ester and water
- Acid-catalyzed (H2SO4 or HCl)
- Reversible equilibrium reaction
- Le Chatelier's principle: excess alcohol or removal of water drives forward
- Mechanism proceeds through protonation of carbonyl oxygen

### Prototype: Acetic Acid + Ethanol Esterification
Reaction name: Esterification of acetic acid with ethanol (Fischer esterification)
Also known as: ethyl acetate synthesis, acetic acid ethanol ester formation
Equation: CH3COOH + C2H5OH -> CH3COOC2H5 + H2O
Reactants: Acetic acid (CH3COOH), Ethanol (C2H5OH)
Products: Ethyl acetate (CH3COOC2H5), Water (H2O)
Mechanism steps:
1. PROTON_TRANSFER: hydrogen_atom=H1, from_atom=H_acid, to_atom=O1. Acid catalyst protonates the carbonyl oxygen of acetic acid, activating the carbon.
2. NUCLEOPHILE_ATTACK: nucleophile_atom=O2, electrophile_atom=C1. The oxygen of ethanol attacks the electrophilic protonated carbonyl carbon. Tetrahedral intermediate forms.
3. BOND_FORM: atom1=C1, atom2=O2, order=1. New C-O bond between acyl carbon and ethanol oxygen forms.
4. PROTON_TRANSFER: hydrogen_atom=H5, from_atom=O2, to_atom=O3. Proton shuffles within tetrahedral intermediate.
5. BOND_BREAK: bond=bond-C1-O3. The C-O bond to the original hydroxyl group (OH of carboxylic acid) breaks, releasing water.
6. CHARGE_CHANGE: atom=O3, new_charge=0. Proton loss from O3 gives water molecule as leaving group.

### Example: Methanol + Benzoic Acid
Reaction name: Esterification of benzoic acid with methanol
Equation: C6H5COOH + CH3OH -> C6H5COOCH3 + H2O
Products: Methyl benzoate (fragrant ester), Water

---

## Electrophilic Aromatic Substitution (EAS)

**Full Name:** Electrophilic Aromatic Substitution
**Also known as:** EAS, Friedel-Crafts, nitration, halogenation, sulfonation of benzene
**Reaction equation:** ArH + E+ -> Ar-E + H+

### Key Characteristics
- Aromatic ring acts as nucleophile attacking electrophile
- Forms arenium ion (sigma complex, Wheland intermediate) then loses H+
- Ortho/para directors vs meta directors
- Friedel-Crafts alkylation and acylation use Lewis acid catalysts (AlCl3)

### Nitration of Benzene
Reaction name: Nitration of benzene, electrophilic aromatic substitution nitration
Equation: C6H6 + HNO3 -> C6H5NO2 + H2O (H2SO4 catalyst)
Reactants: Benzene, Nitric acid, Sulfuric acid (catalyst)
Products: Nitrobenzene, Water
Mechanism steps:
1. PROTON_TRANSFER: Sulfuric acid protonates nitric acid to generate nitronium ion NO2+.
2. ELECTROPHILE_ATTACK: electrophile_atom=N1 (nitronium), pi_atom1=C1, pi_atom2=C2. Nitronium electrophile attacks benzene pi electrons, forming sigma complex (arenium ion).
3. BASE_ABSTRACTION: base_atom=O1 (HSO4-), hydrogen_atom=H1. Loss of proton from the sigma complex restores aromaticity.
4. BOND_FORM: atom1=C1, atom2=N1, order=1. New C-N bond in nitrobenzene product.

---

## Electrophilic Halogenation of Alkenes

**Full Name:** Halogenation of Alkenes (Electrophilic Addition)
**Also known as:** Bromination, chlorination, anti addition, bromine test, decolorization of bromine water
**Reaction equation:** alkene + Br2 -> dibromoalkane (anti addition)

### Prototype: Ethylene + Bromine
Reaction name: Bromination of ethylene, halogenation of alkene
Equation: CH2=CH2 + Br2 -> BrCH2CH2Br (1,2-dibromoethane)
Reactants: Ethylene (CH2=CH2), Bromine (Br2)
Products: 1,2-Dibromoethane
Mechanism steps:
1. ELECTROPHILE_ATTACK: electrophile_atom=Br1, pi_atom1=C1, pi_atom2=C2. One bromine atom of Br2 electrophilically attacks the pi bond, forming a bromonium ion intermediate.
2. BOND_BREAK: bond=bond-Br1-Br2. The Br-Br bond breaks heterolytically; Br- leaves as nucleophile.
3. NUCLEOPHILE_ATTACK: nucleophile_atom=Br2, electrophile_atom=C2. Bromide ion attacks the opposite face of the bromonium ion (anti addition).
4. BOND_FORM: atom1=C2, atom2=Br2, order=1. Second C-Br bond forms, giving the anti-dibromoalkane.

---

## Oxidation Reactions of Organic Compounds

### Oxidation of Alcohol to Aldehyde/Ketone
Reaction name: Oxidation of primary alcohol to aldehyde
Also known as: alcohol oxidation, Swern oxidation, PCC oxidation, chromic acid oxidation
Equation: RCH2OH + [O] -> RCHO + H2O (PCC or Swern)
Reactants: Primary alcohol, Oxidizing agent (PCC, K2Cr2O7, KMnO4)
Products: Aldehyde, Water

### Baeyer-Villiger Oxidation
Reaction name: Baeyer-Villiger oxidation, ketone to ester
Equation: R-CO-R' + mCPBA -> R-COO-R' (ester)
Reactants: Ketone, meta-Chloroperoxybenzoic acid (mCPBA)
Products: Ester

---

## Reactions of Carbonyl Compounds

### Nucleophilic Addition to Carbonyl
Reaction name: Nucleophilic addition to carbonyl, hydride reduction, NaBH4 reduction
Also known as: Carbonyl addition, reduction of ketone, reduction of aldehyde, hydride reduction
Equation: RCHO + NaBH4 -> RCH2OH
Reactants: Aldehyde or ketone, Sodium borohydride (NaBH4)
Products: Primary alcohol (from aldehyde) or secondary alcohol (from ketone)
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=H1 (hydride from BH4-), electrophile_atom=C1 (carbonyl carbon). Hydride ion (H-) attacks the electrophilic carbonyl carbon.
2. BOND_FORM: atom1=H1, atom2=C1, order=1. New C-H bond forms.
3. ELECTRON_PAIR_MOVE: from_bond=bond-C1-O1, to_atom=O1. The C=O pi electrons shift to oxygen, forming alkoxide.
4. PROTON_TRANSFER: hydrogen_atom=H2, from_atom=H2O, to_atom=O1. Aqueous workup protonates the alkoxide to give the alcohol product.

### Wittig Reaction
Reaction name: Wittig reaction, Wittig olefination, phosphorus ylide carbonyl reaction
Equation: R2C=O + Ph3P=CR2 -> R2C=CR2 + Ph3P=O
Reactants: Carbonyl compound (aldehyde or ketone), Phosphorus ylide (Wittig reagent)
Products: Alkene, Triphenylphosphine oxide
