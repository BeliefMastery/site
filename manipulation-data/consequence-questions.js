// Consequence Questions - Situational developments and consequences

export const CONSEQUENCE_QUESTIONS = {
  situational: [
    {
      id: 'situational_1',
      question: 'Do conflicts or crises seem to arise at times when you try to assert boundaries?',
      vector: ['fear', 'dependency'],
      weight: 1.3
    },
    {
      id: 'situational_2',
      question: 'Does the other person threaten to leave, harm themselves, or create drama when challenged?',
      vector: ['fear', 'obsession'],
      weight: 1.4
    },
    {
      id: 'situational_3',
      question: 'Do you find yourself making excuses for the other person\'s behavior?',
      vector: ['adoration', 'deception', 'dependency'],
      weight: 1.2
    },
    {
      id: 'situational_4',
      question: 'Has the relationship become increasingly controlling or restrictive over time?',
      vector: ['obsession', 'dependency'],
      weight: 1.3
    }
  ],
  consequences: [
    {
      id: 'consequence_1',
      question: 'Have you lost touch with who you are or what you want?',
      vector: ['deception', 'adoration', 'dependency'],
      weight: 1.3
    },
    {
      id: 'consequence_2',
      question: 'Do you feel you\'ve compromised your values or integrity?',
      vector: ['adoration', 'dependency', 'sexual'],
      weight: 1.2
    },
    {
      id: 'consequence_3',
      question: 'Have you experienced financial, emotional, or physical harm?',
      vector: ['dependency', 'sexual', 'fear'],
      weight: 1.5
    },
    {
      id: 'consequence_4',
      question: 'Do you feel you\'re in danger if you try to leave or change the relationship?',
      vector: ['fear', 'obsession', 'sexual'],
      weight: 1.5
    }
  ]
};

