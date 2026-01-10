// Sovereignty Spectrum Engine - Version 1.0
// Identifies user's sovereignty paradigm and measures their integration level with that identified paradigm
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

// Data modules - will be loaded lazily
let SOVEREIGNTY_PARADIGMS, SPECTRUM_THRESHOLDS, DERAILERS, SPECTRUM_QUESTIONS;
let getSpectrumLabel, generatePhase2Questions;

/**
 * Sovereignty Spectrum Engine - Assesses paradigm alignment and sovereignty position
 */
export class SovereigntySpectrumEngine {
  /**
   * Initialize the spectrum engine
   */
  constructor() {
    this.selectedParadigms = [];
    this.paradigmRatings = {}; // Store ratings for all paradigms (0-100 continuous values)
    this.currentParadigmIndex = 0; // Track which paradigm is currently being shown
    this.currentPhase = 1; // 1 = Paradigm rating, 2 = Intents/Practicalities, 3 = Derailers, 4 = Results
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.derailerScores = {
      hypocrisy: 0,
      reluctance: 0,
      nihilism: 0
    };
    this.spectrumPosition = 0;
    this.paradigmAlignments = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      selectedParadigms: [],
      paradigmRatings: {},
      paradigmAlignments: {},
      derailerScores: {},
      spectrumPosition: 0,
      spectrumLabel: '',
      remediationPaths: [],
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('SovereigntySpectrumEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('spectrum-assessment', '1.0.0');
    
    this.init();
  }

  /**
   * Initialize the engine
   */
  init() {
    this.attachEventListeners();
    this.loadStoredData().catch(error => {
      this.debugReporter.logError(error, 'init');
    });
  }

  /**
   * Load spectrum data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadSpectrumData() {
    if (SOVEREIGNTY_PARADIGMS && SPECTRUM_THRESHOLDS) {
      return; // Already loaded
    }

    try {
      // Load all data from index
      const dataModule = await loadDataModule(
        './sovereignty-spectrum-data/index.js',
        'Sovereignty Spectrum Data'
      );
      SOVEREIGNTY_PARADIGMS = dataModule.SOVEREIGNTY_PARADIGMS;
      SPECTRUM_THRESHOLDS = dataModule.SPECTRUM_THRESHOLDS;
      DERAILERS = dataModule.DERAILERS;
      SPECTRUM_QUESTIONS = dataModule.SPECTRUM_QUESTIONS;
      getSpectrumLabel = dataModule.getSpectrumLabel;
      generatePhase2Questions = dataModule.generatePhase2Questions;

      this.debugReporter.logEvent('DataLoader', 'All spectrum data loaded successfully');
    } catch (error) {
      this.debugReporter.logError(error, 'loadSpectrumData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startAssessment());
    }

    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }

    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }

    const exportJSONBtn = document.getElementById('exportJSON');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportAnalysis('json'));
    }

    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportAnalysis('csv'));
    }
  }

  /**
   * Rate a paradigm (0-100 continuous scale)
   * @param {string} paradigmId - ID of paradigm to rate
   * @param {number} rating - Rating value (0-100)
   */
  rateParadigm(paradigmId, rating) {
    // Store continuous value (0-100)
    this.paradigmRatings[paradigmId] = parseFloat(rating);
    
    // Update slider visual feedback
    const slider = document.getElementById(`paradigm-slider-${paradigmId}`);
    if (slider) {
      this.updateSliderAppearance(slider, parseFloat(rating));
    }
    
    this.saveProgress();
  }

  /**
   * Update slider appearance based on value (color and darkness)
   */
  updateSliderAppearance(slider, value) {
    // Value is 0-100, convert to 0-1 for calculations
    const normalized = value / 100;
    const percentage = value;
    
    // Calculate color: from light blue/gray (low) to dark gold/brand (high)
    // Hue shifts from blue (240) to gold/yellow (45) as value increases
    const hue = 240 - (normalized * 195); // 240 (blue) to 45 (gold)
    const saturation = 60 + (normalized * 40); // 60% to 100%
    const lightness = 85 - (normalized * 50); // 85% (light) to 35% (dark)
    
    // Calculate colors for gradient
    const startColor = `hsl(240, 60%, 85%)`; // Light blue-gray at start
    const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Dynamic color at current position
    
    // Update slider track background with gradient
    slider.style.background = `linear-gradient(to right, ${startColor} 0%, ${currentColor} ${percentage}%, ${currentColor} 100%)`;
    
    // Update thumb color (darker as value increases)
    const thumbLightness = 70 - (normalized * 40); // 70% to 30%
    const thumbColor = `hsl(${hue}, ${saturation}%, ${thumbLightness}%)`;
    slider.style.setProperty('--thumb-color', thumbColor);
    
    // Update thumb for WebKit browsers
    slider.style.setProperty('--thumb-hue', hue);
    slider.style.setProperty('--thumb-saturation', saturation);
    slider.style.setProperty('--thumb-lightness', thumbLightness);
  }

  /**
   * Show next paradigm or finish if all are rated
   */
  nextParadigm() {
    if (!SOVEREIGNTY_PARADIGMS) return;
    
    // Move to next paradigm
    this.currentParadigmIndex++;
    
    // If all paradigms are rated, proceed to assessment
    if (this.currentParadigmIndex >= SOVEREIGNTY_PARADIGMS.length) {
      this.startAssessment();
      return;
    }
    
    // Render next paradigm
    this.renderCurrentParadigm();
  }

  /**
   * Check if all paradigms have been rated
   */
  checkParadigmRatingComplete() {
    if (!SOVEREIGNTY_PARADIGMS) return;
    
    const totalParadigms = SOVEREIGNTY_PARADIGMS.length;
    const ratedCount = Object.keys(this.paradigmRatings).filter(
      id => this.paradigmRatings[id] !== undefined && this.paradigmRatings[id] !== null
    ).length;
    
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.disabled = ratedCount < totalParadigms;
      if (ratedCount === totalParadigms) {
        startBtn.textContent = 'Continue to Assessment';
      } else {
        startBtn.textContent = `Rate All Paradigms (${ratedCount}/${totalParadigms})`;
      }
    }
  }

  /**
   * Select top paradigms based on continuous ratings (0-100)
   */
  selectTopParadigms() {
    if (!SOVEREIGNTY_PARADIGMS) return;
    
    // Get all paradigms with their ratings
    const paradigmScores = SOVEREIGNTY_PARADIGMS.map(paradigm => ({
      id: paradigm.id,
      name: paradigm.name,
      rating: this.paradigmRatings[paradigm.id] || 0,
      weight: paradigm.weight || 1.0
    }));
    
    // Sort by rating (highest first)
    paradigmScores.sort((a, b) => b.rating - a.rating);
    
    // Calculate quartiles
    const ratings = paradigmScores.map(p => p.rating).filter(r => r > 0);
    if (ratings.length === 0) return;
    
    ratings.sort((a, b) => b - a);
    const q1Index = Math.floor(ratings.length * 0.25);
    const q3Index = Math.floor(ratings.length * 0.75);
    const q1Value = ratings[q1Index] || 0;
    const q3Value = ratings[q3Index] || 0;
    
    // Select paradigms in top quartile (Q3+) or highest 3-5
    const topParadigms = paradigmScores.filter(p => {
      return p.rating >= q3Value && p.rating > 0;
    });
    
    // Ensure we have at least 3, but no more than 5
    if (topParadigms.length < 3) {
      // Take top 3-5 by rating
      this.selectedParadigms = paradigmScores
        .filter(p => p.rating > 0)
        .slice(0, 5)
        .map(p => p.id);
    } else if (topParadigms.length > 5) {
      // Take top 5 from Q3+
      this.selectedParadigms = topParadigms
        .slice(0, 5)
        .map(p => p.id);
    } else {
      this.selectedParadigms = topParadigms.map(p => p.id);
    }
    
    // Store in analysis data
    this.analysisData.paradigmRatings = { ...this.paradigmRatings };
    this.analysisData.selectedParadigms = [...this.selectedParadigms];
    
    this.debugReporter.logEvent('ParadigmSelection', `Selected ${this.selectedParadigms.length} paradigms based on ratings`);
  }

  /**
   * Render paradigm rating (Phase 1) - Shows one paradigm at a time with slider
   */
  async renderParadigmSelection() {
    await this.loadSpectrumData();
    
    // Reset to first paradigm if needed
    if (this.currentParadigmIndex >= SOVEREIGNTY_PARADIGMS.length) {
      this.currentParadigmIndex = 0;
    }
    
    // Render the current paradigm
    this.renderCurrentParadigm();
  }

  /**
   * Render the current paradigm with slider
   */
  renderCurrentParadigm() {
    if (!SOVEREIGNTY_PARADIGMS) return;
    
    const container = document.getElementById('paradigmSelection');
    if (!container) return;
    
    const paradigm = SOVEREIGNTY_PARADIGMS[this.currentParadigmIndex];
    if (!paradigm) return;
    
    const currentRating = this.paradigmRatings[paradigm.id] || 50; // Default to middle (50)
    const progress = ((this.currentParadigmIndex + 1) / SOVEREIGNTY_PARADIGMS.length) * 100;
    
    let html = '<div class="paradigm-selection-intro">';
    html += '<h3>Rate Each Paradigm</h3>';
    html += '<p>Use the slider to indicate how much this framework resonates with your values and worldview. The system will automatically select your top 3-5 paradigms based on your ratings.</p>';
    html += `<div class="paradigm-progress">Paradigm ${this.currentParadigmIndex + 1} of ${SOVEREIGNTY_PARADIGMS.length}</div>`;
    html += '<div class="progress-bar-container"><div class="progress-bar-fill" style="width: ' + progress + '%"></div></div>';
    html += '</div>';
    
    html += '<div class="paradigm-card-single">';
    html += `<h4>${SecurityUtils.sanitizeHTML(paradigm.name)}</h4>`;
    html += `<p class="paradigm-description">${SecurityUtils.sanitizeHTML(paradigm.description)}</p>`;
    html += '<div class="paradigm-values">';
    html += `<strong>Core Values:</strong> ${SecurityUtils.sanitizeHTML(paradigm.values.join(', '))}`;
    html += '</div>';
    
    html += '<div class="paradigm-rating-slider">';
    html += '<label for="paradigm-slider-' + paradigm.id + '">How much does this resonate with you?</label>';
    html += '<div class="slider-container">';
    html += '<input type="range" id="paradigm-slider-' + paradigm.id + '" class="paradigm-slider" ';
    html += 'min="0" max="100" value="' + currentRating + '" ';
    html += 'data-paradigm-id="' + paradigm.id + '">';
    html += '<div class="slider-labels">';
    html += '<span class="slider-label-left">Not at all</span>';
    html += '<span class="slider-label-right">Very strongly</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    
    html += '<div class="paradigm-navigation">';
    if (this.currentParadigmIndex > 0) {
      html += '<button class="btn btn-outline" id="prevParadigm">Previous</button>';
    }
    html += '<button class="btn btn-primary" id="nextParadigm">';
    html += this.currentParadigmIndex < SOVEREIGNTY_PARADIGMS.length - 1 ? 'Next Paradigm' : 'Continue to Assessment';
    html += '</button>';
    html += '</div>';
    
    SecurityUtils.safeInnerHTML(container, html);
    
    // Attach slider listener
    const slider = document.getElementById(`paradigm-slider-${paradigm.id}`);
    if (slider) {
      // Initialize slider appearance
      this.updateSliderAppearance(slider, currentRating);
      
      // Update on input (real-time)
      slider.addEventListener('input', (e) => {
        const paradigmId = e.target.dataset.paradigmId;
        const rating = e.target.value;
        this.rateParadigm(paradigmId, rating);
      });
    }
    
    // Attach navigation listeners
    const nextBtn = document.getElementById('nextParadigm');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextParadigm());
    }
    
    const prevBtn = document.getElementById('prevParadigm');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentParadigmIndex > 0) {
          this.currentParadigmIndex--;
          this.renderCurrentParadigm();
        }
      });
    }
  }

  /**
   * Start the assessment
   * @returns {Promise<void>}
   */
  async startAssessment() {
    // Check if all paradigms are rated
    if (!SOVEREIGNTY_PARADIGMS) {
      await this.loadSpectrumData();
    }
    
    const totalParadigms = SOVEREIGNTY_PARADIGMS.length;
    const ratedCount = Object.keys(this.paradigmRatings).filter(
      id => this.paradigmRatings[id] !== undefined && this.paradigmRatings[id] !== null
    ).length;
    
    if (ratedCount < totalParadigms) {
      ErrorHandler.showUserError(`Please rate all ${totalParadigms} paradigms before continuing.`);
      return;
    }
    
    try {
      await this.loadSpectrumData();
      
      // Select top paradigms based on ratings
      this.selectTopParadigms();
      
      if (this.selectedParadigms.length < 3) {
        ErrorHandler.showUserError('Not enough paradigms rated highly. Please rate at least 3 paradigms with a score of 3 or higher.');
        return;
      }
      
      await this.buildPhase2Sequence();
      
      this.currentPhase = 2;
      this.currentQuestionIndex = 0;
      this.answers = {};
      
      // Hide selection, show questionnaire
      const paradigmSelection = document.getElementById('paradigmSelection');
      const questionnaireSection = document.getElementById('questionnaireSection');
      if (paradigmSelection) paradigmSelection.style.display = 'none';
      if (questionnaireSection) questionnaireSection.classList.add('active');
      
      this.renderCurrentQuestion();
      this.saveProgress();
    } catch (error) {
      this.debugReporter.logError(error, 'startAssessment');
      ErrorHandler.showUserError('Failed to start assessment. Please try again.');
    }
  }

  /**
   * Build Phase 2 question sequence (Intents & Practicalities)
   * @returns {Promise<void>}
   */
  async buildPhase2Sequence() {
    await this.loadSpectrumData();
    
    this.questionSequence = [];
    
    // Generate questions based on selected paradigms
    if (generatePhase2Questions) {
      const phase2Questions = generatePhase2Questions(this.selectedParadigms, SOVEREIGNTY_PARADIGMS);
      this.questionSequence.push(...phase2Questions);
    }
    
    // Also add questions from each paradigm's question array
    this.selectedParadigms.forEach(paradigmId => {
      const paradigm = SOVEREIGNTY_PARADIGMS.find(p => p.id === paradigmId);
      if (paradigm && paradigm.questions) {
        paradigm.questions.forEach(q => {
          this.questionSequence.push({
            ...q,
            paradigm: paradigmId
          });
        });
      }
    });
    
    // Shuffle to reduce order bias
    this.questionSequence = this.shuffleArray([...this.questionSequence]);
    
    this.debugReporter.recordQuestionCount(this.questionSequence.length);
  }

  /**
   * Build Phase 3 sequence (Derailer Audit)
   * @returns {Promise<void>}
   */
  async buildPhase3Sequence() {
    await this.loadSpectrumData();
    
    this.questionSequence = [];
    
    // Add derailer questions
    Object.values(DERAILERS).forEach(derailer => {
      derailer.questions.forEach(q => {
        this.questionSequence.push({
          ...q,
          derailer: derailer.name.toLowerCase()
        });
      });
    });
    
    // Shuffle
    this.questionSequence = this.shuffleArray([...this.questionSequence]);
  }

  /**
   * Shuffle array helper
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Render current question
   */
  renderCurrentQuestion() {
    const container = document.getElementById('questionContainer');
    if (!container) {
      ErrorHandler.showUserError('Question container not found. Please refresh the page.');
      return;
    }

    try {
      // Check if we've completed current phase
      if (this.currentQuestionIndex >= this.questionSequence.length) {
        if (this.currentPhase === 2) {
          // Move to Phase 3: Derailers
          this.buildPhase3Sequence();
          this.currentPhase = 3;
          this.currentQuestionIndex = 0;
        } else if (this.currentPhase === 3) {
          // Calculate results
          this.calculateSpectrumPosition().then(() => {
            this.renderResults();
          });
          return;
        }
      }

      const question = this.questionSequence[this.currentQuestionIndex];
      if (!question) {
        this.calculateSpectrumPosition().then(() => {
          this.renderResults();
        });
        return;
      }

      const currentAnswer = this.answers[question.id];
      
      let html = '<div class="question-block">';
      html += `<div class="question-header">`;
      html += `<span class="phase-indicator">Phase ${this.currentPhase} of 3</span>`;
      html += `<span class="question-counter">Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>`;
      html += `</div>`;
      html += `<h3 class="question-text">${SecurityUtils.sanitizeHTML(question.text || '')}</h3>`;
      
      if (question.type === 'likert') {
        html += this.renderLikertQuestion(question, currentAnswer);
      } else if (question.type === 'text') {
        html += this.renderTextQuestion(question, currentAnswer);
      } else if (question.type === 'select') {
        html += this.renderSelectQuestion(question, currentAnswer);
      }
      
      html += '</div>';
      
      SecurityUtils.safeInnerHTML(container, html);
      
      // Attach listeners
      this.attachQuestionListeners(question);
      this.updateProgress();
      this.updateNavigationButtons();
      
      // Focus management
      const firstInput = container.querySelector('input, button, select, textarea');
      if (firstInput) {
        DOMUtils.focusElement(firstInput);
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderCurrentQuestion');
      ErrorHandler.showUserError('Failed to render question. Please refresh the page.');
    }
  }

  /**
   * Determine appropriate scale type based on question text or explicit scaleType
   * @param {Object} question - Question object
   * @returns {string} Scale type: 'agreement', 'frequency', 'extent', or 'practice'
   */
  determineScaleType(question) {
    // If explicit scaleType is provided, use it
    if (question.scaleType) {
      return question.scaleType;
    }
    
    const text = question.text.toLowerCase();
    
    // Practice/Behavioral frequency questions - use practice scale (highest priority)
    // These indicate ongoing behaviors, practices, or regular activities
    // Check for "I practice" at start, or "practice " followed by verb/noun
    if (text.match(/^i practice|practice\s+(staying|thinking|helping|acting|prayer|kindness|living|unconditional|staying aware)|work on\s+(building|reducing|creating|helping)|regular daily|actively work on/)) {
      return 'practice';
    }
    
    // Frequency indicators with temporal words - use frequency scale
    // "regularly think", "regularly", etc. (but not "practice... regularly" which is already caught above)
    if (text.match(/\b(regularly|often|always|never|sometimes|daily|weekly|routinely|frequently|consistently|each moment|each time)\b/)) {
      return 'frequency';
    }
    
    // Extent/Intensity questions - use extent scale
    // Questions about how much, to what degree, or how well
    if (text.match(/\b(try to|attempt|strive|seek|aim to|work toward|understand|feel\s+(free|connected)|see myself as|do things well|find balance)\b/)) {
      return 'extent';
    }
    
    // Belief/Opinion/Agreement questions - use agreement scale (default)
    // Questions about what you believe, think, prefer, judge, prioritize, or value
    if (text.match(/\b(believe|think\s+(about|that)|prefer|agree|disagree|consider|judge|prioritize|see as|choose|should|matters more|is a mistake|value|take responsibility|do what's right)\b/)) {
      return 'agreement';
    }
    
    // Default to agreement scale
    return 'agreement';
  }

  /**
   * Get scale labels for a given scale type
   * @param {string} scaleType - Type of scale: 'agreement', 'frequency', 'extent', or 'practice'
   * @returns {Object} Object with labels for values 1-5
   */
  getScaleLabels(scaleType) {
    const scales = {
      'agreement': {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree'
      },
      'frequency': {
        1: 'Never',
        2: 'Rarely',
        3: 'Sometimes',
        4: 'Often',
        5: 'Always'
      },
      'extent': {
        1: 'Not at all',
        2: 'A little',
        3: 'Somewhat',
        4: 'Mostly',
        5: 'Completely'
      },
      'practice': {
        1: 'Not at all',
        2: 'Rarely',
        3: 'Sometimes',
        4: 'Often',
        5: 'Every opportunity'
      }
    };
    
    return scales[scaleType] || scales['agreement'];
  }

  /**
   * Render Likert scale question
   * @param {Object} question - Question object
   * @param {number} currentAnswer - Current answer value
   * @returns {string} HTML string
   */
  renderLikertQuestion(question, currentAnswer) {
    // Ensure currentAnswer is properly parsed as a number or null if undefined/null
    // Convert to number if it's a string, otherwise use null if undefined/null
    let value = null;
    if (currentAnswer !== undefined && currentAnswer !== null) {
      value = typeof currentAnswer === 'string' ? parseInt(currentAnswer, 10) : Number(currentAnswer);
      // Only use if it's a valid number between 1-5
      if (isNaN(value) || value < 1 || value > 5) {
        value = null;
      }
    }
    
    // Determine scale type and get labels
    const scaleType = this.determineScaleType(question);
    const labels = this.getScaleLabels(scaleType);
    
    // Build checked attribute only if value matches exactly (strict equality)
    const checked1 = value === 1 ? 'checked' : '';
    const checked2 = value === 2 ? 'checked' : '';
    const checked3 = value === 3 ? 'checked' : '';
    const checked4 = value === 4 ? 'checked' : '';
    const checked5 = value === 5 ? 'checked' : '';
    
    return `
      <div class="likert-container">
        <div class="likert-scale">
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="1" ${checked1} data-question-id="${question.id}">
            <span>1 - ${SecurityUtils.sanitizeHTML(labels[1])}</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="2" ${checked2} data-question-id="${question.id}">
            <span>2 - ${SecurityUtils.sanitizeHTML(labels[2])}</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="3" ${checked3} data-question-id="${question.id}">
            <span>3 - ${SecurityUtils.sanitizeHTML(labels[3])}</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="4" ${checked4} data-question-id="${question.id}">
            <span>4 - ${SecurityUtils.sanitizeHTML(labels[4])}</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="5" ${checked5} data-question-id="${question.id}">
            <span>5 - ${SecurityUtils.sanitizeHTML(labels[5])}</span>
          </label>
        </div>
      </div>
    `;
  }

  /**
   * Render text input question
   * @param {Object} question - Question object
   * @param {string} currentAnswer - Current answer text
   * @returns {string} HTML string
   */
  renderTextQuestion(question, currentAnswer) {
    return `
      <div class="text-input-container">
        <textarea 
          id="questionInput_${question.id}"
          data-question-id="${question.id}"
          rows="4"
          placeholder="Enter your response..."
        >${SecurityUtils.sanitizeHTML(currentAnswer || '')}</textarea>
      </div>
    `;
  }

  /**
   * Render select question
   * @param {Object} question - Question object
   * @param {string} currentAnswer - Current selected value
   * @returns {string} HTML string
   */
  renderSelectQuestion(question, currentAnswer) {
    // This would need paradigm subsets data - simplified for now
    return `
      <div class="select-container">
        <select id="questionInput_${question.id}" data-question-id="${question.id}">
          <option value="">Select an option...</option>
          <!-- Options would be generated from paradigm subsets -->
        </select>
      </div>
    `;
  }

  /**
   * Attach event listeners for question inputs
   * @param {Object} question - Question object
   */
  attachQuestionListeners(question) {
    if (question.type === 'likert') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          this.answers[question.id] = parseInt(e.target.value);
          this.saveProgress();
        });
      });
    } else if (question.type === 'text') {
      const textarea = document.getElementById(`questionInput_${question.id}`);
      if (textarea) {
        textarea.addEventListener('input', (e) => {
          this.answers[question.id] = e.target.value;
          this.saveProgress();
        });
      }
    } else if (question.type === 'select') {
      const select = document.getElementById(`questionInput_${question.id}`);
      if (select) {
        select.addEventListener('change', (e) => {
          this.answers[question.id] = e.target.value;
          this.saveProgress();
        });
      }
    }
  }

  /**
   * Move to next question
   */
  nextQuestion() {
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (!currentQuestion) {
      return;
    }
    
    // Check if answer exists and is valid (not null, undefined, empty string, or invalid)
    const answer = this.answers[currentQuestion.id];
    if (answer === undefined || answer === null || answer === '' || 
        (typeof answer === 'number' && (isNaN(answer) || answer < 1 || answer > 5))) {
      ErrorHandler.showUserError('Please select an answer before continuing.');
      return;
    }
    
    this.currentQuestionIndex++;
    this.renderCurrentQuestion();
  }

  /**
   * Move to previous question
   */
  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  /**
   * Update progress bar
   */
  updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const totalQuestions = this.questionSequence.length;
    const currentProgress = totalQuestions > 0 ? ((this.currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    progressBar.style.width = `${currentProgress}%`;
    
    const progressText = document.getElementById('progressText');
    if (progressText) {
      progressText.textContent = `${this.currentQuestionIndex + 1} / ${totalQuestions}`;
    }
  }

  /**
   * Update navigation buttons
   */
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      const isLastQuestion = this.currentQuestionIndex >= this.questionSequence.length - 1;
      nextBtn.textContent = isLastQuestion ? 'Complete Assessment' : 'Next Question';
    }
  }

  /**
   * Calculate derailer penalties
   */
  calculateDerailerPenalties() {
    this.derailerScores = {
      hypocrisy: 0,
      reluctance: 0,
      nihilism: 0
    };
    
    Object.entries(DERAILERS).forEach(([key, derailer]) => {
      const answers = derailer.questions
        .map(q => this.answers[q.id])
        .filter(a => a !== undefined && a !== null);
      
      if (answers.length > 0) {
        // Average Likert scores (1-5), higher = more derailer present
        const average = answers.reduce((sum, val) => sum + parseInt(val), 0) / answers.length;
        // Convert to penalty: 5 = max penalty, 1 = no penalty
        const penalty = ((average - 1) / 4) * Math.abs(derailer.penalty);
        this.derailerScores[key] = penalty;
      }
    });
  }

  /**
   * Calculate spectrum position (0-100)
   */
  async calculateSpectrumPosition() {
    await this.loadSpectrumData();
    
    // Calculate base score from paradigm alignments
    let baseScore = 0;
    let totalWeight = 0;
    
    this.selectedParadigms.forEach(paradigmId => {
      const paradigm = SOVEREIGNTY_PARADIGMS.find(p => p.id === paradigmId);
      if (!paradigm) return;
      
      // Get answers for this paradigm's questions
      const paradigmAnswers = paradigm.questions
        .map(q => this.answers[q.id])
        .filter(a => a !== undefined && a !== null)
        .map(a => parseInt(a));
      
      if (paradigmAnswers.length > 0) {
        const alignment = paradigmAnswers.reduce((sum, val) => sum + val, 0) / paradigmAnswers.length;
        // Normalize to 0-1 scale (1-5 Likert becomes 0-1)
        const normalizedAlignment = (alignment - 1) / 4;
        baseScore += normalizedAlignment * paradigm.weight;
        totalWeight += paradigm.weight;
      }
    });
    
    // Average base score
    const averageBaseScore = totalWeight > 0 ? baseScore / totalWeight : 0;
    
    // Calculate derailer penalties
    this.calculateDerailerPenalties();
    const totalPenalty = Object.values(this.derailerScores).reduce((sum, val) => sum + val, 0);
    
    // Calculate final position
    const adjustedScore = averageBaseScore - (totalPenalty / 100);
    this.spectrumPosition = Math.max(0, Math.min(100, adjustedScore * 100));
    
    // Get label
    if (getSpectrumLabel) {
      this.analysisData.spectrumLabel = getSpectrumLabel(this.spectrumPosition);
    } else {
      // Fallback
      if (this.spectrumPosition < 25) {
        this.analysisData.spectrumLabel = SPECTRUM_THRESHOLDS[0];
      } else if (this.spectrumPosition < 50) {
        this.analysisData.spectrumLabel = SPECTRUM_THRESHOLDS[25];
      } else if (this.spectrumPosition < 75) {
        this.analysisData.spectrumLabel = SPECTRUM_THRESHOLDS[50];
      } else if (this.spectrumPosition < 100) {
        this.analysisData.spectrumLabel = SPECTRUM_THRESHOLDS[75];
      } else {
        this.analysisData.spectrumLabel = SPECTRUM_THRESHOLDS[100];
      }
    }
    
    // Store in analysis data
    this.analysisData.spectrumPosition = this.spectrumPosition;
    this.analysisData.derailerScores = { ...this.derailerScores };
    this.analysisData.selectedParadigms = [...this.selectedParadigms];
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      paradigm: q.paradigm
    }));
    
    // Generate remediation paths
    this.generateRemediationPaths();
  }

  /**
   * Generate remediation paths based on results
   */
  generateRemediationPaths() {
    const paths = [];
    
    // Address derailers
    if (this.derailerScores.hypocrisy > 5) {
      paths.push({
        type: 'hypocrisy',
        priority: 'high',
        action: 'Bridge value-action gaps: Journal value-actions weekly, identify specific contradictions, create accountability structures'
      });
    }
    
    if (this.derailerScores.reluctance > 5) {
      paths.push({
        type: 'reluctance',
        priority: 'high',
        action: 'Address inertial resistance: Break large actions into small steps, set deadlines, identify and challenge avoidance patterns'
      });
    }
    
    if (this.derailerScores.nihilism > 10) {
      paths.push({
        type: 'nihilism',
        priority: 'critical',
        action: 'Alchemize meaninglessness: Explore active nihilism (Nietzsche), find value creation despite void, consider professional support'
      });
    }
    
    // Low spectrum position
    if (this.spectrumPosition < 50) {
      paths.push({
        type: 'alignment',
        priority: 'medium',
        action: 'Strengthen paradigm alignment: Deepen understanding of selected paradigms, practice core behaviors, find community support'
      });
    }
    
    this.analysisData.remediationPaths = paths;
  }

  /**
   * Render results
   */
  renderResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    // Hide questionnaire, show results
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsSection = document.getElementById('resultsSection');
    if (questionnaireSection) questionnaireSection.classList.remove('active');
    if (resultsSection) resultsSection.classList.add('active');
    
    let html = '<div class="spectrum-results">';
    html += '<h3>Your Sovereignty Paradigm Results</h3>';
    html += '<p>Based on your responses, here is your identified sovereignty paradigm and your integration level with that paradigm.</p>';
    
    // Selected paradigms (show first - identification is primary)
    html += '<div class="selected-paradigms">';
    html += '<h4>Your Identified Sovereignty Paradigm(s)</h4>';
    html += '<p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 1rem;">These are the paradigms that best describe your approach to sovereignty. This is about identification and clarification, not ranking paradigms as superior or inferior.</p>';
    this.selectedParadigms.forEach(paradigmId => {
      const paradigm = SOVEREIGNTY_PARADIGMS.find(p => p.id === paradigmId);
      if (paradigm) {
        html += `<div class="paradigm-result-card">`;
        html += `<h5>${SecurityUtils.sanitizeHTML(paradigm.name)}</h5>`;
        html += `<p>${SecurityUtils.sanitizeHTML(paradigm.description)}</p>`;
        html += `</div>`;
      }
    });
    html += '</div>';
    
    // Integration level (secondary - how well they live according to their identified paradigm)
    html += '<div class="spectrum-bar-container" style="margin-top: 2rem;">';
    html += '<h4>Integration Level with Your Identified Paradigm</h4>';
    html += '<p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 1rem;">This measures how consistently you live according to your identified paradigm, accounting for value-action alignment and derailing forces. It does not rank paradigms themselves.</p>';
    html += `<div class="spectrum-label">${SecurityUtils.sanitizeHTML(this.analysisData.spectrumLabel)}</div>`;
    html += `<div class="spectrum-bar">`;
    html += `<div class="spectrum-fill" style="width: ${this.spectrumPosition}%"></div>`;
    html += `<div class="spectrum-value">${this.spectrumPosition.toFixed(1)}/100</div>`;
    html += `</div>`;
    html += '</div>';
    
    // Derailer scores
    html += '<div class="derailer-scores" style="margin-top: 2rem;">';
    html += '<h4>Derailer Analysis</h4>';
    Object.entries(this.derailerScores).forEach(([key, score]) => {
      const derailer = DERAILERS[key];
      if (derailer) {
        const percentage = (score / Math.abs(derailer.penalty)) * 100;
        html += `<div class="derailer-item">`;
        html += `<strong>${SecurityUtils.sanitizeHTML(derailer.name)}:</strong> `;
        html += `${percentage.toFixed(1)}% (${score.toFixed(1)}/${Math.abs(derailer.penalty)} penalty points)`;
        html += `<p class="derailer-desc">${SecurityUtils.sanitizeHTML(derailer.description)}</p>`;
        html += `</div>`;
      }
    });
    html += '</div>';
    
    // Remediation paths
    if (this.analysisData.remediationPaths.length > 0) {
      html += '<div class="remediation-paths">';
      html += '<h4>Recommended Remediation Paths</h4>';
      this.analysisData.remediationPaths.forEach(path => {
        const priorityClass = path.priority === 'critical' ? 'critical' : path.priority === 'high' ? 'high' : 'medium';
        html += `<div class="remediation-item ${priorityClass}">`;
        html += `<strong>[${path.priority.toUpperCase()}] ${SecurityUtils.sanitizeHTML(path.type)}:</strong> `;
        html += `<p>${SecurityUtils.sanitizeHTML(path.action)}</p>`;
        html += `</div>`;
      });
      html += '</div>';
    }
    
    html += '</div>';
    
    SecurityUtils.safeInnerHTML(container, html);
    
    // Save final results
    this.saveProgress();
  }

  /**
   * Export analysis data
   * @param {string} format - Export format ('json' or 'csv')
   */
  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'sovereignty-paradigm', 'Technical Title for your Sovereignty Paradigm');
      downloadFile(csv, 'sovereignty-spectrum-analysis.csv', 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'sovereignty-spectrum-analysis');
      downloadFile(json, 'sovereignty-spectrum-analysis.json', 'application/json');
    }
  }

  /**
   * Save progress to storage
   */
  saveProgress() {
    try {
      const progress = {
        selectedParadigms: this.selectedParadigms,
        paradigmRatings: this.paradigmRatings,
        currentPhase: this.currentPhase,
        currentQuestionIndex: this.currentQuestionIndex,
        answers: this.answers,
        questionSequence: this.questionSequence,
        spectrumPosition: this.spectrumPosition,
        derailerScores: this.derailerScores,
        analysisData: this.analysisData
      };
      this.dataStore.save('progress', progress);
    } catch (error) {
      this.debugReporter.logError(error, 'saveProgress');
    }
  }

  /**
   * Load stored progress
   * @returns {Promise<void>}
   */
  async loadStoredData() {
    try {
      const progress = this.dataStore.load('progress');
      if (progress) {
        this.selectedParadigms = progress.selectedParadigms || [];
        this.paradigmRatings = progress.paradigmRatings || {};
        this.currentPhase = progress.currentPhase || 1;
        this.currentQuestionIndex = progress.currentQuestionIndex || 0;
        this.answers = progress.answers || {};
        this.questionSequence = progress.questionSequence || [];
        this.spectrumPosition = progress.spectrumPosition || 0;
        this.derailerScores = progress.derailerScores || { hypocrisy: 0, reluctance: 0, nihilism: 0 };
        this.analysisData = progress.analysisData || this.analysisData;
        
        // Restore UI state
        if (this.currentPhase === 1) {
          await this.renderParadigmSelection();
        } else if (this.currentPhase > 1) {
          // Show questionnaire and render current question
          const paradigmSelection = document.getElementById('paradigmSelection');
          const questionnaireSection = document.getElementById('questionnaireSection');
          if (paradigmSelection) paradigmSelection.style.display = 'none';
          if (questionnaireSection) questionnaireSection.classList.add('active');
          this.renderCurrentQuestion();
        }
      } else {
        // First time - render paradigm selection
        await this.renderParadigmSelection();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      // On error, start fresh
      await this.renderParadigmSelection();
    }
  }

  /**
   * Reset assessment
   */
  resetAssessment() {
    this.selectedParadigms = [];
    this.paradigmRatings = {};
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.spectrumPosition = 0;
    this.derailerScores = { hypocrisy: 0, reluctance: 0, nihilism: 0 };
    this.analysisData = {
      timestamp: new Date().toISOString(),
      selectedParadigms: [],
      paradigmRatings: {},
      paradigmAlignments: {},
      derailerScores: {},
      spectrumPosition: 0,
      spectrumLabel: '',
      remediationPaths: [],
      allAnswers: {},
      questionSequence: []
    };
    
    this.dataStore.clear('progress');
    
    // Reset UI
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsSection = document.getElementById('resultsSection');
    if (questionnaireSection) questionnaireSection.classList.remove('active');
    if (resultsSection) resultsSection.classList.remove('active');
    
    this.renderParadigmSelection();
  }
}

