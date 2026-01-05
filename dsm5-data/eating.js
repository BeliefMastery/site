// Feeding and Eating Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const EATING_DISORDERS = {
  name: "Feeding and Eating Disorders",
  disorders: {
    "Anorexia Nervosa": {
      code: "307.1",
      criteria: {
        A: {
          text: "Restriction of energy intake leading to significantly low body weight",
          weight: 1.0
        },
        B: {
          text: "Intense fear of gaining weight or becoming fat, or persistent behavior that interferes with weight gain",
          weight: 1.0
        },
        C: {
          text: "Disturbance in the way one's body weight or shape is experienced",
          weight: 0.9
        }
      }
    },
    "Bulimia Nervosa": {
      code: "307.51",
      criteria: {
        A: {
          text: "Recurrent episodes of binge eating",
          weight: 1.0
        },
        B: {
          text: "Recurrent inappropriate compensatory behaviors to prevent weight gain",
          weight: 1.0
        },
        C: {
          text: "Binge eating and compensatory behaviors both occur, on average, at least once a week for 3 months",
          weight: 0.9
        }
      }
    },
    "Binge-Eating Disorder": {
      code: "307.51",
      criteria: {
        A: {
          text: "Recurrent episodes of binge eating",
          weight: 1.0
        },
        B: {
          text: "The binge-eating episodes are associated with three or more specified markers (eating rapidly, eating until uncomfortably full, eating large amounts when not physically hungry, eating alone due to embarrassment, feeling disgusted/depressed/guilty)",
          threshold: 3,
          weight: 0.9
        },
        C: {
          text: "Marked distress regarding binge eating",
          weight: 0.9
        }
      }
    },
    "Avoidant/Restrictive Food Intake Disorder": {
      code: "307.59",
      criteria: {
        A: {
          text: "An eating or feeding disturbance (lack of interest in food, avoidance based on sensory characteristics, concern about aversive consequences)",
          weight: 1.0
        },
        B: {
          text: "The disturbance leads to persistent failure to meet appropriate nutritional needs",
          weight: 1.0
        }
      }
    }
  }
};

