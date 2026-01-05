// Channels Engine
// Identifies channel blockages and provides remediation strategies

import { NODES } from './channel-data/nodes.js';
import { CHANNELS } from './channel-data/channels.js';
import { CHANNEL_SYMPTOMS } from './channel-data/channel-symptoms.js';
import { REMEDIATION_STRATEGIES } from './channel-data/remediation-strategies.js';
import { CHANNEL_MAPPING } from './channel-data/channel-mapping.js';

class ChannelsEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      symptoms: {},
      channelScores: {},
      identifiedChannels: [],
      remediationStrategies: []
    };
    
    this.init();
  }

  init() {
    this.buildQuestionSequence();
    this.attachEventListeners();
    this.loadStoredData();
    this.startAssessment();
  }

  buildQuestionSequence() {
    this.questionSequence = [];
    
    // Add all symptom questions
    Object.keys(CHANNEL_SYMPTOMS).forEach(category => {
      CHANNEL_SYMPTOMS[category].forEach(question => {
        this.questionSequence.push({
          ...question,
          category: category
        });
      });
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
    
    const exportBtn = document.getElementById('exportAnalysis');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAnalysis());
    }
    
    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }
    
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
    }
  }

  startAssessment() {
    document.getElementById('questionnaireSection').classList.add('active');
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completeAssessment();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    if (!container) return;
    
    const categoryLabel = question.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    container.innerHTML = `
      <div class="question-block">
        <p style="color: var(--muted); margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">${categoryLabel} Symptoms</p>
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
      this.completeAssessment();
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

  completeAssessment() {
    // Calculate channel scores
    this.calculateChannelScores();
    
    // Identify channels of concern
    this.identifyChannels();
    
    // Get remediation strategies
    this.getRemediationStrategies();
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
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

  exportAnalysis() {
    const dataStr = JSON.stringify(this.analysisData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `channel-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

