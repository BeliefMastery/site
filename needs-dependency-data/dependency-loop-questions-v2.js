// Dependency Loop Questions - Version 2
// 4-Phase Questionnaire Architecture
// Based on Chapter 5: Needs and Beliefs from Belief Mastery
// STRICT PROPRIETARY VOCABULARY - MUST BE ADHERED TO

// 16 Primary Dependency Loops
export const DEPENDENCY_LOOPS = [
  'SPACE',
  'JOY',
  'BEING WANTED',
  'EQUALITY',
  'TO SEE AND BE SEEN',
  'EASE',
  'SECURITY',
  'BELONGING',
  'CONSIDERATION',
  'FLOW',
  'MOURNING',
  'APPROVAL',
  'REST',
  'CONTRIBUTION',
  'INDEPENDENCE',
  'STIMULATION/ADVENTURE'
];

// Phase 1: Initial Screening (5-7 questions)
// Purpose: Identify dominant presenting symptoms and behavioral patterns
export const PHASE_1_QUESTIONS = [
  {
    id: 'p1_relationship_pattern',
    question: 'In your closest relationships, which statement resonates most?',
    type: 'scenario',
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
    scale: { min: 1, max: 7, labels: { 1: 'Never', 4: 'Sometimes', 7: 'Constantly' } },
    mapsTo: { loops: ['ALL'], category: 'compulsion_aversion_preliminary' },
    category: 'compulsion_aversion'
  },
  {
    id: 'p1_attachment_style',
    question: 'In relationships, how do you typically respond when your partner seems distant?',
    type: 'scenario',
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

