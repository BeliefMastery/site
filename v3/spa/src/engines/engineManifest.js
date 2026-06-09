/**
 * Single source of truth for V3 native assessment engines.
 * @typedef {'questionnaire' | 'externalShell' | 'diagnosis'} EngineViewType
 */

/** @type {Array<{ id: string, className: string, viewType: EngineViewType, path: string, label: string, hostClassName?: string, loadingMessage?: string, copy: object }>} */
export const ENGINE_MANIFEST = [
  {
    id: 'diagnosis',
    className: 'DiagnosisEngine',
    viewType: 'diagnosis',
    path: '/engines/diagnosis',
    label: 'Pathology Assessment',
    copy: {
      lead: 'Educational DSM-5 symptom mapping for pattern clarity—not a substitute for clinical assessment.',
      selectionTitle: 'Select diagnostic categories',
      selectionAdapter: 'categories',
      abandonMethod: 'abandonAssessment',
      sliderStep: 0.5,
      showRefinementOffer: true,
      explanationTitle: 'Extended explanation',
      explanationParagraphs: [
        'Choose the diagnostic categories you wish to explore. You can select multiple categories for a broader picture.',
        'Educational mode: for pattern recognition and preparation for professional dialogue—not diagnosis.',
      ],
    },
  },
  {
    id: 'coaching',
    className: 'CoachingEngine',
    viewType: 'questionnaire',
    path: '/engines/coaching',
    label: 'Life Domain Review',
    copy: {
      lead: 'Map obstacles to sovereignty and satisfaction across life domains.',
      selectionTitle: 'Select assessment sections',
      selectionHint: 'Both sections are selected by default; adjust if you want a narrower review.',
      defaultSelections: ['obstacles', 'domains'],
      explanationText:
        'Review the 15 obstacles to sovereignty and/or satisfaction across ten life domains. Higher obstacle scores mean greater constraints; higher domain scores mean greater satisfaction.',
    },
  },
  {
    id: 'needs-dependency',
    className: 'NeedsDependencyEngine',
    viewType: 'questionnaire',
    path: '/engines/needs-dependency',
    label: 'Dependency Loop Tracer',
    copy: {
      lead: 'Trace dependency loops across needs, patterns, and compulsions in four phases.',
      explanationText:
        'Four phases: gateway patterns, loop identification, need chains, and integration. Allow 15–25 minutes for a full pass.',
    },
  },
  {
    id: 'sovereignty-spectrum',
    className: 'SovereigntySpectrumEngine',
    viewType: 'questionnaire',
    path: '/engines/sovereignty-spectrum',
    label: 'Your Sovereignty Paradigm',
    copy: {
      lead: 'Identify your sovereignty paradigm and how integrated you are with it.',
      explanationText:
        'Rate paradigm alignment, intents and practicalities, and derailers to locate your position on the sovereignty spectrum.',
    },
  },
  {
    id: 'paradigm',
    className: 'ParadigmEngine',
    viewType: 'questionnaire',
    path: '/engines/paradigm',
    label: 'Logos Structure',
    copy: {
      lead: 'Discover how you organize meaning through Good Life and God-perspective paradigms.',
      explanationText:
        'Three phases explore Good Life and God-perspective paradigms through scenarios, rankings, and scaled items.',
    },
  },
  {
    id: 'manipulation',
    className: 'ManipulationEngine',
    viewType: 'questionnaire',
    path: '/engines/manipulation',
    label: 'Manipulation Defense Decoder',
    copy: {
      lead: 'Decode manipulation vectors and tactics that may be shaping your choices.',
      explanationText:
        'Screen vectors, prioritize areas of concern, then assess tactics and structural modifiers.',
    },
  },
  {
    id: 'sovereignty',
    className: 'SovereigntyEngine',
    viewType: 'externalShell',
    path: '/engines/sovereignty',
    label: 'Cognitive Resistance Capacity',
    hostClassName: 'bm-sovereignty-host',
    copy: {
      lead: 'Assess cognitive resistance capacity, AI dependency, and sovereignty alignment.',
    },
  },
  {
    id: 'channels',
    className: 'ChannelsEngine',
    viewType: 'questionnaire',
    path: '/engines/channels',
    label: 'Channel Flow Diagnostics',
    copy: {
      lead: 'Diagnose open and closed channels across nodes and remediation paths.',
      explanationText:
        'Four phases map node abundance, channel priorities, channel depth, and remediation strategies.',
    },
  },
  {
    id: 'character-sheet',
    className: 'CharacterSheetEngine',
    viewType: 'externalShell',
    path: '/engines/character-sheet',
    label: 'Astrological Character Sheet',
    hostClassName: 'bm-character-sheet-host',
    loadingMessage: 'Loading character sheet generator…',
    copy: {
      lead: 'Generate a D&D-style character sheet from birth data and astrological inputs.',
    },
  },
  {
    id: 'entities',
    className: 'EntitiesEngine',
    viewType: 'externalShell',
    path: '/engines/entities',
    label: 'Will Anomaly Mapping',
    hostClassName: 'bm-entities-host',
    copy: {
      lead: 'Map will anomalies, taste skews, and contract themes from your intake profile.',
    },
  },
  {
    id: 'outlier-aptitude',
    className: 'OutlierAptitudeEngine',
    viewType: 'externalShell',
    path: '/engines/outlier-aptitude',
    label: 'Aptitude Mapping',
    hostClassName: 'bm-outlier-host',
    copy: {
      lead: 'Project aptitude dimensions onto market roles and validation prompts.',
    },
  },
];

/** @param {string} id */
export function getEngineManifestEntry(id) {
  return ENGINE_MANIFEST.find((entry) => entry.id === id);
}

export const engineLoaders = {
  diagnosis: () => import('@site/diagnosis-engine.js'),
  coaching: () => import('@site/coaching-engine.js'),
  'needs-dependency': () => import('@site/needs-dependency-engine.js'),
  'sovereignty-spectrum': () => import('@site/sovereignty-spectrum-engine.js'),
  paradigm: () => import('@site/paradigm-engine.js'),
  manipulation: () => import('@site/manipulation-engine.js'),
  sovereignty: () => import('@site/sovereignty-engine.js'),
  channels: () => import('@site/channels-engine.js'),
  'character-sheet': () => import('@site/character-sheet-engine.js'),
  entities: () => import('@site/entities-engine.js'),
  'outlier-aptitude': () => import('@site/outlier-aptitude-engine.js'),
};

export const engineClassNames = Object.fromEntries(
  ENGINE_MANIFEST.map((entry) => [entry.id, entry.className])
);

export const engineRoutes = ENGINE_MANIFEST.map(({ id, path, label }) => ({ id, path, label }));

/** Copy keyed by engine id (backward compatible with engineNativeConfig). */
export const engineNativeCopy = Object.fromEntries(
  ENGINE_MANIFEST.map((entry) => [entry.id, entry.copy])
);
