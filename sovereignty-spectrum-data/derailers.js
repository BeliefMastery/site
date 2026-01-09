// Derailers - Forces that undermine sovereignty: hypocrisy, reluctance, nihilism

export const DERAILERS = {
  hypocrisy: {
    name: 'Hypocrisy',
    description: 'Value-action gaps: professing values while acting contrary to them',
    penalty: -15, // Maximum penalty points
    questions: [
      {
        id: 'hypocrisy_1',
        text: 'I often find myself acting in ways that contradict my stated values',
        type: 'likert',
        weight: 1.0
      },
      {
        id: 'hypocrisy_2',
        text: 'I publicly affirm principles that I privately violate',
        type: 'likert',
        weight: 1.1
      },
      {
        id: 'hypocrisy_3',
        text: 'There is a significant gap between what I believe and how I act',
        type: 'likert',
        weight: 1.2
      },
      {
        id: 'hypocrisy_4',
        text: 'I make exceptions to my principles when it\'s convenient',
        type: 'likert',
        weight: 1.0
      },
      {
        id: 'hypocrisy_5',
        text: 'I judge others for behaviors I engage in myself',
        type: 'likert',
        weight: 1.0
      }
    ]
  },
  reluctance: {
    name: 'Reluctance',
    description: 'Inertial resistance: avoiding necessary actions despite knowing what should be done',
    penalty: -10, // Maximum penalty points
    questions: [
      {
        id: 'reluctance_1',
        text: 'I often delay or avoid actions I know I should take',
        type: 'likert',
        weight: 1.1
      },
      {
        id: 'reluctance_2',
        text: 'I resist making difficult decisions even when they\'re necessary',
        type: 'likert',
        weight: 1.0
      },
      {
        id: 'reluctance_3',
        text: 'I find myself stuck in patterns I know are unhelpful',
        type: 'likert',
        weight: 1.0
      },
      {
        id: 'reluctance_4',
        text: 'I avoid discomfort even when it would lead to growth',
        type: 'likert',
        weight: 1.1
      },
      {
        id: 'reluctance_5',
        text: 'I defer to others or circumstances rather than taking initiative',
        type: 'likert',
        weight: 1.0
      }
    ]
  },
  nihilism: {
    name: 'Nihilism',
    description: 'Despair-induced abdication: meaninglessness paralyzes action and purpose',
    penalty: -20, // Maximum penalty points
    questions: [
      {
        id: 'nihilism_1',
        text: 'I often feel that nothing really matters or has meaning',
        type: 'likert',
        weight: 1.2
      },
      {
        id: 'nihilism_2',
        text: 'The meaninglessness of existence makes effort seem futile',
        type: 'likert',
        weight: 1.1
      },
      {
        id: 'nihilism_3',
        text: 'I struggle to find purpose or direction in life',
        type: 'likert',
        weight: 1.1
      },
      {
        id: 'nihilism_4',
        text: 'Despair or hopelessness prevents me from taking meaningful action',
        type: 'likert',
        weight: 1.2
      },
      {
        id: 'nihilism_5',
        text: 'I see life as ultimately meaningless and this paralyzes me',
        type: 'likert',
        weight: 1.1
      }
    ]
  }
};

