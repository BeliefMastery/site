// Needs Dependency Loop Determinator Engine - Version 2.1
// 4-Phase Questionnaire Architecture
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportExecutiveBrief, exportJSON, downloadFile } from './shared/export-utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { showConfirm } from './shared/confirm-modal.js';

// Data modules - will be loaded lazily
let NEEDS_VOCABULARY, VICES_VOCABULARY;
let DEPENDENCY_LOOPS, LOOP_GROUPS, PHASE_0_QUESTIONS, PHASE_1_QUESTIONS, PHASE_2_QUESTIONS, PHASE_3_QUESTIONS, PHASE_4_QUESTIONS;
let PATTERN_NEEDS_MAPPING, NEED_COMPULSION_AVERSION_MAPPING, VICE_NEEDS_MAPPING;
let PATTERNS_COMPENDIUM, NEEDS_GLOSSARY, VICES_GLOSSARY;
let getLoopActionsForNeed, getRootActionsForNeed;

/**
 * Needs Dependency Engine - Identifies dependency loops through 4-phase assessment
 */
export class NeedsDependencyEngine {
  /**
   * Initialize the needs dependency engine
   */
  constructor() {
    this.currentPhase = 0;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.identifiedLoops = []; // Top 3 loops from Phase 1
    this.activeFamilyLoops = []; // Loops scoped by Phase 0 gateway
    this.needChain = []; // For Phase 3
    this.surfaceNeed = null;
    this.surfaceNeedCategoryKey = null;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      identifiedLoops: [],
      primaryLoop: null,
      secondaryLoops: [],
      loopScores: {},
      recommendations: [],
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('NeedsDependencyEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('needs-dependency-assessment', '1.0.0');

    this.ui = new EngineUIController({
      idle: {
        show: ['#introSection', '#actionButtonsSection'],
        hide: ['#questionnaireSection', '#resultsSection']
      },
      assessment: {
        show: ['#questionnaireSection'],
        hide: ['#introSection', '#actionButtonsSection', '#resultsSection']
      },
      results: {
        show: ['#resultsSection'],
        hide: ['#introSection', '#actionButtonsSection', '#questionnaireSection']
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
   * Load needs dependency data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadNeedsDependencyData() {
    if (PHASE_1_QUESTIONS && DEPENDENCY_LOOPS) {
      return; // Already loaded
    }

    try {
      // Load dependency loop questions data
      const loopQuestionsModule = await loadDataModule(
        './needs-dependency-data/dependency-loop-questions.js',
        'Dependency Loop Questions'
      );
      DEPENDENCY_LOOPS = loopQuestionsModule.DEPENDENCY_LOOPS;
      LOOP_GROUPS = loopQuestionsModule.LOOP_GROUPS;
      PHASE_0_QUESTIONS = loopQuestionsModule.PHASE_0_QUESTIONS;
      PHASE_1_QUESTIONS = loopQuestionsModule.PHASE_1_QUESTIONS;
      PHASE_2_QUESTIONS = loopQuestionsModule.PHASE_2_QUESTIONS;
      PHASE_3_QUESTIONS = loopQuestionsModule.PHASE_3_QUESTIONS;
      PHASE_4_QUESTIONS = loopQuestionsModule.PHASE_4_QUESTIONS;

      // Load needs vocabulary data
      const needsVocabModule = await loadDataModule(
        './needs-dependency-data/needs-vocabulary.js',
        'Needs Vocabulary'
      );
      NEEDS_VOCABULARY = needsVocabModule.NEEDS_VOCABULARY;

      // Load vices vocabulary data
      const vicesVocabModule = await loadDataModule(
        './needs-dependency-data/vices-vocabulary.js',
        'Vices Vocabulary'
      );
      VICES_VOCABULARY = vicesVocabModule.VICES_VOCABULARY;

      // Load mapping data
      const patternNeedsModule = await loadDataModule(
        './needs-dependency-data/pattern-needs-mapping.js',
        'Pattern Needs Mapping'
      );
      PATTERN_NEEDS_MAPPING = patternNeedsModule.PATTERN_NEEDS_MAPPING;

      const needCompulsionModule = await loadDataModule(
        './needs-dependency-data/need-compulsion-aversion-mapping.js',
        'Need Compulsion Aversion Mapping'
      );
      NEED_COMPULSION_AVERSION_MAPPING = needCompulsionModule.NEED_COMPULSION_AVERSION_MAPPING;

      const viceNeedsModule = await loadDataModule(
        './needs-dependency-data/vice-needs-mapping.js',
        'Vice Needs Mapping'
      );
      VICE_NEEDS_MAPPING = viceNeedsModule.VICE_NEEDS_MAPPING;

      // Load compendium/glossary data
      const patternsModule = await loadDataModule(
        './needs-dependency-data/patterns-compendium.js',
        'Patterns Compendium'
      );
      PATTERNS_COMPENDIUM = patternsModule.PATTERNS_COMPENDIUM;

      const needsGlossaryModule = await loadDataModule(
        './needs-dependency-data/needs-glossary.js',
        'Needs Glossary'
      );
      NEEDS_GLOSSARY = needsGlossaryModule.NEEDS_GLOSSARY;

      const vicesGlossaryModule = await loadDataModule(
        './needs-dependency-data/vices-glossary.js',
        'Vices Glossary'
      );
      VICES_GLOSSARY = vicesGlossaryModule.VICES_GLOSSARY;

      const needActionsModule = await loadDataModule(
        './needs-dependency-data/need-actions.js',
        'Need Actions'
      );
      getLoopActionsForNeed = needActionsModule.getLoopActionsForNeed;
      getRootActionsForNeed = needActionsModule.getRootActionsForNeed;

      this.debugReporter.recordSection('Phase 1', PHASE_1_QUESTIONS?.length || 0);
    } catch (error) {
      this.debugReporter.logError(error, 'loadNeedsDependencyData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  /**
   * Build Phase 0 + Phase 1 question sequence.
   * Phase 0 is the category gate (2 questions). After it completes,
   * processPhase0Results() scopes activeFamilyLoops before Phase 1 scoring.
   */
  async buildPhase1Sequence() {
    await this.loadNeedsDependencyData();

    try {
      // Prepend Phase 0 gateway questions followed by Phase 1 symptom questions
      this.questionSequence = [...PHASE_0_QUESTIONS, ...PHASE_1_QUESTIONS];
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase1Sequence');
      ErrorHandler.showUserError('Failed to build Phase 1 sequence. Please refresh the page.');
    }
  }

  /**
   * Resolve the active family loops from Phase 0 gateway answers.
   * Merges families from both gateway questions, deduplicates, and stores
   * the result in this.activeFamilyLoops for Phase 1 scoring.
   */
  processPhase0Results() {
    const activeFamilies = new Set();

    if (PHASE_0_QUESTIONS) {
      PHASE_0_QUESTIONS.forEach(question => {
        const answer = this.answers[question.id];
        if (answer && answer.mapsTo && Array.isArray(answer.mapsTo.families)) {
          answer.mapsTo.families.forEach(f => activeFamilies.add(f));
        }
      });
    }

    // Collect loops for all active families; fall back to all loops if gate unanswered
    if (activeFamilies.size > 0 && LOOP_GROUPS) {
      const loops = [];
      activeFamilies.forEach(family => {
        if (LOOP_GROUPS[family]) loops.push(...LOOP_GROUPS[family]);
      });
      this.activeFamilyLoops = [...new Set(loops)];
    } else {
      this.activeFamilyLoops = [...DEPENDENCY_LOOPS];
    }
  }

  /**
   * Analyze Phase 1 results and proceed to Phase 2
   * @returns {Promise<void>}
   */
  async analyzePhase1Results() {
    await this.loadNeedsDependencyData();

    try {
      // Resolve active family loops from Phase 0 gateway answers
      this.processPhase0Results();

      const loopScores = {};
      const viceProfile = [];
      const triggerSensitivity = [];

      // Initialise scores only for loops in the active family scope
      this.activeFamilyLoops.forEach(loop => {
        loopScores[loop] = {
          compulsionIndex: 0,
          aversionIndex: 0,
          viceAlignment: 0,
          triggerMatch: 0,
          historicalPattern: false,
          totalScore: 0
        };
      });

      // Generalised metadata-driven scoring — no hardcoded question IDs.
      // Each question declares scoringWeight; mapsTo.sourcing / mapsTo.loops drive scoring.
      // Adding a new Phase 0 or Phase 1 question requires no engine changes.
      PHASE_1_QUESTIONS.forEach(question => {
        const answer = this.answers[question.id];
        if (!answer) return;

        const weight = question.scoringWeight ?? 2;

        // Single-select scenario / scaled questions
        if (!Array.isArray(answer) && answer.mapsTo) {
          const loops = answer.mapsTo.loops || [];
          const sourcing = answer.mapsTo.sourcing;

          loops.forEach(loop => {
            if (!loopScores[loop]) return; // only score active-family loops
            if (sourcing === 'compulsive') {
              loopScores[loop].compulsionIndex += weight;
            } else if (sourcing === 'avoidant') {
              loopScores[loop].aversionIndex += weight;
            } else {
              loopScores[loop].compulsionIndex += weight;
            }
          });

          // Trigger sensitivity
          if (answer.mapsTo.triggers) {
            triggerSensitivity.push(...answer.mapsTo.triggers);
            loops.forEach(loop => {
              if (loopScores[loop]) loopScores[loop].triggerMatch += weight;
            });
          }
        }

        // Multiselect questions (vice states)
        if (Array.isArray(answer)) {
          answer.forEach(selected => {
            if (!selected.mapsTo) return;
            if (selected.mapsTo.vices) viceProfile.push(...selected.mapsTo.vices);
            (selected.mapsTo.loops || []).forEach(loop => {
              if (loopScores[loop]) loopScores[loop].viceAlignment += weight;
            });
          });
        }
      });

      // Calculate total scores
      Object.keys(loopScores).forEach(loop => {
        const score = loopScores[loop];
        score.totalScore = (
          score.compulsionIndex * 0.25 +
          score.aversionIndex * 0.25 +
          score.viceAlignment * 0.25 +
          score.triggerMatch * 0.25
        );
      });

      // Identify top 3 loops
      const sortedLoops = Object.entries(loopScores)
        .sort((a, b) => b[1].totalScore - a[1].totalScore)
        .slice(0, 3);

      this.identifiedLoops = sortedLoops.map(([loop, scores]) => ({
        loop,
        scores,
        confidence: scores.totalScore >= 6 ? 'high' : scores.totalScore >= 4 ? 'medium' : 'low'
      }));

      this.analysisData.phase1Results = {
        loopScores,
        viceProfile,
        triggerSensitivity,
        topLoops: this.identifiedLoops
      };

      // Build Phase 2 sequence based on identified loops
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
    await this.loadNeedsDependencyData();
    
    try {
      this.questionSequence = [];
      
      // Add questions for each identified loop (up to 3 loops)
      this.identifiedLoops.forEach(({ loop }) => {
        if (PHASE_2_QUESTIONS[loop]) {
          this.questionSequence.push(...PHASE_2_QUESTIONS[loop]);
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
    await this.loadNeedsDependencyData();
    
    try {
      // Phase 3 uses the primary loop identified from Phase 2
      const primaryLoop = this.analysisData.primaryLoop || this.identifiedLoops[0]?.loop;
      
      if (!primaryLoop) {
        // Skip to Phase 4 if no primary loop
        await this.buildPhase4Sequence();
        return;
      }
      
      // Build dynamic need chain questions
      this.questionSequence = [];
      const surfaceNeed = this.getSurfaceNeedForLoop(primaryLoop);
      this.surfaceNeed = surfaceNeed;
      this.surfaceNeedCategoryKey = this.getNeedCategoryKey(surfaceNeed);
      
      PHASE_3_QUESTIONS.forEach((question, index) => {
        if (question.dynamic) {
          const dynamicQuestion = { ...question };
          if (index === 0) {
            dynamicQuestion.question = dynamicQuestion.question.replace('[SURFACE_NEED]', surfaceNeed);
          } else {
            // Will be populated dynamically based on previous answer
            dynamicQuestion.question = dynamicQuestion.question.replace('[DEEPER_NEED]', 'this need');
          }
          this.questionSequence.push(dynamicQuestion);
        } else {
          this.questionSequence.push(question);
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
   * Build Phase 4 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase4Sequence() {
    await this.loadNeedsDependencyData();
    
    try {
      this.questionSequence = [...PHASE_4_QUESTIONS];
      this.currentPhase = 4;
      this.currentQuestionIndex = 0;
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase4Sequence');
      ErrorHandler.showUserError('Failed to load Phase 4. Please refresh the page.');
    }
  }

  getSurfaceNeedForLoop(loop) {
    const loopNeedMap = {
      // Original 16
      'SPACE': 'space',
      'JOY': 'joy',
      'BEING WANTED': 'being wanted',
      'EQUALITY': 'equality',
      'TO SEE AND BE SEEN': 'to see and be seen',
      'EASE': 'ease',
      'SECURITY': 'security',
      'BELONGING': 'belonging',
      'CONSIDERATION': 'consideration',
      'FLOW': 'flow',
      'MOURNING': 'mourning',
      'APPROVAL': 'approval',
      'REST': 'rest',
      'CONTRIBUTION': 'contribution',
      'INDEPENDENCE': 'independence',
      'STIMULATION/ADVENTURE': 'stimulation',
      // Connection additions
      'ACCEPTANCE': 'acceptance',
      'INTIMACY': 'intimacy',
      'TRUST': 'trust',
      'LOVE': 'love',
      'WARMTH': 'warmth',
      'CLOSENESS': 'closeness',
      // Physical additions
      'SAFETY': 'safety',
      'TOUCH': 'touch',
      'MOVEMENT': 'movement',
      // Honesty additions
      'AUTHENTICITY': 'authenticity',
      'PRESENCE': 'presence',
      // Peace additions
      'ORDER': 'order',
      'HARMONY': 'harmony',
      // Autonomy additions
      'FREEDOM': 'freedom',
      'SPONTANEITY': 'spontaneity',
      // Meaning additions
      'PURPOSE': 'purpose',
      'SELF-EXPRESSION': 'self-expression',
      'TO MATTER': 'to matter',
      'CLARITY': 'clarity',
      'GROWTH': 'growth',
      'CREATIVITY': 'creativity'
    };
    return loopNeedMap[loop] || 'this need';
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

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => this.generateSampleReport());
    }
    
    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => this.abandonAssessment());
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
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      identifiedLoops: [],
      primaryLoop: null,
      secondaryLoops: [],
      loopScores: {},
      recommendations: [],
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
    if (question.type === 'scaled') {
      const scale = question.scale || { min: 1, max: 7 };
      const value = Math.floor(Math.random() * (scale.max - scale.min + 1)) + scale.min;
      this.answers[question.id] = value;
      return;
    }
    if (question.type === 'scenario') {
      if (!Array.isArray(question.options) || question.options.length === 0) return;
      const option = question.options[Math.floor(Math.random() * question.options.length)];
      this.answers[question.id] = option;
      return;
    }
    if (question.type === 'need_chain') {
      const options = this.getNeedChainOptions(question);
      if (!options.length) return;
      const option = options[Math.floor(Math.random() * options.length)];
      this.answers[question.id] = option;
      return;
    }
    if (question.type === 'multiselect') {
      if (!Array.isArray(question.options) || question.options.length === 0) return;
      const maxSelections = question.maxSelections || 3;
      const count = Math.min(question.options.length, Math.max(1, Math.ceil(Math.random() * maxSelections)));
      const selected = this.pickRandomIndices(question.options.length, count).map(idx => question.options[idx]);
      this.answers[question.id] = selected;
    }
  }

  async generateSampleReport() {
    try {
      await this.loadNeedsDependencyData();
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.questionSequence = [];
      this.identifiedLoops = [];
      this.needChain = [];
      this.surfaceNeed = null;
      this.surfaceNeedCategoryKey = null;
      this.analysisData = this.getEmptyAnalysisData();

      await this.buildPhase1Sequence();
      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      await this.analyzePhase1Results();

      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      await this.analyzePhase2Results();

      if (this.currentPhase === 3 && this.questionSequence.length > 0) {
        this.questionSequence.forEach(q => this.answerQuestionForSample(q));
        this.analyzePhase3Results();
      }

      if (this.currentPhase !== 4) {
        await this.buildPhase4Sequence();
      }
      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      this.analyzePhase4Results();

      await this.completeAssessment();
    } catch (error) {
      this.debugReporter.logError(error, 'generateSampleReport');
      ErrorHandler.showUserError('Failed to generate sample report. Please try again.');
    }
  }

  async abandonAssessment() {
    if (await showConfirm('Are you sure you want to abandon this assessment? All progress will be lost and you will need to start from the beginning.')) {
      this.resetAssessment();
    }
  }

  /**
   * Start the assessment
   * @returns {Promise<void>}
   */
  async startAssessment() {
    try {
      await this.buildPhase1Sequence();
      
      const introSection = document.getElementById('introSection');
      const actionButtonsSection = document.getElementById('actionButtonsSection');
      const questionnaireSection = document.getElementById('questionnaireSection');
      if (introSection) introSection.classList.add('hidden');
      if (actionButtonsSection) actionButtonsSection.classList.add('hidden');
      this.ui.transition('assessment');
      
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'startAssessment');
      ErrorHandler.showUserError('Failed to start assessment. Please try again.');
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
      if (question.type === 'scaled') {
        html = this.renderScaledQuestion(question);
      } else if (question.type === 'scenario') {
        html = this.renderScenarioQuestion(question);
      } else if (question.type === 'multiselect') {
        html = this.renderMultiselectQuestion(question);
      } else if (question.type === 'need_chain') {
        html = this.renderNeedChainQuestion(question);
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
        <div class="selection-count" id="selectionCount">Selected: ${currentAnswer.length} / ${maxSelections}</div>
      </div>
    `;
  }

  getNeedChainOptions(question) {
    const depth = question.mapsTo?.depth;
    const previousAnswer = depth && depth > 1
      ? this.answers[`p3_need_chain_${depth - 1}`]
      : null;
    const currentNeed = (depth && depth > 1 ? previousAnswer?.mapsTo?.need : this.surfaceNeed) || null;
    const normalizedCurrent = currentNeed ? String(currentNeed).toLowerCase().trim() : null;
    const selectedNeeds = Object.keys(this.answers)
      .filter(key => key.startsWith('p3_need_chain_'))
      .map(key => this.answers[key]?.mapsTo?.need || this.answers[key]?.text || this.answers[key]?.need)
      .filter(Boolean)
      .map(need => String(need).toLowerCase().trim());

    const filterNeeds = (needs) => needs.filter(need => {
      const normalized = String(need).toLowerCase().trim();
      if (normalizedCurrent && normalized === normalizedCurrent) return false;
      if (selectedNeeds.includes(normalized)) return false;
      return true;
    });

    if (Array.isArray(question.options) && question.options.length) {
      return question.options.filter(option => {
        if (!normalizedCurrent) return true;
        return String(option.text || '').toLowerCase().trim() !== normalizedCurrent;
      });
    }

    let optionNeeds = [];

    if (depth && depth > 1 && previousAnswer?.mapsTo?.deeper?.length) {
      optionNeeds = previousAnswer.mapsTo.deeper;
    }

    if (!optionNeeds.length) {
      optionNeeds = this.getCategoryNeeds(currentNeed);
    }

    optionNeeds = filterNeeds(optionNeeds);

    if (!optionNeeds.length && NEEDS_VOCABULARY) {
      optionNeeds = filterNeeds(Object.values(NEEDS_VOCABULARY).flatMap(category => category.needs || []));
    }

    const uniqueNeeds = Array.from(new Set(optionNeeds));
    return uniqueNeeds.map(need => ({
      text: need,
      mapsTo: { need, deeper: [] }
    }));
  }

  getNeedCategoryKey(needText) {
    if (!NEEDS_VOCABULARY || !needText) {
      return null;
    }

    const normalizedNeed = String(needText).toLowerCase();
    const entry = Object.entries(NEEDS_VOCABULARY).find(([, data]) =>
      (data.needs || []).some(need => String(need).toLowerCase() === normalizedNeed)
    );

    return entry ? entry[0] : null;
  }

  getCategoryNeeds(needText) {
    const key = this.getNeedCategoryKey(needText);
    if (!key) {
      return [];
    }

    return NEEDS_VOCABULARY[key]?.needs || [];
  }

  renderNeedChainQuestion(question) {
    const currentAnswer = this.answers[question.id];
    const options = this.getNeedChainOptions(question);
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="need-chain-options">
          ${options.map((option, index) => `
            <label class="need-chain-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
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

  attachQuestionListeners(question) {
    if (question.type === 'scaled') {
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
    } else if (question.type === 'scenario' || question.type === 'need_chain') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const optionData = JSON.parse(e.target.dataset.optionData);
          this.answers[question.id] = optionData;
          
          // Update visual selection
          document.querySelectorAll(`.scenario-option, .need-chain-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          e.target.closest('label').classList.add('selected');
          
          this.saveProgress();
        });
      });
    } else if (question.type === 'multiselect') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      const maxSelections = question.maxSelections || 3;
      const selectionCount = document.getElementById('selectionCount');
      
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
          document.querySelectorAll('.multiselect-option').forEach(opt => {
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
    }
  }

  getPhaseLabel(phase) {
    const labels = {
      1: 'Initial Screening',
      2: 'Loop-Specific Deep Dive',
      3: 'Need Chain Mapping',
      4: 'Validation & Prioritization'
    };
    return labels[phase] || `Phase ${phase}`;
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
    // Estimate: Phase 1 (6) + Phase 2 (15 per loop * 3 loops = 45) + Phase 3 (5) + Phase 4 (3) = ~59
    // But we'll calculate dynamically
    let total = PHASE_1_QUESTIONS.length;
    if (this.identifiedLoops.length > 0) {
      total += this.identifiedLoops.length * 5; // 5 questions per loop in Phase 2
    }
    total += PHASE_3_QUESTIONS.length;
    total += PHASE_4_QUESTIONS.length;
    return total;
  }

  getCurrentQuestionNumber() {
    let current = 0;
    if (this.currentPhase >= 1) {
      current += PHASE_1_QUESTIONS.length;
    }
    if (this.currentPhase >= 2) {
      current += this.currentQuestionIndex;
    }
    if (this.currentPhase >= 3) {
      current += PHASE_3_QUESTIONS.length;
    }
    if (this.currentPhase >= 4) {
      current += this.currentQuestionIndex;
    }
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
    
    // Save current answer
    this.saveCurrentAnswer();
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      await this.completePhase();
    }
  }

  /**
   * Move to previous question
   * @returns {Promise<void>}
   */
  async prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else if (this.currentPhase > 1) {
      // Go back to previous phase
      this.currentPhase--;
      // Rebuild sequence for previous phase
      if (this.currentPhase === 1) {
        await this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        await this.buildPhase2Sequence();
      } else if (this.currentPhase === 3) {
        await this.buildPhase3Sequence();
      }
      this.currentQuestionIndex = this.questionSequence.length - 1;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  saveCurrentAnswer() {
    // Answer is already saved in attachQuestionListeners via saveProgress()
    // This is a placeholder for any additional processing needed
  }

  completePhase() {
    if (this.currentPhase === 1) {
      this.analyzePhase1Results();
      this.renderCurrentQuestion(); // Start Phase 2
    } else if (this.currentPhase === 2) {
      this.analyzePhase2Results();
      this.buildPhase3Sequence();
      if (this.questionSequence.length > 0) {
        this.renderCurrentQuestion(); // Start Phase 3
      } else {
        this.buildPhase4Sequence();
        this.renderCurrentQuestion(); // Start Phase 4
      }
    } else if (this.currentPhase === 3) {
      this.analyzePhase3Results();
      this.buildPhase4Sequence();
      this.renderCurrentQuestion(); // Start Phase 4
    } else if (this.currentPhase === 4) {
      this.analyzePhase4Results();
      this.completeAssessment();
    }
  }

  /**
   * Analyze Phase 2 results and proceed to Phase 3
   * @returns {Promise<void>}
   */
  async analyzePhase2Results() {
    await this.loadNeedsDependencyData();
    
    try {
    // Calculate loop scores based on Phase 2 responses
    const loopScores = {};
    
    this.identifiedLoops.forEach(({ loop }) => {
      loopScores[loop] = {
        compulsionScore: 0,
        aversionScore: 0,
        partnerConsequenceScore: 0,
        needChainDepth: 0,
        historicalPatternScore: 0,
        totalScore: 0
      };
      
      // Get Phase 2 questions for this loop
      const loopQuestions = PHASE_2_QUESTIONS[loop] || [];
      loopQuestions.forEach(q => {
        const answer = this.answers[q.id];
        if (!answer) return;
        
        if (q.mapsTo?.indicator === 'compulsive_sourcing') {
          loopScores[loop].compulsionScore += typeof answer === 'number' ? answer : 0;
        } else if (q.mapsTo?.indicator === 'avoidant_sourcing') {
          loopScores[loop].aversionScore += typeof answer === 'number' ? answer : 0;
        } else if (q.mapsTo?.indicator === 'partner_consequence') {
          loopScores[loop].partnerConsequenceScore += typeof answer === 'number' ? answer : 0;
        } else if (q.mapsTo?.indicator === 'need_chain') {
          if (answer.mapsTo) {
            loopScores[loop].needChainDepth += 1;
          }
        } else if (q.mapsTo?.indicator === 'historical_pattern') {
          loopScores[loop].historicalPatternScore += typeof answer === 'number' ? answer : 0;
        }
      });
      
      // Calculate total score (weighted average)
      loopScores[loop].totalScore = (
        loopScores[loop].compulsionScore * 0.2 +
        loopScores[loop].aversionScore * 0.2 +
        loopScores[loop].partnerConsequenceScore * 0.2 +
        loopScores[loop].needChainDepth * 2 * 0.2 +
        loopScores[loop].historicalPatternScore * 0.2
      );
    });
    
    // Identify primary loop
    const sortedLoops = Object.entries(loopScores)
      .sort((a, b) => b[1].totalScore - a[1].totalScore);
    
      this.analysisData.primaryLoop = sortedLoops[0]?.[0] || null;
      this.analysisData.secondaryLoops = sortedLoops.slice(1, 3).map(([loop]) => loop);
      this.analysisData.loopScores = loopScores;
      this.analysisData.phase2Results = loopScores;
      
      // Build Phase 3 sequence if there's a primary loop
      if (this.analysisData.primaryLoop) {
        await this.buildPhase3Sequence();
      } else {
        await this.buildPhase4Sequence();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'analyzePhase2Results');
      ErrorHandler.showUserError('Failed to analyze Phase 2 results. Please try again.');
    }
  }

  analyzePhase3Results() {
    // Map need chain from Phase 3 answers
    const needChain = [];
    PHASE_3_QUESTIONS.forEach(q => {
      const answer = this.answers[q.id];
      if (answer && answer.mapsTo) {
        needChain.push({
          need: answer.mapsTo.need,
          deeper: answer.mapsTo.deeper || []
        });
      }
    });
    
    this.needChain = needChain;
    this.analysisData.phase3Results = {
      needChain,
      isDependencyLoop: this.answers['p3_loop_vs_cascade']?.mapsTo?.patternType === 'dependency_loop'
    };
  }

  analyzePhase4Results() {
    this.analysisData.phase4Results = {
      resistanceType: this.answers['p4_resistance']?.mapsTo?.resistanceType || 'unknown',
      impactSeverity: this.answers['p4_impact_severity'] || 0,
      readiness: this.answers['p4_readiness'] || 0
    };
  }

  /**
   * Complete assessment and render results
   * @returns {Promise<void>}
   */
  async completeAssessment() {
    try {
      await this.loadNeedsDependencyData(); // Ensure all data is loaded
      
      // Generate recommendations
      this.generateRecommendations();
      
      // Include all raw answers and question sequence for export
      this.analysisData.allAnswers = { ...this.answers };
      this.analysisData.questionSequence = this.getAllQuestionsAnswered();
      
      // Hide questionnaire, show results
      const questionnaireSection = document.getElementById('questionnaireSection');
      const resultsSection = document.getElementById('resultsSection');
      this.ui.transition('results');
      
      await this.renderResults();
      this.saveProgress();
    } catch (error) {
      this.debugReporter.logError(error, 'completeAssessment');
      ErrorHandler.showUserError('Failed to complete assessment. Please try again.');
    }
  }

  /**
   * Get all questions answered across all phases
   * @returns {Array}
   */
  getAllQuestionsAnswered() {
    const allQuestions = [];
    
    // Phase 1
    if (PHASE_1_QUESTIONS) {
      PHASE_1_QUESTIONS.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          phase: 1,
          answer: this.answers[q.id]
        });
      });
    }
    
    // Phase 2
    if (PHASE_2_QUESTIONS && this.identifiedLoops) {
      this.identifiedLoops.forEach(({ loop }) => {
        const loopQuestions = PHASE_2_QUESTIONS[loop] || [];
        loopQuestions.forEach(q => {
          allQuestions.push({
            id: q.id,
            question: q.question,
            phase: 2,
            loop: loop,
            answer: this.answers[q.id]
          });
        });
      });
    }
    
    // Phase 3
    if (PHASE_3_QUESTIONS) {
      PHASE_3_QUESTIONS.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          phase: 3,
          answer: this.answers[q.id]
        });
      });
    }
    
    // Phase 4
    if (PHASE_4_QUESTIONS) {
      PHASE_4_QUESTIONS.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          phase: 4,
          answer: this.answers[q.id]
        });
      });
    }
    
    return allQuestions;
  }

  generateRecommendations() {
    const recommendations = [];
    const primaryLoop = this.analysisData.primaryLoop;
    
    if (primaryLoop) {
      recommendations.push({
        priority: 'high',
        title: `Address ${primaryLoop} Dependency Loop`,
        description: `Your primary dependency loop is ${primaryLoop}. Focus on meeting the underlying needs directly rather than managing surface symptoms through external sourcing.`
      });
      
      // Add specific recommendations based on loop type
      if (this.needChain.length > 0) {
        const rootNeeds = this.needChain[this.needChain.length - 1]?.deeper || [];
        if (rootNeeds.length > 0) {
          recommendations.push({
            priority: 'high',
            title: 'Meet Root Needs',
            description: `The root needs in your chain are: ${rootNeeds.join(', ')}. Address these directly to collapse the entire dependency loop.`
          });
        }
      }
    }
    
    // Add general recommendations
    recommendations.push({
      priority: 'medium',
      title: 'Trace the Chain Inward',
      description: 'When you notice a surface symptom, ask "Why?" repeatedly to trace the need chain inward. Meet the deepest need to collapse the entire loop.'
    });
    
    this.analysisData.recommendations = recommendations;
  }

  /**
   * Render assessment results
   * @returns {Promise<void>}
   */
  async renderResults() {
    try {
      await this.loadNeedsDependencyData(); // Ensure all data is loaded
      
      const container = document.getElementById('resultsContainer');
      if (!container) {
        ErrorHandler.showUserError('Results container not found.');
        return;
      }
      
      let html = '<div class="results-content">';

      // Primary Loop
      if (this.analysisData.primaryLoop) {
        html += this.renderPrimaryLoop();
      }

      // Secondary Loops — wrapped in collapsible
      if (this.analysisData.secondaryLoops && this.analysisData.secondaryLoops.length > 0) {
        html += `<details class="closure-section"><summary><strong>Secondary patterns detected</strong></summary><div class="closure-content">${this.renderSecondaryLoops()}</div></details>`;
      }

      // Need Chain
      if (this.needChain.length > 0) {
        html += this.renderNeedChain();
      }

      // Recommendations
      html += this.renderRecommendations();

      // Closure
      html += this.renderClosure();

      html += '</div>';
      
      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(container, html);
      
      // Display debug report if in development mode
      if (window.location.search.includes('debug=true')) {
        this.debugReporter.displayReport('debug-report');
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderResults');
      ErrorHandler.showUserError('Failed to render results. Please refresh the page.');
    }
  }

  renderPrimaryLoop() {
    const loop = this.analysisData.primaryLoop;
    const scores = this.analysisData.loopScores[loop];
    const surfaceNeed = this.surfaceNeed || this.getSurfaceNeedForLoop(loop);
    const compulsionScore = scores?.compulsionScore || 0;
    const aversionScore = scores?.aversionScore || 0;
    const isCompulsive = compulsionScore >= aversionScore;
    const tilt = isCompulsive ? 'compulsive sourcing' : 'avoidant sourcing';
    const tiltWhy = isCompulsive
      ? 'seeking immediate relief or reassurance to quiet the pattern'
      : 'withdrawing or delaying to reduce felt pressure in the moment';
    const tiltNote = isCompulsive
      ? 'Your pattern leans toward <strong>seeking</strong> — you tend to pursue the need externally, often urgently, which can deplete others or create dependency cycles.'
      : 'Your pattern leans toward <strong>avoiding</strong> — you tend to withdraw from the need, which can delay resolution and build internal pressure over time.';
    const chainDepth = scores?.needChainDepth || 0;

    // Historical pattern depth from Phase 2
    const historicalScore = scores?.historicalPatternScore || 0;
    const depthNote = historicalScore >= 5
      ? 'This appears to be a <strong>deeply rooted historical pattern</strong>, likely originating in early conditioning.'
      : historicalScore >= 3
        ? 'This pattern has <strong>moderate historical depth</strong> — it has been present across multiple periods or relationships.'
        : historicalScore > 0
          ? 'This pattern may be more <strong>situational than structural</strong> — it may resolve with changed circumstances.'
          : '';

    // Vice profile from Phase 1
    const viceProfile = this.analysisData.phase1Results?.viceProfile || [];
    const uniqueVices = [...new Set(viceProfile)];
    const viceNote = uniqueVices.length > 0
      ? `<p><strong>Emotional signatures:</strong> ${uniqueVices.map(v => SecurityUtils.sanitizeHTML(v)).join(', ')} — consistent with how the ${SecurityUtils.sanitizeHTML(loop)} loop commonly presents.</p>`
      : '';

    return `
      <div class="primary-loop-section">
        <h2>Primary Dependency Loop Identified</h2>
        <div class="loop-card primary">
          <div class="loop-header">
            <h3>${SecurityUtils.sanitizeHTML(loop)} Loop</h3>
            <span class="loop-strength">Confidence: ${scores?.totalScore?.toFixed(1) || 'N/A'}/10</span>
          </div>
          <p class="loop-description">Based on your responses, the ${SecurityUtils.sanitizeHTML(loop)} dependency loop shows the strongest alignment with your patterns.</p>
          <p><strong>Sourcing tilt:</strong> ${tilt} — ${tiltWhy}.</p>
          ${viceNote}
          ${depthNote ? `<p>${depthNote}</p>` : ''}
          ${chainDepth > 0 ? `<p><strong>Root depth signal:</strong> Your chain mapped ${chainDepth} level${chainDepth === 1 ? '' : 's'} deep, indicating a deeper root than the surface symptom.</p>` : ''}
          <details class="closure-section">
            <summary><strong>How this loop works</strong></summary>
            <div class="closure-content">
              <p><strong>How the loop functions:</strong> When the surface need for ${SecurityUtils.sanitizeHTML(surfaceNeed)} feels unmet, the system defaults to ${tilt}, ${tiltWhy}.</p>
              <p>${tiltNote}</p>
              <p><strong>What it costs:</strong> The loop temporarily manages the surface need, but it does so without resolving the deeper need that created the pressure in the first place.</p>
              <p><strong>Why it persists:</strong> The immediate relief reinforces the pattern while the root need remains under-met.</p>
            </div>
          </details>
        </div>
      </div>
    `;
  }

  renderSecondaryLoops() {
    const secondaryLoops = this.analysisData.secondaryLoops;
    
    if (secondaryLoops.length === 0) return '';
    
    return `
      <div class="secondary-loops-section">
        <h2>Secondary Patterns</h2>
        <div class="loops-grid">
          ${secondaryLoops.map(loop => `
            <div class="loop-card">
              <h3>${loop} Loop</h3>
              <p>Additional pattern showing weaker signals</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getUniqueNeedChain() {
    const unique = [];
    const seen = new Set();
    this.needChain.forEach(entry => {
      const raw = entry?.need;
      if (!raw) return;
      const normalized = String(raw).toLowerCase().trim();
      if (seen.has(normalized)) return;
      seen.add(normalized);
      unique.push({ ...entry, need: raw });
    });
    return unique;
  }

  /** Prevent loop need from appearing twice; the loop is the surface manifestation and must not recur in the chain. */
  getDeduplicatedChainParts(loopNeedRaw, uniqueChain) {
    const loopNorm = String(loopNeedRaw || '').toLowerCase().trim();
    const surfaceNeed = uniqueChain[0]?.need || null;
    const surfaceNorm = String(surfaceNeed || '').toLowerCase().trim();
    const parts = [];
    if (loopNeedRaw) parts.push(SecurityUtils.sanitizeHTML(loopNeedRaw));
    if (surfaceNeed && (!loopNeedRaw || surfaceNorm !== loopNorm)) {
      parts.push(SecurityUtils.sanitizeHTML(surfaceNeed));
    }
    uniqueChain.slice(1).forEach(entry => {
      const n = String(entry?.need || '').trim();
      const norm = n.toLowerCase();
      if (norm && norm !== loopNorm) parts.push(SecurityUtils.sanitizeHTML(n));
    });
    return parts;
  }

  renderNeedChain() {
    if (this.needChain.length === 0) return '';
    const uniqueChain = this.getUniqueNeedChain();
    const loopNeedRaw = this.analysisData.primaryLoop
      ? this.getSurfaceNeedForLoop(this.analysisData.primaryLoop)
      : null;
    const surfaceNeed = uniqueChain[0]?.need || 'Unknown';
    const rootNeed = uniqueChain.length > 0 ? uniqueChain[uniqueChain.length - 1].need : surfaceNeed;
    const rawRootCandidates = this.needChain[this.needChain.length - 1]?.deeper || [];
    const rootCandidates = rawRootCandidates
      .map(need => String(need))
      .filter(need => !uniqueChain.map(n => String(n.need).toLowerCase().trim()).includes(String(need).toLowerCase().trim()));

    const chainParts = this.getDeduplicatedChainParts(loopNeedRaw, uniqueChain);
    const chainText = chainParts.filter(Boolean).join(' ← ');

    const patternType = this.analysisData.phase3Results?.isDependencyLoop;
    const sectionTitle = patternType === true
      ? 'Need Chain Analysis — Confirmed Dependency Loop'
      : patternType === false
        ? 'Need Chain Analysis — Situational Need Cascade'
        : 'Need Chain Analysis';
    const patternNote = patternType === true
      ? '<p>You identified this as a <strong>recurring pattern across different relationships and situations</strong> — this is a dependency loop. Addressing the root need resolves it structurally.</p>'
      : patternType === false
        ? '<p>You identified this as more of a <strong>temporary response to current circumstances</strong>. This may resolve with changed conditions — though the root need still warrants attention.</p>'
        : '';

    return `
      <div class="need-chain-section">
        <h2>${SecurityUtils.sanitizeHTML(sectionTitle)}</h2>
        <div class="need-chain-visualization">
          ${patternNote}
          ${chainText ? `<p><strong>Need Chain (Loop ← Root):</strong> ${chainText}</p>` : ''}
          <p><strong>Root Need Focus:</strong> ${SecurityUtils.sanitizeHTML(rootNeed)}</p>
          ${rootCandidates.length > 0 ? `
            <p><strong>Root Need Candidates:</strong> ${rootCandidates.map(n => SecurityUtils.sanitizeHTML(n)).join(', ')}</p>
          ` : ''}
          <details class="closure-section">
            <summary><strong>How to read this chain</strong></summary>
            <div class="closure-content">
              <p>This chain traces why the loop formed: the surface need shows how the pattern tries to cope, while the deeper needs reveal the underlying reason the loop exists.</p>
              <p>Addressing the root need is what collapses the loop; the surface symptom still needs attention but will not resolve the pattern on its own.</p>
            </div>
          </details>
        </div>
      </div>
    `;
  }

    titleCaseNeed(needStr) {
    return String(needStr || '').replace(/\b\w/g, c => c.toUpperCase()).trim() || '—';
  }

  buildCascadeExplanation(chainFromRootToLoop) {
    if (!chainFromRootToLoop || chainFromRootToLoop.length < 2) return '';
    const parts = chainFromRootToLoop.map(n => this.titleCaseNeed(n));
    const root = parts[0];
    const loop = parts[parts.length - 1];
    if (parts.length === 2) {
      return `The unmet need for ${root} may be an internal or external condition—which in these immediate conditions manifests as an unmet need for ${loop}.`;
    }
    const mid = parts.slice(1, -1);
    let s = `The unmet need for ${root} may be an internal or external condition—has a negative impact upon ${mid[0]}, which becomes a compulsion or aversion`;
    for (let i = 1; i < mid.length - 1; i++) {
      s += `—which causes a compulsion towards, or inability to achieve, ${mid[i]}`;
    }
    if (mid.length > 1) {
      s += `—which leads to an obsession with or loss of ${mid[mid.length - 1]}`;
    }
    s += `—which in these immediate conditions manifests as an unmet need for ${loop}.`;
    return s;
  }

  renderRecommendations() {
    const uniqueChain = this.getUniqueNeedChain();
    const loopNeedRaw = this.analysisData.primaryLoop ? this.getSurfaceNeedForLoop(this.analysisData.primaryLoop) : null;
    const loopNeed = this.surfaceNeed || loopNeedRaw || uniqueChain[0]?.need || 'the surface need';
    const chainParts = this.getDeduplicatedChainParts(loopNeedRaw, uniqueChain);
    const loopNorm = String(loopNeedRaw || '').toLowerCase().trim();
    const firstStageOfChain = chainParts.find(part => {
      const p = String(part || '').toLowerCase().trim();
      return p && p !== loopNorm;
    }) ?? null;
    const rootNeed = uniqueChain.length > 0 ? uniqueChain[uniqueChain.length - 1].need : loopNeed;
    const chainFromRootToLoop = uniqueChain.length > 0 ? uniqueChain.map(n => n.need).reverse() : [rootNeed, loopNeed];
    const cascadeExplanation = this.buildCascadeExplanation(chainFromRootToLoop);

    const loopActions = (typeof getLoopActionsForNeed === 'function' ? getLoopActionsForNeed(loopNeed) : []) || [];
    const rootActions = (typeof getRootActionsForNeed === 'function' ? getRootActionsForNeed(rootNeed) : []) || [];

    const loopNeedDisplay = this.titleCaseNeed(loopNeed);
    const firstStageDisplay = firstStageOfChain ? this.titleCaseNeed(firstStageOfChain) : null;
    const rootNeedDisplay = this.titleCaseNeed(rootNeed);

    // Tilt-personalised framing
    const scores = this.analysisData.loopScores[this.analysisData.primaryLoop] || {};
    const isCompulsive = (scores.compulsionScore || 0) >= (scores.aversionScore || 0);
    const tiltFraming = isCompulsive
      ? 'Your pattern leans compulsive — the first step is to <strong>pause and delay</strong> the loop behaviour rather than acting on the urge immediately. Create a gap between the trigger and the response.'
      : 'Your pattern leans avoidant — the first step is to <strong>re-engage and tolerate</strong> the discomfort of the avoided need rather than withdrawing further. Small, deliberate steps toward the need break the pattern.';

    // Resistance-aware prefix from Phase 4
    const resistanceType = this.analysisData.phase4Results?.resistanceType;
    const resistancePrefix = {
      'cynical_doubt': '<p class="resistance-note"><strong>A note on your resistance:</strong> You expressed cynical doubt — a sense that nothing changes. Treat these actions as small experiments, not commitments. You do not need to believe they will work to try them once.</p>',
      'skeptical_doubt': '<p class="resistance-note"><strong>A note on your resistance:</strong> You expressed some uncertainty about whether this will work. That is fair. You do not need certainty to begin — one small trial is enough.</p>',
      'external_blame': '<p class="resistance-note"><strong>A note on your resistance:</strong> You indicated that others need to change. External factors are real — and this loop is also self-authored. Both can be true. The actions below address what is within your reach.</p>',
      'harsh_self_attack': '<p class="resistance-note"><strong>A note on your resistance:</strong> You expressed harsh self-attack. Before action, offer yourself one moment of self-compassion — this pattern formed for a reason, and recognising it is already a step forward.</p>',
      'open': '<p class="resistance-note"><strong>You expressed openness to engaging with this work.</strong> That is the most powerful starting condition. The actions below are yours to begin immediately.</p>'
    }[resistanceType] || '';

    return `
      <div class="recommendations-section action-strategies-section">
        <h2>Action Strategies</h2>
        ${resistancePrefix}

        <div class="action-strategy strategy-loop">
          <h3>1. Addressing the loop need: ${SecurityUtils.sanitizeHTML(loopNeedDisplay)}</h3>
          <p><strong>Goal:</strong> Restore immanent authorship and resolve draining external dependencies, compulsions, or aversions.</p>
          <p>${tiltFraming}</p>
          <p><strong>Two-fold approach (address BOTH the primary dependency and the first link in the chain):</strong></p>
          <ul class="approach-list">
            <li><strong>First:</strong> By disclosing, people make efforts to establish ${SecurityUtils.sanitizeHTML(loopNeedDisplay)}, or the dependent individual consciously overrides whatever has put them in that situation so they can navigate to another space in which they can find ${SecurityUtils.sanitizeHTML(loopNeedDisplay)}.</li>
            ${firstStageDisplay ? `<li><strong>Second (more effective for resolution):</strong> Seek to address the next link in the chain — in this case ${SecurityUtils.sanitizeHTML(firstStageDisplay)}. This is immanent work: the root is the source of the situation, but the immanent must be addressed for conscious presence and self-authorship to be restored.</li>` : '<li><strong>Second:</strong> Seek and achieve the first link in your need chain. The immanent must be addressed for conscious presence and self-authorship to be restored.</li>'}
          </ul>
          ${loopActions.length > 0 ? `
            <p><strong>Practical actions:</strong></p>
            <ul class="action-list">
              ${loopActions.slice(0, 4).map(a => `<li>${SecurityUtils.sanitizeHTML(a)}</li>`).join('')}
            </ul>
          ` : ''}
          <details class="closure-section">
            <summary><strong>Why addressing the loop need matters</strong></summary>
            <div class="closure-content">
              <p><strong>First step — consciously address and disclose the primary dependency.</strong> The loop is what presents in the situation and is often mistaken for the root. Addressing it is absolutely necessary: a ${SecurityUtils.sanitizeHTML(loopNeedDisplay)} loop reflects an unhealthy dynamic around ${SecurityUtils.sanitizeHTML(loopNeedDisplay)} — for example, taking others' ${SecurityUtils.sanitizeHTML(loopNeedDisplay)}, taking too much ${SecurityUtils.sanitizeHTML(loopNeedDisplay)} away from others, or some other variation. This must be resolved. The primary dependency is the visible and consequential issue: it causes a draining impact — depletion in others, their withdrawal, or compulsive attendance to undesired situations — depending on whether it manifests as a compulsion or aversion. However, addressing the loop only mitigates in the moment. The resolution comes from tracing to the root to stop the systemic construction of the dynamic.</p>
              <p>This need can be resolved by disclosing it to yourself and others — gaining conscious consent for external resourcing — and taking conscious, deliberate action to restore agency.</p>
            </div>
          </details>
        </div>

        <div class="action-strategy strategy-root">
          <h3>2. Addressing the deepest root need: ${SecurityUtils.sanitizeHTML(rootNeedDisplay)}</h3>
          <p><strong>Goal:</strong> Prevent the cascading needs that cause the loop to exist in the first place.</p>
          <p>Rather than responding only where the problem occurs (treating the symptom), consciously adapt your lifestyle to fulfil the root need independently. This is the deepest core need that governs the pattern.</p>
          <p>Consciously meeting the root need resolves the entire need cascade and ends the loop — or at least creates the freedom to develop resilience and capacity to meet the dependency need unto yourself.</p>
          ${rootActions.length > 0 ? `
            <p><strong>Practical actions:</strong></p>
            <ul class="action-list">
              ${rootActions.slice(0, 4).map(a => `<li>${SecurityUtils.sanitizeHTML(a)}</li>`).join('')}
            </ul>
          ` : ''}
          ${cascadeExplanation ? `
            <details class="closure-section">
              <summary><strong>How the chain works</strong></summary>
              <div class="closure-content">
                <p class="cascade-explanation"><strong>How the chain works:</strong> ${SecurityUtils.sanitizeHTML(cascadeExplanation)}</p>
              </div>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

    renderClosure() {
    const readiness = this.analysisData.phase4Results?.readiness || 0;
    const severity = this.analysisData.phase4Results?.impactSeverity || 0;

    let readinessNote = '';
    if (severity >= 5 && readiness <= 3) {
      readinessNote = '<p class="readiness-note"><strong>Given the severity of this pattern and your current readiness,</strong> consider supplementing self-work with professional support — a therapist, coach, or counsellor familiar with needs-based work can help you move through this more safely.</p>';
    } else if (readiness >= 5) {
      readinessNote = '<p class="readiness-note"><strong>You expressed strong readiness to engage.</strong> That is the most valuable asset you have. You can begin the practical actions in the section above immediately.</p>';
    } else if (severity < 3 && severity > 0) {
      readinessNote = '<p class="readiness-note"><strong>This pattern is currently causing mild interference.</strong> The work here is preventive — addressing it now, before it intensifies, is far easier than resolving an entrenched loop later.</p>';
    }

    return `
      <details class="closure-section">
        <summary><strong>What This Does NOT Imply</strong></summary>
        <div class="closure-content">
          ${readinessNote}
          <p><strong>This analysis does not mean:</strong></p>
          <ul>
            <li>That you are broken or deficient</li>
            <li>That dependency is always negative (some dependency is healthy and necessary)</li>
            <li>That you must meet all needs independently</li>
            <li>That these patterns are permanent or fixed</li>
          </ul>
          <p><strong>This analysis does mean:</strong></p>
          <ul>
            <li>You have identified patterns that can be addressed with conscious awareness</li>
            <li>You have a map for tracing symptoms to root needs</li>
            <li>You can develop greater autonomy and sovereignty through needs consciousness</li>
            <li>You can transform dependency loops into conscious choice</li>
          </ul>
        </div>
      </details>
    `;
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
        identifiedLoops: this.identifiedLoops,
        needChain: this.needChain,
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
      this.identifiedLoops = data.identifiedLoops || [];
      this.needChain = data.needChain || [];
      this.analysisData = data.analysisData || this.analysisData;
      
      // Rebuild question sequence based on current phase
      if (this.currentPhase === 1) {
        await this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        await this.analyzePhase1Results();
        await this.buildPhase2Sequence();
      } else if (this.currentPhase === 3) {
        await this.analyzePhase1Results();
        await this.analyzePhase2Results();
        await this.buildPhase3Sequence();
      } else if (this.currentPhase === 4) {
        await this.analyzePhase1Results();
        await this.analyzePhase2Results();
        // Note: analyzePhase3Results is not async, so no await needed
        this.analyzePhase3Results();
        await this.buildPhase4Sequence();
      }
      
      // If in progress, restore questionnaire state
      if (this.currentQuestionIndex > 0 || this.currentPhase > 1) {
        const actionButtonsSection = document.getElementById('actionButtonsSection');
        const questionnaireSection = document.getElementById('questionnaireSection');
        if (actionButtonsSection) actionButtonsSection.classList.add('hidden');
        if (questionnaireSection) questionnaireSection.classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
    }
  }

  async resetAssessment() {
    if (await showConfirm('Are you sure you want to start a new assessment? This will clear all current progress.')) {
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.identifiedLoops = [];
      this.needChain = [];
      this.analysisData = {
        timestamp: new Date().toISOString(),
        phase1Results: {},
        phase2Results: {},
        phase3Results: {},
        phase4Results: {},
        identifiedLoops: [],
        primaryLoop: null,
        secondaryLoops: [],
        loopScores: {},
        recommendations: [],
        allAnswers: {},
        questionSequence: []
      };
      localStorage.removeItem('needsDependencyProgress');
      localStorage.removeItem('needsDependencyResults');
      
      const resultsSection = document.getElementById('resultsSection');
      const introSection = document.getElementById('introSection');
      const actionButtonsSection = document.getElementById('actionButtonsSection');
      const questionnaireSection = document.getElementById('questionnaireSection');
      this.ui.transition('idle');
      
      this.buildPhase1Sequence();
    }
  }

  exportAnalysis(format) {
    const uniqueChain = this.getUniqueNeedChain();
    const loopNeedRaw = this.analysisData.primaryLoop ? this.getSurfaceNeedForLoop(this.analysisData.primaryLoop) : null;
    const chainParts = this.getDeduplicatedChainParts(loopNeedRaw, uniqueChain);
    const needChainDisplay = chainParts.filter(Boolean).join(' ΓåÉ ');
    const loopNorm = String(loopNeedRaw || '').toLowerCase().trim();
    const firstLinkInChain = chainParts.find(part => {
      const p = String(part || '').toLowerCase().trim();
      return p && p !== loopNorm;
    }) ?? null;

    const exportData = {
      ...this.analysisData,
      needChain: this.needChain,
      needChainDisplay,
      firstLinkInChain,
      exportDate: new Date().toISOString(),
      systemType: 'needs-dependency-v2',
      systemName: 'Needs Dependency Loop Determinator (4-Phase Architecture)'
    };
    
    if (format === 'json') {
      const json = exportJSON(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
      downloadFile(json, 'needs-dependency-analysis.json', 'application/json');
    } else if (format === 'csv') {
      const csv = exportForAIAgent(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
      downloadFile(csv, 'needs-dependency-analysis.csv', 'text/csv');
    }
  }

  exportExecutiveBrief() {
    const uniqueChain = this.getUniqueNeedChain();
    const loopNeedRaw = this.analysisData.primaryLoop ? this.getSurfaceNeedForLoop(this.analysisData.primaryLoop) : null;
    const chainParts = this.getDeduplicatedChainParts(loopNeedRaw, uniqueChain);
    const needChainDisplay = chainParts.filter(Boolean).join(' ΓåÉ ');
    const loopNorm = String(loopNeedRaw || '').toLowerCase().trim();
    const firstLinkInChain = chainParts.find(part => {
      const p = String(part || '').toLowerCase().trim();
      return p && p !== loopNorm;
    }) ?? null;
    const exportData = {
      ...this.analysisData,
      needChain: this.needChain,
      needChainDisplay,
      firstLinkInChain,
      exportDate: new Date().toISOString(),
      systemType: 'needs-dependency-v2',
      systemName: 'Needs Dependency Loop Determinator (4-Phase Architecture)'
    };
    const brief = exportExecutiveBrief(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
    downloadFile(brief, `needs-dependency-executive-brief-${Date.now()}.txt`, 'text/plain');
  }
}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.needsDependencyEngine = new NeedsDependencyEngine();
  });
} else {
  window.needsDependencyEngine = new NeedsDependencyEngine();
}

