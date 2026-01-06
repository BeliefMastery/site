// Temperament Scoring System
// Maps responses to masculine-feminine spectrum positioning

export const TEMPERAMENT_SCORING = {
  // Scoring thresholds for spectrum positioning
  thresholds: {
    highly_masculine: 0.75,  // 75%+ masculine
    predominantly_masculine: 0.60,  // 60-75% masculine
    balanced_masculine: 0.55,  // 55-60% masculine
    balanced: 0.45,  // 45-55% (balanced)
    balanced_feminine: 0.40,  // 40-45% feminine
    predominantly_feminine: 0.25,  // 25-40% feminine
    highly_feminine: 0.0  // 0-25% feminine
  },
  
  // Dimension weights (some dimensions are more indicative than others)
  dimensionWeights: {
    direction_and_structure: 1.2,
    provision_and_nurture: 1.1,
    focus_and_expression: 1.0,
    certainty_and_clarity: 0.9,
    shame_and_fear: 1.0,
    achievement_and_connection: 1.1,
    control_and_flow: 1.2,
    independence_and_interdependence: 1.0,
    logic_and_intuition: 0.9,
    stability_and_movement: 0.9,
    preferred_dynamics: 1.3,  // Intimate dynamics are highly indicative
    emotional_responses: 1.2,
    satisfaction_and_preference: 1.3,
    positions_and_preferences: 1.1,
    arousal_and_responsiveness: 1.2,
    status_and_rank: 1.0,
    selection_criteria: 1.1,
    attraction_signals: 1.0,
    hypergamy_and_choice: 1.0,
    responsiveness_patterns: 1.2
  },
  
  // Variation indicators - dimensions where variation is expected and common
  expectedVariation: [
    'logic_and_intuition',  // Many people have both
    'achievement_and_connection',  // Can value both
    'certainty_and_clarity',  // Different needs at different times
    'satisfaction_and_preference'  // Can enjoy both giving and receiving
  ],
  
  // Interpretation guide
  interpretation: {
    highly_masculine: {
      label: 'Masculine-Leaning Expression',
      description: 'Tends to express strong alignment with masculine archetypal patterns: direction, structure, provision, focus, and achievement orientation.',
      characteristics: [
        'Often shows preference for establishing direction and structure',
        'Tends to express drive to provide, protect, and secure',
        'Shows preference toward focused, goal-directed action',
        'Often expresses sensitivity to shame and status',
        'Shows preference toward control and mastery',
        'Tends to take lead in intimate dynamics'
      ],
      variations: 'May show variation in emotional expression, need for connection, or intuitive capacity while maintaining core masculine-leaning expression.'
    },
    predominantly_masculine: {
      label: 'Masculine-Leaning Expression',
      description: 'Tends to express clear masculine orientation with some integration of feminine qualities.',
      characteristics: [
        'Shows preference for structure with some flexibility',
        'Tends to express provision-oriented patterns with capacity for nurture',
        'Often shows focused action with emotional awareness',
        'Tends to express some sensitivity to both shame and fear',
        'Shows preference toward control with some receptivity'
      ],
      variations: 'May show significant variation in emotional expression, connection needs, or intuitive/feeling capacity.'
    },
    balanced_masculine: {
      label: 'Masculine-Leaning Expression',
      description: 'Tends to express masculine-leaning patterns with substantial integration of feminine qualities.',
      characteristics: [
        'Often appreciates structure but can flow',
        'Tends to express both provision and nurture capacities',
        'Shows preference toward action-oriented patterns with emotional expression',
        'Often expresses some balance between shame and fear sensitivity'
      ],
      variations: 'Significant variation expected across dimensions - may be highly structured in some areas, highly expressive in others.'
    },
    balanced: {
      label: 'Balanced Polarity Expression',
      description: 'Tends to express integration of both masculine and feminine qualities without strong preference for either pole.',
      characteristics: [
        'Often shows comfort with both structure and flow',
        'Tends to express both provision and nurture capacities',
        'Shows preference toward action and expression in balance',
        'Often expresses moderate sensitivity to both shame and fear',
        'Tends to take lead or follow as needed'
      ],
      variations: 'High variation expected - may show strong masculine traits in some contexts, strong feminine traits in others. This is normal and healthy.'
    },
    balanced_feminine: {
      label: 'Feminine-Leaning Expression',
      description: 'Tends to express feminine-leaning patterns with substantial integration of masculine qualities.',
      characteristics: [
        'Shows preference for flow with some structure',
        'Tends to express nurture-oriented patterns with provision capacity',
        'Often shows expression with some focused action',
        'Tends to express some balance between fear and shame sensitivity'
      ],
      variations: 'Significant variation expected - may be highly expressive in some areas, highly structured in others.'
    },
    predominantly_feminine: {
      label: 'Feminine-Leaning Expression',
      description: 'Tends to express clear feminine orientation with some integration of masculine qualities.',
      characteristics: [
        'Shows preference for flow and emergence',
        'Tends to express nurture and connection-oriented patterns',
        'Often shows emotional expression and receptivity',
        'Tends to express sensitivity to fear and isolation',
        'Shows preference toward receptive and responsive patterns'
      ],
      variations: 'May show variation in structure needs, achievement drive, or logical capacity while maintaining core feminine-leaning expression.'
    },
    highly_feminine: {
      label: 'Feminine-Leaning Expression',
      description: 'Tends to express strong alignment with feminine archetypal patterns: flow, expression, nurture, receptivity, and connection orientation.',
      characteristics: [
        'Often shows strong preference for flow and emergence',
        'Tends to express drive for nurture, connection, and emotional richness',
        'Shows preference toward expressive and emotionally responsive patterns',
        'Often expresses sensitivity to fear, isolation, and lack of clarity',
        'Shows preference toward receptivity and response',
        'Tends to receive and respond in intimate dynamics'
      ],
      variations: 'May show variation in structure capacity, achievement orientation, or logical thinking while maintaining core feminine-leaning expression.'
    }
  }
};


