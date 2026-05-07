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

// Work experience industries — mutually exclusive, no overlap. Maps to career sectors.
export const INDUSTRY_OPTIONS = [
  { id: 'tech_software', label: 'Software, IT & Data' },
  { id: 'tech_engineering', label: 'Hardware, Systems & Engineering' },
  { id: 'healthcare_clinical', label: 'Clinical Healthcare (nursing, medicine, therapy)' },
  { id: 'healthcare_allied', label: 'Allied Health (lab, imaging, technicians)' },
  { id: 'healthcare_social', label: 'Social Work, Foster Care & Community Services' },
  { id: 'business_corporate', label: 'Corporate & Finance' },
  { id: 'business_consulting', label: 'Consulting & Strategy' },
  { id: 'business_operations', label: 'Operations, HR & Supply Chain' },
  { id: 'education_schools', label: 'K–12 & Higher Education' },
  { id: 'education_training', label: 'Training & Instructional Design' },
  { id: 'creative_design', label: 'Design & Visual Arts' },
  { id: 'creative_content', label: 'Content, Writing & Media Production' },
  { id: 'legal_law', label: 'Legal & Compliance' },
  { id: 'legal_public', label: 'Public Policy & Law Enforcement' },
  { id: 'trades_construction', label: 'Construction & Skilled Trades' },
  { id: 'trades_manufacturing', label: 'Manufacturing & Industrial' },
  { id: 'hospitality_food', label: 'Food, Beverage & Culinary' },
  { id: 'hospitality_wellness', label: 'Wellness, Personal Care & Events' },
  { id: 'sales_b2b', label: 'B2B Sales & Account Management' },
  { id: 'sales_retail', label: 'Retail & Customer-Facing' },
  { id: 'agriculture_env', label: 'Agriculture, Conservation & Environmental' },
  { id: 'other', label: 'Other or Mixed' }
];

// Map industry id → career sector for relevance matching
export const INDUSTRY_TO_SECTOR = {
  tech_software: 'technology', tech_engineering: 'technology',
  healthcare_clinical: 'healthcare', healthcare_allied: 'healthcare', healthcare_social: 'legal',
  business_corporate: 'business', business_consulting: 'business', business_operations: 'business',
  education_schools: 'education', education_training: 'education',
  creative_design: 'creative', creative_content: 'creative',
  legal_law: 'legal', legal_public: 'legal',
  trades_construction: 'trades', trades_manufacturing: 'trades',
  hospitality_food: 'hospitality', hospitality_wellness: 'hospitality',
  sales_b2b: 'sales', sales_retail: 'sales',
  agriculture_env: 'agriculture', other: 'other'
};

// Qualification order for comparison (higher index = higher level)
export const QUALIFICATION_ORDER = ['none', 'certificate', 'associates', 'bachelors', 'masters', 'doctorate', 'md', 'jd'];

/** Scenario choice suffixes and calibration scales (maps to former Likert-style spread). */
const SCENARIO_SUF = ['a', 'b', 'c', 'd'];
const SCENARIO_SCALES = [0.22, 0.45, 0.68, 1.0];

function scenarioQuestion(id, stem, baseWeights, labels) {
  return {
    id,
    type: 'scenario',
    text: stem,
    choices: labels.map((label, i) => ({
      id: `${id}_${SCENARIO_SUF[i]}`,
      label,
      weights: Object.fromEntries(
        Object.entries(baseWeights).map(([k, w]) => [k, w * SCENARIO_SCALES[i]])
      )
    }))
  };
}

function acuityChoices(id, stem, labels, sliderValues) {
  return {
    id,
    scenarioStem: stem,
    scenarioChoices: labels.map((label, i) => ({
      id: `${id}_${SCENARIO_SUF[i]}`,
      label,
      sliderValue: sliderValues[i]
    }))
  };
}

export const APTITUDE_ACUITY_DOMAINS = [
  {
    name: 'IQ (Analytical)',
    description: 'Pattern recognition, logical inference, and structured problem‑solving.',
    ...acuityChoices('iq', 'A client sends a dense, ambiguous brief and needs a recommendation by tomorrow. What do you do first?', [
      'Scan for the decision they are really asking for, then outline 2–3 logical paths before details.',
      'List unknowns and request one clarification round, then build a structured outline.',
      'Pull similar past examples and mirror the format that worked before.',
      'Focus on the parts you understand and draft something concrete to react to.'
    ], [9.5, 7, 4.5, 2])
  },
  {
    name: 'EQ (Emotional)',
    description: 'Reading people, managing emotions, and de‑escalating conflict.',
    ...acuityChoices('eq', 'Two teammates are openly frustrated in a meeting and talking past each other. Where do you lean?', [
      'Name the tension calmly and invite each to say what they need before debating facts.',
      'Suggest a short break, then check in one‑on‑one before continuing as a group.',
      'Redirect to the agenda and ask for evidence on both sides to cool things down.',
      'Stay quiet; it is usually better if leadership handles interpersonal heat.'
    ], [9.5, 7.5, 4.5, 2])
  },
  {
    name: 'SQ (Strategic)',
    description: 'Seeing leverage, long‑range positioning, and second‑order consequences.',
    ...acuityChoices('sq', 'Your org can fund only one major initiative this year. How do you tend to think about the choice?', [
      'Map second‑order effects: who gains capacity, what risks compound, what option keeps future options open.',
      'Identify the bottleneck that unlocks the most downstream value if solved.',
      'Compare near‑term ROI and execution risk with a simple scorecard.',
      'Support the initiative your strongest stakeholders already favor so delivery stays smooth.'
    ], [9.5, 7.5, 5, 2.5])
  },
  {
    name: 'AQ (Adversity)',
    description: 'Resilience under pressure, chaos tolerance, and recovery speed.',
    ...acuityChoices('aq', 'A launch you cared about just failed publicly. What is most like you in the next 48 hours?', [
      'Stabilize stakeholders, capture lessons, and propose the next smallest safe experiment.',
      'Take a short reset, then re‑engage with a clear list of what to fix first.',
      'Pitch in where directed and wait for leadership to set the new direction.',
      'Step back from visibility until the dust settles.'
    ], [9.5, 7, 4, 2])
  },
  {
    name: 'CQ (Creative)',
    description: 'Novel synthesis, original solutions, and adaptive framing.',
    ...acuityChoices('cq', 'The obvious solution is blocked by policy or budget. What is your default move?', [
      'Reframe the goal and propose a new angle that still hits the outcome.',
      'Combine two “boring” ideas into one hybrid that fits constraints.',
      'Polish the safest variant of the standard approach.',
      'Defer to the playbook; originality often creates more review cycles.'
    ], [9.5, 7, 4.5, 2])
  },
  {
    name: 'TQ (Technical)',
    description: 'Tool fluency, systems handling, and applied technical judgment.',
    ...acuityChoices('tq', 'A critical tool your group relies on breaks during a busy period. What do you do first?', [
      'Reproduce the failure, isolate the subsystem, and document steps for a fix or workaround.',
      'Search internal docs and recent changes, then escalate with a crisp bug report.',
      'Ask the usual expert on the team to triage while you handle non‑technical fallout.',
      'Pause use of the tool and route work manually until support responds.'
    ], [9.5, 7, 4.5, 2.5])
  },
  {
    name: 'OQ (Operational)',
    description: 'Process discipline, sequencing, and reliable execution.',
    ...acuityChoices('oq', 'You inherit a messy project with slipping dates. What is your first instinct?', [
      'Build a single source of truth: owners, milestones, dependencies, and daily priorities.',
      'Cut scope to a credible milestone and communicate the tradeoff explicitly.',
      'Add standups and chase blockers informally until velocity returns.',
      'Focus on your tasks and avoid reshaping the whole plan.'
    ], [9.5, 7, 4.5, 2])
  },
  {
    name: 'LQ (Learning)',
    description: 'Skill uptake speed and ability to stay current.',
    ...acuityChoices('lq', 'A new method or tool becomes standard in your field. How do you usually respond?', [
      'Run a small deliberate experiment on real work and compare results to your old workflow.',
      'Complete a focused course or tutorial, then apply it on a low‑risk task.',
      'Learn just enough when a task forces it.',
      'Stick with what already works until change is unavoidable.'
    ], [9.5, 7, 4, 2])
  }
];

export const APTITUDE_QUESTIONS = [
  scenarioQuestion('q1', 'A handoff between three teams starts slipping. What is your first move?', { systems: 0.85, diagnostics: 0.35 }, [
    'Map how the teams connect and where delays will compound before changing anything.',
    'Look for early warning signs—vague owners, missing artifacts, quiet rework.',
    'Tighten checklists for your team’s slice and ask others to do the same.',
    'Execute your assigned tasks and let leads sort cross‑team alignment.'
  ]),
  scenarioQuestion('q2', 'Metrics look fine but people seem uneasy about a release. What do you trust more?', { diagnostics: 0.9, systems: 0.35 }, [
    'Weak signals in support tickets, edge cases, and informal comments before the headline numbers.',
    'A quick pre‑mortem: what would have to be true for this to fail quietly?',
    'The dashboard if it has been reliable historically.',
    'Leadership’s call once they own the risk.'
  ]),
  scenarioQuestion('q3', 'You must adopt a new tool the group has never used. What happens?', { technical: 1, learning: 0.5 }, [
    'You build a minimal working setup fast and iterate with real tasks.',
    'You learn core workflows in a day or two, then teach one teammate.',
    'You reach basic competence when a project requires it.',
    'You avoid switching until someone proves it is worth the friction.'
  ]),
  scenarioQuestion('q4', 'You are working on site during a chaotic day—weather, delays, and shifting instructions. What fits you?', { field: 1, organization: 0.3 }, [
    'You keep execution coherent: clear next steps, gear staged, comms short.',
    'You stay effective in your lane and adapt when the plan changes.',
    'You cope but prefer to return to a predictable environment.',
    'You find the unpredictability draining and look for ways to exit the situation.'
  ]),
  scenarioQuestion('q5', 'Starting a multi‑week effort, what do you put in place first?', { organization: 1 }, [
    'A lightweight structure: milestones, owners, and a shared backlog or checklist.',
    'A kickoff that aligns on outcomes, then you formalize the plan.',
    'You track tasks informally until complexity forces more structure.',
    'You begin executing and add organization only if things go wrong.'
  ]),
  scenarioQuestion('q6', 'Deadlines collide and people disagree on priorities. What is most like you?', { management: 1, eq: 0.4 }, [
    'You sequence work, make tradeoffs explicit, and keep people moving without steamrolling.',
    'You facilitate who does what now vs. next and check for buy‑in.',
    'You advocate for your stream and coordinate only when blocked.',
    'You wait for authority to arbitrate so the team does not fragment.'
  ]),
  scenarioQuestion('q7', 'The group is stuck on an old approach. What do you offer?', { creativity: 1, systems: 0.22 }, [
    'A workable alternative that reframes constraints and names a first step.',
    'A tweak that unblocks progress without a full rethink.',
    'More data gathering before changing direction.',
    'You support consensus even if the approach feels stale.'
  ]),
  scenarioQuestion('q8', 'Someone states a confident conclusion with thin evidence. What do you do?', { scientific: 1 }, [
    'Ask what would falsify it and suggest a quick test or comparison.',
    'Request sources or a walkthrough of assumptions.',
    'Note uncertainty but move on if the decision is low stakes.',
    'Defer to expertise if the person is senior or specialized.'
  ]),
  scenarioQuestion('q9', 'A colleague is upset about workload in private. What is your default?', { eq: 1 }, [
    'Listen, reflect what you heard, then explore one or two concrete next steps.',
    'Offer practical help or a small boundary they could set.',
    'Sympathize briefly and redirect to their manager.',
    'Keep it professional and avoid getting drawn into drama.'
  ]),
  scenarioQuestion('q10', 'How do you keep your skills relevant as tools and standards change?', { learning: 1 }, [
    'You schedule regular small upgrades—projects, courses, or reading—and apply them at work.',
    'You refresh when your role shifts or a skill gap shows up.',
    'You learn when required by training or compliance.',
    'You rely on experience; fundamentals do not change that fast.'
  ]),
  scenarioQuestion('q11', 'Hardware or software misbehaves and work stops. What is your role?', { diagnostics: 0.55, technical: 0.5 }, [
    'You narrow causes, try safe fixes, and document what changed.',
    'You follow a troubleshooting flow and escalate with symptoms.',
    'You coordinate who to call while others probe.',
    'You step aside; someone else usually owns technical fixes.'
  ]),
  scenarioQuestion('q12', 'Which project shape do you find most engaging over time?', { technical: 0.72, systems: 0.42 }, [
    'Problems that mix physical constraints, sensors, and software behavior.',
    'Mostly software with occasional hardware touchpoints.',
    'Purely digital or purely physical—mixing is fine but not essential.',
    'You prefer one domain and partner for the other.'
  ]),
  scenarioQuestion('q13', 'When a team needs direction, what tends to happen?', { management: 0.8, organization: 0.4 }, [
    'You are often asked to set direction, divide work, or run the rhythm.',
    'You lead when no one else steps up, then hand off if appropriate.',
    'You contribute strongly as a specialist, not as the coordinator.',
    'You prefer clear instructions from a single lead.'
  ]),
  scenarioQuestion('q14', 'Something urgent and risky is unfolding. How do you show up?', { organization: 0.7, field: 0.6, eq: 0.4 }, [
    'Calm structure: roles, comms cadence, next checks, and emotional steadiness.',
    'Practical help in the moment with enough order to avoid chaos.',
    'Focused execution on your piece; others handle the room.',
    'You feel the stress and need time to regain footing.'
  ]),
  scenarioQuestion('q15', 'You encounter a better mental model for a problem you face often. What happens next?', { learning: 0.8, scientific: 0.4 }, [
    'You try it on real work and compare outcomes to your old approach.',
    'You study it enough to use selectively.',
    'You bookmark it and rarely return.',
    'You stick with habits that already work.'
  ]),
  scenarioQuestion('q16', 'A messy initiative lands on the team. What do you do first?', { organization: 0.8, systems: 0.38 }, [
    'Decompose it into stages, inputs, outputs, and owners.',
    'Identify the critical path and strip non‑essentials.',
    'Start the visible tasks and reorganize if friction appears.',
    'Wait for a clearer charter before restructuring work.'
  ]),
  scenarioQuestion('q17', 'In negotiations or tense 1:1s, what do you notice first?', { eq: 0.9, diagnostics: 0.3 }, [
    'Unspoken worries, face‑saving needs, or misaligned incentives.',
    'Concrete asks and constraints once people calm down.',
    'The official agenda and stated positions.',
    'You focus on facts and avoid reading between lines.'
  ]),
  scenarioQuestion('q18', 'You have a free afternoon for a hands‑on project. What pulls you?', { field: 1, technical: 0.4 }, [
    'Build, repair, install, or tune something physical.',
    'A mix of physical setup and digital configuration.',
    'Light hands‑on; you prefer planning or analysis.',
    'You avoid tool‑heavy work when you can.'
  ]),
  scenarioQuestion('q19', 'Brainstorming produced exciting options; delivery is due soon. What do you do?', { creativity: 0.7, organization: 0.5 }, [
    'Pick one direction, define “done,” and run disciplined execution.',
    'Merge ideas into a feasible hybrid with a clear timeline.',
    'Keep exploring until someone forces a cut.',
    'Prefer execution plans that were set before ideation.'
  ]),
  scenarioQuestion('q20', 'Midstream, leadership keeps reshaping tasks. What stays steady for you?', { management: 0.6, systems: 0.42 }, [
    'The outcome you are protecting and the tradeoffs you will not silently absorb.',
    'Team morale and realistic commitments.',
    'Your personal task list within each new directive.',
    'You flex entirely; goals are whatever is latest.'
  ]),
  scenarioQuestion('q21', 'You face a puzzle with no instructions. What is your move?', { fluid: 1, diagnostics: 0.4 }, [
    'Hunt for the underlying rule or invariant and test mini‑hypotheses.',
    'Compare to similar puzzles you have seen.',
    'Trial and error until something clicks.',
    'Look for an expert or guide rather than solo discovery.'
  ]),
  scenarioQuestion('q22', 'You must explain a technical topic to a smart non‑expert. What do you reach for?', { crystallized: 0.8, linguistic: 0.4 }, [
    'A tight analogy, precise terms where they help, and a clean sequence.',
    'Simple language even if some nuance is lost.',
    'Jargon with definitions when asked.',
    'Links and decks; live explanation is not your strength.'
  ]),
  scenarioQuestion('q23', 'A chart or table lands in a meeting. What do you do with it?', { quantitative: 1, diagnostics: 0.3 }, [
    'Read direction, magnitude, and whether the baseline makes sense.',
    'Spot the headline trend; details later if needed.',
    'Rely on someone else’s summary.',
    'Prefer narrative over numbers.'
  ]),
  scenarioQuestion('q24', 'You are given a layout, map, or assembly diagram. How does it feel?', { spatial: 1, mechanical: 0.3 }, [
    'You translate it into mental 3D and foresee clashes or clearances.',
    'You follow it stepwise with occasional checks.',
    'You need the physical object in hand to be sure.',
    'Spatial diagrams are not where you add the most value.'
  ]),
  scenarioQuestion('q25', 'You have ten minutes left on a detail‑heavy task with zero buffer. What happens?', { processing: 1, organization: 0.4 }, [
    'You prioritize accuracy on the highest‑risk fields and flag the rest.',
    'You finish on time with a quick self‑review pass.',
    'You rush and clean up errors afterward.',
    'You ask for more time or scope reduction.'
  ]),
  scenarioQuestion('q26', 'A long goal (months) loses excitement halfway. What is most like you?', { grit: 1, self_regulation: 0.4 }, [
    'You reconnect to the “why,” adjust habits, and keep showing up.',
    'You push through dull phases with routines and accountability.',
    'Momentum depends on external deadlines.',
    'You often switch goals when motivation fades.'
  ]),
  scenarioQuestion('q27', 'When you submit work, what standard do you aim for?', { achievement: 1 }, [
    'A bar you would respect if you were the client or reviewer.',
    '“Good enough” plus one polish pass on the riskiest parts.',
    'Meeting the stated minimum promptly.',
    'Speed over perfection; iteration fixes issues.'
  ]),
  scenarioQuestion('q28', 'Your calendar and priorities are competing. What do you do first?', { self_regulation: 1, organization: 0.4 }, [
    'Re‑allocate time blocks, cut low‑value work, and protect deep focus.',
    'Make a short priority list for the week and adjust daily.',
    'React to what is loudest and catch up when possible.',
    'Rely on others to set your priorities.'
  ]),
  scenarioQuestion('q29', 'A key assumption in the plan is wrong. What is your response?', { adaptability: 1, learning: 0.4 }, [
    'You refactor the plan quickly and communicate impacts.',
    'You adapt after a short orientation pause.',
    'You need leadership to reset direction.',
    'Change this late feels costly; you resist unless forced.'
  ]),
  scenarioQuestion('q30', 'After a visible mistake or rejection, what happens next for you?', { resilience: 1, grit: 0.3 }, [
    'You absorb the hit, extract the lesson, and re‑engage with a smaller win.',
    'You recover after a breather and return with support.',
    'You dwell longer than you would like before moving on.',
    'You avoid similar risks for a while.'
  ]),
  scenarioQuestion('q31', 'Two peers escalate a dispute and involve you. What do you do?', { situational_judgment: 1, eq: 0.4 }, [
    'Separate facts from feelings, surface shared interests, and propose a fair path.',
    'Hear both sides, suggest a pragmatic compromise.',
    'Redirect them to a manager or policy.',
    'Avoid being in the middle.'
  ]),
  scenarioQuestion('q32', 'Someone challenges your reasoning. What is most like you?', { metacognition: 1, critical_thinking: 0.4 }, [
    'Walk through premises and updates you would accept to change your mind.',
    'Defend your view with evidence, then adjust if wrong.',
    'Hold your ground if you are experienced in the area.',
    'Defer to avoid conflict.'
  ]),
  scenarioQuestion('q33', 'A plan assumes perfect vendors, timelines, or user behavior. What do you do?', { critical_thinking: 1, scientific: 0.4 }, [
    'Call out fragile assumptions and suggest buffers or contingencies.',
    'Add mild caveats but support moving forward.',
    'Assume optimism is motivational.',
    'Leave skepticism to leadership.'
  ]),
  scenarioQuestion('q34', 'You think about how a machine or mechanism behaves under load. What happens in your head?', { mechanical: 1, spatial: 0.4 }, [
    'You trace forces, wear points, and failure modes spatially.',
    'You recall rules of thumb and check details when needed.',
    'You rely on manuals or specialists.',
    'Physical causality is not where you focus.'
  ]),
  scenarioQuestion('q35', 'You need to operate in a new jargon‑heavy environment. What happens?', { linguistic: 1, learning: 0.4 }, [
    'You build a usable vocabulary fast through immersion and spaced use.',
    'You learn terms as they appear in your tasks.',
    'You keep a cheat sheet and look things up often.',
    'Heavy terminology slows you down for a long time.'
  ]),
  scenarioQuestion('q36', 'You are given a pile of records to organize with tight accuracy requirements. How do you feel?', { clerical: 1, processing: 0.4 }, [
    'You set validation steps and work systematically without losing patience.',
    'You can do it when the stakes justify the grind.',
    'You tolerate it briefly, then seek automation or help.',
    'You find it draining and error‑prone.'
  ]),
  scenarioQuestion('q37', 'You need five viable concepts under tight constraints. What do you produce?', { artistic: 1, creativity: 0.4 }, [
    'Multiple distinct directions with tradeoffs sketched for each.',
    'Two solid options and a wildcard.',
    'One refined idea iterated until accepted.',
    'You prefer executing a brief someone else shaped.'
  ])
];

// Full 180-career matrix loaded from outlier-aptitude-careers.js
export { MARKET_PROJECTION_MATRIX } from './outlier-aptitude-careers.js';

export const VALIDATION_PROMPTS = [
  'Which tasks do people already rely on you for, without being asked?',
  'Which tasks drain you even if you are competent at them?',
  'Where do you learn faster than your peers?',
  'Which environments make your performance noticeably better?',
  'If a colleague rated your strengths, what would they choose first?',
  'Which problems do people bring to you because you solve them better than most?'
];

