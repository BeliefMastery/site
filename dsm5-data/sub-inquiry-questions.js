// Sub-inquiry refinement questions for moderate-probability diagnoses

export const SUB_INQUIRY_QUESTIONS = {
  "Major Depressive Disorder": {
    severity: [
      "How would you rate the severity of your depressive symptoms?",
      "To what extent do these symptoms interfere with your work, relationships, or daily functioning?"
    ],
    duration: [
      "How long have you been experiencing these symptoms?",
      "Have these symptoms been continuous or episodic?"
    ],
    specifiers: [
      "Have you experienced any psychotic symptoms (delusions or hallucinations)?",
      "Do you experience seasonal patterns in your mood?"
    ]
  },
  "Bipolar I Disorder": {
    duration: [
      "How long do your elevated mood episodes typically last?",
      "How long do your depressed episodes typically last?"
    ],
    severity: [
      "During elevated mood periods, to what extent do your symptoms interfere with functioning?",
      "Have you ever required hospitalization during mood episodes?"
    ]
  },
  "Generalized Anxiety Disorder": {
    duration: [
      "How long have you been experiencing excessive worry?",
      "Have these symptoms been constant or episodic?"
    ],
    triggers: [
      "What situations or thoughts typically trigger your anxiety?",
      "Do you notice patterns in when your anxiety is worse?"
    ]
  },
  "Posttraumatic Stress Disorder": {
    trauma: [
      "What type of traumatic event(s) have you experienced?",
      "How long ago did the traumatic event(s) occur?"
    ],
    current: [
      "How often do you currently experience trauma-related symptoms?",
      "Are there specific triggers that remind you of the trauma?"
    ]
  }
};

