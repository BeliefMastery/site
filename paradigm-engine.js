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
    this.godTransitionShown = false;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: [],
      confidenceBands: {},
      dimensionalTensions: {},
      translationCapacity: null
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
    
    // Check if we're transitioning from Good Life to God questions
    if (question.category === 'god' && !this.godTransitionShown) {
      const goodLifeQuestions = this.questionSequence.filter(q => q.category === 'good_life');
      if (this.currentQuestionIndex === goodLifeQuestions.length) {
        this.showGodTransition();
        return;
      }
    }
    
    const container = document.getElementById('questionContainer');
    const progressFill = document.getElementById('progressFill');
    
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    this.renderQuestionContent(question);
  }
  
  renderQuestionContent(question) {
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    const currentAnswer = this.answers[question.id] || 5;
    const progressFill = document.getElementById('progressFill');
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
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
    this.updateNavigationButtons();
  }
  
  updateNavigationButtons() {
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
          dimension: this.getPrimaryDimension(data.dimensions),
          dimensions: data.dimensions
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
          dimension: this.getPrimaryDimension(data.dimensions),
          dimensions: data.dimensions
        });
      });
    }
    
    // Sort by score
    paradigms.sort((a, b) => b.score - a.score);
    
    // Determine confidence bands and score proximity
    this.determineConfidenceBands(paradigms);
    this.calculateDimensionalTensions();
    this.calculateTranslationCapacity();
    
    return paradigms;
  }
  
  determineConfidenceBands(paradigms) {
    if (paradigms.length === 0) return;
    
    // Group by category
    const goodLifeParadigms = paradigms.filter(p => p.category === 'good_life');
    const godPerspectives = paradigms.filter(p => p.category === 'god');
    
    [goodLifeParadigms, godPerspectives].forEach(group => {
      if (group.length === 0) return;
      
      const topScore = group[0].score;
      const secondScore = group.length > 1 ? group[1].score : 0;
      const scoreDiff = topScore - secondScore;
      
      group.forEach((paradigm, index) => {
        let band = 'peripheral';
        
        if (index === 0) {
          // Check if top two are close (blended orientation)
          if (scoreDiff < 1.5 && group.length > 1) {
            band = 'co-dominant';
            group[0].blendedOrientation = true;
            if (group[1]) group[1].blendedOrientation = true;
          } else {
            band = 'primary';
          }
        } else if (index === 1 && scoreDiff < 1.5) {
          band = 'co-dominant';
        }
        
        paradigm.confidenceBand = band;
        
        // Also store in analysisData for easy access
        const key = `${paradigm.category}_${paradigm.key}`;
        if (!this.analysisData.confidenceBands) {
          this.analysisData.confidenceBands = {};
        }
        this.analysisData.confidenceBands[key] = band;
      });
    });
  }
  
  calculateDimensionalTensions() {
    // Analyze dimensional tensions for each paradigm
    Object.keys(this.analysisData.goodLife).forEach(key => {
      const paradigm = this.analysisData.goodLife[key];
      const tensions = this.findDimensionalTensions(paradigm.dimensions);
      if (tensions.length > 0) {
        this.analysisData.dimensionalTensions[`good_life_${key}`] = tensions;
      }
    });
    
    Object.keys(this.analysisData.god).forEach(key => {
      const perspective = this.analysisData.god[key];
      const tensions = this.findDimensionalTensions(perspective.dimensions);
      if (tensions.length > 0) {
        this.analysisData.dimensionalTensions[`god_${key}`] = tensions;
      }
    });
  }
  
  findDimensionalTensions(dimensions) {
    const tensions = [];
    const scores = Object.entries(dimensions).map(([key, dim]) => ({
      key,
      score: dim.rawScore
    }));
    
    // Find high-low pairs (tension indicators)
    scores.forEach((dim1, i) => {
      scores.slice(i + 1).forEach(dim2 => {
        const diff = Math.abs(dim1.score - dim2.score);
        if (diff >= 4) { // Significant tension threshold
          tensions.push({
            high: dim1.score > dim2.score ? dim1.key : dim2.key,
            low: dim1.score < dim2.score ? dim1.key : dim2.key,
            difference: diff
          });
        }
      });
    });
    
    return tensions;
  }
  
  calculateTranslationCapacity() {
    // Measure ability to hold meaning across multiple dimensions
    let totalCapacity = 0;
    let count = 0;
    
    Object.values(this.analysisData.goodLife).forEach(paradigm => {
      const dimensionScores = Object.values(paradigm.dimensions).map(d => d.rawScore);
      const variance = this.calculateVariance(dimensionScores);
      // Lower variance = higher translation capacity
      totalCapacity += (10 - Math.min(variance, 10));
      count++;
    });
    
    Object.values(this.analysisData.god).forEach(perspective => {
      const dimensionScores = Object.values(perspective.dimensions).map(d => d.rawScore);
      const variance = this.calculateVariance(dimensionScores);
      totalCapacity += (10 - Math.min(variance, 10));
      count++;
    });
    
    this.analysisData.translationCapacity = count > 0 ? totalCapacity / count : null;
  }
  
  calculateVariance(scores) {
    if (scores.length === 0) return 0;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return variance;
  }
  
  showGodTransition() {
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    this.godTransitionShown = true;
    
    container.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); box-shadow: var(--shadow);">
        <h3 style="color: var(--brand); margin-bottom: 1.5rem; font-size: 1.5rem;">Transitioning to God Perspectives</h3>
        <p style="color: var(--muted); line-height: 1.7; margin-bottom: 2rem; font-size: 1.05rem; max-width: 600px; margin-left: auto; margin-right: auto;">
          You're about to explore perspectives on God or ultimate reality. These questions involve higher abstraction and inherent ambiguity. Switch to an interpretive mode that allows for multiple valid framings. These perspectives describe interpretive frames, not proofs or denials.
        </p>
        <button class="btn btn-primary" id="continueFromGodTransition" style="min-width: 150px;">Continue</button>
      </div>
    `;
    
    const continueBtn = document.getElementById('continueFromGodTransition');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.renderQuestionContent(this.questionSequence[this.currentQuestionIndex]);
        this.updateNavigationButtons();
      });
    }
  }
  
  renderQuestionContent(question) {
    const container = document.getElementById('questionContainer');
    if (!container) return;
    
    const currentAnswer = this.answers[question.id] || 5;
    const progressFill = document.getElementById('progressFill');
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
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
    
    this.updateNavigationButtons();
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

  getShadowRisk(paradigmKey, category) {
    const shadowRisks = {
      good_life: {
        active: 'Over-symbolization can lead to detachment from concrete responsibility. The Active Life may prioritize doing over being, risking exhaustion and missing deeper meaning.',
        contemplative: 'Over-contemplation can lead to withdrawal from practical engagement. The Contemplative Life may prioritize understanding over action, risking ineffectiveness in the world.',
        devotional: 'Over-devotion can lead to dependency and loss of personal agency. The Devotional Life may prioritize surrender over sovereignty, risking abdication of responsibility.'
      },
      god: {
        logical: 'Over-rationalization can lead to emotional disconnection and spiritual dryness. Logical Function may prioritize coherence over mystery, risking reductionism.',
        unifying: 'Over-unification can lead to loss of distinction and individual significance. Unifying Phenomenon may prioritize oneness over differentiation, risking dissolution of identity.',
        biological: 'Over-biologization can lead to determinism and loss of transcendence. Biological Imperative may prioritize instinct over choice, risking fatalism.',
        social: 'Over-socialization can lead to relativism and loss of ultimate meaning. Social Construct may prioritize context over truth, risking nihilism.',
        relational: 'Over-relationalization can lead to anthropomorphism and projection. Relational Archetype may prioritize personal connection over transcendence, risking idolatry.',
        emergent: 'Over-emergence can lead to process fixation and loss of stability. Emergent Function may prioritize becoming over being, risking groundlessness.'
      }
    };
    
    return shadowRisks[category] && shadowRisks[category][paradigmKey] 
      ? shadowRisks[category][paradigmKey] 
      : 'Each paradigm has its shadow. Watch for patterns where your primary alignment becomes rigid or excludes other valid ways of engaging with meaning.';
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
    
    // Get identified paradigms with confidence bands
    const paradigms = this.analysisData.identifiedParadigms;
    
    let html = '<div class="paradigm-summary">';
    html += '<h3>Your Current Dominant Framing</h3>';
    html += '<p>Based on your responses, here are your primary paradigm alignments. Remember: paradigms commonly shift with life stage, pressure, and responsibility. This map reflects your current organization of meaning, not a fixed identity.</p>';
    
    // Developmental drift normalization
    html += '<div style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-top: 1rem;">';
    html += '<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--brand);">Note:</strong> Paradigms commonly shift with life stage, pressure, and responsibility. This is normal and expected—not a problem to solve.</p>';
    html += '</div>';
    
    html += '</div>';
    
    // Display Good Life results
    if (this.analysisData.goodLife && Object.keys(this.analysisData.goodLife).length > 0) {
      html += '<div class="paradigm-card"><h4>The Good Life</h4>';
      
      const goodLifeParadigms = paradigms.filter(p => p.category === 'good_life')
        .sort((a, b) => b.score - a.score);
      
      goodLifeParadigms.forEach(paradigm => {
        const band = paradigm.confidenceBand || 'peripheral';
        const bandLabel = band === 'primary' ? 'Primary' : band === 'co-dominant' ? 'Co-dominant' : 'Peripheral';
        const bandColor = band === 'primary' ? 'var(--brand)' : band === 'co-dominant' ? 'var(--accent)' : 'var(--muted)';
        const blendedNote = paradigm.blendedOrientation ? '<span style="font-size: 0.85rem; color: var(--accent); font-style: italic; margin-left: 0.5rem;">(Blended orientation)</span>' : '';
        
        html += `
          <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.7); border-radius: var(--radius); border-left: 4px solid ${bandColor};">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
              <strong style="font-size: 1.1rem;">${paradigm.name}</strong>
              <span style="background: ${bandColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${bandLabel}</span>
              ${blendedNote}
            </div>
            <p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 0.75rem;">Score: ${paradigm.score.toFixed(1)}/10</p>
            <div class="score-bar">
              <div class="score-fill" style="width: ${(paradigm.score / 10) * 100}%"></div>
            </div>
            <p style="font-size: 0.9rem; margin-top: 0.75rem; color: var(--muted);">
              Primary Dimension: ${this.getDimensionName(paradigm.dimensions, paradigm.dimension)}
            </p>
        `;
        
        // Dimensional tensions
        const tensions = this.analysisData.dimensionalTensions[`good_life_${paradigm.key}`];
        if (tensions && tensions.length > 0) {
          html += '<div style="background: rgba(255, 184, 0, 0.1); border-radius: var(--radius); padding: 0.75rem; margin-top: 0.75rem;">';
          html += '<p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--muted);"><strong style="color: var(--accent);">Dimensional Tension:</strong> ';
          tensions.forEach((tension, i) => {
            if (i > 0) html += '; ';
            html += `High ${this.getDimensionName(paradigm.dimensions, tension.high)} and low ${this.getDimensionName(paradigm.dimensions, tension.low)}`;
          });
          html += '. This tension is expected and reflects the complexity of meaning-making—not a deficit.</p>';
          html += '</div>';
        }
        
        // Shadow risk
        html += `<div style="background: rgba(211, 47, 47, 0.1); border-left: 3px solid #d32f2f; border-radius: var(--radius); padding: 0.75rem; margin-top: 0.75rem;">`;
        html += `<p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--muted);"><strong style="color: #d32f2f;">Shadow Risk:</strong> ${this.getShadowRisk(paradigm.key, 'good_life')}</p>`;
        html += '</div>';
        
        html += '</div>';
      });
      
      html += '</div>';
    }
    
    // Display God results
    if (this.analysisData.god && Object.keys(this.analysisData.god).length > 0) {
      html += '<div class="paradigm-card"><h4>God Perspectives</h4>';
      
      // Perspective ≠ Metaphysical Claim reminder
      html += '<div style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-bottom: 1.5rem;">';
      html += '<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--brand);">Important:</strong> These perspectives describe interpretive frames, not proofs or denials. They map how meaning is organized, not what is ultimately real.</p>';
      html += '</div>';
      
      const godPerspectives = paradigms.filter(p => p.category === 'god')
        .sort((a, b) => b.score - a.score);
      
      godPerspectives.forEach(perspective => {
        const band = perspective.confidenceBand || 'peripheral';
        const bandLabel = band === 'primary' ? 'Primary' : band === 'co-dominant' ? 'Co-dominant' : 'Peripheral';
        const bandColor = band === 'primary' ? 'var(--brand)' : band === 'co-dominant' ? 'var(--accent)' : 'var(--muted)';
        const blendedNote = perspective.blendedOrientation ? '<span style="font-size: 0.85rem; color: var(--accent); font-style: italic; margin-left: 0.5rem;">(Blended orientation)</span>' : '';
        
        html += `
          <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.7); border-radius: var(--radius); border-left: 4px solid ${bandColor};">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
              <strong style="font-size: 1.1rem;">${perspective.name}</strong>
              <span style="background: ${bandColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${bandLabel}</span>
              ${blendedNote}
            </div>
            <p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 0.75rem;">Score: ${perspective.score.toFixed(1)}/10</p>
            <div class="score-bar">
              <div class="score-fill" style="width: ${(perspective.score / 10) * 100}%"></div>
            </div>
            <p style="font-size: 0.9rem; margin-top: 0.75rem; color: var(--muted);">
              Primary Dimension: ${this.getDimensionName(perspective.dimensions, perspective.dimension)}
            </p>
        `;
        
        // Dimensional tensions
        const tensions = this.analysisData.dimensionalTensions[`god_${perspective.key}`];
        if (tensions && tensions.length > 0) {
          html += '<div style="background: rgba(255, 184, 0, 0.1); border-radius: var(--radius); padding: 0.75rem; margin-top: 0.75rem;">';
          html += '<p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--muted);"><strong style="color: var(--accent);">Dimensional Tension:</strong> ';
          tensions.forEach((tension, i) => {
            if (i > 0) html += '; ';
            html += `High ${this.getDimensionName(perspective.dimensions, tension.high)} and low ${this.getDimensionName(perspective.dimensions, tension.low)}`;
          });
          html += '. This tension is expected and reflects the complexity of meaning-making—not a deficit.</p>';
          html += '</div>';
        }
        
        // Shadow risk
        html += `<div style="background: rgba(211, 47, 47, 0.1); border-left: 3px solid #d32f2f; border-radius: var(--radius); padding: 0.75rem; margin-top: 0.75rem;">`;
        html += `<p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--muted);"><strong style="color: #d32f2f;">Shadow Risk:</strong> ${this.getShadowRisk(perspective.key, 'god')}</p>`;
        html += '</div>';
        
        html += '</div>';
      });
      
      html += '</div>';
    }
    
    // Translation Capacity
    if (this.analysisData.translationCapacity !== null) {
      html += '<div style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--accent); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem;">';
      html += `<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--accent);">Translation Capacity:</strong> ${this.analysisData.translationCapacity.toFixed(1)}/10. This measures your ability to hold meaning across multiple dimensions. Higher capacity indicates greater flexibility in engaging with different modes of apprehension.</p>`;
      html += '</div>';
    }
    
    // Integration Section
    html += this.getIntegrationSection();
    
    container.innerHTML = html;
  }
  
  getIntegrationSection() {
    const primaryGoodLife = this.analysisData.identifiedParadigms
      .filter(p => p.category === 'good_life' && p.confidenceBand === 'primary')[0];
    const primaryGod = this.analysisData.identifiedParadigms
      .filter(p => p.category === 'god' && p.confidenceBand === 'primary')[0];
    
    let html = '<div style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); padding: 2rem; margin-top: 2.5rem; border: 2px solid var(--brand); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">';
    html += '<h3 style="color: var(--brand); margin-bottom: 1rem; text-align: center;">Integration & Practical Orientation</h3>';
    html += '<div style="line-height: 1.8;">';
    
    if (primaryGoodLife) {
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">What This Alignment Makes Easy</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">Your current dominant framing of "The Good Life" as ${primaryGoodLife.name} naturally supports certain ways of engaging with meaning, action, and satisfaction. This alignment makes it easier to find coherence in experiences that match this paradigm.</p>`;
      html += '</div>';
      
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">What This Alignment Makes Hard</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">The same alignment that provides coherence may make it harder to engage with experiences that require different modes of apprehension. When life demands approaches outside your primary paradigm, you may experience tension or confusion.</p>`;
      html += '</div>';
      
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">What to Watch For Under Stress</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">Under pressure, your primary paradigm may become rigid. Watch for patterns where ${primaryGoodLife.name} becomes the only valid way of engaging, excluding other valid approaches. The shadow risk identified above becomes more likely under stress.</p>`;
      html += '</div>';
    }
    
    if (primaryGod) {
      html += '<div style="margin-bottom: 1.5rem;">';
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">God Perspective Integration</h4>`;
      html += `<p style="color: var(--muted); margin: 0;">Your current dominant framing of God as ${primaryGod.name} shapes how you engage with ultimate questions. Remember: this is an interpretive frame, not a claim about ultimate reality. Under stress, this perspective may become dogmatic or defensive.</p>`;
      html += '</div>';
    }
    
    html += '<div style="background: rgba(211, 47, 47, 0.1); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem; text-align: center;">';
    html += '<p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--muted);"><strong style="color: #d32f2f;">Exit Cue:</strong> This map serves orientation. Return to lived action. Use this understanding to support your sovereignty, not to fuel recursive meaning-chasing or metaphysical fixation.</p>';
    html += '</div>';
    
    html += '</div></div>';
    
    return html;
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
    this.godTransitionShown = false;
    this.analysisData = {
      timestamp: new Date().toISOString(),
      goodLife: {},
      god: {},
      identifiedParadigms: [],
      confidenceBands: {},
      dimensionalTensions: {},
      translationCapacity: null
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

