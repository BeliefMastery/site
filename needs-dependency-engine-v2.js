// Needs Dependency Loop Determinator Engine - Version 2
// 4-Phase Questionnaire Architecture
// Based on Chapter 5: Needs and Beliefs from Belief Mastery
// STRICT PROPRIETARY VOCABULARY - MUST BE ADHERED TO

import { NEEDS_VOCABULARY } from './needs-dependency-data/needs-vocabulary.js';
import { VICES_VOCABULARY } from './needs-dependency-data/vices-vocabulary.js';
import { DEPENDENCY_LOOPS, PHASE_1_QUESTIONS, PHASE_2_QUESTIONS, PHASE_3_QUESTIONS, PHASE_4_QUESTIONS } from './needs-dependency-data/dependency-loop-questions-v2.js';
import { PATTERN_NEEDS_MAPPING } from './needs-dependency-data/pattern-needs-mapping.js';
import { NEED_COMPULSION_AVERSION_MAPPING } from './needs-dependency-data/need-compulsion-aversion-mapping.js';
import { VICE_NEEDS_MAPPING } from './needs-dependency-data/vice-needs-mapping.js';
import { PATTERNS_COMPENDIUM } from './needs-dependency-data/patterns-compendium.js';
import { NEEDS_GLOSSARY } from './needs-dependency-data/needs-glossary.js';
import { VICES_GLOSSARY } from './needs-dependency-data/vices-glossary.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class NeedsDependencyEngine {
  constructor() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.identifiedLoops = []; // Top 3 loops from Phase 1
    this.needChain = []; // For Phase 3
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      identifiedLoops: [],
      primaryLoop: null,
      secondaryLoops: [],
      loopScores: {},
      recommendations: [],
      allAnswers: {},
      questionSequence: []
    };
    
    this.init();
  }

  init() {
    this.buildPhase1Sequence();
    this.attachEventListeners();
    this.loadStoredData();
  }

  buildPhase1Sequence() {
    this.questionSequence = [...PHASE_1_QUESTIONS];
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
  }

  // Decision Tree Logic: Analyze Phase 1 responses to identify top 3 loops
  analyzePhase1Results() {
    const loopScores = {};
    const viceProfile = [];
    const stressResponse = null;
    const triggerSensitivity = [];
    
    // Initialize loop scores
    DEPENDENCY_LOOPS.forEach(loop => {
      loopScores[loop] = {
        compulsionIndex: 0,
        aversionIndex: 0,
        viceAlignment: 0,
        triggerMatch: 0,
        historicalPattern: false,
        totalScore: 0
      };
    });
    
    // Process Phase 1 answers
    PHASE_1_QUESTIONS.forEach(question => {
      const answer = this.answers[question.id];
      if (!answer) return;
      
      if (question.id === 'p1_relationship_pattern' && answer.mapsTo) {
        answer.mapsTo.loops.forEach(loop => {
          if (answer.mapsTo.sourcing === 'compulsive') {
            loopScores[loop].compulsionIndex += 3;
          } else if (answer.mapsTo.sourcing === 'avoidant') {
            loopScores[loop].aversionIndex += 3;
          }
        });
        if (answer.mapsTo.stressResponse) {
          // Store stress response for later use
        }
      }
      
      if (question.id === 'p1_stress_response' && answer.mapsTo) {
        answer.mapsTo.loops.forEach(loop => {
          loopScores[loop].compulsionIndex += 2;
        });
      }
      
      if (question.id === 'p1_vice_states' && Array.isArray(answer)) {
        answer.forEach(selected => {
          if (selected.mapsTo) {
            viceProfile.push(...selected.mapsTo.vices);
            selected.mapsTo.loops.forEach(loop => {
              loopScores[loop].viceAlignment += 2;
            });
          }
        });
      }
      
      if (question.id === 'p1_trigger_sensitivity' && answer.mapsTo) {
        triggerSensitivity.push(...(answer.mapsTo.triggers || []));
        answer.mapsTo.loops.forEach(loop => {
          loopScores[loop].triggerMatch += 2;
        });
      }
      
      if (question.id === 'p1_attachment_style' && answer.mapsTo) {
        answer.mapsTo.loops.forEach(loop => {
          loopScores[loop].compulsionIndex += 1;
        });
      }
    });
    
    // Calculate total scores
    Object.keys(loopScores).forEach(loop => {
      const score = loopScores[loop];
      score.totalScore = (
        score.compulsionIndex * 0.25 +
        score.aversionIndex * 0.25 +
        score.viceAlignment * 0.25 +
        score.triggerMatch * 0.25
      );
    });
    
    // Identify top 3 loops
    const sortedLoops = Object.entries(loopScores)
      .sort((a, b) => b[1].totalScore - a[1].totalScore)
      .slice(0, 3);
    
    this.identifiedLoops = sortedLoops.map(([loop, scores]) => ({
      loop,
      scores,
      confidence: scores.totalScore >= 6 ? 'high' : scores.totalScore >= 4 ? 'medium' : 'low'
    }));
    
    this.analysisData.phase1Results = {
      loopScores,
      viceProfile,
      stressResponse,
      triggerSensitivity,
      topLoops: this.identifiedLoops
    };
    
    // Build Phase 2 sequence based on identified loops
    this.buildPhase2Sequence();
  }

  buildPhase2Sequence() {
    this.questionSequence = [];
    
    // Add questions for each identified loop (up to 3 loops)
    this.identifiedLoops.forEach(({ loop }) => {
      if (PHASE_2_QUESTIONS[loop]) {
        this.questionSequence.push(...PHASE_2_QUESTIONS[loop]);
      }
    });
    
    this.currentPhase = 2;
    this.currentQuestionIndex = 0;
  }

  buildPhase3Sequence() {
    // Phase 3 uses the primary loop identified from Phase 2
    const primaryLoop = this.analysisData.primaryLoop || this.identifiedLoops[0]?.loop;
    
    if (!primaryLoop) {
      // Skip to Phase 4 if no primary loop
      this.buildPhase4Sequence();
      return;
    }
    
    // Build dynamic need chain questions
    this.questionSequence = [];
    const surfaceNeed = this.getSurfaceNeedForLoop(primaryLoop);
    
    PHASE_3_QUESTIONS.forEach((question, index) => {
      if (question.dynamic) {
        const dynamicQuestion = { ...question };
        if (index === 0) {
          dynamicQuestion.question = dynamicQuestion.question.replace('[SURFACE_NEED]', surfaceNeed);
        } else {
          // Will be populated dynamically based on previous answer
          dynamicQuestion.question = dynamicQuestion.question.replace('[DEEPER_NEED]', 'this need');
        }
        this.questionSequence.push(dynamicQuestion);
      } else {
        this.questionSequence.push(question);
      }
    });
    
    this.currentPhase = 3;
    this.currentQuestionIndex = 0;
  }

  buildPhase4Sequence() {
    this.questionSequence = [...PHASE_4_QUESTIONS];
    this.currentPhase = 4;
    this.currentQuestionIndex = 0;
  }

  getSurfaceNeedForLoop(loop) {
    const loopNeedMap = {
      'SPACE': 'space',
      'JOY': 'joy',
      'BEING WANTED': 'being wanted',
      'EQUALITY': 'equality',
      'TO SEE AND BE SEEN': 'to see and be seen',
      'EASE': 'ease',
      'SECURITY': 'security',
      'BELONGING': 'belonging',
      'CONSIDERATION': 'consideration',
      'FLOW': 'flow',
      'MOURNING': 'mourning',
      'APPROVAL': 'approval',
      'REST': 'rest',
      'CONTRIBUTION': 'contribution',
      'INDEPENDENCE': 'independence',
      'STIMULATION/ADVENTURE': 'stimulation'
    };
    return loopNeedMap[loop] || 'this need';
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startAssessment());
    }
    
    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }
    
    const exportBtnJson = document.getElementById('exportAnalysisJson');
    if (exportBtnJson) {
      exportBtnJson.addEventListener('click', () => this.exportAnalysis('json'));
    }
    
    const exportBtnCsv = document.getElementById('exportAnalysisCsv');
    if (exportBtnCsv) {
      exportBtnCsv.addEventListener('click', () => this.exportAnalysis('csv'));
    }
    
    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => this.abandonAssessment());
    }
  }

  abandonAssessment() {
    if (confirm('Are you sure you want to abandon this assessment? All progress will be lost and you will need to start from the beginning.')) {
      this.resetAssessment();
    }
  }

  startAssessment() {
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('questionnaireSection').classList.add('active');
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completePhase();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    if (!container) return;
    
    let html = '';
    
    // Render based on question type
    if (question.type === 'scaled') {
      html = this.renderScaledQuestion(question);
    } else if (question.type === 'scenario') {
      html = this.renderScenarioQuestion(question);
    } else if (question.type === 'multiselect') {
      html = this.renderMultiselectQuestion(question);
    } else if (question.type === 'need_chain') {
      html = this.renderNeedChainQuestion(question);
    }
    
    container.innerHTML = html;
    
    // Attach event listeners for the specific question type
    this.attachQuestionListeners(question);
    
    this.updateProgress();
    this.updateNavigationButtons();
  }

  renderScaledQuestion(question) {
    const currentAnswer = this.answers[question.id];
    const scale = question.scale || { min: 1, max: 7 };
    const labels = scale.labels || {};
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${question.question}</h3>
        <div class="scale-container">
          <div class="scale-input">
            <input 
              type="range" 
              id="questionInput" 
              data-question-id="${question.id}"
              min="${scale.min}" 
              max="${scale.max}" 
              step="1"
              value="${currentAnswer || Math.round((scale.min + scale.max) / 2)}"
            />
          </div>
          <div class="scale-value" id="scaleValue">${currentAnswer || Math.round((scale.min + scale.max) / 2)}</div>
        </div>
        <div class="scale-labels">
          <span>${labels[scale.min] || scale.min}</span>
          <span>${labels[Math.round((scale.min + scale.max) / 2)] || Math.round((scale.min + scale.max) / 2)}</span>
          <span>${labels[scale.max] || scale.max}</span>
        </div>
      </div>
    `;
  }

  renderScenarioQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${question.question}</h3>
        <div class="scenario-options">
          ${question.options.map((option, index) => `
            <label class="scenario-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${option.text}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderMultiselectQuestion(question) {
    const currentAnswer = this.answers[question.id] || [];
    const maxSelections = question.maxSelections || 3;
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${question.question}</h3>
        <p class="selection-limit">Select up to ${maxSelections}</p>
        <div class="multiselect-options">
          ${question.options.map((option, index) => {
            const isSelected = currentAnswer.some(ans => ans.text === option.text);
            return `
              <label class="multiselect-option ${isSelected ? 'selected' : ''}">
                <input 
                  type="checkbox" 
                  name="question_${question.id}" 
                  value="${index}"
                  data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                  ${isSelected ? 'checked' : ''}
                />
                <span class="option-text">${option.text}</span>
              </label>
            `;
          }).join('')}
        </div>
        <div class="selection-count" id="selectionCount">Selected: ${currentAnswer.length} / ${maxSelections}</div>
      </div>
    `;
  }

  renderNeedChainQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${question.question}</h3>
        <div class="need-chain-options">
          ${question.options.map((option, index) => `
            <label class="need-chain-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${option.text}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachQuestionListeners(question) {
    if (question.type === 'scaled') {
      const slider = document.getElementById('questionInput');
      const valueDisplay = document.getElementById('scaleValue');
      
      if (slider && valueDisplay) {
        slider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          valueDisplay.textContent = value;
          this.answers[question.id] = value;
          this.saveProgress();
        });
      }
    } else if (question.type === 'scenario' || question.type === 'need_chain') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const optionData = JSON.parse(e.target.dataset.optionData);
          this.answers[question.id] = optionData;
          
          // Update visual selection
          document.querySelectorAll(`.scenario-option, .need-chain-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          e.target.closest('label').classList.add('selected');
          
          this.saveProgress();
        });
      });
    } else if (question.type === 'multiselect') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      const maxSelections = question.maxSelections || 3;
      const selectionCount = document.getElementById('selectionCount');
      
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const selected = Array.from(inputs)
            .filter(inp => inp.checked)
            .map(inp => JSON.parse(inp.dataset.optionData));
          
          if (selected.length > maxSelections) {
            e.target.checked = false;
            return;
          }
          
          this.answers[question.id] = selected;
          
          // Update visual selection
          document.querySelectorAll('.multiselect-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          selected.forEach(sel => {
            const matchingInput = Array.from(inputs).find(inp => {
              const data = JSON.parse(inp.dataset.optionData);
              return data.text === sel.text;
            });
            if (matchingInput) {
              matchingInput.closest('label').classList.add('selected');
            }
          });
          
          if (selectionCount) {
            selectionCount.textContent = `Selected: ${selected.length} / ${maxSelections}`;
          }
          
          this.saveProgress();
        });
      });
    }
  }

  getPhaseLabel(phase) {
    const labels = {
      1: 'Initial Screening',
      2: 'Loop-Specific Deep Dive',
      3: 'Need Chain Mapping',
      4: 'Validation & Prioritization'
    };
    return labels[phase] || `Phase ${phase}`;
  }

  updateProgress() {
    const totalQuestions = this.getTotalQuestions();
    const currentQuestion = this.getCurrentQuestionNumber();
    const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  getTotalQuestions() {
    // Estimate: Phase 1 (6) + Phase 2 (15 per loop * 3 loops = 45) + Phase 3 (5) + Phase 4 (3) = ~59
    // But we'll calculate dynamically
    let total = PHASE_1_QUESTIONS.length;
    if (this.identifiedLoops.length > 0) {
      total += this.identifiedLoops.length * 5; // 5 questions per loop in Phase 2
    }
    total += PHASE_3_QUESTIONS.length;
    total += PHASE_4_QUESTIONS.length;
    return total;
  }

  getCurrentQuestionNumber() {
    let current = 0;
    if (this.currentPhase >= 1) {
      current += PHASE_1_QUESTIONS.length;
    }
    if (this.currentPhase >= 2) {
      current += this.currentQuestionIndex;
    }
    if (this.currentPhase >= 3) {
      current += PHASE_3_QUESTIONS.length;
    }
    if (this.currentPhase >= 4) {
      current += this.currentQuestionIndex;
    }
    return current;
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0 && this.currentPhase === 1;
    }
    
    if (nextBtn) {
      const isLastQuestion = this.currentQuestionIndex === this.questionSequence.length - 1;
      nextBtn.textContent = isLastQuestion ? 'Complete Phase' : 'Next';
    }
  }

  nextQuestion() {
    // Save current answer
    this.saveCurrentAnswer();
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      this.completePhase();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else if (this.currentPhase > 1) {
      // Go back to previous phase
      this.currentPhase--;
      // Rebuild sequence for previous phase
      if (this.currentPhase === 1) {
        this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        this.buildPhase2Sequence();
      } else if (this.currentPhase === 3) {
        this.buildPhase3Sequence();
      }
      this.currentQuestionIndex = this.questionSequence.length - 1;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  saveCurrentAnswer() {
    // Answer is already saved in attachQuestionListeners via saveProgress()
    // This is a placeholder for any additional processing needed
  }

  completePhase() {
    if (this.currentPhase === 1) {
      this.analyzePhase1Results();
      this.renderCurrentQuestion(); // Start Phase 2
    } else if (this.currentPhase === 2) {
      this.analyzePhase2Results();
      this.buildPhase3Sequence();
      if (this.questionSequence.length > 0) {
        this.renderCurrentQuestion(); // Start Phase 3
      } else {
        this.buildPhase4Sequence();
        this.renderCurrentQuestion(); // Start Phase 4
      }
    } else if (this.currentPhase === 3) {
      this.analyzePhase3Results();
      this.buildPhase4Sequence();
      this.renderCurrentQuestion(); // Start Phase 4
    } else if (this.currentPhase === 4) {
      this.analyzePhase4Results();
      this.completeAssessment();
    }
  }

  analyzePhase2Results() {
    // Calculate loop scores based on Phase 2 responses
    const loopScores = {};
    
    this.identifiedLoops.forEach(({ loop }) => {
      loopScores[loop] = {
        compulsionScore: 0,
        aversionScore: 0,
        partnerConsequenceScore: 0,
        needChainDepth: 0,
        historicalPatternScore: 0,
        totalScore: 0
      };
      
      // Get Phase 2 questions for this loop
      const loopQuestions = PHASE_2_QUESTIONS[loop] || [];
      loopQuestions.forEach(q => {
        const answer = this.answers[q.id];
        if (!answer) return;
        
        if (q.mapsTo?.indicator === 'compulsive_sourcing') {
          loopScores[loop].compulsionScore += typeof answer === 'number' ? answer : 0;
        } else if (q.mapsTo?.indicator === 'avoidant_sourcing') {
          loopScores[loop].aversionScore += typeof answer === 'number' ? answer : 0;
        } else if (q.mapsTo?.indicator === 'partner_consequence') {
          loopScores[loop].partnerConsequenceScore += typeof answer === 'number' ? answer : 0;
        } else if (q.mapsTo?.indicator === 'need_chain') {
          if (answer.mapsTo) {
            loopScores[loop].needChainDepth += 1;
          }
        } else if (q.mapsTo?.indicator === 'historical_pattern') {
          loopScores[loop].historicalPatternScore += typeof answer === 'number' ? answer : 0;
        }
      });
      
      // Calculate total score (weighted average)
      loopScores[loop].totalScore = (
        loopScores[loop].compulsionScore * 0.2 +
        loopScores[loop].aversionScore * 0.2 +
        loopScores[loop].partnerConsequenceScore * 0.2 +
        loopScores[loop].needChainDepth * 2 * 0.2 +
        loopScores[loop].historicalPatternScore * 0.2
      );
    });
    
    // Identify primary loop
    const sortedLoops = Object.entries(loopScores)
      .sort((a, b) => b[1].totalScore - a[1].totalScore);
    
    this.analysisData.primaryLoop = sortedLoops[0]?.[0] || null;
    this.analysisData.secondaryLoops = sortedLoops.slice(1, 3).map(([loop]) => loop);
    this.analysisData.loopScores = loopScores;
    this.analysisData.phase2Results = loopScores;
  }

  analyzePhase3Results() {
    // Map need chain from Phase 3 answers
    const needChain = [];
    PHASE_3_QUESTIONS.forEach(q => {
      const answer = this.answers[q.id];
      if (answer && answer.mapsTo) {
        needChain.push({
          need: answer.mapsTo.need,
          deeper: answer.mapsTo.deeper || []
        });
      }
    });
    
    this.needChain = needChain;
    this.analysisData.phase3Results = {
      needChain,
      isDependencyLoop: this.answers['p3_loop_vs_cascade']?.mapsTo?.patternType === 'dependency_loop'
    };
  }

  analyzePhase4Results() {
    this.analysisData.phase4Results = {
      resistanceType: this.answers['p4_resistance']?.mapsTo?.resistanceType || 'unknown',
      impactSeverity: this.answers['p4_impact_severity'] || 0,
      readiness: this.answers['p4_readiness'] || 0
    };
  }

  completeAssessment() {
    // Generate recommendations
    this.generateRecommendations();
    
    // Include all raw answers and question sequence for export
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.getAllQuestionsAnswered();
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  getAllQuestionsAnswered() {
    const allQuestions = [];
    
    // Phase 1
    PHASE_1_QUESTIONS.forEach(q => {
      allQuestions.push({
        id: q.id,
        question: q.question,
        phase: 1,
        answer: this.answers[q.id]
      });
    });
    
    // Phase 2
    this.identifiedLoops.forEach(({ loop }) => {
      const loopQuestions = PHASE_2_QUESTIONS[loop] || [];
      loopQuestions.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          phase: 2,
          loop: loop,
          answer: this.answers[q.id]
        });
      });
    });
    
    // Phase 3
    PHASE_3_QUESTIONS.forEach(q => {
      allQuestions.push({
        id: q.id,
        question: q.question,
        phase: 3,
        answer: this.answers[q.id]
      });
    });
    
    // Phase 4
    PHASE_4_QUESTIONS.forEach(q => {
      allQuestions.push({
        id: q.id,
        question: q.question,
        phase: 4,
        answer: this.answers[q.id]
      });
    });
    
    return allQuestions;
  }

  generateRecommendations() {
    const recommendations = [];
    const primaryLoop = this.analysisData.primaryLoop;
    
    if (primaryLoop) {
      recommendations.push({
        priority: 'high',
        title: `Address ${primaryLoop} Dependency Loop`,
        description: `Your primary dependency loop is ${primaryLoop}. Focus on meeting the underlying needs directly rather than managing surface symptoms through external sourcing.`
      });
      
      // Add specific recommendations based on loop type
      if (this.needChain.length > 0) {
        const rootNeeds = this.needChain[this.needChain.length - 1]?.deeper || [];
        if (rootNeeds.length > 0) {
          recommendations.push({
            priority: 'high',
            title: 'Meet Root Needs',
            description: `The root needs in your chain are: ${rootNeeds.join(', ')}. Address these directly to collapse the entire dependency loop.`
          });
        }
      }
    }
    
    // Add general recommendations
    recommendations.push({
      priority: 'medium',
      title: 'Trace the Chain Inward',
      description: 'When you notice a surface symptom, ask "Why?" repeatedly to trace the need chain inward. Meet the deepest need to collapse the entire loop.'
    });
    
    this.analysisData.recommendations = recommendations;
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    let html = '<div class="results-content">';
    
    // Primary Loop
    if (this.analysisData.primaryLoop) {
      html += this.renderPrimaryLoop();
    }
    
    // Secondary Loops
    if (this.analysisData.secondaryLoops.length > 0) {
      html += this.renderSecondaryLoops();
    }
    
    // Need Chain
    if (this.needChain.length > 0) {
      html += this.renderNeedChain();
    }
    
    // Recommendations
    html += this.renderRecommendations();
    
    // Closure
    html += this.renderClosure();
    
    html += '</div>';
    container.innerHTML = html;
  }

  renderPrimaryLoop() {
    const loop = this.analysisData.primaryLoop;
    const scores = this.analysisData.loopScores[loop];
    
    return `
      <div class="primary-loop-section">
        <h2>Primary Dependency Loop Identified</h2>
        <div class="loop-card primary">
          <div class="loop-header">
            <h3>${loop} Loop</h3>
            <span class="loop-strength">Confidence: ${scores?.totalScore?.toFixed(1) || 'N/A'}/10</span>
          </div>
          <p class="loop-description">Based on your responses, the ${loop} dependency loop shows the strongest alignment with your patterns.</p>
        </div>
      </div>
    `;
  }

  renderSecondaryLoops() {
    const secondaryLoops = this.analysisData.secondaryLoops;
    
    if (secondaryLoops.length === 0) return '';
    
    return `
      <div class="secondary-loops-section">
        <h2>Secondary Patterns</h2>
        <div class="loops-grid">
          ${secondaryLoops.map(loop => `
            <div class="loop-card">
              <h3>${loop} Loop</h3>
              <p>Additional pattern showing weaker signals</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderNeedChain() {
    if (this.needChain.length === 0) return '';
    
    return `
      <div class="need-chain-section">
        <h2>Need Chain Analysis</h2>
        <div class="need-chain-visualization">
          <p><strong>Surface Need:</strong> ${this.needChain[0]?.need || 'Unknown'}</p>
          ${this.needChain.length > 1 ? `
            <p><strong>Deeper Needs:</strong> ${this.needChain.slice(1).map(n => n.need).join(' → ')}</p>
          ` : ''}
          ${this.needChain[this.needChain.length - 1]?.deeper?.length > 0 ? `
            <p><strong>Root Needs:</strong> ${this.needChain[this.needChain.length - 1].deeper.join(', ')}</p>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderRecommendations() {
    if (!this.analysisData.recommendations || this.analysisData.recommendations.length === 0) return '';
    
    const highPriority = this.analysisData.recommendations.filter(r => r.priority === 'high');
    const mediumPriority = this.analysisData.recommendations.filter(r => r.priority === 'medium');
    
    return `
      <div class="recommendations-section">
        <h2>Action Strategies</h2>
        ${highPriority.length > 0 ? `
          <div class="priority-group high">
            <h3>High Priority</h3>
            <ul>
              ${highPriority.map(rec => `<li><strong>${rec.title}:</strong> ${rec.description}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${mediumPriority.length > 0 ? `
          <div class="priority-group medium">
            <h3>Medium Priority</h3>
            <ul>
              ${mediumPriority.map(rec => `<li><strong>${rec.title}:</strong> ${rec.description}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderClosure() {
    return `
      <div class="closure-section">
        <h2>What This Does NOT Imply</h2>
        <div class="closure-content">
          <p><strong>This analysis does not mean:</strong></p>
          <ul>
            <li>That you are broken or deficient</li>
            <li>That dependency is always negative (some dependency is healthy and necessary)</li>
            <li>That you must meet all needs independently</li>
            <li>That these patterns are permanent or fixed</li>
          </ul>
          <p><strong>This analysis does mean:</strong></p>
          <ul>
            <li>You have identified patterns that can be addressed with conscious awareness</li>
            <li>You have a map for tracing symptoms to root needs</li>
            <li>You can develop greater autonomy and sovereignty through needs consciousness</li>
            <li>You can transform dependency loops into conscious choice</li>
          </ul>
        </div>
      </div>
    `;
  }

  saveProgress() {
    const progressData = {
      currentPhase: this.currentPhase,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      identifiedLoops: this.identifiedLoops,
      needChain: this.needChain,
      analysisData: this.analysisData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('needsDependencyProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = localStorage.getItem('needsDependencyProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.currentPhase = data.currentPhase || 1;
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        this.identifiedLoops = data.identifiedLoops || [];
        this.needChain = data.needChain || [];
        this.analysisData = data.analysisData || this.analysisData;
        
        // Rebuild question sequence based on current phase
        if (this.currentPhase === 1) {
          this.buildPhase1Sequence();
        } else if (this.currentPhase === 2) {
          this.analyzePhase1Results();
          this.buildPhase2Sequence();
        } else if (this.currentPhase === 3) {
          this.analyzePhase1Results();
          this.analyzePhase2Results();
          this.buildPhase3Sequence();
        } else if (this.currentPhase === 4) {
          this.analyzePhase1Results();
          this.analyzePhase2Results();
          this.analyzePhase3Results();
          this.buildPhase4Sequence();
        }
      } catch (e) {
        console.error('Error loading stored progress:', e);
      }
    }
  }

  resetAssessment() {
    if (confirm('Are you sure you want to start a new assessment? This will clear all current progress.')) {
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.identifiedLoops = [];
      this.needChain = [];
      this.analysisData = {
        timestamp: new Date().toISOString(),
        phase1Results: {},
        phase2Results: {},
        phase3Results: {},
        phase4Results: {},
        identifiedLoops: [],
        primaryLoop: null,
        secondaryLoops: [],
        loopScores: {},
        recommendations: [],
        allAnswers: {},
        questionSequence: []
      };
      localStorage.removeItem('needsDependencyProgress');
      localStorage.removeItem('needsDependencyResults');
      
      document.getElementById('resultsSection').classList.remove('active');
      document.getElementById('introSection').style.display = 'block';
      document.getElementById('questionnaireSection').classList.remove('active');
      
      this.buildPhase1Sequence();
    }
  }

  exportAnalysis(format) {
    const exportData = {
      ...this.analysisData,
      exportDate: new Date().toISOString(),
      systemType: 'needs-dependency-v2',
      systemName: 'Needs Dependency Loop Determinator (4-Phase Architecture)'
    };
    
    if (format === 'json') {
      const json = exportJSON(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
      downloadFile(json, 'needs-dependency-analysis.json', 'application/json');
    } else if (format === 'csv') {
      const csv = exportForAIAgent(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
      downloadFile(csv, 'needs-dependency-analysis.csv', 'text/csv');
    }
  }
}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.needsDependencyEngine = new NeedsDependencyEngine();
  });
} else {
  window.needsDependencyEngine = new NeedsDependencyEngine();
}

