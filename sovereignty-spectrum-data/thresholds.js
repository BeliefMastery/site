// Integration Level Thresholds - 0-100 scale labels measuring consistency with identified paradigm

export const SPECTRUM_THRESHOLDS = {
  0: 'Low Integration: Reluctant abdication; hypocrisy erodes intent with your identified paradigm',
  25: 'Emerging Integration: Paradigm identification present but commitment inconsistent',
  50: 'Developing Integration: Values align with identified paradigm but practical actions lag',
  75: 'Strong Integration: Living consistently according to your identified paradigm; minimal value-action gaps',
  100: 'Full Integration: Complete alignment with identified paradigm; hypocrisy resolved; nihilism alchemized'
};

// Helper function to get threshold label for a given score
export function getSpectrumLabel(score) {
  if (score < 25) return SPECTRUM_THRESHOLDS[0];
  if (score < 50) return SPECTRUM_THRESHOLDS[25];
  if (score < 75) return SPECTRUM_THRESHOLDS[50];
  if (score < 100) return SPECTRUM_THRESHOLDS[75];
  return SPECTRUM_THRESHOLDS[100];
}

