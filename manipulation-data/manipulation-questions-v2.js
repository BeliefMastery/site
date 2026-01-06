// Manipulation Questions - Version 2
// Multi-Phase Questionnaire Architecture
// Optimized for strategic prioritization and experiential assessment

import { MANIPULATION_VECTORS } from './manipulation-vectors.js';

// Phase 1: Vector Screening (6-8 questions)
// Purpose: Binary/3-point questions to quickly identify likely manipulation vectors
export const PHASE_1_VECTOR_SCREENING = [
  {
    id: 'p1_fear_screen',
    question: 'Do you frequently experience fear, anxiety, or feeling threatened in this relationship?',
    type: 'three_point',
    options: [
      {
        text: 'Frequently - I often feel afraid, anxious, or threatened',
        mapsTo: { vector: 'fear', state: 'high', weight: 3 }
      },
      {
        text: 'Sometimes - I occasionally experience fear or anxiety',
        mapsTo: { vector: 'fear', state: 'medium', weight: 1 }
      },
      {
        text: 'Rarely or never - I rarely feel afraid or anxious',
        mapsTo: { vector: 'fear', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_dependency_screen',
    question: 'Do you feel dependent on this person or trapped in the relationship?',
    type: 'three_point',
    options: [
      {
        text: 'Yes, strongly - I feel very dependent or trapped',
        mapsTo: { vector: 'dependency', state: 'high', weight: 3 }
      },
      {
        text: 'Somewhat - I feel some dependency or limited autonomy',
        mapsTo: { vector: 'dependency', state: 'medium', weight: 1 }
      },
      {
        text: 'No - I feel independent and free',
        mapsTo: { vector: 'dependency', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_deception_screen',
    question: 'Do you question your own memory, perception, or reality when interacting with this person?',
    type: 'three_point',
    options: [
      {
        text: 'Frequently - I often doubt my own memory or perception',
        mapsTo: { vector: 'deception', state: 'high', weight: 3 }
      },
      {
        text: 'Sometimes - I occasionally question my memory or perception',
        mapsTo: { vector: 'deception', state: 'medium', weight: 1 }
      },
      {
        text: 'Rarely or never - I trust my memory and perception',
        mapsTo: { vector: 'deception', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_obsession_screen',
    question: 'Does this person show obsessive, possessive, or controlling behaviors?',
    type: 'three_point',
    options: [
      {
        text: 'Yes, strongly - Very obsessive, possessive, or controlling',
        mapsTo: { vector: 'obsession', state: 'high', weight: 3 }
      },
      {
        text: 'Somewhat - Some obsessive or controlling behaviors',
        mapsTo: { vector: 'obsession', state: 'medium', weight: 1 }
      },
      {
        text: 'No - Not obsessive or controlling',
        mapsTo: { vector: 'obsession', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_adoration_screen',
    question: 'Does this person use excessive flattery, idealization, or false admiration?',
    type: 'three_point',
    options: [
      {
        text: 'Yes, frequently - Excessive flattery or idealization',
        mapsTo: { vector: 'adoration', state: 'high', weight: 3 }
      },
      {
        text: 'Sometimes - Occasional flattery or idealization',
        mapsTo: { vector: 'adoration', state: 'medium', weight: 1 }
      },
      {
        text: 'Rarely or never - Genuine appreciation, not excessive',
        mapsTo: { vector: 'adoration', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_sexual_screen',
    question: 'Does this person use sexuality, sexual pressure, or sexual guilt to influence you?',
    type: 'three_point',
    options: [
      {
        text: 'Yes, frequently - Sexual pressure or manipulation is common',
        mapsTo: { vector: 'sexual', state: 'high', weight: 3 }
      },
      {
        text: 'Sometimes - Occasional sexual pressure or influence',
        mapsTo: { vector: 'sexual', state: 'medium', weight: 1 }
      },
      {
        text: 'Rarely or never - No sexual manipulation',
        mapsTo: { vector: 'sexual', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_impact_screen',
    question: 'How significant is the impact of this relationship on your well-being?',
    type: 'three_point',
    options: [
      {
        text: 'Very significant - Major negative impact on my well-being',
        mapsTo: { impact: 'high', weight: 2 }
      },
      {
        text: 'Moderate - Some negative impact',
        mapsTo: { impact: 'medium', weight: 1 }
      },
      {
        text: 'Minimal - Little to no negative impact',
        mapsTo: { impact: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  }
];

// Phase 2: Vector Prioritization (Strategic)
// Purpose: User selects 2-3 vectors to focus on based on Phase 1 results
// This will be dynamically generated based on Phase 1 scores

// Phase 3: Deep Assessment (Experiential)
// Purpose: Detailed questions for prioritized vectors with experiential questions
// Helper function to generate Phase 3 questions for a specific vector
export function generatePhase3VectorQuestions(vectorId, vector, existingQuestions) {
  // Get questions from existing question banks that map to this vector
  const vectorQuestions = {
    symptoms: (existingQuestions.symptoms || []).filter(q => {
      if (!q.vector) return false;
      if (Array.isArray(q.vector)) {
        return q.vector.includes(vectorId);
      }
      return q.vector === vectorId;
    }),
    effects: (existingQuestions.effects || []).filter(q => {
      if (!q.vector) return false;
      if (Array.isArray(q.vector)) {
        return q.vector.includes(vectorId);
      }
      return q.vector === vectorId;
    }),
    consequences: (existingQuestions.consequences || []).filter(q => {
      if (!q.vector) return false;
      if (Array.isArray(q.vector)) {
        return q.vector.includes(vectorId);
      }
      return q.vector === vectorId;
    })
  };
  
  const questions = [];
  
  // Add binary initial filter for symptoms
  if (vectorQuestions.symptoms.length > 0) {
    questions.push({
      id: `p3_${vectorId}_symptoms_binary`,
      question: `Do you experience symptoms related to ${vector.name.toLowerCase()}?`,
      type: 'binary_unsure',
      options: [
        {
          text: 'Yes - I experience these symptoms',
          mapsTo: { vector: vectorId, category: 'symptoms', flow: 'present', weight: 2 }
        },
        {
          text: 'No - I do not experience these symptoms',
          mapsTo: { vector: vectorId, category: 'symptoms', flow: 'absent', weight: 0 }
        },
        {
          text: "I'm not sure",
          mapsTo: { vector: vectorId, category: 'symptoms', flow: 'unknown', weight: 1 }
        }
      ],
      vector: vectorId,
      conditional: {
        'Yes': vectorQuestions.symptoms.slice(0, 3).map(q => ({
          id: `p3_${vectorId}_${q.id}`,
          question: q.question,
          type: 'frequency',
          options: [
            { text: 'Always', mapsTo: { vector: vectorId, frequency: 'always', weight: 3 } },
            { text: 'Often', mapsTo: { vector: vectorId, frequency: 'often', weight: 2 } },
            { text: 'Sometimes', mapsTo: { vector: vectorId, frequency: 'sometimes', weight: 1 } },
            { text: 'Rarely', mapsTo: { vector: vectorId, frequency: 'rarely', weight: 0 } },
            { text: 'Never', mapsTo: { vector: vectorId, frequency: 'never', weight: 0 } }
          ],
          vector: vectorId,
          originalQuestion: q
        }))
      }
    });
  }
  
  // Add effect questions
  if (vectorQuestions.effects.length > 0) {
    questions.push({
      id: `p3_${vectorId}_effects_binary`,
      question: `Have you noticed effects on your life from ${vector.name.toLowerCase()}?`,
      type: 'binary_unsure',
      options: [
        {
          text: 'Yes - I have noticed effects',
          mapsTo: { vector: vectorId, category: 'effects', flow: 'present', weight: 2 }
        },
        {
          text: 'No - I have not noticed effects',
          mapsTo: { vector: vectorId, category: 'effects', flow: 'absent', weight: 0 }
        },
        {
          text: "I'm not sure",
          mapsTo: { vector: vectorId, category: 'effects', flow: 'unknown', weight: 1 }
        }
      ],
      vector: vectorId,
      conditional: {
        'Yes': vectorQuestions.effects.slice(0, 3).map(q => ({
          id: `p3_${vectorId}_${q.id}`,
          question: q.question,
          type: 'frequency',
          options: [
            { text: 'Always', mapsTo: { vector: vectorId, frequency: 'always', weight: 3 } },
            { text: 'Often', mapsTo: { vector: vectorId, frequency: 'often', weight: 2 } },
            { text: 'Sometimes', mapsTo: { vector: vectorId, frequency: 'sometimes', weight: 1 } },
            { text: 'Rarely', mapsTo: { vector: vectorId, frequency: 'rarely', weight: 0 } },
            { text: 'Never', mapsTo: { vector: vectorId, frequency: 'never', weight: 0 } }
          ],
          vector: vectorId,
          originalQuestion: q
        }))
      }
    });
  }
  
  // Add consequence questions
  if (vectorQuestions.consequences.length > 0) {
    questions.push({
      id: `p3_${vectorId}_consequences_binary`,
      question: `Have you experienced consequences from ${vector.name.toLowerCase()}?`,
      type: 'binary_unsure',
      options: [
        {
          text: 'Yes - I have experienced consequences',
          mapsTo: { vector: vectorId, category: 'consequences', flow: 'present', weight: 2 }
        },
        {
          text: 'No - I have not experienced consequences',
          mapsTo: { vector: vectorId, category: 'consequences', flow: 'absent', weight: 0 }
        },
        {
          text: "I'm not sure",
          mapsTo: { vector: vectorId, category: 'consequences', flow: 'unknown', weight: 1 }
        }
      ],
      vector: vectorId,
      conditional: {
        'Yes': vectorQuestions.consequences.slice(0, 3).map(q => ({
          id: `p3_${vectorId}_${q.id}`,
          question: q.question,
          type: 'frequency',
          options: [
            { text: 'Always', mapsTo: { vector: vectorId, frequency: 'always', weight: 3 } },
            { text: 'Often', mapsTo: { vector: vectorId, frequency: 'often', weight: 2 } },
            { text: 'Sometimes', mapsTo: { vector: vectorId, frequency: 'sometimes', weight: 1 } },
            { text: 'Rarely', mapsTo: { vector: vectorId, frequency: 'rarely', weight: 0 } },
            { text: 'Never', mapsTo: { vector: vectorId, frequency: 'never', weight: 0 } }
          ],
          vector: vectorId,
          originalQuestion: q
        }))
      }
    });
  }
  
  return questions;
}

