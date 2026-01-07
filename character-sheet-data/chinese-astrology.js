// Chinese Astrology Data
// Based on astrology-cheat-sheet.html

export const CHINESE_ANIMALS = {
  rat: {
    name: 'Rat',
    years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
    keyTraits: ['Intelligent', 'Adaptable', 'Quick-witted', 'Resourceful'],
    challenges: ['Untrustworthy', 'Opportunistic', 'Manipulative', 'Too cautious'],
    dndStats: { intelligence: 2, dexterity: 1, charisma: 0, wisdom: 0, strength: -1, constitution: -1 }
  },
  ox: {
    name: 'Ox',
    years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    keyTraits: ['Reliable', 'Diligent', 'Patient', 'Strong'],
    challenges: ['Stubborn', 'Conservative', 'Overly serious', 'Resistant to change'],
    dndStats: { strength: 2, constitution: 1, wisdom: 0, intelligence: 0, dexterity: -1, charisma: -1 }
  },
  tiger: {
    name: 'Tiger',
    years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    keyTraits: ['Brave', 'Competitive', 'Confident', 'Charismatic'],
    challenges: ['Impulsive', 'Reckless', 'Hot-headed', 'Overbearing'],
    dndStats: { strength: 2, charisma: 1, dexterity: 0, constitution: 0, intelligence: -1, wisdom: -1 }
  },
  rabbit: {
    name: 'Rabbit',
    years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    keyTraits: ['Gentle', 'Compassionate', 'Artistic', 'Diplomatic'],
    challenges: ['Overly cautious', 'Indecisive', 'Easily influenced', 'Withdrawn'],
    dndStats: { wisdom: 2, charisma: 1, dexterity: 0, intelligence: 0, strength: -1, constitution: -1 }
  },
  dragon: {
    name: 'Dragon',
    years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    keyTraits: ['Ambitious', 'Confident', 'Dynamic', 'Natural leader'],
    challenges: ['Arrogant', 'Intolerant', 'Overly ambitious', 'Stubborn'],
    dndStats: { charisma: 2, strength: 1, constitution: 0, intelligence: 0, wisdom: -1, dexterity: -1 }
  },
  snake: {
    name: 'Snake',
    years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    keyTraits: ['Wise', 'Discreet', 'Intuitive', 'Sophisticated'],
    challenges: ['Secretive', 'Possessive', 'Overly critical', 'Cynical'],
    dndStats: { wisdom: 2, intelligence: 1, charisma: 0, dexterity: 0, strength: -1, constitution: -1 }
  },
  horse: {
    name: 'Horse',
    years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    keyTraits: ['Energetic', 'Independent', 'Free-spirited', 'Enthusiastic'],
    challenges: ['Impulsive', 'Hot-tempered', 'Restless', 'Difficult to control'],
    dndStats: { dexterity: 2, strength: 1, charisma: 0, constitution: 0, intelligence: -1, wisdom: -1 }
  },
  goat: {
    name: 'Goat (or Sheep)',
    years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    keyTraits: ['Peaceful', 'Creative', 'Gentle', 'Compassionate'],
    challenges: ['Pessimistic', 'Indecisive', 'Overly sensitive', 'Easily discouraged'],
    dndStats: { wisdom: 2, charisma: 1, intelligence: 0, dexterity: 0, strength: -1, constitution: -1 }
  },
  monkey: {
    name: 'Monkey',
    years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    keyTraits: ['Intelligent', 'Curious', 'Playful', 'Versatile'],
    challenges: ['Deceptive', 'Irresponsible', 'Self-indulgent', 'Unpredictable'],
    dndStats: { intelligence: 2, dexterity: 1, charisma: 0, wisdom: 0, constitution: -1, strength: -1 }
  },
  rooster: {
    name: 'Rooster',
    years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    keyTraits: ['Observant', 'Hardworking', 'Courageous', 'Confident'],
    challenges: ['Critical', 'Arrogant', 'Impatient', 'Overly blunt'],
    dndStats: { constitution: 2, wisdom: 1, strength: 0, charisma: 0, intelligence: -1, dexterity: -1 }
  },
  dog: {
    name: 'Dog',
    years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    keyTraits: ['Loyal', 'Honest', 'Responsible', 'Protective'],
    challenges: ['Worrying', 'Pessimistic', 'Critical of others', 'Stubborn'],
    dndStats: { constitution: 2, wisdom: 1, strength: 0, charisma: 0, intelligence: -1, dexterity: -1 }
  },
  pig: {
    name: 'Pig',
    years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    keyTraits: ['Generous', 'Compassionate', 'Diligent', 'Optimistic'],
    challenges: ['Naive', 'Gullible', 'Materialistic', 'Overly trusting'],
    dndStats: { constitution: 2, charisma: 1, wisdom: 0, strength: 0, intelligence: -1, dexterity: -1 }
  }
};

export const CHINESE_ELEMENTS = {
  Wood: {
    traits: ['Growth', 'Creativity', 'Flexibility', 'Generosity'],
    cycle: [1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935],
    dndModifier: { wisdom: 1, charisma: 1 }
  },
  Fire: {
    traits: ['Passion', 'Enthusiasm', 'Energy', 'Assertiveness'],
    cycle: [1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947],
    dndModifier: { charisma: 1, strength: 1 }
  },
  Earth: {
    traits: ['Stability', 'Reliability', 'Practicality', 'Endurance'],
    cycle: [1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959],
    dndModifier: { constitution: 1, wisdom: 1 }
  },
  Metal: {
    traits: ['Strength', 'Determination', 'Discipline', 'Clarity'],
    cycle: [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971],
    dndModifier: { strength: 1, intelligence: 1 }
  },
  Water: {
    traits: ['Adaptability', 'Intuition', 'Wisdom', 'Reflection'],
    cycle: [1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983],
    dndModifier: { wisdom: 1, intelligence: 1 }
  }
};

// Helper function to get Chinese animal from year
export function getChineseAnimal(year) {
  const animals = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
  // Chinese zodiac cycles every 12 years, starting from 1924 (Rat)
  const baseYear = 1924;
  const index = (year - baseYear) % 12;
  return index >= 0 ? animals[index] : animals[12 + index];
}

// Helper function to get Chinese element from year
export function getChineseElement(year) {
  // Elements cycle every 10 years (2 cycles = 20 years), but we need to account for the 12-year animal cycle
  // The element pattern repeats every 60 years (5 elements × 12 animals)
  const baseYear = 1924; // Wood Rat
  const cyclePosition = (year - baseYear) % 60;
  
  if (cyclePosition < 12) return 'Wood';
  if (cyclePosition < 24) return 'Fire';
  if (cyclePosition < 36) return 'Earth';
  if (cyclePosition < 48) return 'Metal';
  return 'Water';
}

