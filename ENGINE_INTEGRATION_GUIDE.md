# Engine Integration Guide

## Applying Error Handling & Accessibility Improvements

This guide shows how to apply the improvements made to `sovereignty-engine.js` to other assessment engines.

## Step 1: Import Utilities

Add these imports at the top of your engine file:

```javascript
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
```

## Step 2: Initialize DataStore in Constructor

In your constructor, add:

```javascript
constructor() {
  // ... existing initialization code ...
  
  // Initialize DataStore for persistent storage
  this.dataStore = new DataStore('your-engine-name-assessment');
  
  this.init();
}
```

## Step 3: Add Error Handling to Critical Methods

### init() method:
```javascript
init() {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.attachEventListeners();
        this.loadStoredData();
      });
    } else {
      this.attachEventListeners();
      this.loadStoredData();
    }
  } catch (error) {
    ErrorHandler.logError(error, 'YourEngine.init');
    ErrorHandler.showUserError('Failed to initialize assessment. Please refresh the page.');
  }
}
```

### startAssessment() method:
```javascript
startAssessment() {
  try {
    // ... existing code ...
    
    // Focus management for accessibility
    const container = document.getElementById('questionContainer');
    if (container) {
      DOMUtils.focusElement(container);
    }
  } catch (error) {
    ErrorHandler.logError(error, 'YourEngine.startAssessment');
    ErrorHandler.showUserError('Failed to start assessment. Please try again.');
  }
}
```

### nextQuestion() method:
```javascript
nextQuestion() {
  try {
    // ... existing validation code ...
    
    // Replace alert() with ErrorHandler.showUserError()
    if (!answered) {
      ErrorHandler.showUserError('Please select an answer before proceeding.');
      return;
    }
    
    // ... existing progression code ...
    
    // Focus management
    const questionCard = document.querySelector('.question-card');
    if (questionCard) {
      DOMUtils.focusElement(questionCard);
    }
  } catch (error) {
    ErrorHandler.logError(error, 'YourEngine.nextQuestion');
    ErrorHandler.showUserError('Failed to proceed to next question. Please try again.');
  }
}
```

## Step 4: Update saveProgress() Method

```javascript
saveProgress() {
  try {
    const progress = {
      // ... your progress data ...
    };
    
    // Use DataStore for versioned storage
    if (this.dataStore) {
      this.dataStore.save('progress', progress);
    } else {
      // Fallback to sessionStorage
      sessionStorage.setItem('yourEngineAssessment', JSON.stringify(progress));
    }
  } catch (error) {
    ErrorHandler.logError(error, 'YourEngine.saveProgress');
    // Don't show user error for save failures - it's not critical
  }
}
```

## Step 5: Update loadStoredData() Method

```javascript
loadStoredData() {
  try {
    let progress = null;
    
    // Try DataStore first
    if (this.dataStore) {
      progress = this.dataStore.load('progress');
    }
    
    // Fallback to sessionStorage
    if (!progress) {
      const stored = sessionStorage.getItem('yourEngineAssessment');
      if (stored) {
        progress = JSON.parse(stored);
      }
    }
    
    if (progress) {
      // ... restore state ...
    }
  } catch (error) {
    ErrorHandler.logError(error, 'YourEngine.loadStoredData');
    ErrorHandler.showUserError('Failed to load saved progress. Starting fresh assessment.');
  }
}
```

## Step 6: Replace alert() Calls

Replace all `alert()` calls with `ErrorHandler.showUserError()`:

```javascript
// Before:
alert('Please select an answer before proceeding.');

// After:
ErrorHandler.showUserError('Please select an answer before proceeding.');
```

## Step 7: Add JSDoc Comments

Add documentation to key methods:

```javascript
/**
 * Brief description of what the method does
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 */
methodName(paramName) {
  // ...
}
```

## Step 8: Add ARIA Labels to Dynamic Content

When rendering questions, add ARIA attributes:

```javascript
renderCurrentQuestion() {
  const question = this.questionSequence[this.currentQuestionIndex];
  const container = document.getElementById('questionContainer');
  
  container.innerHTML = `
    <div class="question-card" 
         role="region" 
         aria-labelledby="question-title"
         aria-live="polite">
      <h2 id="question-title">${question.text}</h2>
      <!-- ... rest of question ... -->
    </div>
  `;
  
  // Focus the question for accessibility
  DOMUtils.focusElement(container);
}
```

## Step 9: Sanitize User Input

When displaying user input or data:

```javascript
// Before displaying user data
const sanitized = SecurityUtils.sanitizeForDisplay(userData);
element.innerHTML = sanitized;
```

## Checklist

- [ ] Import utilities from `shared/utils.js`
- [ ] Initialize DataStore in constructor
- [ ] Add try-catch to `init()` method
- [ ] Add try-catch to `startAssessment()` method
- [ ] Add try-catch to `nextQuestion()` method
- [ ] Update `saveProgress()` to use DataStore
- [ ] Update `loadStoredData()` to use DataStore
- [ ] Replace all `alert()` calls with `ErrorHandler.showUserError()`
- [ ] Add focus management with `DOMUtils.focusElement()`
- [ ] Add JSDoc comments to key methods
- [ ] Add ARIA labels to dynamic content
- [ ] Sanitize user input before display

## Example: Complete Method Template

```javascript
/**
 * Process user answer and update scores
 * 
 * @param {Object} question - Question object
 * @param {number|Array} answerValue - Selected answer value(s)
 */
processAnswer(question, answerValue) {
  try {
    // Sanitize input
    const sanitizedValue = SecurityUtils.sanitizeForDisplay(answerValue);
    
    // Process answer
    this.answers[question.id] = {
      questionId: question.id,
      value: sanitizedValue,
      timestamp: new Date().toISOString()
    };
    
    // Update scores
    this.updateScores(question, sanitizedValue);
    this.saveProgress();
    
  } catch (error) {
    ErrorHandler.logError(error, 'YourEngine.processAnswer');
    ErrorHandler.showUserError('Failed to process answer. Please try again.');
  }
}
```

## Benefits

1. **Better Error Handling**: Users see friendly error messages instead of browser alerts
2. **Data Persistence**: Versioned storage with migration support
3. **Accessibility**: Improved keyboard navigation and screen reader support
4. **Security**: Input sanitization prevents XSS attacks
5. **Maintainability**: Centralized error handling and utilities
6. **User Experience**: Focus management improves navigation flow

