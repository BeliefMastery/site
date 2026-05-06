/**
 * Suite tool completion — reads the same DataStore keys each engine uses
 * (`{namespace}:progress` JSON payloads with `.data` inner object).
 */

export const SUITE_TOOL_DEFS = [
  { id: 'diagnosis', label: 'Symptom checklist', href: 'diagnosis.html', namespace: 'diagnosis-assessment' },
  { id: 'coaching', label: 'Life areas review', href: 'coaching.html', namespace: 'coaching-assessment' },
  { id: 'needs-dependency', label: 'Dependency loops', href: 'needs-dependency.html', namespace: 'needs-dependency-assessment' },
  { id: 'sovereignty-spectrum', label: 'Your sovereignty lens', href: 'sovereignty-spectrum.html', namespace: 'spectrum-assessment' },
  { id: 'paradigm', label: 'Meaning map', href: 'paradigm.html', namespace: 'paradigm-assessment' },
  { id: 'manipulation', label: 'Influence patterns', href: 'manipulation.html', namespace: 'manipulation-assessment' },
  { id: 'sovereignty', label: 'Mental steadiness', href: 'sovereignty.html', namespace: 'sovereignty-assessment' },
  { id: 'channels', label: 'Inner channel flow', href: 'channels.html', namespace: 'channels-assessment' },
  { id: 'character-sheet', label: 'Character sheet', href: 'character-sheet.html', namespace: 'character-sheet' },
  { id: 'entities', label: 'Will and edges', href: 'entities.html', namespace: 'entities-assessment' },
  { id: 'outlier-aptitude', label: 'Aptitude map', href: 'outlier-aptitude.html', namespace: 'outlier-aptitude-assessment' }
];

function unwrapPayload(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  if ('data' in parsed && parsed.data !== undefined) return parsed.data;
  return parsed;
}

function readDataStoreKey(namespace, key) {
  const fullKey = `${namespace}:${key}`;
  for (const storage of [window.localStorage, window.sessionStorage]) {
    const raw = storage.getItem(fullKey);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const data = unwrapPayload(parsed);
      if (data && typeof data === 'object') return data;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function readLegacySovereigntyProgress() {
  try {
    const raw = window.localStorage.getItem('sovereigntyAssessment')
      || window.sessionStorage.getItem('sovereigntyAssessment');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function isToolComplete(def) {
  let progress = readDataStoreKey(def.namespace, 'progress');
  if (!progress && def.id === 'sovereignty') {
    progress = readLegacySovereigntyProgress();
  }
  if (progress) {
    if (progress.reportComplete === true || progress.completed === true || progress.results) return true;
    if (progress.currentStage === 'results') return true;
  }
  if (def.id === 'character-sheet') {
    const character = readDataStoreKey(def.namespace, 'character');
    if (character && typeof character === 'object' && Object.keys(character).length > 0) return true;
  }
  return false;
}

export function getSuiteCompletion() {
  const items = SUITE_TOOL_DEFS.map((def) => ({
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
