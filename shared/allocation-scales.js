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
 * Split an integer total evenly across ids (largest-remainder).
 */
function splitEvenly(ids, total) {
  if (!ids.length) return {};
  const shares = ids.map((id) => {
    const ideal = total / ids.length;
    const floor = Math.floor(ideal);
    return { id, floor, frac: ideal - floor };
  });
  const out = {};
  shares.forEach((s) => {
    out[s.id] = s.floor;
  });
  let leftover = total - shares.reduce((s, x) => s + x.floor, 0);
  if (leftover > 0) {
    const byFrac = [...shares].sort((a, b) => b.frac - a.frac || a.id.localeCompare(b.id));
    for (let i = 0; i < leftover; i++) {
      out[byFrac[i].id] += 1;
    }
  }
  return out;
}

/**
 * When one slider changes, redistribute the remainder across other keys with weight > 0,
 * in proportion to each key's prior value (zeros stay at 0 unless all others are zero and
 * the changed slider increased — then remainder is split evenly). The changed slider is pinned.
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
  const out = { [changedId]: clamped };

  if (remainder <= 0) {
    others.forEach((id) => {
      out[id] = 0;
    });
    return out;
  }

  const activeOthers = others.filter((id) => (Number(weights[id]) || 0) > 0);
  const poolSum = activeOthers.reduce((s, id) => s + (Number(weights[id]) || 0), 0);

  others.forEach((id) => {
    if (!activeOthers.includes(id)) {
      out[id] = 0;
    }
  });

  if (poolSum <= 0) {
    const priorChanged = Number(weights[changedId]) || 0;
    if (clamped > priorChanged) {
      Object.assign(out, splitEvenly(others, remainder));
    }
    return out;
  }

  const shares = activeOthers.map((id) => {
    const ideal = ((Number(weights[id]) || 0) / poolSum) * remainder;
    const floor = Math.floor(ideal);
    return { id, floor, frac: ideal - floor };
  });

  shares.forEach((s) => {
    out[s.id] = s.floor;
  });

  let leftover = remainder - shares.reduce((s, x) => s + x.floor, 0);
  if (leftover > 0) {
    const byFrac = [...shares].sort((a, b) => b.frac - a.frac || a.id.localeCompare(b.id));
    for (let i = 0; i < leftover; i++) {
      out[byFrac[i].id] += 1;
    }
  }

  return out;
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
