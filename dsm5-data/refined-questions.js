// Refined/Detailed Questions for Diagnosis Refinement
// Additional granular questions to differentiate between similar disorders and refine diagnoses

export const REFINED_QUESTIONS = {
  "Major Depressive Disorder": {
    severity_refinement: [
      "On a scale of 0-10, how would you rate the intensity of your depressed mood?",
      "How many days in the past week have you experienced significant depressed mood?",
      "Do your depressive symptoms follow a daily pattern (worse in morning vs. evening)?",
      "Have you noticed seasonal patterns in your mood (worse in winter/summer)?"
    ],
    functional_impact: [
      "To what extent do your symptoms interfere with your ability to work or study?",
      "How much have your relationships been affected by your mood symptoms?",
      "Are you able to maintain basic self-care (hygiene, eating, sleeping) during episodes?",
      "Have you had to take time off work or school due to your symptoms?"
    ],
    symptom_clarification: [
      "When you experience anhedonia (loss of interest), is it complete inability to feel pleasure, or reduced capacity?",
      "Are your concentration problems due to intrusive thoughts, mental fog, or distractibility?",
      "Do your sleep problems involve difficulty falling asleep, staying asleep, or early morning awakening?",
      "Have you experienced changes in appetite leading to significant weight changes (5%+ body weight)?"
    ],
    differential_clarification: [
      "Have you ever experienced periods of elevated mood, increased energy, or decreased need for sleep?",
      "Did your symptoms begin after a specific life event, or gradually over time?",
      "Have you experienced any traumatic events that might relate to your current symptoms?",
      "Are you currently using any substances (alcohol, drugs, medications) that might affect your mood?"
    ]
  },
  
  "Bipolar I Disorder": {
    mania_clarification: [
      "During elevated mood periods, how many hours of sleep do you need per night?",
      "Do you experience racing thoughts or flight of ideas during elevated periods?",
      "Have you engaged in reckless spending, sexual behavior, or business investments during elevated moods?",
      "During elevated periods, do you feel invincible or like you have special powers/connections?",
      "How long do your elevated mood episodes typically last (days, weeks, months)?"
    ],
    depression_clarification: [
      "Do you experience depressive episodes between elevated periods?",
      "How would you compare the severity of your depressions vs. your elevated periods?",
      "Do depressive episodes follow elevated periods, or occur independently?"
    ],
    functional_impact: [
      "Have your elevated moods caused problems at work (being fired, conflicts, poor judgment)?",
      "Have your elevated moods affected your relationships (conflicts, breakups, relationship damage)?",
      "Have you had legal or financial problems during elevated mood periods?",
      "Have you required hospitalization during mood episodes?"
    ]
  },
  
  "Bipolar II Disorder": {
    hypomania_detection: [
      "Have you experienced periods of increased energy and confidence that lasted at least 4 days?",
      "During these periods, did you need less sleep but felt well-rested?",
      "Did others notice these changes in your behavior or mood?",
      "Did these periods cause any problems in your life, or were they purely positive?",
      "Do these elevated periods alternate with depressive episodes?"
    ],
    depression_clarification: [
      "How severe are your depressive episodes compared to your elevated periods?",
      "Do you experience more time in depression or hypomania?",
      "Have you ever experienced full mania (not just hypomania)?"
    ]
  },
  
  "Generalized Anxiety Disorder": {
    worry_patterns: [
      "How many hours per day do you spend worrying?",
      "Do your worries focus on specific themes (health, finances, relationships) or shift between topics?",
      "Are your worries about realistic problems, or worst-case scenarios that are unlikely?",
      "Do you find it easier to worry about one thing after resolving another?",
      "Have you been a worrier your entire life, or did this pattern develop more recently?"
    ],
    physical_symptoms: [
      "Which physical symptoms do you experience most: muscle tension, restlessness, fatigue, or sleep problems?",
      "Do physical symptoms occur even when you're not actively worrying?",
      "Have you had medical tests to rule out physical causes for your symptoms?",
      "Do physical symptoms improve or worsen with relaxation techniques?"
    ],
    control_clarification: [
      "Have you tried specific strategies to stop worrying (distraction, reassurance-seeking, avoidance)?",
      "When you try to stop worrying, do worries come back stronger?",
      "Do you feel like worrying helps you prepare for problems, or is it purely distressing?"
    ]
  },
  
  "Panic Disorder": {
    attack_characteristics: [
      "How long do your panic attacks typically last (minutes to hours)?",
      "Do attacks come on suddenly (within minutes) or build gradually?",
      "During attacks, which symptoms are most prominent: physical (heart racing, sweating) or cognitive (fear of dying, losing control)?",
      "Have you had attacks in situations where you previously felt safe?",
      "Do attacks occur during sleep, or only while awake?"
    ],
    agoraphobia_clarification: [
      "Have you begun avoiding places where you've had panic attacks?",
      "Do you avoid leaving home alone, or only specific situations?",
      "Would you feel safer if someone you trust accompanied you to feared situations?",
      "Has avoidance significantly restricted your activities or lifestyle?"
    ],
    anticipatory_anxiety: [
      "How much time do you spend worrying about having another attack?",
      "Do you monitor your body for physical symptoms that might signal an attack?",
      "Have you developed safety behaviors or rituals to prevent attacks?"
    ]
  },
  
  "Posttraumatic Stress Disorder": {
    trauma_clarification: [
      "What type of traumatic event(s) did you experience (single event, repeated events, chronic exposure)?",
      "How long ago did the trauma occur?",
      "Were you directly involved, witnessed it, or learned about it happening to a close other?",
      "Did you feel your life or safety was threatened during the trauma?"
    ],
    intrusion_clarification: [
      "How frequently do you experience intrusive memories or flashbacks?",
      "Are flashbacks so vivid that you lose awareness of your current surroundings?",
      "Do trauma-related nightmares cause you to wake up in distress?",
      "Are there specific triggers that reliably cause intrusive symptoms?"
    ],
    avoidance_clarification: [
      "What specific reminders do you avoid (places, people, conversations, activities)?",
      "Have you avoided trauma-related thoughts or memories, or only external reminders?",
      "Has avoidance caused you to change your lifestyle significantly?"
    ],
    cognitive_mood_clarification: [
      "Do you blame yourself, others, or the world for the trauma?",
      "Have your beliefs about safety, trust, or control changed since the trauma?",
      "Do you experience persistent negative emotions (fear, anger, shame, guilt)?",
      "Have you lost interest in activities you enjoyed before the trauma?"
    ],
    arousal_clarification: [
      "Are you constantly scanning your environment for threats (hypervigilance)?",
      "Do you startle easily, even in safe situations?",
      "Do you experience irritability or angry outbursts that are out of character?",
      "Have you engaged in reckless or self-destructive behaviors since the trauma?"
    ]
  },
  
  "Borderline Personality Disorder": {
    relationship_patterns: [
      "Do your relationships alternate between idealizing and devaluing partners?",
      "Do you fear abandonment even when there's no evidence of it?",
      "Have most of your close relationships been intense but unstable?",
      "Do you find it difficult to be alone, or do you prefer solitude?",
      "When relationships end, do you experience extreme distress that feels unbearable?"
    ],
    identity_clarification: [
      "Do you have a clear sense of who you are, or does it feel like it changes frequently?",
      "Have your values, goals, or career aspirations changed dramatically over time?",
      "Do you feel empty or unsure of your identity when not in a relationship?",
      "Do you adapt your personality to match who you're with?"
    ],
    emotional_instability: [
      "How quickly do your moods change (within hours, days, or weeks)?",
      "Are your emotional reactions disproportionate to the situation?",
      "Do you experience intense emotions that feel overwhelming and uncontrollable?",
      "How long do intense emotional states typically last?"
    ],
    impulsivity_clarification: [
      "Have you engaged in risky behaviors (unsafe sex, reckless driving, substance use, spending)?",
      "Do you make impulsive decisions that you later regret?",
      "Have you engaged in self-harm or suicidal behavior, especially during emotional distress?",
      "Do you act impulsively to relieve emotional pain, even if it causes long-term problems?"
    ]
  },
  
  "Obsessive-Compulsive Disorder": {
    obsession_clarification: [
      "Are your repetitive thoughts unwanted and intrusive, or are they voluntary worries?",
      "Do your thoughts feel like they come from outside yourself, or are they clearly your own?",
      "Do your thoughts focus on specific themes (contamination, harm, symmetry, religious/moral)?",
      "Have you tried to suppress or neutralize these thoughts?",
      "Do your thoughts cause distress because they're unwanted (ego-dystonic)?"
    ],
    compulsion_clarification: [
      "Do you perform repetitive behaviors or mental acts in response to your obsessions?",
      "Do these behaviors feel necessary to prevent something bad from happening?",
      "How much time do you spend on compulsive behaviors per day?",
      "Have compulsive behaviors significantly interfered with your daily functioning?",
      "If you try to resist compulsions, does your anxiety increase until you perform them?"
    ],
    insight_clarification: [
      "Do you recognize that your obsessions/compulsions are excessive or unreasonable?",
      "Have you sought reassurance from others about your obsessions?",
      "Do you have good, fair, poor, or absent insight into your symptoms?"
    ]
  },
  
  "Social Anxiety Disorder": {
    fear_clarification: [
      "What specific social situations do you fear (public speaking, eating in public, meeting new people, etc.)?",
      "Do you fear all social situations, or only specific types (performance vs. interaction)?",
      "Are you afraid of being judged, embarrassed, or rejected?",
      "Do you worry that others will notice your anxiety symptoms (blushing, sweating, trembling)?"
    ],
    avoidance_clarification: [
      "How often do you avoid feared social situations?",
      "Have you avoided social situations even when they were important to you?",
      "Do you use safety behaviors (drinking alcohol, avoiding eye contact, preparing excessively)?",
      "Has social avoidance significantly limited your life (career, relationships, education)?"
    ],
    performance_clarification: [
      "Do your symptoms occur only during performance situations, or also in everyday interactions?",
      "During social situations, are you focused on your own performance or others' reactions?",
      "Do you experience physical symptoms (blushing, sweating, trembling) in social situations?"
    ]
  }
};

// Questions for differential diagnosis between similar disorders
export const DIFFERENTIAL_QUESTIONS = {
  depression_vs_persistent_depression: [
    "Have your depressive symptoms been continuous for at least 2 years, or episodic?",
    "Do your symptoms meet full criteria for major depression, or are they milder but chronic?",
    "Have you had periods of normal mood lasting 2+ months, or has low mood been persistent?"
  ],
  
  bipolar_vs_unipolar_depression: [
    "Have you ever experienced periods of elevated mood, increased energy, or decreased need for sleep?",
    "During elevated periods, did you feel unusually confident, creative, or productive?",
    "Have others commented on changes in your behavior during elevated periods?",
    "Have you been treated for depression with antidepressants that caused mood elevation or irritability?"
  ],
  
  anxiety_vs_ocd: [
    "Are your worries realistic concerns about daily life, or intrusive thoughts that feel foreign?",
    "Do you perform rituals or mental acts to reduce anxiety from your thoughts?",
    "Are your anxiety symptoms triggered by specific obsessions, or are they generalized?"
  ],
  
  ptsd_vs_anxiety_depression: [
    "Did your symptoms begin after a specific traumatic event?",
    "Do you experience intrusive memories, flashbacks, or nightmares related to trauma?",
    "Do you actively avoid trauma reminders, or just experience generalized anxiety/depression?"
  ],
  
  personality_vs_mood: [
    "Have these patterns been present since adolescence, or developed later in life?",
    "Do symptoms occur across all situations, or only during mood episodes?",
    "Do you have a stable sense of self, or does it fluctuate with mood?"
  ]
};

