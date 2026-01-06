# Diagnosis Engine - Complete System Documentation

## Overview

The Diagnosis Engine is a comprehensive DSM-5 self-reporting diagnostic assessment system featuring 100+ disorders across 13+ diagnostic categories. It provides an educational tool for self-assessment with category selection guidance, comorbidity detection, refined assessment questions, and comprehensive treatment information.

**File Location:** `diagnosis-engine.js`  
**Associated HTML:** `diagnosis.html`  
**Data Sources:** `dsm5-data/` directory

---

## System Architecture

### Core Components

1. **DiagnosisEngine Class** - Main engine controller
2. **Data Modules** - Imported from `dsm5-data/`:
   - `DSM5_CATEGORIES` - All diagnostic categories and disorders
   - `QUESTION_TEMPLATES` - Question generation templates
   - `VALIDATION_PAIRS` - Cross-validation question pairs
   - `SCORING_THRESHOLDS` - Thresholds for diagnosis probability
   - `SUB_INQUIRY_QUESTIONS` - Follow-up questions
   - `COMORBIDITY_GROUPS` - Common co-occurring disorders
   - `COMORBIDITY_REFINEMENT_QUESTIONS` - Questions to differentiate comorbidities
   - `MULTI_BRANCHING_THRESHOLDS` - Thresholds for multi-branching detection
   - `REFINED_QUESTIONS` - Refined diagnostic questions
   - `DIFFERENTIAL_QUESTIONS` - Questions for differential diagnosis
   - `CATEGORY_GUIDE_QUESTIONS` - Questions for category selection guide
   - `TREATMENT_DATABASE` - Treatment information

### State Management

The engine maintains the following state:
- `selectedCategories` - User-selected diagnostic categories
- `currentCategoryIndex` - Current category being assessed
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Main question sequence
- `refinedQuestionSequence` - Refined questions for comorbidity
- `currentStage` - Current stage: 'selection', 'questionnaire', 'results'
- `guideMode` - Whether category guide is active
- `guideAnswers` - Answers from category guide
- `suggestedCategories` - Categories suggested by guide
- `refinementRequested` - Whether user requested refinement
- `multiBranchingDetected` - Whether comorbidity detected
- `analysisData` - Complete analysis results

---

## Stage-by-Stage Breakdown

### Stage 1: Category Selection

**Purpose:** User selects which diagnostic categories to assess

**Methods:**
- `renderCategorySelection()` - Displays category grid
- `toggleCategory(categoryKey, card)` - Toggles category selection
- `startGuide()` - Initiates category selection guide

**Category Selection Guide:**
- Optional guided mode for users unsure which categories to select
- `renderGuideQuestion()` - Displays guide questions
- `answerGuide(answer)` - Processes guide answers
- `completeGuide()` - Calculates suggested categories based on guide answers
- Uses `CATEGORY_GUIDE_QUESTIONS` to recommend relevant categories

**User Flow:**
1. User sees grid of all available categories
2. User can either:
   - Click "Start Here - Not Sure?" to use guide
   - Directly select categories from grid
3. Selected categories are highlighted
4. "Start Assessment" button becomes enabled when at least one category selected

---

### Stage 2: Questionnaire

**Purpose:** Present diagnostic questions and collect answers

**Methods:**
- `startAssessment()` - Begins questionnaire phase
- `buildQuestionSequence()` - Constructs question sequence from selected categories
- `renderCurrentQuestion()` - Displays current question
- `nextQuestion()` - Advances to next question
- `prevQuestion()` - Returns to previous question
- `saveProgress()` - Saves answers to localStorage

**Question Sequence Building:**
- For each selected category:
  - For each disorder in category:
    - For each criterion in disorder:
      - For each symptom in criterion:
        - Generate question using `QUESTION_TEMPLATES`
        - Add to sequence with metadata (category, disorder, criterion, symptom)

**Question Format:**
- Likert scale: 0-10 (0 = Not at all/Never, 10 = Extremely/Always)
- Questions reframed to avoid double negatives
- Uses "degree of presence" language
- Each question has:
  - `id` - Unique identifier
  - `question` - Question text
  - `category` - Diagnostic category
  - `disorder` - Disorder name
  - `criterion` - Criterion identifier
  - `symptom` - Symptom identifier (if applicable)
  - `weight` - Question weight for scoring

**Progress Tracking:**
- Progress bar shows completion percentage
- Previous/Next buttons for navigation
- Answers auto-saved on change
- Can abandon assessment (with confirmation)

---

### Stage 3: Comorbidity Detection & Refinement

**Purpose:** Detect potential comorbidity and offer refined questions

**Methods:**
- `completeAssessment()` - Called when main questionnaire complete
- `detectComorbidity()` - Analyzes answers for comorbidity patterns
- `buildRefinedQuestionSequence(comorbidityGroups)` - Builds refined questions
- `offerRefinement(comorbidityGroups)` - Offers refinement option to user
- `startRefinementQuestions()` - Begins refined question sequence

**Comorbidity Detection:**
- Checks `COMORBIDITY_GROUPS` for common co-occurring disorders
- Analyzes scores to detect patterns matching comorbidity groups
- Uses `MULTI_BRANCHING_THRESHOLDS` to determine if refinement needed

**Refinement Process:**
- If comorbidity detected, user sees notification
- User can choose to:
  - Complete refined assessment (additional questions)
  - Skip to results
- Refined questions use `COMORBIDITY_REFINEMENT_QUESTIONS` and `DIFFERENTIAL_QUESTIONS`
- Helps differentiate between similar disorders

---

### Stage 4: Results Calculation

**Purpose:** Calculate diagnostic scores and probabilities

**Methods:**
- `calculateResults()` - Main calculation method
- `calculateValidationAdjustment(categoryKey, disorderName)` - Applies validation adjustments
- `buildConclusionVector()` - Builds final diagnostic conclusion

**Scoring Algorithm:**
1. **For each disorder:**
   - For each criterion:
     - Calculate criterion score from symptom answers
     - Apply symptom weights
     - Check if criterion threshold met
   - Sum scores for all met criteria
   - Calculate raw probability: `totalScore / maxPossibleScore`
   - Apply validation adjustment (consistency checks)
   - Final probability: `rawProbability * validationAdjustment`

2. **Validation Adjustments:**
   - Uses `VALIDATION_PAIRS` to check answer consistency
   - Calculates inconsistency score
   - Adjusts probability based on consistency

3. **Conclusion Vector:**
   - Primary diagnosis (highest probability)
   - Secondary diagnoses (other high probabilities)
   - All scores and probabilities stored in `analysisData`

---

### Stage 5: Results Display

**Purpose:** Present diagnostic results to user

**Methods:**
- `showResults()` - Transitions to results view
- `renderResults()` - Renders results display
- `saveResults()` - Saves complete results

**Results Display Includes:**
- Primary diagnosis with probability
- Secondary diagnoses (if any)
- All disorder scores and probabilities
- Treatment information from `TREATMENT_DATABASE`
- Category breakdown
- Export options (JSON/CSV/AI Agent format)

**Treatment Information:**
- Behavioral interventions
- Pharmacological options
- Alternative treatments
- Condition directory with full breakdowns

---

## Key Methods Reference

### Initialization
- `init()` - Initializes engine, renders category selection, attaches listeners
- `attachEventListeners()` - Sets up all event handlers
- `loadStoredData()` - Loads saved progress from localStorage

### Category Management
- `renderCategorySelection()` - Renders category selection grid
- `toggleCategory(categoryKey, card)` - Toggles category selection
- `startGuide()` - Starts category selection guide
- `renderGuideQuestion()` - Renders guide question
- `answerGuide(answer)` - Processes guide answer
- `completeGuide()` - Completes guide and suggests categories

### Question Management
- `buildQuestionSequence()` - Builds main question sequence
- `renderCurrentQuestion()` - Renders current question
- `nextQuestion()` - Advances to next question
- `prevQuestion()` - Returns to previous question
- `saveProgress()` - Saves current progress

### Assessment Completion
- `completeAssessment()` - Called when questionnaire complete
- `detectComorbidity()` - Detects comorbidity patterns
- `buildRefinedQuestionSequence(groups)` - Builds refined questions
- `offerRefinement(groups)` - Offers refinement option
- `startRefinementQuestions()` - Starts refined questions

### Results Calculation
- `calculateResults()` - Main calculation method
- `calculateValidationAdjustment(category, disorder)` - Validation adjustments
- `buildConclusionVector()` - Builds final conclusion

### Results Display
- `showResults()` - Shows results section
- `renderResults()` - Renders results
- `saveResults()` - Saves results

### Export Functions
- `exportAnalysis(format)` - Exports results (JSON/CSV/AI Agent)
- Uses `exportForAIAgent()`, `exportJSON()`, `downloadFile()` from `shared/export-utils.js`

### Utility Methods
- `resetAssessment()` - Resets all state
- `clearAllCachedData()` - Clears localStorage
- `logDebug(message, data)` - Debug logging
- `updateDebugPanel()` - Updates debug display

---

## Data Flow

1. **User selects categories** â†’ `selectedCategories` populated
2. **User starts assessment** â†’ `buildQuestionSequence()` creates question sequence
3. **User answers questions** â†’ Answers stored in `answers` object
4. **Questionnaire complete** â†’ `completeAssessment()` called
5. **Comorbidity check** â†’ `detectComorbidity()` analyzes patterns
6. **Refinement (optional)** â†’ Additional questions if comorbidity detected
7. **Results calculation** â†’ `calculateResults()` processes all answers
8. **Results display** â†’ `renderResults()` shows final results
9. **Export** â†’ User can export results in multiple formats

---

## Export Formats

### JSON Export
- Complete analysis data
- All answers
- Question sequence
- Scores and probabilities
- Treatment information

### CSV Export
- Tabular format
- Answers and scores
- Suitable for spreadsheet analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes interpretation instructions
- Structured for ChatGPT, Claude, etc.
- Uses `exportForAIAgent()` utility

---

## Technical Notes

### Storage
- Currently uses localStorage/sessionStorage (public, no auth)
- Planned: Firebase integration (see `docs/FIREBASE_INTEGRATION_PLAN.md`)
- Progress auto-saved during assessment
- Results saved on completion

### Question Reframing
- Questions reframed to avoid double negatives
- Uses "degree of presence" language
- Example: "To what degree is fear present in your life?" instead of "Do you not feel fear?"

### Validation
- Cross-validation using `VALIDATION_PAIRS`
- Consistency checks adjust final probabilities
- Inconsistent answers reduce probability scores

### Debug Mode
- Toggleable debug mode
- Logs all engine operations
- Debug panel shows state and operations
- Useful for troubleshooting

---

## Future Enhancements

- Firebase integration for secure storage
- Professional licensing system
- Enhanced comorbidity detection
- Machine learning for pattern recognition
- Integration with treatment providers

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

