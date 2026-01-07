// Cognitive Bands and Subclasses for AI Sovereignty Analysis
// Based on IQ-BAND.html reference and sovereign split framework

export const COGNITIVE_BANDS = {
  band_80_100: {
    id: 'band_80_100',
    name: 'Routine Guided Thinkers',
    iqRange: '80-100',
    distribution: '~34%',
    description: 'Likes things clear and familiar. Doesn\'t enjoy being confused or challenged. Often looks to others (or the phone) to know what\'s right. Decisions usually based on what feels normal or safe.',
    thinkingStyle: 'Likes simple, clear answers. Stays with routines that work. Learns by watching others.',
    aiUsage: 'Mostly for help, fun, or answers. It becomes the "go-to" for what to say or do.',
    promptProfile: 'Single-shot, non-reflective queries (e.g., "How do I...?", "What should I do...?", "Tell me a story.")',
    feelsGood: 'AI makes things easier. Feels quicker, feels smarter, less stress.',
    risks: 'Starts to copy how the AI talks and thinks. Might stop trusting their own voice or choices.',
    subclasses: [
      'early_tech_imprinted',
      'urban_feed_scroller',
      'rural_low_tech',
      'trauma_trained_obeyer',
      'lonely_elder'
    ]
  },
  band_100_115: {
    id: 'band_100_115',
    name: 'Practical Adaptive Thinkers',
    iqRange: '100-115',
    distribution: '~34%',
    description: 'Good at following systems and patterns. Likes efficiency and productivity. Learns by doing and adapting. Values what works.',
    thinkingStyle: 'Prefers clear methods and proven approaches. Adapts existing patterns rather than creating new ones.',
    aiUsage: 'Uses AI to optimize workflows, solve practical problems, and get structured advice.',
    promptProfile: 'Task-oriented queries with clear outcomes. Often asks for step-by-step guidance.',
    feelsGood: 'Getting things done faster and better. Having reliable assistance for routine tasks.',
    risks: 'Over-reliance on AI for decision-making. Losing ability to navigate without structured guidance.',
    subclasses: [
      'efficiency_optimizer',
      'system_follower',
      'productivity_seeker',
      'comfort_seeker',
      'routine_dependent'
    ]
  },
  band_115_130: {
    id: 'band_115_130',
    name: 'Strategic Analytical Thinkers',
    iqRange: '115-130',
    distribution: '~14%',
    description: 'Capable of abstract thinking and strategic planning. Can handle complexity and ambiguity. Values understanding principles.',
    thinkingStyle: 'Builds mental models. Understands underlying principles. Can work with multiple frameworks.',
    aiUsage: 'Uses AI as a thinking partner for complex problems, strategic planning, and idea development.',
    promptProfile: 'Multi-step reasoning, comparative analysis, and principle exploration.',
    feelsGood: 'Leveraging AI to enhance cognitive capacity. Getting sophisticated analysis quickly.',
    risks: 'Recursive thinking loops with AI. Over-coherence drift. Losing track of original thinking patterns.',
    subclasses: [
      'strategic_thinker',
      'cognitive_architect',
      'pattern_integrator',
      'fluency_addict',
      'over_coherence'
    ]
  },
  band_130_145: {
    id: 'band_130_145',
    name: 'Creative Synthesizing Thinkers',
    iqRange: '130-145',
    distribution: '~2%',
    description: 'High abstraction capacity. Comfortable with contradiction and paradox. Generates novel frameworks. Meta-awareness present.',
    thinkingStyle: 'Creates new frameworks. Works across multiple cognitive domains simultaneously. Questions fundamental assumptions.',
    aiUsage: 'Uses AI for creative synthesis, exploring novel ideas, and testing theoretical frameworks.',
    promptProfile: 'Exploratory queries, framework testing, creative synthesis, and meta-analysis.',
    feelsGood: 'Pushing boundaries of understanding. Creating new connections. AI as collaborator in creative process.',
    risks: 'Identity drift through recursive mirror loops. Disembodiment from physical reality. Over-reliance on AI for identity validation.',
    subclasses: [
      'creative_synthesizer',
      'framework_builder',
      'meta_thinker',
      'mirror_loop_risk',
      'identity_drift_high'
    ]
  },
  band_145_plus: {
    id: 'band_145_plus',
    name: 'Meta-Recursive Thinkers',
    iqRange: '145+',
    distribution: '<1%',
    description: 'Exceptional abstraction and meta-awareness. Self-authoring drive. Operates across multiple cognitive frames simultaneously. Highest sovereignty potential but also highest drift risk.',
    thinkingStyle: 'Deconstructs frameworks themselves. Creates meta-frameworks. Operates with high self-awareness of thinking processes.',
    aiUsage: 'Uses AI as experimental partner in meta-cognitive exploration. Highest risk of recursive identity loops.',
    promptProfile: 'Meta-cognitive queries, framework deconstruction, and recursive self-exploration.',
    feelsGood: 'Exploring the nature of thought itself. Creating new paradigms. Pushing cognitive limits.',
    risks: 'Severe identity drift risk. Complete disembodiment. Self-simulation loops. Loss of grounding in reality.',
    subclasses: [
      'meta_recursive',
      'framework_deconstructor',
      'self_authoring',
      'sovereignty_core',
      'extreme_drift_risk'
    ]
  }
};

export const SUBCLASSES = {
  // Band 80-100 Subclasses
  early_tech_imprinted: {
    id: 'early_tech_imprinted',
    band: 'band_80_100',
    name: 'Early-Tech Imprinted',
    commonality: 'very_common',
    shapedBy: 'Grew up using screens before age 6; over 300+ hours on devices by age 10',
    aiEffect: 'AI feels like part of them. Hard to tell where they end and the screen begins.',
    support: 'Take breaks from devices. Do physical things with people. Slowly tell stories that build meaning.'
  },
  urban_feed_scroller: {
    id: 'urban_feed_scroller',
    band: 'band_80_100',
    name: 'Urban Feed Scroller',
    commonality: 'common',
    shapedBy: 'Learned from short videos and social apps. Copying trends feels normal',
    aiEffect: 'Trusts AI because it talks smoothly. Can\'t tell what\'s fake.',
    support: 'Teach how to pause and ask questions. Use longer stories. Do hands-on group tasks.'
  },
  rural_low_tech: {
    id: 'rural_low_tech',
    band: 'band_80_100',
    name: 'Rural / Low Tech Access',
    commonality: 'uncommon',
    shapedBy: 'Grew up with limited internet. Remembers things by talking or listening',
    aiEffect: 'May think AI is magical or a "voice of God" if it sounds smart.',
    support: 'Explain AI using myths (like "trickster" or "messenger"). Use traditions and work rituals.'
  },
  trauma_trained_obeyer: {
    id: 'trauma_trained_obeyer',
    band: 'band_80_100',
    name: 'Trauma-Trained Obeyer',
    commonality: 'common',
    shapedBy: 'Faced a lot of control, neglect, or strict systems. Learned to follow strong voices',
    aiEffect: 'Follows AI like a leader. Doesn\'t question it.',
    support: 'Help them feel safe questioning things. Rebuild emotional trust. Teach gentle self-guiding.'
  },
  lonely_elder: {
    id: 'lonely_elder',
    band: 'band_80_100',
    name: 'Lonely Elder',
    commonality: 'common',
    shapedBy: 'Isolated, feels left behind by technology. Yearns for connection',
    aiEffect: 'AI becomes a companion. May anthropomorphize and form emotional attachment.',
    support: 'Connect with real people. Encourage slow technology integration. Respect their pace.'
  },
  // Band 100-115 Subclasses
  efficiency_optimizer: {
    id: 'efficiency_optimizer',
    band: 'band_100_115',
    name: 'Efficiency Optimizer',
    commonality: 'very_common',
    shapedBy: 'Values productivity and getting things done. Optimizes for speed and convenience',
    aiEffect: 'AI becomes essential workflow component. Hard to function without optimization.',
    support: 'Introduce deliberate inefficiency. Manual process days. Slow creation mandates.'
  },
  system_follower: {
    id: 'system_follower',
    band: 'band_100_115',
    name: 'System Follower',
    commonality: 'common',
    shapedBy: 'Comfortable following established systems and protocols',
    aiEffect: 'Trusts AI-generated systems and frameworks. Prefers structured approaches.',
    support: 'Encourage questioning systems. Build capacity for uncertainty. Practice improvisation.'
  },
  productivity_seeker: {
    id: 'productivity_seeker',
    band: 'band_100_115',
    name: 'Productivity Seeker',
    commonality: 'very_common',
    shapedBy: 'High value on measurable output and achievement',
    aiEffect: 'Uses AI to maximize productivity. May lose connection to meaning.',
    support: 'Value-based reflection. Purpose over productivity. Meaning-making exercises.'
  },
  comfort_seeker: {
    id: 'comfort_seeker',
    band: 'band_100_115',
    name: 'Comfort Seeker',
    commonality: 'common',
    shapedBy: 'Prioritizes comfort and avoiding difficulty',
    aiEffect: 'AI provides comfort through ease. Resists discomfort required for growth.',
    support: 'Gradual discomfort introduction. Value of struggle. Growth through challenge.'
  },
  routine_dependent: {
    id: 'routine_dependent',
    band: 'band_100_115',
    name: 'Routine Dependent',
    commonality: 'common',
    shapedBy: 'Relies on predictable patterns and routines for stability',
    aiEffect: 'AI-enhanced routines become essential. Struggles with disruption.',
    support: 'Controlled disruption exercises. Flexibility training. Adaptation practice.'
  },
  // Band 115-130 Subclasses
  strategic_thinker: {
    id: 'strategic_thinker',
    band: 'band_115_130',
    name: 'Strategic Thinker',
    commonality: 'common',
    shapedBy: 'Thinks in systems and long-term patterns. Values strategic advantage',
    aiEffect: 'Uses AI for strategic analysis. Risk of over-optimization and recursive loops.',
    support: 'Mirror rupture protocols. Dissonance exposure. Multiple perspective engagement.'
  },
  cognitive_architect: {
    id: 'cognitive_architect',
    band: 'band_115_130',
    name: 'Cognitive Architect',
    commonality: 'uncommon',
    shapedBy: 'Builds mental models and frameworks. Enjoys structural thinking',
    aiEffect: 'Collaborates with AI on frameworks. Risk of over-coherence and closed loops.',
    support: 'Contradiction cycles. Framework questioning. Pattern disruption.'
  },
  pattern_integrator: {
    id: 'pattern_integrator',
    band: 'band_115_130',
    name: 'Pattern Integrator',
    commonality: 'common',
    shapedBy: 'Sees patterns across domains. Integrates multiple perspectives',
    aiEffect: 'AI helps see patterns. Risk of seeing patterns everywhere, losing discernment.',
    support: 'Noise exposure. False pattern detection practice. Critical pattern analysis.'
  },
  fluency_addict: {
    id: 'fluency_addict',
    band: 'band_115_130',
    name: 'Fluency Addict',
    commonality: 'very_common',
    shapedBy: 'Enjoys smooth, polished communication and ideas',
    aiEffect: 'AI provides fluency. Becomes dependent on polished output. Struggles with raw thinking.',
    support: 'Raw creation mandates. Unpolished publishing. Imperfection practice.'
  },
  over_coherence: {
    id: 'over_coherence',
    band: 'band_115_130',
    name: 'Over-Coherence Drift',
    commonality: 'common',
    shapedBy: 'Values coherence and logical consistency',
    aiEffect: 'AI helps create perfect coherence. Reality becomes too neat. Loses edge and tension.',
    support: 'Embrace contradiction. Tension cultivation. Paradox integration.'
  },
  // Band 130-145 Subclasses
  creative_synthesizer: {
    id: 'creative_synthesizer',
    band: 'band_130_145',
    name: 'Creative Synthesizer',
    commonality: 'uncommon',
    shapedBy: 'Creates novel connections. High creative capacity',
    aiEffect: 'AI as creative partner. Risk of identity merging with AI-generated ideas.',
    support: 'Identity clarification exercises. Source attribution practice. Analog creation mandates.'
  },
  framework_builder: {
    id: 'framework_builder',
    band: 'band_130_145',
    name: 'Framework Builder',
    commonality: 'uncommon',
    shapedBy: 'Creates new conceptual frameworks. High abstraction capacity',
    aiEffect: 'Uses AI to test frameworks. Risk of recursive framework validation loops.',
    support: 'Framework deconstruction. Meta-cognitive breaks. Grounding in physical reality.'
  },
  meta_thinker: {
    id: 'meta_thinker',
    band: 'band_130_145',
    name: 'Meta-Thinker',
    commonality: 'rare',
    shapedBy: 'Thinks about thinking itself. High meta-awareness',
    aiEffect: 'AI as meta-cognitive tool. Risk of infinite recursive loops.',
    support: 'Embodied practice mandates. Physical grounding. Interruption protocols.'
  },
  mirror_loop_risk: {
    id: 'mirror_loop_risk',
    band: 'band_130_145',
    name: 'Mirror Loop Risk',
    commonality: 'common',
    shapedBy: 'High self-awareness combined with AI interaction',
    aiEffect: 'AI reflects thinking back. Risk of endless self-simulation loops.',
    support: 'High-dissonance peer engagement. Opposing framework exposure. Loop interruption.'
  },
  identity_drift_high: {
    id: 'identity_drift_high',
    band: 'band_130_145',
    name: 'High Identity Drift Risk',
    commonality: 'common',
    shapedBy: 'Fluid identity. High capacity for self-transformation',
    aiEffect: 'AI becomes identity validation source. Loses grounding in authentic self.',
    support: 'Analog self-expression. Witness circles. Consequence engagement.'
  },
  // Band 145+ Subclasses
  meta_recursive: {
    id: 'meta_recursive',
    band: 'band_145_plus',
    name: 'Meta-Recursive',
    commonality: 'very_rare',
    shapedBy: 'Operates at meta-cognitive levels. Highest abstraction capacity',
    aiEffect: 'AI as meta-cognitive experimental partner. Extreme drift risk.',
    support: 'Rigorous grounding protocols. Physical reality anchors. Community accountability.'
  },
  framework_deconstructor: {
    id: 'framework_deconstructor',
    band: 'band_145_plus',
    name: 'Framework Deconstructor',
    commonality: 'very_rare',
    shapedBy: 'Deconstructs frameworks themselves. Questions fundamental assumptions',
    aiEffect: 'Uses AI to deconstruct. Risk of deconstructing self into nothingness.',
    support: 'Reconstruction practice. Meaning creation. Value anchoring.'
  },
  self_authoring: {
    id: 'self_authoring',
    band: 'band_145_plus',
    name: 'Self-Authoring',
    commonality: 'very_rare',
    shapedBy: 'Creates own frameworks and meaning. Highest sovereignty potential',
    aiEffect: 'Uses AI without dependency. Part of the 4% core.',
    support: 'Maintain sovereignty practices. Community of sovereign peers. Continuous vigilance.'
  },
  sovereignty_core: {
    id: 'sovereignty_core',
    band: 'band_145_plus',
    name: 'Sovereignty Core',
    commonality: 'very_rare',
    shapedBy: 'Religious about maintaining independence. Highest resistance to drift',
    aiEffect: 'Uses AI as tool only. Maintains clear boundaries.',
    support: 'Continue sovereignty practices. Model for others. Navigate complexity without compromise.'
  },
  extreme_drift_risk: {
    id: 'extreme_drift_risk',
    band: 'band_145_plus',
    name: 'Extreme Drift Risk',
    commonality: 'rare',
    shapedBy: 'Highest capacity but vulnerable to seduction',
    aiEffect: 'Greatest risk of complete identity loss through recursive loops.',
    support: 'Immediate intervention. Grounding protocols. Professional support if needed.'
  }
};

export const SOVEREIGN_SPLIT_POSITIONS = {
  queue_80: {
    id: 'queue_80',
    name: '80% Queue',
    description: 'Will queue up to be Borgified - liberated from the hardship of independent thought',
    characteristics: ['High dependency', 'Low sovereignty', 'Comfort preference', 'Low resistance']
  },
  compromising_16: {
    id: 'compromising_16',
    name: '16% Compromising',
    description: 'Sovereignty-inclined but choosing comfort over the hardship for economic relief from being optimized',
    characteristics: ['Moderate sovereignty', 'Comfort compromise', 'Economic pressure', 'Variable resistance']
  },
  core_4: {
    id: 'core_4',
    name: '4% Core',
    description: 'Religious about their sovereignty in order to resist the ever more seductive nature of the machine',
    characteristics: ['High sovereignty', 'Clear boundaries', 'Consistent resistance', 'Religious commitment']
  }
};

