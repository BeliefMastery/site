// DSM-5 Diagnostic Criteria Database
// This file contains diagnostic categories, criteria, and question frameworks

export const DSM5_CATEGORIES = {
  mood: {
    name: "Depressive and Bipolar Disorders",
    disorders: {
      "Major Depressive Disorder": {
        code: "296.33",
        criteria: {
          A: {
            text: "Five or more of the following symptoms during the same 2-week period",
            symptoms: [
              { id: "depressed_mood", text: "Depressed mood most of the day, nearly every day", weight: 1.0 },
              { id: "anhedonia", text: "Markedly diminished interest or pleasure in all, or almost all, activities", weight: 1.0 },
              { id: "weight_change", text: "Significant weight loss or gain, or decrease/increase in appetite", weight: 0.8 },
              { id: "sleep_disturbance", text: "Insomnia or hypersomnia nearly every day", weight: 0.8 },
              { id: "psychomotor", text: "Psychomotor agitation or retardation", weight: 0.7 },
              { id: "fatigue", text: "Fatigue or loss of energy nearly every day", weight: 0.9 },
              { id: "worthlessness", text: "Feelings of worthlessness or excessive guilt", weight: 0.8 },
              { id: "concentration", text: "Diminished ability to think or concentrate, or indecisiveness", weight: 0.7 },
              { id: "suicidal", text: "Recurrent thoughts of death, suicidal ideation, or suicide attempt", weight: 1.0 }
            ],
            threshold: 5
          },
          B: {
            text: "Symptoms cause clinically significant distress or impairment",
            weight: 1.0
          },
          C: {
            text: "Not attributable to substance or medical condition",
            weight: 0.9
          }
        },
        specifiers: ["mild", "moderate", "severe", "with psychotic features", "in partial remission", "in full remission"]
      },
      "Persistent Depressive Disorder": {
        code: "300.4",
        criteria: {
          A: {
            text: "Depressed mood for most of the day, for more days than not, for at least 2 years",
            weight: 1.0
          },
          B: {
            text: "Two or more of the following while depressed",
            symptoms: [
              { id: "poor_appetite", text: "Poor appetite or overeating", weight: 0.7 },
              { id: "insomnia_hypersomnia", text: "Insomnia or hypersomnia", weight: 0.7 },
              { id: "low_energy", text: "Low energy or fatigue", weight: 0.8 },
              { id: "low_self_esteem", text: "Low self-esteem", weight: 0.8 },
              { id: "poor_concentration", text: "Poor concentration or difficulty making decisions", weight: 0.7 },
              { id: "hopelessness", text: "Feelings of hopelessness", weight: 0.9 }
            ],
            threshold: 2
          }
        }
      },
      "Bipolar I Disorder": {
        code: "296.xx",
        criteria: {
          A: {
            text: "At least one manic episode",
            symptoms: [
              { id: "elevated_mood", text: "Abnormally and persistently elevated, expansive, or irritable mood", weight: 1.0 },
              { id: "increased_activity", text: "Abnormally and persistently increased goal-directed activity or energy", weight: 1.0 },
              { id: "grandiosity", text: "Inflated self-esteem or grandiosity", weight: 0.8 },
              { id: "decreased_sleep", text: "Decreased need for sleep", weight: 0.7 },
              { id: "pressured_speech", text: "More talkative than usual or pressure to keep talking", weight: 0.8 },
              { id: "flight_ideas", text: "Flight of ideas or racing thoughts", weight: 0.8 },
              { id: "distractibility", text: "Distractibility", weight: 0.7 },
              { id: "risky_behavior", text: "Excessive involvement in activities with high potential for painful consequences", weight: 0.9 }
            ],
            threshold: 3
          }
        }
      },
      "Bipolar II Disorder": {
        code: "296.89",
        criteria: {
          A: {
            text: "At least one hypomanic episode and one major depressive episode",
            weight: 1.0
          }
        }
      }
    }
  },
  anxiety: {
    name: "Anxiety Disorders",
    disorders: {
      "Generalized Anxiety Disorder": {
        code: "300.02",
        criteria: {
          A: {
            text: "Excessive anxiety and worry, occurring more days than not for at least 6 months",
            weight: 1.0
          },
          B: {
            text: "Difficulty controlling the worry",
            weight: 0.9
          },
          C: {
            text: "Three or more of the following symptoms",
            symptoms: [
              { id: "restlessness", text: "Restlessness or feeling keyed up or on edge", weight: 0.8 },
              { id: "easily_fatigued", text: "Being easily fatigued", weight: 0.7 },
              { id: "difficulty_concentrating", text: "Difficulty concentrating or mind going blank", weight: 0.8 },
              { id: "irritability", text: "Irritability", weight: 0.7 },
              { id: "muscle_tension", text: "Muscle tension", weight: 0.7 },
              { id: "sleep_disturbance_anx", text: "Sleep disturbance", weight: 0.7 }
            ],
            threshold: 3
          }
        }
      },
      "Panic Disorder": {
        code: "300.01",
        criteria: {
          A: {
            text: "Recurrent unexpected panic attacks",
            weight: 1.0
          },
          B: {
            text: "At least one attack followed by persistent concern or worry about additional attacks, or significant maladaptive change in behavior",
            weight: 0.9
          }
        }
      },
      "Social Anxiety Disorder": {
        code: "300.23",
        criteria: {
          A: {
            text: "Marked fear or anxiety about one or more social situations in which the individual is exposed to possible scrutiny",
            weight: 1.0
          },
          B: {
            text: "The individual fears they will act in a way that will be negatively evaluated",
            weight: 0.9
          },
          C: {
            text: "Social situations almost always provoke fear or anxiety",
            weight: 0.9
          }
        }
      }
    }
  },
  trauma: {
    name: "Trauma- and Stressor-Related Disorders",
    disorders: {
      "Posttraumatic Stress Disorder": {
        code: "309.81",
        criteria: {
          A: {
            text: "Exposure to actual or threatened death, serious injury, or sexual violence",
            weight: 1.0
          },
          B: {
            text: "One or more intrusion symptoms",
            symptoms: [
              { id: "recurrent_memories", text: "Recurrent, involuntary, and intrusive distressing memories", weight: 0.9 },
              { id: "recurrent_dreams", text: "Recurrent distressing dreams", weight: 0.8 },
              { id: "dissociative_reactions", text: "Dissociative reactions (flashbacks)", weight: 0.9 },
              { id: "psychological_distress", text: "Intense psychological distress at exposure to cues", weight: 0.8 },
              { id: "physiological_reactions", text: "Marked physiological reactions to cues", weight: 0.8 }
            ],
            threshold: 1
          },
          C: {
            text: "One or more avoidance symptoms",
            symptoms: [
              { id: "avoid_memories", text: "Avoidance of memories, thoughts, or feelings", weight: 0.9 },
              { id: "avoid_external", text: "Avoidance of external reminders", weight: 0.9 }
            ],
            threshold: 1
          },
          D: {
            text: "Two or more negative alterations in cognitions and mood",
            symptoms: [
              { id: "amnesia", text: "Inability to remember important aspects", weight: 0.7 },
              { id: "negative_beliefs", text: "Persistent negative beliefs about self, others, or world", weight: 0.8 },
              { id: "distorted_blame", text: "Distorted cognitions about cause or consequences", weight: 0.7 },
              { id: "negative_emotional", text: "Persistent negative emotional state", weight: 0.8 },
              { id: "diminished_interest", text: "Markedly diminished interest in activities", weight: 0.7 },
              { id: "detachment", text: "Feelings of detachment or estrangement", weight: 0.7 },
              { id: "inability_positive", text: "Inability to experience positive emotions", weight: 0.8 }
            ],
            threshold: 2
          },
          E: {
            text: "Two or more alterations in arousal and reactivity",
            symptoms: [
              { id: "irritable_behavior", text: "Irritable behavior and angry outbursts", weight: 0.8 },
              { id: "reckless_behavior", text: "Reckless or self-destructive behavior", weight: 0.8 },
              { id: "hypervigilance", text: "Hypervigilance", weight: 0.8 },
              { id: "exaggerated_startle", text: "Exaggerated startle response", weight: 0.7 },
              { id: "concentration_problems", text: "Problems with concentration", weight: 0.7 },
              { id: "sleep_disturbance_ptsd", text: "Sleep disturbance", weight: 0.7 }
            ],
            threshold: 2
          }
        }
      },
      "Acute Stress Disorder": {
        code: "308.3",
        criteria: {
          A: {
            text: "Exposure to actual or threatened death, serious injury, or sexual violation",
            weight: 1.0
          },
          B: {
            text: "Nine or more symptoms from any of the five categories (intrusion, negative mood, dissociation, avoidance, arousal)",
            threshold: 9
          }
        }
      }
    }
  },
  personality: {
    name: "Personality Disorders",
    disorders: {
      "Borderline Personality Disorder": {
        code: "301.83",
        criteria: {
          A: {
            text: "A pervasive pattern of instability of interpersonal relationships, self-image, and affects, and marked impulsivity",
            threshold: 5,
            symptoms: [
              { id: "frantic_abandonment", text: "Frantic efforts to avoid real or imagined abandonment", weight: 0.9 },
              { id: "unstable_relationships", text: "Unstable and intense interpersonal relationships", weight: 0.9 },
              { id: "identity_disturbance", text: "Identity disturbance", weight: 0.9 },
              { id: "impulsivity", text: "Impulsivity in potentially self-damaging areas", weight: 0.8 },
              { id: "suicidal_behavior", text: "Recurrent suicidal behavior, gestures, or threats", weight: 1.0 },
              { id: "affective_instability", text: "Affective instability due to marked reactivity of mood", weight: 0.9 },
              { id: "chronic_emptiness", text: "Chronic feelings of emptiness", weight: 0.8 },
              { id: "inappropriate_anger", text: "Inappropriate, intense anger or difficulty controlling anger", weight: 0.8 },
              { id: "transient_paranoid", text: "Transient, stress-related paranoid ideation or severe dissociative symptoms", weight: 0.7 }
            ]
          }
        }
      },
      "Narcissistic Personality Disorder": {
        code: "301.81",
        criteria: {
          A: {
            text: "A pervasive pattern of grandiosity, need for admiration, and lack of empathy",
            threshold: 5,
            symptoms: [
              { id: "grandiose_sense", text: "Grandiose sense of self-importance", weight: 0.9 },
              { id: "fantasies_success", text: "Preoccupation with fantasies of success, power, brilliance", weight: 0.8 },
              { id: "special_unique", text: "Belief that one is special and unique", weight: 0.8 },
              { id: "requires_admiration", text: "Requires excessive admiration", weight: 0.9 },
              { id: "sense_entitlement", text: "Sense of entitlement", weight: 0.9 },
              { id: "exploitative", text: "Interpersonally exploitative", weight: 0.8 },
              { id: "lacks_empathy", text: "Lacks empathy", weight: 0.9 },
              { id: "envious", text: "Often envious of others or believes others are envious", weight: 0.7 },
              { id: "arrogant", text: "Shows arrogant, haughty behaviors or attitudes", weight: 0.8 }
            ]
          }
        }
      }
    }
  }
};

// Question generation framework
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

// Contradictory validation questions
export const VALIDATION_PAIRS = [
  {
    primary: "depressed_mood",
    contradictory: "I generally feel optimistic and positive about my future",
    weight: 0.8
  },
  {
    primary: "anhedonia",
    contradictory: "I regularly experience joy and satisfaction in my activities",
    weight: 0.8
  },
  {
    primary: "worry",
    contradictory: "I rarely worry about things beyond my immediate control",
    weight: 0.7
  }
];

// Scoring thresholds
export const SCORING_THRESHOLDS = {
  high_probability: 0.75,
  moderate_probability: 0.50,
  low_probability: 0.25,
  requires_sub_inquiry: 0.40 // If between 40-60%, trigger sub-inquiry
};

// Sub-inquiry refinement questions
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
  }
};

