// Symptom Questions for Manipulation Detection
// Questions that help identify symptoms of manipulation

export const SYMPTOM_QUESTIONS = {
  emotional: [
    {
      id: 'emotion_1',
      question: 'Do you frequently feel anxious, fearful, or on edge in this relationship?',
      vector: ['fear', 'dependency'],
      weight: 1.2
    },
    {
      id: 'emotion_2',
      question: 'Do you doubt your own memory, perception, or judgment?',
      vector: ['deception'],
      weight: 1.3
    },
    {
      id: 'emotion_3',
      question: 'Do you feel responsible for the other person\'s emotional state?',
      vector: ['dependency', 'fear'],
      weight: 1.2
    },
    {
      id: 'emotion_4',
      question: 'Do you feel trapped, voiceless, or unable to set boundaries?',
      vector: ['dependency', 'fear', 'obsession'],
      weight: 1.3
    },
    {
      id: 'emotion_5',
      question: 'Do you suppress your authentic self to avoid conflict or rejection?',
      vector: ['fear', 'adoration', 'obsession'],
      weight: 1.2
    }
  ],
  behavioral: [
    {
      id: 'behavior_1',
      question: 'Do you find yourself walking on eggshells to avoid triggering reactions?',
      vector: ['fear', 'obsession'],
      weight: 1.3
    },
    {
      id: 'behavior_2',
      question: 'Do you feel you must constantly prove your worth or loyalty?',
      vector: ['adoration', 'obsession', 'dependency'],
      weight: 1.2
    },
    {
      id: 'behavior_3',
      question: 'Do you avoid expressing disagreement or setting boundaries?',
      vector: ['fear', 'dependency'],
      weight: 1.3
    },
    {
      id: 'behavior_4',
      question: 'Do you feel you must manage the other person\'s emotions or crises?',
      vector: ['dependency', 'fear'],
      weight: 1.2
    },
    {
      id: 'behavior_5',
      question: 'Do you find yourself isolated from friends, family, or support systems?',
      vector: ['obsession', 'dependency', 'sexual'],
      weight: 1.4
    }
  ],
  cognitive: [
    {
      id: 'cognitive_1',
      question: 'Do you question whether events actually happened as you remember them?',
      vector: ['deception'],
      weight: 1.4
    },
    {
      id: 'cognitive_2',
      question: 'Do you feel confused about what is real or true in the relationship?',
      vector: ['deception', 'adoration'],
      weight: 1.3
    },
    {
      id: 'cognitive_3',
      question: 'Do you feel you\'re "going crazy" or losing your mind?',
      vector: ['deception', 'fear'],
      weight: 1.4
    },
    {
      id: 'cognitive_4',
      question: 'Do you find it difficult to make decisions without the other person\'s approval?',
      vector: ['dependency', 'obsession'],
      weight: 1.2
    }
  ],
  relational: [
    {
      id: 'relational_1',
      question: 'Does the relationship feel like a rollercoaster of highs and lows?',
      vector: ['obsession', 'adoration', 'fear'],
      weight: 1.2
    },
    {
      id: 'relational_2',
      question: 'Do you feel the other person is monitoring or controlling your activities?',
      vector: ['obsession', 'dependency'],
      weight: 1.3
    },
    {
      id: 'relational_3',
      question: 'Do you feel the relationship is conditional on your compliance?',
      vector: ['dependency', 'fear', 'sexual'],
      weight: 1.3
    },
    {
      id: 'relational_4',
      question: 'Do you feel you\'re being punished for asserting independence?',
      vector: ['obsession', 'dependency', 'fear'],
      weight: 1.3
    }
  ],
  physical: [
    {
      id: 'physical_1',
      question: 'Do you experience physical tension, headaches, or stress-related symptoms?',
      vector: ['fear', 'obsession', 'dependency'],
      weight: 1.1
    },
    {
      id: 'physical_2',
      question: 'Do you feel your physical boundaries are being violated?',
      vector: ['sexual', 'obsession'],
      weight: 1.4
    },
    {
      id: 'physical_3',
      question: 'Do you feel unsafe or threatened in the relationship?',
      vector: ['fear', 'sexual'],
      weight: 1.5
    }
  ]
};

