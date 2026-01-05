// Question generation framework for all diagnostic categories

export const QUESTION_TEMPLATES = {
  mood: {
    depressed_mood: [
      "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
      "To what extent have you experienced persistent sadness or low mood?"
    ],
    anhedonia: [
      "How much have you lost interest or pleasure in activities you usually enjoy?",
      "To what degree have you found it difficult to feel pleasure or satisfaction?"
    ],
    fatigue: [
      "How often have you felt tired or had little energy, even after adequate rest?",
      "To what extent has fatigue interfered with your daily activities?"
    ],
    elevated_mood: [
      "Have you experienced periods of unusually elevated, euphoric, or irritable mood?",
      "To what extent have you felt unusually high or 'wired'?"
    ]
  },
  anxiety: {
    worry: [
      "How often do you find yourself worrying excessively about various aspects of your life?",
      "To what extent do you have difficulty controlling your worries?"
    ],
    restlessness: [
      "How often do you feel restless, keyed up, or on edge?",
      "To what degree do you experience physical restlessness or tension?"
    ],
    panic: [
      "Have you experienced sudden episodes of intense fear or discomfort?",
      "How often have you had panic attacks?"
    ]
  },
  trauma: {
    intrusion: [
      "How often do you experience unwanted, distressing memories of a traumatic event?",
      "To what extent do you have flashbacks or feel as if the trauma is happening again?"
    ],
    avoidance: [
      "How much do you avoid reminders of a traumatic experience?",
      "To what degree do you avoid thoughts, feelings, or conversations about trauma?"
    ]
  }
};

