// Modern Archetype Identification Engine
// Multi-Tier Assessment System for identifying primary, secondary, and tertiary archetypes
// Version 1.1 - Optimized with lazy loading and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportExecutiveBrief, exportJSON, downloadFile } from './shared/export-utils.js';

// Data modules - will be loaded lazily
let ARCHETYPES, CORE_GROUPS;
let PHASE_1_QUESTIONS, PHASE_2_QUESTIONS, PHASE_3_QUESTIONS, PHASE_4_QUESTIONS;
let SUBTYPE_REFINEMENT_QUESTIONS;
let ARCHETYPE_SPREAD_MAP;

export class ArchetypeEngine {
  constructor() {
    this.currentPhase = 0; // 0 = gender selection, 0.5 = IQ bracket, 1-4 = assessment phases
    this.currentQuestionIndex = 0;
    this.gender = null; // 'male' or 'female'
    this.iqBracket = null; // IQ bracket for faster funneling
    this.answers = {};
    this.aspirationAnswers = {}; // Track aspiration test responses separately
    this.questionSequence = [];
    this.archetypeScores = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      gender: null,
      iqBracket: null,
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      aspirationAnalysis: {},
      primaryArchetype: null,
      secondaryArchetype: null,
      tertiaryArchetype: null,
      confidenceLevels: {},
      allAnswers: {},
      questionSequence: []
    };

    // Initialize debug reporter
    this.debugReporter = createDebugReporter('ArchetypeEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();

// Initialize data store
    this.dataStore = new DataStore('archetype-assessment', '1.0.0');

    this.init();
  }

init() {
  const setup = async () => {
    // 1. Attach listeners first so the 'Begin' button is functional
    this.attachEventListeners();
    
    // 2. Load the data silently in the background
    try {
      await this.loadStoredData();
      this.initializeScores();
      
      // 3. LOGIC CHECK: If we loaded a mid-assessment state, 
      // we DON'T call renderCurrentQuestion() yet. 
      // We wait for the user to click "Begin" or "Resume".
      console.log('ArchetypeEngine: Data restored. Current Phase:', this.currentPhase);
    } catch (error) {
      this.debugReporter.logError(error, 'init');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}

  initializeScores() {
    // Initialize scores dynamically as archetypes are scored
    this.archetypeScores = {};
  }

  attachEventListeners() {
    // 1. START BUTTON LOGIC
    const setupStartBtn = (btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Start button clicked');
        this.startAssessment();
      });
    };

    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      setupStartBtn(startBtn);
      console.log('Start button event listener attached');
    } else {
      // Retry logic if DOM wasn't fully ready
      setTimeout(() => {
        const retryBtn = document.getElementById('startAssessment');
        if (retryBtn) setupStartBtn(retryBtn);
      }, 500);
    }

    const resumeBtn = document.getElementById('resumeAssessment');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        sessionStorage.setItem(`resume:${this.dataStore.namespace}`, 'true');
        window.location.reload();
      });
    }

    // 2. THE GLOBAL "WATCHER" (Event Delegation)
    // This handles Phase 1, 2, 3, and 4 selections automatically.
    const container = document.getElementById('questionContainer');
    if (container) {
      container.addEventListener('click', (e) => {
        // Find if the click was on or inside an option label
        const optionLabel = e.target.closest('.option-label, .likert-option, .narrative-option, .gender-btn, .iq-btn');
        
        // Ignore if no option found or if the question is locked
        if (!optionLabel || optionLabel.classList.contains('locked')) return;

        // Find the radio input inside the clicked label
        const input = optionLabel.querySelector('input[type="radio"]');
        
        if (input) {
          input.checked = true;
          const questionId = input.name.replace('question_', '');
          const value = parseInt(input.value);
          const question = this.questionSequence[this.currentQuestionIndex];

          console.log(`Phase ${this.currentPhase} Input Captured:`, value);
          
          // Only process if we have a valid question object (Phases 1-4)
          if (question) {
            this.processAnswer(question, value);
            
            // Update visual selection immediately
            // Remove selected class from all options of the same type
            const questionContainer = input.closest('.question-card');
            if (questionContainer) {
              // For Likert options
              if (optionLabel.classList.contains('likert-option')) {
                questionContainer.querySelectorAll('label.likert-option').forEach(label => {
                  label.classList.remove('selected');
                });
                optionLabel.classList.add('selected');
              }
              // For forced choice options
              else if (optionLabel.classList.contains('option-label')) {
                questionContainer.querySelectorAll('label.option-label').forEach(label => {
                  label.classList.remove('selected');
                });
                optionLabel.classList.add('selected');
              }
              // For narrative options
              else if (optionLabel.classList.contains('narrative-option')) {
                questionContainer.querySelectorAll('label.narrative-option').forEach(label => {
                  label.classList.remove('selected');
                });
                optionLabel.classList.add('selected');
              }
            }
          }
        }
      });
    }

    // 3. NAVIGATION & UTILITY BUTTONS
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

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to abandon this assessment? All progress will be lost.')) {
          this.resetAssessment();
        }
      });
    }
  }

startAssessment() {
  console.log('startAssessment called');
  
  // 1. Reset Internal State
  this.currentPhase = 0; 
  this.currentQuestionIndex = 0;
  this.gender = null;
  this.answers = {};
  
  // 2. Clear stale data from local storage so Phase 2 doesn't "ghost" in
  if (this.dataStore) {
    this.dataStore.clear(); 
  }

  this.initializeScores();

  // 3. Force UI Visibility
  // Ensure the landing page hidden and the container is visible
  const landingUI = document.getElementById('landing-section'); // Update with your actual ID
  const containerUI = document.getElementById('questionContainer');
  
  if (landingUI) landingUI.classList.add('hidden');
  if (containerUI) {
    containerUI.classList.remove('hidden');
    containerUI.innerHTML = ''; // Clear any "ghost" Phase 2 boxes
  }

  // 4. Trigger First View
  this.showQuestionContainer(); 
  this.showGenderSelection();
  this.saveProgress();
}

showGenderSelection() {
  const container = document.getElementById('questionContainer');
  if (!container) return;

  // We remove the hardcoded 'white' background and use our new CSS classes
  SecurityUtils.safeInnerHTML(container, `
    <div class="question-card selection-panel">
      <h2>Select Your Gender</h2>
      <p>This assessment adapts questions based on gender to provide more accurate archetype identification.</p>
      
      <div class="gender-options">
        <button id="selectMale" class="btn btn-outline gender-btn">Male</button>
        <button id="selectFemale" class="btn btn-outline gender-btn">Female</button>
      </div>
    </div>
    `);

    // Add hover effects
    setTimeout(() => {
      document.getElementById('selectMale')?.addEventListener('click', () => {
        this.gender = 'male';
        this.analysisData.gender = 'male';
        this.currentPhase = 0.5; // Move to IQ bracket selection
        this.showIQBracketSelection();
        this.saveProgress();
      });

      document.getElementById('selectFemale')?.addEventListener('click', () => {
        this.gender = 'female';
        this.analysisData.gender = 'female';
        this.currentPhase = 0.5; // Move to IQ bracket selection
        this.showIQBracketSelection();
        this.saveProgress();
      });

      // Add hover effects
      document.querySelectorAll('.gender-btn').forEach(btn => {
        // Hover effects handled by CSS
      });
    }, 100);
    
    // Show the questionnaire section
    this.showQuestionContainer();
  }

  showIQBracketSelection() {
    const container = document.getElementById('questionContainer');
    if (!container) return;

    SecurityUtils.safeInnerHTML(container, `
      <div class="question-card"">
        <h2">Select Your IQ Bracket</h2>
        <p>
          Providing your IQ bracket helps us prioritize relevant questions and accelerate the assessment. 
          If you don't know your IQ, estimate based on standardized tests (SAT, ACT, WAIS, etc.) or educational/career patterns.
        </p>
        <div>
          <button id="selectIQ80_100" class="iq-btn">
            <strong>80-100 IQ</strong> - Routine Guided Thinkers (~34% of population)
          </button>
          <button id="selectIQ100_115" class="iq-btn">
            <strong>100-115 IQ</strong> - Practical Adaptive Thinkers (~34% of population)
          </button>
          <button id="selectIQ115_130" class="iq-btn">
            <strong>115-130 IQ</strong> - Strategic Analytical Thinkers (~14% of population)
          </button>
          <button id="selectIQ130_145" class="iq-btn">
            <strong>130-145 IQ</strong> - Creative Synthesizing Thinkers (~2% of population)
          </button>
          <button id="selectIQ145_plus" class="iq-btn">
            <strong>145+ IQ</strong> - Meta-Recursive Thinkers (&lt;1% of population)
          </button>
          <button id="selectIQUnknown" class="iq-btn iq-btn-unknown">
            <strong>I don't know / Prefer not to specify</strong> - Full assessment will be provided
          </button>
        </div>
      </div>
    `);

    // Add click handlers
    setTimeout(() => {
      const iqBrackets = {
        'selectIQ80_100': '80_100',
        'selectIQ100_115': '100_115',
        'selectIQ115_130': '115_130',
        'selectIQ130_145': '130_145',
        'selectIQ145_plus': '145_plus',
        'selectIQUnknown': 'unknown'
      };

      Object.keys(iqBrackets).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
          button.addEventListener('click', async () => {
            this.iqBracket = iqBrackets[buttonId];
            this.analysisData.iqBracket = iqBrackets[buttonId];
            this.currentPhase = 1;
            try {
              await this.buildPhase1Sequence();
              this.showQuestionContainer();
              this.renderCurrentQuestion();
              this.updateNavigation();
              this.saveProgress();
            } catch (error) {
              this.debugReporter.logError(error, 'IQ bracket selection');
            }
          });

          // Add hover effects
          // Hover effects handled by CSS
        }
      });
    }, 100);
    
    this.showQuestionContainer();
  }

  /**
   * Load archetype data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadArchetypeData() {
    if (ARCHETYPES && PHASE_1_QUESTIONS) {
      return; // Already loaded
    }

    try {
      // Load archetypes data
      const archetypesModule = await loadDataModule(
        './archetype-data/archetypes.js',
        'Archetypes Data'
      );
      ARCHETYPES = archetypesModule.ARCHETYPES;
      CORE_GROUPS = archetypesModule.CORE_GROUPS;

      // Load questions data
      const questionsModule = await loadDataModule(
        './archetype-data/archetype-questions.js',
        'Archetype Questions'
      );
      PHASE_1_QUESTIONS = questionsModule.PHASE_1_QUESTIONS;
      PHASE_2_QUESTIONS = questionsModule.PHASE_2_QUESTIONS;
      SUBTYPE_REFINEMENT_QUESTIONS = questionsModule.SUBTYPE_REFINEMENT_QUESTIONS;
      PHASE_3_QUESTIONS = questionsModule.PHASE_3_QUESTIONS;
      PHASE_4_QUESTIONS = questionsModule.PHASE_4_QUESTIONS;

      const spreadModule = await loadDataModule(
        './archetype-data/archetype-spread.js',
        'Archetype Spread'
      );
      ARCHETYPE_SPREAD_MAP = spreadModule.ARCHETYPE_SPREAD_MAP || {};

      this.debugReporter.recordSection('Phase 1', PHASE_1_QUESTIONS?.length || 0);
      this.debugReporter.recordSection('Phase 2', PHASE_2_QUESTIONS?.length || 0);
      this.debugReporter.recordSection('Phase 3', PHASE_3_QUESTIONS?.length || 0);
      this.debugReporter.recordSection('Phase 4', PHASE_4_QUESTIONS?.length || 0);
    } catch (error) {
      this.debugReporter.logError(error, 'loadArchetypeData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  /**
   * Build Phase 1 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase1Sequence() {
    await this.loadArchetypeData();
    
    // Phase 1: Core Orientation - Filter/prioritize based on IQ bracket
    let questions = [...PHASE_1_QUESTIONS];
    
    // If IQ bracket known, prioritize relevant questions and reduce total
    if (this.iqBracket && this.iqBracket !== 'unknown') {
      questions = this.filterQuestionsByIQ(questions, 12); // Reduce to 12 questions for faster assessment
    }
    
    this.questionSequence = questions;
    this.debugReporter.recordQuestionCount(questions.length);
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  /**
   * Build Phase 2 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase2Sequence() {
    await this.loadArchetypeData();
    
    // Phase 2: Dimensional Refinement - Filter/prioritize based on IQ bracket
    this.currentPhase = 2;
    this.currentQuestionIndex = 0;
    const coreGroupScores = this.analysisData.phase1Results?.coreGroupScores || this.calculateCoreGroupScores();
    const topGroup = Object.keys(coreGroupScores).sort((a, b) => coreGroupScores[b] - coreGroupScores[a])[0];
    const refinementQuestions = SUBTYPE_REFINEMENT_QUESTIONS?.[topGroup] || [];
    let questions = [...PHASE_2_QUESTIONS];
    
    // If IQ bracket known, reduce questions for faster assessment
    if (this.iqBracket && this.iqBracket !== 'unknown') {
      questions = this.filterQuestionsByIQ(questions, 15); // Reduce to 15 questions
    }

    questions = [...refinementQuestions, ...questions];
    
    this.questionSequence = questions;
    this.debugReporter.recordQuestionCount(questions.length);
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  /**
   * Build Phase 3 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase3Sequence() {
    await this.loadArchetypeData();
    
    // Phase 3: Shadow/Integration Assessment - Keep aspiration questions, filter others
    this.currentPhase = 3;
    this.currentQuestionIndex = 0;
    let questions = [...PHASE_3_QUESTIONS];
    
    // Always keep aspiration questions (critical for bias mitigation)
    const aspirationQuestions = questions.filter(q => q.isAspiration);
    const otherQuestions = questions.filter(q => !q.isAspiration);
    
    // If IQ bracket known, reduce non-aspiration questions
    if (this.iqBracket && this.iqBracket !== 'unknown') {
      const filteredOthers = this.filterQuestionsByIQ(otherQuestions, 6); // Reduce to 6
      questions = [...aspirationQuestions, ...filteredOthers];
    }
    
    this.questionSequence = questions;
    this.debugReporter.recordQuestionCount(questions.length);
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }
  
  filterQuestionsByIQ(questions, targetCount) {
    // Prioritize questions based on IQ bracket and archetype correlations
    // IQ bands correlate with certain archetypes:
    // Lower IQ (80-115): More likely Beta, Delta, Omega
    // Mid IQ (115-130): More likely Alpha, Beta, Delta
    // Higher IQ (130+): More likely Gamma, Sigma, Phi
    
    if (this.iqBracket === 'unknown') {
      return questions.slice(0, targetCount); // Just take first N if unknown
    }
    
    // Score each question by relevance to IQ bracket
    const scoredQuestions = questions.map(q => {
      let relevanceScore = 0;
      
      // Check which archetypes this question maps to
      const archetypeIds = [];
      if (q.options) {
        q.options.forEach(opt => {
          if (opt.archetypes) {
            archetypeIds.push(...opt.archetypes);
          }
        });
      }
      if (q.archetypes) {
        archetypeIds.push(...q.archetypes.map(a => a.id || a));
      }
      
      // IQ-Archetype correlations
      if (this.iqBracket === '80_100' || this.iqBracket === '100_115') {
        // Lower IQ brackets correlate with Beta, Delta, Omega
        const lowerIQArchetypes = ['beta', 'delta', 'omega', 'beta_iota', 'beta_nu', 'delta_mu'];
        relevanceScore = archetypeIds.filter(id => lowerIQArchetypes.includes(id)).length * 3;
        // Also relevant but less: Alpha (some), Gamma/Sigma less likely
        if (archetypeIds.some(id => id === 'alpha' || id === 'alpha_xi')) relevanceScore += 1;
      } else if (this.iqBracket === '115_130') {
        // Mid IQ correlates with Alpha, Beta, Delta
        const midIQArchetypes = ['alpha', 'beta', 'delta', 'alpha_xi', 'beta_nu', 'delta_mu'];
        relevanceScore = archetypeIds.filter(id => midIQArchetypes.includes(id)).length * 3;
        // Gamma/Sigma also possible
        if (archetypeIds.some(id => id === 'gamma' || id === 'sigma')) relevanceScore += 2;
      } else if (this.iqBracket === '130_145' || this.iqBracket === '145_plus') {
        // Higher IQ correlates with Gamma, Sigma, Phi, Alpha
        const higherIQArchetypes = ['gamma', 'sigma', 'phi', 'alpha', 'gamma_theta', 'sigma_kappa'];
        relevanceScore = archetypeIds.filter(id => higherIQArchetypes.includes(id)).length * 3;
        // Beta/Delta less likely but still possible
        if (archetypeIds.some(id => id === 'beta' || id === 'delta')) relevanceScore += 1;
        // Omega unlikely
        if (archetypeIds.some(id => id === 'omega')) relevanceScore -= 1;
      }
      
      return { question: q, score: relevanceScore };
    });
    
    // Sort by relevance, then randomize top questions
    scoredQuestions.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Math.random() - 0.5; // Randomize ties
    });
    
    // Take top N questions, ensuring we get variety
    const selected = [];
    const seenArchetypes = new Set();
    
    // First pass: high relevance questions
    for (const item of scoredQuestions) {
      if (selected.length >= targetCount) break;
      
      // Check if this adds archetype diversity
      const questionArchetypes = [];
      if (item.question.options) {
        item.question.options.forEach(opt => {
          if (opt.archetypes) questionArchetypes.push(...opt.archetypes);
        });
      }
      
      const addsDiversity = questionArchetypes.some(id => !seenArchetypes.has(id));
      if (item.score > 0 || addsDiversity || selected.length < targetCount * 0.7) {
        selected.push(item.question);
        questionArchetypes.forEach(id => seenArchetypes.add(id));
      }
    }
    
    // Second pass: fill remaining slots if needed
    if (selected.length < targetCount) {
      for (const item of scoredQuestions) {
        if (selected.length >= targetCount) break;
        if (!selected.includes(item.question)) {
          selected.push(item.question);
        }
      }
    }
    
    return selected.slice(0, targetCount);
  }

  /**
   * Build Phase 4 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase4Sequence() {
    await this.loadArchetypeData();
    
    // Phase 4: Validation & Narrative Matching (5 narrative vignettes)
    this.currentPhase = 4;
    this.currentQuestionIndex = 0;
    this.questionSequence = [...PHASE_4_QUESTIONS];
    this.debugReporter.recordQuestionCount(this.questionSequence.length);
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  renderCurrentQuestion() {
    const renderStart = performance.now();
    
    if (this.questionSequence.length === 0) {
      this.finalizeResults();
      return;
    }

    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    if (!container) return;

    let html = '';

    // Show phase explanation at start of each phase
    if (this.currentQuestionIndex === 0) {
      html += this.getPhaseExplanation(this.currentPhase);
    }

    // Determine if this question has already been answered (locked)
    const isAnswered = this.answers[question.id] !== undefined;
    const isLocked = isAnswered; // Answers are locked once made

    // Render the current question only (replace previous content)
    if (question.type === 'forced_choice') {
      html += this.renderForcedChoiceQuestion(question, isLocked);
    } else if (question.type === 'likert') {
      html += this.renderLikertQuestion(question, isLocked);
    } else if (question.type === 'narrative') {
      html += this.renderNarrativeQuestion(question, isLocked);
    }

    // Replace content instead of appending - only show current question
    SecurityUtils.safeInnerHTML(container, html);
    this.updateNavigation();
    
    // Track render performance
    const renderDuration = performance.now() - renderStart;
    this.debugReporter.recordRender('question', renderDuration);
    
    // Focus management for accessibility
    const firstInput = container.querySelector('input, button, select, textarea');
    if (firstInput) {
      DOMUtils.focusElement(firstInput);
    }
  }

  getPhaseExplanation(phase) {
    const explanations = {
      1: {
        title: 'Phase 1: Core Orientation',
        description: 'We\'ll start by identifying your fundamental behavioral patterns and values through concrete scenarios.',
        purpose: 'This phase helps determine which primary archetype group (Alpha, Beta, Gamma, Delta, Sigma, Omega, or Phi) best matches your natural orientation.'
      },
      2: {
        title: 'Phase 2: Dimensional Refinement',
        description: 'Now we\'ll explore the nuances within your primary group to identify specific subtypes and variations.',
        purpose: 'This phase distinguishes between main types and their variants (e.g., Alpha vs Alpha-Xi vs Dark Alpha) through detailed behavioral statements.'
      },
      3: {
        title: 'Phase 3: Shadow & Integration Assessment',
        description: 'We\'ll examine how you respond under stress and identify secondary influences and developmental areas.',
        purpose: 'This phase reveals situational variability, aspirational traits, stress responses, and potential shadow expressions of your archetype.'
      },
      4: {
        title: 'Phase 4: Validation & Narrative Matching',
        description: 'Finally, we\'ll present narrative scenarios to confirm the resonance of your identified archetype.',
        purpose: 'This phase uses holistic pattern recognition to validate your results through real-world scenarios.'
      }
    };

    const exp = explanations[phase];
    if (!exp) return '';
    return `
      <div class="phase-explanation">
        <h3>${SecurityUtils.sanitizeHTML(exp.title || '')}</h3>
        <p>${SecurityUtils.sanitizeHTML(exp.description || '')}</p>
        <p>${SecurityUtils.sanitizeHTML(exp.purpose || '')}</p>
      </div>
    `;
  }

  renderForcedChoiceQuestion(question, isLocked = false) {
    const currentAnswer = this.answers[question.id];
    let optionsHTML = question.options.map((option, index) => {
      const isSelected = currentAnswer && currentAnswer.selectedIndex === index;
      return `
        <label class="option-label ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}">
          <input type="radio" name="question_${question.id}" value="${index}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
          <span>${SecurityUtils.sanitizeHTML(option.text || '')}</span>
          ${isSelected ? '<span class="selected-check">✓</span>' : ''}
        </label>
      `;
    }).join('');

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`).forEach(radio => {
          radio.addEventListener('change', (e) => {
            const selectedIndex = parseInt(e.target.value);
            this.processAnswer(question, selectedIndex);
            // Update visual selection immediately
            document.querySelectorAll(`label.option-label`).forEach(label => {
              label.classList.remove('selected');
            });
            const selectedLabel = e.target.closest('label');
            if (selectedLabel) {
              selectedLabel.classList.add('selected');
            }
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card">
        <h3>${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="options-container">
          ${optionsHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  renderLikertQuestion(question, isLocked = false) {
    const currentAnswer = this.answers[question.id];
    const scale = question.scale || 5;
    const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    
    let scaleHTML = '';
    for (let i = 1; i <= scale; i++) {
      const isSelected = currentAnswer && currentAnswer.value === i;
      scaleHTML += `
        <label class="likert-option ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}">
          <input type="radio" name="question_${question.id}" value="${i}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
          <span>${i}</span>
          <div class="likert-label">${labels[i - 1] || ''}</div>
        </label>
      `;
    }

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`).forEach(radio => {
          radio.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            this.processAnswer(question, value);
            // Update visual selection immediately
            document.querySelectorAll(`label.likert-option`).forEach(label => {
              label.classList.remove('selected');
            });
            const selectedLabel = e.target.closest('label');
            if (selectedLabel) {
              selectedLabel.classList.add('selected');
            }
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card">
        <h3>${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="likert-scale">
          ${scaleHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  renderNarrativeQuestion(question, isLocked = false) {
    const currentAnswer = this.answers[question.id];
    let vignettesHTML = question.vignettes.map((vignette, index) => {
      const isSelected = currentAnswer && currentAnswer.selectedIndex === index;
      const lockedStyle = isLocked && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : '';
      const selectedLockedStyle = isLocked && isSelected ? 'background: rgba(255, 184, 0, 0.3) !important; border: 3px solid var(--brand) !important;' : '';
      return `
        <label class="narrative-option ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" style="display: block; padding: 1.5rem; margin: 1rem 0; background: ${isSelected ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; border: 2px solid ${isSelected ? 'var(--brand)' : 'transparent'}; border-radius: var(--radius); cursor: ${isLocked && !isSelected ? 'not-allowed' : 'pointer'}; transition: all 0.2s; ${lockedStyle} ${selectedLockedStyle}">
          <input type="radio" name="question_${question.id}" value="${index}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''} style="margin-right: 0.5rem;">
          <div style="font-style: italic; color: var(--muted); line-height: 1.7;">${SecurityUtils.sanitizeHTML(vignette.text || '')}</div>
          ${isSelected ? '<div style="margin-top: 0.5rem; color: var(--brand); font-weight: 700; font-size: 0.9rem;">✓ Selected</div>' : ''}
        </label>
      `;
    }).join('');

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`).forEach(radio => {
          radio.addEventListener('change', (e) => {
            const selectedIndex = parseInt(e.target.value);
            this.processAnswer(question, selectedIndex);
            // Update visual selection immediately
            document.querySelectorAll(`label.narrative-option`).forEach(label => {
              label.classList.remove('selected');
            });
            const selectedLabel = e.target.closest('label');
            if (selectedLabel) {
              selectedLabel.classList.add('selected');
            }
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div class="locked-notice"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card">
        <h3>${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="narrative-container">
          ${vignettesHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  processAnswer(question, answerValue) {
    this.answers[question.id] = {
      questionId: question.id,
      value: answerValue,
      selectedIndex: answerValue,
      timestamp: new Date().toISOString()
    };

    // Score based on phase
    if (this.currentPhase === 1) {
      this.scorePhase1Answer(question, answerValue);
    } else if (this.currentPhase === 2) {
      this.scorePhase2Answer(question, answerValue);
    } else if (this.currentPhase === 3) {
      this.scorePhase3Answer(question, answerValue);
    } else if (this.currentPhase === 4) {
      this.scorePhase4Answer(question, answerValue);
    }

    this.saveProgress();
  }

  scorePhase1Answer(question, selectedIndex) {
    // Phase 1: 50% weight
    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) return;

    selectedOption.archetypes.forEach(archId => {
      // Map to gender-specific archetype if gender is selected
      let targetArchId = archId;
      if (this.gender === 'female') {
        const femaleMapping = {
          'alpha': 'alpha_female',
          'alpha_xi': 'alpha_xi_female',
          'alpha_rho': 'alpha_xi_female', // Alpha-Rho doesn't exist for female
          'dark_alpha': 'dark_alpha_female',
          'beta': 'beta_female',
          'beta_iota': 'alpha_unicorn_female',
          'beta_nu': 'beta_nu_female',
          'beta_manipulator': 'beta_manipulator_female',
          'beta_kappa': 'beta_kappa_female',
          'gamma': 'gamma_female',
          'gamma_theta': 'gamma_theta_female',
          'dark_gamma': 'dark_gamma_female',
          'delta': 'delta_female',
          'delta_mu': 'delta_mu_female',
          'dark_delta': 'dark_delta_female',
          'sigma': 'sigma_female',
          'dark_sigma_zeta': 'dark_sigma_zeta_female',
          'omega': 'omega_female',
          'dark_omega': 'dark_omega_female',
          'phi': 'phi_female'
        };
        targetArchId = femaleMapping[archId] || archId;
      }
      
      // Initialize score if needed
      if (!this.archetypeScores[targetArchId]) {
        this.archetypeScores[targetArchId] = {
          phase1: 0,
          phase2: 0,
          phase3: 0,
          phase4: 0,
          total: 0,
          weighted: 0
        };
      }
      
      const weight = selectedOption.weight || 1;
      this.archetypeScores[targetArchId].phase1 += weight * 3; // Phase 1 gets 3x multiplier
    });
  }

  scorePhase2Answer(question, value) {
    // Phase 2: 30% weight
    // Likert scale: 1-5, convert to -2 to +2 for scoring
    const normalizedValue = value - 3; // -2 to +2
    
    if (!question.archetypes || !Array.isArray(question.archetypes)) {
      this.debugReporter.logError(new Error('Phase 2 question missing archetypes array'), 'scorePhase2Answer');
      return;
    }
    
    question.archetypes.forEach(arch => {
      // Skip if arch or arch.id is missing
      if (!arch || !arch.id) {
        this.debugReporter.logError(new Error('Phase 2 archetype missing id'), 'scorePhase2Answer');
        return;
      }
      
      // Initialize score object if it doesn't exist
      if (!this.archetypeScores[arch.id]) {
        this.archetypeScores[arch.id] = {
          phase1: 0,
          phase2: 0,
          phase3: 0,
          phase4: 0,
          total: 0,
          weighted: 0
        };
      }
      
      const weight = arch.weight || 1;
      this.archetypeScores[arch.id].phase2 += normalizedValue * weight * 2; // Phase 2 gets 2x multiplier
    });
  }

  scorePhase3Answer(question, selectedIndex) {
    // Phase 3: 15% weight
    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) return;

    // Track aspiration answers separately for bias mitigation
    if (question.isAspiration && selectedOption.aspirationTarget) {
      if (!this.aspirationAnswers[question.id]) {
        this.aspirationAnswers[question.id] = [];
      }
      this.aspirationAnswers[question.id].push(selectedOption.aspirationTarget);
      // Don't apply direct scoring for aspiration questions - they're used for reverse psychology
      return;
    }

    selectedOption.archetypes.forEach(archId => {
      // Map to gender-specific archetype if gender is selected
      let targetArchId = archId;
      if (this.gender === 'female') {
        const femaleMapping = {
          'alpha': 'alpha_female',
          'alpha_xi': 'alpha_xi_female',
          'alpha_rho': 'alpha_xi_female',
          'dark_alpha': 'dark_alpha_female',
          'beta': 'beta_female',
          'beta_iota': 'alpha_unicorn_female',
          'beta_nu': 'beta_nu_female',
          'beta_manipulator': 'beta_manipulator_female',
          'beta_kappa': 'beta_kappa_female',
          'gamma': 'gamma_female',
          'gamma_theta': 'gamma_theta_female',
          'dark_gamma': 'dark_gamma_female',
          'delta': 'delta_female',
          'delta_mu': 'delta_mu_female',
          'dark_delta': 'dark_delta_female',
          'sigma': 'sigma_female',
          'dark_sigma_zeta': 'dark_sigma_zeta_female',
          'omega': 'omega_female',
          'dark_omega': 'dark_omega_female',
          'phi': 'phi_female'
        };
        targetArchId = femaleMapping[archId] || archId;
      }
      
      // Initialize score if needed
      if (!this.archetypeScores[targetArchId]) {
        this.archetypeScores[targetArchId] = {
          phase1: 0,
          phase2: 0,
          phase3: 0,
          phase4: 0,
          total: 0,
          weighted: 0
        };
      }
      
      const weight = selectedOption.weight || 1;
      this.archetypeScores[targetArchId].phase3 += weight * 1; // Phase 3 gets 1x multiplier
    });
  }

  scorePhase4Answer(question, selectedIndex) {
    // Phase 4: 5% weight (validation)
    const selectedVignette = question.vignettes[selectedIndex];
    if (!selectedVignette) return;

    selectedVignette.archetypes.forEach(archId => {
      const weight = selectedVignette.weight || 1;
      this.archetypeScores[archId].phase4 += weight * 0.5; // Phase 4 gets 0.5x multiplier
    });
  }

  calculateFinalScores() {
    // Apply aspiration-based adjustments BEFORE final calculation
    if (this.analysisData.aspirationAnalysis && this.analysisData.aspirationAnalysis.adjustments) {
      const adjustments = this.analysisData.aspirationAnalysis.adjustments;
      Object.keys(adjustments).forEach(archId => {
        if (this.archetypeScores[archId]) {
          // Apply adjustment to phase 1 and 2 scores (behavioral evidence)
          this.archetypeScores[archId].phase1 *= adjustments[archId];
          this.archetypeScores[archId].phase2 *= adjustments[archId];
        }
      });
    }
    
    // Apply phase weights: Phase 1 (50%), Phase 2 (30%), Phase 3 (15%), Phase 4 (5%)
    Object.keys(this.archetypeScores).forEach(archId => {
      const scores = this.archetypeScores[archId];
      scores.total = scores.phase1 + scores.phase2 + scores.phase3 + scores.phase4;
      scores.weighted = (scores.phase1 * 0.5) + (scores.phase2 * 0.3) + (scores.phase3 * 0.15) + (scores.phase4 * 0.05);
    });
  }

  identifyArchetypes() {
    this.calculateFinalScores();

    // Map gender-neutral archetype IDs to gender-specific ones
    const genderMapping = {
      'alpha': this.gender === 'female' ? 'alpha_female' : 'alpha',
      'alpha_xi': this.gender === 'female' ? 'alpha_xi_female' : 'alpha_xi',
      'alpha_rho': this.gender === 'female' ? 'alpha_rho' : 'alpha_rho', // Alpha-Rho is male-specific
      'dark_alpha': this.gender === 'female' ? 'dark_alpha_female' : 'dark_alpha',
      'beta': this.gender === 'female' ? 'beta_female' : 'beta',
      'beta_iota': this.gender === 'female' ? 'alpha_unicorn_female' : 'beta_iota', // Alpha-Unicorn maps to Beta-Iota pattern
      'beta_nu': this.gender === 'female' ? 'beta_nu_female' : 'beta_nu',
      'beta_manipulator': this.gender === 'female' ? 'beta_manipulator_female' : 'beta_manipulator',
      'beta_kappa': this.gender === 'female' ? 'beta_kappa_female' : 'beta_kappa',
      'gamma': this.gender === 'female' ? 'gamma_female' : 'gamma',
      'gamma_theta': this.gender === 'female' ? 'gamma_theta_female' : 'gamma_theta',
      'dark_gamma': this.gender === 'female' ? 'dark_gamma_female' : 'dark_gamma',
      'delta': this.gender === 'female' ? 'delta_female' : 'delta',
      'delta_mu': this.gender === 'female' ? 'delta_mu_female' : 'delta_mu',
      'dark_delta': this.gender === 'female' ? 'dark_delta_female' : 'dark_delta',
      'sigma': this.gender === 'female' ? 'sigma_female' : 'sigma',
      'dark_sigma_zeta': this.gender === 'female' ? 'dark_sigma_zeta_female' : 'dark_sigma_zeta',
      'omega': this.gender === 'female' ? 'omega_female' : 'omega',
      'dark_omega': this.gender === 'female' ? 'dark_omega_female' : 'dark_omega',
      'phi': this.gender === 'female' ? 'phi_female' : 'phi'
    };

    // Get all archetypes sorted by weighted score, mapping to gender-specific IDs
    const sortedArchetypes = Object.keys(this.archetypeScores)
      .map(archId => {
        const genderSpecificId = genderMapping[archId] || archId;
        const archetype = ARCHETYPES[genderSpecificId] || ARCHETYPES[archId];
        if (!archetype) return null;
        return {
          id: genderSpecificId,
          ...archetype,
          score: this.archetypeScores[archId].weighted,
          totalScore: this.archetypeScores[archId].total
        };
      })
      .filter(arch => arch !== null)
      .sort((a, b) => b.score - a.score);

    // Primary archetype (highest score)
    const primary = sortedArchetypes[0];
    
    // Secondary archetype (next highest, must be >25% of primary)
    const secondary = sortedArchetypes[1] && sortedArchetypes[1].score > (primary.score * 0.25) 
      ? sortedArchetypes[1] 
      : null;

    // Tertiary archetype (next highest, must be >15% of primary)
    const tertiary = sortedArchetypes[2] && sortedArchetypes[2].score > (primary.score * 0.15)
      ? sortedArchetypes[2]
      : null;

    // Calculate confidence levels
    const totalScore = sortedArchetypes.reduce((sum, arch) => sum + arch.score, 0);
    const primaryConfidence = totalScore > 0 ? (primary.score / totalScore) * 100 : 0;
    const secondaryConfidence = secondary && totalScore > 0 ? (secondary.score / totalScore) * 100 : 0;
    const tertiaryConfidence = tertiary && totalScore > 0 ? (tertiary.score / totalScore) * 100 : 0;

    this.analysisData.primaryArchetype = {
      ...primary,
      confidence: primaryConfidence
    };
    this.analysisData.secondaryArchetype = secondary ? {
      ...secondary,
      confidence: secondaryConfidence
    } : null;
    this.analysisData.tertiaryArchetype = tertiary ? {
      ...tertiary,
      confidence: tertiaryConfidence
    } : null;
    this.analysisData.confidenceLevels = {
      primary: primaryConfidence,
      secondary: secondaryConfidence,
      tertiary: tertiaryConfidence
    };
  }

  async nextQuestion() {
    // Check if current question has been answered
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (currentQuestion && !this.answers[currentQuestion.id]) {
      ErrorHandler.showUserError('Please select an answer before proceeding.');
      return;
    }

    if (this.currentQuestionIndex < this.questionSequence.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else {
      // End of current phase
      await this.completePhase();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  async completePhase() {
    try {
      if (this.currentPhase === 1) {
        this.analyzePhase1Results();
        await this.buildPhase2Sequence();
        this.renderCurrentQuestion();
      } else if (this.currentPhase === 2) {
        this.analyzePhase2Results();
        await this.buildPhase3Sequence();
        this.renderCurrentQuestion();
      } else if (this.currentPhase === 3) {
        this.analyzePhase3Results();
        await this.buildPhase4Sequence();
        this.renderCurrentQuestion();
      } else if (this.currentPhase === 4) {
        this.finalizeResults();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'completePhase');
      ErrorHandler.showUserError('Failed to load next phase. Please refresh the page.');
    }
  }

  analyzePhase1Results() {
    this.analysisData.phase1Results = {
      coreGroupScores: this.calculateCoreGroupScores(),
      timestamp: new Date().toISOString()
    };
  }

  analyzePhase2Results() {
    this.analysisData.phase2Results = {
      subtypeScores: this.getTopSubtypes(5),
      timestamp: new Date().toISOString()
    };
  }

  analyzePhase3Results() {
    this.analysisData.phase3Results = {
      shadowIndicators: this.identifyShadowPatterns(),
      aspirationalTraits: this.identifyAspirationalTraits(),
      timestamp: new Date().toISOString()
    };
    
    // Analyze aspirations for bias mitigation
    this.analysisData.aspirationAnalysis = this.analyzeAspirations();
  }
  
  analyzeAspirations() {
    // Collect all aspiration targets from aspiration questions
    const aspirationTargets = [];
    Object.values(this.aspirationAnswers).forEach(answerArray => {
      aspirationTargets.push(...answerArray);
    });
    
    // Count frequency of each aspiration
    const aspirationCounts = {};
    aspirationTargets.forEach(target => {
      aspirationCounts[target] = (aspirationCounts[target] || 0) + 1;
    });
    
    // Find most frequently aspired-to archetype
    const topAspiration = Object.keys(aspirationCounts)
      .sort((a, b) => aspirationCounts[b] - aspirationCounts[a])[0];
    
    // Get current top behavioral archetypes (before aspiration adjustment)
    const behavioralTop3 = Object.keys(this.archetypeScores)
      .map(archId => ({
        id: archId,
        score: this.archetypeScores[archId].phase1 + this.archetypeScores[archId].phase2
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(a => a.id);
    
    const topBehavioral = behavioralTop3[0];
    
    // Apply reverse psychology logic based on gender
    const adjustments = this.calculateAspirationAdjustments(topAspiration, topBehavioral, aspirationCounts);
    
    return {
      topAspiration: topAspiration,
      topBehavioral: topBehavioral,
      aspirationCounts: aspirationCounts,
      adjustments: adjustments,
      explanation: this.generateAspirationExplanation(topAspiration, topBehavioral, adjustments)
    };
  }
  
  calculateAspirationAdjustments(aspiredTo, topBehavioral, aspirationCounts) {
    const adjustments = {};
    
    // Get reproductive success levels for aspiration analysis
    const getReproductiveSuccess = (archId) => {
      const archetype = ARCHETYPES[archId] || ARCHETYPES[this.gender === 'female' ? `${archId}_female` : archId];
      return archetype?.reproductiveSuccess || 'unknown';
    };
    
    const aspiredSuccess = aspiredTo ? getReproductiveSuccess(aspiredTo) : 'unknown';
    const behavioralSuccess = topBehavioral ? getReproductiveSuccess(topBehavioral) : 'unknown';
    
    // Reverse psychology patterns (strongest for males, but apply to all)
    if (this.gender === 'male') {
      // Male-specific patterns (stronger reverse psychology, weighted by reproductive success)
      
      // Pattern 1: Desiring HIGH reproductive success (Alpha) → likely Beta (aspiring to what they lack)
      // Status impact: High status, but Beta lacks it and desires it
      if (aspiredTo === 'alpha' && aspiredSuccess === 'medium_high' && topBehavioral !== 'alpha' && aspirationCounts['alpha'] >= 2) {
        adjustments['beta'] = 1.3; // Boost beta score by 30% (status/status impact)
        adjustments['alpha'] = 0.85; // Reduce alpha score by 15% (they're over-reporting)
        if (topBehavioral === 'omega') {
          adjustments['beta'] = 1.4; // Even stronger if currently omega
        }
      }
      
      // Pattern 2: Desiring HIGH reproductive success (Delta) → likely Beta wanting security
      // Delta is highest reproductive success, so aspiring to it from lower positions suggests Beta
      if (aspiredTo === 'delta' && aspiredSuccess === 'high' && topBehavioral !== 'delta' && behavioralSuccess !== 'high') {
        adjustments['beta'] = 1.2; // Beta wants Delta's practical provisioning value
        adjustments['delta'] = 0.9; // Delta is aspirational, not actual
      }
      
      // Pattern 3: Comfortable with MEDIUM reproductive success (Beta) → possibly Sigma
      // Sigma is okay with low status, so being okay with Beta suggests actual independence
      if (aspirationCounts['beta'] >= 2 && aspiredSuccess === 'medium' && topBehavioral !== 'beta' && topBehavioral !== 'alpha') {
        adjustments['sigma'] = 1.25; // Boost sigma by 25% (okay with lower status = independence)
        adjustments['beta'] = 0.8; // Reduce beta reporting
      }
      
      // Pattern 4: Desiring LOW reproductive success (Sigma, Gamma, Omega) → likely actual positioning
      // If aspiring to LOW success, they might actually be there (less reverse psychology)
      if ((aspiredTo === 'sigma' || aspiredTo === 'gamma' || aspiredTo === 'omega') && aspiredSuccess === 'low') {
        // But if behavioral pattern suggests higher, they might be Beta/Omega trying to rationalize
        if (topBehavioral === 'beta' || topBehavioral === 'omega') {
          // Still likely Beta/Omega, not actual Sigma/Gamma
          adjustments[topBehavioral] = 1.15;
          adjustments[aspiredTo] = 0.85; // Aspirational rationalization
        } else {
          // Might actually be the low-success archetype
          adjustments[aspiredTo] = 1.1; // Less reverse psychology for low-success aspirations
        }
      }
      
      // Pattern 5: Desiring Beta → possibly Alpha feeling burdened OR Delta wanting harmony
      if (aspiredTo === 'beta' && topBehavioral === 'alpha') {
        adjustments['alpha'] = 1.1; // Confirm alpha, but feeling burdened by leadership
        adjustments['beta'] = 0.75; // Beta is aspirational escape, not actual
      } else if (aspiredTo === 'beta' && topBehavioral === 'delta') {
        // Delta might want Beta's harmony, but Delta is better positioned
        adjustments['delta'] = 1.05; // Confirm delta
        adjustments['beta'] = 0.9;
      }
      
      // Pattern 6: Admiring/Envious of HIGH success → likely Beta or Omega (status seeking)
      if (aspirationCounts['alpha'] >= 2 && aspiredSuccess === 'medium_high' && (topBehavioral === 'beta' || topBehavioral === 'omega')) {
        adjustments[topBehavioral] = 1.25; // Strong confirmation - status seeking behavior
        adjustments['alpha'] = 0.8; // Reduce alpha (aspirational status seeking)
      }
      
      // Pattern 7: Admiring Gamma (LOW success) → possibly Delta wanting intellectual recognition
      if (aspirationCounts['gamma'] >= 2 && aspiredSuccess === 'low' && topBehavioral === 'delta') {
        adjustments['delta'] = 1.15; // Confirm delta - wants recognition for practical work
        adjustments['gamma'] = 0.85; // Gamma is aspirational, not actual
      }
      
      // Pattern 8: Multiple scattered aspirations → likely Beta (unclear identity, status confusion)
      const uniqueAspirations = Object.keys(aspirationCounts).length;
      if (uniqueAspirations >= 3 && topBehavioral !== 'gamma' && topBehavioral !== 'sigma') {
        adjustments['beta'] = 1.2; // Scattered aspirations suggest Beta confusion about status
      }
    } else {
      // Female-specific patterns (less pronounced reverse psychology, but still present)
      
      // Pattern 1: Desiring Alpha-Female (HIGH status) → possibly Beta-Female
      if (aspiredTo === 'alpha' && topBehavioral !== 'alpha' && aspirationCounts['alpha'] >= 2) {
        adjustments['beta'] = 1.2; // Boost beta
        adjustments['alpha'] = 0.85;
      }
      
      // Pattern 2: Comfortable with Beta → possibly Sigma-Female
      if (aspirationCounts['beta'] >= 2 && topBehavioral !== 'beta') {
        adjustments['sigma'] = 1.1;
      }
      
      // Pattern 3: Multiple aspirations → likely Beta-Female
      const uniqueAspirations = Object.keys(aspirationCounts).length;
      if (uniqueAspirations >= 3) {
        adjustments['beta'] = 1.1;
      }
    }
    
    return adjustments;
  }
  
  generateAspirationExplanation(aspiredTo, topBehavioral, adjustments) {
    if (!aspiredTo || Object.keys(adjustments).length === 0) {
      return null;
    }
    
    const aspirationAnalysis = this.analysisData.aspirationAnalysis;
    const aspirationCounts = aspirationAnalysis ? aspirationAnalysis.aspirationCounts : {};
    
    const genderText = this.gender === 'male' ? 'For males' : 'For females';
    let explanation = `${genderText}, aspiration patterns can reveal self-reporting bias. `;
    
    if (aspiredTo === 'alpha' && adjustments['beta']) {
      explanation += `You aspire to Alpha qualities, which often indicates you're actually Beta - we desire what we lack. Your behavioral patterns suggest ${topBehavioral}, but your aspirations point to Beta.`;
    } else if (adjustments['sigma'] && Object.keys(aspirationCounts).some(k => k === 'beta' && aspirationCounts[k] >= 2)) {
      explanation += `Being comfortable with Beta identification suggests you may actually be Sigma - comfortable with what others reject indicates independence.`;
    } else if (aspiredTo === 'sigma' && adjustments['beta']) {
      explanation += `Desiring Sigma independence often indicates Beta or Omega trying to escape social positioning, rather than genuine Sigma orientation.`;
    } else {
      explanation += `Your aspirations for ${aspiredTo} differ from your behavioral patterns (${topBehavioral}), suggesting some self-reporting bias.`;
    }
    
    return explanation;
  }

  calculateCoreGroupScores() {
    const groupScores = {};
    Object.keys(CORE_GROUPS).forEach(groupId => {
      groupScores[groupId] = CORE_GROUPS[groupId].reduce((sum, archId) => {
        return sum + (this.archetypeScores[archId]?.phase1 || 0);
      }, 0);
    });
    return groupScores;
  }

  formatSocialProportion(value) {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      return null;
    }
    return `${value.toFixed(1)}%`;
  }

  getSpreadInfo(archetype) {
    if (!archetype || !ARCHETYPE_SPREAD_MAP) {
      return null;
    }
    const spreadKey = this.gender === 'female' ? archetype.name : `${archetype.name} Male`;
    return ARCHETYPE_SPREAD_MAP[spreadKey] || null;
  }

  getTopSubtypes(count) {
    return Object.keys(this.archetypeScores)
      .map(archId => ({
        id: archId,
        name: ARCHETYPES[archId]?.name,
        score: this.archetypeScores[archId].phase2
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  identifyShadowPatterns() {
    return Object.keys(this.archetypeScores)
      .filter(archId => ARCHETYPES[archId]?.isShadow)
      .map(archId => ({
        id: archId,
        name: ARCHETYPES[archId].name,
        score: this.archetypeScores[archId].phase3
      }))
      .filter(arch => arch.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  identifyAspirationalTraits() {
    // Look for answers marked as aspirational in Phase 3
    const aspirationalArchetypes = [];
    PHASE_3_QUESTIONS.forEach(q => {
      if (q.options) {
        q.options.forEach((opt, idx) => {
          if (opt.isAspirational && this.answers[q.id]?.selectedIndex === idx) {
            opt.archetypes.forEach(archId => {
              if (!aspirationalArchetypes.find(a => a.id === archId)) {
                aspirationalArchetypes.push({
                  id: archId,
                  name: ARCHETYPES[archId]?.name,
                  description: ARCHETYPES[archId]?.growthEdge
                });
              }
            });
          }
        });
      }
    });
    return aspirationalArchetypes;
  }

  async finalizeResults() {
    await this.loadArchetypeData(); // Ensure data is loaded
    this.identifyArchetypes();
    this.analysisData.allAnswers = { ...this.answers };
    // Store full question objects with text for export
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question || q.questionText || '',
      phase: q.phase,
      category: q.category,
      archetype: q.archetype,
      dimension: q.dimension
    }));
    this.renderResults();
    this.saveProgress();
    
    // Display debug report if in development mode
    if (window.location.search.includes('debug=true')) {
      this.debugReporter.displayReport('debug-report');
    }
  }

  renderResults() {
    const container = document.getElementById('resultsContent');
    if (!container) {
      // Fallback to questionContainer if resultsContent doesn't exist
      const fallbackContainer = document.getElementById('questionContainer');
      if (fallbackContainer) {
        fallbackContainer.innerHTML = '';
        return this.renderResultsToContainer(fallbackContainer);
      }
      return;
    }
    return this.renderResultsToContainer(container);
  }

  renderResultsToContainer(container) {

    const primary = this.analysisData.primaryArchetype;
    const secondary = this.analysisData.secondaryArchetype;
    const tertiary = this.analysisData.tertiaryArchetype;
    const primarySpread = this.getSpreadInfo(primary);
    const secondarySpread = this.getSpreadInfo(secondary);
    const tertiarySpread = this.getSpreadInfo(tertiary);
    const primaryPopulation = this.formatSocialProportion(primarySpread?.socialProportion);
    const secondaryPopulation = this.formatSocialProportion(secondarySpread?.socialProportion);
    const tertiaryPopulation = this.formatSocialProportion(tertiarySpread?.socialProportion);

    let resultsHTML = `
      <div class="results-container" style="max-width: 900px; margin: 0 auto;">
        <h2 style="color: var(--brand); text-align: center; margin-bottom: 2rem;">Your Archetype Profile</h2>
        
        <div style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: var(--muted); line-height: 1.7; font-size: 0.95rem;">
            <strong style="color: var(--brand);">Important:</strong> This is a descriptive tool, not a diagnostic or predictive instrument. 
            Archetypes are fluid; people contain multitudes. No archetype is superior to another. 
            Results reflect current patterns, not fixed identity.
          </p>
        </div>

        <!-- Primary Archetype -->
        <div class="archetype-card primary" style="background: rgba(255, 255, 255, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border: 2px solid var(--brand);">
          <h3 style="color: var(--brand); margin-top: 0; font-size: 1.5rem;">Primary Archetype: ${SecurityUtils.sanitizeHTML(primary.name || '')}</h3>
          ${primary.explanation ? `<div style="background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin: 1rem 0;"><p style="margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.6; font-style: italic;">${primary.explanation}</p></div>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;"><strong>Social Role:</strong> ${SecurityUtils.sanitizeHTML(primary.socialRole || '')}</p>
          ${primaryPopulation ? `<p style="color: var(--muted); margin: 0.5rem 0 1rem; line-height: 1.7;"><strong>Estimated Population Share:</strong> ${primaryPopulation}</p>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;">${SecurityUtils.sanitizeHTML(primary.description || '')}</p>
          
          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Key Characteristics:</h4>
            <ul style="color: var(--muted); line-height: 1.8;">
              ${primary.behavioralTraits.map(trait => `<li>${trait.charAt(0).toUpperCase() + trait.slice(1)}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Core Motivations:</h4>
            <ul style="color: var(--muted); line-height: 1.8;">
              ${primary.motivations.map(mot => `<li>${mot.charAt(0).toUpperCase() + mot.slice(1)}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Stress Response:</h4>
            <p style="color: var(--muted); line-height: 1.7;">${primary.stressResponse}</p>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Growth Edge:</h4>
            <p style="color: var(--muted); line-height: 1.7;">${primary.growthEdge}</p>
          </div>

          ${primary.archetypalNarrative ? `
          <div style="margin-top: 1.5rem; background: rgba(100, 0, 0, 0.15); border-left: 4px solid #cc0000; border-radius: var(--radius); padding: 1.5rem;">
            <h4 style="color: #cc0000; margin-top: 0; margin-bottom: 1rem;">Archetypal Narrative: The Brutal Truth</h4>
            <p style="color: var(--muted); line-height: 1.8; font-size: 1rem; margin: 0; font-style: italic;">
              ${primary.archetypalNarrative}
            </p>
            <p style="color: var(--muted); font-size: 0.85rem; margin-top: 1rem; margin-bottom: 0; line-height: 1.6; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem;">
              <em>Note: This is an archetypal narrative - a generic but honest representation of the typical life pattern for this classification. It reflects common trajectories, not personal destiny. Archetypes describe patterns, not fixed fate. Understanding your pattern is the first step toward conscious change if you choose it.</em>
            </p>
          </div>
          ` : ''}

          ${primary.reproductiveSuccess && primary.reproductiveDescription ? `
          <div style="margin-top: 1.5rem; background: rgba(0, 100, 200, 0.1); border-left: 3px solid #0066cc; border-radius: var(--radius); padding: 1rem;">
            <h4 style="color: #0066cc; margin-bottom: 0.75rem;">Reproductive/Mating Success Profile</h4>
            <p style="color: var(--muted); line-height: 1.7; margin: 0.5rem 0;">
              <strong>Level:</strong> ${primary.reproductiveSuccess === 'high' ? 'High' : primary.reproductiveSuccess === 'medium_high' ? 'Medium-High' : primary.reproductiveSuccess === 'medium' ? 'Medium' : primary.reproductiveSuccess === 'low' ? 'Low' : primary.reproductiveSuccess}
            </p>
            <p style="color: var(--muted); line-height: 1.7; margin: 0.5rem 0; font-size: 0.95rem;">
              ${primary.reproductiveDescription}
            </p>
            <p style="color: var(--muted); font-size: 0.85rem; font-style: italic; margin-top: 0.75rem; margin-bottom: 0;">
              Note: Reproductive success patterns reflect typical mate access and relationship dynamics for this archetype, not a judgment of value. Each archetype has unique contributions and challenges.
            </p>
          </div>
          ` : ''}

          ${primary.jungianEquivalent || primary.vedicEquivalent || primary.greekPantheon || primary.tarotCard ? `
          <div style="margin-top: 1.5rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.75rem;">Cross-Paradigm Equivalents:</h4>
            <div style="color: var(--muted); line-height: 1.8; font-size: 0.9rem;">
              ${primary.jungianEquivalent ? `<p style="margin: 0.5rem 0;"><strong>Jungian/Q-KWML:</strong> ${primary.jungianEquivalent}</p>` : ''}
              ${primary.vedicEquivalent ? `<p style="margin: 0.5rem 0;"><strong>Vedic:</strong> ${primary.vedicEquivalent}</p>` : ''}
              ${primary.greekPantheon ? `<p style="margin: 0.5rem 0;"><strong>Greek Pantheon:</strong> ${primary.greekPantheon}</p>` : ''}
              ${primary.tarotCard ? `<p style="margin: 0.5rem 0;"><strong>Tarot Card:</strong> ${primary.tarotCard}</p>` : ''}
            </div>
            <p style="color: var(--muted); font-size: 0.85rem; font-style: italic; margin-top: 0.75rem; margin-bottom: 0;">
              These equivalents help translate this archetype across different psychological and mythological frameworks.
            </p>
          </div>
          ` : ''}
        </div>
    `;

      // Secondary Archetype
    if (secondary) {
      resultsHTML += `
        <div class="archetype-card secondary" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Secondary Influence: ${SecurityUtils.sanitizeHTML(secondary.name || '')}</h3>
          ${secondary.explanation ? `<div style="background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin: 1rem 0;"><p style="margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.6; font-style: italic;">${secondary.explanation}</p></div>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;"><strong>Social Role:</strong> ${SecurityUtils.sanitizeHTML(secondary.socialRole || '')}</p>
          ${secondaryPopulation ? `<p style="color: var(--muted); margin: 0.5rem 0 1rem; line-height: 1.7;"><strong>Estimated Population Share:</strong> ${secondaryPopulation}</p>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;">${SecurityUtils.sanitizeHTML(secondary.description || '')}</p>
          <p style="color: var(--muted); margin-top: 1rem; font-style: italic; font-size: 0.9rem;">
            This archetype influences you in specific contexts or situations, complementing your primary archetype.
          </p>
        </div>
      `;
    }

    // Tertiary Archetype
    if (tertiary) {
      resultsHTML += `
        <div class="archetype-card tertiary" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Tertiary Influence: ${SecurityUtils.sanitizeHTML(tertiary.name || '')}</h3>
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;"><strong>Social Role:</strong> ${SecurityUtils.sanitizeHTML(tertiary.socialRole || '')}</p>
          ${tertiaryPopulation ? `<p style="color: var(--muted); margin: 0.5rem 0 1rem; line-height: 1.7;"><strong>Estimated Population Share:</strong> ${tertiaryPopulation}</p>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;">${SecurityUtils.sanitizeHTML(tertiary.description || '')}</p>
          <p style="color: var(--muted); margin-top: 1rem; font-style: italic; font-size: 0.9rem;">
            This archetype may emerge under stress, represent aspirational qualities, or appear in specific life domains.
          </p>
        </div>
      `;
    }

    // Shadow Patterns
    const shadowPatterns = this.analysisData.phase3Results?.shadowIndicators || [];
    if (shadowPatterns.length > 0) {
      resultsHTML += `
        <div class="shadow-section" style="background: rgba(255, 0, 0, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid #ff4444;">
          <h3 style="color: #ff4444; margin-top: 0;">Shadow Patterns</h3>
          <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">
            These patterns may emerge under stress or represent areas for healing and integration.
          </p>
          <ul style="color: var(--muted); line-height: 1.8;">
            ${shadowPatterns.map(shadow => `<li><strong>${SecurityUtils.sanitizeHTML(shadow.name || '')}:</strong> ${SecurityUtils.sanitizeHTML(ARCHETYPES[shadow.id]?.description || '')}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Aspiration Analysis & Bias Mitigation
    const aspirationAnalysis = this.analysisData.aspirationAnalysis;
    if (aspirationAnalysis && aspirationAnalysis.explanation) {
      resultsHTML += `
        <div class="aspiration-analysis-section" style="background: rgba(255, 184, 0, 0.15); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid var(--brand);">
          <h3 style="color: var(--brand); margin-top: 0;">Aspiration Analysis (Bias Mitigation)</h3>
          <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">
            <strong>Top Aspiration:</strong> ${aspirationAnalysis.topAspiration || 'None identified'}<br>
            <strong>Top Behavioral Pattern:</strong> ${aspirationAnalysis.topBehavioral || 'None identified'}
          </p>
          <div style="background: rgba(255, 255, 255, 0.1); border-radius: var(--radius); padding: 1rem; margin-top: 1rem;">
            <p style="color: var(--muted); line-height: 1.7; margin: 0; font-style: italic;">
              ${aspirationAnalysis.explanation}
            </p>
          </div>
          <p style="color: var(--muted); font-size: 0.9rem; margin-top: 1rem; margin-bottom: 0; line-height: 1.6;">
            <em>Note: Your archetype classification has been adjusted based on aspiration patterns to mitigate self-reporting bias. This reverse psychology methodology helps reveal actual archetype positioning versus aspirational reporting.</em>
          </p>
        </div>
      `;
    }

    // Aspirational Traits
    const aspirational = this.analysisData.phase3Results?.aspirationalTraits || [];
    if (aspirational.length > 0) {
      resultsHTML += `
        <div class="aspirational-section" style="background: rgba(0, 255, 0, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid #44ff44;">
          <h3 style="color: #44ff44; margin-top: 0;">Developmental Opportunities</h3>
          <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">
            Areas you identified as aspirational - qualities you'd like to develop further.
          </p>
          <ul style="color: var(--muted); line-height: 1.8;">
            ${aspirational.map(asp => `<li><strong>${SecurityUtils.sanitizeHTML(asp.name || '')}:</strong> ${SecurityUtils.sanitizeHTML(asp.description || '')}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    resultsHTML += `
      <div class="panel panel-outline-accent" style="margin-bottom: 2rem;">
        <h3 class="panel-title">Explore the Full Archetype Spread</h3>
        <p class="panel-text">Compare your results to the full archetype table, including cross-paradigm equivalents and population proportions.</p>
        <a href="archetype-spread.html" class="btn btn-secondary">View Full Archetype Table</a>
      </div>
    `;

    resultsHTML += `</div>`;

    // Sanitize results HTML before rendering
    SecurityUtils.safeInnerHTML(container, resultsHTML);
    this.showResultsContainer();
  }

  updateNavigation() {
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    const questionCounter = document.getElementById('questionCounter');
    if (questionCounter) {
      questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length} (Phase ${this.currentPhase})`;
    }

    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      if (this.currentQuestionIndex > 0) {
        prevBtn.classList.remove('hidden');
      } else {
        prevBtn.classList.add('hidden');
      }
    }
  }

  showQuestionContainer() {
    const questionContainer = document.getElementById('questionContainer');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const introSection = document.querySelector('.intro-section');
    const actionButtonsSection = document.getElementById('actionButtonsSection');
    
    if (questionContainer) questionContainer.classList.remove('hidden');
    if (questionnaireSection) questionnaireSection.classList.add('active');
    if (resultsContainer) {
      resultsContainer.classList.add('hidden');
      resultsContainer.classList.remove('active');
    }
    if (introSection) introSection.classList.add('hidden');
    if (actionButtonsSection) actionButtonsSection.classList.add('hidden');
  }

  showResultsContainer() {
    const questionContainer = document.getElementById('questionContainer');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const introSection = document.querySelector('.intro-section');
    
    if (questionContainer) questionContainer.classList.add('hidden');
    if (questionnaireSection) questionnaireSection.classList.remove('active');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.classList.add('active');
    }
    if (introSection) introSection.classList.add('hidden');
  }

  saveProgress() {
    try {
      const progress = {
        currentPhase: this.currentPhase,
        currentQuestionIndex: this.currentQuestionIndex,
        gender: this.gender,
        iqBracket: this.iqBracket,
        answers: this.answers,
        aspirationAnswers: this.aspirationAnswers,
        archetypeScores: this.archetypeScores,
        analysisData: this.analysisData
      };
      this.dataStore.save('progress', progress);
    } catch (error) {
      this.debugReporter.logError(error, 'saveProgress');
    }
  }

  async loadStoredData() {
    try {
      const progress = this.dataStore.load('progress');
      if (!progress) return;

      const hasProgress = (progress.currentPhase && progress.currentPhase > 0)
        || progress.gender
        || progress.iqBracket
        || (progress.answers && Object.keys(progress.answers).length > 0);
      if (!hasProgress) return;

      this.currentPhase = progress.currentPhase || 0;
      this.currentQuestionIndex = progress.currentQuestionIndex || 0;
      this.gender = progress.gender || null;
      this.iqBracket = progress.iqBracket || progress.analysisData?.iqBracket || null;
      this.answers = progress.answers || {};
      this.aspirationAnswers = progress.aspirationAnswers || {};
      this.archetypeScores = progress.archetypeScores || {};
      this.analysisData = progress.analysisData || this.analysisData;
      
      // If gender not selected, show gender selection
      if (!this.gender || this.currentPhase === 0) {
        this.showGenderSelection();
        return;
      }
      
      // If IQ bracket not selected, show IQ bracket selection
      if (!this.iqBracket || this.currentPhase === 0.5) {
        this.showIQBracketSelection();
        return;
      }
      
      // Rebuild question sequence based on phase
      if (this.currentPhase === 1 || (this.currentPhase > 0 && this.currentPhase < 2)) {
        this.currentPhase = 1;
        await this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        await this.buildPhase2Sequence();
      } else if (this.currentPhase === 3) {
        await this.buildPhase3Sequence();
      } else if (this.currentPhase === 4) {
        await this.buildPhase4Sequence();
      }

      // If assessment is in progress, show question container
      if (this.currentPhase <= 4 && this.questionSequence.length > 0) {
        this.renderCurrentQuestion();
        this.showQuestionContainer();
      } else if (this.analysisData.primaryArchetype) {
        this.renderResults();
        this.showResultsContainer();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
    }
  }

  resetAssessment() {
    // Clear all stored data
    if (this.dataStore) {
      this.dataStore.clear();
    }
    sessionStorage.removeItem('archetypeAssessmentProgress');
    localStorage.removeItem('archetype-assessment');
    
    // Reset all state to initial values
    this.currentPhase = 0; // Start at gender selection
    this.currentQuestionIndex = 0;
    this.gender = null;
    this.iqBracket = null;
    this.answers = {};
    this.aspirationAnswers = {};
    this.questionSequence = [];
    this.initializeScores();
    this.analysisData = {
      timestamp: new Date().toISOString(),
      gender: null,
      iqBracket: null,
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      aspirationAnalysis: {},
      primaryArchetype: null,
      secondaryArchetype: null,
      tertiaryArchetype: null,
      confidenceLevels: {},
      allAnswers: {},
      questionSequence: []
    };
    
    // Hide results and questionnaire, show intro section
    const questionContainer = document.getElementById('questionContainer');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('resultsContainer');
    const introSection = document.querySelector('.intro-section');
    const actionButtonsSection = document.querySelector('.action-buttons')?.closest('.content-section');
    
    if (questionContainer) {
      questionContainer.classList.add('hidden');
      questionContainer.innerHTML = '';
    }
    if (questionnaireSection) {
      questionnaireSection.classList.add('hidden');
      questionnaireSection.classList.remove('active');
    }
    if (resultsContainer || resultsSection) {
      const container = resultsContainer || resultsSection;
      if (container) {
        container.classList.add('hidden');
        container.classList.remove('active');
      }
    }
    if (introSection) introSection.classList.remove('hidden');
    if (actionButtonsSection) actionButtonsSection.classList.remove('hidden');
  }

  exportAnalysis(format) {
    if (!this.analysisData.primaryArchetype) {
      alert('Please complete the assessment before exporting.');
      return;
    }

    if (format === 'json') {
      const json = exportJSON(this.analysisData, 'modern-archetype-identification', 'Modern Archetype Identification');
      downloadFile(json, `archetype-analysis-${Date.now()}.json`, 'application/json');
    } else if (format === 'csv') {
      // Use shared export utility to ensure question-answer pairs are included
      // Note: Need to add archetype support to export-utils.js or use generic format
      const csv = exportForAIAgent(this.analysisData, 'modern-archetype-identification', 'Modern Archetype Identification');
      downloadFile(csv, `archetype-analysis-${Date.now()}.csv`, 'text/csv');
    }
  }

  exportExecutiveBrief() {
    const brief = exportExecutiveBrief(this.analysisData, 'modern-archetype-identification', 'Modern Archetype Identification');
    downloadFile(brief, `archetype-executive-brief-${Date.now()}.txt`, 'text/plain');
  }
}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.archetypeEngine = new ArchetypeEngine();
  });
} else {
  // DOM already ready, but wait a tick to ensure all elements are available
  setTimeout(() => {
    window.archetypeEngine = new ArchetypeEngine();
  }, 0);
}

