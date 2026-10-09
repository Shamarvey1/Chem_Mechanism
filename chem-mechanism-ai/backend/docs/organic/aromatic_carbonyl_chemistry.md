# Aromatic and Carbonyl Chemistry
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## Friedel-Crafts Alkylation of Benzene

**Full Name:** Friedel-Crafts Alkylation
**Also known as:** Electrophilic Aromatic Substitution (EAS) alkylation
**Reaction equation:** C6H6 + CH3Cl -> C6H5CH3 + HCl (with AlCl3 catalyst)

### Key Characteristics
- Electrophilic Aromatic Substitution mechanism.
- Requires a Lewis acid catalyst (like AlCl3, FeCl3) to generate the electrophile.
- The electrophile is a carbocation (or a highly polarized complex).
- Subject to carbocation rearrangements.
- Polyalkylation can occur because the alkyl group activates the ring.

### Prototype: Benzene + Chloromethane
Reaction name: Friedel-Crafts Alkylation of Benzene with Chloromethane
Equation: C6H6 + CH3Cl -> C6H5CH3 + HCl
Reactants: Benzene (C6H6), Chloromethane (CH3Cl), Aluminum chloride (AlCl3)
Products: Toluene (C6H5CH3), Hydrogen chloride (HCl), Aluminum chloride (AlCl3)
Mechanism steps:
1. NUCLEOPHILE_ATTACK: nucleophile_atom=Cl1, electrophile_atom=Al1. The chlorine atom of chloromethane attacks the Lewis acid AlCl3 to form a polarized complex.
2. BOND_BREAK: bond=bond-C1-Cl1. The C-Cl bond breaks heterolytically to generate a methyl carbocation (C1) and AlCl4-.
3. NUCLEOPHILE_ATTACK: nucleophile_atom=C_ring, electrophile_atom=C1. The pi electrons of the benzene ring attack the methyl carbocation, forming a sigma complex (arenium ion).
4. CHARGE_CHANGE: atom=C_ring_adj, new_charge=1. The adjacent carbon on the ring becomes a carbocation, breaking the aromaticity.
5. PROTON_TRANSFER: hydrogen_atom=H_ring, from_atom=C_ring, to_atom=Cl2. A chloride ion from AlCl4- acts as a base and abstracts the proton from the sp3 carbon of the sigma complex.
6. BOND_FORM: atom1=H_ring, atom2=Cl2, order=1. Formation of HCl.
7. RESONANCE: from_atom=C_ring, to_atom=C_ring_adj. Electrons from the broken C-H bond flow back into the ring to restore aromaticity.

---

## Aldol Condensation

**Full Name:** Aldol Addition and Condensation
**Also known as:** Aldol reaction
**Reaction equation:** 2 CH3CHO -> CH3CH=CHCHO + H2O (with base catalyst and heat)

### Key Characteristics
- Involves aldehydes or ketones with at least one alpha-hydrogen.
- Base-catalyzed (e.g., NaOH) or acid-catalyzed.
- Forms a beta-hydroxy aldehyde/ketone (aldol) initially.
- Dehydration (loss of water) often follows, especially with heat, to form an alpha,beta-unsaturated carbonyl compound.

### Prototype: Acetaldehyde Aldol Condensation
Reaction name: Base-catalyzed Aldol Condensation of Acetaldehyde
Equation: 2 CH3CHO -> CH3CH=CHCHO + H2O
Reactants: Acetaldehyde (CH3CHO) molecule 1, Acetaldehyde (CH3CHO) molecule 2, Hydroxide (OH-)
Products: Crotonaldehyde (CH3CH=CHCHO), Water (H2O), Hydroxide (OH-)
Mechanism steps:
1. BASE_ABSTRACTION: base_atom=O_base, hydrogen_atom=H_alpha. The hydroxide ion abstracts an alpha-proton from acetaldehyde molecule 1.
2. BOND_BREAK: bond=bond-C_alpha-H_alpha. The C-H bond breaks.
3. ELECTRON_PAIR_MOVE: from_atom=C_alpha, to_atom=C_alpha. The alpha carbon becomes an enolate carbanion (resonance stabilized).
4. NUCLEOPHILE_ATTACK: nucleophile_atom=C_alpha, electrophile_atom=C_carbonyl. The enolate attacks the carbonyl carbon of acetaldehyde molecule 2.
5. BOND_FORM: atom1=C_alpha, atom2=C_carbonyl, order=1. A new carbon-carbon single bond is formed.
6. ELECTRON_PAIR_MOVE: from_atom=C_carbonyl, to_atom=O_carbonyl. The pi electrons of the carbonyl group move to the oxygen, forming an alkoxide intermediate.
7. PROTON_TRANSFER: hydrogen_atom=H_water, from_atom=O_water, to_atom=O_carbonyl. The alkoxide oxygen abstracts a proton from water to form the aldol (beta-hydroxy aldehyde).
8. BASE_ABSTRACTION: base_atom=O_base, hydrogen_atom=H_alpha2. (Dehydration step) Hydroxide abstracts another alpha-proton.
9. ELECTRON_PAIR_MOVE: from_atom=C_alpha, to_atom=C_carbonyl. Electrons form a pi bond between the alpha and beta carbons.
10. BOND_BREAK: bond=bond-C_beta-O_beta. The hydroxide group on the beta carbon leaves, completing the elimination to form crotonaldehyde and water.
