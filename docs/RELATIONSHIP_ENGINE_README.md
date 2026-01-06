# Relationship Optimization Engine - Complete System Documentation

## Overview

The Relationship Engine is a multi-stage progressive analysis system that identifies weakest links in relationships across 20 compatibility points. It evaluates core values, trust, boundaries, communication, emotional intelligence, conflict resolution, and more, providing targeted action strategies.

**File Location:** `relationship-engine.js`  
**Associated HTML:** `relationship.html`  
**Data Sources:** `relationship-data/` directory

---

## System Architecture

### Core Components

1. **RelationshipEngine Class** - Main engine controller
2. **Data Modules** - Imported from `relationship-data/`:
   - `COMPATIBILITY_POINTS` - 20 compatibility points
   - `IMPACT_TIER_WEIGHTS` - Weights for impact tiers
   - `SCORING_THRESHOLDS` - Thresholds for weak areas
   - `ACTION_STRATEGIES` - Action strategies for each point
   - `ARCHETYPAL_INSIGHTS` - Archetypal insights
   - `STAGE_2_DOMAIN_QUESTIONS` - Domain-specific questions
   - `STAGE_3_SCENARIO_QUESTIONS` - Scenario-based questions
   - `RELATIONSHIP_DOMAINS` - Relationship domains

### State Management

The engine maintains:
- `currentStage` - Current stage: 1 (Broad), 2 (Domain Deep Dive), 3 (Scenarios)
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Current stage question sequence
- `weakestLinks` - Identified weakest links from Stage 1
- `domainWeakAreas` - Domain-specific weak areas from Stage 2
- `analysisData` - Complete analysis:
  - `stage1Results` - Broad assessment results
  - `stage2Results` - Domain deep dive results
  - `stage3Results` - Scenario results
  - `compatibilityScores` - Scores for all compatibility points
  - `weakestLinks` - Final weakest links with strategies
  - `actionStrategies` - Action strategies for each point
  - `archetypalInsights` - Archetypal insights

---

## Stage-by-Stage Breakdown

### Stage 1: Broad Compatibility Assessment

**Purpose:** Assess all 20 compatibility points to identify weakest links

**Methods:**
- `buildStage1Sequence()` - Builds Stage 1 question sequence
- `renderCurrentQuestion()` - Displays current question
- `nextQuestion()` - Advances to next question
- `completeStage()` - Completes Stage 1 and analyzes
- `analyzeStage1Results()` - Analyzes Stage 1 answers

**The 20 Compatibility Points:**
Organized by impact tier:
- **Very High Impact:** Core values, Trust, Boundaries, Communication
- **High Impact:** Emotional intelligence, Conflict resolution, Intimacy, Respect
- **Moderate-High Impact:** Life goals, Financial alignment, Family values, Social needs
- **Moderate Impact:** Lifestyle preferences, Hobbies/interests, Health habits, Career support

**Question Sequence:**
- One question per compatibility point
- Uses first question from `COMPATIBILITY_POINTS[pointKey].questions`
- Questions shuffled for dynamic experience
- Each question has:
  - `id`: `stage1_{pointKey}`
  - `stage`: 1
  - `type`: 'compatibility'
  - `point`: pointKey
  - `question`: Question text
  - `description`: Point description
  - `name`: Point name
  - `impactTier`: Impact tier
  - `weight`: Point weight
  - `tierWeight`: Impact tier weight

**Scoring:**
- For each compatibility point:
  - Get answer (0-10)
  - Apply point weight
  - Apply tier weight: `answer * point.weight * tierWeight`
  - Store in `analysisData.stage1Results[pointKey]`

**Weakest Link Identification:**
- Calculate weighted scores for all points
- Sort by score (lowest first)
- Identify points below threshold
- Top weak points added to `weakestLinks`
- Used to determine Stage 2 focus

---

### Stage 2: Domain-Specific Deep Dive

**Purpose:** Deep analysis of weakest links within their domains

**Methods:**
- `buildStage2Sequence()` - Builds Stage 2 question sequence
- `analyzeStage2Results()` - Analyzes Stage 2 answers
- `completeStage()` - Completes Stage 2

**Domain Identification:**
- For each weakest link:
  - Find which domain it belongs to (from `RELATIONSHIP_DOMAINS`)
  - Domains include: Communication, Emotional, Physical, Values, Lifestyle, etc.

**Question Generation:**
- For each weakest link:
  - Use `STAGE_2_DOMAIN_QUESTIONS[link.point]` if available
  - Otherwise use additional questions from compatibility point
  - Questions focus on domain-specific aspects
  - Each question has:
    - `stage`: 2
    - `domain`: Domain key
    - `domainName`: Domain name
    - `compatibilityPoint`: Original point key

**Deep Dive Focus:**
- Explores specific aspects of weak areas
- Provides detailed assessment
- Identifies root causes
- Maps domain-specific patterns

**Scoring:**
- Domain-specific scores calculated
- Stored in `analysisData.stage2Results`
- Used to refine weakest link analysis

---

### Stage 3: Scenario-Based Roleplay Questions

**Purpose:** Scenario-based reflection for critical weak areas

**Methods:**
- `buildStage3Sequence()` - Builds Stage 3 question sequence
- `analyzeStage3Results()` - Analyzes Stage 3 answers
- `completeStage()` - Completes Stage 3

**Scenario Selection:**
- Top 3-5 weakest links selected for scenarios
- Most critical areas get scenario questions

**Question Generation:**
- For each critical link:
  - Use `STAGE_3_SCENARIO_QUESTIONS[link.point]` if available
  - Otherwise generate generic scenario questions:
    - "Envision a situation where [point] becomes a significant issue..."
    - "How would you feel and what would you need?"
    - Includes example scenarios

**Scenario Format:**
- Questions present hypothetical situations
- User reflects on feelings and needs
- Helps identify emotional patterns
- Reveals underlying dynamics

**Scoring:**
- Scenario responses analyzed
- Stored in `analysisData.stage3Results`
- Used for final strategy generation

---

### Stage 4: Results Finalization

**Purpose:** Compile final results and action strategies

**Methods:**
- `finalizeResults()` - Finalizes all results
- `calculateResults()` - Calculates final scores
- `renderResults()` - Renders results display
- `saveProgress()` - Saves complete analysis

**Results Compilation:**

1. **Compatibility Scores:**
   - All 20 compatibility points scored
   - Weighted by impact tier
   - Sorted by strength/weakness

2. **Weakest Links:**
   - Final list of weakest links
   - Includes:
     - Point name and description
     - Weighted score
     - Impact tier
     - Action strategies
     - Archetypal insights

3. **Action Strategies:**
   - For each weakest link:
     - Get strategies from `ACTION_STRATEGIES[pointKey]`
     - Strategies include:
       - Immediate actions
       - Structural changes
       - Communication approaches
       - Behavioral adjustments

4. **Archetypal Insights:**
   - Insights from `ARCHETYPAL_INSIGHTS`
   - Based on:
     - Vulnerability patterns
     - Biological essentialism
     - Polarity dynamics
     - STATUS/SELECTION/ATTRACTION map

**Results Display:**
- Compatibility scores overview
- Weakest links (prioritized)
- Action strategies for each weak area
- Archetypal insights
- Stage summaries (1, 2, 3)
- Export options (JSON/CSV/AI Agent format)

---

## Key Methods Reference

### Initialization
- `init()` - Initializes engine, builds Stage 1 sequence
- `buildStage1Sequence()` - Builds Stage 1 questions
- `attachEventListeners()` - Sets up event handlers
- `loadStoredData()` - Loads saved progress

### Stage Management
- `buildStage2Sequence()` - Builds Stage 2 questions
- `buildStage3Sequence()` - Builds Stage 3 questions
- `completeStage()` - Completes current stage
- `updateStageIndicator()` - Updates stage display
- `updateProgressBar()` - Updates progress bar

### Question Management
- `startAssessment()` - Begins assessment
- `renderCurrentQuestion()` - Renders current question
- `nextQuestion()` - Advances to next
- `prevQuestion()` - Returns to previous
- `saveProgress()` - Saves progress

### Analysis
- `analyzeStage1Results()` - Analyzes Stage 1
- `analyzeStage2Results()` - Analyzes Stage 2
- `analyzeStage3Results()` - Analyzes Stage 3
- `calculateResults()` - Calculates final results
- `finalizeResults()` - Finalizes all results

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

1. **Engine initializes** → `buildStage1Sequence()` creates Stage 1 questions
2. **User answers Stage 1** → Answers stored in `answers`
3. **Stage 1 complete** → `analyzeStage1Results()` identifies weakest links
4. **If weak areas found** → `buildStage2Sequence()` creates Stage 2 questions
5. **User answers Stage 2** → Answers stored
6. **Stage 2 complete** → `analyzeStage2Results()` analyzes domains
7. **If critical areas** → `buildStage3Sequence()` creates Stage 3 questions
8. **User answers Stage 3** → Answers stored
9. **Stage 3 complete** → `analyzeStage3Results()` analyzes scenarios
10. **Finalize results** → `calculateResults()` and `finalizeResults()` compile data
11. **Results display** → `renderResults()` shows complete analysis
12. **Export** → User exports analysis

---

## Export Formats

### JSON Export
- Complete analysis data
- All answers (all stages)
- Question sequences (all stages)
- Compatibility scores
- Weakest links
- Action strategies
- Archetypal insights

### CSV Export
- Tabular format
- Answers and scores
- Suitable for analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes interpretation instructions
- Compatibility patterns
- Action strategies
- Ready for import

---

## Technical Notes

### Impact Tier System
- **Very High Impact:** Weight 1.0
- **High Impact:** Weight 0.9
- **Moderate-High Impact:** Weight 0.8
- **Moderate Impact:** Weight 0.7
- Tier weights from `IMPACT_TIER_WEIGHTS`

### Scoring System
- Each point has individual weight
- Tier weight applied
- Final score: `answer * point.weight * tierWeight`
- Lower scores indicate weaker areas

### Progressive Analysis
- Stage 1: Broad overview (all points)
- Stage 2: Deep dive (weakest links)
- Stage 3: Scenarios (critical areas)
- Efficient and focused

### Action Strategies
- Strategies from `ACTION_STRATEGIES`
- Point-specific approaches
- Immediate and structural actions
- Based on optimal relationship dynamics

### Archetypal Insights
- Insights from `ARCHETYPAL_INSIGHTS`
- Based on:
  - Vulnerability patterns
  - Biological essentialism
  - Polarity dynamics
  - STATUS/SELECTION/ATTRACTION reference map

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

