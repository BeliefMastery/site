// Western Astrology Data
// Based on astrology-cheat-sheet.html

export const WESTERN_SIGNS = {
  aries: {
    name: 'Aries',
    dateRange: 'March 21 - April 19',
    element: 'Fire',
    modality: 'Cardinal',
    keyTraits: ['Energetic', 'Courageous', 'Independent', 'Passionate'],
    challenges: ['Impulsive', 'Aggressive', 'Impatient', 'Overly competitive'],
    dndStats: { strength: 2, charisma: 1, constitution: 0, dexterity: 0, intelligence: -1, wisdom: -1 }
  },
  taurus: {
    name: 'Taurus',
    dateRange: 'April 20 - May 20',
    element: 'Earth',
    modality: 'Fixed',
    keyTraits: ['Reliable', 'Practical', 'Patient', 'Sensual'],
    challenges: ['Stubborn', 'Possessive', 'Resistant to change', 'Indulgent'],
    dndStats: { constitution: 2, wisdom: 1, strength: 0, charisma: 0, dexterity: -1, intelligence: -1 }
  },
  gemini: {
    name: 'Gemini',
    dateRange: 'May 21 - June 20',
    element: 'Air',
    modality: 'Mutable',
    keyTraits: ['Curious', 'Adaptable', 'Communicative', 'Witty'],
    challenges: ['Inconsistent', 'Superficial', 'Anxious', 'Indecisive'],
    dndStats: { intelligence: 2, dexterity: 1, charisma: 0, wisdom: 0, constitution: -1, strength: -1 }
  },
  cancer: {
    name: 'Cancer',
    dateRange: 'June 21 - July 22',
    element: 'Water',
    modality: 'Cardinal',
    keyTraits: ['Nurturing', 'Empathetic', 'Intuitive', 'Protective'],
    challenges: ['Moody', 'Insecure', 'Overly sensitive', 'Clingy'],
    dndStats: { wisdom: 2, charisma: 1, constitution: 0, intelligence: 0, strength: -1, dexterity: -1 }
  },
  leo: {
    name: 'Leo',
    dateRange: 'July 23 - August 22',
    element: 'Fire',
    modality: 'Fixed',
    keyTraits: ['Confident', 'Charismatic', 'Creative', 'Generous'],
    challenges: ['Arrogant', 'Stubborn', 'Demanding', 'Overly dramatic'],
    dndStats: { charisma: 2, strength: 1, constitution: 0, dexterity: 0, intelligence: -1, wisdom: -1 }
  },
  virgo: {
    name: 'Virgo',
    dateRange: 'August 23 - September 22',
    element: 'Earth',
    modality: 'Mutable',
    keyTraits: ['Analytical', 'Detail-oriented', 'Practical', 'Diligent'],
    challenges: ['Perfectionistic', 'Critical', 'Overly cautious', 'Anxious'],
    dndStats: { intelligence: 2, wisdom: 1, dexterity: 0, constitution: 0, charisma: -1, strength: -1 }
  },
  libra: {
    name: 'Libra',
    dateRange: 'September 23 - October 22',
    element: 'Air',
    modality: 'Cardinal',
    keyTraits: ['Diplomatic', 'Charming', 'Fair-minded', 'Social'],
    challenges: ['Indecisive', 'Superficial', 'Avoids confrontation', 'Dependent'],
    dndStats: { charisma: 2, intelligence: 1, dexterity: 0, wisdom: 0, constitution: -1, strength: -1 }
  },
  scorpio: {
    name: 'Scorpio',
    dateRange: 'October 23 - November 21',
    element: 'Water',
    modality: 'Fixed',
    keyTraits: ['Intense', 'Passionate', 'Resourceful', 'Transformative'],
    challenges: ['Jealous', 'Secretive', 'Vengeful', 'Obsessive'],
    dndStats: { wisdom: 2, constitution: 1, intelligence: 0, charisma: 0, dexterity: -1, strength: -1 }
  },
  sagittarius: {
    name: 'Sagittarius',
    dateRange: 'November 22 - December 21',
    element: 'Fire',
    modality: 'Mutable',
    keyTraits: ['Adventurous', 'Optimistic', 'Philosophical', 'Freedom-loving'],
    challenges: ['Reckless', 'Blunt', 'Irresponsible', 'Restless'],
    dndStats: { dexterity: 2, wisdom: 1, strength: 0, charisma: 0, intelligence: -1, constitution: -1 }
  },
  capricorn: {
    name: 'Capricorn',
    dateRange: 'December 22 - January 19',
    element: 'Earth',
    modality: 'Cardinal',
    keyTraits: ['Ambitious', 'Disciplined', 'Practical', 'Patient'],
    challenges: ['Pessimistic', 'Rigid', 'Workaholic', 'Overly serious'],
    dndStats: { constitution: 2, intelligence: 1, strength: 0, wisdom: 0, charisma: -1, dexterity: -1 }
  },
  aquarius: {
    name: 'Aquarius',
    dateRange: 'January 20 - February 18',
    element: 'Air',
    modality: 'Fixed',
    keyTraits: ['Innovative', 'Independent', 'Humanitarian', 'Eccentric'],
    challenges: ['Detached', 'Unpredictable', 'Aloof', 'Rebellious'],
    dndStats: { intelligence: 2, dexterity: 1, charisma: 0, wisdom: 0, constitution: -1, strength: -1 }
  },
  pisces: {
    name: 'Pisces',
    dateRange: 'February 19 - March 20',
    element: 'Water',
    modality: 'Mutable',
    keyTraits: ['Compassionate', 'Imaginative', 'Sensitive', 'Artistic'],
    challenges: ['Escapist', 'Overly emotional', 'Gullible', 'Indecisive'],
    dndStats: { wisdom: 2, charisma: 1, intelligence: 0, dexterity: 0, strength: -1, constitution: -1 }
  }
};

export const ELEMENTS = {
  Fire: {
    signs: ['Aries', 'Leo', 'Sagittarius'],
    traits: ['Passionate', 'Energetic', 'Enthusiastic', 'Adventurous'],
    dndModifier: { charisma: 1, strength: 1 }
  },
  Earth: {
    signs: ['Taurus', 'Virgo', 'Capricorn'],
    traits: ['Grounded', 'Practical', 'Reliable', 'Stable'],
    dndModifier: { constitution: 1, wisdom: 1 }
  },
  Air: {
    signs: ['Gemini', 'Libra', 'Aquarius'],
    traits: ['Intellectual', 'Communicative', 'Social', 'Objective'],
    dndModifier: { intelligence: 1, dexterity: 1 }
  },
  Water: {
    signs: ['Cancer', 'Scorpio', 'Pisces'],
    traits: ['Emotional', 'Intuitive', 'Nurturing', 'Empathetic'],
    dndModifier: { wisdom: 1, charisma: 1 }
  }
};

export const MODALITIES = {
  Cardinal: {
    signs: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    description: 'Initiators of change',
    dndModifier: { dexterity: 1 }
  },
  Fixed: {
    signs: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    description: 'Stabilizers and maintainers',
    dndModifier: { constitution: 1 }
  },
  Mutable: {
    signs: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
    description: 'Adapters and flexible',
    dndModifier: { intelligence: 1 }
  }
};

// Helper function to get sign from date
export function getWesternSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
  return null;
}

