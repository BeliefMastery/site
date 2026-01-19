// Depressive and Bipolar Disorders - Comprehensive DSM-5 Data

export const MOOD_DISORDERS = {
  name: "Depressive and Bipolar Disorders",
  disorders: {
    "Major Depressive Disorder": {
      code: "296.33",
      criteria: {
        A: {
          text: "Five or more of the following symptoms during the same 2-week period",
          symptoms: [
            { id: "depressed_mood", text: "Depressed mood most of the day, nearly every day", weight: 1.0 },
            { id: "anhedonia", text: "Markedly diminished interest or pleasure in all, or almost all, activities", weight: 1.0 },
            { id: "weight_change", text: "Significant weight loss or gain, or decrease/increase in appetite", weight: 0.8 },
            { id: "sleep_disturbance", text: "Insomnia or hypersomnia nearly every day", weight: 0.8 },
            { id: "psychomotor", text: "Psychomotor agitation or retardation", weight: 0.7 },
            { id: "fatigue", text: "Fatigue or loss of energy nearly every day", weight: 0.9 },
            { id: "worthlessness", text: "Feelings of worthlessness or excessive guilt", weight: 0.8 },
            { id: "concentration", text: "Diminished ability to think or concentrate, or indecisiveness", weight: 0.7 },
            { id: "suicidal", text: "Recurrent thoughts of death, suicidal ideation, or suicide attempt", weight: 1.0 }
          ],
          threshold: 5
        },
        B: {
          text: "Symptoms cause clinically significant distress or impairment",
          weight: 1.0
        },
        C: {
          text: "Not attributable to substance or medical condition",
          weight: 0.9
        }
      },
      specifiers: ["mild", "moderate", "severe", "with psychotic features", "in partial remission", "in full remission"]
    },
    "Persistent Depressive Disorder (Dysthymia)": {
      code: "300.4",
      criteria: {
        A: {
          text: "Depressed mood for most of the day, for more days than not, for at least 2 years",
          weight: 1.0
        },
        B: {
          text: "Two or more of the following while depressed",
          symptoms: [
            { id: "poor_appetite", text: "Poor appetite or overeating", weight: 0.7 },
            { id: "insomnia_hypersomnia", text: "Insomnia or hypersomnia", weight: 0.7 },
            { id: "low_energy", text: "Low energy or fatigue", weight: 0.8 },
            { id: "low_self_esteem", text: "Low self-esteem", weight: 0.8 },
            { id: "poor_concentration", text: "Poor concentration or difficulty making decisions", weight: 0.7 },
            { id: "hopelessness", text: "Feelings of hopelessness", weight: 0.9 }
          ],
          threshold: 2
        },
        C: {
          text: "Never without symptoms for more than 2 months at a time",
          weight: 0.9
        }
      }
    },
    "Bipolar I Disorder": {
      code: "296.xx",
      criteria: {
        A: {
          text: "At least one manic episode",
          symptoms: [
            { id: "elevated_mood", text: "Abnormally and persistently elevated, expansive, or irritable mood", weight: 1.0 },
            { id: "increased_activity", text: "Abnormally and persistently increased goal-directed activity or energy", weight: 1.0 },
            { id: "grandiosity", text: "Inflated self-esteem or grandiosity", weight: 0.8 },
            { id: "decreased_sleep", text: "Decreased need for sleep", weight: 0.7 },
            { id: "pressured_speech", text: "More talkative than usual or pressure to keep talking", weight: 0.8 },
            { id: "flight_ideas", text: "Flight of ideas or racing thoughts", weight: 0.8 },
            { id: "distractibility", text: "Distractibility", weight: 0.7 },
            { id: "risky_behavior", text: "Excessive involvement in activities with high potential for painful consequences", weight: 0.9 }
          ],
          threshold: 3
        }
      }
    },
    "Bipolar II Disorder": {
      code: "296.89",
      criteria: {
        A: {
          text: "At least one hypomanic episode and one major depressive episode",
          weight: 1.0
        },
        B: {
          text: "Never had a manic episode",
          weight: 1.0
        }
      }
    },
    "Cyclothymic Disorder": {
      code: "301.13",
      criteria: {
        A: {
          text: "For at least 2 years, numerous periods with hypomanic symptoms and periods with depressive symptoms",
          weight: 1.0
        },
        B: {
          text: "Never without symptoms for more than 2 months",
          weight: 0.9
        }
      }
    },
    "Disruptive Mood Dysregulation Disorder": {
      code: "296.99",
      criteria: {
        A: {
          text: "Severe recurrent temper outbursts inconsistent with developmental level",
          weight: 1.0
        },
        B: {
          text: "Temper outbursts occurring three or more times per week",
          weight: 0.9
        },
        C: {
          text: "Mood between outbursts is persistently irritable or angry",
          weight: 0.9
        }
      }
    },
    "Premenstrual Dysphoric Disorder": {
      code: "625.4",
      criteria: {
        A: {
          text: "Five or more symptoms present in the final week before menses",
          symptoms: [
            { id: "affective_lability", text: "Marked affective lability", weight: 0.9 },
            { id: "irritability_anger", text: "Marked irritability or anger", weight: 0.9 },
            { id: "depressed_mood_pmdd", text: "Markedly depressed mood", weight: 1.0 },
            { id: "anxiety_pmdd", text: "Marked anxiety or tension", weight: 0.8 },
            { id: "decreased_interest_pmdd", text: "Decreased interest in usual activities", weight: 0.8 },
            { id: "difficulty_concentration_pmdd", text: "Difficulty concentrating", weight: 0.7 },
            { id: "lethargy_pmdd", text: "Lethargy, easily fatigued, or lack of energy", weight: 0.8 },
            { id: "change_appetite_pmdd", text: "Marked change in appetite", weight: 0.7 },
            { id: "hypersomnia_insomnia_pmdd", text: "Hypersomnia or insomnia", weight: 0.7 },
            { id: "overwhelmed_pmdd", text: "Feeling overwhelmed or out of control", weight: 0.8 },
            { id: "physical_symptoms_pmdd", text: "Physical symptoms (breast tenderness, bloating)", weight: 0.6 }
          ],
          threshold: 5
        },
        B: {
          text: "Symptoms improve within a few days after menses onset",
          weight: 1.0
        }
      }
    },
    "Substance/Medication-Induced Depressive Disorder": {
      code: "293.83",
      criteria: {
        A: {
          text: "Prominent and persistent disturbance in mood with depressed mood or loss of interest",
          weight: 1.0
        },
        B: {
          text: "Evidence that symptoms developed during or soon after substance intoxication/withdrawal or medication exposure",
          weight: 1.0
        }
      }
    },
    "Depressive Disorder Due to Another Medical Condition": {
      code: "293.83",
      criteria: {
        A: {
          text: "Prominent and persistent period of depressed mood or loss of interest",
          weight: 1.0
        },
        B: {
          text: "Evidence that disturbance is direct pathophysiological consequence of another medical condition",
          weight: 1.0
        }
      }
    },
    "Low-Intensity Depressive Pattern": {
      code: "311",
      criteria: {
        A: {
          text: "Subthreshold depressive symptoms causing distress without meeting full criteria",
          weight: 0.8
        }
      }
    },
    "Unspecified Depressive Disorder": {
      code: "311",
      criteria: {
        A: {
          text: "Depressive symptoms causing distress but insufficient information for specific diagnosis",
          weight: 0.7
        }
      }
    }
  }
};

