// Comorbidity and Multi-Branching Detection System
// Maps disorders that commonly co-occur and require differential diagnosis

export const COMORBIDITY_GROUPS = {
  // Mood and Anxiety frequently co-occur
  mood_anxiety: {
    name: "Mood-Anxiety Comorbidity",
    disorders: ["Major Depressive Disorder", "Generalized Anxiety Disorder", "Panic Disorder", "Social Anxiety Disorder", "Persistent Depressive Disorder"],
    triggers: {
      threshold: 0.50, // If 50%+ probability for any disorder in this group
      message: "Mood and anxiety disorders frequently co-occur. Additional refinement questions will help differentiate primary vs. secondary symptoms."
    }
  },
  
  // Trauma often presents with mood/anxiety
  trauma_mood_anxiety: {
    name: "Trauma-Mood-Anxiety Comorbidity",
    disorders: ["Posttraumatic Stress Disorder", "Major Depressive Disorder", "Generalized Anxiety Disorder", "Panic Disorder"],
    triggers: {
      threshold: 0.50,
      message: "Trauma-related disorders often co-occur with mood and anxiety symptoms. Refined assessment can help identify primary trauma responses vs. secondary mood/anxiety."
    }
  },
  
  // Personality disorders with mood/anxiety
  personality_mood: {
    name: "Personality-Mood Comorbidity",
    disorders: ["Borderline Personality Disorder", "Major Depressive Disorder", "Bipolar I Disorder", "Bipolar II Disorder", "Persistent Depressive Disorder"],
    triggers: {
      threshold: 0.55,
      message: "Personality disorders and mood disorders often co-occur, particularly Borderline Personality with depression/bipolar. Additional assessment needed for differential diagnosis."
    }
  },
  
  // Substance use with mood/anxiety/personality
  substance_comorbidity: {
    name: "Substance-Mental Health Comorbidity",
    disorders: ["Substance Use Disorder", "Major Depressive Disorder", "Generalized Anxiety Disorder", "Bipolar I Disorder", "Borderline Personality Disorder"],
    triggers: {
      threshold: 0.50,
      message: "Substance use disorders frequently co-occur with mood, anxiety, and personality disorders. Determining primary vs. substance-induced symptoms requires careful assessment."
    }
  },
  
  // OCD with anxiety/depression
  ocd_comorbidity: {
    name: "OCD Comorbidity",
    disorders: ["Obsessive-Compulsive Disorder", "Major Depressive Disorder", "Generalized Anxiety Disorder", "Body Dysmorphic Disorder"],
    triggers: {
      threshold: 0.50,
      message: "OCD and related disorders often co-occur with depression and anxiety. Refinement questions will help distinguish OCD-specific symptoms from generalized anxiety."
    }
  },
  
  // Eating disorders with mood/anxiety/personality
  eating_comorbidity: {
    name: "Eating Disorder Comorbidity",
    disorders: ["Anorexia Nervosa", "Bulimia Nervosa", "Binge-Eating Disorder", "Major Depressive Disorder", "Generalized Anxiety Disorder", "Borderline Personality Disorder"],
    triggers: {
      threshold: 0.50,
      message: "Eating disorders frequently co-occur with mood, anxiety, and personality disorders. Additional assessment needed to identify primary eating disorder vs. secondary symptoms."
    }
  },
  
  // Bipolar spectrum differentiation
  bipolar_spectrum: {
    name: "Bipolar Spectrum Differentiation",
    disorders: ["Bipolar I Disorder", "Bipolar II Disorder", "Cyclothymic Disorder", "Major Depressive Disorder"],
    triggers: {
      threshold: 0.45,
      message: "Multiple bipolar spectrum or mood disorders detected. Refined questions about hypomanic/manic episodes needed for accurate differentiation."
    }
  },
  
  // Personality cluster comorbidity
  personality_clusters: {
    name: "Personality Disorder Cluster Comorbidity",
    disorders: ["Borderline Personality Disorder", "Narcissistic Personality Disorder", "Antisocial Personality Disorder", "Histrionic Personality Disorder", "Avoidant Personality Disorder", "Dependent Personality Disorder"],
    triggers: {
      threshold: 0.50,
      message: "Multiple personality disorder indicators detected. Refined assessment needed as personality disorders can share overlapping symptoms but require distinct diagnostic criteria."
    }
  }
};

// Refined inquiry question sets for comorbidity scenarios
export const COMORBIDITY_REFINEMENT_QUESTIONS = {
  mood_anxiety: [
    "Which came first - the depressed mood or the excessive worry/anxiety?",
    "When you feel anxious, does it typically precede or follow depressive episodes?",
    "Do your anxiety symptoms persist even when your mood is stable?",
    "Are your worries primarily about future events (anxiety) or past/current situations (depression)?",
    "When you experience physical symptoms (racing heart, tension), do they occur with worry (anxiety) or regardless of mood state (depression)?"
  ],
  
  trauma_mood_anxiety: [
    "Did your mood/anxiety symptoms begin before or after the traumatic event?",
    "Are your depressive symptoms specifically related to trauma memories, or do they occur independently?",
    "When you feel anxious, are you specifically worried about trauma recurrence, or is it generalized worry?",
    "Do your symptoms improve or worsen when trauma reminders are present?",
    "Are your mood symptoms part of trauma-related emotional numbing, or separate depressive episodes?"
  ],
  
  personality_mood: [
    "Have your mood symptoms been present since adolescence/early adulthood (personality) or developed later (mood disorder)?",
    "Do your relationships show patterns of instability regardless of mood state (personality) or only during mood episodes?",
    "Do you experience rapid mood shifts within hours/days (personality) or sustained mood episodes lasting weeks (mood disorder)?",
    "Are your depressive symptoms triggered by relationship events (personality) or occur independently (mood disorder)?",
    "Do you have a consistent sense of self, or does your identity feel unstable regardless of mood?"
  ],
  
  substance_comorbidity: [
    "Did your mood/anxiety symptoms begin before or after substance use increased?",
    "Do your symptoms persist during periods of sobriety, or only during/after substance use?",
    "Have you attempted to self-medicate mood/anxiety symptoms with substances?",
    "Do your depressive symptoms improve or worsen with substance use?",
    "Are your symptoms consistent with substance withdrawal effects, or do they occur independently?"
  ],
  
  bipolar_spectrum: [
    "Have you experienced periods where you felt unusually energized, confident, or needed less sleep?",
    "During elevated mood periods, did you engage in risky behaviors or make impulsive decisions?",
    "Do you experience rapid cycling between high and low moods, or sustained episodes?",
    "Have others commented on your behavior being unusual during your 'high' periods?",
    "Do your elevated mood periods last days/weeks, or just hours?",
    "During elevated moods, do you feel more irritable than euphoric, or vice versa?",
    "Have your elevated moods caused problems in relationships, work, or legal issues?"
  ],
  
  ocd_comorbidity: [
    "Are your worries repetitive, intrusive thoughts that feel foreign (OCD) or realistic concerns (anxiety)?",
    "Do you perform rituals or mental acts to reduce anxiety from your thoughts?",
    "Are your anxiety symptoms triggered by specific obsessions, or are they generalized?",
    "Do your repetitive thoughts cause distress because they're unwanted (OCD) or because they're realistic (anxiety)?",
    "Have you tried to suppress or neutralize your repetitive thoughts?"
  ],
  
  eating_comorbidity: [
    "Did your mood/anxiety symptoms begin before or after eating disorder behaviors?",
    "Do your depressive symptoms improve or worsen with eating disorder behaviors?",
    "Are your body image concerns specifically about weight/shape (eating disorder) or general appearance (BDD)?",
    "Do you restrict/binge as a way to manage emotions, or is it independent of mood?",
    "Have you experienced significant weight changes that correlate with mood symptoms?"
  ],
  
  personality_clusters: [
    "How long have you noticed these personality traits - since adolescence or developed recently?",
    "Do these patterns occur across all relationships and situations, or only in specific contexts?",
    "When you're not in a crisis, do these patterns still affect your functioning?",
    "Have others consistently described you in similar ways throughout your life?",
    "Do you recognize these patterns as problematic, or do they feel normal to you?"
  ]
};

// Multi-branching detection thresholds
export const MULTI_BRANCHING_THRESHOLDS = {
  moderate_comorbidity: 0.40, // 40%+ probability triggers moderate comorbidity flag
  high_comorbidity: 0.60, // 60%+ probability triggers high comorbidity flag
  require_refinement: 0.45, // 45%+ probability requires refined questions
  differential_diagnosis: 0.35 // 35%+ probability in multiple disorders requires differential
};

