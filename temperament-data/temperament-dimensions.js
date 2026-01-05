// Core Temperament Dimensions
// Questions that map position on masculine-feminine spectrum across various life dimensions

export const TEMPERAMENT_DIMENSIONS = {
  // Core Behavioral Patterns
  direction_and_structure: {
    name: 'Direction and Structure',
    description: 'Preference for establishing direction, order, and structure vs. flowing with what emerges',
    questions: [
      {
        id: 'dir_1',
        question: 'How much do you prefer to establish clear direction and structure in your life?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'dir_2',
        question: 'To what extent do you feel comfortable flowing with what emerges rather than planning ahead?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'dir_3',
        question: 'How important is it for you to have clear boundaries and defined roles?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'dir_4',
        question: 'To what degree do you prefer spontaneity and adaptability over structure?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      }
    ]
  },
  
  provision_and_nurture: {
    name: 'Provision and Nurture',
    description: 'Tendency toward providing/protecting vs. nurturing/receiving',
    questions: [
      {
        id: 'prov_1',
        question: 'How much do you feel driven to provide, protect, and secure resources for others?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'prov_2',
        question: 'To what extent do you prioritize nurturing, emotional support, and creating warmth?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'prov_3',
        question: 'How comfortable are you with receiving support and being provided for?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      },
      {
        id: 'prov_4',
        question: 'To what degree do you feel responsible for others\' well-being and security?',
        masculineWeight: 1.0,
        feminineWeight: 0.3
      }
    ]
  },
  
  focus_and_expression: {
    name: 'Focus and Expression',
    description: 'Tendency toward focused action vs. expressive flow',
    questions: [
      {
        id: 'foc_1',
        question: 'How much do you prefer focused, goal-directed action over open-ended exploration?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'foc_2',
        question: 'To what extent do you value emotional expression and sharing feelings?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'foc_3',
        question: 'How important is it for you to maintain steady focus even when emotions arise?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'foc_4',
        question: 'To what degree do you allow emotions to flow and guide your responses?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      }
    ]
  },
  
  certainty_and_clarity: {
    name: 'Certainty and Clarity',
    description: 'Need for certainty/direction vs. need for clarity/richness',
    questions: [
      {
        id: 'cert_1',
        question: 'How much do you need certainty and clear direction to feel secure?',
        masculineWeight: 0.8,
        feminineWeight: -0.5
      },
      {
        id: 'cert_2',
        question: 'To what extent do you need clarity (in thoughts, actions, timeframes, intentions, boundaries) to feel secure?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'cert_3',
        question: 'How comfortable are you with ambiguity and uncertainty?',
        masculineWeight: -0.6,
        feminineWeight: 0.4
      },
      {
        id: 'cert_4',
        question: 'To what degree do you create structure and certainty for others?',
        masculineWeight: 1.0,
        feminineWeight: -0.4
      }
    ]
  },
  
  shame_and_fear: {
    name: 'Shame and Fear Sensitivity',
    description: 'Primary vulnerability: shame (masculine) vs. fear/isolation (feminine)',
    questions: [
      {
        id: 'vuln_1',
        question: 'How sensitive are you to shame, status loss, or feeling incompetent?',
        masculineWeight: 1.0,
        feminineWeight: -0.3
      },
      {
        id: 'vuln_2',
        question: 'To what extent are you sensitive to fear, isolation, or abandonment?',
        masculineWeight: -0.4,
        feminineWeight: 1.0
      },
      {
        id: 'vuln_3',
        question: 'How much does failure or perceived weakness affect your sense of self?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'vuln_4',
        question: 'To what degree does uncertainty about others\' intentions create anxiety?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      }
    ]
  },
  
  achievement_and_connection: {
    name: 'Achievement and Connection',
    description: 'Drive for achievement/mastery vs. drive for connection/belonging',
    questions: [
      {
        id: 'ach_1',
        question: 'How driven are you by achievement, mastery, and external validation?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'ach_2',
        question: 'To what extent are you driven by connection, belonging, and relational harmony?',
        masculineWeight: -0.6,
        feminineWeight: 1.0
      },
      {
        id: 'ach_3',
        question: 'How important is it for you to compete and establish rank or status?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'ach_4',
        question: 'To what degree do you prioritize emotional intimacy and deep connection?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      }
    ]
  },
  
  control_and_flow: {
    name: 'Control and Flow',
    description: 'Preference for control/mastery vs. flow/receptivity',
    questions: [
      {
        id: 'ctrl_1',
        question: 'How much do you prefer to be in control of situations and outcomes?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'ctrl_2',
        question: 'To what extent do you enjoy surrendering control and flowing with what emerges?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'ctrl_3',
        question: 'How important is it for you to master your environment and circumstances?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'ctrl_4',
        question: 'To what degree do you trust in flow and natural processes?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      }
    ]
  },
  
  independence_and_interdependence: {
    name: 'Independence and Interdependence',
    description: 'Preference for independence/autonomy vs. interdependence/connection',
    questions: [
      {
        id: 'ind_1',
        question: 'How important is independence and self-reliance to you?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'ind_2',
        question: 'To what extent do you value interdependence and mutual support?',
        masculineWeight: -0.5,
        feminineWeight: 1.0
      },
      {
        id: 'ind_3',
        question: 'How comfortable are you with depending on others?',
        masculineWeight: -0.8,
        feminineWeight: 0.7
      },
      {
        id: 'ind_4',
        question: 'To what degree do you need others to depend on you?',
        masculineWeight: 0.8,
        feminineWeight: 0.3
      }
    ]
  },
  
  logic_and_intuition: {
    name: 'Logic and Intuition',
    description: 'Preference for logic/reason vs. intuition/feeling',
    questions: [
      {
        id: 'log_1',
        question: 'How much do you rely on logic, reason, and systematic thinking?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'log_2',
        question: 'To what extent do you trust intuition, feeling, and gut responses?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'log_3',
        question: 'How important is it for you to analyze and understand before acting?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'log_4',
        question: 'To what degree do you follow your feelings and inner knowing?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      }
    ]
  },
  
  stability_and_movement: {
    name: 'Stability and Movement',
    description: 'Preference for stability/steadiness vs. movement/change',
    questions: [
      {
        id: 'stab_1',
        question: 'How much do you value stability, consistency, and predictability?',
        masculineWeight: 1.0,
        feminineWeight: -0.4
      },
      {
        id: 'stab_2',
        question: 'To what extent do you enjoy movement, change, and dynamic flow?',
        masculineWeight: -0.6,
        feminineWeight: 1.0
      },
      {
        id: 'stab_3',
        question: 'How important is it for you to provide stability for others?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'stab_4',
        question: 'To what degree do you respond to and amplify the energy around you?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      }
    ]
  }
};

