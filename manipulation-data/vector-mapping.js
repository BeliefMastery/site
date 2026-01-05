// Vector Mapping - Maps symptoms/effects/consequences to manipulation vectors

export const VECTOR_MAPPING = {
  // Maps question responses to likely manipulation vectors
  fear: {
    symptoms: ['emotion_1', 'emotion_3', 'emotion_4', 'behavior_1', 'behavior_3', 'physical_1', 'physical_3'],
    effects: ['autonomy_2', 'functioning_1'],
    consequences: ['situational_1', 'situational_2', 'consequence_4'],
    threshold: 0.6
  },
  dependency: {
    symptoms: ['emotion_1', 'emotion_3', 'emotion_4', 'behavior_2', 'behavior_4', 'cognitive_4'],
    effects: ['autonomy_1', 'autonomy_2', 'functioning_2'],
    consequences: ['situational_1', 'situational_4', 'consequence_1'],
    threshold: 0.6
  },
  deception: {
    symptoms: ['emotion_2', 'cognitive_1', 'cognitive_2', 'cognitive_3'],
    effects: ['self_worth_1'],
    consequences: ['situational_3', 'consequence_1'],
    threshold: 0.7
  },
  obsession: {
    symptoms: ['emotion_4', 'emotion_5', 'behavior_1', 'behavior_2', 'behavior_5', 'relational_1', 'relational_2', 'relational_4'],
    effects: ['autonomy_1', 'relationships_1', 'functioning_1', 'functioning_2'],
    consequences: ['situational_2', 'situational_4'],
    threshold: 0.6
  },
  adoration: {
    symptoms: ['emotion_5', 'behavior_2', 'cognitive_2', 'relational_1'],
    effects: ['self_worth_1', 'self_worth_2'],
    consequences: ['situational_3', 'consequence_1', 'consequence_2'],
    threshold: 0.6
  },
  sexual: {
    symptoms: ['behavior_5', 'physical_2', 'physical_3', 'relational_3'],
    effects: ['autonomy_2'],
    consequences: ['consequence_2', 'consequence_3', 'consequence_4'],
    threshold: 0.7
  }
};

