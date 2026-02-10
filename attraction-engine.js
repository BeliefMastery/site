/**
 * STATUS, SELECTION, ATTRACTION — Assessment Engine
 * Gender-specific evolutionary clusters. Weightings informed by @hoe_math.
 *
 * @author Warwick Marshall
 */

import { createDebugReporter } from './shared/debug-reporter.js';
import { SecurityUtils } from './shared/utils.js';
import { exportJSON, exportExecutiveBrief, downloadFile } from './shared/export-utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import {
  MALE_CLUSTERS,
  FEMALE_CLUSTERS,
  MALE_PREFERENCE_QUESTIONS,
  FEMALE_PREFERENCE_QUESTIONS,
  MALE_CLUSTER_WEIGHTS,
  FEMALE_CLUSTER_WEIGHTS,
  MARKET_SEGMENTS,
  DEVELOPMENTAL_LEVELS
} from './attraction-data.js';

export class AttractionEngine {
  constructor() {
    this.currentGender = null;
    this.currentPhase = -1;
    this.currentQuestionIndex = 0;
    this.responses = {};
    this.preferences = {};
    this.smv = {};

    this.debugReporter = createDebugReporter('AttractionEngine');
    this.debugReporter.markInitialized();

    this.ui = new EngineUIController({
      idle: { show: ['#introSection', '#actionButtonsSection'], hide: ['#questionnaireSection', '#resultsSection'] },
      assessment: { show: ['#questionnaireSection'], hide: ['#introSection', '#actionButtonsSection', '#resultsSection'] },
      results: { show: ['#resultsSection'], hide: ['#introSection', '#actionButtonsSection', '#questionnaireSection'] }
    });

    this.attachEventListeners();
    this.ui.transition('idle');
  }

  attachEventListeners() {
    const ids = ['startAssessment', 'generateSampleReport', 'abandonAssessment', 'prevQuestion', 'nextQuestion', 'exportAnalysisJson', 'exportAnalysisCsv', 'exportExecutiveBrief', 'newAssessment'];
    const handlers = {
      startAssessment: () => this.startAssessment(),
      generateSampleReport: () => this.generateSampleReport(),
      abandonAssessment: () => this.abandonAssessment(),
      prevQuestion: () => this.prevQuestion(),
      nextQuestion: () => this.nextQuestion(),
      exportAnalysisJson: () => this.exportAnalysis('json'),
      exportAnalysisCsv: () => this.exportAnalysis('csv'),
      exportExecutiveBrief: () => this.exportExecutiveBrief(),
      newAssessment: () => this.resetAssessment()
    };
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && handlers[id]) el.addEventListener('click', handlers[id]);
    });
  }

  getClusters() {
    return this.currentGender === 'male' ? MALE_CLUSTERS : FEMALE_CLUSTERS;
  }

  getPreferenceQuestions() {
    return this.currentGender === 'male' ? MALE_PREFERENCE_QUESTIONS : FEMALE_PREFERENCE_QUESTIONS;
  }

  getClusterWeights() {
    return this.currentGender === 'male' ? MALE_CLUSTER_WEIGHTS : FEMALE_CLUSTER_WEIGHTS;
  }

  startAssessment() {
    this.currentGender = null;
    this.currentPhase = -1;
    this.responses = {};
    this.preferences = {};
    this.ui.transition('assessment');
    this.showGenderSelection();
  }

  setNavVisibility(visible) {
    const nav = document.querySelector('.navigation-buttons');
    if (nav) nav.style.display = visible ? '' : 'none';
  }

  showGenderSelection() {
    this.setNavVisibility(false);
    const container = document.getElementById('questionContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="gender-selection">
        <h2>Select Your Gender</h2>
        <p class="form-help">Weightings and biases differ significantly between male and female assessment paths.</p>
        <div class="gender-buttons">
          <button class="btn btn-large gender-btn" data-gender="male">
            <span class="gender-icon">♂</span>
            <span class="gender-label">Male Assessment</span>
            <span class="gender-desc">Coalition Rank (3C's), Reproductive Confidence (4P's), Axis of Attraction</span>
          </button>
          <button class="btn btn-large gender-btn" data-gender="female">
            <span class="gender-icon">♀</span>
            <span class="gender-label">Female Assessment</span>
            <span class="gender-desc">Coalition Rank (3S's), Reproductive Confidence, Axis of Attraction</span>
          </button>
        </div>
      </div>`;
    container.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', e => this.selectGender(e.currentTarget.dataset.gender));
    });
  }

  selectGender(gender) {
    this.currentGender = gender;
    this.currentPhase = -1;
    this.responses = {};
    this.preferences = {};
    this.showPreferencesForm();
  }

  buildOptionLabel(q, val) {
    if (q.optionLabels && Array.isArray(q.optionLabels)) {
      const idx = (q.options || []).indexOf(val);
      return q.optionLabels[idx] !== undefined ? q.optionLabels[idx] : String(val);
    }
    return String(val);
  }

  showPreferencesForm() {
    this.setNavVisibility(false);
    const questions = this.getPreferenceQuestions();
    const container = document.getElementById('questionContainer');
    if (!container) return;

    let html = `<div class="phase-intro"><h2>Market Preference Configuration</h2><h3 class="phase-subtitle">Define Your Mate Selection Criteria</h3><p class="phase-description">These preferences calibrate your assessment to the market segment you're targeting.</p><form id="preferencesForm" class="preferences-form">`;
    questions.forEach(q => {
      html += `<div class="form-group"><label class="form-label">${SecurityUtils.sanitizeHTML(q.text)}</label>`;
      if (q.type === 'number') {
        html += `<input type="number" id="${q.id}" name="${q.id}" min="${q.min}" max="${q.max}" ${q.required ? 'required' : ''} class="form-input">`;
      } else if (q.type === 'select') {
        html += `<select id="${q.id}" name="${q.id}" class="form-select">`;
        (q.options || []).forEach(opt => html += `<option value="${opt.value}">${SecurityUtils.sanitizeHTML(opt.label)}</option>`);
        html += `</select>`;
      } else if (q.type === 'scale') {
        html += `<div class="options-container">`;
        (q.options || []).forEach(opt => html += `<label class="option-label"><input type="radio" name="${q.id}" value="${opt.value}" required><span class="option-content"><span class="option-text">${SecurityUtils.sanitizeHTML(opt.label)}</span></span></label>`);
        html += `</div>`;
      }
      html += `</div>`;
    });
    html += `<button type="button" class="btn btn-primary btn-large" id="submitPreferences">Continue to Assessment</button></form></div>`;
    container.innerHTML = html;

    const form = document.getElementById('preferencesForm');
    if (form) {
      document.getElementById('submitPreferences').addEventListener('click', () => this.capturePreferences());
    }
  }

  capturePreferences() {
    const form = document.getElementById('preferencesForm');
    if (!form) return;
    const fd = new FormData(form);
    let valid = true;
    fd.forEach((v, k) => { if (!v) valid = false; });
    if (!valid) { alert('Please complete all preference fields'); return; }
    fd.forEach((v, k) => { this.preferences[k] = isNaN(v) ? v : parseFloat(v); });
    this.currentPhase = 0;
    this.showPhaseIntro();
  }

  showPhaseIntro() {
    this.setNavVisibility(false);
    const clusters = this.getClusters();
    const phaseNames = Object.keys(clusters);
    const phaseName = phaseNames[this.currentPhase];
    const phase = clusters[phaseName];
    if (!phase) return;

    const container = document.getElementById('questionContainer');
    if (!container) return;
    const totalPhases = phaseNames.length;
    const pct = (this.currentPhase / totalPhases) * 100;

    container.innerHTML = `
      <div class="phase-intro">
        <div class="phase-progress">
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p class="progress-text">Phase ${this.currentPhase + 1} of ${totalPhases}</p>
        </div>
        <h2>${SecurityUtils.sanitizeHTML(phase.title)}</h2>
        <h3 class="phase-subtitle">${SecurityUtils.sanitizeHTML(phase.subtitle)}</h3>
        <p class="phase-description">${SecurityUtils.sanitizeHTML(phase.description)}</p>
        <div class="phase-info">
          <p><strong>Questions:</strong> ${phase.questions.length}</p>
        </div>
        <button class="btn btn-primary btn-large" id="startPhaseBtn">Begin Phase ${this.currentPhase + 1}</button>
      </div>`;
    document.getElementById('startPhaseBtn')?.addEventListener('click', () => this.showPhaseQuestions());
  }

  showPhaseQuestions() {
    const clusters = this.getClusters();
    const phaseNames = Object.keys(clusters);
    const phaseName = phaseNames[this.currentPhase];
    const phase = clusters[phaseName];
    if (!phase) return;

    const container = document.getElementById('questionContainer');
    if (!container) return;
    const questions = phase.questions || [];

    let html = `<div class="phase-questions"><div class="phase-header-mini"><h3>${SecurityUtils.sanitizeHTML(phase.title)}</h3><p class="question-progress" id="questionProgress">Question 1 of ${questions.length}</p></div><form id="phaseForm">`;
    questions.forEach((q, idx) => {
      const opts = q.options || [1, 3, 5, 7, 10];
      const optsHtml = opts.map(v => {
        const label = this.buildOptionLabel(q, v);
        return `<label class="option-label"><input type="radio" name="${SecurityUtils.sanitizeHTML(q.id)}" value="${v}" required><span class="option-content"><span class="option-value">${v}</span><span class="option-text">${SecurityUtils.sanitizeHTML(label)}</span></span></label>`;
      }).join('');
      const subcat = phase.subcategories?.[q.subcategory]?.label || q.subcategory;
      html += `<div class="question-block" data-question-index="${idx}" data-phase="${phaseName}" style="${idx === 0 ? '' : 'display:none'}">
        <div class="question-header"><span class="question-number">Question ${idx + 1} of ${questions.length}</span><span class="question-category">${SecurityUtils.sanitizeHTML(subcat)}</span></div>
        <p class="question-text">${SecurityUtils.sanitizeHTML(q.text)}</p>
        <div class="options-container">${optsHtml}</div>
      </div>`;
    });
    html += `</form></div>`;
    container.innerHTML = html;
    this.currentQuestionIndex = 0;
    this.setNavVisibility(true);
    this.updatePrevNextButtons();
  }

  updatePrevNextButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = this.currentQuestionIndex <= 0;
    nextBtn.textContent = 'Next';
  }

  nextQuestion() {
    const clusters = this.getClusters();
    const phaseNames = Object.keys(clusters);
    const phaseName = phaseNames[this.currentPhase];
    const phase = clusters[phaseName];
    const questions = phase?.questions || [];
    const block = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"][data-phase="${phaseName}"]`);
    const input = block?.querySelector('input[type="radio"]:checked');
    if (!input) { alert('Please select an answer.'); return; }
    this.responses[input.name] = parseInt(input.value, 10);

    if (this.currentQuestionIndex >= questions.length - 1) {
      this.completePhase();
      return;
    }

    block.style.display = 'none';
    this.currentQuestionIndex++;
    const nextBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"][data-phase="${phaseName}"]`);
    if (nextBlock) {
      nextBlock.style.display = 'block';
      const prog = document.getElementById('questionProgress');
      if (prog) prog.textContent = `Question ${this.currentQuestionIndex + 1} of ${questions.length}`;
    }
    this.updatePrevNextButtons();
  }

  prevQuestion() {
    const clusters = this.getClusters();
    const phaseNames = Object.keys(clusters);
    const phaseName = phaseNames[this.currentPhase];
    const phase = clusters[phaseName];
    const questions = phase?.questions || [];
    const block = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"][data-phase="${phaseName}"]`);
    if (block) block.style.display = 'none';
    this.currentQuestionIndex--;
    const prevBlock = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"][data-phase="${phaseName}"]`);
    if (prevBlock) {
      prevBlock.style.display = 'block';
      const prog = document.getElementById('questionProgress');
      if (prog) prog.textContent = `Question ${this.currentQuestionIndex + 1} of ${questions.length}`;
    }
    this.updatePrevNextButtons();
  }

  completePhase() {
    const clusters = this.getClusters();
    const phaseNames = Object.keys(clusters);
    const phaseName = phaseNames[this.currentPhase];
    const phase = clusters[phaseName];
    const questions = phase?.questions || [];
    const block = document.querySelector(`[data-question-index="${this.currentQuestionIndex}"][data-phase="${phaseName}"]`);
    const input = block?.querySelector('input[type="radio"]:checked');
    if (!input) { alert('Please select an answer.'); return; }
    this.responses[input.name] = parseInt(input.value, 10);

    this.currentPhase++;
    if (this.currentPhase < phaseNames.length) {
      this.showPhaseIntro();
    } else {
      this.calculateAndShowResults();
    }
  }

  calculateAndShowResults() {
    this.smv = this.calculateSMV();
    this.ui.transition('results');
    this.renderResults();
    window.scrollTo(0, 0);
  }

  scoreToPercentile(score) {
    const normalized = (score - 1) / 9;
    const sigmoid = 1 / (1 + Math.exp(-6 * (normalized - 0.5)));
    return sigmoid * 100;
  }

  calculateSMV() {
    const clusters = this.getClusters();
    const weights = this.getClusterWeights();
    const rawScores = { clusters: {}, subcategories: {} };
    const smv = { overall: 0, clusters: {}, subcategories: {}, marketPosition: '', delusionIndex: 0, levelClassification: '', targetMarket: {}, recommendation: {} };

    Object.keys(clusters).forEach(clusterId => {
      const cluster = clusters[clusterId];
      rawScores.clusters[clusterId] = [];
      rawScores.subcategories[clusterId] = {};
      (cluster.questions || []).forEach(q => {
        let v = this.responses[q.id];
        if (v == null) return;
        if (q.reverseScore) v = 11 - v;
        rawScores.clusters[clusterId].push(v);
        if (!rawScores.subcategories[clusterId][q.subcategory]) rawScores.subcategories[clusterId][q.subcategory] = [];
        rawScores.subcategories[clusterId][q.subcategory].push(v);
      });
      const avg = rawScores.clusters[clusterId].length ? rawScores.clusters[clusterId].reduce((a, b) => a + b, 0) / rawScores.clusters[clusterId].length : 0;
      smv.clusters[clusterId] = this.scoreToPercentile(avg);
      smv.subcategories[clusterId] = {};
      Object.keys(rawScores.subcategories[clusterId]).forEach(sub => {
        const arr = rawScores.subcategories[clusterId][sub];
        const subAvg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        smv.subcategories[clusterId][sub] = this.scoreToPercentile(subAvg);
      });
    });

    smv.overall = Object.keys(weights).reduce((sum, k) => sum + (smv.clusters[k] || 0) * (weights[k] || 0), 0);
    smv.marketPosition = this.classifyMarketPosition(smv.overall);
    smv.levelClassification = this.classifyDevelopmentalLevel(smv);
    smv.delusionIndex = this.calculateDelusionIndex(smv);
    smv.targetMarket = this.analyzeTargetMarket(smv);
    smv.recommendation = this.generateRecommendation(smv);
    smv.rawResponses = { ...this.responses };
    smv.preferences = { ...this.preferences };
    return smv;
  }

  classifyMarketPosition(smv) {
    const segs = this.currentGender === 'male' ? MARKET_SEGMENTS.map(s => ({ ...s, label: s.label })) : MARKET_SEGMENTS.map(s => ({ ...s, label: s.femaleLabel }));
    for (const s of segs) if (smv >= s.min) return s.label;
    return segs[segs.length - 1].label;
  }

  classifyDevelopmentalLevel(smv) {
    const coalition = smv.clusters?.coalitionRank || 0;
    const repro = smv.clusters?.reproductiveConfidence || 0;
    const avg = (coalition + repro) / 2;
    for (const l of DEVELOPMENTAL_LEVELS) if (avg >= l.min) return l.label;
    return DEVELOPMENTAL_LEVELS[DEVELOPMENTAL_LEVELS.length - 1].label;
  }

  calculateDelusionIndex(smv) {
    const p = this.preferences;
    let score = 0;
    if (this.currentGender === 'male') {
      const ageDelta = (p.age || 0) - (p.target_age_max || 0);
      if (ageDelta > 10 && smv.overall < 70) score += 20;
      if (ageDelta > 15 && smv.overall < 60) score += 30;
      const phys = p.physical_standards || 0;
      if (phys >= 5 && (smv.clusters?.axisOfAttraction || 0) < 60) score += 25;
      if (phys >= 7 && (smv.clusters?.axisOfAttraction || 0) < 70) score += 35;
    } else {
      const h = p.height_requirement || 0;
      const inc = p.income_requirement || 0;
      const st = p.status_requirement || 0;
      if (h >= 7 && smv.overall < 70) score += 25;
      if (h >= 10 && smv.overall < 80) score += 40;
      if (inc >= 7 && smv.overall < 70) score += 25;
      if (inc >= 10 && smv.overall < 80) score += 40;
      if (st >= 7 && smv.overall < 65) score += 20;
      const age = p.age || 25;
      if (age > 30 && (h >= 7 || inc >= 7)) score += 15;
      if (age > 35 && (h >= 7 || inc >= 7)) score += 25;
    }
    return Math.min(score, 100);
  }

  analyzeTargetMarket(smv) {
    const m = { realistic: '', aspirational: '' };
    if (this.currentGender === 'male') {
      if (smv.overall >= 80) { m.realistic = 'Top 20-30% of women (7-9/10 range)'; m.aspirational = 'Top 10% possible'; }
      else if (smv.overall >= 60) { m.realistic = 'Top 40-60% of women (5-7/10 range)'; m.aspirational = 'Top 30% with optimization'; }
      else if (smv.overall >= 40) { m.realistic = 'Average to below average (4-6/10)'; m.aspirational = 'Top 50% with improvement'; }
      else { m.realistic = 'Bottom 40%'; m.aspirational = 'Average with major self-improvement'; }
    } else {
      if (smv.overall >= 80) { m.realistic = 'Top 10-20% of men'; m.aspirational = 'Top 5% accessible'; }
      else if (smv.overall >= 60) { m.realistic = 'Top 30-50% of men'; m.aspirational = 'Top 20% with optimization'; }
      else if (smv.overall >= 40) { m.realistic = 'Average men'; m.aspirational = 'Above average possible'; }
      else { m.realistic = 'Below average'; m.aspirational = 'Average with improvement'; }
    }
    return m;
  }

  generateRecommendation(smv) {
    const r = { priority: '', tactical: [], strategic: '', warning: '' };
    if (this.currentGender === 'male') {
      if (smv.overall < 40) { r.priority = 'CRITICAL DEVELOPMENT NEEDED'; r.tactical = ['Focus on income/provider capability', 'Start fitness regimen 3x/week', 'Develop one high-value skill', 'Lower short-term standards to build experience']; r.strategic = 'SMV below average. Focus on fundamentals before pursuing high-value women.'; }
      else if (smv.overall < 60) { r.priority = 'Optimization Phase'; r.tactical = ['Maximize earning potential', 'Build visible status markers', 'Expand social proof', 'Improve physical presentation']; r.strategic = 'Average SMV. Strategic improvements can move you into keeper territory.'; }
      else { r.priority = 'Refinement and Leverage'; r.tactical = ['Leverage high SMV for mate selection', 'Be selective', 'Maintain edge', 'Consider long-term strategy']; r.strategic = 'Strong SMV. Focus on finding the right match.'; }
      if (smv.delusionIndex > 50) r.warning = 'WARNING: Your standards significantly exceed your market value. Adjust expectations or commit to major self-improvement.';
    } else {
      if (smv.overall < 40) { r.priority = 'CRITICAL DEVELOPMENT NEEDED'; r.tactical = ['Physical optimization paramount', 'Reduce risk indicators', 'Develop nurturing/cooperative skills', 'Lower standards to realistic range']; r.strategic = 'SMV below average. Without improvement, high-value men will not commit long-term.'; }
      else if (smv.overall < 60) { r.priority = 'Optimization Phase'; r.tactical = ['Maximize physical attractiveness', 'Develop feminine nurturing traits', 'Minimize drama/conflict', 'Build cooperative partnership skills']; r.strategic = 'Average SMV. Improvements can access above-average men.'; }
      else { r.priority = 'Leverage and Selection'; r.tactical = ['Be selective for commitment', 'Vet for provider, protector, parental capacity', 'Maintain SMV through health/beauty', 'Act while SMV is high']; r.strategic = 'Strong SMV. Focus on selecting the right high-value man.'; }
      if (smv.delusionIndex > 50) r.warning = 'WARNING: Your standards (height/income/status) significantly exceed your market value. Adjust standards or dramatically improve SMV.';
    }
    return r;
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    const s = this.smv;
    const rec = s.recommendation || {};

    let html = `
      <div class="results-dashboard">
        <div class="results-header"><h2>Your Sexual Market Value Profile</h2><p class="results-subtitle">${this.currentGender === 'male' ? 'Male' : 'Female'} SMV Assessment</p></div>
        <div class="overall-score-card">
          <div class="score-display"><div class="score-number">${Math.round(s.overall)}</div><div class="score-label">SMV Percentile</div><div class="score-percentile">${s.marketPosition}</div></div>
          <div class="score-interpretation"><p>${this.getSMVInterpretation(s.overall)}</p></div>
        </div>
        ${s.delusionIndex > 30 ? `<div class="delusion-warning"><h3>⚠️ Delusion Index: ${Math.round(s.delusionIndex)}%</h3><p>${this.getDelusionWarning(s.delusionIndex)}</p></div>` : ''}
        <div class="level-classification"><h3>Developmental Level</h3><p><strong>${s.levelClassification}</strong></p></div>
        <div class="cluster-scores"><h3>SMV Component Breakdown</h3>
        ${Object.keys(s.clusters || {}).map(k => `<div class="cluster-card"><div class="cluster-header"><h4>${this.formatClusterName(k)}</h4><span class="cluster-score">${Math.round(s.clusters[k])}th Percentile</span></div><div class="cluster-bar"><div class="cluster-bar-fill" style="width:${s.clusters[k]}%;background:${this.getPercentileColor(s.clusters[k])}"></div></div></div>`).join('')}
        </div>
        <div class="market-analysis"><h3>Market Position Analysis</h3><div class="market-grid"><div class="market-card"><h4>Realistic Target</h4><p>${s.targetMarket?.realistic || ''}</p></div><div class="market-card"><h4>Aspirational</h4><p>${s.targetMarket?.aspirational || ''}</p></div></div></div>
        <div class="recommendations"><h3>Strategic Recommendations</h3><div class="priority-box ${rec.priority?.includes('CRITICAL') ? 'critical' : 'normal'}"><h4>${rec.priority || ''}</h4><p>${rec.strategic || ''}</p></div>
        ${rec.warning ? `<div class="warning-box"><strong>⚠️ Reality Check:</strong><p>${rec.warning}</p></div>` : ''}
        <div class="tactical-actions"><h4>Immediate Actions</h4><ol>${(rec.tactical || []).map(a => `<li>${SecurityUtils.sanitizeHTML(a)}</li>`).join('')}</ol></div>
        </div>
      </div>`;
    container.innerHTML = html;
  }

  formatClusterName(id) {
    const map = { coalitionRank: 'Coalition Rank', reproductiveConfidence: 'Reproductive Confidence', axisOfAttraction: 'Axis of Attraction' };
    return map[id] || id;
  }

  getPercentileColor(p) { if (p >= 80) return '#2ecc71'; if (p >= 60) return '#3498db'; if (p >= 40) return '#f39c12'; return '#e74c3c'; }
  getSMVInterpretation(smv) {
    if (smv >= 80) return `You are in the top quintile. Significant options and leverage.`;
    if (smv >= 60) return `Above average. With optimization, you can access high-quality partners.`;
    if (smv >= 40) return `Average range. Focused improvement will expand options.`;
    return `Below average. Significant development needed.`;
  }
  getDelusionWarning(i) {
    if (i >= 70) return 'SEVERE MISMATCH: Expectations dramatically out of alignment with market value.';
    if (i >= 50) return 'SIGNIFICANT MISMATCH: Standards exceed market position. Adjust or improve.';
    return 'MODERATE MISMATCH: Some recalibration needed.';
  }

  generateSampleReport() {
    this.currentGender = Math.random() < 0.5 ? 'male' : 'female';
    this.responses = {};
    this.preferences = {};
    const prefQ = this.getPreferenceQuestions();
    prefQ.forEach(q => {
      if (q.type === 'number') this.preferences[q.id] = q.min + Math.floor(Math.random() * (q.max - q.min + 1));
      else if (q.type === 'scale' && q.options) this.preferences[q.id] = q.options[Math.floor(Math.random() * q.options.length)].value;
      else if (q.type === 'select' && q.options) this.preferences[q.id] = q.options[Math.floor(Math.random() * q.options.length)].value;
    });
    const clusters = this.getClusters();
    Object.values(clusters).forEach(cluster => {
      (cluster.questions || []).forEach(q => {
        const opts = q.options || [1, 3, 5, 7, 10];
        this.responses[q.id] = opts[Math.floor(Math.random() * opts.length)];
      });
    });
    this.calculateAndShowResults();
  }

  abandonAssessment() {
    if (confirm('Abandon and restart? All progress will be lost.')) this.resetAssessment();
  }

  resetAssessment() {
    this.currentGender = null;
    this.currentPhase = -1;
    this.responses = {};
    this.preferences = {};
    this.smv = {};
    this.ui.transition('idle');
    window.scrollTo(0, 0);
  }

  exportAnalysis(format) {
    const data = { gender: this.currentGender, timestamp: new Date().toISOString(), preferences: this.preferences, responses: this.responses, smv: this.smv };
    if (format === 'json') {
      downloadFile(exportJSON(data, 'attraction', 'Status Selection Attraction'), `smv-${this.currentGender}-${Date.now()}.json`, 'application/json');
    } else if (format === 'csv') {
      let csv = 'Metric,Value\n';
      csv += `Overall SMV,${Math.round(this.smv.overall)}\nMarket Position,${this.smv.marketPosition}\nDelusion Index,${Math.round(this.smv.delusionIndex)}\n`;
      Object.entries(this.smv.clusters || {}).forEach(([k, v]) => { csv += `${this.formatClusterName(k)},${Math.round(v)}\n`; });
      downloadFile(csv, `smv-${this.currentGender}-${Date.now()}.csv`, 'text/csv');
    }
  }

  exportExecutiveBrief() {
    const data = { ...this.smv, gender: this.currentGender, preferences: this.preferences, quadrants: {} };
    const brief = exportExecutiveBrief(data, 'attraction', 'Status Selection Attraction');
    downloadFile(brief, `smv-brief-${this.currentGender}-${Date.now()}.txt`, 'text/plain');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window.attractionEngine = new AttractionEngine(); });
} else {
  window.attractionEngine = new AttractionEngine();
}
