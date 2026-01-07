// Character Sheet Generator Engine
// Translates astrological data into D&D-style character sheets

import { WESTERN_SIGNS, ELEMENTS, MODALITIES, getWesternSign } from './character-sheet-data/western-astrology.js';
import { CHINESE_ANIMALS, CHINESE_ELEMENTS, getChineseAnimal, getChineseElement } from './character-sheet-data/chinese-astrology.js';
import { MAYAN_SEALS, MAYAN_TONES, calculateMayanSign, getMayanSignDisplayName } from './character-sheet-data/mayan-astrology.js';

export class CharacterSheetEngine {
  constructor() {
    this.characterData = null;
    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    const generateBtn = document.getElementById('generateCharacter');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateCharacter());
    }

    const newCharacterBtn = document.getElementById('newCharacter');
    if (newCharacterBtn) {
      newCharacterBtn.addEventListener('click', () => this.resetForm());
    }

    const exportBtn = document.getElementById('exportCharacter');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCharacter());
    }

    // Auto-calculate Sun sign when date changes
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
      birthDateInput.addEventListener('change', () => this.calculateSunSign());
    }
  }

  calculateSunSign() {
    const birthDateInput = document.getElementById('birthDate');
    const sunSignInput = document.getElementById('sunSign');
    
    if (birthDateInput && sunSignInput && birthDateInput.value) {
      const date = new Date(birthDateInput.value);
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const day = date.getDate();
      const signKey = getWesternSign(month, day);
      
      if (signKey && WESTERN_SIGNS[signKey]) {
        sunSignInput.value = WESTERN_SIGNS[signKey].name;
      }
    }
  }

  generateCharacter() {
    // Collect form data
    const formData = this.collectFormData();
    
    if (!this.validateFormData(formData)) {
      return;
    }

    // Calculate all astrological data
    const astrologyData = this.calculateAstrology(formData);
    
    // Generate character sheet
    this.characterData = this.buildCharacterSheet(formData, astrologyData);
    
    // Display results
    this.displayCharacterSheet(this.characterData);
    
    // Show results section
    this.showResults();
  }

  collectFormData() {
    return {
      name: document.getElementById('characterName')?.value || 'Adventurer',
      birthDate: document.getElementById('birthDate')?.value,
      birthTime: document.getElementById('birthTime')?.value || '12:00',
      birthLocation: document.getElementById('birthLocation')?.value || '',
      sunSign: document.getElementById('sunSign')?.value || '',
      moonSign: document.getElementById('moonSign')?.value || '',
      ascendantSign: document.getElementById('ascendantSign')?.value || '',
      mayanSign: document.getElementById('mayanSign')?.value || ''
    };
  }

  validateFormData(formData) {
    if (!formData.birthDate) {
      alert('Please enter your birth date.');
      return false;
    }
    
    if (!formData.sunSign) {
      alert('Please enter your Sun sign (or select a birth date to auto-calculate).');
      return false;
    }

    return true;
  }

  calculateAstrology(formData) {
    const birthDate = new Date(formData.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    // Western Astrology
    const sunSignKey = Object.keys(WESTERN_SIGNS).find(
      key => WESTERN_SIGNS[key].name.toLowerCase() === formData.sunSign.toLowerCase()
    );
    const sunSign = sunSignKey ? WESTERN_SIGNS[sunSignKey] : null;

    const moonSignKey = formData.moonSign ? Object.keys(WESTERN_SIGNS).find(
      key => WESTERN_SIGNS[key].name.toLowerCase() === formData.moonSign.toLowerCase()
    ) : null;
    const moonSign = moonSignKey ? WESTERN_SIGNS[moonSignKey] : null;

    const ascendantSignKey = formData.ascendantSign ? Object.keys(WESTERN_SIGNS).find(
      key => WESTERN_SIGNS[key].name.toLowerCase() === formData.ascendantSign.toLowerCase()
    ) : null;
    const ascendantSign = ascendantSignKey ? WESTERN_SIGNS[ascendantSignKey] : null;

    // Chinese Astrology
    const chineseAnimal = getChineseAnimal(year);
    const chineseElement = getChineseElement(year);
    const chineseAnimalData = CHINESE_ANIMALS[chineseAnimal];
    const chineseElementData = CHINESE_ELEMENTS[chineseElement];

    // Mayan Astrology - check for manual input first
    let mayanSeal = null;
    let mayanTone = null;
    let mayanKin = null;
    
    if (formData.mayanSign) {
      // Parse manual input (e.g., "White Solar Wind")
      const parsed = this.parseMayanSign(formData.mayanSign);
      if (parsed) {
        mayanSeal = parsed.seal;
        mayanTone = parsed.tone;
        mayanKin = parsed.kin || 'Unknown';
      }
    }
    
    // If no manual input or parsing failed, calculate automatically
    if (!mayanSeal || !mayanTone) {
      const mayanData = calculateMayanSign(birthDate);
      mayanSeal = MAYAN_SEALS[mayanData.seal];
      mayanTone = MAYAN_TONES[mayanData.tone];
      mayanKin = mayanData.kin;
    }

    return {
      western: {
        sun: sunSign,
        moon: moonSign,
        ascendant: ascendantSign
      },
      chinese: {
        animal: chineseAnimalData,
        element: chineseElementData
      },
      mayan: {
        seal: mayanSeal,
        tone: mayanTone,
        kin: mayanKin
      }
    };
  }

  parseMayanSign(input) {
    // Parse format: "Color Tone Seal" (e.g., "White Solar Wind", "Yellow Cosmic Star")
    const parts = input.trim().split(/\s+/);
    if (parts.length < 3) return null;
    
    const color = parts[0]; // "White", "Yellow", "Blue", "Red"
    const toneName = parts[1]; // "Solar", "Cosmic", "Magnetic", etc.
    const sealName = parts.slice(2).join(' '); // "Wind", "Star", "Hand", etc.
    
    // Find matching seal
    const sealKey = Object.keys(MAYAN_SEALS).find(key => {
      const seal = MAYAN_SEALS[key];
      return seal.name.toLowerCase().includes(sealName.toLowerCase()) && 
             seal.name.toLowerCase().startsWith(color.toLowerCase());
    });
    
    // Find matching tone
    const toneKey = Object.keys(MAYAN_TONES).find(key => {
      const tone = MAYAN_TONES[key];
      return tone.name.toLowerCase() === toneName.toLowerCase();
    });
    
    if (sealKey && toneKey) {
      return {
        seal: MAYAN_SEALS[sealKey],
        tone: MAYAN_TONES[toneKey],
        kin: null // Kin number not provided in manual input
      };
    }
    
    return null;
  }

  buildCharacterSheet(formData, astrologyData) {
    // Calculate D&D stats from astrological data
    const baseStats = this.calculateBaseStats(astrologyData);
    
    // Determine Race, Class, and Backstory
    const race = this.determineRace(astrologyData);
    const characterClass = this.determineClass(astrologyData);
    const backstory = this.generateBackstory(formData, astrologyData, race, characterClass);
    
    // Generate Proficiencies, Traits, Saving Throws, Skills
    const proficiencies = this.generateProficiencies(astrologyData, characterClass);
    const traits = this.generateTraits(astrologyData);
    const savingThrows = this.generateSavingThrows(baseStats, characterClass);
    const skills = this.generateSkills(baseStats, astrologyData, characterClass);
    
    // Generate Class Features
    const classFeatures = this.generateClassFeatures(astrologyData, characterClass);
    
    // Generate Flaws
    const flaws = this.generateFlaws(astrologyData);

    return {
      name: formData.name,
      race,
      characterClass,
      backstory,
      baseStats,
      proficiencies,
      traits,
      savingThrows,
      skills,
      classFeatures,
      flaws,
      astrologyData,
      timestamp: new Date().toISOString()
    };
  }

  calculateBaseStats(astrologyData) {
    // Start with base stats (all 0)
    const stats = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    };

    // Add Sun sign modifiers (primary influence)
    if (astrologyData.western.sun) {
      Object.keys(stats).forEach(stat => {
        stats[stat] += astrologyData.western.sun.dndStats[stat] || 0;
      });
    }

    // Add Moon sign modifiers (secondary influence, 50% weight)
    if (astrologyData.western.moon) {
      Object.keys(stats).forEach(stat => {
        stats[stat] += Math.round((astrologyData.western.moon.dndStats[stat] || 0) * 0.5);
      });
    }

    // Add Ascendant modifiers (tertiary influence, 25% weight)
    if (astrologyData.western.ascendant) {
      Object.keys(stats).forEach(stat => {
        stats[stat] += Math.round((astrologyData.western.ascendant.dndStats[stat] || 0) * 0.25);
      });
    }

    // Add Chinese animal modifiers (25% weight)
    if (astrologyData.chinese.animal) {
      Object.keys(stats).forEach(stat => {
        stats[stat] += Math.round((astrologyData.chinese.animal.dndStats[stat] || 0) * 0.25);
      });
    }

    // Add Chinese element modifiers
    if (astrologyData.chinese.element) {
      Object.keys(astrologyData.chinese.element.dndModifier || {}).forEach(stat => {
        stats[stat] = (stats[stat] || 0) + (astrologyData.chinese.element.dndModifier[stat] || 0);
      });
    }

    // Add Mayan seal modifiers (25% weight)
    if (astrologyData.mayan.seal) {
      Object.keys(stats).forEach(stat => {
        stats[stat] += Math.round((astrologyData.mayan.seal.dndStats[stat] || 0) * 0.25);
      });
    }

    // Add Mayan tone modifiers
    if (astrologyData.mayan.tone) {
      Object.keys(astrologyData.mayan.tone.dndModifier || {}).forEach(stat => {
        stats[stat] = (stats[stat] || 0) + (astrologyData.mayan.tone.dndModifier[stat] || 0);
      });
    }

    // Normalize to maximum 10 points total
    const totalPoints = Object.values(stats).reduce((sum, val) => sum + Math.max(0, val), 0);
    if (totalPoints > 10) {
      const scaleFactor = 10 / totalPoints;
      Object.keys(stats).forEach(stat => {
        stats[stat] = Math.round(stats[stat] * scaleFactor);
      });
    }

    // Ensure no stat goes below -2 or above 5
    Object.keys(stats).forEach(stat => {
      stats[stat] = Math.max(-2, Math.min(5, stats[stat]));
    });

    return stats;
  }

  determineRace(astrologyData) {
    // Race is determined primarily by Chinese element
    const element = astrologyData.chinese.element?.name || 'Earth';
    
    const raceMap = {
      'Wood': 'Elf',
      'Fire': 'Tiefling',
      'Earth': 'Dwarf',
      'Metal': 'Warforged',
      'Water': 'Triton'
    };

    return raceMap[element] || 'Human';
  }

  determineClass(astrologyData) {
    // Class is determined by the highest stat and astrological influences
    const stats = this.calculateBaseStats(astrologyData);
    const maxStat = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
    
    const classMap = {
      'strength': 'Fighter',
      'dexterity': 'Rogue',
      'constitution': 'Barbarian',
      'intelligence': 'Wizard',
      'wisdom': 'Cleric',
      'charisma': 'Bard'
    };

    // Special cases based on astrological combinations
    if (astrologyData.western.sun?.element === 'Fire' && astrologyData.mayan.seal?.name.includes('Dragon')) {
      return 'Paladin';
    }
    if (astrologyData.western.sun?.element === 'Water' && astrologyData.mayan.seal?.name.includes('Moon')) {
      return 'Druid';
    }
    if (astrologyData.western.sun?.modality === 'Mutable' && astrologyData.chinese.animal?.name === 'Monkey') {
      return 'Monk';
    }

    return classMap[maxStat] || 'Ranger';
  }

  generateBackstory(formData, astrologyData, race, characterClass) {
    const sunSign = astrologyData.western.sun;
    const moonSign = astrologyData.western.moon;
    const ascendantSign = astrologyData.western.ascendant;
    const chineseAnimal = astrologyData.chinese.animal;
    const chineseElement = astrologyData.chinese.element;
    const mayanSeal = astrologyData.mayan.seal;
    const mayanTone = astrologyData.mayan.tone;
    const mayanDisplay = getMayanSignDisplayName(astrologyData.mayan.seal?.id || '', astrologyData.mayan.tone?.name || '');
    
    // Create a more narrative, innovative backstory
    const narratives = [];
    
    // Opening - character origin
    narratives.push(`${formData.name} emerged into the world as a ${race}, their essence shaped by cosmic forces that converged at the moment of their birth.`);
    
    // Sun sign - core identity
    if (sunSign) {
      const sunTrait = sunSign.keyTraits[Math.floor(Math.random() * sunSign.keyTraits.length)];
      narratives.push(`Born under the ${sunSign.name} Sun, their fundamental nature is ${sunTrait.toLowerCase()}, driving them toward ${sunSign.keyTraits.filter(t => t !== sunTrait)[0].toLowerCase()} in all endeavors.`);
    }
    
    // Moon sign - inner world
    if (moonSign) {
      narratives.push(`Beneath the surface, the ${moonSign.name} Moon illuminates their inner landscape, making them deeply ${moonSign.keyTraits[0].toLowerCase()} and ${moonSign.keyTraits[1].toLowerCase()}, though this emotional depth often remains hidden from casual observers.`);
    }
    
    // Ascendant - outward expression
    if (ascendantSign) {
      narratives.push(`To the world, they present as ${ascendantSign.name} rising—${ascendantSign.keyTraits[0].toLowerCase()} and ${ascendantSign.keyTraits[1].toLowerCase()}, a mask that both protects and reveals their true nature.`);
    }
    
    // Chinese astrology - earthly influence
    if (chineseAnimal && chineseElement) {
      narratives.push(`In the year of the ${chineseElement.name} ${chineseAnimal.name}, earthly forces granted them ${chineseAnimal.keyTraits[0].toLowerCase()} and ${chineseAnimal.keyTraits[1].toLowerCase()}, while the ${chineseElement.name.toLowerCase()} element flows through their ${chineseElement.traits[0].toLowerCase()} nature.`);
    }
    
    // Mayan seal - galactic signature
    if (mayanSeal && mayanTone) {
      narratives.push(`Their galactic signature, ${mayanDisplay}, marks them as one who ${mayanSeal.ability.split(' - ')[1]?.toLowerCase() || mayanSeal.ability.toLowerCase()}, while the ${mayanTone.name} tone shapes their approach: ${mayanTone.approach.split(' - ')[1]?.toLowerCase() || mayanTone.approach.toLowerCase()}.`);
    }
    
    // Class connection
    narratives.push(`These converging influences naturally led ${formData.name} to the path of the ${characterClass}, where their unique combination of ${sunSign?.keyTraits[0]?.toLowerCase() || 'abilities'} and ${moonSign?.keyTraits[0]?.toLowerCase() || 'insights'} finds its fullest expression.`);
    
    // Closing - destiny
    narratives.push(`Their journey is one of integration—learning to harmonize the ${sunSign?.element?.toLowerCase() || 'elemental'} fire of their Sun with the ${moonSign?.element?.toLowerCase() || 'emotional'} waters of their Moon, while the ${mayanDisplay} signature guides them toward their galactic purpose.`);
    
    return narratives.join(' ');
  }

  generateProficiencies(astrologyData, characterClass) {
    const proficiencies = [];
    
    // Base class proficiencies
    const classProficiencies = {
      'Fighter': ['Armor (All)', 'Shields', 'Simple Weapons', 'Martial Weapons'],
      'Rogue': ['Light Armor', 'Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
      'Barbarian': ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'],
      'Wizard': ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'],
      'Cleric': ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons'],
      'Bard': ['Light Armor', 'Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
      'Paladin': ['Armor (All)', 'Shields', 'Simple Weapons', 'Martial Weapons'],
      'Druid': ['Light Armor', 'Medium Armor', 'Shields', 'Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
      'Monk': ['Simple Weapons', 'Shortswords'],
      'Ranger': ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons']
    };
    
    if (classProficiencies[characterClass]) {
      proficiencies.push(...classProficiencies[characterClass]);
    }
    
    // Add astrological proficiencies
    if (astrologyData.western.sun?.element === 'Fire') {
      proficiencies.push('Intimidation');
    }
    if (astrologyData.western.sun?.element === 'Water') {
      proficiencies.push('Insight');
    }
    if (astrologyData.western.sun?.element === 'Air') {
      proficiencies.push('Investigation');
    }
    if (astrologyData.western.sun?.element === 'Earth') {
      proficiencies.push('Survival');
    }
    
    return [...new Set(proficiencies)]; // Remove duplicates
  }

  generateTraits(astrologyData) {
    const traits = [];
    
    // Sun sign traits
    if (astrologyData.western.sun) {
      astrologyData.western.sun.keyTraits.forEach(trait => {
        traits.push({
          name: trait,
          source: `Sun Sign (${astrologyData.western.sun.name})`,
          modifier: '+1'
        });
      });
    }
    
    // Mayan seal ability
    if (astrologyData.mayan.seal) {
      traits.push({
        name: astrologyData.mayan.seal.ability.split(' - ')[0],
        source: `Mayan Seal (${astrologyData.mayan.seal.name})`,
        modifier: '+2'
      });
    }
    
    return traits;
  }

  generateSavingThrows(baseStats, characterClass) {
    const savingThrows = [];
    
    // Class saving throw proficiencies
    const classSaves = {
      'Fighter': ['strength', 'constitution'],
      'Rogue': ['dexterity', 'intelligence'],
      'Barbarian': ['strength', 'constitution'],
      'Wizard': ['intelligence', 'wisdom'],
      'Cleric': ['wisdom', 'charisma'],
      'Bard': ['dexterity', 'charisma'],
      'Paladin': ['wisdom', 'charisma'],
      'Druid': ['intelligence', 'wisdom'],
      'Monk': ['strength', 'dexterity'],
      'Ranger': ['strength', 'dexterity']
    };
    
    const proficientSaves = classSaves[characterClass] || [];
    
    Object.keys(baseStats).forEach(stat => {
      const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
      const isProficient = proficientSaves.includes(stat);
      const modifier = baseStats[stat] + (isProficient ? 2 : 0); // Proficiency bonus
      
      savingThrows.push({
        name: statName,
        modifier: modifier >= 0 ? `+${modifier}` : `${modifier}`,
        proficient: isProficient
      });
    });
    
    return savingThrows;
  }

  generateSkills(baseStats, astrologyData, characterClass) {
    const allSkills = [
      { name: 'Acrobatics', ability: 'dexterity' },
      { name: 'Animal Handling', ability: 'wisdom' },
      { name: 'Arcana', ability: 'intelligence' },
      { name: 'Athletics', ability: 'strength' },
      { name: 'Deception', ability: 'charisma' },
      { name: 'History', ability: 'intelligence' },
      { name: 'Insight', ability: 'wisdom' },
      { name: 'Intimidation', ability: 'charisma' },
      { name: 'Investigation', ability: 'intelligence' },
      { name: 'Medicine', ability: 'wisdom' },
      { name: 'Nature', ability: 'wisdom' },
      { name: 'Perception', ability: 'wisdom' },
      { name: 'Performance', ability: 'charisma' },
      { name: 'Persuasion', ability: 'charisma' },
      { name: 'Religion', ability: 'intelligence' },
      { name: 'Sleight of Hand', ability: 'dexterity' },
      { name: 'Stealth', ability: 'dexterity' },
      { name: 'Survival', ability: 'wisdom' }
    ];
    
    const skills = [];
    
    // Determine skill proficiencies based on class and astrology
    const proficientSkills = this.determineSkillProficiencies(astrologyData, characterClass);
    
    allSkills.forEach(skill => {
      const isProficient = proficientSkills.includes(skill.name);
      const abilityModifier = baseStats[skill.ability];
      const proficiencyBonus = isProficient ? 2 : 0;
      const totalModifier = abilityModifier + proficiencyBonus;
      
      skills.push({
        name: skill.name,
        ability: skill.ability.charAt(0).toUpperCase() + skill.ability.slice(1),
        modifier: totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`,
        proficient: isProficient
      });
    });
    
    return skills;
  }

  determineSkillProficiencies(astrologyData, characterClass) {
    const proficiencies = [];
    
    // Class-based skill proficiencies
    const classSkills = {
      'Fighter': ['Athletics', 'Intimidation'],
      'Rogue': ['Acrobatics', 'Deception', 'Stealth', 'Sleight of Hand'],
      'Barbarian': ['Athletics', 'Intimidation', 'Survival'],
      'Wizard': ['Arcana', 'History', 'Investigation'],
      'Cleric': ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
      'Bard': ['Any 3'],
      'Paladin': ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
      'Druid': ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
      'Monk': ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
      'Ranger': ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival']
    };
    
    if (classSkills[characterClass]) {
      proficiencies.push(...classSkills[characterClass]);
    }
    
    // Astrological skill bonuses
    if (astrologyData.western.sun?.element === 'Air') {
      proficiencies.push('Investigation', 'History');
    }
    if (astrologyData.western.sun?.element === 'Water') {
      proficiencies.push('Insight', 'Perception');
    }
    if (astrologyData.chinese.animal?.name === 'Monkey') {
      proficiencies.push('Sleight of Hand', 'Acrobatics');
    }
    
    return [...new Set(proficiencies)];
  }

  generateClassFeatures(astrologyData, characterClass) {
    const features = [];
    
    // Base class features
    const baseFeatures = {
      'Fighter': {
        'Fighting Style': 'Choose a fighting style that reflects your combat approach.',
        'Second Wind': 'Once per short rest, regain 1d10 + Fighter level hit points as a bonus action.'
      },
      'Rogue': {
        'Sneak Attack': 'Once per turn, deal extra 1d6 damage when you have advantage or an ally is within 5 feet.',
        'Thieves\' Cant': 'You know the secret language of thieves.'
      },
      'Wizard': {
        'Spellcasting': 'You can cast wizard spells using Intelligence as your spellcasting ability.',
        'Arcane Recovery': 'Once per day, recover spell slots during a short rest.'
      },
      'Cleric': {
        'Spellcasting': 'You can cast cleric spells using Wisdom as your spellcasting ability.',
        'Divine Domain': 'Choose a domain that reflects your deity\'s influence.'
      },
      'Bard': {
        'Spellcasting': 'You can cast bard spells using Charisma as your spellcasting ability.',
        'Bardic Inspiration': 'Grant allies 1d6 inspiration die as a bonus action, usable a number of times equal to your Charisma modifier.'
      }
    };
    
    if (baseFeatures[characterClass]) {
      Object.entries(baseFeatures[characterClass]).forEach(([name, description]) => {
        features.push({ name, description, frequency: 'Varies' });
      });
    }
    
    // Add astrological class features
    if (astrologyData.mayan.seal) {
      features.push({
        name: astrologyData.mayan.seal.ability.split(' - ')[0],
        description: astrologyData.mayan.seal.ability,
        frequency: 'At will'
      });
    }
    
    if (astrologyData.mayan.tone) {
      features.push({
        name: astrologyData.mayan.tone.approach.split(' - ')[0],
        description: astrologyData.mayan.tone.approach,
        frequency: 'At will'
      });
    }
    
    return features;
  }

  generateFlaws(astrologyData) {
    const flaws = [];
    
    // Sun sign challenges
    if (astrologyData.western.sun) {
      astrologyData.western.sun.challenges.forEach(challenge => {
        flaws.push({
          name: challenge,
          source: `Sun Sign (${astrologyData.western.sun.name})`,
          modifier: '-1'
        });
      });
    }
    
    // Mayan seal negative modifier
    if (astrologyData.mayan.seal) {
      flaws.push({
        name: astrologyData.mayan.seal.negativeModifier.split(' - ')[0],
        source: `Mayan Seal (${astrologyData.mayan.seal.name})`,
        modifier: '-1'
      });
    }
    
    // Chinese animal challenges
    if (astrologyData.chinese.animal) {
      flaws.push({
        name: astrologyData.chinese.animal.challenges[0],
        source: `Chinese Animal (${astrologyData.chinese.animal.name})`,
        modifier: '-1'
      });
    }
    
    return flaws;
  }

  displayCharacterSheet(character) {
    const resultsContainer = document.getElementById('characterSheetResults');
    if (!resultsContainer) return;

    // Format Mayan sign display
    const mayanDisplay = getMayanSignDisplayName(
      character.astrologyData.mayan.seal?.name?.toLowerCase().replace(/\s+/g, '_').replace('-', '_') || '',
      character.astrologyData.mayan.tone?.name || ''
    );
    
    // Format Chinese sign display
    const chineseDisplay = character.astrologyData.chinese.element?.name && character.astrologyData.chinese.animal?.name
      ? `${character.astrologyData.chinese.element.name} ${character.astrologyData.chinese.animal.name}`
      : 'Unknown';
    
    let html = `
      <div class="character-sheet">
        <h2>${character.name}</h2>
        <p class="character-subtitle">${character.race} ${character.characterClass}</p>
        
        <section class="astrology-summary" style="background: var(--bg); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid var(--brand);">
          <h3 style="margin-top: 0; color: var(--brand);">Astrological Profile</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <p style="margin: 0.25rem 0;"><strong>Western:</strong> ${character.astrologyData.western.sun?.name || 'Unknown'} Sun${character.astrologyData.western.moon ? `, ${character.astrologyData.western.moon.name} Moon` : ''}${character.astrologyData.western.ascendant ? `, ${character.astrologyData.western.ascendant.name} Ascendant` : ''}</p>
            </div>
            <div>
              <p style="margin: 0.25rem 0;"><strong>Chinese:</strong> ${chineseDisplay}</p>
            </div>
            <div>
              <p style="margin: 0.25rem 0;"><strong>Mayan:</strong> ${mayanDisplay || 'Unknown'}</p>
            </div>
          </div>
        </section>
        
        <section class="character-overview">
          <h3>Character Overview</h3>
          <p><strong>Race:</strong> ${character.race}</p>
          <p><strong>Class:</strong> ${character.characterClass}</p>
          <p><strong>Backstory:</strong> ${character.backstory}</p>
        </section>
        
        <section class="base-stats">
          <h3>Base Stats</h3>
          <p class="stat-note">Maximum of 10 points combined</p>
          <div class="stats-grid">
            ${Object.entries(character.baseStats).map(([stat, value]) => `
              <div class="stat-item">
                <span class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <span class="stat-value">${value >= 0 ? '+' : ''}${value}</span>
              </div>
            `).join('')}
          </div>
        </section>
        
        <section class="proficiencies">
          <h3>Proficiencies</h3>
          <ul>
            ${character.proficiencies.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </section>
        
        <section class="traits">
          <h3>Traits</h3>
          <table>
            <thead>
              <tr>
                <th>Trait</th>
                <th>Source</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              ${character.traits.map(t => `
                <tr>
                  <td>${t.name}</td>
                  <td>${t.source}</td>
                  <td>${t.modifier}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
        
        <section class="saving-throws">
          <h3>Saving Throws</h3>
          <table>
            <thead>
              <tr>
                <th>Ability</th>
                <th>Modifier</th>
                <th>Proficient</th>
              </tr>
            </thead>
            <tbody>
              ${character.savingThrows.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.modifier}</td>
                  <td>${s.proficient ? '✓' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
        
        <section class="skills">
          <h3>Skills</h3>
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Ability</th>
                <th>Modifier</th>
                <th>Proficient</th>
              </tr>
            </thead>
            <tbody>
              ${character.skills.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.ability}</td>
                  <td>${s.modifier}</td>
                  <td>${s.proficient ? '✓' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
        
        <section class="class-features">
          <h3>Class Features</h3>
          ${character.classFeatures.map(f => `
            <div class="feature-item">
              <h4>${f.name}</h4>
              <p><strong>Frequency:</strong> ${f.frequency}</p>
              <p>${f.description}</p>
            </div>
          `).join('')}
        </section>
        
        <section class="flaws">
          <h3>Character Flaws</h3>
          ${character.flaws.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Flaw</th>
                  <th>Source</th>
                  <th>Modifier</th>
                </tr>
              </thead>
              <tbody>
                ${character.flaws.map(f => `
                  <tr>
                    <td>${f.name}</td>
                    <td>${f.source}</td>
                    <td>${f.modifier}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>No significant flaws identified.</p>'}
        </section>
        
        <section class="astrology-reference">
          <h3>Astrological Reference</h3>
          <div class="astrology-details">
            <div class="western-astro">
              <h4>Western Astrology</h4>
              <p><strong>Sun:</strong> ${character.astrologyData.western.sun?.name || 'Not provided'}</p>
              ${character.astrologyData.western.moon ? `<p><strong>Moon:</strong> ${character.astrologyData.western.moon.name}</p>` : ''}
              ${character.astrologyData.western.ascendant ? `<p><strong>Ascendant:</strong> ${character.astrologyData.western.ascendant.name}</p>` : ''}
            </div>
            <div class="chinese-astro">
              <h4>Chinese Astrology</h4>
              <p><strong>Animal:</strong> ${character.astrologyData.chinese.animal?.name || 'Unknown'}</p>
              <p><strong>Element:</strong> ${character.astrologyData.chinese.element?.name || 'Unknown'}</p>
            </div>
            <div class="mayan-astro">
              <h4>Mayan Astrology (Dreamspell)</h4>
              <p><strong>Galactic Signature:</strong> ${getMayanSignDisplayName(character.astrologyData.mayan.seal?.id || character.astrologyData.mayan.seal?.name?.toLowerCase().replace(/\s+/g, '_') || '', character.astrologyData.mayan.tone?.name || '') || 'Unknown'}</p>
              <p><strong>Kin:</strong> ${character.astrologyData.mayan.kin || 'Unknown'}</p>
            </div>
          </div>
        </section>
      </div>
    `;

    resultsContainer.innerHTML = html;
  }

  showResults() {
    const formSection = document.getElementById('characterFormSection');
    const resultsSection = document.getElementById('characterSheetResults');
    
    if (formSection) formSection.style.display = 'none';
    if (resultsSection) {
      resultsSection.style.display = 'block';
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  resetForm() {
    document.getElementById('characterForm')?.reset();
    const formSection = document.getElementById('characterFormSection');
    const resultsSection = document.getElementById('characterSheetResults');
    
    if (formSection) formSection.style.display = 'block';
    if (resultsSection) resultsSection.style.display = 'none';
    
    this.characterData = null;
  }

  exportCharacter() {
    if (!this.characterData) {
      alert('No character to export. Please generate a character first.');
      return;
    }

    const dataStr = JSON.stringify(this.characterData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.characterData.name.replace(/\s+/g, '_')}_character_sheet.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

