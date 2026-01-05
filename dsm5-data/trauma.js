// Trauma- and Stressor-Related Disorders - Comprehensive DSM-5 Data

export const TRAUMA_DISORDERS = {
  name: "Trauma- and Stressor-Related Disorders",
  disorders: {
    "Posttraumatic Stress Disorder": {
      code: "309.81",
      criteria: {
        A: {
          text: "Exposure to actual or threatened death, serious injury, or sexual violence",
          weight: 1.0
        },
        B: {
          text: "One or more intrusion symptoms",
          symptoms: [
            { id: "recurrent_memories", text: "Recurrent, involuntary, and intrusive distressing memories", weight: 0.9 },
            { id: "recurrent_dreams", text: "Recurrent distressing dreams", weight: 0.8 },
            { id: "dissociative_reactions", text: "Dissociative reactions (flashbacks)", weight: 0.9 },
            { id: "psychological_distress", text: "Intense psychological distress at exposure to cues", weight: 0.8 },
            { id: "physiological_reactions", text: "Marked physiological reactions to cues", weight: 0.8 }
          ],
          threshold: 1
        },
        C: {
          text: "One or more avoidance symptoms",
          symptoms: [
            { id: "avoid_memories", text: "Avoidance of memories, thoughts, or feelings", weight: 0.9 },
            { id: "avoid_external", text: "Avoidance of external reminders", weight: 0.9 }
          ],
          threshold: 1
        },
        D: {
          text: "Two or more negative alterations in cognitions and mood",
          symptoms: [
            { id: "amnesia", text: "Inability to remember important aspects", weight: 0.7 },
            { id: "negative_beliefs", text: "Persistent negative beliefs about self, others, or world", weight: 0.8 },
            { id: "distorted_blame", text: "Distorted cognitions about cause or consequences", weight: 0.7 },
            { id: "negative_emotional", text: "Persistent negative emotional state", weight: 0.8 },
            { id: "diminished_interest", text: "Markedly diminished interest in activities", weight: 0.7 },
            { id: "detachment", text: "Feelings of detachment or estrangement", weight: 0.7 },
            { id: "inability_positive", text: "Inability to experience positive emotions", weight: 0.8 }
          ],
          threshold: 2
        },
        E: {
          text: "Two or more alterations in arousal and reactivity",
          symptoms: [
            { id: "irritable_behavior", text: "Irritable behavior and angry outbursts", weight: 0.8 },
            { id: "reckless_behavior", text: "Reckless or self-destructive behavior", weight: 0.8 },
            { id: "hypervigilance", text: "Hypervigilance", weight: 0.8 },
            { id: "exaggerated_startle", text: "Exaggerated startle response", weight: 0.7 },
            { id: "concentration_problems", text: "Problems with concentration", weight: 0.7 },
            { id: "sleep_disturbance_ptsd", text: "Sleep disturbance", weight: 0.7 }
          ],
          threshold: 2
        }
      }
    },
    "Acute Stress Disorder": {
      code: "308.3",
      criteria: {
        A: {
          text: "Exposure to actual or threatened death, serious injury, or sexual violation",
          weight: 1.0
        },
        B: {
          text: "Nine or more symptoms from any of the five categories (intrusion, negative mood, dissociation, avoidance, arousal)",
          threshold: 9
        },
        C: {
          text: "Duration is 3 days to 1 month after trauma exposure",
          weight: 1.0
        }
      }
    },
    "Adjustment Disorders": {
      code: "309.xx",
      criteria: {
        A: {
          text: "Development of emotional or behavioral symptoms in response to an identifiable stressor(s) within 3 months",
          weight: 1.0
        },
        B: {
          text: "Symptoms are clinically significant (marked distress or impairment)",
          weight: 1.0
        },
        C: {
          text: "Does not meet criteria for another mental disorder",
          weight: 0.9
        }
      }
    },
    "Reactive Attachment Disorder": {
      code: "313.89",
      criteria: {
        A: {
          text: "Consistent pattern of inhibited, emotionally withdrawn behavior toward adult caregivers",
          weight: 1.0
        },
        B: {
          text: "Social and emotional disturbance (limited positive affect, episodes of unexplained irritability, sadness, or fearfulness)",
          weight: 1.0
        },
        C: {
          text: "Pattern of extremes of insufficient care",
          weight: 1.0
        }
      }
    },
    "Disinhibited Social Engagement Disorder": {
      code: "313.89",
      criteria: {
        A: {
          text: "Pattern of behavior in which child actively approaches and interacts with unfamiliar adults",
          weight: 1.0
        },
        B: {
          text: "Behaviors not limited to impulsivity but include socially disinhibited behavior",
          weight: 0.9
        },
        C: {
          text: "Pattern of extremes of insufficient care",
          weight: 1.0
        }
      }
    },
    "Other Specified Trauma- and Stressor-Related Disorder": {
      code: "309.89",
      criteria: {
        A: {
          text: "Trauma/stressor-related symptoms causing distress but not meeting full criteria",
          weight: 0.8
        }
      }
    },
    "Unspecified Trauma- and Stressor-Related Disorder": {
      code: "309.9",
      criteria: {
        A: {
          text: "Trauma/stressor-related symptoms causing distress but insufficient information for specific diagnosis",
          weight: 0.7
        }
      }
    }
  }
};

