# Channel Taxonomy Engine - Complete System Documentation

## Overview

The Channels Engine is a multi-stage progressive analysis system that maps 7 nodes and 42 channels to identify blockages, overloads, and flow disruptions in the internal energy system. It provides a comprehensive assessment of node health and channel flow, with strategic remediation suggestions.

**File Location:** `channels-engine.js`  
**Associated HTML:** `channels.html`  
**Data Sources:** `channel-data/` directory

---

## System Architecture

### Core Components

1. **ChannelsEngine Class** - Main engine controller
2. **Data Modules** - Imported from `channel-data/`:
   - `NODES` - 7 core nodes (Base, Sex, Gut, Heart, Throat, Mind, Crown)
   - `CHANNELS` - 42 directional channels between nodes
   - `CHANNEL_SYMPTOMS` - Symptoms for each channel
   - `REMEDIATION_STRATEGIES` - Strategies for blocked channels
   - `CHANNEL_MAPPING` - Channel connectivity mapping
   - `STAGE_1_NODE_QUESTIONS` - Questions for node identification
   - `STAGE_2_CHANNEL_QUESTIONS` - Questions for channel analysis
   - `STAGE_3_MANAGEMENT_QUESTIONS` - Questions for channel management

### State Management

The engine maintains:
- `currentStage` - Current stage: 1 (Node ID), 2 (Channel Analysis), 3 (Management)
- `currentQuestionIndex` - Current question in sequence
- `answers` - All user answers (questionId -> score 0-10)
- `questionSequence` - Current stage question sequence
- `identifiedNodes` - Nodes with issues from Stage 1
- `identifiedChannels` - Channels with blockages from Stage 2
- `analysisData` - Complete analysis:
  - `stage1Results` - Node identification results
  - `stage2Results` - Channel analysis results
  - `stage3Results` - Management analysis results
  - `nodeScores` - Scores for each node
  - `channelScores` - Scores for each channel
  - `finalChannels` - Final channel analysis
  - `remediationStrategies` - Remediation suggestions

---

## Stage-by-Stage Breakdown

### Stage 1: Node Identification

**Purpose:** Identify which nodes have issues or disruptions

**Methods:**
- `buildStage1Sequence()` - Builds Stage 1 question sequence
- `renderCurrentQuestion()` - Displays current question
- `nextQuestion()` - Advances to next question
- `completeStage()` - Completes Stage 1 and analyzes results
- `analyzeStage1Results()` - Analyzes Stage 1 answers

**The 7 Nodes:**
1. **Base** - Foundation, grounding, survival
2. **Sex** - Creative energy, sexuality, vitality
3. **Gut** - Power, will, action
4. **Heart** - Love, connection, compassion
5. **Throat** - Communication, expression, truth
6. **Mind** - Thought, clarity, understanding
7. **Crown** - Spirituality, connection to divine, transcendence

**Question Sequence:**
- For each node:
  - Multiple questions from `STAGE_1_NODE_QUESTIONS[nodeKey]`
  - Questions assess node health, flow, and issues
  - Each question has weight for scoring

**Scoring:**
- For each node:
  - Calculate average score from node questions
  - Apply question weights
  - Threshold: Score >= 5.0 indicates issues
  - Nodes with issues added to `identifiedNodes`

**Stage Completion:**
- If nodes with issues found â†’ Proceed to Stage 2
- If no nodes with issues â†’ Show results (system healthy)

---

### Stage 2: Channel-Specific Analysis

**Purpose:** Analyze channels connected to identified nodes

**Methods:**
- `buildStage2Sequence()` - Builds Stage 2 question sequence
- `analyzeStage2Results()` - Analyzes Stage 2 answers
- `completeStage()` - Completes Stage 2

**Channel Identification:**
- For each identified node:
  - Find all channels connected to node (both directions)
  - Channels where `channel.from === nodeKey` OR `channel.to === nodeKey`
  - Add to relevant channels list

**Question Generation:**
- For each relevant channel:
  - Use `STAGE_2_CHANNEL_QUESTIONS[channelId]` if available
  - Otherwise generate generic questions:
    - **Abundance question:** "When [fromNode] is abundant, how does that affect [toNode]?"
    - **Lack question:** "When [fromNode] lacks resources, how does that impact [toNode]?"
    - **Blocked question:** "Do you experience symptoms of blocked flow between [fromNode] and [toNode]?"

**Channel Types:**
- Questions assess:
  - Abundance flow (healthy abundance)
  - Lack response (healthy lack)
  - Blocked flow (blockages)

**Scoring:**
- For each channel:
  - Calculate scores from channel questions
  - Identify blockages (high scores on blocked questions)
  - Channels with blockages added to `identifiedChannels`

**Stage Completion:**
- If blocked channels found â†’ Proceed to Stage 3
- If no blocked channels â†’ Show results

---

### Stage 3: Deep Channel Management

**Purpose:** Deep analysis and management strategies for blocked channels

**Methods:**
- `buildStage3Sequence()` - Builds Stage 3 question sequence
- `analyzeStage3Results()` - Analyzes Stage 3 answers
- `completeStage()` - Completes Stage 3 and finalizes

**Question Generation:**
- For each blocked channel:
  - Use `STAGE_3_MANAGEMENT_QUESTIONS[channel.key]` if available
  - Otherwise generate generic management questions:
    - Questions about channel dynamics
    - Questions about remediation approaches
    - Questions about flow restoration

**Management Focus:**
- Deep dive into blocked channels
- Identify specific blockage patterns
- Assess remediation needs
- Generate strategic suggestions

**Remediation Strategies:**
- For each blocked channel:
  - Get strategies from `REMEDIATION_STRATEGIES[channel.key]`
  - Strategies include:
    - Physical practices
    - Energetic work
    - Psychological approaches
    - Lifestyle adjustments

---

### Stage 4: Results Finalization

**Purpose:** Compile final results and remediation strategies

**Methods:**
- `finalizeResults()` - Finalizes all results
- `renderResults()` - Renders results display
- `saveProgress()` - Saves complete analysis

**Results Compilation:**
1. **Node Analysis:**
   - All node scores
   - Identified nodes with issues
   - Node health status

2. **Channel Analysis:**
   - All channel scores
   - Identified blocked channels
   - Channel flow status
   - Abundance/lack/blocked patterns

3. **Remediation Strategies:**
   - For each blocked channel:
     - Specific remediation strategies
     - Practices and approaches
     - Expected outcomes

**Results Display:**
- Stage 1 summary (nodes with issues)
- Stage 2 summary (blocked channels)
- Stage 3 summary (management insights)
- Remediation strategies for each blocked channel
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

1. **Engine initializes** â†’ `buildStage1Sequence()` creates Stage 1 questions
2. **User answers Stage 1** â†’ Answers stored in `answers`
3. **Stage 1 complete** â†’ `analyzeStage1Results()` identifies nodes with issues
4. **If nodes identified** â†’ `buildStage2Sequence()` creates Stage 2 questions
5. **User answers Stage 2** â†’ Answers stored
6. **Stage 2 complete** â†’ `analyzeStage2Results()` identifies blocked channels
7. **If channels blocked** â†’ `buildStage3Sequence()` creates Stage 3 questions
8. **User answers Stage 3** â†’ Answers stored
9. **Stage 3 complete** â†’ `analyzeStage3Results()` analyzes management
10. **Finalize results** â†’ `finalizeResults()` compiles all data
11. **Results display** â†’ `renderResults()` shows complete analysis
12. **Export** â†’ User exports analysis

---

## Export Formats

### JSON Export
- Complete analysis data
- All answers (all stages)
- Question sequences (all stages)
- Node scores
- Channel scores
- Identified nodes and channels
- Remediation strategies

### CSV Export
- Tabular format
- Answers and scores
- Suitable for analysis

### AI Agent Export
- Formatted for AI coaching agents
- Includes interpretation instructions
- Node and channel patterns
- Remediation strategies
- Ready for import

---

## Technical Notes

### Progressive Analysis
- System uses progressive disclosure
- Only analyzes deeper if issues found
- Efficient: avoids unnecessary questions
- Adaptive: focuses on problem areas

### Channel Connectivity
- Channels are directional (from â†’ to)
- Each channel connects two nodes
- 42 total channels (6 channels per node on average)
- Channels analyzed in both directions when relevant

### Scoring Thresholds
- **Node issues:** Score >= 5.0
- **Channel blockages:** High scores on blocked questions
- Thresholds configurable in data files

### Remediation Strategies
- Strategies from `REMEDIATION_STRATEGIES`
- Channel-specific approaches
- Multi-modal interventions
- Practical and actionable

---

## Review Notes

This documentation is designed for review. Please provide feedback on:
- Clarity of stage descriptions
- Completeness of method documentation
- Technical accuracy
- Missing information
- Suggested improvements

