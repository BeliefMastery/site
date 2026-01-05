// Schizophrenia Spectrum and Other Psychotic Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const SCHIZOPHRENIA_DISORDERS = {
  name: "Schizophrenia Spectrum and Other Psychotic Disorders",
  disorders: {
    "Schizophrenia": {
      code: "295.90",
      criteria: {
        A: {
          text: "Two or more of the following, each present for a significant portion of time during a 1-month period (or less if successfully treated)",
          threshold: 2,
          symptoms: [
            { id: "delusions", text: "Delusions", weight: 1.0 },
            { id: "hallucinations", text: "Hallucinations", weight: 1.0 },
            { id: "disorganized_speech", text: "Disorganized speech", weight: 0.9 },
            { id: "grossly_disorganized", text: "Grossly disorganized or catatonic behavior", weight: 0.9 },
            { id: "negative_symptoms", text: "Negative symptoms (diminished emotional expression or avolition)", weight: 0.9 }
          ]
        },
        B: {
          text: "For a significant portion of the time since the onset of the disturbance, level of functioning in one or more major areas is markedly below the level achieved prior to onset",
          weight: 0.9
        },
        C: {
          text: "Continuous signs of the disturbance persist for at least 6 months",
          weight: 0.9
        }
      }
    },
    "Schizoaffective Disorder": {
      code: "295.70",
      criteria: {
        A: {
          text: "An uninterrupted period of illness during which there is a major mood episode (major depressive or manic) concurrent with Criterion A of schizophrenia",
          weight: 1.0
        },
        B: {
          text: "Delusions or hallucinations for 2 or more weeks in the absence of a major mood episode during the lifetime duration of the illness",
          weight: 0.9
        },
        C: {
          text: "Symptoms that meet criteria for a major mood episode are present for the majority of the total duration of the active and residual portions of the illness",
          weight: 0.9
        }
      }
    },
    "Schizophreniform Disorder": {
      code: "295.40",
      criteria: {
        A: {
          text: "Two or more of: delusions, hallucinations, disorganized speech, grossly disorganized or catatonic behavior, negative symptoms",
          threshold: 2,
          weight: 1.0
        },
        B: {
          text: "An episode of the disorder lasts at least 1 month but less than 6 months",
          weight: 0.9
        }
      }
    },
    "Brief Psychotic Disorder": {
      code: "298.8",
      criteria: {
        A: {
          text: "Presence of one or more of: delusions, hallucinations, disorganized speech, grossly disorganized or catatonic behavior",
          weight: 1.0
        },
        B: {
          text: "Duration of an episode of the disturbance is at least 1 day but less than 1 month, with eventual full return to premorbid level of functioning",
          weight: 1.0
        }
      }
    },
    "Delusional Disorder": {
      code: "297.1",
      criteria: {
        A: {
          text: "The presence of one or more delusions with a duration of 1 month or longer",
          weight: 1.0
        },
        B: {
          text: "Criterion A for schizophrenia has never been met",
          weight: 0.9
        },
        C: {
          text: "Apart from the impact of the delusion(s) or its ramifications, functioning is not markedly impaired, and behavior is not obviously bizarre or odd",
          weight: 0.8
        }
      }
    }
  }
};

