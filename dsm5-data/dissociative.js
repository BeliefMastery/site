// Dissociative Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const DISSOCIATIVE_DISORDERS = {
  name: "Dissociative Disorders",
  disorders: {
    "Dissociative Identity Disorder": {
      code: "300.14",
      criteria: {
        A: {
          text: "Disruption of identity characterized by two or more distinct personality states",
          weight: 1.0
        },
        B: {
          text: "Recurrent gaps in the recall of everyday events, important personal information, or traumatic events that are inconsistent with ordinary forgetting",
          weight: 0.9
        },
        C: {
          text: "The symptoms cause clinically significant distress or impairment",
          weight: 0.9
        }
      }
    },
    "Dissociative Amnesia": {
      code: "300.12",
      criteria: {
        A: {
          text: "An inability to recall important autobiographical information, usually of a traumatic or stressful nature, that is inconsistent with ordinary forgetting",
          weight: 1.0
        },
        B: {
          text: "The symptoms cause clinically significant distress or impairment",
          weight: 0.9
        }
      }
    },
    "Depersonalization/Derealization Disorder": {
      code: "300.6",
      criteria: {
        A: {
          text: "The presence of persistent or recurrent experiences of depersonalization, derealization, or both",
          weight: 1.0
        },
        B: {
          text: "During the depersonalization or derealization experiences, reality testing remains intact",
          weight: 0.9
        },
        C: {
          text: "The symptoms cause clinically significant distress or impairment",
          weight: 0.9
        }
      }
    }
  }
};

