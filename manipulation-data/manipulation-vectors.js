// 6 Core Manipulation Vectors
// Based on Appendix 3: Tactical Manipulation Compendium

export const MANIPULATION_VECTORS = {
  fear: {
    id: 'fear',
    name: 'Fear-Based Exploitation',
    description: 'Tactics that use fear, threats, and emotional manipulation to control behavior.',
    tactics: [1, 2, 3, 4, 5, 6],
    weight: 1.3
  },
  dependency: {
    id: 'dependency',
    name: 'Dependency & Control-Based Exploitation',
    description: 'Tactics that create dependency, control resources, and limit autonomy.',
    tactics: [7, 8, 9, 10, 11, 12],
    weight: 1.2
  },
  deception: {
    id: 'deception',
    name: 'Deception & Illusion-Based Exploitation',
    description: 'Tactics that distort reality, gaslight, and create false narratives.',
    tactics: [13, 14, 15, 16, 17, 18],
    weight: 1.3
  },
  obsession: {
    id: 'obsession',
    name: 'Obsession-Based Exploitation',
    description: 'Tactics that create obsessive attachment, jealousy, and possessive control.',
    tactics: [19, 20, 21, 22, 23, 24],
    weight: 1.2
  },
  adoration: {
    id: 'adoration',
    name: 'Adoration-Based Exploitation',
    description: 'Tactics that use flattery, idealization, and false admiration to manipulate.',
    tactics: [25, 26, 27, 28, 29, 30],
    weight: 1.1
  },
  sexual: {
    id: 'sexual',
    name: 'Sexual Exploitation',
    description: 'Tactics that use sexuality, guilt, and physical control to manipulate.',
    tactics: [31, 32, 33, 34, 35, 36],
    weight: 1.4
  }
};

