// Relationship Optimization Engine - Multi-Stage Progressive Analysis
// Stage 1: Broad Compatibility Assessment
// Stage 2: Domain-Specific Deep Dive
// Stage 3: Scenario-Based Roleplay Questions

import { COMPATIBILITY_POINTS, IMPACT_TIER_WEIGHTS, SCORING_THRESHOLDS } from './relationship-data/compatibility-points.js';
import { ACTION_STRATEGIES } from './relationship-data/action-strategies.js';
import { ARCHETYPAL_INSIGHTS } from './relationship-data/archetypal-insights.js';
import { STAGE_2_DOMAIN_QUESTIONS, STAGE_3_SCENARIO_QUESTIONS, RELATIONSHIP_DOMAINS } from './relationship-data/stage-questions.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class RelationshipEngine {
  constructor() {
    this.currentStage = 1; // 1: Broad Assessment, 2: Domain Deep Dive, 3: Scenarios
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.weakestLinks = []; // Identified from Stage 1
    this.domainWeakAreas = {}; // Domain-specific weak areas from Stage 2
    this.analysisData = {
      timestamp: new Date().toISOString(),
      stage1Results: {},
      stage2Results: {},
      stage3Results: {},
      compatibilityScores: {},
      weakestLinks: [],
      actionStrategies: {},
      archetypalInsights: {}
    };

    this.init();
  }

  init() {
    this.buildStage1Sequence();
    this.attachEventListeners();
    this.loadStoredData();
    this.startAssessment();
  }

  buildStage1Sequence() {
    // Stage 1: Broad compatibility assessment (one question per compatibility point)
    this.questionSequence = [];
    this.currentStage = 1;
    
    Object.keys(COMPATIBILITY_POINTS).forEach(pointKey => {
      const point = COMPATIBILITY_POINTS[pointKey];
      
      // Use the first question as the primary assessment question
      if (point.questions && point.questions.length > 0) {
        this.questionSequence.push({
          id: `stage1_${pointKey}`,
          stage: 1,
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

  buildStage2Sequence() {
    // Stage 2: Domain-specific questions for weakest links
    this.questionSequence = [];
    this.currentStage = 2;
    
    // Get domains for weakest links
    const relevantDomains = new Set();
    this.weakestLinks.forEach(link => {
      // Find which domain this compatibility point belongs to
      Object.keys(RELATIONSHIP_DOMAINS).forEach(domainKey => {
        const domain = RELATIONSHIP_DOMAINS[domainKey];
        if (domain.compatibilityPoints.includes(link.point)) {
          relevantDomains.add(domainKey);
        }
      });
    });
    
    // Add domain-specific questions for weakest links
    this.weakestLinks.forEach(link => {
      const domainQuestions = STAGE_2_DOMAIN_QUESTIONS[link.point];
      if (domainQuestions && domainQuestions.questions) {
        domainQuestions.questions.forEach(question => {
          this.questionSequence.push({
            ...question,
            stage: 2,
            domain: domainQuestions.domain,
            domainName: RELATIONSHIP_DOMAINS[domainQuestions.domain]?.name || domainQuestions.domain
          });
        });
      } else {
        // Generate generic domain questions if not explicitly defined
        const point = COMPATIBILITY_POINTS[link.point];
        if (point && point.questions && point.questions.length > 1) {
          // Use additional questions from the compatibility point as domain questions
          point.questions.slice(1).forEach((q, index) => {
            this.questionSequence.push({
              id: `domain_${link.point}_${index + 1}`,
              question: q,
              weight: 1.0 + (index * 0.1),
              compatibilityPoint: link.point,
              stage: 2,
              domain: 'generic',
              domainName: 'Deep Dive'
            });
          });
        }
      }
    });
  }

  buildStage3Sequence() {
    // Stage 3: Scenario-based roleplay questions for critical weak areas
    this.questionSequence = [];
    this.currentStage = 3;
    
    // Get top 3-5 weakest links for scenario questions
    const criticalLinks = this.weakestLinks.slice(0, 5);
    
    criticalLinks.forEach(link => {
      const scenarioQuestions = STAGE_3_SCENARIO_QUESTIONS[link.point];
      if (scenarioQuestions) {
        scenarioQuestions.forEach(question => {
          this.questionSequence.push({
            ...question,
            stage: 3,
            point: link.point
          });
        });
      } else {
        // Generate generic scenario questions if not explicitly defined
        const point = COMPATIBILITY_POINTS[link.point];
        if (point) {
          // Create scenario questions based on the compatibility point
          this.questionSequence.push({
            id: `scenario_${link.point}_1`,
            question: `Envision a situation where ${point.name.toLowerCase()} becomes a significant issue in your relationship. How do you imagine you would feel, and what would you need from your partner?`,
            weight: 1.0,
            compatibilityPoint: link.point,
            stage: 3,
            type: 'scenario',
            example: `Example: A real situation where ${point.name.toLowerCase()} created tension or conflict in your relationship.`
          });
          
          this.questionSequence.push({
            id: `scenario_${link.point}_2`,
            question: `Imagine your partner's response to a ${point.name.toLowerCase()} issue feels dismissive, unsupportive, or creates conflict. What would help restore connection and understanding?`,
            weight: 1.0,
            compatibilityPoint: link.point,
            stage: 3,
            type: 'scenario',
            example: `Example: Your partner's approach to ${point.name.toLowerCase()} differs significantly from yours, and it's causing ongoing friction.`
          });
        }
      }
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
      this.completeStage();
      return;
    }

    const currentQ = this.questionSequence[this.currentQuestionIndex];
    const savedAnswer = this.answers[currentQ.id] !== undefined ? this.answers[currentQ.id] : 5; // Default to 5

    let stageLabel = '';
    if (currentQ.stage === 1) {
      stageLabel = 'Broad Compatibility Assessment';
    } else if (currentQ.stage === 2) {
      stageLabel = currentQ.domainName ? `${currentQ.domainName} - Deep Dive` : 'Domain-Specific Analysis';
    } else if (currentQ.stage === 3) {
      stageLabel = 'Scenario-Based Reflection';
    }

    let exampleText = '';
    if (currentQ.example) {
      exampleText = `<div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 123, 255, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius);">
        <strong style="color: var(--brand);">Example Scenario:</strong>
        <p style="margin-top: 0.5rem; color: var(--muted); font-style: italic;">${currentQ.example}</p>
      </div>`;
    }

    questionContainer.innerHTML = `
      <div class="question-block">
        ${stageLabel ? `<p style="color: var(--muted); margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">${stageLabel}</p>` : ''}
        ${currentQ.name ? `<h3>${currentQ.name}</h3>` : ''}
        ${currentQ.description ? `<p class="description">${currentQ.description}</p>` : ''}
        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--brand);">${currentQ.question}</h4>
        ${exampleText}
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" min="0" max="10" value="${savedAnswer}" class="slider" id="questionSlider">
            <div class="scale-labels">
              <span>Very Low / Minimal / Weak / Poor / Rare / Never (0-2)</span>
              <span>Moderate / Somewhat / Average / Moderate / Sometimes (5-6)</span>
              <span>Very High / Strong / Potent / Excellent / Frequent / Always (9-10)</span>
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
      this.completeStage();
    }
  }

  completeStage() {
    if (this.currentStage === 1) {
      // Analyze Stage 1 results and identify weakest links
      this.analyzeStage1Results();
      
      if (this.weakestLinks.length > 0) {
        // Move to Stage 2
        this.buildStage2Sequence();
        this.currentQuestionIndex = 0;
        this.renderCurrentQuestion();
        this.updateProgressBar();
        this.updateStageIndicator();
        return;
      } else {
        // No weak areas, show results
        this.finalizeResults();
        return;
      }
    } else if (this.currentStage === 2) {
      // Analyze Stage 2 results
      this.analyzeStage2Results();
      
      // Move to Stage 3 for critical areas
      if (this.weakestLinks.length > 0) {
        this.buildStage3Sequence();
        if (this.questionSequence.length > 0) {
          this.currentQuestionIndex = 0;
          this.renderCurrentQuestion();
          this.updateProgressBar();
          this.updateStageIndicator();
          return;
        }
      }
      
      // No Stage 3 questions or complete, show results
      this.finalizeResults();
      return;
    } else if (this.currentStage === 3) {
      // Stage 3 complete, finalize results
      this.analyzeStage3Results();
      this.finalizeResults();
      return;
    }
  }

  analyzeStage1Results() {
    // Calculate compatibility scores from Stage 1
    this.analysisData.stage1Results = {};
    
    Object.keys(COMPATIBILITY_POINTS).forEach(pointKey => {
      const point = COMPATIBILITY_POINTS[pointKey];
      const answerId = `stage1_${pointKey}`;
      const rawScore = this.answers[answerId] !== undefined ? this.answers[answerId] : 0;
      const tierWeight = IMPACT_TIER_WEIGHTS[point.impactTier] || 0.7;
      const weightedScore = rawScore * tierWeight * point.weight;

      this.analysisData.stage1Results[pointKey] = {
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
    const sortedPoints = Object.entries(this.analysisData.stage1Results)
      .map(([key, data]) => ({ point: key, ...data }))
      .sort((a, b) => a.weightedScore - b.weightedScore);

    // Top 5 weakest links
    this.weakestLinks = sortedPoints.slice(0, 5);
  }

  analyzeStage2Results() {
    // Analyze domain-specific answers
    this.analysisData.stage2Results = {};
    this.domainWeakAreas = {};
    
    // Group answers by domain and compatibility point
    const domainScores = {};
    
    this.questionSequence
      .filter(q => q.stage === 2)
      .forEach(q => {
        if (!domainScores[q.domain]) {
          domainScores[q.domain] = {};
        }
        if (!domainScores[q.domain][q.compatibilityPoint]) {
          domainScores[q.domain][q.compatibilityPoint] = [];
        }
        
        if (this.answers[q.id] !== undefined) {
          domainScores[q.domain][q.compatibilityPoint].push({
            answer: this.answers[q.id],
            weight: q.weight
          });
        }
      });
    
    // Calculate domain scores
    Object.keys(domainScores).forEach(domainKey => {
      const domain = domainScores[domainKey];
      Object.keys(domain).forEach(pointKey => {
        const answers = domain[pointKey];
        let totalScore = 0;
        let totalWeight = 0;
        
        answers.forEach(a => {
          totalScore += a.answer * a.weight;
          totalWeight += a.weight;
        });
        
        const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
        
        if (!this.analysisData.stage2Results[domainKey]) {
          this.analysisData.stage2Results[domainKey] = {};
        }
        
        this.analysisData.stage2Results[domainKey][pointKey] = {
          score: averageScore,
          questionCount: answers.length
        };
        
        // Track weak areas (score < 5)
        if (averageScore < 5) {
          if (!this.domainWeakAreas[domainKey]) {
            this.domainWeakAreas[domainKey] = [];
          }
          this.domainWeakAreas[domainKey].push(pointKey);
        }
      });
    });
  }

  analyzeStage3Results() {
    // Store Stage 3 scenario insights
    this.analysisData.stage3Results = {};
    
    this.weakestLinks.forEach(link => {
      const scenarioAnswers = {};
      this.questionSequence
        .filter(q => q.stage === 3 && q.point === link.point)
        .forEach(q => {
          if (this.answers[q.id] !== undefined) {
            scenarioAnswers[q.id] = {
              question: q.question,
              example: q.example,
              answer: this.answers[q.id]
            };
          }
        });
      
      if (Object.keys(scenarioAnswers).length > 0) {
        this.analysisData.stage3Results[link.point] = scenarioAnswers;
      }
    });
  }

  finalizeResults() {
    // Calculate final results
    this.calculateResults();
    
    // Include all raw answers and question sequence for AI agent export
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = [];
    
    // Collect all questions from all stages
    [1, 2, 3].forEach(stage => {
      const stageQuestions = this.questionSequence.filter(q => q.stage === stage);
      stageQuestions.forEach(q => {
        this.analysisData.questionSequence.push({
          id: q.id,
          question: q.question,
          stage: q.stage,
          point: q.point,
          domain: q.domain,
          name: q.name
        });
      });
    });
    
    this.renderResults();
    this.saveProgress();
  }

  updateStageIndicator() {
    const stageIndicator = document.getElementById('stageIndicator');
    if (stageIndicator) {
      const stageNames = {
        1: 'Stage 1: Broad Compatibility Assessment',
        2: 'Stage 2: Domain-Specific Deep Dive',
        3: 'Stage 3: Scenario-Based Reflection'
      };
      stageIndicator.textContent = stageNames[this.currentStage] || '';
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
    // Use stage 1 results as base compatibility scores
    this.analysisData.compatibilityScores = this.analysisData.stage1Results || {};
    
    // Build final weakest links list with strategies
    this.analysisData.weakestLinks = this.weakestLinks.map(link => ({
      point: link.point,
      name: link.name,
      rawScore: link.rawScore,
      weightedScore: link.weightedScore,
      impactTier: link.impactTier,
      priority: link.priority,
      severity: link.severity,
      strategies: this.getActionStrategies(link.point, link.rawScore)
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

