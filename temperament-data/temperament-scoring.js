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
      label: 'Highly Masculine Temperament',
      description: 'Strong alignment with masculine archetypal patterns: direction, structure, provision, focus, and achievement orientation.',
      characteristics: [
        'Strong preference for establishing direction and structure',
        'Drive to provide, protect, and secure',
        'Focused, goal-directed action',
        'Sensitivity to shame and status',
        'Preference for control and mastery',
        'Tendency to take lead in intimate dynamics'
      ],
      variations: 'May show variation in emotional expression, need for connection, or intuitive capacity while maintaining core masculine orientation.'
    },
    predominantly_masculine: {
      label: 'Predominantly Masculine Temperament',
      description: 'Clear masculine orientation with some integration of feminine qualities.',
      characteristics: [
        'Preference for structure with some flexibility',
        'Provision-oriented with capacity for nurture',
        'Focused action with emotional awareness',
        'Some sensitivity to both shame and fear',
        'Control preference with some receptivity'
      ],
      variations: 'May show significant variation in emotional expression, connection needs, or intuitive/feeling capacity.'
    },
    balanced_masculine: {
      label: 'Balanced Masculine-Leaning Temperament',
      description: 'Masculine-leaning with substantial integration of feminine qualities.',
      characteristics: [
        'Appreciates structure but can flow',
        'Both provision and nurture capacities',
        'Action-oriented with emotional expression',
        'Some balance between shame and fear sensitivity'
      ],
      variations: 'Significant variation expected across dimensions - may be highly structured in some areas, highly expressive in others.'
    },
    balanced: {
      label: 'Balanced Temperament',
      description: 'Integration of both masculine and feminine qualities without strong preference for either pole.',
      characteristics: [
        'Comfortable with both structure and flow',
        'Both provision and nurture capacities',
        'Action and expression in balance',
        'Moderate sensitivity to both shame and fear',
        'Can take lead or follow as needed'
      ],
      variations: 'High variation expected - may show strong masculine traits in some contexts, strong feminine traits in others. This is normal and healthy.'
    },
    balanced_feminine: {
      label: 'Balanced Feminine-Leaning Temperament',
      description: 'Feminine-leaning with substantial integration of masculine qualities.',
      characteristics: [
        'Preference for flow with some structure',
        'Nurture-oriented with provision capacity',
        'Expression with some focused action',
        'Some balance between fear and shame sensitivity'
      ],
      variations: 'Significant variation expected - may be highly expressive in some areas, highly structured in others.'
    },
    predominantly_feminine: {
      label: 'Predominantly Feminine Temperament',
      description: 'Clear feminine orientation with some integration of masculine qualities.',
      characteristics: [
        'Preference for flow and emergence',
        'Nurture and connection-oriented',
        'Emotional expression and receptivity',
        'Sensitivity to fear and isolation',
        'Receptive and responsive preference'
      ],
      variations: 'May show variation in structure needs, achievement drive, or logical capacity while maintaining core feminine orientation.'
    },
    highly_feminine: {
      label: 'Highly Feminine Temperament',
      description: 'Strong alignment with feminine archetypal patterns: flow, expression, nurture, receptivity, and connection orientation.',
      characteristics: [
        'Strong preference for flow and emergence',
        'Drive for nurture, connection, and emotional richness',
        'Expressive and emotionally responsive',
        'Sensitivity to fear, isolation, and lack of clarity',
        'Preference for receptivity and response',
        'Tendency to receive and respond in intimate dynamics'
      ],
      variations: 'May show variation in structure capacity, achievement orientation, or logical thinking while maintaining core feminine orientation.'
    }
  }
};


