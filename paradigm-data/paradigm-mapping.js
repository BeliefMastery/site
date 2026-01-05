// Paradigm Mapping and Scoring
// Defines how questionnaire responses map to paradigm identification

export const PARADIGM_SCORING = {
  // Scoring thresholds for paradigm identification
  primaryThreshold: 7.0,  // Score >= 7 indicates primary alignment
  secondaryThreshold: 5.0,  // Score >= 5 indicates secondary alignment
  tertiaryThreshold: 3.0,  // Score >= 3 indicates tertiary alignment
  
  // Weight multipliers for different question types
  dimensionWeights: {
    literal: 1.0,
    symbolic: 1.2,
    esoteric: 1.3,
    mystical: 1.5
  },
  
  // Priority levels based on weighted scores
  priorityLevels: {
    high: 8.0,      // Weighted score >= 8.0
    moderate: 5.0,  // Weighted score >= 5.0
    low: 3.0       // Weighted score >= 3.0
  }
};

export const PARADIGM_QUESTIONS = {
  // Initial screening questions to determine which paradigms to explore
  screening: [
    {
      id: "good_life_focus",
      question: "What is your primary focus in life?",
      options: [
        { text: "Action, achievement, and tangible results", mapsTo: "active" },
        { text: "Understanding, reflection, and inner depth", mapsTo: "contemplative" },
        { text: "Service, care, and contributing to others", mapsTo: "devotional" }
      ]
    },
    {
      id: "god_orientation",
      question: "How do you primarily relate to the concept of God or ultimate reality?",
      options: [
        { text: "As a logical necessity or organizing principle", mapsTo: "logical" },
        { text: "As an experiential phenomenon or felt presence", mapsTo: "experiential" },
        { text: "As a biological or evolutionary function", mapsTo: "biological" },
        { text: "As a social or cultural construct", mapsTo: "social" },
        { text: "As a relational presence or personal being", mapsTo: "relational" },
        { text: "As a psychological function or structure", mapsTo: "psychological" }
      ]
    }
  ]
};

