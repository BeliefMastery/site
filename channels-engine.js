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
    this.analysisData = {
      timestamp: new Date().toISOString(),
      stage1Results: {},
      stage2Results: {},
      stage3Results: {},
      nodeScores: {},
      channelScores: {},
      finalChannels: [],
      remediationStrategies: []
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
    
    this.identifiedNodes.forEach(nodeKey => {
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
          
          // Lack question
          this.questionSequence.push({
            id: `channel_${channelId}_lack`,
            question: `When ${fromNode} lacks resources or is depleted, how does that impact ${toNode}? ${channel.healthy_lack || 'Consider how the flow responds when the source node is low.'}`,
            weight: 1.0,
            channel: channelId,
            stage: 2,
            type: 'lack'
          });
          
          // Blocked question
          this.questionSequence.push({
            id: `channel_${channelId}_blocked`,
            question: `Do you experience symptoms of blocked flow between ${fromNode} and ${toNode}? ${channel.blocked || 'Consider any disconnect, inappropriate responses, or inability for one node to inform the other.'}`,
            weight: 1.3,
            channel: channelId,
            stage: 2,
            type: 'blocked'
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
          <span>Not at all / Never (0-2)</span>
          <span>Moderately / Sometimes (5-6)</span>
          <span>Extremely / Always (9-10)</span>
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
        this.updateStageIndicator();
        return;
      } else {
        // No nodes with issues, show results
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
      this.analysisData.stage1Results[nodeKey] = {
        node: nodeKey,
        name: NODES[nodeKey]?.name || nodeKey,
        score: averageScore,
        threshold: 5.0 // Nodes scoring above 5 indicate issues
      };
      
      // Identify nodes with issues (score >= 5)
      if (averageScore >= 5.0) {
        this.identifiedNodes.push(nodeKey);
      }
    });
    
    this.analysisData.nodeScores = this.analysisData.stage1Results;
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
      
      if (averageScore >= threshold) {
        this.identifiedChannels.push({
          key: channelId,
          name: channel.name,
          score: averageScore,
          from: channel.from,
          to: channel.to
        });
      }
    });
    
    this.analysisData.channelScores = this.analysisData.stage2Results;
  }

  analyzeStage3Results() {
    // Store Stage 3 management insights
    this.analysisData.stage3Results = {};
    
    this.identifiedChannels.forEach(channel => {
      const managementAnswers = {};
      this.questionSequence
        .filter(q => q.channel === channel.key && q.stage === 3)
        .forEach(q => {
          if (this.answers[q.id] !== undefined) {
            managementAnswers[q.id] = {
              question: q.question,
              answer: this.answers[q.id]
            };
          }
        });
      
      this.analysisData.stage3Results[channel.key] = managementAnswers;
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
    this.analysisData.remediationStrategies = [];
    
    this.analysisData.identifiedChannels.forEach(channel => {
      const strategy = REMEDIATION_STRATEGIES[channel.key];
      if (strategy) {
        this.analysisData.remediationStrategies.push({
          channel: channel.key,
          channelName: channel.name,
          strategies: strategy.strategies,
          practices: strategy.practices
        });
      }
    });
  }

  renderResults() {
    const container = document.getElementById('channelResults');
    if (!container) return;
    
    let html = '';
    
    if (this.analysisData.identifiedChannels.length === 0) {
      html = `
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
      html = '<p style="color: var(--muted); margin-bottom: 1.5rem;">Based on your responses, the following channels of concern have been identified:</p>';
      
      this.analysisData.identifiedChannels.forEach((channel, index) => {
        const severity = channel.rawScore >= 8 ? 'High' : channel.rawScore >= 5 ? 'Moderate' : 'Low';
        html += `
          <div class="channel-result">
            <h3>${channel.name} - ${severity} Priority</h3>
            <p style="color: var(--muted); margin-bottom: 1rem;">${channel.description}</p>
            <p><strong>Blockage Score:</strong> ${channel.rawScore.toFixed(1)}/10</p>
            <p style="margin-top: 1rem; font-weight: 600;">Blockage Description:</p>
            <p style="color: var(--muted); margin-bottom: 1rem;">${channel.blocked_description}</p>
        `;
        
        // Add remediation strategies
        const strategy = this.analysisData.remediationStrategies.find(s => s.channel === channel.key);
        if (strategy) {
          html += `
            <p style="margin-top: 1rem; font-weight: 600;">Strategic Remediation:</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          `;
          strategy.strategies.forEach(strat => {
            html += `<li>${strat}</li>`;
          });
          html += '</ul>';
          
          if (strategy.practices && strategy.practices.length > 0) {
            html += `
              <p style="margin-top: 1rem; font-weight: 600;">Recommended Practices:</p>
              <p style="color: var(--muted);">${strategy.practices.join(', ')}</p>
            `;
          }
        }
        
        html += '</div>';
      });
    }
    
    container.innerHTML = html;
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

