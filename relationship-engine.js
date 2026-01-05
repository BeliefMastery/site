// Relationship Optimization Engine
// Identifies weakest links and provides targeted action strategies

import { COMPATIBILITY_POINTS, IMPACT_TIER_WEIGHTS, SCORING_THRESHOLDS } from './relationship-data/compatibility-points.js';
import { ACTION_STRATEGIES } from './relationship-data/action-strategies.js';
import { ARCHETYPAL_INSIGHTS } from './relationship-data/archetypal-insights.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class RelationshipEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      compatibilityScores: {},
      weakestLinks: [],
      actionStrategies: {},
      archetypalInsights: {}
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
    
    // Create questions for all 20 compatibility points
    Object.keys(COMPATIBILITY_POINTS).forEach(pointKey => {
      const point = COMPATIBILITY_POINTS[pointKey];
      
      // Use the first question as the primary assessment question
      if (point.questions && point.questions.length > 0) {
        this.questionSequence.push({
          id: pointKey,
          type: 'compatibility',
          point: pointKey,
          question: point.questions[0],
          description: point.description,
          name: point.name,
          impactTier: point.impactTier,
          weight: point.weight,
          tierWeight: IMPACT_TIER_WEIGHTS[point.impactTier] || 0.7
        });
      }
    });
    
    // Shuffle questions for a more dynamic experience
    this.questionSequence.sort(() => Math.random() - 0.5);
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

    const exportJSONBtn = document.getElementById('exportAnalysisJSON');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportAnalysis('json'));
    }

    const exportCSVBtn = document.getElementById('exportAnalysisCSV');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportAnalysis('csv'));
    }

    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }

    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
    }
  }

  startAssessment() {
    document.getElementById('questionnaireSection').classList.add('active');
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
    this.updateProgressBar();
    this.saveProgress();
  }

  renderCurrentQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');

    if (!questionContainer || !prevBtn || !nextBtn) return;

    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.calculateResults();
      this.renderResults();
      return;
    }

    const currentQ = this.questionSequence[this.currentQuestionIndex];
    const savedAnswer = this.answers[currentQ.id] !== undefined ? this.answers[currentQ.id] : 5; // Default to 5

    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>${currentQ.name}</h3>
        <p class="description">${currentQ.description}</p>
        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--brand);">${currentQ.question}</h4>
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" min="0" max="10" value="${savedAnswer}" class="slider" id="questionSlider">
            <div class="scale-labels">
              <span>Very Weak (0-2)</span>
              <span>Moderate (5)</span>
              <span>Very Strong (8-10)</span>
            </div>
          </div>
          <span class="scale-value" id="sliderValue">${savedAnswer}</span>
        </div>
        <p style="font-size: 0.9em; color: var(--muted); margin-top: 0.5rem; font-style: italic;">
          Tip: Rate your current relationship experience in this area (0 = significant problems, 10 = excellent alignment).
        </p>
      </div>
    `;

    const slider = document.getElementById('questionSlider');
    const sliderValueSpan = document.getElementById('sliderValue');
    if (slider && sliderValueSpan) {
      slider.oninput = (event) => {
        sliderValueSpan.textContent = event.target.value;
        this.answers[currentQ.id] = parseInt(event.target.value);
        this.saveProgress();
      };
    }

    prevBtn.disabled = this.currentQuestionIndex === 0;
    nextBtn.textContent = this.currentQuestionIndex === this.questionSequence.length - 1 ? 'Finish Assessment' : 'Next';
  }

  nextQuestion() {
    const currentQ = this.questionSequence[this.currentQuestionIndex];
    if (this.answers[currentQ.id] === undefined) {
      this.answers[currentQ.id] = 5; // Auto-save default if not touched
    }

    if (this.currentQuestionIndex < this.questionSequence.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.updateProgressBar();
      this.saveProgress();
    } else {
      this.calculateResults();
      this.renderResults();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      // Save current answer before navigating back
      const currentQ = this.questionSequence[this.currentQuestionIndex];
      const slider = document.getElementById('questionSlider');
      if (slider && currentQ) {
        this.answers[currentQ.id] = parseInt(slider.value);
      }
      
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.updateProgressBar();
      this.saveProgress();
    }
  }

  updateProgressBar() {
    const progressBarFill = document.getElementById('progressBarFill');
    if (progressBarFill) {
      const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
      progressBarFill.style.width = `${progress}%`;
    }
  }

  calculateResults() {
    this.analysisData.compatibilityScores = {};
    this.analysisData.weakestLinks = [];

    // Calculate scores for each compatibility point
    Object.keys(COMPATIBILITY_POINTS).forEach(pointKey => {
      const point = COMPATIBILITY_POINTS[pointKey];
      const rawScore = this.answers[pointKey] !== undefined ? this.answers[pointKey] : 0;
      const tierWeight = IMPACT_TIER_WEIGHTS[point.impactTier] || 0.7;
      const weightedScore = rawScore * tierWeight * point.weight;

      this.analysisData.compatibilityScores[pointKey] = {
        name: point.name,
        rawScore: rawScore,
        weightedScore: weightedScore,
        impactTier: point.impactTier,
        tierWeight: tierWeight,
        priority: this.getPriorityLevel(rawScore, weightedScore),
        severity: this.getSeverityLevel(rawScore)
      };
    });

    // Identify weakest links (lowest weighted scores)
    const sortedPoints = Object.entries(this.analysisData.compatibilityScores)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => a.weightedScore - b.weightedScore);

    // Top 5 weakest links
    this.analysisData.weakestLinks = sortedPoints.slice(0, 5).map(item => ({
      point: item.key,
      name: item.name,
      rawScore: item.rawScore,
      weightedScore: item.weightedScore,
      impactTier: item.impactTier,
      priority: item.priority,
      severity: item.severity,
      strategies: this.getActionStrategies(item.key, item.rawScore)
    }));

    // Generate archetypal insights for weakest links
    this.analysisData.archetypalInsights = this.generateArchetypalInsights();
  }

  getPriorityLevel(rawScore, weightedScore) {
    if (rawScore <= SCORING_THRESHOLDS.critical) return 'Critical';
    if (rawScore <= SCORING_THRESHOLDS.weakestLink) return 'High';
    if (rawScore <= SCORING_THRESHOLDS.moderate) return 'Moderate';
    return 'Low';
  }

  getSeverityLevel(rawScore) {
    if (rawScore <= 3) return 'Critical';
    if (rawScore <= 5) return 'Moderate';
    if (rawScore <= 7) return 'Mild';
    return 'Minimal';
  }

  getActionStrategies(pointKey, rawScore) {
    const strategies = ACTION_STRATEGIES[pointKey] || ACTION_STRATEGIES.generic;
    const severity = this.getSeverityLevel(rawScore);
    
    return {
      immediate: strategies.immediate || [],
      structural: strategies.structural || [],
      archetypal: strategies.archetypal || [],
      severity: severity
    };
  }

  generateArchetypalInsights() {
    const insights = {
      vulnerability: ARCHETYPAL_INSIGHTS.vulnerability.description,
      biologicalEssentialism: ARCHETYPAL_INSIGHTS.biologicalEssentialism.description,
      polarity: ARCHETYPAL_INSIGHTS.polarity.description,
      statusSelectionAttraction: ARCHETYPAL_INSIGHTS.statusSelectionAttraction.description,
      resentment: ARCHETYPAL_INSIGHTS.resentment.description
    };

    // Add specific insights for weakest links
    this.analysisData.weakestLinks.forEach(link => {
      const point = COMPATIBILITY_POINTS[link.point];
      if (ARCHETYPAL_INSIGHTS.biologicalEssentialism.compatibilityPoints[link.point]) {
        insights[link.point] = ARCHETYPAL_INSIGHTS.biologicalEssentialism.compatibilityPoints[link.point];
      }
    });

    return insights;
  }

  renderResults() {
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');

    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;

    let html = '<h3>Your Relationship Weakest Links:</h3>';
    html += '<p style="color: var(--muted); margin-bottom: 2rem;">These are the areas requiring the most immediate attention, ranked by weighted impact score.</p>';

    if (this.analysisData.weakestLinks.length > 0) {
      this.analysisData.weakestLinks.forEach((link, index) => {
        const criticalClass = link.severity === 'Critical' ? 'critical' : '';
        html += `
          <div class="weakest-link-item ${criticalClass}">
            <h3>${index + 1}. ${link.name} <span style="font-size: 0.9em; color: var(--muted);">(${link.impactTier} impact)</span></h3>
            <p><strong>Score:</strong> ${link.rawScore}/10 (Weighted: ${link.weightedScore.toFixed(2)})</p>
            <p><strong>Priority:</strong> ${link.priority} | <strong>Severity:</strong> ${link.severity}</p>
            
            <div class="action-strategies">
              <h4>Immediate Actions:</h4>
              <ul>
                ${link.strategies.immediate.map(strategy => `<li>${strategy}</li>`).join('')}
              </ul>
              
              <h4>Structural Changes:</h4>
              <ul>
                ${link.strategies.structural.map(strategy => `<li>${strategy}</li>`).join('')}
              </ul>
              
              <h4>Archetypal Insights:</h4>
              <ul>
                ${link.strategies.archetypal.map(insight => `<li>${insight}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      });
    } else {
      html += '<p>No weakest links identified. Please complete the assessment.</p>';
    }

    // Add summary of all scores
    html += '<div style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid rgba(0,0,0,0.1);">';
    html += '<h3>Complete Compatibility Overview:</h3>';
    html += '<p style="color: var(--muted); margin-bottom: 1rem;">All compatibility points ranked by weighted score:</p>';
    
    const allScores = Object.entries(this.analysisData.compatibilityScores)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.weightedScore - a.weightedScore);
    
    html += '<ul style="list-style: none; padding: 0;">';
    allScores.forEach(item => {
      const scoreColor = item.rawScore <= 3 ? '#dc3545' : item.rawScore <= 5 ? '#ffc107' : '#28a745';
      html += `<li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.1);">
        <strong>${item.name}</strong>: <span style="color: ${scoreColor};">${item.rawScore}/10</span> 
        <span style="color: var(--muted); font-size: 0.9em;">(Weighted: ${item.weightedScore.toFixed(2)}, ${item.impactTier} impact)</span>
      </li>`;
    });
    html += '</ul></div>';

    resultsContainer.innerHTML = html;
  }

  exportAnalysis(format = 'json') {
    const filename = `relationship-analysis-${Date.now()}`;
    if (format === 'csv') {
      const csvContent = exportForAIAgent(this.analysisData, 'relationship', 'Relationship Optimization');
      downloadFile(csvContent, filename + '.csv', 'text/csv');
    } else {
      const jsonContent = exportJSON(this.analysisData, 'relationship', 'Relationship Optimization');
      downloadFile(jsonContent, filename + '.json', 'application/json');
    }
  }

  saveProgress() {
    const progressData = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('relationshipProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('relationshipProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};

        // If in progress, restore questionnaire state
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex < this.questionSequence.length) {
          this.renderCurrentQuestion();
          this.updateProgressBar();
        }
      } catch (e) {
        console.error("Error loading stored relationship data:", e);
        sessionStorage.removeItem('relationshipProgress');
      }
    }
  }

  clearAllCachedData() {
    sessionStorage.removeItem('relationshipProgress');
    this.resetAssessment();
    alert('All cached data for Relationship Optimization has been cleared.');
  }

  resetAssessment() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      compatibilityScores: {},
      weakestLinks: [],
      actionStrategies: {},
      archetypalInsights: {}
    };

    sessionStorage.removeItem('relationshipProgress');

    // Reset UI
    document.getElementById('questionnaireSection').classList.add('active');
    document.getElementById('resultsSection').classList.remove('active');
    document.getElementById('progressBarFill').style.width = '0%';
    this.startAssessment();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RelationshipEngine();
});

