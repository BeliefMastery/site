const TOOL_DEFINITIONS = [
  { id: 'diagnosis', label: 'Pathology Assessment', href: 'diagnosis.html', storageKey: 'diagnosisAssessment' },
  { id: 'coaching', label: 'Life Domain Review', href: 'coaching.html', storageKey: 'coachingAssessment' },
  { id: 'needs-dependency', label: 'Dependency Loop Tracer', href: 'needs-dependency.html', storageKey: 'needsDependencyAssessment' },
  { id: 'sovereignty-spectrum', label: 'Your Sovereignty Paradigm', href: 'sovereignty-spectrum.html', storageKey: 'sovereigntySpectrumAssessment' },
  { id: 'paradigm', label: 'Logos Structure', href: 'paradigm.html', storageKey: 'paradigmAssessment' },
  { id: 'manipulation', label: 'Manipulation Defense Decoder', href: 'manipulation.html', storageKey: 'manipulationAssessment' },
  { id: 'sovereignty', label: 'Cognitive Resistance Capacity', href: 'sovereignty.html', storageKey: 'sovereigntyAssessment' },
  { id: 'channels', label: 'Channel Flow Diagnostics', href: 'channels.html', storageKey: 'channelsAssessment' },
  { id: 'character-sheet', label: 'Astrological Character Sheet', href: 'character-sheet.html', storageKey: 'characterSheetAssessment' },
  { id: 'entities', label: 'Will Anomaly Mapping', href: 'entities.html', storageKey: 'entitiesAssessment' },
  { id: 'outlier-aptitude', label: 'Aptitude Mapping', href: 'outlier-aptitude.html', storageKey: 'outlierAptitudeAssessment' }
];

function safeReadJson(storage, key) {
  try {
    const value = storage.getItem(key);
    if (!value) return null;
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function isToolComplete(def) {
  const local = safeReadJson(window.localStorage, def.storageKey);
  const session = safeReadJson(window.sessionStorage, def.storageKey);
  const data = local || session;
  if (!data || typeof data !== 'object') return false;
  return Boolean(data.completed || data.results || data.report || data.timestamp);
}

export function getSuiteCompletion() {
  const items = TOOL_DEFINITIONS.map((def) => ({
    ...def,
    completed: isToolComplete(def)
  }));
  const completeCount = items.filter((item) => item.completed).length;
  return {
    items,
    completeCount,
    totalCount: items.length,
    isAllComplete: completeCount === items.length
  };
}
