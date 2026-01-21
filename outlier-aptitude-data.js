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
  }
];

export const APTITUDE_QUESTIONS = [
  {
    id: 'q1',
    text: 'I can see how small changes ripple across a larger system.',
    weights: { systems: 1, diagnostics: 0.5 }
  },
  {
    id: 'q2',
    text: 'I often spot a problem before others notice it.',
    weights: { diagnostics: 1, systems: 0.5 }
  },
  {
    id: 'q3',
    text: 'I learn technical tools faster than most people around me.',
    weights: { technical: 1, learning: 0.5 }
  },
  {
    id: 'q4',
    text: 'I stay effective when the job is physical, messy, or unpredictable.',
    weights: { field: 1, organization: 0.3 }
  },
  {
    id: 'q5',
    text: 'I naturally build routines and checklists to keep work clean.',
    weights: { organization: 1 }
  },
  {
    id: 'q6',
    text: 'I coordinate people well, even under pressure.',
    weights: { management: 1, eq: 0.4 }
  },
  {
    id: 'q7',
    text: 'I generate novel solutions when others are stuck.',
    weights: { creativity: 1, systems: 0.3 }
  },
  {
    id: 'q8',
    text: 'I prefer evidence and testing before accepting conclusions.',
    weights: { scientific: 1 }
  },
  {
    id: 'q9',
    text: 'People naturally confide in me or seek my emotional guidance.',
    weights: { eq: 1 }
  },
  {
    id: 'q10',
    text: 'I keep skills current and update my knowledge regularly.',
    weights: { learning: 1 }
  },
  {
    id: 'q11',
    text: 'I can troubleshoot complex equipment without a manual.',
    weights: { diagnostics: 0.7, technical: 0.6 }
  },
  {
    id: 'q12',
    text: 'I thrive in roles that combine hardware and software.',
    weights: { technical: 0.8, systems: 0.6 }
  },
  {
    id: 'q13',
    text: 'I prefer to lead projects rather than follow instructions.',
    weights: { management: 0.8, organization: 0.4 }
  },
  {
    id: 'q14',
    text: 'I can stay calm and organized during emergencies.',
    weights: { organization: 0.7, field: 0.6, eq: 0.4 }
  },
  {
    id: 'q15',
    text: 'I enjoy learning new frameworks or mental models.',
    weights: { learning: 0.8, scientific: 0.4 }
  },
  {
    id: 'q16',
    text: 'I can break down a complex task into a clean workflow.',
    weights: { organization: 0.8, systems: 0.5 }
  },
  {
    id: 'q17',
    text: 'I can intuit people’s motives or hidden concerns.',
    weights: { eq: 0.9, diagnostics: 0.3 }
  },
  {
    id: 'q18',
    text: 'I feel energized by hands-on building, repair, or installation.',
    weights: { field: 1, technical: 0.4 }
  },
  {
    id: 'q19',
    text: 'I can hold both creative exploration and rigorous execution.',
    weights: { creativity: 0.7, organization: 0.5 }
  },
  {
    id: 'q20',
    text: 'I can keep a long-term goal steady even when tasks shift.',
    weights: { management: 0.6, systems: 0.6 }
  }
];

export const MARKET_PROJECTION_MATRIX = [
  {
    id: 'renewable_tech',
    name: 'Renewable Energy Technician',
    growth: 'High',
    automationResistance: 'High',
    aptitudes: { diagnostics: 0.8, field: 0.9, technical: 0.7, organization: 0.5 }
  },
  {
    id: 'ev_infrastructure',
    name: 'EV Infrastructure Specialist',
    growth: 'High',
    automationResistance: 'Medium-High',
    aptitudes: { technical: 0.9, diagnostics: 0.7, field: 0.6, systems: 0.6 }
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics / Smart Manufacturing',
    growth: 'High',
    automationResistance: 'Medium-High',
    aptitudes: { technical: 0.9, systems: 0.8, diagnostics: 0.7, organization: 0.6 }
  },
  {
    id: 'healthcare_tech',
    name: 'Healthcare / Biomedical Technician',
    growth: 'High',
    automationResistance: 'High',
    aptitudes: { technical: 0.7, diagnostics: 0.7, eq: 0.7, organization: 0.6 }
  },
  {
    id: 'automation_integrator',
    name: 'Automation & Systems Integrator',
    growth: 'High',
    automationResistance: 'Medium',
    aptitudes: { systems: 0.9, technical: 0.8, diagnostics: 0.6, management: 0.5 }
  },
  {
    id: 'field_ops_lead',
    name: 'Field Operations Lead',
    growth: 'Medium-High',
    automationResistance: 'High',
    aptitudes: { field: 0.8, organization: 0.8, management: 0.7, eq: 0.5 }
  },
  {
    id: 'r_and_d_technician',
    name: 'Applied R&D Technician',
    growth: 'Medium',
    automationResistance: 'Medium',
    aptitudes: { scientific: 0.8, creativity: 0.7, technical: 0.7, systems: 0.5 }
  },
  {
    id: 'productivity_engineer',
    name: 'Productivity / Process Engineer',
    growth: 'Medium',
    automationResistance: 'Medium',
    aptitudes: { organization: 0.9, systems: 0.8, diagnostics: 0.6, management: 0.5 }
  }
];

export const VALIDATION_PROMPTS = [
  'Which tasks do people already rely on you for, without being asked?',
  'Which tasks drain you even if you are competent at them?',
  'Where do you learn faster than your peers?',
  'Which environments make your performance noticeably better?'
];

