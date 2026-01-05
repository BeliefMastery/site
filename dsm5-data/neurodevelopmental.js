// Neurodevelopmental Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const NEURODEVELOPMENTAL_DISORDERS = {
  name: "Neurodevelopmental Disorders",
  disorders: {
    "Autism Spectrum Disorder": {
      code: "299.00",
      criteria: {
        A: {
          text: "Persistent deficits in social communication and social interaction across multiple contexts",
          weight: 1.0
        },
        B: {
          text: "Restricted, repetitive patterns of behavior, interests, or activities",
          weight: 1.0
        },
        C: {
          text: "Symptoms must be present in early developmental period",
          weight: 1.0
        }
      }
    },
    "Attention-Deficit/Hyperactivity Disorder": {
      code: "314.01",
      criteria: {
        A: {
          text: "A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development",
          weight: 1.0
        },
        B: {
          text: "Several symptoms present prior to age 12",
          weight: 0.9
        }
      }
    },
    "Specific Learning Disorder": {
      code: "315.00",
      criteria: {
        A: {
          text: "Difficulties learning and using academic skills, as indicated by the presence of at least one of the following symptoms that have persisted for at least 6 months",
          weight: 1.0
        },
        B: {
          text: "The affected academic skills are substantially and quantifiably below those expected for the individual's chronological age",
          weight: 1.0
        }
      }
    }
  }
};

