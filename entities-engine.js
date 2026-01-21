import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, SecurityUtils } from './shared/utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';
import { exportJSON, downloadFile } from './shared/export-utils.js';

let DSM5_CATEGORIES, NODES, CHANNELS, NEEDS_VOCABULARY;
let WILL_ANOMALY_TIERS, WILL_ANOMALY_QUESTIONS, TASTE_SKEW_OPTIONS, CONTRACT_THEMES, NODE_CONTRACT_MAP, NODE_TAINTED_EXPRESSIONS;

export class EntitiesEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.currentStage = 'tier';
    this.answers = {};
    this.tasteSkews = [];
    this.contractTheme = '';
    this.intake = {
      pathologyCategory: '',
      pathologyDisorder: '',
      node: '',
      channel: '',
      rootNeed: ''
    };
    this.analysisData = {
      timestamp: new Date().toISOString(),
      intake: {},
      tierScores: {},
      tierResult: null,
      tasteSkews: [],
      tasteSkewSelections: [],
      tasteSkewSuggestions: [],
      contract: null
    };

    this.ui = new EngineUIController({
      idle: {
        show: ['#introSection', '#intakeSection', '#actionButtonsSection', '#disclaimerSection'],
        hide: ['#questionnaireSection', '#resultsSection']
      },
      assessment: {
        show: ['#questionnaireSection'],
        hide: ['#introSection', '#intakeSection', '#actionButtonsSection', '#disclaimerSection', '#resultsSection']
      },
      results: {
        show: ['#resultsSection'],
        hide: ['#introSection', '#intakeSection', '#actionButtonsSection', '#disclaimerSection', '#questionnaireSection']
      }
    });

    this.debugReporter = createDebugReporter('EntitiesEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();

    this.dataStore = new DataStore('entities-assessment', '1.0.0');
    this.init();
  }

  async init() {
    try {
      await this.loadEntitiesData();
      this.populateIntakeSelectors();
      this.bindEvents();
      await this.loadStoredData();
      if (this.shouldAutoGenerateSample()) {
        this.generateSampleReport();
        return;
      }
      this.ui.transition('idle');
    } catch (error) {
      this.debugReporter.logError(error, 'EntitiesEngine init');
      ErrorHandler.showUserError('Failed to initialize the entities assessment.');
    }
  }

  async loadEntitiesData() {
    if (DSM5_CATEGORIES && NODES && WILL_ANOMALY_TIERS) return;
    const dsmModule = await loadDataModule('./dsm5-data.js', 'DSM-5 Data');
    DSM5_CATEGORIES = dsmModule.DSM5_CATEGORIES;
    const nodesModule = await loadDataModule('./channel-data/nodes.js', 'Channel Nodes');
    NODES = nodesModule.NODES;
    const channelsModule = await loadDataModule('./channel-data/channels.js', 'Channel Channels');
    CHANNELS = channelsModule.CHANNELS;
    const needsModule = await loadDataModule('./needs-dependency-data/needs-vocabulary.js', 'Needs Vocabulary');
    NEEDS_VOCABULARY = needsModule.NEEDS_VOCABULARY;
    const entitiesModule = await loadDataModule('./entities-data.js', 'Entities Data');
    WILL_ANOMALY_TIERS = entitiesModule.WILL_ANOMALY_TIERS;
    WILL_ANOMALY_QUESTIONS = entitiesModule.WILL_ANOMALY_QUESTIONS;
    TASTE_SKEW_OPTIONS = entitiesModule.TASTE_SKEW_OPTIONS;
    CONTRACT_THEMES = entitiesModule.CONTRACT_THEMES;
    NODE_CONTRACT_MAP = entitiesModule.NODE_CONTRACT_MAP;
    NODE_TAINTED_EXPRESSIONS = entitiesModule.NODE_TAINTED_EXPRESSIONS;
  }

  populateIntakeSelectors() {
    const pathologyCategory = document.getElementById('pathologyCategory');
    const pathologyDisorder = document.getElementById('pathologyDisorder');
    const nodeSelect = document.getElementById('nodeSelect');
    const channelSelect = document.getElementById('channelSelect');
    const rootNeedSelect = document.getElementById('rootNeedSelect');

    if (pathologyCategory) {
      pathologyCategory.innerHTML = '<option value="">Select a pathology category</option>';
      Object.entries(DSM5_CATEGORIES || {}).forEach(([key, category]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = category.name;
        pathologyCategory.appendChild(option);
      });
      pathologyCategory.addEventListener('change', () => {
        const categoryKey = pathologyCategory.value;
        this.populateDisorders(pathologyDisorder, categoryKey);
      });
    }

    if (nodeSelect) {
      nodeSelect.innerHTML = '<option value="">Select a primary node</option>';
      Object.values(NODES || {}).forEach(node => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = `${node.name} — ${node.description}`;
        nodeSelect.appendChild(option);
      });
      nodeSelect.addEventListener('change', () => {
        this.populateChannels(channelSelect, nodeSelect.value);
      });
    }

    if (channelSelect) {
      this.populateChannels(channelSelect, '');
    }

    if (rootNeedSelect) {
      rootNeedSelect.innerHTML = '<option value="">Select a root need</option>';
      Object.values(NEEDS_VOCABULARY || {}).forEach(group => {
        group.needs.forEach(need => {
          const option = document.createElement('option');
          option.value = need;
          option.textContent = `${group.category}: ${need}`;
          rootNeedSelect.appendChild(option);
        });
      });
    }
  }

  populateDisorders(select, categoryKey) {
    if (!select) return;
    select.innerHTML = '<option value="">Select a disorder</option>';
    const category = DSM5_CATEGORIES?.[categoryKey];
    if (!category?.disorders) return;
    Object.keys(category.disorders).forEach(disorder => {
      const option = document.createElement('option');
      option.value = disorder;
      option.textContent = disorder;
      select.appendChild(option);
    });
  }

  populateChannels(select, nodeKey) {
    if (!select) return;
    select.innerHTML = '<option value="">Select a channel</option>';
    Object.values(CHANNELS || {}).forEach(channel => {
      if (nodeKey && channel.from !== nodeKey && channel.to !== nodeKey) return;
      const option = document.createElement('option');
      option.value = channel.id;
      option.textContent = channel.name;
      select.appendChild(option);
    });
  }

  bindEvents() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startAssessment());
    }

    const resumeBtn = document.getElementById('resumeAssessment');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.loadStoredData();
      });
    }

    const resetBtn = document.getElementById('clearCacheBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetAssessment());
    }

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => this.generateSampleReport());
    }

    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());

    const exportJSONBtn = document.getElementById('exportJSON');
    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportJSONBtn) exportJSONBtn.addEventListener('click', () => exportJSON(this.analysisData, 'entities'));
    if (exportCSVBtn) exportCSVBtn.addEventListener('click', () => this.exportCSV());
  }

  shouldAutoGenerateSample() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sample')) return false;
    const value = params.get('sample');
    return value === null || value === '' || value === '1' || value === 'true';
  }

  captureIntake() {
    this.intake = {
      pathologyCategory: document.getElementById('pathologyCategory')?.value || '',
      pathologyDisorder: document.getElementById('pathologyDisorder')?.value || '',
      node: document.getElementById('nodeSelect')?.value || '',
      channel: document.getElementById('channelSelect')?.value || '',
      rootNeed: document.getElementById('rootNeedSelect')?.value || ''
    };
  }

  validateIntake() {
    const { pathologyCategory, pathologyDisorder, node, channel, rootNeed } = this.intake;
    if (!pathologyCategory || !pathologyDisorder || !node || !channel || !rootNeed) {
      ErrorHandler.showUserError('Please complete pathology, node/channel, and root need selections before starting.');
      return false;
    }
    return true;
  }

  startAssessment() {
    this.captureIntake();
    if (!this.validateIntake()) return;
    this.currentQuestionIndex = 0;
    this.currentStage = 'tier';
    this.answers = {};
    this.tasteSkews = [];
    this.contractTheme = '';
    this.ui.transition('assessment');
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderCurrentQuestion() {
    if (this.currentStage === 'taste') {
      this.renderTasteSkewStep();
      return;
    }
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = document.getElementById('questionCount');
    const progressFill = document.getElementById('progressFill');
    const question = WILL_ANOMALY_QUESTIONS[this.currentQuestionIndex];
    if (!question || !questionContainer) return;

    if (questionCount) {
      questionCount.textContent = `Question ${this.currentQuestionIndex + 1} of ${WILL_ANOMALY_QUESTIONS.length}`;
    }
    if (progressFill) {
      progressFill.style.width = `${((this.currentQuestionIndex + 1) / WILL_ANOMALY_QUESTIONS.length) * 100}%`;
    }

    const optionsHtml = question.options.map((option, idx) => {
      const checked = this.answers[question.id] === idx ? 'checked' : '';
      return `
        <label class="option-label">
          <input type="radio" name="question_${question.id}" value="${idx}" ${checked}>
          <span>${SecurityUtils.sanitizeHTML(option.label)}</span>
        </label>
      `;
    }).join('');

    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>${SecurityUtils.sanitizeHTML(question.text)}</h3>
        <div class="options-container">
          ${optionsHtml}
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
    if (prevBtn) prevBtn.disabled = this.currentStage === 'tier' && this.currentQuestionIndex === 0;
    if (nextBtn) {
      if (this.currentStage === 'taste') {
        nextBtn.textContent = 'Finish';
      } else {
        nextBtn.textContent = this.currentQuestionIndex === WILL_ANOMALY_QUESTIONS.length - 1 ? 'Next' : 'Next';
      }
    }
  }

  prevQuestion() {
    if (this.currentStage === 'taste') {
      this.currentStage = 'tier';
      this.currentQuestionIndex = WILL_ANOMALY_QUESTIONS.length - 1;
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
    if (this.currentStage === 'taste') {
      this.completeAssessment();
      return;
    }
    const question = WILL_ANOMALY_QUESTIONS[this.currentQuestionIndex];
    if (!question || typeof this.answers[question.id] !== 'number') {
      ErrorHandler.showUserError('Please select an option to continue.');
      return;
    }
    if (this.currentQuestionIndex < WILL_ANOMALY_QUESTIONS.length - 1) {
      this.currentQuestionIndex += 1;
      this.renderCurrentQuestion();
      this.saveProgress();
      return;
    }
    this.currentStage = 'taste';
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderTasteSkewStep() {
    const questionContainer = document.getElementById('questionContainer');
    const questionCount = document.getElementById('questionCount');
    const progressFill = document.getElementById('progressFill');
    if (!questionContainer) return;
    if (questionCount) {
      questionCount.textContent = 'Taste Skew Investigation';
    }
    if (progressFill) {
      progressFill.style.width = '100%';
    }

    const nodeKey = this.intake.node;
    const channelKey = this.intake.channel;
    const nodeExpressions = NODE_TAINTED_EXPRESSIONS?.[nodeKey] || [];
    const channelExpression = CHANNELS?.[channelKey]?.blocked || '';
    const suggestions = [
      ...nodeExpressions,
      ...(channelExpression ? [channelExpression] : [])
    ];

    const selections = new Set(this.tasteSkews || []);
    const buildCheckbox = (label) => `
      <label class="option-label">
        <input type="checkbox" value="${SecurityUtils.sanitizeHTML(label)}" ${selections.has(label) ? 'checked' : ''}>
        <span>${SecurityUtils.sanitizeHTML(label)}</span>
      </label>
    `;

    questionContainer.innerHTML = `
      <div class="question-block">
        <h3>Taste Skew and Tainted Expressions</h3>
        <p class="form-help">Select any distorted habits or lifestyle expressions that resonate. These are inferred from the node and channel library.</p>
        ${nodeExpressions.length ? `
          <h4>Node Taint Expressions</h4>
          <div class="options-container">
            ${nodeExpressions.map(buildCheckbox).join('')}
          </div>
        ` : ''}
        ${channelExpression ? `
          <h4>Channel Taint Expression</h4>
          <div class="options-container">
            ${[channelExpression].map(buildCheckbox).join('')}
          </div>
        ` : ''}
      </div>
    `;

    questionContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const checked = Array.from(questionContainer.querySelectorAll('input[type="checkbox"]'))
          .filter(box => box.checked)
          .map(box => box.value);
        this.tasteSkews = checked;
        this.saveProgress();
      });
    });

    this.updateNavButtons();
  }

  scoreTiers() {
    const scores = { tier1: 0, tier2: 0, tier3: 0 };
    WILL_ANOMALY_QUESTIONS.forEach(question => {
      const selected = this.answers[question.id];
      if (typeof selected !== 'number') return;
      const option = question.options[selected];
      if (!option?.scores) return;
      Object.entries(option.scores).forEach(([tier, value]) => {
        scores[tier] += value;
      });
    });
    return scores;
  }

  deriveContract(nodeId) {
    if (this.contractTheme) {
      return CONTRACT_THEMES.find(theme => theme.id === this.contractTheme) || null;
    }
    const themeId = NODE_CONTRACT_MAP?.[nodeId] || '';
    return CONTRACT_THEMES.find(theme => theme.id === themeId) || null;
  }

  buildStrategySteps({ tierResult, tierData, contract, nodeInfo, channelInfo, rootNeed }) {
    const nodeLabel = nodeInfo?.name || 'the selected node';
    const nodeFunction = nodeInfo?.function || 'core function';
    const channelLabel = channelInfo?.name || 'the selected channel';
    const channelBlock = channelInfo?.blocked || 'a blocked flow pattern';
    const rootNeedText = rootNeed ? `root need "${rootNeed}"` : 'the root need named in your loop chain';
    const contractLabel = contract?.label || 'the likely contract theme';

    if (tierResult === 'tier1') {
      return [
        `Locate how ${nodeLabel} (${nodeFunction}) is hijacked; name the protector pattern that spikes it.`,
        `Trace the original threat or invalidation that formed this overcompensation around ${rootNeedText}.`,
        `Re-regulate the ${nodeLabel} node through daily boundary practice and reparenting in trigger contexts.`,
        `Address the channel disruption (${channelLabel}): ${channelBlock}`
      ];
    }

    if (tierResult === 'tier2') {
      return [
        `Dis‑identify from the foreign override and name the contract: ${contractLabel}.`,
        `Locate the wound tied to ${rootNeedText} and demonstrate that the contract conditions no longer apply.`,
        `Stabilize the housing node (${nodeLabel}) through consistent, grounded regulation.`,
        `Disrupt the channel pattern (${channelLabel}): ${channelBlock}`
      ];
    }

    return [
      `Stabilize safety and reduce exposure to reinforcing environments while restoring the ${nodeLabel} node.`,
      `Use containment and external accountability to interrupt entrenched override patterns.`,
      `Address the channel distortion (${channelLabel}): ${channelBlock}`,
      `Pair reclamation with trauma‑focused modalities (e.g., EMDR) and structured support.`
    ];
  }

  completeAssessment() {
    this.captureIntake();
    const tierScores = this.scoreTiers();
    const tierResult = Object.entries(tierScores)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'tier1';

    const tierData = WILL_ANOMALY_TIERS[tierResult];
    const contract = this.deriveContract(this.intake.node);
    const nodeInfo = NODES?.[this.intake.node];
    const channelInfo = CHANNELS?.[this.intake.channel];
    const nodeExpressions = NODE_TAINTED_EXPRESSIONS?.[this.intake.node] || [];
    const channelExpression = CHANNELS?.[this.intake.channel]?.blocked || '';
    const tasteSkewSuggestions = [
      ...nodeExpressions,
      ...(channelExpression ? [channelExpression] : [])
    ];
    const strategySteps = this.buildStrategySteps({
      tierResult,
      tierData,
      contract,
      nodeInfo,
      channelInfo,
      rootNeed: this.intake.rootNeed
    });

    this.analysisData = {
      timestamp: new Date().toISOString(),
      intake: { ...this.intake },
      tierScores,
      tierResult,
      tierSummary: tierData,
      strategySteps,
      tasteSkews: tierData?.tasteSkew || [],
      tasteSkewSelections: this.tasteSkews || [],
      tasteSkewSuggestions,
      contract
    };

    this.renderResults();
    this.ui.transition('results');
    this.saveProgress();
  }

  renderResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    const tierData = this.analysisData.tierSummary;
    const contract = this.analysisData.contract;
    const pathologyName = DSM5_CATEGORIES?.[this.intake.pathologyCategory]?.name || this.intake.pathologyCategory;
    const nodeName = NODES?.[this.intake.node]?.name || this.intake.node;
    const channelName = CHANNELS?.[this.intake.channel]?.name || this.intake.channel;

    resultsContainer.innerHTML = `
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Intake Summary</h3>
        <ul class="feature-list">
          <li><strong>Pathology:</strong> ${SecurityUtils.sanitizeHTML(pathologyName || '—')} — ${SecurityUtils.sanitizeHTML(this.intake.pathologyDisorder || '—')}</li>
          <li><strong>Node/Channel:</strong> ${SecurityUtils.sanitizeHTML(nodeName || '—')} / ${SecurityUtils.sanitizeHTML(channelName || '—')}</li>
          <li><strong>Root Need:</strong> ${SecurityUtils.sanitizeHTML(this.intake.rootNeed || '—')}</li>
        </ul>
      </div>
      <div class="panel panel-outline">
        <h3 class="panel-title">Will Anomaly Tier</h3>
        <p class="panel-text"><strong>${SecurityUtils.sanitizeHTML(tierData?.label || '')}</strong> — ${SecurityUtils.sanitizeHTML(tierData?.subtitle || '')}</p>
        <p class="panel-text">${SecurityUtils.sanitizeHTML(tierData?.summary || '')}</p>
        <p class="panel-text"><strong>Diagnostic Signature:</strong> ${SecurityUtils.sanitizeHTML(tierData?.diagnosticSignature || '')}</p>
        <p class="panel-text"><strong>Primary Healing Mode:</strong> ${SecurityUtils.sanitizeHTML(tierData?.primaryHealingMode || '')}</p>
      </div>
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Taste Skew Consequences</h3>
        <ul class="feature-list">
          ${(tierData?.tasteSkew || []).map(item => `<li>${SecurityUtils.sanitizeHTML(item)}</li>`).join('')}
        </ul>
      </div>
      <div class="panel panel-outline">
        <h3 class="panel-title">Tainted Node/Channel Expressions</h3>
        <p class="panel-text">Inferred from the selected node and channel:</p>
        <ul class="feature-list">
          ${(this.analysisData.tasteSkewSuggestions || []).map(item => `<li>${SecurityUtils.sanitizeHTML(item)}</li>`).join('')}
        </ul>
        <p class="panel-text"><strong>Why the taint exists:</strong> The will traded clarity for relief. To meet the unmet need (${SecurityUtils.sanitizeHTML(this.intake.rootNeed || 'unspecified')}), taste and impulse skew toward short‑term safety or control, and the node/channel narrows around that bargain.</p>
      </div>
      ${this.analysisData.tasteSkewSelections?.length ? `
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Selected Taste Skews</h3>
        <ul class="feature-list">
          ${this.analysisData.tasteSkewSelections.map(item => `<li>${SecurityUtils.sanitizeHTML(item)}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      <div class="panel panel-outline">
        <h3 class="panel-title">Likely Contract</h3>
        <p class="panel-text"><strong>${SecurityUtils.sanitizeHTML(contract?.label || 'Unspecified')}</strong></p>
        <p class="panel-text">${SecurityUtils.sanitizeHTML(contract?.description || 'Consider which wound or unmet need might have anchored the contract.')}</p>
        <p class="panel-text"><strong>Why the contract existed:</strong> It formed to meet the unmet need (${SecurityUtils.sanitizeHTML(this.intake.rootNeed || 'unspecified')}) when personal capacity felt insufficient. The contract supplied stability or protection at the cost of partial will‑surrender.</p>
      </div>
      <div class="panel panel-outline-accent">
        <h3 class="panel-title">Strategy for Reclamation</h3>
        <ul class="feature-list">
          ${(this.analysisData.strategySteps || tierData?.strategy || []).map(step => `<li>${SecurityUtils.sanitizeHTML(step)}</li>`).join('')}
        </ul>
      </div>
      <div class="panel panel-outline">
        <p class="panel-text"><strong>Safety note:</strong> This framework is for structured self-inquiry. If experiences feel overwhelming or destabilizing, seek qualified support and prioritize safety.</p>
      </div>
    `;
  }

  saveProgress() {
    const progress = {
      currentQuestionIndex: this.currentQuestionIndex,
      currentStage: this.currentStage,
      answers: this.answers,
      tasteSkews: this.tasteSkews,
      intake: this.intake,
      analysisData: this.analysisData
    };
    this.dataStore.save('progress', progress);
  }

  async loadStoredData() {
    try {
      const progress = this.dataStore.load('progress');
      if (!progress) return;
      this.currentQuestionIndex = progress.currentQuestionIndex || 0;
      this.currentStage = progress.currentStage || 'tier';
      this.answers = progress.answers || {};
      this.tasteSkews = progress.tasteSkews || [];
      this.intake = progress.intake || this.intake;
      this.analysisData = progress.analysisData || this.analysisData;
      if (this.analysisData?.tierResult) {
        this.renderResults();
        this.ui.transition('results');
      } else if (Object.keys(this.answers).length > 0) {
        this.ui.transition('assessment');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
    }
  }

  generateSampleReport() {
    this.generateSample();
    this.captureIntake();
    if (!this.validateIntake()) return;
    WILL_ANOMALY_QUESTIONS.forEach(question => {
      this.answers[question.id] = Math.floor(Math.random() * question.options.length);
    });
    const nodeExpressions = NODE_TAINTED_EXPRESSIONS?.[this.intake.node] || [];
    const channelExpression = CHANNELS?.[this.intake.channel]?.blocked || '';
    const suggestions = [
      ...nodeExpressions,
      ...(channelExpression ? [channelExpression] : [])
    ];
    this.tasteSkews = suggestions.length ? [suggestions[0]] : [];
    this.completeAssessment();
  }

  generateSample() {
    const pathologyCategory = Object.keys(DSM5_CATEGORIES || {})[0];
    const disorder = pathologyCategory ? Object.keys(DSM5_CATEGORIES[pathologyCategory].disorders || {})[0] : '';
    const node = Object.keys(NODES || {})[0];
    const channel = Object.keys(CHANNELS || {})[0];
    const needsGroup = Object.values(NEEDS_VOCABULARY || {})[0];
    const rootNeed = needsGroup?.needs?.[0] || '';

    document.getElementById('pathologyCategory').value = pathologyCategory || '';
    this.populateDisorders(document.getElementById('pathologyDisorder'), pathologyCategory || '');
    document.getElementById('pathologyDisorder').value = disorder || '';
    document.getElementById('nodeSelect').value = node || '';
    this.populateChannels(document.getElementById('channelSelect'), node || '');
    document.getElementById('channelSelect').value = channel || '';
    document.getElementById('rootNeedSelect').value = rootNeed || '';
  }

  exportCSV() {
    const rows = [
      ['Field', 'Value'],
      ['Timestamp', this.analysisData.timestamp || ''],
      ['Pathology Category', this.analysisData.intake?.pathologyCategory || ''],
      ['Pathology Disorder', this.analysisData.intake?.pathologyDisorder || ''],
      ['Node', this.analysisData.intake?.node || ''],
      ['Channel', this.analysisData.intake?.channel || ''],
      ['Root Need', this.analysisData.intake?.rootNeed || ''],
      ['Tier Result', this.analysisData.tierResult || ''],
      ['Tier Label', this.analysisData.tierSummary?.label || ''],
      ['Primary Healing Mode', this.analysisData.tierSummary?.primaryHealingMode || ''],
      ['Likely Contract', this.analysisData.contract?.label || ''],
      ['Contract Description', this.analysisData.contract?.description || ''],
      ['Taste Skew Selections', (this.analysisData.tasteSkewSelections || []).join('; ')],
      ['Taste Skew Suggestions', (this.analysisData.tasteSkewSuggestions || []).join('; ')]
    ];

    const csv = rows
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    downloadFile(csv, 'entities-assessment.csv', 'text/csv');
  }

  resetAssessment() {
    this.dataStore.clear();
    this.currentQuestionIndex = 0;
    this.currentStage = 'tier';
    this.answers = {};
    this.tasteSkews = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      intake: {},
      tierScores: {},
      tierResult: null,
      tasteSkews: [],
      tasteSkewSelections: [],
      tasteSkewSuggestions: [],
      contract: null
    };
    this.ui.transition('idle');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.entitiesEngine = new EntitiesEngine();
});

