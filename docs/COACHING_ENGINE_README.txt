# Coaching Agent Builder Engine - Complete System Documentation

## Overview

The Coaching Engine generates personalized AI coaching agent profiles based on Chapter 1 of "Sovereign of Mind". It assesses 15 Obstacles to Sovereignty and 10 Satisfaction Domains to create a comprehensive profile that can be exported and imported into custom AI agents (ChatGPT, Claude, etc.).

**File Location:** `coaching-engine.js`  
**Associated HTML:** `coaching.html`  
**Data Sources:** `coaching-data/` directory

---

## System Architecture

### Core Components

1. **CoachingEngine Class** - Main engine controller
2. **Data Modules** - Imported from `coaching-data/`:
   - `SOVEREIGNTY_OBSTACLES` - 15 obstacles to sovereignty
   - `SATISFACTION_DOMAINS` - 10 satisfaction domains
   - `SATISFACTION_DOMAIN_EXAMPLES` - Examples for each domain
   - `QUESTION_WEIGHTINGS` - Question weight configurations
   - `COACHING_PROMPTS` - AI agent prompts and templates
   - `DEEPER_INQUIRY` - Deeper inquiry questions and action planning

### State Management

The engine maintains:
- `selectedSections` - Selected assessment sections ('obstacles', 'domains')
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Question sequence
- `currentSection` - Current section being assessed
- `profileData` - Complete coaching profile:
  - `obstacles` - Obstacle scores and data
  - `domains` - Domain scores and data
  - `weightedScores` - Weighted scores
  - `priorities` - Top obstacles and improvement areas
  - `coachingProfile` - AI agent configuration

---

## Stage-by-Stage Breakdown

### Stage 1: Section Selection

**Purpose:** User selects which sections to complete

**Methods:**
- `renderSectionSelection()` - Displays section selection cards
- `toggleSection(sectionId)` - Toggles section selection

**Available Sections:**
1. **15 Obstacles to Sovereignty**
   - Identifies constraints limiting freedom, joy, and satisfaction
   - Surfaces hidden and visible forces impacting current state

2. **10 Satisfaction Domains**
   - Evaluates areas determining depth of satisfaction
   - Reveals most impactful domains for action

**User Flow:**
1. User sees two section cards
2. User selects one or both sections
3. Selected sections highlighted
4. "Start Assessment" button enabled when at least one section selected

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

**For Obstacles Section:**
- For each obstacle in `SOVEREIGNTY_OBSTACLES`:
  - Add question with:
    - `id`: `obstacle_{obstacleKey}`
    - `type`: 'obstacle'
    - `section`: 'obstacles'
    - `obstacle`: obstacleKey
    - `question`: obstacle.question
    - `description`: obstacle.description
    - `name`: obstacle.name
    - `weight`: obstacle.weight

**For Domains Section:**
- For each domain in `SATISFACTION_DOMAINS`:
  - Add overview question: `domain_{domainKey}_overview`
  - For each aspect in domain.aspects:
    - Add aspect question: `domain_{domainKey}_aspect_{index}`

**Question Format:**
- Likert scale: 0-10
- Questions assess degree of presence/impact
- Each question has weight for scoring

**Progress Tracking:**
- Progress bar shows completion
- Previous/Next navigation
- Auto-save on answer change
- Can abandon assessment

---

### Stage 3: Profile Calculation

**Purpose:** Calculate weighted scores and generate coaching profile

**Methods:**
- `completeAssessment()` - Called when questionnaire complete
- `calculateProfile()` - Main calculation method
- `calculatePriorities()` - Identifies top priorities
- `generateCoachingProfile()` - Creates AI agent profile

**Scoring Algorithm:**

**For Obstacles:**
1. For each obstacle:
   - Get raw score from answer (0-10)
   - Calculate weighted score: `rawScore * obstacle.weight`
   - Store in `profileData.obstacles[obstacleKey]`

**For Domains:**
1. For each domain:
   - Get overview score
   - Get all aspect scores
   - Calculate average aspect score
   - Calculate combined score: `(overviewScore + averageAspectScore) / 2`
   - Calculate weighted score: `combinedScore * domain.weight`
   - Store in `profileData.domains[domainKey]`

**Priority Calculation:**
- **Top Obstacles:** Highest weighted scores (top 5)
- **Top Improvement Areas:** Lowest satisfaction domains (top 5)

**Coaching Profile Generation:**
- Creates structured profile for AI agents
- Includes:
  - System prompt from `COACHING_PROMPTS`
  - Coaching style configuration
  - User profile (obstacles, domains, priorities)
  - Response templates
  - Metadata (timestamp, sections completed, total questions)

---

### Stage 4: Results Display

**Purpose:** Present profile results and coaching configuration

**Methods:**
- `renderResults()` - Renders results display
- `saveProgress()` - Saves complete profile

**Results Display Includes:**
- Profile summary
- Top obstacles (highest impact constraints)
- Top improvement areas (lowest satisfaction domains)
- Weighted scores breakdown
- Coaching profile preview
- Export options (JSON/CSV/AI Agent format)

**AI Agent Configuration:**
- Complete system prompt
- Coaching style guidelines
- User-specific priorities
- Response templates
- Ready for import into ChatGPT, Claude, or custom AI

---

## Key Methods Reference

### Initialization
- `init()` - Initializes engine, renders section selection
- `attachEventListeners()` - Sets up event handlers
- `loadStoredData()` - Loads saved progress

### Section Management
- `renderSectionSelection()` - Renders section selection
- `toggleSection(sectionId)` - Toggles section selection

### Question Management
- `startAssessment()` - Begins assessment
- `buildQuestionSequence()` - Builds question sequence
- `renderCurrentQuestion()` - Renders current question
- `nextQuestion()` - Advances to next
- `prevQuestion()` - Returns to previous
- `saveProgress()` - Saves progress

### Profile Calculation
- `completeAssessment()` - Completes assessment
- `calculateProfile()` - Calculates scores and profile
- `calculatePriorities()` - Identifies priorities
- `generateCoachingProfile()` - Generates AI agent profile

### Results Display
- `renderResults()` - Renders results
- `saveProgress()` - Saves complete profile

### Export Functions
- `exportProfile(format)` - Exports profile (JSON/CSV/AI Agent)
- Uses utilities from `shared/export-utils.js`

### Utility Methods
- `resetAssessment()` - Resets all state
- `clearAllCachedData()` - Clears localStorage

---

## Data Flow

1. **User selects sections** â†’ `selectedSections` populated
2. **User starts assessment** â†’ `buildQuestionSequence()` creates sequence
3. **User answers questions** â†’ Answers stored in `answers`
4. **Questionnaire complete** â†’ `completeAssessment()` called
5. **Profile calculation** â†’ `calculateProfile()` processes answers
6. **Priority identification** â†’ `calculatePriorities()` finds top items
7. **Coaching profile** â†’ `generateCoachingProfile()` creates AI config
8. **Results display** â†’ `renderResults()` shows profile
9. **Export** â†’ User exports profile for AI agent

---

## Export Formats

### JSON Export
- Complete profile data
- All answers
- Question sequence
- Weighted scores
- Priorities
- Coaching profile configuration

### CSV Export
- Tabular format
- Answers and scores
- Suitable for analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes system prompt
- Coaching style guidelines
- User priorities
- Response templates
- Ready for direct import

---

## Technical Notes

### Weighting System
- Each obstacle has a weight (importance factor)
- Each domain has a weight
- Weighted scores prioritize high-impact areas

### Priority System
- Top obstacles: Highest weighted scores (most constraining)
- Top improvement areas: Lowest satisfaction (most opportunity)

### AI Agent Integration
- Profile designed for direct import
- Includes all necessary configuration
- Compatible with ChatGPT, Claude, custom AI
- Uses structured prompts from `COACHING_PROMPTS`

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

