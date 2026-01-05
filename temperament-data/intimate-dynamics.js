// Intimate Dynamics Questions
// Covers sexually intimate dynamics, positions, emotional responses, and attraction

export const INTIMATE_DYNAMICS = {
  preferred_dynamics: {
    name: 'Preferred Intimate Dynamics',
    description: 'How you prefer to engage in intimate/sexual dynamics',
    questions: [
      {
        id: 'int_dyn_1',
        question: 'How much do you prefer to take the lead and initiate intimate connection?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'int_dyn_2',
        question: 'To what extent do you prefer to receive and respond to your partner\'s initiation?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'int_dyn_3',
        question: 'How important is it for you to be in control during intimate moments?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'int_dyn_4',
        question: 'To what degree do you enjoy surrendering control and being led?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'int_dyn_5',
        question: 'How much do you prefer to give pleasure and focus on your partner\'s experience?',
        masculineWeight: 0.8,
        feminineWeight: 0.6
      },
      {
        id: 'int_dyn_6',
        question: 'To what extent do you prefer to receive pleasure and be the focus of attention?',
        masculineWeight: -0.6,
        feminineWeight: 0.9
      }
    ]
  },
  
  emotional_responses: {
    name: 'Emotional Responses to Intimacy',
    description: 'How you emotionally respond to intimate connection',
    questions: [
      {
        id: 'int_emo_1',
        question: 'How much does intimate connection make you feel powerful and confident?',
        masculineWeight: 1.0,
        feminineWeight: -0.3
      },
      {
        id: 'int_emo_2',
        question: 'To what extent does intimacy make you feel vulnerable and open?',
        masculineWeight: -0.5,
        feminineWeight: 1.0
      },
      {
        id: 'int_emo_3',
        question: 'How important is emotional connection during physical intimacy?',
        masculineWeight: -0.4,
        feminineWeight: 1.0
      },
      {
        id: 'int_emo_4',
        question: 'To what degree do you separate physical pleasure from emotional connection?',
        masculineWeight: 0.7,
        feminineWeight: -0.8
      },
      {
        id: 'int_emo_5',
        question: 'How much does your partner\'s emotional state affect your intimate experience?',
        masculineWeight: -0.6,
        feminineWeight: 1.0
      },
      {
        id: 'int_emo_6',
        question: 'To what extent do you need to feel desired and chosen to be fully present?',
        masculineWeight: -0.5,
        feminineWeight: 1.0
      }
    ]
  },
  
  satisfaction_and_preference: {
    name: 'Satisfaction and Preference',
    description: 'What brings you the most satisfaction in intimate connection',
    questions: [
      {
        id: 'int_sat_1',
        question: 'How much satisfaction do you derive from providing pleasure and being in control?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'int_sat_2',
        question: 'To what extent do you find satisfaction in receiving and being fully present to sensation?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'int_sat_3',
        question: 'How important is it for you to feel your partner\'s surrender and responsiveness?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'int_sat_4',
        question: 'To what degree do you need to feel your partner\'s strength and presence?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      },
      {
        id: 'int_sat_5',
        question: 'How much does polarity (complementary energy difference) enhance your experience?',
        masculineWeight: 0.9,
        feminineWeight: 0.9
      },
      {
        id: 'int_sat_6',
        question: 'To what extent do you prefer intensity and challenge in intimate connection?',
        masculineWeight: 0.8,
        feminineWeight: -0.4
      }
    ]
  },
  
  positions_and_preferences: {
    name: 'Positions and Physical Preferences',
    description: 'Physical preferences and positions that feel most satisfying',
    questions: [
      {
        id: 'int_pos_1',
        question: 'How much do you prefer positions where you are on top or in control?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'int_pos_2',
        question: 'To what extent do you prefer positions where you are underneath or receiving?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      },
      {
        id: 'int_pos_3',
        question: 'How important is it for you to be able to see and maintain eye contact?',
        masculineWeight: 0.6,
        feminineWeight: 0.8
      },
      {
        id: 'int_pos_4',
        question: 'To what degree do you prefer positions that allow for deep emotional connection?',
        masculineWeight: -0.4,
        feminineWeight: 1.0
      },
      {
        id: 'int_pos_5',
        question: 'How much do you enjoy positions that emphasize your strength and dominance?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'int_pos_6',
        question: 'To what extent do you prefer positions that emphasize surrender and receptivity?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      }
    ]
  },
  
  arousal_and_responsiveness: {
    name: 'Arousal and Responsiveness',
    description: 'What arouses you and how you respond to attraction',
    questions: [
      {
        id: 'int_ar_1',
        question: 'How much are you aroused by taking action and pursuing?',
        masculineWeight: 1.0,
        feminineWeight: -0.7
      },
      {
        id: 'int_ar_2',
        question: 'To what extent are you aroused by being pursued and desired?',
        masculineWeight: -0.8,
        feminineWeight: 1.0
      },
      {
        id: 'int_ar_3',
        question: 'How important is it for you to feel your partner\'s responsiveness and surrender?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'int_ar_4',
        question: 'To what degree are you aroused by your partner\'s strength, presence, and direction?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'int_ar_5',
        question: 'How much does your partner\'s emotional openness and vulnerability affect your arousal?',
        masculineWeight: 0.3,
        feminineWeight: 0.8
      },
      {
        id: 'int_ar_6',
        question: 'To what extent do you need to feel chosen and prioritized to be fully responsive?',
        masculineWeight: -0.6,
        feminineWeight: 1.0
      }
    ]
  }
};

