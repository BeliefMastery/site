// Obsessive-Compulsive and Related Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const OCD_DISORDERS = {
  name: "Obsessive-Compulsive and Related Disorders",
  disorders: {
    "Obsessive-Compulsive Disorder": {
      code: "300.3",
      criteria: {
        A: {
          text: "Presence of obsessions, compulsions, or both",
          weight: 1.0
        },
        B: {
          text: "Obsessions or compulsions are time-consuming or cause clinically significant distress or impairment",
          weight: 1.0
        }
      }
    },
    "Body Dysmorphic Disorder": {
      code: "300.7",
      criteria: {
        A: {
          text: "Preoccupation with one or more perceived defects or flaws in physical appearance that are not observable or appear slight to others",
          weight: 1.0
        },
        B: {
          text: "At some point during the course of the disorder, the individual has performed repetitive behaviors or mental acts in response to the appearance concerns",
          weight: 0.9
        }
      }
    },
    "Hoarding Disorder": {
      code: "300.3",
      criteria: {
        A: {
          text: "Persistent difficulty discarding or parting with possessions, regardless of their actual value",
          weight: 1.0
        },
        B: {
          text: "This difficulty is due to a perceived need to save the items and to distress associated with discarding them",
          weight: 0.9
        },
        C: {
          text: "The difficulty discarding possessions results in the accumulation of possessions that congest and clutter active living areas",
          weight: 1.0
        }
      }
    },
    "Trichotillomania (Hair-Pulling Disorder)": {
      code: "312.39",
      criteria: {
        A: {
          text: "Recurrent pulling out of one's hair, resulting in hair loss",
          weight: 1.0
        },
        B: {
          text: "Repeated attempts to decrease or stop hair pulling",
          weight: 0.9
        },
        C: {
          text: "The hair pulling causes clinically significant distress or impairment",
          weight: 0.9
        }
      }
    },
    "Excoriation (Skin-Picking) Disorder": {
      code: "298.8",
      criteria: {
        A: {
          text: "Recurrent skin picking resulting in skin lesions",
          weight: 1.0
        },
        B: {
          text: "Repeated attempts to decrease or stop skin picking",
          weight: 0.9
        },
        C: {
          text: "The skin picking causes clinically significant distress or impairment",
          weight: 0.9
        }
      }
    }
  }
};

