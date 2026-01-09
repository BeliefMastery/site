// Sovereignty Paradigms - 18 distinct philosophical/spiritual frameworks
// Each paradigm includes ideals, values, intents, subsets, and derailer hooks

export const SOVEREIGNTY_PARADIGMS = [
  // ========== PHILOSOPHICAL (ANCIENT) ==========
  {
    id: 'stoicism',
    name: 'Stoicism',
    description: 'Self-mastery through rational control of responses to externals.',
    ideals: ['Virtue as the sole good', 'Acceptance of fate (amor fati)', 'Cosmopolitan duty'],
    values: ['Wisdom', 'Courage', 'Justice', 'Temperance'],
    intents: ['Align actions with nature/reason', 'Cultivate inner citadel', 'Maintain equanimity'],
    subsets: [
      { name: 'Roman Stoicism', emphasis: 'Practical ethics (Epictetus: Focus on dichotomies of control)' },
      { name: 'Hellenistic Stoicism', emphasis: 'Cosmopolitan duty (Zeno: Universal brotherhood)' },
      { name: 'Modern Stoicism', emphasis: 'CBT integration (Epictetus via therapy)' }
    ],
    hypocrisyIndicators: ['Proclaiming virtue while indulging impulses', 'Selective application of control', 'Preach endurance, avoid pain'],
    reluctanceHooks: ['Avoidance of discomfort (e.g., skipping daily reflection)', 'Skip reflections', 'Resist facing difficult truths'],
    nihilismHooks: ['Dismissing externals as meaningless without effort', 'Fate as excuse for inaction', 'Resignation without purpose'],
    questions: [
      { id: 'stoic_1', text: 'I view external events as opportunities for virtue practice', type: 'likert', weight: 1.2 },
      { id: 'stoic_2', text: 'I regularly practice distinguishing what I can control from what I cannot', type: 'likert', weight: 1.0 },
      { id: 'stoic_3', text: 'I maintain equanimity in the face of adversity', type: 'likert', weight: 1.1 },
      { id: 'stoic_4', text: 'I align my actions with rational principles rather than emotional impulses', type: 'likert', weight: 1.0 },
      { id: 'stoic_5', text: 'I see myself as part of a larger cosmic order with duties to others', type: 'likert', weight: 0.9 }
    ],
    weight: 1.2
  },
  {
    id: 'epicureanism',
    name: 'Epicureanism',
    description: 'Tranquil pleasure via limits and moderation.',
    ideals: ['Ataraxia (freedom from disturbance)', 'Aponia (absence of pain)', 'Simple pleasures'],
    values: ['Prudence', 'Friendship', 'Moderation', 'Tranquility'],
    intents: ['Maximize pleasure through minimizing pain', 'Cultivate simple, sustainable joys', 'Avoid unnecessary desires'],
    subsets: [
      { name: 'Prudence School', emphasis: 'Moderation and calculated pleasure' },
      { name: 'Garden Sect', emphasis: 'Simple living and friendship' }
    ],
    hypocrisyIndicators: ['Seek pleasure covertly', 'Claim moderation while indulging', 'Preach simplicity while accumulating'],
    reluctanceHooks: ['Over-indulge comforts', 'Avoid necessary discomforts', 'Defer difficult decisions'],
    nihilismHooks: ['Pleasure-seeking without meaning', 'Hedonism as escape from purpose'],
    questions: [
      { id: 'epic_1', text: 'I prioritize long-term tranquility over short-term gratification', type: 'likert', weight: 1.1 },
      { id: 'epic_2', text: 'I find deep satisfaction in simple pleasures and friendships', type: 'likert', weight: 1.0 },
      { id: 'epic_3', text: 'I actively limit my desires to avoid unnecessary suffering', type: 'likert', weight: 1.0 },
      { id: 'epic_4', text: 'I avoid pain and disturbance through careful planning', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'cynicism',
    name: 'Cynicism',
    description: 'Radical self-sufficiency and rejection of conventional norms.',
    ideals: ['Freedom from convention', 'Natural living', 'Virtue through simplicity'],
    values: ['Autonomy', 'Authenticity', 'Self-sufficiency', 'Defiance'],
    intents: ['Live according to nature, not convention', 'Reject artificial needs', 'Cultivate radical independence'],
    subsets: [
      { name: 'Diogenic Cynicism', emphasis: 'Ascetic defiance and shamelessness' },
      { name: 'Urban Cynicism', emphasis: 'Social critique and anti-establishment' }
    ],
    hypocrisyIndicators: ['Claim independence while dependent', 'Reject norms while conforming', 'Preach simplicity while accumulating'],
    reluctanceHooks: ['Avoid necessary social engagement', 'Resist practical compromises'],
    nihilismHooks: ['Reject norms without purpose', 'Defiance without direction', 'Cynicism as excuse for inaction'],
    questions: [
      { id: 'cynic_1', text: 'I actively reject conventional norms that feel artificial', type: 'likert', weight: 1.0 },
      { id: 'cynic_2', text: 'I prioritize self-sufficiency over social approval', type: 'likert', weight: 1.1 },
      { id: 'cynic_3', text: 'I find virtue in living simply and authentically', type: 'likert', weight: 1.0 }
    ],
    weight: 0.9
  },

  // ========== PHILOSOPHICAL (MODERN) ==========
  {
    id: 'existentialism',
    name: 'Existentialism',
    description: 'Authentic self-creation through radical freedom and responsibility.',
    ideals: ['Existence precedes essence', 'Authentic choice', 'Radical freedom'],
    values: ['Authenticity', 'Freedom', 'Responsibility', 'Individuality'],
    intents: ['Create meaning through authentic choices', 'Embrace freedom despite anxiety', 'Take responsibility for existence'],
    subsets: [
      { name: 'Sartrean Existentialism', emphasis: 'Atheist freedom and bad faith' },
      { name: 'Kierkegaardian Existentialism', emphasis: 'Faith leap and subjective truth' },
      { name: 'Camusian Absurdism', emphasis: 'Absurd rebellion and meaning creation' }
    ],
    hypocrisyIndicators: ['Conform while claiming freedom', 'Avoid responsibility while preaching authenticity', 'Claim individuality while following trends'],
    reluctanceHooks: ['Bad faith avoidance', 'Resist making defining choices', 'Avoid commitment due to anxiety'],
    nihilismHooks: ['Freedom without purpose', 'Meaninglessness as excuse', 'Existential dread paralyzes action'],
    questions: [
      { id: 'exist_1', text: 'I believe I create my own meaning through authentic choices', type: 'likert', weight: 1.2 },
      { id: 'exist_2', text: 'I embrace the anxiety of freedom rather than avoiding it', type: 'likert', weight: 1.0 },
      { id: 'exist_3', text: 'I take full responsibility for my existence and choices', type: 'likert', weight: 1.1 },
      { id: 'exist_4', text: 'I resist bad faith and inauthentic living', type: 'likert', weight: 1.0 },
      { id: 'exist_5', text: 'I find meaning in the act of choosing itself', type: 'likert', weight: 0.9 }
    ],
    weight: 1.2
  },
  {
    id: 'kantian_deontology',
    name: 'Kantian Deontology',
    description: 'Rational autonomy via duty and universal moral law.',
    ideals: ['Categorical imperative', 'Universalizable maxims', 'Rational autonomy'],
    values: ['Duty', 'Rationality', 'Universalizability', 'Respect for persons'],
    intents: ['Act from duty, not inclination', 'Universalize moral principles', 'Respect rational autonomy'],
    subsets: [
      { name: 'Neo-Kantian', emphasis: 'Self-constitution and practical reason' },
      { name: 'Classical Kantian', emphasis: 'Categorical imperative and moral law' }
    ],
    hypocrisyIndicators: ['Universalize rules selectively', 'Claim duty while acting from inclination', 'Preach universalizability while making exceptions'],
    reluctanceHooks: ['Avoid difficult moral decisions', 'Resist applying principles consistently'],
    nihilismHooks: ['Duty without meaning', 'Moral law as empty formalism'],
    questions: [
      { id: 'kant_1', text: 'I act from duty rather than personal inclination', type: 'likert', weight: 1.1 },
      { id: 'kant_2', text: 'I test my actions by asking if they could be universalized', type: 'likert', weight: 1.0 },
      { id: 'kant_3', text: 'I respect others as ends in themselves, not means', type: 'likert', weight: 1.1 },
      { id: 'kant_4', text: 'I prioritize rational moral principles over consequences', type: 'likert', weight: 1.0 }
    ],
    weight: 1.1
  },
  {
    id: 'utilitarianism',
    name: 'Utilitarianism',
    description: 'Maximized liberty and well-being through greatest good for greatest number.',
    ideals: ['Greatest happiness principle', 'Harm reduction', 'Consequentialist ethics'],
    values: ['Utility', 'Happiness', 'Well-being', 'Harm prevention'],
    intents: ['Maximize overall well-being', 'Minimize suffering', 'Promote greatest good'],
    subsets: [
      { name: 'Rule Utilitarianism', emphasis: 'Mill: Harm principle and general rules' },
      { name: 'Act Utilitarianism', emphasis: 'Bentham: Hedonic calculation per action' }
    ],
    hypocrisyIndicators: ['Prioritize personal utility over general', 'Claim greatest good while acting selfishly'],
    reluctanceHooks: ['Prioritize short-term utility', 'Avoid difficult utility calculations', 'Defer to immediate gratification'],
    nihilismHooks: ['Utility without meaning', 'Hedonism as ultimate value'],
    questions: [
      { id: 'util_1', text: 'I evaluate actions based on their consequences for overall well-being', type: 'likert', weight: 1.0 },
      { id: 'util_2', text: 'I prioritize reducing suffering and maximizing happiness', type: 'likert', weight: 1.1 },
      { id: 'util_3', text: 'I consider the impact of my actions on the greatest number', type: 'likert', weight: 1.0 },
      { id: 'util_4', text: 'I balance individual liberty with collective well-being', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'libertarianism',
    name: 'Libertarianism',
    description: 'Absolute self-ownership and minimal state intervention.',
    ideals: ['Self-ownership', 'Non-aggression principle', 'Voluntary exchange'],
    values: ['Liberty', 'Property rights', 'Individual sovereignty', 'Non-coercion'],
    intents: ['Maximize individual freedom', 'Minimize state power', 'Protect property rights'],
    subsets: [
      { name: 'Anarcho-Capitalist', emphasis: 'Rothbard: No state, pure market' },
      { name: 'Minarchist', emphasis: 'Limited government for protection only' }
    ],
    hypocrisyIndicators: ['Claim freedom while supporting coercion', 'Preach self-ownership while dependent'],
    reluctanceHooks: ['Avoid taking full responsibility', 'Defer to authority despite principles'],
    nihilismHooks: ['Freedom without responsibility', 'Liberty as excuse for inaction', 'Self-ownership without purpose'],
    questions: [
      { id: 'lib_1', text: 'I believe in absolute self-ownership and property rights', type: 'likert', weight: 1.1 },
      { id: 'lib_2', text: 'I oppose state coercion and support voluntary exchange', type: 'likert', weight: 1.0 },
      { id: 'lib_3', text: 'I prioritize individual liberty over collective goals', type: 'likert', weight: 1.0 },
      { id: 'lib_4', text: 'I take full responsibility for my choices and their consequences', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },

  // ========== SPIRITUAL/RELIGIOUS ==========
  {
    id: 'buddhism',
    name: 'Buddhism',
    description: 'Detachment from suffering through awareness and non-attachment.',
    ideals: ['Nirvana (cessation of suffering)', 'Four Noble Truths', 'Eightfold Path'],
    values: ['Compassion', 'Mindfulness', 'Non-attachment', 'Wisdom'],
    intents: ['End suffering through awareness', 'Cultivate compassion', 'Practice non-attachment'],
    subsets: [
      { name: 'Theravada Buddhism', emphasis: 'Individual enlightenment and meditation' },
      { name: 'Mahayana Buddhism', emphasis: 'Compassionate bodhisattva and universal salvation' },
      { name: 'Zen Buddhism', emphasis: 'Direct insight and present-moment awareness' }
    ],
    hypocrisyIndicators: ['Meditate but cling', 'Preach compassion while judging', 'Claim non-attachment while accumulating'],
    reluctanceHooks: ['Avoid karma work', 'Skip meditation practice', 'Resist facing suffering'],
    nihilismHooks: ['Detachment as escape', 'Non-attachment as meaninglessness'],
    questions: [
      { id: 'budd_1', text: 'I practice mindfulness and awareness of present-moment experience', type: 'likert', weight: 1.1 },
      { id: 'budd_2', text: 'I work to reduce attachment and craving', type: 'likert', weight: 1.0 },
      { id: 'budd_3', text: 'I cultivate compassion for all beings', type: 'likert', weight: 1.1 },
      { id: 'budd_4', text: 'I see suffering as arising from attachment and can be ended', type: 'likert', weight: 1.0 },
      { id: 'budd_5', text: 'I follow ethical principles (right speech, action, livelihood)', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'taoism',
    name: 'Taoism',
    description: 'Effortless harmony (wu wei) through alignment with natural flow.',
    ideals: ['Wu wei (non-action)', 'Natural spontaneity', 'Yin-yang balance'],
    values: ['Harmony', 'Simplicity', 'Naturalness', 'Balance'],
    intents: ['Flow with natural order', 'Act without forcing', 'Maintain balance'],
    subsets: [
      { name: 'Philosophical Taoism', emphasis: 'Laozi: Natural flow and simplicity' },
      { name: 'Religious Taoism', emphasis: 'Immortality quests and alchemy' }
    ],
    hypocrisyIndicators: ['Force outcomes while preaching wu wei', 'Claim simplicity while complicating'],
    reluctanceHooks: ['Resist natural flow', 'Force outcomes through effort'],
    nihilismHooks: ['Passivity as surrender', 'Non-action as meaninglessness', 'Flow without direction'],
    questions: [
      { id: 'tao_1', text: 'I act in alignment with natural flow rather than forcing outcomes', type: 'likert', weight: 1.0 },
      { id: 'tao_2', text: 'I value simplicity and naturalness over complexity', type: 'likert', weight: 1.0 },
      { id: 'tao_3', text: 'I seek balance and harmony in all things', type: 'likert', weight: 1.0 },
      { id: 'tao_4', text: 'I practice wu wei (effortless action)', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'christianity',
    name: 'Christianity',
    description: 'Divine free will alignment through grace and love.',
    ideals: ['Divine love (agape)', 'Grace and redemption', 'Service to others'],
    values: ['Love', 'Faith', 'Hope', 'Charity'],
    intents: ['Align will with divine will', 'Love God and neighbor', 'Serve others'],
    subsets: [
      { name: 'Augustinian Christianity', emphasis: 'Grace-enabled will and predestination' },
      { name: 'Arminian Christianity', emphasis: 'Human choice and free will' },
      { name: 'Calvinist Christianity', emphasis: 'Predestination tension and divine sovereignty' }
    ],
    hypocrisyIndicators: ['Profess love, judge others', 'Claim grace while condemning', 'Preach service while self-serving'],
    reluctanceHooks: ['Avoid difficult acts of love', 'Resist divine calling'],
    nihilismHooks: ['Grace without responsibility', 'Faith without works'],
    questions: [
      { id: 'christ_1', text: 'I seek to align my will with divine will', type: 'likert', weight: 1.1 },
      { id: 'christ_2', text: 'I practice love (agape) toward all, including enemies', type: 'likert', weight: 1.1 },
      { id: 'christ_3', text: 'I serve others as an expression of faith', type: 'likert', weight: 1.0 },
      { id: 'christ_4', text: 'I trust in grace and redemption', type: 'likert', weight: 1.0 },
      { id: 'christ_5', text: 'I find meaning in relationship with the divine', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'humanism',
    name: 'Humanism',
    description: 'Reasoned self-fulfillment through human potential and dignity.',
    ideals: ['Human dignity', 'Rational inquiry', 'Ethical living without deity'],
    values: ['Reason', 'Compassion', 'Human potential', 'Ethical responsibility'],
    intents: ['Cultivate human potential', 'Promote human dignity', 'Live ethically through reason'],
    subsets: [
      { name: 'Secular Humanism', emphasis: 'Evidence-based ethics and reason' },
      { name: 'Religious Humanism', emphasis: 'Spiritual without deity, human-centered' }
    ],
    hypocrisyIndicators: ['Claim reason while following dogma', 'Preach dignity while dehumanizing'],
    reluctanceHooks: ['Defer to dogma', 'Avoid rational inquiry', 'Resist ethical responsibility'],
    nihilismHooks: ['Reason without meaning', 'Humanism as empty optimism'],
    questions: [
      { id: 'human_1', text: 'I believe in human dignity and potential', type: 'likert', weight: 1.0 },
      { id: 'human_2', text: 'I use reason and evidence to guide ethical decisions', type: 'likert', weight: 1.1 },
      { id: 'human_3', text: 'I promote human flourishing and well-being', type: 'likert', weight: 1.0 },
      { id: 'human_4', text: 'I find meaning in human connection and progress', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },

  // ========== PSYCHOLOGICAL/SELF-HELP ==========
  {
    id: 'positive_psychology',
    name: 'Positive Psychology',
    description: 'Resilience via flow states and character strengths.',
    ideals: ['PERMA model (Positive emotion, Engagement, Relationships, Meaning, Accomplishment)', 'Flow states', 'Character strengths'],
    values: ['Resilience', 'Optimism', 'Strengths', 'Well-being'],
    intents: ['Cultivate positive emotions', 'Engage in flow activities', 'Build character strengths'],
    subsets: [
      { name: 'Seligman PERMA', emphasis: 'Well-being model and flourishing' },
      { name: 'Csikszentmihalyi Flow', emphasis: 'Optimal experience and engagement' }
    ],
    hypocrisyIndicators: ['Affirm strengths, ignore shadows', 'Preach optimism while pessimistic', 'Claim resilience while avoiding challenges'],
    reluctanceHooks: ['Avoid difficult emotions', 'Resist shadow work', 'Defer to negative patterns'],
    nihilismHooks: ['Positivity as denial', 'Optimism without depth'],
    questions: [
      { id: 'pos_1', text: 'I actively cultivate positive emotions and experiences', type: 'likert', weight: 1.0 },
      { id: 'pos_2', text: 'I seek flow states through engaging activities', type: 'likert', weight: 1.0 },
      { id: 'pos_3', text: 'I build on my character strengths', type: 'likert', weight: 1.0 },
      { id: 'pos_4', text: 'I prioritize relationships and meaning in my life', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },
  {
    id: 'cognitive_behavioral',
    name: 'Cognitive Behavioral',
    description: 'Thought-reframing sovereignty through identifying and changing cognitive distortions.',
    ideals: ['Thoughts shape reality', 'Cognitive restructuring', 'Behavioral change'],
    values: ['Rationality', 'Evidence', 'Practicality', 'Self-efficacy'],
    intents: ['Identify cognitive distortions', 'Reframe negative thoughts', 'Change maladaptive behaviors'],
    subsets: [
      { name: 'Ellis REBT', emphasis: 'Irrational beliefs and disputation' },
      { name: 'Beck CBT', emphasis: 'Distortion detection and cognitive restructuring' }
    ],
    hypocrisyIndicators: ['Identify others\' distortions, ignore own', 'Preach rationality while emotional'],
    reluctanceHooks: ['Habitual negative loops', 'Resist challenging beliefs', 'Avoid behavioral change'],
    nihilismHooks: ['Thoughts without meaning', 'CBT as empty technique'],
    questions: [
      { id: 'cbt_1', text: 'I identify and challenge cognitive distortions in my thinking', type: 'likert', weight: 1.1 },
      { id: 'cbt_2', text: 'I reframe negative thoughts using evidence and rationality', type: 'likert', weight: 1.0 },
      { id: 'cbt_3', text: 'I change behaviors to align with rational thinking', type: 'likert', weight: 1.0 },
      { id: 'cbt_4', text: 'I use practical techniques to manage thoughts and emotions', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'mindfulness_secular',
    name: 'Mindfulness (Secular)',
    description: 'Present-moment agency through non-judgmental awareness.',
    ideals: ['Present-moment awareness', 'Non-judgmental observation', 'Acceptance'],
    values: ['Awareness', 'Acceptance', 'Presence', 'Equanimity'],
    intents: ['Cultivate present-moment awareness', 'Observe without judgment', 'Accept experience as it is'],
    subsets: [
      { name: 'Kabat-Zinn MBSR', emphasis: 'Stress reduction and mindfulness-based intervention' },
      { name: 'Insight Meditation', emphasis: 'Vipassana roots and direct insight' }
    ],
    hypocrisyIndicators: ['Meditate but avoid difficult emotions', 'Claim acceptance while judging'],
    reluctanceHooks: ['Skip meditation practice', 'Avoid difficult experiences'],
    nihilismHooks: ['Observe without acting', 'Awareness without purpose', 'Acceptance as passivity'],
    questions: [
      { id: 'mind_1', text: 'I practice present-moment awareness regularly', type: 'likert', weight: 1.1 },
      { id: 'mind_2', text: 'I observe my experience without judgment', type: 'likert', weight: 1.0 },
      { id: 'mind_3', text: 'I accept experiences as they are, without resistance', type: 'likert', weight: 1.0 },
      { id: 'mind_4', text: 'I use mindfulness to respond skillfully rather than react', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },

  // ========== COUNTER/EDGE PARADIGMS ==========
  {
    id: 'nihilism',
    name: 'Nihilism',
    description: 'Meaninglessness as liberation or resignation.',
    ideals: ['Meaninglessness', 'Absence of inherent value', 'Freedom from meaning'],
    values: ['Honesty', 'Radical acceptance', 'Liberation', 'Authenticity'],
    intents: ['Face meaninglessness honestly', 'Create values despite void', 'Liberate from false meaning'],
    subsets: [
      { name: 'Passive Nihilism', emphasis: 'Schopenhauer: Resignation and withdrawal' },
      { name: 'Active Nihilism', emphasis: 'Nietzsche: Value creation despite void' }
    ],
    hypocrisyIndicators: ['Claim meaninglessness while seeking meaning', 'Preach honesty while self-deceiving'],
    reluctanceHooks: ['Reluctance via despair', 'Avoid value creation', 'Resist action'],
    nihilismHooks: ['Meaninglessness paralyzes', 'Void as excuse', 'Despair without purpose'],
    questions: [
      { id: 'nihil_1', text: 'I honestly face the meaninglessness of existence', type: 'likert', weight: 1.0 },
      { id: 'nihil_2', text: 'I see liberation in the absence of inherent meaning', type: 'likert', weight: 1.0 },
      { id: 'nihil_3', text: 'I create values despite recognizing the void', type: 'likert', weight: 1.1 },
      { id: 'nihil_4', text: 'I resist false meaning and self-deception', type: 'likert', weight: 1.0 }
    ],
    weight: 0.9
  },
  {
    id: 'postmodern_relativism',
    name: 'Postmodern Relativism',
    description: 'Fluid, deconstructed self through power critique and deconstruction.',
    ideals: ['Deconstruction of truth', 'Power critique', 'Fluid identity'],
    values: ['Skepticism', 'Critique', 'Fluidity', 'Resistance'],
    intents: ['Deconstruct dominant narratives', 'Critique power structures', 'Embrace fluid identity'],
    subsets: [
      { name: 'Foucauldian', emphasis: 'Power critique and discourse analysis' },
      { name: 'Derridean', emphasis: 'Deconstruction and différance' }
    ],
    hypocrisyIndicators: ['Deconstruct others\' truths, hold own', 'Claim fluidity while fixed', 'Preach critique while conforming'],
    reluctanceHooks: ['Endless skepticism paralyzes', 'Avoid commitment due to relativism', 'Resist action'],
    nihilismHooks: ['Relativism as meaninglessness', 'Deconstruction without reconstruction'],
    questions: [
      { id: 'post_1', text: 'I question dominant narratives and power structures', type: 'likert', weight: 1.0 },
      { id: 'post_2', text: 'I see truth as constructed rather than absolute', type: 'likert', weight: 1.0 },
      { id: 'post_3', text: 'I embrace fluid and deconstructed identity', type: 'likert', weight: 1.0 },
      { id: 'post_4', text: 'I resist fixed categories and essentialism', type: 'likert', weight: 0.9 }
    ],
    weight: 0.9
  },
  {
    id: 'absurdism',
    name: 'Absurdism',
    description: 'Revolt against void through defiant meaning creation.',
    ideals: ['Absurd recognition', 'Defiant rebellion', 'Meaning despite meaninglessness'],
    values: ['Defiance', 'Rebellion', 'Authenticity', 'Courage'],
    intents: ['Recognize the absurd', 'Rebel against meaninglessness', 'Create meaning through revolt'],
    subsets: [
      { name: 'Camusian Absurdism', emphasis: 'Sisyphus defiance and rebellion' },
      { name: 'Ecstatic Absurdism', emphasis: 'Embrace chaos and absurdity' }
    ],
    hypocrisyIndicators: ['Rebel then conform', 'Claim defiance while avoiding', 'Preach rebellion while passive'],
    reluctanceHooks: ['Avoid absurd recognition', 'Resist rebellion', 'Conform despite principles'],
    nihilismHooks: ['Nihilism baseline', 'Absurd without revolt', 'Meaninglessness without defiance'],
    questions: [
      { id: 'absurd_1', text: 'I recognize the absurd tension between human need for meaning and universe\'s silence', type: 'likert', weight: 1.1 },
      { id: 'absurd_2', text: 'I rebel against meaninglessness through defiant action', type: 'likert', weight: 1.1 },
      { id: 'absurd_3', text: 'I create meaning through the act of revolt itself', type: 'likert', weight: 1.0 },
      { id: 'absurd_4', text: 'I find value in defiance despite recognizing the void', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  }
];

