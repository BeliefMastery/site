// Somatic Symptom and Related Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const SOMATIC_DISORDERS = {
  name: "Somatic Symptom and Related Disorders",
  disorders: {
    "Somatic Symptom Disorder": {
      code: "300.82",
      criteria: {
        A: {
          text: "One or more somatic symptoms that are distressing or result in significant disruption of daily life",
          weight: 1.0
        },
        B: {
          text: "Excessive thoughts, feelings, or behaviors related to the somatic symptoms or associated health concerns",
          weight: 0.9
        },
        C: {
          text: "Although any one somatic symptom may not be continuously present, the state of being symptomatic is persistent (typically more than 6 months)",
          weight: 0.9
        }
      }
    },
    "Illness Anxiety Disorder": {
      code: "300.7",
      criteria: {
        A: {
          text: "Preoccupation with having or acquiring a serious illness",
          weight: 1.0
        },
        B: {
          text: "Somatic symptoms are not present or, if present, are only mild in intensity",
          weight: 0.9
        },
        C: {
          text: "There is a high level of anxiety about health, and the individual is easily alarmed about personal health status",
          weight: 0.9
        }
      }
    },
    "Conversion Disorder (Functional Neurological Symptom Disorder)": {
      code: "300.11",
      criteria: {
        A: {
          text: "One or more symptoms of altered voluntary motor or sensory function",
          weight: 1.0
        },
        B: {
          text: "Clinical findings provide evidence of incompatibility between the symptom and recognized neurological or medical conditions",
          weight: 0.9
        },
        C: {
          text: "The symptom or deficit is not better explained by another medical or mental disorder",
          weight: 0.9
        }
      }
    },
    "Factitious Disorder": {
      code: "300.19",
      criteria: {
        A: {
          text: "Falsification of physical or psychological signs or symptoms, or induction of injury or disease, associated with identified deception",
          weight: 1.0
        },
        B: {
          text: "The individual presents himself or herself to others as ill, impaired, or injured",
          weight: 0.9
        },
        C: {
          text: "The deceptive behavior is evident even in the absence of obvious external rewards",
          weight: 0.9
        }
      }
    }
  }
};

