// Comprehensive Treatment and Theory Database
// Maps diagnoses to treatments, theories, causes, and management strategies

export const TREATMENT_DATABASE = {
  "Major Depressive Disorder": {
    treatments: {
      behavioral: [
        "Cognitive Behavioral Therapy (CBT) - restructure negative thought patterns",
        "Interpersonal Therapy (IPT) - address relationship issues contributing to depression",
        "Behavioral Activation - increase engagement in rewarding activities",
        "Mindfulness-Based Cognitive Therapy (MBCT) - prevent relapse through awareness",
        "Problem-Solving Therapy - develop adaptive coping strategies",
        "Dialectical Behavior Therapy (DBT) - emotional regulation skills"
      ],
      dietary: [
        "Omega-3 fatty acids (fish oil, flaxseed) - support brain health and mood regulation",
        "B-vitamins (B12, folate) - essential for neurotransmitter synthesis",
        "Vitamin D supplementation - deficiency linked to depression",
        "Mediterranean diet - anti-inflammatory, rich in antioxidants",
        "Reduce processed foods and refined sugars - stabilize blood glucose",
        "Increase tryptophan-rich foods (turkey, eggs, nuts) - precursor to serotonin",
        "Probiotics and fermented foods - gut-brain axis support",
        "Limit alcohol and caffeine - can exacerbate symptoms"
      ],
      pharmacological: [
        "Selective Serotonin Reuptake Inhibitors (SSRIs) - fluoxetine, sertraline, citalopram",
        "Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs) - venlafaxine, duloxetine",
        "Atypical antidepressants - bupropion, mirtazapine, trazodone",
        "Tricyclic antidepressants (TCAs) - amitriptyline, nortriptyline (older class)",
        "Monoamine Oxidase Inhibitors (MAOIs) - phenelzine, tranylcypromine (dietary restrictions)",
        "Augmentation strategies - lithium, thyroid hormone, atypical antipsychotics"
      ],
      alternativeHealth: [
        "St. John's Wort - herbal antidepressant (interacts with many medications)",
        "S-Adenosylmethionine (SAMe) - natural mood enhancer",
        "5-HTP - serotonin precursor supplement",
        "Light therapy - especially for seasonal depression",
        "Acupuncture - traditional Chinese medicine approach",
        "Massage therapy - reduce stress and muscle tension",
        "Yoga and Tai Chi - movement and breathwork integration"
      ],
      westernMedicine: [
        "Electroconvulsive Therapy (ECT) - for severe, treatment-resistant cases",
        "Transcranial Magnetic Stimulation (TMS) - non-invasive brain stimulation",
        "Vagus Nerve Stimulation (VNS) - implantable device",
        "Ketamine/esketamine - rapid-acting antidepressant for treatment-resistant depression",
        "Psychiatric hospitalization - for safety and stabilization in crisis"
      ],
      easternMedicine: [
        "Traditional Chinese Medicine (TCM) - acupuncture, herbal formulas (Xiaoyao San, Chaihu Shugan San)",
        "Ayurvedic medicine - balance doshas, rasayana herbs (ashwagandha, brahmi)",
        "Tibetan medicine - balance three humors, herbal compounds",
        "Qi Gong - energy cultivation practices",
        "Meditation practices - Vipassana, Zen, loving-kindness"
      ]
    },
    theories: {
      biophysical: [
        "Neurotransmitter imbalance hypothesis - serotonin, norepinephrine, dopamine dysregulation",
        "Neuroplasticity - reduced BDNF (brain-derived neurotrophic factor) affecting neural connections",
        "HPA axis dysregulation - chronic stress affecting cortisol regulation",
        "Inflammatory hypothesis - systemic inflammation affecting brain function",
        "Circadian rhythm disruption - sleep-wake cycle abnormalities",
        "Genetic predisposition - polygenic risk factors",
        "Neuroendocrine factors - thyroid, sex hormone interactions"
      ],
      metaphysical: [
        "Loss of meaning and purpose - existential vacuum",
        "Soul fragmentation - disconnection from authentic self",
        "Energetic depletion - chakra imbalances, particularly heart and solar plexus",
        "Karmic patterns - unresolved past-life or ancestral trauma",
        "Spiritual bypassing - avoidance of necessary shadow work",
        "Collective consciousness influence - absorption of cultural despair",
        "Astral/etheric body misalignment"
      ],
      biochemical: [
        "Serotonin synthesis and metabolism - tryptophan hydroxylase activity",
        "Monoamine oxidase activity - breakdown of neurotransmitters",
        "Catechol-O-methyltransferase (COMT) variants - dopamine metabolism",
        "MTHFR gene mutations - folate metabolism affecting methylation",
        "Gut microbiome composition - production of neurotransmitters and inflammation",
        "Inflammatory markers - cytokines (IL-6, TNF-α) affecting mood",
        "Oxidative stress - free radical damage to neural tissue",
        "Mitochondrial dysfunction - cellular energy production"
      ],
      mythopoetical: [
        "Descent into the Underworld - necessary journey through darkness for transformation",
        "The Wounded Healer archetype - integration of pain as wisdom",
        "The Dark Night of the Soul - spiritual crisis and purification",
        "Persephone's descent - cyclical death and rebirth",
        "Inanna's stripping - loss of power and reclamation",
        "The Fisher King - wounded ruler and the wasteland",
        "The Shadow's return - facing repressed aspects of self"
      ]
    },
    managementStrategies: [
      "Routine establishment - consistent sleep, meals, activity schedules",
      "Social support - maintain connections, avoid isolation",
      "Stress management - identify and reduce stressors where possible",
      "Gradual activity increase - start small, build momentum",
      "Thought monitoring - recognize and challenge negative patterns",
      "Crisis planning - identify triggers and coping strategies",
      "Medication adherence - consistent timing and dosing",
      "Regular therapy sessions - ongoing support and skill development",
      "Physical exercise - 30 minutes daily, even light movement helps",
      "Sunlight exposure - natural light regulation"
    ],
    potentialCauses: [
      "Genetic factors - family history of depression",
      "Childhood trauma - adverse childhood experiences (ACEs)",
      "Chronic stress - work, relationship, financial pressures",
      "Major life changes - loss, divorce, relocation, job change",
      "Medical conditions - chronic pain, hormonal imbalances, neurological conditions",
      "Substance use - alcohol, drugs as self-medication or cause",
      "Medications - certain prescription drugs",
      "Seasonal factors - reduced sunlight (SAD)",
      "Social isolation - lack of meaningful connections",
      "Learned helplessness - pattern of perceived lack of control"
    ],
    environmentalFactors: [
      "Urban vs. rural living - access to nature, community",
      "Socioeconomic status - poverty, financial stress",
      "Work environment - high stress, low control, bullying",
      "Living conditions - overcrowding, noise, safety concerns",
      "Social support network - quality and quantity of relationships",
      "Cultural factors - stigma, expectations, expression norms",
      "Exposure to trauma - ongoing or past traumatic events",
      "Access to healthcare - availability of treatment resources",
      "Natural environment - pollution, toxins, climate",
      "Technology overuse - screen time, social media comparison"
    ]
  },
  
  "Generalized Anxiety Disorder": {
    treatments: {
      behavioral: [
        "Cognitive Behavioral Therapy (CBT) - challenge catastrophic thinking",
        "Exposure Therapy - gradual confrontation of fears",
        "Acceptance and Commitment Therapy (ACT) - value-based living despite anxiety",
        "Mindfulness-Based Stress Reduction (MBSR) - present-moment awareness",
        "Relaxation training - progressive muscle relaxation, breathing exercises",
        "Applied Relaxation - tension-release techniques"
      ],
      dietary: [
        "Magnesium supplementation - natural muscle relaxant",
        "B-vitamins - support nervous system function",
        "Reduce caffeine and stimulants - can trigger or worsen anxiety",
        "Limit alcohol - initially calming but increases anxiety",
        "Omega-3 fatty acids - anti-inflammatory, support brain health",
        "Complex carbohydrates - stabilize blood sugar",
        "Probiotics - gut-brain axis connection",
        "Chamomile tea - mild anxiolytic properties"
      ],
      pharmacological: [
        "SSRIs - first-line treatment (sertraline, escitalopram)",
        "SNRIs - venlafaxine, duloxetine",
        "Benzodiazepines - short-term use only (alprazolam, clonazepam, lorazepam)",
        "Buspirone - non-addictive anxiolytic",
        "Pregabalin/Gabapentin - anticonvulsants with anxiolytic effects",
        "Beta-blockers - propranolol for physical symptoms"
      ],
      alternativeHealth: [
        "Lavender oil - aromatherapy and oral preparation (Silexan)",
        "Passionflower - herbal anxiolytic",
        "Valerian root - calming herb",
        "Ashwagandha - adaptogenic herb reducing stress",
        "Rhodiola - adaptogen for stress response",
        "Acupuncture - traditional treatment for anxiety",
        "Massage therapy - physical relaxation"
      ],
      westernMedicine: [
        "CBT with medication - combination approach",
        "Biofeedback - learn to control physiological responses",
        "Neurofeedback - brainwave training",
        "TMS - for treatment-resistant cases"
      ],
      easternMedicine: [
        "TCM - acupuncture, herbs (Gan Mai Da Zao Tang)",
        "Ayurveda - balancing vata dosha, brahmi, ashwagandha",
        "Yoga - asana, pranayama, meditation",
        "Tai Chi - gentle movement and breathwork",
        "Qi Gong - energy cultivation",
        "Meditation - Vipassana, Transcendental, Zen"
      ]
    },
    theories: {
      biophysical: [
        "GABA system dysregulation - inhibitory neurotransmitter imbalance",
        "Hyperactive amygdala - threat detection system overactivity",
        "Prefrontal cortex underactivation - reduced top-down control",
        "HPA axis hyperactivation - elevated cortisol and stress response",
        "Autonomic nervous system dysregulation - sympathetic dominance",
        "Genetic factors - anxiety sensitivity, neuroticism"
      ],
      metaphysical: [
        "Future-oriented consciousness - excessive forward projection",
        "Root chakra instability - safety and security issues",
        "Solar plexus imbalance - power and control concerns",
        "Astral body sensitivity - over-reception of environmental energies",
        "Karmic patterns - past-life trauma responses",
        "Energetic boundaries - difficulty containing personal energy field"
      ],
      biochemical: [
        "GABA/glutamate balance - excitatory/inhibitory neurotransmission",
        "Serotonin receptor sensitivity - 5-HT1A function",
        "Cortisol dysregulation - stress hormone patterns",
        "Adrenaline/norepinephrine - fight-or-flight activation",
        "Thyroid function - hyperthyroidism can mimic anxiety",
        "Blood sugar fluctuations - reactive hypoglycemia"
      ],
      mythopoetical: [
        "Hypervigilant Guardian - protector archetype gone awry",
        "The Worrier's burden - carrying others' concerns",
        "Orpheus's hesitation - fear of looking back",
        "Prometheus bound - anticipation of punishment",
        "Cassandra's curse - knowing but unable to prevent"
      ]
    },
    managementStrategies: [
      "Breathing exercises - 4-7-8 technique, box breathing",
      "Grounding techniques - 5-4-3-2-1 method",
      "Worry time - scheduled anxiety processing",
      "Thought challenging - evidence-based reality testing",
      "Progressive muscle relaxation - systematic tension release",
      "Limit news/social media - reduce triggers",
      "Regular exercise - natural anxiety reduction",
      "Sleep hygiene - adequate rest crucial",
      "Time management - reduce overwhelm",
      "Boundary setting - protect energy"
    ],
    potentialCauses: [
      "Genetic predisposition - family history",
      "Childhood experiences - overprotective or unpredictable parenting",
      "Trauma - past traumatic events",
      "Stress accumulation - chronic life stressors",
      "Medical conditions - hyperthyroidism, cardiac issues",
      "Substance withdrawal - alcohol, benzodiazepines",
      "Learned behavior - modeled from caregivers",
      "Personality traits - high neuroticism, perfectionism"
    ],
    environmentalFactors: [
      "High-stress environments - work, home, social",
      "Uncertainty - economic, health, social instability",
      "Information overload - 24/7 news, social media",
      "Overstimulation - noise, crowds, technology",
      "Lack of predictability - chaotic schedules",
      "Social pressures - expectations, comparison",
      "Financial insecurity - economic stress",
      "Urban living - noise, pace, lack of nature"
    ]
  },

  "Posttraumatic Stress Disorder": {
    treatments: {
      behavioral: [
        "Trauma-Focused CBT (TF-CBT) - process traumatic memories",
        "Eye Movement Desensitization and Reprocessing (EMDR) - bilateral stimulation therapy",
        "Prolonged Exposure Therapy - systematic desensitization",
        "Cognitive Processing Therapy (CPT) - challenge trauma-related beliefs",
        "Narrative Exposure Therapy - create coherent trauma narrative",
        "Somatic Experiencing - body-based trauma resolution"
      ],
      dietary: [
        "Anti-inflammatory diet - reduce systemic inflammation",
        "Omega-3 fatty acids - support brain repair",
        "B-vitamins - stress response support",
        "Magnesium - natural calmative for hypervigilance",
        "Protein - stabilize blood sugar and mood",
        "Avoid stimulants - can trigger hyperarousal",
        "Limit alcohol - can worsen symptoms",
        "Probiotics - gut health and mood"
      ],
      pharmacological: [
        "SSRIs - sertraline, paroxetine (FDA approved)",
        "SNRIs - venlafaxine",
        "Prazosin - nightmares and sleep disturbance",
        "Atypical antipsychotics - for severe symptoms",
        "Benzodiazepines - generally avoided (can worsen)",
        "Adrenergic blockers - propranolol for hyperarousal"
      ],
      alternativeHealth: [
        "Yoga - trauma-sensitive practices",
        "Acupuncture - stress and trauma release",
        "Massage - bodywork for stored trauma",
        "Craniosacral therapy - gentle bodywork",
        "Neurofeedback - brainwave regulation",
        "Equine therapy - connection with animals",
        "Nature therapy - grounding in natural settings"
      ],
      westernMedicine: [
        "MDMA-assisted psychotherapy - emerging treatment (clinical trials)",
        "Ketamine therapy - rapid reduction of symptoms",
        "Virtual Reality Exposure - controlled exposure therapy",
        "TMS - for treatment-resistant cases"
      ],
      easternMedicine: [
        "TCM - acupuncture, herbs for shock/trauma",
        "Ayurveda - balancing disturbed doshas",
        "Qi Gong - gentle energy cultivation",
        "Tai Chi - slow movement integration",
        "Meditation - trauma-sensitive approaches",
        "Shamanic practices - soul retrieval, ceremony"
      ]
    },
    theories: {
      biophysical: [
        "Fight-flight-freeze response - survival system activation",
        "Amygdala hyperactivation - threat detection overdrive",
        "Hippocampal volume reduction - memory processing disruption",
        "Prefrontal cortex underactivation - reduced executive control",
        "HPA axis dysregulation - cortisol patterns",
        "Neurochemical changes - norepinephrine, CRF alterations"
      ],
      metaphysical: [
        "Soul fragmentation - parts lost in trauma",
        "Energetic attachment - trauma entity connection",
        "Past-life trauma - karmic patterns",
        "Ancestral trauma - generational transmission",
        "Etheric body tears - energetic boundary violations",
        "Chakra trauma - particularly root, sacral, solar plexus",
        "Possession/attachment - negative entity influence"
      ],
      biochemical: [
        "Cortisol dysregulation - hyper- and hypo-cortisolism",
        "Norepinephrine elevation - hyperarousal",
        "GABA reduction - reduced inhibition",
        "Endocannabinoid system - natural trauma processing",
        "Oxytocin - attachment and safety",
        "BDNF reduction - neural repair capacity"
      ],
      mythopoetical: [
        "The Wounded Warrior - trauma as initiation",
        "Inanna's descent - death and return",
        "Orpheus and Eurydice - loss and retrieval",
        "The Phoenix - destruction and rebirth",
        "Persephone's abduction - violation and transformation",
        "The Wounded King - trauma and healing responsibility"
      ]
    },
    managementStrategies: [
      "Grounding techniques - present-moment awareness",
      "Safe space visualization - internal sanctuary",
      "Breathing exercises - regulate nervous system",
      "Body scanning - somatic awareness",
      "Trigger identification - avoid when possible, prepare when not",
      "Support network - trauma-informed community",
      "Self-compassion - reduce self-blame",
      "Routine - predictability and safety",
      "Physical activity - discharge stored energy",
      "Creative expression - process through art, writing"
    ],
    potentialCauses: [
      "Combat exposure - military trauma",
      "Sexual assault - violation trauma",
      "Physical assault - violence exposure",
      "Natural disasters - environmental trauma",
      "Accidents - near-death experiences",
      "Childhood abuse - developmental trauma",
      "Witnessing trauma - vicarious trauma",
      "Medical trauma - illness, procedures",
      "Loss of loved ones - traumatic grief"
    ],
    environmentalFactors: [
      "Ongoing danger - unsafe living situations",
      "Lack of support - isolation after trauma",
      "Stigma - judgment about trauma response",
      "Retraumatization - repeated exposure",
      "Substance use environment - self-medication",
      "Violence exposure - community violence",
      "Institutional trauma - systems causing harm",
      "Natural disasters - climate events"
    ]
  },

  "Borderline Personality Disorder": {
    treatments: {
      behavioral: [
        "Dialectical Behavior Therapy (DBT) - emotion regulation, distress tolerance",
        "Mentalization-Based Therapy - understanding mental states",
        "Schema Therapy - address early maladaptive schemas",
        "Transference-Focused Psychotherapy - explore relationship patterns",
        "Systems Training for Emotional Predictability (STEPPS) - skills group",
        "Cognitive Analytic Therapy - relational patterns"
      ],
      dietary: [
        "Stable meal schedule - regulate blood sugar and mood",
        "Omega-3 fatty acids - support brain health",
        "B-vitamins - neurotransmitter support",
        "Magnesium - emotional regulation",
        "Avoid alcohol - emotional dysregulation",
        "Limit caffeine - can increase impulsivity",
        "Protein with meals - stabilize mood",
        "Regular hydration - physical stability"
      ],
      pharmacological: [
        "No FDA-approved medications - symptom-focused approach",
        "Mood stabilizers - lamotrigine, valproate",
        "Atypical antipsychotics - olanzapine, quetiapine",
        "SSRIs - for comorbid depression/anxiety",
        "Omega-3 - some evidence for benefit"
      ],
      alternativeHealth: [
        "Yoga - emotion-body connection",
        "Meditation - emotional regulation",
        "Acupuncture - stress reduction",
        "Art therapy - expression and regulation",
        "Animal-assisted therapy - connection",
        "Nature therapy - grounding"
      ],
      westernMedicine: [
        "Long-term psychotherapy - essential component",
        "Partial hospitalization - intensive DBT programs",
        "Residential treatment - structured environment"
      ],
      easternMedicine: [
        "TCM - regulate emotions, herbs",
        "Ayurveda - balance doshas",
        "Yoga therapy - integration",
        "Meditation - mindfulness practices"
      ]
    },
    theories: {
      biophysical: [
        "Emotional dysregulation - amygdala hyperactivity",
        "Reduced prefrontal control - impulsivity",
        "Oxytocin system - attachment dysregulation",
        "HPA axis - stress response",
        "Genetic factors - heritability",
        "Neurotransmitter systems - serotonin, dopamine"
      ],
      metaphysical: [
        "Fragmented self - lack of cohesive identity",
        "Abandonment wound - core fear",
        "Emotional chakra imbalance - sacral, heart",
        "Boundary issues - energetic permeability",
        "Soul fragmentation - identity confusion",
        "Attachment trauma - early wounding"
      ],
      biochemical: [
        "Serotonin dysfunction - impulsivity, mood",
        "Dopamine - reward processing",
        "Oxytocin - attachment",
        "Cortisol - stress response",
        "Endocannabinoid system - emotion regulation"
      ],
      mythopoetical: [
        "The Divided Self - fragmentation",
        "Persephone - abduction and return",
        "The Wounded Child - inner child work",
        "Medusa - transformation of pain",
        "The Twin - split identity"
      ]
    },
    managementStrategies: [
      "DBT skills - distress tolerance, emotion regulation",
      "Mindfulness - present-moment awareness",
      "Radical acceptance - reality acknowledgment",
      "Interpersonal effectiveness - communication skills",
      "Emotion regulation - identify and modulate",
      "Crisis planning - prevent self-harm",
      "Support network - consistent relationships",
      "Routine - structure and predictability",
      "Boundary work - personal limits",
      "Therapy - ongoing support"
    ],
    potentialCauses: [
      "Childhood trauma - abuse, neglect",
      "Invalidating environment - emotional needs unmet",
      "Genetic factors - heritability",
      "Brain development - early stress impact",
      "Attachment disruption - caregiver instability",
      "Biological factors - temperament"
    ],
    environmentalFactors: [
      "Unstable home - chaotic childhood",
      "Invalidation - emotional needs dismissed",
      "Trauma exposure - early adverse experiences",
      "Attachment disruptions - caregiver changes",
      "Social environment - peer rejection",
      "Cultural factors - expression norms"
    ]
  }
};

// Template for easy expansion - copy this structure for new disorders
export const TREATMENT_TEMPLATE = {
  treatments: {
    behavioral: [],
    dietary: [],
    pharmacological: [],
    alternativeHealth: [],
    westernMedicine: [],
    easternMedicine: []
  },
  theories: {
    biophysical: [],
    metaphysical: [],
    biochemical: [],
    mythopoetical: []
  },
  managementStrategies: [],
  potentialCauses: [],
  environmentalFactors: []
};

