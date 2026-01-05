// Sleep-Wake Disorders - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const SLEEP_DISORDERS = {
  name: "Sleep-Wake Disorders",
  disorders: {
    "Insomnia Disorder": {
      code: "307.42",
      criteria: {
        A: {
          text: "Dissatisfaction with sleep quantity or quality, with complaints of difficulty initiating or maintaining sleep",
          weight: 1.0
        },
        B: {
          text: "The sleep disturbance causes clinically significant distress or impairment",
          weight: 0.9
        },
        C: {
          text: "The sleep difficulty occurs at least 3 nights per week",
          weight: 0.9
        }
      }
    },
    "Hypersomnolence Disorder": {
      code: "307.44",
      criteria: {
        A: {
          text: "Self-reported excessive sleepiness despite a main sleep period lasting at least 7 hours",
          weight: 1.0
        },
        B: {
          text: "The hypersomnolence occurs at least three times per week, for at least 3 months",
          weight: 0.9
        }
      }
    },
    "Narcolepsy": {
      code: "347.00",
      criteria: {
        A: {
          text: "Recurrent periods of an irrepressible need to sleep, lapsing into sleep, or napping occurring within the same day",
          weight: 1.0
        },
        B: {
          text: "At least one of: cataplexy, hypocretin deficiency, or REM sleep latency of ≤15 minutes",
          weight: 0.9
        }
      }
    }
  }
};

