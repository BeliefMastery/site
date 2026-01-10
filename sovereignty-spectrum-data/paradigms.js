// Sovereignty Paradigms - 25 distinct philosophical/spiritual frameworks
// Each paradigm includes ideals, values, intents, subsets, and derailer hooks
// Expanded from 18 to 25 to cover: Ancient philosophy (Aristotelianism), Modern sovereignty models (Hierarchical, Anarchism, Neoreaction, EA), 
// Eastern traditions (Confucianism), Abrahamic religion (Islam), and Ecological frameworks (Deep Ecology)

export const SOVEREIGNTY_PARADIGMS = [
  // ========== PHILOSOPHICAL (ANCIENT) ==========
  {
    id: 'aristotelianism',
    name: 'Aristotelianism',
    description: 'This philosophy teaches that you become truly free and happy by becoming a better person through daily practice. It means building good habits, learning from your experiences, and finding balance in how you live. The idea is that practicing good character every day makes you stronger and helps you live a meaningful life. However, this approach can become too strict when people follow old rules just because they\'re traditional, rather than because those rules actually help you grow. It can also trap you in trying to be perfect, where you\'re always trying to be excellent but never actually taking action or living your life because you\'re waiting to be good enough.',
    ideals: ['Flourishing and well-being', 'Excellence in character', 'Balance between extremes'],
    values: ['Excellence', 'Practical wisdom from experience', 'Good habits built over time', 'Clear purpose and direction'],
    intents: ['Build good character through daily habits', 'Learn wisdom from experience', 'Live a meaningful, fulfilling life'],
    subsets: [
      { name: 'Virtue Ethics', emphasis: 'Focus on developing character, not just following rules' },
      { name: 'Purpose-Driven', emphasis: 'Live with clear goals and direction' },
      { name: 'Balance', emphasis: 'Find the middle ground between extremes' }
    ],
    hypocrisyIndicators: ['Say excellence matters but don\'t practice habits; "I believe in excellence but skip daily practice"', 'Talk about building character but avoid difficult challenges that would actually develop it'],
    reluctanceHooks: ['Know what would build character but don\'t do it; "I know I should practice daily but I keep putting it off"', 'Avoid challenges that would help you grow, even though you understand they\'re necessary'],
    nihilismHooks: ['Believe good character doesn\'t matter; "Excellence is meaningless when nothing really matters anyway"', 'Think the goal of living well is pointless because life has no real purpose'],
    questions: [
      { id: 'arist_1', text: 'I work on building good character through regular daily practice', type: 'likert', weight: 1.1 },
      { id: 'arist_2', text: 'I try to find balance between extremes when making decisions', type: 'likert', weight: 1.0 },
      { id: 'arist_3', text: 'I learn from my experiences and think about what they teach me', type: 'likert', weight: 1.1 },
      { id: 'arist_4', text: 'I try to do things well and see this as a path to a meaningful life', type: 'likert', weight: 1.0 },
      { id: 'arist_5', text: 'I understand my life\'s purpose and work toward it in my daily actions', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'stoicism',
    name: 'Stoicism',
    description: 'This philosophy teaches that you can control how you react inside, even when you cannot control what happens outside. It means focusing on what you can actually change (your thoughts and actions) and accepting what you cannot change (other people, situations, results). The goal is to stay calm and make smart choices no matter what happens around you. This helps you stay strong and clear-headed when things get difficult. However, this approach requires careful attention because you can go too far and shut down your feelings completely. When taken too far, it can make you feel nothing and disconnected from life, or it can lead you to give up and accept problems when you should actually try to fix them.',
    ideals: ['Virtue and good character as the only true good', 'Accepting what cannot be changed', 'Duty to humanity as a whole'],
    values: ['Wisdom', 'Courage in facing difficulty', 'Fairness and justice', 'Self-control and moderation'],
    intents: ['Make choices based on reason, not emotions', 'Build inner strength that cannot be shaken', 'Stay calm and steady no matter what happens'],
    subsets: [
      { name: 'Roman Stoicism', emphasis: 'Practical daily practice focusing on what you can and cannot control' },
      { name: 'Classical Stoicism', emphasis: 'Duty to all humanity and universal brotherhood' },
      { name: 'Modern Stoicism', emphasis: 'Applied in therapy and cognitive behavioral techniques' }
    ],
    hypocrisyIndicators: ['Say you control your responses but lose your temper over small problems; "I believe in staying calm but I get angry at minor inconveniences"', 'Preach endurance but avoid situations that would require you to actually endure difficulty'],
    reluctanceHooks: ['Avoid daily reflection practice; "I know I should reflect daily but I skip it when it\'s uncomfortable"', 'Resist facing difficult truths about yourself or your situation, even though you know it would help'],
    nihilismHooks: ['Believe nothing matters so why try; "If I can\'t control outcomes, why make any effort at all?"', 'Give up and accept problems without working to solve them, using "acceptance" as an excuse'],
    questions: [
      { id: 'stoic_1', text: 'I see difficult events as chances to practice staying calm and making good choices', type: 'likert', weight: 1.2 },
      { id: 'stoic_2', text: 'I regularly think about what I can control versus what I cannot control', type: 'likert', weight: 1.0 },
      { id: 'stoic_3', text: 'I stay calm and steady when facing difficult situations', type: 'likert', weight: 1.1 },
      { id: 'stoic_4', text: 'I make decisions based on clear thinking and good principles rather than strong emotions', type: 'likert', weight: 1.0 },
      { id: 'stoic_5', text: 'I see myself as part of a larger world with responsibilities to others', type: 'likert', weight: 0.9 }
    ],
    weight: 1.2
  },
  {
    id: 'epicureanism',
    name: 'Epicureanism',
    description: 'This philosophy teaches that the best life comes from finding calm, peaceful happiness through simple things and not going overboard. It means enjoying friendship, good food, quiet moments, and avoiding unnecessary pain by not wanting too much. The idea is that happiness comes from wanting less, not from having more stuff. This approach helps you appreciate what you have and find peace in simple pleasures. However, this approach can become an excuse to avoid all challenges and just seek comfort. When taken too far, it can stop you from growing, facing necessary difficulties, or dealing with the real problems in your life.',
    ideals: ['Freedom from worry and disturbance', 'Absence of pain and trouble', 'Enjoying simple, everyday pleasures'],
    values: ['Careful thinking and planning', 'Deep friendships', 'Moderation and balance', 'Calm and peacefulness'],
    intents: ['Find the most pleasure by reducing unnecessary pain', 'Enjoy simple, lasting joys', 'Avoid wanting things that cause trouble'],
    subsets: [
      { name: 'Prudent Approach', emphasis: 'Careful moderation and thoughtful pleasure' },
      { name: 'Simple Living', emphasis: 'Focus on friendship and basic pleasures' }
    ],
    hypocrisyIndicators: ['Say moderation matters but over-indulge in comforts; "I believe in moderation but I often overdo it when I want something"', 'Preach simple living but accumulate lots of things; talk about limits but constantly want more'],
    reluctanceHooks: ['Rely too much on short-term comfort; "I know I should make better choices but I keep choosing what feels good now"', 'Avoid necessary challenges; "I understand this is important but I\'d rather stay comfortable"'],
    nihilismHooks: ['Believe all pleasure is meaningless; "Nothing brings real joy, it all fades to nothing anyway"', 'Use pleasure-seeking as an escape from finding real purpose or meaning in life'],
    questions: [
      { id: 'epic_1', text: 'I choose long-term peace and calm over what feels good right now', type: 'likert', weight: 1.1 },
      { id: 'epic_2', text: 'I get real satisfaction from simple pleasures and close friendships', type: 'likert', weight: 1.0 },
      { id: 'epic_3', text: 'I actively limit what I want to avoid creating problems for myself', type: 'likert', weight: 1.0 },
      { id: 'epic_4', text: 'I plan ahead to avoid unnecessary pain and trouble', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'cynicism',
    name: 'Cynicism',
    description: 'This philosophy teaches that you should reject social rules and live according to your true nature, becoming completely self-reliant. It means questioning why we follow traditions, rejecting fake wants created by society, and living simply and being yourself. The idea is that real freedom comes from not needing approval or following the crowd. This helps you break free from social pressure and live on your own terms. However, this approach can lead to cutting yourself off from others completely. When taken too far, it can become an excuse to avoid working with people, cooperating when necessary, or dealing meaningfully with the community around you.',
    ideals: ['Freedom from social rules and expectations', 'Living according to your true nature', 'Finding goodness through simple, honest living'],
    values: ['Complete independence', 'Being true to yourself', 'Not needing others', 'Rebelling against false norms'],
    intents: ['Live naturally, not according to social rules', 'Reject fake needs created by society', 'Build total independence from others'],
    subsets: [
      { name: 'Classical Cynicism', emphasis: 'Extreme simplicity and rejecting social shame' },
      { name: 'Modern Cynicism', emphasis: 'Critiquing social systems and rejecting mainstream culture' }
    ],
    hypocrisyIndicators: ['Publicly reject social norms but privately follow them; "I say I don\'t care about status but I still chase it"', 'Claim independence but rely on others; reject norms but still conform when it\'s convenient'],
    reluctanceHooks: ['Hesitate to actually rebel; "I know social rules trap me but I stay comfortable by following them"', 'Avoid necessary cooperation with others; resist practical compromises even when they would help'],
    nihilismHooks: ['Rebel without purpose; "Why fight against anything when nothing matters anyway?"', 'Use cynicism as an excuse to do nothing; reject everything without building anything better'],
    questions: [
      { id: 'cynic_1', text: 'I actively reject social rules and traditions that feel fake or forced', type: 'likert', weight: 1.0 },
      { id: 'cynic_2', text: 'I care more about being independent than getting approval from others', type: 'likert', weight: 1.1 },
      { id: 'cynic_3', text: 'I believe true goodness comes from living simply and being true to yourself', type: 'likert', weight: 1.0 }
    ],
    weight: 0.9
  },

  // ========== PHILOSOPHICAL (MODERN) ==========
  {
    id: 'hierarchical_model',
    name: 'Frankfurt\'s Hierarchical Model',
    description: 'This philosophy teaches that true freedom comes from thinking about what you want and choosing to want things that match your deeper values. It means recognizing the difference between immediate impulses (what you want right now) and your deeper desires (what you actually want to want deep down). You become free when you notice which desires match your real values and choose to follow those instead of just going with whatever feels good in the moment. This helps you make choices that align with who you want to be, not just what feels easiest right now. However, this approach can trap you in endless thinking without ever acting. When taken too far, it can become an excuse to follow any impulse by saying "I choose this," even when it goes against your stated values, leading to impulsive behavior disguised as thoughtful choice.',
    ideals: ['Thinking about what you want to want', 'Choosing to align with your deeper values', 'Being aware of which desires match your true self'],
    values: ['Self-awareness about your wants', 'Genuine free will through conscious choice', 'Aligning actions with deeper values', 'Freedom through reflection and choice'],
    intents: ['Want things that align with your deeper values', 'Identify with desires that match who you want to be', 'Create unity between your immediate wants and your deeper values'],
    subsets: [
      { name: 'Immediate Desires', emphasis: 'What you want right now, without thinking' },
      { name: 'Deeper Values', emphasis: 'What you want to want, after reflection' },
      { name: 'Free vs Impulsive', emphasis: 'The difference between someone who chooses their desires and someone who just follows impulses' }
    ],
    hypocrisyIndicators: ['Say you want to be free but act on every impulse; "I choose my desires but I just follow whatever feels good"', 'Claim you reflect on your values but avoid actually examining yourself; talk about self-awareness but don\'t practice it'],
    reluctanceHooks: ['Know what you should want but don\'t align your actions; "I understand what I should want but I keep doing what feels easy"', 'Recognize the conflict between your impulses and values but don\'t resolve it; avoid making the hard choices'],
    nihilismHooks: ['Believe all desires are meaningless; "Nothing I want really matters, it all leads to nothing anyway"', 'Think free will is impossible; "I can\'t really choose, so why try?"'],
    questions: [
      { id: 'frank_1', text: 'I think about what I want and choose to want things that match my deeper values', type: 'likert', weight: 1.1 },
      { id: 'frank_2', text: 'My immediate wants align with what I actually want to want deep down', type: 'likert', weight: 1.0 },
      { id: 'frank_3', text: 'I feel free when I consciously choose desires that match who I want to be', type: 'likert', weight: 1.0 },
      { id: 'frank_4', text: 'I think about and approve of the desires that actually drive my actions', type: 'likert', weight: 1.1 }
    ],
    weight: 1.0
  },
  {
    id: 'anarchism',
    name: 'Anarchist Sovereignty',
    description: 'This philosophy teaches that you should reject all forms of forced hierarchy and only work with others by choice. It means building communities based on helping each other, cooperation, and respect rather than power and control. The idea is that people can organize themselves without bosses, governments, or other authorities forcing them to cooperate. This approach helps create communities where everyone participates by choice rather than force. However, this approach can make it difficult to organize effectively when cooperation is needed. When taken too far, it can become an excuse to avoid working together when it\'s necessary, or to romanticize complete independence while ignoring that we all depend on each other in real ways.',
    ideals: ['No forced hierarchy or authority', 'Only voluntary cooperation', 'Helping each other through mutual aid', 'Owning yourself completely'],
    values: ['Complete independence', 'Only working with people who agree', 'Never using force against others', 'Taking direct action instead of working through systems'],
    intents: ['Reject all forced authority', 'Build alternatives based on voluntary cooperation', 'Help each other through mutual aid without coercion'],
    subsets: [
      { name: 'Market Anarchism', emphasis: 'Own yourself, never use force, private systems, free markets' },
      { name: 'Communal Anarchism', emphasis: 'No property or state, help each other, share everything' },
      { name: 'Mutualism', emphasis: 'Markets without bosses, property only through use, workers control' },
      { name: 'Union-Based', emphasis: 'Workers organize through unions' }
    ],
    hypocrisyIndicators: ['Say no force but use it when convenient; "I believe in no force but I still rely on government protection"', 'Claim you reject all authority but still depend on it; talk about voluntary cooperation but force others when it suits you'],
    reluctanceHooks: ['Believe in anarchy but don\'t resist; "Ideal system but I still pay taxes without fighting"', 'Understand better alternatives but don\'t build them; avoid organizing voluntary groups even though you believe in them'],
    nihilismHooks: ['Believe all organization is oppressive; "Any way people work together is just another form of control"', 'Reject everything without building anything better; use anarchy as excuse to do nothing'],
    questions: [
      { id: 'anarch_1', text: 'I believe all government functions should be handled privately or eliminated, including law and defense', type: 'likert', weight: 1.0 },
      { id: 'anarch_2', text: 'I prefer working together by choice over systems with bosses or leaders', type: 'likert', weight: 1.1 },
      { id: 'anarch_3', text: 'I practice helping others directly rather than working through government or institutions', type: 'likert', weight: 1.0 },
      { id: 'anarch_4', text: 'I reject all forms of forced hierarchy, including in work and social relationships', type: 'likert', weight: 1.1 },
      { id: 'anarch_5', text: 'Property should only belong to someone if they\'re actually using it, not just because they claim it', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'neoreaction',
    name: 'Neoreaction / Dark Enlightenment',
    description: 'This philosophy teaches that you should have the right to leave systems that don\'t work for you, and that business-style governance works better than democracy. It means believing that people should be free to form their own communities with their own rules, and that corporate models of organization are more effective than voting and political participation. The idea is to exit failing systems rather than trying to fix them from within. This approach helps you focus on building better systems instead of being stuck in broken ones. However, this approach can become an excuse to withdraw from all political involvement. When taken too far, it can justify excluding people unfairly, or lead to cynically dismissing all ways of working together without actually building better alternatives.',
    ideals: ['Right to leave rather than try to change', 'Many small communities instead of one big system', 'Against democracy as a system', 'Business-style organization works better'],
    values: ['Freedom to leave systems', 'Understanding that people are different', 'Against treating everyone as equal', 'Technology drives change faster than politics'],
    intents: ['Leave systems that don\'t work', 'Build better ways of organizing', 'Reject the idea that everyone should be treated the same'],
    subsets: [
      { name: 'Patchwork Approach', emphasis: 'Many communities, corporate-style organization, right to leave' },
      { name: 'Technology-Focused', emphasis: 'Technology and business drive real change' },
      { name: 'Religious Governance', emphasis: 'Religious communities with their own rules, against modern approaches' }
    ],
    hypocrisyIndicators: ['Criticize democracy but stay in it; "Better systems exist but I don\'t leave this one"', 'Complain about the system but don\'t exit; talk about leaving but remain dependent'],
    reluctanceHooks: ['Understand the vision but don\'t act; "I see how this could work but I don\'t organize it"', 'Know better ways but don\'t build them; avoid leaving due to comfort or fear'],
    nihilismHooks: ['Believe all systems are corrupt; "Everything is equally broken, there\'s no point"', 'Want to exit but have nowhere to go; reject democracy without offering real alternatives'],
    questions: [
      { id: 'neorx_1', text: 'I believe democracy consistently creates bad results', type: 'likert', weight: 1.0 },
      { id: 'neorx_2', text: 'People should be free to form exclusive communities and leave ones they don\'t like', type: 'likert', weight: 1.1 },
      { id: 'neorx_3', text: 'The idea that everyone should be treated the same was a mistake', type: 'likert', weight: 1.0 },
      { id: 'neorx_4', text: 'Business-style organization works better than political democracy', type: 'likert', weight: 1.0 },
      { id: 'neorx_5', text: 'The right to leave a system matters more than the right to participate in it', type: 'likert', weight: 0.9 }
    ],
    weight: 0.9
  },
  {
    id: 'effective-altruism',
    name: 'Effective Altruism',
    description: 'This philosophy teaches that you should use evidence and calculation to do the most good possible in the world. It means choosing careers and making donations based on what creates the biggest positive impact, not just what feels good. The focus is on helping as many people as possible, including future generations, by using logic and data to find the most effective ways to reduce suffering. This approach helps you make sure your efforts actually help people in real ways rather than just making you feel good. However, this approach can become so focused on numbers and calculation that it ignores the importance of relationships, emotions, and personal meaning. When taken too far, it can push you to choose careers that maximize abstract "impact" while sacrificing your own fulfillment and the deeper connections that give life meaning.',
    ideals: ['Do the most good possible', 'Use evidence to choose how to help', 'Focus on the very long term', 'Prevent catastrophic risks to humanity'],
    values: ['Helping the most people possible', 'People in the future matter as much as people now', 'Using logic and probability in decisions', 'Maximizing the positive impact of your choices'],
    intents: ['Help as many people as possible', 'Prevent future disasters and suffering', 'Use evidence and logic to make moral choices'],
    subsets: [
      { name: 'Effective Giving', emphasis: 'Donating to charities proven to help the most' },
      { name: 'Longterm Focus', emphasis: 'Helping future generations, preventing huge risks, focusing on long-term consequences' },
      { name: 'Risk Prevention', emphasis: 'Preventing disasters that could end humanity as top priority' },
      { name: 'Rational Analysis', emphasis: 'Using probability and logic to make decisions' }
    ],
    hypocrisyIndicators: ['Talk about maximizing impact but donate very little; "Global good matters most but I keep my money for myself"', 'Preach choosing impactful careers but pursue comfortable ones; claim future matters but ignore current suffering'],
    reluctanceHooks: ['Know the best path but don\'t take it; "A more impactful career makes sense but I choose comfort"', 'Understand which charities help most but don\'t donate; recognize optimal choices but avoid them'],
    nihilismHooks: ['Believe nothing matters on a cosmic scale; "The universe doesn\'t care, so why try?"', 'Focus on abstract impact while losing all meaning; use long-term thinking as escape from present reality'],
    questions: [
      { id: 'ea_1', text: 'I should help as many people as possible, even if it means sacrificing my own happiness', type: 'likert', weight: 1.1 },
      { id: 'ea_2', text: 'Preventing suffering for future generations matters more than helping people suffering right now', type: 'likert', weight: 1.0 },
      { id: 'ea_3', text: 'I use logic and probability to make important life decisions', type: 'likert', weight: 1.0 },
      { id: 'ea_4', text: 'I donate to charities that are proven to help the most people effectively', type: 'likert', weight: 1.1 },
      { id: 'ea_5', text: 'I choose career paths that help the most people, even if they\'re less personally fulfilling', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },
  {
    id: 'existentialism',
    name: 'Existentialism',
    description: 'This philosophy teaches that you create yourself and your meaning through the choices you make. It means that you are completely free to choose who you become, and you must take full responsibility for those choices and your life. There is no ready-made purpose - you create your own meaning through being true to yourself and making decisions that reflect who you really are. This gives you complete freedom to become whoever you want to be and create meaning that matters to you. However, the weight of having complete freedom can create overwhelming anxiety. When taken too far, the constant pressure to be true to yourself and make meaningful choices can paralyze you, leading to endless questioning about what to do without ever actually deciding or acting.',
    ideals: ['You exist first, then create who you are', 'Making choices that reflect your true self', 'Complete freedom to decide'],
    values: ['Being true to yourself', 'Complete freedom', 'Taking full responsibility', 'Being your own person'],
    intents: ['Create meaning by making choices that reflect who you really are', 'Face the anxiety that comes with freedom rather than avoiding it', 'Take complete responsibility for your life and choices'],
    subsets: [
      { name: 'Atheist Existentialism', emphasis: 'Freedom without God, avoiding self-deception' },
      { name: 'Religious Existentialism', emphasis: 'Leap of faith and personal truth' },
      { name: 'Rebellious Existentialism', emphasis: 'Rebelling against meaninglessness by creating meaning' }
    ],
    hypocrisyIndicators: ['Say you value authenticity but just follow the crowd; "Being authentic matters most but I do what everyone else does"', 'Avoid taking responsibility while preaching it; claim to be your own person while following trends'],
    reluctanceHooks: ['Delay choices because freedom is scary; "I know I\'m free to choose but the responsibility terrifies me"', 'Avoid making important decisions; resist committing to anything because you\'re afraid of the wrong choice'],
    nihilismHooks: ['Feel nauseated by freedom; "If I create my own meaning, there\'s nothing real to build on"', 'Use meaninglessness as an excuse; let the fear of creating meaning paralyze you'],
    questions: [
      { id: 'exist_1', text: 'I believe I create my own meaning and purpose through the choices I make that reflect who I really am', type: 'likert', weight: 1.2 },
      { id: 'exist_2', text: 'I face the anxiety that comes with complete freedom rather than avoiding it', type: 'likert', weight: 1.0 },
      { id: 'exist_3', text: 'I take full responsibility for my life and all my choices', type: 'likert', weight: 1.1 },
      { id: 'exist_4', text: 'I resist lying to myself and being someone I\'m not', type: 'likert', weight: 1.0 },
      { id: 'exist_5', text: 'I find meaning in the act of making choices itself, not just in what happens because of them', type: 'likert', weight: 0.9 }
    ],
    weight: 1.2
  },
  {
    id: 'kantian_deontology',
    name: 'Kantian Deontology',
    description: 'This philosophy teaches that you should do what\'s right because it\'s the right thing to do, not just because you feel like doing it. It means following rules that would make sense for everyone to follow - essentially asking "what if everyone did this?" before you act. The idea is to respect all people as valuable in themselves, not just as tools to get what you want. This approach helps you make consistent moral decisions that treat everyone fairly. However, this approach can become too rigid and inflexible. When taken too far, it can ignore real-world situations, individual circumstances, and actual results, leading to moral rules that don\'t account for how complicated people and situations really are.',
    ideals: ['Act from moral duty, not feelings', 'Rules that everyone could follow', 'Freedom through moral reasoning'],
    values: ['Doing your moral duty', 'Using reason in moral decisions', 'Rules that apply to everyone', 'Treating people as valuable, not as tools'],
    intents: ['Act from duty, not from what feels good', 'Follow rules that make sense for everyone', 'Respect everyone\'s inherent value and freedom'],
    subsets: [
      { name: 'Modern Kantian', emphasis: 'Creating yourself through moral reasoning' },
      { name: 'Classical Kantian', emphasis: 'Absolute moral rules and universal principles' }
    ],
    hypocrisyIndicators: ['Apply rules to others but make exceptions for yourself; "Duty applies to everyone but I have good reasons for exceptions"', 'Claim to act from duty but follow your feelings; preach universal rules while making special cases'],
    reluctanceHooks: ['Know what duty requires but hesitate; "I know what\'s right but it conflicts with what I want"', 'Avoid difficult moral decisions; resist applying moral rules consistently when it\'s hard'],
    nihilismHooks: ['Believe moral rules are meaningless; "Universal good doesn\'t matter in an uncaring universe"', 'Think duty has no real purpose; moral rules as empty formulas without meaning'],
    questions: [
      { id: 'kant_1', text: 'I do what\'s right because it\'s the right thing to do, rather than just what I feel like doing', type: 'likert', weight: 1.1 },
      { id: 'kant_2', text: 'I test my actions by asking if everyone could follow this same rule', type: 'likert', weight: 1.0 },
      { id: 'kant_3', text: 'I treat others as valuable in themselves, not as tools for my goals', type: 'likert', weight: 1.1 },
      { id: 'kant_4', text: 'I prioritize following moral principles over considering consequences', type: 'likert', weight: 1.0 }
    ],
    weight: 1.1
  },
  {
    id: 'utilitarianism',
    name: 'Utilitarianism',
    description: 'This philosophy teaches that actions should be judged by their results - specifically, whether they create the most happiness and reduce the most suffering for the most people. It means making decisions based on what creates the best overall outcome for everyone, not on abstract rules. The goal is to create the most well-being and reduce harm for everyone affected. This approach helps you think about the real impact of your choices on actual people. However, this approach risks treating individual people as just numbers in a calculation. When taken too far, it can justify doing harmful things to some people if it helps more others, and it struggles with accurately predicting what will happen in the long run or understanding how to measure happiness across different people.',
    ideals: ['Create the most happiness for the most people', 'Reduce suffering as much as possible', 'Judge actions by their results'],
    values: ['Creating the best overall results', 'Happiness and well-being', 'Preventing harm', 'Helping the most people possible'],
    intents: ['Maximize overall happiness and well-being', 'Minimize suffering everywhere', 'Create the greatest good for the greatest number'],
    subsets: [
      { name: 'Rule-Based', emphasis: 'Follow general rules that usually create the best results, prevent harm' },
      { name: 'Action-Based', emphasis: 'Calculate the best result for each individual action' }
    ],
    hypocrisyIndicators: ['Prioritize your own happiness over everyone\'s; "Greatest good for all but I focus on what helps me"', 'Claim to maximize overall good but act selfishly; talk about helping the most people but prioritize yourself'],
    reluctanceHooks: ['Avoid short-term sacrifice for long-term good; "The best choice requires giving up comfort but I avoid it"', 'Defer to immediate gratification; avoid calculating what would actually help most people'],
    nihilismHooks: ['Believe happiness calculations are meaningless; "Trying to maximize well-being is pointless when nothing really matters"', 'Focus only on pleasure without deeper meaning; utility without purpose'],
    questions: [
      { id: 'util_1', text: 'I judge actions by whether they create the best overall results for everyone', type: 'likert', weight: 1.0 },
      { id: 'util_2', text: 'I prioritize reducing suffering and creating happiness for as many people as possible', type: 'likert', weight: 1.1 },
      { id: 'util_3', text: 'I consider how my actions affect the greatest number of people', type: 'likert', weight: 1.0 },
      { id: 'util_4', text: 'I balance individual freedom with what helps everyone most', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'libertarianism',
    name: 'Libertarianism',
    description: 'This philosophy teaches that you completely own yourself and your property, and the government should have very little power to interfere. It means maximizing individual freedom, allowing people to trade and work together by choice, and protecting property rights. The idea is that people are better off when free to make their own choices without government controlling them. This approach helps protect your right to live your life as you choose without others forcing you. However, this approach may ignore the reality that some people start with huge disadvantages and need help. When taken too far, it can lead to taking advantage of vulnerable people who have no real choice, and it can overlook that true freedom often requires basic things like roads, schools, and protection that individuals cannot provide alone.',
    ideals: ['You own yourself completely', 'Never use force against others', 'Only voluntary exchanges and agreements'],
    values: ['Complete freedom', 'Right to own property', 'You are the boss of yourself', 'Never being forced to do anything'],
    intents: ['Maximize individual freedom', 'Reduce government power as much as possible', 'Protect the right to own property'],
    subsets: [
      { name: 'Anarcho-Capitalist', emphasis: 'No government at all, pure free market' },
      { name: 'Minimal Government', emphasis: 'Tiny government only for basic protection' }
    ],
    hypocrisyIndicators: ['Say freedom matters but support government controls; "Absolute freedom but I support these regulations"', 'Claim you own yourself but depend on others; preach freedom but support forcing people'],
    reluctanceHooks: ['Fear chaos without government; "Minimal government is ideal but I\'m scared without security"', 'Avoid taking full responsibility; rely on authority even though you believe in freedom'],
    nihilismHooks: ['Freedom feels meaningless; "Owning yourself doesn\'t matter in a meaningless universe"', 'Use freedom as excuse to do nothing; own yourself without purpose'],
    questions: [
      { id: 'lib_1', text: 'I believe I completely own myself and my property', type: 'likert', weight: 1.1 },
      { id: 'lib_2', text: 'I oppose government forcing people and support only voluntary agreements', type: 'likert', weight: 1.0 },
      { id: 'lib_3', text: 'I prioritize individual freedom over group goals', type: 'likert', weight: 1.0 },
      { id: 'lib_4', text: 'I take full responsibility for my choices and what happens because of them', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },

  // ========== SPIRITUAL/RELIGIOUS ==========
  {
    id: 'confucianism',
    name: 'Confucianism',
    description: 'This philosophy teaches that you become truly free through building good relationships and following proper rituals and traditions. It means showing respect to older people, keeping social harmony, and practicing kindness and loyalty in your relationships. The idea is that following traditional rituals and showing proper respect actually builds good character and creates a stable, peaceful society. This approach helps create order and respect in relationships and communities. However, this approach can become too rigid when hierarchy suppresses individual expression. When taken too far, it can turn into empty ritual without real goodness, or lead to always deferring to authority even when traditions become oppressive and need to be challenged.',
    ideals: ['Kindness and benevolence toward others', 'Following proper rituals and traditions', 'Respecting parents and elders', 'Maintaining social harmony'],
    values: ['Being kind to others', 'Following traditions and rituals', 'Respecting and caring for parents', 'Loyalty to family and community', 'Treating others as you want to be treated'],
    intents: ['Build harmonious relationships', 'Follow traditional rituals and proper behavior', 'Create social order through being virtuous'],
    subsets: [
      { name: 'Traditional Approach', emphasis: 'Classical teachings, respecting hierarchy and harmony' },
      { name: 'Modern Interpretation', emphasis: 'Updated understanding with deeper philosophical basis' },
      { name: 'Contemporary Application', emphasis: 'Selective use of traditional wisdom for modern life' }
    ],
    hypocrisyIndicators: ['Show kindness publicly but cause conflict privately; "Kindness guides me but I neglect my real responsibilities"', 'Preach harmony but create discord; claim to respect parents but actually ignore them'],
    reluctanceHooks: ['Understand rituals but don\'t practice them; "Proper behavior matters but I skip it for convenience"', 'Know you should respect elders but resist; understand duties but avoid them'],
    nihilismHooks: ['Believe social roles are meaningless; "Traditional harmony doesn\'t matter in a changing world"', 'See rituals as empty without real meaning; harmony as fake conformity'],
    questions: [
      { id: 'conf_1', text: 'Keeping social harmony matters more than expressing my individual opinions', type: 'likert', weight: 1.0 },
      { id: 'conf_2', text: 'I respect and defer to older people\'s wisdom even when I disagree', type: 'likert', weight: 1.1 },
      { id: 'conf_3', text: 'Following traditions and proper rituals helps build real goodness, not just conformity', type: 'likert', weight: 1.0 },
      { id: 'conf_4', text: 'Respecting and caring for parents is the foundation of all other good qualities', type: 'likert', weight: 1.0 },
      { id: 'conf_5', text: 'I practice kindness through maintaining proper relationships with others', type: 'likert', weight: 1.1 }
    ],
    weight: 1.0
  },
  {
    id: 'islam',
    name: 'Islamic Traditions',
    description: 'This philosophy and religion teaches that true freedom comes through submitting to God\'s will (in traditional Islam) or through direct mystical experience of the divine (in Sufi mysticism). It means following divine law, being part of a spiritual community, and finding freedom through surrender to a higher purpose. The traditional path emphasizes following religious law and community obligations, while the mystical path (Sufism) emphasizes direct experience of God through prayer and meditation. This approach helps you find meaning and purpose through connection with the divine and community. However, this approach can become too rigid when religious law suppresses personal spiritual growth. When taken too far, it can lead to strict interpretations that control people unfairly, or to mystical practices that avoid real engagement with religious duties and responsibilities to others.',
    ideals: ['Submitting to God\'s will', 'Following divine law', 'Being part of spiritual community', 'Experiencing direct connection with God'],
    values: ['Submission to divine will', 'God is the ultimate authority', 'Duty to community', 'Direct mystical experience', 'Justice and fairness'],
    intents: ['Submit completely to God\'s will', 'Follow divine law in all matters', 'Strengthen the community of believers', 'Experience direct union with the divine'],
    subsets: [
      { name: 'Sunni Traditional', emphasis: 'Following Quran, traditions, divine law, community' },
      { name: 'Shia Traditional', emphasis: 'Following religious leaders, hidden Imam tradition' },
      { name: 'Sufi Mysticism', emphasis: 'Direct experience of God, love over rules, prayer practice' }
    ],
    hypocrisyIndicators: ['Say divine law is supreme but only follow convenient rules; "God\'s law matters most but I pick which rules to follow"', 'Claim to submit but ignore rules you don\'t like; preach community but isolate yourself'],
    reluctanceHooks: ['Know your religious duties but don\'t fulfill them; "Prayer is important but I keep putting it off"', 'Understand what religious law requires but don\'t practice it; recognize obligations but avoid them'],
    nihilismHooks: ['Believe religious authority is just power games; "Community unity is an illusion in a divided world"', 'See submission as meaningless; religious law as empty rules without purpose'],
    questions: [
      { id: 'islam_1', text: 'Divine law should override human-made laws in all matters', type: 'likert', weight: 1.1 },
      { id: 'islam_2', text: 'Direct experience of God can go beyond religious law (Sufi path)', type: 'likert', weight: 1.0 },
      { id: 'islam_3', text: 'My identity comes primarily from being part of the community of believers', type: 'likert', weight: 1.0 },
      { id: 'islam_4', text: 'Submitting to God is the path to true freedom', type: 'likert', weight: 1.1 },
      { id: 'islam_5', text: 'I practice prayer and remembrance and seek direct experience of God', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    description: 'This philosophy and religion teaches that suffering comes from being attached to things and wanting things, and that you can end suffering through awareness and letting go. It means practicing mindfulness to stay present, developing compassion for all living beings, and reducing your attachment to desires and outcomes. The goal is to find peace and freedom from suffering by understanding how your mind creates it and learning to let go. This approach helps you find inner peace and reduce unnecessary suffering in your life. However, this approach can lead to shutting down your emotions completely. When taken too far, it can become an excuse to avoid dealing with real problems and necessary suffering, or to use spiritual practices to escape from facing difficult emotions and personal growth that actually needs to happen.',
    ideals: ['Ending suffering completely', 'Understanding the four truths about suffering', 'Following the eight-step path to freedom'],
    values: ['Compassion for all beings', 'Staying present and aware', 'Letting go of attachment', 'Wisdom through understanding'],
    intents: ['End suffering by understanding its causes', 'Develop compassion for everyone', 'Practice letting go of attachment to things and outcomes'],
    subsets: [
      { name: 'Individual Path', emphasis: 'Focus on your own enlightenment through meditation' },
      { name: 'Compassionate Path', emphasis: 'Help all beings find freedom from suffering' },
      { name: 'Direct Insight', emphasis: 'Gain immediate understanding through present-moment awareness' }
    ],
    hypocrisyIndicators: ['Meditate but still cling to wants; "Letting go matters but I still grasp at outcomes"', 'Preach compassion but judge others; claim non-attachment but accumulate things'],
    reluctanceHooks: ['Avoid the work needed; "The path to freedom is clear but I delay practicing it"', 'Skip meditation practice; resist facing the suffering that needs attention'],
    nihilismHooks: ['Believe suffering is endless; "The cycle of suffering proves nothing really matters"', 'See letting go as meaninglessness; detachment as escape without purpose'],
    questions: [
      { id: 'budd_1', text: 'I practice staying aware and present in each moment', type: 'likert', weight: 1.1 },
      { id: 'budd_2', text: 'I work on reducing how much I cling to wants and cravings', type: 'likert', weight: 1.0 },
      { id: 'budd_3', text: 'I develop care and kindness for all living beings', type: 'likert', weight: 1.1 },
      { id: 'budd_4', text: 'I understand that suffering comes from being too attached to things and can be ended', type: 'likert', weight: 1.0 },
      { id: 'budd_5', text: 'I follow ethical principles like speaking truthfully and acting with kindness', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'taoism',
    name: 'Taoism',
    description: 'This philosophy teaches that you should align yourself with the natural flow of life rather than forcing things to happen. It means acting without struggling, finding balance between opposites, and living simply in harmony with nature. The idea is that the best action feels effortless because it flows with how things naturally are, not against them. This approach helps you work with life instead of fighting against it, making things easier and more natural. However, this approach can become an excuse to do nothing. When taken too far, "going with the flow" can turn into passive resignation or avoiding necessary effort and responsibility, using "natural flow" as an escape from making difficult choices or taking action when action is actually needed.',
    ideals: ['Effortless action that flows naturally', 'Spontaneity and natural response', 'Balance between opposites'],
    values: ['Harmony with nature', 'Simplicity in living', 'Acting naturally', 'Finding balance'],
    intents: ['Flow with how things naturally are', 'Act without forcing or struggling', 'Maintain balance between opposites'],
    subsets: [
      { name: 'Philosophical Approach', emphasis: 'Natural flow, simplicity, understanding the way things work' },
      { name: 'Religious Practice', emphasis: 'Seeking longevity and transformation through practices' }
    ],
    hypocrisyIndicators: ['Force things while claiming to flow; "Harmony guides me but I over-control everything"', 'Struggle against outcomes while preaching effortless action; claim simplicity but complicate everything'],
    reluctanceHooks: ['Work too hard against natural flow; "Effortless action calls but I keep pushing"', 'Resist how things naturally are; force outcomes through struggle'],
    nihilismHooks: ['Give up passively; "All attempts to align dissolve into chaos anyway"', 'Use non-action as excuse for meaninglessness; flow without any direction or purpose'],
    questions: [
      { id: 'tao_1', text: 'I act in ways that flow with how things naturally are rather than forcing outcomes', type: 'likert', weight: 1.0 },
      { id: 'tao_2', text: 'I value simplicity and natural living over complicated approaches', type: 'likert', weight: 1.0 },
      { id: 'tao_3', text: 'I seek balance and harmony in everything I do', type: 'likert', weight: 1.0 },
      { id: 'tao_4', text: 'I practice acting effortlessly, without unnecessary struggle', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'christianity',
    name: 'Christianity',
    description: 'This religion teaches that true freedom comes through aligning what you want with what God wants, and that you are saved by grace and love rather than your own efforts. It means practicing unconditional love toward everyone, serving others, and trusting in forgiveness and the chance to start over. The core idea is that divine love and grace make it possible to live a meaningful life of service and love. This approach helps you find purpose through love and service to others. However, this approach can lead to rigid moral rules that judge others harshly. When taken too far, it can become an excuse to avoid taking responsibility for your actions by saying "it\'s God\'s will," or to use the idea of grace to avoid being accountable for the harm you cause to others.',
    ideals: ['Unconditional divine love for everyone', 'Being saved by grace, not works', 'Serving others'],
    values: ['Love for all people', 'Faith in God', 'Hope for redemption', 'Helping others'],
    intents: ['Align your will with God\'s will', 'Love God and love your neighbor', 'Serve others as an act of faith'],
    subsets: [
      { name: 'Grace-Focused', emphasis: 'Saved by grace, predestination, God enables your will' },
      { name: 'Free Will', emphasis: 'You choose to follow God, human choice matters' },
      { name: 'Divine Sovereignty', emphasis: 'Tension between predestination and human responsibility' }
    ],
    hypocrisyIndicators: ['Say you love everyone but judge harshly; "Love is central but I withhold it from people I disapprove of"', 'Claim grace while condemning others; preach service but serve yourself first'],
    reluctanceHooks: ['Fear stops you from loving boldly; "Faith requires bold love but I hesitate"', 'Avoid difficult acts of love; resist what you feel called to do'],
    nihilismHooks: ['Despair about suffering; "A world with this much suffering makes divine purpose seem meaningless"', 'Have faith without doing good works; use grace as excuse to avoid responsibility'],
    questions: [
      { id: 'christ_1', text: 'I try to align what I want with what God wants', type: 'likert', weight: 1.1 },
      { id: 'christ_2', text: 'I practice unconditional love toward everyone, even people I don\'t like', type: 'likert', weight: 1.1 },
      { id: 'christ_3', text: 'I serve and help others as a way of expressing my faith', type: 'likert', weight: 1.0 },
      { id: 'christ_4', text: 'I trust in grace and the possibility of redemption', type: 'likert', weight: 1.0 },
      { id: 'christ_5', text: 'I find meaning and purpose in my relationship with God', type: 'likert', weight: 0.9 }
    ],
    weight: 1.1
  },
  {
    id: 'humanism',
    name: 'Humanism',
    description: 'This philosophy teaches that people have built-in worth and potential, and that you should use reason and evidence to live ethically without needing religion. It means believing in human capacity for goodness, using logic to make moral decisions, and promoting human well-being and progress. The idea is that people can create meaning and live good lives through clear thinking, compassion, and working together. This approach helps you trust in human ability to solve problems and improve life through cooperation and understanding. However, this approach may overestimate how rational people actually are. When taken too far, it can become overly optimistic, ignoring how dark human nature can be, or assume that clear thinking alone is enough when people are often driven by emotions, biases, and destructive impulses that reason cannot fully control.',
    ideals: ['All people have inherent worth and dignity', 'Using reason and inquiry to understand', 'Living ethically without needing religion'],
    values: ['Using reason and logic', 'Compassion for others', 'Believing in human potential', 'Taking ethical responsibility'],
    intents: ['Help people reach their potential', 'Promote human dignity everywhere', 'Live ethically using reason and evidence'],
    subsets: [
      { name: 'Secular Approach', emphasis: 'Ethics based on evidence and reason, no religion needed' },
      { name: 'Spiritual Approach', emphasis: 'Spiritual but focused on humans, not a deity' }
    ],
    hypocrisyIndicators: ['Say ethics should be evidence-based but follow dogmatic beliefs; "Human potential matters but I ignore facts when they\'re uncomfortable"', 'Claim to use reason but follow dogma; preach human dignity while treating some people as less than human'],
    reluctanceHooks: ['Defer to easy beliefs instead of thinking; "Reason should guide me but I go with what\'s familiar"', 'Avoid rational inquiry; resist ethical responsibility; stick to comfortable beliefs'],
    nihilismHooks: ['Believe human potential is meaningless; "Without cosmic purpose, human potential crumbles to nothing"', 'See humanism as empty optimism; reason without deeper meaning'],
    questions: [
      { id: 'human_1', text: 'I believe all people have built-in worth and the ability to grow', type: 'likert', weight: 1.0 },
      { id: 'human_2', text: 'I use logic and evidence to guide my ethical and moral decisions', type: 'likert', weight: 1.1 },
      { id: 'human_3', text: 'I work to promote human well-being and help people grow and do well', type: 'likert', weight: 1.0 },
      { id: 'human_4', text: 'I find meaning in human relationships and progress toward better lives', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },

  // ========== PSYCHOLOGICAL/SELF-HELP ==========
  {
    id: 'deep_ecology',
    name: 'Deep Ecology / Biocentrism',
    description: 'This philosophy teaches that nature has value in itself, not just because it\'s useful to humans, and that you should expand your sense of self to include the entire ecosystem. It means recognizing that all living things matter, not just people, and that humans should live within ecological limits rather than dominating nature. The idea is to develop an "ecological self" where you feel connected to and responsible for the whole natural world. This approach helps you see yourself as part of nature rather than separate from it, which can create a deeper sense of responsibility for protecting the environment. However, this approach can become an extreme rejection of human value. When taken too far, it can romanticize pre-industrial life while ignoring real suffering, or prioritize abstract nature over actual human needs without offering realistic alternatives for how billions of people should actually live.',
    ideals: ['Nature has value just for existing', 'Your identity includes the whole ecosystem', 'All life forms are equal', 'Ecological wisdom guides living'],
    values: ['All life matters, not just human life', 'Seeing yourself as part of nature', 'Challenging human-centered thinking', 'Protecting entire ecosystems'],
    intents: ['Expand your sense of self to include nature', 'Practice ethics that value all life equally', 'Challenge the idea that humans are most important'],
    subsets: [
      { name: 'Ecological Philosophy', emphasis: 'Deep ecology principles, realizing your connection to nature' },
      { name: 'Place-Based Identity', emphasis: 'Identity tied to local ecology and environment' },
      { name: 'Planetary Consciousness', emphasis: 'Earth as one living system, global awareness' }
    ],
    hypocrisyIndicators: ['Preach ecology but consume heavily; "Nature has intrinsic value but I fly frequently and eat factory-farmed food"', 'Talk about valuing all life but live a high-impact lifestyle; claim biocentrism but prioritize human comfort'],
    reluctanceHooks: ['Understand the limits but don\'t change; "The ecological limits are clear but I don\'t reduce my impact"', 'Know your impact but don\'t reduce it; understand ecological connection but don\'t expand your identity'],
    nihilismHooks: ['Believe collapse is inevitable; "Ecosystems are going to collapse anyway, so why try?"', 'See human extinction as positive; believe nature has no meaning'],
    questions: [
      { id: 'eco_1', text: 'Plants and animals have value just for existing, not only because they\'re useful to humans', type: 'likert', weight: 1.1 },
      { id: 'eco_2', text: 'I feel connected to and part of the broader natural world, not separate from it', type: 'likert', weight: 1.0 },
      { id: 'eco_3', text: 'Human well-being should be limited by what the earth can actually sustain', type: 'likert', weight: 1.1 },
      { id: 'eco_4', text: 'Thinking humans are the most important is the root cause of environmental problems', type: 'likert', weight: 1.0 },
      { id: 'eco_5', text: 'I practice thinking about nature and the environment in my daily choices', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'positive_psychology',
    name: 'Positive Psychology',
    description: 'This approach teaches that you can build strength and well-being by focusing on positive emotions, doing activities that fully engage you, and building on your natural character strengths. It means creating happiness, finding activities that fully absorb you, building good relationships, finding meaning, and recognizing your accomplishments. The idea is to focus on what\'s working and build from there rather than only fixing what\'s broken. This approach helps you grow by building on your strengths and positive experiences. However, this approach can become "toxic positivity" that denies real suffering. When taken too far, it can pressure you to feel positive all the time, ignore your darker emotions and difficult parts of yourself, or dismiss negative feelings that are actually necessary and valid responses to genuinely difficult situations.',
    ideals: ['Well-being through positive emotions, engagement, relationships, meaning, and accomplishment', 'Experiencing flow - being fully absorbed in activities', 'Building on your natural strengths'],
    values: ['Bouncing back from difficulty', 'Looking on the bright side', 'Using your natural talents', 'Overall well-being and happiness'],
    intents: ['Cultivate positive emotions and experiences', 'Find activities that fully engage and absorb you', 'Build on your natural character strengths'],
    subsets: [
      { name: 'PERMA Model', emphasis: 'Well-being through positive emotions, engagement, relationships, meaning, accomplishment' },
      { name: 'Flow Experience', emphasis: 'Being fully absorbed in challenging activities' }
    ],
    hypocrisyIndicators: ['Talk about strengths but focus on weaknesses; "Optimism matters but I dwell on the negative"', 'Preach optimism while being pessimistic; claim resilience while avoiding challenges'],
    reluctanceHooks: ['Get stuck in negative patterns; "The well-being practices are clear but I resist doing them"', 'Avoid difficult emotions; resist working on shadow aspects; stay in negative patterns'],
    nihilismHooks: ['Believe well-being is fake; "Resilience is pointless when everything falls apart anyway"', 'See positivity as denial; optimism without any real depth or meaning'],
    questions: [
      { id: 'pos_1', text: 'I actively work on creating positive emotions and good experiences in my life', type: 'likert', weight: 1.0 },
      { id: 'pos_2', text: 'I seek out activities that fully engage and absorb me', type: 'likert', weight: 1.0 },
      { id: 'pos_3', text: 'I build on and develop my natural character strengths', type: 'likert', weight: 1.0 },
      { id: 'pos_4', text: 'I prioritize building relationships and finding meaning in my life', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },
  {
    id: 'cognitive_behavioral',
    name: 'Cognitive Behavioral',
    description: 'This approach teaches that your thoughts shape how you experience reality, and that you can change your feelings and behaviors by identifying and changing unhelpful thinking patterns. It means recognizing when your thoughts are unrealistic or unhelpful, reframing them using evidence and logic, and changing behaviors that make problems worse. The idea is to become aware of how your mind distorts reality and learn to think more accurately and helpfully. This approach helps you change unhelpful thought patterns and behaviors that are causing problems. However, this approach can become an intellectual way to avoid real emotions. When taken too far, it may overemphasize that problems are all in your head while ignoring real systemic problems, or reduce complex human experiences to simple "distortions" that need fixing, missing deeper emotional and relationship issues.',
    ideals: ['Your thoughts create your experience of reality', 'Restructuring how you think', 'Changing behaviors that reinforce problems'],
    values: ['Using logic and reason', 'Evidence-based thinking', 'Practical solutions', 'Believing you can change'],
    intents: ['Find and change unhelpful thinking patterns', 'Reframe negative thoughts using logic and evidence', 'Change behaviors that make problems worse'],
    subsets: [
      { name: 'REBT Approach', emphasis: 'Identifying irrational beliefs and disputing them' },
      { name: 'CBT Approach', emphasis: 'Finding thinking distortions and restructuring thoughts' }
    ],
    hypocrisyIndicators: ['Know your biases but keep repeating them; "I know I should be rational but my irrational fears persist"', 'Point out others\' distortions but ignore your own; preach rationality while being driven by emotions'],
    reluctanceHooks: ['Stay stuck in negative thinking loops; "I know my thinking is distorted but I don\'t change it"', 'Get stuck in negative patterns; resist challenging your beliefs; avoid changing behaviors'],
    nihilismHooks: ['Believe evidence feels cold; "Reframing thoughts can\'t fill the emptiness inside"', 'See thoughts as meaningless; cognitive techniques as empty exercises'],
    questions: [
      { id: 'cbt_1', text: 'I notice when my thinking is unrealistic or unhelpful and work to challenge it', type: 'likert', weight: 1.1 },
      { id: 'cbt_2', text: 'I change how I think about negative thoughts using evidence and clear thinking', type: 'likert', weight: 1.0 },
      { id: 'cbt_3', text: 'I change my behaviors to match more rational and helpful thinking', type: 'likert', weight: 1.0 },
      { id: 'cbt_4', text: 'I use practical techniques to manage my thoughts and emotions', type: 'likert', weight: 0.9 }
    ],
    weight: 1.0
  },
  {
    id: 'mindfulness_secular',
    name: 'Mindfulness (Secular)',
    description: 'This practice teaches that you can develop more control and freedom through staying present and observing your experience without judgment. It means practicing awareness of the present moment, accepting what\'s happening without trying to change or judge it, and learning to respond thoughtfully rather than react automatically. The idea is that awareness and acceptance give you more choice and control over your responses. This approach helps you stay calm and make better decisions by being fully present. However, this approach can become passive observation without taking action. When taken too far, it can be used to avoid dealing with real problems that need to be addressed, or become a corporate stress-management tool that helps people cope with oppressive systems instead of actually challenging or changing them.',
    ideals: ['Staying aware of the present moment', 'Observing without judging or reacting', 'Accepting experience as it is'],
    values: ['Awareness of what\'s happening', 'Accepting rather than resisting', 'Being fully present', 'Staying calm and balanced'],
    intents: ['Develop awareness of the present moment', 'Observe experience without automatically judging it', 'Accept what\'s happening rather than fighting it'],
    subsets: [
      { name: 'Stress Reduction', emphasis: 'Mindfulness-based stress reduction, practical intervention' },
      { name: 'Insight Practice', emphasis: 'Direct insight into how experience works, meditation roots' }
    ],
    hypocrisyIndicators: ['Observe but still judge; "I practice non-judgmental awareness but I still critique myself harshly"', 'Meditate but avoid difficult emotions; claim acceptance while still judging'],
    reluctanceHooks: ['Avoid the discomfort of practice; "Awareness practice is important but I skip it when it\'s uncomfortable"', 'Skip meditation practice; avoid facing difficult experiences'],
    nihilismHooks: ['Awareness reveals emptiness; "Being present just shows me that everything is ultimately empty"', 'Awareness without purpose; acceptance as passive resignation'],
    questions: [
      { id: 'mind_1', text: 'I practice staying aware of the present moment regularly', type: 'likert', weight: 1.1 },
      { id: 'mind_2', text: 'I observe my experiences without automatically judging them', type: 'likert', weight: 1.0 },
      { id: 'mind_3', text: 'I accept experiences as they are rather than resisting or fighting them', type: 'likert', weight: 1.0 },
      { id: 'mind_4', text: 'I use mindfulness to respond thoughtfully rather than react automatically', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  },

  // ========== COUNTER/EDGE PARADIGMS ==========
  {
    id: 'nihilism',
    name: 'Nihilism',
    description: 'This philosophy recognizes that life has no built-in meaning or value. Some see this meaninglessness as freeing - freeing you from false meanings and allowing you to create your own values. Others see it as reason to give up and withdraw from life. The honest recognition that nothing has built-in meaning can be powerful, but it requires actively creating meaning despite the void. This honest recognition can free you from false meanings and let you create what actually matters to you. However, this recognition can completely paralyze you. When not paired with active value creation, it can lead to despair, complete withdrawal from life, or become an excuse for destructive behavior when "nothing matters" becomes a reason to harm yourself or others rather than a reason to create what matters.',
    ideals: ['Life has no built-in meaning', 'Nothing has inherent value', 'Freedom from false meanings'],
    values: ['Facing truth honestly', 'Accepting reality completely', 'Freedom from illusions', 'Being authentic'],
    intents: ['Face the truth that nothing has inherent meaning', 'Create your own values even though nothing matters inherently', 'Free yourself from false meanings and illusions'],
    subsets: [
      { name: 'Passive Approach', emphasis: 'Resigning and withdrawing because nothing matters' },
      { name: 'Active Approach', emphasis: 'Creating values and meaning despite recognizing nothing matters inherently' }
    ],
    hypocrisyIndicators: ['Claim nothing matters but chase distractions; "Life is meaningless but I still pursue things as if they matter"', 'Say meaninglessness is freeing but seek meaning; preach honesty while deceiving yourself'],
    reluctanceHooks: ['Paralyzed by recognition of void; "I know nothing matters but I can\'t bring myself to act"', 'Avoid creating values; resist action because of despair'],
    nihilismHooks: ['Complete despair; "All my efforts just prove that nothing really matters"', 'Meaninglessness paralyzes completely; void becomes excuse to do nothing; despair without any purpose'],
    questions: [
      { id: 'nihil_1', text: 'I honestly face the fact that existence has no built-in meaning', type: 'likert', weight: 1.0 },
      { id: 'nihil_2', text: 'I see freedom in recognizing there\'s no built-in meaning', type: 'likert', weight: 1.0 },
      { id: 'nihil_3', text: 'I create my own values and meaning even though nothing matters on its own', type: 'likert', weight: 1.1 },
      { id: 'nihil_4', text: 'I resist false meanings and self-deception about what matters', type: 'likert', weight: 1.0 }
    ],
    weight: 0.9
  },
  {
    id: 'postmodern_relativism',
    name: 'Postmodern Relativism',
    description: 'This philosophy teaches that truth is not absolute but created by power and culture, and that you should question dominant stories and fixed categories. It means critiquing how power shapes what we consider "true," recognizing that identity can change rather than being fixed, and taking apart assumptions about reality. The idea is that what seems objectively true is often shaped by social power, and recognizing this gives you more freedom to question things. This approach helps you see how power and culture shape what we believe is true. However, this approach can lead to endless questioning that paralyzes action. When taken too far, relativism can undermine all values including necessary ones, or become pure deconstruction that tears everything down without building anything to replace it, leaving nothing solid to act on or believe in.',
    ideals: ['Truth is constructed, not absolute', 'Questioning how power creates reality', 'Identity is fluid and changeable'],
    values: ['Questioning everything', 'Critiquing power and assumptions', 'Rejecting fixed categories', 'Resisting dominant stories'],
    intents: ['Take apart dominant stories and assumptions', 'Critique how power shapes what we believe is true', 'Embrace identity as fluid and changeable'],
    subsets: [
      { name: 'Power Critique', emphasis: 'Analyzing how power creates what we consider true' },
      { name: 'Deconstruction', emphasis: 'Taking apart assumptions to reveal hidden meanings' }
    ],
    hypocrisyIndicators: ['Critique power but use it; "All truth is relative but I impose my version"', 'Deconstruct others\' truths but hold your own as fixed; claim fluidity while staying fixed; preach critique while conforming'],
    reluctanceHooks: ['Endless questioning stops action; "I can deconstruct everything but I can\'t build anything"', 'Skepticism paralyzes; avoid commitment because everything is relative; resist action'],
    nihilismHooks: ['Fluidity becomes chaos; "If everything is relative, it all dissolves into meaninglessness"', 'Relativism as meaninglessness; deconstruction without building anything new'],
    questions: [
      { id: 'post_1', text: 'I question dominant stories and how power shapes what we believe is true', type: 'likert', weight: 1.0 },
      { id: 'post_2', text: 'I see truth as created by culture and power rather than being completely real', type: 'likert', weight: 1.0 },
      { id: 'post_3', text: 'I embrace identity as something that can change rather than being fixed', type: 'likert', weight: 1.0 },
      { id: 'post_4', text: 'I resist fixed categories and the idea that things have fixed, unchanging natures', type: 'likert', weight: 0.9 }
    ],
    weight: 0.9
  },
  {
    id: 'absurdism',
    name: 'Absurdism',
    description: 'This philosophy recognizes that life has no built-in meaning, but instead of giving up, you should rebel against that meaninglessness by creating your own meaning anyway. It means seeing that the universe is silent and doesn\'t care about us, but choosing to create meaning and values through defiant action anyway. The idea is that even though nothing matters inherently, you can find meaning by rebelling against meaninglessness and living with purpose despite the void. This gives you freedom to create what matters even though nothing matters inherently. However, constantly recognizing that everything is absurd can become exhausting. When taken too far, the demand for constant rebellion may lack clear direction, and defiance without deeper purpose can turn into just being contrary or putting on a show of resistance without actually building anything meaningful.',
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
      { id: 'absurd_1', text: 'I recognize that humans need meaning but the universe is silent and doesn\'t care', type: 'likert', weight: 1.1 },
      { id: 'absurd_2', text: 'I rebel against meaninglessness by taking action anyway', type: 'likert', weight: 1.1 },
      { id: 'absurd_3', text: 'I create meaning through the act of rebelling itself', type: 'likert', weight: 1.0 },
      { id: 'absurd_4', text: 'I find value in rebelling despite recognizing that nothing matters on its own', type: 'likert', weight: 1.0 }
    ],
    weight: 1.0
  }
];

