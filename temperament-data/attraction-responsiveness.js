// Attraction and Responsiveness Questions
// Based on STATUS, SELECTION, ATTRACTION reference map

export const ATTRACTION_RESPONSIVENESS = {
  status_and_rank: {
    name: 'Status and Rank Orientation',
    description: 'How you relate to status, rank, and hierarchy (masculine: Coalition Rank; feminine: social positioning)',
    questions: [
      {
        id: 'attr_stat_1',
        question: 'How important is it for you to establish rank and respect among peers?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'attr_stat_2',
        question: 'To what extent do you value social positioning and coalition strength?',
        masculineWeight: 0.8,
        feminineWeight: 0.6
      },
      {
        id: 'attr_stat_3',
        question: 'How much does your partner\'s status and social standing affect your attraction?',
        masculineWeight: -0.4,
        feminineWeight: 0.8
      },
      {
        id: 'attr_stat_4',
        question: 'To what degree do you need to feel respected and valued in social contexts?',
        masculineWeight: 1.0,
        feminineWeight: 0.4
      }
    ]
  },
  
  selection_criteria: {
    name: 'Selection Criteria',
    description: 'What you look for in a partner (masculine: Reproductive Confidence; feminine: 4P\'s - Perspicacity, Protector, Provider, Parental)',
    questions: [
      {
        id: 'attr_sel_1',
        question: 'How important is it for you that your partner demonstrates competence, problem-solving, and resourcefulness?',
        masculineWeight: 0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sel_2',
        question: 'To what extent do you value a partner who can protect and provide?',
        masculineWeight: 0.2,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sel_3',
        question: 'How much do you look for loyalty, nurture, and collaborative trust in a partner?',
        masculineWeight: 1.0,
        feminineWeight: 0.3
      },
      {
        id: 'attr_sel_4',
        question: 'To what degree do you value a partner\'s reproductive confidence and parental investment capacity?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sel_5',
        question: 'How important is it that your partner shows willingness to invest in long-term partnership?',
        masculineWeight: 0.4,
        feminineWeight: 0.9
      }
    ]
  },
  
  attraction_signals: {
    name: 'Attraction Signals',
    description: 'What signals attract you and how you display attraction (Axis of Attraction)',
    questions: [
      {
        id: 'attr_sig_1',
        question: 'How much are you attracted to displays of strength, competence, and achievement?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sig_2',
        question: 'To what extent are you attracted to beauty, youth, and fertility signals?',
        masculineWeight: 1.0,
        feminineWeight: -0.2
      },
      {
        id: 'attr_sig_3',
        question: 'How important is it for you to display your resources, status, or achievements?',
        masculineWeight: 0.8,
        feminineWeight: -0.5
      },
      {
        id: 'attr_sig_4',
        question: 'To what degree do you display your beauty, grace, and receptivity?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sig_5',
        question: 'How much does your partner\'s display of desirability (beauty, youth, health) affect your attraction?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'attr_sig_6',
        question: 'To what extent does your partner\'s display of capability and provision affect your attraction?',
        masculineWeight: -0.2,
        feminineWeight: 1.0
      }
    ]
  },
  
  hypergamy_and_choice: {
    name: 'Hypergamy and Mate Choice',
    description: 'How you approach mate selection and relationship choice',
    questions: [
      {
        id: 'attr_hyp_1',
        question: 'How much do you evaluate potential partners based on their ability to provide and protect?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_hyp_2',
        question: 'To what extent do you evaluate partners based on their loyalty, nurture, and collaborative capacity?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'attr_hyp_3',
        question: 'How important is it for you to "mate up" - choose someone of equal or higher value?',
        masculineWeight: -0.4,
        feminineWeight: 0.9
      },
      {
        id: 'attr_hyp_4',
        question: 'To what degree do you need to feel that you are your partner\'s best option?',
        masculineWeight: 0.6,
        feminineWeight: 0.7
      },
      {
        id: 'attr_hyp_5',
        question: 'How much does your partner\'s social standing and coalition strength matter to you?',
        masculineWeight: 0.2,
        feminineWeight: 0.8
      }
    ]
  },
  
  responsiveness_patterns: {
    name: 'Responsiveness Patterns',
    description: 'How you respond to attraction and pursue or receive connection',
    questions: [
      {
        id: 'attr_resp_1',
        question: 'How much do you prefer to pursue and initiate romantic/sexual connection?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'attr_resp_2',
        question: 'To what extent do you prefer to be pursued and have connection initiated with you?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'attr_resp_3',
        question: 'How important is it for you to test and challenge a potential partner before committing?',
        masculineWeight: -0.5,
        feminineWeight: 0.8
      },
      {
        id: 'attr_resp_4',
        question: 'To what degree do you need to feel chosen and prioritized to fully open?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'attr_resp_5',
        question: 'How much do you enjoy the chase and the challenge of winning someone over?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'attr_resp_6',
        question: 'To what extent do you respond to strength, presence, and clear direction in a partner?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      }
    ]
  }
};

