// Multi-Stage Channel Taxonomy Questions
// Stage 1: Generic Node Identification
// Stage 2: Channel-Specific Analysis
// Stage 3: Deep Channel Management

export const STAGE_1_NODE_QUESTIONS = {
  // Node-level questions that combine multiple distinction qualities
  root: [
    {
      id: 'node_root_1',
      question: 'How would you describe your overall physical vitality, grounding, and sense of stability in your body and environment? Consider your energy levels, physical presence, connection to your body, and sense of security in your physical space.',
      weight: 1.2,
      node: 'root'
    },
    {
      id: 'node_root_2',
      question: 'When you think about your physical health, energy, and grounding, what patterns do you notice? Do you feel consistently energized and stable, or do you experience fatigue, disconnection from your body, or a lack of physical presence?',
      weight: 1.1,
      node: 'root'
    }
  ],
  sex: [
    {
      id: 'node_sex_1',
      question: 'How would you describe your creative drive, willpower, and capacity for passion? Consider your motivation to create, ability to follow through on projects, sexual energy, and sense of purpose and direction.',
      weight: 1.2,
      node: 'sex'
    },
    {
      id: 'node_sex_2',
      question: 'When you reflect on your creative expression and willpower, what do you notice? Do you feel inspired and driven, or do you experience creative blocks, lack of motivation, or difficulty channeling passion into action?',
      weight: 1.1,
      node: 'sex'
    }
  ],
  gut: [
    {
      id: 'node_gut_1',
      question: 'How would you describe your emotional processing, gut instincts, and capacity for emotional command? Consider how you process feelings, trust your instincts, make decisions based on emotional intelligence, and handle emotional challenges.',
      weight: 1.2,
      node: 'gut'
    },
    {
      id: 'node_gut_2',
      question: 'When you think about your emotional responses and gut feelings, what patterns emerge? Do you feel emotionally stable and trust your instincts, or do you experience emotional overwhelm, difficulty processing feelings, or uncertainty about your gut responses?',
      weight: 1.1,
      node: 'gut'
    }
  ],
  heart: [
    {
      id: 'node_heart_1',
      question: 'How would you describe your capacity for love, emotional openness, and connection with others? Consider your ability to give and receive love, emotional vulnerability, compassion, and depth of relationships.',
      weight: 1.2,
      node: 'heart'
    },
    {
      id: 'node_heart_2',
      question: 'When you reflect on your emotional connections and openness, what do you notice? Do you feel open and capable of deep connection, or do you experience emotional distance, fear of intimacy, or difficulty being vulnerable?',
      weight: 1.1,
      node: 'heart'
    }
  ],
  throat: [
    {
      id: 'node_throat_1',
      question: 'How would you describe your ability to express yourself, communicate authentically, and find your place in social contexts? Consider your voice, communication style, self-expression, and sense of belonging in society.',
      weight: 1.2,
      node: 'throat'
    },
    {
      id: 'node_throat_2',
      question: 'When you think about your communication and expression, what patterns do you see? Do you feel confident expressing yourself and clear about your role, or do you struggle to find your voice, communicate authentically, or feel disconnected from your place in society?',
      weight: 1.1,
      node: 'throat'
    }
  ],
  mind: [
    {
      id: 'node_mind_1',
      question: 'How would you describe your mental clarity, vision, and capacity for comprehension? Consider your ability to think clearly, visualize possibilities, understand complex concepts, and integrate ideas into coherent understanding.',
      weight: 1.2,
      node: 'mind'
    },
    {
      id: 'node_mind_2',
      question: 'When you reflect on your thinking and mental processes, what emerges? Do you feel mentally clear and capable of vision, or do you experience confusion, scattered thoughts, or difficulty focusing and integrating ideas?',
      weight: 1.1,
      node: 'mind'
    }
  ],
  crown: [
    {
      id: 'node_crown_1',
      question: 'How would you describe your spiritual connection, sense of higher purpose, and capacity for transcendence? Consider your connection to something greater, sense of meaning, spiritual awareness, and experience of liberation or unity.',
      weight: 1.2,
      node: 'crown'
    },
    {
      id: 'node_crown_2',
      question: 'When you think about your spiritual life and sense of purpose, what do you notice? Do you feel connected to higher meaning and purpose, or do you experience spiritual disconnection, lack of direction, or inability to integrate transcendence?',
      weight: 1.1,
      node: 'crown'
    }
  ]
};

// Stage 2: Channel-specific questions (triggered based on Stage 1 results)
// Questions for all 42 channels - covering abundance, lack, and blocked flow
export const STAGE_2_CHANNEL_QUESTIONS = {
  // Flow from Root (6 channels)
  root_sex: [
    {
      id: 'channel_root_sex_abundance',
      question: 'When your physical energy and vitality are strong, how does that affect your creative drive and willpower? Do you feel more motivated, passionate, and able to channel energy into creative projects?',
      weight: 1.0,
      channel: 'root_sex',
      type: 'abundance'
    },
    {
      id: 'channel_root_sex_lack',
      question: 'When you feel physically depleted or ungrounded, how does that impact your creativity and motivation? Do you notice a drop in creative energy, lack of inspiration, or reduced desire for creative activities?',
      weight: 1.0,
      channel: 'root_sex',
      type: 'lack'
    },
    {
      id: 'channel_root_sex_blocked',
      question: 'Do you ever experience frustration or creative stagnation even when you have physical energy? Or compulsive behaviors without clear direction? This might indicate a disconnect between your physical vitality and your ability to channel it creatively.',
      weight: 1.3,
      channel: 'root_sex',
      type: 'blocked'
    },
    {
      id: 'channel_root_sex_blocked2',
      question: 'When you have physical energy but struggle to direct it into creative or purposeful action, what does that feel like? Do you experience restlessness, scattered focus, or a sense that your energy has no clear outlet?',
      weight: 1.2,
      channel: 'root_sex',
      type: 'blocked'
    }
  ],
  root_gut: [
    {
      id: 'channel_root_gut_abundance',
      question: 'When you feel physically grounded and energized, how does that affect your emotional stability? Do you notice greater emotional resilience, calmness, and ability to handle challenges?',
      weight: 1.0,
      channel: 'root_gut',
      type: 'abundance'
    },
    {
      id: 'channel_root_gut_lack',
      question: 'When you feel physically ungrounded or depleted, how does that impact your emotional state? Do you experience subtle anxiety, emotional discomfort, or a sense of being unsettled?',
      weight: 1.0,
      channel: 'root_gut',
      type: 'lack'
    },
    {
      id: 'channel_root_gut_blocked',
      question: 'Do you ever experience emotional overwhelm or exaggerated emotional responses even in minor situations, despite having physical energy? This might indicate a blockage between physical stability and emotional processing.',
      weight: 1.3,
      channel: 'root_gut',
      type: 'blocked'
    },
    {
      id: 'channel_root_gut_blocked2',
      question: 'When physical grounding doesn\'t translate to emotional stability, what patterns do you notice? Do you feel physically present but emotionally reactive or unstable?',
      weight: 1.2,
      channel: 'root_gut',
      type: 'blocked'
    }
  ],
  root_heart: [
    {
      id: 'channel_root_heart_abundance',
      question: 'When you feel physically secure and grounded, how does that affect your capacity for emotional openness and connection? Do you feel safer to be vulnerable and open your heart?',
      weight: 1.0,
      channel: 'root_heart',
      type: 'abundance'
    },
    {
      id: 'channel_root_heart_lack',
      question: 'When physical grounding is lacking, how does that impact your emotional openness? Do you notice yourself becoming more guarded, emotionally distant, or unable to fully connect with others?',
      weight: 1.0,
      channel: 'root_heart',
      type: 'lack'
    },
    {
      id: 'channel_root_heart_blocked',
      question: 'Do you experience irrational fears of intimacy or emotional coldness even when you feel physically secure? Or an inability to give or receive love despite having physical stability?',
      weight: 1.3,
      channel: 'root_heart',
      type: 'blocked'
    },
    {
      id: 'channel_root_heart_blocked2',
      question: 'When physical security doesn\'t translate to emotional openness, what happens? Do you feel safe in your body but unable to open your heart, or experience a disconnect between physical and emotional safety?',
      weight: 1.2,
      channel: 'root_heart',
      type: 'blocked'
    }
  ],
  root_throat: [
    {
      id: 'channel_root_throat_abundance',
      question: 'When you feel physically strong and grounded, how does that affect your ability to express yourself and communicate confidently? Do you feel more assertive and clear about your place in social contexts?',
      weight: 1.0,
      channel: 'root_throat',
      type: 'abundance'
    },
    {
      id: 'channel_root_throat_lack',
      question: 'When physical vitality is low, how does that impact your communication and expression? Do you struggle to find your voice, feel hesitant to assert yourself, or experience uncertainty about your role?',
      weight: 1.0,
      channel: 'root_throat',
      type: 'lack'
    },
    {
      id: 'channel_root_throat_blocked',
      question: 'Do you experience physical tension in your throat, difficulty speaking truth, or social disconnection even when you have physical energy? This might indicate a blockage between physical presence and expression.',
      weight: 1.3,
      channel: 'root_throat',
      type: 'blocked'
    },
    {
      id: 'channel_root_throat_blocked2',
      question: 'When physical grounding doesn\'t translate to confident expression, what do you notice? Do you feel physically present but unable to communicate clearly or assert your place in society?',
      weight: 1.2,
      channel: 'root_throat',
      type: 'blocked'
    }
  ],
  root_mind: [
    {
      id: 'channel_root_mind_abundance',
      question: 'When you feel physically grounded and energized, how does that affect your mental clarity and focus? Do you notice greater ability to think clearly, visualize goals, and maintain mental stability?',
      weight: 1.0,
      channel: 'root_mind',
      type: 'abundance'
    },
    {
      id: 'channel_root_mind_lack',
      question: 'When physical grounding is lacking, how does that impact your thinking? Do you experience scattered thoughts, mental fatigue, or difficulty focusing and forming clear visions?',
      weight: 1.0,
      channel: 'root_mind',
      type: 'lack'
    },
    {
      id: 'channel_root_mind_blocked',
      question: 'Do you experience mental confusion or thoughts disconnected from reality even when you have physical energy? Or an inability to ground ideas and bring them into practical action?',
      weight: 1.3,
      channel: 'root_mind',
      type: 'blocked'
    },
    {
      id: 'channel_root_mind_blocked2',
      question: 'When physical presence doesn\'t translate to mental clarity, what patterns emerge? Do you feel grounded in your body but unable to think clearly, or experience a disconnect between physical and mental grounding?',
      weight: 1.2,
      channel: 'root_mind',
      type: 'blocked'
    }
  ],
  root_crown: [
    {
      id: 'channel_root_crown_abundance',
      question: 'When you feel physically grounded and connected to your body, how does that affect your spiritual connection and sense of higher purpose? Do you feel both anchored in the present and connected to something greater?',
      weight: 1.0,
      channel: 'root_crown',
      type: 'abundance'
    },
    {
      id: 'channel_root_crown_lack',
      question: 'When physical grounding is insufficient, how does that impact your spiritual awareness? Do you feel disconnected from higher purpose, spiritually adrift, or unable to integrate transcendence with daily life?',
      weight: 1.0,
      channel: 'root_crown',
      type: 'lack'
    },
    {
      id: 'channel_root_crown_blocked',
      question: 'Do you experience spiritual disconnection or feeling lost and directionless even when you have physical grounding? Or an inability to connect spiritual insights with physical reality?',
      weight: 1.3,
      channel: 'root_crown',
      type: 'blocked'
    },
    {
      id: 'channel_root_crown_blocked2',
      question: 'When physical grounding doesn\'t translate to spiritual connection, what happens? Do you feel present in your body but disconnected from meaning, or experience a gap between physical and spiritual presence?',
      weight: 1.2,
      channel: 'root_crown',
      type: 'blocked'
    }
  ],
  // Flow from Sex (6 channels)
  sex_root: [
    {
      id: 'channel_sex_root_abundance',
      question: 'When your creative and sexual energy is flowing strongly, how does that affect your physical vitality and grounding? Do you feel more energized, physically present, and connected to your body?',
      weight: 1.0,
      channel: 'sex_root',
      type: 'abundance'
    },
    {
      id: 'channel_sex_root_lack',
      question: 'When creative or sexual energy is lacking, how does that impact your physical presence? Do you experience physical lethargy, disconnection from your body, or reduced motivation to engage physically?',
      weight: 1.0,
      channel: 'sex_root',
      type: 'lack'
    },
    {
      id: 'channel_sex_root_blocked',
      question: 'Do you experience restlessness, physical tension, or inability to manifest creative ideas physically, even when you have creative energy? This might indicate a blockage preventing creative energy from grounding.',
      weight: 1.3,
      channel: 'sex_root',
      type: 'blocked'
    },
    {
      id: 'channel_sex_root_blocked2',
      question: 'When creative energy cannot ground into physical action, what do you notice? Do you feel creatively inspired but physically scattered or unable to bring ideas into physical reality?',
      weight: 1.2,
      channel: 'sex_root',
      type: 'blocked'
    }
  ],
  sex_gut: [
    {
      id: 'channel_sex_gut_abundance',
      question: 'When your creative and sexual energy is abundant, how does that affect your emotional confidence and stability? Do you feel more emotionally empowered and aligned with your desires?',
      weight: 1.0,
      channel: 'sex_gut',
      type: 'abundance'
    },
    {
      id: 'channel_sex_gut_lack',
      question: 'When creative energy is lacking, how does that impact your emotional state? Do you experience emotional uncertainty, lack of drive, or difficulty trusting your instincts?',
      weight: 1.0,
      channel: 'sex_gut',
      type: 'lack'
    },
    {
      id: 'channel_sex_gut_blocked',
      question: 'Do you experience emotional frustration or inability to channel passion into emotional expression, even when you have creative energy? This might indicate creative impulses failing to inform your emotions properly.',
      weight: 1.3,
      channel: 'sex_gut',
      type: 'blocked'
    },
    {
      id: 'channel_sex_gut_blocked2',
      question: 'When creative energy cannot reach emotional processing, what patterns emerge? Do you feel creatively inspired but emotionally confused or unable to integrate passion with feelings?',
      weight: 1.2,
      channel: 'sex_gut',
      type: 'blocked'
    }
  ],
  sex_heart: [
    {
      id: 'channel_sex_heart_abundance',
      question: 'When your creative and sexual energy flows strongly, how does that affect your capacity for love and intimacy? Do you feel more passionate, emotionally open, and capable of deep connection?',
      weight: 1.0,
      channel: 'sex_heart',
      type: 'abundance'
    },
    {
      id: 'channel_sex_heart_lack',
      question: 'When creative or sexual energy is lacking, how does that impact your emotional openness? Do you experience emotional distance, struggle to connect deeply, or feel less passionate about relationships?',
      weight: 1.0,
      channel: 'sex_heart',
      type: 'lack'
    },
    {
      id: 'channel_sex_heart_blocked',
      question: 'Do you experience emotional coldness or inability to integrate passion with love, even when you have creative energy? Or frustration in relationships where passion and love feel disconnected?',
      weight: 1.3,
      channel: 'sex_heart',
      type: 'blocked'
    },
    {
      id: 'channel_sex_heart_blocked2',
      question: 'When creative passion cannot reach your heart, what happens? Do you feel passionate but unable to connect emotionally, or experience a gap between creative expression and emotional intimacy?',
      weight: 1.2,
      channel: 'sex_heart',
      type: 'blocked'
    }
  ],
  sex_throat: [
    {
      id: 'channel_sex_throat_abundance',
      question: 'When your creative energy and willpower are strong, how does that affect your communication and expression? Do you feel more confident expressing your desires, communicating with passion, and asserting your voice?',
      weight: 1.0,
      channel: 'sex_throat',
      type: 'abundance'
    },
    {
      id: 'channel_sex_throat_lack',
      question: 'When creative energy is lacking, how does that impact your expression? Do you struggle to communicate creatively, find your voice, or feel less motivated to express yourself?',
      weight: 1.0,
      channel: 'sex_throat',
      type: 'lack'
    },
    {
      id: 'channel_sex_throat_blocked',
      question: 'Do you experience creative blocks, inability to communicate passion, or suppressed expression even when you have creative energy? This might indicate creative repression preventing clear communication.',
      weight: 1.3,
      channel: 'sex_throat',
      type: 'blocked'
    },
    {
      id: 'channel_sex_throat_blocked2',
      question: 'When creative energy cannot express through communication, what do you notice? Do you feel creatively inspired but unable to articulate your passions or assert yourself in social situations?',
      weight: 1.2,
      channel: 'sex_throat',
      type: 'blocked'
    }
  ],
  sex_mind: [
    {
      id: 'channel_sex_mind_abundance',
      question: 'When your creative and sexual energy flows abundantly, how does that affect your thinking and vision? Do you feel more imaginative, capable of seeing possibilities, and able to think creatively?',
      weight: 1.0,
      channel: 'sex_mind',
      type: 'abundance'
    },
    {
      id: 'channel_sex_mind_lack',
      question: 'When creative energy is lacking, how does that impact your mental processes? Do you experience mental dullness, lack of inspiration, or difficulty with creative problem-solving?',
      weight: 1.0,
      channel: 'sex_mind',
      type: 'lack'
    },
    {
      id: 'channel_sex_mind_blocked',
      question: 'Do you experience mental rigidity, creative blocks, or inability to channel ideas into creative expression, even when you have creative energy? This might indicate creative impulses failing to inform thinking.',
      weight: 1.3,
      channel: 'sex_mind',
      type: 'blocked'
    },
    {
      id: 'channel_sex_mind_blocked2',
      question: 'When creative energy cannot reach mental processes, what patterns emerge? Do you feel creatively inspired but unable to visualize goals or bring ideas to life mentally?',
      weight: 1.2,
      channel: 'sex_mind',
      type: 'blocked'
    }
  ],
  sex_crown: [
    {
      id: 'channel_sex_crown_abundance',
      question: 'When your creative and sexual energy flows strongly, how does that affect your spiritual connection and sense of purpose? Do you feel creatively aligned with higher meaning and experience moments of transcendence?',
      weight: 1.0,
      channel: 'sex_crown',
      type: 'abundance'
    },
    {
      id: 'channel_sex_crown_lack',
      question: 'When creative energy is lacking, how does that impact your spiritual awareness? Do you feel disconnected from spiritual purpose, uninspired, or unable to connect creativity with transcendence?',
      weight: 1.0,
      channel: 'sex_crown',
      type: 'lack'
    },
    {
      id: 'channel_sex_crown_blocked',
      question: 'Do you experience spiritual stagnation or inability to integrate creativity with transcendence, even when you have creative energy? Or feeling creatively unfulfilled and disconnected from higher meaning?',
      weight: 1.3,
      channel: 'sex_crown',
      type: 'blocked'
    },
    {
      id: 'channel_sex_crown_blocked2',
      question: 'When creative energy cannot reach spiritual awareness, what happens? Do you feel creatively inspired but spiritually disconnected, or experience a gap between creative expression and spiritual realization?',
      weight: 1.2,
      channel: 'sex_crown',
      type: 'blocked'
    }
  ]
  // Additional channels for Gut, Heart, Throat, Mind, Crown will follow the same pattern
  // For now, the engine will generate generic questions for channels not explicitly defined
};

// Stage 3: Deep channel management questions (triggered for identified blocked channels)
export const STAGE_3_MANAGEMENT_QUESTIONS = {
  root_sex: [
    {
      id: 'manage_root_sex_1',
      question: 'What specific activities help you ground your physical energy and channel it into creative expression?',
      weight: 1.0,
      channel: 'root_sex',
      type: 'management'
    },
    {
      id: 'manage_root_sex_2',
      question: 'When you notice a disconnect between physical energy and creativity, what patterns or triggers do you observe?',
      weight: 1.0,
      channel: 'root_sex',
      type: 'management'
    },
    {
      id: 'manage_root_sex_3',
      question: 'What would help restore the flow between your physical vitality and creative will? Consider both physical practices and creative outlets.',
      weight: 1.0,
      channel: 'root_sex',
      type: 'management'
    }
  ]
  // Additional management questions for each channel
};

