// Coaching Engine - Version 2.0
// Manages questionnaire flow, weighting, and profile generation for Life Domain Review
// Enhanced with lazy loading, error handling, and debug reporting

import { loadDataModule, setDebugReporter } from './shared/data-loader.js';
import { createDebugReporter } from './shared/debug-reporter.js';
import { ErrorHandler, DataStore, DOMUtils, SecurityUtils } from './shared/utils.js';
import { exportForAIAgent, exportExecutiveBrief, exportJSON, downloadFile } from './shared/export-utils.js';
import { EngineUIController } from './shared/engine-ui-controller.js';

// Data modules - will be loaded lazily
let SOVEREIGNTY_OBSTACLES, SATISFACTION_DOMAINS;
let SATISFACTION_DOMAIN_EXAMPLES, QUESTION_WEIGHTINGS;
let COACHING_PROMPTS, DEEPER_INQUIRY, ACTION_PLANNING;

/**
 * Coaching Engine - Generates coaching profiles through section-based assessment
 */
export class CoachingEngine {
  /**
   * Initialize the coaching engine
   */
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
      coachingProfile: {},
      primaryAxis: null,
      axisValidUntil: null,
      userWeightAdjustment: 1.0,
      deploymentContext: null
    };
    
    // Initialize debug reporter
    this.debugReporter = createDebugReporter('CoachingEngine');
    setDebugReporter(this.debugReporter);
    this.debugReporter.markInitialized();
    
    // Initialize data store
    this.dataStore = new DataStore('coaching-assessment', '1.0.0');

    this.ui = new EngineUIController({
      idle: {
        show: ['#introSection', '#actionButtonsSection', '#selectionSection'],
        hide: ['#questionnaireSection', '#resultsSection']
      },
      assessment: {
        show: ['#questionnaireSection'],
        hide: ['#introSection', '#actionButtonsSection', '#selectionSection', '#resultsSection']
      },
      results: {
        show: ['#resultsSection'],
        hide: ['#introSection', '#actionButtonsSection', '#selectionSection', '#questionnaireSection']
      }
    });
    
    // Make instance accessible globally for deployment context selection
    window.coachingEngine = this;
    
    this.init();
  }

  /**
   * Initialize the engine
   */
  init() {
    this.renderSectionSelection();
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
   * Load coaching data modules asynchronously
   * @returns {Promise<void>}
   */
  async loadCoachingData() {
    if (SOVEREIGNTY_OBSTACLES && SATISFACTION_DOMAINS && QUESTION_WEIGHTINGS) {
      return; // Already loaded
    }

    try {
      // Load obstacles data
      const obstaclesModule = await loadDataModule(
        './coaching-data/sovereignty-obstacles.js',
        'Sovereignty Obstacles'
      );
      SOVEREIGNTY_OBSTACLES = obstaclesModule.SOVEREIGNTY_OBSTACLES;

      // Load satisfaction domains data
      const domainsModule = await loadDataModule(
        './coaching-data/satisfaction-domains.js',
        'Satisfaction Domains'
      );
      SATISFACTION_DOMAINS = domainsModule.SATISFACTION_DOMAINS;

      // Load examples data
      const examplesModule = await loadDataModule(
        './coaching-data/satisfaction-domain-examples.js',
        'Domain Examples'
      );
      SATISFACTION_DOMAIN_EXAMPLES = examplesModule.SATISFACTION_DOMAIN_EXAMPLES;

      // Load weightings data
      const weightingsModule = await loadDataModule(
        './coaching-data/question-weightings.js',
        'Question Weightings'
      );
      QUESTION_WEIGHTINGS = weightingsModule.QUESTION_WEIGHTINGS;

      // Load prompts data
      const promptsModule = await loadDataModule(
        './coaching-data/coaching-prompts.js',
        'Coaching Prompts'
      );
      COACHING_PROMPTS = promptsModule.COACHING_PROMPTS;

      // Load inquiry data
      const inquiryModule = await loadDataModule(
        './coaching-data/deeper-inquiry.js',
        'Deeper Inquiry'
      );
      DEEPER_INQUIRY = inquiryModule.DEEPER_INQUIRY;
      ACTION_PLANNING = inquiryModule.ACTION_PLANNING;

      this.debugReporter.recordSection('Obstacles', Object.keys(SOVEREIGNTY_OBSTACLES || {}).length);
      this.debugReporter.recordSection('Domains', Object.keys(SATISFACTION_DOMAINS || {}).length);
    } catch (error) {
      this.debugReporter.logError(error, 'loadCoachingData');
      ErrorHandler.showUserError('Failed to load assessment data. Please refresh the page.');
      throw error;
    }
  }

  renderSectionSelection() {
    const grid = document.getElementById('sectionGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Add Obstacles section
    const obstaclesCard = document.createElement('div');
    obstaclesCard.className = 'section-card';
    obstaclesCard.dataset.section = 'obstacles';
    SecurityUtils.safeInnerHTML(obstaclesCard, `
      <h3>15 Obstacles to Sovereignty</h3>
      <p>Identify constraints limiting your freedom, joy, and satisfaction in life. This assessment helps surface hidden and not-so-hidden forces that may be impacting your current state.</p>
    `);
    obstaclesCard.addEventListener('click', () => this.toggleSection('obstacles'));
    grid.appendChild(obstaclesCard);
    
    // Add Satisfaction Domains section
    const domainsCard = document.createElement('div');
    domainsCard.className = 'section-card';
    domainsCard.dataset.section = 'domains';
    SecurityUtils.safeInnerHTML(domainsCard, `
      <h3>10 Satisfaction Domains</h3>
      <p>Evaluate areas of life that determine the depth of your satisfaction. This systematic overview reveals the most impactful domains where action will directly impact your satisfaction.</p>
    `);
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
    
    const exportJSONBtn = document.getElementById('exportProfileJSON');
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener('click', () => this.exportProfile('json'));
    }
    
    const exportCSVBtn = document.getElementById('exportProfileCSV');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportProfile('csv'));
    }

    const exportBriefBtn = document.getElementById('exportExecutiveBrief');
    if (exportBriefBtn) {
      exportBriefBtn.addEventListener('click', () => this.exportExecutiveBrief());
    }
    
    const newAssessmentBtn = document.getElementById('newAssessment');
    if (newAssessmentBtn) {
      newAssessmentBtn.addEventListener('click', () => this.resetAssessment());
    }
    
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => this.clearAllCachedData());
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

  getEmptyProfileData() {
    return {
      timestamp: new Date().toISOString(),
      obstacles: {},
      domains: {},
      weightedScores: {},
      priorities: {},
      coachingProfile: {},
      primaryAxis: null,
      axisValidUntil: null,
      userWeightAdjustment: 1.0,
      deploymentContext: null
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async generateSampleReport() {
    try {
      await this.loadCoachingData();

      this.selectedSections = ['obstacles', 'domains'];
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.questionSequence = [];
      this.profileData = this.getEmptyProfileData();

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
                question: this.generateAspectQuestion(domainKey, aspect, domain.name),
                name: domain.name,
                weight: QUESTION_WEIGHTINGS?.aspect_default || 1.0
              });
            });
          });
        }
      });

      this.questionSequence.forEach(question => {
        this.answers[question.id] = this.getRandomInt(0, 10);
      });

      this.ui.transition('results');
      this.calculateProfile();
      this.renderResults();
      this.saveProgress();
    } catch (error) {
      this.debugReporter.logError(error, 'generateSampleReport');
      ErrorHandler.showUserError('Failed to generate sample report. Please try again.');
    }
  }

  /**
   * Start the assessment with selected sections
   * @returns {Promise<void>}
   */
  async startAssessment() {
    if (this.selectedSections.length === 0) {
      ErrorHandler.showUserError('Please select at least one section to assess.');
      return;
    }
    
    try {
      await this.loadCoachingData();
      
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
              question: this.generateAspectQuestion(domainKey, aspect, domain.name),
              name: domain.name,
              weight: QUESTION_WEIGHTINGS?.aspect_default || 1.0
            });
          });
        });
      }
    });
    
      // Hide selection, show questionnaire
      this.ui.transition('assessment');
      
      this.debugReporter.recordQuestionCount(this.questionSequence.length);
      this.renderCurrentQuestion();
      this.saveProgress();
    } catch (error) {
      this.debugReporter.logError(error, 'startAssessment');
      ErrorHandler.showUserError('Failed to start assessment. Please try again.');
    }
  }

  generateAspectQuestion(domainKey, aspect, domainName) {
    // Generate clearer, more complete questions based on domain and aspect
    const questionTemplates = {
      family: {
        'Time with Family': `When it comes to time spent with your family, how do you feel about how much time you are getting?`,
        'Wisdom and Stories Transferred': `When it comes to your family, how do you feel about the wisdom and stories being passed down between generations?`,
        'Size and Dynamic of Family': `When it comes to your family, how do you feel about the size and dynamic of your family relationships?`,
        'Health of Family Members': `When it comes to your family, how do you feel about the health and well-being of your family members?`,
        'Cultural Harmony': `When it comes to your family, how do you feel about the cultural harmony and shared values?`,
        'Reconciliation of Grievances': `When it comes to your family, how do you feel about the reconciliation and resolution of past grievances?`,
        'Quality of Communication': `When it comes to your family, how do you feel about the quality of communication you have?`,
        'Regularity of Communication': `When it comes to your family, how do you feel about how often you communicate with each other?`
      },
      social_life: {
        'Real Friends (not just acquaintances)': `When it comes to your social life, how do you feel about having real friends (not just acquaintances) in your life?`,
        'Variety of Activities': `When it comes to your social life, how do you feel about the variety of activities you do with others?`,
        'Frequency of Meet-ups': `When it comes to your social life, how do you feel about how often you meet up with friends?`,
        'Confidence in Groups': `When it comes to your social life, how do you feel about your confidence when you're in groups?`,
        'Opportunities to Meet New People (without substance use)': `When it comes to your social life, how do you feel about opportunities to meet new people in healthy ways?`,
        'Time Available for Social Life': `When it comes to your social life, how do you feel about how much time you have available for social activities?`,
        'Intimate Environments (your small, close gatherings)': `When it comes to your social life, how do you feel about intimate environments (small, close gatherings)?`,
        'Public Environments (events, parties, large groups)': `When it comes to your social life, how do you feel about public environments (events, parties, large groups)?`,
        'Diverse Friendships (variety of perspectives, ages, cultures)': `When it comes to your social life, how do you feel about having diverse friendships (variety of perspectives, ages, cultures)?`
      },
      intimate_relationship: {
        'Time Together': `When it comes to your intimate relationship, how do you feel about how much time you spend together?`,
        'Dreams & Desires Prioritized': `When it comes to your intimate relationship, how do you feel about whether your dreams and desires are being prioritized?`,
        'Addressing & Acknowledging Depression & Addiction': `When it comes to your intimate relationship, how do you feel about how depression and addiction are being addressed and acknowledged?`,
        'Non-Violent Communication': `When it comes to your intimate relationship, how do you feel about the quality of communication (non-violent, respectful)?`,
        'Shared/Agreed Upon Roles, Chores, Responsibilities': `When it comes to your intimate relationship, how do you feel about how roles, chores, and responsibilities are shared and agreed upon?`,
        'Relationship Prioritized': `When it comes to your intimate relationship, how do you feel about whether the relationship is being prioritized?`,
        'Emotional Support': `When it comes to your intimate relationship, how do you feel about the emotional support you receive?`,
        'Sexual Satisfaction': `When it comes to your intimate relationship, how do you feel about your sexual satisfaction?`,
        'Emotional Intimacy (depth of connection)': `When it comes to your intimate relationship, how do you feel about the depth of emotional intimacy and connection?`,
        'Space & Boundaries (respecting autonomy)': `When it comes to your intimate relationship, how do you feel about having space and boundaries that respect your autonomy?`
      },
      growth_learning_spirituality: {
        'Stimulation (Reading, Lectures, Audio-books)': `When it comes to growth, learning, and spirituality, how do you feel about the intellectual stimulation you get (reading, lectures, audio-books)?`,
        'Contemplation & Discussion (not entertainment-focused)': `When it comes to growth, learning, and spirituality, how do you feel about opportunities for contemplation and meaningful discussion?`,
        'Attempting New Things around Others': `When it comes to growth, learning, and spirituality, how do you feel about opportunities to attempt new things around others?`,
        'Access to \'Sacred\' Space (other than bedroom)': `When it comes to growth, learning, and spirituality, how do you feel about having access to sacred or contemplative space?`,
        'Communion with Others in Shared Focus': `When it comes to growth, learning, and spirituality, how do you feel about opportunities for communion with others in shared focus?`,
        'Exploration of the Natural World': `When it comes to growth, learning, and spirituality, how do you feel about opportunities to explore the natural world?`,
        'Awareness, Comfort & Stability of Internal World': `When it comes to growth, learning, and spirituality, how do you feel about your awareness, comfort, and stability in your internal world?`,
        'Confidence & Inclination for Challenge': `When it comes to growth, learning, and spirituality, how do you feel about your confidence and inclination to take on challenges?`,
        'Creativity & Self-Initiated Learning (drive to explore without external pressure)': `When it comes to growth, learning, and spirituality, how do you feel about your creativity and self-initiated learning (drive to explore without external pressure)?`
      },
      freedom_passions_creativity: {
        'Totally Free Time without Responsibility & Expectations': `When it comes to freedom, passions, and creativity, how do you feel about having totally free time without responsibilities and expectations?`,
        'Excitability & Enthusiasm (not reluctant or resigned)': `When it comes to freedom, passions, and creativity, how do you feel about your excitability and enthusiasm (not feeling reluctant or resigned)?`,
        'Comfort Holding Eye-Contact': `When it comes to freedom, passions, and creativity, how do you feel about your comfort holding eye contact with others?`,
        'Pride in Activity & Accomplishment': `When it comes to freedom, passions, and creativity, how do you feel about your pride in your activities and accomplishments?`,
        'Hobbies': `When it comes to freedom, passions, and creativity, how do you feel about your hobbies?`,
        'Art': `When it comes to freedom, passions, and creativity, how do you feel about your engagement with art?`,
        'Authenticity (not concealing, faking, or pretending)': `When it comes to freedom, passions, and creativity, how do you feel about your ability to be authentic (not concealing, faking, or pretending)?`,
        'Confidence, Flow': `When it comes to freedom, passions, and creativity, how do you feel about your confidence and ability to experience flow?`,
        'Risk-taking in Expression (pushing creative boundaries)': `When it comes to freedom, passions, and creativity, how do you feel about taking risks in expression (pushing creative boundaries)?`
      },
      work_life_balance: {
        'Service, Products, Offerings': `When it comes to work-life balance, how do you feel about the service, products, or offerings you provide?`,
        'Pricing': `When it comes to work-life balance, how do you feel about your pricing?`,
        'Confident Communication & Embodiment': `When it comes to work-life balance, how do you feel about your confident communication and embodiment in your work?`,
        'Advertising, Sales, Promotion': `When it comes to work-life balance, how do you feel about your advertising, sales, and promotion?`,
        'Client Care': `When it comes to work-life balance, how do you feel about your client care?`,
        'Industry/Business Relations': `When it comes to work-life balance, how do you feel about your industry and business relations?`,
        'Organization, Discipline, Scheduling': `When it comes to work-life balance, how do you feel about your organization, discipline, and scheduling?`,
        'Bookkeeping': `When it comes to work-life balance, how do you feel about your bookkeeping and financial management?`,
        'Delegation & Support Systems (ability to rely on others)': `When it comes to work-life balance, how do you feel about your ability to delegate and rely on support systems?`
      },
      mental_health: {
        'Meaningfulness in Daily Life': `When it comes to mental health, how do you feel about the meaningfulness in your daily life?`,
        'Sleep Routine': `When it comes to mental health, how do you feel about your sleep routine?`,
        'Clean Diet': `When it comes to mental health, how do you feel about your diet?`,
        'Regular Exercise': `When it comes to mental health, how do you feel about your regular exercise?`,
        'Time with the Natural World': `When it comes to mental health, how do you feel about how much time you spend with the natural world?`,
        'Time with Others': `When it comes to mental health, how do you feel about how much time you spend with others?`,
        'Emotional Integration & Expression': `When it comes to mental health, how do you feel about your emotional integration and expression?`,
        'Clarity on Your Patterns & Strategy for Managing': `When it comes to mental health, how do you feel about your clarity on your patterns and strategies for managing them?`,
        'Support Systems (therapy, counselling, or peer support)': `When it comes to mental health, how do you feel about your support systems (therapy, counselling, or peer support)?`
      },
      physical_health: {
        'Hygiene': `When it comes to physical health, how do you feel about your hygiene?`,
        'Optimal Rest': `When it comes to physical health, how do you feel about getting optimal rest?`,
        'Optimal Diet & Hydration': `When it comes to physical health, how do you feel about your diet and hydration?`,
        'Air Quality & Breathing': `When it comes to physical health, how do you feel about the air quality and your breathing?`,
        'Strength Training & Regular Exercise': `When it comes to physical health, how do you feel about your strength training and regular exercise?`,
        'Structure, Alignment, Technique': `When it comes to physical health, how do you feel about your body structure, alignment, and movement technique?`,
        'Flexibility, Stretching, Freedom from Tightness or Stiffness': `When it comes to physical health, how do you feel about your flexibility, stretching, and freedom from tightness or stiffness?`,
        'Optimal Tech Interfacing, Eye Health, Avoiding RSI': `When it comes to physical health, how do you feel about your tech use, eye health, and avoiding repetitive strain?`,
        'Mobility (freedom of movement, absence of chronic pain)': `When it comes to physical health, how do you feel about your mobility (freedom of movement, absence of chronic pain)?`
      },
      emotional_health: {
        'Emotional Intensity (ability to feel deeply and openly)': `When it comes to emotional health, how do you feel about your emotional intensity (ability to feel deeply and openly)?`,
        'Capacity for Forgiveness': `When it comes to emotional health, how do you feel about your capacity for forgiveness?`,
        'Self-Compassion': `When it comes to emotional health, how do you feel about your self-compassion?`,
        'Navigating Conflict': `When it comes to emotional health, how do you feel about how you navigate conflict?`,
        'Resilience in Stressful Situations': `When it comes to emotional health, how do you feel about your resilience in stressful situations?`,
        'Intimacy & Connection': `When it comes to emotional health, how do you feel about your intimacy and connection with others?`,
        'Recognition of Unmet Emotional Needs': `When it comes to emotional health, how do you feel about your recognition of unmet emotional needs?`,
        'Balance between Emotional Expression and Rational Thought': `When it comes to emotional health, how do you feel about the balance between your emotional expression and rational thought?`
      },
      environmental: {
        'Organization & Cleanliness of Living Space': `When it comes to your environment and living space, how do you feel about the organization and cleanliness of your living space?`,
        'Access to Nature or Green Spaces': `When it comes to your environment and living space, how do you feel about your access to nature or green spaces?`,
        'Personal Space (free from clutter, chaos)': `When it comes to your environment and living space, how do you feel about having personal space (free from clutter and chaos)?`,
        'Light, Air Quality, and Temperature Control': `When it comes to your environment and living space, how do you feel about the light, air quality, and temperature control?`,
        'Space to Practice Hobbies/Creativity': `When it comes to your environment and living space, how do you feel about having space to practice hobbies and creativity?`,
        'Workspace Comfort (ergonomics, aesthetics)': `When it comes to your environment and living space, how do you feel about your workspace comfort (ergonomics, aesthetics)?`,
        'Connection to Community': `When it comes to your environment and living space, how do you feel about your connection to community?`,
        'Sense of Security and Safety in Environment': `When it comes to your environment and living space, how do you feel about your sense of security and safety in your environment?`
      }
    };
    
    // Check if we have a specific template for this domain and aspect
    if (questionTemplates[domainKey] && questionTemplates[domainKey][aspect]) {
      return questionTemplates[domainKey][aspect];
    }
    
    // Fallback: Generate a clearer question using the domain name and aspect
    const aspectLower = aspect.toLowerCase();
    if (aspectLower.includes('time') || aspectLower.includes('how much')) {
      return `When it comes to ${domainName.toLowerCase()}, how do you feel about ${aspectLower}?`;
    } else if (aspectLower.includes('quality') || aspectLower.includes('how well')) {
      return `When it comes to ${domainName.toLowerCase()}, how do you feel about the quality of ${aspectLower}?`;
    } else {
      return `When it comes to ${domainName.toLowerCase()}, how do you feel about ${aspectLower}?`;
    }
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
    
    SecurityUtils.safeInnerHTML(container, `
      <div class="question-block">
        <h3>${SecurityUtils.sanitizeHTML(questionText || '')}</h3>
        ${description ? `<p class="description">${SecurityUtils.sanitizeHTML(description || '')}</p>` : ''}
        ${example ? `<p>${SecurityUtils.sanitizeHTML(example || '')}</p>` : ''}
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
        <div>
          <strong>Tip:</strong> ${isObstacle ? 'Higher scores indicate greater obstacles to sovereignty.' : 'Higher scores indicate greater satisfaction in this area.'}
        </div>
      </div>
    `);
    
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
    this.ui.transition('results');
    
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
    html += '<h3>Greatest Impact Focus</h3>';
    html += '<p>You have lightly combed over the scope of human life. To become more satisfied, start at the weakest link first.</p>';
    
    if (this.profileData.priorities.topImprovementAreas.length > 0) {
      html += '<h4>Lowest Satisfaction Domains</h4>';
      html += '<p>These domains show the greatest dissatisfaction and offer the highest leverage when addressed.</p>';
      html += '<div>';
      this.profileData.priorities.topImprovementAreas.forEach((domain, index) => {
        const aspectScores = Array.isArray(domain.aspects) ? [...domain.aspects] : [];
        const lowestAspects = aspectScores
          .sort((a, b) => (a.score || 0) - (b.score || 0))
          .slice(0, 2)
          .map(aspect => SecurityUtils.sanitizeHTML(aspect.name || ''));
        const aspectText = lowestAspects.length
          ? `Start with: ${lowestAspects.join(' • ')}`
          : 'Start with one concrete action that improves day-to-day stability in this domain.';
        html += `
          <div class="domain-item">
            <strong>${index + 1}. ${SecurityUtils.sanitizeHTML(domain.name || '')}</strong>
            <p>${aspectText}</p>
            <p>Suggested first step: choose one micro‑change you can repeat weekly and build consistency around it.</p>
          </div>
        `;
      });
      html += '</div>';
    }
    
    if (this.profileData.priorities.stabilizingDomain) {
      html += `
        <div class="domain-item">
          <strong>Stabilizing Domain: ${SecurityUtils.sanitizeHTML(this.profileData.priorities.stabilizingDomain.name || '')}</strong>
          <p>When all domains are low, stabilize here first to rebuild a functional baseline.</p>
        </div>
      `;
    }
    
    html += '<p>Reminder: this was a broad scan. Aim for the weakest link first, then iterate.</p>';
    html += '</div>';

    // Full ratings disclosure (collapsed)
    html += '<details class="profile-summary" style="margin-top: 1.5rem;">';
    html += '<summary><strong>Full ratings (optional)</strong></summary>';
    html += '<div style="margin-top: 1rem;">';
    
    if (Object.keys(this.profileData.obstacles).length > 0) {
      html += '<h4>Obstacles to Sovereignty</h4>';
      const sortedObstacles = Object.entries(this.profileData.obstacles)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.weightedScore - a.weightedScore);
      sortedObstacles.forEach(obstacle => {
        const severity = obstacle.rawScore >= 7 ? 'High' : obstacle.rawScore >= 4 ? 'Moderate' : 'Low';
        html += `
          <div class="obstacle-item">
            <strong>${SecurityUtils.sanitizeHTML(obstacle.name || '')}</strong> - Score: ${obstacle.rawScore}/10 (${severity})
            <p">${SecurityUtils.sanitizeHTML(obstacle.description || '')}</p>
          </div>
        `;
      });
    }
    
    if (Object.keys(this.profileData.domains).length > 0) {
      html += '<h4>Satisfaction Domains</h4>';
      const sortedDomains = Object.entries(this.profileData.domains)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.combinedScore - a.combinedScore);
      sortedDomains.forEach(domain => {
        const satisfaction = domain.combinedScore >= 7 ? 'High' : domain.combinedScore >= 4 ? 'Moderate' : 'Low';
        html += `
          <div class="domain-item">
            <strong>${SecurityUtils.sanitizeHTML(domain.name || '')}</strong> - Satisfaction: ${domain.combinedScore.toFixed(1)}/10 (${satisfaction})
            <p>Overall: ${domain.overviewScore}/10 | Average Aspects: ${domain.averageAspectScore.toFixed(1)}/10</p>
          </div>
        `;
      });
    }
    
    html += '</div></details>';
    
    // Add weight provenance declaration
    html += '<div>';
    html += '<p><strong>Weight Provenance:</strong> Weights reflect Sovereign of Mind prioritization logic. They encode framework values, not universal truths.</p>';
    if (this.profileData.userWeightAdjustment !== 1.0) {
      html += `<p>User weight adjustment applied: ${(this.profileData.userWeightAdjustment * 100).toFixed(0)}%</p>`;
    }
    html += '</div>';
    
    // Clear closure statement
    html += this.getClosureSection();
    
    // Sanitize HTML before rendering - all dynamic content is already sanitized above
    SecurityUtils.safeInnerHTML(container, html);
  }
  
  getClosureSection() {
    return `
      <div>
        <h3>Orientation → Selection → Application</h3>
        <div>
          <p>This coaching profile is complete. You have received a map of your current constraints and satisfaction domains, along with a primary coaching axis.</p>
          <div>
            <p><strong class="error-text">Exit Cue:</strong> Do not re-run this assessment immediately. Apply the primary axis for 30 days, then reassess if needed. This profile serves orientation—return to lived action.</p>
          </div>
          <div>
            <p><strong>What this engine is not:</strong> Therapy replacement, diagnosis, or truth oracle. This is a self-inquiry tool for sovereignty support.</p>
          </div>
        </div>
      </div>
    `;
  }

  startDeeperInquiry() {
    // Hide initial results, show deeper inquiry section
    const resultsSection = document.getElementById('resultsSection');
    const deeperSection = document.getElementById('deeperInquirySection');
    
    if (resultsSection) resultsSection.classList.add('hidden');
    if (deeperSection) {
      deeperSection.classList.remove('hidden');
      this.renderDeeperInquiry();
    }
  }

  backToInitialResults() {
    const resultsSection = document.getElementById('resultsSection');
    const deeperSection = document.getElementById('deeperInquirySection');
    
    if (deeperSection) deeperSection.classList.add('hidden');
    if (resultsSection) resultsSection.classList.remove('hidden');
  }

  renderDeeperInquiry() {
    const container = document.getElementById('deeperInquiryResults');
    if (!container) return;

    let html = '<div class="deeper-inquiry-content">';
    html += '<p>';
    html += 'The following deeper inquiry questions are designed to help you explore your top priorities more thoroughly. ';
    html += 'These questions will help clarify specific actions, identify support needs, and create strategic action plans.';
    html += '</p>';

    // Top Obstacles - Deeper Inquiry
    if (this.profileData.priorities.topObstacles.length > 0) {
      html += '<h3>Deeper Inquiry: Top Obstacles</h3>';
      
      this.profileData.priorities.topObstacles.forEach((obstacle, index) => {
        const inquiry = DEEPER_INQUIRY.obstacles[obstacle.key];
        if (inquiry) {
          html += `<div class="info-box panel-brand-left">`;
          html += `<h4>${SecurityUtils.sanitizeHTML(obstacle.name || '')}</h4>`;
          html += `<p>${SecurityUtils.sanitizeHTML(obstacle.description || '')}</p>`;
          
          html += '<div class="reflection-section"><strong>Reflection Questions:</strong><ul>';
          inquiry.questions.forEach(q => {
            html += `<li>${q}</li>`;
          });
          html += '</ul></div>';

          html += '<div class="reflection-section"><strong>Key Action Areas:</strong><ul>';
          inquiry.actionAreas.forEach(area => {
            html += `<li>${area}</li>`;
          });
          html += '</ul></div>';

          html += '</div>';
        }
      });
    }

    // Top Improvement Areas - Deeper Inquiry
    if (this.profileData.priorities.topImprovementAreas.length > 0) {
      html += '<h3 class="section-title">Deeper Inquiry: Areas for Improvement</h3>';
      
      this.profileData.priorities.topImprovementAreas.forEach((domain, index) => {
        const inquiry = DEEPER_INQUIRY.domains[domain.key];
        if (inquiry) {
          html += `<div class="info-box info-box-accent panel-brand-left">`;
          html += `<h4>${SecurityUtils.sanitizeHTML(domain.name || '')}</h4>`;
          html += `<p>Current Satisfaction: ${domain.combinedScore.toFixed(1)}/10</p>`;
          
          html += '<div class="reflection-section"><strong>Reflection Questions:</strong><ul>';
          inquiry.questions.forEach(q => {
            html += `<li>${q}</li>`;
          });
          html += '</ul></div>';

          html += '<div class="reflection-section"><strong>Key Action Areas:</strong><ul>';
          inquiry.actionAreas.forEach(area => {
            html += `<li>${area}</li>`;
          });
          html += '</ul></div>';

          html += '</div>';
        }
      });
    }

    // Strategic Action Planning
    html += '<h3 class="section-title">Strategic Action Planning</h3>';
    html += '<p class="content-section">';
    html += 'Based on your priorities, consider these timeframes for action. Start with immediate actions to build momentum, ';
    html += 'then progressively work toward longer-term transformation.';
    html += '</p>';

    Object.entries(ACTION_PLANNING).forEach(([key, plan]) => {
      html += '<div class="action-plan-card panel-outline-accent">';
      html += `<h4 class="action-plan-heading">${plan.timeframe}</h4>`;
      html += `<p class="action-plan-focus">${plan.focus}</p>`;
      html += '<ul class="action-plan-list">';
      plan.examples.forEach(example => {
        html += `<li>${example}</li>`;
      });
      html += '</ul></div>';
    });

    html += '<div class="next-steps-card panel-brand-left">';
    html += '<h4>Next Steps</h4>';
    html += '<p class="next-steps-intro">';
    html += 'Use the reflection questions above to clarify your specific actions. Consider:';
    html += '</p>';
    html += '<ul>';
    html += '<li>What is one specific action you can take this week in your top priority area?</li>';
    html += '<li>What support or resources do you need to take this action?</li>';
    html += '<li>What would success look like in 30 days? 90 days? 6 months?</li>';
    html += '<li>How will you track your progress and adjust your approach?</li>';
    html += '</ul>';
    html += '</div>';

    html += '</div>';
    // Sanitize HTML before rendering - all dynamic content is already sanitized above
    SecurityUtils.safeInnerHTML(container, html);
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
      <div class="deployment-threshold panel-outline-brand">
        <h3>Deployment Threshold</h3>
        <p class="deployment-intro">Before exporting, select one immediate application context to ground your use:</p>
        <div class="deployment-options">
          <button class="btn btn-secondary deployment-option" onclick="window.coachingEngine.selectDeploymentContext('journaling')">📔 Journaling</button>
          <button class="btn btn-secondary deployment-option" onclick="window.coachingEngine.selectDeploymentContext('weekly-reflection')">📅 Weekly Reflection</button>
          <button class="btn btn-secondary deployment-option" onclick="window.coachingEngine.selectDeploymentContext('decision-audit')">⚖️ Decision Audit</button>
          <button class="btn btn-secondary deployment-option" onclick="window.coachingEngine.selectDeploymentContext('coaching-dialogue')">💬 Coaching Dialogue</button>
        </div>
        <p>This selection helps focus the agent's initial application and prevents abstract deployment.</p>
      </div>
    `;
    
    // existingContent is already sanitized, deploymentHTML is sanitized above
    SecurityUtils.safeInnerHTML(container, existingContent + deploymentHTML);
  }
  
  selectDeploymentContext(context) {
    this.profileData.deploymentContext = context;
    this.profileData.coachingProfile.metadata.deploymentContext = context;
    this.renderResults(); // Re-render to show export buttons again
  }

  exportJSON() {
    const json = exportJSON(this.profileData, 'life-domain-review', 'Life Domain Review');
    downloadFile(json, `coaching-profile-${Date.now()}.json`, 'application/json');
  }

  exportCSV() {
    // Use shared export utility for consistency, but keep existing detailed CSV format
    const csv = exportForAIAgent(this.profileData, 'life-domain-review', 'Life Domain Review');
    downloadFile(csv, `coaching-profile-${Date.now()}.csv`, 'text/csv');
  }

  exportExecutiveBrief() {
    const brief = exportExecutiveBrief(this.profileData, 'life-domain-review', 'Life Domain Review');
    downloadFile(brief, `coaching-executive-brief-${Date.now()}.txt`, 'text/plain');
  }

  exportCSV_legacy() {
    // Legacy detailed CSV export - keeping for reference but using shared utility above
    // Build CSV with comprehensive explanations
    let csv = 'Life Domain Review Profile\n';
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

  /**
   * Save assessment progress to storage
   */
  saveProgress() {
    try {
      const progressData = {
        selectedSections: this.selectedSections,
        currentQuestionIndex: this.currentQuestionIndex,
        answers: this.answers,
        profileData: this.profileData,
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

      this.selectedSections = data.selectedSections || [];
      this.currentQuestionIndex = data.currentQuestionIndex || 0;
      this.answers = data.answers || {};
      this.profileData = data.profileData || this.profileData;
      
      // Restore section selections
      this.selectedSections.forEach(sectionId => {
        const card = document.querySelector(`[data-section="${sectionId}"]`);
        if (card) card.classList.add('selected');
      });
      
      if (this.selectedSections.length > 0) {
        const startBtn = document.getElementById('startAssessment');
        if (startBtn) startBtn.disabled = false;
      }
      
      // If in progress, rebuild question sequence and restore questionnaire state
      if (this.currentQuestionIndex > 0 && this.selectedSections.length > 0) {
        await this.loadCoachingData(); // Ensure data is loaded
        
        // Rebuild question sequence (same logic as startAssessment)
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
                  question: this.generateAspectQuestion(domainKey, aspect, domain.name),
                  name: domain.name,
                  weight: QUESTION_WEIGHTINGS?.aspect_default || 1.0
                });
              });
            });
          }
        });
        
        const sectionSelection = document.getElementById('sectionSelection');
        const selectionSection = document.getElementById('selectionSection');
        const questionnaireSection = document.getElementById('questionnaireSection');
        if (sectionSelection) sectionSelection.classList.add('hidden');
        if (selectionSection) selectionSection.classList.add('hidden');
        if (questionnaireSection) questionnaireSection.classList.add('active');
        this.renderCurrentQuestion();
      }
    } catch (error) {
      this.debugReporter.logError(error, 'loadStoredData');
      ErrorHandler.showUserError('Failed to load saved progress.');
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
    document.getElementById('sectionSelection').classList.remove('hidden');
    document.getElementById('selectionSection')?.classList.remove('hidden');
    this.ui.transition('idle');
    
    this.renderSectionSelection();
    document.getElementById('startAssessment').disabled = true;
  }
}

// Note: Engine is initialized explicitly in coaching.html to avoid conflicts

