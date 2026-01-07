// Archetype Taxonomy - Extracted from redpill-spread.html
// Gender-neutral behavioral patterns mapped to social roles and psychological functions

export const ARCHETYPES = {
  // ALPHA GROUP - Dominant, Leadership-Oriented
  alpha: {
    id: 'alpha',
    name: 'Alpha',
    socialRole: 'Dominant, Charismatic Leader',
    description: 'Naturally takes leadership roles, commands respect through presence and competence. Comfortable with authority and responsibility.',
    behavioralTraits: ['leadership', 'charisma', 'confidence', 'decisiveness', 'authority'],
    motivations: ['recognition', 'achievement', 'influence', 'control'],
    stressResponse: 'Takes charge, pushes harder, may become controlling',
    growthEdge: 'Learning to delegate, developing emotional intelligence',
    subtypes: ['alpha_xi', 'alpha_rho', 'dark_alpha'],
    // Metadata for report explanations
    jungianEquivalent: 'King (Mature), Warrior (Assertive)',
    vedicEquivalent: 'Raja Dharma (Ruler/Protector), Artha (Power)',
    greekPantheon: 'Zeus (King, Authority), Ares (Aggressive Leader)',
    tarotCard: 'The Emperor',
    socialProportion: 2.0,
    explanation: 'The Alpha archetype represents natural leadership and authority. In psychological terms, this aligns with mature masculine energy that takes responsibility and commands respect through competence rather than force. The term "Alpha" in this context refers to social positioning and behavioral patterns, not biological dominance.'
  },
  alpha_xi: {
    id: 'alpha_xi',
    name: 'Alpha-Xi',
    socialRole: 'Resilient, Courageous, Protector',
    description: 'Warrior archetype focused on protection and defense. Values honor, loyalty, and courage. Stands up for others.',
    behavioralTraits: ['courage', 'loyalty', 'protection', 'resilience', 'honor'],
    motivations: ['protection', 'justice', 'honor', 'service'],
    stressResponse: 'Fights harder, defends positions, may become rigid',
    growthEdge: 'Developing flexibility, learning when to yield',
    parentType: 'alpha'
  },
  alpha_rho: {
    id: 'alpha_rho',
    name: 'Alpha-Rho',
    socialRole: 'Just, Fair, Lawmaker',
    description: 'Focused on justice, fairness, and creating order. Values rules and structure. Natural judge and mediator.',
    behavioralTraits: ['justice', 'fairness', 'order', 'judgment', 'structure'],
    motivations: ['justice', 'order', 'fairness', 'righteousness'],
    stressResponse: 'Becomes more rigid, enforces rules strictly',
    growthEdge: 'Developing compassion, understanding context',
    parentType: 'alpha'
  },
  dark_alpha: {
    id: 'dark_alpha',
    name: 'Dark Alpha',
    socialRole: 'Abusive, Tyrannical, Dominant',
    description: 'Shadow expression of Alpha - uses power destructively. Controlling, abusive, seeks dominance through fear.',
    behavioralTraits: ['tyranny', 'abuse', 'control', 'dominance', 'intimidation'],
    motivations: ['power', 'control', 'fear', 'dominance'],
    stressResponse: 'Becomes more abusive, increases control',
    growthEdge: 'Healing power wounds, developing healthy authority',
    parentType: 'alpha',
    isShadow: true
  },

  // BETA GROUP - Supportive, Reliable
  beta: {
    id: 'beta',
    name: 'Beta',
    socialRole: 'Reliable, Supportive but Submissive',
    description: 'Supportive team player who values harmony and cooperation. Reliable, dutiful, but may lack assertiveness.',
    behavioralTraits: ['supportive', 'reliable', 'cooperative', 'dutiful', 'harmony'],
    motivations: ['belonging', 'approval', 'stability', 'service'],
    stressResponse: 'Seeks support, becomes more passive, avoids conflict',
    growthEdge: 'Developing assertiveness, setting boundaries',
    subtypes: ['beta_iota', 'beta_nu', 'beta_manipulator', 'beta_kappa'],
    explanation: 'The Beta archetype represents supportive, reliable behavioral patterns focused on harmony and cooperation. The term "Beta" refers to social positioning and behavioral tendencies toward support and service, not a ranking of value or worth.'
  },
  beta_iota: {
    id: 'beta_iota',
    name: 'Beta-Iota',
    socialRole: 'Gentle, Supportive Nurturer, Pure, Innocent',
    description: 'Innocent, gentle, nurturing presence. Values purity and simplicity. May be naive but genuinely caring.',
    behavioralTraits: ['gentleness', 'innocence', 'nurturing', 'purity', 'simplicity'],
    motivations: ['harmony', 'care', 'purity', 'connection'],
    stressResponse: 'Withdraws, becomes more passive, seeks safety',
    growthEdge: 'Developing wisdom, learning healthy boundaries',
    parentType: 'beta'
  },
  beta_nu: {
    id: 'beta_nu',
    name: 'Beta-Nu',
    socialRole: 'Traditionalist, Dutiful, Settler',
    description: 'Values tradition, duty, and stability. Committed to long-term relationships and established structures.',
    behavioralTraits: ['tradition', 'duty', 'loyalty', 'stability', 'commitment'],
    motivations: ['stability', 'tradition', 'security', 'belonging'],
    stressResponse: 'Clings to tradition, becomes more rigid',
    growthEdge: 'Embracing change, developing flexibility',
    parentType: 'beta'
  },
  beta_manipulator: {
    id: 'beta_manipulator',
    name: 'Beta-Manipulator',
    socialRole: 'Hypergamous, Deceptive, Chaotic',
    description: 'Uses manipulation to gain resources or status. May appear supportive but operates from self-interest.',
    behavioralTraits: ['manipulation', 'deception', 'chaos', 'self-interest', 'resource-seeking'],
    motivations: ['resources', 'status', 'security', 'advantage'],
    stressResponse: 'Increases manipulation, becomes more deceptive',
    growthEdge: 'Developing authentic connection, honest communication',
    parentType: 'beta',
    isShadow: true
  },
  beta_kappa: {
    id: 'beta_kappa',
    name: 'Beta-Kappa',
    socialRole: 'Creator, Motherly, Controlling',
    description: 'Nurturing and creative, but may use care as a form of control. Motherly presence with controlling tendencies.',
    behavioralTraits: ['nurturing', 'creativity', 'control', 'mothering', 'care'],
    motivations: ['care', 'control', 'creation', 'nurturing'],
    stressResponse: 'Increases control, becomes more smothering',
    growthEdge: 'Releasing control, allowing autonomy',
    parentType: 'beta'
  },

  // GAMMA GROUP - Intellectual, Rebellious
  gamma: {
    id: 'gamma',
    name: 'Gamma',
    socialRole: 'Intellectual, Rebellious Outsider',
    description: 'Intellectual, independent thinker who questions norms. Values knowledge, freedom, and authenticity over social acceptance.',
    behavioralTraits: ['intellectual', 'rebellious', 'independent', 'questioning', 'authentic'],
    motivations: ['knowledge', 'freedom', 'authenticity', 'truth'],
    stressResponse: 'Withdraws, becomes more isolated, questions everything',
    growthEdge: 'Developing social skills, learning to connect',
    subtypes: ['gamma_nu', 'gamma_theta', 'gamma_pi', 'dark_gamma'],
    explanation: 'The Gamma archetype represents intellectual independence and questioning of social norms. The term "Gamma" refers to behavioral patterns of intellectual rebellion and outsider positioning, not a social hierarchy ranking. This archetype values knowledge, freedom, and authenticity over social acceptance.'
  },
  gamma_nu: {
    id: 'gamma_nu',
    name: 'Gamma-Nu',
    socialRole: 'Romantic, Devoted, Idealist',
    description: 'Romantic idealist who values deep connection and beauty. Devoted to ideals and relationships.',
    behavioralTraits: ['romantic', 'idealistic', 'devoted', 'beauty', 'passion'],
    motivations: ['love', 'beauty', 'ideals', 'connection'],
    stressResponse: 'Becomes more idealistic, may become disillusioned',
    growthEdge: 'Balancing ideals with reality, developing pragmatism',
    parentType: 'gamma'
  },
  gamma_theta: {
    id: 'gamma_theta',
    name: 'Gamma-Theta',
    socialRole: 'Mystic, Prophet, Divine Connection',
    description: 'Spiritually oriented, seeks mystical experiences and divine connection. May have prophetic or visionary qualities.',
    behavioralTraits: ['mystical', 'spiritual', 'visionary', 'prophetic', 'transcendent'],
    motivations: ['transcendence', 'wisdom', 'divine', 'enlightenment'],
    stressResponse: 'Withdraws into spiritual practice, becomes detached',
    growthEdge: 'Grounding spirituality, integrating with daily life',
    parentType: 'gamma'
  },
  gamma_pi: {
    id: 'gamma_pi',
    name: 'Gamma-Pi',
    socialRole: 'Fortunate, Opportunistic, Gambler',
    description: 'Opportunistic, takes calculated risks. Values luck, fortune, and seizing opportunities.',
    behavioralTraits: ['opportunistic', 'risky', 'fortunate', 'gambling', 'adventurous'],
    motivations: ['opportunity', 'fortune', 'risk', 'adventure'],
    stressResponse: 'Takes bigger risks, becomes more reckless',
    growthEdge: 'Developing stability, learning to plan',
    parentType: 'gamma'
  },
  dark_gamma: {
    id: 'dark_gamma',
    name: 'Dark Gamma',
    socialRole: 'Isolated, Detached, Nihilistic, Seer',
    description: 'Shadow expression of Gamma - isolated, nihilistic, sees truth but becomes consumed by it. May be prophetic but destructive.',
    behavioralTraits: ['isolation', 'nihilism', 'detachment', 'prophetic', 'destructive'],
    motivations: ['truth', 'isolation', 'nihilism', 'transcendence'],
    stressResponse: 'Becomes more isolated, deeper into nihilism',
    growthEdge: 'Finding meaning, reconnecting with life',
    parentType: 'gamma',
    isShadow: true
  },

  // DELTA GROUP - Hardworking, Practical
  delta: {
    id: 'delta',
    name: 'Delta',
    socialRole: 'Hardworking but Lacks Leadership',
    description: 'Hardworking, practical, reliable worker. Values duty, service, and practical accomplishment. May lack leadership drive.',
    behavioralTraits: ['hardworking', 'practical', 'reliable', 'dutiful', 'service'],
    motivations: ['duty', 'service', 'accomplishment', 'stability'],
    stressResponse: 'Works harder, becomes more dutiful, may burn out',
    growthEdge: 'Developing leadership, learning to delegate',
    subtypes: ['delta_mu', 'dark_delta'],
    explanation: 'The Delta archetype represents hardworking, practical behavioral patterns focused on duty and service. The term "Delta" refers to social positioning and behavioral tendencies toward practical work and reliability, not a ranking of value.'
  },
  delta_mu: {
    id: 'delta_mu',
    name: 'Delta-Mu',
    socialRole: 'Nurturing, Protective, Fatherly',
    description: 'Nurturing, protective presence. Fatherly qualities with focus on care and protection of others.',
    behavioralTraits: ['nurturing', 'protective', 'fatherly', 'caring', 'supportive'],
    motivations: ['care', 'protection', 'nurturing', 'family'],
    stressResponse: 'Becomes more protective, may become overbearing',
    growthEdge: 'Allowing independence, developing boundaries',
    parentType: 'delta'
  },
  dark_delta: {
    id: 'dark_delta',
    name: 'Dark Delta',
    socialRole: 'Sacrificing, Martyr, Passive',
    description: 'Shadow expression of Delta - sacrifices self excessively, becomes martyr. Passive, may resent service.',
    behavioralTraits: ['sacrifice', 'martyrdom', 'passivity', 'resentment', 'self-neglect'],
    motivations: ['service', 'sacrifice', 'approval', 'duty'],
    stressResponse: 'Increases sacrifice, becomes more resentful',
    growthEdge: 'Learning self-care, developing healthy boundaries',
    parentType: 'delta',
    isShadow: true
  },

  // SIGMA GROUP - Independent, Self-Sufficient
  sigma: {
    id: 'sigma',
    name: 'Sigma',
    socialRole: 'Lone Wolf, Self-Sufficient, Adaptable by own authority',
    description: 'Independent, self-sufficient, operates outside social hierarchies. Values autonomy and personal authority.',
    behavioralTraits: ['independent', 'self-sufficient', 'autonomous', 'adaptable', 'lone'],
    motivations: ['autonomy', 'freedom', 'independence', 'self-reliance'],
    stressResponse: 'Becomes more isolated, increases independence',
    growthEdge: 'Learning to connect, developing interdependence',
    subtypes: ['sigma_kappa', 'sigma_lambda', 'dark_sigma_zeta'],
    explanation: 'The Sigma archetype represents independent, self-sufficient behavioral patterns that operate outside traditional social hierarchies. The term "Sigma" refers to autonomous positioning and behavioral tendencies toward self-reliance, not a ranking system.'
  },
  sigma_kappa: {
    id: 'sigma_kappa',
    name: 'Sigma-Kappa',
    socialRole: 'Eccentric, Unpredictable Innovator, Political Schemer, Strategist',
    description: 'Strategic, innovative, operates through indirect influence. May be eccentric or unpredictable.',
    behavioralTraits: ['strategic', 'innovative', 'eccentric', 'unpredictable', 'scheming'],
    motivations: ['influence', 'innovation', 'strategy', 'autonomy'],
    stressResponse: 'Becomes more strategic, increases manipulation',
    growthEdge: 'Developing direct communication, authentic connection',
    parentType: 'sigma'
  },
  sigma_lambda: {
    id: 'sigma_lambda',
    name: 'Sigma-Lambda',
    socialRole: 'Creative, Artistic but detached, Solitary',
    description: 'Creative, artistic, but emotionally detached. Values beauty, expression, but maintains distance.',
    behavioralTraits: ['creative', 'artistic', 'detached', 'solitary', 'expressive'],
    motivations: ['beauty', 'expression', 'creativity', 'autonomy'],
    stressResponse: 'Withdraws into creativity, becomes more detached',
    growthEdge: 'Developing emotional connection, engaging with others',
    parentType: 'sigma'
  },
  dark_sigma_zeta: {
    id: 'dark_sigma_zeta',
    name: 'Dark Sigma-Zeta',
    socialRole: 'Anti-Establishment, Autonomous',
    description: 'Shadow expression of Sigma - anti-establishment, revolutionary. May be destructive in pursuit of autonomy.',
    behavioralTraits: ['anti-establishment', 'revolutionary', 'destructive', 'autonomous', 'rebellious'],
    motivations: ['revolution', 'destruction', 'autonomy', 'freedom'],
    stressResponse: 'Becomes more destructive, increases rebellion',
    growthEdge: 'Finding constructive expression, developing purpose',
    parentType: 'sigma',
    isShadow: true
  },

  // OMEGA GROUP - Social Reject, Passive
  omega: {
    id: 'omega',
    name: 'Omega',
    socialRole: 'Social Reject, Loner, Passive',
    description: 'Socially disconnected, passive, lacks social power. May be isolated or rejected by social groups.',
    behavioralTraits: ['passive', 'isolated', 'disconnected', 'loner', 'rejected'],
    motivations: ['acceptance', 'belonging', 'safety', 'avoidance'],
    stressResponse: 'Withdraws further, becomes more passive',
    growthEdge: 'Developing social skills, building confidence',
    subtypes: ['dark_omega'],
    explanation: 'The Omega archetype represents passive, socially disconnected behavioral patterns. The term "Omega" refers to social positioning and behavioral tendencies toward isolation or withdrawal, not a judgment of worth. This pattern may reflect current circumstances rather than fixed identity.'
  },
  dark_omega: {
    id: 'dark_omega',
    name: 'Dark Omega',
    socialRole: 'Destructive, Entropic, Consumptive',
    description: 'Shadow expression of Omega - destructive, entropic, consumes without creating. May be nihilistic or self-destructive.',
    behavioralTraits: ['destructive', 'entropic', 'consumptive', 'nihilistic', 'self-destructive'],
    motivations: ['destruction', 'consumption', 'chaos', 'nihilism'],
    stressResponse: 'Becomes more destructive, increases consumption',
    growthEdge: 'Finding purpose, developing creation over consumption',
    parentType: 'omega',
    isShadow: true
  },

  // PHI GROUP - Transcendent
  phi: {
    id: 'phi',
    name: 'Phi',
    socialRole: 'Fully Ascended, Beyond Society, Transcendent',
    description: 'Transcendent, operates beyond social hierarchies. Fully integrated, beyond typical archetypal patterns.',
    behavioralTraits: ['transcendent', 'integrated', 'beyond', 'ascended', 'enlightened'],
    motivations: ['transcendence', 'integration', 'enlightenment', 'service'],
    stressResponse: 'Maintains equanimity, responds with wisdom',
    growthEdge: 'Continuing integration, serving others',
    isRare: true,
    explanation: 'The Phi archetype represents transcendent, fully integrated behavioral patterns that operate beyond typical social hierarchies. The term "Phi" refers to a state of integration and transcendence, representing someone who has moved beyond typical archetypal patterns into a more integrated expression.'
  }
};

// Core archetype groups for Phase 1 identification
export const CORE_GROUPS = {
  alpha: ['alpha', 'alpha_xi', 'alpha_rho', 'dark_alpha'],
  beta: ['beta', 'beta_iota', 'beta_nu', 'beta_manipulator', 'beta_kappa'],
  gamma: ['gamma', 'gamma_nu', 'gamma_theta', 'gamma_pi', 'dark_gamma'],
  delta: ['delta', 'delta_mu', 'dark_delta'],
  sigma: ['sigma', 'sigma_kappa', 'sigma_lambda', 'dark_sigma_zeta'],
  omega: ['omega', 'dark_omega'],
  phi: ['phi']
};

// Gender-neutral mapping (archetypes apply regardless of gender)
export const GENDER_NEUTRAL_MAPPING = {
  // Male archetypes map to gender-neutral behavioral patterns
  'Alpha Male': 'alpha',
  'Alpha-Xi Male': 'alpha_xi',
  'Alpha-Rho Male': 'alpha_rho',
  'Dark Alpha Male': 'dark_alpha',
  'Beta Male': 'beta',
  'Beta-Iota Male': 'beta_iota',
  'Beta-Nu Male': 'beta_nu',
  'Beta-Manipulator Male': 'beta_manipulator',
  'Beta-Kappa Male': 'beta_kappa',
  'Gamma Male': 'gamma',
  'Gamma-Nu Male': 'gamma_nu',
  'Gamma-Theta Male': 'gamma_theta',
  'Gamma-Pi Male': 'gamma_pi',
  'Dark Gamma Male': 'dark_gamma',
  'Delta Male': 'delta',
  'Delta-Mu Male': 'delta_mu',
  'Sigma Male': 'sigma',
  'Sigma-Kappa Male': 'sigma_kappa',
  'Sigma-Lambda Male': 'sigma_lambda',
  'Dark Sigma-Zeta Male': 'dark_sigma_zeta',
  'Omega Male': 'omega',
  'Dark Omega Male': 'dark_omega',
  'Phi Male': 'phi',
  // Female archetypes map to same behavioral patterns
  'Alpha Female': 'alpha',
  'Alpha-Xi Female': 'alpha_xi',
  'Alpha-Unicorn Female': 'beta_iota', // Maps to Beta-Iota (innocent, ideal)
  'Alpha-Iota Female': 'beta_iota',
  'Dark Alpha Female': 'dark_alpha',
  'Beta Female': 'beta',
  'Beta-Nu Female': 'beta_nu',
  'Beta-Manipulator Female': 'beta_manipulator',
  'Beta-Kappa Female': 'beta_kappa',
  'Gamma Female': 'gamma',
  'Gamma-Theta Female': 'gamma_theta',
  'Gamma-Feminist Female': 'gamma',
  'Dark Gamma Female': 'dark_gamma',
  'Delta Female': 'delta',
  'Delta-Mu Female': 'delta_mu',
  'Dark Delta Female': 'dark_delta',
  'Sigma Female': 'sigma',
  'Sigma-Feminist Female': 'sigma',
  'Dark Sigma-Zeta Female': 'dark_sigma_zeta',
  'Omega Female': 'omega',
  'Dark Omega Female': 'dark_omega',
  'Phi Female': 'phi'
};

