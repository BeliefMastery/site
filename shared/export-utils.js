// Shared Export Utilities
// Standardized export functionality with AI agent instructions for all questionnaire systems

const EXPORT_VERSION = '1.1.0';

const FRAMEWORK_MAP = {
  diagnosis: ['Sovereign of Mind', 'Distortion Codex'],
  coaching: ['Belief Mastery', 'Sovereign of Mind'],
  'life-domain-review': ['Belief Mastery', 'Sovereign of Mind'],
  manipulation: ['Sovereign of Mind', 'Distortion Codex'],
  channels: ['Sovereign of Mind'],
  paradigm: ['Sovereign of Mind'],
  'sovereignty-spectrum': ['Sovereign of Mind'],
  sovereignty: ['Sovereign of Mind'],
  'needs-dependency': ['Belief Mastery', 'Sovereign of Mind'],
  'logos-structure': ['Sovereign of Mind'],
  'cognitive-resistance-capacity': ['Sovereign of Mind'],
  'cognitive-resistance-capacity-assessment': ['Sovereign of Mind'],
  'sovereignty-paradigm': ['Sovereign of Mind'],
  'sovereignty-spectrum-analysis': ['Sovereign of Mind'],
  entities: ['Sovereign of Mind'],
  'outlier-aptitude': ['Sovereign of Mind']
};

/** Maps engine-specific type strings to keys understood by CSV generators. */
const SYSTEM_TYPE_ALIASES = {
  'life-domain-review': 'coaching',
  'logos-structure': 'paradigm',
  'cognitive-resistance-capacity': 'sovereignty',
  'cognitive-resistance-capacity-assessment': 'sovereignty',
  'sovereignty-spectrum-analysis': 'sovereignty-paradigm'
};

export function normalizeSystemType(systemType) {
  if (!systemType) return systemType;
  return SYSTEM_TYPE_ALIASES[systemType] || systemType;
}

function getFrameworksForSystem(systemType) {
  if (!systemType) return ['Belief Mastery', 'Sovereign of Mind'];
  return FRAMEWORK_MAP[systemType] || ['Belief Mastery', 'Sovereign of Mind'];
}

function getTopEntriesByValue(entries, valueKey, limit = 3) {
  return entries
    .filter(entry => typeof entry[valueKey] === 'number')
    .sort((a, b) => b[valueKey] - a[valueKey])
    .slice(0, limit);
}

function buildExecutiveHighlights(data) {
  const highlights = [];
  if (!data) return highlights;

  if (Array.isArray(data.identifiedVectors) && data.identifiedVectors.length) {
    getTopEntriesByValue(data.identifiedVectors, 'weightedScore').forEach(vec => {
      highlights.push(`Manipulation vector: ${vec.name} (${vec.weightedScore?.toFixed?.(2) || vec.weightedScore})`);
    });
  }

  if (data.obstacles && typeof data.obstacles === 'object') {
    const obsList = Object.values(data.obstacles || {});
    getTopEntriesByValue(obsList, 'weightedScore').forEach(obs => {
      highlights.push(`Sovereignty obstacle: ${obs.name} (${obs.weightedScore?.toFixed?.(2) || obs.weightedScore})`);
    });
  }

  if (data.domains && typeof data.domains === 'object') {
    const domList = Object.values(data.domains || {});
    const lowest = domList
      .filter(dom => typeof dom.combinedScore === 'number')
      .sort((a, b) => a.combinedScore - b.combinedScore)
      .slice(0, 2);
    lowest.forEach(dom => {
      highlights.push(`Life domain strain: ${dom.name} (${dom.combinedScore?.toFixed?.(1) || dom.combinedScore}/10)`);
    });
  }

  if (data.probabilities && typeof data.probabilities === 'object') {
    const probs = Object.entries(data.probabilities)
      .map(([name, value]) => ({ name, value }))
      .filter(item => typeof item.value === 'number');
    getTopEntriesByValue(probs, 'value').forEach(item => {
      highlights.push(`Diagnostic indicator: ${item.name} (${Math.round(item.value * 100)}%)`);
    });
  }

  if (data.primaryPattern) {
    highlights.push(`Primary pattern: ${data.primaryPattern}`);
  }

  if (data.primaryLoop) {
    highlights.push(`Primary dependency loop: ${data.primaryLoop}`);
    if (data.needChainDisplay) {
      highlights.push(`Need chain (Loop ← Root): ${data.needChainDisplay}`);
    }
    if (data.firstLinkInChain) {
      highlights.push(`First link in chain (immanent focus): ${data.firstLinkInChain}`);
    }
  }

  if (data.quadrants && typeof data.quadrants === 'object') {
    Object.entries(data.quadrants).forEach(([layerId, q]) => {
      if (q && q.label) highlights.push(`Sovereign Assessment ${layerId}: ${q.label}`);
    });
  }

  if (data.spectrumLabel) {
    highlights.push(`Paradigm integration level: ${data.spectrumLabel}`);
  }

  return highlights;
}

export function exportExecutiveBrief(assessmentData, systemType, systemName) {
  const frameworks = getFrameworksForSystem(systemType).join(', ');
  const highlights = buildExecutiveHighlights(assessmentData);
  const guidance = [
    'Focus on the top 1–3 findings before expanding scope.',
    'Use the full export for AI-guided action planning.',
    'Re-run the assessment after applying corrective actions.'
  ];

  let text = `${systemName} — Executive Brief\n`;
  text += `Version: ${EXPORT_VERSION}\n`;
  text += `Generated: ${new Date().toISOString()}\n`;
  text += `Frameworks: ${frameworks}\n\n`;
  text += 'Key Findings:\n';
  if (highlights.length) {
    highlights.forEach(item => {
      text += `- ${item}\n`;
    });
  } else {
    text += '- No dominant findings detected. Review the full report for detail.\n';
  }
  text += '\nNext Actions:\n';
  guidance.forEach(item => {
    text += `- ${item}\n`;
  });

  return text;
}

export function exportForAIAgent(assessmentData, systemType, systemName) {
  const normalizedType = normalizeSystemType(systemType);
  // Generate comprehensive CSV export with AI interpretation instructions
  let csv = `${systemName} Assessment Profile\n`;
  csv += `Export Version: ${EXPORT_VERSION}\n`;
  csv += 'Generated: ' + new Date().toISOString() + '\n';
  csv += 'System Type: ' + systemType + '\n';
  csv += 'Frameworks: ' + getFrameworksForSystem(systemType).join(', ') + '\n';
  csv += '\n';
  csv += '=== HOW TO USE THIS DATA ===\n';
  csv += 'This CSV contains assessment data with comprehensive explanations for how your AI agent should interpret, value, and prioritize the content.\n';
  csv += 'Import this data into your AI platform (ChatGPT, Claude, etc.) and use the "AI Agent Configuration" section to configure your agent.\n';
  csv += 'This profile is designed to transform your AI into a personalized sovereignty-aligned coaching and analysis agent.\n';
  csv += '\n';
  csv += '=== AI AGENT CONFIGURATION INSTRUCTIONS ===\n';
  csv += 'Section,Instruction\n';
  csv += '"System Prompt","Use this assessment profile to understand the user\'s patterns, obstacles, and needs. Focus on sovereignty-aligned support and structural clarity."\n';
  csv += '"Primary Function","Provide coaching, analysis, and guidance based on the identified patterns and priorities in this profile."\n';
  csv += '"Tone & Approach","Adjust tone based on severity/priority levels: High = supportive but direct; Moderate = encouraging with strategies; Low = awareness and maintenance. Honor individual autonomy and authorship."\n';
  csv += '"Coaching Style","Question-based inquiry that surfaces self-awareness. Support without imposing. Help user recognize patterns and reclaim sovereignty."\n';
  csv += '"Prioritization","Use weighted scores and priority levels as primary metrics. Address high-priority items first, then moderate, then low."\n';
  csv += '"Response Approach","Focus responses on identified priorities. Acknowledge strengths. Provide practical strategies for obstacles and improvement areas."\n';
  csv += '"Sovereignty Alignment","All guidance should support the user\'s capacity for self-authorship, structural clarity, and reclaiming agency."\n';
  csv += '\n';
  
  // Add system-specific data sections (normalizedType aligns engine strings with generators)
  if (normalizedType === 'coaching') {
    csv += generateCoachingExport(assessmentData);
  } else if (normalizedType === 'manipulation') {
    csv += generateManipulationExport(assessmentData);
  } else if (normalizedType === 'channels') {
    csv += generateChannelsExport(assessmentData);
  } else if (normalizedType === 'paradigm') {
    csv += generateParadigmExport(assessmentData);
  } else if (normalizedType === 'diagnosis') {
    csv += generateDiagnosisExport(assessmentData);
  } else if (normalizedType === 'needs-dependency') {
    csv += generateNeedsDependencyExport(assessmentData);
  } else if (normalizedType === 'sovereignty' || normalizedType === 'sovereignty-analysis') {
    csv += generateSovereigntyExport(assessmentData);
  } else if (normalizedType === 'sovereignty-paradigm') {
    csv += generateSovereigntySpectrumExport(assessmentData);
  }
  
  csv += '\n';
  csv += '=== INTERPRETATION GUIDE ===\n';
  csv += 'Column,Meaning,Priority Weight,Interpretation\n';
  csv += 'Raw Score,User response on 0-10 scale,Low,Direct user response - use for context\n';
  csv += 'Weighted Score,Score multiplied by importance weight,High,Primary metric for prioritization - higher = more urgent\n';
  csv += 'Priority Level,Calculated priority (High/Moderate/Low),High,Use to determine focus and intervention urgency\n';
  csv += 'Severity/Level,Interpreted level based on score,Medium,Use to understand user state and adjust tone/approach\n';
  csv += '\n';
  csv += '=== GENERAL SCORING INTERPRETATION ===\n';
  csv += 'Higher scores typically indicate stronger presence of patterns, obstacles, or concerns.\n';
  csv += 'Weighted scores determine priority - focus on high-priority items first.\n';
  csv += 'Use priority levels to determine coaching focus and intervention urgency.\n';
  csv += 'Adjust tone and approach based on severity/level indicators.\n';
  csv += '\n';
  
  return csv;
}

function generateCoachingExport(data) {
  let csv = '=== COACHING PROFILE DATA ===\n';
  
  // Include ALL questions with their answers
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Category,Section,Name\n';
    data.questionSequence.forEach(q => {
      const answer = data.allAnswers && data.allAnswers[q.id] !== undefined ? data.allAnswers[q.id] : 'Not answered';
      const questionText = q.question || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.category || ''}","${q.section || ''}","${(q.name || '').replace(/"/g, '""')}"\n`;
    });
  }
  
  // Legacy support: include raw answers if questionSequence is missing
  if ((!data.questionSequence || data.questionSequence.length === 0) && data.allAnswers && Object.keys(data.allAnswers).length > 0) {
    csv += '\n=== ALL RAW ANSWERS (Legacy Format) ===\n';
    csv += 'Question ID,Answer (0-10)\n';
    Object.entries(data.allAnswers).forEach(([id, answer]) => {
      const question = data.questionSequence ? data.questionSequence.find(q => q.id === id) : null;
      const questionText = question ? question.question : id;
      csv += `"${id}","${questionText.replace(/"/g, '""')}",${answer}\n`;
    });
  }
  
  if (data.obstacles && Object.keys(data.obstacles).length > 0) {
    csv += '\n=== OBSTACLES TO SOVEREIGNTY ===\n';
    csv += 'Name,Description,Raw Score,Weight,Weighted Score,Priority Level,Severity,Coaching Focus\n';
    
    const sortedObstacles = Object.entries(data.obstacles)
      .map(([key, obs]) => ({ key, ...obs }))
      .sort((a, b) => b.weightedScore - a.weightedScore);
    
    sortedObstacles.forEach(obs => {
      const severity = obs.rawScore >= 7 ? 'High' : obs.rawScore >= 4 ? 'Moderate' : 'Low';
      const priority = obs.weightedScore >= 8 ? 'High' : obs.weightedScore >= 5 ? 'Moderate' : 'Low';
      const focus = obs.rawScore >= 7 
        ? 'Urgent - Address immediately with direct coaching support'
        : obs.rawScore >= 4 
          ? 'Important - Regular coaching attention and strategies'
          : 'Monitor - Periodic check-ins and awareness';
      
      csv += `"${obs.name}","${(obs.description || '').replace(/"/g, '""')}",${obs.rawScore},${obs.weight || 1.0},${obs.weightedScore.toFixed(2)},${priority},${severity},"${focus}"\n`;
    });
  }
  
  if (data.domains && Object.keys(data.domains).length > 0) {
    csv += '\n=== SATISFACTION DOMAINS ===\n';
    csv += 'Domain,Overall Score,Average Aspect Score,Combined Score,Weight,Weighted Score,Priority Level,Satisfaction Level,Coaching Focus\n';
    
    const sortedDomains = Object.entries(data.domains)
      .map(([key, dom]) => ({ key, ...dom }))
      .sort((a, b) => a.combinedScore - b.combinedScore);
    
    sortedDomains.forEach(dom => {
      const satisfaction = dom.combinedScore >= 7 ? 'High' : dom.combinedScore >= 4 ? 'Moderate' : 'Low';
      const priority = dom.combinedScore <= 3 ? 'High' : dom.combinedScore <= 5 ? 'Moderate' : 'Low';
      const focus = dom.combinedScore <= 3
        ? 'Urgent - Primary focus for satisfaction improvement'
        : dom.combinedScore <= 5
          ? 'Important - Regular support and goal-setting'
          : 'Maintain - Acknowledge strengths and support maintenance';
      
      csv += `"${dom.name}",${dom.overviewScore},${dom.averageAspectScore.toFixed(2)},${dom.combinedScore.toFixed(2)},${dom.weight || 1.0},${dom.weightedScore.toFixed(2)},${priority},${satisfaction},"${focus}"\n`;
    });
  }
  
  if (data.priorities) {
    csv += '\n=== PRIORITY SUMMARY ===\n';
    if (data.priorities.topObstacles && data.priorities.topObstacles.length > 0) {
      csv += 'Top Obstacles to Address:\n';
      data.priorities.topObstacles.forEach((obs, i) => {
        csv += `${i + 1},"${obs.name}",Score: ${obs.rawScore}/10,Weighted: ${obs.weightedScore.toFixed(2)}\n`;
      });
    }
    if (data.priorities.topImprovementAreas && data.priorities.topImprovementAreas.length > 0) {
      csv += '\nTop Areas for Improvement:\n';
      data.priorities.topImprovementAreas.forEach((dom, i) => {
        csv += `${i + 1},"${dom.name}",Satisfaction: ${dom.combinedScore.toFixed(1)}/10,Weighted: ${dom.weightedScore.toFixed(2)}\n`;
      });
    }
  }
  
  return csv;
}

function generateManipulationExport(data) {
  let csv = '=== MANIPULATION ANALYSIS DATA ===\n';
  
  // Include ALL questions with their answers (ensure comprehensive coverage)
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Category,Subcategory,Type,Weight\n';
    data.questionSequence.forEach(q => {
      const answer = data.allAnswers && data.allAnswers[q.id] !== undefined ? data.allAnswers[q.id] : 'Not answered';
      const questionText = q.question || q.text || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.category || ''}","${q.subcategory || ''}","${q.type || ''}",${q.weight || ''}\n`;
    });
  }
  
  // Legacy support: include raw answers if questionSequence is missing
  if ((!data.questionSequence || data.questionSequence.length === 0) && data.allAnswers && Object.keys(data.allAnswers).length > 0) {
    csv += '\n=== ALL RAW ANSWERS (Legacy Format) ===\n';
    csv += 'Question ID,Question,Answer (0-10),Category,Subcategory\n';
    Object.entries(data.allAnswers).forEach(([id, answer]) => {
      const question = data.questionSequence ? data.questionSequence.find(q => q.id === id) : null;
      const questionText = question ? question.question : id;
      const category = question ? question.category : '';
      const subcategory = question ? question.subcategory : '';
      csv += `"${id}","${questionText.replace(/"/g, '""')}",${answer},"${category}","${subcategory}"\n`;
    });
  }
  
  if (data.identifiedVectors && data.identifiedVectors.length > 0) {
    csv += '\n=== IDENTIFIED MANIPULATION VECTORS ===\n';
    csv += 'Vector,Description,Raw Score,Weighted Score,Priority Level,Severity,Focus\n';
    
    data.identifiedVectors.forEach(vec => {
      const severity = vec.weightedScore >= 8 ? 'High' : vec.weightedScore >= 5 ? 'Moderate' : 'Low';
      const priority = vec.weightedScore >= 8 ? 'High' : vec.weightedScore >= 5 ? 'Moderate' : 'Low';
      const focus = vec.weightedScore >= 8
        ? 'Urgent - Primary manipulation vector requiring immediate recognition and protection strategies'
        : vec.weightedScore >= 5
          ? 'Important - Significant manipulation pattern requiring awareness and boundary-setting'
          : 'Monitor - Present but lower priority, maintain awareness';
      
      csv += `"${vec.name}","${(vec.description || '').replace(/"/g, '""')}",${vec.rawScore.toFixed(2)},${vec.weightedScore.toFixed(2)},${priority},${severity},"${focus}"\n`;
    });
  }
  
  if (data.tactics && data.tactics.length > 0) {
    csv += '\n=== RELEVANT MANIPULATION TACTICS ===\n';
    csv += 'Tactic,Vector,Mode,Phase,Example,Mechanism\n';
    data.tactics.slice(0, 10).forEach(tactic => {
      csv += `"${tactic.name}","${tactic.vector}","${tactic.mode}","${tactic.phase}","${(tactic.example || '').replace(/"/g, '""')}","${(tactic.mechanism || '').replace(/"/g, '""')}"\n`;
    });
  }
  
  return csv;
}

function generateChannelsExport(data) {
  let csv = '=== CHANNEL ANALYSIS DATA ===\n';
  
  // Include ALL questions with their answers (ensure comprehensive coverage)
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Stage,Category,Node,Channel,Weight\n';
    data.questionSequence.forEach(q => {
      const answer = data.allAnswers && data.allAnswers[q.id] !== undefined ? data.allAnswers[q.id] : 'Not answered';
      const questionText = q.question || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.stage || ''}","${q.category || ''}","${q.node || ''}","${q.channel || ''}",${q.weight || ''}\n`;
    });
  }
  
  // Include any additional answers not in questionSequence (legacy support)
  if (data.allAnswers && Object.keys(data.allAnswers).length > 0) {
    const questionIds = new Set();
    if (data.questionSequence) {
      data.questionSequence.forEach(q => questionIds.add(q.id));
    }
    const missingAnswers = Object.entries(data.allAnswers).filter(([id]) => !questionIds.has(id));
    if (missingAnswers.length > 0) {
      csv += '\n=== ADDITIONAL ANSWERS (Not in Question Sequence) ===\n';
      csv += 'Question ID,Answer (0-10)\n';
      missingAnswers.forEach(([id, answer]) => {
        csv += `"${id}",${answer}\n`;
      });
    }
  }
  
  if (data.identifiedChannels && data.identifiedChannels.length > 0) {
    csv += '\n=== IDENTIFIED CHANNEL BLOCKAGES ===\n';
    csv += 'Channel,From Node,To Node,Blockage Score,Priority Level,Severity,Remediation Focus\n';
    
    data.identifiedChannels.forEach(ch => {
      const severity = ch.rawScore >= 8 ? 'High' : ch.rawScore >= 5 ? 'Moderate' : 'Low';
      const priority = ch.rawScore >= 8 ? 'High' : ch.rawScore >= 5 ? 'Moderate' : 'Low';
      const focus = ch.rawScore >= 8
        ? 'Urgent - Primary channel blockage requiring immediate remediation strategies'
        : ch.rawScore >= 5
          ? 'Important - Significant blockage requiring targeted practices'
          : 'Monitor - Present but lower priority, maintain awareness';
      
      csv += `"${ch.name}","${ch.from}","${ch.to}",${ch.rawScore.toFixed(2)},${priority},${severity},"${focus}"\n`;
    });
  }
  
  if (data.remediationStrategies && data.remediationStrategies.length > 0) {
    csv += '\n=== REMEDIATION STRATEGIES ===\n';
    csv += 'Channel,Strategy,Practices\n';
    data.remediationStrategies.forEach(strat => {
      const strategies = strat.strategies ? strat.strategies.join('; ') : '';
      const practices = strat.practices ? strat.practices.join(', ') : '';
      csv += `"${strat.channelName}","${strategies.replace(/"/g, '""')}","${practices.replace(/"/g, '""')}"\n`;
    });
  }
  
  return csv;
}

function generateParadigmExport(data) {
  let csv = '=== LOGOS STRUCTURE DATA ===\n';
  
  // Include ALL questions with their answers (ensure comprehensive coverage)
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Category,Paradigm,Perspective,Dimension,Name\n';
    data.questionSequence.forEach(q => {
      const answer = data.allAnswers && data.allAnswers[q.id] !== undefined ? data.allAnswers[q.id] : 'Not answered';
      const questionText = q.question || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.category || ''}","${q.paradigm || ''}","${q.perspective || ''}","${q.dimension || ''}","${(q.name || '').replace(/"/g, '""')}"\n`;
    });
  }
  
  // Include any additional answers not in questionSequence (legacy support)
  if (data.allAnswers && Object.keys(data.allAnswers).length > 0) {
    const questionIds = new Set();
    if (data.questionSequence) {
      data.questionSequence.forEach(q => questionIds.add(q.id));
    }
    const missingAnswers = Object.entries(data.allAnswers).filter(([id]) => !questionIds.has(id));
    if (missingAnswers.length > 0) {
      csv += '\n=== ADDITIONAL ANSWERS (Not in Question Sequence) ===\n';
      csv += 'Question ID,Answer (0-10)\n';
      missingAnswers.forEach(([id, answer]) => {
        csv += `"${id}",${answer}\n`;
      });
    }
  }
  
  if (data.identifiedParadigms && data.identifiedParadigms.length > 0) {
    csv += '\n=== IDENTIFIED PARADIGMS ===\n';
    csv += 'Paradigm,Dimension,Score,Priority Level,Clarity Level,Focus\n';
    
    data.identifiedParadigms.forEach(paradigm => {
      const priority = paradigm.score >= 7 ? 'High' : paradigm.score >= 4 ? 'Moderate' : 'Low';
      const clarity = paradigm.score >= 7 ? 'High' : paradigm.score >= 4 ? 'Moderate' : 'Low';
      const focus = paradigm.score >= 7
        ? 'Primary paradigm - Strong alignment, use as foundation for coaching'
        : paradigm.score >= 4
          ? 'Secondary paradigm - Present but not dominant, consider in context'
          : 'Tertiary paradigm - Minimal alignment, may indicate conflict or transition';
      
      csv += `"${paradigm.name}","${paradigm.dimension}",${paradigm.score.toFixed(2)},${priority},${clarity},"${focus}"\n`;
    });
  }
  
  return csv;
}

function generateDiagnosisExport(data) {
  let csv = '=== DIAGNOSTIC ASSESSMENT DATA ===\n';
  
  // Combine all answers (main + refined)
  const allAnswers = {};
  if (data.answers) {
    Object.assign(allAnswers, data.answers);
  }
  if (data.refinedAnswers) {
    Object.assign(allAnswers, data.refinedAnswers);
  }
  // Fallback to allAnswers if available
  if (data.allAnswers && Object.keys(allAnswers).length === 0) {
    Object.assign(allAnswers, data.allAnswers);
  }
  
  // Include ALL questions with their answers (main sequence)
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS (Main Sequence) ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Category,Disorder,Criterion\n';
    data.questionSequence.forEach(q => {
      const answer = allAnswers[q.id] !== undefined ? allAnswers[q.id] : (data.answers && data.answers[q.id] !== undefined ? data.answers[q.id] : 'Not answered');
      const questionText = q.question || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.category || ''}","${q.disorder || ''}","${q.criterion || ''}"\n`;
    });
  }
  
  // Include ALL refined questions with their answers
  if (data.refinedQuestionSequence && data.refinedQuestionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS (Refined Sequence) ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Disorder,Category\n';
    data.refinedQuestionSequence.forEach(q => {
      const answer = allAnswers[q.id] !== undefined ? allAnswers[q.id] : (data.refinedAnswers && data.refinedAnswers[q.id] !== undefined ? data.refinedAnswers[q.id] : 'Not answered');
      const questionText = q.question || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.disorder || ''}","${q.category || ''}"\n`;
    });
  }
  
  // Ensure ALL questions are included even if not in sequence (comprehensive coverage)
  const allQuestionIds = new Set();
  if (data.questionSequence) {
    data.questionSequence.forEach(q => allQuestionIds.add(q.id));
  }
  if (data.refinedQuestionSequence) {
    data.refinedQuestionSequence.forEach(q => allQuestionIds.add(q.id));
  }
  
  // Legacy support: include raw answers if questionSequence is missing
  if ((!data.questionSequence || data.questionSequence.length === 0) && allAnswers && Object.keys(allAnswers).length > 0) {
    csv += '\n=== ALL RAW ANSWERS (Legacy Format) ===\n';
    csv += 'Question ID,Answer (0-10),Category,Disorder,Criterion\n';
    Object.entries(allAnswers).forEach(([id, answer]) => {
      const question = data.questionSequence ? data.questionSequence.find(q => q.id === id) : 
                      (data.refinedQuestionSequence ? data.refinedQuestionSequence.find(q => q.id === id) : null);
      const category = question ? question.category : '';
      const disorder = question ? question.disorder : '';
      const criterion = question ? question.criterion : '';
      csv += `"${id}",${answer},"${category}","${disorder}","${criterion}"\n`;
    });
  }
  
  if (data.primaryDiagnosis) {
    csv += '\n=== PRIMARY DIAGNOSIS ===\n';
    csv += `Diagnosis: ${data.primaryDiagnosis.name}\n`;
    csv += `Probability: ${data.primaryDiagnosis.probability}%\n`;
    csv += `Severity: ${data.primaryDiagnosis.severity || 'Not specified'}\n`;
  }
  
  if (data.secondaryConsiderations && data.secondaryConsiderations.length > 0) {
    csv += '\n=== SECONDARY CONSIDERATIONS ===\n';
    csv += 'Diagnosis,Probability,Severity\n';
    data.secondaryConsiderations.forEach(diag => {
      csv += `"${diag.name}",${diag.probability}%,${diag.severity || 'Not specified'}\n`;
    });
  }
  
  return csv;
}

function formatAnswerForExport(answer) {
  if (answer == null || answer === '') return 'Not answered';
  if (typeof answer === 'object') {
    if (answer.mapsTo && answer.mapsTo.need) return answer.mapsTo.need;
    if (answer.text) return answer.text;
    if (Array.isArray(answer)) return answer.map(a => formatAnswerForExport(a)).join('; ');
    return JSON.stringify(answer);
  }
  return String(answer);
}

function generateNeedsDependencyExport(data) {
  let csv = '=== NEEDS DEPENDENCY LOOP DETERMINATOR DATA (4-Phase Architecture) ===\n';
  
  // Include ALL questions with their answers (4-phase structure)
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer,Phase,Loop\n';
    data.questionSequence.forEach(q => {
      const rawAnswer = q.answer !== undefined ? q.answer : (data.allAnswers && data.allAnswers[q.id]);
      const answer = formatAnswerForExport(rawAnswer);
      const questionText = (q.question || q.questionText || '').replace(/"/g, '""');
      csv += `"${q.id}","${questionText}","${String(answer).replace(/"/g, '""')}",${q.phase || ''},"${(q.loop || '').replace(/"/g, '""')}"\n`;
    });
  }
  
  // Primary Dependency Loop (4-phase: primaryLoop is string, loopScores has details)
  if (data.primaryLoop) {
    csv += '\n=== PRIMARY DEPENDENCY LOOP ===\n';
    const scores = data.loopScores && data.loopScores[data.primaryLoop];
    const totalScore = scores && typeof scores.totalScore === 'number' ? scores.totalScore.toFixed(1) : 'N/A';
    csv += `Loop Type: ${data.primaryLoop}\n`;
    csv += `Confidence: ${totalScore}/10\n`;
  }
  
  // Secondary Loops
  if (data.secondaryLoops && data.secondaryLoops.length > 0) {
    csv += '\n=== SECONDARY LOOPS ===\n';
    csv += data.secondaryLoops.join(', ') + '\n';
  }
  
  // Need Chain (Loop ← Root)
  const needChain = data.needChain || data.phase3Results?.needChain || [];
  if (needChain.length > 0) {
    csv += '\n=== NEED CHAIN (Loop ← Root) ===\n';
    if (data.needChainDisplay) {
      csv += `Chain: ${data.needChainDisplay}\n`;
    }
    csv += 'Position,Need,Deeper Options\n';
    needChain.forEach((entry, index) => {
      const need = (entry.need || entry).toString().replace(/"/g, '""');
      const deeper = Array.isArray(entry.deeper) ? entry.deeper.join('; ') : '';
      csv += `${index + 1},"${need}","${deeper.replace(/"/g, '""')}"\n`;
    });
  }
  
  // First Link in Chain (action-strategy recommendation)
  if (data.firstLinkInChain) {
    csv += '\n=== FIRST LINK IN CHAIN (Immanent Focus) ===\n';
    csv += `Seek and achieve: ${data.firstLinkInChain}\n`;
  }
  
  // Loop Scores (all loops)
  if (data.loopScores && typeof data.loopScores === 'object') {
    csv += '\n=== LOOP SCORES ===\n';
    csv += 'Loop,Total Score,Compulsion,Aversion,Need Chain Depth\n';
    Object.entries(data.loopScores).forEach(([loop, s]) => {
      const total = s && typeof s.totalScore === 'number' ? s.totalScore.toFixed(1) : '';
      const comp = s && typeof s.compulsionScore === 'number' ? s.compulsionScore.toFixed(1) : '';
      const av = s && typeof s.aversionScore === 'number' ? s.aversionScore.toFixed(1) : '';
      const depth = s && typeof s.needChainDepth === 'number' ? s.needChainDepth : '';
      csv += `"${loop}",${total},${comp},${av},${depth}\n`;
    });
  }
  
  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    csv += '\n=== RECOMMENDATIONS ===\n';
    csv += 'Priority,Title,Description\n';
    data.recommendations.forEach(rec => {
      const title = (rec.title || '').replace(/"/g, '""');
      const desc = (rec.description || '').replace(/"/g, '""');
      csv += `${rec.priority || ''},"${title}","${desc}"\n`;
    });
  }
  
  return csv;
}

function generateSovereigntySpectrumExport(data) {
  let csv = '=== SOVEREIGNTY PARADIGM (SPECTRUM) DATA ===\n';

  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer,Section,Category,Type\n';
    data.questionSequence.forEach(q => {
      const answer = data.allAnswers && data.allAnswers[q.id] !== undefined ? data.allAnswers[q.id] : 'Not answered';
      const questionText = q.question || q.questionText || q.text || '';
      const ansStr = typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}","${ansStr.replace(/"/g, '""')}","${q.section || ''}","${q.category || ''}","${q.type || ''}"\n`;
    });
  }

  if (data.allAnswers && Object.keys(data.allAnswers).length > 0) {
    const questionIds = new Set();
    if (data.questionSequence) {
      data.questionSequence.forEach(q => questionIds.add(q.id));
    }
    const missingAnswers = Object.entries(data.allAnswers).filter(([id]) => !questionIds.has(id));
    if (missingAnswers.length > 0) {
      csv += '\n=== ADDITIONAL ANSWERS ===\n';
      csv += 'Question ID,Answer\n';
      missingAnswers.forEach(([id, answer]) => {
        const ans = typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
        csv += `"${id}","${ans.replace(/"/g, '""')}"\n`;
      });
    }
  }

  if (data.spectrumLabel != null || data.spectrumPosition != null) {
    csv += '\n=== INTEGRATION SPECTRUM ===\n';
    csv += `Spectrum Label,${data.spectrumLabel || ''}\n`;
    csv += `Spectrum Position,${data.spectrumPosition != null ? data.spectrumPosition : ''}\n`;
  }

  if (data.dominantParadigm != null) {
    csv += '\n=== DOMINANT PARADIGM ID ===\n';
    csv += `${data.dominantParadigm}\n`;
  }

  if (Array.isArray(data.paradigmDominance) && data.paradigmDominance.length > 0) {
    csv += '\n=== PARADIGM DOMINANCE ===\n';
    csv += 'Paradigm ID,Score\n';
    data.paradigmDominance.forEach(entry => {
      csv += `"${entry.id || ''}",${entry.score != null ? entry.score : ''}\n`;
    });
  }

  if (Array.isArray(data.paradigmConflicts) && data.paradigmConflicts.length > 0) {
    csv += '\n=== PARADIGM CONFLICTS ===\n';
    csv += 'Primary,Secondary,Tension,Resolution\n';
    data.paradigmConflicts.forEach(c => {
      csv += `"${(c.primaryName || '').replace(/"/g, '""')}","${(c.secondaryName || '').replace(/"/g, '""')}","${(c.tension || '').replace(/"/g, '""')}","${(c.resolution || '').replace(/"/g, '""')}"\n`;
    });
  }

  if (data.derailerScores && typeof data.derailerScores === 'object') {
    csv += '\n=== DERAILER SCORES ===\n';
    csv += 'Derailer,Score\n';
    Object.entries(data.derailerScores).forEach(([k, v]) => {
      csv += `"${k}",${v}\n`;
    });
  }

  if (Array.isArray(data.remediationPaths) && data.remediationPaths.length > 0) {
    csv += '\n=== REMEDIATION PATHS ===\n';
    csv += 'Type,Priority,Action\n';
    data.remediationPaths.forEach(p => {
      csv += `"${(p.type || '').replace(/"/g, '""')}","${p.priority || ''}","${(p.action || '').replace(/"/g, '""')}"\n`;
    });
  }

  return csv;
}

function generateSovereigntyExport(data) {
  let csv = '=== AI SOVEREIGNTY ANALYSIS DATA ===\n';
  
  // Include ALL questions with their answers (ensure comprehensive coverage)
  if (data.questionSequence && data.questionSequence.length > 0) {
    csv += '\n=== ALL QUESTIONS AND ANSWERS ===\n';
    csv += 'Question ID,Question Text,Answer (0-10),Section,Category,Type\n';
    data.questionSequence.forEach(q => {
      const answer = data.allAnswers && data.allAnswers[q.id] !== undefined ? data.allAnswers[q.id] : 'Not answered';
      const questionText = q.question || q.questionText || '';
      csv += `"${q.id}","${questionText.replace(/"/g, '""')}",${answer},"${q.section || ''}","${q.category || ''}","${q.type || ''}"\n`;
    });
  }
  
  // Include any additional answers not in questionSequence (legacy support)
  if (data.allAnswers && Object.keys(data.allAnswers).length > 0) {
    const questionIds = new Set();
    if (data.questionSequence) {
      data.questionSequence.forEach(q => questionIds.add(q.id));
    }
    const missingAnswers = Object.entries(data.allAnswers).filter(([id]) => !questionIds.has(id));
    if (missingAnswers.length > 0) {
      csv += '\n=== ADDITIONAL ANSWERS (Not in Question Sequence) ===\n';
      csv += 'Question ID,Answer (0-10)\n';
      missingAnswers.forEach(([id, answer]) => {
        csv += `"${id}",${answer}\n`;
      });
    }
  }
  
  if (data.cognitiveBand) {
    csv += '\n=== COGNITIVE BAND ===\n';
    csv += `Band: ${data.cognitiveBand.name || ''}\n`;
    csv += `IQ Range: ${data.cognitiveBand.iqRange || ''}\n`;
  }
  
  if (data.sovereigntyScore !== undefined) {
    csv += '\n=== SOVEREIGNTY METRICS ===\n';
    csv += `Sovereignty Score: ${data.sovereigntyScore}/100\n`;
    csv += `Attachment Mode: ${data.attachmentMode || ''}\n`;
    if (data.sovereignSplitPosition) {
      csv += `Sovereign Split Position: ${data.sovereignSplitPosition.name || ''}\n`;
    }
  }
  
  return csv;
}

export function exportJSON(assessmentData, systemType, systemName) {
  const exportData = {
    exportVersion: EXPORT_VERSION,
    systemType: systemType,
    systemName: systemName,
    timestamp: new Date().toISOString(),
    frameworks: getFrameworksForSystem(systemType),
    assessmentData: assessmentData,
    aiAgentInstructions: {
      systemPrompt: `Use this ${systemName} assessment profile to understand the user's patterns, obstacles, and needs. Focus on sovereignty-aligned support and structural clarity.`,
      primaryFunction: 'Provide coaching, analysis, and guidance based on the identified patterns and priorities in this profile.',
      tone: 'Adjust tone based on severity/priority levels: High = supportive but direct; Moderate = encouraging with strategies; Low = awareness and maintenance.',
      coachingStyle: 'Question-based inquiry that surfaces self-awareness. Support without imposing. Help user recognize patterns and reclaim sovereignty.',
      prioritization: 'Use weighted scores and priority levels as primary metrics. Address high-priority items first.',
      sovereigntyAlignment: 'All guidance should support the user\'s capacity for self-authorship, structural clarity, and reclaiming agency.'
    }
  };
  
  return JSON.stringify(exportData, null, 2);
}

const REPORT_EXPORT_STYLES = `
:root { color-scheme: light dark; }
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.55; margin: 0 auto; max-width: 52rem; padding: 1.5rem 1.25rem 3rem; color: #1a1a1a; background: #fafafa; }
@media (prefers-color-scheme: dark) {
  body { color: #e8e8e8; background: #121212; }
}
h1 { font-size: 1.35rem; margin: 0 0 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
@media (prefers-color-scheme: dark) {
  h1 { border-bottom-color: #444; }
}
h2, h3, h4, h5 { line-height: 1.3; margin-top: 1.35em; margin-bottom: 0.5em; }
p { margin: 0.5em 0; }
ul, ol { margin: 0.5em 0; padding-left: 1.35rem; }
a { color: #0b57d0; }
@media (prefers-color-scheme: dark) {
  a { color: #8ab4f8; }
}
.report-export-meta { font-size: 0.875rem; color: #555; margin-bottom: 1.5rem; }
@media (prefers-color-scheme: dark) {
  .report-export-meta { color: #aaa; }
}
.report-export-section { margin-bottom: 2rem; }
.report-export-section > h2:first-child { margin-top: 0; }
.info-box, .panel-brand-left, .paradigm-result-card, .derailer-item, .remediation-item, .domain-item, .channel-item { margin: 0.75rem 0; padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid #ddd; background: #fff; }
@media (prefers-color-scheme: dark) {
  .info-box, .panel-brand-left, .paradigm-result-card, .derailer-item, .remediation-item, .domain-item, .channel-item { border-color: #444; background: #1e1e1e; }
}
details { margin: 1rem 0; }
summary { cursor: pointer; font-weight: 600; }
table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 0.9rem; }
th, td { border: 1px solid #ccc; padding: 0.35rem 0.5rem; text-align: left; }
@media (prefers-color-scheme: dark) {
  th, td { border-color: #444; }
}
.diagnosis-results-heading { margin-bottom: 1rem; }
.diagnosis-primary-summary {
  margin: 0.75rem 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #f0f6ff;
}
@media (prefers-color-scheme: dark) {
  .diagnosis-primary-summary { border-color: #444; border-left-color: #8ab4f8; background: #1a2740; }
}
.diagnosis-primary-summary__text { margin: 0; line-height: 1.5; }
.diagnosis-primary-summary__link { font-weight: 600; }
.diagnosis-primary-summary__none { opacity: 0.85; }
details.category-group--diagnosis { margin: 1rem 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
@media (prefers-color-scheme: dark) {
  details.category-group--diagnosis { border-color: #444; }
}
details.category-group--diagnosis > summary.category-group-header--diagnosis {
  list-style: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: rgba(0, 123, 255, 0.12);
  font-weight: 600;
}
details.category-group--diagnosis > summary.category-group-header--diagnosis::-webkit-details-marker { display: none; }
details.category-group--diagnosis .category-group-header__title { flex: 1; text-align: left; }
details.category-group--diagnosis .category-group-header__chev { font-size: 0.85rem; opacity: 0.85; }
details.category-group--diagnosis[open] .category-group-header__chev { display: inline-block; transform: rotate(-180deg); }
.category-group-content--diagnosis { padding: 1rem; background: #f9f9f9; }
@media (prefers-color-scheme: dark) {
  .category-group-content--diagnosis { background: #1a1a1a; }
}
.pattern-card--primary {
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #fff;
}
@media (prefers-color-scheme: dark) {
  .pattern-card--primary { border-color: #444; border-left-color: #8ab4f8; background: #1e1e1e; }
}
.pattern-card__title { margin: 0 0 0.65rem; line-height: 1.35; }
.pattern-card__label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 0.3rem;
}
@media (prefers-color-scheme: dark) {
  .pattern-card__label { color: #aaa; }
}
.pattern-card__disorder { display: block; font-size: 1.05rem; font-weight: 700; }
.pattern-card__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; margin-bottom: 0.45rem; }
.pattern-card__score { font-weight: 700; margin-left: auto; }
.alignment-badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #ccc;
}
.alignment-badge--high { background: rgba(40, 167, 69, 0.15); color: #1e7e34; border-color: rgba(40, 167, 69, 0.35); }
.alignment-badge--med { background: rgba(11, 87, 208, 0.1); color: #0b57d0; border-color: rgba(11, 87, 208, 0.25); }
.alignment-badge--low { background: rgba(128, 128, 128, 0.12); color: #555; }
@media (prefers-color-scheme: dark) {
  .alignment-badge--low { color: #bbb; }
}
.pattern-score-bar { height: 6px; border-radius: 999px; background: #e0e0e0; overflow: hidden; }
.pattern-score-bar--compact { height: 4px; margin-top: 0.3rem; }
.pattern-score-bar__fill { display: block; height: 100%; background: linear-gradient(90deg, #0b57d0, #34a853); border-radius: inherit; min-width: 2px; }
.pattern-signals-intro { margin: 0 0 0.55rem; font-size: 0.85rem; color: #555; }
@media (prefers-color-scheme: dark) {
  .pattern-signals-intro { color: #aaa; }
}
.pattern-signals { list-style: none; margin: 0; padding: 0; }
.pattern-row {
  margin-bottom: 0.55rem;
  padding: 0.65rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #34a853;
  background: #fff;
}
.pattern-row:last-child { margin-bottom: 0; }
.pattern-row__main { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 0.55rem; }
.pattern-row__name { font-weight: 600; flex: 1 1 10rem; min-width: 0; }
.pattern-row__score { font-size: 0.88rem; font-weight: 600; color: #555; }
@media (prefers-color-scheme: dark) {
  .pattern-row { border-color: #444; background: #1e1e1e; }
  .pattern-row__score { color: #aaa; }
}
.pattern-row--tier-1 { border-left-color: #34a853; }
.pattern-row--tier-2 { border-left-color: #0b57d0; padding: 0.6rem 0.75rem; background: #fafafa; }
.pattern-row--tier-3 { border-left-color: #888; padding: 0.55rem 0.72rem; background: #f5f5f5; }
.pattern-row--tier-4 { border-left-color: #ccc; border-left-width: 3px; padding: 0.5rem 0.68rem; background: #f0f0f0; }
.pattern-row--tier-5 { border-left-color: #ccc; border-left-width: 2px; padding: 0.45rem 0.62rem; background: #ebebeb; font-size: 0.9rem; }
@media (prefers-color-scheme: dark) {
  .pattern-row--tier-2 { background: #222; }
  .pattern-row--tier-3 { background: #242424; }
  .pattern-row--tier-4 { background: #262626; }
  .pattern-row--tier-5 { background: #282828; }
}
.coaching-impact-heading { color: #0b57d0; margin-top: 0; }
@media (prefers-color-scheme: dark) {
  .coaching-impact-heading { color: #8ab4f8; }
}
.coaching-impact-lead { color: #555; line-height: 1.6; margin: 0 0 1.1rem; }
@media (prefers-color-scheme: dark) {
  .coaching-impact-lead { color: #aaa; }
}
.coaching-primary-focus {
  margin: 0 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #f0f6ff;
}
@media (prefers-color-scheme: dark) {
  .coaching-primary-focus { border-color: #444; border-left-color: #8ab4f8; background: #1a2740; }
}
.coaching-primary-focus__text { margin: 0; line-height: 1.5; }
.coaching-primary-focus__link { font-weight: 600; }
.coaching-domains-heading { margin: 0 0 0.45rem; color: #0b57d0; }
@media (prefers-color-scheme: dark) {
  .coaching-domains-heading { color: #8ab4f8; }
}
.coaching-domains-intro { margin: 0 0 0.9rem; font-size: 0.92rem; color: #555; line-height: 1.55; }
@media (prefers-color-scheme: dark) {
  .coaching-domains-intro { color: #aaa; }
}
.coaching-aspects-label {
  font-weight: 700;
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #666;
  margin-right: 0.3rem;
}
.coaching-aspects-label::after { content: ':'; }
@media (prefers-color-scheme: dark) {
  .coaching-aspects-label { color: #999; }
}
.coaching-domain-card--featured {
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #0b57d0;
  background: #fff;
}
@media (prefers-color-scheme: dark) {
  .coaching-domain-card--featured { border-color: #444; border-left-color: #8ab4f8; background: #1e1e1e; }
}
.coaching-domain-card__meta { display: flex; align-items: flex-start; gap: 0.65rem; margin-bottom: 0.5rem; }
.coaching-domain-card__rank {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.9rem;
  background: #0b57d0;
  color: #fff;
}
.coaching-domain-card__title { margin: 0; font-size: 1.05rem; font-weight: 700; flex: 1; min-width: 0; line-height: 1.35; }
.coaching-domain-card__aspects { margin: 0; line-height: 1.5; font-size: 0.92rem; }
.coaching-domain-signals-intro { margin: 0 0 0.5rem; font-size: 0.85rem; color: #555; }
@media (prefers-color-scheme: dark) {
  .coaching-domain-signals-intro { color: #aaa; }
}
.coaching-domain-signals { list-style: none; margin: 0 0 1rem; padding: 0; }
.coaching-domain-row {
  margin-bottom: 0.55rem;
  padding: 0.65rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #34a853;
  background: #fff;
}
.coaching-domain-row:last-child { margin-bottom: 0; }
.coaching-domain-row__main { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.35rem; }
.coaching-domain-row__rank { flex-shrink: 0; min-width: 1.5rem; font-weight: 800; font-size: 0.82rem; color: #666; }
.coaching-domain-row__name { font-weight: 600; flex: 1; min-width: 0; line-height: 1.35; }
.coaching-domain-row__aspects { margin: 0; font-size: 0.86rem; line-height: 1.45; color: #555; }
@media (prefers-color-scheme: dark) {
  .coaching-domain-row { border-color: #444; background: #1e1e1e; }
  .coaching-domain-row__rank { color: #999; }
  .coaching-domain-row__aspects { color: #aaa; }
}
.coaching-domain-row--tier-2 { border-left-color: #34a853; }
.coaching-domain-row--tier-3 { border-left-color: #0b57d0; padding: 0.6rem 0.75rem; background: #fafafa; }
.coaching-domain-row--tier-4 { border-left-color: #888; padding: 0.55rem 0.72rem; background: #f5f5f5; }
.coaching-domain-row--tier-5 { border-left-color: #ccc; border-left-width: 3px; padding: 0.5rem 0.68rem; background: #f0f0f0; font-size: 0.9rem; }
@media (prefers-color-scheme: dark) {
  .coaching-domain-row--tier-3 { background: #222; }
  .coaching-domain-row--tier-4 { background: #242424; }
  .coaching-domain-row--tier-5 { background: #262626; }
}
.coaching-micro-step {
  margin: 0 0 1.1rem;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border-left: 4px solid #34a853;
  background: #f5faf6;
  line-height: 1.5;
  font-size: 0.9rem;
}
@media (prefers-color-scheme: dark) {
  .coaching-micro-step { background: #1a2a22; border-left-color: #34a853; }
}
.coaching-stabilizing-card {
  margin: 1.1rem 0;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  border: 1px dashed #ccc;
  background: #fafafa;
}
@media (prefers-color-scheme: dark) {
  .coaching-stabilizing-card { border-color: #555; background: #222; }
}
.coaching-stabilizing-card__title { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; color: #666; margin-bottom: 0.3rem; }
.coaching-stabilizing-card__name { margin: 0 0 0.45rem; font-weight: 700; font-size: 0.98rem; }
.coaching-stabilizing-card__note { margin: 0; font-size: 0.88rem; color: #555; line-height: 1.45; }
@media (prefers-color-scheme: dark) {
  .coaching-stabilizing-card__note { color: #aaa; }
}
.coaching-profile-reminder { margin: 0; font-size: 0.88rem; color: #555; line-height: 1.5; }
@media (prefers-color-scheme: dark) {
  .coaching-profile-reminder { color: #aaa; }
}
.needs-dep-primary-heading { margin-top: 0; }
.needs-dep-sourcing-highlight {
  margin: 0 0 0.85rem;
  padding: 0.75rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left-width: 4px;
  border-left-style: solid;
}
.needs-dep-sourcing-highlight--avoidant { border-left-color: #0b57d0; background: #eef5ff; }
.needs-dep-sourcing-highlight--compulsive { border-left-color: #c62828; background: #fcefef; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-highlight { border-color: #444; }
  .needs-dep-sourcing-highlight--avoidant { border-left-color: #8ab4f8; background: #1a2740; }
  .needs-dep-sourcing-highlight--compulsive { border-left-color: #ef9a9a; background: #2a1f1f; }
}
.needs-dep-sourcing-label { display: block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #666; margin-bottom: 0.3rem; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-label { color: #999; }
}
.needs-dep-sourcing-title { display: block; font-size: 1rem; font-weight: 800; line-height: 1.25; }
.needs-dep-sourcing-highlight--avoidant .needs-dep-sourcing-title { color: #0b57d0; }
.needs-dep-sourcing-highlight--compulsive .needs-dep-sourcing-title { color: #c62828; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-highlight--avoidant .needs-dep-sourcing-title { color: #8ab4f8; }
  .needs-dep-sourcing-highlight--compulsive .needs-dep-sourcing-title { color: #ef9a9a; }
}
.needs-dep-sourcing-desc { margin: 0.4rem 0 0; font-size: 0.88rem; line-height: 1.45; color: #555; }
@media (prefers-color-scheme: dark) {
  .needs-dep-sourcing-desc { color: #aaa; }
}
.needs-dep-loop-card--featured {
  border-left: 4px solid #0b57d0;
  background: #f8fbff;
}
@media (prefers-color-scheme: dark) {
  .needs-dep-loop-card--featured { border-left-color: #8ab4f8; background: #1e2838; }
}
.needs-dep-loop-header { margin-bottom: 0.65rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem; }
.needs-dep-loop-title { margin: 0; font-size: 1.1rem; }
.needs-dep-confidence-badge {
  font-size: 0.82rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #ccc;
  font-weight: 600;
}
@media (prefers-color-scheme: dark) {
  .needs-dep-confidence-badge { border-color: #555; }
}
.needs-dep-vice-note { margin: 0 0 0.85rem; line-height: 1.5; font-size: 0.92rem; }
.needs-dep-loop-details { margin-top: 0.2rem; }
.needs-dep-secondary-intro { margin: 0 0 0.65rem; font-size: 0.88rem; color: #555; line-height: 1.45; }
@media (prefers-color-scheme: dark) {
  .needs-dep-secondary-intro { color: #aaa; }
}
.needs-dep-secondary-signals { list-style: none; margin: 0; padding: 0; }
.needs-dep-secondary-row {
  margin-bottom: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  border-left: 4px solid #34a853;
  background: #fff;
}
.needs-dep-secondary-row:last-child { margin-bottom: 0; }
.needs-dep-secondary-row__name { font-weight: 600; }
@media (prefers-color-scheme: dark) {
  .needs-dep-secondary-row { border-color: #444; background: #1e1e1e; }
}
.needs-dep-secondary-row--tier-2 { border-left-color: #34a853; }
.needs-dep-secondary-row--tier-3 { border-left-color: #0b57d0; background: #fafafa; }
.needs-dep-secondary-row--tier-4 { border-left-color: #888; background: #f5f5f5; }
.needs-dep-secondary-row--tier-5 { border-left-color: #ccc; border-left-width: 3px; background: #f0f0f0; font-size: 0.9rem; }
@media (prefers-color-scheme: dark) {
  .needs-dep-secondary-row--tier-3 { background: #222; }
  .needs-dep-secondary-row--tier-4 { background: #242424; }
  .needs-dep-secondary-row--tier-5 { background: #262626; }
}
`;

function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Build a self-contained HTML file from visible report DOM (offline-friendly).
 * @param {object} options
 * @param {string} [options.title] - Document title
 * @param {string} [options.filenameBase] - Download filename without extension
 * @param {string} [options.rootSelector] - Single root to clone
 * @param {string|string[]} [options.rootSelectors] - Multiple roots (concatenated in order)
 */
export function downloadReportHtml(options = {}) {
  const {
    title = 'Assessment report',
    filenameBase = 'report',
    rootSelector,
    rootSelectors
  } = options;

  const selectors = rootSelectors
    ? (Array.isArray(rootSelectors) ? rootSelectors : [rootSelectors])
    : rootSelector
      ? [rootSelector]
      : [];

  if (!selectors.length || typeof document === 'undefined') {
    return false;
  }

  const fragments = [];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const clone = el.cloneNode(true);
    clone.querySelectorAll('button, .export-section, [data-no-export], script, style[data-live-only]').forEach(node => {
      node.remove();
    });
    fragments.push(`<div class="report-export-section">${clone.innerHTML}</div>`);
  }

  if (!fragments.length) {
    return false;
  }

  const safeTitle = escapeHtml(title);
  const generated = escapeHtml(new Date().toISOString());
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>${REPORT_EXPORT_STYLES}</style>
</head>
<body>
<h1>${safeTitle}</h1>
<p class="report-export-meta">Exported ${generated}</p>
${fragments.join('\n')}
</body>
</html>`;

  const safeBase = String(filenameBase).replace(/[^a-z0-9-_]+/gi, '_').replace(/^_|_$/g, '') || 'report';
  downloadFile(html, `${safeBase}.html`, 'text/html;charset=utf-8');
  return true;
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

