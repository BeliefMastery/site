/** Lazy imports for repo-root engines (Vite @site alias). */

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
