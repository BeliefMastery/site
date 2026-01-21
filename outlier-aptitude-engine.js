import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, SecurityUtils } from './shared/utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { exportJSON, downloadFile } from './shared/export-utils.js';

let APTITUDE_DIMENSIONS, APTITUDE_QUESTIONS, MARKET_PROJECTION_MATRIX, VALIDATION_PROMPTS, APTITUDE_ACUITY_DOMAINS;

export class OutlierAptitudeEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.analysisData = this.getEmptyAnalysisData();

    this.ui = new EngineUIController({
      idle: {
        show: ['#introSection', '#actionButtonsSection', '#disclaimerSection'],
        hide: ['#questionnaireSection', '#resultsSection']
      },
      assessment: {
        show: ['#questionnaireSection'],
        hide: ['#introSection', '#actionButtonsSection', '#disclaimerSection', '#resultsSection']
      },
      results: {
        show: ['#resultsSection'],
        hide: ['#introSection', '#actionButtonsSection', '#disclaimerSection', '#questionnaireSection']
      }
    });

    this.debugReporter = createDebugReporter('OutlierAptitudeEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();

    this.dataStore = new DataStore('outlier-aptitude-assessment', '1.0.0');
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.bindEvents();
      await this.loadStoredData();
      if (this.shouldAutoGenerateSample()) {
        this.generateSampleReport();
        return;
      }
      this.ui.transition('idle');
    } catch (error) {
      this.debugReporter.logError(error, 'OutlierAptitudeEngine init');
      ErrorHandler.showUserError('Failed to initialize the Aptitude assessment.');
    }
  }

  async loadData() {
    if (APTITUDE_DIMENSIONS) return;
    const module = await loadDataModule('./outlier-aptitude-data.js', 'Aptitude Data');
    APTITUDE_DIMENSIONS = module.APTITUDE_DIMENSIONS;
    APTITUDE_QUESTIONS = module.APTITUDE_QUESTIONS;
    MARKET_PROJECTION_MATRIX = module.MARKET_PROJECTION_MATRIX;
    VALIDATION_PROMPTS = module.VALIDATION_PROMPTS;
    APTITUDE_ACUITY_DOMAINS = module.APTITUDE_ACUITY_DOMAINS;
  }

  bindEvents() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) startBtn.addEventListener('click', () => this.startAssessment());

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) sampleBtn.addEventListener('click', () => this.generateSampleReport());

    const resumeBtn = document.getElementById('resumeAssessment');
    if (resumeBtn) resumeBtn.addEventListener('click', () => this.loadStoredData());

    const resetBtn = document.getElementById('clearCacheBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetAssessment());

    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());

    const exportJSONBtn = document.getElementById('exportJSON');
    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportJSONBtn) exportJSONBtn.addEventListener('click', () => exportJSON(this.analysisData, 'outlier-aptitude'));
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', () => this.exportCSV());
  }

  shouldAutoGenerateSample() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sample')) return false;
    const value = params.get('sample');
    return value === null || value === '' || value === '1' || value === 'true';
  }

  startAssessment() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.currentStage = 'questions';
    this.acuityProfile = { primary: '', secondary: '', tertiary: '', additional: [] };
    this.analysisData = this.getEmptyAnalysisData();
    this.ui.transition('assessment');
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderCurrentQuestion() {
    if (this.currentStage === 'acuity') {
      this.renderAcuityStep();
      return;
    }
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = document.getElementById('questionCount');
    const progressFill = document.getElementById('progressFill');
    const question = APTITUDE_QUESTIONS[this.currentQuestionIndex];
    if (!question || !questionContainer) return;

    if (questionCount) {
      questionCount.textContent = `Question ${this.currentQuestionIndex + 1} of ${APTITUDE_QUESTIONS.length}`;
    }
    if (progressFill) {
      progressFill.style.width = `${((this.currentQuestionIndex + 1) / APTITUDE_QUESTIONS.length) * 100}%`;
    }

    const options = [
      { value: 1, label: 'Strongly Disagree' },
      { value: 2, label: 'Disagree' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Agree' },
      { value: 5, label: 'Strongly Agree' }
    ];
    const selected = this.answers[question.id];
    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>${SecurityUtils.sanitizeHTML(question.text)}</h3>
        <div class="options-container">
          ${options.map(option => `
            <label class="option-label ${selected === option.value ? 'selected' : ''}">
              <input type="radio" name="question_${question.id}" value="${option.value}" ${selected === option.value ? 'checked' : ''}>
              <span>${option.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    questionContainer.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        this.answers[question.id] = parseInt(input.value, 10);
        this.saveProgress();
      });
    });

    this.updateNavButtons();
  }

  updateNavButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    if (prevBtn) prevBtn.disabled = this.currentStage === 'questions' && this.currentQuestionIndex === 0;
    if (nextBtn) {
      if (this.currentStage === 'acuity') {
        nextBtn.textContent = 'Finish';
      } else {
        nextBtn.textContent = this.currentQuestionIndex === APTITUDE_QUESTIONS.length - 1 ? 'Next' : 'Next';
      }
    }
  }

  prevQuestion() {
    if (this.currentStage === 'acuity') {
      this.currentStage = 'questions';
      this.currentQuestionIndex = APTITUDE_QUESTIONS.length - 1;
      this.renderCurrentQuestion();
      this.saveProgress();
      return;
    }
    if (this.currentQuestionIndex === 0) return;
    this.currentQuestionIndex -= 1;
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  nextQuestion() {
    if (this.currentStage === 'acuity') {
      if (!this.validateAcuitySelections()) return;
      this.completeAssessment();
      return;
    }
    const question = APTITUDE_QUESTIONS[this.currentQuestionIndex];
    if (!question || typeof this.answers[question.id] !== 'number') {
      ErrorHandler.showUserError('Please select a response to continue.');
      return;
    }
    if (this.currentQuestionIndex < APTITUDE_QUESTIONS.length - 1) {
      this.currentQuestionIndex += 1;
      this.renderCurrentQuestion();
      this.saveProgress();
      return;
    }
    this.currentStage = 'acuity';
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderAcuityStep() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = document.getElementById('questionCount');
    const progressFill = document.getElementById('progressFill');
    if (!questionContainer) return;
    if (questionCount) {
      questionCount.textContent = 'Acuity Profile';
    }
    if (progressFill) {
      progressFill.style.width = '100%';
    }
    const options = APTITUDE_ACUITY_DOMAINS.map(domain => `<option value="${domain.id}">${domain.name}</option>`).join('');
    const additionalSelections = new Set(this.acuityProfile.additional || []);
    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>Rank Your Dominant Acuity Domains</h3>
        <p class="form-help">Choose the top three domains that best describe how others would rate your strengths. Then select any additional domains that also apply.</p>
        <div class="form-group">
          <label for="acuityPrimary">Primary Domain</label>
          <select id="acuityPrimary">
            <option value="">Select primary</option>
            ${options}
          </select>
        </div>
        <div class="form-group">
          <label for="acuitySecondary">Secondary Domain</label>
          <select id="acuitySecondary">
            <option value="">Select secondary</option>
            ${options}
          </select>
        </div>
        <div class="form-group">
          <label for="acuityTertiary">Tertiary Domain</label>
          <select id="acuityTertiary">
            <option value="">Select tertiary</option>
            ${options}
          </select>
        </div>
        <div class="form-group">
          <label>Additional Domains (optional)</label>
          <div class="options-container">
            ${APTITUDE_ACUITY_DOMAINS.map(domain => `
              <label class="option-label">
                <input type="checkbox" value="${domain.id}" ${additionalSelections.has(domain.id) ? 'checked' : ''}>
                <span>${SecurityUtils.sanitizeHTML(domain.name)}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="panel panel-outline">
          <h4 class="panel-title">Bias‑Mitigating Prompts</h4>
          <ul class="feature-list">
            ${APTITUDE_ACUITY_DOMAINS.map(domain => `<li><strong>${SecurityUtils.sanitizeHTML(domain.name)}:</strong> ${SecurityUtils.sanitizeHTML(domain.biasPrompt)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    const primarySelect = document.getElementById('acuityPrimary');
    const secondarySelect = document.getElementById('acuitySecondary');
    const tertiarySelect = document.getElementById('acuityTertiary');
    if (primarySelect) primarySelect.value = this.acuityProfile.primary || '';
    if (secondarySelect) secondarySelect.value = this.acuityProfile.secondary || '';
    if (tertiarySelect) tertiarySelect.value = this.acuityProfile.tertiary || '';

    const updateSelections = () => {
      this.acuityProfile.primary = primarySelect?.value || '';
      this.acuityProfile.secondary = secondarySelect?.value || '';
      this.acuityProfile.tertiary = tertiarySelect?.value || '';
      const additional = Array.from(questionContainer.querySelectorAll('input[type="checkbox"]'))
        .filter(input => input.checked)
        .map(input => input.value)
        .filter(id => ![this.acuityProfile.primary, this.acuityProfile.secondary, this.acuityProfile.tertiary].includes(id));
      this.acuityProfile.additional = additional;
      this.saveProgress();
    };

    [primarySelect, secondarySelect, tertiarySelect].forEach(select => {
      if (!select) return;
      select.addEventListener('change', updateSelections);
    });

    questionContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', updateSelections);
    });

    this.updateNavButtons();
  }

  validateAcuitySelections() {
    const { primary, secondary, tertiary } = this.acuityProfile;
    if (!primary || !secondary || !tertiary) {
      ErrorHandler.showUserError('Please select primary, secondary, and tertiary acuity domains.');
      return false;
    }
    const selected = [primary, secondary, tertiary];
    if (new Set(selected).size !== selected.length) {
      ErrorHandler.showUserError('Acuity domains must be unique across primary, secondary, and tertiary.');
      return false;
    }
    return true;
  }

  scoreDimensions() {
    const scores = {};
    APTITUDE_DIMENSIONS.forEach(dim => { scores[dim.id] = 0; });
    const totals = {};
    APTITUDE_DIMENSIONS.forEach(dim => { totals[dim.id] = 0; });

    APTITUDE_QUESTIONS.forEach(question => {
      const answer = this.answers[question.id];
      if (!answer) return;
      Object.entries(question.weights || {}).forEach(([dimId, weight]) => {
        scores[dimId] += answer * weight;
        totals[dimId] += weight * 5;
      });
    });

    const normalized = {};
    Object.keys(scores).forEach(dimId => {
      normalized[dimId] = totals[dimId] ? scores[dimId] / totals[dimId] : 0;
    });
    return normalized;
  }

  buildMarketProjection(dimensionScores) {
    return MARKET_PROJECTION_MATRIX.map(role => {
      const fit = Object.entries(role.aptitudes).reduce((sum, [dimId, weight]) => {
        return sum + (dimensionScores[dimId] || 0) * weight;
      }, 0);
      return { ...role, fitScore: fit };
    }).sort((a, b) => b.fitScore - a.fitScore).slice(0, 5);
  }

  completeAssessment() {
    let dimensionScores = this.scoreDimensions();
    dimensionScores = this.applyAcuityWeighting(dimensionScores, this.acuityProfile);
    const projection = this.buildMarketProjection(dimensionScores);
    const sortedDims = APTITUDE_DIMENSIONS
      .map(dim => ({ ...dim, score: dimensionScores[dim.id] || 0 }))
      .sort((a, b) => b.score - a.score);

    this.analysisData = {
      timestamp: new Date().toISOString(),
      dimensionScores,
      acuityProfile: { ...this.acuityProfile },
      topDimensions: sortedDims.slice(0, 4),
      projection,
      validationPrompts: VALIDATION_PROMPTS
    };
    this.renderResults();
    this.ui.transition('results');
    this.saveProgress();
  }

  renderResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = `
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Top Aptitude Signals</h3>
        <ul class="feature-list">
          ${this.analysisData.topDimensions.map(dim => `
            <li><strong>${SecurityUtils.sanitizeHTML(dim.name)}</strong> — ${(dim.score * 100).toFixed(0)}%</li>
          `).join('')}
        </ul>
      </div>
      <div class="panel panel-outline">
        <h3 class="panel-title">Acuity Dominance</h3>
        <ul class="feature-list">
          <li><strong>Primary:</strong> ${SecurityUtils.sanitizeHTML(this.getAcuityLabel(this.analysisData.acuityProfile?.primary))}</li>
          <li><strong>Secondary:</strong> ${SecurityUtils.sanitizeHTML(this.getAcuityLabel(this.analysisData.acuityProfile?.secondary))}</li>
          <li><strong>Tertiary:</strong> ${SecurityUtils.sanitizeHTML(this.getAcuityLabel(this.analysisData.acuityProfile?.tertiary))}</li>
          ${this.analysisData.acuityProfile?.additional?.length ? `<li><strong>Additional:</strong> ${this.analysisData.acuityProfile.additional.map(id => SecurityUtils.sanitizeHTML(this.getAcuityLabel(id))).join(', ')}</li>` : ''}
        </ul>
      </div>
      <div class="panel panel-outline">
        <h3 class="panel-title">Market Projection Matrix</h3>
        <ul class="feature-list">
          ${this.analysisData.projection.map(role => `
            <li><strong>${SecurityUtils.sanitizeHTML(role.name)}</strong> — Fit ${(role.fitScore * 100).toFixed(0)}% | Growth: ${role.growth} | Automation Resistance: ${role.automationResistance}</li>
          `).join('')}
        </ul>
      </div>
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Validation Prompts</h3>
        <ul class="feature-list">
          ${this.analysisData.validationPrompts.map(prompt => `<li>${SecurityUtils.sanitizeHTML(prompt)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  generateSampleReport() {
    APTITUDE_QUESTIONS.forEach(question => {
      this.answers[question.id] = Math.floor(Math.random() * 5) + 1;
    });
    const domainIds = APTITUDE_ACUITY_DOMAINS.map(domain => domain.id);
    this.acuityProfile = {
      primary: domainIds[0],
      secondary: domainIds[1] || '',
      tertiary: domainIds[2] || '',
      additional: domainIds.slice(3, 5)
    };
    this.completeAssessment();
  }

  exportCSV() {
    const rows = [['Dimension', 'Score']];
    Object.entries(this.analysisData.dimensionScores || {}).forEach(([dim, value]) => {
      rows.push([dim, (value * 100).toFixed(0)]);
    });
    rows.push(['Acuity Primary', this.getAcuityLabel(this.analysisData.acuityProfile?.primary)]);
    rows.push(['Acuity Secondary', this.getAcuityLabel(this.analysisData.acuityProfile?.secondary)]);
    rows.push(['Acuity Tertiary', this.getAcuityLabel(this.analysisData.acuityProfile?.tertiary)]);
    rows.push(['Acuity Additional', (this.analysisData.acuityProfile?.additional || []).map(id => this.getAcuityLabel(id)).join('; ')]);
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csv, 'outlier-aptitude.csv', 'text/csv');
  }

  getEmptyAnalysisData() {
    return {
      timestamp: new Date().toISOString(),
      dimensionScores: {},
      acuityProfile: { primary: '', secondary: '', tertiary: '', additional: [] },
      topDimensions: [],
      projection: [],
      validationPrompts: []
    };
  }

  saveProgress() {
    const progress = {
      currentQuestionIndex: this.currentQuestionIndex,
      currentStage: this.currentStage,
      answers: this.answers,
      acuityProfile: this.acuityProfile,
      analysisData: this.analysisData
    };
    this.dataStore.save('progress', progress);
  }

  async loadStoredData() {
    try {
      const progress = this.dataStore.load('progress');
      if (!progress) return;
      this.currentQuestionIndex = progress.currentQuestionIndex || 0;
      this.currentStage = progress.currentStage || 'questions';
      this.answers = progress.answers || {};
      this.acuityProfile = progress.acuityProfile || { primary: '', secondary: '', tertiary: '', additional: [] };
      this.analysisData = progress.analysisData || this.analysisData;
      if (this.analysisData.topDimensions?.length) {
        this.renderResults();
        this.ui.transition('results');
      } else if (Object.keys(this.answers).length) {
        this.ui.transition('assessment');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
    }
  }

  resetAssessment() {
    this.dataStore.clear();
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.currentStage = 'questions';
    this.acuityProfile = { primary: '', secondary: '', tertiary: '', additional: [] };
    this.analysisData = this.getEmptyAnalysisData();
    this.ui.transition('idle');
  }

  applyAcuityWeighting(dimensionScores, acuityProfile) {
    const weights = {
      iq: { systems: 0.4, scientific: 0.4, diagnostics: 0.3, technical: 0.2 },
      eq: { eq: 0.7, management: 0.3 },
      sq: { systems: 0.4, diagnostics: 0.3, management: 0.2, scientific: 0.2 },
      aq: { field: 0.4, organization: 0.3, learning: 0.2, management: 0.2 },
      cq: { creativity: 0.6, systems: 0.3 },
      tq: { technical: 0.6, diagnostics: 0.3 },
      oq: { organization: 0.7, management: 0.2 },
      lq: { learning: 0.7, scientific: 0.2 }
    };
    const boosts = {
      primary: 0.12,
      secondary: 0.08,
      tertiary: 0.05,
      additional: 0.03
    };

    const applyBoost = (domainId, boost) => {
      const domainWeights = weights[domainId];
      if (!domainWeights) return;
      Object.entries(domainWeights).forEach(([dimId, weight]) => {
        const current = dimensionScores[dimId] || 0;
        const next = Math.min(1, current + boost * weight);
        dimensionScores[dimId] = next;
      });
    };

    if (acuityProfile?.primary) applyBoost(acuityProfile.primary, boosts.primary);
    if (acuityProfile?.secondary) applyBoost(acuityProfile.secondary, boosts.secondary);
    if (acuityProfile?.tertiary) applyBoost(acuityProfile.tertiary, boosts.tertiary);
    (acuityProfile?.additional || []).forEach(id => applyBoost(id, boosts.additional));
    return dimensionScores;
  }

  getAcuityLabel(id) {
    if (!id) return '—';
    const domain = APTITUDE_ACUITY_DOMAINS?.find(item => item.id === id);
    return domain ? domain.name : id;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.outlierAptitudeEngine = new OutlierAptitudeEngine();
});

