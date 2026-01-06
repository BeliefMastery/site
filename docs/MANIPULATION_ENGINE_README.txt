# Manipulation Analysis Engine - Complete System Documentation

## Overview

The Manipulation Engine identifies manipulation vectors and tactics through systematic analysis of symptoms, effects, and consequences. It maps responses to 6 core manipulation vectors and 63+ tactics, providing comprehensive analysis of manipulation patterns.

**File Location:** `manipulation-engine.js`  
**Associated HTML:** `manipulation.html`  
**Data Sources:** `manipulation-data/` directory

---

## System Architecture

### Core Components

1. **ManipulationEngine Class** - Main engine controller
2. **Data Modules** - Imported from `manipulation-data/`:
   - `MANIPULATION_VECTORS` - 6 core manipulation vectors
   - `MANIPULATION_TACTICS` - 63+ manipulation tactics
   - `SYMPTOM_QUESTIONS` - Questions about manipulation symptoms
   - `EFFECT_QUESTIONS` - Questions about effects of manipulation
   - `CONSEQUENCE_QUESTIONS` - Questions about consequences
   - `VECTOR_MAPPING` - Maps questions to vectors

### State Management

The engine maintains:
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Complete question sequence
- `analysisData` - Analysis results:
  - `symptoms` - Symptom category scores
  - `effects` - Effect category scores
  - `consequences` - Consequence category scores
  - `vectorScores` - Scores for each manipulation vector
  - `identifiedVectors` - Vectors exceeding threshold
  - `tactics` - Relevant tactics for identified vectors

---

## Stage-by-Stage Breakdown

### Stage 1: Question Sequence Building

**Purpose:** Build comprehensive question sequence from all categories

**Methods:**
- `buildQuestionSequence()` - Constructs complete sequence
- `init()` - Initializes and builds sequence

**Question Categories:**

1. **Symptom Questions** (`SYMPTOM_QUESTIONS`)
   - Organized by symptom category
   - Assess presence of manipulation symptoms
   - Categories include: emotional, behavioral, cognitive, relational, etc.

2. **Effect Questions** (`EFFECT_QUESTIONS`)
   - Organized by effect category
   - Assess impact of manipulation
   - Categories include: psychological, physical, social, financial, etc.

3. **Consequence Questions** (`CONSEQUENCE_QUESTIONS`)
   - Organized by consequence category
   - Assess long-term consequences
   - Categories include: relationship, career, health, identity, etc.

**Question Structure:**
- Each question has:
  - `id` - Unique identifier
  - `question` - Question text
  - `category` - 'symptom', 'effect', or 'consequence'
  - `subcategory` - Specific category within type
  - `weight` - Question weight for scoring

**Sequence Order:**
- All symptom questions first
- Then all effect questions
- Finally all consequence questions
- Questions within each category grouped by subcategory

---

### Stage 2: Questionnaire

**Purpose:** Present questions and collect answers

**Methods:**
- `startAssessment()` - Begins questionnaire
- `renderCurrentQuestion()` - Displays current question
- `nextQuestion()` - Advances to next question
- `prevQuestion()` - Returns to previous question
- `saveProgress()` - Saves answers

**Question Format:**
- Likert scale: 0-10
- Category label shown (Symptom/Effect/Consequence)
- Subcategory displayed
- Questions assess degree of presence/impact
- Answers auto-saved on change

**Progress Tracking:**
- Progress bar shows completion
- Previous/Next navigation
- Can abandon assessment (with confirmation)

---

### Stage 3: Vector Score Calculation

**Purpose:** Calculate scores for each manipulation vector

**Methods:**
- `completeAssessment()` - Called when questionnaire complete
- `calculateVectorScores()` - Calculates vector scores
- `findQuestionById(id)` - Finds question by ID

**Scoring Algorithm:**

For each of the 6 manipulation vectors:
1. **Get vector mapping** from `VECTOR_MAPPING[vectorKey]`
2. **Collect relevant questions:**
   - Symptom questions mapped to vector
   - Effect questions mapped to vector
   - Consequence questions mapped to vector
3. **Calculate scores:**
   - For each relevant question:
     - Get answer (0-10)
     - Apply question weight
     - Add to total: `answer * weight`
   - Calculate average: `totalScore / questionCount`
   - Apply vector weight: `averageScore * vector.weight`
4. **Store in `analysisData.vectorScores[vectorKey]`:**
   - `name` - Vector name
   - `description` - Vector description
   - `rawScore` - Average score
   - `weightedScore` - Weighted score
   - `questionCount` - Number of questions answered
   - `threshold` - Threshold for identification

**The 6 Manipulation Vectors:**
1. Fear
2. Dependency
3. Deception
4. Obsession
5. Adoration
6. Sexual Coercion

---

### Stage 4: Vector Identification

**Purpose:** Identify which vectors exceed threshold

**Methods:**
- `identifyVectors()` - Identifies vectors exceeding threshold
- `identifyTactics()` - Finds relevant tactics

**Identification Process:**
1. For each vector score:
   - Check if `weightedScore >= (threshold * 10)`
   - If yes, add to `identifiedVectors`
2. Sort by weighted score (highest first)
3. Store in `analysisData.identifiedVectors`

**Tactic Identification:**
- For each identified vector:
  - Find all tactics in `MANIPULATION_TACTICS` where `tactic.vector === vector.key`
  - Add to `analysisData.tactics`
- Provides specific tactics associated with identified vectors

---

### Stage 5: Results Display

**Purpose:** Present manipulation analysis results

**Methods:**
- `renderResults()` - Renders results display
- `saveProgress()` - Saves complete analysis

**Results Display Includes:**
- Identified manipulation vectors (with scores)
- Relevant tactics for each vector
- Symptom, effect, and consequence breakdowns
- Vector scores (all 6 vectors)
- Export options (JSON/CSV/AI Agent format)

**Results Organization:**
- Primary vectors (exceeding threshold) shown first
- Each vector shows:
  - Name and description
  - Weighted score
  - Associated tactics
  - Symptom/effect/consequence patterns
- All vector scores shown for comparison

---

## Key Methods Reference

### Initialization
- `init()` - Initializes engine, builds sequence, attaches listeners
- `buildQuestionSequence()` - Builds complete question sequence
- `attachEventListeners()` - Sets up event handlers
- `loadStoredData()` - Loads saved progress

### Question Management
- `startAssessment()` - Begins questionnaire
- `renderCurrentQuestion()` - Renders current question
- `nextQuestion()` - Advances to next
- `prevQuestion()` - Returns to previous
- `saveProgress()` - Saves progress

### Analysis
- `completeAssessment()` - Completes assessment
- `calculateVectorScores()` - Calculates vector scores
- `findQuestionById(id)` - Finds question by ID
- `identifyVectors()` - Identifies vectors exceeding threshold
- `identifyTactics()` - Finds relevant tactics

### Results Display
- `renderResults()` - Renders results
- `saveProgress()` - Saves complete analysis

### Export Functions
- `exportAnalysis(format)` - Exports analysis (JSON/CSV/AI Agent)
- Uses utilities from `shared/export-utils.js`

### Utility Methods
- `resetAssessment()` - Resets all state
- `clearAllCachedData()` - Clears localStorage
- `abandonAssessment()` - Abandons with confirmation

---

## Data Flow

1. **Engine initializes** â†’ `buildQuestionSequence()` creates sequence
2. **User answers questions** â†’ Answers stored in `answers`
3. **Questionnaire complete** â†’ `completeAssessment()` called
4. **Vector calculation** â†’ `calculateVectorScores()` processes answers
5. **Vector identification** â†’ `identifyVectors()` finds exceeding thresholds
6. **Tactic identification** â†’ `identifyTactics()` finds relevant tactics
7. **Results display** â†’ `renderResults()` shows analysis
8. **Export** â†’ User exports analysis

---

## Export Formats

### JSON Export
- Complete analysis data
- All answers
- Question sequence
- Vector scores
- Identified vectors
- Tactics
- Symptom/effect/consequence breakdowns

### CSV Export
- Tabular format
- Answers and scores
- Suitable for analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes interpretation instructions
- Vector patterns
- Tactics information
- Ready for import

---

## Technical Notes

### Vector Mapping
- `VECTOR_MAPPING` maps questions to vectors
- Each vector has:
  - `symptoms` - Array of symptom question IDs
  - `effects` - Array of effect question IDs
  - `consequences` - Array of consequence question IDs
  - `threshold` - Threshold for identification

### Scoring System
- Questions weighted individually
- Vectors weighted for importance
- Final score: `(averageQuestionScore * questionWeight) * vectorWeight`
- Threshold: `threshold * 10` (converts to 0-10 scale)

### Dark Tetrad Integration
- Some vectors map to Dark Tetrad traits:
  - Narcissism
  - Psychopathy
  - Machiavellianism
  - Sadism
- Tactics may reference Dark Tetrad patterns

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

