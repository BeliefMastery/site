// Neurocognitive Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const NEUROCOGNITIVE_DISORDERS = {
  name: "Neurocognitive Disorders",
  disorders: {
    "Major Neurocognitive Disorder": {
      code: "varies",
      criteria: {
        A: {
          text: "Evidence of significant cognitive decline from a previous level of performance in one or more cognitive domains",
          weight: 1.0
        },
        B: {
          text: "The cognitive deficits interfere with independence in everyday activities",
          weight: 1.0
        },
        C: {
          text: "The cognitive deficits do not occur exclusively in the context of a delirium",
          weight: 0.9
        }
      }
    },
    "Mild Neurocognitive Disorder": {
      code: "331.83",
      criteria: {
        A: {
          text: "Evidence of modest cognitive decline from a previous level of performance in one or more cognitive domains",
          weight: 1.0
        },
        B: {
          text: "The cognitive deficits do not interfere with capacity for independence in everyday activities",
          weight: 0.9
        }
      }
    }
  }
};

