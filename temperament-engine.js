// Temperament Analyzer Engine
// Maps position on masculine-feminine temperament spectrum

import { TEMPERAMENT_DIMENSIONS } from './temperament-data/temperament-dimensions.js';
import { INTIMATE_DYNAMICS } from './temperament-data/intimate-dynamics.js';
import { ATTRACTION_RESPONSIVENESS } from './temperament-data/attraction-responsiveness.js';
import { TEMPERAMENT_SCORING } from './temperament-data/temperament-scoring.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class TemperamentEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      dimensionScores: {},
      overallTemperament: null,
      variationAnalysis: {},
      allAnswers: {},
      questionSequence: []
    };

    this.init();
  }

  init() {
    this.buildQuestionSequence();
    this.attachEventListeners();
    this.loadStoredData();
  }

  buildQuestionSequence() {
    this.questionSequence = [];
    
    // Add questions from all dimension categories
    Object.keys(TEMPERAMENT_DIMENSIONS).forEach(dimKey => {
      const dimension = TEMPERAMENT_DIMENSIONS[dimKey];
      dimension.questions.forEach(q => {
        this.questionSequence.push({
          id: q.id,
          type: 'dimension',
          dimension: dimKey,
          dimensionName: dimension.name,
          question: q.question,
          description: dimension.description,
          masculineWeight: q.masculineWeight,
          feminineWeight: q.feminineWeight
        });
      });
    });

    // Add intimate dynamics questions
    Object.keys(INTIMATE_DYNAMICS).forEach(catKey => {
      const category = INTIMATE_DYNAMICS[catKey];
      category.questions.forEach(q => {
        this.questionSequence.push({
          id: q.id,
          type: 'intimate',
          category: catKey,
          categoryName: category.name,
          question: q.question,
          description: category.description,
          masculineWeight: q.masculineWeight,
          feminineWeight: q.feminineWeight
        });
      });
    });

    // Add attraction responsiveness questions
    Object.keys(ATTRACTION_RESPONSIVENESS).forEach(catKey => {
      const category = ATTRACTION_RESPONSIVENESS[catKey];
      category.questions.forEach(q => {
        this.questionSequence.push({
          id: q.id,
          type: 'attraction',
          category: catKey,
          categoryName: category.name,
          question: q.question,
          description: category.description,
          masculineWeight: q.masculineWeight,
          feminineWeight: q.feminineWeight
        });
      });
    });

    // Shuffle for variety (optional - can be removed for consistency)
    // this.questionSequence.sort(() => Math.random() - 0.5);
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
    document.getElementById('questionnaireSection').classList.add('active');
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
    this.updateProgress();
    this.saveProgress();
  }

  renderCurrentQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;

    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.calculateResults();
      this.renderResults();
      return;
    }

    const currentQ = this.questionSequence[this.currentQuestionIndex];
    const savedAnswer = this.answers[currentQ.id] !== undefined ? this.answers[currentQ.id] : 5;

    let categoryInfo = '';
    if (currentQ.dimensionName) {
      categoryInfo = `<p class="description" style="color: var(--muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${currentQ.dimensionName}</p>`;
    } else if (currentQ.categoryName) {
      categoryInfo = `<p class="description" style="color: var(--muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${currentQ.categoryName}</p>`;
    }

    questionContainer.innerHTML = `
      <div class="question-block">
        ${categoryInfo}
        <h3>${currentQ.question}</h3>
        ${currentQ.description ? `<p class="description" style="margin-top: 0.5rem; font-style: italic; color: var(--muted);">${currentQ.description}</p>` : ''}
        <div class="scale-container">
          <div class="scale-input">
            <input type="range" min="0" max="10" value="${savedAnswer}" class="slider" id="questionSlider" step="1">
            <div class="scale-labels">
              <span>Not at all / Never (0-2)</span>
              <span>Moderately / Sometimes (5-6)</span>
              <span>Extremely / Always (9-10)</span>
            </div>
          </div>
          <span class="scale-value" id="sliderValue">${savedAnswer}</span>
        </div>
        <div style="margin-top: 0.5rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-radius: var(--radius); font-size: 0.9rem; color: var(--muted); line-height: 1.5;">
          <strong>Tip:</strong> Answer based on your authentic experience and preferences, not what you think you "should" be.
        </div>
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

    this.updateProgress();
    this.updateNavigationButtons();
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      const progress = this.questionSequence.length > 0 
        ? ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100 
        : 0;
      progressFill.style.width = `${progress}%`;
    }
    
    const questionCount = document.getElementById('questionCount');
    if (questionCount) {
      const remaining = this.questionSequence.length - this.currentQuestionIndex;
      questionCount.textContent = `${remaining} question${remaining !== 1 ? 's' : ''} remaining`;
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
        ? 'Complete Assessment' 
        : 'Next';
    }
  }

  nextQuestion() {
    const currentQ = this.questionSequence[this.currentQuestionIndex];
    if (this.answers[currentQ.id] === undefined) {
      this.answers[currentQ.id] = 5;
    }

    if (this.currentQuestionIndex < this.questionSequence.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else {
      this.calculateResults();
      this.renderResults();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      const currentQ = this.questionSequence[this.currentQuestionIndex];
      const slider = document.getElementById('questionSlider');
      if (slider && currentQ) {
        this.answers[currentQ.id] = parseInt(slider.value);
      }
      
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  calculateResults() {
    // Calculate dimension scores
    this.analysisData.dimensionScores = {};
    
    // Group answers by dimension/category
    const dimensionGroups = {};
    
    this.questionSequence.forEach(q => {
      const groupKey = q.dimension || q.category || 'other';
      if (!dimensionGroups[groupKey]) {
        dimensionGroups[groupKey] = [];
      }
      dimensionGroups[groupKey].push({
        question: q,
        answer: this.answers[q.id] || 5
      });
    });

    // Calculate weighted scores for each dimension
    let totalMasculineScore = 0;
    let totalFeminineScore = 0;
    let totalWeight = 0;

    Object.keys(dimensionGroups).forEach(groupKey => {
      const group = dimensionGroups[groupKey];
      let groupMasculine = 0;
      let groupFeminine = 0;
      let groupWeight = 0;

      group.forEach(({ question, answer }) => {
        // Normalize answer to -1 to 1 scale (0-10 becomes -1 to 1)
        const normalizedAnswer = (answer - 5) / 5;
        
        // Apply weights
        const masculineContribution = normalizedAnswer * question.masculineWeight;
        const feminineContribution = normalizedAnswer * question.feminineWeight;
        
        // Get dimension weight
        const dimWeight = TEMPERAMENT_SCORING.dimensionWeights[groupKey] || 1.0;
        
        groupMasculine += masculineContribution * dimWeight;
        groupFeminine += feminineContribution * dimWeight;
        groupWeight += dimWeight;
      });

      const avgMasculine = groupWeight > 0 ? groupMasculine / groupWeight : 0;
      const avgFeminine = groupWeight > 0 ? groupFeminine / groupWeight : 0;

      this.analysisData.dimensionScores[groupKey] = {
        masculine: avgMasculine,
        feminine: avgFeminine,
        net: avgMasculine - avgFeminine
      };

      totalMasculineScore += avgMasculine * groupWeight;
      totalFeminineScore += avgFeminine * groupWeight;
      totalWeight += groupWeight;
    });

    // Calculate overall temperament
    const overallMasculine = totalWeight > 0 ? totalMasculineScore / totalWeight : 0;
    const overallFeminine = totalWeight > 0 ? totalFeminineScore / totalWeight : 0;
    const overallNet = overallMasculine - overallFeminine;

    // Normalize to 0-1 scale (where 1 = highly masculine, 0 = highly feminine)
    const normalizedScore = (overallNet + 1) / 2;

    // Determine temperament category
    let temperamentCategory = 'balanced';
    const thresholds = TEMPERAMENT_SCORING.thresholds;
    
    if (normalizedScore >= thresholds.highly_masculine) {
      temperamentCategory = 'highly_masculine';
    } else if (normalizedScore >= thresholds.predominantly_masculine) {
      temperamentCategory = 'predominantly_masculine';
    } else if (normalizedScore >= thresholds.balanced_masculine) {
      temperamentCategory = 'balanced_masculine';
    } else if (normalizedScore >= thresholds.balanced) {
      temperamentCategory = 'balanced';
    } else if (normalizedScore >= thresholds.balanced_feminine) {
      temperamentCategory = 'balanced_feminine';
    } else if (normalizedScore >= thresholds.predominantly_feminine) {
      temperamentCategory = 'predominantly_feminine';
    } else {
      temperamentCategory = 'highly_feminine';
    }

    this.analysisData.overallTemperament = {
      category: temperamentCategory,
      normalizedScore: normalizedScore,
      masculineScore: overallMasculine,
      feminineScore: overallFeminine,
      netScore: overallNet
    };

    // Analyze variation
    this.analyzeVariation();

    // Include all raw answers
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      dimension: q.dimension || q.category,
      name: q.dimensionName || q.categoryName
    }));
  }

  analyzeVariation() {
    // Identify dimensions with significant variation (expected and common)
    this.analysisData.variationAnalysis = {
      highVariationDimensions: [],
      expectedVariations: []
    };

    Object.keys(this.analysisData.dimensionScores).forEach(dimKey => {
      const score = this.analysisData.dimensionScores[dimKey];
      const variation = Math.abs(score.masculine) + Math.abs(score.feminine);
      
      if (variation > 0.5) {
        this.analysisData.variationAnalysis.highVariationDimensions.push({
          dimension: dimKey,
          variation: variation,
          scores: score
        });
      }

      if (TEMPERAMENT_SCORING.expectedVariation.includes(dimKey)) {
        this.analysisData.variationAnalysis.expectedVariations.push({
          dimension: dimKey,
          scores: score
        });
      }
    });
  }

  renderResults() {
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');

    const container = document.getElementById('temperamentResults');
    if (!container) return;

    const temperament = this.analysisData.overallTemperament;
    const interpretation = TEMPERAMENT_SCORING.interpretation[temperament.category];

    let html = `
      <div style="background: rgba(255, 184, 0, 0.15); border: 3px solid var(--brand); border-radius: var(--radius); padding: 2rem; margin-bottom: 2rem;">
        <h2 style="color: var(--brand); margin-bottom: 1rem; font-size: 1.5rem;">Your Temperament Profile</h2>
        <div style="background: rgba(255, 255, 255, 0.9); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1.5rem;">
          <h3 style="color: var(--brand); margin-bottom: 1rem;">${interpretation.label}</h3>
          <p style="color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">${interpretation.description}</p>
          
          <div style="margin-top: 1.5rem;">
            <h4 style="color: var(--brand); margin-bottom: 0.75rem;">Key Characteristics:</h4>
            <ul style="margin-left: 1.5rem; line-height: 1.8;">
              ${interpretation.characteristics.map(char => `<li style="margin-bottom: 0.5rem;">${char}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0,0,0,0.05); border-radius: var(--radius);">
            <p style="font-style: italic; color: var(--muted); line-height: 1.6;"><strong>Note on Variation:</strong> ${interpretation.variations}</p>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.9); padding: 1.5rem; border-radius: var(--radius);">
          <h4 style="color: var(--brand); margin-bottom: 1rem;">Temperament Spectrum Position</h4>
          <div style="position: relative; height: 40px; background: linear-gradient(to right, rgba(0,123,255,0.3), rgba(255,192,203,0.3)); border-radius: var(--radius); margin-bottom: 1rem; border: 2px solid var(--brand);">
            <div style="position: absolute; top: 50%; left: ${temperament.normalizedScore * 100}%; transform: translate(-50%, -50%); width: 20px; height: 20px; background: var(--brand); border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--muted);">
            <span>Highly Feminine (0%)</span>
            <span>Balanced (50%)</span>
            <span>Highly Masculine (100%)</span>
          </div>
          <p style="text-align: center; margin-top: 0.5rem; font-weight: 600; color: var(--brand);">
            Your Position: ${(temperament.normalizedScore * 100).toFixed(1)}% on the spectrum
          </p>
        </div>
      </div>
    `;

    // Dimension breakdown
    html += '<div style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); padding: 2rem; margin-bottom: 2rem;">';
    html += '<h3 style="color: var(--brand); margin-bottom: 1.5rem;">Dimension Breakdown</h3>';
    
    Object.keys(this.analysisData.dimensionScores).forEach(dimKey => {
      const score = this.analysisData.dimensionScores[dimKey];
      const dimName = this.questionSequence.find(q => (q.dimension || q.category) === dimKey)?.dimensionName || 
                     this.questionSequence.find(q => (q.dimension || q.category) === dimKey)?.categoryName || 
                     dimKey;
      
      const netScore = score.net;
      const normalizedDimScore = (netScore + 1) / 2;
      
      html += `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(0,0,0,0.03); border-radius: var(--radius); border-left: 3px solid var(--brand);">
          <h4 style="color: var(--brand); margin-bottom: 0.5rem;">${dimName}</h4>
          <div style="position: relative; height: 30px; background: linear-gradient(to right, rgba(0,123,255,0.2), rgba(255,192,203,0.2)); border-radius: 4px; margin-bottom: 0.5rem;">
            <div style="position: absolute; top: 50%; left: ${normalizedDimScore * 100}%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: var(--brand); border-radius: 50%; border: 2px solid white;"></div>
          </div>
          <p style="font-size: 0.85rem; color: var(--muted);">
            Masculine: ${(score.masculine * 100).toFixed(0)}% | Feminine: ${(score.feminine * 100).toFixed(0)}% | Net: ${(netScore * 100).toFixed(0)}%
          </p>
        </div>
      `;
    });
    
    html += '</div>';

    // Variation analysis
    if (this.analysisData.variationAnalysis.expectedVariations.length > 0) {
      html += '<div style="background: rgba(255, 184, 0, 0.1); border: 2px solid var(--accent); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem;">';
      html += '<h4 style="color: var(--brand); margin-bottom: 1rem;">Expected Variations</h4>';
      html += '<p style="color: var(--muted); line-height: 1.6; margin-bottom: 1rem;">The following dimensions commonly show variation across themes and dynamics. This is normal and expected:</p>';
      html += '<ul style="margin-left: 1.5rem; line-height: 1.8;">';
      this.analysisData.variationAnalysis.expectedVariations.forEach(variation => {
        const dimName = this.questionSequence.find(q => (q.dimension || q.category) === variation.dimension)?.dimensionName || 
                       this.questionSequence.find(q => (q.dimension || q.category) === variation.dimension)?.categoryName || 
                       variation.dimension;
        html += `<li style="margin-bottom: 0.5rem;">${dimName}</li>`;
      });
      html += '</ul></div>';
    }

    container.innerHTML = html;
    this.saveProgress();
  }

  exportAnalysis(format = 'json') {
    const aiInstructions = `
This temperament analysis maps the user's position on the masculine-feminine temperament spectrum based on comprehensive questions across behavioral patterns, intimate dynamics, and attraction responsiveness.

KEY INTERPRETATION GUIDELINES:
- Temperament is NOT the same as biological sex or gender identity
- Variation across dimensions is expected and common
- The spectrum position indicates archetypal energy patterns, not rigid roles
- Both masculine and feminine qualities can coexist in the same individual
- Use this data to understand relationship polarity, compatibility, and personal development needs

SCORING INTERPRETATION:
- Normalized Score: 0.0-1.0 scale where 1.0 = highly masculine, 0.0 = highly feminine, 0.5 = balanced
- Dimension scores show variation across different life areas
- Expected variations indicate dimensions where mixed responses are common and healthy

RELATIONSHIP POLARITY IMPLICATIONS:
- Higher polarity (greater difference between partners) typically increases attraction
- Understanding temperament helps optimize relationship dynamics
- Both partners can develop complementary qualities while honoring their core temperament

AI AGENT CONFIGURATION:
- Use temperament data to inform coaching style and communication approach
- Masculine-leaning users may respond better to direct, goal-oriented guidance
- Feminine-leaning users may respond better to emotional support and clarity
- Balanced temperaments may need both approaches depending on context
`;

    if (format === 'csv') {
      exportForAIAgent(this.analysisData, 'temperament-analysis', 'csv', aiInstructions);
    } else {
      exportJSON(this.analysisData, 'temperament-analysis');
    }
  }

  saveProgress() {
    const progressData = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('temperamentProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('temperamentProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex < this.questionSequence.length) {
          // Resume assessment
          document.getElementById('questionnaireSection').classList.add('active');
          this.renderCurrentQuestion();
        }
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }
  }

  clearAllCachedData() {
    if (confirm('Are you sure you want to clear all cached data? This will clear all saved progress.')) {
      sessionStorage.removeItem('temperamentProgress');
      this.resetAssessment();
      alert('All cached data has been cleared.');
    }
  }

  resetAssessment() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      dimensionScores: {},
      overallTemperament: null,
      variationAnalysis: {},
      allAnswers: {},
      questionSequence: []
    };
    
    sessionStorage.removeItem('temperamentProgress');
    
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.renderCurrentQuestion();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TemperamentEngine();
  });
} else {
  new TemperamentEngine();
}

