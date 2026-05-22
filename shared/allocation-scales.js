/**
 * Canonical allocation / multiselect-weight answer shapes for BeliefMastery engines.
 *
 * Answer shapes:
 * - single: number
 * - multiselect: string[]
 * - allocation: { ids: string[], weights: Record<string, number>, sum: number, version?: string }
 * - ranked: { order: string[] }
 */

export const ALLOCATION_ANSWER_VERSION = '1.0';

export function createEmptyWeights(ids, defaultEach = null) {
  const weights = {};
  const n = ids.length;
  const each = defaultEach ?? (n ? Math.round(100 / n) : 0);
  let assigned = 0;
  ids.forEach((id, i) => {
    const w = i === n - 1 ? 100 - assigned : each;
    weights[id] = w;
    assigned += w;
  });
  return weights;
}

export function sumWeights(weights) {
  return Object.values(weights).reduce((a, b) => a + (Number(b) || 0), 0);
}

/**
 * Clamp and normalize weights to targetSum (default 100).
 */
export function normalizeAllocation(weights, targetSum = 100) {
  const ids = Object.keys(weights);
  if (!ids.length) return {};
  const raw = ids.map((id) => Math.max(0, Number(weights[id]) || 0));
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) {
    return createEmptyWeights(ids);
  }
  const out = {};
  let assigned = 0;
  ids.forEach((id, i) => {
    if (i === ids.length - 1) {
      out[id] = Math.max(0, targetSum - assigned);
    } else {
      const w = Math.round((raw[i] / total) * targetSum);
      out[id] = w;
      assigned += w;
    }
  });
  return out;
}

/**
 * When one slider changes, redistribute the remainder proportionally across other keys.
 */
export function redistributeOnChange(changedId, newValue, weights, targetSum = 100) {
  const ids = Object.keys(weights);
  if (!ids.includes(changedId)) return { ...weights };
  const clamped = Math.max(0, Math.min(targetSum, Math.round(Number(newValue) || 0)));
  const others = ids.filter((id) => id !== changedId);
  if (!others.length) {
    return { [changedId]: targetSum };
  }
  const remainder = targetSum - clamped;
  const otherSum = others.reduce((s, id) => s + (Number(weights[id]) || 0), 0);
  const out = { [changedId]: clamped };
  if (remainder <= 0) {
    others.forEach((id) => {
      out[id] = 0;
    });
    return out;
  }
  if (otherSum <= 0) {
    const each = Math.floor(remainder / others.length);
    let assigned = 0;
    others.forEach((id, i) => {
      const w = i === others.length - 1 ? remainder - assigned : each;
      out[id] = w;
      assigned += w;
    });
    return out;
  }
  let assigned = 0;
  others.forEach((id, i) => {
    if (i === others.length - 1) {
      out[id] = remainder - assigned;
    } else {
      const w = Math.round(((Number(weights[id]) || 0) / otherSum) * remainder);
      out[id] = w;
      assigned += w;
    }
  });
  return normalizeAllocation(out, targetSum);
}

/**
 * Map allocation percent (0–100) to legacy 1–7 scaled answer for scoring parity.
 */
export function allocationWeightToScale7(weightPercent) {
  const p = Math.max(0, Math.min(100, Number(weightPercent) || 0));
  return 1 + (p / 100) * 6;
}

export function buildAllocationAnswer(ids, weights, targetSum = 100) {
  const normalized = normalizeAllocation(weights, targetSum);
  return {
    ids: [...ids],
    weights: normalized,
    sum: targetSum,
    version: ALLOCATION_ANSWER_VERSION,
  };
}
