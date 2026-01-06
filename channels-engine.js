// Channels Engine - Multi-Stage Progressive Analysis
// Stage 1: Node Identification
// Stage 2: Channel-Specific Analysis
// Stage 3: Deep Channel Management

import { NODES } from './channel-data/nodes.js';
import { CHANNELS } from './channel-data/channels.js';
import { CHANNEL_SYMPTOMS } from './channel-data/channel-symptoms.js';
import { REMEDIATION_STRATEGIES } from './channel-data/remediation-strategies.js';
import { CHANNEL_MAPPING } from './channel-data/channel-mapping.js';
import { STAGE_1_NODE_QUESTIONS, STAGE_2_CHANNEL_QUESTIONS, STAGE_3_MANAGEMENT_QUESTIONS } from './channel-data/stage-questions.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class ChannelsEngine {
  constructor() {
    this.currentStage = 1; // 1: Node ID, 2: Channel Analysis, 3: Management
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.identifiedNodes = []; // Nodes with issues from Stage 1
    this.identifiedChannels = []; // Channels with blockages from Stage 2
    this.compensatoryReroutes = {}; // Track compensatory channel patterns
    this.analysisData = {
      timestamp: new Date().toISOString(),
      stage1Results: {},
      stage2Results: {},
      stage3Results: {},
      nodeScores: {},
      channelScores: {},
      finalChannels: [],
      remediationStrategies: [],
      compensatoryReroutes: {},
      crossEngineHandoffs: []
    };
    
    this.init();
  }

  init() {
    this.buildStage1Sequence();
    this.attachEventListeners();
    this.loadStoredData();
    this.startAssessment();
  }

  buildStage1Sequence() {
    // Stage 1: Node identification questions (combine multiple distinction qualities)
    this.questionSequence = [];
    this.currentStage = 1;
    
    Object.keys(STAGE_1_NODE_QUESTIONS).forEach(nodeKey => {
      STAGE_1_NODE_QUESTIONS[nodeKey].forEach(question => {
        this.questionSequence.push({
          ...question,
          stage: 1,
          node: nodeKey
        });
      });
    });
  }

  buildStage2Sequence() {
    // Stage 2: Channel-specific questions for identified nodes
    this.questionSequence = [];
    this.currentStage = 2;
    
    // Get channels connected to identified nodes
    const relevantChannels = [];
    
    this.identifiedNodes.forEach(node => {
      const nodeKey = typeof node === 'string' ? node : node.key;
      // Find all channels connected to this node (both directions)
      Object.keys(CHANNELS).forEach(channelId => {
        const channel = CHANNELS[channelId];
        if (channel && (channel.from === nodeKey || channel.to === nodeKey)) {
          if (!relevantChannels.includes(channelId)) {
            relevantChannels.push(channelId);
          }
        }
      });
    });
    
    // Add channel questions for relevant channels
    relevantChannels.forEach(channelId => {
      const channelQuestions = STAGE_2_CHANNEL_QUESTIONS[channelId];
      if (channelQuestions) {
        channelQuestions.forEach(question => {
          this.questionSequence.push({
            ...question,
            stage: 2,
            channel: channelId
          });
        });
      } else {
        // Generate generic questions from channel descriptions if not explicitly defined
        const channel = CHANNELS[channelId];
        if (channel) {
          const fromNode = NODES[channel.from]?.name || channel.from;
          const toNode = NODES[channel.to]?.name || channel.to;
          
          // Abundance question
          this.questionSequence.push({
            id: `channel_${channelId}_abundance`,
            question: `When ${fromNode} is abundant and flowing well, how does that affect ${toNode}? ${channel.healthy_abundance || 'Consider how the flow between these nodes feels when it\'s working well.'}`,
            weight: 1.0,
            channel: channelId,
            stage: 2,
            type: 'abundance'
          });
          
          // Lack question (insufficient input)
          this.questionSequence.push({
            id: `channel_${channelId}_lack`,
            question: `When ${fromNode} lacks resources or is depleted, how does that impact ${toNode}? ${channel.healthy_lack || 'Consider how the flow responds when the source node is low.'} <strong>Note: Lack = insufficient input from the source node.</strong>`,
            weight: 1.0,
            channel: channelId,
            stage: 2,
            type: 'lack',
            direction: `${fromNode} → ${toNode}`
          });
          
          // Blocked question (impaired transmission)
          this.questionSequence.push({
            id: `channel_${channelId}_blocked`,
            question: `Do you experience symptoms of blocked flow between ${fromNode} and ${toNode}? ${channel.blocked || 'Consider any disconnect, inappropriate responses, or inability for one node to inform the other.'} <strong>Note: Blockage = impaired transmission between nodes, even when source has resources.</strong>`,
            weight: 1.3,
            channel: channelId,
            stage: 2,
            type: 'blocked',
            direction: `${fromNode} → ${toNode}`
          });
        }
      }
    });
  }

  buildStage3Sequence() {
    // Stage 3: Deep management questions for blocked channels
    this.questionSequence = [];
    this.currentStage = 3;
    
    this.identifiedChannels.forEach(channel => {
      const managementQuestions = STAGE_3_MANAGEMENT_QUESTIONS[channel.key];
      if (managementQuestions) {
        managementQuestions.forEach(question => {
          this.questionSequence.push({
            ...question,
            stage: 3,
            channel: channel.key
          });
        });
      } else {
        // Generate generic management questions if not explicitly defined
        const channelData = CHANNELS[channel.key];
        if (channelData) {
          const fromNode = NODES[channelData.from]?.name || channelData.from;
          const toNode = NODES[channelData.to]?.name || channelData.to;
          
          this.questionSequence.push({
            id: `manage_${channel.key}_1`,
            question: `What specific practices or activities help restore flow between ${fromNode} and ${toNode}? Consider both physical and energetic approaches.`,
            weight: 1.0,
            channel: channel.key,
            stage: 3,
            type: 'management'
          });
          
          this.questionSequence.push({
            id: `manage_${channel.key}_2`,
            question: `When you notice a blockage between ${fromNode} and ${toNode}, what patterns or triggers do you observe? What circumstances seem to worsen or improve the flow?`,
            weight: 1.0,
            channel: channel.key,
            stage: 3,
            type: 'management'
          });
          
          this.questionSequence.push({
            id: `manage_${channel.key}_3`,
            question: `What would help restore healthy flow between ${fromNode} and ${toNode}? Consider both immediate interventions and longer-term practices for maintaining this channel.`,
            weight: 1.0,
            channel: channel.key,
            stage: 3,
            type: 'management'
          });
        }
      }
    });
  }

  attachEventListeners() {
    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }
    
    const exportBtnJson = document.getElementById('exportAnalysisJson');
    if (exportBtnJson) {
      exportBtnJson.addEventListener('click', () => this.exportAnalysis('json'));
    }
    
    const exportBtnCsv = document.getElementById('exportAnalysisCsv');
    if (exportBtnCsv) {
      exportBtnCsv.addEventListener('click', () => this.exportAnalysis('csv'));
    }
    
    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }
    
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
    }

    const abandonBtn = document.getElementById('abandonAssessment');
    if (abandonBtn) {
      abandonBtn.addEventListener('click', () => this.abandonAssessment());
    }
  }

  abandonAssessment() {
    if (confirm('Are you sure you want to abandon this assessment? All progress will be lost and you will need to start from the beginning.')) {
      this.resetAssessment();
    }
  }

  startAssessment() {
    document.getElementById('questionnaireSection').classList.add('active');
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completeStage();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    if (!container) return;
    
    let categoryLabel = '';
    if (question.stage === 1) {
      categoryLabel = `${NODES[question.node]?.name || question.node} Node`;
    } else if (question.stage === 2) {
      const channel = CHANNELS[question.channel];
      categoryLabel = channel ? channel.name : 'Channel Analysis';
    } else if (question.stage === 3) {
      const channel = CHANNELS[question.channel];
      categoryLabel = channel ? `Managing ${channel.name}` : 'Management';
    }
    
    container.innerHTML = `
      <div class="question-block">
        <p style="color: var(--muted); margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">${categoryLabel}</p>
        <h3>${question.question}</h3>
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
          <span>Very Low / Minimal / Weak / Rare / Never (0-2)</span>
          <span>Moderate / Somewhat / Average / Sometimes (5-6)</span>
          <span>Very High / Strong / Potent / Frequent / Always (9-10)</span>
        </div>
        <div style="margin-top: 0.5rem; padding: 0.75rem; background: rgba(255, 184, 0, 0.1); border-radius: var(--radius); font-size: 0.9rem; color: var(--muted); line-height: 1.5;">
          <strong>Tip:</strong> Higher scores indicate stronger presence of this symptom, which may indicate channel blockages.
        </div>
      </div>
    `;
    
    // Attach slider event listener
    const slider = document.getElementById('questionInput');
    const valueDisplay = document.getElementById('scaleValue');
    
    if (slider && valueDisplay) {
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
    }
    
    this.updateProgress();
    this.updateNavigationButtons();
  }

  updateProgress() {
    const progress = this.questionSequence.length > 0 
      ? ((this.currentQuestionIndex + 1) / this.questionSequence.length) * 100 
      : 0;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
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
        ? 'Complete' 
        : 'Next';
    }
  }

  nextQuestion() {
    // Save current answer
    const slider = document.getElementById('questionInput');
    if (slider) {
      const questionId = slider.dataset.questionId;
      this.answers[questionId] = parseInt(slider.value);
    }
    
    this.currentQuestionIndex++;
    this.saveProgress();
    
    if (this.currentQuestionIndex < this.questionSequence.length) {
      this.renderCurrentQuestion();
    } else {
      this.completeStage();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      // Save current answer before going back
      const slider = document.getElementById('questionInput');
      if (slider) {
        const questionId = slider.dataset.questionId;
        this.answers[questionId] = parseInt(slider.value);
      }
      
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
      this.saveProgress();
    }
  }

  completeStage() {
    if (this.currentStage === 1) {
      // Analyze Stage 1 results and identify nodes with issues
      this.analyzeStage1Results();
      
      if (this.identifiedNodes.length > 0) {
        // Move to Stage 2
        this.buildStage2Sequence();
        this.currentQuestionIndex = 0;
        this.renderCurrentQuestion();
        this.updateProgressBar();
        this.updateStageIndicator();
        return;
      } else {
        // No nodes with strain, show results
        this.finalizeResults();
        return;
      }
    } else if (this.currentStage === 2) {
      // Analyze Stage 2 results and identify blocked channels
      this.analyzeStage2Results();
      
      if (this.identifiedChannels.length > 0) {
        // Move to Stage 3
        this.buildStage3Sequence();
        this.currentQuestionIndex = 0;
        this.renderCurrentQuestion();
        this.updateStageIndicator();
        return;
      } else {
        // No blocked channels, show results
        this.finalizeResults();
        return;
      }
    } else if (this.currentStage === 3) {
      // Stage 3 complete, finalize results
      this.analyzeStage3Results();
      this.finalizeResults();
      return;
    }
  }

  analyzeStage1Results() {
    // Calculate node scores from Stage 1 answers
    this.analysisData.stage1Results = {};
    this.identifiedNodes = [];
    
    Object.keys(STAGE_1_NODE_QUESTIONS).forEach(nodeKey => {
      const nodeQuestions = STAGE_1_NODE_QUESTIONS[nodeKey];
      let totalScore = 0;
      let questionCount = 0;
      
      nodeQuestions.forEach(q => {
        if (this.answers[q.id] !== undefined) {
          totalScore += this.answers[q.id] * q.weight;
          questionCount++;
        }
      });
      
      const averageScore = questionCount > 0 ? totalScore / questionCount : 0;
      
      // Determine node band: Stable (< 5.0), Strained (5.0-7.0), Constricted (> 7.0)
      let nodeBand = 'Stable';
      if (averageScore >= 7.0) {
        nodeBand = 'Constricted';
      } else if (averageScore >= 5.0) {
        nodeBand = 'Strained';
      }
      
      this.analysisData.stage1Results[nodeKey] = {
        node: nodeKey,
        name: NODES[nodeKey]?.name || nodeKey,
        score: averageScore,
        band: nodeBand,
        threshold: 5.0
      };
      
      // Identify nodes with strain or constriction (score >= 5.0)
      if (averageScore >= 5.0) {
        this.identifiedNodes.push({
          key: nodeKey,
          name: NODES[nodeKey]?.name || nodeKey,
          score: averageScore,
          band: nodeBand
        });
      }
    });
    
    this.analysisData.nodeScores = this.analysisData.stage1Results;
    
    // Identify dominant strain node (highest score)
    if (this.identifiedNodes.length > 0) {
      this.identifiedNodes.sort((a, b) => b.score - a.score);
      // Normalize transient node fluctuation
      this.analysisData.dominantStrainNode = {
        ...this.identifiedNodes[0],
        note: "Node strain often reflects current life demand rather than chronic imbalance."
      };
    }
  }

  analyzeStage2Results() {
    // Calculate channel scores from Stage 2 answers
    this.analysisData.stage2Results = {};
    this.identifiedChannels = [];
    
    // Group answers by channel
    const channelAnswers = {};
    this.questionSequence.forEach(q => {
      if (q.channel && this.answers[q.id] !== undefined) {
        if (!channelAnswers[q.channel]) {
          channelAnswers[q.channel] = [];
        }
        channelAnswers[q.channel].push({
          answer: this.answers[q.id],
          weight: q.weight || 1.0,
          type: q.type
        });
      }
    });
    
    // Calculate scores for each channel
    Object.keys(channelAnswers).forEach(channelId => {
      const answers = channelAnswers[channelId];
      const channel = CHANNELS[channelId];
      if (!channel) return;
      
      // Weight blocked flow questions more heavily
      let totalScore = 0;
      let totalWeight = 0;
      
      answers.forEach(a => {
        const weight = a.type === 'blocked' ? a.weight * 1.5 : a.weight;
        totalScore += a.answer * weight;
        totalWeight += weight;
      });
      
      const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
      const threshold = 5.0;
      
      this.analysisData.stage2Results[channelId] = {
        channel: channelId,
        name: channel.name,
        score: averageScore,
        threshold: threshold,
        blocked: averageScore >= threshold
      };
      
      // Separate lack from blockage scores
      const lackAnswers = answers.filter(a => a.type === 'lack');
      const blockedAnswers = answers.filter(a => a.type === 'blocked');
      
      let lackScore = 0;
      let blockedScore = 0;
      
      if (lackAnswers.length > 0) {
        const lackTotal = lackAnswers.reduce((sum, a) => sum + (a.answer * a.weight), 0);
        const lackWeight = lackAnswers.reduce((sum, a) => sum + a.weight, 0);
        lackScore = lackWeight > 0 ? lackTotal / lackWeight : 0;
      }
      
      if (blockedAnswers.length > 0) {
        const blockedTotal = blockedAnswers.reduce((sum, a) => sum + (a.answer * a.weight * 1.5), 0);
        const blockedWeight = blockedAnswers.reduce((sum, a) => sum + (a.weight * 1.5), 0);
        blockedScore = blockedWeight > 0 ? blockedTotal / blockedWeight : 0;
      }
      
      this.analysisData.stage2Results[channelId].lackScore = lackScore;
      this.analysisData.stage2Results[channelId].blockedScore = blockedScore;
      this.analysisData.stage2Results[channelId].direction = `${NODES[channel.from]?.name || channel.from} → ${NODES[channel.to]?.name || channel.to}`;
      
      if (averageScore >= threshold) {
        this.identifiedChannels.push({
          key: channelId,
          name: channel.name,
          score: averageScore,
          lackScore: lackScore,
          blockedScore: blockedScore,
          from: channel.from,
          to: channel.to,
          fromName: NODES[channel.from]?.name || channel.from,
          toName: NODES[channel.to]?.name || channel.to,
          direction: `${NODES[channel.from]?.name || channel.from} → ${NODES[channel.to]?.name || channel.to}`
        });
      }
      
      // Detect compensatory reroutes
      this.detectCompensatoryReroutes(channelId, channel, averageScore);
    });
    
    this.analysisData.channelScores = this.analysisData.stage2Results;
    
    // Check for cross-engine handoffs
    this.checkCrossEngineHandoffs();
  }
  
  detectCompensatoryReroutes(blockedChannelId, blockedChannel, score) {
    // If a channel is blocked, check if other channels from/to the same nodes are scoring high (compensatory flow)
    if (score >= 5.0) {
      const fromNode = blockedChannel.from;
      const toNode = blockedChannel.to;
      
      const compensatoryChannels = [];
      Object.keys(CHANNELS).forEach(channelId => {
        if (channelId === blockedChannelId) return;
        const channel = CHANNELS[channelId];
        const channelScore = this.analysisData.stage2Results[channelId]?.score || 0;
        
        // Check if this channel connects to/from the same nodes (alternative route)
        if (channelScore < 3.0 && (
          (channel.from === fromNode && channel.to !== toNode) ||
          (channel.to === toNode && channel.from !== fromNode) ||
          (channel.from === toNode && channel.to === fromNode)
        )) {
          compensatoryChannels.push({
            key: channelId,
            name: channel.name,
            score: channelScore,
            direction: `${NODES[channel.from]?.name || channel.from} → ${NODES[channel.to]?.name || channel.to}`
          });
        }
      });
      
      if (compensatoryChannels.length > 0) {
        this.compensatoryReroutes[blockedChannelId] = {
          blockedChannel: blockedChannelId,
          blockedChannelName: blockedChannel.name,
          compensatoryChannels: compensatoryChannels,
          message: `When ${blockedChannel.name} is blocked, the system may compensate through: ${compensatoryChannels.map(c => c.name).join(', ')}. This is a natural rerouting pattern.`
        };
        this.analysisData.compensatoryReroutes[blockedChannelId] = this.compensatoryReroutes[blockedChannelId];
      }
    }
  }
  
  checkCrossEngineHandoffs() {
    // Check for Gut-Heart or Mind-Throat channels that might benefit from other engines
    this.identifiedChannels.forEach(channel => {
      const fromNode = channel.from;
      const toNode = channel.to;
      
      // Gut-Heart channel suggests manipulation analysis
      if ((fromNode === 'gut' && toNode === 'heart') || (fromNode === 'heart' && toNode === 'gut')) {
        this.analysisData.crossEngineHandoffs.push({
          channel: channel.key,
          channelName: channel.name,
          suggestedEngine: 'manipulation',
          reason: 'Gut-Heart channel blockages often relate to manipulation patterns and relational dynamics.'
        });
      }
      
      // Mind-Throat channel suggests paradigm clarification
      if ((fromNode === 'mind' && toNode === 'throat') || (fromNode === 'throat' && toNode === 'mind')) {
        this.analysisData.crossEngineHandoffs.push({
          channel: channel.key,
          channelName: channel.name,
          suggestedEngine: 'paradigm',
          reason: 'Mind-Throat channel blockages often relate to paradigm misalignment and meaning-making patterns.'
        });
      }
    });
  }

  analyzeStage3Results() {
    // Store Stage 3 management insights
    this.analysisData.stage3Results = {};
    
    this.identifiedChannels.forEach(channel => {
      const managementAnswers = {};
      this.questionSequence
        .filter(q => q.channel === channelKey && q.stage === 3)
        .forEach(q => {
          if (this.answers[q.id] !== undefined) {
            managementAnswers[q.id] = {
              question: q.question,
              answer: this.answers[q.id]
            };
          }
        });
      
      this.analysisData.stage3Results[channelKey] = managementAnswers;
    });
  }

  finalizeResults() {
    // Get remediation strategies
    this.getRemediationStrategies();
    
    // Include all raw answers and question sequence for AI agent export
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = [];
    
    // Collect all questions from all stages
    [1, 2, 3].forEach(stage => {
      const stageQuestions = this.getStageQuestions(stage);
      stageQuestions.forEach(q => {
        this.analysisData.questionSequence.push({
          id: q.id,
          question: q.question,
          stage: q.stage,
          node: q.node,
          channel: q.channel,
          weight: q.weight
        });
      });
    });
    
    this.analysisData.finalChannels = this.identifiedChannels;
    this.analysisData.identifiedChannels = this.identifiedChannels; // Ensure it's set for renderResults
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  getStageQuestions(stage) {
    // This would need to track all questions asked across stages
    // For now, return empty array - will be populated by tracking
    return [];
  }

  updateStageIndicator() {
    const stageIndicator = document.getElementById('stageIndicator');
    if (stageIndicator) {
      const stageNames = {
        1: 'Stage 1: Node Identification',
        2: 'Stage 2: Channel Analysis',
        3: 'Stage 3: Management Strategies'
      };
      stageIndicator.textContent = stageNames[this.currentStage] || '';
    }
  }

  calculateChannelScores() {
    // Calculate scores for each channel
    Object.keys(CHANNEL_MAPPING).forEach(channelId => {
      const mapping = CHANNEL_MAPPING[channelId];
      const channel = CHANNELS[channelId];
      
      if (!channel) return;
      
      let totalScore = 0;
      let questionCount = 0;
      
      // Check symptom questions for this channel
      mapping.symptoms.forEach(symptomId => {
        if (this.answers[symptomId] !== undefined) {
          const question = this.findQuestionById(symptomId);
          if (question) {
            totalScore += this.answers[symptomId] * question.weight;
            questionCount++;
          }
        }
      });
      
      const averageScore = questionCount > 0 ? totalScore / questionCount : 0;
      const thresholdScore = mapping.threshold * 10;
      
      this.analysisData.channelScores[channelId] = {
        name: channel.name,
        description: channel.description,
        from: channel.from,
        to: channel.to,
        rawScore: averageScore,
        questionCount: questionCount,
        threshold: thresholdScore,
        blocked: averageScore >= thresholdScore,
        healthy_abundance: channel.healthy_abundance,
        healthy_lack: channel.healthy_lack,
        blocked_description: channel.blocked
      };
    });
  }

  findQuestionById(id) {
    return this.questionSequence.find(q => q.id === id);
  }

  identifyChannels() {
    // Identify channels that exceed threshold (blocked)
    this.analysisData.identifiedChannels = Object.entries(this.analysisData.channelScores)
      .map(([key, data]) => ({ key, ...data }))
      .filter(channel => channel.blocked)
      .sort((a, b) => b.rawScore - a.rawScore);
  }

  getRemediationStrategies() {
    // Get remediation strategies for identified channels
    // Enforce single-primary-intervention rule and separate state from trait work
    this.analysisData.remediationStrategies = [];
    
    this.analysisData.identifiedChannels.forEach(channel => {
      const strategy = REMEDIATION_STRATEGIES[channel.key];
      if (strategy) {
        // Categorize strategies as state-level (sleep, food, breath, rhythm) or structural (belief, boundary, habit)
        const stateStrategies = strategy.strategies.filter(s => 
          s.toLowerCase().includes('sleep') ||
          s.toLowerCase().includes('food') ||
          s.toLowerCase().includes('nutrition') ||
          s.toLowerCase().includes('breath') ||
          s.toLowerCase().includes('rhythm') ||
          s.toLowerCase().includes('exercise') ||
          s.toLowerCase().includes('movement') ||
          s.toLowerCase().includes('grounding') ||
          s.toLowerCase().includes('physical')
        );
        
        const structuralStrategies = strategy.strategies.filter(s => 
          s.toLowerCase().includes('belief') ||
          s.toLowerCase().includes('boundary') ||
          s.toLowerCase().includes('habit') ||
          s.toLowerCase().includes('therapy') ||
          s.toLowerCase().includes('processing') ||
          s.toLowerCase().includes('establish') ||
          s.toLowerCase().includes('address')
        );
        
        // Identify primary strategy (first state-level, or first overall if no state-level)
        const primaryStrategy = stateStrategies.length > 0 ? stateStrategies[0] : strategy.strategies[0];
        const secondaryStrategies = strategy.strategies.filter(s => s !== primaryStrategy);
        
        this.analysisData.remediationStrategies.push({
          channel: channel.key,
          channelName: channel.name,
          primaryStrategy: primaryStrategy,
          secondaryStrategies: secondaryStrategies,
          stateStrategies: stateStrategies,
          structuralStrategies: structuralStrategies,
          practices: strategy.practices
        });
      }
    });
  }

  renderResults() {
    const container = document.getElementById('channelResults');
    if (!container) return;
    
    let html = '';
    
    // System snapshot metaphor
    html += '<div style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 2rem;">';
    html += '<p style="margin: 0; font-size: 0.95rem; line-height: 1.7; color: var(--muted);"><strong style="color: var(--brand);">System Snapshot:</strong> These results represent a snapshot of your system under current load. Patterns may shift with life demands, stress, and growth. This map serves orientation—not a fixed identity.</p>';
    html += '</div>';
    
    // Show node bands if nodes were identified
    if (this.identifiedNodes.length > 0) {
      html += '<div style="margin-bottom: 2rem;">';
      html += '<h3 style="color: var(--brand); margin-bottom: 1rem;">Node Status:</h3>';
      html += '<p style="color: var(--muted); margin-bottom: 1rem; font-size: 0.9rem;">Node bands: <strong>Stable</strong> (&lt; 5.0), <strong>Strained</strong> (5.0-7.0), <strong>Constricted</strong> (&gt; 7.0)</p>';
      
      if (this.analysisData.dominantStrainNode) {
        html += `<div style="background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">`;
        html += `<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--accent);">Dominant Strain Node:</strong> ${this.analysisData.dominantStrainNode.name} (${this.analysisData.dominantStrainNode.band}, Score: ${this.analysisData.dominantStrainNode.score.toFixed(1)}/10)</p>`;
        html += `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; font-style: italic; color: var(--muted);">${this.analysisData.dominantStrainNode.note}</p>`;
        html += '</div>';
      }
      
      html += '<ul style="list-style: none; padding: 0;">';
      Object.values(this.analysisData.nodeScores).forEach(node => {
        const bandColor = node.band === 'Constricted' ? '#d32f2f' : node.band === 'Strained' ? '#ffc107' : '#28a745';
        html += `<li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.1);">
          <strong>${node.name}</strong>: <span style="color: ${bandColor};">${node.band}</span> 
          <span style="color: var(--muted); font-size: 0.9em;">(Score: ${node.score.toFixed(1)}/10)</span>
        </li>`;
      });
      html += '</ul></div>';
    }
    
    if (this.analysisData.identifiedChannels.length === 0) {
      html += `
        <div style="padding: 2rem; text-align: center;">
          <h3 style="color: var(--brand); margin-bottom: 1rem;">No Significant Channel Blockages Detected</h3>
          <p style="color: var(--muted);">Based on your responses, no channels scored above the blockage threshold. This may indicate:</p>
          <ul style="text-align: left; max-width: 600px; margin: 1rem auto;">
            <li>Healthy flow between nodes</li>
            <li>Balanced integration across your system</li>
            <li>Minimal disruption in inter-node dynamics</li>
          </ul>
        </div>
      `;
    } else {
      // Explicitly forbid simultaneous optimization
      html += '<div style="background: rgba(211, 47, 47, 0.1); border-left: 4px solid #d32f2f; border-radius: var(--radius); padding: 1.25rem; margin-bottom: 2rem;">';
      html += '<p style="margin: 0; font-size: 0.95rem; line-height: 1.7; color: var(--muted);"><strong style="color: #d32f2f;">Important:</strong> Working on more than one channel at a time reduces integration. Focus on the primary intervention for one channel for 14–30 days before reassessing or moving to another.</p>';
      html += '</div>';
      
      html += '<p style="color: var(--muted); margin-bottom: 1.5rem;">Based on your responses, the following channels of concern have been identified:</p>';
      
      this.analysisData.identifiedChannels.forEach((channel, index) => {
        const severity = channel.score >= 8 ? 'High' : channel.score >= 5 ? 'Moderate' : 'Low';
        
        html += `
          <div class="channel-result" style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); box-shadow: var(--shadow);">
            <h3 style="color: var(--brand); margin-bottom: 0.75rem;">${channel.name} - ${severity} Priority</h3>
            <p style="color: var(--muted); margin-bottom: 1rem; font-weight: 600;">Direction: <strong>${channel.direction}</strong></p>
            <p><strong>Overall Constraint Score:</strong> ${channel.score.toFixed(1)}/10</p>
        `;
        
        // Show lack vs blockage differentiation
        if (channel.lackScore !== undefined && channel.blockedScore !== undefined) {
          html += `<div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 123, 255, 0.1); border-radius: var(--radius);">`;
          html += `<p style="margin: 0 0 0.5rem 0; font-weight: 600; color: var(--brand);">Flow Constraint Breakdown:</p>`;
          html += `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Lack Score:</strong> ${channel.lackScore.toFixed(1)}/10 (insufficient input from ${channel.fromName})</p>`;
          html += `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Blockage Score:</strong> ${channel.blockedScore.toFixed(1)}/10 (impaired transmission between nodes)</p>`;
          html += `</div>`;
        }
        
        // Show compensatory reroutes
        if (this.analysisData.compensatoryReroutes[channel.key]) {
          const reroute = this.analysisData.compensatoryReroutes[channel.key];
          html += `<div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 184, 0, 0.1); border-left: 3px solid var(--accent); border-radius: var(--radius);">`;
          html += `<p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--muted);"><strong style="color: var(--accent);">Compensatory Reroute:</strong> ${reroute.message}</p>`;
          html += `</div>`;
        }
        
        // Add remediation strategies with single-primary-intervention rule
        const strategy = this.analysisData.remediationStrategies.find(s => s.channel === channel.key);
        if (strategy) {
          html += `
            <div style="margin-top: 1.5rem;">
              <h4 style="color: var(--brand); margin-bottom: 0.75rem;">Remediation Strategy:</h4>
              
              <div style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
                <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: var(--brand);">Primary Intervention:</p>
                <p style="margin: 0; font-size: 1.05rem; line-height: 1.6;">${strategy.primaryStrategy}</p>
                <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; font-style: italic; color: var(--muted);">Apply this for 14–30 days before reassessment.</p>
              </div>
              
              <div style="margin-top: 1rem;">
                <p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--muted);">Secondary / Optional Strategies:</p>
                <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          `;
          strategy.secondaryStrategies.slice(0, 3).forEach(strat => {
            html += `<li style="margin-bottom: 0.5rem; font-size: 0.95rem;">${strat}</li>`;
          });
          html += '</ul></div>';
          
          // Separate state from trait work
          if (strategy.stateStrategies.length > 0 || strategy.structuralStrategies.length > 0) {
            html += '<div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.7); border-radius: var(--radius);">';
            html += '<p style="font-weight: 600; margin-bottom: 0.75rem; color: var(--brand);">Strategy Sequencing:</p>';
            
            if (strategy.stateStrategies.length > 0) {
              html += '<div style="margin-bottom: 1rem;">';
              html += '<p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--brand);">State-Level (Start Here):</p>';
              html += '<p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem;">Sleep, food, breath, rhythm, physical grounding</p>';
              html += '<ul style="margin-left: 1.5rem; font-size: 0.9rem;">';
              strategy.stateStrategies.slice(0, 3).forEach(strat => {
                html += `<li style="margin-bottom: 0.25rem;">${strat}</li>`;
              });
              html += '</ul></div>';
            }
            
            if (strategy.structuralStrategies.length > 0) {
              html += '<div>';
              html += '<p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--accent);">Structural (After State Stabilization):</p>';
              html += '<p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem;">Belief, boundary, habit, therapy, processing</p>';
              html += '<ul style="margin-left: 1.5rem; font-size: 0.9rem;">';
              strategy.structuralStrategies.slice(0, 3).forEach(strat => {
                html += `<li style="margin-bottom: 0.25rem;">${strat}</li>`;
              });
              html += '</ul></div>';
            }
            
            html += '</div>';
          }
          
          if (strategy.practices && strategy.practices.length > 0) {
            html += `
              <div style="margin-top: 1rem;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Recommended Practices:</p>
                <p style="color: var(--muted); font-size: 0.9rem;">${strategy.practices.join(', ')}</p>
              </div>
            `;
          }
        }
        
        html += '</div>';
      });
      
      // Cross-engine handoffs
      if (this.analysisData.crossEngineHandoffs.length > 0) {
        html += '<div style="margin-top: 2rem; padding: 1.5rem; background: rgba(255, 184, 0, 0.1); border-left: 4px solid var(--accent); border-radius: var(--radius);">';
        html += '<h3 style="color: var(--accent); margin-bottom: 1rem;">Related Analysis Tools:</h3>';
        this.analysisData.crossEngineHandoffs.forEach(handoff => {
          const engineLink = handoff.suggestedEngine === 'manipulation' ? 'manipulation.html' : 'paradigm.html';
          const engineName = handoff.suggestedEngine === 'manipulation' ? 'Manipulation Analysis' : 'Paradigm Clarification';
          html += `<div style="margin-bottom: 1rem;">`;
          html += `<p style="margin: 0; font-size: 0.95rem; line-height: 1.6;"><strong>${handoff.channelName}:</strong> ${handoff.reason} Consider the <a href="${engineLink}" style="color: var(--brand); text-decoration: underline;">${engineName}</a> tool for deeper insight.</p>`;
          html += `</div>`;
        });
        html += '</div>';
      }
      
      // Exit discipline
      html += this.getExitSection();
    }
    
    container.innerHTML = html;
  }
  
  getExitSection() {
    return `
      <div style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius); padding: 2rem; margin-top: 2.5rem; border: 2px solid var(--brand); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h3 style="color: var(--brand); margin-bottom: 1rem; text-align: center;">Orientation → Action → Closure</h3>
        <div style="line-height: 1.8;">
          <p style="color: var(--muted); margin-bottom: 1rem; text-align: center; font-size: 1.05rem;">This analysis is complete. You have received a snapshot of your current channel dynamics and strategic interventions.</p>
          <div style="background: rgba(211, 47, 47, 0.1); border-radius: var(--radius); padding: 1rem; margin-top: 1.5rem; text-align: center;">
            <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--muted);"><strong style="color: #d32f2f;">Exit Cue:</strong> Do not re-run this analysis immediately. Apply the primary intervention for 14–30 days, then reassess if needed. This map serves orientation—return to lived action.</p>
          </div>
        </div>
      </div>
    `;
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

  saveProgress() {
    const progressData = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('channelsProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('channelsProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        
        // If in progress, restore questionnaire state
        if (this.currentQuestionIndex > 0 && this.currentQuestionIndex < this.questionSequence.length) {
          this.renderCurrentQuestion();
        } else if (this.currentQuestionIndex >= this.questionSequence.length) {
          // Assessment was completed, recalculate
          this.completeAssessment();
        }
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }
  }

  clearAllCachedData() {
    if (confirm('Are you sure you want to clear all cached data? This will clear all saved progress and you will need to start from the beginning.')) {
      sessionStorage.removeItem('channelsProgress');
      this.resetAssessment();
      alert('All cached data has been cleared.');
    }
  }

  resetAssessment() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.analysisData = {
      timestamp: new Date().toISOString(),
      symptoms: {},
      channelScores: {},
      identifiedChannels: [],
      remediationStrategies: []
    };
    
    sessionStorage.removeItem('channelsProgress');
    
    // Reset UI
    document.getElementById('questionnaireSection').classList.add('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.renderCurrentQuestion();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ChannelsEngine();
});

