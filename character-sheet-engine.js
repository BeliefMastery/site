// Character Sheet Generator Engine - Version 2.0
// Translates astrological data into D&D-style character sheets
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { TIMEZONES } from './shared/timezones.js';

// Data modules - will be loaded lazily
let WESTERN_SIGNS, ELEMENTS, MODALITIES, getWesternSign;
let CHINESE_ANIMALS, CHINESE_ELEMENTS, getChineseAnimal, getChineseElement;
let MAYAN_SEALS, MAYAN_TONES, calculateMayanSign, getMayanSignDisplayName;
let Astronomy = null;

/**
 * Character Sheet Engine - Generates D&D-style character sheets from astrological data
 */
export class CharacterSheetEngine {
  /**
   * Initialize the character sheet engine
   */
  constructor() {
    this.characterData = null;
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('CharacterSheetEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('character-sheet', '1.0.0');
    
    this.init();
  }

  /**
   * Initialize the engine
   */
  init() {
    this.attachEventListeners();
    this.populateTimezones();
    if (this.shouldAutoGenerateSample()) {
      this.generateSampleReport();
    }
  }
  populateTimezones() {
    const select = document.getElementById('timeZone');
    if (!select || !Array.isArray(TIMEZONES)) return;
    if (select.options.length > 1) return;

    TIMEZONES.forEach((tz) => {
      const option = document.createElement('option');
      const countries = Array.isArray(tz.countries) ? tz.countries.join(', ') : '';
      option.value = tz.name;
      option.textContent = countries ? `${tz.name} (${countries})` : tz.name;
      select.appendChild(option);
    });
  }

  getSampleTimeZone() {
    const candidates = ['Etc/UTC', 'UTC', 'Europe/London'];
    const timeZoneList = Array.isArray(TIMEZONES) ? TIMEZONES : [];
    const match = candidates.find((candidate) => timeZoneList.some((tz) => tz.name === candidate));
    return match || timeZoneList[0]?.name || '';
  }

  /**
   * Load astrological data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadAstrologyData() {
    if (WESTERN_SIGNS && CHINESE_ANIMALS && MAYAN_SEALS) {
      return; // Already loaded
    }

    try {
      // Load Western astrology data
      const westernModule = await loadDataModule(
        './character-sheet-data/western-astrology.js',
        'Western Astrology'
      );
      WESTERN_SIGNS = westernModule.WESTERN_SIGNS;
      ELEMENTS = westernModule.ELEMENTS;
      MODALITIES = westernModule.MODALITIES;
      getWesternSign = westernModule.getWesternSign;

      // Load Chinese astrology data
      const chineseModule = await loadDataModule(
        './character-sheet-data/chinese-astrology.js',
        'Chinese Astrology'
      );
      CHINESE_ANIMALS = chineseModule.CHINESE_ANIMALS;
      CHINESE_ELEMENTS = chineseModule.CHINESE_ELEMENTS;
      getChineseAnimal = chineseModule.getChineseAnimal;
      getChineseElement = chineseModule.getChineseElement;

      // Load Mayan astrology data
      const mayanModule = await loadDataModule(
        './character-sheet-data/mayan-astrology.js',
        'Mayan Astrology'
      );
      MAYAN_SEALS = mayanModule.MAYAN_SEALS;
      MAYAN_TONES = mayanModule.MAYAN_TONES;
      calculateMayanSign = mayanModule.calculateMayanSign;
      getMayanSignDisplayName = mayanModule.getMayanSignDisplayName;

      this.debugReporter.logEvent('DataLoader', 'All astrology data loaded successfully');
    } catch (error) {
      this.debugReporter.logError(error, 'loadAstrologyData');
      ErrorHandler.showUserError('Failed to load astrology data. Please refresh the page.');
      throw error;
    }
  }

  async loadAstronomyEngine() {
    if (Astronomy) return;

    try {
      const module = await import('https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/+esm');
      Astronomy = module;
      this.debugReporter.logEvent('AstronomyEngine', 'Astronomy engine loaded');
    } catch (error) {
      this.debugReporter.logError(error, 'loadAstronomyEngine');
      ErrorHandler.showUserError('Failed to load astronomy engine. Please check your connection and try again.');
      throw error;
    }
  }

  normalizeDegrees(value) {
    const normalized = ((value % 360) + 360) % 360;
    return normalized;
  }

  getZodiacFromLongitude(longitude) {
    const zodiacOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const index = Math.floor(this.normalizeDegrees(longitude) / 30);
    const signKey = zodiacOrder[index] || null;
    return signKey && WESTERN_SIGNS[signKey] ? WESTERN_SIGNS[signKey].name : '';
  }

  getTimeZoneOffsetMinutes(date, timeZone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    const tzDate = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    );
    return (tzDate - date.getTime()) / 60000;
  }

  createUtcDateFromInputs(birthDateValue, birthTimeValue, timeZone) {
    const [year, month, day] = birthDateValue.split('-').map(Number);
    const [hour = 12, minute = 0] = (birthTimeValue || '12:00').split(':').map(Number);
    const assumedUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const offsetMinutes = this.getTimeZoneOffsetMinutes(assumedUtc, timeZone);
    return new Date(assumedUtc.getTime() - offsetMinutes * 60000);
  }

  calculateObliquityDegrees(julianDate) {
    const T = (julianDate - 2451545.0) / 36525;
    return 23.43929111
      - 0.0130041667 * T
      - 1.6667e-7 * T * T
      + 5.027e-7 * T * T * T;
  }

  calculateJulianDate(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  calculateAscendantLongitude(julianDate, latitude, longitude) {
    const T = (julianDate - 2451545.0) / 36525;
    const gmst = 280.46061837
      + 360.98564736629 * (julianDate - 2451545.0)
      + 0.000387933 * T * T
      - (T * T * T) / 38710000;
    const lst = this.normalizeDegrees(gmst + longitude);

    const lstRad = lst * (Math.PI / 180);
    const latRad = latitude * (Math.PI / 180);
    const epsRad = this.calculateObliquityDegrees(julianDate) * (Math.PI / 180);

    const ascRad = Math.atan2(
      -Math.cos(lstRad),
      Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad)
    );

    return this.normalizeDegrees(ascRad * (180 / Math.PI));
  }

  attachEventListeners() {
    const form = document.getElementById('characterForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.generateCharacter();
      });
    }

    const generateBtn = document.getElementById('generateCharacter');
    if (generateBtn) {
      generateBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.generateCharacter();
      });
    }

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => this.generateSampleReport());
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

    const calculateBtn = document.getElementById('calculateAstrology');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => this.calculateFromBirthDate());
    }
  }

  shouldAutoGenerateSample() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sample')) return false;
    const value = params.get('sample');
    if (value === null || value === '' || value === '1' || value === 'true') return true;
    return false;
  }

  getRandomItem(items) {
    if (!Array.isArray(items) || items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
  }

  setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field && value !== undefined && value !== null) {
      field.value = value;
    }
  }

  setFieldError(id, hasError) {
    const field = document.getElementById(id);
    if (!field) return;
    if (hasError) {
      field.classList.add('field-error');
    } else {
      field.classList.remove('field-error');
    }
  }

  async generateSampleReport() {
    try {
      await this.loadAstrologyData();

      const birthYear = 1980 + Math.floor(Math.random() * 25);
      const birthMonth = 1 + Math.floor(Math.random() * 12);
      const birthDay = 1 + Math.floor(Math.random() * 28);
      const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

      const signKey = getWesternSign(birthMonth, birthDay);
      const sunSign = signKey && WESTERN_SIGNS[signKey] ? WESTERN_SIGNS[signKey].name : '';
      const moonSign = this.getRandomItem(Object.values(WESTERN_SIGNS))?.name || '';
      const ascendantSign = this.getRandomItem(Object.values(WESTERN_SIGNS))?.name || '';

      const chineseAnimalKey = getChineseAnimal(birthYear);
      const chineseElementKey = getChineseElement(birthYear);
      const chineseAnimal = CHINESE_ANIMALS[chineseAnimalKey]?.name || '';
      const chineseElement = chineseElementKey || '';

      const mayanTone = this.getRandomItem(Object.values(MAYAN_TONES))?.name || '';
      const mayanKin = this.getRandomItem(Object.values(MAYAN_SEALS))?.name || '';

      this.setFieldValue('characterName', 'Sample Adventurer');
      this.setFieldValue('birthDate', birthDate);
      this.setFieldValue('birthTime', '12:00');
      this.setFieldValue('timeZone', this.getSampleTimeZone());
      this.setFieldValue('birthLatitude', '51.5074');
      this.setFieldValue('birthLongitude', '-0.1278');
      this.setFieldValue('birthLocation', 'Sample City');
      this.setFieldValue('sunSign', sunSign);
      this.setFieldValue('moonSign', moonSign);
      this.setFieldValue('ascendantSign', ascendantSign);
      this.setFieldValue('chineseAnimal', chineseAnimal);
      this.setFieldValue('chineseElement', chineseElement);
      this.setFieldValue('mayanTone', mayanTone);
      this.setFieldValue('mayanKin', mayanKin);

      this.generateCharacter();
    } catch (error) {
      this.debugReporter.logError(error, 'generateSampleReport');
      ErrorHandler.showUserError('Failed to generate sample character. Please try again.');
    }
  }

  /**
   * Calculate and display sun sign based on birth date
   * @returns {Promise<void>}
   */
  async calculateSunSign() {
    try {
      await this.loadAstrologyData();
      
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
    } catch (error) {
      this.debugReporter.logError(error, 'calculateSunSign');
      ErrorHandler.showUserError('Failed to calculate sun sign.');
    }
  }

  async calculateFromBirthDate() {
    try {
      await this.loadAstrologyData();

      const birthDateInput = document.getElementById('birthDate');
      if (!birthDateInput || !birthDateInput.value) {
        ErrorHandler.showUserError('Please enter your birth date first.');
        return;
      }

      const birthDate = new Date(birthDateInput.value);
      const year = birthDate.getFullYear();
      const month = birthDate.getMonth() + 1;
      const day = birthDate.getDate();

      const signKey = getWesternSign(month, day);
      if (signKey && WESTERN_SIGNS[signKey]) {
        this.setFieldValue('sunSign', WESTERN_SIGNS[signKey].name);
      }

      const chineseAnimalKey = getChineseAnimal(year);
      const chineseElementKey = getChineseElement(year);
      this.setFieldValue('chineseAnimal', CHINESE_ANIMALS[chineseAnimalKey]?.name || '');
      this.setFieldValue('chineseElement', chineseElementKey || '');

      const mayanData = calculateMayanSign(birthDate);
      this.setFieldValue('mayanTone', MAYAN_TONES[mayanData.tone]?.name || '');
      this.setFieldValue('mayanKin', MAYAN_SEALS[mayanData.seal]?.name || '');

      const birthTimeInput = document.getElementById('birthTime');
      const timeZoneInput = document.getElementById('timeZone');
      const latitudeInput = document.getElementById('birthLatitude');
      const longitudeInput = document.getElementById('birthLongitude');

      const wantsMoonAscendant = timeZoneInput?.value !== ''
        || latitudeInput?.value
        || longitudeInput?.value;

      const hasMoonInputs = birthTimeInput?.value
        && timeZoneInput?.value !== ''
        && latitudeInput?.value
        && longitudeInput?.value;

      if (hasMoonInputs) {
        await this.loadAstronomyEngine();

        const utcDate = this.createUtcDateFromInputs(
          birthDateInput.value,
          birthTimeInput.value,
          timeZoneInput.value
        );
        const julianDate = this.calculateJulianDate(utcDate);
        const latitude = parseFloat(latitudeInput.value);
        const longitude = parseFloat(longitudeInput.value);

        if (
          Number.isNaN(latitude) || Number.isNaN(longitude)
          || latitude < -90 || latitude > 90
          || longitude < -180 || longitude > 180
        ) {
          ErrorHandler.showUserError('Latitude/longitude must be valid decimal degrees.');
          return;
        }

        let moonLongitude = null;
        if (typeof Astronomy.EclipticGeoMoon === 'function') {
          moonLongitude = Astronomy.EclipticGeoMoon(utcDate)?.elon ?? null;
        } else if (typeof Astronomy.Ecliptic === 'function' && typeof Astronomy.GeoMoon === 'function') {
          moonLongitude = Astronomy.Ecliptic(Astronomy.GeoMoon(utcDate))?.elon ?? null;
        }
        if (moonLongitude !== null) {
          this.setFieldValue('moonSign', this.getZodiacFromLongitude(moonLongitude));
        }

        const ascendantLongitude = this.calculateAscendantLongitude(julianDate, latitude, longitude);
        this.setFieldValue('ascendantSign', this.getZodiacFromLongitude(ascendantLongitude));
      } else if (wantsMoonAscendant) {
        this.setFieldError('birthTime', !birthTimeInput?.value);
        this.setFieldError('timeZone', timeZoneInput?.value === '');
        this.setFieldError('birthLatitude', !latitudeInput?.value);
        this.setFieldError('birthLongitude', !longitudeInput?.value);
        ErrorHandler.showUserError('To calculate Moon and Ascendant, enter birth time, time zone, latitude, and longitude.');
      }
    } catch (error) {
      this.debugReporter.logError(error, 'calculateFromBirthDate');
      ErrorHandler.showUserError('Failed to calculate astrology data. Please try again.');
    }
  }

  /**
   * Generate character sheet from form data
   * @returns {Promise<void>}
   */
  async generateCharacter() {
    try {
      await this.loadAstrologyData();
      
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
      
      // Save character data
      this.dataStore.save('character', this.characterData);
    } catch (error) {
      this.debugReporter.logError(error, 'generateCharacter');
      ErrorHandler.showUserError('Failed to generate character sheet. Please try again.');
    }
  }

  collectFormData() {
    return {
      name: document.getElementById('characterName')?.value || '',
      birthDate: document.getElementById('birthDate')?.value,
      birthTime: document.getElementById('birthTime')?.value || '',
      timeZone: document.getElementById('timeZone')?.value || '',
      birthLatitude: document.getElementById('birthLatitude')?.value || '',
      birthLongitude: document.getElementById('birthLongitude')?.value || '',
      birthLocation: document.getElementById('birthLocation')?.value || '',
      sunSign: document.getElementById('sunSign')?.value || '',
      moonSign: document.getElementById('moonSign')?.value || '',
      ascendantSign: document.getElementById('ascendantSign')?.value || '',
      chineseAnimal: document.getElementById('chineseAnimal')?.value || '',
      chineseElement: document.getElementById('chineseElement')?.value || '',
      mayanSign: document.getElementById('mayanSign')?.value || '',
      mayanTone: document.getElementById('mayanTone')?.value || '',
      mayanKin: document.getElementById('mayanKin')?.value || ''
    };
  }

  /**
   * Validate form data
   * @param {Object} formData - Form data to validate
   * @returns {boolean} - True if valid
   */
  validateFormData(formData) {
    const hasMoonAndAscendant = Boolean(
      String(formData.moonSign || '').trim() && String(formData.ascendantSign || '').trim()
    );

    const requiredFields = [
      { key: 'name', label: 'Character name' },
      { key: 'birthDate', label: 'Birth date' },
      { key: 'sunSign', label: 'Sun sign' },
      { key: 'moonSign', label: 'Moon sign' },
      { key: 'ascendantSign', label: 'Ascendant (Rising) sign' },
      { key: 'chineseAnimal', label: 'Chinese animal' },
      { key: 'chineseElement', label: 'Chinese element' },
      { key: 'mayanTone', label: 'Mayan Dreamspell tone' },
      { key: 'mayanKin', label: 'Mayan Dreamspell kin' }
    ];

    if (!hasMoonAndAscendant) {
      requiredFields.push(
        { key: 'birthTime', label: 'Birth time' },
        { key: 'timeZone', label: 'Time zone' },
        { key: 'birthLatitude', label: 'Birth latitude' },
        { key: 'birthLongitude', label: 'Birth longitude' }
      );
    }

    requiredFields.forEach((field) => {
      this.setFieldError(field.key, false);
    });

    const missingFields = requiredFields.filter(
      field => !String(formData[field.key] || '').trim()
    );

    missingFields.forEach((field) => {
      this.setFieldError(field.key, true);
    });

    if (missingFields.length) {
      ErrorHandler.showUserError(`Please complete the ${missingFields[0].label} field.`);
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

    // Chinese Astrology - check for manual input first
    let chineseAnimalData = null;
    let chineseElementData = null;
    let chineseElementKey = null;
    
    if (formData.chineseAnimal) {
      // Find matching animal from manual input
      const animalKey = Object.keys(CHINESE_ANIMALS).find(
        key => CHINESE_ANIMALS[key].name.toLowerCase() === formData.chineseAnimal.toLowerCase()
      );
      if (animalKey) {
        chineseAnimalData = CHINESE_ANIMALS[animalKey];
      }
    }
    
    if (formData.chineseElement) {
      // Find matching element from manual input
      const elementKey = Object.keys(CHINESE_ELEMENTS).find(
        key => key.toLowerCase() === formData.chineseElement.toLowerCase()
      );
      if (elementKey) {
        chineseElementData = CHINESE_ELEMENTS[elementKey];
        chineseElementKey = elementKey;
      }
    }
    
    // If no manual input, calculate automatically
    if (!chineseAnimalData) {
      const chineseAnimal = getChineseAnimal(year);
      chineseAnimalData = CHINESE_ANIMALS[chineseAnimal];
    }
    
    if (!chineseElementData) {
      const chineseElement = getChineseElement(year);
      chineseElementData = CHINESE_ELEMENTS[chineseElement];
      chineseElementKey = chineseElement;
    }

    // Mayan Astrology - check for manual input first
    let mayanSeal = null;
    let mayanTone = null;
    let mayanKin = null;
    
    if (formData.mayanTone && formData.mayanKin) {
      mayanTone = this.findMayanTone(formData.mayanTone);
      mayanSeal = this.findMayanSeal(formData.mayanKin);
      mayanKin = formData.mayanKin;
    }

    if (!mayanSeal && !mayanTone && formData.mayanSign) {
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
        element: chineseElementData,
        elementKey: chineseElementKey
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

  findMayanTone(input) {
    const normalized = this.normalizeKey(input);
    const toneKey = Object.keys(MAYAN_TONES || {}).find(key => {
      const tone = MAYAN_TONES[key];
      return this.normalizeKey(tone.name) === normalized;
    });
    return toneKey ? MAYAN_TONES[toneKey] : null;
  }

  findMayanSeal(input) {
    const normalized = this.normalizeKey(input);
    const sealKey = Object.keys(MAYAN_SEALS || {}).find(key => {
      const seal = MAYAN_SEALS[key];
      const fullName = this.normalizeKey(seal.name);
      const withoutColor = this.normalizeKey(seal.name.split(' ').slice(1).join(' '));
      return fullName === normalized || withoutColor === normalized;
    });
    return sealKey ? MAYAN_SEALS[sealKey] : null;
  }

  normalizeKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z]/g, '');
  }

  buildCharacterSheet(formData, astrologyData) {
    // Calculate D&D stats from astrological data
    const baseStats = this.calculateBaseStats(astrologyData);
    
    // Determine Race, Class, and Backstory
    const race = this.determineRace(astrologyData);
    const characterClass = this.determineClass(astrologyData);
    const backstory = this.generateBackstory(formData, astrologyData, race, characterClass);
    
    // Generate Proficiencies, Traits, Saving Throws, Context Bonus Modifiers
    const proficiencies = this.generateProficiencies(astrologyData, characterClass);
    const traits = this.generateTraits(astrologyData);
    const savingThrows = this.generateSavingThrows(baseStats, characterClass);
    const contextBonusModifiers = this.generateContextBonusModifiers(astrologyData, characterClass, proficiencies, traits);
    
    // Generate Innovative Outcomes (theme-derived from proficiencies, traits, context modifiers)
    const innovativeOutcomes = this.generateInnovativeOutcomes(astrologyData, characterClass, proficiencies, traits, contextBonusModifiers);
    
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
      contextBonusModifiers,
      innovativeOutcomes,
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
    const element = astrologyData.chinese.element?.name
      || astrologyData.chinese.elementKey
      || 'Earth';
    
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
    // Get Mayan display name - find the seal key
    let sealKey = '';
    if (mayanSeal) {
      const foundKey = Object.keys(MAYAN_SEALS).find(key => MAYAN_SEALS[key].name === mayanSeal.name);
      sealKey = foundKey || mayanSeal.name?.toLowerCase().replace(/\s+/g, '_').replace('-', '_') || '';
    }
    const mayanDisplay = getMayanSignDisplayName(sealKey, mayanTone?.name || '');
    
    const name = SecurityUtils.sanitizeHTML(formData.name || 'They');
    const safeRace = SecurityUtils.sanitizeHTML(race || '');
    const safeClass = SecurityUtils.sanitizeHTML(characterClass || '');

    const coreTraits = [];
    const innerTraits = [];
    const outwardTraits = [];
    const groundingTraits = [];
    const guidingTraits = [];

    if (sunSign?.keyTraits?.length) {
      coreTraits.push(sunSign.keyTraits[0], sunSign.keyTraits[1]);
    }
    if (moonSign?.keyTraits?.length) {
      innerTraits.push(moonSign.keyTraits[0], moonSign.keyTraits[1]);
    }
    if (ascendantSign?.keyTraits?.length) {
      outwardTraits.push(ascendantSign.keyTraits[0], ascendantSign.keyTraits[1]);
    }
    if (chineseAnimal?.keyTraits?.length) {
      groundingTraits.push(chineseAnimal.keyTraits[0], chineseAnimal.keyTraits[1]);
    }
    if (chineseElement?.traits?.length) {
      groundingTraits.push(chineseElement.traits[0]);
    }
    if (mayanSeal?.ability) {
      guidingTraits.push(mayanSeal.ability.split(' - ')[1] || mayanSeal.ability);
    }
    if (mayanTone?.approach) {
      guidingTraits.push(mayanTone.approach.split(' - ')[1] || mayanTone.approach);
    }

    const summarize = (traits) => traits
      .filter(Boolean)
      .map(trait => SecurityUtils.sanitizeHTML(trait).toLowerCase())
      .filter((trait, index, array) => array.indexOf(trait) === index)
      .slice(0, 3);

    const coreSummary = summarize(coreTraits);
    const innerSummary = summarize(innerTraits);
    const outwardSummary = summarize(outwardTraits);
    const groundingSummary = summarize(groundingTraits);
    const guidingSummary = summarize(guidingTraits);

    const sentences = [];
    sentences.push(`${name} is a ${safeRace} whose character centers on ${coreSummary.join(', ') || 'quiet resolve'}.`);

    if (innerSummary.length) {
      sentences.push(`At their core, they are ${innerSummary.join(' and ')}, which shapes how they process experience.`);
    }

    if (outwardSummary.length) {
      sentences.push(`To others, they appear ${outwardSummary.join(' and ')}, carrying themselves with a distinct presence.`);
    }

    if (groundingSummary.length) {
      sentences.push(`Their grounding nature is ${groundingSummary.join(', ')}, making them steady under pressure.`);
    }

    if (guidingSummary.length) {
      sentences.push(`Their guiding impulse is to be ${guidingSummary.join(' and ')}, pushing them toward purposeful impact.`);
    }

    if (safeClass) {
      sentences.push(`This temperament draws them toward the ${safeClass} path, where their strengths can be refined into mastery.`);
    }

    return sentences.join(' ');
  }

  generateProficiencies(astrologyData, characterClass) {
    const proficiencies = [];
    
    // Base class proficiencies
    const classProficiencies = {
      'Fighter': ['Crisis response', 'Tactical planning', 'Boundary enforcement', 'Team leadership', 'Physical resilience'],
      'Rogue': ['Risk assessment', 'Situational awareness', 'Negotiation', 'Discretion', 'Pattern recognition'],
      'Barbarian': ['Protective presence', 'Stamina training', 'Intensity management', 'Direct action', 'Resilience under pressure'],
      'Wizard': ['Research synthesis', 'Systems thinking', 'Strategic foresight', 'Analytical writing', 'Deep learning'],
      'Cleric': ['Counseling', 'Ethical guidance', 'Conflict mediation', 'Community care', 'Ritual facilitation'],
      'Bard': ['Public speaking', 'Storytelling', 'Motivational coaching', 'Social intelligence', 'Creative facilitation'],
      'Paladin': ['Values-based leadership', 'Accountability frameworks', 'Mentorship', 'Crisis leadership', 'Integrity under pressure'],
      'Druid': ['Ecological awareness', 'Somatic grounding', 'Holistic assessment', 'Regeneration practices', 'Environmental stewardship'],
      'Monk': ['Emotional regulation', 'Focus training', 'Body-mind alignment', 'Discipline routines', 'Mindful presence'],
      'Ranger': ['Field navigation', 'Preparedness', 'Observation', 'Resource management', 'Boundary scouting']
    };
    
    if (classProficiencies[characterClass]) {
      proficiencies.push(...classProficiencies[characterClass]);
    }
    
    // Add astrological proficiencies
    if (astrologyData.western.sun?.element === 'Fire') {
      proficiencies.push('Initiative & momentum', 'Decisive action');
    }
    if (astrologyData.western.sun?.element === 'Water') {
      proficiencies.push('Empathic listening', 'Emotional attunement');
    }
    if (astrologyData.western.sun?.element === 'Air') {
      proficiencies.push('Strategic communication', 'Idea synthesis');
    }
    if (astrologyData.western.sun?.element === 'Earth') {
      proficiencies.push('Operational planning', 'Grounded execution');
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
          source: `Sun Sign (${SecurityUtils.sanitizeHTML(astrologyData.western.sun.name || '')})`,
          modifier: '+1'
        });
      });
    }
    
    // Mayan seal ability — use theme keywords (e.g. Spirit & Communication) not system terms
    if (astrologyData.mayan.seal) {
      const seal = astrologyData.mayan.seal;
      const themeLabel = seal.theme || seal.name || '';
      traits.push({
        name: seal.ability.split(' - ')[0],
        source: themeLabel ? `${SecurityUtils.sanitizeHTML(themeLabel)} (${SecurityUtils.sanitizeHTML(seal.name || '')})` : SecurityUtils.sanitizeHTML(seal.name || ''),
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

  generateContextBonusModifiers(astrologyData, characterClass, proficiencies, traits) {
    const modifiers = [];
    
    // Each proficiency becomes a context where you receive a bonus
    (proficiencies || []).forEach((prof, idx) => {
      const tier = [2, 2, 1, 1, 1][idx % 5];
      modifiers.push({
        context: prof,
        modifier: `+${tier}`,
        source: 'Proficiency'
      });
    });
    
    // Traits add context-specific modifiers
    (traits || []).forEach((trait, idx) => {
      const mod = trait.modifier || '+1';
      modifiers.push({
        context: trait.name,
        modifier: mod,
        source: trait.source || 'Trait'
      });
    });
    
    // Astrological context bonuses
    if (astrologyData.western.sun?.element === 'Fire') {
      modifiers.push({ context: 'Initiative and decisive action', modifier: '+2', source: 'Sun (Fire)' });
    }
    if (astrologyData.western.sun?.element === 'Water') {
      modifiers.push({ context: 'Empathic listening and emotional attunement', modifier: '+2', source: 'Sun (Water)' });
    }
    if (astrologyData.western.sun?.element === 'Air') {
      modifiers.push({ context: 'Strategic communication and idea synthesis', modifier: '+2', source: 'Sun (Air)' });
    }
    if (astrologyData.western.sun?.element === 'Earth') {
      modifiers.push({ context: 'Operational planning and grounded execution', modifier: '+2', source: 'Sun (Earth)' });
    }
    if (astrologyData.chinese.animal?.name === 'Monkey') {
      modifiers.push({ context: 'Adaptability and quick pivots', modifier: '+1', source: 'Chinese (Monkey)' });
    }
    
    // Dedupe by context
    const seen = new Set();
    return modifiers.filter(m => {
      const key = m.context.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }

  generateInnovativeOutcomes(astrologyData, characterClass, proficiencies, traits, contextBonusModifiers) {
    const features = [];
    const profs = (proficiencies || []).slice(0, 4);
    const traitNames = (traits || []).map(t => t.name).slice(0, 3);
    const contextThemes = (contextBonusModifiers || []).map(c => c.context).slice(0, 3);
    const themePool = [...profs, ...traitNames, ...contextThemes].filter(Boolean);
    const theme1 = themePool[0] || 'core strengths';
    const theme2 = themePool[1] || 'natural tendencies';
    const theme3 = themePool[2] || 'learned capacities';
    
    // Base outcomes by class — descriptions tied to proficiencies, traits, context modifiers
    const baseOutcomes = {
      'Fighter': [
        {
          name: 'Integrated Combat Stance',
          description: `Your ${theme1} and ${theme2} combine into a disciplined approach to conflict and defense. This stance guides decision-making under pressure and shapes how you take initiative.`,
          frequency: 'Always active',
          influence: 'Self: improves tactical focus and consistency under stress.',
          numericalInfluence: '+1 to initiative decisions',
          effectiveRange: 'Self'
        },
        {
          name: 'Rally and Recover',
          description: `Drawing on ${theme1} and your capacity for ${theme2}, you can rally in the middle of a challenge—regaining composure through focused breath and grit.`,
          frequency: 'Once per short rest',
          influence: 'Self: restores momentum and steadiness after setbacks.',
          numericalInfluence: '+2 resilience for the next challenge',
          effectiveRange: 'Self'
        }
      ],
      'Rogue': [
        {
          name: 'Precision Strike',
          description: `Your ${theme1} and ${theme2} let you turn small openings into decisive impact—capitalizing on distraction or exposure when it appears.`,
          frequency: 'Once per turn when conditions align',
          influence: 'Target: amplifies impact when the opponent is distracted or exposed.',
          numericalInfluence: '+3 impact on exposed targets',
          effectiveRange: 'Line of sight'
        },
        {
          name: 'Cunning Action',
          description: `Leveraging ${theme1} and ${theme3}, you reposition, disengage, or adapt with minimal effort—staying one step ahead in dynamic situations.`,
          frequency: 'Once per turn',
          influence: 'Self: increases mobility and escape options in tense moments.',
          numericalInfluence: '+2 mobility for one turn',
          effectiveRange: 'Self'
        },
        {
          name: 'Covert Coordination',
          description: `Your ${theme2} and context in ${theme3} let you interpret coded cues and subtext, enabling discreet communication in sensitive environments.`,
          frequency: 'Always active',
          influence: 'Allies: enables discreet coordination and covert signaling.',
          numericalInfluence: '+2 coordination in covert contexts',
          effectiveRange: 'Within 30 meters'
        }
      ],
      'Barbarian': [
        {
          name: 'Focused Intensity',
          description: `Your ${theme1} and ${theme2} channel into a heightened state that amplifies power, focus, and resolve under pressure.`,
          frequency: 'Twice per long rest',
          influence: 'Self: boosts force, resilience, and single-point focus.',
          numericalInfluence: '+3 strength, +2 resilience while active',
          effectiveRange: 'Self'
        },
        {
          name: 'Instinctive Resilience',
          description: `Drawing on ${theme1} and ${theme3}, your raw endurance and awareness keep you protected even without external support.`,
          frequency: 'Always active',
          influence: 'Self: improves natural durability without added gear.',
          numericalInfluence: '+2 defensive stability',
          effectiveRange: 'Self'
        }
      ],
      'Wizard': [
        {
          name: 'Channeled Knowledge',
          description: `Your ${theme1} and ${theme2} let you wield focused knowledge to channel complex effects—shaping outcomes through intellect and disciplined practice.`,
          frequency: 'Always active',
          influence: 'Targets: can be shaped, supported, or disrupted through learned techniques.',
          numericalInfluence: '+2 to precision on targeted outcomes',
          effectiveRange: 'Line of sight'
        },
        {
          name: 'Strategic Recovery',
          description: `Through ${theme3} and focused rest, you restore mental reserves and recover spent resources.`,
          frequency: 'Once per day after a short rest',
          influence: 'Self: restores mental capacity and strategic clarity.',
          numericalInfluence: '+3 focus on next complex task',
          effectiveRange: 'Self'
        }
      ],
      'Cleric': [
        {
          name: 'Restorative Presence',
          description: `Your ${theme1} and ${theme2} channel restorative and protective forces—shaping outcomes with wisdom and care for others.`,
          frequency: 'Always active',
          influence: 'Allies: stabilizes, protects, and supports group cohesion.',
          numericalInfluence: '+2 restoration or protection effect',
          effectiveRange: 'Within 15 meters'
        },
        {
          name: 'Sacred Surge',
          description: `Drawing on ${theme1} and ${theme3}, you invoke a powerful surge to heal, protect, or turn the tide in critical moments.`,
          frequency: 'Once per short rest',
          influence: 'Allies: provides a short, high-impact burst of protection or recovery.',
          numericalInfluence: '+3 recovery or protection burst',
          effectiveRange: 'Within 20 meters'
        }
      ],
      'Bard': [
        {
          name: 'Expressive Influence',
          description: `Your ${theme1} and ${theme2} weave creative expression into tangible influence—shaping attention, emotion, and momentum with style.`,
          frequency: 'Always active',
          influence: 'Targets: shifts emotion, morale, or attention through expression.',
          numericalInfluence: '+2 morale shift on engaged targets',
          effectiveRange: 'Within 25 meters'
        },
        {
          name: 'Inspired Uplift',
          description: `Through ${theme3} and timely insight, you uplift allies with encouragement—granting a burst of confidence and clarity.`,
          frequency: 'Uses equal to Charisma modifier per long rest',
          influence: 'Allies: grants momentum and morale in clutch moments.',
          numericalInfluence: '+3 confidence on next action',
          effectiveRange: 'Within 20 meters'
        }
      ],
      'Paladin': [
        {
          name: 'Restorative Touch',
          description: `Your ${theme1} and ${theme2} enable restorative support through focused touch—stabilizing allies and restoring strength.`,
          frequency: 'Pool refreshes per long rest',
          influence: 'Allies: direct restorative aid for recovery and stabilization.',
          numericalInfluence: '+4 recovery on contact',
          effectiveRange: 'Touch'
        },
        {
          name: 'Perceptive Sense',
          description: `Drawing on ${theme3} and intuition, you sense hidden threats or alignments—detecting subtle dangers others miss.`,
          frequency: 'Uses equal to Charisma modifier per long rest',
          influence: 'Self: heightens perception of hidden dangers or intent.',
          numericalInfluence: '+3 clarity on threat detection',
          effectiveRange: 'Within 30 meters'
        },
        {
          name: 'Stabilizing Aura',
          description: `Your ${theme1} and ${theme2} radiate as a stabilizing presence—allies within 20 meters gain subtle resilience.`,
          frequency: 'Always active while conscious',
          influence: 'Allies within 20 meters: gain increased resilience and steadiness.',
          numericalInfluence: '+2 resilience while in aura',
          effectiveRange: 'Aura (20 meters)'
        }
      ],
      'Druid': [
        {
          name: 'Adaptive Form',
          description: `Your ${theme1} and ${theme2} let you adapt to the environment—enhancing mobility, endurance, or stealth to fit terrain and threats.`,
          frequency: 'Twice per short rest',
          influence: 'Self: adapts capabilities to fit terrain and threats.',
          numericalInfluence: '+2 mobility and resilience while adapted',
          effectiveRange: 'Self'
        },
        {
          name: 'Ecological Awareness',
          description: `Through ${theme3} and attunement to natural patterns, you interpret signs and ecosystems—gaining guidance from the living world.`,
          frequency: 'Always active',
          influence: 'Self: improves navigation, timing, and ecological awareness.',
          numericalInfluence: '+2 insight on environmental cues',
          effectiveRange: 'Within 50 meters'
        }
      ],
      'Monk': [
        {
          name: 'Disciplined Focus',
          description: `Your ${theme1} and ${theme2} harness inner energy for bursts of precision, mobility, and defensive clarity.`,
          frequency: 'Points refresh per short rest',
          influence: 'Self: enhances agility, precision, and defensive control.',
          numericalInfluence: '+2 precision and defense while focused',
          effectiveRange: 'Self'
        },
        {
          name: 'Redirected Force',
          description: `Drawing on ${theme3} and refined timing, you redirect incoming force—minimizing harm and conserving energy.`,
          frequency: 'Once per round as a reaction',
          influence: 'Self: reduces incoming impact and preserves stamina.',
          numericalInfluence: '-3 incoming impact on reaction',
          effectiveRange: 'Self'
        }
      ],
      'Ranger': [
        {
          name: 'Hunter\'s Mark',
          description: `Your ${theme1} and ${theme2} let you mark a priority target or mission—sharpening attention and persistence toward the objective.`,
          frequency: 'Once per short rest',
          influence: 'Target: increases tracking accuracy and follow-through.',
          numericalInfluence: '+2 tracking accuracy on marked targets',
          effectiveRange: 'Within 30 meters'
        },
        {
          name: 'Natural Explorer',
          description: `Through ${theme3} and awareness, you move efficiently through terrain—noticing subtle signals that others miss.`,
          frequency: 'Always active',
          influence: 'Self: improves navigation and environmental awareness.',
          numericalInfluence: '+2 navigation and tracking',
          effectiveRange: 'Self'
        }
      ]
    };
    
    if (baseOutcomes[characterClass]) {
      baseOutcomes[characterClass].forEach((outcome) => {
        features.push({ ...outcome });
      });
    }
    
    // Add astrological innovative outcomes (Mayan seal + tone) — use theme keywords, not system terms
    if (astrologyData.mayan.seal) {
      const seal = astrologyData.mayan.seal;
      const sealName = seal.ability.split(' - ')[0];
      const sealDesc = seal.ability;
      const themeKeywords = seal.theme || 'related strengths';
      features.push({
        name: sealName,
        description: `${sealDesc} — Integrated with your proficiencies in ${theme1} and ${theme2}.`,
        frequency: 'At will',
        influence: `Self/Allies: amplifies natural strengths in ${themeKeywords}.`,
        numericalInfluence: `+2 to ${themeKeywords} actions`,
        effectiveRange: 'Self or close allies (15 meters)'
      });
    }
    
    if (astrologyData.mayan.tone) {
      const tone = astrologyData.mayan.tone;
      const toneName = tone.approach.split(' - ')[0];
      const toneDesc = tone.approach;
      const themeKeywords = tone.theme || 'related dynamics';
      features.push({
        name: toneName,
        description: `${toneDesc} — Shaped by your context in ${theme3} and related traits.`,
        frequency: 'At will',
        influence: `Self/Allies: shapes approach and group dynamics around ${themeKeywords}.`,
        numericalInfluence: `+2 to ${themeKeywords} outcomes`,
        effectiveRange: 'Self or team (20 meters)'
      });
    }
    
    return features;
  }

  generateFlaws(astrologyData) {
    const flaws = [];
    const getScaledModifier = (index, scale) => {
      const tier = scale[index % scale.length];
      return tier > 0 ? `+${tier}` : `${tier}`;
    };
    
    // Sun sign challenges
    if (astrologyData.western.sun) {
      const sunScale = [-2, -1, -2, -3];
      astrologyData.western.sun.challenges.forEach(challenge => {
        const modifier = getScaledModifier(flaws.length, sunScale);
        flaws.push({
          name: challenge,
          source: `Sun Sign (${SecurityUtils.sanitizeHTML(astrologyData.western.sun.name || '')})`,
          modifier
        });
      });
    }
    
    // Mayan seal negative modifier — use theme keywords, not system terms
    if (astrologyData.mayan.seal) {
      const seal = astrologyData.mayan.seal;
      const themeLabel = seal.theme || seal.name || '';
      flaws.push({
        name: seal.negativeModifier.split(' - ')[0],
        source: themeLabel ? `${SecurityUtils.sanitizeHTML(themeLabel)} (${SecurityUtils.sanitizeHTML(seal.name || '')})` : SecurityUtils.sanitizeHTML(seal.name || ''),
        modifier: '-2'
      });
    }
    
    // Chinese animal challenges
    if (astrologyData.chinese.animal) {
      flaws.push({
        name: astrologyData.chinese.animal.challenges[0],
        source: `Chinese Animal (${SecurityUtils.sanitizeHTML(astrologyData.chinese.animal.name || '')})`,
        modifier: '-2'
      });
    }
    
    return flaws;
  }

  /**
   * Display character sheet in the results container
   * @param {Object} character - Character data to display
   */
  displayCharacterSheet(character) {
    try {
      const resultsContainer = document.getElementById('characterSheetResults');
      if (!resultsContainer) {
        ErrorHandler.showUserError('Character sheet results container not found.');
        return;
      }

    // Format Mayan sign display
    const mayanDisplay = getMayanSignDisplayName(
      character.astrologyData.mayan.seal?.name?.toLowerCase().replace(/\s+/g, '_').replace('-', '_') || '',
      character.astrologyData.mayan.tone?.name || ''
    );
    
    // Format Chinese sign display
    const chineseElementName = character.astrologyData.chinese.element?.name
      || character.astrologyData.chinese.elementKey
      || '';
    const chineseDisplay = chineseElementName && character.astrologyData.chinese.animal?.name
      ? `${chineseElementName} ${character.astrologyData.chinese.animal.name}`
      : 'Unknown';
    
    let html = `
      <div class="character-sheet">
        <h2>${SecurityUtils.sanitizeHTML(character.name || '')}</h2>
        <p class="character-subtitle">${SecurityUtils.sanitizeHTML(character.race || '')} ${SecurityUtils.sanitizeHTML(character.characterClass || '')}</p>
        
        <section class="astrology-summary">
          <h3 style="margin-top: 0; color: var(--brand);">Astrological Profile</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <p><strong>Western:</strong> ${SecurityUtils.sanitizeHTML(character.astrologyData.western.sun?.name || 'Unknown')} Sun${character.astrologyData.western.moon ? `, ${SecurityUtils.sanitizeHTML(character.astrologyData.western.moon.name || '')} Moon` : ''}${character.astrologyData.western.ascendant ? `, ${SecurityUtils.sanitizeHTML(character.astrologyData.western.ascendant.name || '')} Ascendant` : ''}</p>
            </div>
            <div>
              <p><strong>Chinese:</strong> ${SecurityUtils.sanitizeHTML(chineseDisplay || '')}</p>
            </div>
            <div>
              <p><strong>Mayan:</strong> ${SecurityUtils.sanitizeHTML(mayanDisplay || 'Unknown')}</p>
            </div>
          </div>
        </section>
        
        <section class="character-overview">
          <h3>Character Overview</h3>
          <p><strong>Race:</strong> ${SecurityUtils.sanitizeHTML(character.race || '')}</p>
          <p><strong>Class:</strong> ${SecurityUtils.sanitizeHTML(character.characterClass || '')}</p>
          <p><strong>Backstory:</strong> ${SecurityUtils.sanitizeHTML(character.backstory || '')}</p>
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
            ${character.proficiencies.map(p => `<li>${SecurityUtils.sanitizeHTML(p || '')}</li>`).join('')}
          </ul>
        </section>
        
        <section class="traits">
          <h3>Traits</h3>
          <table>
            <thead>
              <tr>
                <th>Trait</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              ${character.traits.map(t => `
                <tr>
                  <td>${SecurityUtils.sanitizeHTML(t.name || '')}</td>
                  <td>${SecurityUtils.sanitizeHTML(t.modifier || '')}</td>
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
              </tr>
            </thead>
            <tbody>
              ${character.savingThrows.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.proficient ? `<strong>${SecurityUtils.sanitizeHTML(s.modifier || '')}</strong>` : SecurityUtils.sanitizeHTML(s.modifier || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
        
        <section class="context-bonus-modifiers">
          <h3>Context Bonus Modifiers</h3>
          <table>
            <thead>
              <tr>
                <th>Context</th>
                <th>Modifier</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${(character.contextBonusModifiers || []).map(c => `
                <tr>
                  <td>${SecurityUtils.sanitizeHTML(c.context || '')}</td>
                  <td>${SecurityUtils.sanitizeHTML(c.modifier || '')}</td>
                  <td>${SecurityUtils.sanitizeHTML(c.source || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
        
        <section class="skills">
          <h3>Skills</h3>
          ${(character.innovativeOutcomes || character.classFeatures || []).map(f => `
            <div class="feature-item">
              <h4>${f.name}</h4>
              <p><strong>Frequency:</strong> ${f.frequency}</p>
              <p><strong>Influence:</strong> ${f.influence}</p>
              <p><strong>Numerical Influence:</strong> ${f.numericalInfluence}</p>
              <p><strong>Effective Range:</strong> ${f.effectiveRange}</p>
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
                  <th>Modifier</th>
                </tr>
              </thead>
              <tbody>
                ${character.flaws.map(f => `
                  <tr>
                    <td>${f.name}</td>
                    <td>${f.modifier}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>No significant flaws identified.</p>'}
        </section>
      </div>
    `;

      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(resultsContainer, html);
      
      // Display debug report if in development mode
      if (window.location.search.includes('debug=true')) {
        this.debugReporter.displayReport('debug-report');
      }
    } catch (error) {
      this.debugReporter.logError(error, 'displayCharacterSheet');
      ErrorHandler.showUserError('Failed to display character sheet. Please try again.');
    }
  }

  showResults() {
    const formSection = document.getElementById('characterFormSection');
    const resultsSection = document.getElementById('characterSheetResults');
    
    if (formSection) formSection.classList.add('hidden');
    if (resultsSection) {
      resultsSection.classList.remove('hidden');
      resultsSection.classList.add('active');
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  resetForm() {
    document.getElementById('characterForm')?.reset();
    const formSection = document.getElementById('characterFormSection');
    const resultsSection = document.getElementById('characterSheetResults');
    
    if (formSection) formSection.classList.remove('hidden');
    if (resultsSection) {
      resultsSection.classList.add('hidden');
      resultsSection.classList.remove('active');
    }
    
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

