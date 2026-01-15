// Temperament Analyzer Engine - Version 2.1
// Maps position on masculine-feminine temperament spectrum
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

// Data modules - will be loaded lazily
let TEMPERAMENT_DIMENSIONS, INTIMATE_DYNAMICS;
let ATTRACTION_RESPONSIVENESS, TEMPERAMENT_SCORING;
let PHASE_1_ORIENTATION_QUESTIONS;

const GENDER_QUESTION = {
  id: 'p1_gender',
  type: 'gender',
  question: 'What is your gender?',
  options: [
    { value: 'woman', label: 'Woman' },
    { value: 'man', label: 'Man' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ]
};

/**
 * Temperament Engine - Analyzes masculine-feminine temperament spectrum
 */
export class TemperamentEngine {
  /**
   * Initialize the temperament engine
   */
  constructor() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.phase1Results = null; // Preliminary orientation results
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: null,
      dimensionScores: {},
      overallTemperament: null,
      variationAnalysis: {},
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('TemperamentEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('temperament-assessment', '1.0.0');

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
   * Load temperament data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadTemperamentData() {
    if (PHASE_1_ORIENTATION_QUESTIONS && TEMPERAMENT_DIMENSIONS) {
      return; // Already loaded
    }

    try {
      // Load orientation questions
      const orientationModule = await loadDataModule(
        './temperament-data/temperament-orientation.js',
        'Orientation Questions'
      );
      PHASE_1_ORIENTATION_QUESTIONS = orientationModule.PHASE_1_ORIENTATION_QUESTIONS;

      // Load dimensions data
      const dimensionsModule = await loadDataModule(
        './temperament-data/temperament-dimensions.js',
        'Temperament Dimensions'
      );
      TEMPERAMENT_DIMENSIONS = dimensionsModule.TEMPERAMENT_DIMENSIONS;

      // Load intimate dynamics data
      const dynamicsModule = await loadDataModule(
        './temperament-data/intimate-dynamics.js',
        'Intimate Dynamics'
      );
      INTIMATE_DYNAMICS = dynamicsModule.INTIMATE_DYNAMICS;

      // Load attraction responsiveness data
      const attractionModule = await loadDataModule(
        './temperament-data/attraction-responsiveness.js',
        'Attraction Responsiveness'
      );
      ATTRACTION_RESPONSIVENESS = attractionModule.ATTRACTION_RESPONSIVENESS;

      // Load scoring data
      const scoringModule = await loadDataModule(
        './temperament-data/temperament-scoring.js',
        'Temperament Scoring'
      );
      TEMPERAMENT_SCORING = scoringModule.TEMPERAMENT_SCORING;

      const phase1Count = (PHASE_1_ORIENTATION_QUESTIONS?.length || 0) + 1;
      this.debugReporter.recordSection('Phase 1', phase1Count);
    } catch (error) {
      this.debugReporter.logError(error, 'loadTemperamentData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  /**
   * Build Phase 1 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase1Sequence() {
    await this.loadTemperamentData();
    
    // Phase 1: Orientation Screening (7 quick questions)
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.questionSequence = [GENDER_QUESTION, ...PHASE_1_ORIENTATION_QUESTIONS];
    this.debugReporter.recordQuestionCount(this.questionSequence.length);
  }

  /**
   * Analyze Phase 1 results and proceed to Phase 2
   * @returns {Promise<void>}
   */
  async analyzePhase1Results() {
    await this.loadTemperamentData();
    
    try {
      // Calculate preliminary orientation scores
      let totalMasculine = 0;
      let totalFeminine = 0;
      let totalWeight = 0;

      PHASE_1_ORIENTATION_QUESTIONS.forEach(question => {
        const answer = this.answers[question.id];
        if (answer && answer.mapsTo) {
          const weight = answer.mapsTo.weight || 1;
          totalMasculine += (answer.mapsTo.masculine || 0) * weight;
          totalFeminine += (answer.mapsTo.feminine || 0) * weight;
          totalWeight += weight;
        }
      });

      const avgMasculine = totalWeight > 0 ? totalMasculine / totalWeight : 0;
      const avgFeminine = totalWeight > 0 ? totalFeminine / totalWeight : 0;
      const net = avgMasculine - avgFeminine;
      const normalizedScore = (net + 2) / 4; // Normalize to 0-1 scale

      this.phase1Results = {
        masculine: avgMasculine,
        feminine: avgFeminine,
        net: net,
        normalizedScore: normalizedScore
      };

      this.analysisData.phase1Results = this.phase1Results;

      // Build Phase 2 sequence
      await this.buildPhase2Sequence();
    } catch (error) {
      this.debugReporter.logError(error, 'analyzePhase1Results');
      ErrorHandler.showUserError('Failed to analyze Phase 1 results. Please try again.');
    }
  }

  /**
   * Build Phase 2 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase2Sequence() {
    await this.loadTemperamentData();
    
    try {
      // Phase 2: Deep Mapping (all remaining questions)
      this.currentPhase = 2;
      this.currentQuestionIndex = 0;
      this.questionSequence = [];
      
      // Add questions from all dimension categories
      Object.keys(TEMPERAMENT_DIMENSIONS).forEach(dimKey => {
      const dimension = TEMPERAMENT_DIMENSIONS[dimKey];
      dimension.questions.forEach(q => {
        this.questionSequence.push({
          id: q.id,
          type: 'dimension',
          dimension: dimKey,
          dimensionName: dimension.name,
          question: q.question,
          description: dimension.description,
          masculineWeight: q.masculineWeight,
          feminineWeight: q.feminineWeight
        });
      });
    });

    // Add intimate dynamics questions
    Object.keys(INTIMATE_DYNAMICS).forEach(catKey => {
      const category = INTIMATE_DYNAMICS[catKey];
      category.questions.forEach(q => {
        this.questionSequence.push({
          id: q.id,
          type: 'intimate',
          category: catKey,
          categoryName: category.name,
          question: q.question,
          description: category.description,
          masculineWeight: q.masculineWeight,
          feminineWeight: q.feminineWeight
        });
      });
    });

    // Add attraction responsiveness questions
    Object.keys(ATTRACTION_RESPONSIVENESS).forEach(catKey => {
      const category = ATTRACTION_RESPONSIVENESS[catKey];
      category.questions.forEach(q => {
        this.questionSequence.push({
          id: q.id,
          type: 'attraction',
          category: catKey,
          categoryName: category.name,
          question: q.question,
          description: category.description,
          masculineWeight: q.masculineWeight,
          feminineWeight: q.feminineWeight
        });
      });
    });

    // Shuffle questions to mitigate bias
    this.questionSequence.sort(() => Math.random() - 0.5);
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase2Sequence');
      ErrorHandler.showUserError('Failed to build Phase 2 sequence. Please try again.');
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

    const exportJSONBtn = document.getElementById('exportAnalysisJSON');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportAnalysis('json'));
    }

    const exportCSVBtn = document.getElementById('exportAnalysisCSV');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportAnalysis('csv'));
    }

    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }

    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to abandon this assessment? All progress will be lost.')) {
          this.resetAssessment();
        }
      });
    }
  }

  async startAssessment() {
    const introSection = document.getElementById('introSection');
    const actionButtonsSection = document.getElementById('actionButtonsSection');
    const questionnaireSection = document.getElementById('questionnaireSection');

    if (introSection) introSection.classList.add('hidden');
    if (actionButtonsSection) actionButtonsSection.classList.add('hidden');
    if (questionnaireSection) questionnaireSection.classList.add('active');

    await this.buildPhase1Sequence();
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
    this.updateProgress();
    this.saveProgress();
  }

  /**
   * Render the current question
   */
  renderCurrentQuestion() {
    const renderStart = performance.now();
    const questionContainer = document.getElementById('questionContainer');
    
    if (!questionContainer) {
      ErrorHandler.showUserError('Question container not found. Please refresh the page.');
      return;
    }

    try {
      if (this.currentQuestionIndex >= this.questionSequence.length) {
        if (this.currentPhase === 1) {
          this.analyzePhase1Results();
          this.showPhase1Feedback();
          return;
        } else {
          this.calculateResults();
          this.renderResults();
          return;
        }
      }

    const currentQ = this.questionSequence[this.currentQuestionIndex];
    
    // Phase 1: Render gender prompt first
    if (this.currentPhase === 1 && currentQ.type === 'gender') {
      this.renderGenderQuestion(currentQ);
      return;
    }

    // Phase 1: Render 3-point orientation questions
    if (this.currentPhase === 1 && currentQ.type === 'three_point') {
      this.renderThreePointQuestion(currentQ);
      return;
    }
    
    // Phase 2: Check if entering intimate dynamics section and show consent gate
    if (this.currentPhase === 2 && currentQ.type === 'intimate' && !this.analysisData.intimateConsentGiven) {
      this.showIntimateConsentGate();
      return;
    }
    
    // Phase 2: Render slider-based questions (existing logic)
    this.renderSliderQuestion(currentQ);
    } catch (error) {
      this.debugReporter.logError(error, 'renderCurrentQuestion');
      ErrorHandler.showUserError('Failed to render question. Please refresh the page.');
    }
  }

  renderGenderQuestion(question) {
    const questionContainer = document.getElementById('questionContainer');
    const currentAnswer = this.answers[question.id];

    SecurityUtils.safeInnerHTML(questionContainer, `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">Orientation</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="three-point-options">
          ${question.options.map((option, index) => `
            <label class="three-point-option ${currentAnswer && currentAnswer.value === option.value ? 'selected' : ''}">
              <input
                type="radio"
                name="question_${question.id}"
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.value === option.value ? 'checked' : ''}
              />
              <span class="option-text">${SecurityUtils.sanitizeHTML(option.label || '')}</span>
            </label>
          `).join('')}
        </div>
        <p class="question-help">This helps us contextualize your results. You can skip by choosing “Prefer not to say.”</p>
      </div>
    `);

    const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const optionData = JSON.parse(e.target.dataset.optionData);
        this.answers[question.id] = optionData;
        this.analysisData.gender = optionData.value;
        this.analysisData.genderLabel = optionData.label;

        document.querySelectorAll('.three-point-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        e.target.closest('label').classList.add('selected');

        this.saveProgress();
      });
    });

    this.updateProgress();
    this.updateNavigationButtons();
  }

  renderThreePointQuestion(question) {
    const questionContainer = document.getElementById('questionContainer');
    const currentAnswer = this.answers[question.id];
    
    SecurityUtils.safeInnerHTML(questionContainer, `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">Orientation</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="three-point-options">
          ${question.options.map((option, index) => `
            <label class="three-point-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
            </label>
          `).join('')}
        </div>
        <div class="temperament-tip">
          <strong>Tip:</strong> Answer based on what feels most natural to you, not what you think you "should" be.
        </div>
      </div>
    `);
    
    // Attach event listeners
    const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const optionData = JSON.parse(e.target.dataset.optionData);
        this.answers[question.id] = optionData;
        
        // Update visual selection
        document.querySelectorAll('.three-point-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        e.target.closest('label').classList.add('selected');
        
        this.saveProgress();
      });
    });
    
    this.updateProgress();
    this.updateNavigationButtons();
  }

  renderSliderQuestion(currentQ) {
    const questionContainer = document.getElementById('questionContainer');
    const savedAnswer = this.answers[currentQ.id] !== undefined ? this.answers[currentQ.id] : 5;

    let categoryInfo = '';
    if (currentQ.dimensionName) {
      categoryInfo = `<p class="description">${SecurityUtils.sanitizeHTML(currentQ.dimensionName)}</p>`;
    } else if (currentQ.categoryName) {
      categoryInfo = `<p class="description">${SecurityUtils.sanitizeHTML(currentQ.categoryName)}</p>`;
    }

    SecurityUtils.safeInnerHTML(questionContainer, `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">Deep Mapping</span>
        </div>
        ${categoryInfo}
        <h3>${SecurityUtils.sanitizeHTML(currentQ.question || '')}</h3>
        ${currentQ.description ? `<p class="description">${SecurityUtils.sanitizeHTML(currentQ.description)}</p>` : ''}
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" min="0" max="10" value="${savedAnswer}" class="slider" id="questionSlider" step="1">
            <div class="scale-labels">
              <span>Very Low / Minimal / Weak / Rare / Never (0-2)</span>
              <span>Moderate / Somewhat / Average / Sometimes (5-6)</span>
              <span>Very High / Strong / Potent / Frequent / Always (9-10)</span>
            </div>
          </div>
          <span class="scale-value" id="sliderValue">${savedAnswer}</span>
        </div>
        <div class="temperament-tip">
          <strong>Tip:</strong> Answer based on your authentic experience and preferences, not what you think you "should" be.
        </div>
      </div>
    `);

    const slider = document.getElementById('questionSlider');
    const sliderValueSpan = document.getElementById('sliderValue');
    if (slider && sliderValueSpan) {
      slider.oninput = (event) => {
        sliderValueSpan.textContent = event.target.value;
        this.answers[currentQ.id] = parseInt(event.target.value);
        this.saveProgress();
      };
    }

    this.updateProgress();
    this.updateNavigationButtons();
  }

  showPhase1Feedback() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer || !this.phase1Results) return;
    
    const score = this.phase1Results.normalizedScore;
    let rangeLabel = '';
    let rangeDescription = '';
    
    if (score >= 0.7) {
      rangeLabel = 'Masculine-Leaning Range';
      rangeDescription = 'Your initial responses suggest a tendency toward masculine-leaning expression patterns. The detailed assessment will help clarify the specific dimensions and contexts where this shows up.';
    } else if (score >= 0.55) {
      rangeLabel = 'Balanced-Masculine Range';
      rangeDescription = 'Your initial responses suggest a balanced orientation with slight masculine-leaning tendencies. The detailed assessment will explore the nuances across different dimensions.';
    } else if (score >= 0.45) {
      rangeLabel = 'Balanced Range';
      rangeDescription = 'Your initial responses suggest a balanced temperament with flexibility across the spectrum. The detailed assessment will map how this expresses across different dimensions and contexts.';
    } else if (score >= 0.3) {
      rangeLabel = 'Balanced-Feminine Range';
      rangeDescription = 'Your initial responses suggest a balanced orientation with slight feminine-leaning tendencies. The detailed assessment will explore the nuances across different dimensions.';
    } else {
      rangeLabel = 'Feminine-Leaning Range';
      rangeDescription = 'Your initial responses suggest a tendency toward feminine-leaning expression patterns. The detailed assessment will help clarify the specific dimensions and contexts where this shows up.';
    }
    
    SecurityUtils.safeInnerHTML(questionContainer, `
      <div class="transition-card temperament-orientation-card">
        <h3 class="temperament-panel-title">Orientation Complete</h3>
        <div class="temperament-info-box">
          <h4>${SecurityUtils.sanitizeHTML(rangeLabel)}</h4>
          <p>${SecurityUtils.sanitizeHTML(rangeDescription)}</p>
          <div class="temperament-spectrum">
            <div class="temperament-marker" style="left: ${score * 100}%;"></div>
          </div>
          <p class="temperament-spectrum-position">
            Preliminary Position: ${(score * 100).toFixed(0)}% on the spectrum
          </p>
        </div>
        <p class="temperament-panel-text">
          Now we'll explore the detailed dimensions to map your temperament expression across different contexts and relationships.
        </p>
        <button class="btn btn-primary" id="continueToPhase2">Continue to Detailed Assessment</button>
      </div>
    `);
    
    const continueBtn = document.getElementById('continueToPhase2');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.renderCurrentQuestion(); // Start Phase 2
      });
    }
    
    this.updateNavigationButtons();
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      // Calculate total progress across both phases
      const phase1Total = PHASE_1_ORIENTATION_QUESTIONS.length + 1;
      const phase2Total = this.currentPhase === 2 ? this.questionSequence.length : 
                         (Object.keys(TEMPERAMENT_DIMENSIONS).reduce((sum, k) => sum + TEMPERAMENT_DIMENSIONS[k].questions.length, 0) +
                          Object.keys(INTIMATE_DYNAMICS).reduce((sum, k) => sum + INTIMATE_DYNAMICS[k].questions.length, 0) +
                          Object.keys(ATTRACTION_RESPONSIVENESS).reduce((sum, k) => sum + ATTRACTION_RESPONSIVENESS[k].questions.length, 0));
      const totalQuestions = phase1Total + phase2Total;
      
      let currentProgress = 0;
      if (this.currentPhase === 1) {
        currentProgress = this.currentQuestionIndex + 1;
      } else {
        currentProgress = phase1Total + this.currentQuestionIndex + 1;
      }
      
      const progress = totalQuestions > 0 ? (currentProgress / totalQuestions) * 100 : 0;
      progressFill.style.width = `${progress}%`; // Progress bar width is dynamic, keep inline
    }
    
    const questionCount = document.getElementById('questionCount');
    if (questionCount) {
      const remaining = this.questionSequence.length - this.currentQuestionIndex;
      const phaseLabel = this.currentPhase === 1 ? ' (Orientation)' : ' (Deep Mapping)';
      questionCount.textContent = `${remaining} question${remaining !== 1 ? 's' : ''} remaining${phaseLabel}`;
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.textContent = this.currentQuestionIndex === this.questionSequence.length - 1 
        ? 'Complete Assessment' 
        : 'Next';
    }
  }

  nextQuestion() {
    const currentQ = this.questionSequence[this.currentQuestionIndex];
    
    // For Phase 1, ensure answer is saved
    if (this.currentPhase === 1) {
      if (this.answers[currentQ.id] === undefined) {
        if (currentQ.type === 'gender') {
          const defaultOption = currentQ.options?.find(option => option.value === 'prefer_not_to_say');
          if (defaultOption) {
            this.answers[currentQ.id] = defaultOption;
            this.analysisData.gender = defaultOption.value;
            this.analysisData.genderLabel = defaultOption.label;
          }
        } else if (currentQ.options && currentQ.options.length > 0) {
          // Default to middle option if none selected
          this.answers[currentQ.id] = currentQ.options[Math.floor(currentQ.options.length / 2)];
        }
      }
    } else {
      // For Phase 2, default to 5 if slider not moved
      if (this.answers[currentQ.id] === undefined) {
        this.answers[currentQ.id] = 5;
      }
    }

    if (this.currentQuestionIndex < this.questionSequence.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else {
      // End of current phase
      if (this.currentPhase === 1) {
        this.analyzePhase1Results().then(() => {
          this.showPhase1Feedback();
        }).catch(error => {
          this.debugReporter.logError(error, 'nextQuestion - Phase 1 completion');
        });
      } else {
        this.calculateResults();
        this.renderResults();
      }
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      const currentQ = this.questionSequence[this.currentQuestionIndex];
      const slider = document.getElementById('questionSlider');
      if (slider && currentQ) {
        this.answers[currentQ.id] = parseInt(slider.value);
      }
      
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  calculateResults() {
    // Calculate dimension scores (only from Phase 2 questions)
    this.analysisData.dimensionScores = {};
    
    // Group answers by dimension/category (exclude Phase 1 orientation questions)
    const dimensionGroups = {};
    
    this.questionSequence.forEach(q => {
      // Skip Phase 1 orientation questions
      if (q.id && q.id.startsWith('p1_orientation')) {
        return;
      }
      
      const groupKey = q.dimension || q.category || 'other';
      if (!dimensionGroups[groupKey]) {
        dimensionGroups[groupKey] = [];
      }
      dimensionGroups[groupKey].push({
        question: q,
        answer: this.answers[q.id] || 5
      });
    });

    // Calculate weighted scores for each dimension
    let totalMasculineScore = 0;
    let totalFeminineScore = 0;
    let totalWeight = 0;

    Object.keys(dimensionGroups).forEach(groupKey => {
      const group = dimensionGroups[groupKey];
      let groupMasculine = 0;
      let groupFeminine = 0;
      let groupWeight = 0;

      group.forEach(({ question, answer }) => {
        // Normalize answer to -1 to 1 scale (0-10 becomes -1 to 1)
        const normalizedAnswer = (answer - 5) / 5;
        
        // Apply weights
        const masculineContribution = normalizedAnswer * question.masculineWeight;
        const feminineContribution = normalizedAnswer * question.feminineWeight;
        
        // Get dimension weight
        const dimWeight = TEMPERAMENT_SCORING.dimensionWeights[groupKey] || 1.0;
        
        groupMasculine += masculineContribution * dimWeight;
        groupFeminine += feminineContribution * dimWeight;
        groupWeight += dimWeight;
      });

      const avgMasculine = groupWeight > 0 ? groupMasculine / groupWeight : 0;
      const avgFeminine = groupWeight > 0 ? groupFeminine / groupWeight : 0;

      this.analysisData.dimensionScores[groupKey] = {
        masculine: avgMasculine,
        feminine: avgFeminine,
        net: avgMasculine - avgFeminine
      };

      totalMasculineScore += avgMasculine * groupWeight;
      totalFeminineScore += avgFeminine * groupWeight;
      totalWeight += groupWeight;
    });

    // Calculate overall temperament
    const overallMasculine = totalWeight > 0 ? totalMasculineScore / totalWeight : 0;
    const overallFeminine = totalWeight > 0 ? totalFeminineScore / totalWeight : 0;
    const overallNet = overallMasculine - overallFeminine;

    // Normalize to 0-1 scale (where 1 = highly masculine, 0 = highly feminine)
    const normalizedScore = (overallNet + 1) / 2;

    // Determine temperament category
    let temperamentCategory = 'balanced';
    const thresholds = TEMPERAMENT_SCORING.thresholds;
    
    if (normalizedScore >= thresholds.highly_masculine) {
      temperamentCategory = 'highly_masculine';
    } else if (normalizedScore >= thresholds.predominantly_masculine) {
      temperamentCategory = 'predominantly_masculine';
    } else if (normalizedScore >= thresholds.balanced_masculine) {
      temperamentCategory = 'balanced_masculine';
    } else if (normalizedScore >= thresholds.balanced) {
      temperamentCategory = 'balanced';
    } else if (normalizedScore >= thresholds.balanced_feminine) {
      temperamentCategory = 'balanced_feminine';
    } else if (normalizedScore >= thresholds.predominantly_feminine) {
      temperamentCategory = 'predominantly_feminine';
    } else {
      temperamentCategory = 'highly_feminine';
    }

    this.analysisData.overallTemperament = {
      category: temperamentCategory,
      normalizedScore: normalizedScore,
      masculineScore: overallMasculine,
      feminineScore: overallFeminine,
      netScore: overallNet
    };

    // Analyze variation
    this.analyzeVariation();

    // Include all raw answers
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      dimension: q.dimension || q.category,
      name: q.dimensionName || q.categoryName
    }));
  }

  analyzeVariation() {
    // Identify dimensions with significant variation (expected and common)
    this.analysisData.variationAnalysis = {
      highVariationDimensions: [],
      expectedVariations: []
    };

    Object.keys(this.analysisData.dimensionScores).forEach(dimKey => {
      const score = this.analysisData.dimensionScores[dimKey];
      const variation = Math.abs(score.masculine) + Math.abs(score.feminine);
      
      if (variation > 0.5) {
        this.analysisData.variationAnalysis.highVariationDimensions.push({
          dimension: dimKey,
          variation: variation,
          scores: score
        });
      }

      if (TEMPERAMENT_SCORING.expectedVariation.includes(dimKey)) {
        this.analysisData.variationAnalysis.expectedVariations.push({
          dimension: dimKey,
          scores: score
        });
      }
    });
    
    // Calculate context sensitivity flag
    const variationCount = this.analysisData.variationAnalysis.highVariationDimensions.length;
    const totalDimensions = Object.keys(this.analysisData.dimensionScores).length;
    const variationRatio = totalDimensions > 0 ? variationCount / totalDimensions : 0;
    
    // If variation exceeds threshold (more than 40% of dimensions show high variation)
    if (variationRatio > 0.4) {
      this.analysisData.contextSensitivity = {
        detected: true,
        variationRatio: variationRatio,
        message: 'Context-responsive temperament: High variation across dimensions indicates adaptability rather than confusion. Expression tends to shift based on partner, season, safety, and life phase.'
      };
    } else {
      this.analysisData.contextSensitivity = {
        detected: false,
        variationRatio: variationRatio
      };
    }
  }
  
  showIntimateConsentGate() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;
    
    SecurityUtils.safeInnerHTML(questionContainer, `
      <div class="transition-card temperament-consent-card">
        <h3 class="temperament-panel-title">Intimate Dynamics Section</h3>
        <p class="temperament-panel-text">
          The next section explores intimate and attraction patterns. These questions help map how energy organizes in relational and intimate contexts. <strong>Skip any question that feels misaligned.</strong> Your responses are for pattern recognition, not judgment.
        </p>
        <div class="temperament-consent-actions">
          <button class="btn btn-primary" id="continueToIntimate">Continue</button>
          <button class="btn btn-secondary" id="skipIntimate">Skip This Section</button>
        </div>
      </div>
    `);
    
    const continueBtn = document.getElementById('continueToIntimate');
    const skipBtn = document.getElementById('skipIntimate');
    
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.analysisData.intimateConsentGiven = true;
        this.renderQuestionContent(this.questionSequence[this.currentQuestionIndex]);
        this.updateProgress();
        this.updateNavigationButtons();
      });
    }
    
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        // Skip all intimate questions
        while (this.currentQuestionIndex < this.questionSequence.length && 
               this.questionSequence[this.currentQuestionIndex].type === 'intimate') {
          this.currentQuestionIndex++;
        }
        this.analysisData.intimateConsentGiven = true;
        this.renderCurrentQuestion();
        this.updateProgress();
      });
    }
  }
  
  renderQuestionContent(question) {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;
    
    const savedAnswer = this.answers[question.id] !== undefined ? this.answers[question.id] : 5;
    
    let categoryLabel = '';
    if (question.type === 'intimate') {
      categoryLabel = 'Intimate Dynamics';
    } else if (question.type === 'attraction') {
      categoryLabel = 'Attraction Responsiveness';
    } else {
      categoryLabel = question.dimensionName || 'Behavioral Patterns';
    }
    
    SecurityUtils.safeInnerHTML(questionContainer, `
      <div class="question-block">
        ${categoryLabel ? `<p class="stage-label">${SecurityUtils.sanitizeHTML(categoryLabel)}</p>` : ''}
        ${question.description ? `<p class="description temperament-description">${SecurityUtils.sanitizeHTML(question.description)}</p>` : ''}
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" min="0" max="10" value="${savedAnswer}" class="slider" id="questionSlider">
            <div class="scale-labels">
              <span>Very Low / Minimal / Weak / Poor / Rare / Never (0-2)</span>
              <span>Moderate / Somewhat / Average / Moderate / Sometimes (5-6)</span>
              <span>Very High / Strong / Potent / Excellent / Frequent / Always (9-10)</span>
            </div>
          </div>
          <span class="scale-value" id="sliderValue">${savedAnswer}</span>
        </div>
        <p class="question-help">
          Tip: Rate the degree to which this pattern is present in your experience.
        </p>
      </div>
    `);
    
    const slider = document.getElementById('questionSlider');
    const sliderValueSpan = document.getElementById('sliderValue');
    if (slider && sliderValueSpan) {
      slider.oninput = (event) => {
        sliderValueSpan.textContent = event.target.value;
        this.answers[question.id] = parseInt(event.target.value);
        this.saveProgress();
      };
    }
    
    this.updateNavigationButtons();
  }
  
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.textContent = this.currentQuestionIndex === this.questionSequence.length - 1 ? 'Finish Assessment' : 'Next';
    }
  }

  /**
   * Render assessment results
   */
  async renderResults() {
    try {
      await this.loadTemperamentData(); // Ensure data is loaded
      
      const questionnaireSection = document.getElementById('questionnaireSection');
      const resultsSection = document.getElementById('resultsSection');
      if (questionnaireSection) questionnaireSection.classList.remove('active');
      if (resultsSection) resultsSection.classList.add('active');

      const container = document.getElementById('temperamentResults');
      if (!container) {
        ErrorHandler.showUserError('Results container not found.');
        return;
      }

      const temperament = this.analysisData.overallTemperament;
      const interpretation = TEMPERAMENT_SCORING.interpretation[temperament.category];

    // Contextual framing block at results entry
    let html = `
      <div class="temperament-info-box temperament-framing">
        <p>
          <strong>Contextual Framing:</strong> Temperament reflects how energy tends to organize in relational and intimate contexts. It varies by partner, season, safety, and life phase. These results describe tendencies and preferences, not fixed identity or mandates.
        </p>
      </div>
    `;
    
    // Context sensitivity flag
    if (this.analysisData.contextSensitivity && this.analysisData.contextSensitivity.detected) {
      html += `
        <div class="info-box info-box-accent">
          <p>
            <strong>Context-Responsive Temperament:</strong> ${this.analysisData.contextSensitivity.message}
          </p>
        </div>
      `;
    }

    html += `
      <div class="temperament-profile-card">
        <h2>Temperament Expression Profile</h2>
        <div class="temperament-profile-inner">
          <h3>${SecurityUtils.sanitizeHTML(interpretation.label || '')}</h3>
          <p>${SecurityUtils.sanitizeHTML(interpretation.description || '')}</p>
          
          <div class="temperament-patterns">
            <h4>Expression Patterns:</h4>
            <ul>
              ${interpretation.characteristics.map(char => `<li>${SecurityUtils.sanitizeHTML(char || '')}</li>`).join('')}
            </ul>
          </div>
          
          <div class="temperament-variation-note">
            <p><strong>Note on Variation:</strong> ${SecurityUtils.sanitizeHTML(interpretation.variations || '')}</p>
          </div>
        </div>

        <div class="temperament-spectrum-container">
          <h4>Temperament Spectrum Position</h4>
          <div class="temperament-spectrum-large">
            <div class="temperament-marker temperament-marker-large" style="left: ${temperament.normalizedScore * 100}%;"></div>
          </div>
          <div class="temperament-spectrum-labels">
            <span>Feminine-Leaning (0%)</span>
            <span>Balanced (50%)</span>
            <span>Masculine-Leaning (100%)</span>
          </div>
          <p class="temperament-spectrum-position">
            Expression Position: ${(temperament.normalizedScore * 100).toFixed(1)}% on the spectrum
          </p>
        </div>
      </div>
    `;

    // Dimension breakdown
    html += '<div class="dimension-breakdown">';
    html += '<h3>Dimension Breakdown</h3>';
    
    Object.keys(this.analysisData.dimensionScores).forEach(dimKey => {
      const score = this.analysisData.dimensionScores[dimKey];
      const dimName = this.questionSequence.find(q => (q.dimension || q.category) === dimKey)?.dimensionName || 
                     this.questionSequence.find(q => (q.dimension || q.category) === dimKey)?.categoryName || 
                     dimKey;
      
      const netScore = score.net;
      const normalizedDimScore = (netScore + 1) / 2;
      
      html += `
        <div class="dimension-item">
          <h4>${SecurityUtils.sanitizeHTML(dimName || '')}</h4>
          <div class="dimension-spectrum">
            <div class="dimension-marker" style="left: ${normalizedDimScore * 100}%;"></div>
          </div>
          <p class="dimension-score-text">
            Masculine: ${(score.masculine * 100).toFixed(0)}% | Feminine: ${(score.feminine * 100).toFixed(0)}% | Net: ${(netScore * 100).toFixed(0)}%
          </p>
        </div>
      `;
    });
    
    html += '</div>';

    // Variation analysis
    if (this.analysisData.variationAnalysis.expectedVariations.length > 0) {
      html += '<div class="variations-box">';
      html += '<h4>Expected Variations</h4>';
      html += '<p>The following dimensions commonly show variation across themes and dynamics. This is normal and expected:</p>';
      html += '<ul>';
      this.analysisData.variationAnalysis.expectedVariations.forEach(variation => {
        const dimName = this.questionSequence.find(q => (q.dimension || q.category) === variation.dimension)?.dimensionName || 
                       this.questionSequence.find(q => (q.dimension || q.category) === variation.dimension)?.categoryName || 
                       variation.dimension;
        html += `<li>${SecurityUtils.sanitizeHTML(dimName || '')}</li>`;
      });
      html += '</ul></div>';
    }

      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(container, html);
      this.saveProgress();
      
      // Display debug report if in development mode
      if (window.location.search.includes('debug=true')) {
        this.debugReporter.displayReport('debug-report');
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderResults');
      ErrorHandler.showUserError('Failed to render results. Please refresh the page.');
    }
  }

  exportAnalysis(format = 'json') {
    const aiInstructions = `
This temperament analysis maps the user's position on the masculine-feminine temperament spectrum based on comprehensive questions across behavioral patterns, intimate dynamics, and attraction responsiveness.

MANDATORY INTERPRETATION GUIDELINES:
- Temperament descriptors indicate tendencies, not mandates
- Always ask for situational context before applying polarity insights
- Temperament reflects how energy tends to organize in relational and intimate contexts
- It varies by partner, season, safety, and life phase
- Temperament is NOT the same as biological sex or gender identity
- Variation across dimensions is expected and common
- The spectrum position indicates archetypal energy patterns, not rigid roles
- Both masculine and feminine qualities can coexist in the same individual

PROHIBITED LANGUAGE:
- DO NOT use "You are [masculine/feminine]"
- DO NOT use "This means you should..."
- DO NOT prescribe polarity-based partner advice as obligation
- DO NOT make fixed identity claims

REQUIRED LANGUAGE:
- Use "tends to express"
- Use "often organizes as"
- Use "shows preference toward"
- Use "This pattern sometimes expresses as..."

CONTEXT INQUIRY REQUIREMENT:
- Before interpreting temperament results, always inquire about:
  * Current relational context
  * Partner dynamics
  * Life phase and current stressors
  * Safety and security levels

SCORING INTERPRETATION:
- Normalized Score: 0.0-1.0 scale where 1.0 = masculine-leaning, 0.0 = feminine-leaning, 0.5 = balanced
- Dimension scores show variation across different life areas
- Expected variations indicate dimensions where mixed responses are common and healthy
- High variation across dimensions indicates context-responsiveness rather than inconsistency

RELATIONSHIP POLARITY IMPLICATIONS:
- Higher polarity (greater difference between partners) typically increases attraction
- Understanding temperament helps optimize relationship dynamics
- Both partners can develop complementary qualities while honoring their core expression patterns

AI AGENT CONFIGURATION:
- Use temperament data to inform coaching style and communication approach
- Masculine-leaning expression may respond better to direct, goal-oriented guidance
- Feminine-leaning expression may respond better to emotional support and clarity
- Balanced expression may need both approaches depending on context
- Always inquire about current context before applying temperament insights
`;

    if (format === 'csv') {
      exportForAIAgent(this.analysisData, 'temperament-analysis', 'csv', aiInstructions);
    } else {
      exportJSON(this.analysisData, 'temperament-analysis');
    }
  }

  /**
   * Save assessment progress to storage
   */
  saveProgress() {
    try {
      const progressData = {
        currentPhase: this.currentPhase,
        currentQuestionIndex: this.currentQuestionIndex,
        answers: this.answers,
        phase1Results: this.phase1Results,
        analysisData: this.analysisData,
        timestamp: new Date().toISOString()
      };
      this.dataStore.save('progress', progressData);
    } catch (error) {
      this.debugReporter.logError(error, 'saveProgress');
    }
  }

  /**
   * Load stored assessment progress
   * @returns {Promise<void>}
   */
  async loadStoredData() {
    try {
      const data = this.dataStore.load('progress');
      if (!data) return;

      this.currentPhase = data.currentPhase || 1;
      this.currentQuestionIndex = data.currentQuestionIndex || 0;
      this.answers = data.answers || {};
      this.phase1Results = data.phase1Results || null;
      this.analysisData = data.analysisData || this.analysisData;
      
      // Restore appropriate phase
      if (this.currentPhase === 1) {
        await this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        this.phase1Results = data.phase1Results || null;
        await this.buildPhase2Sequence();
      }
      
      if (this.currentQuestionIndex > 0 && this.currentQuestionIndex < this.questionSequence.length) {
        // Resume assessment
        const introSection = document.getElementById('introSection');
        const actionButtonsSection = document.getElementById('actionButtonsSection');
        const questionnaireSection = document.getElementById('questionnaireSection');
        if (introSection) introSection.classList.add('hidden');
        if (actionButtonsSection) actionButtonsSection.classList.add('hidden');
        if (questionnaireSection) questionnaireSection.classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
    }
  }

  clearAllCachedData() {
    if (confirm('Are you sure you want to clear all cached data? This will clear all saved progress.')) {
      sessionStorage.removeItem('temperamentProgress');
      this.resetAssessment();
      alert('All cached data has been cleared.');
    }
  }

  resetAssessment() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.phase1Results = null;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: null,
      dimensionScores: {},
      overallTemperament: null,
      variationAnalysis: {},
      allAnswers: {},
      questionSequence: []
    };
    
    sessionStorage.removeItem('temperamentProgress');
    
    const introSection = document.getElementById('introSection');
    const actionButtonsSection = document.getElementById('actionButtonsSection');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsSection = document.getElementById('resultsSection');

    if (introSection) introSection.classList.remove('hidden');
    if (actionButtonsSection) actionButtonsSection.classList.remove('hidden');
    if (questionnaireSection) questionnaireSection.classList.remove('active');
    if (resultsSection) resultsSection.classList.remove('active');
    
    this.buildPhase1Sequence();
  }
}

// Initialize when DOM is ready
// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.temperamentEngine = new TemperamentEngine();
  });
} else {
  window.temperamentEngine = new TemperamentEngine();
}

