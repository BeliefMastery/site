export const APTITUDE_DIMENSIONS = [
  {
    id: 'systems',
    name: 'Systems Thinking',
    description: 'Seeing dependencies, bottlenecks, and feedback loops across complex systems.'
  },
  {
    id: 'diagnostics',
    name: 'Predictive Diagnostics',
    description: 'Spotting failure patterns early and reading signals under uncertainty.'
  },
  {
    id: 'technical',
    name: 'Technical Fluency',
    description: 'Comfort with tools, software, and learning technical systems quickly.'
  },
  {
    id: 'field',
    name: 'Field Dexterity',
    description: 'Hands-on execution in real-world environments and unpredictable conditions.'
  },
  {
    id: 'organization',
    name: 'Organization & Process',
    description: 'Structuring workflows, sequencing tasks, and maintaining operational clarity.'
  },
  {
    id: 'management',
    name: 'Management & Coordination',
    description: 'Directing people, delegating tasks, and aligning teams to outcomes.'
  },
  {
    id: 'creativity',
    name: 'Creative Synthesis',
    description: 'Generating novel solutions, combining concepts, and adapting fast.'
  },
  {
    id: 'scientific',
    name: 'Scientific Reasoning',
    description: 'Testing assumptions, using evidence, and thinking in hypotheses.'
  },
  {
    id: 'eq',
    name: 'Emotional Intelligence (EQ)',
    description: 'Reading people, regulating emotions, and navigating interpersonal dynamics.'
  },
  {
    id: 'learning',
    name: 'Learning Velocity',
    description: 'Absorbing new skills fast and maintaining skill relevance over time.'
  },
  {
    id: 'fluid',
    name: 'Fluid Intelligence (Gf)',
    description: 'Inductive, deductive, and abstract reasoning for novel problems.'
  },
  {
    id: 'crystallized',
    name: 'Crystallized Ability (Gc)',
    description: 'Verbal comprehension, vocabulary, and applied knowledge.'
  },
  {
    id: 'quantitative',
    name: 'Quantitative Aptitude',
    description: 'Numerical reasoning, data interpretation, and statistical intuition.'
  },
  {
    id: 'spatial',
    name: 'Visuo-Spatial Ability',
    description: 'Spatial relations, mental rotation, and blueprint visualization.'
  },
  {
    id: 'processing',
    name: 'Processing Power',
    description: 'Perceptual speed, accuracy, and attention to detail under time pressure.'
  },
  {
    id: 'grit',
    name: 'Grit & Persistence',
    description: 'Sustaining effort toward long-term goals.'
  },
  {
    id: 'achievement',
    name: 'Achievement Motivation',
    description: 'Drive to meet or exceed standards of excellence.'
  },
  {
    id: 'self_regulation',
    name: 'Self-Regulation',
    description: 'Goal setting, time management, and focus discipline.'
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    description: 'Comfort with ambiguity and rapid change.'
  },
  {
    id: 'resilience',
    name: 'Resilience',
    description: 'Stress tolerance and recovery speed after setbacks.'
  },
  {
    id: 'situational_judgment',
    name: 'Situational Judgment',
    description: 'Decision quality, conflict handling, and ethical reasoning.'
  },
  {
    id: 'metacognition',
    name: 'Metacognition',
    description: 'Monitoring and adjusting one’s own problem-solving strategy.'
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking',
    description: 'Evaluating arguments, assumptions, and validity of conclusions.'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Aptitude',
    description: 'Understanding levers, gears, forces, and physical systems.'
  },
  {
    id: 'linguistic',
    name: 'Linguistic Aptitude',
    description: 'Capacity for language learning and precision in expression.'
  },
  {
    id: 'clerical',
    name: 'Clerical Aptitude',
    description: 'Accuracy in filing, coding, and administrative details.'
  },
  {
    id: 'artistic',
    name: 'Artistic Aptitude',
    description: 'Divergent production and original idea generation.'
  }
];

// Early-input options (archetype, age, qualification, industry)
export const ARCHETYPE_OPTIONS = [
  'Alpha Male', 'Alpha-Xi Male', 'Alpha-Rho Male', 'Dark Alpha Male',
  'Beta Male', 'Beta-Iota Male', 'Gamma Male', 'Gamma-Nu Male', 'Gamma-Theta Male', 'Gamma-Pi Male', 'Dark Gamma Male',
  'Delta Male', 'Delta-Mu Male', 'Sigma Male', 'Sigma-Kappa Male', 'Sigma-Lambda Male', 'Dark Sigma-Zeta Male',
  'Omega Male', 'Dark Omega Male', 'Phi Male'
];

export const QUALIFICATION_LEVELS = [
  { id: 'none', label: 'No formal qualification' },
  { id: 'certificate', label: 'Certificate or vocational training' },
  { id: 'associates', label: 'Associate degree' },
  { id: 'bachelors', label: 'Bachelor\'s degree' },
  { id: 'masters', label: 'Master\'s degree' },
  { id: 'doctorate', label: 'Doctorate (PhD, EdD, etc.)' },
  { id: 'md', label: 'Medical degree (MD, DO)' },
  { id: 'jd', label: 'Law degree (JD)' }
];

export const AGE_RANGES = [
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35-44', label: '35–44' },
  { id: '45-54', label: '45–54' },
  { id: '55-64', label: '55–64' },
  { id: '65+', label: '65+' }
];

export const INDUSTRY_OPTIONS = [
  { id: 'technology', label: 'Technology & Engineering' },
  { id: 'healthcare', label: 'Healthcare & Life Sciences' },
  { id: 'business', label: 'Business & Finance' },
  { id: 'education', label: 'Education & Research' },
  { id: 'creative', label: 'Creative & Media' },
  { id: 'legal', label: 'Legal & Public Service' },
  { id: 'trades', label: 'Trades & Technical Services' },
  { id: 'hospitality', label: 'Hospitality & Personal Services' },
  { id: 'sales', label: 'Sales & Customer Relations' },
  { id: 'agriculture', label: 'Agriculture & Environmental' },
  { id: 'other', label: 'Other / Mixed' }
];

// Qualification order for comparison (higher index = higher level)
export const QUALIFICATION_ORDER = ['none', 'certificate', 'associates', 'bachelors', 'masters', 'doctorate', 'md', 'jd'];

export const APTITUDE_ACUITY_DOMAINS = [
  {
    id: 'iq',
    name: 'IQ (Analytical)',
    description: 'Pattern recognition, logical inference, and structured problem‑solving.',
    biasPrompt: 'If a peer had to bet on who solves complex logic fastest, would they pick you?',
    sliderDescription: 'Rate your competence in logic, pattern recognition, and structured problem‑solving.'
  },
  {
    id: 'eq',
    name: 'EQ (Emotional)',
    description: 'Reading people, managing emotions, and de‑escalating conflict.',
    biasPrompt: 'If a team is tense, are you the person others trust to stabilize it?',
    sliderDescription: 'Rate your competence in reading people, managing emotions, and de‑escalating conflict.'
  },
  {
    id: 'sq',
    name: 'SQ (Strategic)',
    description: 'Seeing leverage, long‑range positioning, and second‑order consequences.',
    biasPrompt: 'Do others say you see the downstream effects before they do?',
    sliderDescription: 'Rate your competence in seeing leverage, long‑range positioning, and second‑order consequences.'
  },
  {
    id: 'aq',
    name: 'AQ (Adversity)',
    description: 'Resilience under pressure, chaos tolerance, and recovery speed.',
    biasPrompt: 'In a high‑stress moment, are you the one who stays functional?',
    sliderDescription: 'Rate your competence in staying functional under pressure and recovering from setbacks.'
  },
  {
    id: 'cq',
    name: 'CQ (Creative)',
    description: 'Novel synthesis, original solutions, and adaptive framing.',
    biasPrompt: 'When the group is stuck, do people look to you for a fresh angle?',
    sliderDescription: 'Rate your competence in generating novel ideas and original solutions.'
  },
  {
    id: 'tq',
    name: 'TQ (Technical)',
    description: 'Tool fluency, systems handling, and applied technical judgment.',
    biasPrompt: 'Are you the one people call first when tech breaks?',
    sliderDescription: 'Rate your competence with tools, systems, and technical troubleshooting.'
  },
  {
    id: 'oq',
    name: 'OQ (Operational)',
    description: 'Process discipline, sequencing, and reliable execution.',
    biasPrompt: 'Do others rely on you to make things run on time?',
    sliderDescription: 'Rate your competence in process discipline, sequencing, and reliable execution.'
  },
  {
    id: 'lq',
    name: 'LQ (Learning)',
    description: 'Skill uptake speed and ability to stay current.',
    biasPrompt: 'Are you regularly ahead of peers in adopting new methods?',
    sliderDescription: 'Rate your competence in picking up new skills quickly and staying current.'
  }
];

export const APTITUDE_QUESTIONS = [
  {
    id: 'q1',
    text: 'If someone watched how you work, they would say you notice how small changes ripple across a larger system.',
    weights: { systems: 1, diagnostics: 0.5 }
  },
  {
    id: 'q2',
    text: 'People close to your work would say you notice problems before they become obvious.',
    weights: { diagnostics: 1, systems: 0.5 }
  },
  {
    id: 'q3',
    text: 'Relative to peers, your learning curve for new tools appears fast.',
    weights: { technical: 1, learning: 0.5 }
  },
  {
    id: 'q4',
    text: 'In messy or unpredictable environments, you still maintain effective execution.',
    weights: { field: 1, organization: 0.3 }
  },
  {
    id: 'q5',
    text: 'Others would describe you as the person who creates routines or checklists to keep work clean.',
    weights: { organization: 1 }
  },
  {
    id: 'q6',
    text: 'Under pressure, others tend to follow your coordination rather than resist it.',
    weights: { management: 1, eq: 0.4 }
  },
  {
    id: 'q7',
    text: 'When a group is stuck, you are often the one who proposes a workable alternative.',
    weights: { creativity: 1, systems: 0.3 }
  },
  {
    id: 'q8',
    text: 'People would say you want evidence or testing before accepting a conclusion.',
    weights: { scientific: 1 }
  },
  {
    id: 'q9',
    text: 'Friends or coworkers tend to confide in you when emotions or conflict are involved.',
    weights: { eq: 1 }
  },
  {
    id: 'q10',
    text: 'Compared with peers, you are more consistent at keeping skills up to date.',
    weights: { learning: 1 }
  },
  {
    id: 'q11',
    text: 'When equipment breaks, you are usually the person asked to troubleshoot first.',
    weights: { diagnostics: 0.7, technical: 0.6 }
  },
  {
    id: 'q12',
    text: 'You tend to perform best in roles that blend hardware and software.',
    weights: { technical: 0.8, systems: 0.6 }
  },
  {
    id: 'q13',
    text: 'In team settings, you are more likely to be placed in a lead role than a follow role.',
    weights: { management: 0.8, organization: 0.4 }
  },
  {
    id: 'q14',
    text: 'In emergencies, others describe you as calm and structured rather than reactive.',
    weights: { organization: 0.7, field: 0.6, eq: 0.4 }
  },
  {
    id: 'q15',
    text: 'You are the type of person who collects new frameworks or mental models and applies them.',
    weights: { learning: 0.8, scientific: 0.4 }
  },
  {
    id: 'q16',
    text: 'Colleagues often say you can break complex tasks into a clean workflow.',
    weights: { organization: 0.8, systems: 0.5 }
  },
  {
    id: 'q17',
    text: 'People around you would say you read motives or hidden concerns accurately.',
    weights: { eq: 0.9, diagnostics: 0.3 }
  },
  {
    id: 'q18',
    text: 'Hands-on building, repair, or installation tends to energize you rather than drain you.',
    weights: { field: 1, technical: 0.4 }
  },
  {
    id: 'q19',
    text: 'You can shift from creative exploration to rigorous execution without losing momentum.',
    weights: { creativity: 0.7, organization: 0.5 }
  },
  {
    id: 'q20',
    text: 'Even when tasks shift, you tend to keep the long‑term goal steady.',
    weights: { management: 0.6, systems: 0.6 }
  },
  {
    id: 'q21',
    text: 'When given a novel problem, others notice you find the underlying rule quickly.',
    weights: { fluid: 1, diagnostics: 0.4 }
  },
  {
    id: 'q22',
    text: 'Your explanations are usually concise and use precise vocabulary.',
    weights: { crystallized: 0.8, linguistic: 0.4 }
  },
  {
    id: 'q23',
    text: 'When data is presented, you are quick to extract the trend without heavy calculation.',
    weights: { quantitative: 1, diagnostics: 0.3 }
  },
  {
    id: 'q24',
    text: 'People rely on you to interpret diagrams, layouts, or 3D relationships.',
    weights: { spatial: 1, mechanical: 0.3 }
  },
  {
    id: 'q25',
    text: 'In time‑pressured tasks, you remain accurate rather than rushed.',
    weights: { processing: 1, organization: 0.4 }
  },
  {
    id: 'q26',
    text: 'When a goal takes months, you are more likely to stay consistent than most.',
    weights: { grit: 1, self_regulation: 0.4 }
  },
  {
    id: 'q27',
    text: 'Peers would say you set higher standards for your own output.',
    weights: { achievement: 1 }
  },
  {
    id: 'q28',
    text: 'You are known for planning your time rather than reacting to it.',
    weights: { self_regulation: 1, organization: 0.4 }
  },
  {
    id: 'q29',
    text: 'When a plan changes suddenly, you adapt faster than most.',
    weights: { adaptability: 1, learning: 0.4 }
  },
  {
    id: 'q30',
    text: 'After a setback, people notice you recover and re‑engage quickly.',
    weights: { resilience: 1, grit: 0.3 }
  },
  {
    id: 'q31',
    text: 'When conflict arises, others trust your judgment to resolve it.',
    weights: { situational_judgment: 1, eq: 0.4 }
  },
  {
    id: 'q32',
    text: 'You can explain how you reached a conclusion and revise it when needed.',
    weights: { metacognition: 1, critical_thinking: 0.4 }
  },
  {
    id: 'q33',
    text: 'You are the person who spots weak assumptions in a plan.',
    weights: { critical_thinking: 1, scientific: 0.4 }
  },
  {
    id: 'q34',
    text: 'You can mentally picture how forces move through a machine or system.',
    weights: { mechanical: 1, spatial: 0.4 }
  },
  {
    id: 'q35',
    text: 'Others say you pick up new languages or terminology faster than expected.',
    weights: { linguistic: 1, learning: 0.4 }
  },
  {
    id: 'q36',
    text: 'You are trusted to organize records or details with minimal errors.',
    weights: { clerical: 1, processing: 0.4 }
  },
  {
    id: 'q37',
    text: 'People notice you generate multiple original ideas under constraints.',
    weights: { artistic: 1, creativity: 0.4 }
  }
];

// automationResistanceScore: 0-1 scale for AGI/ASI vulnerability (higher = more resistant)
// sector: matches INDUSTRY_OPTIONS.id; educationMin: matches QUALIFICATION_LEVELS.id; archetypeFit: archetype names from ARCHETYPE_OPTIONS
export const MARKET_PROJECTION_MATRIX = [
  {
    id: 'renewable_tech',
    name: 'Renewable Energy Technician',
    sector: 'trades',
    educationMin: 'certificate',
    archetypeFit: ['Delta Male', 'Sigma Male', 'Beta Male'],
    growth: 'High',
    automationResistance: 'High',
    automationResistanceScore: 0.85,
    aptitudes: { diagnostics: 0.8, field: 0.9, technical: 0.7, organization: 0.5 }
  },
  {
    id: 'ev_infrastructure',
    name: 'EV Infrastructure Specialist',
    sector: 'technology',
    educationMin: 'bachelors',
    archetypeFit: ['Gamma Male', 'Delta Male', 'Sigma Male'],
    growth: 'High',
    automationResistance: 'Medium-High',
    automationResistanceScore: 0.72,
    aptitudes: { technical: 0.9, diagnostics: 0.7, field: 0.6, systems: 0.6 }
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics / Smart Manufacturing',
    sector: 'technology',
    educationMin: 'bachelors',
    archetypeFit: ['Gamma Male', 'Delta Male', 'Beta Male'],
    growth: 'High',
    automationResistance: 'Medium-High',
    automationResistanceScore: 0.70,
    aptitudes: { technical: 0.9, systems: 0.8, diagnostics: 0.7, organization: 0.6 }
  },
  {
    id: 'healthcare_tech',
    name: 'Healthcare / Biomedical Technician',
    sector: 'healthcare',
    educationMin: 'associates',
    archetypeFit: ['Beta Male', 'Beta-Iota Male', 'Delta-Mu Male'],
    growth: 'High',
    automationResistance: 'High',
    automationResistanceScore: 0.80,
    aptitudes: { technical: 0.7, diagnostics: 0.7, eq: 0.7, organization: 0.6 }
  },
  {
    id: 'automation_integrator',
    name: 'Automation & Systems Integrator',
    sector: 'technology',
    educationMin: 'bachelors',
    archetypeFit: ['Gamma Male', 'Sigma Male', 'Alpha Male'],
    growth: 'High',
    automationResistance: 'Medium',
    automationResistanceScore: 0.55,
    aptitudes: { systems: 0.9, technical: 0.8, diagnostics: 0.6, management: 0.5 }
  },
  {
    id: 'field_ops_lead',
    name: 'Field Operations Lead',
    sector: 'trades',
    educationMin: 'certificate',
    archetypeFit: ['Alpha-Xi Male', 'Delta Male', 'Alpha Male'],
    growth: 'Medium-High',
    automationResistance: 'High',
    automationResistanceScore: 0.82,
    aptitudes: { field: 0.8, organization: 0.8, management: 0.7, eq: 0.5 }
  },
  {
    id: 'r_and_d_technician',
    name: 'Applied R&D Technician',
    sector: 'technology',
    educationMin: 'bachelors',
    archetypeFit: ['Gamma Male', 'Sigma Male', 'Gamma-Nu Male'],
    growth: 'Medium',
    automationResistance: 'Medium',
    automationResistanceScore: 0.58,
    aptitudes: { scientific: 0.8, creativity: 0.7, technical: 0.7, systems: 0.5 }
  },
  {
    id: 'productivity_engineer',
    name: 'Productivity / Process Engineer',
    sector: 'business',
    educationMin: 'bachelors',
    archetypeFit: ['Beta Male', 'Gamma Male', 'Sigma-Kappa Male'],
    growth: 'Medium',
    automationResistance: 'Medium',
    automationResistanceScore: 0.55,
    aptitudes: { organization: 0.9, systems: 0.8, diagnostics: 0.6, management: 0.5 }
  }
];

export const VALIDATION_PROMPTS = [
  'Which tasks do people already rely on you for, without being asked?',
  'Which tasks drain you even if you are competent at them?',
  'Where do you learn faster than your peers?',
  'Which environments make your performance noticeably better?',
  'If a colleague rated your strengths, what would they choose first?',
  'Which problems do people bring to you because you solve them better than most?'
];

