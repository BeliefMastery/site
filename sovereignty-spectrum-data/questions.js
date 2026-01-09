// Spectrum Questions - Organized by phase for the assessment flow
// Questions are dynamically generated based on selected paradigms in Phase 1

export const SPECTRUM_QUESTIONS = {
  // Phase 1: Paradigm Affinity Selection
  // This is handled by rendering paradigm cards, not traditional questions
  
  // Phase 2: Intents & Practicalities
  // These questions probe behavioral alignment with selected paradigms
  // Generated dynamically based on Phase 1 selections
  phase2_intents: {
    category: 'Intents',
    description: 'How well do your actions align with your stated intents?',
    template: 'How often do you act on the intent to [INTENT]?',
    scale: '1 = Never, 5 = Always'
  },
  
  phase2_practicalities: {
    category: 'Practicalities',
    description: 'How consistently do you live according to your values in daily life?',
    template: 'In daily life, how consistently do you [PRACTICAL_BEHAVIOR]?',
    scale: '1 = Rarely, 5 = Consistently'
  },
  
  // Phase 3: Derailer Audit
  // Uses questions from derailers.js
  
  // Phase 4: Optional Refinement
  // Targeted questions for low-scorers or specific paradigm combinations
  phase4_refinement: [
    {
      id: 'refine_1',
      text: 'If you scored low on alignment, what specific obstacles prevent you from living according to your values?',
      type: 'text',
      condition: 'spectrumPosition < 50'
    },
    {
      id: 'refine_2',
      text: 'Which paradigm subset resonates most with your actual lived experience?',
      type: 'select',
      condition: 'selectedParadigms.length > 0'
    },
    {
      id: 'refine_3',
      text: 'What would need to change for you to move 10 points higher on the spectrum?',
      type: 'text',
      condition: 'spectrumPosition < 90'
    }
  ]
};

// Helper function to generate Phase 2 questions based on selected paradigms
export function generatePhase2Questions(selectedParadigms, SOVEREIGNTY_PARADIGMS) {
  const questions = [];
  
  selectedParadigms.forEach(paradigmId => {
    const paradigm = SOVEREIGNTY_PARADIGMS.find(p => p.id === paradigmId);
    if (!paradigm) return;
    
    // Generate intent questions
    paradigm.intents.forEach((intent, index) => {
      questions.push({
        id: `phase2_${paradigmId}_intent_${index}`,
        text: `How often do you act on the intent to ${intent.toLowerCase()}?`,
        type: 'likert',
        paradigm: paradigmId,
        category: 'intent',
        intent: intent,
        weight: 1.0
      });
    });
    
    // Generate practical questions based on values
    paradigm.values.forEach((value, index) => {
      questions.push({
        id: `phase2_${paradigmId}_practical_${index}`,
        text: `In daily life, how consistently do you embody ${value.toLowerCase()}?`,
        type: 'likert',
        paradigm: paradigmId,
        category: 'practicality',
        value: value,
        weight: 1.0
      });
    });
  });
  
  // Shuffle questions to reduce order bias
  return shuffleArray(questions);
}

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

