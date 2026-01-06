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
    description: 'Dependency means feeling you cannot leave or function without them. Examples: feeling you need their permission for decisions, relying on them for basic needs, or feeling you have no other options.',
    type: 'three_point',
    options: [
      {
        text: 'Yes, strongly - I feel very dependent or trapped',
        mapsTo: { vector: 'dependency', state: 'high', weight: 3 }
      },
      {
        text: 'Somewhat - I feel some dependency or limited freedom to make my own choices',
        mapsTo: { vector: 'dependency', state: 'medium', weight: 1 }
      },
      {
        text: 'No - I feel independent and free to make my own choices',
        mapsTo: { vector: 'dependency', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_deception_screen',
    question: 'Do you question your own memory, perception, or reality when interacting with this person?',
    description: 'This includes "gaslighting" - when someone makes you doubt what you know happened. Examples: They say "That never happened" when you remember it clearly, or "You\'re remembering it wrong" about events you witnessed.',
    type: 'three_point',
    options: [
      {
        text: 'Frequently - I often doubt my own memory or what I know to be true',
        mapsTo: { vector: 'deception', state: 'high', weight: 3 }
      },
      {
        text: 'Sometimes - I occasionally question my memory or perception',
        mapsTo: { vector: 'deception', state: 'medium', weight: 1 }
      },
      {
        text: 'Rarely or never - I trust my memory and what I know to be true',
        mapsTo: { vector: 'deception', state: 'low', weight: 0 }
      }
    ],
    category: 'screening'
  },
  {
    id: 'p1_obsession_screen',
    question: 'Does this person show obsessive, possessive, or controlling behaviors?',
    description: 'Obsessive means they can\'t let go or need constant contact. Possessive means they act like they own you. Controlling means they try to dictate your choices. Examples: constant texting/calling, jealousy over friends, telling you what to wear or who to see.',
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
    description: 'Idealization means they put you on a pedestal unrealistically. False admiration is praise that feels insincere or used to get something. Examples: "You\'re perfect" when you\'re not, excessive compliments that feel manipulative, or praise that comes with strings attached.',
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
    description: 'Sexual manipulation includes pressuring you into sexual acts, using sex as a reward/punishment, or making you feel guilty about your sexuality. Examples: "If you loved me, you would..." or withholding affection until you comply, or shaming you about your sexual needs.',
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
  
  // Add multi-select question for symptoms
  if (vectorQuestions.symptoms.length > 0) {
    questions.push({
      id: `p3_${vectorId}_symptoms_multiselect`,
      question: `Which of these symptoms related to ${vector.name.toLowerCase()} do you experience?`,
      description: `Symptoms are ways this type of manipulation shows up in your thoughts, feelings, or behaviors. Select all that apply.`,
      type: 'multiselect',
      maxSelections: vectorQuestions.symptoms.length, // Allow selecting all
      options: vectorQuestions.symptoms.map(q => ({
        text: q.question,
        mapsTo: { 
          vector: vectorId, 
          category: 'symptoms', 
          symptomId: q.id,
          weight: q.weight || 1 
        },
        originalQuestion: q
      })),
      vector: vectorId,
      conditional: {
        // For each selected symptom, ask frequency
        'selected': vectorQuestions.symptoms.map(q => ({
          id: `p3_${vectorId}_${q.id}_frequency`,
          question: `How often do you experience: "${q.question}"?`,
          type: 'frequency',
          options: [
            { text: 'Always', mapsTo: { vector: vectorId, frequency: 'always', weight: 3 } },
            { text: 'Often', mapsTo: { vector: vectorId, frequency: 'often', weight: 2 } },
            { text: 'Sometimes', mapsTo: { vector: vectorId, frequency: 'sometimes', weight: 1 } },
            { text: 'Rarely', mapsTo: { vector: vectorId, frequency: 'rarely', weight: 0 } },
            { text: 'Never', mapsTo: { vector: vectorId, frequency: 'never', weight: 0 } }
          ],
          vector: vectorId,
          originalQuestion: q,
          conditional: true // Only show if symptom was selected
        }))
      }
    });
  }
  
  // Add multi-select question for effects
  if (vectorQuestions.effects.length > 0) {
    questions.push({
      id: `p3_${vectorId}_effects_multiselect`,
      question: `Which of these effects on your life from ${vector.name.toLowerCase()} have you noticed?`,
      description: `Effects are changes in your life caused by this manipulation. Select all that apply.`,
      type: 'multiselect',
      maxSelections: vectorQuestions.effects.length, // Allow selecting all
      options: vectorQuestions.effects.map(q => ({
        text: q.question,
        mapsTo: { 
          vector: vectorId, 
          category: 'effects', 
          effectId: q.id,
          weight: q.weight || 1 
        },
        originalQuestion: q
      })),
      vector: vectorId,
      conditional: {
        // For each selected effect, ask frequency
        'selected': vectorQuestions.effects.map(q => ({
          id: `p3_${vectorId}_${q.id}_frequency`,
          question: `How often do you experience: "${q.question}"?`,
          type: 'frequency',
          options: [
            { text: 'Always', mapsTo: { vector: vectorId, frequency: 'always', weight: 3 } },
            { text: 'Often', mapsTo: { vector: vectorId, frequency: 'often', weight: 2 } },
            { text: 'Sometimes', mapsTo: { vector: vectorId, frequency: 'sometimes', weight: 1 } },
            { text: 'Rarely', mapsTo: { vector: vectorId, frequency: 'rarely', weight: 0 } },
            { text: 'Never', mapsTo: { vector: vectorId, frequency: 'never', weight: 0 } }
          ],
          vector: vectorId,
          originalQuestion: q,
          conditional: true // Only show if effect was selected
        }))
      }
    });
  }
  
  // Add multi-select question for consequences
  if (vectorQuestions.consequences.length > 0) {
    questions.push({
      id: `p3_${vectorId}_consequences_multiselect`,
      question: `Which of these consequences from ${vector.name.toLowerCase()} have you experienced?`,
      description: `Consequences are serious outcomes or patterns that have developed. Select all that apply.`,
      type: 'multiselect',
      maxSelections: vectorQuestions.consequences.length, // Allow selecting all
      options: vectorQuestions.consequences.map(q => ({
        text: q.question,
        mapsTo: { 
          vector: vectorId, 
          category: 'consequences', 
          consequenceId: q.id,
          weight: q.weight || 1 
        },
        originalQuestion: q
      })),
      vector: vectorId,
      conditional: {
        // For each selected consequence, ask frequency
        'selected': vectorQuestions.consequences.map(q => ({
          id: `p3_${vectorId}_${q.id}_frequency`,
          question: `How often do you experience: "${q.question}"?`,
          type: 'frequency',
          options: [
            { text: 'Always', mapsTo: { vector: vectorId, frequency: 'always', weight: 3 } },
            { text: 'Often', mapsTo: { vector: vectorId, frequency: 'often', weight: 2 } },
            { text: 'Sometimes', mapsTo: { vector: vectorId, frequency: 'sometimes', weight: 1 } },
            { text: 'Rarely', mapsTo: { vector: vectorId, frequency: 'rarely', weight: 0 } },
            { text: 'Never', mapsTo: { vector: vectorId, frequency: 'never', weight: 0 } }
          ],
          vector: vectorId,
          originalQuestion: q,
          conditional: true // Only show if consequence was selected
        }))
      }
    });
  }
  
  return questions;
}

