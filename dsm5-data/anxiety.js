// Anxiety Disorders - Comprehensive DSM-5 Data

export const ANXIETY_DISORDERS = {
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
        },
        C: {
          text: "Panic attacks not due to substance or medical condition",
          weight: 0.9
        }
      }
    },
    "Social Anxiety Disorder (Social Phobia)": {
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
        },
        D: {
          text: "Social situations are avoided or endured with intense fear or anxiety",
          weight: 0.9
        }
      }
    },
    "Specific Phobia": {
      code: "300.29",
      criteria: {
        A: {
          text: "Marked fear or anxiety about a specific object or situation",
          weight: 1.0
        },
        B: {
          text: "The phobic object or situation almost always provokes immediate fear or anxiety",
          weight: 0.9
        },
        C: {
          text: "The phobic object or situation is actively avoided or endured with intense fear or anxiety",
          weight: 0.9
        }
      }
    },
    "Agoraphobia": {
      code: "300.22",
      criteria: {
        A: {
          text: "Marked fear or anxiety about two or more of: using public transportation, being in open spaces, being in enclosed places, standing in line or being in a crowd, being outside of the home alone",
          weight: 1.0
        },
        B: {
          text: "The individual fears or avoids these situations because of thoughts that escape might be difficult or help unavailable",
          weight: 0.9
        },
        C: {
          text: "These situations almost always provoke fear or anxiety",
          weight: 0.9
        }
      }
    },
    "Substance/Medication-Induced Anxiety Disorder": {
      code: "293.89",
      criteria: {
        A: {
          text: "Panic attacks or anxiety is prominent",
          weight: 1.0
        },
        B: {
          text: "Evidence that symptoms developed during or soon after substance intoxication/withdrawal or medication exposure",
          weight: 1.0
        }
      }
    },
    "Anxiety Disorder Due to Another Medical Condition": {
      code: "293.84",
      criteria: {
        A: {
          text: "Panic attacks or anxiety is prominent",
          weight: 1.0
        },
        B: {
          text: "Evidence that disturbance is direct pathophysiological consequence of another medical condition",
          weight: 1.0
        }
      }
    },
    "Other Specified Anxiety Disorder": {
      code: "300.09",
      criteria: {
        A: {
          text: "Anxiety symptoms causing distress but not meeting full criteria",
          weight: 0.8
        }
      }
    },
    "Unspecified Anxiety Disorder": {
      code: "300.00",
      criteria: {
        A: {
          text: "Anxiety symptoms causing distress but insufficient information for specific diagnosis",
          weight: 0.7
        }
      }
    }
  }
};

