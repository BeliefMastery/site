// Channels Engine - Version 2.1
// Multi-Phase Questionnaire Architecture
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

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
    
    this.init();
  }

  /**
   * Initialize the engine
   */
  init() {
    this.attachEventListeners();
    this.loadStoredData().catch(error => {
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
    
    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to abandon this assessment? All progress will be lost.')) {
          this.resetAssessment();
        }
      });
    }
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
      
      // Focus management for accessibility
      const firstInput = container.querySelector('input, button, select, textarea');
      if (firstInput) {
        DOMUtils.focusElement(firstInput);
      }
    } catch (error) {
      this.debugReporter.logError(error, 'renderCurrentQuestion');
      ErrorHandler.showUserError('Failed to render question. Please refresh the page.');
    }
  }
    this.updateStageIndicator();
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
        <div style="background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--accent); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem;">
          <h4 style="color: var(--brand); margin-bottom: 1rem;">Your Node Assessment Summary</h4>
          ${weakNodes.length > 0 ? `<p style="margin-bottom: 0.5rem;"><strong>Areas needing support:</strong> ${weakNodes.join(', ')}</p>` : ''}
          ${strongNodes.length > 0 ? `<p style="margin-bottom: 0.5rem;"><strong>Areas of strength:</strong> ${strongNodes.join(', ')}</p>` : ''}
          <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--muted);">Based on this assessment, we've identified critical channels that may reveal blockages. Select 2-3 areas you'd like to explore in depth.</p>
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
        <label class="multiselect-option ${isSelected ? 'selected' : ''}" style="padding: 1.25rem; border-left: 3px solid ${isSelected ? 'var(--brand)' : 'rgba(0,0,0,0.1)'};">
          <input 
            type="checkbox" 
            name="question_${question.id}" 
            value="${index}"
            data-option-data='${JSON.stringify(option).replace(/'/g, "&apos;")}'
            ${isSelected ? 'checked' : ''}
          />
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--brand);">${SecurityUtils.sanitizeHTML(fromNode.name || '')} → ${SecurityUtils.sanitizeHTML(toNode.name || '')}</div>
            <div style="font-size: 0.9rem; color: var(--muted); line-height: 1.5;">${SecurityUtils.sanitizeHTML(channel.description || '')}</div>
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
    
    // Node summary
    html += '<div class="node-summary" style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; border-left: 4px solid var(--brand);">';
    html += '<h4 style="color: var(--brand); margin-bottom: 1rem;">Node Health Summary</h4>';
    Object.keys(this.nodeScores).forEach(nodeKey => {
      const nodeScore = this.nodeScores[nodeKey];
      const stateColor = nodeScore.state === 'abundant' ? '#28a745' : nodeScore.state === 'balanced' ? '#ffc107' : '#d32f2f';
      html += `<p style="margin-bottom: 0.5rem;"><strong>${SecurityUtils.sanitizeHTML(nodeScore.node.name || '')}:</strong> <span style="color: ${stateColor};">${SecurityUtils.sanitizeHTML(nodeScore.state || '')}</span></p>`;
    });
    html += '</div>';
    
    // Channel results
    if (this.analysisData.finalChannels.length > 0) {
      html += '<div class="channel-results">';
      html += '<h4 style="color: var(--brand); margin-bottom: 1rem;">Identified Channel Blockages</h4>';
      
      this.analysisData.finalChannels.forEach(channelData => {
        const channel = channelData.channel;
        const fromNode = NODES[channel.from];
        const toNode = NODES[channel.to];
        
        html += `
          <div class="channel-result">
            <h3>${SecurityUtils.sanitizeHTML(fromNode.name || '')} → ${SecurityUtils.sanitizeHTML(toNode.name || '')}</h3>
            <p style="color: var(--muted); margin-bottom: 1rem;">${SecurityUtils.sanitizeHTML(channel.description || '')}</p>
            <p style="margin-bottom: 1rem;"><strong>Blockage symptoms:</strong> ${SecurityUtils.sanitizeHTML(channel.blocked || 'Disconnect between these nodes')}</p>
          </div>
        `;
      });
      
      html += '</div>';
    }
    
    // Remediation strategies
    if (this.analysisData.remediationStrategies.length > 0) {
      html += '<div class="remediation-section" style="margin-top: 2rem;">';
      html += '<h4 style="color: var(--brand); margin-bottom: 1rem;">Remediation Strategies</h4>';
      
      this.analysisData.remediationStrategies.forEach(strategy => {
        const channel = strategy.channel;
        const fromNode = NODES[channel.from];
        const toNode = NODES[channel.to];
        
        html += `
          <div class="remediation-item">
            <strong>${SecurityUtils.sanitizeHTML(fromNode.name || '')} → ${SecurityUtils.sanitizeHTML(toNode.name || '')}</strong>
            <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
              ${Array.isArray(strategy.strategies) ? strategy.strategies.map(s => `<li>${SecurityUtils.sanitizeHTML(s || '')}</li>`).join('') : `<li>${SecurityUtils.sanitizeHTML(strategy.strategies || '')}</li>`}
            </ul>
          </div>
        `;
      });
      
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

  exportAnalysis(format = 'json') {
    if (format === 'csv') {
      const csv = exportForAIAgent(this.analysisData, 'channels', 'Channel Taxonomy Analysis');
      downloadFile(csv, `channel-analysis-${Date.now()}.csv`, 'text/csv');
    } else {
      const json = exportJSON(this.analysisData, 'channels', 'Channel Taxonomy Analysis');
      downloadFile(json, `channel-analysis-${Date.now()}.json`, 'application/json');
    }
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
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.buildPhase1Sequence();
  }
}

