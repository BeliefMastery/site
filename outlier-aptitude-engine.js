import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, SecurityUtils } from './shared/utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { showConfirm } from './shared/confirm-modal.js';
import { downloadReportHtml } from './shared/export-utils.js';
import {
  scoreDimensionsFromAnswers,
  acuitySlidersToVector,
  acuityScenarioAnswersToSliders,
  blendQuestionnaireAndAcuity,
  buildSortedMarketProjection,
  pickDiverseTopRoles
} from './outlier-aptitude-scoring.js';

let APTITUDE_DIMENSIONS, APTITUDE_QUESTIONS, MARKET_PROJECTION_MATRIX, VALIDATION_PROMPTS, APTITUDE_ACUITY_DOMAINS;
let ARCHETYPE_OPTIONS, QUALIFICATION_LEVELS, AGE_RANGES, INDUSTRY_OPTIONS, INDUSTRY_TO_SECTOR, QUALIFICATION_ORDER;

export class OutlierAptitudeEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.reportComplete = false;
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
      if (this._storageAppliedUi) return;
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
    INDUSTRY_TO_SECTOR = module.INDUSTRY_TO_SECTOR || {};
    QUALIFICATION_ORDER = module.QUALIFICATION_ORDER || [];
  }

  bindEvents() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) startBtn.addEventListener('click', () => this.startAssessment());

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) sampleBtn.addEventListener('click', () => this.generateSampleReport());

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) abandonBtn.addEventListener('click', () => this.abandonAssessment(false));

    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) newAssessmentBtn.addEventListener('click', () => this.abandonAssessment(true));

    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());

    const exportHtmlBtn = document.getElementById('exportReportHtml');
    if (exportHtmlBtn) {
      exportHtmlBtn.addEventListener('click', () => this.exportReportHtml());
    }

  }

  sanitizeQuestionnaireAnswers(answers) {
    const out = {};
    (APTITUDE_QUESTIONS || []).forEach(q => {
      const v = answers[q.id];
      if (q.type === 'scenario' && q.choices?.length) {
        if (q.choices.some(c => c.id === v)) out[q.id] = v;
        return;
      }
      if (typeof v === 'number' && v >= 1 && v <= 5) out[q.id] = v;
    });
    return out;
  }

  sanitizeAcuityScores(scores) {
    const out = {};
    (APTITUDE_ACUITY_DOMAINS || []).forEach(d => {
      const v = scores[d.id];
      if (d.scenarioChoices?.some(c => c.id === v)) {
        out[d.id] = v;
        return;
      }
      if (typeof v === 'number' && v >= 0 && v <= 10 && d.scenarioChoices?.length) {
        let best = d.scenarioChoices[0];
        let bestDiff = Infinity;
        d.scenarioChoices.forEach(ch => {
          const diff = Math.abs(ch.sliderValue - v);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = ch;
          }
        });
        if (best) out[d.id] = best.id;
      }
    });
    return out;
  }

  exportReportHtml() {
    const ok = downloadReportHtml({
      title: 'Outlier Aptitude Report',
      filenameBase: `outlier-aptitude-${Date.now()}`,
      rootSelector: '#resultsSection'
    });
    if (!ok) {
      ErrorHandler.showUserError('Could not build report file. Open results and try again.');
    }
  }

  shouldAutoGenerateSample() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sample')) return false;
    const value = params.get('sample');
    return value === null || value === '' || value === '1' || value === 'true';
  }

  startAssessment() {
    this.reportComplete = false;
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

    const selected = this.answers[question.id];
    const isScenario = question.type === 'scenario' && question.choices?.length;

    if (isScenario) {
      questionContainer.innerHTML = `
        <div class="question-block">
          <h3>${SecurityUtils.sanitizeHTML(question.text)}</h3>
          <p class="form-help">Choose the option that best matches what you would most likely do—not what sounds most impressive.</p>
          <div class="options-container">
            ${question.choices.map(choice => `
              <label class="option-label ${selected === choice.id ? 'selected' : ''}">
                <input type="radio" name="question_${question.id}" value="${SecurityUtils.sanitizeHTML(choice.id)}" ${selected === choice.id ? 'checked' : ''}>
                <span>${SecurityUtils.sanitizeHTML(choice.label)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      const options = [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' }
      ];
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
    }

    questionContainer.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        if (isScenario) {
          this.answers[question.id] = input.value;
        } else {
          this.answers[question.id] = parseInt(input.value, 10);
        }
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
    const ans = this.answers[question.id];
    const scenarioOk = question.type === 'scenario' && question.choices?.some(c => c.id === ans);
    const likertOk = typeof ans === 'number' && ans >= 1 && ans <= 5;
    if (!question || (!scenarioOk && !likertOk)) {
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
    if (questionCount) questionCount.textContent = 'Workplace scenarios — acuity signals';
    if (progressFill) progressFill.style.width = '100%';

    const scores = this.acuityProfile?.scores || {};
    const blocksHtml = APTITUDE_ACUITY_DOMAINS.map(domain => {
      const choices = domain.scenarioChoices || [];
      const selected = scores[domain.id];
      return `
        <div class="form-group acuity-scenario-group">
          <h4 class="acuity-domain-title">${SecurityUtils.sanitizeHTML(domain.name)}</h4>
          <p class="acuity-slider-desc">${SecurityUtils.sanitizeHTML(domain.scenarioStem || domain.description)}</p>
          <div class="options-container">
            ${choices.map(choice => `
              <label class="option-label ${selected === choice.id ? 'selected' : ''}">
                <input type="radio" name="acuity_${domain.id}" value="${SecurityUtils.sanitizeHTML(choice.id)}" data-domain="${SecurityUtils.sanitizeHTML(domain.id)}" ${selected === choice.id ? 'checked' : ''}>
                <span>${SecurityUtils.sanitizeHTML(choice.label)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>Situational acuity</h3>
        <p class="form-help">For each area, pick the response that best matches how you usually act—not how you wish you were seen.</p>
        ${blocksHtml}
      </div>
    `;

    questionContainer.querySelectorAll('input[type="radio"][data-domain]').forEach(input => {
      input.addEventListener('change', () => {
        const domainId = input.getAttribute('data-domain');
        if (!domainId) return;
        this.acuityProfile = this.acuityProfile || { scores: {} };
        this.acuityProfile.scores = this.acuityProfile.scores || {};
        this.acuityProfile.scores[domainId] = input.value;
        this.saveProgress();
      });
    });

    this.updateNavButtons();
    setTimeout(() => questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  validateAcuitySelections() {
    const scores = this.acuityProfile?.scores || {};
    for (const domain of APTITUDE_ACUITY_DOMAINS) {
      const v = scores[domain.id];
      const ok = domain.scenarioChoices?.some(c => c.id === v);
      if (!ok) {
        ErrorHandler.showUserError(`Please choose an option for each scenario (${domain.name}).`);
        return false;
      }
    }
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
    const resolved = acuityScenarioAnswersToSliders(scores, APTITUDE_ACUITY_DOMAINS);
    const sorted = APTITUDE_ACUITY_DOMAINS.map(d => ({ id: d.id, score: resolved[d.id] !== undefined ? resolved[d.id] : 5 }))
      .sort((a, b) => b.score - a.score);
    return {
      primary: sorted[0]?.id || '',
      secondary: sorted[1]?.id || '',
      tertiary: sorted[2]?.id || '',
      additional: sorted.slice(3).filter(x => x.score >= 5).map(x => x.id)
    };
  }

  scoreDimensions() {
    const dimensionIds = APTITUDE_DIMENSIONS.map(d => d.id);
    return scoreDimensionsFromAnswers(this.answers, APTITUDE_QUESTIONS, dimensionIds);
  }

  buildMarketProjection(blendedDimensionScores) {
    return buildSortedMarketProjection(
      blendedDimensionScores,
      MARKET_PROJECTION_MATRIX,
      this.earlyInputs || {},
      {
        qualOrder: QUALIFICATION_ORDER || [],
        industryToSector: INDUSTRY_TO_SECTOR || {}
      }
    );
  }

  formatSectorLabel(sector) {
    const labels = { technology: 'Technology & Engineering', healthcare: 'Healthcare & Life Sciences', business: 'Business & Finance', education: 'Education & Research', creative: 'Creative & Media', legal: 'Legal, Public Service & Social Work', trades: 'Trades & Technical', hospitality: 'Hospitality & Personal Services', sales: 'Sales & Customer Relations', agriculture: 'Agriculture & Environmental', other: 'Other' };
    return labels[sector] || sector;
  }

  humanizeMatchRationale(text) {
    if (!text || !APTITUDE_DIMENSIONS?.length) return text;
    let r = text;
    const sorted = [...APTITUDE_DIMENSIONS].sort((a, b) => b.id.length - a.id.length);
    sorted.forEach(dim => {
      r = r.split(dim.id).join(dim.name);
    });
    return r;
  }

  completeAssessment() {
    const dimensionIds = APTITUDE_DIMENSIONS.map(d => d.id);
    const questionnaireScores = scoreDimensionsFromAnswers(this.answers, APTITUDE_QUESTIONS, dimensionIds);
    const acuitySliders = acuityScenarioAnswersToSliders(this.acuityProfile?.scores || {}, APTITUDE_ACUITY_DOMAINS);
    const acuityVec = acuitySlidersToVector(acuitySliders);
    const dimensionScores = blendQuestionnaireAndAcuity(questionnaireScores, acuityVec, dimensionIds, 0.28);
    const projection = this.buildMarketProjection(dimensionScores);
    const projectionDisplay = pickDiverseTopRoles(projection, 7, 2);
    const sortedDims = APTITUDE_DIMENSIONS
      .map(dim => ({ ...dim, score: dimensionScores[dim.id] || 0 }))
      .sort((a, b) => b.score - a.score);

    this.analysisData = {
      timestamp: new Date().toISOString(),
      scoringVersion: '2.1',
      earlyInputs: this.earlyInputs || this.getEmptyAnalysisData().earlyInputs,
      dimensionScores,
      questionnaireScores,
      acuityProfile: { scores: { ...this.acuityProfile?.scores }, resolvedSliders: acuitySliders, ...this.deriveAcuityRankFromScores() },
      topDimensions: sortedDims.slice(0, 4),
      projection,
      projectionDisplay,
      validationPrompts: VALIDATION_PROMPTS
    };
    this.reportComplete = true;
    this.renderResults();
    this.ui.transition('results');
    this.saveProgress();
  }

  getVulnerabilityWarnings() {
    const projection = this.getTopCareerFits(this.analysisData?.projection, 7);
    const high = projection.filter(r => (r.automationResistanceScore || 0) < 0.5);
    const medium = projection.filter(r => {
      const s = r.automationResistanceScore || 0;
      return s >= 0.5 && s < 0.7;
    });
    const lines = [];
    if (high.length) {
      lines.push(`<p><strong>Higher vulnerability (AGI/ASI):</strong> ${high.map(r => SecurityUtils.sanitizeHTML(r.name)).join(', ')} — routine-heavy tasks and mid-level analysis face significant automation pressure by 2030–2035. Consider adding high-touch, creative, or interpersonal skills.</p>`);
    }
    if (medium.length) {
      lines.push(`<p><strong>Moderate vulnerability:</strong> ${medium.map(r => SecurityUtils.sanitizeHTML(r.name)).join(', ')} — mixed automation impact. Human oversight and soft skills remain central; continuous learning recommended.</p>`);
    }
    const low = projection.filter(r => (r.automationResistanceScore || 0) >= 0.7);
    if (low.length) {
      lines.push(`<p><strong>Lower vulnerability:</strong> ${low.map(r => SecurityUtils.sanitizeHTML(r.name)).join(', ')} — strong interpersonal, creative, or physical elements; resistant to near-term automation.</p>`);
    }
    return lines.length ? lines.join('') : '<p>No specific vulnerability warnings for your top matches.</p>';
  }

  formatCareerRelevance(role) {
    const growthPhrase = role.growth ? `${role.growth} growth industry` : '';
    const autoPhrase = role.automationResistance ? `${role.automationResistance} automation resistance` : '';
    const fit = role.fitScore ?? 0;
    let fitPhrase = 'Worth exploring';
    if (fit >= 0.7) fitPhrase = 'Strong fit for you';
    else if (fit >= 0.5) fitPhrase = 'Moderate fit for you';
    else if (fit >= 0.35) fitPhrase = 'Potential fit';
    const parts = [growthPhrase, autoPhrase].filter(Boolean);
    return `${parts.join('. ')}. ${fitPhrase}.`;
  }

  getCareerJustification(role, rank) {
    const early = this.earlyInputs || {};
    const userIndustrySectors = new Set((early.industries || []).map(id => INDUSTRY_TO_SECTOR[id] || id));
    const userArchetypes = new Set((early.archetypes || []).map(a => String(a).trim()));
    const topDims = (this.analysisData?.topDimensions || []).slice(0, 2).map(d => d.name);
    const parts = [];
    if (role.matchRationale) {
      parts.push(`Why this match: ${this.humanizeMatchRationale(role.matchRationale)}.`);
    }
    if (topDims.length) {
      parts.push(`Aligns with your top aptitudes: ${topDims.join(' and ')}.`);
    }
    if (role.sector && userIndustrySectors.has(role.sector)) {
      parts.push(`Matches your industry experience in ${this.formatSectorLabel(role.sector)}.`);
    }
    if (role.archetypeFit?.length && userArchetypes.size) {
      const match = role.archetypeFit.find(a => userArchetypes.has(a));
      if (match) parts.push(`Fits your ${match} profile.`);
    }
    if (role.growth === 'High') {
      parts.push('High-growth sector with favorable outlook.');
    }
    if ((role.automationResistanceScore || 0) >= 0.7) {
      parts.push('Strong automation resistance — resilient to near-term AI disruption.');
    } else if ((role.automationResistanceScore || 0) < 0.55) {
      parts.push('Consider augmenting with high-touch or creative skills given automation pressures.');
    }
    return parts.length ? parts.join(' ') : this.formatCareerRelevance(role);
  }

  getTopCareerFits(projection, max = 7) {
    const display = this.analysisData?.projectionDisplay;
    if (Array.isArray(display) && display.length) {
      return display.slice(0, max);
    }
    return pickDiverseTopRoles(projection || [], max, 2);
  }

  getRecommendedCourseOfAction() {
    const topFits = this.getTopCareerFits(this.analysisData?.projection, 7);
    const topNames = topFits.slice(0, 3).map(r => r.name);
    const highVuln = topFits.filter(r => (r.automationResistanceScore || 0) < 0.55);
    const topDims = (this.analysisData?.topDimensions || []).slice(0, 2).map(d => d.name);
    const immediate = highVuln.length
      ? `Identify 1–2 courses or certifications that add high-touch or creative skills to complement ${topNames[0] || 'your top match'}.`
      : `Review job postings for ${topNames[0] || 'your top match'} to align your skills and identify quick wins.`;
    const shortTerm = `Build experience in ${topNames[0] || 'a top match'} through projects, lateral moves, or targeted learning. Strengthen ${topDims[0] || 'your top aptitude'} with deliberate practice.`;
    const mediumTerm = `Consider deeper pivots or credential upgrades if your goal is ${topNames[1] || 'a strong match'}. Monitor sector disruption and emerging roles in your industry.`;
    const ongoing = `Maintain continuous learning and diversify skills. Track automation trends in your sector and adjust your development plan as AGI/ASI capabilities evolve.`;
    return { immediate, shortTerm, mediumTerm, ongoing };
  }

  renderResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    const vulnHtml = this.getVulnerabilityWarnings();
    const actions = this.getRecommendedCourseOfAction();
    resultsContainer.innerHTML = `
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Market Projection Matrix — Potential Career Matches</h3>
        <p class="form-help">Higher-scoring career options to explore (diverse shortlist: at most two roles per internal cluster, then by fit, automation resistance, and education reach). Full ranked list is included in JSON export.</p>
        <p class="form-help">This estimate is based on self-report patterns and model heuristics; treat it as directional guidance, not a definitive prediction.</p>
        <ol class="career-fit-ranked">
          ${this.getTopCareerFits(this.analysisData.projection, 7).map((role, i) => `
            <li class="career-fit-item">
              <strong>#${i + 1} ${SecurityUtils.sanitizeHTML(role.name)}</strong> — ${SecurityUtils.sanitizeHTML(this.formatCareerRelevance(role))}
              <p class="career-justification">${SecurityUtils.sanitizeHTML(this.getCareerJustification(role, i + 1))}</p>
            </li>
          `).join('')}
        </ol>
      </div>
      <div class="panel panel-outline" style="border-left: 3px solid var(--color-warning, #c9a227);">
        <h3 class="panel-title">Industry &amp; Skillset Vulnerability (AGI/ASI)</h3>
        <div class="vulnerability-content">${vulnHtml}</div>
      </div>
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Recommended Course of Action</h3>
        <ul class="feature-list action-list">
          <li><strong>Immediate (0–6 months):</strong> ${SecurityUtils.sanitizeHTML(actions.immediate)}</li>
          <li><strong>Short-term (6–18 months):</strong> ${SecurityUtils.sanitizeHTML(actions.shortTerm)}</li>
          <li><strong>Medium-term (18–36 months):</strong> ${SecurityUtils.sanitizeHTML(actions.mediumTerm)}</li>
          <li><strong>Ongoing:</strong> ${SecurityUtils.sanitizeHTML(actions.ongoing)}</li>
        </ul>
      </div>
      <div class="panel panel-outline">
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
          <li><strong>Current strongest signal:</strong> ${SecurityUtils.sanitizeHTML(this.getAcuityLabel(this.analysisData.acuityProfile?.primary))}</li>
          <li><strong>Next strongest signal:</strong> ${SecurityUtils.sanitizeHTML(this.getAcuityLabel(this.analysisData.acuityProfile?.secondary))}</li>
          <li><strong>Additional strong signal:</strong> ${SecurityUtils.sanitizeHTML(this.getAcuityLabel(this.analysisData.acuityProfile?.tertiary))}</li>
          ${this.analysisData.acuityProfile?.additional?.length ? `<li><strong>Additional:</strong> ${this.analysisData.acuityProfile.additional.map(id => SecurityUtils.sanitizeHTML(this.getAcuityLabel(id))).join(', ')}</li>` : ''}
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
      industries: ['tech_software', 'business_corporate']
    };
    this.analysisData.earlyInputs = this.earlyInputs;
    APTITUDE_QUESTIONS.forEach(question => {
      if (question.type === 'scenario' && question.choices?.length) {
        const pick = question.choices[Math.floor(Math.random() * question.choices.length)];
        this.answers[question.id] = pick.id;
      } else {
        this.answers[question.id] = Math.floor(Math.random() * 5) + 1;
      }
    });
    const scores = {};
    APTITUDE_ACUITY_DOMAINS.forEach(d => {
      const ch = d.scenarioChoices;
      if (ch?.length) scores[d.id] = ch[Math.floor(Math.random() * ch.length)].id;
    });
    this.acuityProfile = { scores };
    this.completeAssessment();
  }

  getEmptyAnalysisData() {
    return {
      timestamp: new Date().toISOString(),
      scoringVersion: null,
      earlyInputs: { archetypes: [], ageRange: '', qualification: '', industries: [] },
      dimensionScores: {},
      questionnaireScores: {},
      acuityProfile: { primary: '', secondary: '', tertiary: '', additional: [] },
      topDimensions: [],
      projection: [],
      projectionDisplay: [],
      validationPrompts: []
    };
  }

  saveProgress() {
    const progress = {
      currentQuestionIndex: this.currentQuestionIndex,
      currentStage: this.currentStage,
      reportComplete: this.reportComplete === true,
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
      if (!progress) {
        this._storageAppliedUi = false;
        return;
      }
      this.currentQuestionIndex = progress.currentQuestionIndex || 0;
      this.currentStage = progress.currentStage || 'questions';
      this.reportComplete = progress.reportComplete === true;
      this.answers = this.sanitizeQuestionnaireAnswers(progress.answers || {});
      const rawAcuity = progress.acuityProfile || { primary: '', secondary: '', tertiary: '', additional: [] };
      this.acuityProfile = {
        ...rawAcuity,
        scores: this.sanitizeAcuityScores(rawAcuity.scores || {})
      };
      this.earlyInputs = progress.earlyInputs || this.getEmptyAnalysisData().earlyInputs;
      this.analysisData = progress.analysisData || this.analysisData;
      this._storageAppliedUi = false;
      if (this.reportComplete && this.analysisData.topDimensions?.length) {
        this.renderResults();
        this.ui.transition('results');
        this._storageAppliedUi = true;
      } else if (this.analysisData.topDimensions?.length) {
        this.reportComplete = true;
        this.renderResults();
        this.ui.transition('results');
        this._storageAppliedUi = true;
      } else if (this.currentStage === 'earlyInput' || Object.keys(this.answers).length) {
        this.ui.transition('assessment');
        this.renderCurrentQuestion();
        this._storageAppliedUi = true;
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
    }
  }

  async abandonAssessment(fromCompletedReport = false) {
    const message = fromCompletedReport
      ? 'Start a new assessment? Your saved report will be cleared.'
      : 'Are you sure you want to abandon this assessment? All progress will be lost.';
    if (await showConfirm(message)) {
      this.resetAssessment();
    }
  }

  resetAssessment() {
    this.reportComplete = false;
    this._storageAppliedUi = false;
    this.dataStore.clear('progress');
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.currentStage = 'questions';
    this.acuityProfile = { primary: '', secondary: '', tertiary: '', additional: [] };
    this.earlyInputs = { archetypes: [], ageRange: '', qualification: '', industries: [] };
    this.analysisData = this.getEmptyAnalysisData();
    this.ui.transition('idle');
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

