// Sovereignty Paradigms - 25 distinct philosophical/spiritual frameworks
// Each paradigm includes ideals, values, intents, subsets, and derailer hooks
// Expanded from 18 to 25 to cover: Ancient philosophy (Aristotelianism), Modern sovereignty models (Hierarchical, Anarchism, Neoreaction, EA), 
// Eastern traditions (Confucianism), Abrahamic religion (Islam), and Ecological frameworks (Deep Ecology)

export const SOVEREIGNTY_PARADIGMS = [
  // ========== PHILOSOPHICAL (ANCIENT) ==========
  {
    id: 'aristotelianism',
    name: 'Aristotelianism',
    description: 'Sovereignty through eudaimonic excellence and virtuous habit. Can become rigid adherence to cultural norms masquerading as virtue, or an endless quest for perfection that prevents action, potentially leading to virtue signaling without genuine character development.',
    ideals: ['Eudaimonia (flourishing)', 'Virtue as excellence (arete)', 'Golden mean between extremes'],
    values: ['Excellence', 'Practical wisdom (phronesis)', 'Virtuous habit', 'Telos (purpose)'],
    intents: ['Cultivate virtuous habits', 'Develop practical wisdom', 'Achieve eudaimonic flourishing'],
    subsets: [
      { name: 'Virtue Ethics', emphasis: 'Character development over rule-following' },
      { name: 'Telos-Focused', emphasis: 'Purpose-driven excellence' },
      { name: 'Golden Mean', emphasis: 'Balance between extremes' }
    ],
    hypocrisyIndicators: ['Claim virtue but neglect practice; "Excellence (arete) guides me... but skip habits"', 'Preach excellence while avoiding challenges; virtue signaling without character development'],
    reluctanceHooks: ['Know excellent path but don\'t habituate; "Phronesis demands action, yet I procrastinate"', 'Avoid necessary challenges for growth; resist developing practical wisdom'],
    nihilismHooks: ['Virtue as arbitrary construct; "Flourishing is illusion in chaotic reality"', 'Excellence without meaning; eudaimonia as empty goal'],
    questions: [
      { id: 'arist_1', text: 'I actively cultivate virtuous habits through consistent practice', type: 'likert', weight: 1.1 },
      { id: 'arist_2', text: 'I seek the golden mean between extremes in my decisions', type: 'likert', weight: 1.0 },
      { id: 'arist_3', text: 'I develop practical wisdom through experience and reflection', type: 'likert', weight: 1.1 },
      { id: 'arist_4', text: 'I pursue excellence (arete) as the path to flourishing (eudaimonia)', type: 'likert', weight: 1.0 },
      { id: 'arist_5', text: 'I understand my telos (purpose) and align actions toward it', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'stoicism',
    name: 'Stoicism',
    description: 'Self-mastery through rational control of responses to externals. Requires constant vigilance against emotional suppression and can lead to emotional detachment or resignation when taken to extremes.',
    ideals: ['Virtue as the sole good', 'Acceptance of fate (amor fati)', 'Cosmopolitan duty'],
    values: ['Wisdom', 'Courage', 'Justice', 'Temperance'],
    intents: ['Align actions with nature/reason', 'Cultivate inner citadel', 'Maintain equanimity'],
    subsets: [
      { name: 'Roman Stoicism', emphasis: 'Practical ethics (Epictetus: Focus on dichotomies of control)' },
      { name: 'Hellenistic Stoicism', emphasis: 'Cosmopolitan duty (Zeno: Universal brotherhood)' },
      { name: 'Modern Stoicism', emphasis: 'CBT integration (Epictetus via therapy)' }
    ],
    hypocrisyIndicators: ['Preach virtue but indulge impulses; "I control responses... but rage at inconveniences"', 'Selective application of control; preach endurance, avoid pain'],
    reluctanceHooks: ['Avoidance of discomfort; skip daily reflections despite preaching endurance', 'Skip reflections; resist facing difficult truths'],
    nihilismHooks: ['Fate as meaningless excuse; "Externals don\'t matter, so why effort?"', 'Resignation without purpose; dismissing externals as meaningless without effort'],
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
    description: 'Tranquil pleasure via limits and moderation. Can devolve into passive comfort-seeking or avoidance of necessary challenges, potentially limiting growth and meaningful engagement with life\'s difficulties.',
    ideals: ['Ataraxia (freedom from disturbance)', 'Aponia (absence of pain)', 'Simple pleasures'],
    values: ['Prudence', 'Friendship', 'Moderation', 'Tranquility'],
    intents: ['Maximize pleasure through minimizing pain', 'Cultivate simple, sustainable joys', 'Avoid unnecessary desires'],
    subsets: [
      { name: 'Prudence School', emphasis: 'Moderation and calculated pleasure' },
      { name: 'Garden Sect', emphasis: 'Simple living and friendship' }
    ],
    hypocrisyIndicators: ['Seek pleasure covertly while claiming limits; "Moderation is key... but over-indulge comforts"', 'Preach simplicity while accumulating; claim moderation while indulging'],
    reluctanceHooks: ['Over-reliance on short-term comforts; delay prudent choices', 'Avoid necessary discomforts; defer difficult decisions'],
    nihilismHooks: ['Pleasures as fleeting illusions; "All joys fade to void anyway"', 'Hedonism as escape from purpose; pleasure-seeking without meaning'],
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
    description: 'Radical self-sufficiency and rejection of conventional norms. Risks isolation, social alienation, and can become an excuse for avoiding necessary cooperation or meaningful engagement with society.',
    ideals: ['Freedom from convention', 'Natural living', 'Virtue through simplicity'],
    values: ['Autonomy', 'Authenticity', 'Self-sufficiency', 'Defiance'],
    intents: ['Live according to nature, not convention', 'Reject artificial needs', 'Cultivate radical independence'],
    subsets: [
      { name: 'Diogenic Cynicism', emphasis: 'Ascetic defiance and shamelessness' },
      { name: 'Urban Cynicism', emphasis: 'Social critique and anti-establishment' }
    ],
    hypocrisyIndicators: ['Reject conventions publicly but conform privately; "Authenticity above all... but chase status"', 'Claim independence while dependent; reject norms while conforming'],
    reluctanceHooks: ['Hesitate on bold defiance; "I know norms trap me but stay comfortable"', 'Avoid necessary social engagement; resist practical compromises'],
    nihilismHooks: ['Defiance without purpose; "Nothing\'s worth the fight in absurd world"', 'Cynicism as excuse for inaction; reject norms without purpose'],
    questions: [
      { id: 'cynic_1', text: 'I actively reject conventional norms that feel artificial', type: 'likert', weight: 1.0 },
      { id: 'cynic_2', text: 'I prioritize self-sufficiency over social approval', type: 'likert', weight: 1.1 },
      { id: 'cynic_3', text: 'I find virtue in living simply and authentically', type: 'likert', weight: 1.0 }
    ],
    weight: 0.9
  },

  // ========== PHILOSOPHICAL (MODERN) ==========
  {
    id: 'hierarchical_model',
    name: 'Frankfurt\'s Hierarchical Model',
    description: 'Sovereignty through second-order volitions and reflective endorsement. Can become endless self-reflection that paralyzes action, or intellectual identification with desires without genuine alignment, potentially leading to wanton behavior disguised as authentic choice.',
    ideals: ['Second-order volitions', 'Reflective endorsement', 'Identification with desires'],
    values: ['Volitional hierarchy', 'Free will', 'Authentic identification', 'Reflective autonomy'],
    intents: ['Want what I want to want', 'Identify with first-order desires', 'Achieve volitional unity'],
    subsets: [
      { name: 'First-Order Desires', emphasis: 'Immediate wants and impulses' },
      { name: 'Second-Order Volitions', emphasis: 'Desires about desires' },
      { name: 'Wanton vs Free', emphasis: 'Distinction between wanton and free person' }
    ],
    hypocrisyIndicators: ['Second-order wants autonomy but acts on compulsions; "I endorse my desires... but follow whims"', 'Claims identification but lacks volitional unity; preaches reflection but avoids self-examination'],
    reluctanceHooks: ['Know what I want-to-want but don\'t align; "Hierarchy demands reflection, yet I drift"', 'Recognize volitional conflict but don\'t resolve; resist reflective endorsement'],
    nihilismHooks: ['All desires meaningless; "Volitions stack to nothing in absurd life"', 'Volitional hierarchy is illusion; free will is impossible'],
    questions: [
      { id: 'frank_1', text: 'I reflect on my desires and identify with those I want to want', type: 'likert', weight: 1.1 },
      { id: 'frank_2', text: 'I achieve volitional unity between first and second-order desires', type: 'likert', weight: 1.0 },
      { id: 'frank_3', text: 'I am free to the extent that I identify with my first-order desires', type: 'likert', weight: 1.0 },
      { id: 'frank_4', text: 'I reflectively endorse the desires that move me to action', type: 'likert', weight: 1.1 }
    ],
    weight: 1.0
  },
  {
    id: 'anarchism',
    name: 'Anarchist Sovereignty',
    description: 'Sovereignty through rejection of coercive hierarchy and voluntary association. Can lead to inability to organize effectively, rejection of necessary collective action, or romanticization of individual autonomy that ignores the reality of interdependence and systemic constraints.',
    ideals: ['No coercive hierarchy', 'Voluntary association', 'Mutual aid', 'Self-ownership'],
    values: ['Autonomy', 'Voluntary cooperation', 'Non-aggression', 'Direct action'],
    intents: ['Reject coercive authority', 'Build voluntary alternatives', 'Practice mutual aid'],
    subsets: [
      { name: 'Anarcho-Capitalism', emphasis: 'Self-ownership, NAP, private law, voluntary markets' },
      { name: 'Anarcho-Communism', emphasis: 'Abolish property and state, mutual aid, common ownership' },
      { name: 'Mutualism', emphasis: 'Markets without capitalism, use-based property, worker control' },
      { name: 'Syndicalism', emphasis: 'Worker unions as basis for organization' }
    ],
    hypocrisyIndicators: ['Claim non-coercion but hoard/enforce; "NAP/mutual aid... but rely on state"', 'Anarchist but relies on state protection; claims voluntary association but coerces others'],
    reluctanceHooks: ['Ideological purity vs. taxes; "Anarchy ideal, but no resistance"', 'Know hierarchical alternatives but don\'t organize; avoid building voluntary institutions'],
    nihilismHooks: ['Principles oppressive; "All associations illusions of control"', 'Anarchy without purpose; rejection without construction'],
    questions: [
      { id: 'anarch_1', text: 'I believe all state functions should be privatized or abolished, including law and defense', type: 'likert', weight: 1.0 },
      { id: 'anarch_2', text: 'I prioritize voluntary association over hierarchical organization', type: 'likert', weight: 1.1 },
      { id: 'anarch_3', text: 'I practice mutual aid and direct action rather than working through institutions', type: 'likert', weight: 1.0 },
      { id: 'anarch_4', text: 'I reject coercive hierarchy in all forms, including economic and social', type: 'likert', weight: 1.1 },
      { id: 'anarch_5', text: 'Private property is legitimate only through direct use, not ownership claims', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'neoreaction',
    name: 'Neoreaction / Dark Enlightenment',
    description: 'Sovereignty through exit rights and corporate governance over democratic participation. Can become excuse for withdrawal from political engagement, justification for exclusionary communities, or cynical dismissal of all collective action without offering viable alternatives beyond exit.',
    ideals: ['Exit over voice', 'Patchwork sovereignty', 'Anti-democracy', 'Corporate governance'],
    values: ['Exit rights', 'HBD realism', 'Anti-egalitarianism', 'Technological acceleration'],
    intents: ['Exit from failing systems', 'Build superior governance', 'Reject Enlightenment universalism'],
    subsets: [
      { name: 'Moldbuggian', emphasis: 'Patchwork, corporate governance, exit rights' },
      { name: 'Landian', emphasis: 'Techno-capital acceleration, deterritorialization' },
      { name: 'Catholic Integralism', emphasis: 'Religious governance, anti-modern' }
    ],
    hypocrisyIndicators: ['Critique democracy but don\'t exit; "Superior governance... but stay in system"', 'Complain about democracy but don\'t exit; preach exit but remain dependent on state'],
    reluctanceHooks: ['Organize hesitation; "Patchwork vision clear, yet no action"', 'Know superior governance but won\'t organize; resist exit due to comfort or fear'],
    nihilismHooks: ['Systems corrupt; "All equally doomed traps"', 'Exit without destination; anti-democracy without alternative'],
    questions: [
      { id: 'neorx_1', text: 'I believe democracy systematically produces bad outcomes', type: 'likert', weight: 1.0 },
      { id: 'neorx_2', text: 'People should be free to form exclusive communities and exit from others', type: 'likert', weight: 1.1 },
      { id: 'neorx_3', text: 'Enlightenment universalism was a mistake that should be rejected', type: 'likert', weight: 1.0 },
      { id: 'neorx_4', text: 'Corporate governance models are superior to political democracy', type: 'likert', weight: 1.0 },
      { id: 'neorx_5', text: 'Exit rights matter more than voice in political systems', type: 'likert', weight: 0.9 }
    ],
    weight: 0.9
  },
  {
    id: 'effective-altruism',
    name: 'Effective Altruism',
    description: 'Sovereignty directed toward maximal utility and longtermism through evidence-based giving and career choice. Can become cold calculation that ignores emotional and relational goods, excessive focus on quantifiable metrics, or career optimization that sacrifices personal fulfillment and meaning for abstract impact.',
    ideals: ['Maximize utility', 'Evidence-based giving', 'Longtermism', 'X-risk reduction'],
    values: ['Global utility', 'Future people matter', 'Bayesian reasoning', 'Impact maximization'],
    intents: ['Maximize global utility', 'Prevent future suffering', 'Apply evidence to moral questions'],
    subsets: [
      { name: 'EA Core', emphasis: 'Effective giving, evidence-based charity' },
      { name: 'Longtermism', emphasis: 'Future people, x-risk reduction, astronomical waste' },
      { name: 'X-Risk Focus', emphasis: 'Existential risk prevention as top priority' },
      { name: 'Rationalist Community', emphasis: 'Bayesian epistemology, LessWrong culture' }
    ],
    hypocrisyIndicators: ['Argue impact but minimal donation; "Global utility first... but personal gains"', 'Preach impact but pursue comfortable career; claim longtermism but ignore near-term suffering'],
    reluctanceHooks: ['Optimal paths unpursued; "EA career logical, but comfort wins"', 'Know optimal career path but don\'t pursue; recognize impactful charities but don\'t donate'],
    nihilismHooks: ['Cosmic scale futility; "Futures irrelevant in void"', 'Utility without meaning; longtermism as escape from present'],
    questions: [
      { id: 'ea_1', text: 'I should maximize global utility, not personal flourishing', type: 'likert', weight: 1.1 },
      { id: 'ea_2', text: 'Preventing future suffering matters more than alleviating present suffering', type: 'likert', weight: 1.0 },
      { id: 'ea_3', text: 'I calculate expected value on major life decisions', type: 'likert', weight: 1.0 },
      { id: 'ea_4', text: 'I donate to evidence-based charities that maximize impact', type: 'likert', weight: 1.1 },
      { id: 'ea_5', text: 'I prioritize career paths that create the most good, even if less personally fulfilling', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },
  {
    id: 'existentialism',
    name: 'Existentialism',
    description: 'Authentic self-creation through radical freedom and responsibility. The weight of absolute freedom can produce paralyzing anxiety, and the demand for constant authenticity may lead to decision paralysis or endless self-questioning.',
    ideals: ['Existence precedes essence', 'Authentic choice', 'Radical freedom'],
    values: ['Authenticity', 'Freedom', 'Responsibility', 'Individuality'],
    intents: ['Create meaning through authentic choices', 'Embrace freedom despite anxiety', 'Take responsibility for existence'],
    subsets: [
      { name: 'Sartrean Existentialism', emphasis: 'Atheist freedom and bad faith' },
      { name: 'Kierkegaardian Existentialism', emphasis: 'Faith leap and subjective truth' },
      { name: 'Camusian Absurdism', emphasis: 'Absurd rebellion and meaning creation' }
    ],
    hypocrisyIndicators: ['Conform while claiming freedom; "Authenticity is everything... but follow crowd"', 'Avoid responsibility while preaching authenticity; claim individuality while following trends'],
    reluctanceHooks: ['Bad faith avoidance; "Freedom terrifies, so I delay choices"', 'Resist making defining choices; avoid commitment due to anxiety'],
    nihilismHooks: ['Freedom\'s nausea; "Existence precedes essence—nothing to build"', 'Meaninglessness as excuse; existential dread paralyzes action'],
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
    description: 'Rational autonomy via duty and universal moral law. Can become rigid and inflexible, ignoring context and consequences, potentially leading to moral absolutism that fails to account for real-world complexity and human nuance.',
    ideals: ['Categorical imperative', 'Universalizable maxims', 'Rational autonomy'],
    values: ['Duty', 'Rationality', 'Universalizability', 'Respect for persons'],
    intents: ['Act from duty, not inclination', 'Universalize moral principles', 'Respect rational autonomy'],
    subsets: [
      { name: 'Neo-Kantian', emphasis: 'Self-constitution and practical reason' },
      { name: 'Classical Kantian', emphasis: 'Categorical imperative and moral law' }
    ],
    hypocrisyIndicators: ['Universalize rules selectively; "Duty universal... but bend for self"', 'Claim duty while acting from inclination; preach universalizability while making exceptions'],
    reluctanceHooks: ['Rational duty clashes with impulses; "I should act morally but hesitate"', 'Avoid difficult moral decisions; resist applying principles consistently'],
    nihilismHooks: ['Moral law as futile; "Universal good crumbles in indifferent universe"', 'Duty without meaning; moral law as empty formalism'],
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
    description: 'Maximized liberty and well-being through greatest good for greatest number. Risks reducing individuals to means rather than ends, can justify harmful actions for "greater good," and struggles with calculating long-term or distributed consequences accurately.',
    ideals: ['Greatest happiness principle', 'Harm reduction', 'Consequentialist ethics'],
    values: ['Utility', 'Happiness', 'Well-being', 'Harm prevention'],
    intents: ['Maximize overall well-being', 'Minimize suffering', 'Promote greatest good'],
    subsets: [
      { name: 'Rule Utilitarianism', emphasis: 'Mill: Harm principle and general rules' },
      { name: 'Act Utilitarianism', emphasis: 'Bentham: Hedonic calculation per action' }
    ],
    hypocrisyIndicators: ['Prioritize self-utility over collective; "Max happiness for all... but ignore my harms"', 'Claim greatest good while acting selfishly; prioritize personal utility over general'],
    reluctanceHooks: ['Short-term utility stalls long reforms; "Greatest good requires sacrifice I avoid"', 'Avoid difficult utility calculations; defer to immediate gratification'],
    nihilismHooks: ['Utility as endless calc; "Well-being chases shadows in void"', 'Hedonism as ultimate value; utility without meaning'],
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
    description: 'Absolute self-ownership and minimal state intervention. May ignore systemic inequalities and collective needs, potentially leading to exploitation of the vulnerable and overlooking the reality that true freedom requires some collective infrastructure and protection.',
    ideals: ['Self-ownership', 'Non-aggression principle', 'Voluntary exchange'],
    values: ['Liberty', 'Property rights', 'Individual sovereignty', 'Non-coercion'],
    intents: ['Maximize individual freedom', 'Minimize state power', 'Protect property rights'],
    subsets: [
      { name: 'Anarcho-Capitalist', emphasis: 'Rothbard: No state, pure market' },
      { name: 'Minarchist', emphasis: 'Limited government for protection only' }
    ],
    hypocrisyIndicators: ['Advocate liberty but support subtle controls; "Absolute rights... but back regulations"', 'Claim freedom while supporting coercion; preach self-ownership while dependent'],
    reluctanceHooks: ['Fear of chaos blocks minimalism; "Minimal state ideal, yet cling to security"', 'Avoid taking full responsibility; defer to authority despite principles'],
    nihilismHooks: ['Freedom without anchors; "Ownership isolates in meaningless cosmos"', 'Liberty as excuse for inaction; self-ownership without purpose'],
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
    id: 'confucianism',
    name: 'Confucianism',
    description: 'Sovereignty through harmonious relationships and ritual propriety. Can become rigid hierarchy that suppresses individuality, ritualism without genuine virtue, or deferral to authority that prevents critical thinking and necessary challenge to tradition when it becomes oppressive.',
    ideals: ['Benevolence (Ren)', 'Ritual propriety (Li)', 'Filial piety (Xiao)', 'Harmony'],
    values: ['Ren (benevolence)', 'Li (ritual)', 'Xiao (filial piety)', 'Zhong (loyalty)', 'Shu (reciprocity)'],
    intents: ['Cultivate harmonious relationships', 'Practice ritual propriety', 'Maintain social order through virtue'],
    subsets: [
      { name: 'Traditional Confucianism', emphasis: 'Classical texts, hierarchical harmony' },
      { name: 'Neo-Confucianism', emphasis: 'Zhu Xi, Cheng brothers, metaphysical foundation' },
      { name: 'Contemporary Confucianism', emphasis: 'Modern reinterpretation, selective application' }
    ],
    hypocrisyIndicators: ['Public virtue, private discord; "Ren (benevolence) guides... but neglect duties"', 'Preach harmony but create conflict; claim filial piety but neglect parents'],
    reluctanceHooks: ['Know ritual but don\'t practice; "Li (propriety) essential, yet I skip for convenience"', 'Understand hierarchical duties but resist; recognize elder wisdom but don\'t defer'],
    nihilismHooks: ['Roles as constructs; "Harmony traditions meaningless in flux"', 'Ritual without meaning; harmony without authenticity'],
    questions: [
      { id: 'conf_1', text: 'Social harmony matters more than individual expression', type: 'likert', weight: 1.0 },
      { id: 'conf_2', text: 'I defer to elder wisdom even when I disagree', type: 'likert', weight: 1.1 },
      { id: 'conf_3', text: 'Ritual and propriety create genuine virtue, not mere conformity', type: 'likert', weight: 1.0 },
      { id: 'conf_4', text: 'Filial piety (xiao) is the foundation of all other virtues', type: 'likert', weight: 1.0 },
      { id: 'conf_5', text: 'I practice benevolence (ren) through proper relationships', type: 'likert', weight: 1.1 }
    ],
    weight: 1.0
  },
  {
    id: 'islam',
    name: 'Islamic Traditions',
    description: 'Sovereignty through submission to divine will (orthodox) or mystical union (Sufi). Can become rigid legalism that suppresses spiritual growth, authoritarian interpretation of Sharia, or mystical bypassing that avoids necessary engagement with religious obligations and social responsibilities.',
    ideals: ['Submission to Allah (Islam)', 'Divine law (Sharia)', 'Community (Ummah)', 'Mystical union (Fana)'],
    values: ['Submission (Islam)', 'Divine sovereignty', 'Community duty', 'Mystical experience', 'Justice'],
    intents: ['Submit to divine will', 'Follow Sharia', 'Strengthen Ummah', 'Achieve mystical union'],
    subsets: [
      { name: 'Sunni Orthodox', emphasis: 'Quran, Sunnah, Sharia, Ummah' },
      { name: 'Shia Orthodox', emphasis: 'Imamate, hidden Imam, Twelver tradition' },
      { name: 'Sufism', emphasis: 'Mystical union (fana), love over law, dhikr practice' }
    ],
    hypocrisyIndicators: ['Selective obedience; "Divine law supreme... but cherry-pick rules"', 'Claim submission but cherry-pick convenient rules; preach Ummah but isolate from community'],
    reluctanceHooks: ['Obligations known but unfulfilled; "Dhikr calls, yet I delay prayer"', 'Know prayer obligations but don\'t fulfill; understand Sharia but don\'t practice'],
    nihilismHooks: ['Authority as game; "Ummah unity illusions in divided world"', 'Submission without meaning; Sharia as empty legalism'],
    questions: [
      { id: 'islam_1', text: 'Divine law (Sharia) supersedes human legislation in all matters', type: 'likert', weight: 1.1 },
      { id: 'islam_2', text: 'Direct mystical experience can transcend religious law (Sufi path)', type: 'likert', weight: 1.0 },
      { id: 'islam_3', text: 'My identity is primarily as part of the Ummah (community)', type: 'likert', weight: 1.0 },
      { id: 'islam_4', text: 'Submission to Allah (islam) is the path to true freedom', type: 'likert', weight: 1.1 },
      { id: 'islam_5', text: 'I practice dhikr (remembrance) and seek mystical union (fana)', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    description: 'Detachment from suffering through awareness and non-attachment. Can lead to emotional suppression, avoidance of necessary engagement with suffering, or spiritual bypassing that prevents addressing real-world problems and personal growth.',
    ideals: ['Nirvana (cessation of suffering)', 'Four Noble Truths', 'Eightfold Path'],
    values: ['Compassion', 'Mindfulness', 'Non-attachment', 'Wisdom'],
    intents: ['End suffering through awareness', 'Cultivate compassion', 'Practice non-attachment'],
    subsets: [
      { name: 'Theravada Buddhism', emphasis: 'Individual enlightenment and meditation' },
      { name: 'Mahayana Buddhism', emphasis: 'Compassionate bodhisattva and universal salvation' },
      { name: 'Zen Buddhism', emphasis: 'Direct insight and present-moment awareness' }
    ],
    hypocrisyIndicators: ['Meditate but cling to desires; "Non-attachment supreme... but grasp outcomes"', 'Preach compassion while judging; claim non-attachment while accumulating'],
    reluctanceHooks: ['Avoid karma work; "Enlightenment path clear, but I delay practice"', 'Skip meditation practice; resist facing suffering'],
    nihilismHooks: ['Samsara as eternal trap; "Suffering\'s cycle proves futility"', 'Non-attachment as meaninglessness; detachment as escape'],
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
    description: 'Effortless harmony (wu wei) through alignment with natural flow. Can become passive resignation or excuse for inaction, potentially leading to avoidance of necessary effort and responsibility when "going with the flow" becomes an escape from difficult choices.',
    ideals: ['Wu wei (non-action)', 'Natural spontaneity', 'Yin-yang balance'],
    values: ['Harmony', 'Simplicity', 'Naturalness', 'Balance'],
    intents: ['Flow with natural order', 'Act without forcing', 'Maintain balance'],
    subsets: [
      { name: 'Philosophical Taoism', emphasis: 'Laozi: Natural flow and simplicity' },
      { name: 'Religious Taoism', emphasis: 'Immortality quests and alchemy' }
    ],
    hypocrisyIndicators: ['Force against dao while claiming effortless; "Harmony guides... but over-control life"', 'Force outcomes while preaching wu wei; claim simplicity while complicating'],
    reluctanceHooks: ['Over-effort resists naturalness; "Wu wei calls, yet I push against flow"', 'Resist natural flow; force outcomes through effort'],
    nihilismHooks: ['Passivity as surrender; "All alignments dissolve to chaos"', 'Non-action as meaninglessness; flow without direction'],
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
    description: 'Divine free will alignment through grace and love. Can lead to moral absolutism, judgment of others, or abdication of personal responsibility when "divine will" becomes an excuse for inaction or when grace is used to avoid accountability.',
    ideals: ['Divine love (agape)', 'Grace and redemption', 'Service to others'],
    values: ['Love', 'Faith', 'Hope', 'Charity'],
    intents: ['Align will with divine will', 'Love God and neighbor', 'Serve others'],
    subsets: [
      { name: 'Augustinian Christianity', emphasis: 'Grace-enabled will and predestination' },
      { name: 'Arminian Christianity', emphasis: 'Human choice and free will' },
      { name: 'Calvinist Christianity', emphasis: 'Predestination tension and divine sovereignty' }
    ],
    hypocrisyIndicators: ['Profess love but judge; "Charity core... but withhold from \'sinners\'"', 'Claim grace while condemning; preach service while self-serving'],
    reluctanceHooks: ['Fear of grace blocks action; "Faith demands bold love, yet I hesitate"', 'Avoid difficult acts of love; resist divine calling'],
    nihilismHooks: ['Theodicy despair; "Suffering world mocks divine purpose"', 'Faith without works; grace without responsibility'],
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
    description: 'Reasoned self-fulfillment through human potential and dignity. May overestimate human rationality, underestimate human capacity for evil, or become overly optimistic, potentially ignoring the darker aspects of human nature and the limits of reason alone.',
    ideals: ['Human dignity', 'Rational inquiry', 'Ethical living without deity'],
    values: ['Reason', 'Compassion', 'Human potential', 'Ethical responsibility'],
    intents: ['Cultivate human potential', 'Promote human dignity', 'Live ethically through reason'],
    subsets: [
      { name: 'Secular Humanism', emphasis: 'Evidence-based ethics and reason' },
      { name: 'Religious Humanism', emphasis: 'Spiritual without deity, human-centered' }
    ],
    hypocrisyIndicators: ['Evidence ethics but defer to dogma; "Human potential first... but ignore facts for comfort"', 'Claim reason while following dogma; preach dignity while dehumanizing'],
    reluctanceHooks: ['Defer inquiry for ease; "Reason should lead, but inertia wins"', 'Defer to dogma; avoid rational inquiry; resist ethical responsibility'],
    nihilismHooks: ['Secular void; "Potential crumbles without cosmic meaning"', 'Humanism as empty optimism; reason without meaning'],
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
    id: 'deep_ecology',
    name: 'Deep Ecology / Biocentrism',
    description: 'Sovereignty through ecological identification and biocentric ethics. Can become misanthropic rejection of human value, romanticization of pre-industrial life that ignores suffering, or environmental activism that prioritizes abstract nature over human needs without offering viable alternatives.',
    ideals: ['Intrinsic value of nature', 'Ecological self', 'Biocentric equality', 'Ecosophy'],
    values: ['Biocentrism', 'Ecological identification', 'Anti-anthropocentrism', 'Ecosystem integrity'],
    intents: ['Expand identity to include ecosystem', 'Practice biocentric ethics', 'Challenge anthropocentrism'],
    subsets: [
      { name: 'Naessian Ecosophy', emphasis: 'Arne Næss: Deep ecology platform, self-realization' },
      { name: 'Bioregionalism', emphasis: 'Place-based identity, local ecology' },
      { name: 'Earth-Centered', emphasis: 'Gaia hypothesis, planetary consciousness' }
    ],
    hypocrisyIndicators: ['Green preach but high-consume; "Earth intrinsic... but fly/eat factory"', 'Preach ecology but high-carbon lifestyle; claim biocentrism but prioritize human comfort'],
    reluctanceHooks: ['Impact known but unreduced; "Limits clear, yet no change"', 'Know impact but don\'t reduce; understand ecological self but don\'t expand identity'],
    nihilismHooks: ['Collapse inevitable; "Ecosystems to dust anyway"', 'Human extinction as positive; nature without meaning'],
    questions: [
      { id: 'eco_1', text: 'Non-human life has value independent of usefulness to humans', type: 'likert', weight: 1.1 },
      { id: 'eco_2', text: 'My identity extends to include the broader ecosystem', type: 'likert', weight: 1.0 },
      { id: 'eco_3', text: 'Human flourishing should be constrained by ecological limits', type: 'likert', weight: 1.1 },
      { id: 'eco_4', text: 'Anthropocentrism is the root cause of ecological crisis', type: 'likert', weight: 1.0 },
      { id: 'eco_5', text: 'I practice ecosophy (ecological wisdom) in daily life', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'positive_psychology',
    name: 'Positive Psychology',
    description: 'Resilience via flow states and character strengths. Can become toxic positivity that denies legitimate suffering, ignores shadow aspects, or pressures people to feel positive when negative emotions are necessary and valid responses to difficult circumstances.',
    ideals: ['PERMA model (Positive emotion, Engagement, Relationships, Meaning, Accomplishment)', 'Flow states', 'Character strengths'],
    values: ['Resilience', 'Optimism', 'Strengths', 'Well-being'],
    intents: ['Cultivate positive emotions', 'Engage in flow activities', 'Build character strengths'],
    subsets: [
      { name: 'Seligman PERMA', emphasis: 'Well-being model and flourishing' },
      { name: 'Csikszentmihalyi Flow', emphasis: 'Optimal experience and engagement' }
    ],
    hypocrisyIndicators: ['Affirm strengths but ignore shadows; "Optimism key... but dwell on negatives"', 'Preach optimism while pessimistic; claim resilience while avoiding challenges'],
    reluctanceHooks: ['Habitual loops block flow; "PERMA practices clear, but I resist"', 'Avoid difficult emotions; resist shadow work; defer to negative patterns'],
    nihilismHooks: ['Well-being as facade; "Resilience futile against entropy"', 'Positivity as denial; optimism without depth'],
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
    description: 'Thought-reframing sovereignty through identifying and changing cognitive distortions. Can become intellectual bypassing that dismisses legitimate emotions, may overemphasize individual responsibility while ignoring systemic factors, and risks reducing complex human experience to mere "distortions" to be fixed.',
    ideals: ['Thoughts shape reality', 'Cognitive restructuring', 'Behavioral change'],
    values: ['Rationality', 'Evidence', 'Practicality', 'Self-efficacy'],
    intents: ['Identify cognitive distortions', 'Reframe negative thoughts', 'Change maladaptive behaviors'],
    subsets: [
      { name: 'Ellis REBT', emphasis: 'Irrational beliefs and disputation' },
      { name: 'Beck CBT', emphasis: 'Distortion detection and cognitive restructuring' }
    ],
    hypocrisyIndicators: ['Identify biases but repeat them; "Rationality rules... but irrational fears persist"', 'Identify others\' distortions, ignore own; preach rationality while emotional'],
    reluctanceHooks: ['Negative loops inertia; "Distortions known, yet unchanged"', 'Habitual negative loops; resist challenging beliefs; avoid behavioral change'],
    nihilismHooks: ['Evidence as cold; "Reframing can\'t fill existential hole"', 'Thoughts without meaning; CBT as empty technique'],
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
    description: 'Present-moment agency through non-judgmental awareness. Can become passive observation without action, spiritual bypassing that avoids necessary engagement with problems, or a tool for corporate stress management that maintains oppressive systems rather than challenging them.',
    ideals: ['Present-moment awareness', 'Non-judgmental observation', 'Acceptance'],
    values: ['Awareness', 'Acceptance', 'Presence', 'Equanimity'],
    intents: ['Cultivate present-moment awareness', 'Observe without judgment', 'Accept experience as it is'],
    subsets: [
      { name: 'Kabat-Zinn MBSR', emphasis: 'Stress reduction and mindfulness-based intervention' },
      { name: 'Insight Meditation', emphasis: 'Vipassana roots and direct insight' }
    ],
    hypocrisyIndicators: ['Observe but judge; "Non-judgmental presence... but critique self"', 'Meditate but avoid difficult emotions; claim acceptance while judging'],
    reluctanceHooks: ['Avoid discomfort in sitting; "Awareness practice vital, but I skip"', 'Skip meditation practice; avoid difficult experiences'],
    nihilismHooks: ['Presence in void; "Mindful now reveals ultimate emptiness"', 'Awareness without purpose; acceptance as passivity'],
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
    description: 'Meaninglessness as liberation or resignation. Can paralyze action, lead to despair and withdrawal, or become an excuse for destructive behavior when the recognition of meaninglessness isn\'t paired with active value creation or defiant engagement with life.',
    ideals: ['Meaninglessness', 'Absence of inherent value', 'Freedom from meaning'],
    values: ['Honesty', 'Radical acceptance', 'Liberation', 'Authenticity'],
    intents: ['Face meaninglessness honestly', 'Create values despite void', 'Liberate from false meaning'],
    subsets: [
      { name: 'Passive Nihilism', emphasis: 'Schopenhauer: Resignation and withdrawal' },
      { name: 'Active Nihilism', emphasis: 'Nietzsche: Value creation despite void' }
    ],
    hypocrisyIndicators: ['Claim freedom in inaction but conform; "Nothing matters... but chase distractions"', 'Claim meaninglessness while seeking meaning; preach honesty while self-deceiving'],
    reluctanceHooks: ['Resignation paralysis; "Void known, yet no revolt"', 'Reluctance via despair; avoid value creation; resist action'],
    nihilismHooks: ['Core despair; "All efforts prove the nothing"', 'Meaninglessness paralyzes; void as excuse; despair without purpose'],
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
    description: 'Fluid, deconstructed self through power critique and deconstruction. Can lead to endless skepticism that paralyzes action, relativism that undermines all values including necessary ones, or deconstruction without reconstruction that leaves nothing to build upon.',
    ideals: ['Deconstruction of truth', 'Power critique', 'Fluid identity'],
    values: ['Skepticism', 'Critique', 'Fluidity', 'Resistance'],
    intents: ['Deconstruct dominant narratives', 'Critique power structures', 'Embrace fluid identity'],
    subsets: [
      { name: 'Foucauldian', emphasis: 'Power critique and discourse analysis' },
      { name: 'Derridean', emphasis: 'Deconstruction and différance' }
    ],
    hypocrisyIndicators: ['Critique power but wield it; "All truths relative... but impose my narrative"', 'Deconstruct others\' truths, hold own; claim fluidity while fixed; preach critique while conforming'],
    reluctanceHooks: ['Endless skepticism stalls; "Deconstruct everything, but build nothing"', 'Endless skepticism paralyzes; avoid commitment due to relativism; resist action'],
    nihilismHooks: ['Fluidity to dissolution; "Relativism erodes to total chaos"', 'Relativism as meaninglessness; deconstruction without reconstruction'],
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
    description: 'Revolt against void through defiant meaning creation. The constant recognition of absurdity can become exhausting, the demand for perpetual rebellion may lack sustainable direction, and defiance without deeper purpose can devolve into mere contrarianism or performative resistance.',
    ideals: ['Absurd recognition', 'Defiant rebellion', 'Meaning despite meaninglessness'],
    values: ['Defiance', 'Rebellion', 'Authenticity', 'Courage'],
    intents: ['Recognize the absurd', 'Rebel against meaninglessness', 'Create meaning through revolt'],
    subsets: [
      { name: 'Camusian Absurdism', emphasis: 'Sisyphus defiance and rebellion' },
      { name: 'Ecstatic Absurdism', emphasis: 'Embrace chaos and absurdity' }
    ],
    hypocrisyIndicators: ['Rebel ideals but routine conform; "Sisyphus defiance... but accept tedium"', 'Rebel then conform; claim defiance while avoiding; preach rebellion while passive'],
    reluctanceHooks: ['Revolt fatigue; "Absurd known, yet no push"', 'Avoid absurd recognition; resist rebellion; conform despite principles'],
    nihilismHooks: ['Void unbeatable; "Defiance just delays surrender"', 'Absurd without revolt; meaninglessness without defiance; nihilism baseline'],
    questions: [
      { id: 'absurd_1', text: 'I recognize the absurd tension between human need for meaning and universe\'s silence', type: 'likert', weight: 1.1 },
      { id: 'absurd_2', text: 'I rebel against meaninglessness through defiant action', type: 'likert', weight: 1.1 },
      { id: 'absurd_3', text: 'I create meaning through the act of revolt itself', type: 'likert', weight: 1.0 },
      { id: 'absurd_4', text: 'I find value in defiance despite recognizing the void', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  }
];

