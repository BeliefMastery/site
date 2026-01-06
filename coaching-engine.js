// Coaching Engine
// Manages questionnaire flow, weighting, and profile generation for AI coaching agent

import { SOVEREIGNTY_OBSTACLES } from './coaching-data/sovereignty-obstacles.js';
import { SATISFACTION_DOMAINS } from './coaching-data/satisfaction-domains.js';
import { SATISFACTION_DOMAIN_EXAMPLES } from './coaching-data/satisfaction-domain-examples.js';
import { QUESTION_WEIGHTINGS } from './coaching-data/question-weightings.js';
import { COACHING_PROMPTS } from './coaching-data/coaching-prompts.js';
import { DEEPER_INQUIRY, ACTION_PLANNING } from './coaching-data/deeper-inquiry.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

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
    
    const exportJSONBtn = document.getElementById('exportProfileJSON');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportProfile('json'));
    }
    
    const exportCSVBtn = document.getElementById('exportProfileCSV');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportProfile('csv'));
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
      abandonBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to abandon this assessment? All progress will be lost.')) {
          this.resetAssessment();
        }
      });
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
    
    // Get example for domain aspect questions
    let example = '';
    if (isDomainAspect && question.domain && question.aspect) {
      const domainExamples = SATISFACTION_DOMAIN_EXAMPLES[question.domain];
      if (domainExamples && domainExamples[question.aspect]) {
        example = domainExamples[question.aspect];
      }
    }
    
    container.innerHTML = `
      <div class="question-block">
        <h3>${questionText}</h3>
        ${description ? `<p class="description">${description}</p>` : ''}
        ${example ? `<p style="font-style: italic; color: var(--muted); margin-top: 0.5rem; margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.5;">${example}</p>` : ''}
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
    
    // Update question count display
    const questionCount = document.getElementById('questionCount');
    if (questionCount) {
      const remaining = this.questionSequence.length - this.currentQuestionIndex;
      questionCount.textContent = `${remaining} question${remaining !== 1 ? 's' : ''} remaining`;
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
    
    // Include all raw answers in profile data
    this.profileData.allAnswers = { ...this.answers };
    this.profileData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question || q.questionText,
      category: q.category || (q.obstacle ? 'obstacle' : q.domain ? 'domain' : null),
      name: q.name,
      section: q.section
    }));
  }

  calculatePriorities() {
    // Apply user weight adjustment if set
    const weightMultiplier = this.profileData.userWeightAdjustment || 1.0;
    
    // Top obstacles (highest weighted scores) - now called "Active Constraints"
    const obstacles = Object.entries(this.profileData.obstacles)
      .map(([key, data]) => {
        // Calculate volatility: high obstacle score + low domain dissatisfaction = situational
        const domainScores = Object.values(this.profileData.domains).map(d => d.combinedScore);
        const avgDomainSatisfaction = domainScores.length > 0 
          ? domainScores.reduce((a, b) => a + b, 0) / domainScores.length 
          : 5;
        const isSituational = data.rawScore >= 7 && avgDomainSatisfaction >= 5;
        
        return {
          key,
          ...data,
          weightedScore: data.weightedScore * weightMultiplier,
          volatility: isSituational ? 'situationally amplified' : 'structurally persistent'
        };
      })
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 5);
    
    // Top improvement areas (lowest satisfaction domains)
    const improvementAreas = Object.entries(this.profileData.domains)
      .map(([key, data]) => ({
        key,
        ...data,
        weightedScore: data.weightedScore * weightMultiplier
      }))
      .sort((a, b) => a.combinedScore - b.combinedScore)
      .slice(0, 5);
    
    // Prevent total domain collapse - if all domains score low, surface one stabilizing domain
    const allDomainScores = Object.values(this.profileData.domains).map(d => d.combinedScore);
    const allLow = allDomainScores.every(score => score < 4);
    let stabilizingDomain = null;
    if (allLow && allDomainScores.length > 0) {
      // Find the highest scoring domain as stabilizing
      const highestDomain = Object.entries(this.profileData.domains)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.combinedScore - a.combinedScore)[0];
      stabilizingDomain = highestDomain;
    }
    
    // Enforce primary axis: one obstacle + one domain
    const primaryObstacle = obstacles.length > 0 ? obstacles[0] : null;
    const primaryDomain = improvementAreas.length > 0 ? improvementAreas[0] : null;
    
    // Calculate axis valid until date (30 days from now)
    const axisValidUntil = new Date();
    axisValidUntil.setDate(axisValidUntil.getDate() + 30);
    
    this.profileData.priorities = {
      topObstacles: obstacles,
      topImprovementAreas: improvementAreas,
      stabilizingDomain: stabilizingDomain
    };
    
    this.profileData.primaryAxis = {
      obstacle: primaryObstacle,
      domain: primaryDomain,
      validUntil: axisValidUntil.toISOString(),
      note: "Focus on this axis for 30 days. Other priorities serve as background context."
    };
  }

  generateCoachingProfile() {
    // Create coaching profile for AI agent with sovereignty clause
    const systemPromptWithClause = `SOVEREIGNTY CLAUSE: This agent serves reflective and catalytic functions. It holds no authority over decision, value, or identity.

${COACHING_PROMPTS.system_prompt}

QUESTION-FIRST BIAS: ${COACHING_PROMPTS.question_first_bias}`;
    
    this.profileData.coachingProfile = {
      systemPrompt: systemPromptWithClause,
      coachingStyle: COACHING_PROMPTS.coaching_style,
      userProfile: {
        obstacles: this.profileData.obstacles,
        domains: this.profileData.domains,
        priorities: this.profileData.priorities,
        primaryAxis: this.profileData.primaryAxis
      },
      responseTemplates: COACHING_PROMPTS.response_templates,
      metadata: {
        timestamp: this.profileData.timestamp,
        sectionsCompleted: this.selectedSections,
        totalQuestions: this.questionSequence.length,
        axisValidUntil: this.profileData.primaryAxis?.validUntil,
        weightProvenance: "Weights reflect Sovereign of Mind prioritization logic.",
        userWeightAdjustment: this.profileData.userWeightAdjustment
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
    
    // Priorities - clearly outlined at top
    html += '</div>'; // Close profile-summary
    
    // Key Priorities Section - Highlighted prominently
    if (this.profileData.priorities.topObstacles.length > 0 || this.profileData.priorities.topImprovementAreas.length > 0) {
      html += '<div style="background: rgba(255, 184, 0, 0.15); border: 3px solid var(--brand); border-radius: var(--radius); padding: 2rem; margin-top: 2rem; margin-bottom: 2rem;">';
      html += '<h3 style="color: var(--brand); margin-bottom: 1.5rem; font-size: 1.4rem;">🎯 Areas of Greatest Impact</h3>';
      html += '<p style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.6;">These are the areas that will provide the greatest positive impact when addressed:</p>';
      
      // Show primary axis prominently
      if (this.profileData.primaryAxis && (this.profileData.primaryAxis.obstacle || this.profileData.primaryAxis.domain)) {
        html += '<div style="background: rgba(0, 123, 255, 0.15); border: 3px solid var(--brand); border-radius: var(--radius); padding: 2rem; margin-bottom: 2rem;">';
        html += '<h3 style="color: var(--brand); margin-bottom: 1rem; font-size: 1.3rem;">🎯 Primary Coaching Axis</h3>';
        html += '<p style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Focus on this axis for 30 days. Other priorities serve as background context.</p>';
        if (this.profileData.primaryAxis.obstacle) {
          html += `<div style="background: rgba(255, 255, 255, 0.8); padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem; border-left: 4px solid #dc3545;">`;
          html += `<p style="margin: 0; font-weight: 600; color: #dc3545;">Active Constraint: ${this.profileData.primaryAxis.obstacle.name}</p>`;
          html += `<p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--muted);">Score: ${this.profileData.primaryAxis.obstacle.rawScore}/10 | ${this.profileData.primaryAxis.obstacle.volatility}</p>`;
          html += `</div>`;
        }
        if (this.profileData.primaryAxis.domain) {
          html += `<div style="background: rgba(255, 255, 255, 0.8); padding: 1rem; border-radius: var(--radius); border-left: 4px solid #28a745;">`;
          html += `<p style="margin: 0; font-weight: 600; color: #28a745;">Improvement Area: ${this.profileData.primaryAxis.domain.name}</p>`;
          html += `<p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--muted);">Satisfaction: ${this.profileData.primaryAxis.domain.combinedScore.toFixed(1)}/10</p>`;
          html += `</div>`;
        }
        html += `<p style="margin-top: 1rem; font-size: 0.9rem; color: var(--muted); font-style: italic;">Axis valid until: ${new Date(this.profileData.primaryAxis.validUntil).toLocaleDateString()}</p>`;
        html += '</div>';
      }
      
      if (this.profileData.priorities.topObstacles.length > 0) {
        html += '<div style="background: rgba(255, 255, 255, 0.7); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1.5rem; border-left: 4px solid #dc3545;">';
        html += '<h4 style="color: #dc3545; margin-bottom: 1rem; font-size: 1.1rem;">🔥 Currently Active Constraints</h4>';
        html += '<p style="color: var(--muted); margin-bottom: 1rem; font-size: 0.9rem; font-style: italic;">These are currently active constraints, not fixed identity traits.</p>';
        html += '<ul style="margin-left: 1.5rem; line-height: 1.8;">';
        this.profileData.priorities.topObstacles.forEach((obs, index) => {
          const volatilityTag = obs.volatility === 'situationally amplified' 
            ? '<span style="background: rgba(255, 184, 0, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; margin-left: 0.5rem;">Situational</span>'
            : '<span style="background: rgba(211, 47, 47, 0.2); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; margin-left: 0.5rem;">Structural</span>';
          html += `<li style="margin-bottom: 0.5rem;"><strong>${index + 1}. ${obs.name}</strong> - Score: ${obs.rawScore}/10 (Weighted: ${obs.weightedScore.toFixed(1)}) ${volatilityTag}</li>`;
        });
        html += '</ul></div>';
      }
      
      // Show stabilizing domain if all domains are low
      if (this.profileData.priorities.stabilizingDomain) {
        html += '<div style="background: rgba(255, 184, 0, 0.15); border-left: 4px solid var(--accent); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem;">';
        html += '<h4 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.1rem;">⚖️ Stabilizing Domain</h4>';
        html += `<p style="color: var(--muted); margin-bottom: 0.5rem;">When all domains show low satisfaction, start with stabilizing: <strong>${this.profileData.priorities.stabilizingDomain.name}</strong> (${this.profileData.priorities.stabilizingDomain.combinedScore.toFixed(1)}/10)</p>`;
        html += '<p style="color: var(--muted); font-size: 0.9rem; font-style: italic;">Build a supportive baseline before addressing improvement areas.</p>';
        html += '</div>';
      }
      
      if (this.profileData.priorities.topImprovementAreas.length > 0) {
        html += '<div style="background: rgba(255, 255, 255, 0.7); padding: 1.5rem; border-radius: var(--radius); border-left: 4px solid #28a745;">';
        html += '<h4 style="color: #28a745; margin-bottom: 1rem; font-size: 1.1rem;">✨ Areas for Improvement (Lowest Satisfaction)</h4>';
        html += '<ul style="margin-left: 1.5rem; line-height: 1.8;">';
        this.profileData.priorities.topImprovementAreas.forEach((domain, index) => {
          // Dual-read output: opportunity + stabilization
          const isLow = domain.combinedScore < 4;
          const opportunityFraming = isLow 
            ? `<span style="color: #28a745; font-weight: 600;">Growth edge:</span> Significant opportunity for improvement`
            : `<span style="color: var(--brand); font-weight: 600;">Enhancement:</span> Room for refinement`;
          const stabilizationFraming = `<span style="color: var(--muted); font-size: 0.9rem; font-style: italic;">Supportive baseline action: Maintain current strengths while addressing gaps</span>`;
          
          html += `<li style="margin-bottom: 1rem;">
            <strong>${index + 1}. ${domain.name}</strong> - Satisfaction: ${domain.combinedScore.toFixed(1)}/10 (Weighted: ${domain.weightedScore.toFixed(1)})
            <div style="margin-top: 0.5rem; padding-left: 1rem; border-left: 2px solid rgba(0,0,0,0.1);">
              <p style="margin: 0.25rem 0; font-size: 0.9rem;">${opportunityFraming}</p>
              <p style="margin: 0.25rem 0;">${stabilizationFraming}</p>
            </div>
          </li>`;
        });
        html += '</ul></div>';
      }
      
      html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
  }

  startDeeperInquiry() {
    // Hide initial results, show deeper inquiry section
    const resultsSection = document.getElementById('resultsSection');
    const deeperSection = document.getElementById('deeperInquirySection');
    
    if (resultsSection) resultsSection.style.display = 'none';
    if (deeperSection) {
      deeperSection.style.display = 'block';
      this.renderDeeperInquiry();
    }
  }

  backToInitialResults() {
    const resultsSection = document.getElementById('resultsSection');
    const deeperSection = document.getElementById('deeperInquirySection');
    
    if (deeperSection) deeperSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'block';
  }

  renderDeeperInquiry() {
    const container = document.getElementById('deeperInquiryResults');
    if (!container) return;

    let html = '<div class="deeper-inquiry-content">';
    html += '<p style="margin-bottom: 2rem; color: var(--muted); line-height: 1.7;">';
    html += 'The following deeper inquiry questions are designed to help you explore your top priorities more thoroughly. ';
    html += 'These questions will help clarify specific actions, identify support needs, and create strategic action plans.';
    html += '</p>';

    // Top Obstacles - Deeper Inquiry
    if (this.profileData.priorities.topObstacles.length > 0) {
      html += '<h3 style="color: var(--brand); margin-top: 2rem; margin-bottom: 1rem;">Deeper Inquiry: Top Obstacles</h3>';
      
      this.profileData.priorities.topObstacles.forEach((obstacle, index) => {
        const inquiry = DEEPER_INQUIRY.obstacles[obstacle.key];
        if (inquiry) {
          html += `<div style="background: rgba(255, 184, 0, 0.1); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid var(--brand);">`;
          html += `<h4 style="color: var(--brand); margin-bottom: 1rem;">${obstacle.name}</h4>`;
          html += `<p style="color: var(--muted); margin-bottom: 1rem; font-size: 0.95rem;">${obstacle.description}</p>`;
          
          html += '<div style="margin-top: 1.5rem;"><strong style="color: var(--brand);">Reflection Questions:</strong><ul style="margin-top: 0.75rem; margin-left: 1.5rem;">';
          inquiry.questions.forEach(q => {
            html += `<li style="margin-bottom: 0.75rem; line-height: 1.6;">${q}</li>`;
          });
          html += '</ul></div>';

          html += '<div style="margin-top: 1.5rem;"><strong style="color: var(--brand);">Key Action Areas:</strong><ul style="margin-top: 0.75rem; margin-left: 1.5rem;">';
          inquiry.actionAreas.forEach(area => {
            html += `<li style="margin-bottom: 0.5rem; line-height: 1.5;">${area}</li>`;
          });
          html += '</ul></div>';

          html += '</div>';
        }
      });
    }

    // Top Improvement Areas - Deeper Inquiry
    if (this.profileData.priorities.topImprovementAreas.length > 0) {
      html += '<h3 style="color: var(--brand); margin-top: 2rem; margin-bottom: 1rem;">Deeper Inquiry: Areas for Improvement</h3>';
      
      this.profileData.priorities.topImprovementAreas.forEach((domain, index) => {
        const inquiry = DEEPER_INQUIRY.domains[domain.key];
        if (inquiry) {
          html += `<div style="background: rgba(255, 184, 0, 0.1); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 2rem; border-left: 4px solid var(--accent);">`;
          html += `<h4 style="color: var(--brand); margin-bottom: 1rem;">${domain.name}</h4>`;
          html += `<p style="color: var(--muted); margin-bottom: 1rem; font-size: 0.95rem;">Current Satisfaction: ${domain.combinedScore.toFixed(1)}/10</p>`;
          
          html += '<div style="margin-top: 1.5rem;"><strong style="color: var(--brand);">Reflection Questions:</strong><ul style="margin-top: 0.75rem; margin-left: 1.5rem;">';
          inquiry.questions.forEach(q => {
            html += `<li style="margin-bottom: 0.75rem; line-height: 1.6;">${q}</li>`;
          });
          html += '</ul></div>';

          html += '<div style="margin-top: 1.5rem;"><strong style="color: var(--brand);">Key Action Areas:</strong><ul style="margin-top: 0.75rem; margin-left: 1.5rem;">';
          inquiry.actionAreas.forEach(area => {
            html += `<li style="margin-bottom: 0.5rem; line-height: 1.5;">${area}</li>`;
          });
          html += '</ul></div>';

          html += '</div>';
        }
      });
    }

    // Strategic Action Planning
    html += '<h3 style="color: var(--brand); margin-top: 3rem; margin-bottom: 1.5rem;">Strategic Action Planning</h3>';
    html += '<p style="color: var(--muted); margin-bottom: 2rem; line-height: 1.7;">';
    html += 'Based on your priorities, consider these timeframes for action. Start with immediate actions to build momentum, ';
    html += 'then progressively work toward longer-term transformation.';
    html += '</p>';

    Object.entries(ACTION_PLANNING).forEach(([key, plan]) => {
      html += `<div style="background: rgba(255, 255, 255, 0.7); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1.5rem; border: 2px solid var(--accent);">`;
      html += `<h4 style="color: var(--brand); margin-bottom: 0.5rem;">${plan.timeframe}</h4>`;
      html += `<p style="color: var(--muted); margin-bottom: 1rem; font-weight: 600;">${plan.focus}</p>`;
      html += '<ul style="margin-left: 1.5rem;">';
      plan.examples.forEach(example => {
        html += `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${example}</li>`;
      });
      html += '</ul></div>';
    });

    html += '<div style="background: rgba(255, 184, 0, 0.15); padding: 1.5rem; border-radius: var(--radius); margin-top: 2rem; border-left: 4px solid var(--brand);">';
    html += '<h4 style="color: var(--brand); margin-bottom: 0.75rem;">Next Steps</h4>';
    html += '<p style="line-height: 1.7; margin-bottom: 0.75rem;">';
    html += 'Use the reflection questions above to clarify your specific actions. Consider:';
    html += '</p>';
    html += '<ul style="margin-left: 1.5rem; line-height: 1.8;">';
    html += '<li>What is one specific action you can take this week in your top priority area?</li>';
    html += '<li>What support or resources do you need to take this action?</li>';
    html += '<li>What would success look like in 30 days? 90 days? 6 months?</li>';
    html += '<li>How will you track your progress and adjust your approach?</li>';
    html += '</ul>';
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
  }

  exportProfile(format = 'json', includeDeeper = false) {
    // Deployment threshold: require user to select application context
    const deploymentContext = this.getDeploymentContext();
    if (!deploymentContext) {
      this.showDeploymentThreshold();
      return;
    }
    
    // Add deployment context to profile metadata
    this.profileData.coachingProfile.metadata.deploymentContext = deploymentContext;
    
    if (format === 'csv') {
      this.exportCSV();
    } else {
      this.exportJSON();
    }
  }
  
  getDeploymentContext() {
    // Check if deployment context was already selected
    return this.profileData.deploymentContext || null;
  }
  
  showDeploymentThreshold() {
    const container = document.getElementById('profileResults');
    if (!container) return;
    
    const existingContent = container.innerHTML;
    const deploymentHTML = `
      <div style="background: rgba(0, 123, 255, 0.1); border: 3px solid var(--brand); border-radius: var(--radius); padding: 2rem; margin-top: 2rem;">
        <h3 style="color: var(--brand); margin-bottom: 1rem;">Deployment Threshold</h3>
        <p style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Before exporting, select one immediate application context to ground your use:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <button class="btn btn-secondary" onclick="window.coachingEngine.selectDeploymentContext('journaling')" style="padding: 1rem;">📔 Journaling</button>
          <button class="btn btn-secondary" onclick="window.coachingEngine.selectDeploymentContext('weekly-reflection')" style="padding: 1rem;">📅 Weekly Reflection</button>
          <button class="btn btn-secondary" onclick="window.coachingEngine.selectDeploymentContext('decision-audit')" style="padding: 1rem;">⚖️ Decision Audit</button>
          <button class="btn btn-secondary" onclick="window.coachingEngine.selectDeploymentContext('coaching-dialogue')" style="padding: 1rem;">💬 Coaching Dialogue</button>
        </div>
        <p style="color: var(--muted); font-size: 0.9rem; font-style: italic;">This selection helps focus the agent's initial application and prevents abstract deployment.</p>
      </div>
    `;
    
    container.innerHTML = existingContent + deploymentHTML;
  }
  
  selectDeploymentContext(context) {
    this.profileData.deploymentContext = context;
    this.profileData.coachingProfile.metadata.deploymentContext = context;
    this.renderResults(); // Re-render to show export buttons again
  }

  exportJSON() {
    const json = exportJSON(this.profileData, 'coaching', 'Personal Coaching Agent Builder');
    downloadFile(json, `coaching-profile-${Date.now()}.json`, 'application/json');
  }

  exportCSV() {
    // Use shared export utility for consistency, but keep existing detailed CSV format
    const csv = exportForAIAgent(this.profileData, 'coaching', 'Personal Coaching Agent Builder');
    downloadFile(csv, `coaching-profile-${Date.now()}.csv`, 'text/csv');
  }

  exportCSV_legacy() {
    // Legacy detailed CSV export - keeping for reference but using shared utility above
    // Build CSV with comprehensive explanations
    let csv = 'Personal Coaching Agent Profile\n';
    csv += 'Generated: ' + new Date().toISOString() + '\n';
    csv += '\n';
    csv += '=== HOW TO USE THIS DATA ===\n';
    csv += 'This CSV contains your coaching profile data with explanations for how your AI agent should interpret, value, and prioritize the content.\n';
    csv += 'Import this data into your AI platform (ChatGPT, Claude, etc.) and use the "Interpretation Guide" section to configure your agent.\n';
    csv += '\n';
    csv += '=== INTERPRETATION GUIDE ===\n';
    csv += 'Column,Meaning,Priority Weight,Interpretation\n';
    csv += 'Raw Score,Your response on 0-10 scale,Low,Direct user response - use for context\n';
    csv += 'Weighted Score,Score multiplied by importance weight,High,Primary metric for prioritization - higher = more urgent\n';
    csv += 'Priority Level,Calculated priority (High/Moderate/Low),High,Use to determine coaching focus and intervention urgency\n';
    csv += 'Severity/Satisfaction,Interpreted level based on score,Medium,Use to understand user state and adjust tone/approach\n';
    csv += '\n';
    csv += '=== SCORING INTERPRETATION ===\n';
    csv += 'Obstacles: Higher scores = greater obstacles to sovereignty. Weighted scores determine priority.\n';
    csv += 'Domains: Higher scores = greater satisfaction. Lower scores = areas needing improvement.\n';
    csv += 'Priority: Focus coaching on high-priority items first, using weighted scores as the primary guide.\n';
    csv += '\n';

    // Obstacles section
    if (Object.keys(this.profileData.obstacles).length > 0) {
      csv += '=== OBSTACLES TO SOVEREIGNTY ===\n';
      csv += 'Name,Description,Raw Score,Weight,Weighted Score,Priority Level,Severity,Coaching Focus\n';
      
      const sortedObstacles = Object.entries(this.profileData.obstacles)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.weightedScore - a.weightedScore);
      
      sortedObstacles.forEach(obstacle => {
        const severity = obstacle.rawScore >= 7 ? 'High' : obstacle.rawScore >= 4 ? 'Moderate' : 'Low';
        const priority = obstacle.weightedScore >= 8 ? 'High' : obstacle.weightedScore >= 5 ? 'Moderate' : 'Low';
        const focus = obstacle.rawScore >= 7 
          ? 'Urgent - Address immediately with direct coaching support'
          : obstacle.rawScore >= 4 
            ? 'Important - Regular coaching attention and strategies'
            : 'Monitor - Periodic check-ins and awareness';
        
        csv += `"${obstacle.name}","${obstacle.description.replace(/"/g, '""')}",${obstacle.rawScore},${obstacle.weight || 1.0},${obstacle.weightedScore.toFixed(2)},${priority},${severity},"${focus}"\n`;
      });
      csv += '\n';
    }

    // Domains section
    if (Object.keys(this.profileData.domains).length > 0) {
      csv += '=== SATISFACTION DOMAINS ===\n';
      csv += 'Domain,Overall Score,Average Aspect Score,Combined Score,Weight,Weighted Score,Priority Level,Satisfaction Level,Coaching Focus\n';
      
      const sortedDomains = Object.entries(this.profileData.domains)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => a.combinedScore - b.combinedScore);
      
      sortedDomains.forEach(domain => {
        const satisfaction = domain.combinedScore >= 7 ? 'High' : domain.combinedScore >= 4 ? 'Moderate' : 'Low';
        const priority = domain.combinedScore <= 3 ? 'High' : domain.combinedScore <= 5 ? 'Moderate' : 'Low';
        const focus = domain.combinedScore <= 3
          ? 'Urgent - Primary focus for satisfaction improvement'
          : domain.combinedScore <= 5
            ? 'Important - Regular support and goal-setting'
            : 'Maintain - Acknowledge strengths and support maintenance';
        
        csv += `"${domain.name}",${domain.overviewScore},${domain.averageAspectScore.toFixed(2)},${domain.combinedScore.toFixed(2)},${domain.weight || 1.0},${domain.weightedScore.toFixed(2)},${priority},${satisfaction},"${focus}"\n`;
      });
      csv += '\n';

      // Domain aspects detail
      csv += '=== DOMAIN ASPECTS DETAIL ===\n';
      csv += 'Domain,Aspect,Score,Importance\n';
      Object.entries(this.profileData.domains).forEach(([domainKey, domain]) => {
        domain.aspects.forEach(aspect => {
          const importance = aspect.score <= 3 ? 'High' : aspect.score <= 5 ? 'Medium' : 'Low';
          csv += `"${domain.name}","${aspect.name.replace(/"/g, '""')}",${aspect.score},"${importance}"\n`;
        });
      });
      csv += '\n';
    }

    // Priorities summary
    csv += '=== PRIORITY SUMMARY ===\n';
    if (this.profileData.priorities.topObstacles.length > 0) {
      csv += 'Top Obstacles to Address (Highest Priority):\n';
      this.profileData.priorities.topObstacles.forEach((obs, index) => {
        csv += `${index + 1},"${obs.name}",Score: ${obs.rawScore}/10,Weighted: ${obs.weightedScore.toFixed(2)}\n`;
      });
      csv += '\n';
    }
    
    if (this.profileData.priorities.topImprovementAreas.length > 0) {
      csv += 'Top Areas for Improvement (Lowest Satisfaction):\n';
      this.profileData.priorities.topImprovementAreas.forEach((domain, index) => {
        csv += `${index + 1},"${domain.name}",Satisfaction: ${domain.combinedScore.toFixed(1)}/10,Weighted: ${domain.weightedScore.toFixed(2)}\n`;
      });
      csv += '\n';
    }

    // Coaching instructions
    csv += '=== AI AGENT CONFIGURATION INSTRUCTIONS ===\n';
    csv += 'Section,Instruction\n';
    csv += '"System Prompt","Use the coaching profile to understand the user\'s obstacles and satisfaction levels. Focus on sovereignty-aligned support."\n';
    csv += '"Primary Focus","Address top obstacles first (highest weighted scores), then work on improvement areas (lowest satisfaction scores)."\n';
    csv += '"Tone","Adjust tone based on severity: High severity = supportive but direct; Moderate = encouraging with strategies; Low = awareness and maintenance."\n';
    csv += '"Coaching Style","Question-based inquiry that surfaces self-awareness. Honor individual autonomy and authorship. Support without imposing."\n';
    csv += '"Prioritization","Use weighted scores as primary metric. Obstacles with weighted scores ≥8 are urgent. Domains with combined scores ≤3 are high-priority improvement areas."\n';
    csv += '"Response Approach","Focus coaching responses on identified priorities. Acknowledge strengths in high-satisfaction domains. Provide practical strategies for obstacles and improvement areas."\n';
    csv += '\n';

    // Create and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coaching-profile-${Date.now()}.csv`;
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

