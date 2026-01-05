// Personality Disorders - Comprehensive DSM-5 Data (Clusters A, B, C)

export const PERSONALITY_DISORDERS = {
  name: "Personality Disorders",
  disorders: {
    // Cluster B - Dramatic/Erratic
    "Borderline Personality Disorder": {
      code: "301.83",
      criteria: {
        A: {
          text: "A pervasive pattern of instability of interpersonal relationships, self-image, and affects, and marked impulsivity",
          threshold: 5,
          symptoms: [
            { id: "frantic_abandonment", text: "Frantic efforts to avoid real or imagined abandonment", weight: 0.9 },
            { id: "unstable_relationships", text: "Unstable and intense interpersonal relationships", weight: 0.9 },
            { id: "identity_disturbance", text: "Identity disturbance", weight: 0.9 },
            { id: "impulsivity", text: "Impulsivity in potentially self-damaging areas", weight: 0.8 },
            { id: "suicidal_behavior", text: "Recurrent suicidal behavior, gestures, or threats", weight: 1.0 },
            { id: "affective_instability", text: "Affective instability due to marked reactivity of mood", weight: 0.9 },
            { id: "chronic_emptiness", text: "Chronic feelings of emptiness", weight: 0.8 },
            { id: "inappropriate_anger", text: "Inappropriate, intense anger or difficulty controlling anger", weight: 0.8 },
            { id: "transient_paranoid", text: "Transient, stress-related paranoid ideation or severe dissociative symptoms", weight: 0.7 }
          ]
        }
      }
    },
    "Narcissistic Personality Disorder": {
      code: "301.81",
      criteria: {
        A: {
          text: "A pervasive pattern of grandiosity, need for admiration, and lack of empathy",
          threshold: 5,
          symptoms: [
            { id: "grandiose_sense", text: "Grandiose sense of self-importance", weight: 0.9 },
            { id: "fantasies_success", text: "Preoccupation with fantasies of success, power, brilliance", weight: 0.8 },
            { id: "special_unique", text: "Belief that one is special and unique", weight: 0.8 },
            { id: "requires_admiration", text: "Requires excessive admiration", weight: 0.9 },
            { id: "sense_entitlement", text: "Sense of entitlement", weight: 0.9 },
            { id: "exploitative", text: "Interpersonally exploitative", weight: 0.8 },
            { id: "lacks_empathy", text: "Lacks empathy", weight: 0.9 },
            { id: "envious", text: "Often envious of others or believes others are envious", weight: 0.7 },
            { id: "arrogant", text: "Shows arrogant, haughty behaviors or attitudes", weight: 0.8 }
          ]
        }
      }
    },
    "Antisocial Personality Disorder": {
      code: "301.7",
      criteria: {
        A: {
          text: "A pervasive pattern of disregard for and violation of the rights of others, occurring since age 15",
          threshold: 3,
          symptoms: [
            { id: "failure_conform", text: "Failure to conform to social norms with respect to lawful behaviors", weight: 0.9 },
            { id: "deceitfulness", text: "Deceitfulness, repeated lying, conning others", weight: 0.9 },
            { id: "impulsivity_aspd", text: "Impulsivity or failure to plan ahead", weight: 0.7 },
            { id: "irritability_aggression", text: "Irritability and aggressiveness, physical fights or assaults", weight: 0.9 },
            { id: "reckless_disregard", text: "Reckless disregard for safety of self or others", weight: 0.9 },
            { id: "irresponsible", text: "Consistent irresponsibility, failure to sustain work or honor financial obligations", weight: 0.8 },
            { id: "lack_remorse", text: "Lack of remorse, indifference to or rationalizing having hurt, mistreated, or stolen from another", weight: 0.9 }
          ]
        },
        B: {
          text: "Individual is at least age 18",
          weight: 1.0
        },
        C: {
          text: "Evidence of Conduct Disorder with onset before age 15",
          weight: 0.9
        }
      }
    },
    "Histrionic Personality Disorder": {
      code: "301.50",
      criteria: {
        A: {
          text: "A pervasive pattern of excessive emotionality and attention seeking",
          threshold: 5,
          symptoms: [
            { id: "uncomfortable_center", text: "Uncomfortable in situations in which he or she is not the center of attention", weight: 0.9 },
            { id: "inappropriate_seductive", text: "Interaction with others is often characterized by inappropriate sexually seductive or provocative behavior", weight: 0.8 },
            { id: "rapidly_shifting", text: "Displays rapidly shifting and shallow expression of emotions", weight: 0.8 },
            { id: "uses_physical", text: "Consistently uses physical appearance to draw attention to self", weight: 0.7 },
            { id: "speech_impressionistic", text: "Has a style of speech that is excessively impressionistic and lacking in detail", weight: 0.7 },
            { id: "self_dramatization", text: "Shows self-dramatization, theatricality, and exaggerated expression of emotion", weight: 0.8 },
            { id: "suggestible", text: "Is suggestible (easily influenced by others or circumstances)", weight: 0.7 },
            { id: "considers_relationships", text: "Considers relationships to be more intimate than they actually are", weight: 0.8 }
          ]
        }
      }
    },
    
    // Cluster A - Odd/Eccentric
    "Paranoid Personality Disorder": {
      code: "301.0",
      criteria: {
        A: {
          text: "A pervasive distrust and suspiciousness of others",
          threshold: 4,
          symptoms: [
            { id: "suspects_exploitation", text: "Suspects, without sufficient basis, that others are exploiting, harming, or deceiving him or her", weight: 0.9 },
            { id: "preoccupied_doubts", text: "Is preoccupied with unjustified doubts about the loyalty or trustworthiness of friends or associates", weight: 0.9 },
            { id: "reluctant_confide", text: "Is reluctant to confide in others because of unwarranted fear that the information will be used maliciously against him or her", weight: 0.8 },
            { id: "reads_hidden", text: "Reads hidden demeaning or threatening meanings into benign remarks or events", weight: 0.8 },
            { id: "persistently_bears", text: "Persistently bears grudges (is unforgiving of insults, injuries, or slights)", weight: 0.8 },
            { id: "perceives_attacks", text: "Perceives attacks on his or her character or reputation that are not apparent to others and is quick to react angrily or to counterattack", weight: 0.9 },
            { id: "recurrent_suspicious", text: "Has recurrent suspicions, without justification, regarding fidelity of spouse or sexual partner", weight: 0.8 }
          ]
        }
      }
    },
    "Schizoid Personality Disorder": {
      code: "301.20",
      criteria: {
        A: {
          text: "A pervasive pattern of detachment from social relationships and a restricted range of expression of emotions",
          threshold: 4,
          symptoms: [
            { id: "neither_desires", text: "Neither desires nor enjoys close relationships, including being part of a family", weight: 0.9 },
            { id: "almost_always", text: "Almost always chooses solitary activities", weight: 0.8 },
            { id: "little_interest", text: "Has little, if any, interest in having sexual experiences with another person", weight: 0.7 },
            { id: "takes_pleasure", text: "Takes pleasure in few, if any, activities", weight: 0.8 },
            { id: "lacks_close", text: "Lacks close friends or confidants other than first-degree relatives", weight: 0.9 },
            { id: "appears_indifferent", text: "Appears indifferent to the praise or criticism of others", weight: 0.8 },
            { id: "shows_emotional", text: "Shows emotional coldness, detachment, or flattened affectivity", weight: 0.8 }
          ]
        }
      }
    },
    "Schizotypal Personality Disorder": {
      code: "301.22",
      criteria: {
        A: {
          text: "A pervasive pattern of social and interpersonal deficits marked by acute discomfort with, and reduced capacity for, close relationships as well as by cognitive or perceptual distortions and eccentricities of behavior",
          threshold: 5,
          symptoms: [
            { id: "ideas_reference", text: "Ideas of reference (excluding delusions of reference)", weight: 0.8 },
            { id: "odd_beliefs", text: "Odd beliefs or magical thinking that influences behavior and is inconsistent with subcultural norms", weight: 0.8 },
            { id: "unusual_perceptual", text: "Unusual perceptual experiences, including bodily illusions", weight: 0.8 },
            { id: "odd_thinking", text: "Odd thinking and speech (vague, circumstantial, metaphorical, overelaborate, or stereotyped)", weight: 0.8 },
            { id: "suspiciousness_paranoid", text: "Suspiciousness or paranoid ideation", weight: 0.8 },
            { id: "inappropriate_affect", text: "Inappropriate or constricted affect", weight: 0.7 },
            { id: "behavior_appearance", text: "Behavior or appearance that is odd, eccentric, or peculiar", weight: 0.8 },
            { id: "lack_close", text: "Lack of close friends or confidants other than first-degree relatives", weight: 0.8 },
            { id: "excessive_social", text: "Excessive social anxiety that does not diminish with familiarity and tends to be associated with paranoid fears rather than negative judgments about self", weight: 0.8 }
          ]
        }
      }
    },
    
    // Cluster C - Anxious/Fearful
    "Avoidant Personality Disorder": {
      code: "301.82",
      criteria: {
        A: {
          text: "A pervasive pattern of social inhibition, feelings of inadequacy, and hypersensitivity to negative evaluation",
          threshold: 4,
          symptoms: [
            { id: "avoids_occupational", text: "Avoids occupational activities that involve significant interpersonal contact because of fears of criticism, disapproval, or rejection", weight: 0.9 },
            { id: "unwilling_get", text: "Is unwilling to get involved with people unless certain of being liked", weight: 0.9 },
            { id: "shows_restraint", text: "Shows restraint within intimate relationships because of the fear of being shamed or ridiculed", weight: 0.8 },
            { id: "preoccupied_criticized", text: "Is preoccupied with being criticized or rejected in social situations", weight: 0.9 },
            { id: "inhibited_new", text: "Is inhibited in new interpersonal situations because of feelings of inadequacy", weight: 0.8 },
            { id: "views_self", text: "Views self as socially inept, personally unappealing, or inferior to others", weight: 0.9 },
            { id: "unusually_reluctant", text: "Is unusually reluctant to take personal risks or to engage in any new activities because they may prove embarrassing", weight: 0.8 }
          ]
        }
      }
    },
    "Dependent Personality Disorder": {
      code: "301.6",
      criteria: {
        A: {
          text: "A pervasive and excessive need to be taken care of that leads to submissive and clinging behavior and fears of separation",
          threshold: 5,
          symptoms: [
            { id: "difficulty_making", text: "Has difficulty making everyday decisions without an excessive amount of advice and reassurance from others", weight: 0.9 },
            { id: "needs_others", text: "Needs others to assume responsibility for most major areas of his or her life", weight: 0.9 },
            { id: "difficulty_expressing", text: "Has difficulty expressing disagreement with others because of fear of loss of support or approval", weight: 0.8 },
            { id: "difficulty_initiating", text: "Has difficulty initiating projects or doing things on his or her own (because of a lack of self-confidence in judgment or abilities rather than a lack of motivation or energy)", weight: 0.8 },
            { id: "goes_excessive", text: "Goes to excessive lengths to obtain nurturance and support from others, to the point of volunteering to do things that are unpleasant", weight: 0.8 },
            { id: "feels_uncomfortable", text: "Feels uncomfortable or helpless when alone because of exaggerated fears of being unable to care for himself or herself", weight: 0.9 },
            { id: "urgently_seeks", text: "Urgently seeks another relationship as a source of care and support when a close relationship ends", weight: 0.8 },
            { id: "unrealistically_preoccupied", text: "Is unrealistically preoccupied with fears of being left to take care of himself or herself", weight: 0.9 }
          ]
        }
      }
    },
    "Obsessive-Compulsive Personality Disorder": {
      code: "301.4",
      criteria: {
        A: {
          text: "A pervasive pattern of preoccupation with orderliness, perfectionism, and mental and interpersonal control",
          threshold: 4,
          symptoms: [
            { id: "preoccupied_details", text: "Is preoccupied with details, rules, lists, order, organization, or schedules to the extent that the major point of the activity is lost", weight: 0.8 },
            { id: "shows_perfectionism", text: "Shows perfectionism that interferes with task completion", weight: 0.9 },
            { id: "excessively_devoted", text: "Is excessively devoted to work and productivity to the exclusion of leisure activities and friendships (not accounted for by obvious economic necessity)", weight: 0.8 },
            { id: "overconscientious_scrupulous", text: "Is overconscientious, scrupulous, and inflexible about matters of morality, ethics, or values (not accounted for by cultural or religious identification)", weight: 0.8 },
            { id: "unable_discard", text: "Is unable to discard worn-out or worthless objects even when they have no sentimental value", weight: 0.7 },
            { id: "reluctant_delegate", text: "Is reluctant to delegate tasks or to work with others unless they submit to exactly his or her way of doing things", weight: 0.8 },
            { id: "adopts_miserly", text: "Adopts a miserly spending style toward both self and others; money is viewed as something to be hoarded for future catastrophes", weight: 0.7 },
            { id: "shows_rigidity", text: "Shows rigidity and stubbornness", weight: 0.8 }
          ]
        }
      }
    },
    
    "Other Specified Personality Disorder": {
      code: "301.89",
      criteria: {
        A: {
          text: "Personality disorder traits causing distress but not meeting full criteria",
          weight: 0.8
        }
      }
    },
    "Unspecified Personality Disorder": {
      code: "301.9",
      criteria: {
        A: {
          text: "Personality disorder traits causing distress but insufficient information for specific diagnosis",
          weight: 0.7
        }
      }
    }
  }
};

