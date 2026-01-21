export const WILL_ANOMALY_TIERS = {
  tier1: {
    id: 'tier1',
    label: 'Tier-1 — Contorted Self',
    subtitle: 'Reactive sub-personality / node-locked protector distortion',
    summary: 'Will remains yours but becomes narrowed and distorted under pressure. The anomaly feels familiar, even when regrettable.',
    diagnosticSignature: 'Identity remains present but distorted; the distortion feels like “me under pressure.”',
    primaryHealingMode: 'Integration through compassion and re-regulation.',
    strategy: [
      'Identify the protector pattern and the node it hijacks.',
      'Name the original threat or invalidation that created the overcompensation.',
      'Practice regulation, boundary setting, and reparenting in the trigger context.',
      'Reopen flow between nodes through grounded, repeated corrective experience.'
    ],
    tasteSkew: [
      'Overcompensation habits (control, avoidance, hypervigilance).',
      'Localized node distortions rather than foreign impulses.'
    ]
  },
  tier2: {
    id: 'tier2',
    label: 'Tier-2 — Contracted Entity',
    subtitle: 'Conditional occupation / foreign will housed in numbed nodes',
    summary: 'Will is temporarily displaced by a contracted presence tied to a wound. The anomaly feels foreign and situational.',
    diagnosticSignature: '“That wasn’t me.” Identity returns after the episode with confusion or dissonance.',
    primaryHealingMode: 'Dis-identification and peaceful release.',
    strategy: [
      'Dis-identify from the pattern expression and address the contract directly.',
      'Locate the original wound and unmet need that summoned the contract.',
      'Name distasteful behaviors or relational patterns that feel injected.',
      'Demonstrate internal coherence: the contract’s conditions no longer apply.',
      'Declare sovereign intent to mature into self-regulation and reclaim authorship.'
    ],
    tasteSkew: [
      'Distasteful behaviors that feel injected, not chosen.',
      'Vice gravitations and relational entanglements that feel repulsive in hindsight.'
    ]
  },
  tier3: {
    id: 'tier3',
    label: 'Tier-3 — Possession',
    subtitle: 'Surrendered identity and entrenched override',
    summary: 'Full authorship displacement; the foreign will becomes baseline and no longer feels foreign.',
    diagnosticSignature: 'No inner conflict; “this is me now,” but the self feels hollow or fused.',
    primaryHealingMode: 'Boundary reassertion, containment, and multi-layered intervention.',
    strategy: [
      'Stabilize safety first; reduce exposure to destabilizing environments.',
      'Restore boundaries and external accountability (trusted peers/professionals).',
      'Interrupt ritualized or reinforcing patterns that sustain override.',
      'Rebuild identity through consistent sovereignty practice and support.'
    ],
    tasteSkew: [
      'Taste, desire, and moral compass distortions feel normalized.',
      'Distasteful indulgences become flaunted rather than hidden.'
    ]
  }
};

export const WILL_ANOMALY_QUESTIONS = [
  {
    id: 'authorship_feel',
    text: 'When the anomaly hits, how does it feel internally?',
    type: 'choice',
    options: [
      { label: 'Me under pressure, distorted but still me', scores: { tier1: 3, tier2: 1, tier3: 0 } },
      { label: 'Foreign or injected; “that wasn’t me”', scores: { tier1: 0, tier2: 3, tier3: 1 } },
      { label: 'Fused; “this is me now” with little inner conflict', scores: { tier1: 0, tier2: 1, tier3: 3 } }
    ]
  },
  {
    id: 'trigger_pattern',
    text: 'How does it activate?',
    type: 'choice',
    options: [
      { label: 'Triggered by stress but still feels self-directed', scores: { tier1: 3, tier2: 1, tier3: 0 } },
      { label: 'Triggered by specific relational proximity or wounds', scores: { tier1: 0, tier2: 3, tier3: 1 } },
      { label: 'Persistent baseline; little or no trigger needed', scores: { tier1: 0, tier2: 1, tier3: 3 } }
    ]
  },
  {
    id: 'after_state',
    text: 'After the episode, what is the internal aftermath?',
    type: 'choice',
    options: [
      { label: 'Guilt/fragmentation but clear authorship', scores: { tier1: 3, tier2: 0, tier3: 0 } },
      { label: 'Confusion and dissonance (“that wasn’t me”)', scores: { tier1: 0, tier2: 3, tier3: 1 } },
      { label: 'No conflict; behavior feels normal or justified', scores: { tier1: 0, tier2: 1, tier3: 3 } }
    ]
  },
  {
    id: 'localized_node',
    text: 'Does it feel localized to a specific node (voice, intimacy, power, etc.)?',
    type: 'choice',
    options: [
      { label: 'Yes, localized and situational', scores: { tier1: 1, tier2: 3, tier3: 0 } },
      { label: 'Somewhat, but broader and harder to isolate', scores: { tier1: 1, tier2: 1, tier3: 2 } },
      { label: 'No, it feels systemic and identity-wide', scores: { tier1: 0, tier2: 0, tier3: 3 } }
    ]
  },
  {
    id: 'taste_skew',
    text: 'Do you feel drawn toward behaviors or environments that feel “injected” or against your values?',
    type: 'choice',
    options: [
      { label: 'Rarely; mostly my own habits', scores: { tier1: 2, tier2: 0, tier3: 0 } },
      { label: 'Sometimes; feels injected or foreign', scores: { tier1: 0, tier2: 2, tier3: 1 } },
      { label: 'Frequently; feels normalized or identity-level', scores: { tier1: 0, tier2: 1, tier3: 2 } }
    ]
  },
  {
    id: 'feedback_resistance',
    text: 'How do you respond to feedback or inner inquiry?',
    type: 'choice',
    options: [
      { label: 'Open but defensive; I can still self-correct', scores: { tier1: 2, tier2: 1, tier3: 0 } },
      { label: 'Conflicted; I feel hijacked or split', scores: { tier1: 0, tier2: 2, tier3: 1 } },
      { label: 'Resistant; certainty overrides reflection', scores: { tier1: 0, tier2: 1, tier3: 2 } }
    ]
  }
];

export const TASTE_SKEW_OPTIONS = [
  'Vice gravitations that feel injected',
  'Relational entanglements that feel repulsive afterward',
  'Dissonant environments you do not want to be in',
  'Compulsive behaviors that feel out of character',
  'Cold certainty or ideological rigidity',
  'Loss of empathy or warmth in key moments'
];

export const CONTRACT_THEMES = [
  {
    id: 'intimacy_betrayal',
    label: 'Protection from intimacy or betrayal',
    description: 'A contract formed to avoid being hurt by closeness or exposure.'
  },
  {
    id: 'humiliation_powerlessness',
    label: 'Protection from humiliation or powerlessness',
    description: 'A contract formed to avoid being shamed, dominated, or rendered helpless.'
  },
  {
    id: 'voicelessness_confession',
    label: 'Protection from voicelessness or confession',
    description: 'A contract formed to avoid exposure, judgment, or forced disclosure.'
  },
  {
    id: 'abandonment_invalidation',
    label: 'Protection from abandonment or invalidation',
    description: 'A contract formed to prevent rejection or emotional abandonment.'
  },
  {
    id: 'chaos_overwhelm',
    label: 'Protection from chaos or overwhelm',
    description: 'A contract formed to stabilize against disorder or unpredictability.'
  },
  {
    id: 'meaning_void',
    label: 'Protection from meaning collapse',
    description: 'A contract formed to avoid existential emptiness or loss of purpose.'
  }
];

export const NODE_CONTRACT_MAP = {
  root: 'chaos_overwhelm',
  sex: 'intimacy_betrayal',
  gut: 'humiliation_powerlessness',
  heart: 'abandonment_invalidation',
  throat: 'voicelessness_confession',
  mind: 'meaning_void',
  crown: 'meaning_void'
};

