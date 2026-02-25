// Paradigm Engine - Version 2.1
// 3-Phase Questionnaire Architecture
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportExecutiveBrief, exportJSON, downloadFile } from './shared/export-utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { showConfirm } from './shared/confirm-modal.js';

// Data modules - will be loaded lazily
let GOOD_LIFE_PARADIGMS, GOD_PERSPECTIVES, PARADIGM_SCORING;
let PHASE_1_QUESTIONS, PHASE_2_QUESTIONS, PHASE_3_QUESTIONS;

/**
 * Paradigm Engine - Identifies paradigm frameworks through multi-phase assessment
 */
export class ParadigmEngine {
  /**
   * Initialize the paradigm engine
   */
  constructor() {
    this.selectedCategories = [];
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.phase1Results = {};
    this.identifiedParadigms = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: [],
      confidenceBands: {},
      dimensionalTensions: {},
      translationCapacity: null,
      shadowBlindSpots: {},
      developmentEdges: {},
      compatibleFrameworks: [],
      tensionPoints: [],
      contradictions: [],
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('ParadigmEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('paradigm-assessment', '1.0.0');

    this.ui = new EngineUIController({
      idle: {
        show: ['#introSection', '#categorySelection', '#actionButtonsSection'],
        hide: ['#questionnaireSection', '#resultsSection']
      },
      assessment: {
        show: ['#questionnaireSection'],
        hide: ['#introSection', '#categorySelection', '#actionButtonsSection', '#resultsSection']
      },
      results: {
        show: ['#resultsSection'],
        hide: ['#introSection', '#categorySelection', '#actionButtonsSection', '#questionnaireSection']
      }
    });
    
    this.init();
  }

  /**
   * Initialize the engine
   */
  init() {
    this.attachEventListeners();
    Promise.resolve(this.loadStoredData()).then(() => {
      if (this.shouldAutoGenerateSample()) {
        this.generateSampleReport();
      }
    }).catch(error => {
      this.debugReporter.logError(error, 'init');
    });
  }

  /**
   * Load paradigm data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadParadigmData() {
    if (GOOD_LIFE_PARADIGMS && PHASE_1_QUESTIONS) {
      return; // Already loaded
    }

    try {
      // Load good life paradigms data
      const goodLifeModule = await loadDataModule(
        './paradigm-data/good-life-paradigms.js',
        'Good Life Paradigms'
      );
      GOOD_LIFE_PARADIGMS = goodLifeModule.GOOD_LIFE_PARADIGMS;

      // Load god perspectives data
      const godModule = await loadDataModule(
        './paradigm-data/god-perspectives.js',
        'God Perspectives'
      );
      GOD_PERSPECTIVES = godModule.GOD_PERSPECTIVES;

      // Load scoring data
      const scoringModule = await loadDataModule(
        './paradigm-data/paradigm-mapping.js',
        'Paradigm Scoring'
      );
      PARADIGM_SCORING = scoringModule.PARADIGM_SCORING;

      // Load questions data
      const questionsModule = await loadDataModule(
        './paradigm-data/paradigm-questions.js',
        'Paradigm Questions'
      );
      PHASE_1_QUESTIONS = questionsModule.PHASE_1_QUESTIONS;
      PHASE_2_QUESTIONS = questionsModule.PHASE_2_QUESTIONS;
      PHASE_3_QUESTIONS = questionsModule.PHASE_3_QUESTIONS;

      this.debugReporter.logEvent('DataLoader', 'All paradigm data loaded successfully');
    } catch (error) {
      this.debugReporter.logError(error, 'loadParadigmData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  attachEventListeners() {
    // Category selection
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => this.toggleCategory(card.dataset.category));
    });

    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startAssessment());
    }

    const resumeBtn = document.getElementById('resumeAssessment');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        sessionStorage.setItem(`resume:${this.dataStore.namespace}`, 'true');
        window.location.reload();
      });
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

    const exportBriefBtn = document.getElementById('exportExecutiveBrief');
    if (exportBriefBtn) {
      exportBriefBtn.addEventListener('click', () => this.exportExecutiveBrief());
    }

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => this.generateSampleReport());
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', async () => {
        if (await showConfirm('Are you sure you want to abandon this assessment? All progress will be lost.')) {
          this.resetAssessment();
        }
      });
    }
  }

  shouldAutoGenerateSample() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sample')) return false;
    const value = params.get('sample');
    if (value === null || value === '' || value === '1' || value === 'true') return true;
    return false;
  }

  getEmptyAnalysisData() {
    return {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: [],
      confidenceBands: {},
      dimensionalTensions: {},
      translationCapacity: null,
      shadowBlindSpots: {},
      developmentEdges: {},
      compatibleFrameworks: [],
      tensionPoints: [],
      contradictions: [],
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      primaryParadigm: null,
      secondaryParadigms: [],
      integrationScore: 0,
      overallProfile: null,
      allAnswers: {},
      questionSequence: []
    };
  }

  pickRandomIndices(length, count) {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, count);
  }

  answerQuestionForSample(question) {
    if (!question) return;
    if (question.type === 'binary' || question.type === 'scenario') {
      if (!Array.isArray(question.options) || question.options.length === 0) return;
      const option = question.options[Math.floor(Math.random() * question.options.length)];
      this.answers[question.id] = option;
      return;
    }
    if (question.type === 'multiselect') {
      if (!Array.isArray(question.options) || question.options.length === 0) return;
      const maxSelections = question.maxSelections || 3;
      const count = Math.min(question.options.length, Math.max(1, Math.ceil(Math.random() * maxSelections)));
      const selected = this.pickRandomIndices(question.options.length, count).map(idx => question.options[idx]);
      this.answers[question.id] = selected;
      return;
    }
    if (question.type === 'ranked') {
      if (!Array.isArray(question.options) || question.options.length === 0) return;
      const order = this.pickRandomIndices(question.options.length, question.options.length);
      this.answers[question.id] = order.map((idx, rank) => ({
        ...question.options[idx],
        rank: rank + 1
      }));
      return;
    }
    if (question.type === 'scaled') {
      const scale = question.scale || { min: 1, max: 7 };
      const value = Math.floor(Math.random() * (scale.max - scale.min + 1)) + scale.min;
      this.answers[question.id] = value;
    }
  }

  async generateSampleReport() {
    try {
      await this.loadParadigmData();
      this.selectedCategories = ['good_life', 'god'];
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.questionSequence = [];
      this.analysisData = this.getEmptyAnalysisData();
      this.analysisData.selectedCategories = [...this.selectedCategories];

      await this.buildPhase1Sequence();
      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      await this.analyzePhase1Results();

      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      this.analyzePhase2Results();

      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      this.analyzePhase3Results();

      this.completeAssessment();
    } catch (error) {
      this.debugReporter.logError(error, 'generateSampleReport');
      ErrorHandler.showUserError('Failed to generate sample report. Please try again.');
    }
  }

  toggleCategory(categoryId) {
    const card = document.querySelector(`[data-category="${categoryId}"]`);
    if (!card) return;
    
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== categoryId);
      card.classList.remove('selected');
    } else {
      this.selectedCategories.push(categoryId);
      card.classList.add('selected');
    }
    
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.disabled = this.selectedCategories.length === 0;
    }
  }

  /**
   * Start the assessment with selected categories
   * @returns {Promise<void>}
   */
  async startAssessment() {
    if (this.selectedCategories.length === 0) {
      ErrorHandler.showUserError('Please select at least one category to assess.');
      return;
    }
    
    try {
      await this.loadParadigmData();
      await this.buildPhase1Sequence();
      
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.answers = {};
      
      const categorySelection = document.getElementById('categorySelection');
      const questionnaireSection = document.getElementById('questionnaireSection');
      if (categorySelection) categorySelection.style.display = 'none';
      this.ui.transition('assessment');
      
      this.renderCurrentQuestion();
      this.saveProgress();
    } catch (error) {
      this.debugReporter.logError(error, 'startAssessment');
      ErrorHandler.showUserError('Failed to start assessment. Please try again.');
    }
  }

  /**
   * Build Phase 1 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase1Sequence() {
    await this.loadParadigmData();
    
    this.questionSequence = [];
    
    this.selectedCategories.forEach(category => {
      if (category === 'good_life' && PHASE_1_QUESTIONS.good_life) {
        this.questionSequence.push(...PHASE_1_QUESTIONS.good_life);
      } else if (category === 'god' && PHASE_1_QUESTIONS.god) {
        this.questionSequence.push(...PHASE_1_QUESTIONS.god);
      }
    });
    
    this.debugReporter.recordQuestionCount(this.questionSequence.length);
  }

  /**
   * Analyze Phase 1 results and proceed to Phase 2
   * @returns {Promise<void>}
   */
  async analyzePhase1Results() {
    await this.loadParadigmData();
    
    try {
    // Analyze Phase 1 to identify likely paradigms and build Phase 2 sequence
    const paradigmScores = {};
    const dimensionScores = {};
    
    // Process Phase 1 answers
    this.questionSequence.forEach(question => {
      const answer = this.answers[question.id];
      if (!answer) return;
      
      if (answer.mapsTo) {
        // Track paradigm scores
        if (answer.mapsTo.paradigm) {
          const key = answer.mapsTo.paradigm;
          if (!paradigmScores[key]) paradigmScores[key] = 0;
          paradigmScores[key] += answer.mapsTo.weight || 1;
        }
        
        // Track dimension scores
        if (answer.mapsTo.dimension) {
          const dimKey = `${question.category || 'unknown'}_${answer.mapsTo.dimension}`;
          if (!dimensionScores[dimKey]) dimensionScores[dimKey] = 0;
          dimensionScores[dimKey] += answer.mapsTo.weight || 1;
        }
        
        // Track perspective scores (for God)
        if (answer.mapsTo.perspective) {
          const key = answer.mapsTo.perspective;
          if (!paradigmScores[key]) paradigmScores[key] = 0;
          paradigmScores[key] += answer.mapsTo.weight || 1;
        }
      }
      
      // Handle multi-select answers
      if (Array.isArray(answer)) {
        answer.forEach(item => {
          if (item.mapsTo) {
            if (item.mapsTo.paradigm) {
              const key = item.mapsTo.paradigm;
              if (!paradigmScores[key]) paradigmScores[key] = 0;
              paradigmScores[key] += item.mapsTo.weight || 1;
            }
            if (item.mapsTo.perspective) {
              const key = item.mapsTo.perspective;
              if (!paradigmScores[key]) paradigmScores[key] = 0;
              paradigmScores[key] += item.mapsTo.weight || 1;
            }
            if (item.mapsTo.dimension) {
              const dimKey = `${question.category || 'unknown'}_${item.mapsTo.dimension}`;
              if (!dimensionScores[dimKey]) dimensionScores[dimKey] = 0;
              dimensionScores[dimKey] += item.mapsTo.weight || 1;
            }
          }
        });
      }
    });
    
      this.phase1Results = {
        paradigmScores,
        dimensionScores,
        identifiedParadigms: Object.keys(paradigmScores).sort((a, b) => paradigmScores[b] - paradigmScores[a]).slice(0, 3)
      };
      
      // Build Phase 2 sequence based on identified paradigms
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
    await this.loadParadigmData();
    
    try {
      this.questionSequence = [];
      this.currentPhase = 2;
      this.currentQuestionIndex = 0;
      
      this.selectedCategories.forEach(category => {
        if (category === 'good_life') {
          // Add conditional questions for identified paradigms
          this.phase1Results.identifiedParadigms.forEach(paradigm => {
            if (PHASE_2_QUESTIONS.good_life[paradigm]) {
              this.questionSequence.push(...PHASE_2_QUESTIONS.good_life[paradigm]);
            }
          });
          
          // Add dimension-specific questions
          if (PHASE_2_QUESTIONS.good_life.dimensions) {
            this.questionSequence.push(...PHASE_2_QUESTIONS.good_life.dimensions);
          }
        } else if (category === 'god') {
        // Check if literal God was selected
        const literalGodAnswer = this.answers['p1_god_literal'];
        if (literalGodAnswer && literalGodAnswer.mapsTo && literalGodAnswer.mapsTo.literalGod) {
          if (PHASE_2_QUESTIONS.god.literal) {
            this.questionSequence.push(...PHASE_2_QUESTIONS.god.literal);
          }
        } else {
          if (PHASE_2_QUESTIONS.god.non_literal) {
            this.questionSequence.push(...PHASE_2_QUESTIONS.god.non_literal);
          }
        }
        
        // Check if mystical dimension was selected
        const truthDimensionsAnswer = this.answers['p1_god_truth'];
        if (Array.isArray(truthDimensionsAnswer)) {
          const hasMystical = truthDimensionsAnswer.some(item => 
            item.mapsTo && item.mapsTo.dimension === 'mystical'
          );
          if (hasMystical && PHASE_2_QUESTIONS.god.mystical) {
            this.questionSequence.push(...PHASE_2_QUESTIONS.god.mystical);
          }
        }
        
        // Add dimension-specific questions
        if (PHASE_2_QUESTIONS.god.dimensions) {
          this.questionSequence.push(...PHASE_2_QUESTIONS.god.dimensions);
        }
      }
    });
    
      this.currentPhase = 2;
      this.currentQuestionIndex = 0;
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase2Sequence');
      ErrorHandler.showUserError('Failed to load Phase 2. Please refresh the page.');
    }
  }

  /**
   * Build Phase 3 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase3Sequence() {
    await this.loadParadigmData();
    
    try {
      this.questionSequence = [];
      
      this.selectedCategories.forEach(category => {
        if (category === 'good_life' && PHASE_3_QUESTIONS.good_life) {
          this.questionSequence.push(...PHASE_3_QUESTIONS.good_life);
        } else if (category === 'god' && PHASE_3_QUESTIONS.god) {
          this.questionSequence.push(...PHASE_3_QUESTIONS.god);
        }
      });
      
      this.currentPhase = 3;
      this.currentQuestionIndex = 0;
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase3Sequence');
      ErrorHandler.showUserError('Failed to load Phase 3. Please refresh the page.');
    }
  }

  /**
   * Render the current question
   */
  renderCurrentQuestion() {
    const renderStart = performance.now();
    
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completePhase();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    if (!container) {
      ErrorHandler.showUserError('Question container not found. Please refresh the page.');
      return;
    }
    
    try {
    
    let html = '';
    
    // Show phase explanation if this is the first question of a phase
    if (this.currentQuestionIndex === 0) {
      html += this.getPhaseExplanation(this.currentPhase);
    }
    
    // Render based on question type
    if (question.type === 'binary') {
      html += this.renderBinaryQuestion(question);
    } else if (question.type === 'scenario') {
      html += this.renderScenarioQuestion(question);
    } else if (question.type === 'multiselect') {
      html += this.renderMultiselectQuestion(question);
    } else if (question.type === 'ranked') {
      html += this.renderRankedQuestion(question);
    } else if (question.type === 'scaled') {
      html += this.renderScaledQuestion(question);
    }
    
      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(container, html);
      
      // Attach event listeners for the specific question type
      this.attachQuestionListeners(question);
      
      this.updateProgress();
      this.updateNavigationButtons();
      
      // Track render performance
      const renderDuration = performance.now() - renderStart;
      this.debugReporter.recordRender('question', renderDuration);

// Scroll to question after rendering
      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
      // Focus management for accessibility
      const firstInput = container.querySelector('input, button, select, textarea');
      if (firstInput) {
        DOMUtils.focusElement(firstInput);
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderCurrentQuestion');
      ErrorHandler.showUserError('Failed to render question. Please refresh the page.');
    }
  }

  renderBinaryQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="binary-options">
          ${question.options.map((option, index) => `
            <label class="binary-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
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
      </div>
    `;
  }

  renderScenarioQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="scenario-options">
          ${question.options.map((option, index) => `
            <label class="scenario-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
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
      </div>
    `;
  }

  renderMultiselectQuestion(question) {
    const currentAnswer = this.answers[question.id] || [];
    const maxSelections = question.maxSelections || 3;
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <p class="selection-limit">Select up to ${maxSelections}</p>
        <div class="multiselect-options">
          ${question.options.map((option, index) => {
            const isSelected = currentAnswer.some(ans => ans.text === option.text);
            return `
              <label class="multiselect-option ${isSelected ? 'selected' : ''}">
                <input 
                  type="checkbox" 
                  name="question_${question.id}" 
                  value="${index}"
                  data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                  ${isSelected ? 'checked' : ''}
                />
                <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
              </label>
            `;
          }).join('')}
        </div>
        <div class="selection-count" id="selectionCount_${question.id}">Selected: ${currentAnswer.length} / ${maxSelections}</div>
      </div>
    `;
  }

  renderRankedQuestion(question) {
    const currentAnswer = this.answers[question.id] || [];
    const sortedOptions = currentAnswer.length > 0 
      ? currentAnswer.map(item => question.options.find(opt => opt.text === item.text)).filter(Boolean)
      : [...question.options];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <p class="ranked-instruction">${question.instruction || 'Drag to reorder, or click to move up/down'}</p>
        <div class="ranked-options" id="rankedOptions_${question.id}">
          ${sortedOptions.map((option, index) => {
            const answerItem = currentAnswer.find(item => item.text === option.text);
            return `
              <div class="ranked-item" data-option-index="${question.options.indexOf(option)}" draggable="true">
                <span class="rank-number">${index + 1}</span>
                <span class="rank-text">${option.text}</span>
                <input type="hidden" name="rank_${question.id}_${index}" value='${JSON.stringify(option).replace(/'/g, "&apos;")}'>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderScaledQuestion(question) {
    const currentAnswer = this.answers[question.id];
    const scale = question.scale || { min: 1, max: 7 };
    const labels = scale.labels || {};
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="scale-container">
          <div class="scale-input">
            <input 
              type="range" 
              id="questionInput" 
              data-question-id="${question.id}"
              min="${scale.min}" 
              max="${scale.max}" 
              step="1"
              value="${currentAnswer || Math.round((scale.min + scale.max) / 2)}"
            />
          </div>
          <div class="scale-value" id="scaleValue">${currentAnswer || Math.round((scale.min + scale.max) / 2)}</div>
        </div>
        <div class="scale-labels">
          <span>${labels[scale.min] || scale.min}</span>
          <span>${labels[Math.round((scale.min + scale.max) / 2)] || Math.round((scale.min + scale.max) / 2)}</span>
          <span>${labels[scale.max] || scale.max}</span>
        </div>
      </div>
    `;
  }

  attachQuestionListeners(question) {
    if (question.type === 'binary' || question.type === 'scenario') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const optionData = JSON.parse(e.target.dataset.optionData);
          this.answers[question.id] = optionData;
          
          // Update visual selection
          document.querySelectorAll(`.binary-option, .scenario-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          e.target.closest('label').classList.add('selected');
          
          this.saveProgress();
        });
      });
    } else if (question.type === 'multiselect') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      const maxSelections = question.maxSelections || 3;
      const selectionCount = document.getElementById(`selectionCount_${question.id}`);
      
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const selected = Array.from(inputs)
            .filter(inp => inp.checked)
            .map(inp => JSON.parse(inp.dataset.optionData));
          
          if (selected.length > maxSelections) {
            e.target.checked = false;
            return;
          }
          
          this.answers[question.id] = selected;
          
          // Update visual selection
          document.querySelectorAll(`.multiselect-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          selected.forEach(sel => {
            const matchingInput = Array.from(inputs).find(inp => {
              const data = JSON.parse(inp.dataset.optionData);
              return data.text === sel.text;
            });
            if (matchingInput) {
              matchingInput.closest('label').classList.add('selected');
            }
          });
          
          if (selectionCount) {
            selectionCount.textContent = `Selected: ${selected.length} / ${maxSelections}`;
          }
          
          this.saveProgress();
        });
      });
    } else if (question.type === 'ranked') {
      this.attachRankedListeners(question);
    } else if (question.type === 'scaled') {
      const slider = document.getElementById('questionInput');
      const valueDisplay = document.getElementById('scaleValue');
      
      if (slider && valueDisplay) {
        slider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          valueDisplay.textContent = value;
          this.answers[question.id] = value;
          this.saveProgress();
        });
      }
    }
  }

  attachRankedListeners(question) {
    const container = document.getElementById(`rankedOptions_${question.id}`);
    if (!container) return;
    
    let draggedElement = null;
    
    // Drag and drop
    container.querySelectorAll('.ranked-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedElement = item;
        item.classList.add('disabled');
      });
      
      item.addEventListener('dragend', (e) => {
        item.classList.remove('disabled');
        draggedElement = null;
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedElement && draggedElement !== item) {
          const allItems = Array.from(container.querySelectorAll('.ranked-item'));
          const draggedIndex = allItems.indexOf(draggedElement);
          const targetIndex = allItems.indexOf(item);
          
          if (draggedIndex < targetIndex) {
            container.insertBefore(draggedElement, item.nextSibling);
          } else {
            container.insertBefore(draggedElement, item);
          }
          
          this.updateRankedAnswer(question);
        }
      });
      
      item.addEventListener('drop', (e) => {
        e.preventDefault();
      });
    });
    
    // Click to move up/down (fallback for non-drag interfaces)
    container.querySelectorAll('.ranked-item').forEach(item => {
      const upBtn = document.createElement('button');
      upBtn.textContent = '↑';
      upBtn.className = 'rank-btn';
      upBtn.className = 'btn btn-small';
      upBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const allItems = Array.from(container.querySelectorAll('.ranked-item'));
        const currentIndex = allItems.indexOf(item);
        if (currentIndex > 0) {
          container.insertBefore(item, allItems[currentIndex - 1]);
          this.updateRankedAnswer(question);
        }
      });
      
      const downBtn = document.createElement('button');
      downBtn.textContent = '↓';
      downBtn.className = 'rank-btn';
      downBtn.className = 'btn btn-small';
      downBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const allItems = Array.from(container.querySelectorAll('.ranked-item'));
        const currentIndex = allItems.indexOf(item);
        if (currentIndex < allItems.length - 1) {
          container.insertBefore(item, allItems[currentIndex + 1].nextSibling);
          this.updateRankedAnswer(question);
        }
      });
      
      item.appendChild(upBtn);
      item.appendChild(downBtn);
    });
  }

  updateRankedAnswer(question) {
    const container = document.getElementById(`rankedOptions_${question.id}`);
    if (!container) return;
    
    const rankedItems = Array.from(container.querySelectorAll('.ranked-item'));
    const rankedAnswer = rankedItems.map((item, index) => {
      const optionIndex = parseInt(item.dataset.optionIndex);
      const option = question.options[optionIndex];
      return {
        ...option,
        rank: index + 1
      };
    });
    
    // Update rank numbers
    rankedItems.forEach((item, index) => {
      const rankNumber = item.querySelector('.rank-number');
      if (rankNumber) {
        rankNumber.textContent = index + 1;
      }
    });
    
    this.answers[question.id] = rankedAnswer;
    this.saveProgress();
  }

  getPhaseLabel(phase) {
    const labels = {
      1: 'Orientation',
      2: 'Depth Mapping',
      3: 'Integration Check'
    };
    return labels[phase] || `Phase ${phase}`;
  }

  getPhaseExplanation(phase) {
    const explanations = {
      1: {
        title: 'Phase 1: Orientation',
        description: 'These questions help identify your broad paradigm orientation. They use binary choices and simple filters to establish a baseline understanding of how you approach "The Good Life" and "God". There are no right or wrong answers—just honest responses about your current perspective.',
        purpose: 'Purpose: To quickly identify which paradigms and perspectives are most relevant to explore in depth.'
      },
      2: {
        title: 'Phase 2: Depth Mapping',
        description: 'Now we\'ll explore the specific dimensions of your identified paradigms in more detail. You\'ll encounter ranked choices, multi-select options, and scenario-based questions that help map the nuanced ways you relate to these concepts.',
        purpose: 'Purpose: To understand the specific dimensions (literal, symbolic, esoteric, mystical) within your primary paradigms and how they interact.'
      },
      3: {
        title: 'Phase 3: Integration Check',
        description: 'This final phase examines how well-integrated your understanding is across different contexts and dimensions. We\'ll check for consistency, certainty levels, and identify any gaps or contradictions in your paradigm structure.',
        purpose: 'Purpose: To assess integration, identify blind spots, and understand how your paradigm functions under different conditions.'
      }
    };
    
    const exp = explanations[phase];
    if (!exp) return '';
    
    return `
      <div class="phase-explanation">
        <h3>${exp.title}</h3>
        <p>${exp.description}</p>
        <p>${exp.purpose}</p>
      </div>
    `;
  }

  updateProgress() {
    const totalQuestions = this.getTotalQuestions();
    const currentQuestion = this.getCurrentQuestionNumber();
    const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`; // Progress bar width is dynamic, keep inline
    }
  }

  getTotalQuestions() {
    let total = 0;
    if (this.currentPhase >= 1) {
      total += PHASE_1_QUESTIONS.good_life?.length || 0;
      total += PHASE_1_QUESTIONS.god?.length || 0;
    }
    if (this.currentPhase >= 2) {
      // Estimate Phase 2 questions (varies based on branching)
      total += 10; // Approximate
    }
    if (this.currentPhase >= 3) {
      total += PHASE_3_QUESTIONS.good_life?.length || 0;
      total += PHASE_3_QUESTIONS.god?.length || 0;
    }
    return total;
  }

  getCurrentQuestionNumber() {
    let current = 0;
    if (this.currentPhase > 1) {
      // Count Phase 1 questions
      current += PHASE_1_QUESTIONS.good_life?.length || 0;
      current += PHASE_1_QUESTIONS.god?.length || 0;
    }
    if (this.currentPhase > 2) {
      // Count Phase 2 questions (approximate)
      current += 10;
    }
    current += this.currentQuestionIndex;
    return current;
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0 && this.currentPhase === 1;
    }
    
    if (nextBtn) {
      const isLastQuestion = this.currentQuestionIndex === this.questionSequence.length - 1;
      nextBtn.textContent = isLastQuestion ? 'Complete Phase' : 'Next';
    }
  }

  nextQuestion() {
    this.saveCurrentAnswer();
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      this.completePhase();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else if (this.currentPhase > 1) {
      // Go back to previous phase
      this.currentPhase--;
      if (this.currentPhase === 1) {
        this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        this.buildPhase2Sequence();
      }
      this.currentQuestionIndex = this.questionSequence.length - 1;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  saveCurrentAnswer() {
    // Answer is already saved in attachQuestionListeners via saveProgress()
  }

  completePhase() {
    if (this.currentPhase === 1) {
      this.analyzePhase1Results();
      if (this.questionSequence.length > 0) {
        this.renderCurrentQuestion(); // Start Phase 2
      } else {
        this.buildPhase3Sequence();
        if (this.questionSequence.length > 0) {
          this.renderCurrentQuestion(); // Start Phase 3
        } else {
          this.completeAssessment();
        }
      }
    } else if (this.currentPhase === 2) {
      this.analyzePhase2Results();
      this.buildPhase3Sequence();
      if (this.questionSequence.length > 0) {
        this.renderCurrentQuestion(); // Start Phase 3
      } else {
        this.completeAssessment();
      }
    } else if (this.currentPhase === 3) {
      this.analyzePhase3Results();
      this.completeAssessment();
    }
  }

  analyzePhase2Results() {
    // Calculate detailed scores for paradigms and dimensions
    // This will be used in final analysis
  }

  analyzePhase3Results() {
    // Analyze integration, consistency, contradictions
    this.detectContradictions();
    this.identifyGaps();
    this.calculateIntegrationScores();
  }

  detectContradictions() {
    const contradictions = [];
    
    // Check for contradictory answers across phases
    // Example: High literal dimension but low certainty about literal truth
    const literalDimension = this.answers['p2_dimension_literal'] || this.answers['p2_god_dimension_literal'];
    const literalCertainty = this.answers['p3_goodlife_certainty'] || this.answers['p3_god_certainty'];
    
    if (literalDimension >= 6 && literalCertainty <= 3) {
      contradictions.push({
        type: 'certainty_mismatch',
        description: 'High importance placed on literal dimension but low certainty about literal truth',
        severity: 'medium'
      });
    }
    
    // Check for paradox tolerance vs actual contradictions
    const paradoxTolerance = this.answers['p3_goodlife_paradox'] || this.answers['p3_god_paradox'];
    if (paradoxTolerance <= 3) {
      // Low tolerance for paradox - check for actual contradictions
      // This would require more detailed analysis
    }
    
    this.analysisData.contradictions = contradictions;
  }

  identifyGaps() {
    const gaps = {
      good_life: [],
      god: []
    };
    
    // Check gap answers from Phase 3
    const goodLifeGaps = this.answers['p3_goodlife_gaps'];
    if (Array.isArray(goodLifeGaps)) {
      gaps.good_life = goodLifeGaps.map(item => item.mapsTo?.gap).filter(Boolean);
    }
    
    const godGaps = this.answers['p3_god_gaps'];
    if (Array.isArray(godGaps)) {
      gaps.god = godGaps.map(item => item.mapsTo?.gap).filter(Boolean);
    }
    
    this.analysisData.developmentEdges = gaps;
  }

  calculateIntegrationScores() {
    // Calculate integration scores from Phase 3
    // First try to get direct answers from Phase 3 integration questions
    let goodLifeIntegration = this.answers['p3_goodlife_integration'];
    let godIntegration = this.answers['p3_god_integration'];
    
    // Handle scaled question answers (they might be stored as objects with value property)
    if (goodLifeIntegration && typeof goodLifeIntegration === 'object' && goodLifeIntegration.value !== undefined) {
      goodLifeIntegration = goodLifeIntegration.value;
    }
    if (godIntegration && typeof godIntegration === 'object' && godIntegration.value !== undefined) {
      godIntegration = godIntegration.value;
    }
    
    // If not answered or is 0, calculate from dimensional variance (lower variance = higher integration)
    // Only calculate if we have actual dimensional data
    if ((goodLifeIntegration === undefined || goodLifeIntegration === null || goodLifeIntegration === 0) && 
        Object.keys(this.analysisData.goodLife || {}).length > 0) {
      const goodLifeVariances = [];
      Object.values(this.analysisData.goodLife || {}).forEach(paradigm => {
        const dimensionScores = Object.values(paradigm.dimensions || {}).map(d => d.score || 0).filter(s => s > 0);
        if (dimensionScores.length > 1) { // Need at least 2 dimensions to calculate variance
          const variance = this.calculateVariance(dimensionScores);
          goodLifeVariances.push(variance);
        }
      });
      if (goodLifeVariances.length > 0) {
        const avgVariance = goodLifeVariances.reduce((a, b) => a + b, 0) / goodLifeVariances.length;
        // Convert variance to integration score (inverse relationship, scaled to 0-7)
        // Lower variance = more balanced = higher integration
        goodLifeIntegration = Math.max(0, Math.min(7, 7 - (avgVariance / 1.5)));
      }
    }
    
    if ((godIntegration === undefined || godIntegration === null || godIntegration === 0) && 
        Object.keys(this.analysisData.god || {}).length > 0) {
      const godVariances = [];
      Object.values(this.analysisData.god || {}).forEach(perspective => {
        const dimensionScores = Object.values(perspective.dimensions || {}).map(d => d.score || 0).filter(s => s > 0);
        if (dimensionScores.length > 1) { // Need at least 2 dimensions to calculate variance
          const variance = this.calculateVariance(dimensionScores);
          godVariances.push(variance);
        }
      });
      if (godVariances.length > 0) {
        const avgVariance = godVariances.reduce((a, b) => a + b, 0) / godVariances.length;
        // Convert variance to integration score (inverse relationship, scaled to 0-7)
        godIntegration = Math.max(0, Math.min(7, 7 - (avgVariance / 1.5)));
      }
    }
    
    // Only set integration scores if we have meaningful data
    if ((goodLifeIntegration !== undefined && goodLifeIntegration !== null && goodLifeIntegration > 0) ||
        (godIntegration !== undefined && godIntegration !== null && godIntegration > 0)) {
      this.analysisData.integrationScores = {
        good_life: goodLifeIntegration ? Math.round(goodLifeIntegration * 10) / 10 : undefined,
        god: godIntegration ? Math.round(godIntegration * 10) / 10 : undefined,
        overall: (goodLifeIntegration && godIntegration) 
          ? Math.round(((goodLifeIntegration + godIntegration) / 2) * 10) / 10
          : (goodLifeIntegration || godIntegration || undefined)
      };
    }
  }

  getIntegrationLevel(score) {
    if (score >= 6) return 'Highly Integrated - Your different perspectives work well together';
    if (score >= 4) return 'Moderately Integrated - Some connection between your perspectives';
    if (score >= 2) return 'Low Integration - Your perspectives feel separate or disconnected';
    return 'Very Low Integration - Your perspectives are largely disconnected';
  }

  completeAssessment() {
    // Calculate final results
    this.calculateResults();
    
    // Include all raw answers and question sequence
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.getAllQuestionsAnswered();
    
    // Hide questionnaire, show results
    this.ui.transition('results');
    
    this.renderResults();
    this.saveProgress();
  }

  getAllQuestionsAnswered() {
    const allQuestions = [];
    
    // Phase 1
    if (PHASE_1_QUESTIONS.good_life) {
      PHASE_1_QUESTIONS.good_life.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          phase: 1,
          category: 'good_life',
          answer: this.answers[q.id]
        });
      });
    }
    if (PHASE_1_QUESTIONS.god) {
      PHASE_1_QUESTIONS.god.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          phase: 1,
          category: 'god',
          answer: this.answers[q.id]
        });
      });
    }
    
    // Phase 2 & 3 would be added similarly
    // (Simplified for now - would need to track all questions asked)
    
    return allQuestions;
  }

  calculateResults() {
    // Calculate scores for Good Life paradigms
    if (this.selectedCategories.includes('good_life')) {
      this.analysisData.goodLife = this.calculateGoodLifeScores();
    }
    
    // Calculate scores for God perspectives
    if (this.selectedCategories.includes('god')) {
      this.analysisData.god = this.calculateGodScores();
    }
    
    // Identify primary paradigms
    this.analysisData.identifiedParadigms = this.identifyParadigms();
    
    // Enhanced analysis
    this.identifyShadowBlindSpots();
    this.findCompatibleFrameworks();
    this.identifyTensionPoints();
  }

  calculateGoodLifeScores() {
    const scores = {};
    
    // Use Phase 1 and Phase 2 results to calculate scores
    Object.keys(GOOD_LIFE_PARADIGMS).forEach(paradigmKey => {
      const paradigm = GOOD_LIFE_PARADIGMS[paradigmKey];
      scores[paradigmKey] = {
        name: paradigm.name,
        dimensions: {},
        overallScore: 0
      };
      
      // Calculate dimension scores from Phase 2 answers
      Object.keys(paradigm.dimensions).forEach(dimensionKey => {
        const dimensionAnswer = this.answers[`p2_dimension_${dimensionKey}`];
        if (dimensionAnswer !== undefined) {
          scores[paradigmKey].dimensions[dimensionKey] = {
            name: paradigm.dimensions[dimensionKey].name,
            score: dimensionAnswer
          };
        }
      });
      
      // Calculate overall score (average of dimension scores)
      const dimensionScores = Object.values(scores[paradigmKey].dimensions).map(d => d.score);
      scores[paradigmKey].overallScore = dimensionScores.length > 0
        ? dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length
        : 0;
    });
    
    return scores;
  }

  calculateGodScores() {
    const scores = {};
    
    // Similar to Good Life calculation
    Object.keys(GOD_PERSPECTIVES).forEach(perspectiveKey => {
      const perspective = GOD_PERSPECTIVES[perspectiveKey];
      scores[perspectiveKey] = {
        name: perspective.name,
        dimensions: {},
        overallScore: 0
      };
      
      Object.keys(perspective.dimensions).forEach(dimensionKey => {
        const dimensionAnswer = this.answers[`p2_god_dimension_${dimensionKey}`];
        if (dimensionAnswer !== undefined) {
          scores[perspectiveKey].dimensions[dimensionKey] = {
            name: perspective.dimensions[dimensionKey].name,
            score: dimensionAnswer
          };
        }
      });
      
      const dimensionScores = Object.values(scores[perspectiveKey].dimensions).map(d => d.score);
      scores[perspectiveKey].overallScore = dimensionScores.length > 0
        ? dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length
        : 0;
    });
    
    return scores;
  }

  identifyParadigms() {
    const paradigms = [];
    
    // Identify Good Life paradigms
    if (this.analysisData.goodLife && Object.keys(this.analysisData.goodLife).length > 0) {
      Object.entries(this.analysisData.goodLife).forEach(([key, data]) => {
        paradigms.push({
          category: 'good_life',
          key: key,
          name: data.name,
          score: data.overallScore,
          dimensions: data.dimensions
        });
      });
    }
    
    // Identify God perspectives
    if (this.analysisData.god && Object.keys(this.analysisData.god).length > 0) {
      Object.entries(this.analysisData.god).forEach(([key, data]) => {
        paradigms.push({
          category: 'god',
          key: key,
          name: data.name,
          score: data.overallScore,
          dimensions: data.dimensions
        });
      });
    }
    
    // Sort by score
    paradigms.sort((a, b) => b.score - a.score);
    
    // Determine confidence bands
    this.determineConfidenceBands(paradigms);
    this.calculateDimensionalTensions();
    this.calculateTranslationCapacity();
    
    return paradigms;
  }

  determineConfidenceBands(paradigms) {
    if (paradigms.length === 0) return;
    
    // Group by category
    const goodLifeParadigms = paradigms.filter(p => p.category === 'good_life');
    const godPerspectives = paradigms.filter(p => p.category === 'god');
    
    [goodLifeParadigms, godPerspectives].forEach(group => {
      if (group.length === 0) return;
      
      const topScore = group[0].score;
      const secondScore = group.length > 1 ? group[1].score : 0;
      const scoreDiff = topScore - secondScore;
      
      group.forEach((paradigm, index) => {
        let band = 'peripheral';
        
        if (index === 0) {
          if (scoreDiff < 1.5 && group.length > 1) {
            band = 'co-dominant';
            group[0].blendedOrientation = true;
            if (group[1]) group[1].blendedOrientation = true;
          } else {
            band = 'primary';
          }
        } else if (index === 1 && scoreDiff < 1.5) {
          band = 'co-dominant';
        }
        
        paradigm.confidenceBand = band;
        
        const key = `${paradigm.category}_${paradigm.key}`;
        if (!this.analysisData.confidenceBands) {
          this.analysisData.confidenceBands = {};
        }
        this.analysisData.confidenceBands[key] = band;
      });
    });
  }

  calculateDimensionalTensions() {
    // Analyze dimensional tensions for each paradigm
    Object.keys(this.analysisData.goodLife || {}).forEach(key => {
      const paradigm = this.analysisData.goodLife[key];
      const tensions = this.findDimensionalTensions(paradigm.dimensions);
      if (tensions.length > 0) {
        this.analysisData.dimensionalTensions[`good_life_${key}`] = tensions;
      }
    });
    
    Object.keys(this.analysisData.god || {}).forEach(key => {
      const perspective = this.analysisData.god[key];
      const tensions = this.findDimensionalTensions(perspective.dimensions);
      if (tensions.length > 0) {
        this.analysisData.dimensionalTensions[`god_${key}`] = tensions;
      }
    });
  }

  findDimensionalTensions(dimensions) {
    const tensions = [];
    const scores = Object.entries(dimensions).map(([key, dim]) => ({
      key,
      score: dim.score || 0
    }));
    
    // Find high-low pairs (tension indicators)
    scores.forEach((dim1, i) => {
      scores.slice(i + 1).forEach(dim2 => {
        const diff = Math.abs(dim1.score - dim2.score);
        if (diff >= 3) { // Significant tension threshold
          tensions.push({
            high: dim1.score > dim2.score ? dim1.key : dim2.key,
            low: dim1.score < dim2.score ? dim1.key : dim2.key,
            difference: diff
          });
        }
      });
    });
    
    return tensions;
  }

  calculateTranslationCapacity() {
    // Measure ability to hold meaning across multiple dimensions
    let totalCapacity = 0;
    let count = 0;
    
    Object.values(this.analysisData.goodLife || {}).forEach(paradigm => {
      const dimensionScores = Object.values(paradigm.dimensions).map(d => d.score || 0);
      const variance = this.calculateVariance(dimensionScores);
      totalCapacity += (7 - Math.min(variance, 7));
      count++;
    });
    
    Object.values(this.analysisData.god || {}).forEach(perspective => {
      const dimensionScores = Object.values(perspective.dimensions).map(d => d.score || 0);
      const variance = this.calculateVariance(dimensionScores);
      totalCapacity += (7 - Math.min(variance, 7));
      count++;
    });
    
    this.analysisData.translationCapacity = count > 0 ? totalCapacity / count : null;
  }

  calculateVariance(scores) {
    if (scores.length === 0) return 0;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return variance;
  }

  identifyShadowBlindSpots() {
    // Identify underrepresented dimensions (shadow/blind spots)
    const shadowBlindSpots = {
      good_life: {},
      god: {}
    };
    
    // Find dimensions with consistently low scores
    Object.keys(this.analysisData.goodLife || {}).forEach(key => {
      const paradigm = this.analysisData.goodLife[key];
      const lowDimensions = Object.entries(paradigm.dimensions)
        .filter(([dimKey, dim]) => (dim.score || 0) <= 3)
        .map(([dimKey, dim]) => dimKey);
      
      if (lowDimensions.length > 0) {
        shadowBlindSpots.good_life[key] = lowDimensions;
      }
    });
    
    Object.keys(this.analysisData.god || {}).forEach(key => {
      const perspective = this.analysisData.god[key];
      const lowDimensions = Object.entries(perspective.dimensions)
        .filter(([dimKey, dim]) => (dim.score || 0) <= 3)
        .map(([dimKey, dim]) => dimKey);
      
      if (lowDimensions.length > 0) {
        shadowBlindSpots.god[key] = lowDimensions;
      }
    });
    
    this.analysisData.shadowBlindSpots = shadowBlindSpots;
  }

  findCompatibleFrameworks() {
    // Find other paradigms that might be compatible based on dimensional overlap
    const compatible = [];
    
    // This would analyze dimensional patterns to find compatible frameworks
    // Simplified for now
    this.analysisData.compatibleFrameworks = compatible;
  }

  identifyTensionPoints() {
    // Identify areas of internal contradiction or tension
    const tensions = [];
    
    // Add contradictions identified in Phase 3
    if (this.analysisData.contradictions) {
      tensions.push(...this.analysisData.contradictions);
    }
    
    // Add dimensional tensions
    Object.entries(this.analysisData.dimensionalTensions || {}).forEach(([key, tensionList]) => {
      tensions.push(...tensionList.map(t => ({
        type: 'dimensional_tension',
        location: key,
        ...t
      })));
    });
    
    this.analysisData.tensionPoints = tensions;
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    let html = '<div class="paradigm-summary">';
    html += '<h3>Your Current Dominant Framing</h3>';
    html += '<p>Based on your responses, here are your primary paradigm alignments. Remember: paradigms commonly shift with life stage, pressure, and responsibility. This map reflects your current organization of meaning, not a fixed identity.</p>';
    html += '</div>';
    
    // Display Good Life results
    if (this.analysisData.goodLife && Object.keys(this.analysisData.goodLife).length > 0) {
      html += this.renderCategoryResults('good_life', 'The Good Life');
    }
    
    // Display God results
    if (this.analysisData.god && Object.keys(this.analysisData.god).length > 0) {
      html += this.renderCategoryResults('god', 'God Perspectives');
    }
    
    // Enhanced insights
    html += this.renderEnhancedInsights();
    
    // Integration section
    html += this.getIntegrationSection();
    
    SecurityUtils.safeInnerHTML(container, html);
  }

  renderCategoryResults(category, title) {
    const paradigms = this.analysisData.identifiedParadigms.filter(p => p.category === category)
      .sort((a, b) => b.score - a.score);
    
    let html = `<div class="paradigm-card"><h4>${title}</h4>`;
    
    paradigms.forEach(paradigm => {
      const band = paradigm.confidenceBand || 'peripheral';
      const bandLabel = band === 'primary' ? 'Primary' : band === 'co-dominant' ? 'Co-dominant' : 'Peripheral';
      const bandColor = band === 'primary' ? 'var(--brand)' : band === 'co-dominant' ? 'var(--accent)' : 'var(--muted)';
      
      html += `
        <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: var(--glass); border-radius: var(--radius); border-left: 4px solid ${bandColor};">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
            <strong style="font-size: 1.1rem;">${paradigm.name}</strong>
            <span style="background: ${bandColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${bandLabel}</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 0.75rem;">Score: ${paradigm.score.toFixed(1)}/7</p>
          <div class="score-bar">
            <div class="score-fill" style="width: ${(paradigm.score / 7) * 100}%"></div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  renderEnhancedInsights() {
    let html = '<div class="enhanced-insights" style="margin-top: 2rem;">';
    html += '<h3 style="color: var(--brand); margin-bottom: 1.5rem;">Enhanced Insights</h3>';
    
    // Primary Paradigm with Confidence Level
    const primaryParadigms = this.analysisData.identifiedParadigms
      .filter(p => p.confidenceBand === 'primary')
      .sort((a, b) => b.score - a.score);
    
    if (primaryParadigms.length > 0) {
      html += '<div class="insight-section insight-section-primary">';
      html += '<h4>Primary Paradigm</h4>';
      primaryParadigms.forEach(paradigm => {
        const confidence = paradigm.score >= 6 ? 'High' : paradigm.score >= 4 ? 'Medium' : 'Low';
        html += `<p><strong>${paradigm.name}</strong> (${paradigm.category === 'good_life' ? 'The Good Life' : 'God Perspective'}) - Confidence: ${confidence} (${paradigm.score.toFixed(1)}/7)</p>`;
      });
      html += '</div>';
    }
    
    // Shadow/Blind Spots
    if (this.analysisData.shadowBlindSpots) {
      const hasBlindSpots = Object.keys(this.analysisData.shadowBlindSpots.good_life || {}).length > 0 ||
                           Object.keys(this.analysisData.shadowBlindSpots.god || {}).length > 0;
      
      if (hasBlindSpots) {
        html += '<div class="insight-section insight-section-shadow">';
        html += '<h4>Shadow/Blind Spots</h4>';
        html += '<p>Underrepresented dimensions in your current paradigm (areas you may be overlooking):</p>';
        
        Object.entries(this.analysisData.shadowBlindSpots.good_life || {}).forEach(([paradigmKey, dimensions]) => {
          const paradigm = this.analysisData.goodLife[paradigmKey];
          if (paradigm) {
            html += `<p style="margin-bottom: 0.5rem;"><strong>${paradigm.name}:</strong> `;
            html += dimensions.map(dim => this.getDimensionLabel(dim)).join(', ');
            html += '</p>';
          }
        });
        
        Object.entries(this.analysisData.shadowBlindSpots.god || {}).forEach(([perspectiveKey, dimensions]) => {
          const perspective = this.analysisData.god[perspectiveKey];
          if (perspective && Array.isArray(dimensions) && dimensions.length > 0) {
            const perspectiveName = GOD_PERSPECTIVES[perspectiveKey]?.name || perspective.name || perspectiveKey;
            html += `<p><strong>${perspectiveName}:</strong> `;
            html += dimensions.map(dim => this.getDimensionLabel(dim)).join(', ');
            html += '</p>';
          }
        });
        
        html += '</div>';
      }
    }
    
    // Development Edges
    if (this.analysisData.developmentEdges) {
      const hasEdges = (this.analysisData.developmentEdges.good_life || []).length > 0 ||
                      (this.analysisData.developmentEdges.god || []).length > 0;
      
      if (hasEdges) {
        html += '<div class="insight-section insight-section-development">';
        html += '<h4>Development Edges</h4>';
        html += '<p>Areas of low integration or incomplete understanding (opportunities for growth):</p>';
        
        if ((this.analysisData.developmentEdges.good_life || []).length > 0) {
          html += '<p style="margin-bottom: 0.5rem;"><strong>The Good Life:</strong> ';
          html += this.analysisData.developmentEdges.good_life
            .filter(gap => gap !== 'none')
            .map(gap => this.getDimensionLabel(gap))
            .join(', ');
          html += '</p>';
        }
        
        if ((this.analysisData.developmentEdges.god || []).length > 0) {
          const validGaps = this.analysisData.developmentEdges.god
            .filter(gap => gap && gap !== 'none' && gap !== '');
          if (validGaps.length > 0) {
            html += '<p><strong>God Perspectives:</strong> ';
            html += validGaps.map(gap => this.getDimensionLabel(gap)).join(', ');
            html += '</p>';
          }
        }
        
        html += '</div>';
      }
    }
    
    // Compatible Frameworks
    if (this.analysisData.compatibleFrameworks && this.analysisData.compatibleFrameworks.length > 0) {
      html += '<div class="insight-section insight-section-compatible">';
      html += '<h4>Compatible Frameworks</h4>';
      html += '<p>Other paradigms that might understand your language:</p>';
      this.analysisData.compatibleFrameworks.forEach(framework => {
        html += `<p>${framework}</p>`;
      });
      html += '</div>';
    }
    
    // Tension Points
    if (this.analysisData.tensionPoints && this.analysisData.tensionPoints.length > 0) {
      html += '<div class="insight-section" style="border-left-color: #ff9800;">';
      html += '<h4 style="color: #ff9800;">Tension Points</h4>';
      html += '<p style="color: var(--muted); margin-bottom: 0.75rem;">Areas of internal contradiction or tension (not necessarily problematic):</p>';
      this.analysisData.tensionPoints.forEach(tension => {
        let description = '';
        if (tension.description) {
          description = tension.description;
        } else if (tension.type === 'dimensional_tension' && tension.high && tension.low) {
          const highLabel = this.getDimensionLabel(tension.high);
          const lowLabel = this.getDimensionLabel(tension.low);
          const location = tension.location ? ` (${tension.location.replace(/^(good_life|god)_/, '')})` : '';
          description = `Tension between ${highLabel} and ${lowLabel} dimensions${location}`;
        } else if (tension.type) {
          description = tension.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        } else {
          description = 'Internal tension detected';
        }
        html += `<p style="margin-bottom: 0.5rem;">${description}</p>`;
      });
      html += '</div>';
    }
    
    // Integration Scores - Only show if meaningful data exists
    if (this.analysisData.integrationScores) {
      const hasMeaningfulData = (
        (this.analysisData.integrationScores.good_life !== undefined && this.analysisData.integrationScores.good_life > 0) ||
        (this.analysisData.integrationScores.god !== undefined && this.analysisData.integrationScores.god > 0)
      );
      
      if (hasMeaningfulData) {
        html += '<div class="insight-section" style="border-left-color: var(--brand);">';
        html += '<h4 style="color: var(--brand);">Integration Scores</h4>';
        html += '<p style="color: var(--muted); margin-bottom: 0.75rem;">How well integrated are your different ways of understanding (how well your different perspectives work together):</p>';
        if (this.analysisData.integrationScores.good_life !== undefined && this.analysisData.integrationScores.good_life > 0) {
          const level = this.getIntegrationLevel(this.analysisData.integrationScores.good_life);
          html += `<p style="margin-bottom: 0.5rem;"><strong>The Good Life:</strong> ${this.analysisData.integrationScores.good_life.toFixed(1)}/7 - ${level}</p>`;
        }
        if (this.analysisData.integrationScores.god !== undefined && this.analysisData.integrationScores.god > 0) {
          const level = this.getIntegrationLevel(this.analysisData.integrationScores.god);
          html += `<p style="margin-bottom: 0.5rem;"><strong>God Perspectives:</strong> ${this.analysisData.integrationScores.god.toFixed(1)}/7 - ${level}</p>`;
        }
        if (this.analysisData.integrationScores.overall !== undefined && this.analysisData.integrationScores.overall > 0) {
          const level = this.getIntegrationLevel(this.analysisData.integrationScores.overall);
          html += `<p style="margin-bottom: 0.5rem;"><strong>Overall Integration:</strong> ${this.analysisData.integrationScores.overall.toFixed(1)}/7 - ${level}</p>`;
        }
        html += '</div>';
      }
    }
    
    html += '</div>';
    return html;
  }

  getDimensionLabel(dimensionKey) {
    if (!dimensionKey || typeof dimensionKey !== 'string') {
      return 'Unknown';
    }
    const labels = {
      'literal': 'Literal',
      'symbolic': 'Symbolic',
      'esoteric': 'Esoteric',
      'mystical': 'Mystical'
    };
    return labels[dimensionKey.toLowerCase()] || dimensionKey;
  }

  getIntegrationSection() {
    const primaryGoodLife = this.analysisData.identifiedParadigms
      .filter(p => p.category === 'good_life' && p.confidenceBand === 'primary')[0];
    const primaryGod = this.analysisData.identifiedParadigms
      .filter(p => p.category === 'god' && p.confidenceBand === 'primary')[0];
    
    let html = '<div style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); padding: 2rem; margin-top: 2.5rem; border: 2px solid var(--brand); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">';
    html += '<h3 style="color: var(--brand); margin-bottom: 1rem; text-align: center;">Integration & Practical Orientation</h3>';
    html += '<div style="line-height: 1.8;">';
    
    if (primaryGoodLife) {
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">What This Alignment Makes Easy</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">Your current dominant framing of "The Good Life" as <strong>${primaryGoodLife.name}</strong> naturally supports certain ways of engaging with meaning, action, and satisfaction. This alignment makes it easier to find coherence in experiences that match this paradigm.</p>`;
      html += '</div>';
      
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">What This Alignment Makes Hard</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">The same alignment that provides coherence may make it harder to engage with experiences that require different modes of apprehension. When life demands approaches outside your primary paradigm, you may experience tension or confusion.</p>`;
      html += '</div>';
      
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">What to Watch For Under Stress</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">Under pressure, your primary paradigm may become rigid. Watch for patterns where <strong>${primaryGoodLife.name}</strong> becomes the only valid way of engaging, excluding other valid approaches.</p>`;
      html += '</div>';
    }
    
    if (primaryGod) {
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">God Perspective Integration</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">Your current dominant framing of God as <strong>${primaryGod.name}</strong> shapes how you engage with ultimate questions. Remember: this is an interpretive frame, not a claim about ultimate reality. Under stress, this perspective may become dogmatic or defensive.</p>`;
      html += '</div>';
    }
    
    // Translation Capacity
    if (this.analysisData.translationCapacity !== null) {
      html += '<div style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--accent); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem;">';
      html += `<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--accent);">Translation Capacity:</strong> ${this.analysisData.translationCapacity.toFixed(1)}/7. This measures your ability to hold meaning across multiple dimensions. Higher capacity indicates greater flexibility in engaging with different modes of apprehension.</p>`;
      html += '</div>';
    }
    
    html += '<div style="background: rgba(211, 47, 47, 0.1); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem; text-align: center;">';
    html += '<p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--muted);"><strong style="color: #d32f2f;">Exit Cue:</strong> This map serves orientation. Return to lived action. Use this understanding to support your sovereignty, not to fuel recursive meaning-chasing or metaphysical fixation.</p>';
    html += '</div>';
    
    html += '</div></div>';
    
    return html;
  }

  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'logos-structure', 'Logos Structure');
      downloadFile(csv, `paradigm-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'logos-structure', 'Logos Structure');
      downloadFile(json, `paradigm-analysis-${Date.now()}.json`, 'application/json');
    }
  }

  exportExecutiveBrief() {
    const brief = exportExecutiveBrief(this.analysisData, 'logos-structure', 'Logos Structure');
    downloadFile(brief, `paradigm-executive-brief-${Date.now()}.txt`, 'text/plain');
  }

  /**
   * Save assessment progress to storage
   */
  saveProgress() {
    try {
      const progressData = {
        selectedCategories: this.selectedCategories,
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

      this.selectedCategories = data.selectedCategories || [];
      this.currentPhase = data.currentPhase || 1;
      this.currentQuestionIndex = data.currentQuestionIndex || 0;
      this.answers = data.answers || {};
      this.phase1Results = data.phase1Results || {};
      this.analysisData = data.analysisData || this.analysisData;
      
      // Restore category selections
      this.selectedCategories.forEach(categoryId => {
        const card = document.querySelector(`[data-category="${categoryId}"]`);
        if (card) card.classList.add('selected');
      });
      
      const startBtn = document.getElementById('startAssessment');
      if (startBtn) {
        startBtn.disabled = this.selectedCategories.length === 0;
      }
      
      // If in progress, restore questionnaire state
      if (this.currentQuestionIndex > 0 && this.selectedCategories.length > 0) {
        if (this.currentPhase === 1) {
          await this.buildPhase1Sequence();
        } else if (this.currentPhase === 2) {
          await this.analyzePhase1Results();
          await this.buildPhase2Sequence();
        } else if (this.currentPhase === 3) {
          await this.analyzePhase1Results();
          await this.analyzePhase2Results();
          await this.buildPhase3Sequence();
        }
        
        const categorySelection = document.getElementById('categorySelection');
        const questionnaireSection = document.getElementById('questionnaireSection');
        if (categorySelection) categorySelection.classList.add('hidden');
        if (questionnaireSection) questionnaireSection.classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
    }
  }

  resetAssessment() {
    this.selectedCategories = [];
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.phase1Results = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: [],
      confidenceBands: {},
      dimensionalTensions: {},
      translationCapacity: null,
      shadowBlindSpots: {},
      developmentEdges: {},
      compatibleFrameworks: [],
      tensionPoints: [],
      contradictions: [],
      allAnswers: {},
      questionSequence: []
    };
    
    sessionStorage.removeItem('paradigmProgress');
    
    // Reset UI
    document.getElementById('categorySelection').classList.remove('hidden');
    this.ui.transition('idle');
    
    document.querySelectorAll('.category-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.disabled = true;
    }
  }
}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.paradigmEngine = new ParadigmEngine();
  });
} else {
  window.paradigmEngine = new ParadigmEngine();
}

