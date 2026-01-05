// Category Selection Guide - Helps users select appropriate diagnostic categories
// Questions to guide users who don't know which category to choose

export const CATEGORY_GUIDE_QUESTIONS = [
  {
    id: "mood_main",
    question: "Have you experienced significant changes in mood (depression, mania, or mood swings)?",
    categories: ["mood"],
    weight: 1.0
  },
  {
    id: "anxiety_main",
    question: "Do you experience excessive worry, anxiety, or panic attacks?",
    categories: ["anxiety"],
    weight: 1.0
  },
  {
    id: "trauma_main",
    question: "Have you experienced a traumatic event that continues to affect you?",
    categories: ["trauma"],
    weight: 1.0
  },
  {
    id: "personality_main",
    question: "Have you noticed patterns in your relationships, identity, or emotions that have been present since adolescence?",
    categories: ["personality"],
    weight: 0.9
  },
  {
    id: "ocd_main",
    question: "Do you experience repetitive, intrusive thoughts or feel compelled to perform certain behaviors?",
    categories: ["ocd"],
    weight: 1.0
  },
  {
    id: "eating_main",
    question: "Do you have concerns about eating, body image, or weight that significantly affect your life?",
    categories: ["eating"],
    weight: 1.0
  },
  {
    id: "substance_main",
    question: "Do you use substances (alcohol, drugs) and have concerns about your usage?",
    categories: ["substance"],
    weight: 1.0
  },
  {
    id: "sleep_main",
    question: "Do you have significant problems with sleep (insomnia, excessive sleep, or sleep disturbances)?",
    categories: ["sleep"],
    weight: 0.8
  },
  {
    id: "dissociative_main",
    question: "Do you experience feelings of detachment, memory gaps, or losing track of time?",
    categories: ["dissociative"],
    weight: 1.0
  },
  {
    id: "somatic_main",
    question: "Do you have physical symptoms (pain, fatigue, etc.) that don't have a clear medical explanation?",
    categories: ["somatic"],
    weight: 0.9
  },
  {
    id: "sexual_main",
    question: "Do you experience problems with sexual function or interest that cause distress?",
    categories: ["sexual"],
    weight: 0.8
  },
  {
    id: "psychotic_main",
    question: "Have you experienced hallucinations, delusions, or significant breaks from reality?",
    categories: ["schizophrenia"],
    weight: 1.0,
    warning: "If yes, please seek immediate professional help."
  }
];

// Category descriptions for the guide
export const CATEGORY_DESCRIPTIONS = {
  mood: {
    name: "Depressive and Bipolar Disorders",
    description: "Includes depression, bipolar disorder, persistent depressive disorder, and related mood conditions.",
    examples: ["Persistent sadness", "Mood swings", "Loss of interest", "Changes in energy"]
  },
  anxiety: {
    name: "Anxiety Disorders",
    description: "Includes generalized anxiety, panic disorder, social anxiety, phobias, and agoraphobia.",
    examples: ["Excessive worry", "Panic attacks", "Social fears", "Avoidance behaviors"]
  },
  trauma: {
    name: "Trauma- and Stressor-Related Disorders",
    description: "Includes PTSD, acute stress disorder, and adjustment disorders related to traumatic experiences.",
    examples: ["Trauma memories", "Flashbacks", "Avoidance", "Hypervigilance"]
  },
  personality: {
    name: "Personality Disorders",
    description: "Long-standing patterns of thinking, feeling, and behaving that cause distress or problems.",
    examples: ["Relationship patterns", "Identity concerns", "Emotional regulation", "Interpersonal difficulties"]
  },
  ocd: {
    name: "Obsessive-Compulsive and Related Disorders",
    description: "Includes OCD, body dysmorphic disorder, hoarding, trichotillomania, and related conditions.",
    examples: ["Repetitive thoughts", "Compulsive behaviors", "Body image concerns", "Hoarding"]
  },
  eating: {
    name: "Feeding and Eating Disorders",
    description: "Includes anorexia, bulimia, binge-eating disorder, and related eating concerns.",
    examples: ["Eating patterns", "Body image", "Weight concerns", "Food restriction"]
  },
  substance: {
    name: "Substance-Related and Addictive Disorders",
    description: "Problems related to alcohol, drugs, or other substances, including gambling disorder.",
    examples: ["Substance use", "Addiction patterns", "Withdrawal", "Gambling"]
  },
  sleep: {
    name: "Sleep-Wake Disorders",
    description: "Includes insomnia, hypersomnolence, narcolepsy, and other sleep-related problems.",
    examples: ["Sleep problems", "Excessive sleepiness", "Sleep schedule", "Sleep quality"]
  },
  dissociative: {
    name: "Dissociative Disorders",
    description: "Includes dissociative identity disorder, dissociative amnesia, and depersonalization/derealization.",
    examples: ["Memory gaps", "Detachment", "Identity confusion", "Time loss"]
  },
  somatic: {
    name: "Somatic Symptom and Related Disorders",
    description: "Physical symptoms that cause significant distress, often without clear medical explanation.",
    examples: ["Physical symptoms", "Health anxiety", "Conversion symptoms", "Pain concerns"]
  },
  sexual: {
    name: "Sexual Dysfunctions",
    description: "Problems with sexual interest, arousal, orgasm, or sexual pain that cause distress.",
    examples: ["Sexual interest", "Arousal problems", "Orgasm difficulties", "Sexual pain"]
  },
  schizophrenia: {
    name: "Schizophrenia Spectrum and Other Psychotic Disorders",
    description: "Includes schizophrenia, schizoaffective disorder, and other psychotic conditions.",
    examples: ["Hallucinations", "Delusions", "Disorganized thinking", "Reality testing"]
  },
  neurocognitive: {
    name: "Neurocognitive Disorders",
    description: "Decline in cognitive function, including memory, attention, and thinking abilities.",
    examples: ["Memory problems", "Cognitive decline", "Attention difficulties", "Thinking problems"]
  },
  neurodevelopmental: {
    name: "Neurodevelopmental Disorders",
    description: "Conditions that begin in childhood, including autism spectrum disorder and ADHD.",
    examples: ["Autism spectrum", "ADHD", "Learning disorders", "Developmental concerns"]
  }
};

