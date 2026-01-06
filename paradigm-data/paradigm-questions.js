// Paradigm Questions - Version 2
// 3-Phase Questionnaire Architecture
// Based on "The Good Life" and "God" frameworks
// Optimized for nuanced data collection

// Phase 1: Orientation (5-7 questions)
// Purpose: Binary filters to identify broad paradigm, establish baseline vocabulary
export const PHASE_1_QUESTIONS = {
  good_life: [
    {
      id: 'p1_goodlife_orientation',
      question: 'Is your spirituality primarily experiential or conceptual?',
      type: 'binary',
      options: [
        {
          text: 'Experiential - I learn through direct experience, action, and engagement',
          mapsTo: { orientation: 'experiential', likelyParadigms: ['active'], weight: 2 }
        },
        {
          text: 'Conceptual - I learn through reflection, study, and contemplation',
          mapsTo: { orientation: 'conceptual', likelyParadigms: ['contemplative'], weight: 2 }
        }
      ],
      category: 'orientation'
    },
    {
      id: 'p1_goodlife_transformation',
      question: 'Do you orient toward personal transformation or collective service?',
      type: 'binary',
      options: [
        {
          text: 'Personal transformation - My focus is on my own growth and development',
          mapsTo: { focus: 'personal', likelyParadigms: ['active', 'contemplative'], weight: 1 }
        },
        {
          text: 'Collective service - My focus is on serving others and contributing to something greater',
          mapsTo: { focus: 'collective', likelyParadigms: ['devotional'], weight: 2 }
        }
      ],
      category: 'orientation'
    },
    {
      id: 'p1_goodlife_satisfaction',
      question: 'Where do you primarily find satisfaction?',
      type: 'ranked',
      options: [
        {
          text: 'Physical vitality and action - Doing, building, creating, moving',
          mapsTo: { paradigm: 'active', dimension: 'literal', weight: 3 }
        },
        {
          text: 'Inner peace and contemplation - Understanding, reflecting, being present',
          mapsTo: { paradigm: 'contemplative', dimension: 'mystical', weight: 3 }
        },
        {
          text: 'Sensory richness and pleasure - Experiencing beauty, joy, delight',
          mapsTo: { paradigm: 'active', dimension: 'symbolic', weight: 1 }
        },
        {
          text: 'Contributing to others - Service, devotion, giving',
          mapsTo: { paradigm: 'devotional', dimension: 'literal', weight: 3 }
        }
      ],
      category: 'satisfaction',
      instruction: 'Rank these in order of importance (drag to reorder)'
    },
    {
      id: 'p1_goodlife_meaning',
      question: 'How do you primarily make meaning?',
      type: 'scenario',
      options: [
        {
          text: 'Through action and tangible results',
          mapsTo: { paradigm: 'active', dimension: 'literal', weight: 2 }
        },
        {
          text: 'Through reflection and understanding',
          mapsTo: { paradigm: 'contemplative', dimension: 'symbolic', weight: 2 }
        },
        {
          text: 'Through connection and devotion',
          mapsTo: { paradigm: 'devotional', dimension: 'mystical', weight: 2 }
        },
        {
          text: 'Through a combination that shifts with context',
          mapsTo: { paradigm: 'mixed', weight: 0 }
        }
      ],
      category: 'meaning_making'
    },
    {
      id: 'p1_goodlife_engagement',
      question: 'When facing a major life decision, you primarily:',
      type: 'scenario',
      options: [
        {
          text: 'Analyze logically and take action',
          mapsTo: { paradigm: 'active', dimension: 'literal', weight: 2 }
        },
        {
          text: 'Reflect deeply and seek understanding',
          mapsTo: { paradigm: 'contemplative', dimension: 'symbolic', weight: 2 }
        },
        {
          text: 'Feel into what resonates and trust intuition',
          mapsTo: { paradigm: 'contemplative', dimension: 'mystical', weight: 2 }
        },
        {
          text: 'Consider impact on others and seek guidance',
          mapsTo: { paradigm: 'devotional', dimension: 'literal', weight: 2 }
        },
        {
          text: 'Trust in cosmic timing or divine will',
          mapsTo: { paradigm: 'devotional', dimension: 'mystical', weight: 2 }
        }
      ],
      category: 'decision_making'
    }
  ],
  god: [
    {
      id: 'p1_god_literal',
      question: 'Do you experience God as a literal being/entity?',
      type: 'binary',
      options: [
        {
          text: 'Yes - God is a literal being, entity, or presence',
          mapsTo: { literalGod: true, likelyPerspectives: ['relational', 'unifying'], weight: 3 }
        },
        {
          text: 'No - God is not a literal being or entity',
          mapsTo: { literalGod: false, likelyPerspectives: ['logical', 'biological', 'social', 'emergent'], weight: 2 }
        }
      ],
      category: 'orientation'
    },
    {
      id: 'p1_god_function',
      question: 'What is the primary function of "God" in your worldview?',
      type: 'multiselect',
      maxSelections: 2,
      options: [
        {
          text: 'Logical necessity/organizing principle',
          mapsTo: { perspective: 'logical', weight: 2 }
        },
        {
          text: 'Direct experiential presence',
          mapsTo: { perspective: 'unifying', weight: 2 }
        },
        {
          text: 'Biological/evolutionary imperative',
          mapsTo: { perspective: 'biological', weight: 2 }
        },
        {
          text: 'Collective belief structure',
          mapsTo: { perspective: 'social', weight: 2 }
        },
        {
          text: 'Personal relationship',
          mapsTo: { perspective: 'relational', weight: 2 }
        },
        {
          text: 'Psychological integration tool',
          mapsTo: { perspective: 'emergent', weight: 2 }
        }
      ],
      category: 'function'
    },
    {
      id: 'p1_god_consciousness',
      question: 'Do you believe consciousness survives physical death?',
      type: 'binary',
      options: [
        {
          text: 'Yes - Consciousness continues beyond physical death',
          mapsTo: { afterlife: true, likelyPerspectives: ['unifying', 'relational', 'mystical'], weight: 2 }
        },
        {
          text: 'No - Consciousness ends with physical death',
          mapsTo: { afterlife: false, likelyPerspectives: ['biological', 'logical', 'social'], weight: 2 }
        }
      ],
      category: 'orientation'
    },
    {
      id: 'p1_god_truth',
      question: 'Which dimensions of truth do you actively engage with? (Select all that apply)',
      type: 'multiselect',
      maxSelections: 3,
      options: [
        {
          text: 'Literal/factual - What actually happened, what is real',
          mapsTo: { dimension: 'literal', weight: 1 }
        },
        {
          text: 'Symbolic/metaphorical - What it represents, what it means',
          mapsTo: { dimension: 'symbolic', weight: 1 }
        },
        {
          text: 'Historical/esoteric - Hidden patterns, traditional knowledge',
          mapsTo: { dimension: 'esoteric', weight: 1 }
        },
        {
          text: 'Mystical/experiential - Direct experience, transcendent states',
          mapsTo: { dimension: 'mystical', weight: 1 }
        }
      ],
      category: 'truth_dimensions'
    }
  ]
};

// Phase 2: Depth Mapping (10-15 questions)
// Purpose: Dimension-specific exploration, mix of ranked choice and multi-select, conditional branches
export const PHASE_2_QUESTIONS = {
  good_life: {
    // Conditional questions based on Phase 1 responses
    active: [
      {
        id: 'p2_active_physical',
        question: 'Rank these sources of meaning from most to least important:',
        type: 'ranked',
        options: [
          { text: 'Physical achievement and tangible results', mapsTo: { dimension: 'literal', weight: 3 } },
          { text: 'Symbolic meaning through action and effort', mapsTo: { dimension: 'symbolic', weight: 2 } },
          { text: 'Connection to historical traditions of craft', mapsTo: { dimension: 'esoteric', weight: 2 } },
          { text: 'Flow states and direct presence in action', mapsTo: { dimension: 'mystical', weight: 2 } }
        ],
        category: 'active_depth',
        conditional: { paradigm: 'active' }
      },
      {
        id: 'p2_active_challenges',
        question: 'How do you typically respond to physical challenges?',
        type: 'scenario',
        options: [
          {
            text: 'I seek them out and find them energizing',
            mapsTo: { dimension: 'literal', weight: 2 }
          },
          {
            text: 'I see them as opportunities for growth and transformation',
            mapsTo: { dimension: 'symbolic', weight: 2 }
          },
          {
            text: 'I approach them with traditional discipline and respect',
            mapsTo: { dimension: 'esoteric', weight: 2 }
          },
          {
            text: 'I enter flow states where effort becomes effortless',
            mapsTo: { dimension: 'mystical', weight: 2 }
          }
        ],
        category: 'active_depth',
        conditional: { paradigm: 'active' }
      }
    ],
    contemplative: [
      {
        id: 'p2_contemplative_understanding',
        question: 'Rank these sources of meaning from most to least important:',
        type: 'ranked',
        options: [
          { text: 'Intellectual understanding and clarity', mapsTo: { dimension: 'literal', weight: 3 } },
          { text: 'Symbolic insight and metaphorical meaning', mapsTo: { dimension: 'symbolic', weight: 2 } },
          { text: 'Wisdom traditions and esoteric knowledge', mapsTo: { dimension: 'esoteric', weight: 2 } },
          { text: 'Direct mystical experience and presence', mapsTo: { dimension: 'mystical', weight: 2 } }
        ],
        category: 'contemplative_depth',
        conditional: { paradigm: 'contemplative' }
      },
      {
        id: 'p2_contemplative_practice',
        question: 'What type of contemplative practice resonates most?',
        type: 'scenario',
        options: [
          {
            text: 'Study, reading, intellectual inquiry',
            mapsTo: { dimension: 'literal', weight: 2 }
          },
          {
            text: 'Meditation, reflection, inner work',
            mapsTo: { dimension: 'symbolic', weight: 2 }
          },
          {
            text: 'Traditional spiritual practices and lineages',
            mapsTo: { dimension: 'esoteric', weight: 2 }
          },
          {
            text: 'Direct experience of presence and unity',
            mapsTo: { dimension: 'mystical', weight: 2 }
          }
        ],
        category: 'contemplative_depth',
        conditional: { paradigm: 'contemplative' }
      }
    ],
    devotional: [
      {
        id: 'p2_devotional_service',
        question: 'Rank these sources of meaning from most to least important:',
        type: 'ranked',
        options: [
          { text: 'Practical service and tangible contribution', mapsTo: { dimension: 'literal', weight: 3 } },
          { text: 'Symbolic devotion and sacred relationship', mapsTo: { dimension: 'symbolic', weight: 2 } },
          { text: 'Traditional religious practices and community', mapsTo: { dimension: 'esoteric', weight: 2 } },
          { text: 'Direct union with the divine or ultimate reality', mapsTo: { dimension: 'mystical', weight: 2 } }
        ],
        category: 'devotional_depth',
        conditional: { paradigm: 'devotional' }
      },
      {
        id: 'p2_devotional_connection',
        question: 'How do you experience connection to something greater?',
        type: 'scenario',
        options: [
          {
            text: 'Through practical acts of service and giving',
            mapsTo: { dimension: 'literal', weight: 2 }
          },
          {
            text: 'Through symbolic devotion and sacred practices',
            mapsTo: { dimension: 'symbolic', weight: 2 }
          },
          {
            text: 'Through traditional religious community and rituals',
            mapsTo: { dimension: 'esoteric', weight: 2 }
          },
          {
            text: 'Through direct mystical experience of unity',
            mapsTo: { dimension: 'mystical', weight: 2 }
          }
        ],
        category: 'devotional_depth',
        conditional: { paradigm: 'devotional' }
      }
    ],
    // Dimension-specific questions (asked for all paradigms)
    dimensions: [
      {
        id: 'p2_dimension_literal',
        question: 'How important is literal, factual truth in your understanding of "The Good Life"?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'literal', category: 'good_life' },
        category: 'dimension_depth'
      },
      {
        id: 'p2_dimension_symbolic',
        question: 'How important is symbolic and metaphorical meaning in your understanding of "The Good Life"?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'symbolic', category: 'good_life' },
        category: 'dimension_depth'
      },
      {
        id: 'p2_dimension_esoteric',
        question: 'How important are historical traditions and esoteric knowledge in your understanding of "The Good Life"?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'esoteric', category: 'good_life' },
        category: 'dimension_depth'
      },
      {
        id: 'p2_dimension_mystical',
        question: 'How important is direct mystical experience in your understanding of "The Good Life"?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'mystical', category: 'good_life' },
        category: 'dimension_depth'
      }
    ]
  },
  god: {
    // Conditional questions based on Phase 1 responses
    literal: [
      {
        id: 'p2_god_literal_presence',
        question: 'If you experience God as a literal being, describe the frequency of these experiences:',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Never', 4: 'Occasionally', 7: 'Daily awareness' } },
        mapsTo: { perspective: 'relational', dimension: 'literal', weight: 2 },
        category: 'god_depth',
        conditional: { literalGod: true }
      }
    ],
    non_literal: [
      {
        id: 'p2_god_function_primary',
        question: 'Which function of "God" is most primary for you?',
        type: 'scenario',
        options: [
          {
            text: 'Logical necessity - God as organizing principle for coherent thought',
            mapsTo: { perspective: 'logical', dimension: 'literal', weight: 3 }
          },
          {
            text: 'Biological imperative - God as evolutionary function or survival mechanism',
            mapsTo: { perspective: 'biological', dimension: 'literal', weight: 3 }
          },
          {
            text: 'Social construct - God as collective belief structure',
            mapsTo: { perspective: 'social', dimension: 'symbolic', weight: 3 }
          },
          {
            text: 'Emergent function - God as psychological integration tool',
            mapsTo: { perspective: 'emergent', dimension: 'symbolic', weight: 3 }
          }
        ],
        category: 'god_depth',
        conditional: { literalGod: false }
      }
    ],
    mystical: [
      {
        id: 'p2_god_mystical_frequency',
        question: 'If you selected "mystical/experiential" truth dimension, describe the frequency:',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Seeking but not yet experienced', 4: 'Occasional peak experiences', 7: 'Daily awareness' } },
        mapsTo: { dimension: 'mystical', weight: 2 },
        category: 'god_depth',
        conditional: { dimensionSelected: 'mystical' }
      }
    ],
    // Dimension-specific questions for all God perspectives
    dimensions: [
      {
        id: 'p2_god_dimension_literal',
        question: 'How important is literal, factual truth in your understanding of God?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'literal', category: 'god' },
        category: 'dimension_depth'
      },
      {
        id: 'p2_god_dimension_symbolic',
        question: 'How important is symbolic and metaphorical meaning in your understanding of God?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'symbolic', category: 'god' },
        category: 'dimension_depth'
      },
      {
        id: 'p2_god_dimension_esoteric',
        question: 'How important are historical traditions and esoteric knowledge in your understanding of God?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'esoteric', category: 'god' },
        category: 'dimension_depth'
      },
      {
        id: 'p2_god_dimension_mystical',
        question: 'How important is direct mystical experience in your understanding of God?',
        type: 'scaled',
        scale: { min: 1, max: 7, labels: { 1: 'Not important', 4: 'Moderately important', 7: 'Extremely important' } },
        mapsTo: { dimension: 'mystical', category: 'god' },
        category: 'dimension_depth'
      }
    ]
  }
};

// Phase 3: Integration Check (5 questions)
// Purpose: Consistency across contexts, certainty levels, gap analysis
export const PHASE_3_QUESTIONS = {
  good_life: [
    {
      id: 'p3_goodlife_consistency',
      question: 'How consistent is your understanding of "The Good Life" across different contexts (work, relationships, personal time)?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'Very inconsistent', 4: 'Moderately consistent', 7: 'Very consistent' } },
      mapsTo: { category: 'consistency', type: 'contextual' },
      category: 'integration'
    },
    {
      id: 'p3_goodlife_certainty',
      question: 'How certain are you about your current understanding of "The Good Life"?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'Very uncertain', 4: 'Moderately certain', 7: 'Very certain' } },
      mapsTo: { category: 'certainty' },
      category: 'integration'
    },
    {
      id: 'p3_goodlife_integration',
      question: 'How well integrated are your different ways of understanding "The Good Life" (literal, symbolic, esoteric, mystical)?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'Not integrated', 4: 'Moderately integrated', 7: 'Fully integrated' } },
      mapsTo: { category: 'integration', type: 'dimensional' },
      category: 'integration'
    },
    {
      id: 'p3_goodlife_paradox',
      question: 'Can you hold apparently contradictory views about "The Good Life" simultaneously?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'No - contradictions are problematic', 4: 'Sometimes', 7: 'Yes - paradox is natural' } },
      mapsTo: { category: 'paradox_tolerance' },
      category: 'integration'
    },
    {
      id: 'p3_goodlife_gaps',
      question: 'Are there areas where your understanding of "The Good Life" feels incomplete or unclear?',
      type: 'multiselect',
      maxSelections: 3,
      options: [
        { text: 'Literal dimension - What actually constitutes a good life', mapsTo: { gap: 'literal' } },
        { text: 'Symbolic dimension - What it all means', mapsTo: { gap: 'symbolic' } },
        { text: 'Esoteric dimension - Historical and traditional wisdom', mapsTo: { gap: 'esoteric' } },
        { text: 'Mystical dimension - Direct experience and presence', mapsTo: { gap: 'mystical' } },
        { text: 'No significant gaps', mapsTo: { gap: 'none' } }
      ],
      category: 'integration'
    }
  ],
  god: [
    {
      id: 'p3_god_consistency',
      question: 'How consistent is your understanding of God across different contexts (personal, social, intellectual)?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'Very inconsistent', 4: 'Moderately consistent', 7: 'Very consistent' } },
      mapsTo: { category: 'consistency', type: 'contextual' },
      category: 'integration'
    },
    {
      id: 'p3_god_certainty',
      question: 'How certain are you about your current understanding of God?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'Very uncertain', 4: 'Moderately certain', 7: 'Very certain' } },
      mapsTo: { category: 'certainty' },
      category: 'integration'
    },
    {
      id: 'p3_god_integration',
      question: 'How well integrated are your different ways of understanding God (literal, symbolic, esoteric, mystical)?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'Not integrated', 4: 'Moderately integrated', 7: 'Fully integrated' } },
      mapsTo: { category: 'integration', type: 'dimensional' },
      category: 'integration'
    },
    {
      id: 'p3_god_paradox',
      question: 'Can you hold apparently contradictory views about God simultaneously?',
      type: 'scaled',
      scale: { min: 1, max: 7, labels: { 1: 'No - contradictions are problematic', 4: 'Sometimes', 7: 'Yes - paradox is natural' } },
      mapsTo: { category: 'paradox_tolerance' },
      category: 'integration'
    },
    {
      id: 'p3_god_gaps',
      question: 'Are there areas where your understanding of God feels incomplete or unclear?',
      type: 'multiselect',
      maxSelections: 3,
      options: [
        { text: 'Literal dimension - What God actually is', mapsTo: { gap: 'literal' } },
        { text: 'Symbolic dimension - What God represents', mapsTo: { gap: 'symbolic' } },
        { text: 'Esoteric dimension - Historical and traditional perspectives', mapsTo: { gap: 'esoteric' } },
        { text: 'Mystical dimension - Direct experience of the divine', mapsTo: { gap: 'mystical' } },
        { text: 'No significant gaps', mapsTo: { gap: 'none' } }
      ],
      category: 'integration'
    }
  ]
};

