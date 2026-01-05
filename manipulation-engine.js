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
    this.analysisData = {
      timestamp: new Date().toISOString(),
      symptoms: {},
      effects: {},
      consequences: {},
      vectorScores: {},
      identifiedVectors: [],
      tactics: []
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
    
    // Add symptom questions
    Object.keys(SYMPTOM_QUESTIONS).forEach(category => {
      SYMPTOM_QUESTIONS[category].forEach(question => {
        this.questionSequence.push({
          ...question,
          category: 'symptom',
          subcategory: category
        });
      });
    });
    
    // Add effect questions
    Object.keys(EFFECT_QUESTIONS).forEach(category => {
      EFFECT_QUESTIONS[category].forEach(question => {
        this.questionSequence.push({
          ...question,
          category: 'effect',
          subcategory: category
        });
      });
    });
    
    // Add consequence questions
    Object.keys(CONSEQUENCE_QUESTIONS).forEach(category => {
      CONSEQUENCE_QUESTIONS[category].forEach(question => {
        this.questionSequence.push({
          ...question,
          category: 'consequence',
          subcategory: category
        });
      });
    });
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
      
      // Check symptom questions
      mapping.symptoms.forEach(symptomId => {
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
      
      this.analysisData.vectorScores[vectorKey] = {
        name: vector.name,
        description: vector.description,
        rawScore: averageScore,
        weightedScore: weightedScore,
        questionCount: questionCount,
        threshold: mapping.threshold
      };
    });
  }

  findQuestionById(id) {
    return this.questionSequence.find(q => q.id === id);
  }

  identifyVectors() {
    // Identify vectors that exceed threshold
    this.analysisData.identifiedVectors = Object.entries(this.analysisData.vectorScores)
      .map(([key, data]) => ({ key, ...data }))
      .filter(vector => vector.weightedScore >= (vector.threshold * 10))
      .sort((a, b) => b.weightedScore - a.weightedScore);
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
          <p style="color: var(--muted);">Based on your responses, no manipulation vectors scored above the identification threshold. This may indicate:</p>
          <ul style="text-align: left; max-width: 600px; margin: 1rem auto;">
            <li>The relationship is healthy and respectful</li>
            <li>Manipulation patterns are subtle and require deeper analysis</li>
            <li>You may need to review specific situations more carefully</li>
          </ul>
        </div>
      `;
    } else {
      html = '<p style="color: var(--muted); margin-bottom: 1.5rem;">Based on your responses, the following manipulation vectors have been identified:</p>';
      
      this.analysisData.identifiedVectors.forEach(vector => {
        const severity = vector.weightedScore >= 8 ? 'High' : vector.weightedScore >= 5 ? 'Moderate' : 'Low';
        html += `
          <div class="vector-result">
            <h3>${vector.name} - ${severity} Priority</h3>
            <p style="color: var(--muted); margin-bottom: 1rem;">${vector.description}</p>
            <p><strong>Score:</strong> ${vector.rawScore.toFixed(1)}/10 (Weighted: ${vector.weightedScore.toFixed(1)})</p>
            <p style="margin-top: 1rem; font-weight: 600;">Relevant Tactics:</p>
        `;
        
        const relevantTactics = this.analysisData.tactics.filter(t => t.vector === vector.key);
        if (relevantTactics.length > 0) {
          relevantTactics.slice(0, 3).forEach(tactic => {
            html += `
              <div class="tactic-item">
                <strong>${tactic.name}</strong> (${tactic.mode} ${tactic.phase})
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--muted);"><em>${tactic.example}</em></p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">${tactic.mechanism}</p>
              </div>
            `;
          });
        }
        
        html += '</div>';
      });
    }
    
    container.innerHTML = html;
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
    this.analysisData = {
      timestamp: new Date().toISOString(),
      symptoms: {},
      effects: {},
      consequences: {},
      vectorScores: {},
      identifiedVectors: [],
      tactics: []
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

