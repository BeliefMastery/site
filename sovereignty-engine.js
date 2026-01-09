// AI Sovereignty Analysis Engine
// Multi-dimensional assessment of AI dependency, attachment, cognitive profile, and sovereignty capacity

import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';
import { ErrorHandler, DataStore, DOMUtils } from './shared/utils.js';
import { loadDataModule } from './shared/data-loader.js';

// Lazy load data modules - only load when needed
let COGNITIVE_BANDS, SUBCLASSES, SOVEREIGN_SPLIT_POSITIONS;
let SECTION_1_USAGE_PATTERNS, SECTION_2_COGNITIVE_STYLE, SECTION_3_ATTACHMENT, SECTION_4_SOVEREIGNTY;

export class SovereigntyEngine {
  constructor() {
    this.currentSection = 0; // 0 = IQ bracket selection, 1-4 = assessment sections
    this.currentQuestionIndex = 0;
    this.iqBracket = null; // Primary IQ bracket for faster funneling
    this.iqBracketSecondary = null; // Secondary bracket for border crossover (weighted 0.5)
    this.answers = {};
    this.questionSequence = [];
    this.scores = {
      dependency: 0,
      attachment: 0,
      sovereignty: 0,
      cognitiveComplexity: 0,
      driftRisk: 0
    };
    this.preliminaryFilters = {
      aiUsageFrequency: null, // 'never', 'rarely', 'daily', 'frequent'
      dependencyLevel: null, // 'low', 'medium', 'high'
      cognitiveLevel: null // From Section 2, used for filtering Sections 3 & 4
    };
    this.analysisData = {
      timestamp: new Date().toISOString(),
      iqBracket: null,
      section1Results: {},
      section2Results: {},
      section3Results: {},
      section4Results: {},
      cognitiveBand: null,
      subclasses: [],
      attachmentMode: null,
      vulnerabilityRisks: [],
      sovereigntyScore: 0,
      sovereignSplitPosition: null,
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize DataStore for persistent storage
    this.dataStore = new DataStore('sovereignty-assessment');
    
    this.init();
  }

  /**
   * Initialize the engine and attach event listeners
   */
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
      ErrorHandler.logError(error, 'SovereigntyEngine.init');
      ErrorHandler.showUserError('Failed to initialize assessment. Please refresh the page.');
    }
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.startAssessment();
      });
    }

    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }

    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }

    const exportJSONBtn = document.getElementById('exportJSON');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportAnalysis('json'));
    }

    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportAnalysis('csv'));
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to abandon this assessment? All progress will be lost.')) {
          this.resetAssessment();
        }
      });
    }
  }

  /**
   * Start a new assessment
   */
  startAssessment() {
    try {
      this.currentSection = 0; // Start with IQ bracket selection
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.scores = {
        dependency: 0,
        attachment: 0,
        sovereignty: 0,
        cognitiveComplexity: 0,
        driftRisk: 0
      };
      this.showQuestionContainer();
      this.showIQBracketSelection();
      this.saveProgress();
      
      // Focus management for accessibility
      const container = document.getElementById('questionContainer');
      if (container) {
        DOMUtils.focusElement(container);
      }
    } catch (error) {
      ErrorHandler.logError(error, 'SovereigntyEngine.startAssessment');
      ErrorHandler.showUserError('Failed to start assessment. Please try again.');
    }
  }

  showIQBracketSelection() {
    const container = document.getElementById('questionContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.95); padding: 3rem; border-radius: var(--radius); margin-bottom: 2rem; text-align: center;">
        <h2 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.5rem;">Select Your IQ Bracket (Optional)</h2>
        <p style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.6;">
          Providing your IQ helps us prioritize relevant questions and accelerate the assessment. 
          If you don't know your IQ, you can skip this step. Estimate based on standardized tests (SAT, ACT, WAIS, etc.) or educational/career patterns.
        </p>
        
        <!-- IQ Input Option -->
        <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255, 184, 0, 0.05); border: 2px solid var(--brand); border-radius: var(--radius); max-width: 400px; margin-left: auto; margin-right: auto;">
          <label for="iqInput" style="display: block; color: var(--brand); font-weight: 600; margin-bottom: 0.75rem; font-size: 1.1rem;">
            Enter Your IQ (Auto-detects bracket):
          </label>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <input type="number" id="iqInput" min="70" max="200" step="1" 
                   placeholder="e.g., 98, 117, 125" 
                   style="flex: 1; padding: 0.75rem 1rem; font-size: 1rem; border: 2px solid var(--brand); border-radius: var(--radius); background: white; color: var(--text);">
            <button id="submitIQ" style="padding: 0.75rem 1.5rem; font-size: 1rem; background: var(--brand); color: white; border: none; border-radius: var(--radius); cursor: pointer; font-weight: 600; transition: all 0.2s;">
              Submit
            </button>
          </div>
          <div id="iqBracketDisplay" style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-radius: var(--radius); display: none;">
            <p style="margin: 0; color: var(--brand); font-weight: 600; font-size: 0.9rem;" id="iqBracketText"></p>
          </div>
        </div>
        
        <div style="margin: 2rem 0; text-align: center; color: var(--muted); font-size: 0.9rem;">
          <strong>OR</strong> select manually below:
        </div>
        
        <p style="color: var(--brand); margin-bottom: 1.5rem; line-height: 1.6; font-size: 0.9rem; font-style: italic;">
          <strong>Note:</strong> IQ brackets have crossover at boundaries (±5 points). The system automatically detects border positions and includes patterns from adjacent brackets.
        </p>
        <div style="display: grid; gap: 1rem; max-width: 600px; margin: 0 auto;">
          <button id="selectIQ80_100" class="iq-btn" style="padding: 1rem 2rem; font-size: 1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600; text-align: left;">
            <strong>80-100 IQ</strong> - Routine Guided Thinkers (~34% of population)
          </button>
          <button id="selectIQ80_100_border" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 100-115</strong> (e.g., IQ 95-105)
          </button>
          <button id="selectIQ100_115" class="iq-btn" style="padding: 1rem 2rem; font-size: 1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600; text-align: left;">
            <strong>100-115 IQ</strong> - Practical Adaptive Thinkers (~34% of population)
          </button>
          <button id="selectIQ100_115_border_low" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 80-100</strong> (e.g., IQ 98-102)
          </button>
          <button id="selectIQ100_115_border_high" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 115-130</strong> (e.g., IQ 113-117)
          </button>
          <button id="selectIQ115_130" class="iq-btn" style="padding: 1rem 2rem; font-size: 1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600; text-align: left;">
            <strong>115-130 IQ</strong> - Strategic Analytical Thinkers (~14% of population)
          </button>
          <button id="selectIQ115_130_border_low" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 100-115</strong> (e.g., IQ 113-117)
          </button>
          <button id="selectIQ115_130_border_high" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 130-145</strong> (e.g., IQ 128-132)
          </button>
          <button id="selectIQ130_145" class="iq-btn" style="padding: 1rem 2rem; font-size: 1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600; text-align: left;">
            <strong>130-145 IQ</strong> - Creative Synthesizing Thinkers (~2% of population)
          </button>
          <button id="selectIQ130_145_border_low" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 115-130</strong> (e.g., IQ 128-132)
          </button>
          <button id="selectIQ130_145_border_high" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 145+</strong> (e.g., IQ 143-147)
          </button>
          <button id="selectIQ145_plus" class="iq-btn" style="padding: 1rem 2rem; font-size: 1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600; text-align: left;">
            <strong>145+ IQ</strong> - Meta-Recursive Thinkers (&lt;1% of population)
          </button>
          <button id="selectIQ145_plus_border" class="iq-btn" style="padding: 0.75rem 1.5rem; font-size: 0.9rem; background: rgba(255, 184, 0, 0.05); border: 1px dashed var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); text-align: left; margin-left: 2rem;">
            ↳ <strong>On border with 130-145</strong> (e.g., IQ 143-147)
          </button>
          <button id="selectIQUnknown" class="iq-btn" style="padding: 1rem 2rem; font-size: 1rem; background: rgba(200, 200, 200, 0.1); border: 2px solid #888; border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: #666; font-weight: 600; text-align: left; margin-top: 1rem;">
            <strong>I don't know / Prefer not to specify</strong> - Full assessment will be provided
          </button>
        </div>
      </div>
    `;

    // Add IQ input handler
    setTimeout(() => {
      const iqInput = document.getElementById('iqInput');
      const submitIQBtn = document.getElementById('submitIQ');
      const iqBracketDisplay = document.getElementById('iqBracketDisplay');
      const iqBracketText = document.getElementById('iqBracketText');
      
      const handleIQSubmit = () => {
        const iqValue = parseInt(iqInput.value);
        if (isNaN(iqValue) || iqValue < 70 || iqValue > 200) {
          alert('Please enter a valid IQ between 70 and 200.');
          return;
        }
        
        // Auto-determine bracket(s) based on IQ value
        const bracketInfo = this.determineIQBrackets(iqValue);
        this.iqBracket = bracketInfo.primary;
        this.iqBracketSecondary = bracketInfo.secondary;
        this.analysisData.iqBracket = bracketInfo.primary;
        this.analysisData.iqBracketSecondary = bracketInfo.secondary;
        
        // Display detected bracket(s)
        let displayText = `Detected: ${this.getBracketName(bracketInfo.primary)}`;
        if (bracketInfo.secondary) {
          displayText += ` (with crossover from ${this.getBracketName(bracketInfo.secondary)})`;
        }
        iqBracketText.textContent = displayText;
        iqBracketDisplay.style.display = 'block';
        
        // Auto-proceed after brief display
        setTimeout(async () => {
          this.currentSection = 1;
          await this.buildSectionSequence(1);
          this.renderCurrentQuestion();
          this.updateNavigation();
          this.saveProgress();
        }, 1000);
      };
      
      if (submitIQBtn) {
        submitIQBtn.addEventListener('click', handleIQSubmit);
      }
      
      if (iqInput) {
        iqInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            handleIQSubmit();
          }
        });
      }
      
      // Manual bracket selection handlers
      const iqBrackets = {
        // Core brackets
        'selectIQ80_100': { primary: '80_100', secondary: null },
        'selectIQ100_115': { primary: '100_115', secondary: null },
        'selectIQ115_130': { primary: '115_130', secondary: null },
        'selectIQ130_145': { primary: '130_145', secondary: null },
        'selectIQ145_plus': { primary: '145_plus', secondary: null },
        'selectIQUnknown': { primary: 'unknown', secondary: null },
        // Border selections with crossover
        'selectIQ80_100_border': { primary: '80_100', secondary: '100_115' },
        'selectIQ100_115_border_low': { primary: '100_115', secondary: '80_100' },
        'selectIQ100_115_border_high': { primary: '100_115', secondary: '115_130' },
        'selectIQ115_130_border_low': { primary: '115_130', secondary: '100_115' },
        'selectIQ115_130_border_high': { primary: '115_130', secondary: '130_145' },
        'selectIQ130_145_border_low': { primary: '130_145', secondary: '115_130' },
        'selectIQ130_145_border_high': { primary: '130_145', secondary: '145_plus' },
        'selectIQ145_plus_border': { primary: '145_plus', secondary: '130_145' }
      };

      Object.keys(iqBrackets).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
          button.addEventListener('click', () => {
            const bracket = iqBrackets[buttonId];
            this.iqBracket = bracket.primary;
            this.iqBracketSecondary = bracket.secondary;
            this.analysisData.iqBracket = bracket.primary;
            this.analysisData.iqBracketSecondary = bracket.secondary;
            this.currentSection = 1;
            this.buildSectionSequence(1).then(() => {
              this.renderCurrentQuestion();
              this.updateNavigation();
              this.saveProgress();
            });
          });

          // Add hover effects
          button.addEventListener('mouseenter', () => {
            if (buttonId !== 'selectIQUnknown') {
              button.style.background = 'rgba(255, 184, 0, 0.2)';
              button.style.transform = 'translateY(-2px)';
            } else {
              button.style.background = 'rgba(200, 200, 200, 0.2)';
            }
          });
          button.addEventListener('mouseleave', () => {
            if (buttonId !== 'selectIQUnknown') {
              button.style.background = 'rgba(255, 184, 0, 0.1)';
              button.style.transform = 'translateY(0)';
            } else {
              button.style.background = 'rgba(200, 200, 200, 0.1)';
            }
          });
        }
      });
    }, 100);
  }

  determineIQBrackets(iq) {
    // Automatically determine primary and secondary (crossover) brackets based on IQ value
    // Border crossover zone: ±5 points from bracket boundaries
    
    let primary = null;
    let secondary = null;
    
    if (iq < 80) {
      // Below 80 - use 80-100 bracket
      primary = '80_100';
    } else if (iq >= 80 && iq < 100) {
      primary = '80_100';
      // Check if near 100 boundary (95-105 crossover zone)
      if (iq >= 95 && iq < 100) {
        secondary = '100_115';
      }
    } else if (iq >= 100 && iq < 115) {
      primary = '100_115';
      // Check if near boundaries
      if (iq >= 100 && iq <= 102) {
        secondary = '80_100'; // Lower border
      } else if (iq >= 113 && iq < 115) {
        secondary = '115_130'; // Upper border
      }
    } else if (iq >= 115 && iq < 130) {
      primary = '115_130';
      // Check if near boundaries
      if (iq >= 115 && iq <= 117) {
        secondary = '100_115'; // Lower border
      } else if (iq >= 128 && iq < 130) {
        secondary = '130_145'; // Upper border
      }
    } else if (iq >= 130 && iq < 145) {
      primary = '130_145';
      // Check if near boundaries
      if (iq >= 130 && iq <= 132) {
        secondary = '115_130'; // Lower border
      } else if (iq >= 143 && iq < 145) {
        secondary = '145_plus'; // Upper border
      }
    } else if (iq >= 145) {
      primary = '145_plus';
      // Check if near lower boundary
      if (iq >= 145 && iq <= 147) {
        secondary = '130_145';
      }
    }
    
    return { primary, secondary };
  }

  getBracketName(bracketId) {
    const names = {
      '80_100': '80-100 IQ (Routine Guided Thinkers)',
      '100_115': '100-115 IQ (Practical Adaptive Thinkers)',
      '115_130': '115-130 IQ (Strategic Analytical Thinkers)',
      '130_145': '130-145 IQ (Creative Synthesizing Thinkers)',
      '145_plus': '145+ IQ (Meta-Recursive Thinkers)'
    };
    return names[bracketId] || bracketId;
  }

  /**
   * Build question sequence for a section
   * @param {number} section - Section number (1-4)
   */
  async buildSectionSequence(section) {
    // Ensure data is loaded
    await this.ensureDataLoaded();
    
    let questions = [];
    
    switch(section) {
      case 1:
        questions = [...(SECTION_1_USAGE_PATTERNS || [])];
        // Apply IQ bracket and usage frequency filters
        questions = this.filterSection1Questions(questions);
        break;
      case 2:
        questions = [...(SECTION_2_COGNITIVE_STYLE || [])];
        // Apply IQ bracket filter
        questions = this.filterSection2Questions(questions);
        break;
      case 3:
        questions = [...(SECTION_3_ATTACHMENT || [])];
        // Apply IQ bracket, dependency level, and cognitive level filters
        questions = this.filterSection3Questions(questions);
        break;
      case 4:
        questions = [...(SECTION_4_SOVEREIGNTY || [])];
        // Apply IQ bracket, dependency level, and cognitive level filters
        questions = this.filterSection4Questions(questions);
        break;
    }
    
    this.questionSequence = questions;
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  filterSection1Questions(questions) {
    // Section 1: Usage Patterns
    // Filter based on IQ bracket and usage frequency (from early questions)
    
    if (this.iqBracket === 'unknown' || !this.iqBracket) {
      // Check if we can determine usage frequency from early answers
      const usageAnswer = this.answers['u2']; // Question about daily usage frequency
      if (usageAnswer) {
        const freqOption = SECTION_1_USAGE_PATTERNS[1]?.options?.[usageAnswer.selectedIndex];
        if (freqOption) {
          if (freqOption.text.includes('Never') || freqOption.text.includes('Rarely')) {
            this.preliminaryFilters.aiUsageFrequency = 'rarely';
            // Skip some detailed usage questions for non-users
            return this.filterByUsageFrequency(questions, 12); // Reduce to 12 questions
          }
        }
      }
      return questions; // No filtering if IQ unknown and no usage data
    }
    
    // IQ bracket filtering
    let targetCount = 12; // Reduce from 15 to 12 with IQ bracket
    
    return this.filterQuestionsByIQ(questions, targetCount);
  }

  filterSection2Questions(questions) {
    // Section 2: Cognitive Style
    // Filter based on IQ bracket (most relevant section for IQ)
    
    if (this.iqBracket === 'unknown' || !this.iqBracket) {
      return questions; // Keep all if IQ unknown
    }
    
    let targetCount = 10; // Reduce from ~12 to 10 with IQ bracket
    
    return this.filterQuestionsByIQ(questions, targetCount, 'cognitive');
  }

  filterSection3Questions(questions) {
    // Section 3: Attachment
    // Filter based on IQ bracket, dependency level from Section 1, and cognitive level from Section 2
    
    if (this.iqBracket === 'unknown' || !this.iqBracket) {
      // Still apply dependency-based filtering if available
      const dependencyScore = this.scores.dependency || 0;
      if (dependencyScore < -3) {
        // Low dependency - can skip some attachment questions
        return questions.slice(0, 6); // Reduce to 6 questions
      }
      return questions;
    }
    
    let targetCount = 6; // Reduce from 8 to 6 with IQ bracket
    
    // Also check dependency level
    const dependencyScore = this.scores.dependency || 0;
    if (dependencyScore < -3) {
      // Very low dependency - further reduce
      targetCount = 5;
    }
    
    return this.filterQuestionsByIQ(questions, targetCount, 'attachment');
  }

  filterSection4Questions(questions) {
    // Section 4: Sovereignty Indicators
    // Filter based on IQ bracket, dependency level, and cognitive level
    
    if (this.iqBracket === 'unknown' || !this.iqBracket) {
      // Still apply dependency-based filtering
      const dependencyScore = this.scores.dependency || 0;
      if (dependencyScore < -3) {
        // Low dependency - already high sovereignty likely
        return questions.slice(0, 7); // Reduce to 7 questions
      }
      return questions;
    }
    
    let targetCount = 8; // Reduce from 10 to 8 with IQ bracket
    
    // Check dependency and cognitive level
    const dependencyScore = this.scores.dependency || 0;
    const cognitiveScore = this.scores.cognitiveComplexity || 0;
    
    if (dependencyScore < -3) {
      // Very low dependency - further reduce
      targetCount = 7;
    }
    
    if (this.iqBracket === '80_100' || this.iqBracket === '100_115') {
      // Lower IQ brackets - sovereignty concepts may be less relevant
      targetCount = 7;
    }
    
    return this.filterQuestionsByIQ(questions, targetCount, 'sovereignty');
  }

  filterByUsageFrequency(questions, targetCount) {
    // Prioritize core questions and skip detailed usage scenarios for non-users
    const coreQuestionIds = ['u1', 'u2', 'u3', 'u6', 'u10', 'u11', 'u12', 'u13']; // Essential questions
    const optionalQuestionIds = ['u4', 'u5', 'u7', 'u8', 'u9', 'u14', 'u15']; // Detailed scenarios
    
    const coreQuestions = questions.filter(q => coreQuestionIds.includes(q.id));
    const optionalQuestions = questions.filter(q => optionalQuestionIds.includes(q.id));
    
    // Keep all core questions, add optional up to target count
    const selected = [...coreQuestions];
    const remaining = targetCount - selected.length;
    
    if (remaining > 0 && optionalQuestions.length > 0) {
      selected.push(...optionalQuestions.slice(0, remaining));
    }
    
    return selected.slice(0, targetCount);
  }

  filterQuestionsByIQ(questions, targetCount, questionType = 'general') {
    // Filter questions based on IQ bracket relevance with crossover support
    // Different question types have different relevance patterns
    
    if (this.iqBracket === 'unknown' || !this.iqBracket) {
      return questions.slice(0, targetCount);
    }
    
    // Score each question by relevance to IQ bracket(s) - accounting for crossover
    const scoredQuestions = questions.map(q => {
      let relevanceScore = 1; // Default relevance
      
      // Calculate primary bracket relevance
      let primaryScore = this.calculateIQRelevance(q, this.iqBracket, questionType);
      
      // Calculate secondary bracket relevance (if border crossover)
      let secondaryScore = 0;
      if (this.iqBracketSecondary) {
        secondaryScore = this.calculateIQRelevance(q, this.iqBracketSecondary, questionType) * 0.5; // Weighted 50% for secondary
      }
      
      // Combined relevance score
      relevanceScore = primaryScore + secondaryScore;
      
      return { question: q, score: relevanceScore };
    });
    
    // Sort by relevance, then randomize ties
    scoredQuestions.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Math.random() - 0.5;
    });
    
    // Take top N questions
    return scoredQuestions.slice(0, targetCount).map(item => item.question);
  }

  calculateIQRelevance(question, iqBracket, questionType) {
    // Calculate relevance score for a specific IQ bracket
    let relevanceScore = 1; // Default relevance
    
    // Check question content for cognitive complexity indicators
    const questionText = (question.question || '').toLowerCase();
    const hasHighComplexityTerms = ['meta', 'recursive', 'framework', 'abstract', 'paradox', 'contradiction'].some(term => questionText.includes(term));
    const hasLowComplexityTerms = ['simple', 'clear', 'routine', 'familiar'].some(term => questionText.includes(term));
    
    // Check options for cognitive level indicators
    let hasHighCognitiveOptions = false;
    let hasLowCognitiveOptions = false;
    
    if (question.options) {
      question.options.forEach(opt => {
        const optText = (opt.text || '').toLowerCase();
        if (opt.cognitiveLevel === 'high' || opt.cognitiveLevel === 'very_high' || 
            optText.includes('meta') || optText.includes('recursive') || optText.includes('framework')) {
          hasHighCognitiveOptions = true;
        }
        if (opt.cognitiveLevel === 'low' || opt.cognitiveLevel === 'medium' ||
            optText.includes('simple') || optText.includes('clear') || optText.includes('routine')) {
          hasLowCognitiveOptions = true;
        }
      });
    }
    
    // IQ bracket relevance scoring
    if (iqBracket === '80_100' || iqBracket === '100_115') {
      // Lower IQ brackets - prefer simpler, practical questions
      if (hasLowComplexityTerms || hasLowCognitiveOptions) relevanceScore += 3;
      if (hasHighComplexityTerms || hasHighCognitiveOptions) relevanceScore -= 1;
    } else if (iqBracket === '115_130') {
      // Mid IQ - balanced, but prefer strategic/analytical questions
      if (hasHighComplexityTerms || hasHighCognitiveOptions) relevanceScore += 2;
      if (hasLowComplexityTerms || hasLowCognitiveOptions) relevanceScore += 1;
    } else if (iqBracket === '130_145' || iqBracket === '145_plus') {
      // Higher IQ - prefer complex, meta-cognitive questions
      if (hasHighComplexityTerms || hasHighCognitiveOptions) relevanceScore += 3;
      if (hasLowComplexityTerms || hasLowCognitiveOptions) relevanceScore -= 1;
    }
    
    // Question type specific relevance
    if (questionType === 'cognitive' && (hasHighComplexityTerms || hasHighCognitiveOptions)) {
      relevanceScore += 2; // Cognitive style questions benefit from complexity
    }
    
    if (questionType === 'attachment' && iqBracket !== '80_100') {
      // Attachment questions are relevant across most IQ brackets
      relevanceScore += 1;
    }
    
    if (questionType === 'sovereignty') {
      // Sovereignty questions are important for higher IQ brackets
      if (iqBracket === '130_145' || iqBracket === '145_plus') {
        relevanceScore += 2;
      }
    }
    
    return relevanceScore;
  }

  renderCurrentQuestion() {
    if (this.questionSequence.length === 0) {
      this.finalizeResults();
      return;
    }

    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    if (!container) return;

    let html = '';

    // Show section explanation at start of each section
    if (this.currentQuestionIndex === 0) {
      html += this.getSectionExplanation(this.currentSection);
    }

    // Determine if this question has already been answered (locked)
    let isAnswered = this.answers[question.id] !== undefined;
    // For frequency_grid, check if all contexts are answered
    if (question.type === 'frequency_grid' && isAnswered) {
      const contexts = question.contexts || [];
      const answer = this.answers[question.id];
      const values = answer && answer.values ? answer.values : {};
      isAnswered = contexts.every((context, idx) => values[idx] !== undefined);
    }
    const isLocked = isAnswered;

    // Render the current question only (replace previous content)
    if (question.type === 'multiple_choice') {
      html += this.renderMultipleChoice(question, isLocked);
    } else if (question.type === 'likert') {
      html += this.renderLikert(question, isLocked);
    } else if (question.type === 'multiple_response') {
      html += this.renderMultipleResponse(question, isLocked);
    } else if (question.type === 'frequency') {
      html += this.renderFrequency(question, isLocked);
    } else if (question.type === 'frequency_grid') {
      html += this.renderFrequencyGrid(question, isLocked);
    } else if (question.type === 'scenario') {
      html += this.renderScenario(question, isLocked);
    } else {
      // Fallback for unhandled question types
      html += `<div class="question-card" style="background: rgba(255, 0, 0, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="color: #ff4444; margin-top: 0;">Error: Unknown question type "${question.type}"</h3>
        <p style="color: var(--muted);">Question ID: ${question.id}</p>
        <p style="color: var(--muted);">${question.question || 'No question text available'}</p>
      </div>`;
    }

    container.innerHTML = html;
    this.updateNavigation();
  }

  getSectionExplanation(section) {
    const explanations = {
      1: {
        title: 'Section 1: AI Usage Patterns',
        description: 'We\'ll explore your daily patterns, use cases, and emotional triggers for AI usage.',
        purpose: 'This section helps identify your level of dependency and typical usage contexts.'
      },
      2: {
        title: 'Section 2: Cognitive Style',
        description: 'We\'ll examine your thinking patterns, problem-solving approaches, and abstraction capacity.',
        purpose: 'This section determines your cognitive complexity level and thinking style preferences.'
      },
      3: {
        title: 'Section 3: Attachment & Relationship',
        description: 'We\'ll explore your relationship with AI tools - how you perceive and interact with them.',
        purpose: 'This section identifies your attachment mode (Tool, Companion, Authority, or Independent).'
      },
      4: {
        title: 'Section 4: Sovereignty Indicators',
        description: 'We\'ll assess your independence practices, critical thinking habits, and resistance capacity.',
        purpose: 'This section measures your sovereignty capacity and identifies areas of strength or vulnerability.'
      }
    };

    const exp = explanations[section];
    return `
      <div class="section-explanation" style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 0.5rem;">${exp.title}</h3>
        <p style="margin: 0.5rem 0; color: var(--muted); line-height: 1.6;">${exp.description}</p>
        <p style="margin: 0.5rem 0 0 0; color: var(--muted); font-size: 0.9rem; font-style: italic;">${exp.purpose}</p>
      </div>
    `;
  }

  renderMultipleChoice(question, isLocked) {
    const currentAnswer = this.answers[question.id];
    let optionsHTML = question.options.map((option, index) => {
      const isSelected = currentAnswer && currentAnswer.selectedIndex === index;
      const lockedStyle = isLocked && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : '';
      const selectedLockedStyle = isLocked && isSelected ? 'background: rgba(255, 184, 0, 0.3) !important; border: 3px solid var(--brand) !important;' : '';
      return `
        <label class="option-label ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" style="display: flex; align-items: center; padding: 1rem; margin: 0.5rem 0; background: ${isSelected ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)'}; border: 2px solid ${isSelected ? 'var(--brand)' : 'transparent'}; border-radius: var(--radius); cursor: ${isLocked && !isSelected ? 'not-allowed' : 'pointer'}; transition: all 0.2s; position: relative; ${lockedStyle} ${selectedLockedStyle}">
          <input type="radio" name="question_${question.id}" value="${index}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''} style="margin-right: 0.75rem; width: 18px; height: 18px; cursor: ${isLocked ? 'not-allowed' : 'pointer'};">
          <span style="flex: 1;">${option.text}</span>
          ${isSelected ? '<span style="color: var(--brand); font-weight: 700; margin-left: 0.5rem; font-size: 1.1rem;">✓</span>' : ''}
        </label>
      `;
    }).join('');

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        const inputs = document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`);
        inputs.forEach(radio => {
          radio.addEventListener('change', (e) => {
            const selectedIndex = parseInt(e.target.value);
            this.processAnswer(question, selectedIndex);
            // Update visual selection immediately
            document.querySelectorAll(`label.option-label`).forEach(label => {
              label.classList.remove('selected');
              label.style.background = 'rgba(255, 255, 255, 0.1)';
              label.style.border = '2px solid transparent';
            });
            const selectedLabel = e.target.closest('label');
            if (selectedLabel) {
              selectedLabel.classList.add('selected');
              selectedLabel.style.background = 'rgba(255, 184, 0, 0.25)';
              selectedLabel.style.border = '2px solid var(--brand)';
            }
          });
        });
        
        // Also add click handlers to labels for better click target
        const labels = document.querySelectorAll(`label.option-label:not(.locked)`);
        labels.forEach(label => {
          label.addEventListener('click', (e) => {
            const input = label.querySelector('input[type="radio"]');
            if (input && !input.disabled && e.target.tagName !== 'INPUT') {
              input.checked = true;
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); color: var(--muted); font-size: 0.9rem;"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; line-height: 1.5;">${question.question}</h3>
        <div class="options-container">
          ${optionsHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  renderLikert(question, isLocked) {
    const currentAnswer = this.answers[question.id];
    const scale = question.scale || 5;
    const labels = question.labels || ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    
    let scaleHTML = '';
    for (let i = 1; i <= scale; i++) {
      const isSelected = currentAnswer && currentAnswer.value === i;
      const lockedStyle = isLocked && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : '';
      const selectedLockedStyle = isLocked && isSelected ? 'background: rgba(255, 184, 0, 0.3) !important; border: 3px solid var(--brand) !important;' : '';
      scaleHTML += `
        <label class="likert-option ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" style="display: inline-block; padding: 0.75rem 1rem; margin: 0.25rem; background: ${isSelected ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; border: 2px solid ${isSelected ? 'var(--brand)' : 'transparent'}; border-radius: var(--radius); cursor: ${isLocked && !isSelected ? 'not-allowed' : 'pointer'}; transition: all 0.2s; ${lockedStyle} ${selectedLockedStyle}">
          <input type="radio" name="question_${question.id}" value="${i}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''} style="display: none;">
          <span>${i}</span>
          <div style="font-size: 0.75rem; margin-top: 0.25rem; color: var(--muted);">${labels[i - 1] || ''}</div>
        </label>
      `;
    }

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        const inputs = document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`);
        inputs.forEach(radio => {
          radio.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            this.processAnswer(question, value);
            // Update visual selection immediately
            document.querySelectorAll(`label.likert-option`).forEach(label => {
              label.classList.remove('selected');
              label.style.background = 'rgba(255, 255, 255, 0.1)';
              label.style.border = '2px solid transparent';
            });
            const selectedLabel = e.target.closest('label');
            if (selectedLabel) {
              selectedLabel.classList.add('selected');
              selectedLabel.style.background = 'rgba(255, 184, 0, 0.2)';
              selectedLabel.style.border = '2px solid var(--brand)';
            }
          });
        });
        
        // Also add click handlers to labels since inputs are hidden
        const labels = document.querySelectorAll(`label.likert-option:not(.locked)`);
        labels.forEach(label => {
          label.addEventListener('click', (e) => {
            const input = label.querySelector('input');
            if (input && !input.disabled) {
              input.checked = true;
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); color: var(--muted); font-size: 0.9rem;"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; line-height: 1.5;">${question.question}</h3>
        <div class="likert-scale" style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-top: 1rem;">
          ${scaleHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  renderMultipleResponse(question, isLocked) {
    const currentAnswer = this.answers[question.id];
    const selectedIndices = currentAnswer ? (Array.isArray(currentAnswer.selectedIndices) ? currentAnswer.selectedIndices : [currentAnswer.selectedIndex]) : [];
    
    let optionsHTML = question.options.map((option, index) => {
      const isSelected = selectedIndices.includes(index);
      const lockedStyle = isLocked && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : '';
      const selectedLockedStyle = isLocked && isSelected ? 'background: rgba(255, 184, 0, 0.3) !important; border: 3px solid var(--brand) !important;' : '';
      return `
        <label class="option-label ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" style="display: flex; align-items: center; padding: 1rem; margin: 0.5rem 0; background: ${isSelected ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)'}; border: 2px solid ${isSelected ? 'var(--brand)' : 'transparent'}; border-radius: var(--radius); cursor: ${isLocked && !isSelected ? 'not-allowed' : 'pointer'}; transition: all 0.2s; position: relative; ${lockedStyle} ${selectedLockedStyle}">
          <input type="checkbox" name="question_${question.id}" value="${index}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''} style="margin-right: 0.75rem; width: 18px; height: 18px; cursor: ${isLocked ? 'not-allowed' : 'pointer'};">
          <span style="flex: 1;">${option.text}</span>
          ${isSelected ? '<span style="color: var(--brand); font-weight: 700; margin-left: 0.5rem; font-size: 1.1rem;">✓</span>' : ''}
        </label>
      `;
    }).join('');

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        const checkboxes = document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`);
        checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            const selectedIndices = Array.from(checkboxes)
              .filter(cb => cb.checked)
              .map(cb => parseInt(cb.value));
            this.processAnswer(question, selectedIndices);
            // Update visual selection
            document.querySelectorAll(`label.option-label`).forEach(label => {
              const checkbox = label.querySelector('input');
              if (checkbox && checkbox.checked) {
                label.classList.add('selected');
                label.style.background = 'rgba(255, 184, 0, 0.25)';
                label.style.border = '2px solid var(--brand)';
              } else {
                label.classList.remove('selected');
                label.style.background = 'rgba(255, 255, 255, 0.1)';
                label.style.border = '2px solid transparent';
              }
            });
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); color: var(--muted); font-size: 0.9rem;"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; line-height: 1.5;">${question.question}</h3>
        <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem;">Select all that apply:</p>
        <div class="options-container">
          ${optionsHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  renderFrequency(question, isLocked) {
    return this.renderMultipleChoice(question, isLocked); // Same rendering as multiple choice
  }

  renderFrequencyGrid(question, isLocked) {
    const currentAnswer = this.answers[question.id];
    const contexts = question.contexts || [];
    const scale = question.scale || ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    const answers = currentAnswer ? (currentAnswer.values || {}) : {};

    let gridHTML = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
    gridHTML += '<thead><tr><th style="text-align: left; padding: 0.75rem; border-bottom: 2px solid var(--brand); color: var(--brand);">Context</th>';
    scale.forEach((scaleLabel, idx) => {
      gridHTML += `<th style="text-align: center; padding: 0.75rem; border-bottom: 2px solid var(--brand); color: var(--brand); min-width: 100px;">${scaleLabel}</th>`;
    });
    gridHTML += '</tr></thead><tbody>';

    contexts.forEach((context, contextIdx) => {
      const contextAnswer = answers[contextIdx] !== undefined ? answers[contextIdx] : null;
      const isContextLocked = isLocked && contextAnswer !== null;
      
      gridHTML += `<tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">`;
      gridHTML += `<td style="padding: 0.75rem; font-weight: 600;">${context}</td>`;
      
      scale.forEach((scaleLabel, scaleIdx) => {
        const isSelected = contextAnswer === scaleIdx;
        const lockedStyle = isContextLocked && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : '';
        const selectedStyle = isSelected ? 'background: rgba(255, 184, 0, 0.3) !important; border: 2px solid var(--brand) !important;' : '';
        
        gridHTML += `<td style="text-align: center; padding: 0.5rem;">
          <label class="frequency-grid-option ${isSelected ? 'selected' : ''} ${isContextLocked ? 'locked' : ''}" 
                 style="display: inline-block; padding: 0.5rem 0.75rem; margin: 0.25rem; background: ${isSelected ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; border: 2px solid ${isSelected ? 'var(--brand)' : 'transparent'}; border-radius: var(--radius); cursor: ${isContextLocked && !isSelected ? 'not-allowed' : 'pointer'}; transition: all 0.2s; ${lockedStyle} ${selectedStyle}">
            <input type="radio" name="question_${question.id}_context_${contextIdx}" value="${scaleIdx}" ${isSelected ? 'checked' : ''} ${isContextLocked ? 'disabled' : ''} style="display: none;">
            <span>${scaleIdx + 1}</span>
          </label>
        </td>`;
      });
      
      gridHTML += '</tr>';
    });

    gridHTML += '</tbody></table></div>';

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        contexts.forEach((context, contextIdx) => {
          const inputs = document.querySelectorAll(`input[name="question_${question.id}_context_${contextIdx}"]:not([disabled])`);
          inputs.forEach(radio => {
            radio.addEventListener('change', (e) => {
              const scaleIdx = parseInt(e.target.value);
              this.processFrequencyGridAnswer(question, contextIdx, scaleIdx);
              
              // Update visual selection immediately for this row
              const row = e.target.closest('tr');
              if (row) {
                row.querySelectorAll('label.frequency-grid-option').forEach(label => {
                  label.classList.remove('selected');
                  label.style.background = 'rgba(255, 255, 255, 0.1)';
                  label.style.border = '2px solid transparent';
                });
                const selectedLabel = e.target.closest('label');
                if (selectedLabel) {
                  selectedLabel.classList.add('selected');
                  selectedLabel.style.background = 'rgba(255, 184, 0, 0.2)';
                  selectedLabel.style.border = '2px solid var(--brand)';
                }
              }
            });
          });
          
          // Also add click handlers to labels
          const labels = document.querySelectorAll(`label.frequency-grid-option:not(.locked)`);
          labels.forEach(label => {
            const input = label.querySelector('input');
            if (input && input.name.includes(`question_${question.id}_context_${contextIdx}`)) {
              label.addEventListener('click', (e) => {
                if (input && !input.disabled && e.target.tagName !== 'INPUT') {
                  input.checked = true;
                  input.dispatchEvent(new Event('change', { bubbles: true }));
                }
              });
            }
          });
        });
      }, 100);
    }

    const lockedNotice = isLocked ? '<div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); color: var(--muted); font-size: 0.9rem;"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; line-height: 1.5;">${question.question}</h3>
        <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem;">Select a frequency for each context:</p>
        ${gridHTML}
        ${lockedNotice}
      </div>
    `;
  }

  renderScenario(question, isLocked) {
    return this.renderMultipleChoice(question, isLocked); // Same rendering as multiple choice
  }

  processFrequencyGridAnswer(question, contextIdx, scaleIdx) {
    // Handle frequency grid answers - each context gets a scale value
    const currentAnswer = this.answers[question.id];
    const values = currentAnswer && currentAnswer.values ? { ...currentAnswer.values } : {};
    const previousValue = values[contextIdx];
    values[contextIdx] = scaleIdx;

    this.answers[question.id] = {
      questionId: question.id,
      values: values,
      timestamp: new Date().toISOString()
    };

    // Calculate scores based on frequency grid answers
    // Higher frequency = higher dependency, lower sovereignty
    const scaleLength = (question.scale || []).length;
    
    // If there was a previous answer, subtract its contribution
    if (previousValue !== undefined) {
      const prevDependencyScore = (previousValue / (scaleLength - 1)) * 3;
      this.scores.dependency -= prevDependencyScore;
      this.scores.sovereignty += prevDependencyScore * 0.5;
    }
    
    // Add the new score contribution
    const dependencyScore = (scaleIdx / (scaleLength - 1)) * 3; // 0 to 3 points
    this.scores.dependency += dependencyScore;
    this.scores.sovereignty -= dependencyScore * 0.5;
    
    this.saveProgress();
  }

  processAnswer(question, answerValue) {
    // Handle both single and multiple answers
    const selectedIndices = Array.isArray(answerValue) ? answerValue : [answerValue];
    
    this.answers[question.id] = {
      questionId: question.id,
      value: answerValue,
      selectedIndex: Array.isArray(answerValue) ? answerValue[0] : answerValue,
      selectedIndices: Array.isArray(answerValue) ? answerValue : [answerValue],
      timestamp: new Date().toISOString()
    };

    // Update preliminary filters based on early questions
    this.updatePreliminaryFilters(question, answerValue);

    // Score the answer(s) - handle different question types
    if (question.type === 'likert') {
      // Likert questions have scores directly on the question object
      const likertValue = Array.isArray(answerValue) ? answerValue[0] : answerValue;
      if (question.scores && question.scores[likertValue]) {
        const likertScores = question.scores[likertValue];
        Object.keys(likertScores).forEach(scoreKey => {
          if (this.scores[scoreKey] !== undefined) {
            this.scores[scoreKey] += likertScores[scoreKey] || 0;
          }
          // Handle cognitiveLevel which maps to cognitiveComplexity
          if (scoreKey === 'cognitiveLevel') {
            this.scores.cognitiveComplexity += likertScores[scoreKey] || 0;
          }
        });
      }
    } else {
      // Multiple choice, frequency, scenario, multiple_response questions have options
      const selectedOptions = selectedIndices.map(idx => question.options && question.options[idx]).filter(opt => opt);
      selectedOptions.forEach(option => {
        if (option.scores) {
          Object.keys(option.scores).forEach(scoreKey => {
            if (this.scores[scoreKey] !== undefined) {
              this.scores[scoreKey] += option.scores[scoreKey] || 0;
            }
            // Handle cognitiveLevel which maps to cognitiveComplexity
            if (scoreKey === 'cognitiveLevel') {
              this.scores.cognitiveComplexity += option.scores[scoreKey] || 0;
            }
          });
        }
      });
    }

    this.saveProgress();
  }

  updatePreliminaryFilters(question, answerValue) {
    // Update filters based on early questions to enable adaptive filtering
    
    // Section 1: Usage frequency (from u2 - daily usage frequency)
    if (question.id === 'u2' && question.options) {
      const selectedIndex = Array.isArray(answerValue) ? answerValue[0] : answerValue;
      const selectedOption = question.options[selectedIndex];
      if (selectedOption) {
        const text = selectedOption.text.toLowerCase();
        if (text.includes('never')) {
          this.preliminaryFilters.aiUsageFrequency = 'never';
        } else if (text.includes('rarely')) {
          this.preliminaryFilters.aiUsageFrequency = 'rarely';
        } else if (text.includes('daily')) {
          this.preliminaryFilters.aiUsageFrequency = 'daily';
        } else if (text.includes('multiple times') || text.includes('constantly')) {
          this.preliminaryFilters.aiUsageFrequency = 'frequent';
        }
      }
    }
    
    // Update dependency level based on cumulative dependency score
    if (this.currentSection === 1) {
      // After Section 1, categorize dependency level
      if (this.scores.dependency !== undefined) {
        if (this.scores.dependency < -3) {
          this.preliminaryFilters.dependencyLevel = 'low';
        } else if (this.scores.dependency > 10) {
          this.preliminaryFilters.dependencyLevel = 'high';
        } else {
          this.preliminaryFilters.dependencyLevel = 'medium';
        }
      }
    }
    
    // Update cognitive level based on Section 2 results
    if (this.currentSection === 2) {
      // After Section 2, categorize cognitive level
      if (this.scores.cognitiveComplexity !== undefined) {
        // Cognitive complexity score ranges from negative to positive
        if (this.scores.cognitiveComplexity < 5) {
          this.preliminaryFilters.cognitiveLevel = 'low';
        } else if (this.scores.cognitiveComplexity > 15) {
          this.preliminaryFilters.cognitiveLevel = 'high';
        } else {
          this.preliminaryFilters.cognitiveLevel = 'medium';
        }
      }
    }
  }

  /**
   * Move to the next question in the sequence
   */
  nextQuestion() {
    try {
      // Check if current question has been answered
      const currentQuestion = this.questionSequence[this.currentQuestionIndex];
      if (currentQuestion && !this.answers[currentQuestion.id]) {
        // For multiple response questions, allow skipping
        if (currentQuestion.type === 'multiple_response') {
          // Allow progression even if none selected (user can skip)
        } 
        // For frequency_grid questions, check if all contexts have been answered
        else if (currentQuestion.type === 'frequency_grid') {
          const contexts = currentQuestion.contexts || [];
          const answer = this.answers[currentQuestion.id];
          const values = answer && answer.values ? answer.values : {};
          const allAnswered = contexts.every((context, idx) => values[idx] !== undefined);
          if (!allAnswered) {
            ErrorHandler.showUserError('Please select a frequency for all contexts before proceeding.');
            return;
          }
        } else {
          ErrorHandler.showUserError('Please select an answer before proceeding.');
          return;
        }
      }

      if (this.currentQuestionIndex < this.questionSequence.length - 1) {
        this.currentQuestionIndex++;
        this.renderCurrentQuestion();
        this.saveProgress();
        
        // Focus management for accessibility
        const questionCard = document.querySelector('.question-card');
        if (questionCard) {
          DOMUtils.focusElement(questionCard);
        }
      } else {
        // End of current section
        this.completeSection().catch(error => {
          ErrorHandler.logError(error, 'SovereigntyEngine.nextQuestion.completeSection');
        });
      }
    } catch (error) {
      ErrorHandler.logError(error, 'SovereigntyEngine.nextQuestion');
      ErrorHandler.showUserError('Failed to proceed to next question. Please try again.');
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  /**
   * Complete current section and move to next or show results
   * @returns {Promise<void>}
   */
  async completeSection() {
    // Ensure data is loaded before analysis
    await this.ensureDataLoaded();
    
    if (this.currentSection === 1) {
      this.analyzeSection1Results();
      // Update dependency level filter after Section 1
      this.updatePreliminaryFilters(null, null);
      this.currentSection = 2;
      this.currentQuestionIndex = 0;
      await this.buildSectionSequence(2); // Will apply IQ bracket filter + dependency level
      this.renderCurrentQuestion();
    } else if (this.currentSection === 2) {
      this.analyzeSection2Results();
      // Update cognitive level filter after Section 2
      this.updatePreliminaryFilters(null, null);
      this.currentSection = 3;
      this.currentQuestionIndex = 0;
      await this.buildSectionSequence(3); // Will apply IQ bracket + dependency + cognitive filters
      this.renderCurrentQuestion();
    } else if (this.currentSection === 3) {
      this.analyzeSection3Results();
      this.currentSection = 4;
      this.currentQuestionIndex = 0;
      await this.buildSectionSequence(4);
      this.renderCurrentQuestion();
    } else if (this.currentSection === 4) {
      this.analyzeSection4Results();
      this.finalizeResults();
    }
  }

  analyzeSection1Results() {
    // Analyze usage patterns and dependency
    this.analysisData.section1Results = {
      dependencyScore: this.scores.dependency,
      usagePatterns: this.extractUsagePatterns(),
      timestamp: new Date().toISOString()
    };
  }

  analyzeSection2Results() {
    // Analyze cognitive style
    this.analysisData.section2Results = {
      cognitiveComplexity: this.scores.cognitiveComplexity,
      thinkingStyle: this.determineThinkingStyle(),
      timestamp: new Date().toISOString()
    };
  }

  analyzeSection3Results() {
    // Analyze attachment mode
    this.analysisData.section3Results = {
      attachmentScore: this.scores.attachment,
      attachmentMode: this.determineAttachmentMode(),
      timestamp: new Date().toISOString()
    };
  }

  analyzeSection4Results() {
    // Analyze sovereignty indicators
    this.analysisData.section4Results = {
      sovereigntyScore: this.scores.sovereignty,
      sovereigntyIndicators: this.extractSovereigntyIndicators(),
      timestamp: new Date().toISOString()
    };
  }

  extractUsagePatterns() {
    // Extract usage pattern insights from answers
    const patterns = {
      frequency: 'low',
      emotionalTriggers: [],
      contexts: []
    };
    // Implementation details...
    return patterns;
  }

  determineThinkingStyle() {
    // Determine thinking style based on cognitive complexity score
    if (this.scores.cognitiveComplexity < 20) return 'concrete';
    if (this.scores.cognitiveComplexity < 40) return 'analytical';
    if (this.scores.cognitiveComplexity < 60) return 'abstract';
    return 'meta-recursive';
  }

  determineAttachmentMode() {
    // Determine attachment mode from answers
    if (this.scores.attachment < 10) return 'independent';
    if (this.scores.attachment < 30) return 'tool';
    if (this.scores.attachment < 50) return 'companion';
    return 'authority';
  }

  extractSovereigntyIndicators() {
    // Extract sovereignty indicators from answers
    return {
      analogPractices: 0,
      criticalThinking: 0,
      discomfortTolerance: 0
    };
  }

  finalizeResults() {
    // Determine cognitive band
    this.analysisData.cognitiveBand = this.determineCognitiveBand();
    
    // Identify subclasses
    this.analysisData.subclasses = this.identifySubclasses();
    
    // Set attachment mode
    this.analysisData.attachmentMode = this.determineAttachmentMode();
    
    // Calculate vulnerability risks
    this.analysisData.vulnerabilityRisks = this.calculateVulnerabilityRisks();
    
    // Calculate sovereignty score (0-100)
    this.analysisData.sovereigntyScore = this.calculateSovereigntyScore();
    
    // Determine sovereign split position
    this.analysisData.sovereignSplitPosition = this.determineSovereignSplitPosition();
    
    // Store all answers
    this.analysisData.allAnswers = { ...this.answers };
    // Store full question objects with text for export
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question || q.questionText || '',
      section: q.section,
      category: q.category,
      type: q.type
    }));
    
    // Display results
    this.displayResults();
    this.showResults();
  }

  determineCognitiveBand() {
    // Determine cognitive band based on cognitive complexity score
    const cognitiveScore = this.scores.cognitiveComplexity;
    if (cognitiveScore < 20) return COGNITIVE_BANDS.band_80_100;
    if (cognitiveScore < 40) return COGNITIVE_BANDS.band_100_115;
    if (cognitiveScore < 60) return COGNITIVE_BANDS.band_115_130;
    if (cognitiveScore < 80) return COGNITIVE_BANDS.band_130_145;
    return COGNITIVE_BANDS.band_145_plus;
  }

  identifySubclasses() {
    // Identify top 3 subclasses based on answer patterns
    const subclassScores = {};
    
    // Score subclasses based on answers and risks identified
    Object.keys(this.answers).forEach(answerId => {
      const answer = this.answers[answerId];
      const question = this.questionSequence.find(q => q.id === answerId);
      if (question && question.options) {
        const selectedOption = question.options[answer.selectedIndex];
        if (selectedOption && selectedOption.risk) {
          subclassScores[selectedOption.risk] = (subclassScores[selectedOption.risk] || 0) + 1;
        }
      }
    });

    // Return top 3 subclasses
    return Object.entries(subclassScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subclassId]) => {
        if (!SUBCLASSES) {
          console.warn('SUBCLASSES not loaded');
          return null;
        }
        const subclass = SUBCLASSES[subclassId];
        return subclass ? { ...subclass, matchScore: subclassScores[subclassId] } : null;
      })
      .filter(s => s !== null);
  }

  calculateVulnerabilityRisks() {
    // Calculate top 5 vulnerability risks
    const risks = [];
    
    // High dependency risk
    if (this.scores.dependency > 50) {
      risks.push({
        name: 'High Dependency',
        severity: 'high',
        description: 'You show high dependency on AI tools. Consider reducing usage and building independent capabilities.'
      });
    }
    
    // High attachment risk
    if (this.scores.attachment > 40) {
      risks.push({
        name: 'High Attachment',
        severity: 'high',
        description: 'You may be forming unhealthy attachments to AI. Consider boundary-setting practices.'
      });
    }
    
    // Identity drift risk
    if (this.scores.sovereignty < 20) {
      risks.push({
        name: 'Identity Drift',
        severity: 'critical',
        description: 'You may be losing track of your authentic self. Implement identity grounding practices immediately.'
      });
    }
    
    // Mirror loop risk (for high cognitive complexity)
    if (this.scores.cognitiveComplexity > 60 && this.scores.dependency > 30) {
      risks.push({
        name: 'Mirror Loop Risk',
        severity: 'high',
        description: 'Your high cognitive complexity combined with AI dependency creates risk of recursive thinking loops.'
      });
    }
    
    return risks.slice(0, 5);
  }

  calculateSovereigntyScore() {
    // Calculate sovereignty score (0-100)
    // Based on sovereignty indicators, dependency, and attachment
    let score = 50; // Base score
    
    // Sovereignty indicators add points
    score += this.scores.sovereignty * 0.5;
    
    // Dependency and attachment subtract points
    score -= this.scores.dependency * 0.3;
    score -= this.scores.attachment * 0.2;
    
    // Normalize to 0-100
    score = Math.max(0, Math.min(100, score));
    
    return Math.round(score);
  }

  determineSovereignSplitPosition() {
    // Determine position in sovereign split (80% Queue, 16% Compromising, 4% Core)
    const sovereigntyScore = this.analysisData.sovereigntyScore;
    
    if (sovereigntyScore >= 75) {
      return SOVEREIGN_SPLIT_POSITIONS.core_4;
    } else if (sovereigntyScore >= 40) {
      if (!SOVEREIGN_SPLIT_POSITIONS) {
        console.warn('SOVEREIGN_SPLIT_POSITIONS not loaded');
        return null;
      }
      return SOVEREIGN_SPLIT_POSITIONS.compromising_16;
    } else {
      return SOVEREIGN_SPLIT_POSITIONS.queue_80;
    }
  }

  displayResults() {
    const container = document.getElementById('resultsContent');
    if (!container) return;

    const band = this.analysisData.cognitiveBand;
    const subclasses = this.analysisData.subclasses;
    const split = this.analysisData.sovereignSplitPosition;
    const sovereigntyScore = this.analysisData.sovereigntyScore;
    const risks = this.analysisData.vulnerabilityRisks;
    const attachmentMode = this.analysisData.attachmentMode;

    let html = `
      <div class="results-dashboard" style="max-width: 900px; margin: 0 auto;">
        <h2 style="color: var(--brand); margin-top: 0; margin-bottom: 2rem; font-size: 2rem;">Your Sovereignty Profile</h2>
        
        <div class="profile-summary" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Cognitive Band: ${band.iqRange} IQ</h3>
          <p style="font-size: 1.2rem; font-weight: 600; margin: 0.5rem 0;">${band.name}</p>
          <p style="color: var(--muted); line-height: 1.6;">${band.description}</p>
        </div>

        ${subclasses.length > 0 ? `
          <div class="subclasses" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
            <h3 style="color: var(--brand); margin-top: 0;">Top Subclass Matches</h3>
            ${subclasses.map((subclass, idx) => `
              <div style="margin: 1rem 0; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius);">
                <h4 style="margin: 0 0 0.5rem 0;">${idx + 1}. ${subclass.name}</h4>
                <p style="color: var(--muted); font-size: 0.9rem; margin: 0.5rem 0;">${subclass.aiEffect}</p>
                <p style="color: var(--muted); font-size: 0.85rem; margin: 0.5rem 0; font-style: italic;">Support: ${subclass.support}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="split-position" style="background: rgba(255, 184, 0, 0.1); padding: 2rem; border-left: 4px solid var(--brand); border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Sovereign Split Position</h3>
          <p style="font-size: 1.3rem; font-weight: 600; margin: 0.5rem 0;">${split.name}</p>
          <p style="color: var(--muted); line-height: 1.6;">${split.description}</p>
        </div>

        <div class="sovereignty-score" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; text-align: center;">
          <h3 style="color: var(--brand); margin-top: 0;">Sovereignty Score</h3>
          <div style="font-size: 3rem; font-weight: 700; color: var(--brand); margin: 1rem 0;">${sovereigntyScore}/100</div>
          <div style="width: 100%; height: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; margin: 1rem 0;">
            <div style="width: ${sovereigntyScore}%; height: 100%; background: var(--brand); transition: width 0.5s;"></div>
          </div>
        </div>

        <div class="attachment-mode" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Attachment Mode</h3>
          <p style="font-size: 1.2rem; font-weight: 600; margin: 0.5rem 0; text-transform: capitalize;">${attachmentMode}</p>
          <p style="color: var(--muted); line-height: 1.6;">
            ${attachmentMode === 'independent' ? 'You maintain clear boundaries with AI tools.' :
              attachmentMode === 'tool' ? 'You use AI as a practical tool without emotional attachment.' :
              attachmentMode === 'companion' ? 'You may be forming emotional attachments to AI. Be mindful of boundaries.' :
              'You may be treating AI as an authority. Consider developing independent critical thinking.'}
          </p>
        </div>

        ${risks.length > 0 ? `
          <div class="vulnerability-risks" style="background: rgba(255, 0, 0, 0.1); padding: 2rem; border-left: 4px solid #ff4444; border-radius: var(--radius); margin-bottom: 2rem;">
            <h3 style="color: #ff4444; margin-top: 0;">Top Vulnerability Risks</h3>
            ${risks.map((risk, idx) => `
              <div style="margin: 1rem 0; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius);">
                <h4 style="margin: 0 0 0.5rem 0; color: ${risk.severity === 'critical' ? '#ff0000' : '#ff8800'};">
                  ${idx + 1}. ${risk.name} 
                  <span style="font-size: 0.8rem; text-transform: uppercase; background: ${risk.severity === 'critical' ? '#ff0000' : '#ff8800'}; padding: 0.2rem 0.5rem; border-radius: 3px; margin-left: 0.5rem;">${risk.severity}</span>
                </h4>
                <p style="color: var(--muted); margin: 0.5rem 0;">${risk.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="action-plan" style="background: rgba(0, 255, 0, 0.1); padding: 2rem; border-left: 4px solid #00aa00; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: #00aa00; margin-top: 0;">Recommended Action Plan</h3>
          <p style="color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">Based on your profile, here are priority interventions:</p>
          ${this.generateActionPlan()}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  generateActionPlan() {
    const recommendations = [];
    const sovereigntyScore = this.analysisData.sovereigntyScore;
    const risks = this.analysisData.vulnerabilityRisks;
    const attachmentMode = this.analysisData.attachmentMode;

    if (sovereigntyScore < 40) {
      recommendations.push({
        priority: 'Critical',
        title: 'Immediate Sovereignty Building',
        description: 'Your sovereignty score is low. Implement daily practices to maintain independence.',
        practices: [
          'One 48-hour AI-free period per month',
          'Daily analog practice (handwriting, physical art)',
          'Weekly critical thinking exercises'
        ]
      });
    }

    if (this.scores.attachment > 40) {
      recommendations.push({
        priority: 'High',
        title: 'Boundary Setting',
        description: 'You show high attachment to AI. Set clear boundaries and practice independence.',
        practices: [
          'Use AI only for specific tasks, not emotional support',
          'Keep a journal tracking when you use AI',
          'Engage with real people for emotional needs'
        ]
      });
    }

    if (this.scores.dependency > 50) {
      recommendations.push({
        priority: 'High',
        title: 'Dependency Reduction',
        description: 'You are highly dependent on AI. Gradually reduce usage and build independent capabilities.',
        practices: [
          'Reduce AI usage by 25% each month',
          'Learn to do one task manually that you currently use AI for',
          'Practice solving problems without AI assistance'
        ]
      });
    }

    if (this.scores.cognitiveComplexity > 60) {
      recommendations.push({
        priority: 'Medium',
        title: 'Mirror Rupture Protocols',
        description: 'Your high cognitive complexity creates risk of recursive loops. Practice disruption.',
        practices: [
          'Weekly debate with someone who thinks differently',
          'Expose yourself to opposing frameworks',
          'Practice loop interruption techniques'
        ]
      });
    }

    if (recommendations.length === 0) {
      return '<p style="color: var(--muted);">Continue maintaining your sovereignty practices. Stay vigilant.</p>';
    }

    return recommendations.map((rec, idx) => `
      <div style="margin: 1.5rem 0; padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius); border-left: 4px solid ${rec.priority === 'Critical' ? '#ff0000' : rec.priority === 'High' ? '#ff8800' : '#00aa00'};">
        <h4 style="margin: 0 0 0.5rem 0;">
          ${idx + 1}. ${rec.title}
          <span style="font-size: 0.8rem; text-transform: uppercase; background: ${rec.priority === 'Critical' ? '#ff0000' : rec.priority === 'High' ? '#ff8800' : '#00aa00'}; padding: 0.2rem 0.5rem; border-radius: 3px; margin-left: 0.5rem;">${rec.priority}</span>
        </h4>
        <p style="color: var(--muted); margin: 0.5rem 0;">${rec.description}</p>
        <ul style="color: var(--muted); margin: 0.5rem 0; padding-left: 1.5rem;">
          ${rec.practices.map(practice => `<li>${practice}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  showQuestionContainer() {
    const introSection = document.getElementById('introSection');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (introSection) introSection.style.display = 'none';
    if (questionnaireSection) questionnaireSection.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
  }

  showResults() {
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (questionnaireSection) questionnaireSection.style.display = 'none';
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const questionCounter = document.getElementById('questionCounter');
    const progressBar = document.getElementById('progressBar');

    if (prevBtn) {
      prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
    }

    if (nextBtn) {
      const currentQuestion = this.questionSequence[this.currentQuestionIndex];
      const isAnswered = currentQuestion && this.answers[currentQuestion.id];
      nextBtn.textContent = this.currentQuestionIndex >= this.questionSequence.length - 1 ? 
        (this.currentSection === 4 ? 'Complete Assessment' : 'Next Section') : 'Next';
    }

    if (questionCounter) {
      const totalQuestions = SECTION_1_USAGE_PATTERNS.length + 
                             SECTION_2_COGNITIVE_STYLE.length + 
                             SECTION_3_ATTACHMENT.length + 
                             SECTION_4_SOVEREIGNTY.length;
      const currentQuestionNum = this.getCurrentQuestionNumber();
      questionCounter.textContent = `Question ${currentQuestionNum} of ${totalQuestions} | Section ${this.currentSection} of 4`;
    }

    if (progressBar) {
      const totalQuestions = SECTION_1_USAGE_PATTERNS.length + 
                             SECTION_2_COGNITIVE_STYLE.length + 
                             SECTION_3_ATTACHMENT.length + 
                             SECTION_4_SOVEREIGNTY.length;
      const currentQuestionNum = this.getCurrentQuestionNumber();
      const progress = (currentQuestionNum / totalQuestions) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  getCurrentQuestionNumber() {
    let questionNum = 0;
    for (let s = 1; s < this.currentSection; s++) {
      // Use actual filtered question sequence lengths
      if (s === 1) {
        const section1Questions = this.filterSection1Questions([...SECTION_1_USAGE_PATTERNS]);
        questionNum += section1Questions.length;
      } else if (s === 2) {
        const section2Questions = this.filterSection2Questions([...SECTION_2_COGNITIVE_STYLE]);
        questionNum += section2Questions.length;
      } else if (s === 3) {
        const section3Questions = this.filterSection3Questions([...SECTION_3_ATTACHMENT]);
        questionNum += section3Questions.length;
      }
    }
    questionNum += this.currentQuestionIndex + 1;
    return questionNum;
  }
  
  getTotalQuestionsEstimate() {
    // Estimate total questions based on filters
    let total = 0;
    const section1Questions = this.filterSection1Questions([...SECTION_1_USAGE_PATTERNS]);
    const section2Questions = this.filterSection2Questions([...SECTION_2_COGNITIVE_STYLE]);
    const section3Questions = this.filterSection3Questions([...SECTION_3_ATTACHMENT]);
    const section4Questions = this.filterSection4Questions([...SECTION_4_SOVEREIGNTY]);
    total = section1Questions.length + section2Questions.length + 
            section3Questions.length + section4Questions.length;
    return total;
  }

  resetAssessment() {
    if (confirm('Are you sure you want to start a new assessment? All progress will be lost.')) {
      this.answers = {};
      this.scores = {
        dependency: 0,
        attachment: 0,
        sovereignty: 0,
        cognitiveComplexity: 0,
        driftRisk: 0
      };
      this.iqBracket = null;
      this.iqBracketSecondary = null;
      this.currentSection = 0; // Reset to IQ selection
      this.currentQuestionIndex = 0;
      this.preliminaryFilters = {
        aiUsageFrequency: null,
        dependencyLevel: null,
        cognitiveLevel: null
      };
      this.analysisData = {
        timestamp: new Date().toISOString(),
        iqBracket: null,
        iqBracketSecondary: null,
        section1Results: {},
        section2Results: {},
        section3Results: {},
        section4Results: {},
        cognitiveBand: null,
        subclasses: [],
        attachmentMode: null,
        vulnerabilityRisks: [],
        sovereigntyScore: 0,
        sovereignSplitPosition: null,
        allAnswers: {},
        questionSequence: []
      };
      
      sessionStorage.removeItem('sovereigntyAssessment');
      
      const introSection = document.getElementById('introSection');
      const questionnaireSection = document.getElementById('questionnaireSection');
      const resultsContainer = document.getElementById('resultsContainer');
      
      if (introSection) introSection.style.display = 'block';
      if (questionnaireSection) questionnaireSection.style.display = 'none';
      if (resultsContainer) resultsContainer.style.display = 'none';
      
      // Show IQ bracket selection
      this.showIQBracketSelection();
    }
  }

  saveProgress() {
    const progress = {
      currentSection: this.currentSection,
      currentQuestionIndex: this.currentQuestionIndex,
      iqBracket: this.iqBracket,
      iqBracketSecondary: this.iqBracketSecondary,
      answers: this.answers,
      scores: this.scores,
      preliminaryFilters: this.preliminaryFilters,
      analysisData: this.analysisData
    };
    sessionStorage.setItem('sovereigntyAssessment', JSON.stringify(progress));
  }

  loadStoredData() {
    try {
      const stored = sessionStorage.getItem('sovereigntyAssessment');
      if (stored) {
        const progress = JSON.parse(stored);
        this.currentSection = progress.currentSection || 0; // Default to IQ selection
        this.currentQuestionIndex = progress.currentQuestionIndex || 0;
        this.iqBracket = progress.iqBracket || null;
        this.iqBracketSecondary = progress.iqBracketSecondary || null;
        this.answers = progress.answers || {};
        this.scores = progress.scores || {
          dependency: 0,
          attachment: 0,
          sovereignty: 0,
          cognitiveComplexity: 0,
          driftRisk: 0
        };
        this.preliminaryFilters = progress.preliminaryFilters || {
          aiUsageFrequency: null,
          dependencyLevel: null,
          cognitiveLevel: null
        };
        this.analysisData = progress.analysisData || this.analysisData;
        
        // Restore IQ bracket(s) if set
        if (this.iqBracket) {
          this.analysisData.iqBracket = this.iqBracket;
        }
        if (this.iqBracketSecondary) {
          this.analysisData.iqBracketSecondary = this.iqBracketSecondary;
        }
        
        // Restore state
        if (this.currentSection === 0) {
          // Show IQ bracket selection if not yet selected
          this.showIQBracketSelection();
        } else if (this.currentSection > 0 && this.currentSection <= 4) {
          // Load data and rebuild sequence
          this.ensureDataLoaded().then(() => {
            return this.buildSectionSequence(this.currentSection);
          }).then(() => {
            this.showQuestionContainer();
            this.renderCurrentQuestion();
            this.updateNavigation();
          }).catch(error => {
            ErrorHandler.logError(error, 'SovereigntyEngine.loadStoredData.buildSequence');
          });
        }
      }
    } catch (e) {
      console.error('Error loading stored data:', e);
    }
  }

  exportAnalysis(format) {
    if (format === 'json') {
      exportJSON(this.analysisData, 'sovereignty-analysis');
    } else if (format === 'csv') {
      // CSV export implementation
      const csv = this.generateCSV();
      downloadFile(csv, 'sovereignty-analysis.csv', 'text/csv');
    }
  }

  generateCSV() {
    // Generate CSV from analysis data
    const rows = [
      ['Metric', 'Value'],
      ['Timestamp', this.analysisData.timestamp],
      ['Cognitive Band', this.analysisData.cognitiveBand?.name || ''],
      ['IQ Range', this.analysisData.cognitiveBand?.iqRange || ''],
      ['Sovereignty Score', this.analysisData.sovereigntyScore],
      ['Attachment Mode', this.analysisData.attachmentMode],
      ['Sovereign Split Position', this.analysisData.sovereignSplitPosition?.name || ''],
      ['Dependency Score', this.scores.dependency],
      ['Attachment Score', this.scores.attachment],
      ['Sovereignty Score', this.scores.sovereignty],
      ['Cognitive Complexity', this.scores.cognitiveComplexity]
    ];
    
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}

