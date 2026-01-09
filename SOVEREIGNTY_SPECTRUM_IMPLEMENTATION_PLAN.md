# Sovereignty Spectrum Analysis Tool - Implementation Plan

## Overview
Create a new assessment tool that maps users on a 0-100 spectrum from "Nihilistic Fragmentation" to "Paradigm-Integrated Sovereignty" by assessing alignment with 18 distinct philosophical/spiritual paradigms.

## Tool Structure

### 1. Data Files (`sovereignty-spectrum-data/`)

#### `paradigms.js`
- Export `SOVEREIGNTY_PARADIGMS` array with 18 paradigms:
  - **Philosophical (Ancient)**: Stoicism, Epicureanism, Cynicism
  - **Philosophical (Modern)**: Existentialism, Kantian Deontology, Utilitarianism, Libertarianism
  - **Spiritual/Religious**: Buddhism, Taoism, Christianity, Humanism
  - **Psychological/Self-Help**: Positive Psychology, Cognitive Behavioral, Mindfulness (Secular)
  - **Counter/Edge Paradigms**: Nihilism, Postmodern Relativism, Absurdism

Each paradigm includes:
- `id`, `name`, `description`
- `ideals` (array of key ideals)
- `values` (array of core values)
- `intents` (array of primary intents)
- `subsets` (array of denominations/factions)
- `hypocrisyIndicators` (array of hypocrisy patterns)
- `reluctanceHooks` (array of reluctance patterns)
- `nihilismHooks` (array of nihilism patterns)
- `questions` (array of 3-5 questions per paradigm)
- `weight` (scoring weight, e.g., 1.2 for foundational paradigms)

#### `questions.js`
- Export `SPECTRUM_QUESTIONS` object with questions organized by phase:
  - Phase 1: Paradigm Affinity (multiselect 3-5 paradigms)
  - Phase 2: Intents & Practicalities (Likert scales on behaviors)
  - Phase 3: Derailer Audit (hypocrisy, reluctance, nihilism probes)
  - Phase 4: Optional Refinement (targeted questions for low-scorers)

#### `derailers.js`
- Export `DERAILERS` object with:
  - `hypocrisy`: { questions: [...], penalty: -15 }
  - `reluctance`: { questions: [...], penalty: -10 }
  - `nihilism`: { questions: [...], penalty: -20 }

#### `thresholds.js`
- Export `SPECTRUM_THRESHOLDS` object:
  - `0`: 'Nihilistic Fragmentation (Reluctant abdication; hypocrisy erodes intent)'
  - `25`: 'Reactive Dependence (Paradigm sampling without commitment)'
  - `50`: 'Emergent Alignment (Values clash with practicalities)'
  - `75`: 'Reflective Integration (Intents drive actions; minimal reluctance)'
  - `100`: 'Paradigm-Transcendent Sovereignty (Hypocrisy resolved; nihilism alchemized)'

#### `index.js`
- Re-export all data modules for easy importing

### 2. Engine File (`sovereignty-spectrum-engine.js`)

Follow the pattern of `paradigm-engine.js` and `sovereignty-engine.js`:

**Class Structure:**
```javascript
export class SovereigntySpectrumEngine {
  constructor() {
    // State management
    this.selectedParadigms = [];
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.derailerScores = {};
    this.spectrumPosition = 0;
    
    // Analysis data
    this.analysisData = {
      timestamp: new Date().toISOString(),
      selectedParadigms: [],
      paradigmAlignments: {},
      derailerScores: {},
      spectrumPosition: 0,
      spectrumLabel: '',
      remediationPaths: [],
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize DataStore, DebugReporter, etc.
  }
}
```

**Key Methods:**
- `loadSpectrumData()` - Lazy load all data modules
- `buildPhaseSequence()` - Build question sequence based on selected paradigms
- `renderParadigmSelection()` - Phase 1: Multiselect paradigm cards
- `renderCurrentQuestion()` - Render Likert/scale questions
- `calculateDerailerPenalties()` - Calculate hypocrisy/reluctance/nihilism scores
- `calculateSpectrumPosition()` - Calculate 0-100 score with formula:
  ```
  baseScore = Σ (userAlignment[q] * paradigm.weight) / totalQs
  adjusted = baseScore - (hypocrisyPenalty + reluctancePenalty + nihilismPenalty)
  position = Math.max(0, Math.min(100, adjusted * 100))
  ```
- `renderResults()` - Display spectrum bar, paradigm insights, remediation paths
- `exportAnalysis()` - Export JSON/CSV with full analysis data

**Phases:**
1. **Paradigm Affinity** - Select 3-5 paradigms that resonate
2. **Intents & Practicalities** - Behavioral probes (filtered by selected paradigms)
3. **Derailer Audit** - Hypocrisy, reluctance, nihilism assessment
4. **Spectrum Synthesis** - Calculate and display results
5. **Optional Refinement** - Re-probe low-scorers with targeted questions

### 3. HTML File (`sovereignty-spectrum.html`)

Follow the pattern of `paradigm.html` and `sovereignty.html`:

**Structure:**
- Header with navigation (consistent with other tools)
- Intro section explaining the tool
- Assessment container with:
  - Phase indicator
  - Progress bar
  - Question container
  - Navigation buttons
- Results section (hidden initially)
- Export buttons

**Features:**
- Module preloading for performance
- Accessibility (ARIA labels, skip links, focus management)
- Responsive design
- Error handling UI
- Loading states

### 4. Integration Updates

#### `tools.html`
- Add new tool card in the grid:
  ```html
  <div class="tool-card" onclick="toggleToolCard(this)">
    <h3>🎯 Sovereignty Spectrum Analysis</h3>
    <p>Map your position on the sovereignty spectrum from nihilistic fragmentation to paradigm-integrated mastery.</p>
    <a class="btn btn-primary" href="sovereignty-spectrum.html">Access Tool</a>
  </div>
  ```

#### Navigation Headers
- Update all HTML files' navigation dropdown to include:
  ```html
  <li role="none"><a role="menuitem" href="sovereignty-spectrum.html">Sovereignty Spectrum Analysis</a></li>
  ```

## Implementation Steps

1. ✅ Create TODO list
2. ⏳ Create `sovereignty-spectrum-data/` directory
3. ⏳ Create `paradigms.js` with 18 paradigms (full structure)
4. ⏳ Create `questions.js` with 40-60 questions across 4 phases
5. ⏳ Create `derailers.js` with hypocrisy/reluctance/nihilism questions
6. ⏳ Create `thresholds.js` with spectrum labels
7. ⏳ Create `index.js` to re-export all modules
8. ⏳ Create `sovereignty-spectrum-engine.js` following established patterns
9. ⏳ Create `sovereignty-spectrum.html` with proper structure
10. ⏳ Update `tools.html` to include new tool card
11. ⏳ Update navigation headers in all HTML files
12. ⏳ Test complete flow: selection → questions → results → export

## Key Design Principles

- **Modular**: Reuse shared utilities (DataStore, ErrorHandler, SecurityUtils, export-utils)
- **Secure**: All dynamic HTML sanitized via SecurityUtils
- **Accessible**: ARIA labels, keyboard navigation, screen reader support
- **Performant**: Lazy loading, DocumentFragment for DOM updates
- **User-Friendly**: Clear progress indicators, error messages, loading states
- **Export-Ready**: Full data export for AI agent integration

## Scoring Formula Details

```
baseScore = Σ (userAlignment[q] * paradigm.weight) / totalQs
  where userAlignment[q] = average of Likert responses (1-5) for paradigm q
  and paradigm.weight = importance weight (default 1.0, higher for foundational)

derailerPenalties = hypocrisyPenalty + reluctancePenalty + nihilismPenalty
  where each penalty = (average score * penalty multiplier)
  hypocrisy: -15 points max
  reluctance: -10 points max  
  nihilism: -20 points max

adjustedScore = baseScore - derailerPenalties
spectrumPosition = Math.max(0, Math.min(100, adjustedScore * 100))
```

## Next Steps

Begin with data structure creation, then engine implementation, then HTML, then integration.

