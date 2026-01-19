// Numerology Reference Table (Pythagorean tradition)
// Provides core meanings, master numbers, and karmic debt overlays.
// Designed to be referenced by the numerology component.

export const NUMEROLOGY_BASE_NUMBERS = {
  1: {
    title: 'The Pioneer',
    keywords: ['independence', 'initiative', 'leadership', 'willpower'],
    gifts: ['self-starter', 'courageous', 'innovative', 'decisive'],
    challenges: ['impatience', 'ego clashes', 'isolation', 'stubbornness'],
    growth: ['collaboration', 'humility', 'listening', 'shared purpose']
  },
  2: {
    title: 'The Diplomat',
    keywords: ['partnership', 'harmony', 'sensitivity', 'cooperation'],
    gifts: ['mediation', 'empathy', 'supportive', 'tactful'],
    challenges: ['indecision', 'people-pleasing', 'oversensitivity', 'passivity'],
    growth: ['boundaries', 'self-trust', 'clear voice', 'balanced give-and-take']
  },
  3: {
    title: 'The Creator',
    keywords: ['expression', 'joy', 'communication', 'imagination'],
    gifts: ['creative', 'witty', 'inspiring', 'social'],
    challenges: ['scattered focus', 'superficiality', 'dramatization', 'avoidance'],
    growth: ['discipline', 'completion', 'grounding', 'emotional honesty']
  },
  4: {
    title: 'The Builder',
    keywords: ['structure', 'stability', 'order', 'duty'],
    gifts: ['reliable', 'practical', 'persistent', 'methodical'],
    challenges: ['rigidity', 'workaholism', 'fear of change', 'pessimism'],
    growth: ['flexibility', 'trust in flow', 'playfulness', 'delegation']
  },
  5: {
    title: 'The Explorer',
    keywords: ['freedom', 'change', 'adventure', 'versatility'],
    gifts: ['adaptable', 'curious', 'resourceful', 'progressive'],
    challenges: ['restlessness', 'impulsiveness', 'excess', 'inconsistency'],
    growth: ['moderation', 'consistency', 'commitment', 'inner stability']
  },
  6: {
    title: 'The Guardian',
    keywords: ['responsibility', 'care', 'beauty', 'service'],
    gifts: ['nurturing', 'protective', 'harmonizing', 'loyal'],
    challenges: ['control', 'perfectionism', 'martyrdom', 'overgiving'],
    growth: ['balance', 'self-care', 'allowing', 'healthy boundaries']
  },
  7: {
    title: 'The Sage',
    keywords: ['analysis', 'introspection', 'wisdom', 'spirituality'],
    gifts: ['insightful', 'perceptive', 'research-driven', 'mystical'],
    challenges: ['isolation', 'skepticism', 'overthinking', 'emotional distance'],
    growth: ['trust', 'openness', 'integration', 'grounded faith']
  },
  8: {
    title: 'The Executive',
    keywords: ['power', 'ambition', 'material mastery', 'authority'],
    gifts: ['strategic', 'efficient', 'leaderly', 'resilient'],
    challenges: ['domination', 'materialism', 'work imbalance', 'control'],
    growth: ['integrity', 'generosity', 'service-minded leadership', 'inner balance']
  },
  9: {
    title: 'The Humanitarian',
    keywords: ['compassion', 'completion', 'universality', 'forgiveness'],
    gifts: ['empathetic', 'big-picture', 'inspiring', 'philanthropic'],
    challenges: ['martyrdom', 'detachment', 'idealism', 'emotional overwhelm'],
    growth: ['healthy closure', 'discernment', 'boundaries', 'acceptance']
  }
};

export const NUMEROLOGY_MASTER_NUMBERS = {
  11: {
    title: 'The Illuminator (11/2)',
    keywords: ['vision', 'intuition', 'inspiration', 'spiritual leadership'],
    gifts: ['channeler', 'high sensitivity', 'creative catalyst', 'uplifting'],
    challenges: ['nervous tension', 'self-doubt', 'overwhelm', 'idealism'],
    growth: ['grounded practice', 'focus', 'emotional steadiness', 'service']
  },
  22: {
    title: 'The Master Builder (22/4)',
    keywords: ['legacy', 'manifestation', 'organization', 'global impact'],
    gifts: ['visionary pragmatism', 'scale builder', 'responsibility', 'endurance'],
    challenges: ['pressure', 'overcontrol', 'fear of failure', 'overwork'],
    growth: ['humility', 'delegation', 'balance', 'faith in process']
  },
  33: {
    title: 'The Master Teacher (33/6)',
    keywords: ['compassion', 'healing', 'service', 'sacrifice'],
    gifts: ['uplifter', 'teacher-healer', 'unconditional love', 'devotion'],
    challenges: ['self-neglect', 'rescuer patterns', 'emotional burden', 'idealism'],
    growth: ['self-care', 'boundaries', 'practical service', 'joyful giving']
  }
};

// Karmic debt overlays (compound number lessons that reduce to base numbers)
export const NUMEROLOGY_KARMIC_DEBTS = {
  13: {
    title: 'Karmic Debt 13/4',
    keywords: ['discipline', 'transformation', 'work ethic', 'rebuilding'],
    gifts: ['grit', 'craftsmanship', 'steady progress', 'resilience'],
    challenges: ['shortcuts', 'procrastination', 'resistance to routine'],
    growth: ['consistent effort', 'patience', 'mastery through practice'],
    reducedTo: 4
  },
  14: {
    title: 'Karmic Debt 14/5',
    keywords: ['freedom through discipline', 'moderation', 'adaptability'],
    gifts: ['versatility', 'communication', 'resourcefulness'],
    challenges: ['excess', 'escapism', 'instability', 'overindulgence'],
    growth: ['self-control', 'healthy boundaries', 'balanced freedom'],
    reducedTo: 5
  },
  16: {
    title: 'Karmic Debt 16/7',
    keywords: ['humility', 'inner truth', 'ego dissolution', 'spiritual insight'],
    gifts: ['awakening', 'depth', 'wisdom', 'clarity'],
    challenges: ['pride', 'isolation', 'sudden upheaval', 'disillusionment'],
    growth: ['surrender', 'faith', 'inner alignment', 'authenticity'],
    reducedTo: 7
  },
  19: {
    title: 'Karmic Debt 19/1',
    keywords: ['self-reliance with service', 'independence', 'leadership'],
    gifts: ['courage', 'initiative', 'personal power'],
    challenges: ['egoism', 'lone-wolf patterns', 'stubbornness'],
    growth: ['humble leadership', 'collaboration', 'service-oriented success'],
    reducedTo: 1
  }
};

export const MASTER_NUMBERS = [11, 22, 33];

const sumDigits = (value) => String(Math.abs(value))
  .split('')
  .map((digit) => parseInt(digit, 10))
  .reduce((sum, digit) => sum + digit, 0);

export function reduceNumber(value, { keepMaster = true } = {}) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return null;

  let current = Math.abs(parsed);
  while (current > 9) {
    if (keepMaster && MASTER_NUMBERS.includes(current)) {
      return current;
    }
    current = sumDigits(current);
  }
  return current;
}

export function getNumerologyProfile(value, { keepMaster = true } = {}) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return null;

  if (NUMEROLOGY_MASTER_NUMBERS[parsed]) {
    return {
      number: parsed,
      reducedTo: reduceNumber(parsed, { keepMaster: false }),
      ...NUMEROLOGY_MASTER_NUMBERS[parsed]
    };
  }

  if (NUMEROLOGY_KARMIC_DEBTS[parsed]) {
    return {
      number: parsed,
      ...NUMEROLOGY_KARMIC_DEBTS[parsed]
    };
  }

  const reduced = reduceNumber(parsed, { keepMaster });
  const baseProfile = NUMEROLOGY_BASE_NUMBERS[reduced];
  if (!baseProfile) return null;

  return {
    number: parsed,
    reducedTo: reduced,
    ...baseProfile
  };
}

export const NUMEROLOGY_TABLE = {
  ...NUMEROLOGY_BASE_NUMBERS,
  ...NUMEROLOGY_MASTER_NUMBERS,
  ...NUMEROLOGY_KARMIC_DEBTS
};

