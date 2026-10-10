# Aromatic and Carbonyl Chemistry
Source: LibreTexts Chemistry, OpenStax Organic Chemistry (Public Domain)

---

## Friedel-Crafts Alkylation of Benzene

**Full Name:** Friedel-Crafts Alkylation
**Also known as:** Electrophilic Aromatic Substitution alkylation, EAS alkylation
**Reaction equation:** C6H6 + CH3Cl -> C6H5CH3 + HCl

### Key Characteristics
- Electrophilic Aromatic Substitution (EAS) mechanism
- Lewis acid generates methyl carbocation electrophile
- Aromatic ring attacks the carbocation to form arenium ion (sigma complex), followed by deprotonation to restore aromaticity

### Prototype: Benzene + Chloromethane (Friedel-Crafts)
Reaction name: Friedel-Crafts Alkylation of Benzene with Chloromethane
Equation: C6H6 + CH3Cl -> C6H5CH3 + HCl
Reactants: Benzene (C6H6), Chloromethane (CH3Cl)
Products: Toluene (C6H5CH3), Hydrogen chloride (HCl)
Atoms in Benzene: C1 C2 C3 C4 C5 C6 (aromatic ring carbons), H1 H2 H3 H4 H5 H6 (ring hydrogens)
Bonds in Benzene: bond-C1-C2 (order 2), bond-C2-C3 (order 1), bond-C3-C4 (order 2), bond-C4-C5 (order 1), bond-C5-C6 (order 2), bond-C6-C1 (order 1), bond-C1-H1 (order 1), bond-C2-H2, bond-C3-H3, bond-C4-H4, bond-C5-H5, bond-C6-H6
Atoms in CH3Cl: C7 (methyl carbon), Cl1 (chlorine leaving group), H7 H8 H9 (hydrogens on C7)
Bonds in CH3Cl: bond-C7-Cl1 (order 1), bond-C7-H7, bond-C7-H8, bond-C7-H9
Mechanism steps:
1. BOND_BREAK: bond=bond-C7-Cl1. The C-Cl bond of chloromethane breaks heterolytically with Lewis acid assistance, forming a methyl carbocation.
2. CHARGE_CHANGE: atom=C7, new_charge=1. Methyl carbon C7 becomes a carbocation (+1).
3. CHARGE_CHANGE: atom=Cl1, new_charge=-1. Chloride ion departs (-1).
4. ELECTROPHILE_ATTACK: electrophile_atom=C7, pi_atom1=C1, pi_atom2=C2. The aromatic pi bond attacks the methyl carbocation.
5. BOND_BREAK: bond=bond-C1-C2. Ring C1=C2 double bond opens to single bond.
6. BOND_FORM: atom1=C1, atom2=C2, order=1. C1-C2 becomes a single bond in the arenium ion.
7. BOND_FORM: atom1=C1, atom2=C7, order=1. New carbon-carbon bond forms between benzene ring C1 and methyl group C7.
8. CHARGE_CHANGE: atom=C7, new_charge=0. Methyl carbon becomes neutral.
9. CHARGE_CHANGE: atom=C2, new_charge=1. Carbon C2 carries positive charge in resonance-stabilized arenium ion.
10. BASE_ABSTRACTION: base_atom=Cl1, hydrogen_atom=H1. Chloride base abstracts proton H1 from sp3 carbon C1.
11. BOND_BREAK: bond=bond-C1-H1. C1-H1 bond breaks.
12. BOND_FORM: atom1=Cl1, atom2=H1, order=1. Hydrogen chloride (HCl) forms.
13. CHARGE_CHANGE: atom=Cl1, new_charge=0. Chloride becomes neutral HCl.
14. BOND_FORM: atom1=C1, atom2=C2, order=2. Carbon-carbon double bond reforms between C1 and C2, fully restoring ring aromaticity in toluene.
15. CHARGE_CHANGE: atom=C2, new_charge=0. Ring carbon returns to neutral formal charge.
