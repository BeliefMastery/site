// Substance-Related and Addictive Disorders - DSM-5 Data
// NOTE: This file contains major disorder categories - can be expanded with specific substances

export const SUBSTANCE_DISORDERS = {
  name: "Substance-Related and Addictive Disorders",
  disorders: {
    "Substance Use Disorder": {
      code: "varies",
      criteria: {
        A: {
          text: "A problematic pattern of substance use leading to clinically significant impairment or distress, manifested by at least 2 of 11 criteria within a 12-month period",
          threshold: 2,
          symptoms: [
            { id: "tolerance", text: "Tolerance (need for increased amounts or diminished effect)", weight: 0.8 },
            { id: "withdrawal", text: "Withdrawal symptoms or substance taken to relieve withdrawal", weight: 0.9 },
            { id: "taken_larger", text: "Substance taken in larger amounts or over longer period than intended", weight: 0.8 },
            { id: "persistent_desire", text: "Persistent desire or unsuccessful efforts to cut down or control use", weight: 0.9 },
            { id: "time_spent", text: "Great deal of time spent obtaining, using, or recovering from substance", weight: 0.8 },
            { id: "important_activities", text: "Important social, occupational, or recreational activities given up or reduced", weight: 0.9 },
            { id: "continued_despite", text: "Continued use despite knowledge of physical or psychological problem caused or exacerbated by substance", weight: 0.9 },
            { id: "craving", text: "Craving or strong desire to use substance", weight: 0.8 }
          ]
        }
      }
    },
    "Gambling Disorder": {
      code: "312.31",
      criteria: {
        A: {
          text: "Persistent and recurrent problematic gambling behavior leading to clinically significant impairment or distress, as indicated by 4 or more of 9 criteria",
          threshold: 4,
          weight: 1.0
        }
      }
    }
  }
};

