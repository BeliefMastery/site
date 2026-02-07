import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, SecurityUtils } from './shared/utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { exportJSON, downloadFile } from './shared/export-utils.js';

let APTITUDE_DIMENSIONS, APTITUDE_QUESTIONS, MARKET_PROJECTION_MATRIX, VALIDATION_PROMPTS, APTITUDE_ACUITY_DOMAINS;
let ARCHETYPE_OPTIONS, QUALIFICATION_LEVELS, AGE_RANGES, INDUSTRY_OPTIONS;

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
    ARCHETYPE_OPTIONS = module.ARCHETYPE_OPTIONS || [];
    QUALIFICATION_LEVELS = module.QUALIFICATION_LEVELS || [];
    AGE_RANGES = module.AGE_RANGES || [];
    INDUSTRY_OPTIONS = module.INDUSTRY_OPTIONS || [];
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
    this.currentStage = 'earlyInput';
    this.acuityProfile = { primary: '', secondary: '', tertiary: '', additional: [] };
    this.analysisData = this.getEmptyAnalysisData();
    this.earlyInputs = this.analysisData.earlyInputs || { archetypes: [], ageRange: '', qualification: '', industries: [] };
    this.ui.transition('assessment');
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderCurrentQuestion() {
    if (this.currentStage === 'earlyInput') {
      this.renderEarlyInputStep();
      return;
    }
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

// Scroll to question after rendering
    setTimeout(() => {
      questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    this.updateNavButtons();
  }

  updateNavButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    if (prevBtn) prevBtn.disabled = this.currentStage === 'earlyInput' || (this.currentStage === 'questions' && this.currentQuestionIndex === 0);
    if (nextBtn) {
      if (this.currentStage === 'earlyInput') nextBtn.textContent = 'Continue to Assessment';
      else if (this.currentStage === 'acuity') nextBtn.textContent = 'Finish';
      else nextBtn.textContent = 'Next';
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
    if (this.currentStage === 'questions' && this.currentQuestionIndex === 0) {
      this.currentStage = 'earlyInput';
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
    if (this.currentStage === 'earlyInput') {
      if (!this.validateEarlyInputs()) return;
      this.captureEarlyInputs();
      this.analysisData.earlyInputs = this.earlyInputs;
      this.currentStage = 'questions';
      this.currentQuestionIndex = 0;
      this.renderCurrentQuestion();
      this.saveProgress();
      return;
    }
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

  renderEarlyInputStep() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = document.getElementById('questionCount');
    const progressFill = document.getElementById('progressFill');
    if (!questionContainer) return;
    if (questionCount) questionCount.textContent = 'Profile Context';
    if (progressFill) progressFill.style.width = '5%';

    const archetypeOptions = (ARCHETYPE_OPTIONS || []).map(a => `<option value="${SecurityUtils.sanitizeHTML(a)}">${SecurityUtils.sanitizeHTML(a)}</option>`).join('');
    const qualOptions = (QUALIFICATION_LEVELS || []).map(q => `<option value="${q.id}">${SecurityUtils.sanitizeHTML(q.label)}</option>`).join('');
    const ageOptions = (AGE_RANGES || []).map(a => `<option value="${a.id}">${SecurityUtils.sanitizeHTML(a.label)}</option>`).join('');
    const industryOptions = (INDUSTRY_OPTIONS || []).map(i =>
      `<label class="option-label"><input type="checkbox" value="${i.id}" ${(this.earlyInputs?.industries || []).includes(i.id) ? 'checked' : ''}><span>${SecurityUtils.sanitizeHTML(i.label)}</span></label>`
    ).join('');

    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>Context for Career Guidance</h3>
        <p class="form-help">This context helps tailor your results. Select 2–3 archetypes if known, plus your age range, qualification, and work experience industries.</p>
        <div class="form-group">
          <label for="archetype1">Archetype 1</label>
          <select id="archetype1"><option value="">— Select —</option>${archetypeOptions}</select>
        </div>
        <div class="form-group">
          <label for="archetype2">Archetype 2 (optional)</label>
          <select id="archetype2"><option value="">— Select —</option>${archetypeOptions}</select>
        </div>
        <div class="form-group">
          <label for="archetype3">Archetype 3 (optional)</label>
          <select id="archetype3"><option value="">— Select —</option>${archetypeOptions}</select>
        </div>
        <div class="form-group">
          <label for="ageRange">Age range</label>
          <select id="ageRange"><option value="">— Select —</option>${ageOptions}</select>
        </div>
        <div class="form-group">
          <label for="qualification">Highest qualification</label>
          <select id="qualification"><option value="">— Select —</option>${qualOptions}</select>
        </div>
        <div class="form-group">
          <label>Work experience industries (select all that apply)</label>
          <div class="options-container options-container-grid">${industryOptions}</div>
        </div>
      </div>
    `;

    const a1 = document.getElementById('archetype1');
    const a2 = document.getElementById('archetype2');
    const a3 = document.getElementById('archetype3');
    const ageSelect = document.getElementById('ageRange');
    const qualSelect = document.getElementById('qualification');
    if (a1 && this.earlyInputs?.archetypes?.[0]) a1.value = this.earlyInputs.archetypes[0];
    if (a2 && this.earlyInputs?.archetypes?.[1]) a2.value = this.earlyInputs.archetypes[1];
    if (a3 && this.earlyInputs?.archetypes?.[2]) a3.value = this.earlyInputs.archetypes[2];
    if (ageSelect && this.earlyInputs?.ageRange) ageSelect.value = this.earlyInputs.ageRange;
    if (qualSelect && this.earlyInputs?.qualification) qualSelect.value = this.earlyInputs.qualification;

    const updateEarlyInputs = () => {
      this.earlyInputs = this.earlyInputs || {};
      this.earlyInputs.archetypes = [a1?.value, a2?.value, a3?.value].filter(Boolean);
      this.earlyInputs.ageRange = ageSelect?.value || '';
      this.earlyInputs.qualification = qualSelect?.value || '';
      this.earlyInputs.industries = Array.from(questionContainer.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.checked).map(cb => cb.value);
      this.saveProgress();
    };
    [a1, a2, a3, ageSelect, qualSelect].forEach(el => { if (el) el.addEventListener('change', updateEarlyInputs); });
    questionContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', updateEarlyInputs));

    this.updateNavButtons();
    setTimeout(() => questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  validateEarlyInputs() {
    const { ageRange, qualification } = this.earlyInputs || {};
    if (!ageRange || !qualification) {
      ErrorHandler.showUserError('Please select your age range and highest qualification.');
      return false;
    }
    return true;
  }

  captureEarlyInputs() {
    const a1 = document.getElementById('archetype1');
    const a2 = document.getElementById('archetype2');
    const a3 = document.getElementById('archetype3');
    const ageSelect = document.getElementById('ageRange');
    const qualSelect = document.getElementById('qualification');
    const industryCheckboxes = document.querySelectorAll('#questionContainer input[type="checkbox"]');
    this.earlyInputs = {
      archetypes: [a1?.value, a2?.value, a3?.value].filter(Boolean),
      ageRange: ageSelect?.value || '',
      qualification: qualSelect?.value || '',
      industries: Array.from(industryCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
    };
  }

  renderAcuityStep() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = document.getElementById('questionCount');
    const progressFill = document.getElementById('progressFill');
    if (!questionContainer) return;
    if (questionCount) questionCount.textContent = 'Acuity Self‑Evaluation';
    if (progressFill) progressFill.style.width = '100%';

    const scores = this.acuityProfile?.scores || {};
    const slidersHtml = APTITUDE_ACUITY_DOMAINS.map(domain => {
      const val = scores[domain.id] !== undefined ? scores[domain.id] : 5;
      const desc = domain.sliderDescription || domain.description;
      return `
        <div class="form-group acuity-slider-group">
          <label for="acuity-${domain.id}">${SecurityUtils.sanitizeHTML(domain.name)}</label>
          <p class="acuity-slider-desc">${SecurityUtils.sanitizeHTML(desc)}</p>
          <div class="scale-container">
            <div class="scale-input">
              <input type="range" min="0" max="10" value="${val}" class="slider" id="acuity-${domain.id}" data-domain="${domain.id}" step="1">
              <div class="scale-labels">
                <span>0 — Low</span>
                <span>5 — Moderate</span>
                <span>10 — Very high</span>
              </div>
            </div>
            <span class="scale-value acuity-value" id="acuity-val-${domain.id}">${val}</span>
          </div>
        </div>
      `;
    }).join('');

    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>Self‑Evaluate Your Competence by Domain</h3>
        <p class="form-help">Rate your competence in each domain from 0 (low) to 10 (very high). Use the descriptions and your experience to gauge where you stand relative to peers.</p>
        ${slidersHtml}
        <div class="panel panel-outline acuity-bias-panel">
          <h4 class="panel-title">Bias‑Mitigating Prompts</h4>
          <ul class="feature-list">
            ${APTITUDE_ACUITY_DOMAINS.map(domain => `<li><strong>${SecurityUtils.sanitizeHTML(domain.name)}:</strong> ${SecurityUtils.sanitizeHTML(domain.biasPrompt)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    APTITUDE_ACUITY_DOMAINS.forEach(domain => {
      const slider = document.getElementById(`acuity-${domain.id}`);
      const valueSpan = document.getElementById(`acuity-val-${domain.id}`);
      if (slider && valueSpan) {
        slider.oninput = () => {
          valueSpan.textContent = slider.value;
          this.acuityProfile = this.acuityProfile || { scores: {} };
          this.acuityProfile.scores = this.acuityProfile.scores || {};
          this.acuityProfile.scores[domain.id] = parseInt(slider.value, 10);
          this.saveProgress();
        };
      }
    });

    this.updateNavButtons();
    setTimeout(() => questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  validateAcuitySelections() {
    return true;
  }

  deriveAcuityRankFromScores() {
    let scores = this.acuityProfile?.scores || {};
    if (Object.keys(scores).length === 0 && this.acuityProfile?.primary) {
      scores = {};
      const p = this.acuityProfile.primary, s = this.acuityProfile.secondary, t = this.acuityProfile.tertiary;
      const add = new Set(this.acuityProfile.additional || []);
      APTITUDE_ACUITY_DOMAINS.forEach(d => {
        if (d.id === p) scores[d.id] = 8;
        else if (d.id === s) scores[d.id] = 6;
        else if (d.id === t) scores[d.id] = 5;
        else if (add.has(d.id)) scores[d.id] = 4;
        else scores[d.id] = 3;
      });
    }
    const sorted = APTITUDE_ACUITY_DOMAINS.map(d => ({ id: d.id, score: scores[d.id] !== undefined ? scores[d.id] : 5 }))
      .sort((a, b) => b.score - a.score);
    return {
      primary: sorted[0]?.id || '',
      secondary: sorted[1]?.id || '',
      tertiary: sorted[2]?.id || '',
      additional: sorted.slice(3).filter(x => x.score >= 5).map(x => x.id)
    };
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
    const acuityRank = this.deriveAcuityRankFromScores();
    dimensionScores = this.applyAcuityWeighting(dimensionScores, acuityRank);
    const projection = this.buildMarketProjection(dimensionScores);
    const sortedDims = APTITUDE_DIMENSIONS
      .map(dim => ({ ...dim, score: dimensionScores[dim.id] || 0 }))
      .sort((a, b) => b.score - a.score);

    this.analysisData = {
      timestamp: new Date().toISOString(),
      earlyInputs: this.earlyInputs || this.getEmptyAnalysisData().earlyInputs,
      dimensionScores,
      acuityProfile: { scores: this.acuityProfile?.scores || {}, ...this.deriveAcuityRankFromScores() },
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
    this.earlyInputs = {
      archetypes: (ARCHETYPE_OPTIONS || []).slice(0, 2),
      ageRange: '25-34',
      qualification: 'bachelors',
      industries: ['technology', 'business']
    };
    this.analysisData.earlyInputs = this.earlyInputs;
    APTITUDE_QUESTIONS.forEach(question => {
      this.answers[question.id] = Math.floor(Math.random() * 5) + 1;
    });
    const scores = {};
    APTITUDE_ACUITY_DOMAINS.forEach((d, i) => { scores[d.id] = Math.min(10, Math.max(0, 4 + Math.floor(Math.random() * 5))); });
    this.acuityProfile = { scores };
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
      earlyInputs: { archetypes: [], ageRange: '', qualification: '', industries: [] },
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
      earlyInputs: this.earlyInputs,
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
      this.earlyInputs = progress.earlyInputs || this.getEmptyAnalysisData().earlyInputs;
      this.analysisData = progress.analysisData || this.analysisData;
      if (this.analysisData.topDimensions?.length) {
        this.renderResults();
        this.ui.transition('results');
      } else if (this.currentStage === 'earlyInput' || Object.keys(this.answers).length) {
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
    this.earlyInputs = { archetypes: [], ageRange: '', qualification: '', industries: [] };
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

