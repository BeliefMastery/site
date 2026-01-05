// Effect Questions - How manipulation affects your life

export const EFFECT_QUESTIONS = {
  self_worth: [
    {
      id: 'worth_1',
      question: 'Has your self-esteem or self-confidence decreased since this relationship began?',
      vector: ['adoration', 'deception', 'dependency'],
      weight: 1.2
    },
    {
      id: 'worth_2',
      question: 'Do you feel you\'re not good enough or unworthy of better treatment?',
      vector: ['adoration', 'dependency'],
      weight: 1.3
    }
  ],
  autonomy: [
    {
      id: 'autonomy_1',
      question: 'Have you lost independence in decision-making or personal choices?',
      vector: ['dependency', 'obsession'],
      weight: 1.3
    },
    {
      id: 'autonomy_2',
      question: 'Do you feel you cannot leave or end the relationship?',
      vector: ['fear', 'dependency', 'obsession'],
      weight: 1.4
    }
  ],
  relationships: [
    {
      id: 'relationships_1',
      question: 'Have other important relationships suffered due to this one?',
      vector: ['obsession', 'dependency'],
      weight: 1.2
    },
    {
      id: 'relationships_2',
      question: 'Do friends or family express concern about this relationship?',
      vector: ['obsession', 'dependency', 'fear'],
      weight: 1.1
    }
  ],
  functioning: [
    {
      id: 'functioning_1',
      question: 'Has your work, school, or daily functioning been negatively impacted?',
      vector: ['obsession', 'fear', 'dependency'],
      weight: 1.2
    },
    {
      id: 'functioning_2',
      question: 'Do you spend excessive time managing or responding to this person\'s needs?',
      vector: ['dependency', 'obsession'],
      weight: 1.3
    }
  ]
};

