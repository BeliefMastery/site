// Needs Dependency Loop Determinator Engine
// Based on Chapter 5: Needs and Beliefs from Belief Mastery
// Expanded with BM-Appendix1.html (Patterns Compendium) and BM-Appendix2.html (Reference Tables)
// Identifies dependency loops through needs, vices, patterns, compulsions, and aversions assessment

import { NEEDS_VOCABULARY } from './needs-dependency-data/needs-vocabulary.js';
import { VICES_VOCABULARY } from './needs-dependency-data/vices-vocabulary.js';
import { DEPENDENCY_LOOP_QUESTIONS } from './needs-dependency-data/dependency-loop-questions.js';
import { PATTERN_NEEDS_MAPPING } from './needs-dependency-data/pattern-needs-mapping.js';
import { NEED_COMPULSION_AVERSION_MAPPING } from './needs-dependency-data/need-compulsion-aversion-mapping.js';
import { VICE_NEEDS_MAPPING } from './needs-dependency-data/vice-needs-mapping.js';
import { PATTERNS_COMPENDIUM } from './needs-dependency-data/patterns-compendium.js';
import { NEEDS_GLOSSARY } from './needs-dependency-data/needs-glossary.js';
import { VICES_GLOSSARY } from './needs-dependency-data/vices-glossary.js';
import { exportForAIAgent, exportJSON, downloadFile } from './shared/export-utils.js';

class NeedsDependencyEngine {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.questionSequence = [];
    this.analysisData = {
      timestamp: new Date().toISOString(),
      surfaceExperiences: {},
      needs: {},
      vices: {},
      dependencyPatterns: {},
      identifiedLoops: [],
      primaryLoop: null,
      recommendations: [],
      // Expanded analysis data from Appendices 1 & 2
      patterns: {},
      patternMatches: [],
      compulsions: {},
      aversions: {},
      triggers: {},
      viceNeedMappings: {},
      needCompulsionAversionMappings: {},
      patternNeedsMappings: {}
    };
    
    this.init();
  }

  init() {
    this.buildQuestionSequence();
    this.attachEventListeners();
    this.loadStoredData();
  }

  buildQuestionSequence() {
    this.questionSequence = [];
    
    // Add surface experience questions
    DEPENDENCY_LOOP_QUESTIONS.surfaceExperience.forEach(q => {
      this.questionSequence.push({
        ...q,
        stage: 'surface'
      });
    });
    
    // Add need identification questions
    DEPENDENCY_LOOP_QUESTIONS.needIdentification.forEach(q => {
      this.questionSequence.push({
        ...q,
        stage: 'need'
      });
    });
    
    // Add vice identification questions
    DEPENDENCY_LOOP_QUESTIONS.viceIdentification.forEach(q => {
      this.questionSequence.push({
        ...q,
        stage: 'vice'
      });
    });
    
    // Add dependency pattern questions
    DEPENDENCY_LOOP_QUESTIONS.dependencyPatterns.forEach(q => {
      this.questionSequence.push({
        ...q,
        stage: 'dependency'
      });
    });
    
    // Shuffle questions within each stage to reduce pattern priming
    this.shuffleByStage();
  }

  shuffleByStage() {
    const stages = ['surface', 'need', 'vice', 'dependency'];
    const shuffled = [];
    
    stages.forEach(stage => {
      const stageQuestions = this.questionSequence.filter(q => q.stage === stage);
      stageQuestions.sort(() => Math.random() - 0.5);
      shuffled.push(...stageQuestions);
    });
    
    this.questionSequence = shuffled;
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
    document.getElementById('introSection').style.display = 'none';
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
    
    container.innerHTML = `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.questionSequence.length}</span>
          <span class="question-stage">${this.getStageLabel(question.stage)}</span>
        </div>
        <h3 class="question-text">${question.question}</h3>
        <div class="scale-container">
          <div class="scale-input">
            <input 
              type="range" 
              id="questionInput" 
              data-question-id="${question.id}"
              min="0" 
              max="10" 
              step="1"
              value="${this.answers[question.id] || 5}"
            />
          </div>
          <div class="scale-value" id="scaleValue">${this.answers[question.id] || 5}</div>
        </div>
        <div class="scale-labels">
          <span>Not at all / Never (0-2)</span>
          <span>Moderately / Sometimes (5-6)</span>
          <span>Extremely / Always (9-10)</span>
        </div>
      </div>
    `;
    
    const slider = document.getElementById('questionInput');
    const valueDisplay = document.getElementById('scaleValue');
    
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        valueDisplay.textContent = value;
        this.answers[question.id] = value;
        this.saveProgress();
      });
      
      if (this.answers[question.id] !== undefined) {
        slider.value = this.answers[question.id];
        valueDisplay.textContent = this.answers[question.id];
      }
    }
    
    this.updateProgress();
    this.updateNavigationButtons();
  }

  getStageLabel(stage) {
    const labels = {
      'surface': 'Surface Experience',
      'need': 'Need Identification',
      'vice': 'Vice Identification',
      'dependency': 'Dependency Pattern'
    };
    return labels[stage] || stage;
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
    // Map answers to needs and vices
    this.mapToNeedsAndVices();
    
    // Identify patterns (from Appendix 1)
    this.identifyPatterns();
    
    // Map compulsions and aversions (from Appendix 2)
    this.mapCompulsionsAndAversions();
    
    // Map vice-need relationships (from Appendix 2)
    this.mapViceNeedRelationships();
    
    // Map pattern-needs relationships (from Appendix 2)
    this.mapPatternNeedsRelationships();
    
    // Identify dependency loops
    this.identifyDependencyLoops();
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Include all raw answers and question sequence for export
    this.analysisData.allAnswers = { ...this.answers };
    this.analysisData.questionSequence = this.questionSequence.map(q => ({
      id: q.id,
      question: q.question,
      category: q.category,
      stage: q.stage,
      mapsToNeed: q.mapsToNeed || [],
      mapsToVice: q.mapsToVice || []
    }));
    
    // Hide questionnaire, show results
    document.getElementById('questionnaireSection').classList.remove('active');
    document.getElementById('resultsSection').classList.add('active');
    
    this.renderResults();
    this.saveProgress();
  }

  mapToNeedsAndVices() {
    // Process each question and map to needs/vices
    this.questionSequence.forEach(question => {
      const answer = this.answers[question.id] || 0;
      
      if (answer >= 4) { // Threshold for significant presence
        // Map to needs
        if (question.mapsToNeed && question.mapsToNeed.length > 0) {
          question.mapsToNeed.forEach(need => {
            if (!this.analysisData.needs[need]) {
              this.analysisData.needs[need] = {
                name: need,
                score: 0,
                questionCount: 0,
                questions: []
              };
            }
            this.analysisData.needs[need].score += answer;
            this.analysisData.needs[need].questionCount++;
            this.analysisData.needs[need].questions.push(question.id);
          });
        }
        
        // Map to vices
        if (question.mapsToVice && question.mapsToVice.length > 0) {
          question.mapsToVice.forEach(vice => {
            if (!this.analysisData.vices[vice]) {
              this.analysisData.vices[vice] = {
                name: vice,
                score: 0,
                questionCount: 0,
                questions: []
              };
            }
            this.analysisData.vices[vice].score += answer;
            this.analysisData.vices[vice].questionCount++;
            this.analysisData.vices[vice].questions.push(question.id);
          });
        }
      }
    });
    
    // Calculate average scores for needs and vices
    Object.keys(this.analysisData.needs).forEach(need => {
      const data = this.analysisData.needs[need];
      data.averageScore = data.questionCount > 0 ? data.score / data.questionCount : 0;
    });
    
    Object.keys(this.analysisData.vices).forEach(vice => {
      const data = this.analysisData.vices[vice];
      data.averageScore = data.questionCount > 0 ? data.score / data.questionCount : 0;
    });
  }

  identifyDependencyLoops() {
    // Identify loops based on the examples from Chapter 5
    // Example 1: From Conflict to Nourishment
    // Example 2: From Withdrawal to Expression
    
    const highNeeds = Object.entries(this.analysisData.needs)
      .filter(([key, data]) => data.averageScore >= 6)
      .sort((a, b) => b[1].averageScore - a[1].averageScore);
    
    const highVices = Object.entries(this.analysisData.vices)
      .filter(([key, data]) => data.averageScore >= 6)
      .sort((a, b) => b[1].averageScore - a[1].averageScore);
    
    // Build dependency chains
    const loops = [];
    
    // Check for common loop patterns
    // Pattern 1: Surface -> Need -> Deeper Need -> Root Need
    const surfaceQuestions = this.questionSequence.filter(q => q.stage === 'surface');
    surfaceQuestions.forEach(surfaceQ => {
      const surfaceAnswer = this.answers[surfaceQ.id] || 0;
      if (surfaceAnswer >= 6) {
        // Find connected needs
        const connectedNeeds = this.findConnectedNeeds(surfaceQ);
        if (connectedNeeds.length > 0) {
          const loop = {
            id: `loop_${loops.length + 1}`,
            surfaceExperience: surfaceQ.question,
            surfaceScore: surfaceAnswer,
            needsChain: connectedNeeds,
            vices: this.findRelatedVices(surfaceQ),
            strength: this.calculateLoopStrength(surfaceAnswer, connectedNeeds),
            type: 'surface_to_needs'
          };
          loops.push(loop);
        }
      }
    });
    
    // Pattern 2: Vice -> Need -> Dependency
    highVices.forEach(([viceKey, viceData]) => {
      const relatedNeeds = this.findNeedsForVice(viceKey);
      if (relatedNeeds.length > 0) {
        const loop = {
          id: `loop_${loops.length + 1}`,
          vice: viceData.name,
          viceScore: viceData.averageScore,
          needsChain: relatedNeeds,
          dependencyPatterns: this.findDependencyPatterns(relatedNeeds),
          strength: this.calculateLoopStrength(viceData.averageScore, relatedNeeds),
          type: 'vice_to_needs'
        };
        loops.push(loop);
      }
    });
    
    // Sort loops by strength
    loops.sort((a, b) => b.strength - a.strength);
    
    this.analysisData.identifiedLoops = loops;
    this.analysisData.primaryLoop = loops.length > 0 ? loops[0] : null;
  }

  findConnectedNeeds(surfaceQuestion) {
    const connected = [];
    const surfaceNeeds = surfaceQuestion.mapsToNeed || [];
    
    surfaceNeeds.forEach(need => {
      const needData = this.analysisData.needs[need];
      if (needData && needData.averageScore >= 5) {
        connected.push({
          need: need,
          score: needData.averageScore,
          category: this.getNeedCategory(need)
        });
        
        // Find deeper needs (needs that might be upstream)
        const deeperNeeds = this.findDeeperNeeds(need);
        connected.push(...deeperNeeds);
      }
    });
    
    return connected.sort((a, b) => b.score - a.score);
  }

  findDeeperNeeds(need) {
    // Based on the examples, find needs that are deeper in the chain
    const deeper = [];
    
    // Example patterns from Chapter 5
    const deeperPatterns = {
      'communication': ['to understand and be understood', 'rest', 'safe-space'],
      'consideration': ['to understand and be understood', 'rest', 'safe-space'],
      'inclusion': ['to matter', 'being wanted', 'approval'],
      'to see and be seen': ['to matter', 'being wanted', 'approval'],
      'to matter': ['self-respect', 'self-compassion'],
      'being wanted': ['self-respect', 'self-compassion'],
      'self-expression': ['purpose', 'clarity'],
      'effectiveness': ['purpose', 'clarity'],
      'purpose': ['presence', 'mourning'],
      'clarity': ['presence', 'awareness']
    };
    
    if (deeperPatterns[need]) {
      deeperPatterns[need].forEach(deeperNeed => {
        const needData = this.analysisData.needs[deeperNeed];
        if (needData && needData.averageScore >= 5) {
          deeper.push({
            need: deeperNeed,
            score: needData.averageScore,
            category: this.getNeedCategory(deeperNeed),
            depth: 'deeper'
          });
        }
      });
    }
    
    return deeper;
  }

  findRelatedVices(question) {
    const vices = [];
    const questionVices = question.mapsToVice || [];
    
    questionVices.forEach(vice => {
      const viceData = this.analysisData.vices[vice];
      if (viceData && viceData.averageScore >= 5) {
        vices.push({
          vice: vice,
          score: viceData.averageScore,
          category: this.getViceCategory(vice)
        });
      }
    });
    
    return vices;
  }

  findNeedsForVice(viceKey) {
    const needs = [];
    
    // Find questions that map to this vice
    this.questionSequence.forEach(q => {
      if (q.mapsToVice && q.mapsToVice.includes(viceKey)) {
        if (q.mapsToNeed) {
          q.mapsToNeed.forEach(need => {
            const needData = this.analysisData.needs[need];
            if (needData && needData.averageScore >= 5) {
              if (!needs.find(n => n.need === need)) {
                needs.push({
                  need: need,
                  score: needData.averageScore,
                  category: this.getNeedCategory(need)
                });
              }
            }
          });
        }
      }
    });
    
    return needs.sort((a, b) => b.score - a.score);
  }

  findDependencyPatterns(needsChain) {
    const patterns = [];
    
    // Check dependency pattern questions
    const dependencyQuestions = this.questionSequence.filter(q => q.stage === 'dependency');
    dependencyQuestions.forEach(q => {
      const answer = this.answers[q.id] || 0;
      if (answer >= 6) {
        // Check if this pattern relates to the needs chain
        const relatedNeeds = q.mapsToNeed || [];
        const hasOverlap = needsChain.some(n => relatedNeeds.includes(n.need));
        
        if (hasOverlap) {
          patterns.push({
            pattern: q.question,
            score: answer,
            type: q.category
          });
        }
      }
    });
    
    return patterns;
  }

  calculateLoopStrength(surfaceScore, needsChain) {
    let strength = surfaceScore;
    
    if (needsChain.length > 0) {
      const avgNeedScore = needsChain.reduce((sum, n) => sum + n.score, 0) / needsChain.length;
      strength = (surfaceScore + avgNeedScore) / 2;
    }
    
    // Increase strength for longer chains (more complex loops)
    if (needsChain.length > 2) {
      strength *= 1.2;
    }
    
    return Math.min(strength, 10);
  }

  getNeedCategory(need) {
    for (const [key, category] of Object.entries(NEEDS_VOCABULARY)) {
      if (category.needs.includes(need)) {
        return category.category;
      }
    }
    return 'Unknown';
  }

  getViceCategory(vice) {
    for (const [key, category] of Object.entries(VICES_VOCABULARY)) {
      if (key !== 'all' && category.vices && category.vices.includes(vice)) {
        return category.category;
      }
    }
    return 'Unknown';
  }

  // NEW METHODS FOR APPENDIX 1 & 2 INTEGRATION

  identifyPatterns() {
    // Match identified needs and vices to patterns from the compendium
    const patternMatches = [];
    const identifiedNeeds = Object.keys(this.analysisData.needs).filter(
      need => this.analysisData.needs[need].averageScore >= 5
    );
    const identifiedVices = Object.keys(this.analysisData.vices).filter(
      vice => this.analysisData.vices[vice].averageScore >= 5
    );

    // Check each pattern in the compendium
    Object.entries(PATTERNS_COMPENDIUM).forEach(([patternName, patternData]) => {
      if (!patternData.needs) return;
      
      // Calculate match score based on needs overlap
      const patternNeeds = patternData.needs.map(n => n.toLowerCase());
      const matchingNeeds = identifiedNeeds.filter(need => 
        patternNeeds.some(pn => need.toLowerCase().includes(pn) || pn.includes(need.toLowerCase()))
      );
      
      // Calculate match score based on vices overlap
      const patternVices = (patternData.viceExpression || []).map(v => v.toLowerCase());
      const matchingVices = identifiedVices.filter(vice => 
        patternVices.some(pv => vice.toLowerCase().includes(pv) || pv.includes(vice.toLowerCase()))
      );
      
      // Calculate overall match score
      const needsMatchScore = patternNeeds.length > 0 ? (matchingNeeds.length / patternNeeds.length) * 100 : 0;
      const vicesMatchScore = patternVices.length > 0 ? (matchingVices.length / patternVices.length) * 100 : 0;
      const overallScore = (needsMatchScore * 0.7) + (vicesMatchScore * 0.3);
      
      if (overallScore >= 30) { // Threshold for pattern match
        patternMatches.push({
          patternName,
          category: patternData.category,
          narrative: patternData.narrative,
          impact: patternData.impact,
          matchScore: overallScore,
          needsMatch: matchingNeeds,
          vicesMatch: matchingVices,
          needs: patternData.needs,
          compulsions: patternData.compulsions,
          aversions: patternData.aversions,
          triggers: patternData.triggers,
          viceExpression: patternData.viceExpression
        });
      }
    });

    // Sort by match score
    patternMatches.sort((a, b) => b.matchScore - a.matchScore);
    this.analysisData.patternMatches = patternMatches;
    this.analysisData.patterns = patternMatches.reduce((acc, match) => {
      acc[match.patternName] = match;
      return acc;
    }, {});
  }

  mapCompulsionsAndAversions() {
    // Map identified needs to their compulsions and aversions from Appendix 2
    const identifiedNeeds = Object.keys(this.analysisData.needs).filter(
      need => this.analysisData.needs[need].averageScore >= 5
    );

    identifiedNeeds.forEach(need => {
      // Try to find matching need in the mapping (case-insensitive)
      const mappingKey = Object.keys(NEED_COMPULSION_AVERSION_MAPPING).find(
        key => key.toLowerCase() === need.toLowerCase() || need.toLowerCase().includes(key.toLowerCase())
      );
      
      if (mappingKey) {
        const mapping = NEED_COMPULSION_AVERSION_MAPPING[mappingKey];
        this.analysisData.needCompulsionAversionMappings[need] = {
          need: need,
          compulsion: mapping.compulsion,
          aversion: mapping.aversion,
          needScore: this.analysisData.needs[need].averageScore
        };
      }
    });
  }

  mapViceNeedRelationships() {
    // Map identified vices to their associated needs from Appendix 2
    const identifiedVices = Object.keys(this.analysisData.vices).filter(
      vice => this.analysisData.vices[vice].averageScore >= 5
    );

    identifiedVices.forEach(vice => {
      // Try to find matching vice in the mapping (case-insensitive)
      const mappingKey = Object.keys(VICE_NEEDS_MAPPING).find(
        key => key.toLowerCase() === vice.toLowerCase() || 
               key.toLowerCase().includes(vice.toLowerCase()) ||
               vice.toLowerCase().includes(key.toLowerCase())
      );
      
      if (mappingKey) {
        const mapping = VICE_NEEDS_MAPPING[mappingKey];
        this.analysisData.viceNeedMappings[vice] = {
          vice: vice,
          chronicNeeds: mapping.chronic,
          acuteNeeds: mapping.acute,
          viceScore: this.analysisData.vices[vice].averageScore
        };
      }
    });
  }

  mapPatternNeedsRelationships() {
    // Map identified patterns to their associated needs from Appendix 2
    this.analysisData.patternMatches.forEach(match => {
      const patternName = match.patternName;
      if (PATTERN_NEEDS_MAPPING[patternName]) {
        this.analysisData.patternNeedsMappings[patternName] = {
          pattern: patternName,
          associatedNeeds: PATTERN_NEEDS_MAPPING[patternName],
          matchScore: match.matchScore
        };
      }
    });
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.analysisData.primaryLoop) {
      const loop = this.analysisData.primaryLoop;
      
      // Generate recommendations based on loop type and needs
      if (loop.type === 'surface_to_needs') {
        recommendations.push({
          priority: 'high',
          title: 'Address Root Needs',
          description: `Your primary dependency loop starts with ${loop.surfaceExperience}. The root needs in this chain are: ${loop.needsChain.map(n => n.need).join(', ')}. Focus on meeting these needs directly rather than managing the surface symptoms.`
        });
      }
      
      if (loop.type === 'vice_to_needs') {
        recommendations.push({
          priority: 'high',
          title: 'Trace Vice to Need',
          description: `The vice "${loop.vice}" is signaling unmet needs: ${loop.needsChain.map(n => n.need).join(', ')}. Instead of suppressing the vice, address the underlying needs.`
        });
      }
      
      // Add specific recommendations based on needs categories
      loop.needsChain.forEach(needItem => {
        const category = this.getNeedCategory(needItem.need);
        if (category === 'Physical Well-Being') {
          recommendations.push({
            priority: 'high',
            title: 'Physical Self-Care',
            description: `Your dependency loop includes physical needs (${needItem.need}). Prioritize nutrition, hydration, rest, and movement to break the loop at its foundation.`
          });
        } else if (category === 'Connection') {
          recommendations.push({
            priority: 'medium',
            title: 'Conscious Connection',
            description: `Your loop involves connection needs (${needItem.need}). Practice conscious self-resourcing before seeking external connection.`
          });
        } else if (category === 'Autonomy') {
          recommendations.push({
            priority: 'high',
            title: 'Reclaim Autonomy',
            description: `Your loop involves autonomy needs (${needItem.need}). Practice making choices and taking actions that meet your needs independently.`
          });
        }
      });
    }
    
    // Add general recommendations
    recommendations.push({
      priority: 'medium',
      title: 'Trace the Chain Inward',
      description: 'When you notice a surface symptom, ask "Why?" repeatedly to trace the need chain inward. Meet the deepest need to collapse the entire loop.'
    });
    
    recommendations.push({
      priority: 'low',
      title: 'Develop Needs Vocabulary',
      description: 'Continue building familiarity with your needs vocabulary. The more precisely you can name your needs, the more effectively you can meet them.'
    });
    
    this.analysisData.recommendations = recommendations;
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    let html = '<div class="results-content">';
    
    // Primary Loop
    if (this.analysisData.primaryLoop) {
      html += this.renderPrimaryLoop(this.analysisData.primaryLoop);
    }
    
    // Pattern Matches (NEW - from Appendix 1)
    if (this.analysisData.patternMatches && this.analysisData.patternMatches.length > 0) {
      html += this.renderPatternMatches();
    }
    
    // All Identified Loops
    if (this.analysisData.identifiedLoops.length > 0) {
      html += this.renderAllLoops();
    }
    
    // Top Needs
    html += this.renderTopNeeds();
    
    // Compulsions and Aversions (NEW - from Appendix 2)
    if (Object.keys(this.analysisData.needCompulsionAversionMappings).length > 0) {
      html += this.renderCompulsionsAndAversions();
    }
    
    // Top Vices
    html += this.renderTopVices();
    
    // Vice-Need Mappings (NEW - from Appendix 2)
    if (Object.keys(this.analysisData.viceNeedMappings).length > 0) {
      html += this.renderViceNeedMappings();
    }
    
    // Recommendations
    html += this.renderRecommendations();
    
    // What This Does NOT Imply
    html += this.renderClosure();
    
    html += '</div>';
    
    container.innerHTML = html;
  }

  renderPrimaryLoop(loop) {
    let html = `
      <div class="primary-loop-section">
        <h2>Primary Dependency Loop</h2>
        <div class="loop-card primary">
          <div class="loop-header">
            <h3>${loop.type === 'surface_to_needs' ? 'Surface Experience Loop' : 'Vice-to-Needs Loop'}</h3>
            <span class="loop-strength">Strength: ${loop.strength.toFixed(1)}/10</span>
          </div>
    `;
    
    if (loop.surfaceExperience) {
      html += `<p class="loop-surface"><strong>Surface Experience:</strong> ${loop.surfaceExperience}</p>`;
    }
    
    if (loop.vice) {
      html += `<p class="loop-vice"><strong>Vice Expression:</strong> ${loop.vice} (Score: ${loop.viceScore.toFixed(1)})</p>`;
    }
    
    if (loop.needsChain && loop.needsChain.length > 0) {
      html += '<div class="needs-chain"><h4>Needs Chain (Surface → Root):</h4><ul>';
      loop.needsChain.forEach((needItem, index) => {
        html += `<li><strong>${index + 1}.</strong> ${needItem.need} <span class="need-score">(${needItem.score.toFixed(1)})</span> <span class="need-category">[${needItem.category}]</span></li>`;
      });
      html += '</ul></div>';
    }
    
    if (loop.vices && loop.vices.length > 0) {
      html += '<div class="loop-vices"><h4>Related Vices:</h4><ul>';
      loop.vices.forEach(vice => {
        html += `<li>${vice.vice} <span class="vice-score">(${vice.score.toFixed(1)})</span></li>`;
      });
      html += '</ul></div>';
    }
    
    if (loop.dependencyPatterns && loop.dependencyPatterns.length > 0) {
      html += '<div class="dependency-patterns"><h4>Dependency Patterns:</h4><ul>';
      loop.dependencyPatterns.forEach(pattern => {
        html += `<li>${pattern.pattern} <span class="pattern-score">(${pattern.score.toFixed(1)})</span></li>`;
      });
      html += '</ul></div>';
    }
    
    html += '</div></div>';
    
    return html;
  }

  renderAllLoops() {
    if (this.analysisData.identifiedLoops.length <= 1) return '';
    
    let html = `
      <div class="all-loops-section">
        <h2>Additional Dependency Loops</h2>
        <div class="loops-grid">
    `;
    
    this.analysisData.identifiedLoops.slice(1, 4).forEach((loop, index) => {
      html += `
        <div class="loop-card">
          <h3>Loop ${index + 2}</h3>
          <p class="loop-strength">Strength: ${loop.strength.toFixed(1)}/10</p>
          ${loop.surfaceExperience ? `<p><strong>Surface:</strong> ${loop.surfaceExperience.substring(0, 60)}...</p>` : ''}
          ${loop.vice ? `<p><strong>Vice:</strong> ${loop.vice}</p>` : ''}
          ${loop.needsChain && loop.needsChain.length > 0 ? `<p><strong>Needs:</strong> ${loop.needsChain.slice(0, 3).map(n => n.need).join(', ')}</p>` : ''}
        </div>
      `;
    });
    
    html += '</div></div>';
    
    return html;
  }

  renderTopNeeds() {
    const topNeeds = Object.entries(this.analysisData.needs)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10);
    
    if (topNeeds.length === 0) return '';
    
    let html = `
      <div class="top-needs-section">
        <h2>Top Unmet Needs</h2>
        <div class="needs-list">
    `;
    
    topNeeds.forEach(need => {
      const category = this.getNeedCategory(need.name);
      html += `
        <div class="need-item">
          <div class="need-header">
            <span class="need-name">${need.name}</span>
            <span class="need-score">${need.averageScore.toFixed(1)}/10</span>
          </div>
          <div class="need-category">${category}</div>
        </div>
      `;
    });
    
    html += '</div></div>';
    
    return html;
  }

  renderTopVices() {
    const topVices = Object.entries(this.analysisData.vices)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 8);
    
    if (topVices.length === 0) return '';
    
    let html = `
      <div class="top-vices-section">
        <h2>Top Vice Expressions</h2>
        <div class="vices-list">
    `;
    
    topVices.forEach(vice => {
      const category = this.getViceCategory(vice.name);
      html += `
        <div class="vice-item">
          <div class="vice-header">
            <span class="vice-name">${vice.name}</span>
            <span class="vice-score">${vice.averageScore.toFixed(1)}/10</span>
          </div>
          <div class="vice-category">${category}</div>
          <div class="vice-note">Remember: Vice is the language of unmet needs pushed to distortion.</div>
        </div>
      `;
    });
    
    html += '</div></div>';
    
    return html;
  }

  renderPatternMatches() {
    if (!this.analysisData.patternMatches || this.analysisData.patternMatches.length === 0) return '';
    
    let html = `
      <div class="pattern-matches-section">
        <h2>Identified Coping Patterns</h2>
        <p class="section-note">Based on your responses, the following patterns from the Patterns Compendium (Appendix 1) show significant alignment:</p>
    `;
    
    // Show top 5 pattern matches
    const topPatterns = this.analysisData.patternMatches.slice(0, 5);
    
    topPatterns.forEach((match, index) => {
      html += `
        <div class="pattern-match-card ${index === 0 ? 'primary' : ''}">
          <div class="pattern-header">
            <h3>${match.patternName}</h3>
            <span class="match-score">${match.matchScore.toFixed(0)}% Match</span>
          </div>
          <div class="pattern-category">${match.category}</div>
          ${match.narrative ? `<p class="pattern-narrative"><strong>Narrative:</strong> "${match.narrative}"</p>` : ''}
          ${match.impact ? `<p class="pattern-impact"><strong>Impact:</strong> ${match.impact}</p>` : ''}
          ${match.needsMatch && match.needsMatch.length > 0 ? `
            <div class="pattern-needs">
              <strong>Matching Needs:</strong> ${match.needsMatch.join(', ')}
            </div>
          ` : ''}
          ${match.vicesMatch && match.vicesMatch.length > 0 ? `
            <div class="pattern-vices">
              <strong>Matching Vices:</strong> ${match.vicesMatch.join(', ')}
            </div>
          ` : ''}
          ${match.triggers ? `
            <div class="pattern-triggers">
              <strong>Potential Triggers:</strong> ${Array.isArray(match.triggers) ? match.triggers.join(', ') : match.triggers}
            </div>
          ` : ''}
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  renderCompulsionsAndAversions() {
    if (Object.keys(this.analysisData.needCompulsionAversionMappings).length === 0) return '';
    
    let html = `
      <div class="compulsions-aversions-section">
        <h2>Compulsions and Aversions</h2>
        <p class="section-note">For each identified unmet need, here are the typical compulsion (external dependency) and aversion (avoiding aggravation) patterns:</p>
    `;
    
    // Sort by need score
    const sortedMappings = Object.values(this.analysisData.needCompulsionAversionMappings)
      .sort((a, b) => b.needScore - a.needScore)
      .slice(0, 8); // Show top 8
    
    sortedMappings.forEach(mapping => {
      html += `
        <div class="compulsion-aversion-card">
          <div class="need-header">
            <h3>${mapping.need}</h3>
            <span class="need-score">Score: ${mapping.needScore.toFixed(1)}/10</span>
          </div>
          <div class="compulsion-section">
            <strong>Compulsion (External Dependency):</strong>
            <p>${mapping.compulsion}</p>
          </div>
          <div class="aversion-section">
            <strong>Aversion (Avoiding Aggravation):</strong>
            <p>${mapping.aversion}</p>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  renderViceNeedMappings() {
    if (Object.keys(this.analysisData.viceNeedMappings).length === 0) return '';
    
    let html = `
      <div class="vice-need-mappings-section">
        <h2>Vice-Need Relationships</h2>
        <p class="section-note">Each vice expression signals specific unmet needs. Understanding these relationships helps trace from symptoms to root causes:</p>
    `;
    
    // Sort by vice score
    const sortedMappings = Object.values(this.analysisData.viceNeedMappings)
      .sort((a, b) => b.viceScore - a.viceScore)
      .slice(0, 8); // Show top 8
    
    sortedMappings.forEach(mapping => {
      html += `
        <div class="vice-need-mapping-card">
          <div class="vice-header">
            <h3>${mapping.vice}</h3>
            <span class="vice-score">Score: ${mapping.viceScore.toFixed(1)}/10</span>
          </div>
          <div class="chronic-needs">
            <strong>Chronic Need Deprivation:</strong>
            <p>${mapping.chronicNeeds.join(', ')}</p>
          </div>
          <div class="acute-needs">
            <strong>Acute Need Aggravation:</strong>
            <p>${mapping.acuteNeeds.join(', ')}</p>
          </div>
          <div class="vice-note">
            <em>This vice is the language of these unmet needs pushed to distortion.</em>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }

  renderRecommendations() {
    if (!this.analysisData.recommendations || this.analysisData.recommendations.length === 0) return '';
    
    let html = `
      <div class="recommendations-section">
        <h2>Action Strategies</h2>
    `;
    
    const highPriority = this.analysisData.recommendations.filter(r => r.priority === 'high');
    const mediumPriority = this.analysisData.recommendations.filter(r => r.priority === 'medium');
    const lowPriority = this.analysisData.recommendations.filter(r => r.priority === 'low');
    
    if (highPriority.length > 0) {
      html += '<div class="priority-group high"><h3>High Priority</h3><ul>';
      highPriority.forEach(rec => {
        html += `<li><strong>${rec.title}:</strong> ${rec.description}</li>`;
      });
      html += '</ul></div>';
    }
    
    if (mediumPriority.length > 0) {
      html += '<div class="priority-group medium"><h3>Medium Priority</h3><ul>';
      mediumPriority.forEach(rec => {
        html += `<li><strong>${rec.title}:</strong> ${rec.description}</li>`;
      });
      html += '</ul></div>';
    }
    
    if (lowPriority.length > 0) {
      html += '<div class="priority-group low"><h3>Low Priority</h3><ul>';
      lowPriority.forEach(rec => {
        html += `<li><strong>${rec.title}:</strong> ${rec.description}</li>`;
      });
      html += '</ul></div>';
    }
    
    html += '</div>';
    
    return html;
  }

  renderClosure() {
    return `
      <div class="closure-section">
        <h2>What This Does NOT Imply</h2>
        <div class="closure-content">
          <p><strong>This analysis does not mean:</strong></p>
          <ul>
            <li>That you are broken or deficient</li>
            <li>That dependency is always negative (some dependency is healthy and necessary)</li>
            <li>That you must meet all needs independently</li>
            <li>That these patterns are permanent or fixed</li>
          </ul>
          <p><strong>This analysis does mean:</strong></p>
          <ul>
            <li>You have identified patterns that can be addressed with conscious awareness</li>
            <li>You have a map for tracing symptoms to root needs</li>
            <li>You can develop greater autonomy and sovereignty through needs consciousness</li>
            <li>You can transform dependency loops into conscious choice</li>
          </ul>
          <div class="stabilizing-closure">
            <p><strong>Orientation back to agency:</strong> You have the capacity to trace your needs chains inward and meet them directly. This is a moment-to-moment alignment tool, not a diagnostic label.</p>
            <p><strong>Explicit exit:</strong> This assessment is complete. Return to lived action with this awareness.</p>
          </div>
        </div>
      </div>
    `;
  }

  saveProgress() {
    const progressData = {
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('needsDependencyProgress', JSON.stringify(progressData));
  }

  loadStoredData() {
    const stored = localStorage.getItem('needsDependencyProgress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || {};
      } catch (e) {
        console.error('Error loading stored progress:', e);
      }
    }
  }

  resetAssessment() {
    if (confirm('Are you sure you want to start a new assessment? This will clear all current progress.')) {
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.analysisData = {
        timestamp: new Date().toISOString(),
        surfaceExperiences: {},
        needs: {},
        vices: {},
        dependencyPatterns: {},
        identifiedLoops: [],
        primaryLoop: null,
        recommendations: []
      };
      localStorage.removeItem('needsDependencyProgress');
      localStorage.removeItem('needsDependencyResults');
      
      document.getElementById('resultsSection').classList.remove('active');
      document.getElementById('introSection').style.display = 'block';
      document.getElementById('questionnaireSection').classList.remove('active');
      
      this.buildQuestionSequence();
    }
  }

  exportAnalysis(format) {
    // Prepare comprehensive export data
    const exportData = {
      ...this.analysisData,
      exportDate: new Date().toISOString(),
      systemType: 'needs-dependency',
      systemName: 'Needs Dependency Loop Determinator'
    };
    
    if (format === 'json') {
      const json = exportJSON(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
      downloadFile(json, 'needs-dependency-analysis.json', 'application/json');
    } else if (format === 'csv') {
      const csv = exportForAIAgent(exportData, 'needs-dependency', 'Needs Dependency Loop Determinator');
      downloadFile(csv, 'needs-dependency-analysis.csv', 'text/csv');
    }
  }

}

// Initialize engine when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.needsDependencyEngine = new NeedsDependencyEngine();
  });
} else {
  window.needsDependencyEngine = new NeedsDependencyEngine();
}

