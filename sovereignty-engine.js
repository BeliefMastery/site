// AI Sovereignty Analysis Engine
// Multi-dimensional assessment of AI dependency, attachment, cognitive profile, and sovereignty capacity

import { COGNITIVE_BANDS, SUBCLASSES, SOVEREIGN_SPLIT_POSITIONS } from './sovereignty-data/cognitive-bands.js';
import { SECTION_1_USAGE_PATTERNS, SECTION_2_COGNITIVE_STYLE, SECTION_3_ATTACHMENT, SECTION_4_SOVEREIGNTY } from './sovereignty-data/sovereignty-questions.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

export class SovereigntyEngine {
  constructor() {
    this.currentSection = 1; // 1-4 sections
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.scores = {
      dependency: 0,
      attachment: 0,
      sovereignty: 0,
      cognitiveComplexity: 0,
      driftRisk: 0
    };
    this.analysisData = {
      timestamp: new Date().toISOString(),
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
    
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.attachEventListeners();
        this.loadStoredData();
      });
    } else {
      this.attachEventListeners();
      this.loadStoredData();
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

  startAssessment() {
    this.currentSection = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.scores = {
      dependency: 0,
      attachment: 0,
      sovereignty: 0,
      cognitiveComplexity: 0,
      driftRisk: 0
    };
    this.buildSectionSequence(1);
    this.showQuestionContainer();
    this.renderCurrentQuestion();
    this.updateNavigation();
    this.saveProgress();
  }

  buildSectionSequence(section) {
    switch(section) {
      case 1:
        this.questionSequence = [...SECTION_1_USAGE_PATTERNS];
        break;
      case 2:
        this.questionSequence = [...SECTION_2_COGNITIVE_STYLE];
        break;
      case 3:
        this.questionSequence = [...SECTION_3_ATTACHMENT];
        break;
      case 4:
        this.questionSequence = [...SECTION_4_SOVEREIGNTY];
        break;
    }
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
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
    const isAnswered = this.answers[question.id] !== undefined;
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
    } else if (question.type === 'scenario') {
      html += this.renderScenario(question, isLocked);
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

  renderScenario(question, isLocked) {
    return this.renderMultipleChoice(question, isLocked); // Same rendering as multiple choice
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

  nextQuestion() {
    // Check if current question has been answered
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (currentQuestion && !this.answers[currentQuestion.id]) {
      // For multiple response questions, check if at least one option selected
      if (currentQuestion.type === 'multiple_response') {
        // Allow progression even if none selected (user can skip)
      } else {
        alert('Please select an answer before proceeding.');
        return;
      }
    }

    if (this.currentQuestionIndex < this.questionSequence.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else {
      // End of current section
      this.completeSection();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  completeSection() {
    if (this.currentSection === 1) {
      this.analyzeSection1Results();
      this.currentSection = 2;
      this.currentQuestionIndex = 0;
      this.buildSectionSequence(2);
      this.renderCurrentQuestion();
    } else if (this.currentSection === 2) {
      this.analyzeSection2Results();
      this.currentSection = 3;
      this.currentQuestionIndex = 0;
      this.buildSectionSequence(3);
      this.renderCurrentQuestion();
    } else if (this.currentSection === 3) {
      this.analyzeSection3Results();
      this.currentSection = 4;
      this.currentQuestionIndex = 0;
      this.buildSectionSequence(4);
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
    this.analysisData.allAnswers = this.answers;
    this.analysisData.questionSequence = this.questionSequence.map(q => q.id);
    
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
      if (s === 1) questionNum += SECTION_1_USAGE_PATTERNS.length;
      if (s === 2) questionNum += SECTION_2_COGNITIVE_STYLE.length;
      if (s === 3) questionNum += SECTION_3_ATTACHMENT.length;
    }
    questionNum += this.currentQuestionIndex + 1;
    return questionNum;
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
      this.currentSection = 1;
      this.currentQuestionIndex = 0;
      this.analysisData = {
        timestamp: new Date().toISOString(),
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
    }
  }

  saveProgress() {
    const progress = {
      currentSection: this.currentSection,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      scores: this.scores,
      analysisData: this.analysisData
    };
    sessionStorage.setItem('sovereigntyAssessment', JSON.stringify(progress));
  }

  loadStoredData() {
    try {
      const stored = sessionStorage.getItem('sovereigntyAssessment');
      if (stored) {
        const progress = JSON.parse(stored);
        this.currentSection = progress.currentSection || 1;
        this.currentQuestionIndex = progress.currentQuestionIndex || 0;
        this.answers = progress.answers || {};
        this.scores = progress.scores || {
          dependency: 0,
          attachment: 0,
          sovereignty: 0,
          cognitiveComplexity: 0,
          driftRisk: 0
        };
        this.analysisData = progress.analysisData || this.analysisData;
        
        if (this.currentSection > 1 || this.currentQuestionIndex > 0) {
          this.buildSectionSequence(this.currentSection);
          this.showQuestionContainer();
          this.renderCurrentQuestion();
          this.updateNavigation();
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

