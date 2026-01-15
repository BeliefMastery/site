// Diagnosis Engine - Version 2.1
// Main questionnaire logic and calculation system
// Enhanced with lazy loading, error handling, and debug reporting
//
// FUTURE FIREBASE INTEGRATION NOTES:
// - Currently uses LocalStorage/SessionStorage (public access, no auth)
// - Planned: Firebase Anonymous Auth for guest usage
// - Planned: Custom login system for professional licensing
// - Architecture prepared for storage abstraction layer (see docs/FIREBASE_INTEGRATION_PLAN.md)
// - Current implementation remains insecure/public - suitable for educational/demo purposes
//
import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

// Data modules - will be loaded lazily
let DSM5_CATEGORIES, QUESTION_TEMPLATES, VALIDATION_PAIRS, SCORING_THRESHOLDS;
let SUB_INQUIRY_QUESTIONS, COMORBIDITY_GROUPS, COMORBIDITY_REFINEMENT_QUESTIONS;
let MULTI_BRANCHING_THRESHOLDS, REFINED_QUESTIONS, DIFFERENTIAL_QUESTIONS;
let CATEGORY_GUIDE_QUESTIONS, CATEGORY_DESCRIPTIONS;
let TREATMENT_DATABASE;

/**
 * Diagnosis Engine - Multi-category DSM-5 diagnostic assessment with guide mode
 */
export class DiagnosisEngine {
  /**
   * Initialize the diagnosis engine
   */
  constructor() {
    this.selectedCategories = [];
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.refinedQuestionSequence = [];
    this.currentStage = 'selection'; // selection, questionnaire, results
    this.guideMode = false;
    this.guideAnswers = {};
    this.currentGuideQuestion = 0;
    this.suggestedCategories = [];
    this.refinementRequested = false;
    this.multiBranchingDetected = false;
    this.debugMode = window.location.search.includes('debug=true');
    this.debugLog = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      categories: [],
      answers: {},
      scores: {},
      probabilities: {},
      conclusionVector: {}
    };
    
    // Initialize debug reporter (integrate with existing debug system)
    this.debugReporter = createDebugReporter('DiagnosisEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('diagnosis-assessment', '1.0.0');
    
    this.init();
  }

  /**
   * Log debug information (integrated with shared debug reporter)
   * @param {string} message - Debug message
   * @param {*} data - Optional debug data
   */
  logDebug(message, data = null) {
    if (!this.debugMode && !window.location.search.includes('debug=true')) return;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message,
      data: data,
      state: {
        currentQuestionIndex: this.currentQuestionIndex,
        questionSequenceLength: this.questionSequence.length,
        refinedQuestionSequenceLength: this.refinedQuestionSequence ? this.refinedQuestionSequence.length : 0,
        currentStage: this.currentStage,
        selectedCategories: [...this.selectedCategories]
      }
    };
    this.debugLog.push(logEntry);
    
    // Use shared debug reporter
    this.debugReporter.logEvent('DiagnosisEngine', message, data || {});
    
    // Update debug panel if it exists
    this.updateDebugPanel();
  }

  updateDebugPanel() {
    const debugLogElement = document.getElementById('debugLog');
    if (!debugLogElement) return;
    
    let html = '';
    this.debugLog.slice(-50).forEach(entry => {
      const stateInfo = entry.state ? 
        ` | Stage: ${entry.state.currentStage} | Q: ${entry.state.currentQuestionIndex}/${entry.state.questionSequenceLength}` : '';
      html += `
        <div class="debug-entry">
          <div class="debug-timestamp">[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.message}${stateInfo}</div>
          ${entry.data ? `<div class="debug-data">${JSON.stringify(entry.data, null, 2)}</div>` : ''}
        </div>
      `;
    });
    SecurityUtils.safeInnerHTML(debugLogElement, html);
    debugLogElement.scrollTop = debugLogElement.scrollHeight;
  }

  /**
   * Initialize the engine
   */
  init() {
    this.renderCategorySelection().catch(error => {
      this.debugReporter.logError(error, 'init');
    });
    this.attachEventListeners();
    this.loadStoredData().catch(error => {
      this.debugReporter.logError(error, 'init');
    });
  }

  /**
   * Load diagnosis data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadDiagnosisData() {
    if (DSM5_CATEGORIES && QUESTION_TEMPLATES) {
      return; // Already loaded
    }

    try {
      // Load DSM-5 categories and questions data
      const dsm5Module = await loadDataModule(
        './dsm5-data/index.js',
        'DSM-5 Data'
      );
      DSM5_CATEGORIES = dsm5Module.DSM5_CATEGORIES;
      QUESTION_TEMPLATES = dsm5Module.QUESTION_TEMPLATES;
      VALIDATION_PAIRS = dsm5Module.VALIDATION_PAIRS;
      SCORING_THRESHOLDS = dsm5Module.SCORING_THRESHOLDS;
      SUB_INQUIRY_QUESTIONS = dsm5Module.SUB_INQUIRY_QUESTIONS;
      COMORBIDITY_GROUPS = dsm5Module.COMORBIDITY_GROUPS;
      COMORBIDITY_REFINEMENT_QUESTIONS = dsm5Module.COMORBIDITY_REFINEMENT_QUESTIONS;
      MULTI_BRANCHING_THRESHOLDS = dsm5Module.MULTI_BRANCHING_THRESHOLDS;
      REFINED_QUESTIONS = dsm5Module.REFINED_QUESTIONS;
      DIFFERENTIAL_QUESTIONS = dsm5Module.DIFFERENTIAL_QUESTIONS;

      // Load category guide data
      const categoryGuideModule = await loadDataModule(
        './dsm5-data/category-guide.js',
        'Category Guide'
      );
      CATEGORY_GUIDE_QUESTIONS = categoryGuideModule.CATEGORY_GUIDE_QUESTIONS;
      CATEGORY_DESCRIPTIONS = categoryGuideModule.CATEGORY_DESCRIPTIONS;

      // Load treatment database
      const treatmentModule = await loadDataModule(
        './treatment-database.js',
        'Treatment Database'
      );
      TREATMENT_DATABASE = treatmentModule.TREATMENT_DATABASE;

      this.debugReporter.logEvent('DataLoader', 'All diagnosis data loaded successfully');
    } catch (error) {
      this.debugReporter.logError(error, 'loadDiagnosisData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  /**
   * Render category selection screen
   * @returns {Promise<void>}
   */
  async renderCategorySelection() {
    try {
      await this.loadDiagnosisData();
      
      const grid = document.getElementById('categoryGrid');
      if (!grid) {
        ErrorHandler.showUserError('Category grid not found.');
        return;
      }
      
      SecurityUtils.safeInnerHTML(grid, '');
      
      Object.keys(DSM5_CATEGORIES).forEach(categoryKey => {
        const category = DSM5_CATEGORIES[categoryKey];
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.category = categoryKey;
        
        // Check if this category was suggested by the guide
        const isSuggested = this.suggestedCategories.includes(categoryKey);
        if (isSuggested) {
          card.classList.add('suggested');
        }
        
        // Sanitize category name for display
        const categoryName = SecurityUtils.sanitizeHTML(category.name);
        const disorderCount = Object.keys(category.disorders).length;
        
        SecurityUtils.safeInnerHTML(card, `
          <h3>${categoryName}</h3>
          <p>${disorderCount} disorder${disorderCount !== 1 ? 's' : ''} available</p>
          ${isSuggested ? '<p class="suggested-badge">✓ Suggested for you</p>' : ''}
        `);
        card.addEventListener('click', () => this.toggleCategory(categoryKey, card));
        grid.appendChild(card);
      });
    } catch (error) {
      this.debugReporter.logError(error, 'renderCategorySelection');
      ErrorHandler.showUserError('Failed to render category selection. Please refresh the page.');
    }
  }

  /**
   * Start category guide mode
   * @returns {Promise<void>}
   */
  async startGuide() {
    try {
      await this.loadDiagnosisData();
      
      this.guideMode = true;
      this.guideAnswers = {};
      this.currentGuideQuestion = 0;
      this.suggestedCategories = [];
      
      // Hide category selection, show guide
      const categorySelection = document.getElementById('categorySelection');
      if (categorySelection) categorySelection.classList.add('hidden');
      
      this.renderGuideQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'startGuide');
      ErrorHandler.showUserError('Failed to start guide. Please try again.');
    }
  }

  /**
   * Render guide question
   * @returns {Promise<void>}
   */
  async renderGuideQuestion() {
    try {
      await this.loadDiagnosisData(); // Ensure guide questions are loaded
      
      const container = document.getElementById('categorySelection');
      if (!container) {
        this.logDebug('ERROR: categorySelection container not found in renderGuideQuestion');
        ErrorHandler.showUserError('Category selection container not found.');
        return;
      }
      
      const question = CATEGORY_GUIDE_QUESTIONS?.[this.currentGuideQuestion];
      if (!question) {
        this.logDebug('ERROR: Guide question not found at index', this.currentGuideQuestion);
        await this.completeGuide();
        return;
      }
      
      const isLast = this.currentGuideQuestion === CATEGORY_GUIDE_QUESTIONS.length - 1;
      
      container.classList.remove('hidden');
      
      // Sanitize question text and warning for display
      const questionText = SecurityUtils.sanitizeHTML(question.question || '');
      const warningText = question.warning ? SecurityUtils.sanitizeHTML(question.warning) : '';
      
      // questionText and warningText are already sanitized above
      SecurityUtils.safeInnerHTML(container, `
      <div class="guide-container">
        <h2>🧭 Category Selection Guide</h2>
        <p>Answer a few brief questions to help identify the most relevant diagnostic categories for you.</p>
        
        <div class="guide-question">
          <h3>${questionText}</h3>
          ${warningText ? `<div class="warning-box"><strong>⚠️ Important:</strong> ${warningText}</div>` : ''}
          
          <div class="guide-options">
            <button class="btn btn-primary" id="guideYes">
              ✓ Yes
            </button>
            <button class="btn btn-secondary" id="guideNo">
              ✗ No
            </button>
            <button class="btn btn-secondary" id="guideUnsure">
              ? Not Sure / Sometimes
            </button>
          </div>
        </div>
        
        <div class="guide-navigation">
          <button class="btn btn-secondary" id="guideBack" ${this.currentGuideQuestion === 0 ? 'disabled' : ''}>← Previous</button>
          <div class="guide-counter">
            Question ${this.currentGuideQuestion + 1} of ${CATEGORY_GUIDE_QUESTIONS.length}
          </div>
          ${isLast ? '<button class="btn btn-primary" id="guideComplete">See Recommended Categories →</button>' : '<button class="btn btn-secondary" id="guideSkip">Skip to Categories →</button>'}
        </div>
      </div>
    `);
    
    // Attach event listeners with error handling
    const yesBtn = document.getElementById('guideYes');
    const noBtn = document.getElementById('guideNo');
    const unsureBtn = document.getElementById('guideUnsure');
    
      if (yesBtn) yesBtn.addEventListener('click', () => this.answerGuide(true));
      if (noBtn) noBtn.addEventListener('click', () => this.answerGuide(false));
      if (unsureBtn) unsureBtn.addEventListener('click', () => this.answerGuide('unsure'));
      
      const backBtn = document.getElementById('guideBack');
      if (backBtn && !backBtn.disabled) {
        backBtn.addEventListener('click', () => this.prevGuideQuestion());
      }
    
      if (isLast) {
        const completeBtn = document.getElementById('guideComplete');
        if (completeBtn) completeBtn.addEventListener('click', () => this.completeGuide());
      } else {
        const skipBtn = document.getElementById('guideSkip');
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipGuide());
      }
      
      // Focus management for accessibility
      const firstButton = container.querySelector('button');
      if (firstButton) {
        DOMUtils.focusElement(firstButton);
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderGuideQuestion');
      ErrorHandler.showUserError('Failed to render guide question. Please refresh the page.');
    }
  }

  /**
   * Answer guide question and proceed to next
   * @param {boolean|string} answer - Guide answer (true, false, or 'unsure')
   * @returns {Promise<void>}
   */
  async answerGuide(answer) {
    try {
      await this.loadDiagnosisData(); // Ensure guide questions are loaded
      
      const question = CATEGORY_GUIDE_QUESTIONS?.[this.currentGuideQuestion];
      if (!question) {
        this.logDebug('ERROR: Guide question not found at index', this.currentGuideQuestion);
        await this.completeGuide();
        return;
      }
      
      this.guideAnswers[question.id] = answer;
      
      // If answered yes or unsure, add categories to suggested
      if (answer === true || answer === 'unsure') {
        if (question.categories) {
          question.categories.forEach(catKey => {
            if (!this.suggestedCategories.includes(catKey)) {
              this.suggestedCategories.push(catKey);
            }
          });
        }
      }
      
      // Move to next question
      this.currentGuideQuestion++;
      if (this.currentGuideQuestion < CATEGORY_GUIDE_QUESTIONS.length) {
        await this.renderGuideQuestion();
      } else {
        await this.completeGuide();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'answerGuide');
      ErrorHandler.showUserError('Failed to process guide answer. Please try again.');
    }
  }

  /**
   * Move to previous guide question
   * @returns {Promise<void>}
   */
  async prevGuideQuestion() {
    if (this.currentGuideQuestion > 0) {
      this.currentGuideQuestion--;
      await this.renderGuideQuestion();
    }
  }

  /**
   * Skip guide and proceed to category selection
   * @returns {Promise<void>}
   */
  async skipGuide() {
    await this.completeGuide();
  }

  /**
   * Complete guide and show category selection
   * @returns {Promise<void>}
   */
  async completeGuide() {
    try {
      await this.loadDiagnosisData(); // Ensure category data is loaded
      
      this.guideMode = false;
      
      // Show category selection with suggestions highlighted
      const container = document.getElementById('categorySelection');
      if (!container) {
        this.logDebug('ERROR: categorySelection container not found in completeGuide');
        ErrorHandler.showUserError('Category selection container not found.');
        return;
      }
      
      container.classList.remove('hidden');
      
      // Generate recommendation summary
      const recommendationText = this.suggestedCategories.length > 0 
        ? this.generateRecommendationSummary()
        : 'Based on your answers, we recommend exploring categories that match your concerns.';
      
      // Sanitize recommendation text
      const sanitizedRecommendation = SecurityUtils.sanitizeHTML(recommendationText);
      const categoryNames = this.suggestedCategories.map(cat => {
        const catDesc = CATEGORY_DESCRIPTIONS?.[cat];
        return SecurityUtils.sanitizeHTML(catDesc?.name || cat);
      }).join(', ');
      
      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(container, `
      <div class="section-header-flex">
        <div class="category-header">
          <h2>Select Diagnostic Category</h2>
          <p>Choose the category you wish to explore. You can select multiple categories for a comprehensive assessment.</p>
        </div>
        <button class="btn btn-secondary" id="startHereGuide">
          🧭 Start Here - Not Sure?
        </button>
      </div>
      ${this.suggestedCategories.length > 0 ? `
        <div class="info-box panel-brand-left">
          <h3>💡 Recommended Categories Based on Your Answers:</h3>
          <p>
            ${sanitizedRecommendation}
          </p>
          <div class="recommendation-details">
            <p>
              <strong>Recommended categories:</strong> ${categoryNames}
            </p>
            <p class="recommendation-note">
              These categories are pre-selected for you, but you can change your selection or add others.
            </p>
          </div>
        </div>
      ` : `
        <div class="info-box panel-brand-left">
          <p>
            ${sanitizedRecommendation} Review the categories below and select those that seem most relevant to your concerns.
          </p>
        </div>
      `}
      <div class="category-grid" id="categoryGrid"></div>
      <div style="text-align: center; margin-top: 2rem;">
        <button class="btn btn-primary" id="startAssessment" disabled>Begin Assessment</button>
      </div>
    `);
    
      await this.renderCategorySelection();
      this.attachEventListeners();
      
      // Auto-select suggested categories
      this.suggestedCategories.forEach(categoryKey => {
        if (!this.selectedCategories.includes(categoryKey)) {
          this.selectedCategories.push(categoryKey);
        }
        const card = document.querySelector(`[data-category="${categoryKey}"]`);
        if (card) {
          card.classList.add('selected');
          card.classList.add('suggested');
        }
      });
      
      if (this.selectedCategories.length > 0) {
        const startBtn = document.getElementById('startAssessment');
        if (startBtn) startBtn.disabled = false;
      }
    } catch (error) {
      this.debugReporter.logError(error, 'completeGuide');
      ErrorHandler.showUserError('Failed to complete guide. Please try again.');
    }
  }

  generateRecommendationSummary() {
    if (this.suggestedCategories.length === 0) {
      return 'Based on your answers, we recommend exploring categories that match your concerns.';
    }
    
    const categoryNames = this.suggestedCategories.map(cat => CATEGORY_DESCRIPTIONS[cat]?.name || cat);
    const descriptions = this.suggestedCategories.map(cat => CATEGORY_DESCRIPTIONS[cat]?.description || '').filter(d => d);
    
    let summary = `Based on your responses, we recommend exploring ${categoryNames.length === 1 ? 'this category' : 'these categories'}: `;
    summary += categoryNames.join(', ') + '. ';
    
    if (descriptions.length > 0) {
      summary += 'These categories address concerns you indicated in the guide questions. ';
    }
    
    summary += 'You can proceed with these recommendations or select additional categories that interest you.';
    
    return summary;
  }

  toggleCategory(categoryKey, cardElement) {
    const index = this.selectedCategories.indexOf(categoryKey);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
      cardElement.classList.remove('selected');
    } else {
      this.selectedCategories.push(categoryKey);
      cardElement.classList.add('selected');
    }
    
    document.getElementById('startAssessment').disabled = this.selectedCategories.length === 0;
  }

  attachEventListeners() {
    const startAssessmentBtn = document.getElementById('startAssessment');
    if (startAssessmentBtn) {
      // Remove existing listener if any, then add new one
      const wasDisabled = startAssessmentBtn.disabled;
      startAssessmentBtn.replaceWith(startAssessmentBtn.cloneNode(true));
      const newBtn = document.getElementById('startAssessment');
      if (newBtn) {
        newBtn.disabled = wasDisabled;
        newBtn.addEventListener('click', () => this.startAssessment());
      }
    }
    
    const startHereGuideBtn = document.getElementById('startHereGuide');
    if (startHereGuideBtn) {
      // Remove existing listener if any, then add new one
      startHereGuideBtn.replaceWith(startHereGuideBtn.cloneNode(true));
      document.getElementById('startHereGuide').addEventListener('click', () => {
        this.logDebug('Start Here Guide button clicked');
        this.startGuide();
      });
    } else {
      this.logDebug('WARNING: startHereGuide button not found');
    }
    
    const nextQuestionBtn = document.getElementById('nextQuestion');
    if (nextQuestionBtn) {
      nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    const prevQuestionBtn = document.getElementById('prevQuestion');
    if (prevQuestionBtn) {
      prevQuestionBtn.addEventListener('click', () => this.prevQuestion());
    }
    
    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }
    
    const viewDataBtn = document.getElementById('viewData');
    if (viewDataBtn) {
      viewDataBtn.addEventListener('click', () => this.viewAnalysisData());
    }
    
    const viewAllConditionsBtn = document.getElementById('viewAllConditions');
    if (viewAllConditionsBtn) {
      viewAllConditionsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showConditionsDirectory();
      });
    }
    
    const backToMainBtn = document.getElementById('backToMain');
    if (backToMainBtn) {
      backToMainBtn.addEventListener('click', () => this.hideConditionsDirectory());
    }
    
    const conditionSearch = document.getElementById('conditionSearch');
    if (conditionSearch) {
      conditionSearch.addEventListener('input', (e) => this.filterConditions(e.target.value));
    }
    
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => this.abandonAssessment());
    }
  }

  abandonAssessment() {
    if (confirm('Are you sure you want to abandon this assessment? All progress will be lost and you will need to start from the beginning.')) {
      this.resetAssessment();
    }
  }

  clearAllCachedData() {
    if (!confirm('Are you sure you want to clear all cached data? This will reset your progress and history.')) {
      return;
    }

    this.dataStore.clear('progress');
    this.dataStore.clear('history');
    sessionStorage.removeItem('diagnosisProgress');
    localStorage.removeItem('diagnosisProgress');
    this.resetAssessment();
    alert('All cached data for Pathology Assessment has been cleared.');
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
      await this.loadDiagnosisData();
      await this.buildQuestionSequence();
      
      this.currentStage = 'questionnaire';
      const categorySelection = document.getElementById('categorySelection');
      const disclaimerSection = document.getElementById('disclaimerSection');
      const questionnaireSection = document.getElementById('questionnaireSection');
      
      if (categorySelection) categorySelection.classList.add('hidden');
      if (disclaimerSection) disclaimerSection.classList.add('hidden');
      if (questionnaireSection) questionnaireSection.classList.add('active');
      
      this.renderCurrentQuestion();
      this.updateProgress();
      this.logDebug('Assessment started', { categories: this.selectedCategories, questionCount: this.questionSequence.length });
    } catch (error) {
      this.debugReporter.logError(error, 'startAssessment');
      ErrorHandler.showUserError('Failed to start assessment. Please try again.');
    }
  }

  /**
   * Build question sequence from selected categories
   * @returns {Promise<void>}
   */
  async buildQuestionSequence() {
    await this.loadDiagnosisData();
    
    try {
      this.questionSequence = [];
      this.answers = {};
      
      this.selectedCategories.forEach(categoryKey => {
        const category = DSM5_CATEGORIES[categoryKey];
      
      Object.keys(category.disorders).forEach(disorderName => {
        const disorder = category.disorders[disorderName];
        
        // Build questions from criteria
        Object.keys(disorder.criteria).forEach(criterionKey => {
          const criterion = disorder.criteria[criterionKey];
          
          if (criterion.symptoms) {
            // Multiple symptoms to assess
            criterion.symptoms.forEach((symptom, index) => {
              const questionId = `${categoryKey}_${disorderName}_${criterionKey}_${symptom.id}`;
              this.questionSequence.push({
                id: questionId,
                category: categoryKey,
                disorder: disorderName,
                criterion: criterionKey,
                symptom: symptom,
                questionText: this.generateQuestionText(symptom, categoryKey),
                weight: symptom.weight || 1.0,
                type: 'symptom'
              });
            });
          } else {
            // Single criterion question
            const questionId = `${categoryKey}_${disorderName}_${criterionKey}`;
            this.questionSequence.push({
              id: questionId,
              category: categoryKey,
              disorder: disorderName,
              criterion: criterionKey,
              questionText: this.generateCriterionQuestion(criterion, disorderName),
              weight: criterion.weight || 1.0,
              type: 'criterion'
            });
          }
        });
        
        // Add contradictory validation questions
        if (VALIDATION_PAIRS && Array.isArray(VALIDATION_PAIRS)) {
          VALIDATION_PAIRS.forEach(pair => {
            const questionId = `${categoryKey}_${disorderName}_validation_${pair.primary}`;
            this.questionSequence.push({
              id: questionId,
              category: categoryKey,
              disorder: disorderName,
              questionText: pair.contradictory,
              weight: pair.weight,
              type: 'validation',
              primaryQuestion: pair.primary
            });
          });
        }
      });
    });
    
      // Shuffle to reduce order bias, but keep related questions somewhat grouped
      this.shuffleQuestions();
      
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
    } catch (error) {
      this.debugReporter.logError(error, 'buildQuestionSequence');
      ErrorHandler.showUserError('Failed to build question sequence. Please refresh the page.');
    }
  }

  // Reframe questions to avoid double negatives and use positive "degree of presence" language
  reframeQuestion(text) {
    if (!text) return text;
    
    // Common double negative patterns to reframe
    const reframes = [
      // "not not" patterns
      { pattern: /don't not|do not not/gi, replacement: 'do' },
      { pattern: /doesn't not|does not not/gi, replacement: 'does' },
      { pattern: /cannot not|can not not/gi, replacement: 'can' },
      { pattern: /never not/gi, replacement: 'always' },
      
      // "not" + negative verb patterns - convert to positive
      { pattern: /not (?:feel|experience|have) (?:fear|anxiety|worry|stress|panic|depression|sadness|anger|irritability|tension|restlessness)/gi, 
        replacement: (match) => {
          const emotion = match.match(/(?:fear|anxiety|worry|stress|panic|depression|sadness|anger|irritability|tension|restlessness)/i)?.[0] || 'this';
          return `experience ${emotion}`;
        }},
      
      // "not markedly impaired" -> "functioning well"
      { pattern: /not markedly impaired/gi, replacement: 'functioning well' },
      { pattern: /not better explained/gi, replacement: 'best explained' },
      { pattern: /does not meet criteria/gi, replacement: 'meets different criteria' },
      
      // "lack of" -> "presence of" (inverted)
      { pattern: /lack of ([\w\s]+)/gi, replacement: 'absence of $1' },
      
      // "absence of" -> "presence of" (inverted for positive framing)
      { pattern: /absence of ([\w\s]+)/gi, replacement: 'presence of $1' },
    ];
    
    let reframed = text;
    reframes.forEach(({ pattern, replacement }) => {
      if (typeof replacement === 'function') {
        reframed = reframed.replace(pattern, replacement);
      } else {
        reframed = reframed.replace(pattern, replacement);
      }
    });
    
    // Convert negative questions to positive "degree of presence" format
    const lowerText = reframed.toLowerCase();
    
    // Pattern: "do not feel fear" -> "degree to which fear is present"
    if (lowerText.includes('not') && (lowerText.includes('feel') || lowerText.includes('experience') || lowerText.includes('have'))) {
      const emotionPattern = /(?:not|don't|doesn't|do not|does not)\s+(?:feel|experience|have)\s+(fear|anxiety|worry|stress|panic|depression|sadness|anger|irritability|tension|restlessness|fatigue|energy|interest|pleasure|hope|joy|satisfaction|confidence|calm|peace)/i;
      const emotionMatch = reframed.match(emotionPattern);
      if (emotionMatch && emotionMatch[1]) {
        return `To what degree is ${emotionMatch[1]} present in your life?`;
      }
    }
    
    // Pattern: "lack of X" -> "degree to which X is present" (inverted)
    const lackPattern = /lack\s+of\s+([\w\s]+)/i;
    const lackMatch = reframed.match(lackPattern);
    if (lackMatch && lackMatch[1]) {
      return `To what degree is ${lackMatch[1].trim()} present in your experience?`;
    }
    
    // Pattern: "absence of X" -> "degree to which X is present" (inverted)
    const absencePattern = /absence\s+of\s+([\w\s]+)/i;
    const absenceMatch = reframed.match(absencePattern);
    if (absenceMatch && absenceMatch[1]) {
      return `To what degree is ${absenceMatch[1].trim()} present in your experience?`;
    }
    
    // Pattern: "diminished X" -> "degree to which X is present"
    const diminishedPattern = /diminished\s+([\w\s]+)/i;
    const diminishedMatch = reframed.match(diminishedPattern);
    if (diminishedMatch && diminishedMatch[1]) {
      return `To what degree is ${diminishedMatch[1].trim()} present in your experience?`;
    }
    
    // Pattern: "loss of X" -> "degree to which X is present" (inverted)
    const lossPattern = /loss\s+of\s+([\w\s]+)/i;
    const lossMatch = reframed.match(lossPattern);
    if (lossMatch && lossMatch[1]) {
      return `To what degree is ${lossMatch[1].trim()} present in your experience?`;
    }
    
    // If question already uses positive framing, ensure it uses "degree of presence" language
    if (!lowerText.includes('to what') && !lowerText.includes('how much') && 
        !lowerText.includes('how often') && !lowerText.includes('degree') && 
        !lowerText.includes('extent')) {
      // Convert simple yes/no questions to degree questions
      if (reframed.match(/^(you|do you|have you|are you|did you)/i)) {
        // Extract the core concept
        const coreText = reframed
          .replace(/^(you|do you|have you|are you|did you)\s+/i, '')
          .replace(/\?$/, '')
          .trim();
        
        // If it mentions a symptom or experience, reframe as degree
        const symptomWords = ['worry', 'anxiety', 'fear', 'stress', 'panic', 'depression', 'sadness', 'anger', 'irritability', 'tension', 'restlessness', 'fatigue', 'energy', 'interest', 'pleasure', 'sleep', 'appetite', 'concentration', 'memory', 'thoughts', 'feelings', 'emotions', 'mood', 'behavior'];
        const hasSymptom = symptomWords.some(word => coreText.toLowerCase().includes(word));
        
        if (hasSymptom) {
          return `To what degree is this present in your experience: ${coreText}?`;
        }
      }
    }
    
    return reframed;
  }

  generateQuestionText(symptom, categoryKey) {
    const templates = QUESTION_TEMPLATES[categoryKey];
    let questionText;
    
    if (templates && templates[symptom.id]) {
      questionText = templates[symptom.id][0] || symptom.text;
    } else {
      questionText = symptom.text || `To what extent do you experience: ${symptom.id}?`;
    }
    
    // Reframe to avoid double negatives and use positive language
    return this.reframeQuestion(questionText);
  }

  generateCriterionQuestion(criterion, disorderName) {
    let questionText = criterion.text || `Regarding ${disorderName}: ${criterion.text}`;
    
    // Reframe to avoid double negatives and use positive language
    return this.reframeQuestion(questionText);
  }

  shuffleQuestions() {
    // Fisher-Yates shuffle with some grouping preservation
    for (let i = this.questionSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questionSequence[i], this.questionSequence[j]] = [this.questionSequence[j], this.questionSequence[i]];
    }
  }

  /**
   * Render the current question
   */
  renderCurrentQuestion() {
    const renderStart = performance.now();
    
    try {
      // Determine which sequence we're using
      const isInRefinement = this.refinementRequested && this.refinedQuestionSequence.length > 0;
      const totalMainQuestions = this.questionSequence.length;
      const totalRefinedQuestions = this.refinedQuestionSequence.length;
      const totalQuestions = totalMainQuestions + (isInRefinement ? totalRefinedQuestions : 0);
      
      // Check if we've completed all questions
      if (this.currentQuestionIndex >= totalQuestions) {
        this.completeAssessment();
        return;
      }
      
      // Get the appropriate question
      let question;
      if (this.currentQuestionIndex < totalMainQuestions) {
        question = this.questionSequence[this.currentQuestionIndex];
      } else if (isInRefinement) {
        question = this.refinedQuestionSequence[this.currentQuestionIndex - totalMainQuestions];
      } else {
        this.completeAssessment();
        return;
      }
      
      const container = document.getElementById('questionContainer');
      if (!container) {
        ErrorHandler.showUserError('Question container not found. Please refresh the page.');
        return;
      }
      
      // Sanitize question text for display
      const questionText = SecurityUtils.sanitizeHTML(question.questionText || '');
      
      // questionText is already sanitized above
      SecurityUtils.safeInnerHTML(container, `
      <div class="question-block">
        <h3>${questionText}</h3>
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" 
                   id="questionInput" 
                   min="0" 
                   max="10" 
                   step="1" 
                   value="${this.answers[question.id] || 5}"
                   data-question-id="${question.id}">
          </div>
          <div class="scale-value" id="scaleValue">${this.answers[question.id] || 5}</div>
        </div>
        <div class="scale-labels">
          <span>Very Low / Minimal / Weak / Rare / Never (0-2)</span>
          <span>Moderate / Somewhat / Average / Sometimes (5-6)</span>
          <span>Very High / Strong / Potent / Frequent / Always (9-10)</span>
        </div>
        <div style="margin-top: 0.5rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-radius: var(--radius); font-size: 0.9rem; color: var(--muted); line-height: 1.5;">
          <strong>Tip:</strong> 0-2 = Not applicable / Rare | 3-4 = Minimal impact | 5-6 = Moderate impact | 7-8 = Significant impact | 9-10 = Extreme impact / Constant
        </div>
        ${question.type === 'validation' ? '<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--muted);"><em>This question helps validate consistency in your responses.</em></p>' : ''}
        ${question.type === 'comorbidity_refinement' ? `<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--accent); font-weight: 600;"><em>Refinement Question (${question.groupName})</em></p>` : ''}
        ${question.type === 'refinement' ? `<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--accent);"><em>Additional detail for ${question.disorder}</em></p>` : ''}
        ${question.type === 'differential' ? `<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--accent);"><em>Differential diagnosis question</em></p>` : ''}
      </div>
    `);
    
    const slider = document.getElementById('questionInput');
    const valueDisplay = document.getElementById('scaleValue');
    
      if (slider && valueDisplay) {
        slider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          valueDisplay.textContent = value;
          this.answers[question.id] = value;
          this.saveProgress();
        });
        
        // Set initial value if exists
        if (this.answers[question.id] !== undefined) {
          slider.value = this.answers[question.id];
          valueDisplay.textContent = this.answers[question.id];
        }
        
        // Focus management for accessibility
        DOMUtils.focusElement(slider);
      }
      
      this.updateProgress();
      this.updateNavigationButtons();
      
      // Track render performance
      const renderDuration = performance.now() - renderStart;
      this.debugReporter.recordRender('question', renderDuration);
      
      this.logDebug('Rendered question', { questionId: question.id, index: this.currentQuestionIndex });
    } catch (error) {
      this.debugReporter.logError(error, 'renderCurrentQuestion');
      ErrorHandler.showUserError('Failed to render question. Please refresh the page.');
    }
  }

  updateProgress() {
    const isInRefinement = this.refinementRequested && this.refinedQuestionSequence.length > 0;
    const totalQuestions = this.questionSequence.length + (isInRefinement ? this.refinedQuestionSequence.length : 0);
    const progress = totalQuestions > 0 ? ((this.currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    document.getElementById('progressFill').style.width = `${progress}%`;
  }

  updateNavigationButtons() {
    document.getElementById('prevQuestion').disabled = this.currentQuestionIndex === 0;
    document.getElementById('nextQuestion').disabled = false;
  }

  nextQuestion() {
    // Get current question based on which sequence we're in
    const totalMainQuestions = this.questionSequence.length;
    const isInRefinement = this.refinementRequested && this.refinedQuestionSequence.length > 0;
    
    let currentQuestion;
    if (this.currentQuestionIndex < totalMainQuestions) {
      currentQuestion = this.questionSequence[this.currentQuestionIndex];
    } else if (isInRefinement) {
      currentQuestion = this.refinedQuestionSequence[this.currentQuestionIndex - totalMainQuestions];
    }
    
    const slider = document.getElementById('questionInput');
    if (slider && currentQuestion) {
      const answerKey = isInRefinement && this.currentQuestionIndex >= totalMainQuestions
        ? 'refinedAnswers'
        : 'answers';
      if (!this.analysisData[answerKey]) this.analysisData[answerKey] = {};
      this.analysisData[answerKey][currentQuestion.id] = parseInt(slider.value);
      this.answers[currentQuestion.id] = parseInt(slider.value);
    }
    
    this.currentQuestionIndex++;
    this.updateProgress();
    this.saveProgress();
    
    const totalQuestions = totalMainQuestions + (isInRefinement ? this.refinedQuestionSequence.length : 0);
    if (this.currentQuestionIndex < totalQuestions) {
      this.renderCurrentQuestion();
    } else {
      this.completeAssessment();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      const totalMainQuestions = this.questionSequence.length;
      const isInRefinement = this.refinementRequested && this.refinedQuestionSequence && this.refinedQuestionSequence.length > 0;
      
      // Save current answer before going back
      const slider = document.getElementById('questionInput');
      if (slider) {
        let currentQuestion;
        if (this.currentQuestionIndex < totalMainQuestions) {
          currentQuestion = this.questionSequence[this.currentQuestionIndex];
        } else if (isInRefinement) {
          currentQuestion = this.refinedQuestionSequence[this.currentQuestionIndex - totalMainQuestions];
        }
        
        if (currentQuestion) {
          const answerKey = isInRefinement && this.currentQuestionIndex >= totalMainQuestions
            ? 'refinedAnswers'
            : 'answers';
          if (!this.analysisData[answerKey]) this.analysisData[answerKey] = {};
          const answerValue = parseInt(slider.value);
          this.analysisData[answerKey][currentQuestion.id] = answerValue;
          this.answers[currentQuestion.id] = answerValue;
          this.logDebug('Saved answer before prev', { questionId: currentQuestion.id, answer: answerValue });
        }
      }
      
      this.currentQuestionIndex--;
      this.updateProgress();
      this.renderCurrentQuestion();
      this.logDebug('Moved to previous question', { newIndex: this.currentQuestionIndex });
    }
  }

  /**
   * Complete assessment and proceed to results or refinement
   * @returns {Promise<void>}
   */
  async completeAssessment() {
    try {
      await this.loadDiagnosisData(); // Ensure data is loaded
      
      this.calculateResults();
      
      // Check for comorbidity and multi-branching
      const comorbidityGroups = this.detectComorbidity();
      const hasRefinedQuestions = this.buildRefinedQuestionSequence(comorbidityGroups);
      
      // If comorbidity detected and refined questions available, offer refinement
      if (this.multiBranchingDetected && hasRefinedQuestions && !this.refinementRequested) {
        this.offerRefinement(comorbidityGroups);
        return;
      }
      
      // Otherwise, proceed to results
      await this.showResults();
    } catch (error) {
      this.debugReporter.logError(error, 'completeAssessment');
      ErrorHandler.showUserError('Failed to complete assessment. Please try again.');
    }
  }

  offerRefinement(comorbidityGroups) {
    const container = document.getElementById('questionContainer');
    let html = `
      <div class="comorbidity-notice" style="padding: 2rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--accent); border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; color: var(--brand);">🔗 Multi-Branching Assessment Detected</h3>
        <p style="margin-bottom: 1rem; line-height: 1.6;">
          The assessment detected potential <strong>comorbidity</strong> (multiple disorders that commonly co-occur):
        </p>
        <ul style="margin-left: 1.5rem; margin-bottom: 1.5rem; line-height: 1.8;">
    `;
    
    comorbidityGroups.forEach(group => {
      html += `
        <li style="margin-bottom: 0.5rem;">
          <strong>${SecurityUtils.sanitizeHTML(group.name || '')}:</strong> ${group.disorders.map(d => SecurityUtils.sanitizeHTML(d || '')).join(', ')}<br>
          <em style="font-size: 0.9rem; color: var(--muted);">${SecurityUtils.sanitizeHTML(group.message || '')}</em>
        </li>
      `;
    });
    
    html += `
        </ul>
        <p style="margin-bottom: 1.5rem; line-height: 1.6;">
          <strong>Additional refined questions are available</strong> to help differentiate between these conditions and improve diagnostic accuracy.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; background: rgba(255,255,255,0.7); border-radius: var(--radius); flex: 1; min-width: 200px;">
            <input type="checkbox" id="requestRefinement" ${this.refinementRequested ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;" ${this.analysisData.refinementPasses >= this.analysisData.maxRefinementPasses ? 'disabled' : ''}>
            <span style="font-weight: 600;">Complete refined assessment</span>
          </label>
          <button class="btn btn-primary" id="proceedToRefinement" style="flex: 1; min-width: 200px;">Continue with Refined Questions</button>
          <button class="btn btn-secondary" id="skipToResults" style="flex: 1; min-width: 200px;">Skip to Results</button>
        </div>
      </div>
    `;
    
    // Sanitize HTML before rendering - all dynamic content is already sanitized above
    SecurityUtils.safeInnerHTML(container, html);
    
    const refinementCheckbox = document.getElementById('requestRefinement');
    if (refinementCheckbox) {
      refinementCheckbox.addEventListener('change', (e) => {
        // Require user intent confirmation
        if (e.target.checked && !confirm('This step sharpens distinctions for learning clarity. Proceed?')) {
          e.target.checked = false;
          return;
        }
        this.refinementRequested = e.target.checked;
      });
    }
    
    const proceedToRefinementBtn = document.getElementById('proceedToRefinement');
    if (proceedToRefinementBtn) {
      proceedToRefinementBtn.addEventListener('click', async () => {
        // Check refinement ceiling
        if (this.analysisData.refinementPasses >= this.analysisData.maxRefinementPasses) {
          ErrorHandler.showUserError('Maximum refinement passes reached. Proceeding to results.');
          await this.showResults();
          return;
        }
        
        if (!confirm('This step sharpens distinctions for learning clarity. Proceed?')) {
          return;
        }
        
        this.refinementRequested = true;
        this.analysisData.refinementPasses++;
        this.startRefinementQuestions();
      });
    }
    
    const skipToResultsBtn = document.getElementById('skipToResults');
    if (skipToResultsBtn) {
      skipToResultsBtn.addEventListener('click', async () => {
        await this.showResults();
      });
    }
  }

  startRefinementQuestions() {
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
  }

  /**
   * Show results screen
   * @returns {Promise<void>}
   */
  async showResults() {
    try {
      await this.loadDiagnosisData(); // Ensure all data is loaded
      
      this.currentStage = 'results';
      const questionnaireSection = document.getElementById('questionnaireSection');
      const resultsSection = document.getElementById('resultsSection');
      
      if (questionnaireSection) questionnaireSection.classList.remove('active');
      if (resultsSection) resultsSection.classList.add('active');
      
      await this.renderResults();
      this.saveResults();
    } catch (error) {
      this.debugReporter.logError(error, 'showResults');
      ErrorHandler.showUserError('Failed to show results. Please try again.');
    }
  }

  calculateResults() {
    const scores = {};
    const probabilities = {};
    
    this.selectedCategories.forEach(categoryKey => {
      const category = DSM5_CATEGORIES[categoryKey];
      
      Object.keys(category.disorders).forEach(disorderName => {
        const disorder = category.disorders[disorderName];
        let totalScore = 0;
        let maxPossibleScore = 0;
        let criteriaMet = {};
        
        Object.keys(disorder.criteria).forEach(criterionKey => {
          const criterion = disorder.criteria[criterionKey];
          
          if (criterion.symptoms) {
            let criterionScore = 0;
            let criterionMax = 0;
            let symptomsMet = 0;
            
            criterion.symptoms.forEach(symptom => {
              const questionId = `${categoryKey}_${disorderName}_${criterionKey}_${symptom.id}`;
              const answer = this.answers[questionId] || 0;
              const normalizedAnswer = answer / 10; // Convert 0-10 to 0-1
              const weightedScore = normalizedAnswer * (symptom.weight || 1.0);
              
              criterionScore += weightedScore;
              criterionMax += (symptom.weight || 1.0);
              
              if (normalizedAnswer >= 0.6) { // Threshold for symptom presence
                symptomsMet++;
              }
            });
            
            const criterionMet = symptomsMet >= (criterion.threshold || criterion.symptoms.length);
            criteriaMet[criterionKey] = criterionMet;
            
            if (criterionMet) {
              totalScore += criterionScore;
            }
            maxPossibleScore += criterionMax;
          } else {
            const questionId = `${categoryKey}_${disorderName}_${criterionKey}`;
            const answer = this.answers[questionId] || 0;
            const normalizedAnswer = answer / 10;
            const weightedScore = normalizedAnswer * (criterion.weight || 1.0);
            
            totalScore += weightedScore;
            maxPossibleScore += (criterion.weight || 1.0);
            
            criteriaMet[criterionKey] = normalizedAnswer >= 0.6;
          }
        });
        
        // Apply validation adjustments
        const validationAdjustment = this.calculateValidationAdjustment(categoryKey, disorderName);
        
        // Calculate probability
        const rawProbability = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
        const adjustedProbability = Math.max(0, Math.min(1, rawProbability * validationAdjustment));
        
        scores[disorderName] = {
          raw: totalScore,
          max: maxPossibleScore,
          criteriaMet: criteriaMet,
          validationAdjustment: validationAdjustment
        };
        
        probabilities[disorderName] = adjustedProbability;
      });
    });
    
    this.analysisData.scores = scores;
    this.analysisData.probabilities = probabilities;
    this.analysisData.answers = { ...this.answers };
    this.analysisData.refinedAnswers = this.refinedAnswers ? { ...this.refinedAnswers } : {};
    this.analysisData.categories = [...this.selectedCategories];
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question,
      category: q.category,
      disorder: q.disorder,
      criterion: q.criterion
    }));
    this.analysisData.refinedQuestionSequence = this.refinedQuestionSequence.map(q => ({
      id: q.id,
      question: q.question,
      disorder: q.disorder,
      category: q.category
    }));
    
    // Build conclusion vector
    this.buildConclusionVector();
  }

  calculateValidationAdjustment(categoryKey, disorderName) {
    let adjustment = 1.0;
    let validationCount = 0;
    let inconsistencyScore = 0;
    
    if (VALIDATION_PAIRS && Array.isArray(VALIDATION_PAIRS)) {
      VALIDATION_PAIRS.forEach(pair => {
        const primaryId = `${categoryKey}_${disorderName}_${Object.keys(DSM5_CATEGORIES[categoryKey].disorders[disorderName].criteria)[0]}_${pair.primary}`;
        const validationId = `${categoryKey}_${disorderName}_validation_${pair.primary}`;
        
        const primaryAnswer = this.answers[primaryId];
        const validationAnswer = this.answers[validationId];
        
        if (primaryAnswer !== undefined && validationAnswer !== undefined) {
          validationCount++;
          // Check for inconsistency (high primary, high validation = inconsistent)
          const primaryNormalized = primaryAnswer / 10;
          const validationNormalized = validationAnswer / 10;
          const inconsistency = Math.abs(primaryNormalized - (1 - validationNormalized));
          inconsistencyScore += inconsistency;
        }
      });
    }
    
    if (validationCount > 0) {
      const avgInconsistency = inconsistencyScore / validationCount;
      // Reduce probability if high inconsistency
      adjustment = 1.0 - (avgInconsistency * 0.3); // Max 30% reduction
    }
    
    return Math.max(0.5, adjustment); // Minimum 50% adjustment
  }

  detectComorbidity() {
    const detectedGroups = [];
    const disorders = Object.keys(this.analysisData.probabilities).filter(
      d => this.analysisData.probabilities[d] >= MULTI_BRANCHING_THRESHOLDS.moderate_comorbidity
    );
    
    Object.keys(COMORBIDITY_GROUPS).forEach(groupKey => {
      const group = COMORBIDITY_GROUPS[groupKey];
      const matchingDisorders = disorders.filter(d => group.disorders.includes(d));
      
      if (matchingDisorders.length >= 2) {
        // Check if threshold is met
        const maxProb = Math.max(...matchingDisorders.map(d => this.analysisData.probabilities[d]));
        if (maxProb >= group.triggers.threshold) {
          detectedGroups.push({
            group: groupKey,
            name: group.name,
            disorders: matchingDisorders,
            message: group.triggers.message,
            refinementQuestions: COMORBIDITY_REFINEMENT_QUESTIONS[groupKey] || []
          });
        }
      }
    });
    
    this.detectedComorbidity = detectedGroups;
    this.multiBranchingDetected = detectedGroups.length > 0;
    
    return detectedGroups;
  }

  buildRefinedQuestionSequence(comorbidityGroups) {
    this.refinedQuestionSequence = [];
    
    comorbidityGroups.forEach(group => {
      // Add comorbidity-specific refinement questions
      if (group.refinementQuestions && group.refinementQuestions.length > 0) {
        group.refinementQuestions.forEach((question, index) => {
          this.refinedQuestionSequence.push({
            id: `comorbidity_${group.group}_${index}`,
            type: 'comorbidity_refinement',
            group: group.group,
            groupName: group.name,
            questionText: question,
            weight: 0.9
          });
        });
      }
    });
    
    // Add refined questions for primary pattern match if available (with ceiling enforcement)
    const vector = this.analysisData.conclusionVector;
    if (this.analysisData.refinementPasses >= this.analysisData.maxRefinementPasses) {
      return; // Hard stop - refinement ceiling reached
    }
    
    if (vector.primaryPatternMatch && REFINED_QUESTIONS[vector.primaryPatternMatch]) {
      const refined = REFINED_QUESTIONS[vector.primaryPatternMatch];
      
      Object.keys(refined).forEach(category => {
        refined[category].forEach((question, index) => {
          this.refinedQuestionSequence.push({
            id: `refined_${vector.primaryPatternMatch}_${category}_${index}`,
            type: 'refinement',
            disorder: vector.primaryPatternMatch,
            category: category,
            questionText: question,
            weight: 0.8
          });
        });
      });
    }
    
    // Add differential questions for secondary pattern matches
    const secondaryDisorders = vector.secondaryPatternMatches.map(s => s.disorder);
    secondaryDisorders.forEach(disorder => {
      // Check for differential questions
      Object.keys(DIFFERENTIAL_QUESTIONS).forEach(key => {
        if (key.includes(disorder) || key.includes(vector.primaryPatternMatch)) {
          const diffQuestions = DIFFERENTIAL_QUESTIONS[key];
          diffQuestions.forEach((question, index) => {
            this.refinedQuestionSequence.push({
              id: `differential_${key}_${index}`,
              type: 'differential',
              questionText: question,
              weight: 0.85
            });
          });
        }
      });
    });
    
    return this.refinedQuestionSequence.length > 0;
  }

  buildConclusionVector() {
    const vector = {
      primaryPatternMatch: null,
      primaryAlignment: 0,
      primaryAlignmentBand: null,
      secondaryPatternMatches: [],
      requiresSubInquiry: [],
      comorbidity: [],
      overallSeverity: 'low',
      recommendation: ''
    };
    
    // Find primary pattern match
    Object.keys(this.analysisData.probabilities).forEach(disorder => {
      const prob = this.analysisData.probabilities[disorder];
      const alignmentBand = this.getAlignmentBand(prob);
      
      if (prob > vector.primaryAlignment) {
        if (vector.primaryPatternMatch) {
          vector.secondaryPatternMatches.push({
            disorder: vector.primaryPatternMatch,
            alignment: vector.primaryAlignment,
            alignmentBand: vector.primaryAlignmentBand
          });
        }
        vector.primaryPatternMatch = disorder;
        vector.primaryAlignment = prob;
        vector.primaryAlignmentBand = alignmentBand;
      } else if (prob >= SCORING_THRESHOLDS.moderate_probability) {
        vector.secondaryPatternMatches.push({
          disorder: disorder,
          alignment: prob,
          alignmentBand: alignmentBand
        });
      }
    });
    
    // Check for sub-inquiry needs
    Object.keys(this.analysisData.probabilities).forEach(disorder => {
      const prob = this.analysisData.probabilities[disorder];
      if (prob >= SCORING_THRESHOLDS.requires_sub_inquiry && 
          prob < SCORING_THRESHOLDS.high_probability) {
        vector.requiresSubInquiry.push(disorder);
      }
    });
    
    // Detect comorbidity
    const comorbidityGroups = this.detectComorbidity();
    vector.comorbidity = comorbidityGroups;
    
    // Determine overall alignment level
    if (vector.primaryAlignment >= SCORING_THRESHOLDS.high_probability) {
      vector.overallAlignment = 'high';
      vector.recommendation = 'High pathology indicators detected. Consider professional evaluation for clinical assessment.';
    } else if (vector.primaryAlignment >= SCORING_THRESHOLDS.moderate_probability) {
      vector.overallAlignment = 'moderate';
      vector.recommendation = 'Moderate pathology indicators. Professional consultation recommended for accurate assessment.';
    } else {
      vector.overallAlignment = 'low';
      vector.recommendation = 'Low pathology indicators. Continue self-monitoring and reflection.';
    }
    
    // Add comorbidity note to recommendation
    if (vector.comorbidity.length > 0) {
      vector.recommendation += ' Multiple pattern matches detected - professional differential assessment recommended.';
    }
    
    // Calculate validation consistency
    this.calculateValidationConsistency();
    
    this.analysisData.conclusionVector = vector;
  }

  getAlignmentBand(probability) {
    if (probability >= SCORING_THRESHOLDS.high_probability) {
      return 'High alignment';
    } else if (probability >= SCORING_THRESHOLDS.moderate_probability) {
      return 'Moderate alignment';
    } else {
      return 'Low alignment';
    }
  }
  
  calculateValidationConsistency() {
    // Calculate response consistency from validation pairs
    const validationPairs = VALIDATION_PAIRS || [];
    if (validationPairs.length === 0) {
      this.analysisData.validationConsistency = 'unknown';
      return;
    }
    
    let consistentCount = 0;
    let totalPairs = 0;
    
    validationPairs.forEach(pair => {
      const answer1 = this.answers[pair.question1];
      const answer2 = this.answers[pair.question2];
      
      if (answer1 !== undefined && answer2 !== undefined) {
        totalPairs++;
        // Check if answers are consistent (within 2 points for similar questions)
        const diff = Math.abs(answer1 - answer2);
        if (diff <= 2) {
          consistentCount++;
        }
      }
    });
    
    const consistencyRatio = totalPairs > 0 ? consistentCount / totalPairs : 0;
    
    if (consistencyRatio >= 0.8) {
      this.analysisData.validationConsistency = 'high';
    } else if (consistencyRatio >= 0.6) {
      this.analysisData.validationConsistency = 'moderate';
    } else {
      this.analysisData.validationConsistency = 'low';
    }
  }
  
  translateLikertToDSM(likertScore) {
    // Translate 0-10 Likert to DSM-relevant salience bands
    if (likertScore <= 3) return 'Absent';
    if (likertScore <= 6) return 'Subthreshold';
    return 'Clinically Salient';
  }

  /**
   * Render assessment results
   * @returns {Promise<void>}
   */
  async renderResults() {
    try {
      await this.loadDiagnosisData(); // Ensure all data is loaded
      
      const container = document.getElementById('resultsContainer');
      if (!container) {
        ErrorHandler.showUserError('Results container not found.');
        return;
      }
      
      const vector = this.analysisData.conclusionVector;
      const primaryPattern = vector.primaryPatternMatch;
      const treatmentData = TREATMENT_DATABASE?.[primaryPattern] || null;
    
    // Show validation consistency
    const validationDisplay = this.analysisData.validationConsistency 
      ? `<div style="background: ${this.analysisData.validationConsistency === 'high' ? 'rgba(40, 167, 69, 0.1)' : this.analysisData.validationConsistency === 'moderate' ? 'rgba(255, 184, 0, 0.1)' : 'rgba(211, 47, 47, 0.1)'}; border-left: 4px solid ${this.analysisData.validationConsistency === 'high' ? '#28a745' : this.analysisData.validationConsistency === 'moderate' ? '#ffc107' : '#d32f2f'}; border-radius: var(--radius); padding: 1rem; margin-bottom: 1.5rem;">
          <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);">
            <strong style="color: ${this.analysisData.validationConsistency === 'high' ? '#28a745' : this.analysisData.validationConsistency === 'moderate' ? '#ffc107' : '#d32f2f'};">
              Response Consistency:</strong> ${this.analysisData.validationConsistency.charAt(0).toUpperCase() + this.analysisData.validationConsistency.slice(1)}
            ${this.analysisData.validationConsistency === 'low' ? ' - Lower consistency reduces confidence in results. This indicates variability in responses rather than user error.' : ''}
          </p>
        </div>`
      : '';
    
    let html = validationDisplay;
    
    // Scale translation documentation
    html += `<div style="background: rgba(0, 123, 255, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-bottom: 1.5rem;">
      <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: var(--muted);">
        <strong style="color: var(--brand);">Scale Translation:</strong> Likert scores (0-10) are translated into DSM-relevant salience bands: 0-3 = Absent, 4-6 = Subthreshold, 7-10 = Clinically Salient. This protects methodological integrity.
      </p>
    </div>`;
    
    // Group results by category first (collapsed view)
    const categoryGroups = {};
    if (primaryPattern) {
      const category = this.getCategoryForDisorder(primaryPattern);
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push({
        disorder: primaryPattern,
        alignment: vector.primaryAlignment,
        alignmentBand: vector.primaryAlignmentBand,
        isPrimary: true
      });
    }
    
    vector.secondaryPatternMatches.forEach(secondary => {
      const category = this.getCategoryForDisorder(secondary.disorder);
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push({
        disorder: secondary.disorder,
        alignment: secondary.alignment,
        alignmentBand: secondary.alignmentBand,
        isPrimary: false
      });
    });
    
    html += '<h3 style="margin-bottom: 1rem;">Pathology Assessment Results by Category</h3>';
    
    Object.keys(categoryGroups).forEach(categoryName => {
      html += `<div class="category-group">`;
      html += `<div class="category-group-header" onclick="this.nextElementSibling.classList.toggle('hidden')">`;
      html += `${categoryName} <span>▼</span>`;
      html += `</div>`;
      html += `<div class="category-group-content hidden">`;
      
      categoryGroups[categoryName].forEach(pattern => {
        const isPrimary = pattern.isPrimary;
        html += `
          <div style="margin-bottom: ${isPrimary ? '1.5rem' : '1rem'}; padding: ${isPrimary ? '1.5rem' : '1rem'}; background: ${isPrimary ? 'rgba(0, 123, 255, 0.1)' : 'rgba(255,255,255,0.7)'}; border-radius: var(--radius); border-left: 4px solid ${isPrimary ? 'var(--brand)' : 'var(--accent)'};">
            <h4 style="color: ${isPrimary ? 'var(--brand)' : 'var(--accent)'}; margin-bottom: 0.75rem;">
              ${isPrimary ? '🎯 Primary Pattern Match:' : 'Secondary Pattern Match:'} ${pattern.disorder}
            </h4>
            <div style="margin-bottom: 0.5rem;">
              <strong>Alignment Band:</strong> <span style="color: ${pattern.alignmentBand === 'High alignment' ? '#d32f2f' : pattern.alignmentBand === 'Moderate alignment' ? '#ffc107' : '#28a745'};">${pattern.alignmentBand}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--muted); margin: 0;">
              Raw alignment score: ${Math.round(pattern.alignment * 100)}% 
              ${this.analysisData.validationConsistency === 'low' ? '<span style="color: #d32f2f;">(Low confidence due to response inconsistency)</span>' : ''}
            </p>
          </div>
        `;
      });
      
      html += `</div></div>`;
    });
    
    // Integration step before showing full details
    if (primaryPattern) {
      html += `
        <div style="background: rgba(255, 184, 0, 0.15); border: 2px solid var(--accent); border-radius: var(--radius); padding: 2rem; margin-top: 2rem; text-align: center;">
          <h3 style="color: var(--brand); margin-bottom: 1rem;">Integration Step</h3>
          <p style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">
            Which result feels most relevant to explore right now? This helps focus your learning and prevents overwhelm.
          </p>
          <button class="btn btn-primary" onclick="window.diagnosisEngine.showFullDetails('${primaryPattern}')" style="margin: 0.5rem;">
            Explore: ${primaryPattern}
          </button>
      `;
      
      if (vector.secondaryPatternMatches.length > 0) {
        vector.secondaryPatternMatches.slice(0, 2).forEach(secondary => {
          html += `<button class="btn btn-secondary" onclick="window.diagnosisEngine.showFullDetails('${secondary.disorder}')" style="margin: 0.5rem;">
            Explore: ${secondary.disorder}
          </button>`;
        });
      }
      
      html += `</div>`;
    }
    
    // Display comprehensive support information for selected pattern
    if (treatmentData && primaryPattern) {
      html += `<div id="fullDetailsSection" style="display: none; margin-top: 2rem;">`;
      html += this.renderTreatmentInformation(primaryPattern, treatmentData);
      html += `</div>`;
    }
    
    // Display comorbidity information
    if (vector.comorbidity && vector.comorbidity.length > 0) {
      html += `
        <div class="comorbidity-section" style="margin-top: 2rem; padding: 1.5rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--accent); border-radius: var(--radius);">
          <h4 style="margin-bottom: 1rem; color: var(--brand);">🔗 Multi-Branching / Comorbidity Detected</h4>
          <p style="margin-bottom: 1rem; line-height: 1.6;">
            The assessment detected potential <strong>comorbidity</strong> (multiple disorders that commonly co-occur). This requires careful differential diagnosis.
          </p>
          ${vector.comorbidity.map(group => `
            <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: var(--radius);">
              <strong style="display: block; margin-bottom: 0.5rem;">${SecurityUtils.sanitizeHTML(group.name || '')}</strong>
              <div style="margin-bottom: 0.5rem;">Related disorders: ${group.disorders.map(d => SecurityUtils.sanitizeHTML(d || '')).join(', ')}</div>
              <em style="font-size: 0.9rem; color: var(--muted);">${SecurityUtils.sanitizeHTML(group.message || '')}</em>
            </div>
          `).join('')}
          <p style="margin-top: 1rem; font-size: 0.9rem;"><strong>Note:</strong> Professional evaluation is essential for accurate differential diagnosis when multiple disorders are suspected.</p>
        </div>
      `;
    }
    
    if (vector.requiresSubInquiry.length > 0) {
      html += `
        <div class="sub-inquiry-prompt">
          <h4>Additional Inquiry Recommended</h4>
          <p>The following conditions showed moderate probability and may benefit from more detailed assessment:</p>
          <ul>
            ${vector.requiresSubInquiry.map(d => `<li>${SecurityUtils.sanitizeHTML(d || '')}</li>`).join('')}
          </ul>
          <p style="margin-top: 1rem;"><em>Note: This would require professional evaluation to properly differentiate.</em></p>
        </div>
      `;
    }
    
    html += `
      <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(0,0,0,0.05); border-radius: var(--radius);">
        <h4>Important Reminders</h4>
        <ul style="margin-top: 1rem;">
          <li>These results are based on self-reporting and have inherent limitations.</li>
          <li>DSM-5 diagnosis requires clinical judgment and professional evaluation.</li>
          <li>Many conditions share overlapping symptoms; differential diagnosis is complex.</li>
          <li>If you have concerns, please consult with a licensed mental health professional.</li>
        </ul>
      </div>
    `;
    
      // HTML is already sanitized above
      SecurityUtils.safeInnerHTML(container, html);
      
      // Make instance globally accessible for integration step
      window.diagnosisEngine = this;
      
      // Display debug report if in development mode
      if (this.debugMode || window.location.search.includes('debug=true')) {
        this.debugReporter.displayReport('debug-report');
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderResults');
      ErrorHandler.showUserError('Failed to render results. Please refresh the page.');
    }
  }
  
  getCategoryForDisorder(disorderName) {
    // Find which category contains this disorder
    for (const [categoryKey, category] of Object.entries(DSM5_CATEGORIES)) {
      if (category.disorders[disorderName]) {
        return category.name;
      }
    }
    return 'Other';
  }
  
  showFullDetails(disorderName) {
    const treatmentData = TREATMENT_DATABASE[disorderName] || null;
    const detailsSection = document.getElementById('fullDetailsSection');
    
    if (detailsSection && treatmentData) {
      detailsSection.classList.remove('hidden');
      // renderTreatmentInformation should return sanitized HTML
      const treatmentHTML = this.renderTreatmentInformation(disorderName, treatmentData);
      SecurityUtils.safeInnerHTML(detailsSection, treatmentHTML);
      detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  renderTreatmentInformation(disorderName, treatmentData) {
    let html = `<div class="treatment-section" style="margin-top: 3rem; padding: 2rem; background: rgba(255,255,255,0.9); border-radius: var(--radius); box-shadow: var(--shadow);">`;
    html += `<h2 style="margin-bottom: 2rem; color: var(--brand);">Pattern Information: ${SecurityUtils.sanitizeHTML(disorderName || '')}</h2>`;
    
    // Non-directive framing
    html += `<div style="background: rgba(211, 47, 47, 0.1); border-left: 4px solid #d32f2f; border-radius: var(--radius); padding: 1rem; margin-bottom: 2rem;">`;
    html += `<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: #d32f2f;">Note:</strong> The following approaches are commonly explored under professional guidance. This information is for educational purposes only and does not constitute treatment recommendations.</p>`;
    html += `</div>`;
    
    // Support Approaches (renamed from Treatments)
    if (treatmentData.treatments) {
      html += `<div class="treatment-category"><h3 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--brand);">Commonly Associated Support Approaches</h3>`;
      
      if (treatmentData.treatments.behavioral?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Behavioral Treatments</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.behavioral.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.dietary?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Dietary Interventions</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.dietary.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.pharmacological?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Pharmacological Treatments</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.pharmacological.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.alternativeHealth?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Alternative Health Approaches</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.alternativeHealth.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.westernMedicine?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Western Medical Interventions</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.westernMedicine.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.easternMedicine?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Eastern Medicine Approaches</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.easternMedicine.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      html += `</div>`;
    }
    
    // Theoretical Frameworks
    if (treatmentData.theories) {
      html += `<div class="theory-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Theoretical Frameworks</h3>`;
      
      if (treatmentData.theories.biophysical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Biophysical Perspectives</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.biophysical.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.theories.metaphysical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Metaphysical Perspectives</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.metaphysical.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.theories.biochemical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Biochemical Factors</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.biochemical.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.theories.mythopoetical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Mythopoetical Perspectives</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.mythopoetical.forEach(item => {
          html += `<li>${SecurityUtils.sanitizeHTML(item || '')}</li>`;
        });
        html += `</ul></div>`;
      }
      
      html += `</div>`;
    }
    
    // Management Strategies
    if (treatmentData.managementStrategies?.length > 0) {
      html += `<div class="management-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Management Strategies</h3><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
      treatmentData.managementStrategies.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }
    
    // Potential Causes
    if (treatmentData.potentialCauses?.length > 0) {
      html += `<div class="causes-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Potential Causes</h3><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
      treatmentData.potentialCauses.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }
    
    // Environmental Factors
    if (treatmentData.environmentalFactors?.length > 0) {
      html += `<div class="environment-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Environmental Factors</h3><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
      treatmentData.environmentalFactors.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }
    
    html += `</div>`;
    return html;
  }

  /**
   * Save assessment progress to storage
   */
  saveProgress() {
    try {
      const progressData = {
        selectedCategories: this.selectedCategories,
        currentQuestionIndex: this.currentQuestionIndex,
        answers: this.answers,
        refinedQuestionSequence: this.refinedQuestionSequence,
        refinementRequested: this.refinementRequested,
        multiBranchingDetected: this.multiBranchingDetected,
        guideMode: this.guideMode,
        guideAnswers: this.guideAnswers,
        suggestedCategories: this.suggestedCategories,
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
      this.currentQuestionIndex = data.currentQuestionIndex || 0;
      this.answers = data.answers || {};
      this.refinedQuestionSequence = data.refinedQuestionSequence || [];
      this.refinementRequested = data.refinementRequested || false;
      this.multiBranchingDetected = data.multiBranchingDetected || false;
      this.guideMode = data.guideMode || false;
      this.guideAnswers = data.guideAnswers || {};
      this.suggestedCategories = data.suggestedCategories || [];
      this.analysisData = data.analysisData || this.analysisData;
      
      // Restore category selections
      if (this.selectedCategories.length > 0) {
        await this.loadDiagnosisData();
        
        this.selectedCategories.forEach(categoryKey => {
          const card = document.querySelector(`[data-category="${categoryKey}"]`);
          if (card) card.classList.add('selected');
        });
        
        const startAssessmentBtn = document.getElementById('startAssessment');
        if (startAssessmentBtn) startAssessmentBtn.disabled = false;
      }
      
      // If in progress, restore questionnaire state
      if (this.currentQuestionIndex > 0 && this.selectedCategories.length > 0) {
        await this.buildQuestionSequence();
        
        const questionnaireSection = document.getElementById('questionnaireSection');
        if (questionnaireSection) questionnaireSection.classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
    }
  }

  /**
   * Save results to history
   */
  saveResults() {
    try {
      // Save to localStorage for history (separate from progress)
      const historyData = this.dataStore.load('history') || [];
      historyData.push({
        ...this.analysisData,
        id: Date.now()
      });
      
      // Keep only last 10 assessments
      if (historyData.length > 10) {
        historyData.shift();
      }
      
      this.dataStore.save('history', historyData);
      this.dataStore.clear('progress'); // Clear progress after saving results
    } catch (error) {
      this.debugReporter.logError(error, 'saveResults');
    }
  }

  viewAnalysisData(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'diagnosis', 'DSM-5 Diagnostic Assessment');
      downloadFile(csv, `diagnosis-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      // Add non-diagnostic lock to exported data
      const exportData = {
        ...this.analysisData,
        nonDiagnosticLock: {
          statement: "This profile reflects self-reported pathology assessment. It does not establish diagnosis, identity, or prognosis.",
          forbiddenLanguage: ["You have", "You are"],
          replacementLanguage: "This pattern sometimes expresses as",
          questionFirstBias: "Agent must inquire before interpreting. Default to inquiry before suggestion."
        }
      };
      
      const json = exportJSON(exportData, 'pathology-assessment', 'Pathology Assessment');
      downloadFile(json, `diagnosis-analysis-${Date.now()}.json`, 'application/json');
    }
  }

  resetAssessment() {
    this.selectedCategories = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.refinedQuestionSequence = [];
    this.currentStage = 'selection';
    this.guideMode = false;
    this.guideAnswers = {};
    this.currentGuideQuestion = 0;
    this.suggestedCategories = [];
    this.refinementRequested = false;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      categories: [],
      refinementPasses: 0,
      maxRefinementPasses: 1,
      validationConsistency: null,
      scaleTranslation: {
        absent: [0, 3],
        subthreshold: [4, 6],
        clinicallySalient: [7, 10]
      },
      answers: {},
      scores: {},
      probabilities: {},
      conclusionVector: {}
    };
    
    sessionStorage.removeItem('diagnosisProgress');
    
    // Reset UI
    const categorySelection = document.getElementById('categorySelection');
    categorySelection.classList.remove('hidden');
    SecurityUtils.safeInnerHTML(categorySelection, `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="margin-bottom: 0.5rem;">Select Diagnostic Category</h2>
          <p style="color: var(--muted); margin: 0;">Choose the category you wish to explore. You can select multiple categories for a comprehensive assessment.</p>
        </div>
        <button class="btn btn-secondary" id="startHereGuide" style="white-space: nowrap;">
          🧭 Start Here - Not Sure?
        </button>
      </div>
      <div class="category-grid" id="categoryGrid"></div>
      <div style="text-align: center; margin-top: 2rem;">
        <button class="btn btn-primary" id="startAssessment" disabled>Begin Assessment</button>
      </div>
    `);
    
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.renderCategorySelection();
    this.attachEventListeners();
    document.getElementById('startAssessment').disabled = true;
  }
}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.diagnosisEngine = new DiagnosisEngine();
  });
} else {
  window.diagnosisEngine = new DiagnosisEngine();
}

