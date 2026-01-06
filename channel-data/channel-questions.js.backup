// Channel Questions - Version 2
// Multi-Phase Questionnaire Architecture
// Optimized for experiential assessment and strategic prioritization

import { NODES } from './nodes.js';
import { CHANNELS } from './channels.js';

// Phase 1: Core Node Assessment (7 clusters)
// Purpose: Establish baseline health of each node using binary/3-point scales
export const PHASE_1_NODE_QUESTIONS = {
  root: [
    {
      id: 'p1_root_vitality',
      question: 'How would you describe your overall physical vitality and energy levels?',
      type: 'three_point',
      options: [
        {
          text: 'Generally abundant - I feel physically energized and grounded most of the time',
          mapsTo: { node: 'root', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My energy levels vary but are mostly stable',
          mapsTo: { node: 'root', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally lacking - I often feel physically depleted, ungrounded, or disconnected from my body',
          mapsTo: { node: 'root', state: 'lacking', weight: 3 }
        }
      ],
      category: 'vitality'
    },
    {
      id: 'p1_root_grounding',
      question: 'How connected do you feel to your physical body and the physical world?',
      type: 'three_point',
      options: [
        {
          text: 'Strongly connected - I feel grounded, present in my body, and connected to physical reality',
          mapsTo: { node: 'root', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderately connected - Sometimes I feel grounded, sometimes disconnected',
          mapsTo: { node: 'root', state: 'balanced', weight: 1 }
        },
        {
          text: 'Weakly connected - I often feel ungrounded, disconnected from my body, or "spaced out"',
          mapsTo: { node: 'root', state: 'lacking', weight: 2 }
        }
      ],
      category: 'grounding'
    }
  ],
  sex: [
    {
      id: 'p1_sex_creativity',
      question: 'How would you describe your creative energy and willpower?',
      type: 'three_point',
      options: [
        {
          text: 'Generally abundant - I feel creative, motivated, and have strong willpower',
          mapsTo: { node: 'sex', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My creativity and motivation vary but are present',
          mapsTo: { node: 'sex', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally lacking - I often feel creatively blocked, unmotivated, or lacking willpower',
          mapsTo: { node: 'sex', state: 'lacking', weight: 3 }
        }
      ],
      category: 'creativity'
    },
    {
      id: 'p1_sex_passion',
      question: 'How would you describe your capacity for passion and engagement?',
      type: 'three_point',
      options: [
        {
          text: 'Strong capacity - I feel passionate and fully engaged in life',
          mapsTo: { node: 'sex', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderate capacity - My passion and engagement vary',
          mapsTo: { node: 'sex', state: 'balanced', weight: 1 }
        },
        {
          text: 'Weak capacity - I often feel dispassionate, disengaged, or apathetic',
          mapsTo: { node: 'sex', state: 'lacking', weight: 2 }
        }
      ],
      category: 'passion'
    }
  ],
  gut: [
    {
      id: 'p1_gut_emotional',
      question: 'How would you describe your emotional stability and gut feelings?',
      type: 'three_point',
      options: [
        {
          text: 'Generally stable - I trust my gut feelings and feel emotionally resilient',
          mapsTo: { node: 'gut', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My emotions and gut feelings are sometimes reliable',
          mapsTo: { node: 'gut', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally unstable - I often feel emotionally overwhelmed or disconnected from my gut feelings',
          mapsTo: { node: 'gut', state: 'lacking', weight: 3 }
        }
      ],
      category: 'emotional'
    },
    {
      id: 'p1_gut_instinct',
      question: 'How well do you trust and follow your instincts?',
      type: 'three_point',
      options: [
        {
          text: 'Strongly trust - I rely on my instincts and they usually guide me well',
          mapsTo: { node: 'gut', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderately trust - Sometimes I trust my instincts, sometimes I second-guess them',
          mapsTo: { node: 'gut', state: 'balanced', weight: 1 }
        },
        {
          text: 'Weakly trust - I often ignore or mistrust my instincts',
          mapsTo: { node: 'gut', state: 'lacking', weight: 2 }
        }
      ],
      category: 'instinct'
    }
  ],
  heart: [
    {
      id: 'p1_heart_connection',
      question: 'How would you describe your capacity for emotional connection and love?',
      type: 'three_point',
      options: [
        {
          text: 'Generally open - I feel capable of deep emotional connection and love',
          mapsTo: { node: 'heart', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My capacity for connection varies',
          mapsTo: { node: 'heart', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally closed - I often feel emotionally guarded, closed off, or unable to connect deeply',
          mapsTo: { node: 'heart', state: 'lacking', weight: 3 }
        }
      ],
      category: 'connection'
    },
    {
      id: 'p1_heart_vulnerability',
      question: 'How comfortable are you with emotional vulnerability?',
      type: 'three_point',
      options: [
        {
          text: 'Very comfortable - I can be vulnerable and open with others',
          mapsTo: { node: 'heart', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderately comfortable - Sometimes I can be vulnerable, sometimes I protect myself',
          mapsTo: { node: 'heart', state: 'balanced', weight: 1 }
        },
        {
          text: 'Uncomfortable - I struggle with vulnerability and tend to protect myself',
          mapsTo: { node: 'heart', state: 'lacking', weight: 2 }
        }
      ],
      category: 'vulnerability'
    }
  ],
  throat: [
    {
      id: 'p1_throat_expression',
      question: 'How would you describe your ability to express yourself and communicate?',
      type: 'three_point',
      options: [
        {
          text: 'Generally strong - I can express myself clearly and find my voice',
          mapsTo: { node: 'throat', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My expression and communication vary',
          mapsTo: { node: 'throat', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally weak - I often struggle to express myself or find my place',
          mapsTo: { node: 'throat', state: 'lacking', weight: 3 }
        }
      ],
      category: 'expression'
    },
    {
      id: 'p1_throat_voice',
      question: 'How confident are you in speaking your truth?',
      type: 'three_point',
      options: [
        {
          text: 'Very confident - I speak my truth confidently and authentically',
          mapsTo: { node: 'throat', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderately confident - Sometimes I speak my truth, sometimes I hold back',
          mapsTo: { node: 'throat', state: 'balanced', weight: 1 }
        },
        {
          text: 'Not confident - I often struggle to speak my truth or assert myself',
          mapsTo: { node: 'throat', state: 'lacking', weight: 2 }
        }
      ],
      category: 'voice'
    }
  ],
  mind: [
    {
      id: 'p1_mind_clarity',
      question: 'How would you describe your mental clarity and vision?',
      type: 'three_point',
      options: [
        {
          text: 'Generally clear - I think clearly and have good vision and understanding',
          mapsTo: { node: 'mind', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My mental clarity varies',
          mapsTo: { node: 'mind', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally unclear - I often experience mental fog, confusion, or lack of vision',
          mapsTo: { node: 'mind', state: 'lacking', weight: 3 }
        }
      ],
      category: 'clarity'
    },
    {
      id: 'p1_mind_focus',
      question: 'How well can you focus and maintain mental stability?',
      type: 'three_point',
      options: [
        {
          text: 'Strong focus - I can focus well and maintain mental stability',
          mapsTo: { node: 'mind', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderate focus - My focus and mental stability vary',
          mapsTo: { node: 'mind', state: 'balanced', weight: 1 }
        },
        {
          text: 'Weak focus - I often struggle with focus or mental instability',
          mapsTo: { node: 'mind', state: 'lacking', weight: 2 }
        }
      ],
      category: 'focus'
    }
  ],
  crown: [
    {
      id: 'p1_crown_spiritual',
      question: 'How would you describe your spiritual connection and sense of purpose?',
      type: 'three_point',
      options: [
        {
          text: 'Generally strong - I feel connected to something greater and have a sense of purpose',
          mapsTo: { node: 'crown', state: 'abundant', weight: 3 }
        },
        {
          text: 'Generally balanced - My spiritual connection and sense of purpose vary',
          mapsTo: { node: 'crown', state: 'balanced', weight: 1 }
        },
        {
          text: 'Generally weak - I often feel disconnected from purpose or something greater',
          mapsTo: { node: 'crown', state: 'lacking', weight: 3 }
        }
      ],
      category: 'spiritual'
    },
    {
      id: 'p1_crown_transcendence',
      question: 'How accessible is transcendent awareness or higher perspective to you?',
      type: 'three_point',
      options: [
        {
          text: 'Very accessible - I can access transcendent awareness and higher perspective',
          mapsTo: { node: 'crown', state: 'abundant', weight: 2 }
        },
        {
          text: 'Moderately accessible - Sometimes I can access transcendent awareness',
          mapsTo: { node: 'crown', state: 'balanced', weight: 1 }
        },
        {
          text: 'Not accessible - I rarely or never experience transcendent awareness',
          mapsTo: { node: 'crown', state: 'lacking', weight: 2 }
        }
      ],
      category: 'transcendence'
    }
  ]
};

// Phase 2: Critical Channel Identification (Strategic)
// Purpose: Identify 2-3 priority areas based on Phase 1 results
export const PHASE_2_PRIORITIZATION_QUESTIONS = {
  // This will be dynamically generated based on Phase 1 results
  // Questions will focus on areas of concern between weak and strong nodes
};

// Phase 3: Targeted Channel Deep-Dive (Experiential)
// Purpose: Detailed assessment of prioritized channels with experiential questions
export const PHASE_3_CHANNEL_QUESTIONS = {
  // Binary initial filter + conditional follow-ups
  // Example structure for each channel:
  // {
  //   id: 'p3_channel_binary',
  //   question: 'Does energy flow easily from [Node X] to [Node Y]?',
  //   type: 'binary_unsure',
  //   options: ['Yes', 'No', 'Unsure'],
  //   conditional: {
  //     'No': [follow-up questions],
  //     'Unsure': [follow-up questions]
  //   }
  // }
};

// Helper function to generate Phase 3 questions for a specific channel
export function generatePhase3ChannelQuestions(channelId, channel) {
  const fromNode = NODES[channel.from];
  const toNode = NODES[channel.to];
  
  return [
    {
      id: `p3_${channelId}_binary`,
      question: `Does energy flow easily from ${fromNode.name} to ${toNode.name}?`,
      type: 'binary_unsure',
      options: [
        {
          text: 'Yes - Energy flows easily',
          mapsTo: { channel: channelId, flow: 'open', weight: 0 }
        },
        {
          text: 'No - Energy does not flow easily',
          mapsTo: { channel: channelId, flow: 'blocked', weight: 3 }
        },
        {
          text: "I don't know - I'm not sure",
          mapsTo: { channel: channelId, flow: 'unknown', weight: 1 }
        }
      ],
      channel: channelId,
      conditional: {
        'No': [
          {
            id: `p3_${channelId}_symptom`,
            question: `Which best describes your experience when ${fromNode.name} tries to flow to ${toNode.name}?`,
            type: 'scenario',
            options: [
              {
                text: channel.blocked || 'Blocked flow - disconnect between these aspects',
                mapsTo: { channel: channelId, symptom: 'blocked', weight: 3 }
              },
              {
                text: channel.healthy_lack || 'Reduced flow - present but weak',
                mapsTo: { channel: channelId, symptom: 'lacking', weight: 2 }
              },
              {
                text: 'Overloaded - one aspect dominates the other',
                mapsTo: { channel: channelId, symptom: 'overloaded', weight: 2 }
              }
            ],
            channel: channelId
          },
          {
            id: `p3_${channelId}_experiential`,
            question: `When you feel ${fromNode.description.toLowerCase()}, do you also feel ${toNode.description.toLowerCase()}?`,
            type: 'frequency',
            options: [
              { text: 'Yes, always', mapsTo: { channel: channelId, frequency: 'always', weight: 0 } },
              { text: 'Often', mapsTo: { channel: channelId, frequency: 'often', weight: 1 } },
              { text: 'Sometimes', mapsTo: { channel: channelId, frequency: 'sometimes', weight: 2 } },
              { text: 'Rarely', mapsTo: { channel: channelId, frequency: 'rarely', weight: 3 } },
              { text: 'No, never', mapsTo: { channel: channelId, frequency: 'never', weight: 3 } }
            ],
            channel: channelId
          }
        ],
        "I don't know": [
          {
            id: `p3_${channelId}_awareness`,
            question: `Have you noticed any connection between ${fromNode.name} and ${toNode.name} in your experience?`,
            type: 'binary_unsure',
            options: [
              { text: 'Yes, I have noticed a connection', mapsTo: { channel: channelId, awareness: 'yes', weight: 1 } },
              { text: 'No, I have not noticed a connection', mapsTo: { channel: channelId, awareness: 'no', weight: 2 } },
              { text: "I'm not sure", mapsTo: { channel: channelId, awareness: 'unsure', weight: 1 } }
            ],
            channel: channelId
          }
        ]
      }
    }
  ];
}

// Phase 4: Comprehensive Mapping (Optional)
// Purpose: Complete assessment of all remaining channels
// Uses same structure as Phase 3 but for all channels not yet assessed

