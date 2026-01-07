// Archetype Analysis Engine
// Multi-Tier Assessment System for identifying primary, secondary, and tertiary archetypes
// Version 1.0 - Following bias-mitigation principles

import { ARCHETYPES, CORE_GROUPS } from './archetype-data/archetypes.js';
import { PHASE_1_QUESTIONS, PHASE_2_QUESTIONS, PHASE_3_QUESTIONS, PHASE_4_QUESTIONS } from './archetype-data/archetype-questions.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

export class ArchetypeEngine {
  constructor() {
    this.currentPhase = 0; // 0 = gender selection, 1-4 = assessment phases
    this.currentQuestionIndex = 0;
    this.gender = null; // 'male' or 'female'
    this.answers = {};
    this.questionSequence = [];
    this.archetypeScores = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      gender: null,
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      primaryArchetype: null,
      secondaryArchetype: null,
      tertiaryArchetype: null,
      confidenceLevels: {},
      allAnswers: {},
      questionSequence: []
    };

    this.init();
  }

  init() {
    // Ensure DOM is ready before attaching event listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.attachEventListeners();
        this.loadStoredData();
        this.initializeScores();
      });
    } else {
      this.attachEventListeners();
      this.loadStoredData();
      this.initializeScores();
    }
  }

  initializeScores() {
    // Initialize scores dynamically as archetypes are scored (to support gender-specific archetypes)
    this.archetypeScores = {};
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Start button clicked');
        this.startAssessment();
      });
      console.log('Start button event listener attached');
    } else {
      console.error('Start button not found!');
      // Try again after a short delay in case DOM isn't ready
      setTimeout(() => {
        const retryBtn = document.getElementById('startAssessment');
        if (retryBtn) {
          retryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start button clicked (retry)');
            this.startAssessment();
          });
          console.log('Start button event listener attached (retry)');
        }
      }, 500);
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
    console.log('startAssessment called');
    this.currentPhase = 0; // Start with gender selection
    this.currentQuestionIndex = 0;
    this.gender = null;
    this.answers = {};
    this.initializeScores();
    this.showQuestionContainer(); // Show questionnaire section first
    this.showGenderSelection();
    this.saveProgress();
  }

  showGenderSelection() {
    const container = document.getElementById('questionContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.95); padding: 3rem; border-radius: var(--radius); margin-bottom: 2rem; text-align: center;">
        <h2 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.5rem;">Select Your Gender</h2>
        <p style="color: var(--muted); margin-bottom: 2rem; line-height: 1.6;">This assessment adapts questions based on gender to provide more accurate archetype identification. Your selection is used only for question branching and does not affect the validity of results.</p>
        <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
          <button id="selectMale" class="gender-btn" style="padding: 1.5rem 3rem; font-size: 1.1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600;">
            Male
          </button>
          <button id="selectFemale" class="gender-btn" style="padding: 1.5rem 3rem; font-size: 1.1rem; background: rgba(255, 184, 0, 0.1); border: 2px solid var(--brand); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; color: var(--brand); font-weight: 600;">
            Female
          </button>
        </div>
      </div>
    `;

    // Add hover effects
    setTimeout(() => {
      document.getElementById('selectMale')?.addEventListener('click', () => {
        this.gender = 'male';
        this.analysisData.gender = 'male';
        this.currentPhase = 1;
        this.buildPhase1Sequence();
        this.showQuestionContainer();
        this.renderCurrentQuestion();
        this.updateNavigation();
        this.saveProgress();
      });

      document.getElementById('selectFemale')?.addEventListener('click', () => {
        this.gender = 'female';
        this.analysisData.gender = 'female';
        this.currentPhase = 1;
        this.buildPhase1Sequence();
        this.showQuestionContainer();
        this.renderCurrentQuestion();
        this.updateNavigation();
        this.saveProgress();
      });

      // Add hover effects
      document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.background = 'rgba(255, 184, 0, 0.2)';
          btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'rgba(255, 184, 0, 0.1)';
          btn.style.transform = 'translateY(0)';
        });
      });
    }, 100);
    
    // Show the questionnaire section
    this.showQuestionContainer();
  }

  buildPhase1Sequence() {
    // Phase 1: Core Orientation (15 forced-choice questions)
    this.questionSequence = [...PHASE_1_QUESTIONS];
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  buildPhase2Sequence() {
    // Phase 2: Dimensional Refinement (25 Likert questions)
    this.currentPhase = 2;
    this.currentQuestionIndex = 0;
    this.questionSequence = [...PHASE_2_QUESTIONS];
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  buildPhase3Sequence() {
    // Phase 3: Shadow/Integration Assessment (10 contextual questions)
    this.currentPhase = 3;
    this.currentQuestionIndex = 0;
    this.questionSequence = [...PHASE_3_QUESTIONS];
    // Shuffle to mitigate order bias
    this.questionSequence.sort(() => Math.random() - 0.5);
  }

  buildPhase4Sequence() {
    // Phase 4: Validation & Narrative Matching (5 narrative vignettes)
    this.currentPhase = 4;
    this.currentQuestionIndex = 0;
    this.questionSequence = [...PHASE_4_QUESTIONS];
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

    // Show phase explanation at start of each phase
    if (this.currentQuestionIndex === 0) {
      html += this.getPhaseExplanation(this.currentPhase);
    }

    // Determine if this question has already been answered (locked)
    const isAnswered = this.answers[question.id] !== undefined;
    const isLocked = isAnswered; // Answers are locked once made

    // Render the current question only (replace previous content)
    if (question.type === 'forced_choice') {
      html += this.renderForcedChoiceQuestion(question, isLocked);
    } else if (question.type === 'likert') {
      html += this.renderLikertQuestion(question, isLocked);
    } else if (question.type === 'narrative') {
      html += this.renderNarrativeQuestion(question, isLocked);
    }

    // Replace content instead of appending - only show current question
    container.innerHTML = html;
    this.updateNavigation();
  }

  getPhaseExplanation(phase) {
    const explanations = {
      1: {
        title: 'Phase 1: Core Orientation',
        description: 'We\'ll start by identifying your fundamental behavioral patterns and values through concrete scenarios.',
        purpose: 'This phase helps determine which primary archetype group (Alpha, Beta, Gamma, Delta, Sigma, Omega, or Phi) best matches your natural orientation.'
      },
      2: {
        title: 'Phase 2: Dimensional Refinement',
        description: 'Now we\'ll explore the nuances within your primary group to identify specific subtypes and variations.',
        purpose: 'This phase distinguishes between main types and their variants (e.g., Alpha vs Alpha-Xi vs Dark Alpha) through detailed behavioral statements.'
      },
      3: {
        title: 'Phase 3: Shadow & Integration Assessment',
        description: 'We\'ll examine how you respond under stress and identify secondary influences and developmental areas.',
        purpose: 'This phase reveals situational variability, aspirational traits, stress responses, and potential shadow expressions of your archetype.'
      },
      4: {
        title: 'Phase 4: Validation & Narrative Matching',
        description: 'Finally, we\'ll present narrative scenarios to confirm the resonance of your identified archetype.',
        purpose: 'This phase uses holistic pattern recognition to validate your results through real-world scenarios.'
      }
    };

    const exp = explanations[phase];
    return `
      <div class="phase-explanation" style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 0.5rem;">${exp.title}</h3>
        <p style="margin: 0.5rem 0; color: var(--muted); line-height: 1.6;">${exp.description}</p>
        <p style="margin: 0.5rem 0 0 0; color: var(--muted); font-size: 0.9rem; font-style: italic;">${exp.purpose}</p>
      </div>
    `;
  }

  renderForcedChoiceQuestion(question, isLocked = false) {
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
        document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`).forEach(radio => {
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

  renderLikertQuestion(question, isLocked = false) {
    const currentAnswer = this.answers[question.id];
    const scale = question.scale || 5;
    const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    
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
        document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`).forEach(radio => {
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

  renderNarrativeQuestion(question, isLocked = false) {
    const currentAnswer = this.answers[question.id];
    let vignettesHTML = question.vignettes.map((vignette, index) => {
      const isSelected = currentAnswer && currentAnswer.selectedIndex === index;
      const lockedStyle = isLocked && !isSelected ? 'opacity: 0.5; cursor: not-allowed;' : '';
      const selectedLockedStyle = isLocked && isSelected ? 'background: rgba(255, 184, 0, 0.3) !important; border: 3px solid var(--brand) !important;' : '';
      return `
        <label class="narrative-option ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" style="display: block; padding: 1.5rem; margin: 1rem 0; background: ${isSelected ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; border: 2px solid ${isSelected ? 'var(--brand)' : 'transparent'}; border-radius: var(--radius); cursor: ${isLocked && !isSelected ? 'not-allowed' : 'pointer'}; transition: all 0.2s; ${lockedStyle} ${selectedLockedStyle}">
          <input type="radio" name="question_${question.id}" value="${index}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''} style="margin-right: 0.5rem;">
          <div style="font-style: italic; color: var(--muted); line-height: 1.7;">${vignette.text}</div>
          ${isSelected ? '<div style="margin-top: 0.5rem; color: var(--brand); font-weight: 700; font-size: 0.9rem;">✓ Selected</div>' : ''}
        </label>
      `;
    }).join('');

    // Add click handlers only if not locked
    if (!isLocked) {
      setTimeout(() => {
        document.querySelectorAll(`input[name="question_${question.id}"]:not([disabled])`).forEach(radio => {
          radio.addEventListener('change', (e) => {
            const selectedIndex = parseInt(e.target.value);
            this.processAnswer(question, selectedIndex);
            // Update visual selection immediately
            document.querySelectorAll(`label.narrative-option`).forEach(label => {
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
      }, 100);
    }

    const lockedNotice = isLocked ? '<div style="margin-top: 1rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); color: var(--muted); font-size: 0.9rem;"><strong>✓ Answered</strong> - This question has been answered and is locked.</div>' : '';

    return `
      <div class="question-card" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
        <h3 style="color: var(--brand); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; line-height: 1.5;">${question.question}</h3>
        <div class="narrative-container">
          ${vignettesHTML}
        </div>
        ${lockedNotice}
      </div>
    `;
  }

  processAnswer(question, answerValue) {
    this.answers[question.id] = {
      questionId: question.id,
      value: answerValue,
      selectedIndex: answerValue,
      timestamp: new Date().toISOString()
    };

    // Score based on phase
    if (this.currentPhase === 1) {
      this.scorePhase1Answer(question, answerValue);
    } else if (this.currentPhase === 2) {
      this.scorePhase2Answer(question, answerValue);
    } else if (this.currentPhase === 3) {
      this.scorePhase3Answer(question, answerValue);
    } else if (this.currentPhase === 4) {
      this.scorePhase4Answer(question, answerValue);
    }

    this.saveProgress();
  }

  scorePhase1Answer(question, selectedIndex) {
    // Phase 1: 50% weight
    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) return;

    selectedOption.archetypes.forEach(archId => {
      // Map to gender-specific archetype if gender is selected
      let targetArchId = archId;
      if (this.gender === 'female') {
        const femaleMapping = {
          'alpha': 'alpha_female',
          'alpha_xi': 'alpha_xi_female',
          'alpha_rho': 'alpha_xi_female', // Alpha-Rho doesn't exist for female
          'dark_alpha': 'dark_alpha_female',
          'beta': 'beta_female',
          'beta_iota': 'alpha_unicorn_female',
          'beta_nu': 'beta_nu_female',
          'beta_manipulator': 'beta_manipulator_female',
          'beta_kappa': 'beta_kappa_female',
          'gamma': 'gamma_female',
          'gamma_theta': 'gamma_theta_female',
          'dark_gamma': 'dark_gamma_female',
          'delta': 'delta_female',
          'delta_mu': 'delta_mu_female',
          'dark_delta': 'dark_delta_female',
          'sigma': 'sigma_female',
          'dark_sigma_zeta': 'dark_sigma_zeta_female',
          'omega': 'omega_female',
          'dark_omega': 'dark_omega_female',
          'phi': 'phi_female'
        };
        targetArchId = femaleMapping[archId] || archId;
      }
      
      // Initialize score if needed
      if (!this.archetypeScores[targetArchId]) {
        this.archetypeScores[targetArchId] = {
          phase1: 0,
          phase2: 0,
          phase3: 0,
          phase4: 0,
          total: 0,
          weighted: 0
        };
      }
      
      const weight = selectedOption.weight || 1;
      this.archetypeScores[targetArchId].phase1 += weight * 3; // Phase 1 gets 3x multiplier
    });
  }

  scorePhase2Answer(question, value) {
    // Phase 2: 30% weight
    // Likert scale: 1-5, convert to -2 to +2 for scoring
    const normalizedValue = value - 3; // -2 to +2
    
    question.archetypes.forEach(arch => {
      const weight = arch.weight || 1;
      this.archetypeScores[arch.id].phase2 += normalizedValue * weight * 2; // Phase 2 gets 2x multiplier
    });
  }

  scorePhase3Answer(question, selectedIndex) {
    // Phase 3: 15% weight
    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) return;

    selectedOption.archetypes.forEach(archId => {
      // Map to gender-specific archetype if gender is selected
      let targetArchId = archId;
      if (this.gender === 'female') {
        const femaleMapping = {
          'alpha': 'alpha_female',
          'alpha_xi': 'alpha_xi_female',
          'alpha_rho': 'alpha_xi_female',
          'dark_alpha': 'dark_alpha_female',
          'beta': 'beta_female',
          'beta_iota': 'alpha_unicorn_female',
          'beta_nu': 'beta_nu_female',
          'beta_manipulator': 'beta_manipulator_female',
          'beta_kappa': 'beta_kappa_female',
          'gamma': 'gamma_female',
          'gamma_theta': 'gamma_theta_female',
          'dark_gamma': 'dark_gamma_female',
          'delta': 'delta_female',
          'delta_mu': 'delta_mu_female',
          'dark_delta': 'dark_delta_female',
          'sigma': 'sigma_female',
          'dark_sigma_zeta': 'dark_sigma_zeta_female',
          'omega': 'omega_female',
          'dark_omega': 'dark_omega_female',
          'phi': 'phi_female'
        };
        targetArchId = femaleMapping[archId] || archId;
      }
      
      // Initialize score if needed
      if (!this.archetypeScores[targetArchId]) {
        this.archetypeScores[targetArchId] = {
          phase1: 0,
          phase2: 0,
          phase3: 0,
          phase4: 0,
          total: 0,
          weighted: 0
        };
      }
      
      const weight = selectedOption.weight || 1;
      this.archetypeScores[targetArchId].phase3 += weight * 1; // Phase 3 gets 1x multiplier
    });
  }

  scorePhase4Answer(question, selectedIndex) {
    // Phase 4: 5% weight (validation)
    const selectedVignette = question.vignettes[selectedIndex];
    if (!selectedVignette) return;

    selectedVignette.archetypes.forEach(archId => {
      const weight = selectedVignette.weight || 1;
      this.archetypeScores[archId].phase4 += weight * 0.5; // Phase 4 gets 0.5x multiplier
    });
  }

  calculateFinalScores() {
    // Apply phase weights: Phase 1 (50%), Phase 2 (30%), Phase 3 (15%), Phase 4 (5%)
    Object.keys(this.archetypeScores).forEach(archId => {
      const scores = this.archetypeScores[archId];
      scores.total = scores.phase1 + scores.phase2 + scores.phase3 + scores.phase4;
      scores.weighted = (scores.phase1 * 0.5) + (scores.phase2 * 0.3) + (scores.phase3 * 0.15) + (scores.phase4 * 0.05);
    });
  }

  identifyArchetypes() {
    this.calculateFinalScores();

    // Map gender-neutral archetype IDs to gender-specific ones
    const genderMapping = {
      'alpha': this.gender === 'female' ? 'alpha_female' : 'alpha',
      'alpha_xi': this.gender === 'female' ? 'alpha_xi_female' : 'alpha_xi',
      'alpha_rho': this.gender === 'female' ? 'alpha_rho' : 'alpha_rho', // Alpha-Rho is male-specific
      'dark_alpha': this.gender === 'female' ? 'dark_alpha_female' : 'dark_alpha',
      'beta': this.gender === 'female' ? 'beta_female' : 'beta',
      'beta_iota': this.gender === 'female' ? 'alpha_unicorn_female' : 'beta_iota', // Alpha-Unicorn maps to Beta-Iota pattern
      'beta_nu': this.gender === 'female' ? 'beta_nu_female' : 'beta_nu',
      'beta_manipulator': this.gender === 'female' ? 'beta_manipulator_female' : 'beta_manipulator',
      'beta_kappa': this.gender === 'female' ? 'beta_kappa_female' : 'beta_kappa',
      'gamma': this.gender === 'female' ? 'gamma_female' : 'gamma',
      'gamma_theta': this.gender === 'female' ? 'gamma_theta_female' : 'gamma_theta',
      'dark_gamma': this.gender === 'female' ? 'dark_gamma_female' : 'dark_gamma',
      'delta': this.gender === 'female' ? 'delta_female' : 'delta',
      'delta_mu': this.gender === 'female' ? 'delta_mu_female' : 'delta_mu',
      'dark_delta': this.gender === 'female' ? 'dark_delta_female' : 'dark_delta',
      'sigma': this.gender === 'female' ? 'sigma_female' : 'sigma',
      'dark_sigma_zeta': this.gender === 'female' ? 'dark_sigma_zeta_female' : 'dark_sigma_zeta',
      'omega': this.gender === 'female' ? 'omega_female' : 'omega',
      'dark_omega': this.gender === 'female' ? 'dark_omega_female' : 'dark_omega',
      'phi': this.gender === 'female' ? 'phi_female' : 'phi'
    };

    // Get all archetypes sorted by weighted score, mapping to gender-specific IDs
    const sortedArchetypes = Object.keys(this.archetypeScores)
      .map(archId => {
        const genderSpecificId = genderMapping[archId] || archId;
        const archetype = ARCHETYPES[genderSpecificId] || ARCHETYPES[archId];
        if (!archetype) return null;
        return {
          id: genderSpecificId,
          ...archetype,
          score: this.archetypeScores[archId].weighted,
          totalScore: this.archetypeScores[archId].total
        };
      })
      .filter(arch => arch !== null)
      .sort((a, b) => b.score - a.score);

    // Primary archetype (highest score)
    const primary = sortedArchetypes[0];
    
    // Secondary archetype (next highest, must be >25% of primary)
    const secondary = sortedArchetypes[1] && sortedArchetypes[1].score > (primary.score * 0.25) 
      ? sortedArchetypes[1] 
      : null;

    // Tertiary archetype (next highest, must be >15% of primary)
    const tertiary = sortedArchetypes[2] && sortedArchetypes[2].score > (primary.score * 0.15)
      ? sortedArchetypes[2]
      : null;

    // Calculate confidence levels
    const totalScore = sortedArchetypes.reduce((sum, arch) => sum + arch.score, 0);
    const primaryConfidence = totalScore > 0 ? (primary.score / totalScore) * 100 : 0;
    const secondaryConfidence = secondary && totalScore > 0 ? (secondary.score / totalScore) * 100 : 0;
    const tertiaryConfidence = tertiary && totalScore > 0 ? (tertiary.score / totalScore) * 100 : 0;

    this.analysisData.primaryArchetype = {
      ...primary,
      confidence: primaryConfidence
    };
    this.analysisData.secondaryArchetype = secondary ? {
      ...secondary,
      confidence: secondaryConfidence
    } : null;
    this.analysisData.tertiaryArchetype = tertiary ? {
      ...tertiary,
      confidence: tertiaryConfidence
    } : null;
    this.analysisData.confidenceLevels = {
      primary: primaryConfidence,
      secondary: secondaryConfidence,
      tertiary: tertiaryConfidence
    };
  }

  nextQuestion() {
    // Check if current question has been answered
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (currentQuestion && !this.answers[currentQuestion.id]) {
      alert('Please select an answer before proceeding.');
      return;
    }

    if (this.currentQuestionIndex < this.questionSequence.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else {
      // End of current phase
      this.completePhase();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  completePhase() {
    if (this.currentPhase === 1) {
      this.analyzePhase1Results();
      this.buildPhase2Sequence();
      this.renderCurrentQuestion();
    } else if (this.currentPhase === 2) {
      this.analyzePhase2Results();
      this.buildPhase3Sequence();
      this.renderCurrentQuestion();
    } else if (this.currentPhase === 3) {
      this.analyzePhase3Results();
      this.buildPhase4Sequence();
      this.renderCurrentQuestion();
    } else if (this.currentPhase === 4) {
      this.finalizeResults();
    }
  }

  analyzePhase1Results() {
    this.analysisData.phase1Results = {
      coreGroupScores: this.calculateCoreGroupScores(),
      timestamp: new Date().toISOString()
    };
  }

  analyzePhase2Results() {
    this.analysisData.phase2Results = {
      subtypeScores: this.getTopSubtypes(5),
      timestamp: new Date().toISOString()
    };
  }

  analyzePhase3Results() {
    this.analysisData.phase3Results = {
      shadowIndicators: this.identifyShadowPatterns(),
      aspirationalTraits: this.identifyAspirationalTraits(),
      timestamp: new Date().toISOString()
    };
  }

  calculateCoreGroupScores() {
    const groupScores = {};
    Object.keys(CORE_GROUPS).forEach(groupId => {
      groupScores[groupId] = CORE_GROUPS[groupId].reduce((sum, archId) => {
        return sum + (this.archetypeScores[archId]?.phase1 || 0);
      }, 0);
    });
    return groupScores;
  }

  getTopSubtypes(count) {
    return Object.keys(this.archetypeScores)
      .map(archId => ({
        id: archId,
        name: ARCHETYPES[archId]?.name,
        score: this.archetypeScores[archId].phase2
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  identifyShadowPatterns() {
    return Object.keys(this.archetypeScores)
      .filter(archId => ARCHETYPES[archId]?.isShadow)
      .map(archId => ({
        id: archId,
        name: ARCHETYPES[archId].name,
        score: this.archetypeScores[archId].phase3
      }))
      .filter(arch => arch.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  identifyAspirationalTraits() {
    // Look for answers marked as aspirational in Phase 3
    const aspirationalArchetypes = [];
    PHASE_3_QUESTIONS.forEach(q => {
      if (q.options) {
        q.options.forEach((opt, idx) => {
          if (opt.isAspirational && this.answers[q.id]?.selectedIndex === idx) {
            opt.archetypes.forEach(archId => {
              if (!aspirationalArchetypes.find(a => a.id === archId)) {
                aspirationalArchetypes.push({
                  id: archId,
                  name: ARCHETYPES[archId]?.name,
                  description: ARCHETYPES[archId]?.growthEdge
                });
              }
            });
          }
        });
      }
    });
    return aspirationalArchetypes;
  }

  finalizeResults() {
    this.identifyArchetypes();
    this.analysisData.allAnswers = this.answers;
    this.analysisData.questionSequence = this.questionSequence.map(q => q.id);
    this.renderResults();
    this.saveProgress();
  }

  renderResults() {
    const container = document.getElementById('resultsContent');
    if (!container) {
      // Fallback to questionContainer if resultsContent doesn't exist
      const fallbackContainer = document.getElementById('questionContainer');
      if (fallbackContainer) {
        fallbackContainer.innerHTML = '';
        return this.renderResultsToContainer(fallbackContainer);
      }
      return;
    }
    return this.renderResultsToContainer(container);
  }

  renderResultsToContainer(container) {

    const primary = this.analysisData.primaryArchetype;
    const secondary = this.analysisData.secondaryArchetype;
    const tertiary = this.analysisData.tertiaryArchetype;

    let resultsHTML = `
      <div class="results-container" style="max-width: 900px; margin: 0 auto;">
        <h2 style="color: var(--brand); text-align: center; margin-bottom: 2rem;">Your Archetype Profile</h2>
        
        <div style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem;">
          <p style="margin: 0; color: var(--muted); line-height: 1.7; font-size: 0.95rem;">
            <strong style="color: var(--brand);">Important:</strong> This is a descriptive tool, not a diagnostic or predictive instrument. 
            Archetypes are fluid; people contain multitudes. No archetype is superior to another. 
            Results reflect current patterns, not fixed identity.
          </p>
        </div>

        <!-- Primary Archetype -->
        <div class="archetype-card primary" style="background: rgba(255, 255, 255, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border: 2px solid var(--brand);">
          <h3 style="color: var(--brand); margin-top: 0; font-size: 1.5rem;">Primary Archetype: ${primary.name}</h3>
          <p style="color: var(--muted); margin: 0.5rem 0; font-size: 1.1rem;"><strong>Confidence:</strong> ${primary.confidence.toFixed(1)}%</p>
          ${primary.explanation ? `<div style="background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin: 1rem 0;"><p style="margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.6; font-style: italic;">${primary.explanation}</p></div>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;"><strong>Social Role:</strong> ${primary.socialRole}</p>
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;">${primary.description}</p>
          
          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Key Characteristics:</h4>
            <ul style="color: var(--muted); line-height: 1.8;">
              ${primary.behavioralTraits.map(trait => `<li>${trait.charAt(0).toUpperCase() + trait.slice(1)}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Core Motivations:</h4>
            <ul style="color: var(--muted); line-height: 1.8;">
              ${primary.motivations.map(mot => `<li>${mot.charAt(0).toUpperCase() + mot.slice(1)}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Stress Response:</h4>
            <p style="color: var(--muted); line-height: 1.7;">${primary.stressResponse}</p>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">Growth Edge:</h4>
            <p style="color: var(--muted); line-height: 1.7;">${primary.growthEdge}</p>
          </div>

          ${primary.jungianEquivalent || primary.vedicEquivalent || primary.greekPantheon || primary.tarotCard ? `
          <div style="margin-top: 1.5rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.75rem;">Cross-Paradigm Equivalents:</h4>
            <div style="color: var(--muted); line-height: 1.8; font-size: 0.9rem;">
              ${primary.jungianEquivalent ? `<p style="margin: 0.5rem 0;"><strong>Jungian/Q-KWML:</strong> ${primary.jungianEquivalent}</p>` : ''}
              ${primary.vedicEquivalent ? `<p style="margin: 0.5rem 0;"><strong>Vedic:</strong> ${primary.vedicEquivalent}</p>` : ''}
              ${primary.greekPantheon ? `<p style="margin: 0.5rem 0;"><strong>Greek Pantheon:</strong> ${primary.greekPantheon}</p>` : ''}
              ${primary.tarotCard ? `<p style="margin: 0.5rem 0;"><strong>Tarot Card:</strong> ${primary.tarotCard}</p>` : ''}
            </div>
            <p style="color: var(--muted); font-size: 0.85rem; font-style: italic; margin-top: 0.75rem; margin-bottom: 0;">
              These equivalents help translate this archetype across different psychological and mythological frameworks.
            </p>
          </div>
          ` : ''}
        </div>
    `;

      // Secondary Archetype
    if (secondary) {
      resultsHTML += `
        <div class="archetype-card secondary" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Secondary Influence: ${secondary.name}</h3>
          <p style="color: var(--muted); margin: 0.5rem 0;"><strong>Confidence:</strong> ${secondary.confidence.toFixed(1)}%</p>
          ${secondary.explanation ? `<div style="background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin: 1rem 0;"><p style="margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.6; font-style: italic;">${secondary.explanation}</p></div>` : ''}
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;"><strong>Social Role:</strong> ${secondary.socialRole}</p>
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;">${secondary.description}</p>
          <p style="color: var(--muted); margin-top: 1rem; font-style: italic; font-size: 0.9rem;">
            This archetype influences you in specific contexts or situations, complementing your primary archetype.
          </p>
        </div>
      `;
    }

    // Tertiary Archetype
    if (tertiary) {
      resultsHTML += `
        <div class="archetype-card tertiary" style="background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem;">
          <h3 style="color: var(--brand); margin-top: 0;">Tertiary Influence: ${tertiary.name}</h3>
          <p style="color: var(--muted); margin: 0.5rem 0;"><strong>Confidence:</strong> ${tertiary.confidence.toFixed(1)}%</p>
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;"><strong>Social Role:</strong> ${tertiary.socialRole}</p>
          <p style="color: var(--muted); margin: 1rem 0; line-height: 1.7;">${tertiary.description}</p>
          <p style="color: var(--muted); margin-top: 1rem; font-style: italic; font-size: 0.9rem;">
            This archetype may emerge under stress, represent aspirational qualities, or appear in specific life domains.
          </p>
        </div>
      `;
    }

    // Shadow Patterns
    const shadowPatterns = this.analysisData.phase3Results?.shadowIndicators || [];
    if (shadowPatterns.length > 0) {
      resultsHTML += `
        <div class="shadow-section" style="background: rgba(255, 0, 0, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid #ff4444;">
          <h3 style="color: #ff4444; margin-top: 0;">Shadow Patterns</h3>
          <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">
            These patterns may emerge under stress or represent areas for healing and integration.
          </p>
          <ul style="color: var(--muted); line-height: 1.8;">
            ${shadowPatterns.map(shadow => `<li><strong>${shadow.name}:</strong> ${ARCHETYPES[shadow.id]?.description}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Aspirational Traits
    const aspirational = this.analysisData.phase3Results?.aspirationalTraits || [];
    if (aspirational.length > 0) {
      resultsHTML += `
        <div class="aspirational-section" style="background: rgba(0, 255, 0, 0.1); padding: 2rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid #44ff44;">
          <h3 style="color: #44ff44; margin-top: 0;">Developmental Opportunities</h3>
          <p style="color: var(--muted); line-height: 1.7; margin-bottom: 1rem;">
            Areas you identified as aspirational - qualities you'd like to develop further.
          </p>
          <ul style="color: var(--muted); line-height: 1.8;">
            ${aspirational.map(asp => `<li><strong>${asp.name}:</strong> ${asp.description}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    resultsHTML += `</div>`;

    container.innerHTML = resultsHTML;
    this.showResultsContainer();
  }

  updateNavigation() {
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    const questionCounter = document.getElementById('questionCounter');
    if (questionCounter) {
      questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length} (Phase ${this.currentPhase})`;
    }

    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      prevBtn.style.display = this.currentQuestionIndex > 0 ? 'inline-block' : 'none';
    }
  }

  showQuestionContainer() {
    const questionContainer = document.getElementById('questionContainer');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const introSection = document.querySelector('.intro-section');
    
    if (questionContainer) questionContainer.style.display = 'block';
    if (questionnaireSection) questionnaireSection.classList.add('active');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
      resultsContainer.classList.remove('active');
    }
    if (introSection) introSection.style.display = 'none';
  }

  showResultsContainer() {
    const questionContainer = document.getElementById('questionContainer');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const introSection = document.querySelector('.intro-section');
    
    if (questionContainer) questionContainer.style.display = 'none';
    if (questionnaireSection) questionnaireSection.classList.remove('active');
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.classList.add('active');
    }
    if (introSection) introSection.style.display = 'none';
  }

  saveProgress() {
    const progress = {
      currentPhase: this.currentPhase,
      currentQuestionIndex: this.currentQuestionIndex,
      gender: this.gender,
      answers: this.answers,
      archetypeScores: this.archetypeScores,
      analysisData: this.analysisData
    };
    sessionStorage.setItem('archetypeAssessmentProgress', JSON.stringify(progress));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('archetypeAssessmentProgress');
    if (stored) {
      try {
        const progress = JSON.parse(stored);
        this.currentPhase = progress.currentPhase || 0;
        this.currentQuestionIndex = progress.currentQuestionIndex || 0;
        this.gender = progress.gender || null;
        this.answers = progress.answers || {};
        this.archetypeScores = progress.archetypeScores || {};
        this.analysisData = progress.analysisData || this.analysisData;
        
        // If gender not selected, show gender selection
        if (!this.gender || this.currentPhase === 0) {
          this.showGenderSelection();
          return;
        }
        
        // Rebuild question sequence based on phase
        if (this.currentPhase === 1) {
          this.buildPhase1Sequence();
        } else if (this.currentPhase === 2) {
          this.buildPhase2Sequence();
        } else if (this.currentPhase === 3) {
          this.buildPhase3Sequence();
        } else if (this.currentPhase === 4) {
          this.buildPhase4Sequence();
        }

        // If assessment is in progress, show question container
        if (this.currentPhase <= 4 && this.questionSequence.length > 0) {
          this.renderCurrentQuestion();
          this.showQuestionContainer();
        } else if (this.analysisData.primaryArchetype) {
          this.renderResults();
          this.showResultsContainer();
        }
      } catch (e) {
        console.error('Error loading stored progress:', e);
      }
    }
  }

  resetAssessment() {
    sessionStorage.removeItem('archetypeAssessmentProgress');
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.initializeScores();
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      primaryArchetype: null,
      secondaryArchetype: null,
      tertiaryArchetype: null,
      confidenceLevels: {},
      allAnswers: {},
      questionSequence: []
    };
    
    const questionContainer = document.getElementById('questionContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const introSection = document.querySelector('.intro-section');
    
    if (questionContainer) {
      questionContainer.style.display = 'none';
      questionContainer.innerHTML = '';
    }
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (introSection) introSection.style.display = 'block';
  }

  exportAnalysis(format) {
    if (!this.analysisData.primaryArchetype) {
      alert('Please complete the assessment before exporting.');
      return;
    }

    if (format === 'json') {
      exportJSON(this.analysisData, 'archetype-analysis');
    } else if (format === 'csv') {
      // Create CSV export
      const csvRows = [];
      csvRows.push(['Archetype Analysis Results']);
      csvRows.push(['Timestamp', this.analysisData.timestamp]);
      csvRows.push([]);
      csvRows.push(['Primary Archetype', this.analysisData.primaryArchetype.name, `Confidence: ${this.analysisData.primaryArchetype.confidence.toFixed(1)}%`]);
      if (this.analysisData.secondaryArchetype) {
        csvRows.push(['Secondary Archetype', this.analysisData.secondaryArchetype.name, `Confidence: ${this.analysisData.secondaryArchetype.confidence.toFixed(1)}%`]);
      }
      if (this.analysisData.tertiaryArchetype) {
        csvRows.push(['Tertiary Archetype', this.analysisData.tertiaryArchetype.name, `Confidence: ${this.analysisData.tertiaryArchetype.confidence.toFixed(1)}%`]);
      }
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      downloadFile(csvContent, 'archetype-analysis.csv', 'text/csv');
    }
  }
}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.archetypeEngine = new ArchetypeEngine();
  });
} else {
  // DOM already ready, but wait a tick to ensure all elements are available
  setTimeout(() => {
    window.archetypeEngine = new ArchetypeEngine();
  }, 0);
}

