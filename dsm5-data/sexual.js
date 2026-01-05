// Sexual Dysfunctions - DSM-5 Data
// NOTE: This file contains major disorders - can be expanded further

export const SEXUAL_DISORDERS = {
  name: "Sexual Dysfunctions",
  disorders: {
    "Delayed Ejaculation": {
      code: "302.74",
      criteria: {
        A: {
          text: "Either a marked delay in ejaculation or a marked infrequency or absence of ejaculation, on almost all or all occasions of partnered sexual activity",
          weight: 1.0
        },
        B: {
          text: "The symptoms have persisted for a minimum duration of approximately 6 months",
          weight: 0.9
        }
      }
    },
    "Erectile Disorder": {
      code: "302.72",
      criteria: {
        A: {
          text: "At least one of three symptoms: marked difficulty obtaining an erection, marked difficulty maintaining an erection, marked decrease in erectile rigidity",
          weight: 1.0
        },
        B: {
          text: "The symptoms have persisted for a minimum duration of approximately 6 months",
          weight: 0.9
        }
      }
    },
    "Female Orgasmic Disorder": {
      code: "302.73",
      criteria: {
        A: {
          text: "Presence of either a marked delay in, marked infrequency of, or absence of orgasm; or a markedly reduced intensity of orgasmic sensations",
          weight: 1.0
        },
        B: {
          text: "The symptoms have persisted for a minimum duration of approximately 6 months",
          weight: 0.9
        }
      }
    },
    "Female Sexual Interest/Arousal Disorder": {
      code: "302.72",
      criteria: {
        A: {
          text: "Lack of, or significantly reduced, sexual interest/arousal, as manifested by at least 3 of 6 symptoms",
          threshold: 3,
          weight: 1.0
        },
        B: {
          text: "The symptoms have persisted for a minimum duration of approximately 6 months",
          weight: 0.9
        }
      }
    },
    "Male Hypoactive Sexual Desire Disorder": {
      code: "302.71",
      criteria: {
        A: {
          text: "Persistently or recurrently deficient (or absent) sexual/erotic thoughts, fantasies, and desire for sexual activity",
          weight: 1.0
        },
        B: {
          text: "The symptoms have persisted for a minimum duration of approximately 6 months",
          weight: 0.9
        }
      }
    },
    "Premature (Early) Ejaculation": {
      code: "302.75",
      criteria: {
        A: {
          text: "A persistent or recurrent pattern of ejaculation occurring during partnered sexual activity within approximately 1 minute following vaginal penetration and before the individual wishes it",
          weight: 1.0
        },
        B: {
          text: "The symptom must have been present for at least 6 months and must be experienced on almost all or all occasions of sexual activity",
          weight: 0.9
        }
      }
    }
  }
};

