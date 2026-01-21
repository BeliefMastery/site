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

