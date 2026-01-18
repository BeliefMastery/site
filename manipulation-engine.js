// Manipulation Engine - Version 2.1
// Multi-Phase Questionnaire Architecture
// Optimized for strategic prioritization and experiential assessment
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportExecutiveBrief, exportJSON, downloadFile } from './shared/export-utils.js';

// Data modules - will be loaded lazily
let MANIPULATION_VECTORS, MANIPULATION_TACTICS;
let SYMPTOM_QUESTIONS, EFFECT_QUESTIONS, CONSEQUENCE_QUESTIONS;
let VECTOR_MAPPING;
let PHASE_1_VECTOR_SCREENING, generatePhase3VectorQuestions;

/**
 * Manipulation Engine - Identifies manipulation vectors through multi-phase assessment
 */
export class ManipulationEngine {
  /**
   * Initialize the manipulation assessment engine
   */
  constructor() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.vectorScores = {}; // Phase 1 results: { vector: { state: 'high'|'medium'|'low', score: number } }
    this.prioritizedVectors = []; // Phase 2: User-selected 2-3 priority vectors
    this.assessedVectors = []; // Phase 3: Vectors that have been assessed
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      vectorScores: {},
      identifiedVectors: [],
      primaryVector: null,
      supportingVectors: [],
      tactics: [],
      structuralModifier: null,
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('ManipulationEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('manipulation-assessment', '1.0.0');
    
    this.init();
  }

  /**
   * Initialize the engine - attach listeners and load stored data
   */
  init() {
    this.attachEventListeners();
    this.loadStoredData().catch(error => {
      this.debugReporter.logError(error, 'init');
    });
  }

  /**
   * Load manipulation data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadManipulationData() {
    if (MANIPULATION_VECTORS && PHASE_1_VECTOR_SCREENING) {
      return; // Already loaded
    }

    try {
      // Load vectors data
      const vectorsModule = await loadDataModule(
        './manipulation-data/manipulation-vectors.js',
        'Manipulation Vectors'
      );
      MANIPULATION_VECTORS = vectorsModule.MANIPULATION_VECTORS;

      // Load tactics data
      const tacticsModule = await loadDataModule(
        './manipulation-data/manipulation-tactics.js',
        'Manipulation Tactics'
      );
      MANIPULATION_TACTICS = tacticsModule.MANIPULATION_TACTICS;

      // Load questions data
      const symptomModule = await loadDataModule(
        './manipulation-data/symptom-questions.js',
        'Symptom Questions'
      );
      SYMPTOM_QUESTIONS = symptomModule.SYMPTOM_QUESTIONS;

      const effectModule = await loadDataModule(
        './manipulation-data/effect-questions.js',
        'Effect Questions'
      );
      EFFECT_QUESTIONS = effectModule.EFFECT_QUESTIONS;

      const consequenceModule = await loadDataModule(
        './manipulation-data/consequence-questions.js',
        'Consequence Questions'
      );
      CONSEQUENCE_QUESTIONS = consequenceModule.CONSEQUENCE_QUESTIONS;

      // Load mapping data
      const mappingModule = await loadDataModule(
        './manipulation-data/vector-mapping.js',
        'Vector Mapping'
      );
      VECTOR_MAPPING = mappingModule.VECTOR_MAPPING;

      // Load phase 1 questions and generator
      const questionsModule = await loadDataModule(
        './manipulation-data/manipulation-questions-v2.js',
        'Manipulation Questions'
      );
      PHASE_1_VECTOR_SCREENING = questionsModule.PHASE_1_VECTOR_SCREENING;
      generatePhase3VectorQuestions = questionsModule.generatePhase3VectorQuestions;

      this.debugReporter.recordSection('Phase 1', PHASE_1_VECTOR_SCREENING?.length || 0);
    } catch (error) {
      this.debugReporter.logError(error, 'loadManipulationData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  attachEventListeners() {
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
    
    const exportBtnJson = document.getElementById('exportAnalysisJson');
    if (exportBtnJson) {
      exportBtnJson.addEventListener('click', () => this.exportAnalysis('json'));
    }
    
    const exportBtnCsv = document.getElementById('exportAnalysisCsv');
    if (exportBtnCsv) {
      exportBtnCsv.addEventListener('click', () => this.exportAnalysis('csv'));
    }

    const exportBriefBtn = document.getElementById('exportExecutiveBrief');
    if (exportBriefBtn) {
      exportBriefBtn.addEventListener('click', () => this.exportExecutiveBrief());
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
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('button, input[type="radio"], input[type="checkbox"]')) {
        // Let default behavior handle it
        return;
      }
      if (e.key === 'ArrowRight' || (e.key === 'Enter' && e.ctrlKey)) {
        e.preventDefault();
        this.nextQuestion();
      } else if (e.key === 'ArrowLeft' || (e.key === 'Backspace' && e.ctrlKey)) {
        e.preventDefault();
        this.prevQuestion();
      }
    });
  }

  startAssessment() {
    const introSection = document.getElementById('introSection');
    const actionButtonsSection = document.getElementById('actionButtonsSection');
    const questionnaireSection = document.getElementById('questionnaireSection');

    if (introSection) introSection.classList.add('hidden');
    if (actionButtonsSection) actionButtonsSection.classList.add('hidden');
    if (questionnaireSection) questionnaireSection.classList.add('active');

    this.buildPhase1Sequence();
  }

  /**
   * Build Phase 1 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase1Sequence() {
    await this.loadManipulationData();
    
    // Phase 1: Vector Screening (6-8 questions)
    this.questionSequence = [];
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    
    this.questionSequence.push(...PHASE_1_VECTOR_SCREENING);
    this.debugReporter.recordQuestionCount(this.questionSequence.length);
    
    // Show questionnaire if not already shown
    const questionnaireSection = document.getElementById('questionnaireSection');
    if (questionnaireSection && !questionnaireSection.classList.contains('active')) {
      questionnaireSection.classList.add('active');
    }
    
    this.renderCurrentQuestion();
  }

  /**
   * Analyze Phase 1 results and calculate vector scores
   * @returns {Promise<void>}
   */
  async analyzePhase1Results() {
    await this.loadManipulationData();
    
    try {
      // Calculate vector scores from Phase 1 answers
      this.vectorScores = {};
      
      Object.keys(MANIPULATION_VECTORS).forEach(vectorKey => {
        const vector = MANIPULATION_VECTORS[vectorKey];
        let totalScore = 0;
        let totalWeight = 0;
        
        // Find questions that map to this vector
        PHASE_1_VECTOR_SCREENING.forEach(question => {
          const answer = this.answers[question.id];
          if (answer && answer.mapsTo && answer.mapsTo.vector === vectorKey) {
            const state = answer.mapsTo.state;
            const weight = answer.mapsTo.weight || 1;
            
            // Score: high = 3, medium = 1, low = 0
            const score = state === 'high' ? 3 : state === 'medium' ? 1 : 0;
            totalScore += score * weight;
            totalWeight += weight;
          }
        });
        
        const avgScore = totalWeight > 0 ? totalScore / totalWeight : 0;
        const state = avgScore >= 2 ? 'high' : avgScore >= 0.5 ? 'medium' : 'low';
        
        this.vectorScores[vectorKey] = {
          state: state,
          score: avgScore,
          vector: vector
        };
      });
      
      this.analysisData.phase1Results = this.vectorScores;
      
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
    await this.loadManipulationData();
    
    try {
      // Phase 2: Vector Prioritization
      // Show Phase 1 results and ask user to prioritize 2-3 vectors
      this.questionSequence = [];
      this.currentPhase = 2;
      this.currentQuestionIndex = 0;
      
      // Identify likely vectors (high or medium state)
      const likelyVectors = Object.keys(this.vectorScores)
        .filter(key => this.vectorScores[key].state === 'high' || this.vectorScores[key].state === 'medium')
        .map(key => ({
          id: key,
          vector: MANIPULATION_VECTORS[key],
          score: this.vectorScores[key].score,
          state: this.vectorScores[key].state
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6); // Top 6 for selection
      
      // Create prioritization question
      this.questionSequence.push({
        id: 'p2_prioritization',
        question: 'Based on your initial screening, which manipulation vectors would you like to explore in depth?',
        type: 'multiselect',
        maxSelections: 3,
        options: likelyVectors.map(v => ({
          text: `${v.vector.name}: ${v.vector.description}`,
          mapsTo: { vector: v.id, priority: v.state === 'high' ? 'high' : 'medium' },
          vector: v.id
        })),
        phase: 2,
        likelyVectors: likelyVectors
      });
      
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase2Sequence');
      ErrorHandler.showUserError('Failed to load Phase 2. Please refresh the page.');
    }
  }

  /**
   * Process Phase 2 results and proceed to Phase 3
   * @returns {Promise<void>}
   */
  async processPhase2Results() {
    try {
      // Get user's prioritized vectors
      const prioritizationAnswer = this.answers['p2_prioritization'];
      if (Array.isArray(prioritizationAnswer)) {
        this.prioritizedVectors = prioritizationAnswer.map(item => item.mapsTo.vector);
        this.analysisData.prioritizedVectors = this.prioritizedVectors;
      }
      
      // Build Phase 3 sequence
      await this.buildPhase3Sequence();
    } catch (error) {
      this.debugReporter.logError(error, 'processPhase2Results');
      ErrorHandler.showUserError('Failed to process Phase 2 results.');
    }
  }

  /**
   * Build Phase 3 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase3Sequence() {
    await this.loadManipulationData();
    
    try {
      // Phase 3: Deep Assessment
      this.questionSequence = [];
      this.currentPhase = 3;
      this.currentQuestionIndex = 0;
    
    // Collect all existing questions organized by category
    const existingQuestions = {
      symptoms: [],
      effects: [],
      consequences: []
    };
    
    // Flatten symptom questions
    Object.keys(SYMPTOM_QUESTIONS).forEach(category => {
      const categoryQuestions = SYMPTOM_QUESTIONS[category];
      if (Array.isArray(categoryQuestions)) {
        existingQuestions.symptoms.push(...categoryQuestions);
      }
    });
    
    // Flatten effect questions
    Object.keys(EFFECT_QUESTIONS).forEach(category => {
      const categoryQuestions = EFFECT_QUESTIONS[category];
      if (Array.isArray(categoryQuestions)) {
        existingQuestions.effects.push(...categoryQuestions);
      }
    });
    
    // Flatten consequence questions
    Object.keys(CONSEQUENCE_QUESTIONS).forEach(category => {
      const categoryQuestions = CONSEQUENCE_QUESTIONS[category];
      if (Array.isArray(categoryQuestions)) {
        existingQuestions.consequences.push(...categoryQuestions);
      }
    });
    
    // Generate questions for prioritized vectors
    this.prioritizedVectors.forEach(vectorId => {
      const vector = MANIPULATION_VECTORS[vectorId];
      if (vector) {
        const vectorQuestions = generatePhase3VectorQuestions(vectorId, vector, existingQuestions);
        vectorQuestions.forEach(q => {
          this.questionSequence.push({
            ...q,
            phase: 3,
            vector: vectorId
          });
        });
      }
    });
    
    this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase3Sequence');
      ErrorHandler.showUserError('Failed to build Phase 3 sequence. Please try again.');
    }
  }

  processPhase3Answer(question) {
    // Handle conditional branching for Phase 3 questions
    if (question.type === 'binary_unsure') {
      const answer = this.answers[question.id];
      if (answer && answer.text) {
        const conditionalQuestions = question.conditional && question.conditional[answer.text];
        if (conditionalQuestions) {
          // Insert conditional questions after current question
          const currentIndex = this.questionSequence.findIndex(q => q.id === question.id);
          conditionalQuestions.forEach((condQ, index) => {
            this.questionSequence.splice(currentIndex + 1 + index, 0, {
              ...condQ,
              phase: 3,
              vector: question.vector
            });
          });
        }
      }
    } else if (question.type === 'multiselect' && question.conditional && question.conditional['selected']) {
      // Handle multi-select: show frequency questions for selected items
      const answer = this.answers[question.id];
      if (answer && Array.isArray(answer) && answer.length > 0) {
        const selectedIds = answer.map(a => a.mapsTo?.symptomId || a.mapsTo?.effectId || a.mapsTo?.consequenceId).filter(Boolean);
        const conditionalQuestions = question.conditional['selected'];
        
        // Filter to only show frequency questions for selected items
        const questionsToAdd = conditionalQuestions.filter(condQ => {
          if (condQ.conditional !== true) return false; // Only show conditional questions
          const originalId = condQ.originalQuestion?.id;
          return originalId && selectedIds.includes(originalId);
        });
        
        if (questionsToAdd.length > 0) {
          // Insert conditional questions after current question
          const currentIndex = this.questionSequence.findIndex(q => q.id === question.id);
          questionsToAdd.forEach((condQ, index) => {
            // Check if this question already exists in sequence
            const existingIndex = this.questionSequence.findIndex(q => q.id === condQ.id);
            if (existingIndex === -1) {
              this.questionSequence.splice(currentIndex + 1 + index, 0, {
                ...condQ,
                phase: 3,
                vector: question.vector
              });
            }
          });
        }
      }
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
      
      // Render based on question type
      if (question.type === 'three_point') {
        html = this.renderThreePointQuestion(question);
      } else if (question.type === 'binary_unsure') {
        html = this.renderBinaryUnsureQuestion(question);
      } else if (question.type === 'frequency') {
        html = this.renderFrequencyQuestion(question);
      } else if (question.type === 'multiselect') {
        html = this.renderMultiselectQuestion(question);
      }
      
      // Sanitize HTML before rendering - all dynamic content is already sanitized in render methods
      SecurityUtils.safeInnerHTML(container, html);
      
      // Attach event listeners for the specific question type
      this.attachQuestionListeners(question);
      
      this.updateProgress();
      this.updateNavigationButtons();
      
      // Track render performance
      const renderDuration = performance.now() - renderStart;
      this.debugReporter.recordRender('question', renderDuration);
      
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

  renderThreePointQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        ${question.description ? `<div class="question-description">${SecurityUtils.sanitizeHTML(question.description || '')}</div>` : ''}
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
      </div>
    `;
  }

  renderBinaryUnsureQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        ${question.description ? `<div class="question-description">${SecurityUtils.sanitizeHTML(question.description || '')}</div>` : ''}
        <div class="binary-unsure-options">
          ${question.options.map((option, index) => `
            <label class="binary-unsure-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
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

  renderFrequencyQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        ${question.description ? `<div class="question-description">${SecurityUtils.sanitizeHTML(question.description || '')}</div>` : ''}
        <div class="frequency-options">
          ${question.options.map((option, index) => `
            <label class="frequency-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
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
    
    // Special rendering for Phase 2 prioritization with visual feedback
    if (question.id === 'p2_prioritization') {
      return this.renderPhase2Prioritization(question, currentAnswer, maxSelections);
    }
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        ${question.description ? `<div class="question-description">${SecurityUtils.sanitizeHTML(question.description || '')}</div>` : ''}
        <p class="selection-limit">Select all that apply${maxSelections < question.options.length ? ` (up to ${maxSelections})` : ''}</p>
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
        <div class="selection-count" id="selectionCount_${question.id}">Selected: ${currentAnswer.length}${maxSelections < question.options.length ? ` / ${maxSelections}` : ''}</div>
      </div>
    `;
  }

  renderPhase2Prioritization(question, currentAnswer, maxSelections) {
    // Show Phase 1 results summary
    const highVectors = Object.keys(this.vectorScores).filter(key => 
      this.vectorScores[key].state === 'high'
    ).map(key => MANIPULATION_VECTORS[key].name);
    const mediumVectors = Object.keys(this.vectorScores).filter(key => 
      this.vectorScores[key].state === 'medium'
    ).map(key => MANIPULATION_VECTORS[key].name);
    
    let html = `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <div class="warning-box">
          <h4>Your Vector Screening Summary</h4>
          ${highVectors.length > 0 ? `<p><strong>High concern:</strong> ${highVectors.map(v => SecurityUtils.sanitizeHTML(v || '')).join(', ')}</p>` : ''}
          ${mediumVectors.length > 0 ? `<p><strong>Moderate concern:</strong> ${mediumVectors.map(v => SecurityUtils.sanitizeHTML(v || '')).join(', ')}</p>` : ''}
          <p>Based on this screening, select 2-3 manipulation vectors you'd like to explore in depth.</p>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <p class="selection-limit">Select up to ${maxSelections}</p>
        <div class="multiselect-options">
    `;
    
    question.options.forEach((option, index) => {
      const isSelected = currentAnswer.some(ans => ans.text === option.text);
      const vector = MANIPULATION_VECTORS[option.mapsTo.vector];
      
      html += `
        <label class="multiselect-option ${isSelected ? 'selected' : ''}">
          <input 
            type="checkbox" 
            name="question_${question.id}" 
            value="${index}"
            data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
            ${isSelected ? 'checked' : ''}
          />
          <div class="multiselect-content">
            <div class="multiselect-title vector-title">${SecurityUtils.sanitizeHTML(vector.name || '')}</div>
            <div class="multiselect-description">${SecurityUtils.sanitizeHTML(vector.description || '')}</div>
          </div>
        </label>
      `;
    });
    
    html += `
        </div>
        <div class="selection-count" id="selectionCount_${question.id}">Selected: ${currentAnswer.length} / ${maxSelections}</div>
      </div>
    `;
    
    return html;
  }

  attachQuestionListeners(question) {
    if (question.type === 'three_point' || question.type === 'binary_unsure' || question.type === 'frequency') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const optionData = JSON.parse(e.target.dataset.optionData);
          this.answers[question.id] = optionData;
          
          // Update visual selection
          document.querySelectorAll(`.three-point-option, .binary-unsure-option, .frequency-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          e.target.closest('label').classList.add('selected');
          
          // Process conditional logic for Phase 3
          if (this.currentPhase === 3) {
            this.processPhase3Answer(question);
          }
          
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
            const maxText = maxSelections < question.options.length ? ` / ${maxSelections}` : '';
            selectionCount.textContent = `Selected: ${selected.length}${maxText}`;
          }
          
          // Process conditional logic for Phase 3 multi-select questions
          if (this.currentPhase === 3) {
            this.processPhase3Answer(question);
          }
          
          this.saveProgress();
        });
      });
    }
  }

  getPhaseLabel(phase) {
    const labels = {
      1: 'Vector Screening',
      2: 'Vector Prioritization',
      3: 'Deep Assessment'
    };
    return labels[phase] || `Phase ${phase}`;
  }

  getPhaseLabelPlain(phase) {
    const labels = {
      'Ingress': 'Entry Phase - Happens early in the relationship to draw you in',
      'Entrench': 'Control Phase - Happens once they have you, to keep you trapped',
      'Extract': 'Harvest Phase - Happens when they\'re taking what they want from you'
    };
    return labels[phase] || phase || 'Unknown phase';
  }

  getModeLabelPlain(mode) {
    const labels = {
      'Covert': 'Hidden/Subtle - Hard to notice, sneaky manipulation',
      'Overt': 'Open/Obvious - Direct and clear manipulation',
      'Contextual': 'Depends on situation - Changes based on what works',
      'Overt and Covert': 'Both hidden and open - Uses whatever works in the moment'
    };
    return labels[mode] || mode || 'Unknown mode';
  }

  getActivationLevelLabel(level) {
    const labels = {
      'high': 'High - This manipulation is very active and strong',
      'medium': 'Medium - This manipulation is moderately present',
      'low': 'Low - This manipulation is present but weak'
    };
    return labels[level] || level || 'Unknown';
  }

  getStructuralModifierLabel(modifier) {
    const labels = {
      'structural': 'Structural - This is a deep, ongoing pattern that affects your whole life',
      'situational': 'Situational - This happens in specific situations but isn\'t constant',
      'mixed': 'Mixed - This shows up both as ongoing patterns and in specific situations'
    };
    return labels[modifier] || modifier || 'Unknown';
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
    // Estimate total questions
    let total = 0;
    if (this.currentPhase >= 1) {
      total += PHASE_1_VECTOR_SCREENING.length; // Phase 1: 7 questions
    }
    if (this.currentPhase >= 2) {
      total += 1; // Phase 2: 1 prioritization question
    }
    if (this.currentPhase >= 3) {
      total += this.prioritizedVectors.length * 6; // Estimate 6 questions per vector
    }
    return total;
  }

  getCurrentQuestionNumber() {
    let current = 0;
    if (this.currentPhase > 1) {
      current += PHASE_1_VECTOR_SCREENING.length; // Phase 1
    }
    if (this.currentPhase > 2) {
      current += 1; // Phase 2
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

  /**
   * Move to next question
   * @returns {Promise<void>}
   */
  async nextQuestion() {
    // Check if current question has been answered
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (currentQuestion && !this.answers[currentQuestion.id]) {
      ErrorHandler.showUserError('Please select an answer before proceeding.');
      return;
    }
    
    this.saveCurrentAnswer();
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      await this.completePhase();
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
        this.analyzePhase1Results();
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

  /**
   * Complete current phase and proceed to next
   * @returns {Promise<void>}
   */
  async completePhase() {
    try {
      if (this.currentPhase === 1) {
        await this.analyzePhase1Results();
        if (this.questionSequence.length > 0) {
          this.renderCurrentQuestion(); // Start Phase 2
        } else {
          this.completeAssessment();
        }
      } else if (this.currentPhase === 2) {
        await this.processPhase2Results();
        if (this.questionSequence.length > 0) {
          this.renderCurrentQuestion(); // Start Phase 3
        } else {
          this.completeAssessment();
        }
      } else if (this.currentPhase === 3) {
        this.processPhase3Results();
        this.completeAssessment();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'completePhase');
      ErrorHandler.showUserError('Failed to complete phase. Please try again.');
    }
  }

  processPhase3Results() {
    // Calculate vector scores from Phase 3 answers
    this.analysisData.phase3Results = {};
    this.assessedVectors = [...this.prioritizedVectors];
    
    this.prioritizedVectors.forEach(vectorId => {
      const vectorAnswers = Object.keys(this.answers)
        .filter(key => key.startsWith(`p3_${vectorId}`))
        .map(key => this.answers[key]);
      
      // Calculate scores for symptoms, effects, consequences
      const symptomAnswers = vectorAnswers.filter(a => a && a.mapsTo && a.mapsTo.category === 'symptoms');
      const effectAnswers = vectorAnswers.filter(a => a && a.mapsTo && a.mapsTo.category === 'effects');
      const consequenceAnswers = vectorAnswers.filter(a => a && a.mapsTo && a.mapsTo.category === 'consequences');
      
      // Calculate frequency scores
      const getFrequencyScore = (answers) => {
        if (answers.length === 0) return 0;
        const total = answers.reduce((sum, a) => {
          const freq = a.mapsTo && a.mapsTo.frequency;
          const weight = a.mapsTo && a.mapsTo.weight ? a.mapsTo.weight : 0;
          return sum + weight;
        }, 0);
        return answers.length > 0 ? total / answers.length : 0;
      };
      
      this.analysisData.phase3Results[vectorId] = {
        vector: MANIPULATION_VECTORS[vectorId],
        symptoms: {
          present: symptomAnswers.some(a => a.mapsTo && a.mapsTo.flow === 'present'),
          score: getFrequencyScore(symptomAnswers.filter(a => a.mapsTo && a.mapsTo.frequency))
        },
        effects: {
          present: effectAnswers.some(a => a.mapsTo && a.mapsTo.flow === 'present'),
          score: getFrequencyScore(effectAnswers.filter(a => a.mapsTo && a.mapsTo.frequency))
        },
        consequences: {
          present: consequenceAnswers.some(a => a.mapsTo && a.mapsTo.flow === 'present'),
          score: getFrequencyScore(consequenceAnswers.filter(a => a.mapsTo && a.mapsTo.frequency))
        },
        answers: vectorAnswers
      };
    });
  }

  completeAssessment() {
    // Calculate final results
    this.calculateResults();
    
    // Include all raw answers and question sequence
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.getAllQuestionsAnswered();
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  getAllQuestionsAnswered() {
    const allQuestions = [];
    
    // Phase 1
    PHASE_1_VECTOR_SCREENING.forEach(q => {
      allQuestions.push({
        id: q.id,
        question: q.question,
        phase: 1,
        answer: this.answers[q.id]
      });
    });
    
    // Phase 2 & 3 would be added similarly
    // (Simplified for now - would need to track all questions asked)
    
    return allQuestions;
  }

  calculateResults() {
    // Calculate vector scores from Phase 3 results
    this.analysisData.vectorScores = {};
    
    Object.keys(this.analysisData.phase3Results || {}).forEach(vectorId => {
      const result = this.analysisData.phase3Results[vectorId];
      const vector = MANIPULATION_VECTORS[vectorId];
      
      // Calculate overall score
      const symptomScore = result.symptoms.present ? result.symptoms.score : 0;
      const effectScore = result.effects.present ? result.effects.score : 0;
      const consequenceScore = result.consequences.present ? result.consequences.score : 0;
      
      const avgScore = (symptomScore + effectScore + consequenceScore) / 3;
      const weightedScore = avgScore * vector.weight;
      
      this.analysisData.vectorScores[vectorId] = {
        name: vector.name,
        description: vector.description,
        rawScore: avgScore,
        weightedScore: weightedScore,
        symptoms: result.symptoms,
        effects: result.effects,
        consequences: result.consequences,
        activationLevel: weightedScore >= 6 ? 'high' : weightedScore >= 3 ? 'medium' : 'low'
      };
    });
    
    // Identify primary vector
    const allVectors = Object.entries(this.analysisData.vectorScores)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.weightedScore - a.weightedScore);
    
    if (allVectors.length > 0) {
      this.analysisData.primaryVector = allVectors[0];
      this.analysisData.supportingVectors = allVectors.slice(1);
      this.analysisData.identifiedVectors = allVectors;
    }
    
    // Determine structural modifier
    this.determineStructuralModifier();
    
    // Find relevant tactics
    this.identifyTactics();
  }

  determineStructuralModifier() {
    if (!this.analysisData.primaryVector) return;
    
    const primary = this.analysisData.primaryVector;
    const avgConsequence = primary.consequences ? primary.consequences.score : 0;
    const avgEffect = primary.effects ? primary.effects.score : 0;
    const avgSymptom = primary.symptoms ? primary.symptoms.score : 0;
    
    // High consequences + high effects = structural
    // High symptoms + low consequences = situational
    if (avgConsequence >= 6 && avgEffect >= 6) {
      this.analysisData.structuralModifier = 'structural';
    } else if (avgSymptom >= 6 && avgConsequence < 5) {
      this.analysisData.structuralModifier = 'situational';
    } else {
      this.analysisData.structuralModifier = 'mixed';
    }
  }

  identifyTactics() {
    this.analysisData.tactics = [];
    
    if (this.analysisData.primaryVector) {
      const vector = MANIPULATION_VECTORS[this.analysisData.primaryVector.key];
      if (vector && vector.tactics) {
        vector.tactics.forEach(tacticId => {
          const tactic = MANIPULATION_TACTICS[tacticId];
          if (tactic) {
            this.analysisData.tactics.push(tactic);
          }
        });
      }
    }
  }

  /**
   * Render assessment results
   */
  async renderResults() {
    const container = document.getElementById('vectorResults');
    if (!container) {
      ErrorHandler.showUserError('Results container not found.');
      return;
    }
    
    try {
      await this.loadManipulationData(); // Ensure data is loaded
      
      let html = '<div class="manipulation-summary">';
      html += '<h3>Manipulation Vector Analysis Results</h3>';
      html += '<p>Based on your responses, here are the manipulation vectors identified and recommended strategies.</p>';
      html += '</div>';
      
      // Primary vector
      if (this.analysisData.primaryVector) {
        const primary = this.analysisData.primaryVector;
        const primaryName = SecurityUtils.sanitizeHTML(primary.name || 'Unknown');
        const primaryDesc = SecurityUtils.sanitizeHTML(primary.description || '');
        html += `
          <div class="vector-result warning-box">
            <h3>Primary Vector: ${primaryName}</h3>
            <p>${primaryDesc}</p>
            <p><strong>Activation Level:</strong> ${this.getActivationLevelLabel(primary.activationLevel)}</p>
            <p><strong>Score:</strong> ${primary.rawScore.toFixed(1)}/10 (Weighted: ${primary.weightedScore.toFixed(1)})</p>
            ${this.analysisData.structuralModifier ? `<p><strong>Pattern Type:</strong> ${this.getStructuralModifierLabel(this.analysisData.structuralModifier)}</p>` : ''}
          </div>
        `;
      }
      
      // Supporting vectors
      if (this.analysisData.supportingVectors && this.analysisData.supportingVectors.length > 0) {
        html += '<div class="supporting-vectors">';
        html += '<h4>Supporting Vectors</h4>';
        this.analysisData.supportingVectors.forEach(vector => {
          const vecName = SecurityUtils.sanitizeHTML(vector.name || 'Unknown');
          const vecDesc = SecurityUtils.sanitizeHTML(vector.description || '');
          html += `
            <div class="vector-result" style="background: var(--glass); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
              <h4>${vecName}</h4>
              <p style="font-size: 0.9rem; color: var(--muted);">${vecDesc}</p>
              <p><strong>Score:</strong> ${vector.rawScore.toFixed(1)}/10</p>
            </div>
          `;
        });
        html += '</div>';
      }
    
    // Tactics
    if (this.analysisData.tactics && this.analysisData.tactics.length > 0) {
      html += '<div class="tactics-section">';
      html += '<h4>Identified Tactics</h4>';
      html += '<p class="content-section">These are specific manipulation tactics that may be present in your relationship. Each tactic includes examples and explanations in plain language.</p>';
      this.analysisData.tactics.forEach(tactic => {
        const phaseLabel = this.getPhaseLabelPlain(tactic.phase);
        const modeLabel = this.getModeLabelPlain(tactic.mode);
        html += `
          <div class="tactic-item">
            <h5>${SecurityUtils.sanitizeHTML(tactic.name || '')}</h5>
            ${tactic.phase || tactic.mode ? `
              <div class="tactic-context">
                ${tactic.mode ? `<strong>How it works:</strong> ${SecurityUtils.sanitizeHTML(modeLabel || '')}` : ''}
                ${tactic.phase && tactic.mode ? ' • ' : ''}
                ${tactic.phase ? `<strong>When it happens:</strong> ${SecurityUtils.sanitizeHTML(phaseLabel || '')}` : ''}
              </div>
            ` : ''}
            ${tactic.example ? `
              <div class="tactic-example">
                <strong>Example:</strong>
                <p>"${SecurityUtils.sanitizeHTML(tactic.example || '')}"</p>
              </div>
            ` : ''}
            ${tactic.mechanism ? `
              <div class="tactic-detail">
                <strong>What it does:</strong>
                <p>${SecurityUtils.sanitizeHTML(tactic.mechanism || '')}</p>
              </div>
            ` : ''}
            ${tactic.leverage ? `
              <div class="tactic-detail">
                <strong>How it controls you:</strong>
                <p>${SecurityUtils.sanitizeHTML(tactic.leverage || '')}</p>
              </div>
            ` : ''}
          </div>
        `;
      });
      html += '</div>';
    }
    
    // Sanitize results HTML before rendering - all dynamic content is already sanitized above
    SecurityUtils.safeInnerHTML(container, html);
    } catch (error) {
      this.debugReporter.logError(error, 'renderResults');
      ErrorHandler.showUserError('Failed to render results. Please refresh the page.');
    }
  }

  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'manipulation', 'Manipulation Vector Identification');
      downloadFile(csv, `manipulation-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'manipulation', 'Manipulation Vector Identification');
      downloadFile(json, `manipulation-analysis-${Date.now()}.json`, 'application/json');
    }
  }

  exportExecutiveBrief() {
    const brief = exportExecutiveBrief(this.analysisData, 'manipulation', 'Manipulation Defense Decoder');
    downloadFile(brief, `manipulation-executive-brief-${Date.now()}.txt`, 'text/plain');
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
        vectorScores: this.vectorScores,
        prioritizedVectors: this.prioritizedVectors,
        assessedVectors: this.assessedVectors,
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
      this.vectorScores = data.vectorScores || {};
      this.prioritizedVectors = data.prioritizedVectors || [];
      this.assessedVectors = data.assessedVectors || [];
      this.analysisData = data.analysisData || this.analysisData;
      
      // Restore questionnaire state
      if (this.currentQuestionIndex > 0 || this.currentPhase > 1) {
        if (this.currentPhase === 1) {
          await this.buildPhase1Sequence();
        } else if (this.currentPhase === 2) {
          await this.analyzePhase1Results();
          await this.buildPhase2Sequence();
        } else if (this.currentPhase === 3) {
          await this.processPhase2Results();
          await this.buildPhase3Sequence();
        }
        document.getElementById('questionnaireSection').classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (e) {
      console.error('Error loading stored data:', e);
    }
  }

  clearAllCachedData() {
    sessionStorage.removeItem('manipulationProgress');
    this.resetAssessment();
    alert('All cached data for Manipulation Analysis has been cleared.');
  }

  resetAssessment() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.vectorScores = {};
    this.prioritizedVectors = [];
    this.assessedVectors = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      vectorScores: {},
      identifiedVectors: [],
      primaryVector: null,
      supportingVectors: [],
      tactics: [],
      structuralModifier: null,
      allAnswers: {},
      questionSequence: []
    };
    
    sessionStorage.removeItem('manipulationProgress');
    
    // Reset UI
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.buildPhase1Sequence();
  }
}
