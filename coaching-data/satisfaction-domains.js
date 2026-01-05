// 10 Satisfaction Domains
// Based on Chapter 1 of Sovereign of Mind

export const SATISFACTION_DOMAINS = {
  family: {
    id: 'family',
    name: 'Family',
    description: 'Quality and depth of family relationships, communication, and connection.',
    aspects: [
      'Time with Family',
      'Wisdom and Stories Transferred',
      'Size and Dynamic of Family',
      'Health of Family Members',
      'Cultural Harmony',
      'Reconciliation of Grievances',
      'Quality of Communication',
      'Regularity of Communication'
    ],
    weight: 1.0
  },
  social_life: {
    id: 'social_life',
    name: 'Social Life',
    description: 'Friendships, social connections, and community engagement.',
    aspects: [
      'Real Friends (not just acquaintances)',
      'Variety of Activities',
      'Frequency of Meet-ups',
      'Confidence in Groups',
      'Opportunities to Meet New People (without substance use)',
      'Time Available for Social Life',
      'Intimate Environments (your small, close gatherings)',
      'Public Environments (events, parties, large groups)',
      'Diverse Friendships (variety of perspectives, ages, cultures)'
    ],
    weight: 1.0
  },
  intimate_relationship: {
    id: 'intimate_relationship',
    name: 'Intimate Relationship',
    description: 'Depth, quality, and satisfaction in primary romantic/intimate partnership.',
    aspects: [
      'Time Together',
      'Dreams & Desires Prioritized',
      'Addressing & Acknowledging Depression & Addiction',
      'Non-Violent Communication',
      'Shared/Agreed Upon Roles, Chores, Responsibilities',
      'Relationship Prioritized',
      'Emotional Support',
      'Sexual Satisfaction',
      'Emotional Intimacy (depth of connection)',
      'Space & Boundaries (respecting autonomy)'
    ],
    weight: 1.2
  },
  growth_learning_spirituality: {
    id: 'growth_learning_spirituality',
    name: 'Growth, Learning, Spirituality',
    description: 'Intellectual stimulation, spiritual development, and personal growth.',
    aspects: [
      'Stimulation (Reading, Lectures, Audio-books)',
      'Contemplation & Discussion (not entertainment-focused)',
      'Attempting New Things around Others',
      'Access to \'Sacred\' Space (other than bedroom)',
      'Communion with Others in Shared Focus',
      'Exploration of the Natural World',
      'Awareness, Comfort & Stability of Internal World',
      'Confidence & Inclination for Challenge',
      'Creativity & Self-Initiated Learning (drive to explore without external pressure)'
    ],
    weight: 1.1
  },
  freedom_passions_creativity: {
    id: 'freedom_passions_creativity',
    name: 'Freedom, Passions, Creativity, Expression',
    description: 'Freedom to pursue passions, creative expression, and authentic self-expression.',
    aspects: [
      'Totally Free Time without Responsibility & Expectations',
      'Excitability & Enthusiasm (not reluctant or resigned)',
      'Comfort Holding Eye-Contact',
      'Pride in Activity & Accomplishment',
      'Hobbies',
      'Art',
      'Authenticity (not concealing, faking, or pretending)',
      'Confidence, Flow',
      'Risk-taking in Expression (pushing creative boundaries)'
    ],
    weight: 1.1
  },
  work_life_balance: {
    id: 'work_life_balance',
    name: 'Work-Life Balance, Financial Security, Job Satisfaction',
    description: 'Balance between work and personal life, financial security, and job fulfillment.',
    aspects: [
      'Service, Products, Offerings',
      'Pricing',
      'Confident Communication & Embodiment',
      'Advertising, Sales, Promotion',
      'Client Care',
      'Industry/Business Relations',
      'Organization, Discipline, Scheduling',
      'Bookkeeping',
      'Delegation & Support Systems (ability to rely on others)'
    ],
    weight: 1.2
  },
  mental_health: {
    id: 'mental_health',
    name: 'Mental Health',
    description: 'Psychological well-being, meaning, and mental clarity.',
    aspects: [
      'Meaningfulness in Daily Life',
      'Sleep Routine',
      'Clean Diet',
      'Regular Exercise',
      'Time with the Natural World',
      'Time with Others',
      'Emotional Integration & Expression',
      'Clarity on Your Patterns & Strategy for Managing',
      'Support Systems (therapy, counselling, or peer support)'
    ],
    weight: 1.3
  },
  physical_health: {
    id: 'physical_health',
    name: 'Physical Health & Vitality',
    description: 'Physical well-being, energy, and bodily health.',
    aspects: [
      'Hygiene',
      'Optimal Rest',
      'Optimal Diet & Hydration',
      'Air Quality & Breathing',
      'Strength Training & Regular Exercise',
      'Structure, Alignment, Technique',
      'Flexibility, Stretching, Freedom from Tightness or Stiffness',
      'Optimal Tech Interfacing, Eye Health, Avoiding RSI',
      'Mobility (freedom of movement, absence of chronic pain)'
    ],
    weight: 1.2
  },
  emotional_health: {
    id: 'emotional_health',
    name: 'Emotional Health',
    description: 'Emotional regulation, expression, and well-being.',
    aspects: [
      'Emotional Intensity (ability to feel deeply and openly)',
      'Capacity for Forgiveness',
      'Self-Compassion',
      'Navigating Conflict',
      'Resilience in Stressful Situations',
      'Intimacy & Connection',
      'Recognition of Unmet Emotional Needs',
      'Balance between Emotional Expression and Rational Thought'
    ],
    weight: 1.1
  },
  environmental: {
    id: 'environmental',
    name: 'Environmental & Living Space',
    description: 'Quality of living environment, safety, and physical space.',
    aspects: [
      'Organization & Cleanliness of Living Space',
      'Access to Nature or Green Spaces',
      'Personal Space (free from clutter, chaos)',
      'Light, Air Quality, and Temperature Control',
      'Space to Practice Hobbies/Creativity',
      'Workspace Comfort (ergonomics, aesthetics)',
      'Connection to Community',
      'Sense of Security and Safety in Environment'
    ],
    weight: 0.9
  }
};

