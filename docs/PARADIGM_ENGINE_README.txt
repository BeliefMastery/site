# Paradigm Clarification Engine - Complete System Documentation

## Overview

The Paradigm Engine clarifies paradigms of "The Good Life" and "God" across four dimensions of truth (Literal, Symbolic, Esoteric, Mystical). It helps identify primary alignment with different ways of understanding life and the divine, mapping worldview structure and primary paradigms.

**File Location:** `paradigm-engine.js`  
**Associated HTML:** `paradigm.html`  
**Data Sources:** `paradigm-data/` directory

---

## System Architecture

### Core Components

1. **ParadigmEngine Class** - Main engine controller
2. **Data Modules** - Imported from `paradigm-data/`:
   - `GOOD_LIFE_PARADIGMS` - 3 paradigms of "The Good Life"
   - `GOD_PERSPECTIVES` - 6 perspectives on "God"
   - `PARADIGM_SCORING` - Scoring weights and mappings

### State Management

The engine maintains:
- `selectedCategories` - Selected categories ('good_life', 'god')
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Question sequence
- `analysisData` - Analysis results:
  - `goodLife` - Good Life paradigm scores
  - `god` - God perspective scores
  - `identifiedParadigms` - Primary paradigms identified

---

## Stage-by-Stage Breakdown

### Stage 1: Category Selection

**Purpose:** User selects which categories to assess

**Methods:**
- `toggleCategory(categoryId)` - Toggles category selection
- Category cards rendered in HTML (not in engine)

**Available Categories:**

1. **Good Life** (`good_life`)
   - Clarifies paradigm of "The Good Life"
   - 3 paradigms assessed:
     - Active
     - Contemplative
     - Devotional

2. **God** (`god`)
   - Clarifies perspective on "God"
   - 6 perspectives assessed:
     - Logical Function
     - Unifying Phenomenon
     - Biological Imperative
     - Social Construct
     - Relational Archetype
     - Emergent Function

**User Flow:**
1. User sees category selection cards
2. User selects one or both categories
3. Selected categories highlighted
4. "Start Assessment" button enabled when at least one selected

---

### Stage 2: Questionnaire

**Purpose:** Present questions and collect answers

**Methods:**
- `startAssessment()` - Begins questionnaire
- `buildQuestionSequence()` - Constructs question sequence
- `renderCurrentQuestion()` - Displays current question
- `nextQuestion()` - Advances to next question
- `prevQuestion()` - Returns to previous question
- `saveProgress()` - Saves answers

**Question Sequence Building:**

**For Good Life Category:**
- For each paradigm in `GOOD_LIFE_PARADIGMS`:
  - For each dimension in paradigm.dimensions:
    - For each question in dimension.questions:
      - Add question with:
        - `id`: `good_life_{paradigmKey}_{dimensionKey}_{index}`
        - `category`: 'good_life'
        - `paradigm`: paradigmKey
        - `dimension`: dimensionKey
        - `question`: question text
        - `description`: dimension description
        - `name`: "{paradigm.name} - {dimension.name}"

**For God Category:**
- For each perspective in `GOD_PERSPECTIVES`:
  - For each dimension in perspective.dimensions:
    - For each question in dimension.questions:
      - Add question with:
        - `id`: `god_{perspectiveKey}_{dimensionKey}_{index}`
        - `category`: 'god'
        - `perspective`: perspectiveKey
        - `dimension`: dimensionKey
        - `question`: question text
        - `description`: dimension description
        - `name`: "{perspective.name} - {dimension.name}"

**The Four Dimensions of Truth:**
1. **Literal** - Factual, empirical, concrete
2. **Symbolic** - Representational, metaphorical, archetypal
3. **Esoteric** - Hidden, initiatory, transformative
4. **Mystical** - Transcendent, unitive, ineffable

**Question Format:**
- Likert scale: 0-10
- Questions assess alignment with paradigms/perspectives
- Each question mapped to specific paradigm/perspective and dimension

---

### Stage 3: Results Calculation

**Purpose:** Calculate paradigm scores and identify primary alignments

**Methods:**
- `calculateResults()` - Main calculation method
- `calculateGoodLifeScores()` - Calculates Good Life scores
- `calculateGodScores()` - Calculates God scores
- `identifyParadigms()` - Identifies primary paradigms

**Scoring Algorithm:**

**For Good Life Paradigms:**
1. For each paradigm:
   - For each dimension:
     - Get all questions for paradigm + dimension
     - Calculate average score from answers
     - Apply dimension weight from `PARADIGM_SCORING.dimensionWeights`
     - Calculate weighted score: `avgScore * dimensionWeight`
   - Calculate overall paradigm score: `sum(weightedScores) / sum(weights)`
   - Store in `analysisData.goodLife[paradigmKey]`

2. **Primary Good Life Paradigm:**
   - Highest overall score
   - Indicates primary alignment

**For God Perspectives:**
1. For each perspective:
   - For each dimension:
     - Get all questions for perspective + dimension
     - Calculate average score from answers
     - Apply dimension weight
     - Calculate weighted score
   - Calculate overall perspective score
   - Store in `analysisData.god[perspectiveKey]`

2. **Primary God Perspective:**
   - Highest overall score
   - Indicates primary alignment

**Paradigm Identification:**
- Primary Good Life paradigm (highest score)
- Primary God perspective (highest score)
- Secondary alignments (other high scores)
- Dimension breakdowns (alignment across dimensions)

---

### Stage 4: Results Display

**Purpose:** Present paradigm clarification results

**Methods:**
- `renderResults()` - Renders results display
- `saveProgress()` - Saves complete analysis

**Results Display Includes:**
- Primary Good Life paradigm (if assessed)
- Primary God perspective (if assessed)
- All paradigm/perspective scores
- Dimension breakdowns
- Alignment patterns
- Potential hazards and distortions (if applicable)
- Export options (JSON/CSV/AI Agent format)

**Results Organization:**
- Good Life section (if assessed):
  - Primary paradigm
  - All paradigm scores
  - Dimension alignments
- God section (if assessed):
  - Primary perspective
  - All perspective scores
  - Dimension alignments
- Combined worldview structure

---

## Key Methods Reference

### Initialization
- `init()` - Initializes engine, attaches listeners
- `attachEventListeners()` - Sets up event handlers
- `loadStoredData()` - Loads saved progress

### Category Management
- `toggleCategory(categoryId)` - Toggles category selection

### Question Management
- `startAssessment()` - Begins assessment
- `buildQuestionSequence()` - Builds question sequence
- `renderCurrentQuestion()` - Renders current question
- `nextQuestion()` - Advances to next
- `prevQuestion()` - Returns to previous
- `saveProgress()` - Saves progress

### Results Calculation
- `calculateResults()` - Main calculation
- `calculateGoodLifeScores()` - Calculates Good Life scores
- `calculateGodScores()` - Calculates God scores
- `identifyParadigms()` - Identifies primary paradigms

### Results Display
- `renderResults()` - Renders results
- `saveProgress()` - Saves complete analysis

### Export Functions
- `exportAnalysis(format)` - Exports analysis (JSON/CSV/AI Agent)
- Uses utilities from `shared/export-utils.js`

### Utility Methods
- `resetAssessment()` - Resets all state
- `abandonAssessment()` - Abandons with confirmation

---

## Data Flow

1. **User selects categories** â†’ `selectedCategories` populated
2. **User starts assessment** â†’ `buildQuestionSequence()` creates sequence
3. **User answers questions** â†’ Answers stored in `answers`
4. **Questionnaire complete** â†’ `calculateResults()` called
5. **Good Life calculation** â†’ `calculateGoodLifeScores()` (if selected)
6. **God calculation** â†’ `calculateGodScores()` (if selected)
7. **Paradigm identification** â†’ `identifyParadigms()` finds primaries
8. **Results display** â†’ `renderResults()` shows results
9. **Export** â†’ User exports analysis

---

## Export Formats

### JSON Export
- Complete analysis data
- All answers
- Question sequence
- Good Life scores (if assessed)
- God scores (if assessed)
- Identified paradigms
- Dimension breakdowns

### CSV Export
- Tabular format
- Answers and scores
- Suitable for analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes interpretation instructions
- Paradigm alignments
- Dimension patterns
- Ready for import

---

## Technical Notes

### Dimension Weights
- Each dimension has weight from `PARADIGM_SCORING.dimensionWeights`
- Weights reflect importance of each dimension
- Used in weighted score calculation

### Paradigm Scoring
- Scores calculated per dimension
- Weighted by dimension importance
- Overall paradigm score is weighted average
- Primary paradigm: highest overall score

### Worldview Structure
- Results show alignment across dimensions
- Reveals how paradigms shape experience
- Identifies potential distortions
- Maps worldview coherence

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

