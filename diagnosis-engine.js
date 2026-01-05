// Diagnosis Engine - Main questionnaire logic and calculation system
import { DSM5_CATEGORIES, QUESTION_TEMPLATES, VALIDATION_PAIRS, SCORING_THRESHOLDS, SUB_INQUIRY_QUESTIONS } from './dsm5-data.js';
import { TREATMENT_DATABASE } from './treatment-database.js';

class DiagnosisEngine {
  constructor() {
    this.selectedCategories = [];
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.currentStage = 'selection'; // selection, questionnaire, results
    this.analysisData = {
      timestamp: new Date().toISOString(),
      categories: [],
      answers: {},
      scores: {},
      probabilities: {},
      conclusionVector: {}
    };
    
    this.init();
  }

  init() {
    this.renderCategorySelection();
    this.attachEventListeners();
    this.loadStoredData();
  }

  renderCategorySelection() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';
    
    Object.keys(DSM5_CATEGORIES).forEach(categoryKey => {
      const category = DSM5_CATEGORIES[categoryKey];
      const card = document.createElement('div');
      card.className = 'category-card';
      card.dataset.category = categoryKey;
      card.innerHTML = `
        <h3>${category.name}</h3>
        <p>${Object.keys(category.disorders).length} disorder${Object.keys(category.disorders).length !== 1 ? 's' : ''} available</p>
      `;
      card.addEventListener('click', () => this.toggleCategory(categoryKey, card));
      grid.appendChild(card);
    });
  }

  toggleCategory(categoryKey, cardElement) {
    const index = this.selectedCategories.indexOf(categoryKey);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
      cardElement.classList.remove('selected');
    } else {
      this.selectedCategories.push(categoryKey);
      cardElement.classList.add('selected');
    }
    
    document.getElementById('startAssessment').disabled = this.selectedCategories.length === 0;
  }

  attachEventListeners() {
    document.getElementById('startAssessment').addEventListener('click', () => this.startAssessment());
    document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
    document.getElementById('prevQuestion').addEventListener('click', () => this.prevQuestion());
    document.getElementById('newAssessment').addEventListener('click', () => this.resetAssessment());
    document.getElementById('viewData').addEventListener('click', () => this.viewAnalysisData());
  }

  startAssessment() {
    if (this.selectedCategories.length === 0) return;
    
    this.currentStage = 'questionnaire';
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('questionnaireSection').classList.add('active');
    
    this.buildQuestionSequence();
    this.renderCurrentQuestion();
    this.updateProgress();
  }

  buildQuestionSequence() {
    this.questionSequence = [];
    this.answers = {};
    
    this.selectedCategories.forEach(categoryKey => {
      const category = DSM5_CATEGORIES[categoryKey];
      
      Object.keys(category.disorders).forEach(disorderName => {
        const disorder = category.disorders[disorderName];
        
        // Build questions from criteria
        Object.keys(disorder.criteria).forEach(criterionKey => {
          const criterion = disorder.criteria[criterionKey];
          
          if (criterion.symptoms) {
            // Multiple symptoms to assess
            criterion.symptoms.forEach((symptom, index) => {
              const questionId = `${categoryKey}_${disorderName}_${criterionKey}_${symptom.id}`;
              this.questionSequence.push({
                id: questionId,
                category: categoryKey,
                disorder: disorderName,
                criterion: criterionKey,
                symptom: symptom,
                questionText: this.generateQuestionText(symptom, categoryKey),
                weight: symptom.weight || 1.0,
                type: 'symptom'
              });
            });
          } else {
            // Single criterion question
            const questionId = `${categoryKey}_${disorderName}_${criterionKey}`;
            this.questionSequence.push({
              id: questionId,
              category: categoryKey,
              disorder: disorderName,
              criterion: criterionKey,
              questionText: this.generateCriterionQuestion(criterion, disorderName),
              weight: criterion.weight || 1.0,
              type: 'criterion'
            });
          }
        });
        
        // Add contradictory validation questions
        VALIDATION_PAIRS.forEach(pair => {
          const questionId = `${categoryKey}_${disorderName}_validation_${pair.primary}`;
          this.questionSequence.push({
            id: questionId,
            category: categoryKey,
            disorder: disorderName,
            questionText: pair.contradictory,
            weight: pair.weight,
            type: 'validation',
            primaryQuestion: pair.primary
          });
        });
      });
    });
    
    // Shuffle to reduce order bias, but keep related questions somewhat grouped
    this.shuffleQuestions();
  }

  generateQuestionText(symptom, categoryKey) {
    const templates = QUESTION_TEMPLATES[categoryKey];
    if (templates && templates[symptom.id]) {
      return templates[symptom.id][0] || symptom.text;
    }
    return symptom.text || `To what extent do you experience: ${symptom.id}?`;
  }

  generateCriterionQuestion(criterion, disorderName) {
    return criterion.text || `Regarding ${disorderName}: ${criterion.text}`;
  }

  shuffleQuestions() {
    // Fisher-Yates shuffle with some grouping preservation
    for (let i = this.questionSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questionSequence[i], this.questionSequence[j]] = [this.questionSequence[j], this.questionSequence[i]];
    }
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completeAssessment();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
      <div class="question-block">
        <h3>${question.questionText}</h3>
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
          <span>Not at all / Never</span>
          <span>Moderately / Sometimes</span>
          <span>Extremely / Always</span>
        </div>
        ${question.type === 'validation' ? '<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--muted);"><em>This question helps validate consistency in your responses.</em></p>' : ''}
      </div>
    `;
    
    const slider = document.getElementById('questionInput');
    const valueDisplay = document.getElementById('scaleValue');
    
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
    
    this.updateNavigationButtons();
  }

  updateProgress() {
    const progress = ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
  }

  updateNavigationButtons() {
    document.getElementById('prevQuestion').disabled = this.currentQuestionIndex === 0;
    document.getElementById('nextQuestion').disabled = false;
  }

  nextQuestion() {
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    const slider = document.getElementById('questionInput');
    
    if (slider) {
      this.answers[currentQuestion.id] = parseInt(slider.value);
    }
    
    this.currentQuestionIndex++;
    this.updateProgress();
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      this.completeAssessment();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      const currentQuestion = this.questionSequence[this.currentQuestionIndex];
      const slider = document.getElementById('questionInput');
      
      if (slider) {
        this.answers[currentQuestion.id] = parseInt(slider.value);
      }
      
      this.currentQuestionIndex--;
      this.updateProgress();
      this.renderCurrentQuestion();
    }
  }

  completeAssessment() {
    this.currentStage = 'results';
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.calculateResults();
    this.renderResults();
    this.saveResults();
  }

  calculateResults() {
    const scores = {};
    const probabilities = {};
    
    this.selectedCategories.forEach(categoryKey => {
      const category = DSM5_CATEGORIES[categoryKey];
      
      Object.keys(category.disorders).forEach(disorderName => {
        const disorder = category.disorders[disorderName];
        let totalScore = 0;
        let maxPossibleScore = 0;
        let criteriaMet = {};
        
        Object.keys(disorder.criteria).forEach(criterionKey => {
          const criterion = disorder.criteria[criterionKey];
          
          if (criterion.symptoms) {
            let criterionScore = 0;
            let criterionMax = 0;
            let symptomsMet = 0;
            
            criterion.symptoms.forEach(symptom => {
              const questionId = `${categoryKey}_${disorderName}_${criterionKey}_${symptom.id}`;
              const answer = this.answers[questionId] || 0;
              const normalizedAnswer = answer / 10; // Convert 0-10 to 0-1
              const weightedScore = normalizedAnswer * (symptom.weight || 1.0);
              
              criterionScore += weightedScore;
              criterionMax += (symptom.weight || 1.0);
              
              if (normalizedAnswer >= 0.6) { // Threshold for symptom presence
                symptomsMet++;
              }
            });
            
            const criterionMet = symptomsMet >= (criterion.threshold || criterion.symptoms.length);
            criteriaMet[criterionKey] = criterionMet;
            
            if (criterionMet) {
              totalScore += criterionScore;
            }
            maxPossibleScore += criterionMax;
          } else {
            const questionId = `${categoryKey}_${disorderName}_${criterionKey}`;
            const answer = this.answers[questionId] || 0;
            const normalizedAnswer = answer / 10;
            const weightedScore = normalizedAnswer * (criterion.weight || 1.0);
            
            totalScore += weightedScore;
            maxPossibleScore += (criterion.weight || 1.0);
            
            criteriaMet[criterionKey] = normalizedAnswer >= 0.6;
          }
        });
        
        // Apply validation adjustments
        const validationAdjustment = this.calculateValidationAdjustment(categoryKey, disorderName);
        
        // Calculate probability
        const rawProbability = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
        const adjustedProbability = Math.max(0, Math.min(1, rawProbability * validationAdjustment));
        
        scores[disorderName] = {
          raw: totalScore,
          max: maxPossibleScore,
          criteriaMet: criteriaMet,
          validationAdjustment: validationAdjustment
        };
        
        probabilities[disorderName] = adjustedProbability;
      });
    });
    
    this.analysisData.scores = scores;
    this.analysisData.probabilities = probabilities;
    this.analysisData.answers = { ...this.answers };
    this.analysisData.categories = [...this.selectedCategories];
    
    // Build conclusion vector
    this.buildConclusionVector();
  }

  calculateValidationAdjustment(categoryKey, disorderName) {
    let adjustment = 1.0;
    let validationCount = 0;
    let inconsistencyScore = 0;
    
    VALIDATION_PAIRS.forEach(pair => {
      const primaryId = `${categoryKey}_${disorderName}_${Object.keys(DSM5_CATEGORIES[categoryKey].disorders[disorderName].criteria)[0]}_${pair.primary}`;
      const validationId = `${categoryKey}_${disorderName}_validation_${pair.primary}`;
      
      const primaryAnswer = this.answers[primaryId];
      const validationAnswer = this.answers[validationId];
      
      if (primaryAnswer !== undefined && validationAnswer !== undefined) {
        validationCount++;
        // Check for inconsistency (high primary, high validation = inconsistent)
        const primaryNormalized = primaryAnswer / 10;
        const validationNormalized = validationAnswer / 10;
        const inconsistency = Math.abs(primaryNormalized - (1 - validationNormalized));
        inconsistencyScore += inconsistency;
      }
    });
    
    if (validationCount > 0) {
      const avgInconsistency = inconsistencyScore / validationCount;
      // Reduce probability if high inconsistency
      adjustment = 1.0 - (avgInconsistency * 0.3); // Max 30% reduction
    }
    
    return Math.max(0.5, adjustment); // Minimum 50% adjustment
  }

  buildConclusionVector() {
    const vector = {
      primaryDiagnosis: null,
      primaryProbability: 0,
      secondaryDiagnoses: [],
      requiresSubInquiry: [],
      overallSeverity: 'low',
      recommendation: ''
    };
    
    // Find primary diagnosis
    Object.keys(this.analysisData.probabilities).forEach(disorder => {
      const prob = this.analysisData.probabilities[disorder];
      if (prob > vector.primaryProbability) {
        if (vector.primaryDiagnosis) {
          vector.secondaryDiagnoses.push({
            disorder: vector.primaryDiagnosis,
            probability: vector.primaryProbability
          });
        }
        vector.primaryDiagnosis = disorder;
        vector.primaryProbability = prob;
      } else if (prob >= SCORING_THRESHOLDS.moderate_probability) {
        vector.secondaryDiagnoses.push({
          disorder: disorder,
          probability: prob
        });
      }
    });
    
    // Check for sub-inquiry needs
    Object.keys(this.analysisData.probabilities).forEach(disorder => {
      const prob = this.analysisData.probabilities[disorder];
      if (prob >= SCORING_THRESHOLDS.requires_sub_inquiry && 
          prob < SCORING_THRESHOLDS.high_probability) {
        vector.requiresSubInquiry.push(disorder);
      }
    });
    
    // Determine overall severity
    if (vector.primaryProbability >= SCORING_THRESHOLDS.high_probability) {
      vector.overallSeverity = 'high';
      vector.recommendation = 'Consider professional evaluation. High probability indicators present.';
    } else if (vector.primaryProbability >= SCORING_THRESHOLDS.moderate_probability) {
      vector.overallSeverity = 'moderate';
      vector.recommendation = 'Some indicators present. Professional consultation recommended for accurate assessment.';
    } else {
      vector.overallSeverity = 'low';
      vector.recommendation = 'Limited indicators. Continue self-monitoring.';
    }
    
    this.analysisData.conclusionVector = vector;
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    const vector = this.analysisData.conclusionVector;
    const primaryDiagnosis = vector.primaryDiagnosis;
    const treatmentData = TREATMENT_DATABASE[primaryDiagnosis] || null;
    
    let html = `
      <div class="diagnosis-result">
        <h3>Primary Assessment: ${primaryDiagnosis || 'No clear diagnosis'}</h3>
        <div class="probability-bar">
          <div class="probability-fill" style="width: ${vector.primaryProbability * 100}%">
            ${Math.round(vector.primaryProbability * 100)}%
          </div>
        </div>
        <p class="probability-label">Probability Score: ${Math.round(vector.primaryProbability * 100)}%</p>
        <p style="margin-top: 1rem;"><strong>Recommendation:</strong> ${vector.recommendation}</p>
      </div>
    `;
    
    // Display comprehensive treatment and theory information for primary diagnosis
    if (treatmentData && primaryDiagnosis) {
      html += this.renderTreatmentInformation(primaryDiagnosis, treatmentData);
    }
    
    if (vector.secondaryDiagnoses.length > 0) {
      html += '<h3 style="margin-top: 2rem;">Secondary Considerations</h3>';
      vector.secondaryDiagnoses.forEach(secondary => {
        html += `
          <div class="diagnosis-result">
            <h3>${secondary.disorder}</h3>
            <div class="probability-bar">
              <div class="probability-fill" style="width: ${secondary.probability * 100}%">
                ${Math.round(secondary.probability * 100)}%
              </div>
            </div>
            <p class="probability-label">Probability Score: ${Math.round(secondary.probability * 100)}%</p>
          </div>
        `;
      });
    }
    
    if (vector.requiresSubInquiry.length > 0) {
      html += `
        <div class="sub-inquiry-prompt">
          <h4>Additional Inquiry Recommended</h4>
          <p>The following conditions showed moderate probability and may benefit from more detailed assessment:</p>
          <ul>
            ${vector.requiresSubInquiry.map(d => `<li>${d}</li>`).join('')}
          </ul>
          <p style="margin-top: 1rem;"><em>Note: This would require professional evaluation to properly differentiate.</em></p>
        </div>
      `;
    }
    
    html += `
      <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(0,0,0,0.05); border-radius: var(--radius);">
        <h4>Important Reminders</h4>
        <ul style="margin-top: 1rem;">
          <li>These results are based on self-reporting and have inherent limitations.</li>
          <li>DSM-5 diagnosis requires clinical judgment and professional evaluation.</li>
          <li>Many conditions share overlapping symptoms; differential diagnosis is complex.</li>
          <li>If you have concerns, please consult with a licensed mental health professional.</li>
        </ul>
      </div>
    `;
    
    container.innerHTML = html;
  }

  renderTreatmentInformation(disorderName, treatmentData) {
    let html = `<div class="treatment-section" style="margin-top: 3rem; padding: 2rem; background: rgba(255,255,255,0.9); border-radius: var(--radius); box-shadow: var(--shadow);">`;
    html += `<h2 style="margin-bottom: 2rem; color: var(--brand);">Comprehensive Information: ${disorderName}</h2>`;
    
    // Treatments
    if (treatmentData.treatments) {
      html += `<div class="treatment-category"><h3 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--brand);">Treatment Options</h3>`;
      
      if (treatmentData.treatments.behavioral?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Behavioral Treatments</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.behavioral.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.dietary?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Dietary Interventions</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.dietary.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.pharmacological?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Pharmacological Treatments</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.pharmacological.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.alternativeHealth?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Alternative Health Approaches</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.alternativeHealth.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.westernMedicine?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Western Medical Interventions</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.westernMedicine.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.treatments.easternMedicine?.length > 0) {
        html += `<div class="treatment-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Eastern Medicine Approaches</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.treatments.easternMedicine.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      html += `</div>`;
    }
    
    // Theoretical Frameworks
    if (treatmentData.theories) {
      html += `<div class="theory-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Theoretical Frameworks</h3>`;
      
      if (treatmentData.theories.biophysical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Biophysical Perspectives</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.biophysical.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.theories.metaphysical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Metaphysical Perspectives</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.metaphysical.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.theories.biochemical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Biochemical Factors</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.biochemical.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      if (treatmentData.theories.mythopoetical?.length > 0) {
        html += `<div class="theory-subcategory"><h4 style="margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600;">Mythopoetical Perspectives</h4><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
        treatmentData.theories.mythopoetical.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
      
      html += `</div>`;
    }
    
    // Management Strategies
    if (treatmentData.managementStrategies?.length > 0) {
      html += `<div class="management-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Management Strategies</h3><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
      treatmentData.managementStrategies.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }
    
    // Potential Causes
    if (treatmentData.potentialCauses?.length > 0) {
      html += `<div class="causes-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Potential Causes</h3><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
      treatmentData.potentialCauses.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }
    
    // Environmental Factors
    if (treatmentData.environmentalFactors?.length > 0) {
      html += `<div class="environment-category"><h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--brand);">Environmental Factors</h3><ul style="margin-left: 1.5rem; line-height: 1.8;">`;
      treatmentData.environmentalFactors.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }
    
    html += `</div>`;
    return html;
  }

  saveProgress() {
    const progressData = {
      selectedCategories: this.selectedCategories,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('diagnosisProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('diagnosisProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.selectedCategories = data.selectedCategories || [];
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        
        // Restore category selections
        this.selectedCategories.forEach(categoryKey => {
          const card = document.querySelector(`[data-category="${categoryKey}"]`);
          if (card) card.classList.add('selected');
        });
        
        if (this.selectedCategories.length > 0) {
          document.getElementById('startAssessment').disabled = false;
        }
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }
  }

  saveResults() {
    // Save to localStorage for history
    const history = JSON.parse(localStorage.getItem('diagnosisHistory') || '[]');
    history.push({
      ...this.analysisData,
      id: Date.now()
    });
    
    // Keep only last 10 assessments
    if (history.length > 10) {
      history.shift();
    }
    
    localStorage.setItem('diagnosisHistory', JSON.stringify(history));
    sessionStorage.removeItem('diagnosisProgress');
  }

  viewAnalysisData() {
    const dataStr = JSON.stringify(this.analysisData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnosis-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  resetAssessment() {
    this.selectedCategories = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.currentStage = 'selection';
    this.analysisData = {
      timestamp: new Date().toISOString(),
      categories: [],
      answers: {},
      scores: {},
      probabilities: {},
      conclusionVector: {}
    };
    
    sessionStorage.removeItem('diagnosisProgress');
    
    document.getElementById('categorySelection').style.display = 'block';
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.renderCategorySelection();
    document.getElementById('startAssessment').disabled = true;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.diagnosisEngine = new DiagnosisEngine();
});

