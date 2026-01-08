# Engine Optimization Pattern - Quick Reference

This document provides a step-by-step pattern for optimizing assessment engines. Use this as a template for the remaining 8 engines.

---

## Step-by-Step Optimization Pattern

### Step 1: Update Imports (Top of File)

**Before:**
```javascript
import { DATA } from './data-folder/data.js';
import { QUESTIONS } from './data-folder/questions.js';
```

**After:**
```javascript
import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

// Data modules - will be loaded lazily
let DATA;
let QUESTIONS;
```

---

### Step 2: Update Constructor

**Add these properties:**
```javascript
constructor() {
  // ... existing properties ...
  
  // Initialize debug reporter
  this.debugReporter = createDebugReporter('EngineName');
  setDebugReporter(this.debugReporter);
  this.debugReporter.markInitialized();
  
  // Initialize data store
  this.dataStore = new DataStore('engine-name-assessment', '1.0.0');
  
  this.init();
}
```

---

### Step 3: Add Async Data Loading Method

```javascript
/**
 * Load engine data modules asynchronously
 * @returns {Promise<void>}
 */
async loadEngineData() {
  if (DATA && QUESTIONS) {
    return; // Already loaded
  }

  try {
    // Load data modules
    const dataModule = await loadDataModule(
      './data-folder/data.js',
      'Data Name'
    );
    DATA = dataModule.DATA;

    const questionsModule = await loadDataModule(
      './data-folder/questions.js',
      'Questions Data'
    );
    QUESTIONS = questionsModule.QUESTIONS;

    this.debugReporter.recordSection('Section Name', QUESTIONS?.length || 0);
  } catch (error) {
    this.debugReporter.logError(error, 'loadEngineData');
    ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
    throw error;
  }
}
```

---

### Step 4: Make Build Methods Async

**Before:**
```javascript
buildSequence() {
  let questions = [...QUESTIONS];
  this.questionSequence = questions;
}
```

**After:**
```javascript
/**
 * Build question sequence
 * @returns {Promise<void>}
 */
async buildSequence() {
  await this.loadEngineData();
  
  let questions = [...QUESTIONS];
  this.questionSequence = questions;
  this.debugReporter.recordQuestionCount(questions.length);
}
```

**Update all calls:**
```javascript
// Before:
this.buildSequence();

// After:
await this.buildSequence();
```

---

### Step 5: Update saveProgress and loadStoredData

**Before:**
```javascript
saveProgress() {
  sessionStorage.setItem('engineProgress', JSON.stringify({
    currentPhase: this.currentPhase,
    answers: this.answers
  }));
}

loadStoredData() {
  const stored = sessionStorage.getItem('engineProgress');
  if (stored) {
    const data = JSON.parse(stored);
    this.currentPhase = data.currentPhase;
    this.answers = data.answers;
  }
}
```

**After:**
```javascript
/**
 * Save assessment progress to storage
 */
saveProgress() {
  try {
    const progressData = {
      currentPhase: this.currentPhase,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      // ... other state ...
      analysisData: this.analysisData
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
    this.analysisData = data.analysisData || this.analysisData;
    
    // Restore questionnaire state
    if (this.currentQuestionIndex > 0 || this.currentPhase > 1) {
      if (this.currentPhase === 1) {
        await this.buildSequence();
      } else if (this.currentPhase === 2) {
        await this.buildPhase2Sequence();
      }
      // ... etc
      
      this.renderCurrentQuestion();
    }
  } catch (error) {
    this.debugReporter.logError(error, 'loadStoredData');
    ErrorHandler.showUserError('Failed to load saved progress.');
  }
}
```

---

### Step 6: Update renderCurrentQuestion

**Before:**
```javascript
renderCurrentQuestion() {
  const question = this.questionSequence[this.currentQuestionIndex];
  const container = document.getElementById('questionContainer');
  container.innerHTML = html;
}
```

**After:**
```javascript
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
    // ... render logic ...
    
    // Sanitize HTML (if user content is included)
    // Note: Template-generated HTML from trusted sources is generally safe
    container.innerHTML = html;
    
    // Attach listeners, update UI, etc.
    this.updateNavigation();
    
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
```

---

### Step 7: Update completePhase/nextQuestion

**Before:**
```javascript
completePhase() {
  if (this.currentPhase === 1) {
    this.buildPhase2Sequence();
  }
}

nextQuestion() {
  this.currentQuestionIndex++;
  this.renderCurrentQuestion();
  if (this.currentQuestionIndex >= this.questionSequence.length) {
    this.completePhase();
  }
}
```

**After:**
```javascript
/**
 * Complete current phase and proceed to next
 * @returns {Promise<void>}
 */
async completePhase() {
  try {
    if (this.currentPhase === 1) {
      await this.buildPhase2Sequence();
      this.renderCurrentQuestion();
    } else if (this.currentPhase === 2) {
      await this.buildPhase3Sequence();
      this.renderCurrentQuestion();
    } else {
      this.completeAssessment();
    }
  } catch (error) {
    this.debugReporter.logError(error, 'completePhase');
    ErrorHandler.showUserError('Failed to complete phase. Please try again.');
  }
}

async nextQuestion() {
  // Check validation
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
    await this.completePhase();
  }
}
```

---

### Step 8: Update init() Method

**Before:**
```javascript
init() {
  this.attachEventListeners();
  this.loadStoredData();
  this.buildSequence();
}
```

**After:**
```javascript
init() {
  this.attachEventListeners();
  this.loadStoredData().catch(error => {
    this.debugReporter.logError(error, 'init');
  });
}
```

---

### Step 9: Add Keyboard Navigation (Optional but Recommended)

```javascript
attachEventListeners() {
  // ... existing listeners ...
  
  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('button, input[type="radio"], input[type="checkbox"]')) {
      return; // Let default behavior handle it
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
```

---

### Step 10: Update HTML File

**Add to `<head>`:**
```html
<!-- Resource hints for performance -->
<link rel="preload" href="./engine-name-engine.js" as="script">
<link rel="preload" href="./shared/data-loader.js" as="script">
<link rel="preload" href="./shared/debug-reporter.js" as="script">
<link rel="preload" href="./shared/utils.js" as="script">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Add to script section:**
```html
<script type="module">
  import { initializePerformanceMonitoring } from './shared/performance-monitor.js';
  
  // Initialize performance monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializePerformanceMonitoring();
    });
  } else {
    initializePerformanceMonitoring();
  }
  
  // Show debug report container if debug mode is enabled
  if (window.location.search.includes('debug=true')) {
    const debugContainer = document.getElementById('debug-report');
    if (debugContainer) {
      debugContainer.style.display = 'block';
    }
  }
  
  // ... rest of engine initialization ...
</script>
```

**Add debug container before closing `</body>`:**
```html
<!-- Debug Report Container (visible when ?debug=true in URL) -->
<div id="debug-report" style="display: none;"></div>
```

---

### Step 11: Add Skip Link (If Main HTML Page)

**Add immediately after `<body>` tag:**
```html
<!-- Skip link for keyboard navigation -->
<a href="#main" class="skip-link">Skip to main content</a>
```

**Ensure main content has `id="main"` or update skip link href accordingly.**

---

### Step 12: Add JSDoc Comments

Add JSDoc comments to all public methods:

```javascript
/**
 * Brief description of what the method does
 * @param {Type} paramName - Description of parameter
 * @returns {Type} Description of return value
 * @throws {Error} When/why error is thrown
 */
```

---

## Testing Checklist

After optimization, verify:

- [ ] Data loads asynchronously (check Network tab - no blocking)
- [ ] Debug report appears with `?debug=true` in URL
- [ ] Error handling shows user-friendly messages
- [ ] Keyboard navigation works (Arrow keys, Ctrl+Enter)
- [ ] Progress saves and loads correctly
- [ ] Performance metrics are logged (check console)
- [ ] No console errors
- [ ] Assessment completes successfully
- [ ] Results render correctly
- [ ] Export functions work

---

## Quick Copy-Paste Checklist

For each remaining engine:

1. [ ] Update imports (Step 1)
2. [ ] Update constructor (Step 2)
3. [ ] Add loadEngineData() (Step 3)
4. [ ] Make build methods async (Step 4)
5. [ ] Update saveProgress/loadStoredData (Step 5)
6. [ ] Update renderCurrentQuestion (Step 6)
7. [ ] Update completePhase/nextQuestion (Step 7)
8. [ ] Update init() (Step 8)
9. [ ] Add keyboard navigation (Step 9)
10. [ ] Update HTML file (Step 10)
11. [ ] Add skip link if main page (Step 11)
12. [ ] Add JSDoc comments (Step 12)
13. [ ] Test all functionality (Testing Checklist)

---

**Estimated Time per Engine:** 15-30 minutes  
**Total Remaining:** 8 engines  
**Estimated Completion Time:** 2-4 hours

