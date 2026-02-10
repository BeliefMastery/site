/**
 * STATUS, SELECTION, ATTRACTION — Quick Reference Map
 * Male and female evolutionary clusters from Belief Mastery.
 * Weightings informed by @hoe_math framework.
 *
 * @author Warwick Marshall
 */

/** Male cluster weights (Hoe_math: Axis = 40% for males) */
export const MALE_CLUSTER_WEIGHTS = {
  coalitionRank: 0.25,
  reproductiveConfidence: 0.35,
  axisOfAttraction: 0.40
};

/** Female cluster weights (Axis = 50% for females) */
export const FEMALE_CLUSTER_WEIGHTS = {
  coalitionRank: 0.20,
  reproductiveConfidence: 0.30,
  axisOfAttraction: 0.50
};

/** Market Preference Configuration — Male */
export const MALE_PREFERENCE_QUESTIONS = [
  { id: 'age', text: 'What is your current age?', type: 'number', min: 18, max: 80, required: true },
  { id: 'target_age_min', text: 'Minimum age of desired partner?', type: 'number', min: 18, max: 80, required: true },
  { id: 'target_age_max', text: 'Maximum age of desired partner?', type: 'number', min: 18, max: 80, required: true },
  {
    id: 'physical_standards',
    text: 'How important are physical attractiveness standards (face, body, fitness)?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not important - Personality and compatibility matter most' },
      { value: 3, label: 'Somewhat important - Basic attraction threshold' },
      { value: 5, label: 'Very important - Strong physical attraction required' },
      { value: 7, label: 'Extremely important - Top tier looks are essential' }
    ]
  },
  {
    id: 'fertility_priority',
    text: 'How important is fertility/ability to have children?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not important - Not seeking children' },
      { value: 3, label: 'Somewhat important - Open to possibility' },
      { value: 5, label: 'Very important - Definitely want children' },
      { value: 7, label: 'Critical - Primary relationship purpose' }
    ]
  },
  {
    id: 'career_expectations',
    text: 'What are your expectations for her career/productivity?',
    type: 'scale',
    options: [
      { value: 1, label: 'Prefer full homemaker/traditional role' },
      { value: 3, label: 'Flexible - either career or home focused' },
      { value: 5, label: 'Prefer she has career but family comes first' },
      { value: 7, label: 'Want ambitious career woman/high earner' }
    ]
  },
  {
    id: 'relationship_goal',
    text: 'Primary relationship goal?',
    type: 'select',
    options: [
      { value: 'casual', label: 'Casual dating / Short-term' },
      { value: 'ltr', label: 'Long-term relationship' },
      { value: 'marriage', label: 'Marriage / Life partnership' },
      { value: 'family', label: 'Marriage + Children' }
    ]
  }
];

/** Market Preference Configuration — Female */
export const FEMALE_PREFERENCE_QUESTIONS = [
  { id: 'age', text: 'What is your current age?', type: 'number', min: 18, max: 80, required: true },
  { id: 'target_age_min', text: 'Minimum age of desired partner?', type: 'number', min: 18, max: 80, required: true },
  { id: 'target_age_max', text: 'Maximum age of desired partner?', type: 'number', min: 18, max: 80, required: true },
  {
    id: 'height_requirement',
    text: 'Minimum height requirement for partner?',
    type: 'scale',
    options: [
      { value: 1, label: 'No requirement - Height doesn\'t matter' },
      { value: 3, label: 'Prefer taller than me' },
      { value: 5, label: 'Must be 5\'10" (178cm) or taller' },
      { value: 7, label: 'Must be 6\'0" (183cm) or taller' },
      { value: 10, label: 'Must be 6\'2" (188cm)+ only' }
    ]
  },
  {
    id: 'income_requirement',
    text: 'Minimum income/wealth requirement?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not important - Character matters most' },
      { value: 3, label: 'Must be self-sufficient/stable job' },
      { value: 5, label: 'Must earn above average ($75k+)' },
      { value: 7, label: 'Must be high earner ($150k+)' },
      { value: 10, label: 'Must be wealthy ($250k+)' }
    ]
  },
  {
    id: 'status_requirement',
    text: 'How important is social status/prestige?',
    type: 'scale',
    options: [
      { value: 1, label: 'Not important - Character over status' },
      { value: 3, label: 'Prefer some social standing' },
      { value: 5, label: 'Want respected professional/leader' },
      { value: 7, label: 'Need high status/influential man' }
    ]
  },
  {
    id: 'relationship_goal',
    text: 'Primary relationship goal?',
    type: 'select',
    options: [
      { value: 'casual', label: 'Casual dating / Short-term' },
      { value: 'ltr', label: 'Long-term relationship' },
      { value: 'marriage', label: 'Marriage / Life partnership' },
      { value: 'family', label: 'Marriage + Children' }
    ]
  }
];

/** Male clusters — STATUS, SELECTION, ATTRACTION */
export const MALE_CLUSTERS = {
  coalitionRank: {
    id: 'coalitionRank',
    title: 'Coalition Rank',
    subtitle: "Male-Male Hierarchy Determinants (3C's)",
    description: 'Decides male standing in groups; higher rank → more allies, more resources, better mate access.',
    subcategories: {
      courage: { label: 'Courage', desc: 'Risk tolerance under threat.' },
      control: { label: 'Control', desc: 'Mastery over impulses and stress.' },
      competence: { label: 'Competence', desc: 'Ability to solve problems and secure resources under pressure.' }
    },
    questions: [
      { id: 'courage_1', subcategory: 'courage', text: 'When faced with physical confrontation or danger, how do you typically respond?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Freeze, avoid, or seek escape', 'Retreat and de-escalate; minimize conflict', 'Stand ground; respond only if necessary', 'Confront directly; protect self/others', 'Seek to dominate; high risk tolerance'] },
      { id: 'courage_2', subcategory: 'courage', text: 'How often do you take calculated risks in your career or business ventures?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Almost never — avoid risk', 'Rarely — only when forced', 'Sometimes — selective risks', 'Often — regularly take calculated risks', 'Constantly — risk-seeking in career/business'] },
      { id: 'control_1', subcategory: 'control', text: 'How well do you maintain composure during high-stress situations?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Often lose composure; overwhelmed', 'Struggle to stay calm; visible stress', 'Usually maintain composure; some wobble', 'Consistently calm under pressure', 'Thrive under stress; perform better'] },
      { id: 'control_2', subcategory: 'control', text: 'How consistent are you with personal discipline (fitness, diet, sleep, work routine)?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Inconsistent — no routine', 'Sporadic — occasional effort', 'Moderate — partial consistency', 'Consistent — solid routine', 'Highly disciplined — unwavering routine'] },
      { id: 'competence_1', subcategory: 'competence', text: 'How effectively can you solve complex problems in unfamiliar domains?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Struggle significantly; avoid', 'Difficult; need heavy support', 'Manage with effort; mixed results', 'Handle well; adapt quickly', 'Excel; thrive in unfamiliar territory'] },
      { id: 'competence_2', subcategory: 'competence', text: 'How would you rate your ability to generate and secure resources (income, assets, opportunities)?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Very limited; unstable', 'Below average; inconsistent', 'Average; adequate', 'Above average; reliable', 'Strong; secure and growing'] }
    ]
  },
  reproductiveConfidence: {
    id: 'reproductiveConfidence',
    title: 'Reproductive Confidence',
    subtitle: 'Female Selection Criteria (4P\'s)',
    description: 'Determines long-term mate selection by women; tied to genetic legacy.',
    subcategories: {
      perspicacity: { label: 'Perspicacity', desc: 'Acute perception of threats/opportunities.' },
      protector: { label: 'Protector', desc: 'Physical defense capacity and intent.' },
      provider: { label: 'Provider', desc: 'Consistent resource generation.' },
      parentalInvestor: { label: 'Parental Investor', desc: 'Willingness and competence in offspring rearing.' }
    },
    questions: [
      { id: 'perspicacity_1', subcategory: 'perspicacity', text: 'How quickly do you identify potential threats or dangers in your environment?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Rarely notice until too late', 'Sometimes miss; slow to recognize', 'Usually notice; average awareness', 'Quick to identify; good instincts', 'Instantly perceive; hypervigilant'] },
      { id: 'protector_1', subcategory: 'protector', text: 'How capable are you of physically protecting someone from harm?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Cannot / would avoid confrontation', 'Limited; would try but uncertain', 'Moderate; can hold my own', 'Capable; confident in defense', 'Highly capable; trained / strong'] },
      { id: 'provider_1', subcategory: 'provider', text: 'How stable and consistent is your income/resource generation?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Unstable; irregular or none', 'Somewhat stable; variable', 'Moderately stable; predictable', 'Stable; consistent income', 'Very stable; secure and growing'] },
      { id: 'provider_2', subcategory: 'provider', text: 'If you had to support a family tomorrow, how prepared are you?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Not prepared; could not support', 'Barely prepared; major gaps', 'Partially prepared; would strain', 'Well prepared; could support', 'Fully prepared; comfortable margin'] },
      { id: 'parental_1', subcategory: 'parentalInvestor', text: 'How committed are you to the idea of being an active, involved father?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Not committed; not seeking', 'Somewhat open; uncertain', 'Committed in principle', 'Committed; want to be involved', 'Deeply committed; priority'] }
    ]
  },
  axisOfAttraction: {
    id: 'axisOfAttraction',
    title: 'Axis of Attraction',
    subtitle: 'Display Signals',
    description: 'Immediate draw in mating/coalition markets; amplifies or bottlenecks access.',
    subcategories: {
      performanceStatus: { label: 'Performance/Status Signals', desc: 'Wealth, productivity, popularity, status, generosity.' },
      physicalGenetic: { label: 'Physical/Genetic Signals', desc: 'Aesthetics, genetics, virility, fitness, cleanliness.' }
    },
    questions: [
      { id: 'status_1', subcategory: 'performanceStatus', text: 'How would you rate your current social status and influence?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Low; little influence', 'Below average', 'Average', 'Above average; notable', 'High; significant influence'] },
      { id: 'status_2', subcategory: 'performanceStatus', text: 'What is your current annual income bracket?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Under $30k', '$30k-$60k', '$60k-$100k', '$100k-$200k', 'Over $200k'] },
      { id: 'physical_1', subcategory: 'physicalGenetic', text: 'How would you honestly rate your physical attractiveness (face, build, aesthetics)?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Below average', 'Slightly below average', 'Average', 'Above average', 'Top tier'] },
      { id: 'physical_2', subcategory: 'physicalGenetic', text: 'How would you rate your fitness, strength, and physical capability?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Poor; sedentary', 'Below average', 'Average', 'Above average; fit', 'Elite; very strong'] },
      { id: 'physical_3', subcategory: 'physicalGenetic', text: 'What is your height bracket?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Under 5\'6"', '5\'6"-5\'8"', '5\'9"-5\'11"', '6\'0"-6\'2"', 'Over 6\'2"'] }
    ]
  }
};

/** Female clusters — STATUS, SELECTION, ATTRACTION */
export const FEMALE_CLUSTERS = {
  coalitionRank: {
    id: 'coalitionRank',
    title: 'Coalition Rank',
    subtitle: "Female-Female Hierarchy Determinants (3S's)",
    description: 'Controls resource flow, reduces threats, determines protection within the female network.',
    subcategories: {
      socialInfluence: { label: 'Social Influence', desc: 'Control over perceptions and alliances.' },
      selectivity: { label: 'Selectivity & Mate Guarding Success', desc: 'Ability to attract and retain top male attention against rivals.' },
      statusSignaling: { label: 'Status Signaling', desc: 'Strategic display of beauty, fertility, and alliance without triggering sabotage.' }
    },
    questions: [
      { id: 'social_1', subcategory: 'socialInfluence', text: 'How much influence do you have over social narratives and group opinions?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Little to none; often overlooked', 'Limited; some say in close circle', 'Moderate; respected in my groups', 'Notable; shape opinions', 'High; significant social influence'] },
      { id: 'selectivity_1', subcategory: 'selectivity', text: 'How successful are you at attracting high-quality male attention?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Rarely; struggle to attract', 'Sometimes; inconsistent', 'Moderately; decent interest', 'Often; strong interest from quality men', 'Consistently; top-tier men pursue'] },
      { id: 'status_signal_1', subcategory: 'statusSignaling', text: 'How well do you display your value without triggering jealousy or sabotage?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Poorly; often trigger backlash', 'Struggle; sometimes provoke', 'Moderately; mixed results', 'Well; mostly avoid sabotage', 'Expertly; display value without cost'] }
    ]
  },
  reproductiveConfidence: {
    id: 'reproductiveConfidence',
    title: 'Reproductive Confidence',
    subtitle: 'Male Selection Criteria',
    description: 'Determines a man\'s willingness to commit long-term resources and protection.',
    subcategories: {
      paternityCertainty: { label: 'Paternity Certainty', desc: 'Signals of loyalty and exclusivity.' },
      nurturingStandard: { label: 'Nurturing Standard', desc: 'Alignment with or exceeding the male\'s early maternal care baseline.' },
      collaborativeTrust: { label: 'Collaborative Trust Efficiency', desc: 'Ability to work with a male partner without waste, sabotage, or chronic conflict.' }
    },
    questions: [
      { id: 'paternity_1', subcategory: 'paternityCertainty', text: 'How loyal and faithful are you in committed relationships?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Not loyal; history of infidelity', 'Struggle; tempted often', 'Moderately loyal; some lapses', 'Loyal; committed', 'Deeply loyal; never strayed'] },
      { id: 'paternity_2', subcategory: 'paternityCertainty', text: 'How many sexual/romantic partners have you had?', weight: 1.0, reverseScore: true, options: [1, 3, 5, 7, 10], optionLabels: ['0-1', '2-4', '5-9', '10-19', '20+'] },
      { id: 'nurture_1', subcategory: 'nurturingStandard', text: 'How warm, caring, and nurturing are you toward a partner?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Cold; struggle to show care', 'Limited; guarded', 'Moderately warm', 'Warm; naturally nurturing', 'Very warm; deeply caring'] },
      { id: 'collab_1', subcategory: 'collaborativeTrust', text: 'How well do you cooperate with a partner without creating drama or conflict?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Poorly; frequent conflict', 'Struggle; drama often', 'Moderately; some conflict', 'Well; mostly cooperative', 'Exceptionally; easy partnership'] }
    ]
  },
  axisOfAttraction: {
    id: 'axisOfAttraction',
    title: 'Axis of Attraction',
    subtitle: 'Male Mate Choice Filters',
    description: 'Short-term/long-term filter in male mating decisions; initial draw vs sustained investment.',
    subcategories: {
      fertility: { label: 'Fertility & Health Cues (Hot)', desc: 'Youth, waist-hip ratio, skin/hair health, facial symmetry.' },
      riskCost: { label: 'Risk Cost Indicators (Crazy)', desc: 'Predicted volatility, infidelity risk, sabotage potential, or instability.' }
    },
    questions: [
      { id: 'fertility_1', subcategory: 'fertility', text: 'How would you honestly rate your physical attractiveness and feminine beauty?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Below average', 'Slightly below average', 'Average', 'Above average', 'Top tier'] },
      { id: 'fertility_2', subcategory: 'fertility', text: 'How favorable is your waist-hip ratio and overall body composition?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['Unfavorable', 'Below average', 'Average', 'Favorable', 'Highly favorable'] },
      { id: 'fertility_3', subcategory: 'fertility', text: 'What is your age bracket?', weight: 1.0, options: [1, 3, 5, 7, 10], optionLabels: ['45+', '35-44', '30-34', '25-29', '18-24'] },
      { id: 'risk_1', subcategory: 'riskCost', text: 'How emotionally stable and predictable are you?', weight: 1.0, reverseScore: true, options: [1, 3, 5, 7, 10], optionLabels: ['Very volatile; unpredictable', 'Often unstable', 'Moderately stable', 'Generally stable', 'Very stable; highly predictable'] },
      { id: 'risk_2', subcategory: 'riskCost', text: 'How present are red flags (substance abuse, mental health issues, destructive patterns)?', weight: 1.0, reverseScore: true, options: [1, 3, 5, 7, 10], optionLabels: ['Multiple severe', 'Several moderate', 'A few minor', 'Very few', 'None significant'] }
    ]
  }
};

/** Market segmentation thresholds (Keeper/Sleeper/Sweeper) */
export const MARKET_SEGMENTS = [
  { min: 80, label: 'Top Tier Keeper (Top 20%)', femaleLabel: 'Top Tier (High Mate Value)' },
  { min: 60, label: 'Keeper Material (Above Average)', femaleLabel: 'Above Average (Strong Options)' },
  { min: 40, label: 'Sleeper Zone (Average)', femaleLabel: 'Average (Decent Options)' },
  { min: 20, label: 'Sweeper Territory (Below Average)', femaleLabel: 'Below Average (Limited Options)' },
  { min: 0, label: 'Bottom Quintile (Critical Development)', femaleLabel: 'Bottom Quintile (Critical Development)' }
];

/** Developmental levels (Hoe_math) */
export const DEVELOPMENTAL_LEVELS = [
  { min: 80, label: 'Integral/Holistic (High Integration)' },
  { min: 65, label: 'Achievement-Oriented (Rational/Strategic)' },
  { min: 50, label: 'Conformist (Rule-Following)' },
  { min: 35, label: 'Egocentric (Reactive/Impulsive)' },
  { min: 0, label: 'Survival Mode (Basic Needs Focus)' }
];
