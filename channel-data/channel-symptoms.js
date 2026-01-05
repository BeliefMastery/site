// Channel Symptoms - Questions to identify channel blockages

export const CHANNEL_SYMPTOMS = {
  root_related: [
    {
      id: 'root_symptom_1',
      question: 'Do you feel ungrounded, disconnected from your body, or physically depleted?',
      channels: ['root_sex', 'root_gut', 'root_heart', 'root_throat', 'root_mind', 'root_crown'],
      weight: 1.2
    },
    {
      id: 'root_symptom_2',
      question: 'Do you experience chronic physical tension, fatigue, or lack of vitality?',
      channels: ['root_sex', 'root_gut', 'root_heart'],
      weight: 1.1
    }
  ],
  sex_related: [
    {
      id: 'sex_symptom_1',
      question: 'Do you experience creative blocks, lack of motivation, or inability to channel passion?',
      channels: ['sex_root', 'sex_gut', 'sex_heart', 'sex_throat', 'sex_mind', 'sex_crown'],
      weight: 1.2
    },
    {
      id: 'sex_symptom_2',
      question: 'Do you struggle with willpower, follow-through, or completing creative projects?',
      channels: ['sex_root', 'sex_throat', 'sex_mind'],
      weight: 1.1
    }
  ],
  gut_related: [
    {
      id: 'gut_symptom_1',
      question: 'Do you experience emotional overwhelm, difficulty processing feelings, or gut-level anxiety?',
      channels: ['gut_heart', 'gut_throat', 'gut_mind'],
      weight: 1.3
    },
    {
      id: 'gut_symptom_2',
      question: 'Do you struggle to trust your instincts or make decisions based on gut feelings?',
      channels: ['gut_heart', 'gut_mind'],
      weight: 1.2
    }
  ],
  heart_related: [
    {
      id: 'heart_symptom_1',
      question: 'Do you feel emotionally closed, unable to give or receive love, or disconnected from others?',
      channels: ['heart_throat', 'heart_mind', 'heart_crown'],
      weight: 1.3
    },
    {
      id: 'heart_symptom_2',
      question: 'Do you experience fear of intimacy, emotional coldness, or difficulty being vulnerable?',
      channels: ['heart_throat', 'heart_gut'],
      weight: 1.2
    }
  ],
  throat_related: [
    {
      id: 'throat_symptom_1',
      question: 'Do you struggle to express yourself, communicate authentically, or find your voice?',
      channels: ['throat_mind', 'throat_heart', 'throat_crown'],
      weight: 1.3
    },
    {
      id: 'throat_symptom_2',
      question: 'Do you experience physical tension in throat, difficulty speaking truth, or social disconnection?',
      channels: ['throat_mind', 'throat_heart'],
      weight: 1.2
    }
  ],
  mind_related: [
    {
      id: 'mind_symptom_1',
      question: 'Do you experience mental confusion, scattered thoughts, or inability to focus?',
      channels: ['mind_crown', 'mind_throat', 'mind_heart'],
      weight: 1.2
    },
    {
      id: 'mind_symptom_2',
      question: 'Do you struggle with clarity, vision, or integrating ideas into understanding?',
      channels: ['mind_crown', 'mind_throat'],
      weight: 1.2
    }
  ],
  crown_related: [
    {
      id: 'crown_symptom_1',
      question: 'Do you feel spiritually disconnected, lost, or unable to connect with higher purpose?',
      channels: ['crown_mind', 'crown_heart', 'crown_throat'],
      weight: 1.2
    },
    {
      id: 'crown_symptom_2',
      question: 'Do you experience spiritual confusion, lack of direction, or inability to integrate transcendence?',
      channels: ['crown_mind', 'crown_heart'],
      weight: 1.2
    }
  ]
};

