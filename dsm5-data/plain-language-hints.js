/**
 * Short plain-language lead-ins for symptom checklist items (dual-layer UX).
 * Keys must match symptom `id` in category data and `QUESTION_TEMPLATES` where present.
 * Empty categories fall back to clinical `<details>` only.
 */

export const PLAIN_LANGUAGE_HINTS = {
  mood: {
    depressed_mood: 'Everyday read: feeling down, empty, or hopeless on most days.',
    anhedonia: 'Everyday read: things that used to feel good barely register or feel flat.',
    weight_change: 'Everyday read: noticeable change in weight or appetite without trying.',
    sleep_disturbance: 'Everyday read: trouble sleeping, waking a lot, or sleeping far more than usual.',
    psychomotor: 'Everyday read: feeling physically “wired” or slowed down, noticeable to others.',
    fatigue: 'Everyday read: drained or low energy most days, not just tired after a busy week.',
    worthlessness: 'Everyday read: harsh self-blame, guilt, or feeling like a failure.',
    concentration: 'Everyday read: brain fog, trouble focusing, or decisions feel stuck.',
    suicidal: 'Everyday read: thoughts of death, wishing you were not here, or harming yourself. If you are in immediate danger, contact local emergency services.',
    poor_appetite: 'Everyday read: eating much less or much more than usual for you.',
    insomnia_hypersomnia: 'Everyday read: trouble sleeping or sleeping far more than usual.',
    low_energy: 'Everyday read: low drive or stamina most of the time.',
    low_self_esteem: 'Everyday read: seeing yourself as inadequate or “not enough” most days.',
    poor_concentration: 'Everyday read: hard to focus or make even small decisions.',
    hopelessness: 'Everyday read: a stuck sense that things will not get better.',
    elevated_mood: 'Everyday read: unusually “high,” irritable, or revved up for you—not just a good day.',
    increased_activity: 'Everyday read: unusually driven, busy, or restless energy that is hard to dial down.',
    grandiosity: 'Everyday read: feeling special, bulletproof, or vastly more capable than usual.',
    decreased_sleep: 'Everyday read: feeling rested on far less sleep than normal for you.',
    pressured_speech: 'Everyday read: talking fast or nonstop, hard for others to interrupt.',
    flight_ideas: 'Everyday read: thoughts racing or jumping topic to topic in a way that feels hard to steer.',
    distractibility: 'Everyday read: pulled off-task by every noise, thought, or sidebar.',
    risky_behavior: 'Everyday read: impulsive choices (money, sex, speed, substances) with painful fallout.',
    affective_lability: 'Everyday read: moods swing hard and fast (fine to furious or tearful) around your cycle.',
    irritability_anger: 'Everyday read: short fuse, snappiness, or anger that feels bigger than the trigger.',
    depressed_mood_pmdd: 'Everyday read: clear low mood in the days before your period, better after it starts.',
    anxiety_pmdd: 'Everyday read: keyed-up, tense, or worried more than usual before your period.',
    decreased_interest_pmdd: 'Everyday read: usual activities feel “meh” before your period.',
    difficulty_concentration_pmdd: 'Everyday read: focus tanks in the days before your period.',
    lethargy_pmdd: 'Everyday read: heavy fatigue or “can’t get going” before your period.',
    change_appetite_pmdd: 'Everyday read: much more or much less hunger before your period.',
    hypersomnia_insomnia_pmdd: 'Everyday read: sleeping way more or way less before your period.',
    overwhelmed_pmdd: 'Everyday read: feeling swamped or not in control before your period.',
    physical_symptoms_pmdd: 'Everyday read: body symptoms like bloating or soreness before your period.'
  },
  anxiety: {
    restlessness: 'Everyday read: on edge, keyed up, or unable to settle.',
    easily_fatigued: 'Everyday read: wiped out even when the day was not physically hard.',
    difficulty_concentrating: 'Everyday read: mind goes blank or you bounce away from tasks.',
    irritability: 'Everyday read: quick to snap or feel annoyed.',
    muscle_tension: 'Everyday read: clenched jaw, tight shoulders, or sore muscles from tension.',
    sleep_disturbance_anx: 'Everyday read: trouble falling or staying asleep, or unrested sleep.'
  },
  trauma: {
    recurrent_memories: 'Everyday read: upsetting memories pop in even when you try not to think about them.',
    recurrent_dreams: 'Everyday read: distressing dreams tied to what happened.',
    dissociative_reactions: 'Everyday read: sudden “flashback” moments where it feels like it is happening again.',
    psychological_distress: 'Everyday read: reminders (places, sounds, people) spike anxiety or panic.',
    physiological_reactions: 'Everyday read: heart racing, sweating, or nausea when reminded.',
    avoid_memories: 'Everyday read: working hard not to think or talk about what happened.',
    avoid_external: 'Everyday read: steering clear of people, places, or media that remind you.',
    amnesia: 'Everyday read: big gaps in what you remember about the event.',
    negative_beliefs: 'Everyday read: harsh beliefs about yourself, others, or the world after what happened.',
    distorted_blame: 'Everyday read: blaming yourself or others in ways that feel stuck or extreme.',
    negative_emotional: 'Everyday read: fear, anger, guilt, or shame that will not lift.',
    diminished_interest: 'Everyday read: activities you used to care about feel pointless.',
    detachment: 'Everyday read: feeling cut off from people or like you are watching life from outside.',
    inability_positive: 'Everyday read: joy, love, or calm feel blocked or very faint.',
    irritable_behavior: 'Everyday read: short fuse, arguments, or lashing out.',
    reckless_behavior: 'Everyday read: risky choices that are not like your usual self.',
    hypervigilance: 'Everyday read: scanning for danger even in ordinary situations.',
    exaggerated_startle: 'Everyday read: big jump response to sudden noise or surprise.',
    concentration_problems: 'Everyday read: trouble staying on task or holding attention.',
    sleep_disturbance_ptsd: 'Everyday read: nightmares, trouble sleeping, or not feeling rested.'
  },
  substance: {
    tolerance: 'Everyday read: needing more of the substance to get the same effect.',
    withdrawal: 'Everyday read: feeling sick, off, or not yourself when you cut down or stop.',
    taken_larger: 'Everyday read: using more or longer than you meant to.',
    persistent_desire: 'Everyday read: trying to cut back but not sticking with it.',
    time_spent: 'Everyday read: a lot of life goes to getting, using, or recovering.',
    important_activities: 'Everyday read: skipping work, relationships, or hobbies because of use.',
    continued_despite: 'Everyday read: keeping on even when you know it is hurting you.',
    craving: 'Everyday read: strong urges that are hard to ignore.'
  },
  schizophrenia: {
    delusions: 'Everyday read: fixed beliefs that others do not share, hard to shake even with evidence.',
    hallucinations: 'Everyday read: sensing things (voices, visions) that others do not perceive.',
    disorganized_speech: 'Everyday read: train of thought is hard to follow when you talk.',
    grossly_disorganized: 'Everyday read: behavior looks chaotic, frozen, or odd to others.',
    negative_symptoms: 'Everyday read: flat expression, low motivation, or pulling back from life.'
  }
};
