// Mayan Astrology Data (Dreamspell/Tzolkin)
// Based on astrology-cheat-sheet.html

export const MAYAN_SEALS = {
  red_dragon: {
    name: 'Red Dragon',
    glyph: 'IMIX',
    theme: 'Birth & Nurturing',
    ability: 'Grounded Caregiver - Strongly protective and supportive, creating safe environments.',
    negativeModifier: 'Overprotective Stifler - May smother others, hindering independence.',
    dndStats: { constitution: 2, wisdom: 1, charisma: 0, strength: 0, dexterity: -1, intelligence: -1 }
  },
  white_wind: {
    name: 'White Wind',
    glyph: 'IK',
    theme: 'Spirit & Communication',
    ability: 'Intuitive Connector - Naturally reads people and situations, fostering communication.',
    negativeModifier: 'Disconnected Speaker - Struggles to convey thoughts, leading to misunderstandings.',
    dndStats: { charisma: 2, wisdom: 1, intelligence: 0, dexterity: 0, strength: -1, constitution: -1 }
  },
  blue_night: {
    name: 'Blue Night',
    glyph: 'AKBAL',
    theme: 'Dreams & Abundance',
    ability: 'Visionary Problem-Solver - Introspective and creative in finding unique solutions.',
    negativeModifier: 'Escapist Dreamer - Retreats into daydreams, avoiding reality and practical solutions.',
    dndStats: { intelligence: 2, wisdom: 1, charisma: 0, dexterity: 0, constitution: -1, strength: -1 }
  },
  yellow_seed: {
    name: 'Yellow Seed',
    glyph: 'KAN',
    theme: 'Flowering & Growth',
    ability: 'Growth Enabler - Inspires others to reach their potential, excelling in mentorship.',
    negativeModifier: 'Pushy Visionary - Pressures others for results, becoming overly critical.',
    dndStats: { wisdom: 2, charisma: 1, intelligence: 0, constitution: 0, dexterity: -1, strength: -1 }
  },
  red_serpent: {
    name: 'Red Serpent',
    glyph: 'CHICCHAN',
    theme: 'Life-force & Survival',
    ability: 'Instinctive Reactor - Quick to respond, attuned to physical and emotional signals.',
    negativeModifier: 'Reckless Instinct - Acts impulsively, misinterpreting signals and creating chaos.',
    dndStats: { dexterity: 2, constitution: 1, strength: 0, wisdom: 0, intelligence: -1, charisma: -1 }
  },
  white_world_bridger: {
    name: 'White World-Bridger',
    glyph: 'CIMI',
    theme: 'Death & Equalization',
    ability: 'Level-Headed Mediator - Finds common ground and bridges differences effectively.',
    negativeModifier: 'Indecisive Mediator - Struggles to take a stand, leading to prolonged tensions.',
    dndStats: { wisdom: 2, intelligence: 1, charisma: 0, constitution: 0, strength: -1, dexterity: -1 }
  },
  blue_hand: {
    name: 'Blue Hand',
    glyph: 'MANIK',
    theme: 'Accomplishment & Healing',
    ability: 'Practical Healer - Resourceful and dependable, adept at finding healing solutions.',
    negativeModifier: 'Overbearing Fixer - Takes on others\' burdens, fostering dependency.',
    dndStats: { wisdom: 2, constitution: 1, intelligence: 0, charisma: 0, dexterity: -1, strength: -1 }
  },
  yellow_star: {
    name: 'Yellow Star',
    glyph: 'LAMAT',
    theme: 'Elegance & Beauty',
    ability: 'Harmony Creator - Sensitive to aesthetics, creating a sense of calm.',
    negativeModifier: 'Superficial Aesthetician - Prioritizes appearances over substance, lacking meaningful connections.',
    dndStats: { charisma: 2, dexterity: 1, wisdom: 0, intelligence: 0, strength: -1, constitution: -1 }
  },
  red_moon: {
    name: 'Red Moon',
    glyph: 'MULAC',
    theme: 'Universal Water & Purification',
    ability: 'Emotional Cleanser - Skilled in processing emotions, supporting renewal.',
    negativeModifier: 'Overly Emotional - May become engulfed by feelings, hindering objectivity.',
    dndStats: { wisdom: 2, charisma: 1, constitution: 0, intelligence: 0, dexterity: -1, strength: -1 }
  },
  white_dog: {
    name: 'White Dog',
    glyph: 'OC',
    theme: 'Heart & Loyalty',
    ability: 'Unshakeable Loyalty - Deep commitment and trustworthiness.',
    negativeModifier: 'Overly Attached - Can become clingy, stifling others\' independence.',
    dndStats: { charisma: 2, constitution: 1, wisdom: 0, strength: 0, intelligence: -1, dexterity: -1 }
  },
  blue_monkey: {
    name: 'Blue Monkey',
    glyph: 'CHUEN',
    theme: 'Magic & Play',
    ability: 'Dynamic Improviser - Creative and flexible, excels in quick-thinking scenarios.',
    negativeModifier: 'Irresponsible Trickster - May take playfulness too far, causing disruption.',
    dndStats: { dexterity: 2, charisma: 1, intelligence: 0, wisdom: 0, strength: -1, constitution: -1 }
  },
  yellow_human: {
    name: 'Yellow Human',
    glyph: 'EB',
    theme: 'Free Will & Influence',
    ability: 'Empowerment Catalyst - Motivates others towards independence and autonomy.',
    negativeModifier: 'Manipulative Influence - Can unintentionally coerce others into decisions.',
    dndStats: { charisma: 2, intelligence: 1, wisdom: 0, dexterity: 0, strength: -1, constitution: -1 }
  },
  red_skywalker: {
    name: 'Red Skywalker',
    glyph: 'BEN',
    theme: 'Exploration & Space',
    ability: 'Boundary Pusher - Explores new ideas and challenges norms.',
    negativeModifier: 'Reckless Adventurer - May leap into new experiences without planning.',
    dndStats: { dexterity: 2, strength: 1, charisma: 0, intelligence: 0, wisdom: -1, constitution: -1 }
  },
  white_wizard: {
    name: 'White Wizard',
    glyph: 'IX',
    theme: 'Enchantment & Timelessness',
    ability: 'Wise Sage - Provides profound insights with quiet authority.',
    negativeModifier: 'Approval-Seeking - May rely on external validation for self-worth.',
    dndStats: { wisdom: 2, intelligence: 1, charisma: 0, constitution: 0, strength: -1, dexterity: -1 }
  },
  blue_eagle: {
    name: 'Blue Eagle',
    glyph: 'MEN',
    theme: 'Vision & Creation',
    ability: 'Strategic Visionary - Sees long-term outcomes and inspires direction.',
    negativeModifier: 'Detached Planner - Can become too focused on vision, neglecting present details.',
    dndStats: { intelligence: 2, wisdom: 1, charisma: 0, dexterity: 0, constitution: -1, strength: -1 }
  },
  yellow_warrior: {
    name: 'Yellow Warrior',
    glyph: 'CIB',
    theme: 'Intelligence & Questioning',
    ability: 'Analytical Strategist - Delves deeply into analysis and problem-solving.',
    negativeModifier: 'Cynical Critic - Can become overly critical, stifling creativity.',
    dndStats: { intelligence: 2, strength: 1, wisdom: 0, constitution: 0, charisma: -1, dexterity: -1 }
  },
  red_earth: {
    name: 'Red Earth',
    glyph: 'CABAN',
    theme: 'Navigation & Evolution',
    ability: 'Grounded Guide - Offers practical advice and mentorship through transitions.',
    negativeModifier: 'Stubbornly Fixed - May resist change, hindering growth.',
    dndStats: { constitution: 2, wisdom: 1, strength: 0, intelligence: 0, dexterity: -1, charisma: -1 }
  },
  white_mirror: {
    name: 'White Mirror',
    glyph: 'ETZNAB',
    theme: 'Reflection & Endlessness',
    ability: 'Reflective Observer - Encourages self-reflection and introspection.',
    negativeModifier: 'Self-Critical - Can become overly harsh on themselves and others.',
    dndStats: { wisdom: 2, intelligence: 1, constitution: 0, charisma: 0, strength: -1, dexterity: -1 }
  },
  blue_storm: {
    name: 'Blue Storm',
    glyph: 'CAUAC',
    theme: 'Self-Generation & Catalysis',
    ability: 'Self-Renewer - Adaptable and transformative, sparking change in others.',
    negativeModifier: 'Chaotic Disruptor - May create confusion or instability in their pursuit of change.',
    dndStats: { dexterity: 2, constitution: 1, charisma: 0, intelligence: 0, strength: -1, wisdom: -1 }
  },
  yellow_sun: {
    name: 'Yellow Sun',
    glyph: 'AHAU',
    theme: 'Enlightenment & Universal Fire',
    ability: 'Inspiring Luminary - Radiates warmth and insight, uplifting others.',
    negativeModifier: 'Overbearing Optimist - Can overlook practical issues due to excessive positivity.',
    dndStats: { charisma: 2, wisdom: 1, strength: 0, intelligence: 0, dexterity: -1, constitution: -1 }
  }
};

export const MAYAN_TONES = {
  magnetic: {
    name: 'Magnetic',
    number: 1,
    theme: 'Unity',
    approach: 'Unified Influence - Draws people together effortlessly, cultivating a sense of unity and purpose in groups.',
    negativeModifier: 'Coercive Unifier - May pressure others into conformity, undermining individual expression and autonomy.',
    dndModifier: { charisma: 1 }
  },
  lunar: {
    name: 'Lunar',
    number: 2,
    theme: 'Relationships & Polarity',
    approach: 'Balanced Opposer - Skilled at handling contrasting views, seeing both sides and helping find balance in conflict.',
    negativeModifier: 'Conflict Avoider - Can ignore real issues in relationships, leading to unresolved tensions and deeper conflicts.',
    dndModifier: { wisdom: 1 }
  },
  electric: {
    name: 'Electric',
    number: 3,
    theme: 'Rhythm & Change',
    approach: 'Dynamic Initiator - Instinctively brings energy and momentum to projects, excelling in dynamic environments where quick adaptability is needed.',
    negativeModifier: 'Erratic Initiator - May introduce change without consideration, creating confusion and instability.',
    dndModifier: { dexterity: 1 }
  },
  self_existing: {
    name: 'Self-Existing',
    number: 4,
    theme: 'Measure & Discipline',
    approach: 'Disciplined Planner - Grounded and methodical, skilled in maintaining focus and organization, often serving as the backbone in structured settings.',
    negativeModifier: 'Rigid Planner - Can become overly strict and inflexible, stifling creativity and adaptability.',
    dndModifier: { constitution: 1 }
  },
  overtone: {
    name: 'Overtone',
    number: 5,
    theme: 'Center & Core Purpose',
    approach: 'Purpose-Driven Leader - Centers actions around core values, inspiring others to connect with their own purpose and contribute meaningfully.',
    negativeModifier: 'Dogmatic Leader - May impose their vision on others without regard for their needs or perspectives.',
    dndModifier: { charisma: 1, strength: 1 }
  },
  rhythmic: {
    name: 'Rhythmic',
    number: 6,
    theme: 'Organic Balance',
    approach: 'Harmonizer - Naturally attuned to rhythms and cycles, they bring balance and flow to situations, excelling in roles requiring adaptability.',
    negativeModifier: 'Inconsistent Harmonizer - Can struggle to maintain balance, leading to chaotic or erratic dynamics.',
    dndModifier: { wisdom: 1, dexterity: 1 }
  },
  resonant: {
    name: 'Resonant',
    number: 7,
    theme: 'Mystical Power',
    approach: 'Insightful Mediator - Able to tune into subtleties and intuitively connect people, facilitating deeper understanding and empathy.',
    negativeModifier: 'Detached Mediator - May become so focused on intuition that they fail to address concrete issues, leaving others confused.',
    dndModifier: { wisdom: 1, charisma: 1 }
  },
  galactic: {
    name: 'Galactic',
    number: 8,
    theme: 'Harmonic Resonance',
    approach: 'Consensus Builder - Skilled in fostering harmony and teamwork, building cohesion by aligning group goals with individual motivations.',
    negativeModifier: 'Idealistic Consensus Builder - Can become unrealistic in seeking harmony, neglecting necessary conflict and growth.',
    dndModifier: { charisma: 1, intelligence: 1 }
  },
  solar: {
    name: 'Solar',
    number: 9,
    theme: 'Greater Cycles & Expansion',
    approach: 'Expansive Thinker - Has a natural knack for long-term planning, can see opportunities for growth, making them ideal strategists.',
    negativeModifier: 'Overly Ambitious Visionary - May overlook immediate needs in pursuit of grand visions, leading to frustration among team members.',
    dndModifier: { intelligence: 1, wisdom: 1 }
  },
  planetary: {
    name: 'Planetary',
    number: 10,
    theme: 'Manifestation',
    approach: 'Grounded Realist - Focused on practical outcomes and tangible results, excelling in roles that demand clear, measurable progress.',
    negativeModifier: 'Narrow Focused Realist - Can become overly concerned with practicality, stifling creativity and broader possibilities.',
    dndModifier: { constitution: 1, strength: 1 }
  },
  spectral: {
    name: 'Spectral',
    number: 11,
    theme: 'Dissonance & Letting Go',
    approach: 'Release Facilitator - Skilled in helping others let go of unproductive habits or beliefs, often creating transformative change through reflection.',
    negativeModifier: 'Dismissive Release Facilitator - May encourage letting go without adequate support, leaving individuals feeling abandoned.',
    dndModifier: { wisdom: 1, dexterity: 1 }
  },
  crystal: {
    name: 'Crystal',
    number: 12,
    theme: 'Complex Stability',
    approach: 'Systematic Stabilizer - Brings order to chaos, adept at establishing stable systems and clear protocols, often a key organizer in group efforts.',
    negativeModifier: 'Rigid Stabilizer - Can impose order to the detriment of creativity and flexibility, leading to resentment.',
    dndModifier: { intelligence: 1, constitution: 1 }
  },
  cosmic: {
    name: 'Cosmic',
    number: 13,
    theme: 'Universal Movement',
    approach: 'Visionary Conductor - Sees the broader picture and influences people towards a shared vision, acting as a guide for collective progress.',
    negativeModifier: 'Detached Visionary - May become too focused on the big picture, losing sight of individual needs and contributions.',
    dndModifier: { charisma: 1, intelligence: 1 }
  }
};

// Mayan calendar calculation (Tzolkin - 260-day cycle)
// The Tzolkin combines 20 day signs (seals) with 13 day numbers (tones)
// This creates a 260-day cycle (20 × 13 = 260)
// The calculation uses a reference date approach for simplicity
// For accurate calculations, users should use https://www.starroot.com/cgi/daycalc.pl
export function calculateMayanSign(date) {
  // Use a reference date: July 26, 2024 is Kin 1 (Red Dragon, Magnetic)
  // This allows us to calculate from a known point
  const referenceDate = new Date('2024-07-26');
  const referenceKin = 1; // Red Dragon, Magnetic
  
  const targetDate = new Date(date);
  
  // Calculate days difference
  const daysDiff = Math.floor((targetDate - referenceDate) / (1000 * 60 * 60 * 24));
  
  // Calculate Tzolkin day (1-260)
  // Add 260 to handle negative differences
  const tzolkinDay = ((referenceKin - 1 + daysDiff) % 260 + 260) % 260 + 1;
  
  // Seal number (1-20)
  const sealNumber = ((tzolkinDay - 1) % 20) + 1;
  
  // Tone number (1-13)
  const toneNumber = ((tzolkinDay - 1) % 13) + 1;
  
  const sealNames = [
    'red_dragon', 'white_wind', 'blue_night', 'yellow_seed', 'red_serpent',
    'white_world_bridger', 'blue_hand', 'yellow_star', 'red_moon', 'white_dog',
    'blue_monkey', 'yellow_human', 'red_skywalker', 'white_wizard', 'blue_eagle',
    'yellow_warrior', 'red_earth', 'white_mirror', 'blue_storm', 'yellow_sun'
  ];
  
  const toneNames = [
    'magnetic', 'lunar', 'electric', 'self_existing', 'overtone',
    'rhythmic', 'resonant', 'galactic', 'solar', 'planetary',
    'spectral', 'crystal', 'cosmic'
  ];
  
  return {
    seal: sealNames[sealNumber - 1],
    tone: toneNames[toneNumber - 1],
    kin: tzolkinDay
  };
}

