// Channels Engine - Version 2.1
// Multi-Phase Questionnaire Architecture
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportExecutiveBrief, exportJSON, downloadFile } from './shared/export-utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';

// Data modules - will be loaded lazily
let NODES, CHANNELS, REMEDIATION_STRATEGIES;
let PHASE_1_NODE_QUESTIONS, generatePhase3ChannelQuestions;

/**
 * Channels Engine - Identifies open/closed channels through multi-phase assessment
 */
export class ChannelsEngine {
  /**
   * Initialize the channels engine
   */
  constructor() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.nodeScores = {}; // Phase 1 results: { node: { state: 'abundant'|'balanced'|'lacking', score: number } }
    this.prioritizedChannels = []; // Phase 2: User-selected 2-3 priority channels
    this.assessedChannels = []; // Phase 3: Channels that have been assessed
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      nodeScores: {},
      channelScores: {},
      prioritizedChannels: [],
      finalChannels: [],
      remediationStrategies: [],
      allAnswers: {},
      questionSequence: []
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('ChannelsEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('channels-assessment', '1.0.0');

    this.ui = new EngineUIController({
      idle: {
        show: ['#introSection', '#actionButtonsSection'],
        hide: ['#questionnaireSection', '#resultsSection']
      },
      assessment: {
        show: ['#questionnaireSection'],
        hide: ['#introSection', '#actionButtonsSection', '#resultsSection']
      },
      results: {
        show: ['#resultsSection'],
        hide: ['#introSection', '#actionButtonsSection', '#questionnaireSection']
      }
    });
    
    this.init();
  }

  /**
   * Initialize the engine
   */
  init() {
    this.attachEventListeners();
    Promise.resolve(this.loadStoredData()).then(() => {
      if (this.shouldAutoGenerateSample()) {
        this.generateSampleReport();
      }
    }).catch(error => {
      this.debugReporter.logError(error, 'init');
    });
  }

  /**
   * Load channels data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadChannelsData() {
    if (NODES && CHANNELS && PHASE_1_NODE_QUESTIONS) {
      return; // Already loaded
    }

    try {
      // Load nodes data
      const nodesModule = await loadDataModule(
        './channel-data/nodes.js',
        'Channel Nodes'
      );
      NODES = nodesModule.NODES;

      // Load channels data
      const channelsModule = await loadDataModule(
        './channel-data/channels.js',
        'Channels Data'
      );
      CHANNELS = channelsModule.CHANNELS;

      // Load remediation strategies data
      const remediationModule = await loadDataModule(
        './channel-data/remediation-strategies.js',
        'Remediation Strategies'
      );
      REMEDIATION_STRATEGIES = remediationModule.REMEDIATION_STRATEGIES;

      // Load questions data
      const questionsModule = await loadDataModule(
        './channel-data/channel-questions.js',
        'Channel Questions'
      );
      PHASE_1_NODE_QUESTIONS = questionsModule.PHASE_1_NODE_QUESTIONS;
      generatePhase3ChannelQuestions = questionsModule.generatePhase3ChannelQuestions;

      this.debugReporter.recordSection('Phase 1', Object.keys(PHASE_1_NODE_QUESTIONS || {}).length * 2);
    } catch (error) {
      this.debugReporter.logError(error, 'loadChannelsData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.startAssessment();
      });
    }

    const resumeBtn = document.getElementById('resumeAssessment');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        sessionStorage.setItem(`resume:${this.dataStore.namespace}`, 'true');
        window.location.reload();
      });
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
    
    const exportJSONBtn = document.getElementById('exportAnalysisJson');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportAnalysis('json'));
    }
    
    const exportCSVBtn = document.getElementById('exportAnalysisCsv');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportAnalysis('csv'));
    }

    const exportBriefBtn = document.getElementById('exportExecutiveBrief');
    if (exportBriefBtn) {
      exportBriefBtn.addEventListener('click', () => this.exportExecutiveBrief());
    }

    const sampleBtn = document.getElementById('generateSampleReport');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => this.generateSampleReport());
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

  shouldAutoGenerateSample() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('sample')) return false;
    const value = params.get('sample');
    if (value === null || value === '' || value === '1' || value === 'true') return true;
    return false;
  }

  getEmptyAnalysisData() {
    return {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      prioritizedChannels: [],
      assessedChannels: [],
      channelScores: {},
      primaryChannel: null,
      secondaryChannels: [],
      allAnswers: {},
      questionSequence: []
    };
  }

  pickRandomIndices(length, count) {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, count);
  }

  answerQuestionForSample(question) {
    if (!question || !Array.isArray(question.options) || question.options.length === 0) return;
    if (question.type === 'multiselect') {
      const maxSelections = question.maxSelections || 3;
      const count = Math.min(question.options.length, Math.max(1, Math.ceil(Math.random() * maxSelections)));
      const selected = this.pickRandomIndices(question.options.length, count).map(idx => question.options[idx]);
      this.answers[question.id] = selected;
      if (this.currentPhase === 3) {
        this.processPhase3Answer(question);
      }
      return;
    }
    const option = question.options[Math.floor(Math.random() * question.options.length)];
    this.answers[question.id] = option;
    if (this.currentPhase === 3) {
      this.processPhase3Answer(question);
    }
  }

  async generateSampleReport() {
    try {
      await this.loadChannelsData();
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.questionSequence = [];
      this.prioritizedChannels = [];
      this.assessedChannels = [];
      this.analysisData = this.getEmptyAnalysisData();

      await this.buildPhase1Sequence();
      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      await this.analyzePhase1Results();

      this.questionSequence.forEach(q => this.answerQuestionForSample(q));
      await this.processPhase2Results();

      if (this.currentPhase === 3 && this.questionSequence.length > 0) {
        for (let i = 0; i < this.questionSequence.length; i += 1) {
          const question = this.questionSequence[i];
          this.answerQuestionForSample(question);
        }
        this.processPhase3Results();
      }

      this.completeAssessment();
    } catch (error) {
      this.debugReporter.logError(error, 'generateSampleReport');
      ErrorHandler.showUserError('Failed to generate sample report. Please try again.');
    }
  }

  async startAssessment() {
    const introSection = document.getElementById('introSection');
    const actionButtonsSection = document.getElementById('actionButtonsSection');
    const questionnaireSection = document.getElementById('questionnaireSection');

    this.ui.transition('assessment');

    await this.buildPhase1Sequence();
  }

  /**
   * Build Phase 1 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase1Sequence() {
    await this.loadChannelsData();
    
    try {
      // Phase 1: Core Node Assessment (7 nodes, 2 questions each = 14 questions)
      this.questionSequence = [];
      this.currentPhase = 1;
      this.currentQuestionIndex = 0;
      
      Object.keys(PHASE_1_NODE_QUESTIONS).forEach(nodeKey => {
        PHASE_1_NODE_QUESTIONS[nodeKey].forEach(question => {
          this.questionSequence.push({
            ...question,
            phase: 1,
            node: nodeKey
          });
        });
      });
      
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      
      // Show questionnaire if not already shown
      const questionnaireSection = document.getElementById('questionnaireSection');
      if (questionnaireSection && !questionnaireSection.classList.contains('active')) {
        questionnaireSection.classList.add('active');
      }
      
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase1Sequence');
      ErrorHandler.showUserError('Failed to build Phase 1 sequence. Please refresh the page.');
    }
  }

  /**
   * Analyze Phase 1 results and proceed to Phase 2
   * @returns {Promise<void>}
   */
  async analyzePhase1Results() {
    await this.loadChannelsData();
    
    try {
      // Calculate node scores from Phase 1 answers
      this.nodeScores = {};
      
      Object.keys(NODES).forEach(nodeKey => {
        const nodeQuestions = PHASE_1_NODE_QUESTIONS[nodeKey] || [];
        let totalScore = 0;
        let totalWeight = 0;
        
        nodeQuestions.forEach(question => {
          const answer = this.answers[question.id];
          if (answer && answer.mapsTo) {
            const state = answer.mapsTo.state;
            const weight = answer.mapsTo.weight || 1;
            
            // Score: abundant = 3, balanced = 2, lacking = 1
            const score = state === 'abundant' ? 3 : state === 'balanced' ? 2 : 1;
            totalScore += score * weight;
            totalWeight += weight;
          }
        });
        
        const avgScore = totalWeight > 0 ? totalScore / totalWeight : 2;
        const state = avgScore >= 2.5 ? 'abundant' : avgScore >= 1.5 ? 'balanced' : 'lacking';
        
        this.nodeScores[nodeKey] = {
          state: state,
          score: avgScore,
          node: NODES[nodeKey]
        };
      });
      
      this.analysisData.phase1Results = this.nodeScores;
      this.analysisData.nodeScores = this.nodeScores;
      
      // Build Phase 2 sequence
      await this.buildPhase2Sequence();
    } catch (error) {
      this.debugReporter.logError(error, 'analyzePhase1Results');
      ErrorHandler.showUserError('Failed to analyze Phase 1 results. Please try again.');
    }
  }

  /**
   * Build Phase 2 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase2Sequence() {
    await this.loadChannelsData();
    
    try {
    // Phase 2: Critical Channel Identification
    // Show Phase 1 results and ask user to prioritize 2-3 areas
    this.questionSequence = [];
    this.currentPhase = 2;
    this.currentQuestionIndex = 0;
    
    // Identify critical channels (weak nodes to strong nodes, adjacent nodes)
    const weakNodes = Object.keys(this.nodeScores).filter(key => 
      this.nodeScores[key].state === 'lacking'
    );
    const strongNodes = Object.keys(this.nodeScores).filter(key => 
      this.nodeScores[key].state === 'abundant'
    );
    
    const criticalChannels = [];
    
    // Channels from weak nodes to strong nodes (most likely to reveal blockages)
    weakNodes.forEach(weakNode => {
      strongNodes.forEach(strongNode => {
        const channelId = `${weakNode}_${strongNode}`;
        const reverseChannelId = `${strongNode}_${weakNode}`;
        if (CHANNELS[channelId]) {
          criticalChannels.push({ id: channelId, priority: 'high', reason: 'weak_to_strong' });
        }
        if (CHANNELS[reverseChannelId]) {
          criticalChannels.push({ id: reverseChannelId, priority: 'high', reason: 'strong_to_weak' });
        }
      });
    });
    
    // Adjacent nodes (most direct influence)
    const nodeOrder = ['root', 'sex', 'gut', 'heart', 'throat', 'mind', 'crown'];
    nodeOrder.forEach((node, index) => {
      if (index < nodeOrder.length - 1) {
        const nextNode = nodeOrder[index + 1];
        const channelId = `${node}_${nextNode}`;
        const reverseChannelId = `${nextNode}_${node}`;
        if (CHANNELS[channelId] && !criticalChannels.find(c => c.id === channelId)) {
          criticalChannels.push({ id: channelId, priority: 'medium', reason: 'adjacent' });
        }
        if (CHANNELS[reverseChannelId] && !criticalChannels.find(c => c.id === reverseChannelId)) {
          criticalChannels.push({ id: reverseChannelId, priority: 'medium', reason: 'adjacent' });
        }
      }
    });
    
    // Create prioritization question
    this.questionSequence.push({
      id: 'p2_prioritization',
      question: 'Based on your node assessment, which areas would you like to focus on?',
      type: 'multiselect',
      maxSelections: 3,
      options: criticalChannels.slice(0, 12).map(ch => {
        const channel = CHANNELS[ch.id];
        const fromNode = NODES[channel.from];
        const toNode = NODES[channel.to];
        return {
          text: `${SecurityUtils.sanitizeHTML(fromNode.name || '')} → ${SecurityUtils.sanitizeHTML(toNode.name || '')}: ${SecurityUtils.sanitizeHTML(channel.description || '')}`,
          mapsTo: { channel: ch.id, priority: ch.priority },
          channel: ch.id
        };
      }),
      phase: 2,
      criticalChannels: criticalChannels
      });
      
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase2Sequence');
      ErrorHandler.showUserError('Failed to load Phase 2. Please refresh the page.');
    }
  }

  /**
   * Process Phase 2 results and proceed to Phase 3
   * @returns {Promise<void>}
   */
  async processPhase2Results() {
    try {
      // Get user's prioritized channels
      const prioritizationAnswer = this.answers['p2_prioritization'];
      if (Array.isArray(prioritizationAnswer)) {
        this.prioritizedChannels = prioritizationAnswer.map(item => item.mapsTo.channel);
        this.analysisData.prioritizedChannels = this.prioritizedChannels;
      }
      
      // Build Phase 3 sequence
      await this.buildPhase3Sequence();
    } catch (error) {
      this.debugReporter.logError(error, 'processPhase2Results');
      ErrorHandler.showUserError('Failed to process Phase 2 results.');
    }
  }

  /**
   * Build Phase 3 question sequence
   * @returns {Promise<void>}
   */
  async buildPhase3Sequence() {
    await this.loadChannelsData();
    
    try {
      // Phase 3: Targeted Channel Deep-Dive
      this.questionSequence = [];
      this.currentPhase = 3;
      this.currentQuestionIndex = 0;
      
      // Generate questions for prioritized channels
    this.prioritizedChannels.forEach(channelId => {
      const channel = CHANNELS[channelId];
      if (channel) {
        const channelQuestions = generatePhase3ChannelQuestions(channelId, channel);
        channelQuestions.forEach(q => {
          this.questionSequence.push({
            ...q,
            phase: 3,
            channel: channelId
          });
        });
      }
    });
    
    this.renderCurrentQuestion();
    } catch (error) {
      this.debugReporter.logError(error, 'buildPhase3Sequence');
      ErrorHandler.showUserError('Failed to build Phase 3 sequence. Please try again.');
    }
  }

  processPhase3Answer(question) {
    // Handle conditional branching for Phase 3 questions
    if (question.type === 'binary_unsure') {
      const answer = this.answers[question.id];
      if (answer && answer.text) {
        const conditionalQuestions = question.conditional && question.conditional[answer.text];
        if (conditionalQuestions) {
          // Insert conditional questions after current question
          const currentIndex = this.questionSequence.findIndex(q => q.id === question.id);
          conditionalQuestions.forEach((condQ, index) => {
            this.questionSequence.splice(currentIndex + 1 + index, 0, {
              ...condQ,
              phase: 3,
              channel: question.channel
            });
          });
        }
      }
    }
  }

  buildPhase4Sequence() {
    // Phase 4: Comprehensive Mapping (Optional)
    // Assess all remaining channels
    this.questionSequence = [];
    this.currentPhase = 4;
    this.currentQuestionIndex = 0;
    
    const allChannelIds = Object.keys(CHANNELS);
    const remainingChannels = allChannelIds.filter(id => 
      !this.prioritizedChannels.includes(id) && !this.assessedChannels.includes(id)
    );
    
    remainingChannels.forEach(channelId => {
      const channel = CHANNELS[channelId];
      if (channel) {
        const channelQuestions = generatePhase3ChannelQuestions(channelId, channel);
        channelQuestions.forEach(q => {
          this.questionSequence.push({
            ...q,
            phase: 4,
            channel: channelId
          });
        });
      }
    });
    
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completePhase();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    if (!container) return;
    
    let html = '';
    
    const renderStart = performance.now();
    
    try {
      // Render based on question type
      if (question.type === 'three_point') {
        html = this.renderThreePointQuestion(question);
      } else if (question.type === 'binary_unsure') {
        html = this.renderBinaryUnsureQuestion(question);
      } else if (question.type === 'scenario') {
        html = this.renderScenarioQuestion(question);
      } else if (question.type === 'frequency') {
        html = this.renderFrequencyQuestion(question);
      } else if (question.type === 'multiselect') {
        html = this.renderMultiselectQuestion(question);
      }
      
      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(container, html);
      
      // Attach event listeners for the specific question type
      this.attachQuestionListeners(question);
      
      this.updateProgress();
      this.updateNavigationButtons();
      
      // Track render performance
      const renderDuration = performance.now() - renderStart;
      this.debugReporter.recordRender('question', renderDuration);

      // Scroll to question after rendering
      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
      // Focus management for accessibility
      const firstInput = container.querySelector('input, button, select, textarea');
      if (firstInput) {
        DOMUtils.focusElement(firstInput);
      }
      
      this.updateStageIndicator();
    } catch (error) {
      this.debugReporter.logError(error, 'renderCurrentQuestion');
      ErrorHandler.showUserError('Failed to render question. Please refresh the page.');
    }
  }

  renderThreePointQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="three-point-options">
          ${question.options.map((option, index) => `
            <label class="three-point-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderBinaryUnsureQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="binary-unsure-options">
          ${question.options.map((option, index) => `
            <label class="binary-unsure-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderScenarioQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="scenario-options">
          ${question.options.map((option, index) => `
            <label class="scenario-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderFrequencyQuestion(question) {
    const currentAnswer = this.answers[question.id];
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <div class="frequency-options">
          ${question.options.map((option, index) => `
            <label class="frequency-option ${currentAnswer && currentAnswer.text === option.text ? 'selected' : ''}">
              <input 
                type="radio" 
                name="question_${question.id}" 
                value="${index}"
                data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                ${currentAnswer && currentAnswer.text === option.text ? 'checked' : ''}
              />
              <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderMultiselectQuestion(question) {
    const currentAnswer = this.answers[question.id] || [];
    const maxSelections = question.maxSelections || 3;
    
    // Special rendering for Phase 2 prioritization with visual feedback
    if (question.id === 'p2_prioritization') {
      return this.renderPhase2Prioritization(question, currentAnswer, maxSelections);
    }
    
    return `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <p class="selection-limit">Select up to ${maxSelections}</p>
        <div class="multiselect-options">
          ${question.options.map((option, index) => {
            const isSelected = currentAnswer.some(ans => ans.text === option.text);
            return `
              <label class="multiselect-option ${isSelected ? 'selected' : ''}">
                <input 
                  type="checkbox" 
                  name="question_${question.id}" 
                  value="${index}"
                  data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
                  ${isSelected ? 'checked' : ''}
                />
                <span class="option-text">${SecurityUtils.sanitizeHTML(option.text || '')}</span>
              </label>
            `;
          }).join('')}
        </div>
        <div class="selection-count" id="selectionCount_${question.id}">Selected: ${currentAnswer.length} / ${maxSelections}</div>
      </div>
    `;
  }

  renderPhase2Prioritization(question, currentAnswer, maxSelections) {
    // Show Phase 1 results summary
    const weakNodes = Object.keys(this.nodeScores).filter(key => 
      this.nodeScores[key].state === 'lacking'
    ).map(key => NODES[key].name);
    const strongNodes = Object.keys(this.nodeScores).filter(key => 
      this.nodeScores[key].state === 'abundant'
    ).map(key => NODES[key].name);
    
    let html = `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Phase ${this.currentPhase} - Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getPhaseLabel(this.currentPhase)}</span>
        </div>
        <div class="info-box info-box-accent panel-brand-left">
          <h4>Your Node Assessment Summary</h4>
          ${weakNodes.length > 0 ? `<p><strong>Areas needing support:</strong> ${weakNodes.join(', ')}</p>` : ''}
          ${strongNodes.length > 0 ? `<p><strong>Areas of strength:</strong> ${strongNodes.join(', ')}</p>` : ''}
          <p>Based on this assessment, we've identified critical channels that may reveal blockages. Select 2-3 areas you'd like to explore in depth.</p>
        </div>
        <h3 class="question-text">${SecurityUtils.sanitizeHTML(question.question || '')}</h3>
        <p class="selection-limit">Select up to ${maxSelections}</p>
        <div class="multiselect-options">
    `;
    
    question.options.forEach((option, index) => {
      const isSelected = currentAnswer.some(ans => ans.text === option.text);
      const channel = CHANNELS[option.mapsTo.channel];
      const fromNode = NODES[channel.from];
      const toNode = NODES[channel.to];
      
      html += `
        <label class="multiselect-option ${isSelected ? 'selected' : ''}">
          <input 
            type="checkbox" 
            name="question_${question.id}" 
            value="${index}"
            data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
            ${isSelected ? 'checked' : ''}
          />
          <div class="multiselect-content">
            <div class="multiselect-title">${SecurityUtils.sanitizeHTML(fromNode.name || '')} → ${SecurityUtils.sanitizeHTML(toNode.name || '')}</div>
            <div class="multiselect-description">${SecurityUtils.sanitizeHTML(channel.description || '')}</div>
          </div>
        </label>
      `;
    });
    
    html += `
        </div>
        <div class="selection-count" id="selectionCount_${question.id}">Selected: ${currentAnswer.length} / ${maxSelections}</div>
      </div>
    `;
    
    return html;
  }

  attachQuestionListeners(question) {
    if (question.type === 'three_point' || question.type === 'binary_unsure' || question.type === 'scenario' || question.type === 'frequency') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const optionData = JSON.parse(e.target.dataset.optionData);
          this.answers[question.id] = optionData;
          
          // Update visual selection
          document.querySelectorAll(`.three-point-option, .binary-unsure-option, .scenario-option, .frequency-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          e.target.closest('label').classList.add('selected');
          
          // Process conditional logic for Phase 3
          if (this.currentPhase === 3) {
            this.processPhase3Answer(question);
          }
          
          this.saveProgress();
        });
      });
    } else if (question.type === 'multiselect') {
      const inputs = document.querySelectorAll(`input[name="question_${question.id}"]`);
      const maxSelections = question.maxSelections || 3;
      const selectionCount = document.getElementById(`selectionCount_${question.id}`);
      
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const selected = Array.from(inputs)
            .filter(inp => inp.checked)
            .map(inp => JSON.parse(inp.dataset.optionData));
          
          if (selected.length > maxSelections) {
            e.target.checked = false;
            return;
          }
          
          this.answers[question.id] = selected;
          
          // Update visual selection
          document.querySelectorAll(`.multiselect-option`).forEach(opt => {
            opt.classList.remove('selected');
          });
          selected.forEach(sel => {
            const matchingInput = Array.from(inputs).find(inp => {
              const data = JSON.parse(inp.dataset.optionData);
              return data.text === sel.text;
            });
            if (matchingInput) {
              matchingInput.closest('label').classList.add('selected');
            }
          });
          
          if (selectionCount) {
            selectionCount.textContent = `Selected: ${selected.length} / ${maxSelections}`;
          }
          
          this.saveProgress();
        });
      });
    }
  }

  getPhaseLabel(phase) {
    const labels = {
      1: 'Node Assessment',
      2: 'Channel Prioritization',
      3: 'Channel Deep-Dive',
      4: 'Comprehensive Mapping'
    };
    return labels[phase] || `Phase ${phase}`;
  }

  updateProgress() {
    const totalQuestions = this.getTotalQuestions();
    const currentQuestion = this.getCurrentQuestionNumber();
    const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  getTotalQuestions() {
    // Estimate total questions
    let total = 0;
    if (this.currentPhase >= 1) {
      total += 14; // Phase 1: 7 nodes × 2 questions
    }
    if (this.currentPhase >= 2) {
      total += 1; // Phase 2: 1 prioritization question
    }
    if (this.currentPhase >= 3) {
      total += this.prioritizedChannels.length * 3; // Estimate 3 questions per channel
    }
    if (this.currentPhase >= 4) {
      total += (42 - this.prioritizedChannels.length) * 2; // Estimate for remaining channels
    }
    return total;
  }

  getCurrentQuestionNumber() {
    let current = 0;
    if (this.currentPhase > 1) {
      current += 14; // Phase 1
    }
    if (this.currentPhase > 2) {
      current += 1; // Phase 2
    }
    if (this.currentPhase > 3) {
      current += this.prioritizedChannels.length * 3; // Estimate Phase 3
    }
    current += this.currentQuestionIndex;
    return current;
  }

  updateStageIndicator() {
    const indicator = document.getElementById('stageIndicator');
    if (indicator) {
      indicator.textContent = `${this.getPhaseLabel(this.currentPhase)}`;
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentQuestionIndex === 0 && this.currentPhase === 1;
    }
    
    if (nextBtn) {
      const isLastQuestion = this.currentQuestionIndex === this.questionSequence.length - 1;
      nextBtn.textContent = isLastQuestion ? 'Complete Phase' : 'Next';
    }
  }

  /**
   * Move to next question
   * @returns {Promise<void>}
   */
  async nextQuestion() {
    // Check if current question has been answered
    const currentQuestion = this.questionSequence[this.currentQuestionIndex];
    if (currentQuestion && !this.answers[currentQuestion.id]) {
      ErrorHandler.showUserError('Please select an answer before proceeding.');
      return;
    }
    
    this.saveCurrentAnswer();
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      await this.completePhase();
    }
  }

  /**
   * Move to previous question
   * @returns {Promise<void>}
   */
  async prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    } else if (this.currentPhase > 1) {
      // Go back to previous phase
      this.currentPhase--;
      if (this.currentPhase === 1) {
        await this.buildPhase1Sequence();
      } else if (this.currentPhase === 2) {
        await this.analyzePhase1Results();
        await this.buildPhase2Sequence();
      } else if (this.currentPhase === 3) {
        await this.processPhase2Results();
        await this.buildPhase3Sequence();
      }
      this.currentQuestionIndex = this.questionSequence.length - 1;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  saveCurrentAnswer() {
    // Answer is already saved in attachQuestionListeners via saveProgress()
  }

  completePhase() {
    if (this.currentPhase === 1) {
      this.analyzePhase1Results();
      if (this.questionSequence.length > 0) {
        this.renderCurrentQuestion(); // Start Phase 2
      } else {
        this.completeAssessment();
      }
    } else if (this.currentPhase === 2) {
      this.processPhase2Results();
      if (this.questionSequence.length > 0) {
        this.renderCurrentQuestion(); // Start Phase 3
      } else {
        this.completeAssessment();
      }
    } else if (this.currentPhase === 3) {
      this.processPhase3Results();
      // Offer Phase 4 (optional comprehensive mapping)
      if (confirm('Would you like to complete a comprehensive assessment of all remaining channels? This is optional and will take additional time.')) {
        this.buildPhase4Sequence();
        if (this.questionSequence.length > 0) {
          this.renderCurrentQuestion();
        } else {
          this.completeAssessment();
        }
      } else {
        this.completeAssessment();
      }
    } else if (this.currentPhase === 4) {
      this.processPhase4Results();
      this.completeAssessment();
    }
  }

  processPhase3Results() {
    // Calculate channel scores from Phase 3 answers
    this.analysisData.phase3Results = {};
    this.assessedChannels = [...this.prioritizedChannels];
    
    this.prioritizedChannels.forEach(channelId => {
      const channelAnswers = Object.keys(this.answers)
        .filter(key => key.startsWith(`p3_${channelId}`))
        .map(key => this.answers[key]);
      
      // Calculate flow state
      const binaryAnswer = channelAnswers.find(a => a && a.mapsTo && a.mapsTo.flow);
      const flowState = binaryAnswer ? binaryAnswer.mapsTo.flow : 'unknown';
      
      this.analysisData.phase3Results[channelId] = {
        channel: CHANNELS[channelId],
        flowState: flowState,
        answers: channelAnswers
      };
    });
  }

  processPhase4Results() {
    // Similar to Phase 3 but for all remaining channels
    this.analysisData.phase4Results = {};
    // Process all channels assessed in Phase 4
  }

  completeAssessment() {
    // Calculate final results
    this.calculateResults();
    
    // Include all raw answers and question sequence
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.getAllQuestionsAnswered();
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  getAllQuestionsAnswered() {
    const allQuestions = [];
    // Track all questions that were asked
    this.questionSequence.forEach(q => {
      allQuestions.push({
        id: q.id,
        question: q.question,
        phase: q.phase || this.currentPhase,
        answer: this.answers[q.id]
      });
    });
    return allQuestions;
  }

  calculateResults() {
    // Calculate channel scores
    this.analysisData.channelScores = {};
    
    // Process Phase 3 results
    Object.keys(this.analysisData.phase3Results || {}).forEach(channelId => {
      const result = this.analysisData.phase3Results[channelId];
      this.analysisData.channelScores[channelId] = {
        flowState: result.flowState,
        channel: result.channel,
        score: result.flowState === 'open' ? 3 : result.flowState === 'blocked' ? 1 : 2
      };
    });
    
    // Identify blocked channels
    this.analysisData.finalChannels = Object.keys(this.analysisData.channelScores)
      .filter(id => this.analysisData.channelScores[id].flowState === 'blocked')
      .map(id => ({
        id: id,
        channel: this.analysisData.channelScores[id].channel,
        score: this.analysisData.channelScores[id].score
      }));
    
    // Generate remediation strategies
    this.generateRemediationStrategies();
  }

  generateRemediationStrategies() {
    this.analysisData.remediationStrategies = [];
    
    this.analysisData.finalChannels.forEach(channelData => {
      const channelId = channelData.id;
      const remediation = REMEDIATION_STRATEGIES[channelId];
      if (remediation) {
        this.analysisData.remediationStrategies.push({
          channel: channelData.channel,
          strategies: remediation
        });
      }
    });
  }

  /**
   * Render assessment results
   * @returns {Promise<void>}
   */
  async renderResults() {
    this.ui.transition('results');
    try {
      await this.loadChannelsData(); // Ensure data is loaded
      
      const questionnaireSection = document.getElementById('questionnaireSection');
      const resultsSection = document.getElementById('resultsSection');
      if (questionnaireSection) questionnaireSection.classList.remove('active');
      if (resultsSection) resultsSection.classList.add('active');
      
      const container = document.getElementById('channelResults');
      if (!container) {
        ErrorHandler.showUserError('Results container not found.');
        return;
      }
      
      let html = '<div class="channel-summary">';
      html += '<h3>Your Channel Analysis Results</h3>';
      html += '<p>Based on your responses, here are the channel blockages identified and recommended remediation strategies.</p>';
      html += '</div>';
    
    // Node summary (collapsible)
    html += '<details class="node-summary">';
    html += '<summary><strong>Node Health Summary</strong></summary>';
    html += '<div style="margin-top: 1rem;">';
    Object.keys(this.nodeScores).forEach(nodeKey => {
      const nodeScore = this.nodeScores[nodeKey];
      const stateColor = nodeScore.state === 'abundant'
        ? 'var(--brand)'
        : nodeScore.state === 'balanced'
          ? 'var(--accent)'
          : 'var(--muted)';
      html += `<p><strong>${SecurityUtils.sanitizeHTML(nodeScore.node.name || '')}:</strong> <span style="color: ${stateColor};">${SecurityUtils.sanitizeHTML(nodeScore.state || '')}</span></p>`;
    });
    html += '</div></details>';
    
    // Channel results
    if (this.analysisData.finalChannels.length > 0) {
      html += '<div class="channel-results">';
      html += '<h4>Identified Channel Blockages</h4>';
      
      this.analysisData.finalChannels.forEach(channelData => {
        const channel = channelData.channel;
        const fromNode = NODES[channel.from];
        const toNode = NODES[channel.to];
        const remediation = REMEDIATION_STRATEGIES[channelData.id];
        const remediationHighlights = this.getRemediationHighlights(remediation);
        
        html += `
          <div class="channel-result">
            <h3>Channel Issue: ${SecurityUtils.sanitizeHTML(channel.name || '')}</h3>
            <p><strong>Flow direction:</strong> ${SecurityUtils.sanitizeHTML(fromNode.name || '')} → ${SecurityUtils.sanitizeHTML(toNode.name || '')}</p>
            <p><strong>Relationship focus:</strong> ${SecurityUtils.sanitizeHTML(channel.description || '')}</p>
            <p><strong>Blockage symptoms:</strong> ${SecurityUtils.sanitizeHTML(channel.blocked || 'Disconnect between these nodes')}</p>
            ${remediationHighlights.length > 0 ? `
              <div style="margin-top: 1rem;">
                <strong>Channel-Informed Actions for Greater Flow:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                  ${remediationHighlights.map(item => `<li>${SecurityUtils.sanitizeHTML(item)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `;
      });
      
      html += '</div>';
    }

    // Recommended Course of Action
    const actions = this.getRecommendedCourseOfAction();
    html += '<div class="panel panel-outline-accent channel-course-of-action">';
    html += '<h4>Recommended Course of Action</h4>';
    html += '<ul class="feature-list action-list">';
    html += `<li><strong>Immediate (1–2 weeks):</strong> ${SecurityUtils.sanitizeHTML(actions.immediate)}</li>`;
    html += `<li><strong>Short-term (1–3 months):</strong> ${SecurityUtils.sanitizeHTML(actions.shortTerm)}</li>`;
    html += `<li><strong>Medium-term (3–6 months):</strong> ${SecurityUtils.sanitizeHTML(actions.mediumTerm)}</li>`;
    html += `<li><strong>Ongoing:</strong> ${SecurityUtils.sanitizeHTML(actions.ongoing)}</li>`;
    html += '</ul></div>';

    // Remediative Gestalt — Multi-tier (light, medium, heavy)
    const tiers = this.getRemediativeGestaltTiers();
    if (tiers.light.length || tiers.medium.length || tiers.heavy.length) {
      html += '<div class="panel panel-outline channel-remediative-gestalt">';
      html += '<h4>Remediative Gestalt — Actions by Difficulty</h4>';
      html += '<p class="form-help">Restore flow with actions matched to your capacity. Start with light, build toward medium and heavy as readiness allows.</p>';
      if (tiers.light.length) {
        html += '<div class="remediation-tier remediation-tier-light">';
        html += '<h5>Light difficulty</h5>';
        html += '<p class="tier-desc">Low-commitment, daily micro-practices you can start immediately.</p>';
        html += '<ul class="feature-list">';
        tiers.light.forEach(item => { html += `<li>${SecurityUtils.sanitizeHTML(item)}</li>`; });
        html += '</ul></div>';
      }
      if (tiers.medium.length) {
        html += '<div class="remediation-tier remediation-tier-medium">';
        html += '<h5>Medium difficulty</h5>';
        html += '<p class="tier-desc">Structured practice requiring regular commitment and integration.</p>';
        html += '<ul class="feature-list">';
        tiers.medium.forEach(item => { html += `<li>${SecurityUtils.sanitizeHTML(item)}</li>`; });
        html += '</ul></div>';
      }
      if (tiers.heavy.length) {
        html += '<div class="remediation-tier remediation-tier-heavy">';
        html += '<h5>Heavy difficulty</h5>';
        html += '<p class="tier-desc">Deep, intensive work; consider support (therapy, guide, retreat) when ready.</p>';
        html += '<ul class="feature-list">';
        tiers.heavy.forEach(item => { html += `<li>${SecurityUtils.sanitizeHTML(item)}</li>`; });
        html += '</ul></div>';
      }
      html += '</div>';
    }
    
      // Sanitize HTML before rendering - all dynamic content is already sanitized above
      SecurityUtils.safeInnerHTML(container, html);
      
      // Display debug report if in development mode
      if (window.location.search.includes('debug=true')) {
        this.debugReporter.displayReport('debug-report');
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderResults');
      ErrorHandler.showUserError('Failed to render results. Please refresh the page.');
    }
  }

  getRemediationHighlights(remediation) {
    if (!remediation) return [];
    if (typeof remediation === 'string') return [remediation];
    if (Array.isArray(remediation)) return remediation.filter(Boolean);
    if (typeof remediation !== 'object') return [];

    const primaryList = Array.isArray(remediation.strategies) && remediation.strategies.length > 0
      ? remediation.strategies
      : Array.isArray(remediation.practices) && remediation.practices.length > 0
        ? remediation.practices
        : [];

    return primaryList.filter(Boolean).slice(0, 5);
  }

  getRemediationForChannel(channelId) {
    let remediation = REMEDIATION_STRATEGIES[channelId];
    if (!remediation && channelId) {
      const [from, to] = channelId.split('_');
      if (from && to) remediation = REMEDIATION_STRATEGIES[`${to}_${from}`];
    }
    return remediation;
  }

  getRecommendedCourseOfAction() {
    const channels = this.analysisData.finalChannels || [];
    const channelNames = channels.slice(0, 2).map(c => c.channel?.name || '').filter(Boolean);
    const primary = channelNames[0] || 'your priority channel';
    const secondary = channelNames[1] || 'other identified channels';

    return {
      immediate: channels.length ? `Start with light-difficulty actions for ${primary}: integrate one small practice into your daily routine within the next 1–2 weeks.` : 'Once you complete a full assessment and identify channel blockages, start with light-difficulty actions: integrate one small practice into your daily routine within 1–2 weeks.',
      shortTerm: channels.length ? `Build consistency with light practices, then introduce medium-difficulty remediative actions for ${primary} over the next 1–3 months.` : 'Build consistency with light practices, then introduce medium-difficulty remediative actions over 1–3 months.',
      mediumTerm: channels.length ? `Expand remediation to ${secondary}. Consider structured support (e.g. breathwork, somatic work, or creative practice) for deeper integration.` : 'Consider structured support (breathwork, somatic work, creative practice) for deeper integration.',
      ongoing: `Maintain flow restoration as an ongoing practice. Reassess channel blockages periodically; adjust remediation tier (light/medium/heavy) based on progress and capacity.`
    };
  }

  getRemediativeGestaltTiers() {
    const channels = this.analysisData.finalChannels || [];
    const light = new Set();
    const medium = new Set();
    const heavy = new Set();

    channels.forEach(channelData => {
      const remediation = this.getRemediationForChannel(channelData.id);
      if (!remediation) return;
      const tiers = remediation.difficultyTiers;
      if (tiers) {
        (tiers.light || []).forEach(item => light.add(item));
        (tiers.medium || []).forEach(item => medium.add(item));
        (tiers.heavy || []).forEach(item => heavy.add(item));
      } else {
        const fallback = remediation.strategies || remediation.practices || [];
        const arr = Array.isArray(fallback) ? fallback : [];
        arr.slice(0, 2).forEach(item => light.add(item));
        arr.slice(2, 4).forEach(item => medium.add(item));
        arr.slice(4).forEach(item => heavy.add(item));
      }
    });

    return {
      light: Array.from(light).filter(Boolean),
      medium: Array.from(medium).filter(Boolean),
      heavy: Array.from(heavy).filter(Boolean)
    };
  }

  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'channels', 'Channel Taxonomy Analysis');
      downloadFile(csv, `channel-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'channels', 'Channel Taxonomy Analysis');
      downloadFile(json, `channel-analysis-${Date.now()}.json`, 'application/json');
    }
  }

  exportExecutiveBrief() {
    const brief = exportExecutiveBrief(this.analysisData, 'channels', 'Channel Taxonomy Analysis');
    downloadFile(brief, `channel-executive-brief-${Date.now()}.txt`, 'text/plain');
  }

  /**
   * Save assessment progress to storage
   */
  saveProgress() {
    try {
      const progressData = {
        currentPhase: this.currentPhase,
        currentQuestionIndex: this.currentQuestionIndex,
        answers: this.answers,
        nodeScores: this.nodeScores,
        prioritizedChannels: this.prioritizedChannels,
        assessedChannels: this.assessedChannels,
        analysisData: this.analysisData,
        timestamp: new Date().toISOString()
      };
      this.dataStore.save('progress', progressData);
    } catch (error) {
      this.debugReporter.logError(error, 'saveProgress');
    }
  }

  /**
   * Load stored assessment progress
   * @returns {Promise<void>}
   */
  async loadStoredData() {
    try {
      const data = this.dataStore.load('progress');
      if (!data) return;

      this.currentPhase = data.currentPhase || 1;
      this.currentQuestionIndex = data.currentQuestionIndex || 0;
      this.answers = data.answers || {};
      this.nodeScores = data.nodeScores || {};
      this.prioritizedChannels = data.prioritizedChannels || [];
      this.assessedChannels = data.assessedChannels || [];
      this.analysisData = data.analysisData || this.analysisData;
      
      // Restore questionnaire state
      if (this.currentQuestionIndex > 0 || this.currentPhase > 1) {
        if (this.currentPhase === 1) {
          await this.buildPhase1Sequence();
        } else if (this.currentPhase === 2) {
          await this.analyzePhase1Results();
          await this.buildPhase2Sequence();
        } else if (this.currentPhase === 3) {
          await this.processPhase2Results();
          await this.buildPhase3Sequence();
        } else if (this.currentPhase === 4) {
          await this.buildPhase4Sequence();
        }
        
        const questionnaireSection = document.getElementById('questionnaireSection');
        if (questionnaireSection) questionnaireSection.classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
    }
  }

  resetAssessment() {
    this.currentPhase = 1;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.nodeScores = {};
    this.prioritizedChannels = [];
    this.assessedChannels = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      phase1Results: {},
      phase2Results: {},
      phase3Results: {},
      phase4Results: {},
      nodeScores: {},
      channelScores: {},
      prioritizedChannels: [],
      finalChannels: [],
      remediationStrategies: [],
      allAnswers: {},
      questionSequence: []
    };
    
    sessionStorage.removeItem('channelProgress');
    
    // Reset UI
    this.ui.transition('idle');
    
    this.buildPhase1Sequence();
  }
}

