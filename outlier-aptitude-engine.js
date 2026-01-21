import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, SecurityUtils } from './shared/utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { exportJSON, downloadFile } from './shared/export-utils.js';

let APTITUDE_DIMENSIONS, APTITUDE_QUESTIONS, MARKET_PROJECTION_MATRIX, VALIDATION_PROMPTS;

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
      ErrorHandler.showUserError('Failed to initialize the Outlier Aptitude assessment.');
    }
  }

  async loadData() {
    if (APTITUDE_DIMENSIONS) return;
    const module = await loadDataModule('./outlier-aptitude-data.js', 'Outlier Aptitude Data');
    APTITUDE_DIMENSIONS = module.APTITUDE_DIMENSIONS;
    APTITUDE_QUESTIONS = module.APTITUDE_QUESTIONS;
    MARKET_PROJECTION_MATRIX = module.MARKET_PROJECTION_MATRIX;
    VALIDATION_PROMPTS = module.VALIDATION_PROMPTS;
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
    this.analysisData = this.getEmptyAnalysisData();
    this.ui.transition('assessment');
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderCurrentQuestion() {
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
    if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
    if (nextBtn) nextBtn.textContent = this.currentQuestionIndex === APTITUDE_QUESTIONS.length - 1 ? 'Finish' : 'Next';
  }

  prevQuestion() {
    if (this.currentQuestionIndex === 0) return;
    this.currentQuestionIndex -= 1;
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  nextQuestion() {
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
    this.completeAssessment();
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
    const dimensionScores = this.scoreDimensions();
    const projection = this.buildMarketProjection(dimensionScores);
    const sortedDims = APTITUDE_DIMENSIONS
      .map(dim => ({ ...dim, score: dimensionScores[dim.id] || 0 }))
      .sort((a, b) => b.score - a.score);

    this.analysisData = {
      timestamp: new Date().toISOString(),
      dimensionScores,
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
    this.completeAssessment();
  }

  exportCSV() {
    const rows = [['Dimension', 'Score']];
    Object.entries(this.analysisData.dimensionScores || {}).forEach(([dim, value]) => {
      rows.push([dim, (value * 100).toFixed(0)]);
    });
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csv, 'outlier-aptitude.csv', 'text/csv');
  }

  getEmptyAnalysisData() {
    return {
      timestamp: new Date().toISOString(),
      dimensionScores: {},
      topDimensions: [],
      projection: [],
      validationPrompts: []
    };
  }

  saveProgress() {
    const progress = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      analysisData: this.analysisData
    };
    this.dataStore.save('progress', progress);
  }

  async loadStoredData() {
    try {
      const progress = this.dataStore.load('progress');
      if (!progress) return;
      this.currentQuestionIndex = progress.currentQuestionIndex || 0;
      this.answers = progress.answers || {};
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
    this.analysisData = this.getEmptyAnalysisData();
    this.ui.transition('idle');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.outlierAptitudeEngine = new OutlierAptitudeEngine();
});

