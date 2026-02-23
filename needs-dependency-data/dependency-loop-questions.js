// Dependency Loop Questions - Version 2
// 4-Phase Questionnaire Architecture
// Based on Chapter 5: Needs and Beliefs from Belief Mastery
// STRICT PROPRIETARY VOCABULARY - MUST BE ADHERED TO

// All Dependency Loops — expanded from 16 to 40
export const DEPENDENCY_LOOPS = [
  // CONNECTION family
  'BELONGING',
  'SECURITY',
  'CONSIDERATION',
  'TO SEE AND BE SEEN',
  'ACCEPTANCE',
  'INTIMACY',
  'TRUST',
  'LOVE',
  'WARMTH',
  'CLOSENESS',
  // PHYSICAL family
  'FLOW',
  'REST',
  'SAFETY',
  'TOUCH',
  'MOVEMENT',
  // HONESTY family
  'JOY',
  'AUTHENTICITY',
  'PRESENCE',
  // PEACE family
  'EASE',
  'EQUALITY',
  'ORDER',
  'HARMONY',
  // AUTONOMY family
  'SPACE',
  'INDEPENDENCE',
  'FREEDOM',
  'SPONTANEITY',
  // MEANING family
  'MOURNING',
  'APPROVAL',
  'CONTRIBUTION',
  'STIMULATION/ADVENTURE',
  'BEING WANTED',
  'PURPOSE',
  'SELF-EXPRESSION',
  'TO MATTER',
  'CLARITY',
  'GROWTH',
  'CREATIVITY'
];

// Loop family groupings — used by Phase 0 to scope Phase 1 scoring
export const LOOP_GROUPS = {
  CONNECTION: [
    'BELONGING', 'SECURITY', 'CONSIDERATION', 'TO SEE AND BE SEEN',
    'ACCEPTANCE', 'INTIMACY', 'TRUST', 'LOVE', 'WARMTH', 'CLOSENESS'
  ],
  PHYSICAL: [
    'FLOW', 'REST', 'SAFETY', 'TOUCH', 'MOVEMENT'
  ],
  HONESTY: [
    'JOY', 'AUTHENTICITY', 'PRESENCE'
  ],
  PEACE: [
    'EASE', 'EQUALITY', 'ORDER', 'HARMONY'
  ],
  AUTONOMY: [
    'SPACE', 'INDEPENDENCE', 'FREEDOM', 'SPONTANEITY'
  ],
  MEANING: [
    'MOURNING', 'APPROVAL', 'CONTRIBUTION', 'STIMULATION/ADVENTURE',
    'BEING WANTED', 'PURPOSE', 'SELF-EXPRESSION', 'TO MATTER',
    'CLARITY', 'GROWTH', 'CREATIVITY'
  ]
};

// Phase 0: Category Gate (2 questions)
// Purpose: Route respondent into a need family so Phase 1 scores only ~6-10 relevant loops
export const PHASE_0_QUESTIONS = [
  {
    id: 'p0_life_area',
    question: 'Which area of your life feels most persistently unresolved?',
    type: 'scenario',
    scoringWeight: 0, // gate only — not scored against loops
    options: [
      {
        text: 'Relationships — feeling connected, accepted, loved, or truly known',
        mapsTo: { families: ['CONNECTION'] }
      },
      {
        text: 'Energy and body — rest, physical ease, feeling safe in your body',
        mapsTo: { families: ['PHYSICAL'] }
      },
      {
        text: 'Authenticity and joy — being real, present, or genuinely alive',
        mapsTo: { families: ['HONESTY'] }
      },
      {
        text: 'Inner peace — fairness, calm, order, or harmony with your environment',
        mapsTo: { families: ['PEACE'] }
      },
      {
        text: 'Freedom and self-direction — space, autonomy, or independence',
        mapsTo: { families: ['AUTONOMY'] }
      },
      {
        text: 'Purpose and impact — contribution, recognition, growth, or mattering',
        mapsTo: { families: ['MEANING'] }
      }
    ],
    category: 'category_gate'
  },
  {
    id: 'p0_trigger_feeling',
    question: 'When you feel most triggered or destabilised, which feeling tends to be at the centre of it?',
    type: 'scenario',
    scoringWeight: 0,
    options: [
      {
        text: 'Rejection, exclusion, or not being truly wanted',
        mapsTo: { families: ['CONNECTION', 'MEANING'] }
      },
      {
        text: 'Depletion, overwhelm, or feeling unsafe',
        mapsTo: { families: ['PHYSICAL', 'PEACE'] }
      },
      {
        text: 'Feeling fake, numb, or cut off from what matters',
        mapsTo: { families: ['HONESTY', 'MEANING'] }
      },
      {
        text: 'Injustice, chaos, or things being out of order',
        mapsTo: { families: ['PEACE', 'CONNECTION'] }
      },
      {
        text: 'Being controlled, trapped, or losing your independence',
        mapsTo: { families: ['AUTONOMY', 'PHYSICAL'] }
      },
      {
        text: 'Feeling purposeless, invisible, or like you do not matter',
        mapsTo: { families: ['MEANING', 'CONNECTION'] }
      }
    ],
    category: 'category_gate'
  }
];

// Phase 1: Initial Screening (5-7 questions)
// Purpose: Identify dominant presenting symptoms and behavioral patterns
export const PHASE_1_QUESTIONS = [
  {
    id: 'p1_relationship_pattern',
    question: 'In your closest relationships, which statement resonates most?',
    type: 'scenario',
    scoringWeight: 3,
    options: [
      {
        text: 'I become more attentive and seek reassurance when things feel unstable',
        mapsTo: { loops: ['SECURITY', 'BEING WANTED', 'APPROVAL'], stressResponse: 'Perfectionism/Overcompensation', sourcing: 'compulsive' }
      },
      {
        text: 'I withdraw emotionally to protect myself when things feel unstable',
        mapsTo: { loops: ['SPACE', 'SECURITY', 'INDEPENDENCE'], stressResponse: 'Avoidance/Evasion', sourcing: 'avoidant' }
      },
      {
        text: 'I blame my partner or external circumstances for the instability',
        mapsTo: { loops: ['EQUALITY', 'CONSIDERATION', 'TO SEE AND BE SEEN'], stressResponse: 'Blame/Externalization', sourcing: 'compulsive' }
      },
      {
        text: 'I create chaos or tension to gain a sense of control',
        mapsTo: { loops: ['STIMULATION/ADVENTURE', 'CONTRIBUTION', 'FLOW'], stressResponse: 'Sabotage', sourcing: 'compulsive' }
      },
      {
        text: 'I try to maintain balance and communicate openly about what I need',
        mapsTo: { loops: [], stressResponse: 'Balanced', sourcing: 'balanced' }
      }
    ],
    category: 'relationship_dynamics'
  },
  {
    id: 'p1_stress_response',
    question: 'When facing difficulty, what\'s your most common response?',
    type: 'scenario',
    scoringWeight: 2,
    options: [
      {
        text: 'I avoid or evade the situation, hoping it will resolve itself',
        mapsTo: { stressResponse: 'Avoidance/Evasion', loops: ['EASE', 'REST', 'SECURITY'] }
      },
      {
        text: 'I overcompensate or strive for perfection to prove my worth',
        mapsTo: { stressResponse: 'Perfectionism/Overcompensation', loops: ['APPROVAL', 'CONTRIBUTION', 'TO SEE AND BE SEEN'] }
      },
      {
        text: 'I blame others or externalize responsibility',
        mapsTo: { stressResponse: 'Blame/Externalization', loops: ['EQUALITY', 'CONSIDERATION', 'BEING WANTED'] }
      },
      {
        text: 'I sabotage myself or the situation, confirming negative beliefs',
        mapsTo: { stressResponse: 'Sabotage', loops: ['MOURNING', 'BELONGING', 'INDEPENDENCE'] }
      },
      {
        text: 'I assess the situation and take appropriate action',
        mapsTo: { stressResponse: 'Balanced', loops: [] }
      }
    ],
    category: 'stress_response'
  },
  {
    id: 'p1_vice_states',
    question: 'Which emotional states do you experience most frequently? (Select all that apply)',
    type: 'multiselect',
    scoringWeight: 2,
    options: [
      { text: 'Anxiety', mapsTo: { vices: ['anxiety'], loops: ['SECURITY', 'REST', 'EASE'] } },
      { text: 'Shame', mapsTo: { vices: ['shame'], loops: ['BEING WANTED', 'APPROVAL', 'TO SEE AND BE SEEN'] } },
      { text: 'Anger/Rage', mapsTo: { vices: ['anger', 'rage', 'wrath'], loops: ['SPACE', 'EQUALITY', 'CONSIDERATION'] } },
      { text: 'Resentment/Bitterness', mapsTo: { vices: ['resentment', 'bitterness'], loops: ['JOY', 'FLOW', 'CONSIDERATION'] } },
      { text: 'Fear', mapsTo: { vices: ['fear'], loops: ['SECURITY', 'SAFETY', 'REST'] } },
      { text: 'Envy/Greed', mapsTo: { vices: ['envy', 'greed', 'avarice'], loops: ['BEING WANTED', 'APPROVAL', 'CONTRIBUTION'] } },
      { text: 'Sloth/Withdrawal', mapsTo: { vices: ['sloth'], loops: ['EASE', 'FLOW', 'STIMULATION/ADVENTURE'] } },
      { text: 'Desperation', mapsTo: { vices: ['desperation'], loops: ['BELONGING', 'BEING WANTED', 'CONSIDERATION'] } },
      { text: 'Frustration', mapsTo: { vices: ['frustration'], loops: ['SPACE', 'EASE', 'FLOW'] } },
      { text: 'Worthlessness/Inferiority', mapsTo: { vices: ['worthlessness', 'inferiority'], loops: ['BEING WANTED', 'APPROVAL', 'CONTRIBUTION'] } },
      { text: 'Guilt', mapsTo: { vices: ['guilt'], loops: ['CONSIDERATION', 'REST', 'CONTRIBUTION'] } },
      { text: 'Disappointment', mapsTo: { vices: ['disappointment'], loops: ['JOY', 'TO SEE AND BE SEEN', 'APPROVAL'] }
      }
    ],
    category: 'vice_identification',
    maxSelections: 3
  },
  {
    id: 'p1_trigger_sensitivity',
    question: 'Which situations cause the strongest emotional reactions?',
    type: 'scenario',
    scoringWeight: 2,
    options: [
      {
        text: 'Feeling crowded or having my boundaries violated',
        mapsTo: { loops: ['SPACE', 'INDEPENDENCE'], triggers: ['boundary_violation', 'intrusion'] }
      },
      {
        text: 'Being ignored or feeling invisible',
        mapsTo: { loops: ['TO SEE AND BE SEEN', 'BEING WANTED', 'CONSIDERATION'], triggers: ['invisibility', 'neglect'] }
      },
      {
        text: 'Uncertainty or unpredictability in relationships',
        mapsTo: { loops: ['SECURITY', 'REST', 'EASE'], triggers: ['uncertainty', 'instability'] }
      },
      {
        text: 'Feeling like I don\'t matter or my contributions aren\'t valued',
        mapsTo: { loops: ['CONTRIBUTION', 'APPROVAL', 'TO SEE AND BE SEEN'], triggers: ['devaluation', 'rejection'] }
      },
      {
        text: 'Being controlled or having my autonomy restricted',
        mapsTo: { loops: ['INDEPENDENCE', 'EQUALITY', 'SPACE'], triggers: ['control', 'restriction'] }
      },
      {
        text: 'Feeling excluded or not belonging',
        mapsTo: { loops: ['BELONGING', 'BEING WANTED'], triggers: ['exclusion', 'rejection'] }
      }
    ],
    category: 'trigger_sensitivity'
  },
  {
    id: 'p1_compulsion_aversion',
    question: 'Do you find yourself repeatedly seeking or avoiding certain experiences?',
    type: 'scaled',
    scoringWeight: 1,
    scale: { min: 1, max: 7, labels: { 1: 'Never', 4: 'Sometimes', 7: 'Constantly' } },
    mapsTo: { loops: ['ALL'], category: 'compulsion_aversion_preliminary' },
    category: 'compulsion_aversion'
  },
  {
    id: 'p1_attachment_style',
    question: 'In relationships, how do you typically respond when your partner seems distant?',
    type: 'scenario',
    scoringWeight: 1,
    options: [
      {
        text: 'I become anxious and seek more connection/reassurance',
        mapsTo: { attachmentStyle: 'Anxious', loops: ['SECURITY', 'BEING WANTED', 'CONSIDERATION'] }
      },
      {
        text: 'I withdraw and create more distance myself',
        mapsTo: { attachmentStyle: 'Avoidant', loops: ['SPACE', 'INDEPENDENCE', 'REST'] }
      },
      {
        text: 'I feel confused and alternate between seeking and withdrawing',
        mapsTo: { attachmentStyle: 'Disorganized', loops: ['SECURITY', 'BELONGING', 'EASE'] }
      },
      {
        text: 'I communicate my needs and give space as needed',
        mapsTo: { attachmentStyle: 'Secure', loops: [] }
      }
    ],
    category: 'attachment_style'
  }
];

// Phase 2: Loop-Specific Deep Dive (Dynamic branching)
// Based on Phase 1 responses, system branches into targeted question clusters for 2-3 most likely loops
// For each suspected loop, ask 4-5 questions covering:
// - Compulsive Sourcing Indicators
// - Avoidant Sourcing Indicators
// - Partner Consequence Recognition
// - Need Chain Exploration
// - Historical Pattern Validation

export const PHASE_2_QUESTIONS = {
  'SPACE': [
    {
      id: 'p2_space_compulsive',
      question: 'Do you feel unable to relax unless someone else is managing the environment?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SPACE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_space_avoidant',
      question: 'Do you withdraw or disappear emotionally to protect your boundaries?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SPACE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_space_partner',
      question: 'Have relationships become strained when you feel crowded or suffocated?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SPACE', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_space_need_chain',
      question: 'When you feel like you need space, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel safe', mapsTo: { need: 'safety', deeper: ['security', 'rest'] } },
        { text: 'I feel controlled', mapsTo: { need: 'independence', deeper: ['autonomy', 'freedom'] } },
        { text: 'I feel overwhelmed', mapsTo: { need: 'ease', deeper: ['rest', 'peace'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'SPACE', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_space_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SPACE', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'JOY': [
    {
      id: 'p2_joy_compulsive',
      question: 'Do you find yourself drawn to people who are lighthearted or joyful, hoping their energy will lift you?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'JOY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_joy_avoidant',
      question: 'Do you suppress spontaneity or playfulness to avoid potential disappointment?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'JOY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_joy_partner',
      question: 'Have relationships become strained when joy feels like an obligation rather than spontaneous?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'JOY', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_joy_need_chain',
      question: 'When you feel joyless or heavy, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I feel disconnected from myself', mapsTo: { need: 'presence', deeper: ['awareness', 'mourning'] } },
        { text: 'I feel like I don\'t matter', mapsTo: { need: 'to matter', deeper: ['being wanted', 'approval'] } },
        { text: 'I feel exhausted', mapsTo: { need: 'rest', deeper: ['ease', 'safety'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'JOY', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_joy_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'JOY', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'BEING WANTED': [
    {
      id: 'p2_wanted_compulsive',
      question: 'Do you find yourself seeking proof that others want you, rather than expressing your own desire?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BEING WANTED', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_wanted_avoidant',
      question: 'Do you suppress or hide your desire to be wanted, fearing rejection?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BEING WANTED', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_wanted_partner',
      question: 'Have relationships become strained when you feel like you\'re constantly auditioning to be wanted?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BEING WANTED', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_wanted_need_chain',
      question: 'When you feel unwanted, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel like I matter', mapsTo: { need: 'to matter', deeper: ['self-respect', 'self-compassion'] } },
        { text: 'I feel worthless', mapsTo: { need: 'self-respect', deeper: ['acceptance', 'compassion'] } },
        { text: 'I feel invisible', mapsTo: { need: 'to see and be seen', deeper: ['to matter', 'being wanted'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'BEING WANTED', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_wanted_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BEING WANTED', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'EQUALITY': [
    {
      id: 'p2_equality_compulsive',
      question: 'Do you find yourself constantly tracking whether things are "fair" or equal in relationships?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EQUALITY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_equality_avoidant',
      question: 'Do you avoid shared decision-making or authority, fearing domination?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EQUALITY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_equality_partner',
      question: 'Have relationships become strained when you feel judged rather than joined?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EQUALITY', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_equality_need_chain',
      question: 'When you feel unequal or powerless, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I feel disrespected', mapsTo: { need: 'respect', deeper: ['self-respect', 'being esteemed'] } },
        { text: 'I feel controlled', mapsTo: { need: 'independence', deeper: ['autonomy', 'freedom'] } },
        { text: 'I feel like I don\'t matter', mapsTo: { need: 'to matter', deeper: ['being wanted', 'approval'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'EQUALITY', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_equality_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EQUALITY', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'TO SEE AND BE SEEN': [
    {
      id: 'p2_seen_compulsive',
      question: 'Do you find yourself performing or curating your persona to elicit admiration?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'TO SEE AND BE SEEN', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_seen_avoidant',
      question: 'Do you hide or suppress your thoughts and feelings, fearing exposure?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'TO SEE AND BE SEEN', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_seen_partner',
      question: 'Have relationships become strained when you feel like an audience rather than a partner?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'TO SEE AND BE SEEN', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_seen_need_chain',
      question: 'When you feel unseen or invisible, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel like I matter', mapsTo: { need: 'to matter', deeper: ['self-respect', 'being wanted'] } },
        { text: 'I feel invalid', mapsTo: { need: 'acceptance', deeper: ['self-respect', 'compassion'] } },
        { text: 'I feel disconnected', mapsTo: { need: 'connection', deeper: ['belonging', 'intimacy'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'TO SEE AND BE SEEN', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_seen_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'TO SEE AND BE SEEN', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'EASE': [
    {
      id: 'p2_ease_compulsive',
      question: 'Do you chase ease through perfectionism or hyper-efficiency, believing it must be earned?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EASE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_ease_avoidant',
      question: 'Do you detach from action or decision-making if it feels too hard?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EASE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_ease_partner',
      question: 'Have relationships become strained when ease feels forbidden or like a reward never granted?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EASE', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_ease_need_chain',
      question: 'When you feel like things are "too hard," what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel like I matter', mapsTo: { need: 'to matter', deeper: ['self-respect', 'being wanted'] } },
        { text: 'I\'m physically exhausted', mapsTo: { need: 'rest', deeper: ['nutrition', 'sleep', 'safety'] } },
        { text: 'I\'ve lost connection with my inner world', mapsTo: { need: 'presence', deeper: ['awareness', 'mourning'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'EASE', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_ease_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'EASE', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'SECURITY': [
    {
      id: 'p2_security_compulsive',
      question: 'Do you seek constant reassurance or monitor your partner\'s behavior for signs of threat?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SECURITY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_security_avoidant',
      question: 'Do you preemptively control your environment or isolate to prevent chaos?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SECURITY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_security_partner',
      question: 'Have relationships become strained when you feel like you\'re carrying both nervous systems?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SECURITY', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_security_need_chain',
      question: 'When you feel insecure or unsafe, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel protected', mapsTo: { need: 'safety', deeper: ['security', 'stability'] } },
        { text: 'I feel unpredictable', mapsTo: { need: 'stability', deeper: ['consistency', 'trust'] } },
        { text: 'I feel exposed', mapsTo: { need: 'safe-space', deeper: ['shelter', 'boundaries'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'SECURITY', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_security_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'SECURITY', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'BELONGING': [
    {
      id: 'p2_belonging_compulsive',
      question: 'Do you seek constant proof that you\'re relevant or included in groups?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BELONGING', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_belonging_avoidant',
      question: 'Do you preemptively reject group settings, acting disinterested to avoid exclusion?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BELONGING', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_belonging_partner',
      question: 'Have relationships become strained when connection feels like management rather than mutual interest?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BELONGING', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_belonging_need_chain',
      question: 'When you feel like you don\'t belong, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I feel excluded', mapsTo: { need: 'inclusion', deeper: ['belonging', 'acceptance'] } },
        { text: 'I feel like I don\'t matter', mapsTo: { need: 'to matter', deeper: ['being wanted', 'approval'] } },
        { text: 'I feel disconnected', mapsTo: { need: 'connection', deeper: ['intimacy', 'closeness'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'BELONGING', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_belonging_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'BELONGING', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'CONSIDERATION': [
    {
      id: 'p2_consideration_compulsive',
      question: 'Do you seek continuous proof that you\'re being factored in, repeating concerns or over-disclosing?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONSIDERATION', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_consideration_avoidant',
      question: 'Do you suppress your own needs entirely, assuming they\'ll be dismissed?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONSIDERATION', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_consideration_partner',
      question: 'Have relationships become strained when you feel like a sounding board rather than a partner?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONSIDERATION', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_consideration_need_chain',
      question: 'When you feel unconsidered or neglected, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel like I matter', mapsTo: { need: 'to matter', deeper: ['self-respect', 'being wanted'] } },
        { text: 'I feel invisible', mapsTo: { need: 'to see and be seen', deeper: ['to matter', 'being wanted'] } },
        { text: 'I feel misunderstood', mapsTo: { need: 'to understand and be understood', deeper: ['communication', 'empathy'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'CONSIDERATION', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_consideration_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONSIDERATION', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'FLOW': [
    {
      id: 'p2_flow_compulsive',
      question: 'Do you attach to someone whose movement feels effortless, hoping proximity will generate propulsion?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'FLOW', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_flow_avoidant',
      question: 'Do you avoid flow, mistrusting intuition and equating the unfamiliar with danger?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'FLOW', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_flow_partner',
      question: 'Have relationships become strained when your natural pace collapses under pressure to carry another?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'FLOW', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_flow_need_chain',
      question: 'When you feel stuck or without direction, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I\'ve lost touch with my purpose', mapsTo: { need: 'purpose', deeper: ['meaning', 'clarity'] } },
        { text: 'I feel unclear', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } },
        { text: 'I feel ineffective', mapsTo: { need: 'effectiveness', deeper: ['competence', 'contribution'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'FLOW', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_flow_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'FLOW', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'MOURNING': [
    {
      id: 'p2_mourning_compulsive',
      question: 'Do you gravitate toward grief-saturated environments or catalyze grief in others?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'MOURNING', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_mourning_avoidant',
      question: 'Do you avoid grief entirely, refusing to speak about your pain or present it to others?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'MOURNING', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_mourning_partner',
      question: 'Have relationships become strained when you feel involuntarily enlisted into a mourning field?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'MOURNING', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_mourning_need_chain',
      question: 'When you feel heavy or grief-stricken, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I feel disconnected from myself', mapsTo: { need: 'presence', deeper: ['awareness', 'mourning'] } },
        { text: 'I feel like I\'ve lost something', mapsTo: { need: 'mourning', deeper: ['acceptance', 'compassion'] } },
        { text: 'I feel unsupported', mapsTo: { need: 'support', deeper: ['connection', 'compassion'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'MOURNING', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_mourning_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'MOURNING', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'APPROVAL': [
    {
      id: 'p2_approval_compulsive',
      question: 'Do you rely on praise or validation from others to feel worthwhile?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'APPROVAL', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_approval_avoidant',
      question: 'Do you downplay or hide your accomplishments, fearing attention or judgment?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'APPROVAL', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_approval_partner',
      question: 'Have relationships become strained when encouragement loses authenticity?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'APPROVAL', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_approval_need_chain',
      question: 'When you feel unapproved or judged, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel like I matter', mapsTo: { need: 'to matter', deeper: ['self-respect', 'being wanted'] } },
        { text: 'I feel worthless', mapsTo: { need: 'self-respect', deeper: ['acceptance', 'compassion'] } },
        { text: 'I feel like I\'m not good enough', mapsTo: { need: 'being esteemed', deeper: ['self-respect', 'approval'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'APPROVAL', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_approval_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'APPROVAL', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'REST': [
    {
      id: 'p2_rest_compulsive',
      question: 'Do you only relax when another holds vigilance on your behalf?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'REST', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_rest_avoidant',
      question: 'Do you refuse rest altogether, never truly letting down your guard?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'REST', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_rest_partner',
      question: 'Have relationships become strained when you feel like a prosthetic for another rather than living your own life?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'REST', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_rest_need_chain',
      question: 'When you feel unable to rest, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel safe', mapsTo: { need: 'safety', deeper: ['security', 'stability'] } },
        { text: 'I feel like I need to be vigilant', mapsTo: { need: 'security', deeper: ['safety', 'stability'] } },
        { text: 'I feel exhausted but can\'t stop', mapsTo: { need: 'rest', deeper: ['ease', 'peace'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'REST', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_rest_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'REST', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'CONTRIBUTION': [
    {
      id: 'p2_contribution_compulsive',
      question: 'Do you insert yourself into every task or crisis, offering unsolicited help to prove your value?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONTRIBUTION', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_contribution_avoidant',
      question: 'Do you suppress your gifts or minimize your role, fearing expectations or judgment?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONTRIBUTION', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_contribution_partner',
      question: 'Have relationships become strained when support becomes scorekeeping?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONTRIBUTION', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_contribution_need_chain',
      question: 'When you feel like your contributions don\'t matter, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I don\'t feel like I matter', mapsTo: { need: 'to matter', deeper: ['self-respect', 'being wanted'] } },
        { text: 'I feel ineffective', mapsTo: { need: 'effectiveness', deeper: ['competence', 'contribution'] } },
        { text: 'I feel purposeless', mapsTo: { need: 'purpose', deeper: ['meaning', 'clarity'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'CONTRIBUTION', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_contribution_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'CONTRIBUTION', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'INDEPENDENCE': [
    {
      id: 'p2_independence_compulsive',
      question: 'Do you reject input or resist compromise, framing collaboration as intrusion?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'INDEPENDENCE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_independence_avoidant',
      question: 'Do you surrender authorship to avoid responsibility, saying "whatever you want"?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'INDEPENDENCE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_independence_partner',
      question: 'Have relationships become strained when closeness feels like a minefield of confrontation?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'INDEPENDENCE', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_independence_need_chain',
      question: 'When you feel controlled or restricted, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I feel powerless', mapsTo: { need: 'freedom', deeper: ['independence', 'autonomy'] } },
        { text: 'I feel trapped', mapsTo: { need: 'space', deeper: ['independence', 'freedom'] } },
        { text: 'I feel disrespected', mapsTo: { need: 'respect', deeper: ['self-respect', 'being esteemed'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'INDEPENDENCE', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_independence_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'INDEPENDENCE', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],
  'STIMULATION/ADVENTURE': [
    {
      id: 'p2_stimulation_compulsive',
      question: 'Do you seek constant novelty or activity to avoid emotional stillness?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'STIMULATION/ADVENTURE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_stimulation_avoidant',
      question: 'Do you fear spontaneity, clinging to routine and over-planning to avoid risk?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'STIMULATION/ADVENTURE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_stimulation_partner',
      question: 'Have relationships become strained when life feels like it\'s gone gray or too chaotic?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'STIMULATION/ADVENTURE', indicator: 'partner_consequence' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_stimulation_need_chain',
      question: 'When you feel lifeless or overwhelmed by stimulation, what might be underneath that feeling?',
      type: 'need_chain',
      options: [
        { text: 'I feel disconnected from myself', mapsTo: { need: 'presence', deeper: ['awareness', 'mourning'] } },
        { text: 'I feel purposeless', mapsTo: { need: 'purpose', deeper: ['meaning', 'clarity'] } },
        { text: 'I feel unsafe', mapsTo: { need: 'safety', deeper: ['security', 'stability'] } },
        { text: 'I don\'t know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
      ],
      mapsTo: { loop: 'STIMULATION/ADVENTURE', indicator: 'need_chain' },
      category: 'loop_deep_dive'
    },
    {
      id: 'p2_stimulation_historical',
      question: 'Can you trace this pattern back to childhood or early experiences?',
      type: 'scaled',
      scale: { min: 1, max: 7 },
      mapsTo: { loop: 'STIMULATION/ADVENTURE', indicator: 'historical_pattern' },
      category: 'loop_deep_dive'
    }
  ],

  // ── CONNECTION additions ──────────────────────────────────────────────────

  'ACCEPTANCE': [
    { id: 'p2_acceptance_compulsive', question: 'Do you change yourself or your opinions to gain others\' approval, even when it conflicts with what you actually believe?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ACCEPTANCE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_acceptance_avoidant', question: 'Do you withdraw from social situations or reject praise because you fear the eventual moment of rejection more than you enjoy the connection?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ACCEPTANCE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_acceptance_partner', question: 'Have relationships become strained because others sense you are performing a version of yourself rather than being fully present?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ACCEPTANCE', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_acceptance_need_chain', question: 'When you feel unaccepted or like you have to earn your place, what might be underneath that?', type: 'need_chain', options: [
      { text: 'I feel fundamentally flawed', mapsTo: { need: 'self-respect', deeper: ['compassion', 'safety'] } },
      { text: 'I do not feel safe being myself', mapsTo: { need: 'safety', deeper: ['security', 'trust'] } },
      { text: 'I feel invisible unless I perform', mapsTo: { need: 'to see and be seen', deeper: ['to matter', 'being wanted'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'ACCEPTANCE', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_acceptance_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ACCEPTANCE', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'INTIMACY': [
    { id: 'p2_intimacy_compulsive', question: 'Do you overshare or rush emotional closeness with people, needing them to know the deepest parts of you before the relationship has earned that level of trust?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'INTIMACY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_intimacy_avoidant', question: 'Do you keep relationships at a surface level, afraid that real closeness will expose something others will ultimately reject?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'INTIMACY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_intimacy_partner', question: 'Have relationships become strained because your partner feels either suffocated by your need for closeness or shut out by your distance?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'INTIMACY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_intimacy_need_chain', question: 'When you feel the absence of true intimacy, what might be underneath that feeling?', type: 'need_chain', options: [
      { text: 'I fear being truly known and still rejected', mapsTo: { need: 'safety', deeper: ['trust', 'acceptance'] } },
      { text: 'I do not trust that I am loveable as I am', mapsTo: { need: 'self-respect', deeper: ['acceptance', 'love'] } },
      { text: 'I feel profoundly lonely even around people', mapsTo: { need: 'to know and be known', deeper: ['belonging', 'closeness'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'INTIMACY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_intimacy_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'INTIMACY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'TRUST': [
    { id: 'p2_trust_compulsive', question: 'Do you extend trust too quickly — giving people the benefit of the doubt far past the point where it has been earned — and then feel devastated when it is broken?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TRUST', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_trust_avoidant', question: 'Do you withhold trust entirely, remaining suspicious even when others have given you no reason to doubt them?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TRUST', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_trust_partner', question: 'Have relationships become strained because your partner feels constantly tested or kept at arm\'s length?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TRUST', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_trust_need_chain', question: 'When trust feels absent or broken, what sits underneath that?', type: 'need_chain', options: [
      { text: 'I do not feel safe with other people', mapsTo: { need: 'safety', deeper: ['security', 'consistency'] } },
      { text: 'I have been let down enough times to stop expecting reliability', mapsTo: { need: 'consistency', deeper: ['stability', 'security'] } },
      { text: 'I feel I must rely entirely on myself', mapsTo: { need: 'independence', deeper: ['safety', 'self-respect'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'TRUST', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_trust_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TRUST', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'LOVE': [
    { id: 'p2_love_compulsive', question: 'Do you pursue or maintain relationships primarily out of a need to feel loved rather than from a genuine desire to love the other person?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'LOVE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_love_avoidant', question: 'Do you deflect, minimise, or reject love when it is offered, as though receiving it fully would make you too vulnerable?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'LOVE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_love_partner', question: 'Have relationships become strained because your partner feels their love is never quite enough, or that you pull away when they get close?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'LOVE', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_love_need_chain', question: 'When you feel unloved or unable to receive love, what might be underneath that?', type: 'need_chain', options: [
      { text: 'I do not feel worthy of being loved as I am', mapsTo: { need: 'self-respect', deeper: ['acceptance', 'compassion'] } },
      { text: 'Being loved makes me feel exposed and at risk', mapsTo: { need: 'safety', deeper: ['trust', 'security'] } },
      { text: 'I confuse being needed with being loved', mapsTo: { need: 'to matter', deeper: ['being wanted', 'contribution'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'LOVE', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_love_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'LOVE', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'WARMTH': [
    { id: 'p2_warmth_compulsive', question: 'Do you seek constant warmth or affection from others — needing a steady supply of reassurance, kind words, or gentle touch to feel okay?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'WARMTH', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_warmth_avoidant', question: 'Do you keep an emotional chill — holding people at a distance or being reserved — even when warmth is freely available?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'WARMTH', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_warmth_partner', question: 'Have relationships become strained because your partner finds you emotionally cold, or exhausted by constantly having to provide warmth you cannot sustain?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'WARMTH', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_warmth_need_chain', question: 'When warmth feels absent or unsafe, what might be underneath that feeling?', type: 'need_chain', options: [
      { text: 'I grew up in an emotionally cold environment', mapsTo: { need: 'nurturing', deeper: ['love', 'safety'] } },
      { text: 'Warmth feels conditional and I am waiting for it to be withdrawn', mapsTo: { need: 'consistency', deeper: ['trust', 'security'] } },
      { text: 'I do not know how to give or receive warmth without feeling exposed', mapsTo: { need: 'safety', deeper: ['acceptance', 'intimacy'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'WARMTH', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_warmth_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'WARMTH', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'CLOSENESS': [
    { id: 'p2_closeness_compulsive', question: 'Do you merge with the people you care about — spending almost all your time together, losing your own perspective, needing them physically or emotionally near at all times?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLOSENESS', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_closeness_avoidant', question: 'Do you maintain careful distance from the people you love — never quite letting anyone fully in — to protect yourself from the pain of eventual loss?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLOSENESS', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_closeness_partner', question: 'Have relationships become strained because your partner feels smothered by your need for closeness, or that they can never quite reach you?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLOSENESS', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_closeness_need_chain', question: 'When closeness feels threatened or impossible, what sits underneath that?', type: 'need_chain', options: [
      { text: 'I am terrified of being alone', mapsTo: { need: 'belonging', deeper: ['safety', 'love'] } },
      { text: 'I fear that people I love will leave', mapsTo: { need: 'consistency', deeper: ['security', 'trust'] } },
      { text: 'I do not know how to be close without losing myself', mapsTo: { need: 'independence', deeper: ['space', 'self-respect'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'CLOSENESS', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_closeness_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLOSENESS', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  // ── PHYSICAL additions ────────────────────────────────────────────────────

  'SAFETY': [
    { id: 'p2_safety_compulsive', question: 'Do you over-monitor your environment — scanning for threats, controlling variables, or avoiding anything unfamiliar — to the point where it limits your life?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SAFETY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_safety_avoidant', question: 'Do you take unnecessary risks or dismiss genuine danger — as if proving to yourself that you are untouchable — as an alternative to feeling your vulnerability?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SAFETY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_safety_partner', question: 'Have relationships become strained because others feel your fear of danger — or your reckless disregard for it — makes closeness feel unstable?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SAFETY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_safety_need_chain', question: 'When you feel unsafe — or when you numb out to danger — what sits underneath that?', type: 'need_chain', options: [
      { text: 'I grew up in an unpredictable or threatening environment', mapsTo: { need: 'stability', deeper: ['security', 'consistency'] } },
      { text: 'I feel safer being the one who causes danger than the one who suffers it', mapsTo: { need: 'control', deeper: ['independence', 'safety'] } },
      { text: 'I feel unsafe in my own body', mapsTo: { need: 'rest', deeper: ['ease', 'nourishment'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'SAFETY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_safety_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SAFETY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'TOUCH': [
    { id: 'p2_touch_compulsive', question: 'Do you seek physical contact — hugs, closeness, sexual expression — compulsively, using it to regulate emotional states rather than as genuine connection?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TOUCH', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_touch_avoidant', question: 'Do you flinch from or avoid physical contact, even gentle or caring touch, as though it threatens something in you?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TOUCH', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_touch_partner', question: 'Have relationships become strained because your partner feels their physical affection is either never enough or constantly pushed away?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TOUCH', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_touch_need_chain', question: 'When your need for touch feels unmet or unsafe, what might be underneath that?', type: 'need_chain', options: [
      { text: 'Touch was withheld or weaponised when I was young', mapsTo: { need: 'nurturing', deeper: ['safety', 'love'] } },
      { text: 'My body does not feel like a safe place to live in', mapsTo: { need: 'safety', deeper: ['rest', 'ease'] } },
      { text: 'I use touch to feel real, connected, or alive', mapsTo: { need: 'presence', deeper: ['joy', 'intimacy'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'TOUCH', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_touch_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TOUCH', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'MOVEMENT': [
    { id: 'p2_movement_compulsive', question: 'Do you use exercise or physical activity compulsively — to manage anxiety, punish yourself, or prove something — rather than for genuine wellbeing?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'MOVEMENT', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_movement_avoidant', question: 'Do you avoid movement or exercise even when you know it would restore you — staying stuck, stagnant, or numb in your body?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'MOVEMENT', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_movement_partner', question: 'Has your relationship to your body — over-exercising or under-exercising — created tension in your relationships or in how others experience you?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'MOVEMENT', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_movement_need_chain', question: 'When you feel stuck in your body or compelled to exhaust it, what might be underneath that?', type: 'need_chain', options: [
      { text: 'I feel safest when I am in control of my body', mapsTo: { need: 'control', deeper: ['safety', 'independence'] } },
      { text: 'I use physical activity to escape emotional pain', mapsTo: { need: 'ease', deeper: ['rest', 'peace'] } },
      { text: 'I feel disconnected from my body and movement is the only way back', mapsTo: { need: 'presence', deeper: ['flow', 'joy'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'MOVEMENT', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_movement_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'MOVEMENT', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  // ── HONESTY additions ─────────────────────────────────────────────────────

  'AUTHENTICITY': [
    { id: 'p2_authenticity_compulsive', question: 'Do you over-disclose or over-share — insisting on radical honesty in situations where it creates damage — using authenticity as a club rather than a connection?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'AUTHENTICITY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_authenticity_avoidant', question: 'Do you perform a version of yourself — agreeable, palatable, carefully constructed — to avoid the risk of what might happen if people saw the real you?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'AUTHENTICITY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_authenticity_partner', question: 'Have relationships become strained because others sense they are getting a curated version of you, or because your bluntness has damaged people who didn\'t ask for full transparency?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'AUTHENTICITY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_authenticity_need_chain', question: 'When being authentic feels impossible or dangerous, what sits underneath that?', type: 'need_chain', options: [
      { text: 'The real me was rejected or punished when I was young', mapsTo: { need: 'acceptance', deeper: ['safety', 'self-respect'] } },
      { text: 'I do not know who the real me actually is', mapsTo: { need: 'identity', deeper: ['clarity', 'presence'] } },
      { text: 'I was taught that performing was survival', mapsTo: { need: 'safety', deeper: ['integrity', 'trust'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'AUTHENTICITY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_authenticity_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'AUTHENTICITY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'PRESENCE': [
    { id: 'p2_presence_compulsive', question: 'Do you pursue mindfulness, grounding, or spiritual practices obsessively — using presence as a way to escape emotion rather than meet it?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PRESENCE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_presence_avoidant', question: 'Do you stay perpetually distracted — screens, busyness, noise — because stillness and being in the moment feels intolerable?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PRESENCE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_presence_partner', question: 'Have relationships become strained because others feel you are never truly here — either checked out or so focused on inner states that you miss them?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PRESENCE', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_presence_need_chain', question: 'When being present feels impossible or threatening, what might be underneath that?', type: 'need_chain', options: [
      { text: 'The present moment usually contains pain I am not ready for', mapsTo: { need: 'safety', deeper: ['ease', 'rest'] } },
      { text: 'I am always in my head — past or future — and cannot find now', mapsTo: { need: 'clarity', deeper: ['awareness', 'flow'] } },
      { text: 'I fear that if I stop, everything I have been avoiding will arrive', mapsTo: { need: 'mourning', deeper: ['acceptance', 'ease'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'PRESENCE', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_presence_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PRESENCE', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  // ── PEACE additions ───────────────────────────────────────────────────────

  'ORDER': [
    { id: 'p2_order_compulsive', question: 'Do you impose rigid structure on your environment — schedules, systems, or rules — to the point where spontaneity or disruption causes disproportionate distress?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ORDER', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_order_avoidant', question: 'Do you deliberately resist or create chaos — refusing structure, leaving things unfinished — as though order itself is a threat to your freedom?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ORDER', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_order_partner', question: 'Have relationships become strained because others feel controlled by your need for order, or exhausted by the chaos you generate?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ORDER', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_order_need_chain', question: 'When your need for order is unmet, what might be underneath that feeling?', type: 'need_chain', options: [
      { text: 'My early environment was chaotic and unpredictable', mapsTo: { need: 'security', deeper: ['safety', 'stability'] } },
      { text: 'I feel like if I let go of control everything will collapse', mapsTo: { need: 'safety', deeper: ['ease', 'trust'] } },
      { text: 'Chaos represents failure to me', mapsTo: { need: 'competence', deeper: ['self-respect', 'approval'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'ORDER', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_order_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'ORDER', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'HARMONY': [
    { id: 'p2_harmony_compulsive', question: 'Do you smooth over conflict at the expense of truth — keeping the peace in ways that require you to suppress your own needs or suppress honest conversation?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'HARMONY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_harmony_avoidant', question: 'Do you create discord or provoke conflict, even when things are peaceful, as though harmony feels threatening or false?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'HARMONY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_harmony_partner', question: 'Have relationships become strained because others sense that the peace between you is maintained through avoidance rather than resolution?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'HARMONY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_harmony_need_chain', question: 'When harmony feels absent or like a lie you are maintaining, what might be underneath?', type: 'need_chain', options: [
      { text: 'Conflict in my early life felt genuinely dangerous', mapsTo: { need: 'safety', deeper: ['security', 'ease'] } },
      { text: 'I believe my real feelings would destroy the relationship', mapsTo: { need: 'acceptance', deeper: ['safety', 'trust'] } },
      { text: 'I have never seen conflict resolved well and expect it to end badly', mapsTo: { need: 'trust', deeper: ['consistency', 'safety'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'HARMONY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_harmony_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'HARMONY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  // ── AUTONOMY additions ────────────────────────────────────────────────────

  'FREEDOM': [
    { id: 'p2_freedom_compulsive', question: 'Do you resist authority, rules, or commitments reflexively — even when they are reasonable — because constraint of any kind feels intolerable?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'FREEDOM', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_freedom_avoidant', question: 'Do you over-commit, comply automatically, or give away your autonomy to keep the peace — and then feel resentful of the cage you have built yourself?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'FREEDOM', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_freedom_partner', question: 'Have relationships become strained because your need for freedom makes long-term commitment feel impossible, or because you resent the very obligations you agreed to?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'FREEDOM', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_freedom_need_chain', question: 'When freedom feels absent or threatened, what sits underneath that?', type: 'need_chain', options: [
      { text: 'I was over-controlled or parentified as a child', mapsTo: { need: 'independence', deeper: ['autonomy', 'self-respect'] } },
      { text: 'Freedom is the only way I know how to feel safe', mapsTo: { need: 'safety', deeper: ['ease', 'space'] } },
      { text: 'I equate commitment with loss of self', mapsTo: { need: 'identity', deeper: ['integrity', 'autonomy'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'FREEDOM', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_freedom_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'FREEDOM', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'SPONTANEITY': [
    { id: 'p2_spontaneity_compulsive', question: 'Do you act impulsively — making sudden changes, commitments, or decisions without forethought — chasing the feeling of aliveness that spontaneity brings?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SPONTANEITY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_spontaneity_avoidant', question: 'Do you over-plan and over-structure everything, refusing to leave room for the unexpected, because unpredictability feels threatening?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SPONTANEITY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_spontaneity_partner', question: 'Have relationships become strained because others find it impossible to make plans with you, or feel suffocated by the rigid structure you impose?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SPONTANEITY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_spontaneity_need_chain', question: 'When spontaneity feels impossible or terrifying, what might be underneath that?', type: 'need_chain', options: [
      { text: 'Unpredictability in my past meant danger', mapsTo: { need: 'safety', deeper: ['security', 'consistency'] } },
      { text: 'I need novelty to feel alive and routine feels like slow death', mapsTo: { need: 'stimulation', deeper: ['joy', 'flow'] } },
      { text: 'I fear losing control if I let go of the plan', mapsTo: { need: 'control', deeper: ['safety', 'order'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'SPONTANEITY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_spontaneity_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SPONTANEITY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  // ── MEANING additions ─────────────────────────────────────────────────────

  'PURPOSE': [
    { id: 'p2_purpose_compulsive', question: 'Do you attach yourself so strongly to a mission, cause, or role that without it you feel empty — using purpose as an identity prosthetic rather than a genuine calling?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PURPOSE', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_purpose_avoidant', question: 'Do you drift, delay, or dismiss meaningful pursuits — staying busy with the inconsequential — to avoid the vulnerability of caring deeply about something?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PURPOSE', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_purpose_partner', question: 'Have relationships become strained because your pursuit of purpose excludes others, or because your lack of direction makes you feel hollow to be around?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PURPOSE', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_purpose_need_chain', question: 'When purpose feels absent or hollow, what might be underneath that?', type: 'need_chain', options: [
      { text: 'I was never encouraged to develop my own direction', mapsTo: { need: 'autonomy', deeper: ['self-expression', 'clarity'] } },
      { text: 'I fear that my deepest calling is not enough — or not real', mapsTo: { need: 'self-respect', deeper: ['competence', 'to matter'] } },
      { text: 'Purpose is the only thing that makes me feel worthy', mapsTo: { need: 'to matter', deeper: ['acceptance', 'love'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'PURPOSE', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_purpose_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'PURPOSE', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'SELF-EXPRESSION': [
    { id: 'p2_selfexpression_compulsive', question: 'Do you over-broadcast — constantly sharing opinions, creative output, or personal narrative — needing an audience to validate that your expression is real?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SELF-EXPRESSION', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_selfexpression_avoidant', question: 'Do you silence yourself — withholding opinions, shelving creative work, or staying invisible — to avoid judgment or the risk of being truly seen?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SELF-EXPRESSION', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_selfexpression_partner', question: 'Have relationships become strained because others feel you dominate every space with your self-expression, or that they cannot reach you because you never share yourself?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SELF-EXPRESSION', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_selfexpression_need_chain', question: 'When self-expression feels impossible or compulsive, what sits underneath that?', type: 'need_chain', options: [
      { text: 'My voice was dismissed or punished when I was young', mapsTo: { need: 'acceptance', deeper: ['safety', 'to see and be seen'] } },
      { text: 'I only feel real when I am being seen or heard', mapsTo: { need: 'to see and be seen', deeper: ['to matter', 'presence'] } },
      { text: 'I have so much unexpressed inside me it creates pressure', mapsTo: { need: 'authenticity', deeper: ['freedom', 'joy'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'SELF-EXPRESSION', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_selfexpression_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'SELF-EXPRESSION', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'TO MATTER': [
    { id: 'p2_tomatter_compulsive', question: 'Do you insert yourself into situations, take on high-stakes roles, or over-contribute in order to prove to yourself and others that your existence is significant?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TO MATTER', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_tomatter_avoidant', question: 'Do you shrink — minimising your impact, avoiding responsibility, or staying beneath the radar — to protect yourself from the risk of trying and still not mattering?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TO MATTER', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_tomatter_partner', question: 'Have relationships become strained because others feel overshadowed by your need to be significant, or disconnected from someone who seems to barely occupy their own life?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TO MATTER', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_tomatter_need_chain', question: 'When you feel like you do not matter, what might be underneath that feeling?', type: 'need_chain', options: [
      { text: 'I was made to feel invisible or replaceable as a child', mapsTo: { need: 'to see and be seen', deeper: ['belonging', 'love'] } },
      { text: 'My worth was always tied to performance or usefulness', mapsTo: { need: 'self-respect', deeper: ['acceptance', 'love'] } },
      { text: 'I fear that if I stopped performing, no one would stay', mapsTo: { need: 'belonging', deeper: ['being wanted', 'trust'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'TO MATTER', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_tomatter_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'TO MATTER', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'CLARITY': [
    { id: 'p2_clarity_compulsive', question: 'Do you obsessively research, analyse, or seek information — needing to understand everything before you can act — to the point where thinking replaces living?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLARITY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_clarity_avoidant', question: 'Do you avoid thinking things through, resist feedback, or stay deliberately vague — as though clarity might reveal something you cannot face?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLARITY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_clarity_partner', question: 'Have relationships become strained because others find your need to analyse everything suffocating, or are frustrated by your resistance to honest reflection?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLARITY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_clarity_need_chain', question: 'When you lack clarity — or when you seek it obsessively — what might be underneath that?', type: 'need_chain', options: [
      { text: 'Confusion was dangerous in my early life — I had to stay alert', mapsTo: { need: 'safety', deeper: ['security', 'consistency'] } },
      { text: 'If I understand everything, maybe I can prevent pain', mapsTo: { need: 'control', deeper: ['safety', 'order'] } },
      { text: 'I use analysis to avoid feeling', mapsTo: { need: 'presence', deeper: ['mourning', 'ease'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'CLARITY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_clarity_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CLARITY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'GROWTH': [
    { id: 'p2_growth_compulsive', question: 'Do you pursue constant self-improvement — courses, frameworks, habits, challenges — as a way to fix something fundamentally wrong with who you are rather than genuine curiosity?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'GROWTH', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_growth_avoidant', question: 'Do you stagnate — avoiding challenges, dismissing opportunities to develop — because failure or change feels more threatening than the discomfort of staying stuck?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'GROWTH', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_growth_partner', question: 'Have relationships become strained because your obsession with growth makes others feel inadequate, or because your stagnation makes others feel they are carrying you?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'GROWTH', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_growth_need_chain', question: 'When growth feels compulsive or impossible, what might be underneath that?', type: 'need_chain', options: [
      { text: 'I believe I am fundamentally not enough as I am', mapsTo: { need: 'self-respect', deeper: ['acceptance', 'compassion'] } },
      { text: 'Change feels dangerous or like a betrayal of who I am', mapsTo: { need: 'stability', deeper: ['safety', 'identity'] } },
      { text: 'I am running from something rather than growing toward something', mapsTo: { need: 'mourning', deeper: ['presence', 'ease'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'GROWTH', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_growth_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'GROWTH', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ],

  'CREATIVITY': [
    { id: 'p2_creativity_compulsive', question: 'Do you throw yourself into creative output obsessively — projects, ideas, making — as a way to feel alive or worthy, but find it never quite fills the need it promises to fill?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CREATIVITY', sourcing: 'compulsive', indicator: 'compulsive_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_creativity_avoidant', question: 'Do you block, procrastinate, or abandon creative work — self-censoring ideas before they reach the world — because making something real means it can be judged?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CREATIVITY', sourcing: 'avoidant', indicator: 'avoidant_sourcing' }, category: 'loop_deep_dive' },
    { id: 'p2_creativity_partner', question: 'Have relationships become strained because your creative world consumes you and leaves others out, or because your creative block makes you feel hollow and hard to reach?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CREATIVITY', indicator: 'partner_consequence' }, category: 'loop_deep_dive' },
    { id: 'p2_creativity_need_chain', question: 'When creativity feels blocked or all-consuming, what might be underneath that?', type: 'need_chain', options: [
      { text: 'My creative expression was dismissed or ridiculed when I was young', mapsTo: { need: 'acceptance', deeper: ['self-expression', 'safety'] } },
      { text: 'Creating is the only time I feel fully real', mapsTo: { need: 'presence', deeper: ['authenticity', 'joy'] } },
      { text: 'I am afraid the work is not good enough and never will be', mapsTo: { need: 'self-respect', deeper: ['competence', 'approval'] } },
      { text: 'I do not know', mapsTo: { need: 'clarity', deeper: ['awareness', 'presence'] } }
    ], mapsTo: { loop: 'CREATIVITY', indicator: 'need_chain' }, category: 'loop_deep_dive' },
    { id: 'p2_creativity_historical', question: 'Can you trace this pattern back to childhood or early experiences?', type: 'scaled', scale: { min: 1, max: 7 }, mapsTo: { loop: 'CREATIVITY', indicator: 'historical_pattern' }, category: 'loop_deep_dive' }
  ]
};

// Phase 3: Causal Need Chain Mapping (3-5 questions)
// Purpose: Distinguish between circumstantial need cascades and true dependency loops
export const PHASE_3_QUESTIONS = [
  {
    id: 'p3_need_chain_1',
    question: 'You mentioned feeling [SURFACE_NEED]. What might be underneath that feeling?',
    type: 'need_chain',
    dynamic: true, // Will be populated with identified surface need
    mapsTo: { category: 'need_chain_mapping', depth: 1 },
    category: 'need_chain'
  },
  {
    id: 'p3_need_chain_2',
    question: 'And what might be underneath [DEEPER_NEED]?',
    type: 'need_chain',
    dynamic: true, // Will be populated with previous answer
    mapsTo: { category: 'need_chain_mapping', depth: 2 },
    category: 'need_chain'
  },
  {
    id: 'p3_need_chain_3',
    question: 'What might be underneath [DEEPER_NEED]?',
    type: 'need_chain',
    dynamic: true, // Will be populated with previous answer
    mapsTo: { category: 'need_chain_mapping', depth: 3 },
    category: 'need_chain'
  },
  {
    id: 'p3_need_chain_4',
    question: 'What might be underneath [DEEPER_NEED]?',
    type: 'need_chain',
    dynamic: true, // Will be populated with previous answer
    mapsTo: { category: 'need_chain_mapping', depth: 4 },
    category: 'need_chain'
  },
  {
    id: 'p3_loop_vs_cascade',
    question: 'Does this pattern feel like a recurring cycle that happens across different relationships and situations, or more like a temporary response to current circumstances?',
    type: 'scenario',
    options: [
      {
        text: 'This is a recurring pattern across different relationships and situations',
        mapsTo: { patternType: 'dependency_loop', confidence: 'high' }
      },
      {
        text: 'This feels more like a temporary response to current circumstances',
        mapsTo: { patternType: 'need_cascade', confidence: 'low' }
      },
      {
        text: 'I\'m not sure',
        mapsTo: { patternType: 'uncertain', confidence: 'medium' }
      }
    ],
    mapsTo: { category: 'pattern_validation' },
    category: 'need_chain'
  }
];

// Phase 4: Validation & Prioritization (2-3 questions)
export const PHASE_4_QUESTIONS = [
  {
    id: 'p4_resistance',
    question: 'When you imagine the opposite of your identified pattern, what do you feel?',
    type: 'scenario',
    options: [
      {
        text: 'Cynical doubt - "This won\'t work, nothing ever changes"',
        mapsTo: { resistanceType: 'cynical_doubt', loops: ['ALL'] }
      },
      {
        text: 'Skeptical doubt - "Maybe this could work, but I\'m not sure"',
        mapsTo: { resistanceType: 'skeptical_doubt', loops: ['ALL'] }
      },
      {
        text: 'External blame - "It\'s not my fault, others need to change"',
        mapsTo: { resistanceType: 'external_blame', loops: ['ALL'] }
      },
      {
        text: 'Harsh self-attack - "I\'m broken, I can\'t do this"',
        mapsTo: { resistanceType: 'harsh_self_attack', loops: ['ALL'] }
      },
      {
        text: 'Curiosity and openness - "I\'m willing to explore this"',
        mapsTo: { resistanceType: 'open', loops: [] }
      }
    ],
    mapsTo: { category: 'resistance_check' },
    category: 'validation'
  },
  {
    id: 'p4_impact_severity',
    question: 'How significantly does this pattern affect your daily life?',
    type: 'scaled',
    scale: { min: 1, max: 7, labels: { 1: 'Mild interference', 4: 'Moderate disruption', 7: 'Severe limitation' } },
    mapsTo: { category: 'impact_severity' },
    category: 'validation'
  },
  {
    id: 'p4_readiness',
    question: 'Are you willing to engage with experiences that contradict this pattern?',
    type: 'scaled',
    scale: { min: 1, max: 7, labels: { 1: 'Not at all', 4: 'Somewhat', 7: 'Absolutely' } },
    mapsTo: { category: 'readiness_assessment' },
    category: 'validation'
  }
];

