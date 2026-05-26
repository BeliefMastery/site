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

/** Internal units per 1% (10 → 0.1% steps, 1000 units = 100%). */
export const ALLOCATION_PRECISION = 10;

export const DEFAULT_ALLOCATION_TARGET = 100 * ALLOCATION_PRECISION;

export function getAllocationTargetSum(questionOrTarget) {
  if (questionOrTarget != null && typeof questionOrTarget === 'object') {
    return questionOrTarget.allocationTargetSum ?? DEFAULT_ALLOCATION_TARGET;
  }
  return questionOrTarget ?? DEFAULT_ALLOCATION_TARGET;
}

/** Display percent string from internal units (e.g. 705 → "70.5"). */
export function formatAllocationPercent(units, targetSum = DEFAULT_ALLOCATION_TARGET) {
  const t = targetSum > 0 ? targetSum : DEFAULT_ALLOCATION_TARGET;
  const pct = ((Number(units) || 0) / t) * 100;
  const rounded = Math.round(pct * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Parse slider/display percent to internal units. */
export function parseAllocationPercentInput(displayValue) {
  return Math.max(0, Math.round((Number(displayValue) || 0) * ALLOCATION_PRECISION));
}

/** Upgrade legacy integer-percent answers (sum ≤ 100) to tenths scale. */
export function maybeUpgradeAllocationWeights(weights, targetSum = DEFAULT_ALLOCATION_TARGET) {
  if (targetSum !== DEFAULT_ALLOCATION_TARGET) return { ...weights };
  const vals = Object.values(weights).map((v) => Number(v) || 0);
  const sum = vals.reduce((a, b) => a + b, 0);
  const max = vals.length ? Math.max(...vals) : 0;
  if (sum <= 100 && max <= 100) {
    const out = {};
    Object.entries(weights).forEach(([id, w]) => {
      out[id] = Math.round((Number(w) || 0) * ALLOCATION_PRECISION);
    });
    return out;
  }
  return { ...weights };
}

export function createEmptyWeights(ids, defaultEach = null, targetSum = DEFAULT_ALLOCATION_TARGET) {
  const weights = {};
  const n = ids.length;
  const each = defaultEach ?? (n ? Math.round(targetSum / n) : 0);
  let assigned = 0;
  ids.forEach((id, i) => {
    const w = i === n - 1 ? targetSum - assigned : each;
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
 * Proportional integer split with stronger spread: minimum 1 unit per axis when budget allows,
 * then D'Hondt for the remainder (still weighted by prior share).
 */
function splitProportionalDeltaSpread(ids, prior, deltaPoints) {
  if (!ids.length || deltaPoints <= 0) return {};
  const poolSum = ids.reduce((s, id) => s + (prior[id] || 0), 0);
  if (poolSum <= 0) return splitEvenly(ids, deltaPoints);

  const out = Object.fromEntries(ids.map((id) => [id, 0]));
  let budget = deltaPoints;
  const n = ids.length;

  if (budget >= n) {
    const byAsc = [...ids].sort(
      (a, b) => (prior[a] || 0) - (prior[b] || 0) || a.localeCompare(b)
    );
    for (const id of byAsc) {
      out[id] += 1;
      budget -= 1;
    }
  }

  for (let k = 0; k < budget; k++) {
    let best = ids[0];
    let bestScore = -1;
    for (const id of ids) {
      const score = (prior[id] || 0) / (out[id] + 1);
      if (score > bestScore || (score === bestScore && id.localeCompare(best) < 0)) {
        bestScore = score;
        best = id;
      }
    }
    out[best] += 1;
  }
  return out;
}

/**
 * When |delta| is large enough, nudge 1 point from the largest mover to stuck non-zero axes
 * so multi-point drags visibly update every active slider (sum preserved).
 */
function applyStagnationGuard(out, prior, activeOthers, delta) {
  const absDelta = Math.abs(delta);
  if (absDelta < Math.max(2, activeOthers.length)) return;

  const isIncrease = delta > 0;
  let stuck = activeOthers.filter((id) => prior[id] >= 1 && out[id] === prior[id]);
  while (stuck.length) {
    let maxMover = null;
    let maxChange = 0;
    for (const id of activeOthers) {
      const change = Math.abs(out[id] - prior[id]);
      if (change > maxChange) {
        maxChange = change;
        maxMover = id;
      }
    }
    if (!maxMover || maxChange < 1) break;

    const recipient = [...stuck].sort(
      (a, b) => (prior[b] || 0) - (prior[a] || 0) || a.localeCompare(b)
    )[0];

    if (isIncrease) {
      if (out[maxMover] >= prior[maxMover]) break;
      out[maxMover] += 1;
      out[recipient] = Math.max(0, out[recipient] - 1);
    } else {
      if (out[maxMover] <= prior[maxMover]) break;
      out[maxMover] -= 1;
      out[recipient] += 1;
    }

    if (out[recipient] === prior[recipient]) {
      stuck = stuck.filter((id) => id !== recipient);
    } else {
      stuck = activeOthers.filter((id) => prior[id] >= 1 && out[id] === prior[id]);
    }
  }
}

/**
 * When one slider changes, redistribute across other keys by prior share among non-zero others.
 * - Non-zero others: proportional delta (take/give integer points via largest-remainder).
 * - Zero others: stay 0 until the user raises them.
 * - All others 0 on increase: even bootstrap; on decrease: stay 0.
 * The changed slider is pinned. Pass allIds so every axis is tracked.
 */
export function redistributeOnChange(
  changedId,
  newValue,
  weights,
  targetSum = DEFAULT_ALLOCATION_TARGET,
  allIds = null
) {
  const keyList = allIds?.length ? [...allIds] : Object.keys(weights);
  if (!keyList.includes(changedId)) return { ...weights };

  const prior = {};
  keyList.forEach((id) => {
    prior[id] = Math.max(0, Math.round(Number(weights[id]) || 0));
  });

  const raw =
    typeof newValue === 'number' && !Number.isInteger(newValue)
      ? parseAllocationPercentInput(newValue)
      : Math.round(Number(newValue) || 0);
  const clamped = Math.max(0, Math.min(targetSum, raw));
  const others = keyList.filter((id) => id !== changedId);
  if (!others.length) {
    return { [changedId]: targetSum };
  }

  const priorChanged = prior[changedId];
  const delta = clamped - priorChanged;
  const out = { [changedId]: clamped };

  const remainder = targetSum - clamped;
  if (remainder <= 0) {
    others.forEach((id) => {
      out[id] = 0;
    });
    return out;
  }

  const activeOthers = others.filter((id) => prior[id] > 0);
  const zeroOthers = others.filter((id) => prior[id] === 0);
  const priorActiveSum = activeOthers.reduce((s, id) => s + prior[id], 0);

  if (priorActiveSum <= 0) {
    if (delta > 0) {
      Object.assign(out, splitEvenly(others, remainder));
    } else {
      zeroOthers.forEach((id) => {
        out[id] = 0;
      });
    }
    return out;
  }

  if (delta === 0) {
    activeOthers.forEach((id) => {
      out[id] = prior[id];
    });
    zeroOthers.forEach((id) => {
      out[id] = 0;
    });
    return out;
  }

  if (delta > 0) {
    const reductions = splitProportionalDeltaSpread(activeOthers, prior, delta);
    activeOthers.forEach((id) => {
      out[id] = Math.max(0, prior[id] - (reductions[id] || 0));
    });
    applyStagnationGuard(out, prior, activeOthers, delta);
  } else {
    const additions = splitProportionalDeltaSpread(activeOthers, prior, -delta);
    activeOthers.forEach((id) => {
      out[id] = prior[id] + (additions[id] || 0);
    });
    applyStagnationGuard(out, prior, activeOthers, delta);
  }

  zeroOthers.forEach((id) => {
    out[id] = 0;
  });
  return out;
}

/**
 * Map allocation percent (0–100) to legacy 1–7 scaled answer for scoring parity.
 */
export function allocationWeightToScale7(weightUnits, targetSum = DEFAULT_ALLOCATION_TARGET) {
  const t = targetSum > 0 ? targetSum : DEFAULT_ALLOCATION_TARGET;
  const p = Math.max(0, Math.min(100, ((Number(weightUnits) || 0) / t) * 100));
  return 1 + (p / 100) * 6;
}

export function buildAllocationAnswer(ids, weights, targetSum = DEFAULT_ALLOCATION_TARGET) {
  const normalized = normalizeAllocation(weights, targetSum);
  return {
    ids: [...ids],
    weights: normalized,
    sum: targetSum,
    version: ALLOCATION_ANSWER_VERSION,
  };
}
