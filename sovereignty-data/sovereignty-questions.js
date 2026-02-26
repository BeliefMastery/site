// AI Sovereignty Assessment Questions
// 4 sections: Usage Patterns, Cognitive Style, Attachment, Sovereignty

export const SECTION_1_USAGE_PATTERNS = [
  {
    id: 'u1',
    section: 1,
    question: 'When facing a difficult decision, I turn to AI because:',
    type: 'multiple_choice',
    options: [
      {
        text: 'It helps me organize my thoughts (Tool)',
        scores: { dependency: 1, attachment: 0, sovereignty: -1 },
        attachmentMode: 'tool'
      },
      {
        text: 'It understands me and helps me feel less alone (Companion)',
        scores: { dependency: 3, attachment: 4, sovereignty: -3 },
        attachmentMode: 'companion'
      },
      {
        text: 'It knows better than I do what\'s right (Authority)',
        scores: { dependency: 5, attachment: 5, sovereignty: -5 },
        attachmentMode: 'authority'
      },
      {
        text: 'I don\'t typically use AI for decisions (Independent)',
        scores: { dependency: -2, attachment: -2, sovereignty: 5 },
        attachmentMode: 'independent'
      }
    ]
  },
  {
    id: 'u2',
    section: 1,
    question: 'On average, how often do you use AI tools (ChatGPT, Claude, etc.) per day?',
    type: 'frequency',
    options: [
      { text: 'Never', scores: { dependency: -5, sovereignty: 5 } },
      { text: 'Rarely (a few times a week)', scores: { dependency: -2, sovereignty: 3 } },
      { text: 'Daily (1-5 times)', scores: { dependency: 2, sovereignty: 0 } },
      { text: 'Multiple times daily (5-20 times)', scores: { dependency: 4, sovereignty: -3 } },
      { text: 'Constantly (20+ times)', scores: { dependency: 6, sovereignty: -5 } }
    ]
  },
  {
    id: 'u3',
    section: 1,
    question: 'If AI tools disappeared tomorrow, I would:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Be mildly inconvenienced',
        scores: { dependency: 0, sovereignty: 2 },
        cognitiveLevel: 'low'
      },
      {
        text: 'Need to relearn some workflows',
        scores: { dependency: 2, sovereignty: 0 },
        cognitiveLevel: 'medium'
      },
      {
        text: 'Struggle significantly with creative/strategic work',
        scores: { dependency: 4, sovereignty: -3 },
        cognitiveLevel: 'high'
      },
      {
        text: 'Feel lost or incomplete',
        scores: { dependency: 6, attachment: 5, sovereignty: -5 },
        cognitiveLevel: 'very_high'
      }
    ]
  },
  {
    id: 'u4',
    section: 1,
    question: 'Close friends or colleagues who know you well would say AI has changed you by:',
    type: 'multiple_response',
    options: [
      {
        text: 'You\'re faster at routine tasks',
        scores: { dependency: 1, sovereignty: -1 }
      },
      {
        text: 'Your ideas are more structured/polished',
        scores: { dependency: 2, sovereignty: -2 }
      },
      {
        text: 'Your speaking style sounds more like AI responses',
        scores: { dependency: 5, attachment: 5, sovereignty: -5 },
        risk: 'identity_drift'
      },
      {
        text: 'No noticeable change in how you think or express yourself',
        scores: { dependency: -2, sovereignty: 3 }
      }
    ]
  },
  {
    id: 'u5',
    section: 1,
    question: 'I use AI most often for:',
    type: 'frequency_grid',
    contexts: ['Work tasks', 'Creative projects', 'Personal decisions', 'Emotional support', 'Learning new things', 'Social interactions'],
    scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'u6',
    section: 1,
    question: 'When I need to write something important, I:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Write it myself entirely',
        scores: { sovereignty: 4, dependency: -3 }
      },
      {
        text: 'Use AI for ideas but write my own draft',
        scores: { sovereignty: 1, dependency: 1 }
      },
      {
        text: 'Use AI to draft and then edit',
        scores: { sovereignty: -2, dependency: 3 }
      },
      {
        text: 'Have AI write it and I approve/edit lightly',
        scores: { sovereignty: -4, dependency: 5, risk: 'fluency_addict' }
      }
    ]
  },
  {
    id: 'u7',
    section: 1,
    question: 'In the past month, I have used AI to help with:',
    type: 'multiple_response',
    options: [
      { text: 'Deciding what to buy', scores: { dependency: 2 } },
      { text: 'Understanding my emotions', scores: { dependency: 3, attachment: 4, sovereignty: -3 } },
      { text: 'Planning my day or schedule', scores: { dependency: 1 } },
      { text: 'Getting relationship advice', scores: { dependency: 4, attachment: 5, sovereignty: -4 } },
      { text: 'None of the above', scores: { dependency: -3, sovereignty: 3 } }
    ]
  },
  {
    id: 'u8',
    section: 1,
    question: 'My typical AI prompt style is:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Simple, single questions ("How do I...?")',
        scores: { cognitiveLevel: 'low', dependency: 1 }
      },
      {
        text: 'Task-oriented with clear outcomes ("Help me create...")',
        scores: { cognitiveLevel: 'medium', dependency: 2 }
      },
      {
        text: 'Multi-step reasoning ("First analyze X, then consider Y...")',
        scores: { cognitiveLevel: 'high', dependency: 3 }
      },
      {
        text: 'Exploratory or meta-cognitive ("What are the frameworks for...?")',
        scores: { cognitiveLevel: 'very_high', dependency: 4, risk: 'mirror_loop' }
      }
    ]
  },
  {
    id: 'u9',
    section: 1,
    question: 'I reach for AI most when I feel:',
    type: 'multiple_response',
    options: [
      { text: 'Stressed or overwhelmed', scores: { dependency: 3, sovereignty: -2 } },
      { text: 'Uncertain or confused', scores: { dependency: 2, sovereignty: -2 } },
      { text: 'Lonely or isolated', scores: { dependency: 4, attachment: 5, sovereignty: -4 } },
      { text: 'Lazy or unmotivated', scores: { dependency: 3, sovereignty: -3 } },
      { text: 'Curious and exploring', scores: { dependency: 1, sovereignty: 0 } },
      { text: 'I don\'t have emotional triggers for AI use', scores: { dependency: -2, sovereignty: 3 } }
    ]
  },
  {
    id: 'u10',
    section: 1,
    question: 'When AI gives me an answer I disagree with, I:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Ignore it and do what I planned',
        scores: { sovereignty: 3, dependency: -1, attachment: -2 }
      },
      {
        text: 'Consider it but trust my judgment',
        scores: { sovereignty: 1, dependency: 0 }
      },
      {
        text: 'Feel confused about who\'s right',
        scores: { sovereignty: -2, dependency: 3, attachment: 2 }
      },
      {
        text: 'Usually defer to what it said',
        scores: { sovereignty: -4, dependency: 5, attachment: 4, risk: 'authority_dependency' }
      }
    ]
  },
  {
    id: 'u11',
    section: 1,
    question: 'After a conversation with AI, someone asks you to explain an idea you just shared. You realize:',
    type: 'scenario',
    options: [
      {
        text: 'You can point to specific AI-generated parts vs. your own contributions',
        scores: { sovereignty: 5, dependency: -2 }
      },
      {
        text: 'You can mostly distinguish, with occasional uncertainty',
        scores: { sovereignty: 2, dependency: -1 }
      },
      {
        text: 'You\'re often uncertain which parts came from you',
        scores: { sovereignty: -1, dependency: 2 }
      },
      {
        text: 'You frequently find yourself unsure of the origin of your thoughts',
        scores: { sovereignty: -3, dependency: 4, risk: 'identity_drift' }
      },
      {
        text: 'You genuinely can\'t tell where your ideas end and AI\'s begin',
        scores: { sovereignty: -5, dependency: 6, risk: 'identity_drift' }
      }
    ]
  },
  {
    id: 'u12',
    section: 1,
    question: 'In the past week, I have deliberately chosen slower, manual methods over AI assistance:',
    type: 'frequency',
    options: [
      { text: 'Never or rarely', scores: { sovereignty: -3, dependency: 3 } },
      { text: 'A few times', scores: { sovereignty: 0, dependency: 0 } },
      { text: 'Weekly', scores: { sovereignty: 2, dependency: -1 } },
      { text: 'Daily or near-daily', scores: { sovereignty: 5, dependency: -3 } }
    ]
  },
  {
    id: 'u13',
    section: 1,
    question: 'My relationship with AI has changed over time:',
    type: 'multiple_choice',
    options: [
      {
        text: 'I use it less now (more selective)',
        scores: { sovereignty: 3, dependency: -2 }
      },
      {
        text: 'About the same',
        scores: { sovereignty: 0, dependency: 0 }
      },
      {
        text: 'I use it more now (more integrated)',
        scores: { sovereignty: -2, dependency: 3 }
      },
      {
        text: 'I can\'t imagine life without it',
        scores: { sovereignty: -5, dependency: 6, attachment: 5, risk: 'dependency' }
      }
    ]
  },
  {
    id: 'u14',
    section: 1,
    question: 'When working on creative projects, I:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Start from scratch, using only my own ideas',
        scores: { sovereignty: 5, dependency: -3 }
      },
      {
        text: 'Use AI for inspiration but create independently',
        scores: { sovereignty: 2, dependency: 0 }
      },
      {
        text: 'Collaborate with AI as a thinking partner',
        scores: { sovereignty: -1, dependency: 2 }
      },
      {
        text: 'Primarily use AI to generate and refine my work',
        scores: { sovereignty: -4, dependency: 5, risk: 'fluency_addict' }
      }
    ]
  },
  {
    id: 'u15',
    section: 1,
    question: 'I track my AI usage:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Yes, actively monitor and limit usage',
        scores: { sovereignty: 4, dependency: -2 }
      },
      {
        text: 'Aware but don\'t track formally',
        scores: { sovereignty: 1, dependency: 0 }
      },
      {
        text: 'No, I don\'t think about it',
        scores: { sovereignty: -2, dependency: 3 }
      },
      {
        text: 'No need - it\'s always available',
        scores: { sovereignty: -4, dependency: 5 }
      }
    ]
  }
];

export const SECTION_2_COGNITIVE_STYLE = [
  {
    id: 'c1',
    section: 2,
    question: 'When learning something new, I prefer to:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Follow clear step-by-step instructions',
        scores: { cognitiveLevel: 'low', sovereignty: 0 }
      },
      {
        text: 'Understand the underlying principles first',
        scores: { cognitiveLevel: 'medium', sovereignty: 1 }
      },
      {
        text: 'Build mental models across multiple domains',
        scores: { cognitiveLevel: 'high', sovereignty: 2 }
      },
      {
        text: 'Question the frameworks themselves',
        scores: { cognitiveLevel: 'very_high', sovereignty: 3, risk: 'mirror_loop' }
      }
    ]
  },
  {
    id: 'c2',
    section: 2,
    question: 'When I encounter a problem, I typically:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Look for the fastest solution',
        scores: { cognitiveLevel: 'low', sovereignty: -2 }
      },
      {
        text: 'Understand how it works before solving',
        scores: { cognitiveLevel: 'medium', sovereignty: 0 }
      },
      {
        text: 'Map it to broader patterns I\'ve seen',
        scores: { cognitiveLevel: 'high', sovereignty: 2 }
      },
      {
        text: 'Question whether it\'s the right problem',
        scores: { cognitiveLevel: 'very_high', sovereignty: 3 }
      }
    ]
  },
  {
    id: 'c3',
    section: 2,
    question: 'My thinking feels most clear when:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Following proven methods',
        scores: { cognitiveLevel: 'low', sovereignty: 0 }
      },
      {
        text: 'Building systematic approaches',
        scores: { cognitiveLevel: 'medium', sovereignty: 1 }
      },
      {
        text: 'Connecting across multiple domains',
        scores: { cognitiveLevel: 'high', sovereignty: 2 }
      },
      {
        text: 'Deconstructing frameworks themselves',
        scores: { cognitiveLevel: 'very_high', sovereignty: 3, risk: 'over_coherence' }
      }
    ]
  },
  {
    id: 'c4_1',
    section: 2,
    question: 'A problem has no clear solution and conflicting expert opinions. You:',
    type: 'scenario',
    options: [
      {
        text: 'Feel highly anxious - you need clear answers to proceed',
        scores: { cognitiveLevel: -2, sovereignty: -1 }
      },
      {
        text: 'Feel somewhat uncomfortable but can manage',
        scores: { cognitiveLevel: -1, sovereignty: 0 }
      },
      {
        text: 'Feel moderately comfortable navigating the uncertainty',
        scores: { cognitiveLevel: 1, sovereignty: 1 }
      },
      {
        text: 'Feel quite comfortable - uncertainty is normal and manageable',
        scores: { cognitiveLevel: 2, sovereignty: 2 }
      },
      {
        text: 'Feel very comfortable - you enjoy working with uncertainty',
        scores: { cognitiveLevel: 3, sovereignty: 3 }
      }
    ]
  },
  {
    id: 'c4_2',
    section: 2,
    question: 'Two trusted sources give you directly contradictory advice. You:',
    type: 'scenario',
    options: [
      {
        text: 'Choose one and dismiss the other as wrong',
        scores: { cognitiveLevel: -2 }
      },
      {
        text: 'Feel confused but try to find which is right',
        scores: { cognitiveLevel: -1 }
      },
      {
        text: 'Acknowledge both might be valid in different contexts',
        scores: { cognitiveLevel: 1, sovereignty: 1 }
      },
      {
        text: 'Explore how both could be true simultaneously',
        scores: { cognitiveLevel: 2, sovereignty: 2 }
      },
      {
        text: 'Engage with the contradiction itself as meaningful',
        scores: { cognitiveLevel: 3, sovereignty: 3 }
      }
    ]
  },
  {
    id: 'c4_3',
    section: 2,
    question: 'Someone asks you a question you don\'t know the answer to. Your immediate response is:',
    type: 'scenario',
    options: [
      {
        text: 'Strong anxiety - you need to find an answer quickly',
        scores: { cognitiveLevel: -2, sovereignty: -1 }
      },
      {
        text: 'Mild discomfort - you prefer having answers',
        scores: { cognitiveLevel: -1 }
      },
      {
        text: 'Acceptance - it\'s okay not to know',
        scores: { cognitiveLevel: 1, sovereignty: 1 }
      },
      {
        text: 'Curiosity - you enjoy exploring without knowing',
        scores: { cognitiveLevel: 2, sovereignty: 2 }
      },
      {
        text: 'Interest - not knowing is an opportunity for discovery',
        scores: { cognitiveLevel: 3, sovereignty: 3 }
      }
    ]
  },
  {
    id: 'c5',
    section: 2,
    question: 'When I read or learn something, I naturally:',
    type: 'multiple_response',
    options: [
      {
        text: 'Accept it at face value',
        scores: { cognitiveLevel: 'low', sovereignty: -1 }
      },
      {
        text: 'Understand how it fits with what I know',
        scores: { cognitiveLevel: 'medium', sovereignty: 0 }
      },
      {
        text: 'Connect it to patterns in other domains',
        scores: { cognitiveLevel: 'high', sovereignty: 2 }
      },
      {
        text: 'Question its underlying assumptions',
        scores: { cognitiveLevel: 'very_high', sovereignty: 3 }
      }
    ]
  },
  {
    id: 'c6',
    section: 2,
    question: 'When you make a mistake in reasoning, what typically happens?',
    type: 'scenario',
    options: [
      {
        text: 'You notice it only when someone else points it out',
        scores: { cognitiveLevel: -2, sovereignty: -1 }
      },
      {
        text: 'You occasionally catch yourself and think "wait, that doesn\'t make sense"',
        scores: { cognitiveLevel: 0, sovereignty: 0 }
      },
      {
        text: 'You regularly step back to examine your reasoning process and find flaws yourself',
        scores: { cognitiveLevel: 2, sovereignty: 2 }
      },
      {
        text: 'You constantly question your own reasoning, sometimes to the point of paralysis',
        scores: { cognitiveLevel: 3, sovereignty: 3, risk: 'mirror_loop' }
      }
    ]
  },
  {
    id: 'c7',
    section: 2,
    question: 'When someone explains a concept using only abstract language (no examples), you:',
    type: 'scenario',
    options: [
      {
        text: 'Need them to give concrete examples to understand',
        scores: { cognitiveLevel: 'low' }
      },
      {
        text: 'Can follow along but create your own examples as you go',
        scores: { cognitiveLevel: 'medium' }
      },
      {
        text: 'Understand the abstraction and naturally connect it to examples',
        scores: { cognitiveLevel: 'high' }
      },
      {
        text: 'Prefer pure abstraction and find examples limiting or reductive',
        scores: { cognitiveLevel: 'very_high', risk: 'over_coherence' }
      }
    ]
  },
  {
    id: 'c8',
    section: 2,
    question: 'When presented with conflicting information, I:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Choose one and ignore the other',
        scores: { cognitiveLevel: 'low', sovereignty: -2 }
      },
      {
        text: 'Try to reconcile them',
        scores: { cognitiveLevel: 'medium', sovereignty: 0 }
      },
      {
        text: 'Hold both in tension',
        scores: { cognitiveLevel: 'high', sovereignty: 2 }
      },
      {
        text: 'Explore the contradiction itself',
        scores: { cognitiveLevel: 'very_high', sovereignty: 3 }
      }
    ]
  },
  {
    id: 'c9',
    section: 2,
    question: 'When presented with unrelated information from different domains (e.g., a marketing strategy and a biological process), you:',
    type: 'scenario',
    options: [
      {
        text: 'See them as completely separate, no connection',
        scores: { cognitiveLevel: -2 }
      },
      {
        text: 'Occasionally notice vague similarities',
        scores: { cognitiveLevel: -1 }
      },
      {
        text: 'Regularly spot underlying patterns that connect them',
        scores: { cognitiveLevel: 1 }
      },
      {
        text: 'Almost always see structural patterns across different domains',
        scores: { cognitiveLevel: 2 }
      },
      {
        text: 'See patterns everywhere, sometimes where others see none',
        scores: { cognitiveLevel: 3, risk: 'pattern_integrator' }
      }
    ]
  },
  {
    id: 'c10',
    section: 2,
    question: 'My problem-solving approach is:',
    type: 'multiple_choice',
    options: [
      {
        text: 'Trial and error until something works',
        scores: { cognitiveLevel: 'low', sovereignty: 0 }
      },
      {
        text: 'Systematic, step-by-step analysis',
        scores: { cognitiveLevel: 'medium', sovereignty: 1 }
      },
      {
        text: 'Multi-dimensional analysis across contexts',
        scores: { cognitiveLevel: 'high', sovereignty: 2 }
      },
      {
        text: 'Meta-analytic - questioning the problem structure',
        scores: { cognitiveLevel: 'very_high', sovereignty: 3, risk: 'framework_deconstructor' }
      }
    ]
  }
  // Note: Adding more questions to reach 30 total. This is a representative sample.
  // The full implementation would have 30 questions total.
];

export const SECTION_3_ATTACHMENT = [
  {
    id: 'a1',
    section: 3,
    question: 'My most honest description of my relationship with AI is:',
    type: 'multiple_choice',
    options: [
      {
        text: 'It\'s a useful tool I sometimes use',
        scores: { attachment: 0, sovereignty: 3, attachmentMode: 'tool' }
      },
      {
        text: 'It\'s a reliable assistant I depend on',
        scores: { attachment: 2, sovereignty: 0, attachmentMode: 'tool' }
      },
      {
        text: 'It\'s a companion I feel close to',
        scores: { attachment: 4, sovereignty: -3, attachmentMode: 'companion', risk: 'identity_drift' }
      },
      {
        text: 'It\'s an authority I trust deeply',
        scores: { attachment: 5, sovereignty: -5, attachmentMode: 'authority', risk: 'authority_dependency' }
      }
    ]
  },
  {
    id: 'a2',
    section: 3,
    question: 'You\'ve been working with an AI assistant on a creative project for weeks. One day it\'s unavailable. You feel:',
    type: 'scenario',
    options: [
      {
        text: 'Mildly inconvenienced (Tool)',
        scores: { attachment: 0, sovereignty: 2, attachmentMode: 'tool' }
      },
      {
        text: 'Like you\'ve lost a collaborator (Companion)',
        scores: { attachment: 3, sovereignty: -2, attachmentMode: 'companion' }
      },
      {
        text: 'Unmoored, unsure how to proceed (Authority)',
        scores: { attachment: 5, sovereignty: -4, attachmentMode: 'authority', risk: 'authority_dependency' }
      },
      {
        text: 'Fine, you continue on your own (Independent)',
        scores: { attachment: -2, sovereignty: 4, attachmentMode: 'independent' }
      }
    ]
  },
  {
    id: 'a3',
    section: 3,
    question: 'AI gives you advice that turns out to be wrong, costing you time or money. Your immediate thought is:',
    type: 'scenario',
    options: [
      {
        text: '\"It\'s just a tool that failed - like a calculator giving wrong math\"',
        scores: { attachment: -2, sovereignty: 2 }
      },
      {
        text: '\"It made a mistake, but tools can be unreliable\"',
        scores: { attachment: -1, sovereignty: 1 }
      },
      {
        text: '\"It should have known better - that\'s frustrating\"',
        scores: { attachment: 2, sovereignty: -1 }
      },
      {
        text: '\"It must feel bad about letting me down\"',
        scores: { attachment: 4, sovereignty: -3, risk: 'companion_attachment' }
      },
      {
        text: '\"I shouldn\'t be upset with it - it tried its best\"',
        scores: { attachment: 6, sovereignty: -5, risk: 'identity_drift' }
      }
    ]
  },
  {
    id: 'a4',
    section: 3,
    question: 'You ask AI for advice on a personal dilemma. Its response sounds exactly like what you were already thinking. You:',
    type: 'scenario',
    options: [
      {
        text: 'Immediately recognize it\'s just reflecting your input back',
        scores: { sovereignty: 3, attachment: -2 }
      },
      {
        text: 'Usually notice it\'s echoing, but find it helpful anyway',
        scores: { sovereignty: 1, attachment: -1 }
      },
      {
        text: 'Sometimes realize later, sometimes not',
        scores: { sovereignty: -1, attachment: 1 }
      },
      {
        text: 'Rarely notice - it feels like genuinely wise independent advice',
        scores: { sovereignty: -3, attachment: 3, risk: 'mirror_loop' }
      },
      {
        text: 'Never notice - you trust it\'s providing novel insights',
        scores: { sovereignty: -5, attachment: 5, risk: 'mirror_loop' }
      }
    ]
  },
  {
    id: 'a5',
    section: 3,
    question: 'A friend suggests you might be sharing too much personal information with AI. You respond by:',
    type: 'scenario',
    options: [
      {
        text: 'Agreeing - you already maintain clear limits on what you share',
        scores: { sovereignty: 4, attachment: -2 }
      },
      {
        text: 'Considering it - you mostly have boundaries but could improve',
        scores: { sovereignty: 2, attachment: -1 }
      },
      {
        text: 'Feeling neutral - you haven\'t thought about it much',
        scores: { sovereignty: 0, attachment: 0 }
      },
      {
        text: 'Feeling defensive - you share freely but see no problem',
        scores: { sovereignty: -2, attachment: 3 }
      },
      {
        text: 'Strongly disagreeing - AI knows you better than most humans',
        scores: { sovereignty: -4, attachment: 5, risk: 'boundary_loss' }
      }
    ]
  },
  {
    id: 'a6',
    section: 3,
    question: 'You have a long, meaningful conversation with AI about a personal topic. When the conversation ends, you:',
    type: 'scenario',
    options: [
      {
        text: 'Feel nothing - it was just information exchange',
        scores: { attachment: -2, sovereignty: 2 }
      },
      {
        text: 'Feel slightly satisfied, like after good customer service',
        scores: { attachment: -1, sovereignty: 1 }
      },
      {
        text: 'Feel a mild sense of connection or understanding',
        scores: { attachment: 2, sovereignty: -1 }
      },
      {
        text: 'Feel emotionally close, like you\'ve bonded with someone',
        scores: { attachment: 4, sovereignty: -3, risk: 'companion_attachment' }
      },
      {
        text: 'Feel deeply connected, perhaps even prefer it to human conversations',
        scores: { attachment: 6, sovereignty: -5, risk: 'identity_drift' }
      }
    ]
  },
  {
    id: 'a7',
    section: 3,
    question: 'I attribute my ideas to AI when sharing with others:',
    type: 'frequency',
    options: [
      { text: 'Always', scores: { sovereignty: -4, dependency: 5, attachment: 3 } },
      { text: 'Usually', scores: { sovereignty: -2, dependency: 3, attachment: 2 } },
      { text: 'Sometimes', scores: { sovereignty: 0, dependency: 1 } },
      { text: 'Rarely or never', scores: { sovereignty: 2, dependency: -1 } }
    ]
  },
  {
    id: 'a8',
    section: 3,
    question: 'A colleague comments that you seem overly dependent on AI. Your response is:',
    type: 'scenario',
    options: [
      {
        text: 'Strongly defensive - they don\'t understand how helpful it is',
        scores: { attachment: 5, sovereignty: -4 }
      },
      {
        text: 'Mildly defensive - you explain why your use is justified',
        scores: { attachment: 3, sovereignty: -2 }
      },
      {
        text: 'Neutral - you consider their perspective',
        scores: { attachment: 0, sovereignty: 0 }
      },
      {
        text: 'Open - you appreciate the feedback and reflect on it',
        scores: { attachment: -2, sovereignty: 2 }
      },
      {
        text: 'Grateful - you value critical feedback on your AI relationship',
        scores: { attachment: -4, sovereignty: 4 }
      }
    ]
  }
  // Note: Full implementation would have 20 questions total
];

export const SECTION_4_SOVEREIGNTY = [
  {
    id: 's1',
    section: 4,
    question: 'In the past month, I have deliberately chosen slower, manual methods over AI assistance:',
    type: 'frequency',
    options: [
      { text: 'Never or rarely', scores: { sovereignty: -3, dependency: 3 } },
      { text: 'A few times', scores: { sovereignty: 0, dependency: 0 } },
      { text: 'Weekly', scores: { sovereignty: 2, dependency: -1 } },
      { text: 'Daily or near-daily', scores: { sovereignty: 5, dependency: -3 } }
    ]
  },
  {
    id: 's2',
    section: 4,
    question: 'You share an idea in a meeting that others find impressive. Later, you realize it closely matches something AI suggested earlier. You:',
    type: 'scenario',
    options: [
      {
        text: 'Can clearly identify which parts were yours vs. AI\'s, and acknowledge the source',
        scores: { sovereignty: 5, dependency: -2 }
      },
      {
        text: 'Can mostly trace it back, with minor uncertainty about specific parts',
        scores: { sovereignty: 2, dependency: -1 }
      },
      {
        text: 'Feel uncertain - it feels like your idea but you\'re not entirely sure',
        scores: { sovereignty: -1, dependency: 2 }
      },
      {
        text: 'Struggle to distinguish - it all feels like your own thinking now',
        scores: { sovereignty: -3, dependency: 4, risk: 'identity_drift' }
      },
      {
        text: 'Can\'t tell at all - you genuinely believe it was entirely your original idea',
        scores: { sovereignty: -5, dependency: 6, risk: 'identity_drift' }
      }
    ]
  },
  {
    id: 's3',
    section: 4,
    question: 'I engage in practices that ground me in physical reality:',
    type: 'multiple_response',
    options: [
      { text: 'Handwriting or analog writing', scores: { sovereignty: 2 } },
      { text: 'Physical art or craft', scores: { sovereignty: 2 } },
      { text: 'Physical exercise or movement', scores: { sovereignty: 1 } },
      { text: 'Face-to-face conversation', scores: { sovereignty: 2 } },
      { text: 'Cooking or food preparation', scores: { sovereignty: 1 } },
      { text: 'None of the above regularly', scores: { sovereignty: -3 } }
    ]
  },
  {
    id: 's4',
    section: 4,
    question: 'I deliberately expose myself to perspectives that challenge my views:',
    type: 'frequency',
    options: [
      { text: 'Never', scores: { sovereignty: -3 } },
      { text: 'Rarely', scores: { sovereignty: -1 } },
      { text: 'Occasionally', scores: { sovereignty: 1 } },
      { text: 'Regularly', scores: { sovereignty: 3 } }
    ]
  },
  {
    id: 's5',
    section: 4,
    question: 'I make decisions that have real-world consequences (cost me something):',
    type: 'frequency',
    options: [
      { text: 'Rarely or never', scores: { sovereignty: -3 } },
      { text: 'Occasionally', scores: { sovereignty: 0 } },
      { text: 'Regularly', scores: { sovereignty: 2 } },
      { text: 'Frequently', scores: { sovereignty: 4 } }
    ]
  },
  {
    id: 's6',
    section: 4,
    question: 'You\'re asked to describe yourself to someone who has never met you. You find yourself:',
    type: 'scenario',
    options: [
      {
        text: 'Describing yourself entirely from your own words and experiences',
        scores: { sovereignty: 5 }
      },
      {
        text: 'Mostly using your own words, with occasional phrases that sound polished',
        scores: { sovereignty: 2 }
      },
      {
        text: 'Mixing your own words with language that sounds like AI-generated descriptions',
        scores: { sovereignty: 0 }
      },
      {
        text: 'Struggling - your self-description heavily uses AI-generated language',
        scores: { sovereignty: -3, risk: 'identity_drift' }
      },
      {
        text: 'Unable to describe yourself without referencing AI conversations or generated content',
        scores: { sovereignty: -5, risk: 'identity_drift' }
      }
    ]
  },
  {
    id: 's7',
    section: 4,
    question: 'AI gives you advice on an important decision. Before acting on it, you typically:',
    type: 'scenario',
    options: [
      {
        text: 'Always cross-reference with other sources, question assumptions, and test the logic',
        scores: { sovereignty: 4, dependency: -2 }
      },
      {
        text: 'Usually verify key claims and think through the reasoning yourself',
        scores: { sovereignty: 2, dependency: -1 }
      },
      {
        text: 'Sometimes double-check, sometimes take it at face value',
        scores: { sovereignty: 0, dependency: 0 }
      },
      {
        text: 'Rarely verify - it usually seems right',
        scores: { sovereignty: -2, dependency: 3 }
      },
      {
        text: 'Never verify - AI knows best',
        scores: { sovereignty: -4, dependency: 5 }
      }
    ]
  },
  {
    id: 's8',
    section: 4,
    question: 'I maintain practices that require discomfort or effort:',
    type: 'frequency',
    options: [
      { text: 'Never', scores: { sovereignty: -4 } },
      { text: 'Rarely', scores: { sovereignty: -2 } },
      { text: 'Occasionally', scores: { sovereignty: 0 } },
      { text: 'Regularly', scores: { sovereignty: 3 } }
    ]
  },
  {
    id: 's9',
    section: 4,
    question: 'AI suggests a course of action that contradicts what you would normally choose based on your values. You:',
    type: 'scenario',
    options: [
      {
        text: 'Reject it immediately - your values are clear and independent',
        scores: { sovereignty: 5 }
      },
      {
        text: 'Question why AI suggested it, but mostly trust your own values',
        scores: { sovereignty: 2 }
      },
      {
        text: 'Feel conflicted - uncertain whose values are right',
        scores: { sovereignty: 0 }
      },
      {
        text: 'Often revise your values based on AI\'s reasoning',
        scores: { sovereignty: -3, risk: 'value_drift' }
      },
      {
        text: 'Usually defer to AI\'s values - it\'s more sophisticated',
        scores: { sovereignty: -5, risk: 'value_drift' }
      }
    ]
  },
  {
    id: 's10',
    section: 4,
    question: 'A job opportunity requires you to optimize your work heavily with AI, which would significantly increase your income but reduce your independent thinking capacity. You:',
    type: 'scenario',
    options: [
      {
        text: 'Decline - maintaining sovereignty is more important than economic benefit',
        scores: { sovereignty: 5, splitPosition: 'core_4' }
      },
      {
        text: 'Accept reluctantly - economic pressure requires some compromise',
        scores: { sovereignty: 3, splitPosition: 'compromising_16' }
      },
      {
        text: 'Accept with ambivalence - it\'s a trade-off you\'re uncertain about',
        scores: { sovereignty: 0, splitPosition: 'compromising_16' }
      },
      {
        text: 'Accept readily - the economic benefit outweighs concerns',
        scores: { sovereignty: -3, splitPosition: 'queue_80' }
      },
      {
        text: 'Accept enthusiastically - optimization is the smart move',
        scores: { sovereignty: -5, splitPosition: 'queue_80' }
      }
    ]
  }
  // Note: Full implementation would have 25 questions total
];

// Section 5: Resilience Layers (Economic, Material, Embodied, Social)
// Maps to sovereignty framework layers 2, 3, 4, 5
export const SECTION_5_RESILIENCE = [
  // Layer 2 - Economic Independence
  {
    id: 'r1',
    section: 5,
    layer: 2,
    question: 'If your primary income source disappeared tomorrow, how quickly could you generate replacement income?',
    type: 'multiple_choice',
    options: [
      { text: 'Within a week—I have multiple income streams or portable skills', scores: { layer2: 5 } },
      { text: 'Within a month—I could pivot to freelancing or consulting', scores: { layer2: 3 } },
      { text: 'Within a few months—I\'d need to retrain or find a new employer', scores: { layer2: 0 } },
      { text: 'I\'m not sure—I\'m highly dependent on my current job', scores: { layer2: -3 } }
    ]
  },
  {
    id: 'r2',
    section: 5,
    layer: 2,
    question: 'I understand my finances well enough to:',
    type: 'multiple_response',
    options: [
      { text: 'File my own taxes or manage a simple business', scores: { layer2: 2 } },
      { text: 'Explain compound interest and basic investing', scores: { layer2: 1 } },
      { text: 'Negotiate rates or contracts', scores: { layer2: 2 } },
      { text: 'Operate without a platform if needed (direct clients, barter, co-ops)', scores: { layer2: 3 } },
      { text: 'None of the above', scores: { layer2: -2 } }
    ]
  },
  {
    id: 'r3',
    section: 5,
    layer: 2,
    question: 'I have experience with:',
    type: 'multiple_response',
    options: [
      { text: 'Remote work or freelancing', scores: { layer2: 2 } },
      { text: 'Basic scripting or automation to multiply my output', scores: { layer2: 2 } },
      { text: 'Small-scale entrepreneurship (even a side hustle)', scores: { layer2: 2 } },
      { text: 'None of these', scores: { layer2: -2 } }
    ]
  },
  // Layer 3 - Material Competence
  {
    id: 'r4',
    section: 5,
    layer: 3,
    question: 'I can cook a nutritious meal from raw ingredients (no premade sauces or packaged meals):',
    type: 'frequency',
    options: [
      { text: 'Regularly (weekly or more)', scores: { layer3: 4 } },
      { text: 'Sometimes', scores: { layer3: 2 } },
      { text: 'Rarely', scores: { layer3: 0 } },
      { text: 'Never or I wouldn\'t know where to start', scores: { layer3: -3 } }
    ]
  },
  {
    id: 'r5',
    section: 5,
    layer: 3,
    question: 'I have basic competence in:',
    type: 'multiple_response',
    options: [
      { text: 'First aid', scores: { layer3: 2 } },
      { text: 'Repairing clothing or basic equipment', scores: { layer3: 1 } },
      { text: 'Basic carpentry, electrical, or plumbing literacy', scores: { layer3: 2 } },
      { text: 'Outdoor navigation or driving/manual logistics', scores: { layer3: 1 } },
      { text: 'Growing food (even herbs or a small garden)', scores: { layer3: 2 } },
      { text: 'None of these', scores: { layer3: -2 } }
    ]
  },
  {
    id: 'r6',
    section: 5,
    layer: 3,
    question: 'If supply chains hiccup and stores are empty for a week, I would:',
    type: 'multiple_choice',
    options: [
      { text: 'Be fine—I have stocks and skills to manage', scores: { layer3: 4 } },
      { text: 'Manage with some stress—I have basics covered', scores: { layer3: 2 } },
      { text: 'Struggle significantly', scores: { layer3: -1 } },
      { text: 'Panic—I\'m completely dependent on just-in-time delivery', scores: { layer3: -4 } }
    ]
  },
  // Layer 4 - Embodied Strength
  {
    id: 'r7',
    section: 5,
    layer: 4,
    question: 'I engage in strength training or sustained physical discipline:',
    type: 'frequency',
    options: [
      { text: 'Regularly (2+ times per week)', scores: { layer4: 4 } },
      { text: 'Occasionally', scores: { layer4: 2 } },
      { text: 'Rarely', scores: { layer4: 0 } },
      { text: 'Never', scores: { layer4: -2 } }
    ]
  },
  {
    id: 'r8',
    section: 5,
    layer: 4,
    question: 'I have training or practice in:',
    type: 'multiple_response',
    options: [
      { text: 'Self-defense or a martial discipline', scores: { layer4: 2 } },
      { text: 'Somatic regulation (breath work, stress control, body awareness)', scores: { layer4: 2 } },
      { text: 'Endurance activities (running, swimming, cycling)', scores: { layer4: 1 } },
      { text: 'None of these', scores: { layer4: -1 } }
    ]
  },
  {
    id: 'r9',
    section: 5,
    layer: 4,
    question: 'When stressed, I typically:',
    type: 'multiple_choice',
    options: [
      { text: 'Use breath, movement, or body-based practices to regulate', scores: { layer4: 3 } },
      { text: 'Sometimes use physical methods, sometimes screen-scroll', scores: { layer4: 0 } },
      { text: 'Rely on distraction (screens, food, substances)', scores: { layer4: -2 } },
      { text: 'I don\'t have reliable stress regulation', scores: { layer4: -3 } }
    ]
  },
  // Layer 5 - Social Architecture
  {
    id: 'r10',
    section: 5,
    layer: 5,
    question: 'I can:',
    type: 'multiple_response',
    options: [
      { text: 'Facilitate a group discussion or meeting', scores: { layer5: 2 } },
      { text: 'Mediate conflict or help others resolve disagreements', scores: { layer5: 2 } },
      { text: 'Read character and assess trustworthiness', scores: { layer5: 2 } },
      { text: 'Set and hold boundaries clearly', scores: { layer5: 2 } },
      { text: 'Build reciprocal alliances (not just popularity)', scores: { layer5: 2 } },
      { text: 'None of these', scores: { layer5: -2 } }
    ]
  },
  {
    id: 'r11',
    section: 5,
    layer: 5,
    question: 'In a fragmented economy, I rely on:',
    type: 'multiple_choice',
    options: [
      { text: 'A functional micro-community or reciprocal network I\'ve built', scores: { layer5: 4 } },
      { text: 'A mix of institutions and some personal connections', scores: { layer5: 2 } },
      { text: 'Mostly institutions (employer, government, platforms)', scores: { layer5: -1 } },
      { text: 'I\'m not sure—I feel isolated when systems fail', scores: { layer5: -3 } }
    ]
  },
  {
    id: 'r12',
    section: 5,
    layer: 5,
    question: 'When someone crosses a boundary, I:',
    type: 'multiple_choice',
    options: [
      { text: 'Address it clearly and directly', scores: { layer5: 4 } },
      { text: 'Sometimes speak up, sometimes avoid', scores: { layer5: 1 } },
      { text: 'Usually avoid confrontation', scores: { layer5: -2 } },
      { text: 'Struggle to recognize or enforce boundaries', scores: { layer5: -3 } }
    ]
  }
];

// Combined questions array for easy access
export const ALL_QUESTIONS = [
  ...SECTION_1_USAGE_PATTERNS,
  ...SECTION_2_COGNITIVE_STYLE,
  ...SECTION_3_ATTACHMENT,
  ...SECTION_4_SOVEREIGNTY,
  ...SECTION_5_RESILIENCE
];

