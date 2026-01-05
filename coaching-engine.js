// Coaching Engine
// Manages questionnaire flow, weighting, and profile generation for AI coaching agent

import { SOVEREIGNTY_OBSTACLES } from './coaching-data/sovereignty-obstacles.js';
import { SATISFACTION_DOMAINS } from './coaching-data/satisfaction-domains.js';
import { QUESTION_WEIGHTINGS } from './coaching-data/question-weightings.js';
import { COACHING_PROMPTS } from './coaching-data/coaching-prompts.js';

class CoachingEngine {
  constructor() {
    this.selectedSections = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.currentSection = null;
    this.profileData = {
      timestamp: new Date().toISOString(),
      obstacles: {},
      domains: {},
      weightedScores: {},
      priorities: {},
      coachingProfile: {}
    };
    
    this.init();
  }

  init() {
    this.renderSectionSelection();
    this.attachEventListeners();
    this.loadStoredData();
  }

  renderSectionSelection() {
    const grid = document.getElementById('sectionGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Add Obstacles section
    const obstaclesCard = document.createElement('div');
    obstaclesCard.className = 'section-card';
    obstaclesCard.dataset.section = 'obstacles';
    obstaclesCard.innerHTML = `
      <h3>15 Obstacles to Sovereignty</h3>
      <p>Identify constraints limiting your freedom, joy, and satisfaction in life. This assessment helps surface hidden and not-so-hidden forces that may be impacting your current state.</p>
    `;
    obstaclesCard.addEventListener('click', () => this.toggleSection('obstacles'));
    grid.appendChild(obstaclesCard);
    
    // Add Satisfaction Domains section
    const domainsCard = document.createElement('div');
    domainsCard.className = 'section-card';
    domainsCard.dataset.section = 'domains';
    domainsCard.innerHTML = `
      <h3>10 Satisfaction Domains</h3>
      <p>Evaluate areas of life that determine the depth of your satisfaction. This systematic overview reveals the most impactful domains where action will directly impact your satisfaction.</p>
    `;
    domainsCard.addEventListener('click', () => this.toggleSection('domains'));
    grid.appendChild(domainsCard);
  }

  toggleSection(sectionId) {
    const card = document.querySelector(`[data-section="${sectionId}"]`);
    if (!card) return;
    
    if (this.selectedSections.includes(sectionId)) {
      this.selectedSections = this.selectedSections.filter(s => s !== sectionId);
      card.classList.remove('selected');
    } else {
      this.selectedSections.push(sectionId);
      card.classList.add('selected');
    }
    
    document.getElementById('startAssessment').disabled = this.selectedSections.length === 0;
  }

  attachEventListeners() {
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startAssessment());
    }
    
    const nextBtn = document.getElementById('nextQuestion');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    const prevBtn = document.getElementById('prevQuestion');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }
    
    const exportBtn = document.getElementById('exportProfile');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportProfile());
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
    if (this.selectedSections.length === 0) return;
    
    // Build question sequence
    this.questionSequence = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    
    this.selectedSections.forEach(sectionId => {
      if (sectionId === 'obstacles') {
        Object.keys(SOVEREIGNTY_OBSTACLES).forEach(obstacleKey => {
          const obstacle = SOVEREIGNTY_OBSTACLES[obstacleKey];
          this.questionSequence.push({
            id: `obstacle_${obstacleKey}`,
            type: 'obstacle',
            section: 'obstacles',
            obstacle: obstacleKey,
            question: obstacle.question,
            description: obstacle.description,
            name: obstacle.name,
            weight: obstacle.weight
          });
        });
      } else if (sectionId === 'domains') {
        Object.keys(SATISFACTION_DOMAINS).forEach(domainKey => {
          const domain = SATISFACTION_DOMAINS[domainKey];
          // Add domain overview question
          this.questionSequence.push({
            id: `domain_${domainKey}_overview`,
            type: 'domain_overview',
            section: 'domains',
            domain: domainKey,
            question: `Overall, how satisfied are you with your ${domain.name.toLowerCase()}?`,
            description: domain.description,
            name: domain.name,
            weight: domain.weight
          });
          
          // Add aspect questions
          domain.aspects.forEach((aspect, index) => {
            this.questionSequence.push({
              id: `domain_${domainKey}_aspect_${index}`,
              type: 'domain_aspect',
              section: 'domains',
              domain: domainKey,
              aspect: aspect,
              question: `How satisfied are you with: ${aspect}?`,
              name: domain.name,
              weight: QUESTION_WEIGHTINGS.aspect_default
            });
          });
        });
      }
    });
    
    // Hide selection, show questionnaire
    document.getElementById('sectionSelection').style.display = 'none';
    document.getElementById('questionnaireSection').classList.add('active');
    
    this.renderCurrentQuestion();
    this.saveProgress();
  }

  renderCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionSequence.length) {
      this.completeAssessment();
      return;
    }
    
    const question = this.questionSequence[this.currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    if (!container) return;
    
    const isObstacle = question.type === 'obstacle';
    const isDomainOverview = question.type === 'domain_overview';
    const isDomainAspect = question.type === 'domain_aspect';
    
    let questionText = question.question;
    let description = '';
    
    if (isObstacle) {
      description = question.description;
    } else if (isDomainOverview) {
      description = question.description;
    } else if (isDomainAspect) {
      description = `Part of: ${question.name}`;
    }
    
    container.innerHTML = `
      <div class="question-block">
        <h3>${questionText}</h3>
        ${description ? `<p class="description">${description}</p>` : ''}
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
          <strong>Tip:</strong> ${isObstacle ? 'Higher scores indicate greater obstacles to sovereignty.' : 'Higher scores indicate greater satisfaction in this area.'}
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
    // Calculate weighted scores and generate profile
    this.calculateProfile();
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  calculateProfile() {
    // Process obstacles
    if (this.selectedSections.includes('obstacles')) {
      Object.keys(SOVEREIGNTY_OBSTACLES).forEach(obstacleKey => {
        const obstacle = SOVEREIGNTY_OBSTACLES[obstacleKey];
        const answerId = `obstacle_${obstacleKey}`;
        const score = this.answers[answerId] || 0;
        const weightedScore = score * obstacle.weight;
        
        this.profileData.obstacles[obstacleKey] = {
          name: obstacle.name,
          rawScore: score,
          weightedScore: weightedScore,
          description: obstacle.description
        };
      });
    }
    
    // Process domains
    if (this.selectedSections.includes('domains')) {
      Object.keys(SATISFACTION_DOMAINS).forEach(domainKey => {
        const domain = SATISFACTION_DOMAINS[domainKey];
        const overviewId = `domain_${domainKey}_overview`;
        const overviewScore = this.answers[overviewId] || 0;
        
        // Calculate aspect scores
        const aspectScores = domain.aspects.map((aspect, index) => {
          const aspectId = `domain_${domainKey}_aspect_${index}`;
          return this.answers[aspectId] || 0;
        });
        
        const averageAspectScore = aspectScores.length > 0
          ? aspectScores.reduce((a, b) => a + b, 0) / aspectScores.length
          : 0;
        
        // Combined score (overview + average aspects)
        const combinedScore = (overviewScore + averageAspectScore) / 2;
        const weightedScore = combinedScore * domain.weight;
        
        this.profileData.domains[domainKey] = {
          name: domain.name,
          overviewScore: overviewScore,
          averageAspectScore: averageAspectScore,
          combinedScore: combinedScore,
          weightedScore: weightedScore,
          aspects: domain.aspects.map((aspect, index) => ({
            name: aspect,
            score: aspectScores[index]
          }))
        };
      });
    }
    
    // Calculate priorities (highest obstacles, lowest satisfaction domains)
    this.calculatePriorities();
    
    // Generate coaching profile
    this.generateCoachingProfile();
  }

  calculatePriorities() {
    // Top obstacles (highest weighted scores)
    const obstacles = Object.entries(this.profileData.obstacles)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 5);
    
    // Top improvement areas (lowest satisfaction domains)
    const improvementAreas = Object.entries(this.profileData.domains)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => a.combinedScore - b.combinedScore)
      .slice(0, 5);
    
    this.profileData.priorities = {
      topObstacles: obstacles,
      topImprovementAreas: improvementAreas
    };
  }

  generateCoachingProfile() {
    // Create coaching profile for AI agent
    this.profileData.coachingProfile = {
      systemPrompt: COACHING_PROMPTS.system_prompt,
      coachingStyle: COACHING_PROMPTS.coaching_style,
      userProfile: {
        obstacles: this.profileData.obstacles,
        domains: this.profileData.domains,
        priorities: this.profileData.priorities
      },
      responseTemplates: COACHING_PROMPTS.response_templates,
      metadata: {
        timestamp: this.profileData.timestamp,
        sectionsCompleted: this.selectedSections,
        totalQuestions: this.questionSequence.length
      }
    };
  }

  renderResults() {
    const container = document.getElementById('profileResults');
    if (!container) return;
    
    let html = '<div class="profile-summary">';
    html += '<h3>Profile Summary</h3>';
    
    // Obstacles summary
    if (Object.keys(this.profileData.obstacles).length > 0) {
      html += '<h4 style="margin-top: 1.5rem; color: var(--brand);">Obstacles to Sovereignty</h4>';
      const sortedObstacles = Object.entries(this.profileData.obstacles)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.weightedScore - a.weightedScore);
      
      sortedObstacles.forEach(obstacle => {
        const severity = obstacle.rawScore >= 7 ? 'High' : obstacle.rawScore >= 4 ? 'Moderate' : 'Low';
        html += `
          <div class="obstacle-item">
            <strong>${obstacle.name}</strong> - Score: ${obstacle.rawScore}/10 (${severity})
            <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--muted);">${obstacle.description}</p>
          </div>
        `;
      });
    }
    
    // Domains summary
    if (Object.keys(this.profileData.domains).length > 0) {
      html += '<h4 style="margin-top: 1.5rem; color: var(--brand);">Satisfaction Domains</h4>';
      const sortedDomains = Object.entries(this.profileData.domains)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.combinedScore - a.combinedScore);
      
      sortedDomains.forEach(domain => {
        const satisfaction = domain.combinedScore >= 7 ? 'High' : domain.combinedScore >= 4 ? 'Moderate' : 'Low';
        html += `
          <div class="domain-item">
            <strong>${domain.name}</strong> - Satisfaction: ${domain.combinedScore.toFixed(1)}/10 (${satisfaction})
            <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--muted);">Overall: ${domain.overviewScore}/10 | Average Aspects: ${domain.averageAspectScore.toFixed(1)}/10</p>
          </div>
        `;
      });
    }
    
    // Priorities
    if (this.profileData.priorities.topObstacles.length > 0 || this.profileData.priorities.topImprovementAreas.length > 0) {
      html += '<h4 style="margin-top: 1.5rem; color: var(--brand);">Key Priorities</h4>';
      
      if (this.profileData.priorities.topObstacles.length > 0) {
        html += '<p style="font-weight: 600; margin-top: 1rem;">Top Obstacles to Address:</p><ul>';
        this.profileData.priorities.topObstacles.forEach(obs => {
          html += `<li>${obs.name} (${obs.rawScore}/10)</li>`;
        });
        html += '</ul>';
      }
      
      if (this.profileData.priorities.topImprovementAreas.length > 0) {
        html += '<p style="font-weight: 600; margin-top: 1rem;">Areas for Improvement:</p><ul>';
        this.profileData.priorities.topImprovementAreas.forEach(domain => {
          html += `<li>${domain.name} (${domain.combinedScore.toFixed(1)}/10)</li>`;
        });
        html += '</ul>';
      }
    }
    
    html += '</div>';
    container.innerHTML = html;
  }

  exportProfile() {
    const dataStr = JSON.stringify(this.profileData.coachingProfile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coaching-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  saveProgress() {
    const progressData = {
      selectedSections: this.selectedSections,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('coachingProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = sessionStorage.getItem('coachingProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.selectedSections = data.selectedSections || [];
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
        
        // Restore section selections
        this.selectedSections.forEach(sectionId => {
          const card = document.querySelector(`[data-section="${sectionId}"]`);
          if (card) card.classList.add('selected');
        });
        
        if (this.selectedSections.length > 0) {
          document.getElementById('startAssessment').disabled = false;
        }
        
        // If in progress, rebuild question sequence and restore questionnaire state
        if (this.currentQuestionIndex > 0 && this.selectedSections.length > 0) {
          // Rebuild question sequence
          this.questionSequence = [];
          this.selectedSections.forEach(sectionId => {
            if (sectionId === 'obstacles') {
              Object.keys(SOVEREIGNTY_OBSTACLES).forEach(obstacleKey => {
                const obstacle = SOVEREIGNTY_OBSTACLES[obstacleKey];
                this.questionSequence.push({
                  id: `obstacle_${obstacleKey}`,
                  type: 'obstacle',
                  section: 'obstacles',
                  obstacle: obstacleKey,
                  question: obstacle.question,
                  description: obstacle.description,
                  name: obstacle.name,
                  weight: obstacle.weight
                });
              });
            } else if (sectionId === 'domains') {
              Object.keys(SATISFACTION_DOMAINS).forEach(domainKey => {
                const domain = SATISFACTION_DOMAINS[domainKey];
                this.questionSequence.push({
                  id: `domain_${domainKey}_overview`,
                  type: 'domain_overview',
                  section: 'domains',
                  domain: domainKey,
                  question: `Overall, how satisfied are you with your ${domain.name.toLowerCase()}?`,
                  description: domain.description,
                  name: domain.name,
                  weight: domain.weight
                });
                domain.aspects.forEach((aspect, index) => {
                  this.questionSequence.push({
                    id: `domain_${domainKey}_aspect_${index}`,
                    type: 'domain_aspect',
                    section: 'domains',
                    domain: domainKey,
                    aspect: aspect,
                    question: `How satisfied are you with: ${aspect}?`,
                    name: domain.name,
                    weight: QUESTION_WEIGHTINGS.aspect_default
                  });
                });
              });
            }
          });
          
          document.getElementById('sectionSelection').style.display = 'none';
          document.getElementById('questionnaireSection').classList.add('active');
          this.renderCurrentQuestion();
        }
      } catch (e) {
        console.error('Error loading stored data:', e);
      }
    }
  }

  clearAllCachedData() {
    if (confirm('Are you sure you want to clear all cached data? This will clear all saved progress and you will need to start from the beginning.')) {
      sessionStorage.removeItem('coachingProgress');
      this.resetAssessment();
      alert('All cached data has been cleared.');
    }
  }

  resetAssessment() {
    this.selectedSections = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.profileData = {
      timestamp: new Date().toISOString(),
      obstacles: {},
      domains: {},
      weightedScores: {},
      priorities: {},
      coachingProfile: {}
    };
    
    sessionStorage.removeItem('coachingProgress');
    
    // Reset UI
    document.getElementById('sectionSelection').style.display = 'block';
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    
    this.renderSectionSelection();
    document.getElementById('startAssessment').disabled = true;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CoachingEngine();
});

