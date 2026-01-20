// Attraction and Responsiveness Questions
// Based on STATUS, SELECTION, ATTRACTION reference map
// Reframed as situational prompts to avoid triggering keyword associations

export const ATTRACTION_RESPONSIVENESS = {
  status_and_rank: {
    name: 'Status and Rank Orientation',
    description: 'How you relate to status, rank, and hierarchy (masculine: Coalition Rank; feminine: social positioning)',
    questions: [
      {
        id: 'attr_stat_1',
        question: 'In group settings with peers, what feels more important: establishing your place and earning respect, or maintaining harmony and connection regardless of hierarchy?',
        masculineWeight: 1.0,
        feminineWeight: -0.5
      },
      {
        id: 'attr_stat_2',
        question: 'When it comes to social positioning and alliances, how much does this matter: having strong connections and social standing, versus focusing more on individual relationships?',
        masculineWeight: 0.8,
        feminineWeight: 0.6
      },
      {
        id: 'attr_stat_3',
        question: 'Imagine being attracted to someone. How much does their social standing, reputation, or position in their community affect your interest: does it influence your attraction, or matter less than other qualities?',
        masculineWeight: -0.4,
        feminineWeight: 0.8
      },
      {
        id: 'attr_stat_4',
        question: 'In social contexts, what feels more important: feeling respected and valued by others, or feeling connected and accepted regardless of status?',
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
        question: 'When evaluating a potential partner, how important is it that they demonstrate: the ability to solve problems, handle challenges, and be resourceful?',
        selectionStandard: 'female',
        masculineWeight: 0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sel_2',
        question: 'In what you look for in a partner, how much does this matter: their capacity to protect and provide, versus other qualities like emotional connection or compatibility?',
        selectionStandard: 'female',
        masculineWeight: 0.2,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sel_3',
        question: 'When considering someone as a potential partner, how important is: their loyalty, their capacity for nurture, and whether you can trust them to work collaboratively?',
        selectionStandard: 'male',
        masculineWeight: 1.0,
        feminineWeight: 0.3
      },
      {
        id: 'attr_sel_4',
        question: 'How much does this matter when choosing a partner: their willingness and capacity to invest in long-term partnership, including parental investment if relevant?',
        selectionStandard: 'female',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sel_5',
        question: 'When looking for a long-term partner, how important is it that they: show clear willingness to invest in and commit to the relationship over time?',
        selectionStandard: 'female',
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
        question: 'When you notice someone, what tends to catch your attention more: displays of competence, achievement, or capability, or other qualities like personality or connection?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sig_2',
        question: 'In what you find physically attractive, what tends to matter more: youth, health, and vitality signals, or other aspects of their presence and being?',
        masculineWeight: 1.0,
        feminineWeight: -0.2
      },
      {
        id: 'attr_sig_3',
        question: 'When you want to attract someone\'s interest, what feels more natural: showing what you\'ve achieved, your resources, or your status, versus letting your presence speak for itself?',
        masculineWeight: 0.8,
        feminineWeight: -0.5
      },
      {
        id: 'attr_sig_4',
        question: 'When you want someone to notice you, what feels more authentic: letting your beauty, grace, and receptivity be visible, or focusing more on your achievements and capabilities?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'attr_sig_5',
        question: 'How much does this affect your attraction to someone: their visible health, youth, and physical vitality, versus other qualities like character or connection?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'attr_sig_6',
        question: 'When someone displays their capability, resourcefulness, and capacity to provide, how does that affect your attraction: does it increase your interest, or matter less than other factors?',
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
        question: 'When considering a potential partner, how much does this factor in: whether they can protect and provide, versus focusing more on emotional connection or compatibility?',
        masculineWeight: -0.3,
        feminineWeight: 1.0
      },
      {
        id: 'attr_hyp_2',
        question: 'What matters more when evaluating a potential partner: their loyalty, capacity for nurture, and ability to work collaboratively, or other factors like status or achievement?',
        masculineWeight: 1.0,
        feminineWeight: 0.2
      },
      {
        id: 'attr_hyp_3',
        question: 'When choosing a partner, how important is it that they: be at least your equal in value, capability, or standing, versus focusing more on compatibility and connection?',
        masculineWeight: -0.4,
        feminineWeight: 0.9
      },
      {
        id: 'attr_hyp_4',
        question: 'What feels more important in a relationship: knowing your partner considers you their best option, or feeling confident in the connection regardless of comparison?',
        masculineWeight: 0.6,
        feminineWeight: 0.7
      },
      {
        id: 'attr_hyp_5',
        question: 'How much does this matter when choosing a partner: their social standing, their network of connections, or their position in their community?',
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
        question: 'When you feel attraction, what feels more natural: taking action to pursue and initiate connection, or allowing yourself to be pursued and responding to their interest?',
        masculineWeight: 1.0,
        feminineWeight: -0.8
      },
      {
        id: 'attr_resp_2',
        question: 'When someone pursues you or makes their interest clear, how does that feel: more comfortable and natural, or do you prefer being the one who initiates?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      },
      {
        id: 'attr_resp_3',
        question: 'Before committing to someone, what feels more natural: testing and challenging them to see how they respond, or building trust more organically?',
        masculineWeight: -0.5,
        feminineWeight: 0.8
      },
      {
        id: 'attr_resp_4',
        question: 'What helps you open more fully in a relationship: feeling specifically chosen and prioritized by your partner, or feeling confident in the connection regardless?',
        masculineWeight: -0.7,
        feminineWeight: 1.0
      },
      {
        id: 'attr_resp_5',
        question: 'When pursuing someone you\'re interested in, what feels more engaging: the challenge of winning them over, or the natural flow of mutual interest?',
        masculineWeight: 1.0,
        feminineWeight: -0.6
      },
      {
        id: 'attr_resp_6',
        question: 'When someone shows strength, presence, and clear direction, how do you typically respond: does it increase your interest and responsiveness, or do you prefer when roles are more balanced?',
        masculineWeight: -0.9,
        feminineWeight: 1.0
      }
    ]
  }
};
