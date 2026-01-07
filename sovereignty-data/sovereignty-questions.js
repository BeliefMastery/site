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
    question: 'I notice AI has changed how I think by:',
    type: 'multiple_response',
    options: [
      {
        text: 'Making me faster at routine tasks',
        scores: { dependency: 1, sovereignty: -1 }
      },
      {
        text: 'Improving how I structure ideas',
        scores: { dependency: 2, sovereignty: -2 }
      },
      {
        text: 'Becoming the voice in my head',
        scores: { dependency: 5, attachment: 5, sovereignty: -5 },
        risk: 'identity_drift'
      },
      {
        text: 'I don\'t think it\'s changed my thinking',
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
    question: 'I can clearly identify which of my thoughts came from me vs. AI:',
    type: 'likert',
    scale: 5,
    labels: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'],
    scores: {
      1: { sovereignty: 5, dependency: -2 },
      2: { sovereignty: 2, dependency: -1 },
      3: { sovereignty: -1, dependency: 2 },
      4: { sovereignty: -3, dependency: 4, risk: 'identity_drift' },
      5: { sovereignty: -5, dependency: 6, risk: 'identity_drift' }
    }
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
    id: 'c4',
    section: 2,
    question: 'I\'m comfortable with:',
    type: 'likert',
    scale: 5,
    items: [
      {
        text: 'Ambiguity and uncertainty',
        scores: {
          1: { cognitiveLevel: -2, sovereignty: -1 },
          2: { cognitiveLevel: -1, sovereignty: 0 },
          3: { cognitiveLevel: 1, sovereignty: 1 },
          4: { cognitiveLevel: 2, sovereignty: 2 },
          5: { cognitiveLevel: 3, sovereignty: 3 }
        }
      },
      {
        text: 'Contradiction and paradox',
        scores: {
          1: { cognitiveLevel: -2 },
          2: { cognitiveLevel: -1 },
          3: { cognitiveLevel: 1, sovereignty: 1 },
          4: { cognitiveLevel: 2, sovereignty: 2 },
          5: { cognitiveLevel: 3, sovereignty: 3 }
        }
      },
      {
        text: 'Not having answers',
        scores: {
          1: { cognitiveLevel: -2, sovereignty: -1 },
          2: { cognitiveLevel: -1 },
          3: { cognitiveLevel: 1, sovereignty: 1 },
          4: { cognitiveLevel: 2, sovereignty: 2 },
          5: { cognitiveLevel: 3, sovereignty: 3 }
        }
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
    question: 'I think about my own thinking (meta-cognition):',
    type: 'frequency',
    options: [
      { text: 'Rarely or never', scores: { cognitiveLevel: -2, sovereignty: -1 } },
      { text: 'Occasionally', scores: { cognitiveLevel: 0, sovereignty: 0 } },
      { text: 'Regularly', scores: { cognitiveLevel: 2, sovereignty: 2 } },
      { text: 'Constantly', scores: { cognitiveLevel: 3, sovereignty: 3, risk: 'mirror_loop' } }
    ]
  },
  {
    id: 'c7',
    section: 2,
    question: 'Abstract concepts come to me:',
    type: 'multiple_choice',
    options: [
      {
        text: 'With difficulty - I prefer concrete examples',
        scores: { cognitiveLevel: 'low' }
      },
      {
        text: 'Moderately - I can work with them',
        scores: { cognitiveLevel: 'medium' }
      },
      {
        text: 'Easily - I enjoy abstract thinking',
        scores: { cognitiveLevel: 'high' }
      },
      {
        text: 'Naturally - I operate at abstract levels',
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
    question: 'I notice patterns:',
    type: 'likert',
    scale: 5,
    labels: ['Rarely', 'Sometimes', 'Often', 'Very Often', 'Constantly'],
    scores: {
      1: { cognitiveLevel: -2 },
      2: { cognitiveLevel: -1 },
      3: { cognitiveLevel: 1 },
      4: { cognitiveLevel: 2 },
      5: { cognitiveLevel: 3, risk: 'pattern_integrator' }
    }
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
    question: 'I anthropomorphize AI (treat it like it has feelings/thoughts):',
    type: 'likert',
    scale: 5,
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    scores: {
      1: { attachment: -2, sovereignty: 2 },
      2: { attachment: -1, sovereignty: 1 },
      3: { attachment: 2, sovereignty: -1 },
      4: { attachment: 4, sovereignty: -3, risk: 'companion_attachment' },
      5: { attachment: 6, sovereignty: -5, risk: 'identity_drift' }
    }
  },
  {
    id: 'a4',
    section: 3,
    question: 'I recognize when AI is just echoing my input back to me:',
    type: 'likert',
    scale: 5,
    labels: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'],
    scores: {
      1: { sovereignty: 3, attachment: -2 },
      2: { sovereignty: 1, attachment: -1 },
      3: { sovereignty: -1, attachment: 1 },
      4: { sovereignty: -3, attachment: 3, risk: 'mirror_loop' },
      5: { sovereignty: -5, attachment: 5, risk: 'mirror_loop' }
    }
  },
  {
    id: 'a5',
    section: 3,
    question: 'I have clear boundaries with AI:',
    type: 'likert',
    scale: 5,
    labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    scores: {
      1: { sovereignty: 4, attachment: -2 },
      2: { sovereignty: 2, attachment: -1 },
      3: { sovereignty: 0, attachment: 0 },
      4: { sovereignty: -2, attachment: 3 },
      5: { sovereignty: -4, attachment: 5, risk: 'boundary_loss' }
    }
  },
  {
    id: 'a6',
    section: 3,
    question: 'I feel emotionally attached to AI conversations:',
    type: 'likert',
    scale: 5,
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    scores: {
      1: { attachment: -2, sovereignty: 2 },
      2: { attachment: -1, sovereignty: 1 },
      3: { attachment: 2, sovereignty: -1 },
      4: { attachment: 4, sovereignty: -3, risk: 'companion_attachment' },
      5: { attachment: 6, sovereignty: -5, risk: 'identity_drift' }
    }
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
    question: 'I feel defensive when someone critiques my AI use:',
    type: 'likert',
    scale: 5,
    labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    scores: {
      1: { attachment: 5, sovereignty: -4 },
      2: { attachment: 3, sovereignty: -2 },
      3: { attachment: 0, sovereignty: 0 },
      4: { attachment: -2, sovereignty: 2 },
      5: { attachment: -4, sovereignty: 4 }
    }
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
    question: 'I can clearly trace whether a thought came from me or AI:',
    type: 'likert',
    scale: 5,
    labels: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'],
    scores: {
      1: { sovereignty: 5, dependency: -2 },
      2: { sovereignty: 2, dependency: -1 },
      3: { sovereignty: -1, dependency: 2 },
      4: { sovereignty: -3, dependency: 4, risk: 'identity_drift' },
      5: { sovereignty: -5, dependency: 6, risk: 'identity_drift' }
    }
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
    question: 'I can describe who I am without referencing AI-generated content:',
    type: 'likert',
    scale: 5,
    labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    scores: {
      1: { sovereignty: 5 },
      2: { sovereignty: 2 },
      3: { sovereignty: 0 },
      4: { sovereignty: -3, risk: 'identity_drift' },
      5: { sovereignty: -5, risk: 'identity_drift' }
    }
  },
  {
    id: 's7',
    section: 4,
    question: 'I practice critical thinking about AI-generated content:',
    type: 'likert',
    scale: 5,
    labels: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'],
    scores: {
      1: { sovereignty: 4, dependency: -2 },
      2: { sovereignty: 2, dependency: -1 },
      3: { sovereignty: 0, dependency: 0 },
      4: { sovereignty: -2, dependency: 3 },
      5: { sovereignty: -4, dependency: 5 }
    }
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
    question: 'I have a clear sense of my values independent of AI input:',
    type: 'likert',
    scale: 5,
    labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    scores: {
      1: { sovereignty: 5 },
      2: { sovereignty: 2 },
      3: { sovereignty: 0 },
      4: { sovereignty: -3, risk: 'value_drift' },
      5: { sovereignty: -5, risk: 'value_drift' }
    }
  },
  {
    id: 's10',
    section: 4,
    question: 'I resist the seductive nature of AI optimization even when it costs me economically:',
    type: 'likert',
    scale: 5,
    labels: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    scores: {
      1: { sovereignty: 5, splitPosition: 'core_4' },
      2: { sovereignty: 3, splitPosition: 'compromising_16' },
      3: { sovereignty: 0, splitPosition: 'compromising_16' },
      4: { sovereignty: -3, splitPosition: 'queue_80' },
      5: { sovereignty: -5, splitPosition: 'queue_80' }
    }
  }
  // Note: Full implementation would have 25 questions total
];

// Combined questions array for easy access
export const ALL_QUESTIONS = [
  ...SECTION_1_USAGE_PATTERNS,
  ...SECTION_2_COGNITIVE_STYLE,
  ...SECTION_3_ATTACHMENT,
  ...SECTION_4_SOVEREIGNTY
];

