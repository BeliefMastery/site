// Paradigm Engine
// Manages questionnaire flow and paradigm identification for Good Life and God perspectives

import { GOOD_LIFE_PARADIGMS } from './paradigm-data/good-life-paradigms.js';
import { GOD_PERSPECTIVES } from './paradigm-data/god-perspectives.js';
import { PARADIGM_SCORING } from './paradigm-data/paradigm-mapping.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class ParadigmEngine {
  constructor() {
    this.selectedCategories = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: []
    };
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.loadStoredData();
  }

  attachEventListeners() {
    // Category selection
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => this.toggleCategory(card.dataset.category));
    });

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

  toggleCategory(categoryId) {
    const card = document.querySelector(`[data-category="${categoryId}"]`);
    if (!card) return;
    
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== categoryId);
      card.classList.remove('selected');
    } else {
      this.selectedCategories.push(categoryId);
      card.classList.add('selected');
    }
    
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.disabled = this.selectedCategories.length === 0;
    }
  }

  startAssessment() {
    if (this.selectedCategories.length === 0) return;
    
    this.buildQuestionSequence();
    this.currentQuestionIndex = 0;
    this.answers = {};
    
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('questionnaireSection').classList.add('active');
    
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  buildQuestionSequence() {
    this.questionSequence = [];
    
    this.selectedCategories.forEach(category => {
      if (category === 'good_life') {
        // Add questions for each Good Life paradigm and dimension
        Object.keys(GOOD_LIFE_PARADIGMS).forEach(paradigmKey => {
          const paradigm = GOOD_LIFE_PARADIGMS[paradigmKey];
          Object.keys(paradigm.dimensions).forEach(dimensionKey => {
            const dimension = paradigm.dimensions[dimensionKey];
            dimension.questions.forEach((question, index) => {
              this.questionSequence.push({
                id: `good_life_${paradigmKey}_${dimensionKey}_${index}`,
                category: 'good_life',
                paradigm: paradigmKey,
                dimension: dimensionKey,
                question: question,
                description: dimension.description,
                name: `${paradigm.name} - ${dimension.name}`
              });
            });
          });
        });
      } else if (category === 'god') {
        // Add questions for each God perspective and dimension
        Object.keys(GOD_PERSPECTIVES).forEach(perspectiveKey => {
          const perspective = GOD_PERSPECTIVES[perspectiveKey];
          Object.keys(perspective.dimensions).forEach(dimensionKey => {
            const dimension = perspective.dimensions[dimensionKey];
            dimension.questions.forEach((question, index) => {
              this.questionSequence.push({
                id: `god_${perspectiveKey}_${dimensionKey}_${index}`,
                category: 'god',
                perspective: perspectiveKey,
                dimension: dimensionKey,
                question: question,
                description: dimension.description,
                name: `${perspective.name} - ${dimension.name}`
              });
            });
          });
        });
      }
    });
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.calculateResults();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    const progressFill = document.getElementById('progressFill');
    
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    const currentAnswer = this.answers[question.id] || 5;
    
    container.innerHTML = `
      <div class="question-block">
        <h3>${question.name}</h3>
        <p class="description">${question.description}</p>
        <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-weight: 600;">${question.question}</p>
        <div class="scale-container">
          <span style="font-size: 0.9rem; color: var(--muted);">Not at all</span>
          <div class="scale-input">
            <input type="range" id="answerInput" min="0" max="10" value="${currentAnswer}" step="1">
            <div class="scale-labels">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          <span style="font-size: 0.9rem; color: var(--muted);">Completely</span>
          <div class="scale-value" id="scaleValue">${currentAnswer}</div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 184, 0, 0.1); border-radius: var(--radius);">
          <strong>Quick Reference:</strong> 0-2 = Very Low / Minimal / Weak / Poor / Rare / Never, 3-4 = Low / Slightly / Somewhat, 5-6 = Moderate / Moderate / Average / Sometimes, 7-8 = High / Strong / Significant / Often, 9-10 = Very High / Strong / Potent / Excellent / Frequent / Always
        </div>
      </div>
    `;
    
    const input = document.getElementById('answerInput');
    const valueDisplay = document.getElementById('scaleValue');
    
    if (input && valueDisplay) {
      input.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        valueDisplay.textContent = value;
        this.answers[question.id] = value;
        this.saveProgress();
      });
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.textContent = this.currentQuestionIndex === this.questionSequence.length - 1 ? 'Complete' : 'Next';
    }
  }

  nextQuestion() {
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (currentQuestion) {
      const input = document.getElementById('answerInput');
      if (input) {
        this.answers[currentQuestion.id] = parseInt(input.value);
      }
    }
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.calculateResults();
    } else {
      this.renderCurrentQuestion();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      const currentQuestion = this.questionSequence[this.currentQuestionIndex];
      if (currentQuestion) {
        const input = document.getElementById('answerInput');
        if (input) {
          this.answers[currentQuestion.id] = parseInt(input.value);
        }
      }
      
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  calculateResults() {
    // Calculate scores for Good Life paradigms
    if (this.selectedCategories.includes('good_life')) {
      this.analysisData.goodLife = this.calculateGoodLifeScores();
    }
    
    // Calculate scores for God perspectives
    if (this.selectedCategories.includes('god')) {
      this.analysisData.god = this.calculateGodScores();
    }
    
    // Identify primary paradigms
    this.analysisData.identifiedParadigms = this.identifyParadigms();
    
    // Include all raw answers and question sequence
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question,
      category: q.category,
      paradigm: q.paradigm,
      perspective: q.perspective,
      dimension: q.dimension,
      name: q.name,
      description: q.description
    }));
    
    this.renderResults();
    this.saveProgress();
  }

  calculateGoodLifeScores() {
    const scores = {};
    
    Object.keys(GOOD_LIFE_PARADIGMS).forEach(paradigmKey => {
      const paradigm = GOOD_LIFE_PARADIGMS[paradigmKey];
      scores[paradigmKey] = {
        name: paradigm.name,
        dimensions: {},
        overallScore: 0
      };
      
      let totalScore = 0;
      let totalWeight = 0;
      
      Object.keys(paradigm.dimensions).forEach(dimensionKey => {
        const dimension = paradigm.dimensions[dimensionKey];
        const dimensionQuestions = this.questionSequence.filter(q => 
          q.category === 'good_life' && 
          q.paradigm === paradigmKey && 
          q.dimension === dimensionKey
        );
        
        let dimensionScore = 0;
        dimensionQuestions.forEach(q => {
          dimensionScore += this.answers[q.id] || 0;
        });
        
        const avgScore = dimensionQuestions.length > 0 ? dimensionScore / dimensionQuestions.length : 0;
        const weight = PARADIGM_SCORING.dimensionWeights[dimensionKey] || 1.0;
        const weightedScore = avgScore * weight;
        
        scores[paradigmKey].dimensions[dimensionKey] = {
          name: dimension.name,
          rawScore: avgScore,
          weightedScore: weightedScore,
          score: avgScore
        };
        
        totalScore += weightedScore;
        totalWeight += weight;
      });
      
      scores[paradigmKey].overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    });
    
    return scores;
  }

  calculateGodScores() {
    const scores = {};
    
    Object.keys(GOD_PERSPECTIVES).forEach(perspectiveKey => {
      const perspective = GOD_PERSPECTIVES[perspectiveKey];
      scores[perspectiveKey] = {
        name: perspective.name,
        dimensions: {},
        overallScore: 0
      };
      
      let totalScore = 0;
      let totalWeight = 0;
      
      Object.keys(perspective.dimensions).forEach(dimensionKey => {
        const dimension = perspective.dimensions[dimensionKey];
        const dimensionQuestions = this.questionSequence.filter(q => 
          q.category === 'god' && 
          q.perspective === perspectiveKey && 
          q.dimension === dimensionKey
        );
        
        let dimensionScore = 0;
        dimensionQuestions.forEach(q => {
          dimensionScore += this.answers[q.id] || 0;
        });
        
        const avgScore = dimensionQuestions.length > 0 ? dimensionScore / dimensionQuestions.length : 0;
        const weight = PARADIGM_SCORING.dimensionWeights[dimensionKey] || 1.0;
        const weightedScore = avgScore * weight;
        
        scores[perspectiveKey].dimensions[dimensionKey] = {
          name: dimension.name,
          rawScore: avgScore,
          weightedScore: weightedScore,
          score: avgScore
        };
        
        totalScore += weightedScore;
        totalWeight += weight;
      });
      
      scores[perspectiveKey].overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    });
    
    return scores;
  }

  identifyParadigms() {
    const paradigms = [];
    
    // Identify Good Life paradigms
    if (this.analysisData.goodLife && Object.keys(this.analysisData.goodLife).length > 0) {
      Object.entries(this.analysisData.goodLife).forEach(([key, data]) => {
        paradigms.push({
          category: 'good_life',
          key: key,
          name: data.name,
          score: data.overallScore,
          dimension: this.getPrimaryDimension(data.dimensions)
        });
      });
    }
    
    // Identify God perspectives
    if (this.analysisData.god && Object.keys(this.analysisData.god).length > 0) {
      Object.entries(this.analysisData.god).forEach(([key, data]) => {
        paradigms.push({
          category: 'god',
          key: key,
          name: data.name,
          score: data.overallScore,
          dimension: this.getPrimaryDimension(data.dimensions)
        });
      });
    }
    
    // Sort by score
    paradigms.sort((a, b) => b.score - a.score);
    
    return paradigms;
  }

  getPrimaryDimension(dimensions) {
    let maxScore = 0;
    let primaryDim = null;
    
    Object.entries(dimensions).forEach(([key, dim]) => {
      if (dim.weightedScore > maxScore) {
        maxScore = dim.weightedScore;
        primaryDim = key;
      }
    });
    
    return primaryDim;
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const resultsSection = document.getElementById('resultsSection');
    
    if (questionnaireSection) {
      questionnaireSection.classList.remove('active');
    }
    
    if (resultsSection) {
      resultsSection.classList.add('active');
    }
    
    let html = '<div class="paradigm-summary">';
    html += '<h3>Your Paradigm Profile</h3>';
    html += '<p>Based on your responses, here are your primary paradigm alignments:</p>';
    html += '</div>';
    
    // Display Good Life results
    if (this.analysisData.goodLife && Object.keys(this.analysisData.goodLife).length > 0) {
      html += '<div class="paradigm-card"><h4>The Good Life</h4>';
      
      const goodLifeParadigms = Object.entries(this.analysisData.goodLife)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.overallScore - a.overallScore);
      
      goodLifeParadigms.forEach(paradigm => {
        const priority = paradigm.overallScore >= PARADIGM_SCORING.primaryThreshold ? 'Primary' :
                        paradigm.overallScore >= PARADIGM_SCORING.secondaryThreshold ? 'Secondary' : 'Tertiary';
        
        html += `
          <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.5); border-radius: var(--radius);">
            <strong>${paradigm.name}</strong> - ${priority} Alignment (${paradigm.overallScore.toFixed(1)}/10)
            <div class="score-bar">
              <div class="score-fill" style="width: ${(paradigm.overallScore / 10) * 100}%"></div>
            </div>
            <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--muted);">
              Primary Dimension: ${this.getDimensionName(paradigm.dimensions, paradigm.dimension)}
            </p>
          </div>
        `;
      });
      
      html += '</div>';
    }
    
    // Display God results
    if (this.analysisData.god && Object.keys(this.analysisData.god).length > 0) {
      html += '<div class="paradigm-card"><h4>God Perspectives</h4>';
      
      const godPerspectives = Object.entries(this.analysisData.god)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.overallScore - a.overallScore);
      
      godPerspectives.forEach(perspective => {
        const priority = perspective.overallScore >= PARADIGM_SCORING.primaryThreshold ? 'Primary' :
                        perspective.overallScore >= PARADIGM_SCORING.secondaryThreshold ? 'Secondary' : 'Tertiary';
        
        html += `
          <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.5); border-radius: var(--radius);">
            <strong>${perspective.name}</strong> - ${priority} Alignment (${perspective.overallScore.toFixed(1)}/10)
            <div class="score-bar">
              <div class="score-fill" style="width: ${(perspective.overallScore / 10) * 100}%"></div>
            </div>
            <p style="font-size: 0.9rem; margin-top: 0.5rem; color: var(--muted);">
              Primary Dimension: ${this.getDimensionName(perspective.dimensions, perspective.dimension)}
            </p>
          </div>
        `;
      });
      
      html += '</div>';
    }
    
    container.innerHTML = html;
  }

  getDimensionName(dimensions, dimensionKey) {
    if (!dimensions[dimensionKey]) return 'Unknown';
    return dimensions[dimensionKey].name || dimensionKey;
  }

  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'paradigm', 'Paradigm Clarification System');
      downloadFile(csv, `paradigm-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'paradigm', 'Paradigm Clarification System');
      downloadFile(json, `paradigm-analysis-${Date.now()}.json`, 'application/json');
    }
  }

  saveProgress() {
    const progressData = {
      selectedCategories: this.selectedCategories,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('paradigmProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('paradigmProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.selectedCategories = data.selectedCategories || [];
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        
        // Restore category selections
        this.selectedCategories.forEach(categoryId => {
          const card = document.querySelector(`[data-category="${categoryId}"]`);
          if (card) card.classList.add('selected');
        });
        
        const startBtn = document.getElementById('startAssessment');
        if (startBtn) {
          startBtn.disabled = this.selectedCategories.length === 0;
        }
        
        // If in progress, restore questionnaire state
        if (this.currentQuestionIndex > 0 && this.selectedCategories.length > 0) {
          this.buildQuestionSequence();
          document.getElementById('categorySelection').style.display = 'none';
          document.getElementById('questionnaireSection').classList.add('active');
          this.renderCurrentQuestion();
        }
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }
  }

  resetAssessment() {
    this.selectedCategories = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: []
    };
    
    sessionStorage.removeItem('paradigmProgress');
    
    // Reset UI
    document.getElementById('categorySelection').style.display = 'block';
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    // Clear selections
    document.querySelectorAll('.category-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.disabled = true;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParadigmEngine();
  });
} else {
  new ParadigmEngine();
}

