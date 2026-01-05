// 63 Manipulation Tactics - Key examples for identification
// Full details in tactical-manipulation.html

export const MANIPULATION_TACTICS = {
  // Fear-Based (1-6)
  1: {
    id: 1,
    name: 'Coercive Fragility',
    vector: 'fear',
    phase: 'Ingress',
    mode: 'Covert',
    example: 'I\'ll break when I break… I don\'t really care anymore…',
    mechanism: 'Presents emotional collapse as inevitable, subtly threatening emotional damage if unmet needs are named.',
    leverage: 'Triggers the partner\'s compassion reflex, weaponizing empathy to block confrontation or distance.'
  },
  2: {
    id: 2,
    name: 'Threat Saturation',
    vector: 'fear',
    phase: 'Ingress',
    mode: 'Overt',
    example: 'I\'ll just leave right now, and you\'ll never see me again.',
    mechanism: 'Floods the relational space with repeated threats - of abandonment, collapse, or retribution.',
    leverage: 'Uses unpredictability and fear of loss to hijack emotional coherence and enforce compliance.'
  },
  3: {
    id: 3,
    name: 'Manufactured Crises',
    vector: 'fear',
    phase: 'Entrench',
    mode: 'Covert',
    example: 'Softens at the end of a walk only to reignite conflict over lunch.',
    mechanism: 'Introduces destabilizing conflict or drama at key emotional moments to interrupt peace and clarity.',
    leverage: 'Keeps the partner off balance by triggering repeated survival-mode engagement.'
  },
  // Dependency & Control-Based (7-12)
  7: {
    id: 7,
    name: 'Resource Withholding',
    vector: 'dependency',
    phase: 'Extract',
    mode: 'Overt',
    example: 'You don\'t contribute financially, so your opinion doesn\'t matter.',
    mechanism: 'Uses control of money, shelter, or other essential resources to limit autonomy and silence dissent.',
    leverage: 'Creates a dependency hierarchy where survival or comfort becomes conditional on compliance.'
  },
  8: {
    id: 8,
    name: 'Manufactured Helplessness',
    vector: 'dependency',
    phase: 'Entrench',
    mode: 'Covert',
    example: 'I just don\'t know how to manage that stuff - you\'re so much better at it.',
    mechanism: 'Feigns incompetence, forgetfulness, or distress to push responsibility onto the partner.',
    leverage: 'Guilt and caretaking instincts are triggered, making the partner feel obligated to manage burdens.'
  },
  // Deception & Illusion-Based (13-18)
  13: {
    id: 13,
    name: 'Gaslighting',
    vector: 'deception',
    phase: 'Entrench',
    mode: 'Overt and Covert',
    example: 'That never happened - you\'re imagining things.',
    mechanism: 'Systematically denies, reframes, or distorts shared events to undermine the partner\'s memory, perception, or emotional response.',
    leverage: 'Replaces objective reality with a narrative controlled by the manipulator, making the victim reliant on them for truth.'
  },
  14: {
    id: 14,
    name: 'Mirror Masking',
    vector: 'deception',
    phase: 'Ingress',
    mode: 'Covert',
    example: 'You\'re unlike anyone I\'ve ever met - so pure, so special. (followed weeks later by rejection)',
    mechanism: 'Reflects an idealized projection of the partner\'s self back to them, accelerating attachment through simulated resonance.',
    leverage: 'Forges intimacy based on illusion, setting up a later collapse or reversal to gain further control.'
  },
  // Obsession-Based (19-24)
  19: {
    id: 19,
    name: 'Obsession Seeding',
    vector: 'obsession',
    phase: 'Ingress',
    mode: 'Covert',
    example: 'I\'ve never felt this way about anyone before.',
    mechanism: 'Creates an intense, exclusive focus that feels like love but functions as possession.',
    leverage: 'Accelerates attachment through intensity, making normal boundaries feel like betrayal.'
  },
  // Adoration-Based (25-30)
  25: {
    id: 25,
    name: 'Idealization Bombing',
    vector: 'adoration',
    phase: 'Ingress',
    mode: 'Covert',
    example: 'You\'re perfect. I\'ve been waiting for someone like you my whole life.',
    mechanism: 'Overwhelms with excessive praise and admiration to create dependency on validation.',
    leverage: 'Makes the partner dependent on external approval, setting up withdrawal as punishment.'
  },
  // Sexual Exploitation (31-36)
  31: {
    id: 31,
    name: 'Sexual Guilt Conditioning',
    vector: 'sexual',
    phase: 'Ingress',
    mode: 'Overt',
    example: 'If you really loved me, you would...',
    mechanism: 'Links sexual compliance to love and worth, creating guilt for boundaries.',
    leverage: 'Makes physical boundaries feel like emotional rejection, weaponizing intimacy.'
  },
  // Advanced/Composite (37-63) - Key examples
  37: {
    id: 37,
    name: 'Volumetric Override',
    vector: 'fear',
    phase: 'Entrench',
    mode: 'Overt',
    example: 'A partner yells over any attempt at response.',
    mechanism: 'Uses loudness and interruption to overwhelm the partner\'s nervous system.',
    leverage: 'Shocks the other into submission by derailing cognitive clarity.'
  },
  38: {
    id: 38,
    name: 'Binary Ultimatum Trap',
    vector: 'fear',
    phase: 'Entrench',
    mode: 'Overt',
    example: 'If you keep talking to him, we\'re done.',
    mechanism: 'Compresses dialogue into a lose-lose decision.',
    leverage: 'Forces concession under threat of relational collapse.'
  }
};

