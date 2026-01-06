# Temperament Analyzer Engine - Complete System Documentation

## Overview

The Temperament Engine maps position on the masculine-feminine temperament spectrum through comprehensive questions covering behavioral patterns, intimate dynamics, emotional responses to intimacy, attraction responsiveness, and relationship polarity. Based on Chapter 7: Timeless Archetypes from "Sovereign of Mind".

**File Location:** `temperament-engine.js`  
**Associated HTML:** `temperament.html`  
**Data Sources:** `temperament-data/` directory

---

## System Architecture

### Core Components

1. **TemperamentEngine Class** - Main engine controller
2. **Data Modules** - Imported from `temperament-data/`:
   - `TEMPERAMENT_DIMENSIONS` - Behavioral pattern dimensions
   - `INTIMATE_DYNAMICS` - Intimate dynamics categories
   - `ATTRACTION_RESPONSIVENESS` - Attraction responsiveness categories
   - `TEMPERAMENT_SCORING` - Scoring weights and thresholds

### State Management

The engine maintains:
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Complete question sequence
- `analysisData` - Analysis results:
  - `dimensionScores` - Scores for each dimension
  - `overallTemperament` - Overall temperament category
  - `variationAnalysis` - Variation across dimensions
  - `allAnswers` - All raw answers
  - `questionSequence` - Question sequence metadata

---

## Stage-by-Stage Breakdown

### Stage 1: Question Sequence Building

**Purpose:** Build comprehensive question sequence from all categories

**Methods:**
- `buildQuestionSequence()` - Constructs complete sequence
- `init()` - Initializes and builds sequence

**Question Categories:**

1. **Temperament Dimensions** (`TEMPERAMENT_DIMENSIONS`)
   - Behavioral patterns
   - Decision-making styles
   - Communication patterns
   - Emotional expression
   - Leadership styles
   - Conflict resolution

2. **Intimate Dynamics** (`INTIMATE_DYNAMICS`)
   - Sexual preferences
   - Sexual positions
   - Intimacy styles
   - Emotional responses to intimacy
   - Physical expression
   - Intimate communication

3. **Attraction Responsiveness** (`ATTRACTION_RESPONSIVENESS`)
   - What attracts you
   - How you respond to attraction
   - Relationship initiation
   - Courtship patterns
   - Polarity dynamics

**Question Structure:**
- Each question has:
  - `id` - Unique identifier
  - `type` - 'dimension', 'intimate', or 'attraction'
  - `dimension` or `category` - Category key
  - `dimensionName` or `categoryName` - Category name
  - `question` - Question text
  - `description` - Category description
  - `masculineWeight` - Weight toward masculine
  - `feminineWeight` - Weight toward feminine

**Sequence Order:**
- All dimension questions
- Then intimate dynamics questions
- Finally attraction responsiveness questions
- Questions within each category grouped

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
- Category label shown (Dimension/Intimate/Attraction)
- Category name displayed
- Questions assess behavioral patterns and preferences
- Answers auto-saved on change

**Progress Tracking:**
- Progress bar shows completion
- Previous/Next navigation
- Can abandon assessment (with confirmation)

---

### Stage 3: Results Calculation

**Purpose:** Calculate dimension scores and overall temperament

**Methods:**
- `calculateResults()` - Main calculation method
- `analyzeVariation()` - Analyzes variation across dimensions

**Scoring Algorithm:**

1. **Group Answers by Dimension/Category:**
   - Group all answers by their dimension/category
   - Each group contains questions and answers for that dimension

2. **Calculate Dimension Scores:**
   - For each dimension/category:
     - For each question in group:
       - Normalize answer: `(answer - 5) / 5` (converts 0-10 to -1 to 1)
       - Calculate masculine contribution: `normalizedAnswer * question.masculineWeight`
       - Calculate feminine contribution: `normalizedAnswer * question.feminineWeight`
     - Apply dimension weight from `TEMPERAMENT_SCORING.dimensionWeights`
     - Calculate average masculine: `sum(masculineContributions * dimWeight) / sum(weights)`
     - Calculate average feminine: `sum(feminineContributions * dimWeight) / sum(weights)`
     - Net score: `masculine - feminine`
     - Store in `analysisData.dimensionScores[dimensionKey]`

3. **Calculate Overall Temperament:**
   - Sum all dimension scores (weighted)
   - Calculate overall masculine score
   - Calculate overall feminine score
   - Net score: `overallMasculine - overallFeminine`
   - Normalize to 0-1: `(netScore + 1) / 2`
     - 1 = highly masculine
     - 0 = highly feminine
     - 0.5 = balanced

4. **Determine Temperament Category:**
   - Use thresholds from `TEMPERAMENT_SCORING.thresholds`:
     - `highly_masculine` - Score >= threshold
     - `predominantly_masculine` - Score >= threshold
     - `balanced_masculine` - Score >= threshold
     - `balanced` - Score around 0.5
     - `balanced_feminine` - Score <= threshold
     - `predominantly_feminine` - Score <= threshold
     - `highly_feminine` - Score <= threshold

5. **Variation Analysis:**
   - Identify dimensions with high variation
   - Note expected variations (common patterns)
   - Variation is expected and normal

---

### Stage 4: Results Display

**Purpose:** Present temperament analysis results

**Methods:**
- `renderResults()` - Renders results display
- `saveProgress()` - Saves complete analysis

**Results Display Includes:**
- Overall temperament category
- Normalized score (0-1 scale)
- Masculine and feminine scores
- Dimension breakdowns
- Variation analysis
- Intimate dynamics summary
- Attraction responsiveness summary
- Relationship polarity insights
- Export options (JSON/CSV/AI Agent format)

**Results Organization:**
- Overall temperament (primary category)
- Score visualization (masculine-feminine spectrum)
- Dimension scores (all dimensions)
- High variation dimensions (noted as expected)
- Intimate dynamics patterns
- Attraction patterns
- Relationship implications

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

### Results Calculation
- `calculateResults()` - Main calculation
- `analyzeVariation()` - Analyzes variation

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
3. **Questionnaire complete** â†’ `calculateResults()` called
4. **Dimension calculation** â†’ Groups answers and calculates dimension scores
5. **Overall calculation** â†’ Calculates overall temperament
6. **Category determination** â†’ Determines temperament category
7. **Variation analysis** â†’ `analyzeVariation()` identifies patterns
8. **Results display** â†’ `renderResults()` shows analysis
9. **Export** â†’ User exports analysis

---

## Export Formats

### JSON Export
- Complete analysis data
- All answers
- Question sequence
- Dimension scores
- Overall temperament
- Variation analysis

### CSV Export
- Tabular format
- Answers and scores
- Suitable for analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes interpretation instructions
- Temperament patterns
- Relationship implications
- Ready for import

---

## Technical Notes

### Temperament vs. Biological Sex
- **Important:** Temperament is distinct from biological sex or gender identity
- Refers to archetypal energy patterns
- Exists on a spectrum
- Variation across dimensions is expected and common

### Scoring System
- Questions have masculine and feminine weights
- Answers normalized to -1 to 1 scale
- Weights applied to calculate contributions
- Dimension weights from `TEMPERAMENT_SCORING`
- Final score normalized to 0-1 (masculine-feminine spectrum)

### Variation Analysis
- High variation dimensions identified
- Expected variations noted (common patterns)
- Variation is normal, not a problem
- Helps understand complexity of temperament

### Relationship Implications
- Temperament impacts relationship polarity
- Affects compatibility dynamics
- Influences attraction patterns
- Guides personal development needs
- Based on STATUS/SELECTION/ATTRACTION reference map

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

