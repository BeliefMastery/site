// Sovereignty Spectrum Engine - Version 1.0
// Maps users on 0-100 spectrum from Nihilistic Fragmentation to Paradigm-Integrated Sovereignty
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
    this.paradigmRatings = {}; // Store ratings for all paradigms
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
   * Rate a paradigm (1-5 scale)
   * @param {string} paradigmId - ID of paradigm to rate
   * @param {number} rating - Rating value (1-5)
   */
  rateParadigm(paradigmId, rating) {
    this.paradigmRatings[paradigmId] = parseInt(rating);
    
    // Update UI
    const card = document.querySelector(`[data-paradigm="${paradigmId}"]`);
    if (card) {
      const ratingInput = card.querySelector(`input[type="radio"]:checked`);
      if (ratingInput) {
        // Visual feedback
        card.classList.add('rated');
        const ratingDisplay = card.querySelector('.rating-display');
        if (ratingDisplay) {
          ratingDisplay.textContent = `Rating: ${rating}/5`;
        }
      }
    }
    
    // Check if all paradigms are rated
    this.checkParadigmRatingComplete();
    this.saveProgress();
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
   * Select top paradigms based on ratings
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
   * Render paradigm rating (Phase 1)
   */
  async renderParadigmSelection() {
    await this.loadSpectrumData();
    
    const container = document.getElementById('paradigmSelection');
    if (!container) return;
    
    let html = '<div class="paradigm-selection-intro">';
    html += '<h3>Rate Each Paradigm</h3>';
    html += '<p>Rate how much each philosophical, spiritual, or psychological framework resonates with your values and worldview. Use a scale of 1 (Not at all) to 5 (Strongly resonates). The system will automatically select your top 3-5 paradigms based on your ratings.</p>';
    html += '</div>';
    html += '<div class="paradigm-grid">';
    
    // Group paradigms by category
    const categories = {
      'Philosophical (Ancient)': ['stoicism', 'epicureanism', 'cynicism'],
      'Philosophical (Modern)': ['existentialism', 'kantian_deontology', 'utilitarianism', 'libertarianism'],
      'Spiritual/Religious': ['buddhism', 'taoism', 'christianity', 'humanism'],
      'Psychological/Self-Help': ['positive_psychology', 'cognitive_behavioral', 'mindfulness_secular'],
      'Counter/Edge Paradigms': ['nihilism', 'postmodern_relativism', 'absurdism']
    };
    
    Object.entries(categories).forEach(([categoryName, paradigmIds]) => {
      html += `<div class="paradigm-category"><h4>${SecurityUtils.sanitizeHTML(categoryName)}</h4>`;
      
      paradigmIds.forEach(paradigmId => {
        const paradigm = SOVEREIGNTY_PARADIGMS.find(p => p.id === paradigmId);
        if (!paradigm) return;
        
        const currentRating = this.paradigmRatings[paradigmId] || null;
        const ratedClass = currentRating ? 'rated' : '';
        
        html += `
          <div class="paradigm-card ${ratedClass}" data-paradigm="${paradigmId}">
            <h5>${SecurityUtils.sanitizeHTML(paradigm.name)}</h5>
            <p class="paradigm-description">${SecurityUtils.sanitizeHTML(paradigm.description)}</p>
            <div class="paradigm-values">
              <strong>Values:</strong> ${SecurityUtils.sanitizeHTML(paradigm.values.join(', '))}
            </div>
            <div class="paradigm-rating">
              <label>How much does this resonate with you?</label>
              <div class="rating-scale">
                <label class="rating-option">
                  <input type="radio" name="paradigm_${paradigmId}" value="1" ${currentRating === 1 ? 'checked' : ''} data-paradigm-id="${paradigmId}">
                  <span>1 - Not at all</span>
                </label>
                <label class="rating-option">
                  <input type="radio" name="paradigm_${paradigmId}" value="2" ${currentRating === 2 ? 'checked' : ''} data-paradigm-id="${paradigmId}">
                  <span>2 - Slightly</span>
                </label>
                <label class="rating-option">
                  <input type="radio" name="paradigm_${paradigmId}" value="3" ${currentRating === 3 ? 'checked' : ''} data-paradigm-id="${paradigmId}">
                  <span>3 - Moderately</span>
                </label>
                <label class="rating-option">
                  <input type="radio" name="paradigm_${paradigmId}" value="4" ${currentRating === 4 ? 'checked' : ''} data-paradigm-id="${paradigmId}">
                  <span>4 - Strongly</span>
                </label>
                <label class="rating-option">
                  <input type="radio" name="paradigm_${paradigmId}" value="5" ${currentRating === 5 ? 'checked' : ''} data-paradigm-id="${paradigmId}">
                  <span>5 - Very strongly</span>
                </label>
              </div>
              ${currentRating ? `<div class="rating-display">Rating: ${currentRating}/5</div>` : ''}
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    });
    
    html += '</div>';
    html += '<div style="text-align: center; margin-top: 2rem;">';
    const ratedCount = Object.keys(this.paradigmRatings).filter(id => this.paradigmRatings[id] !== undefined && this.paradigmRatings[id] !== null).length;
    const totalParadigms = SOVEREIGNTY_PARADIGMS ? SOVEREIGNTY_PARADIGMS.length : 18;
    html += `<button class="btn btn-primary" id="startAssessment" ${ratedCount < totalParadigms ? 'disabled' : ''}>${ratedCount < totalParadigms ? `Rate All Paradigms (${ratedCount}/${totalParadigms})` : 'Continue to Assessment'}</button>`;
    html += '</div>';
    
    SecurityUtils.safeInnerHTML(container, html);
    
    // Attach rating listeners
    const ratingInputs = container.querySelectorAll('input[type="radio"][data-paradigm-id]');
    ratingInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const paradigmId = e.target.dataset.paradigmId;
        const rating = e.target.value;
        this.rateParadigm(paradigmId, rating);
      });
    });
    
    // Re-attach start button listener
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startAssessment());
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
   * Render Likert scale question
   * @param {Object} question - Question object
   * @param {number} currentAnswer - Current answer value
   * @returns {string} HTML string
   */
  renderLikertQuestion(question, currentAnswer) {
    const value = currentAnswer || 3;
    return `
      <div class="likert-container">
        <div class="likert-scale">
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="1" ${value === 1 ? 'checked' : ''} data-question-id="${question.id}">
            <span>1 - Strongly Disagree</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="2" ${value === 2 ? 'checked' : ''} data-question-id="${question.id}">
            <span>2 - Disagree</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="3" ${value === 3 ? 'checked' : ''} data-question-id="${question.id}">
            <span>3 - Neutral</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="4" ${value === 4 ? 'checked' : ''} data-question-id="${question.id}">
            <span>4 - Agree</span>
          </label>
          <label class="likert-option">
            <input type="radio" name="question_${question.id}" value="5" ${value === 5 ? 'checked' : ''} data-question-id="${question.id}">
            <span>5 - Strongly Agree</span>
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
    if (currentQuestion && !this.answers[currentQuestion.id]) {
      ErrorHandler.showUserError('Please answer the current question before continuing.');
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
    html += '<h3>Sovereignty Spectrum Analysis Results</h3>';
    html += '<p>Based on your responses, here is your position on the sovereignty spectrum.</p>';
    
    // Spectrum bar
    html += '<div class="spectrum-bar-container">';
    html += `<div class="spectrum-label">${SecurityUtils.sanitizeHTML(this.analysisData.spectrumLabel)}</div>`;
    html += `<div class="spectrum-bar">`;
    html += `<div class="spectrum-fill" style="width: ${this.spectrumPosition}%"></div>`;
    html += `<div class="spectrum-value">${this.spectrumPosition.toFixed(1)}/100</div>`;
    html += `</div>`;
    html += '</div>';
    
    // Selected paradigms
    html += '<div class="selected-paradigms">';
    html += '<h4>Your Selected Paradigms</h4>';
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
    
    // Derailer scores
    html += '<div class="derailer-scores">';
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
      const csv = exportForAIAgent(this.analysisData, 'sovereignty-spectrum', 'Sovereignty Spectrum Analysis');
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

