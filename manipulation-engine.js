// Manipulation Engine
// Identifies manipulation vectors through symptom, effect, and consequence analysis

import { MANIPULATION_VECTORS } from './manipulation-data/manipulation-vectors.js';
import { MANIPULATION_TACTICS } from './manipulation-data/manipulation-tactics.js';
import { SYMPTOM_QUESTIONS } from './manipulation-data/symptom-questions.js';
import { EFFECT_QUESTIONS } from './manipulation-data/effect-questions.js';
import { CONSEQUENCE_QUESTIONS } from './manipulation-data/consequence-questions.js';
import { VECTOR_MAPPING } from './manipulation-data/vector-mapping.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class ManipulationEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.decompressionShown = false;
    this.symptomQuestionEndIndex = 0;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      symptoms: {},
      effects: {},
      consequences: {},
      vectorScores: {},
      identifiedVectors: [],
      primaryVector: null,
      supportingVectors: [],
      tactics: [],
      structuralModifier: null
    };
    
    this.init();
  }

  init() {
    this.buildQuestionSequence();
    this.attachEventListeners();
    this.loadStoredData();
    this.startAssessment();
  }

  buildQuestionSequence() {
    this.questionSequence = [];
    
    // Add symptom questions (will be randomized within subcategories)
    Object.keys(SYMPTOM_QUESTIONS).forEach(category => {
      const categoryQuestions = [...SYMPTOM_QUESTIONS[category]];
      // Randomize within subcategory to reduce pattern priming
      categoryQuestions.sort(() => Math.random() - 0.5);
      categoryQuestions.forEach(question => {
        this.questionSequence.push({
          ...question,
          category: 'symptom',
          subcategory: category
        });
      });
    });
    
    // Add effect questions (randomized within subcategories)
    Object.keys(EFFECT_QUESTIONS).forEach(category => {
      const categoryQuestions = [...EFFECT_QUESTIONS[category]];
      categoryQuestions.sort(() => Math.random() - 0.5);
      categoryQuestions.forEach(question => {
        this.questionSequence.push({
          ...question,
          category: 'effect',
          subcategory: category
        });
      });
    });
    
    // Add consequence questions (randomized within subcategories)
    Object.keys(CONSEQUENCE_QUESTIONS).forEach(category => {
      const categoryQuestions = [...CONSEQUENCE_QUESTIONS[category]];
      categoryQuestions.sort(() => Math.random() - 0.5);
      categoryQuestions.forEach(question => {
        this.questionSequence.push({
          ...question,
          category: 'consequence',
          subcategory: category
        });
      });
    });
    
    // Track where symptom questions end for decompression checkpoint
    this.symptomQuestionEndIndex = this.questionSequence.filter(q => q.category === 'symptom').length;
  }

  attachEventListeners() {
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
    
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
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
    document.getElementById('questionnaireSection').classList.add('active');
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completeAssessment();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    
    // Check if we just finished symptom questions - show decompression checkpoint
    // This happens when we encounter the first effect question after symptom questions
    if (question.category === 'effect' && !this.decompressionShown) {
      // Count how many symptom questions there are
      const symptomCount = this.questionSequence.filter(q => q.category === 'symptom').length;
      // If we're at the index right after all symptom questions, show decompression
      if (this.currentQuestionIndex === symptomCount) {
        this.showDecompressionCheckpoint();
        return;
      }
    }
    this.renderQuestionContent(question);
  }
  
  renderQuestionContent(question) {
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    let categoryLabel = '';
    if (question.category === 'symptom') {
      categoryLabel = `Symptom: ${question.subcategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    } else if (question.category === 'effect') {
      categoryLabel = `Effect: ${question.subcategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    } else if (question.category === 'consequence') {
      categoryLabel = `Consequence: ${question.subcategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    
    container.innerHTML = `
      <div class="question-block">
        ${categoryLabel ? `<p style="color: var(--muted); margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">${categoryLabel}</p>` : ''}
        <h3>${question.question}</h3>
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" 
                   id="questionInput" 
                   min="0" 
                   max="10" 
                   step="1" 
                   value="${this.answers[question.id] || 5}"
                   data-question-id="${question.id}">
          </div>
          <div class="scale-value" id="scaleValue">${this.answers[question.id] || 5}</div>
        </div>
        <div class="scale-labels">
          <span>Very Low / Minimal / Weak / Rare / Never (0-2)</span>
          <span>Moderate / Somewhat / Average / Sometimes (5-6)</span>
          <span>Very High / Strong / Potent / Frequent / Always (9-10)</span>
        </div>
        <div style="margin-top: 0.5rem; padding: 0.75rem; background: rgba(211, 47, 47, 0.1); border-radius: var(--radius); font-size: 0.9rem; color: var(--muted); line-height: 1.5;">
          <strong>Tip:</strong> Higher scores indicate stronger presence of this pattern. Be honest about your experience.
        </div>
      </div>
    `;
    
    // Attach slider event listener
    const slider = document.getElementById('questionInput');
    const valueDisplay = document.getElementById('scaleValue');
    
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        valueDisplay.textContent = value;
        this.answers[question.id] = value;
        this.saveProgress();
      });
      
      // Set initial value if exists
      if (this.answers[question.id] !== undefined) {
        slider.value = this.answers[question.id];
        valueDisplay.textContent = this.answers[question.id];
      }
    }
    
    this.updateProgress();
    this.updateNavigationButtons();
  }

  updateProgress() {
    const progress = this.questionSequence.length > 0 
      ? ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100 
      : 0;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.textContent = this.currentQuestionIndex === this.questionSequence.length - 1 
        ? 'Complete' 
        : 'Next';
    }
  }

  nextQuestion() {
    // Save current answer
    const slider = document.getElementById('questionInput');
    if (slider) {
      const questionId = slider.dataset.questionId;
      this.answers[questionId] = parseInt(slider.value);
    }
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      this.completeAssessment();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      // Save current answer before going back
      const slider = document.getElementById('questionInput');
      if (slider) {
        const questionId = slider.dataset.questionId;
        this.answers[questionId] = parseInt(slider.value);
      }
      
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  completeAssessment() {
    // Calculate vector scores
    this.calculateVectorScores();
    
    // Identify manipulation vectors
    this.identifyVectors();
    
    // Find relevant tactics
    this.identifyTactics();
    
    // Include all raw answers and question sequence for AI agent export
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question || q.text,
      category: q.category,
      subcategory: q.subcategory,
      type: q.type,
      weight: q.weight
    }));
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  calculateVectorScores() {
    // Calculate scores for each manipulation vector
    Object.keys(MANIPULATION_VECTORS).forEach(vectorKey => {
      const vector = MANIPULATION_VECTORS[vectorKey];
      const mapping = VECTOR_MAPPING[vectorKey];
      
      let totalScore = 0;
      let questionCount = 0;
      let totalPossibleQuestions = 0;
      
      // Check symptom questions
      mapping.symptoms.forEach(symptomId => {
        totalPossibleQuestions++;
        if (this.answers[symptomId] !== undefined) {
          const question = this.findQuestionById(symptomId);
          if (question) {
            totalScore += this.answers[symptomId] * question.weight;
            questionCount++;
          }
        }
      });
      
      // Check effect questions
      mapping.effects.forEach(effectId => {
        totalPossibleQuestions++;
        if (this.answers[effectId] !== undefined) {
          const question = this.findQuestionById(effectId);
          if (question) {
            totalScore += this.answers[effectId] * question.weight;
            questionCount++;
          }
        }
      });
      
      // Check consequence questions
      mapping.consequences.forEach(consequenceId => {
        totalPossibleQuestions++;
        if (this.answers[consequenceId] !== undefined) {
          const question = this.findQuestionById(consequenceId);
          if (question) {
            totalScore += this.answers[consequenceId] * question.weight;
            questionCount++;
          }
        }
      });
      
      const averageScore = questionCount > 0 ? totalScore / questionCount : 0;
      const weightedScore = averageScore * vector.weight;
      
      // Calculate confidence based on answered questions
      const answerRate = totalPossibleQuestions > 0 ? questionCount / totalPossibleQuestions : 0;
      let confidenceBand = 'medium';
      if (answerRate >= 0.9) {
        confidenceBand = 'high';
      } else if (answerRate < 0.7) {
        confidenceBand = 'low';
      }
      
      // Determine activation level
      const activationThreshold = mapping.threshold * 10;
      let activationLevel = 'low';
      if (weightedScore >= activationThreshold * 1.2) {
        activationLevel = 'high';
      } else if (weightedScore >= activationThreshold) {
        activationLevel = 'medium';
      }
      
      this.analysisData.vectorScores[vectorKey] = {
        name: vector.name,
        description: vector.description,
        rawScore: averageScore,
        weightedScore: weightedScore,
        questionCount: questionCount,
        totalPossibleQuestions: totalPossibleQuestions,
        answerRate: answerRate,
        confidenceBand: confidenceBand,
        activationLevel: activationLevel,
        threshold: mapping.threshold,
        activationThreshold: activationThreshold
      };
    });
  }

  findQuestionById(id) {
    return this.questionSequence.find(q => q.id === id);
  }

  identifyVectors() {
    // Identify vectors that reach activation level
    const allVectors = Object.entries(this.analysisData.vectorScores)
      .map(([key, data]) => ({ key, ...data }))
      .filter(vector => vector.weightedScore >= (vector.threshold * 10))
      .sort((a, b) => b.weightedScore - a.weightedScore);
    
    // Designate primary vector (highest score)
    if (allVectors.length > 0) {
      this.analysisData.primaryVector = allVectors[0];
      this.analysisData.supportingVectors = allVectors.slice(1);
    }
    
    // Keep identifiedVectors for backward compatibility
    this.analysisData.identifiedVectors = allVectors;
    
    // Determine Situational vs Structural modifier
    this.determineStructuralModifier();
  }
  
  determineStructuralModifier() {
    if (!this.analysisData.primaryVector) return;
    
    // Calculate average consequence and effect scores
    let totalConsequenceScore = 0;
    let totalEffectScore = 0;
    let consequenceCount = 0;
    let effectCount = 0;
    
    this.questionSequence.forEach(q => {
      if (q.category === 'consequence' && this.answers[q.id] !== undefined) {
        totalConsequenceScore += this.answers[q.id];
        consequenceCount++;
      }
      if (q.category === 'effect' && this.answers[q.id] !== undefined) {
        totalEffectScore += this.answers[q.id];
        effectCount++;
      }
    });
    
    const avgConsequence = consequenceCount > 0 ? totalConsequenceScore / consequenceCount : 0;
    const avgEffect = effectCount > 0 ? totalEffectScore / effectCount : 0;
    const avgSymptom = this.getAverageSymptomScore();
    
    // High consequences + high effects = structural
    // High symptoms + low consequences = situational
    if (avgConsequence >= 6 && avgEffect >= 6) {
      this.analysisData.structuralModifier = 'structural';
    } else if (avgSymptom >= 6 && avgConsequence < 5) {
      this.analysisData.structuralModifier = 'situational';
    } else {
      this.analysisData.structuralModifier = 'mixed';
    }
  }
  
  getAverageSymptomScore() {
    let total = 0;
    let count = 0;
    this.questionSequence.forEach(q => {
      if (q.category === 'symptom' && this.answers[q.id] !== undefined) {
        total += this.answers[q.id];
        count++;
      }
    });
    return count > 0 ? total / count : 0;
  }
  
  showDecompressionCheckpoint() {
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    this.decompressionShown = true;
    
    container.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); box-shadow: var(--shadow);">
        <h3 style="color: var(--brand); margin-bottom: 1.5rem; font-size: 1.5rem;">You're mapping experiences, not assigning blame.</h3>
        <p style="color: var(--muted); line-height: 1.7; margin-bottom: 2rem; font-size: 1.05rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          You've completed the symptom questions. Remember: this analysis identifies patterns consistent with manipulation vectors. It does not determine intent or assign blame. Continue when ready.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" id="continueFromDecompression" style="min-width: 150px;">Continue Assessment</button>
          <button class="btn btn-secondary" id="pauseFromDecompression" style="min-width: 150px;">Pause</button>
        </div>
      </div>
    `;
    
    const continueBtn = document.getElementById('continueFromDecompression');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        // Mark as shown and render the actual question
        this.decompressionShown = true;
        const question = this.questionSequence[this.currentQuestionIndex];
        this.renderQuestionContent(question);
        this.updateProgress();
        this.updateNavigationButtons();
      });
    }
    
    document.getElementById('pauseFromDecompression').addEventListener('click', () => {
      // Just stay on this screen - user can continue when ready
    });
  }

  identifyTactics() {
    // Find relevant tactics for identified vectors
    this.analysisData.tactics = [];
    
    this.analysisData.identifiedVectors.forEach(vector => {
      const tactics = Object.values(MANIPULATION_TACTICS).filter(
        tactic => tactic.vector === vector.key
      );
      this.analysisData.tactics.push(...tactics);
    });
  }

  renderResults() {
    const container = document.getElementById('vectorResults');
    if (!container) return;
    
    let html = '';
    
    if (this.analysisData.identifiedVectors.length === 0) {
      html = `
        <div style="padding: 2rem; text-align: center;">
          <h3 style="color: var(--brand); margin-bottom: 1rem;">No Strong Manipulation Patterns Detected</h3>
          <p style="color: var(--muted);">Based on your responses, no manipulation vectors reached activation level. This may indicate:</p>
          <ul style="text-align: left; max-width: 600px; margin: 1rem auto;">
            <li>Patterns consistent with healthy and respectful relationships</li>
            <li>Manipulation patterns are subtle and require deeper analysis</li>
            <li>You may need to review specific situations more carefully</li>
          </ul>
        </div>
      `;
    } else {
      // Overlap warning
      html = `
        <div style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--accent); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.5rem;">
          <p style="margin: 0; font-size: 0.95rem; line-height: 1.7; color: var(--muted);"><strong style="color: var(--accent);">Note:</strong> Vectors frequently co-occur. Overlap increases intensity, not certainty. These are patterns consistent with manipulation vectors—not discrete perpetrators.</p>
        </div>
      `;
      
      // Primary Vector
      if (this.analysisData.primaryVector) {
        const vector = this.analysisData.primaryVector;
        const structuralLabel = this.analysisData.structuralModifier === 'structural' ? 'Structural Pattern' : 
                                this.analysisData.structuralModifier === 'situational' ? 'Situational Pattern' : 
                                'Mixed Pattern';
        
        html += `
          <div class="vector-result" style="border-left: 6px solid #d32f2f; background: rgba(211, 47, 47, 0.05);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
              <h3 style="margin: 0; color: #d32f2f;">Primary Vector: ${vector.name}</h3>
              <span style="background: #d32f2f; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${structuralLabel}</span>
            </div>
            <p style="color: var(--muted); margin-bottom: 1rem;">${vector.description}</p>
            <div style="display: flex; gap: 2rem; margin-bottom: 1rem; flex-wrap: wrap;">
              <div>
                <strong>Activation Level:</strong> <span style="text-transform: capitalize; color: ${vector.activationLevel === 'high' ? '#d32f2f' : vector.activationLevel === 'medium' ? 'var(--accent)' : 'var(--muted)'}; font-weight: 600;">${vector.activationLevel}</span>
              </div>
              <div>
                <strong>Confidence:</strong> <span style="text-transform: capitalize; color: ${vector.confidenceBand === 'high' ? 'var(--brand)' : vector.confidenceBand === 'medium' ? 'var(--accent)' : '#d32f2f'}; font-weight: 600;">${vector.confidenceBand}</span>
                ${vector.answerRate < 0.9 ? `<span style="font-size: 0.85rem; color: var(--muted); margin-left: 0.5rem;">(${Math.round(vector.answerRate * 100)}% answered)</span>` : ''}
              </div>
            </div>
            <p style="font-size: 0.9rem; color: var(--muted);"><strong>Score:</strong> ${vector.rawScore.toFixed(1)}/10 (Weighted: ${vector.weightedScore.toFixed(1)})</p>
            
            ${this.getWhatThisDoesNotImply(vector.key)}
            
            <p style="margin-top: 1.5rem; font-weight: 600; color: var(--brand);">Relevant Tactics (Top 5):</p>
        `;
        
        const relevantTactics = this.analysisData.tactics.filter(t => t.vector === vector.key);
        if (relevantTactics.length > 0) {
          relevantTactics.slice(0, 5).forEach(tactic => {
            html += `
              <div class="tactic-item">
                <strong>${tactic.name}</strong>${tactic.mode && tactic.phase ? ` (${tactic.mode} ${tactic.phase})` : ''}
                ${tactic.example ? `<p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--muted);"><em>${tactic.example}</em></p>` : ''}
                ${tactic.mechanism ? `<p style="margin-top: 0.5rem; font-size: 0.9rem;">${tactic.mechanism}</p>` : ''}
              </div>
            `;
          });
          if (relevantTactics.length > 5) {
            html += `<p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--muted); font-style: italic;">+ ${relevantTactics.length - 5} additional tactics identified (see export for full list)</p>`;
          }
        }
        
        html += '</div>';
      }
      
      // Supporting Vectors
      if (this.analysisData.supportingVectors.length > 0) {
        html += '<h3 style="color: var(--brand); margin-top: 2rem; margin-bottom: 1rem;">Supporting Vectors:</h3>';
        
        this.analysisData.supportingVectors.forEach(vector => {
          html += `
            <div class="vector-result">
              <h3>${vector.name}</h3>
              <p style="color: var(--muted); margin-bottom: 0.75rem;">${vector.description}</p>
              <div style="display: flex; gap: 2rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                <div>
                  <strong>Activation Level:</strong> <span style="text-transform: capitalize; color: ${vector.activationLevel === 'high' ? '#d32f2f' : vector.activationLevel === 'medium' ? 'var(--accent)' : 'var(--muted)'}; font-weight: 600;">${vector.activationLevel}</span>
                </div>
                <div>
                  <strong>Confidence:</strong> <span style="text-transform: capitalize; color: ${vector.confidenceBand === 'high' ? 'var(--brand)' : vector.confidenceBand === 'medium' ? 'var(--accent)' : '#d32f2f'}; font-weight: 600;">${vector.confidenceBand}</span>
                  ${vector.answerRate < 0.9 ? `<span style="font-size: 0.85rem; color: var(--muted); margin-left: 0.5rem;">(${Math.round(vector.answerRate * 100)}% answered)</span>` : ''}
                </div>
              </div>
              <p style="font-size: 0.9rem; color: var(--muted);"><strong>Score:</strong> ${vector.rawScore.toFixed(1)}/10 (Weighted: ${vector.weightedScore.toFixed(1)})</p>
            </div>
          `;
        });
      }
      
      // Stabilizing Closure
      html += this.getStabilizingClosure();
    }
    
    container.innerHTML = html;
  }
  
  getWhatThisDoesNotImply(vectorKey) {
    const notImplies = {
      fear: 'This pattern can appear without deliberate intent. Fear-based dynamics may emerge from unprocessed trauma or defensive patterns, not necessarily malicious manipulation.',
      dependency: 'Dependency patterns can develop organically in relationships. This does not imply the other person is intentionally creating dependency.',
      deception: 'Deception patterns may reflect the other person\'s own self-deception or distorted reality, not necessarily calculated manipulation.',
      obsession: 'Obsessive patterns can stem from attachment wounds or unmet needs, not necessarily deliberate control tactics.',
      adoration: 'Adoration patterns may reflect genuine but unhealthy idealization, not necessarily calculated manipulation.',
      sexual: 'Sexual patterns may reflect unprocessed trauma, cultural conditioning, or boundary confusion, not necessarily deliberate exploitation.'
    };
    
    const text = notImplies[vectorKey] || 'This pattern does not necessarily imply deliberate intent or malicious manipulation. Patterns can emerge from various sources including unprocessed trauma, cultural conditioning, or relational dynamics.';
    
    return `
      <div style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem; margin-bottom: 1rem;">
        <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--brand);">What this does NOT imply:</strong> ${text}</p>
      </div>
    `;
  }
  
  getStabilizingClosure() {
    return `
      <div style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); padding: 2rem; margin-top: 2.5rem; border: 2px solid var(--brand); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h3 style="color: var(--brand); margin-bottom: 1rem; text-align: center;">Orientation & Next Steps</h3>
        <div style="line-height: 1.8;">
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">1. What You Experienced</h4>
            <p style="color: var(--muted); margin: 0;">You've mapped patterns consistent with manipulation vectors. This analysis reflects your reported experiences and effects.</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">2. What Patterns Fit</h4>
            <p style="color: var(--muted); margin: 0;">The identified vectors show patterns consistent with your responses. Vectors frequently overlap and co-occur.</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">3. Where Your Leverage Is</h4>
            <p style="color: var(--muted); margin: 0;">Recognition is the first step. Your leverage comes from understanding these patterns and making conscious choices about boundaries, communication, and relationship dynamics.</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.5rem;">4. Where You Exit Analysis</h4>
            <p style="color: var(--muted); margin: 0;">This analysis is complete. You can export your results, start a new assessment, or return to the tools page. Use this knowledge to support your sovereignty, not to fuel hypervigilance.</p>
          </div>
          <div style="background: rgba(211, 47, 47, 0.1); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem; text-align: center;">
            <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--muted);"><strong style="color: #d32f2f;">Grounding Recommendation:</strong> Take time to integrate this information. Awareness without action can become analysis paralysis. Consider what specific, actionable steps you can take to protect your sovereignty.</p>
          </div>
        </div>
      </div>
    `;
  }

  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'manipulation', 'Manipulation Vector Identification');
      downloadFile(csv, `manipulation-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'manipulation', 'Manipulation Vector Identification');
      downloadFile(json, `manipulation-analysis-${Date.now()}.json`, 'application/json');
    }
  }

  saveProgress() {
    const progressData = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('manipulationProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('manipulationProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        
        // If in progress, restore questionnaire state
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex < this.questionSequence.length) {
          this.renderCurrentQuestion();
        } else if (this.currentQuestionIndex >= this.questionSequence.length) {
          // Assessment was completed, recalculate
          this.completeAssessment();
        }
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }
  }

  clearAllCachedData() {
    if (confirm('Are you sure you want to clear all cached data? This will clear all saved progress and you will need to start from the beginning.')) {
      sessionStorage.removeItem('manipulationProgress');
      this.resetAssessment();
      alert('All cached data has been cleared.');
    }
  }

  resetAssessment() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.decompressionShown = false;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      symptoms: {},
      effects: {},
      consequences: {},
      vectorScores: {},
      identifiedVectors: [],
      primaryVector: null,
      supportingVectors: [],
      tactics: [],
      structuralModifier: null
    };
    
    sessionStorage.removeItem('manipulationProgress');
    
    // Reset UI
    document.getElementById('questionnaireSection').classList.add('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.renderCurrentQuestion();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ManipulationEngine();
});

