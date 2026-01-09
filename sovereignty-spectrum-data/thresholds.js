// Spectrum Thresholds - 0-100 scale labels for sovereignty spectrum position

export const SPECTRUM_THRESHOLDS = {
  0: 'Nihilistic Fragmentation (Reluctant abdication; hypocrisy erodes intent)',
  25: 'Reactive Dependence (Paradigm sampling without commitment)',
  50: 'Emergent Alignment (Values clash with practicalities)',
  75: 'Reflective Integration (Intents drive actions; minimal reluctance)',
  100: 'Paradigm-Transcendent Sovereignty (Hypocrisy resolved; nihilism alchemized)'
};

// Helper function to get threshold label for a given score
export function getSpectrumLabel(score) {
  if (score < 25) return SPECTRUM_THRESHOLDS[0];
  if (score < 50) return SPECTRUM_THRESHOLDS[25];
  if (score < 75) return SPECTRUM_THRESHOLDS[50];
  if (score < 100) return SPECTRUM_THRESHOLDS[75];
  return SPECTRUM_THRESHOLDS[100];
}

