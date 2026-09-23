const mechanismSchema = {
  reaction: {
    input: "",
    type: ""
  },
  reactants: [],
  products: [],
  steps: []
};

const sn2Example = {
  reaction: {
    input: "CH3Br + OH- -> CH3OH + Br-",
    type: "SN2"
  },

  reactants: [
    { name: "Bromomethane", formula: "CH3Br", role: "electrophile" },
    { name: "Hydroxide ion", formula: "OH-", role: "nucleophile" }
  ],

  products: [
    { name: "Methanol", formula: "CH3OH" },
    { name: "Bromide ion", formula: "Br-" }
  ],

  steps: [
    {
      stepNumber: 1,
      description: "Nucleophile attack: OH- approaches the carbon from the back side, opposite to the leaving group.",
      bondFormed: "O-C",
      bondBroken: null,
      electronMovement: "Lone pair on OH- attacks the electrophilic carbon of CH3Br."
    },
    {
      stepNumber: 2,
      description: "Transition state: carbon becomes pentacoordinate in a trigonal bipyramidal geometry.",
      bondFormed: null,
      bondBroken: null,
      electronMovement: "Partial bond formation with O and partial bond breaking with Br simultaneously."
    },
    {
      stepNumber: 3,
      description: "C-Br bond breaking: the C-Br bond breaks as electrons move to bromine.",
      bondFormed: null,
      bondBroken: "C-Br",
      electronMovement: "Electron pair from C-Br bond moves to Br, forming Br- as the leaving group."
    }
  ]
};

module.exports = { mechanismSchema, sn2Example };
