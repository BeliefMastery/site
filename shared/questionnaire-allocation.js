/**
 * Shared allocation-question helpers (scenario → coupled sliders, scoring, legacy DOM).
 */

import {
  buildAllocationAnswer,
  createEmptyWeights,
  redistributeOnChange,
  sumWeights
} from './allocation-scales.js';

export const ALLOCATION_FAMILY_THRESHOLD_PCT = 12;
export const ALLOCATION_PLAIN_HINT =
  'Distribute 100% across the options. Moving one slider rebalances the others automatically.';

/**
 * Convert a scenario-style question to allocation type (mutates copy).
 * @param {object} q question with options[{ text, mapsTo }]
 * @param {object} [opts]
 */
export function scenarioOptionsToAllocationQuestion(q, opts = {}) {
  if (!q || !Array.isArray(q.options) || q.options.length === 0) return q;
  const prefix = opts.idPrefix || q.id || 'alloc';
  const members = q.options.map((option, index) => ({
    id: option.id || `${prefix}_m${index}`,
    label: option.text || option.label || String(index),
    mapsTo: option.mapsTo || {},
    scores: option.scores,
    hint: option.hint || ''
  }));
  return {
    ...q,
    type: 'allocation',
    allocationMembers: members,
    allocationTargetSum: q.allocationTargetSum ?? 100,
    allocationPlainHint: q.allocationPlainHint || opts.plainHint || ALLOCATION_PLAIN_HINT
  };
}

/**
 * @param {object} question allocation question
 * @param {object} [stored] prior answer { weights }
 */
export function getAllocationWeightsForQuestion(question, stored) {
  const members = question.allocationMembers || [];
  const ids = members.map((m) => m.id);
  const base = createEmptyWeights(ids);
  if (stored?.weights && typeof stored.weights === 'object') {
    return { ...base, ...stored.weights };
  }
  return base;
}

/**
 * Families from gate allocation: members at or above threshold, or top N if none qualify.
 * @param {object} answer buildAllocationAnswer shape
 * @param {Array<{ id: string, mapsTo?: { families?: string[] } }>} members
 */
export function familiesFromAllocationAnswer(answer, members, thresholdPct = ALLOCATION_FAMILY_THRESHOLD_PCT, topN = 3) {
  const weights = answer?.weights || {};
  const active = new Set();
  const ranked = members
    .map((m) => ({ member: m, w: Number(weights[m.id]) || 0 }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w);

  ranked.forEach(({ member, w }) => {
    if (w >= thresholdPct && member.mapsTo?.families) {
      member.mapsTo.families.forEach((f) => active.add(f));
    }
  });

  if (active.size === 0 && ranked.length) {
    ranked.slice(0, topN).forEach(({ member }) => {
      (member.mapsTo?.families || []).forEach((f) => active.add(f));
    });
  }
  return active;
}

/**
 * Apply weighted mapsTo contributions from an allocation answer.
 * @param {object} answer
 * @param {Array<{ id: string, mapsTo?: object }>} members
 * @param {(mapsTo: object, weightFraction: number) => void} visitor
 */
export function forEachWeightedMapsTo(answer, members, visitor) {
  const weights = answer?.weights || {};
  const target = answer?.sum ?? 100;
  members.forEach((m) => {
    const w = Number(weights[m.id]) || 0;
    if (w <= 0 || !m.mapsTo) return;
    visitor(m.mapsTo, w / target);
  });
}

/**
 * Legacy DOM HTML for allocation step (non-React hosts).
 */
export function domAllocationQuestionHtml(question, storedAnswer, context = {}) {
  const members = question.allocationMembers || [];
  const targetSum = question.allocationTargetSum ?? 100;
  const weights = getAllocationWeightsForQuestion(question, storedAnswer);
  const total = sumWeights(weights);
  const phase = context.phase != null ? context.phase : '';
  const qNum = context.questionIndex != null ? context.questionIndex + 1 : '';
  const qTotal = context.questionTotal ?? '';
  const header =
    phase && qNum
      ? `<div class="question-header">
          <span class="question-number">Phase ${phase} - Question ${qNum} of ${qTotal}</span>
          ${context.stageLabel ? `<span class="question-stage">${context.stageLabel}</span>` : ''}
        </div>`
      : '';

  const rows = members
    .map((m) => {
      const val = weights[m.id] ?? 0;
      return `
        <div class="bm-allocation-row">
          <label class="bm-allocation-label" for="alloc-${question.id}-${m.id}">${escapeHtml(m.label)}</label>
          ${m.hint ? `<p class="bm-allocation-hint">${escapeHtml(m.hint)}</p>` : ''}
          <div class="bm-scale">
            <input type="range" id="alloc-${question.id}-${m.id}" class="bm-allocation-slider"
              data-member-id="${escapeHtml(m.id)}" min="0" max="${targetSum}" step="1" value="${val}" />
            <span class="bm-scale__value bm-allocation-pct">${val}%</span>
          </div>
        </div>`;
    })
    .join('');

  const sumClass = total === targetSum ? ' bm-allocation-sum--ok' : '';
  return `
    <div class="question-block bm-allocation-flow">
      ${header}
      <h3 class="question-text">${escapeHtml(question.question || question.questionText || '')}</h3>
      <p class="form-help">${escapeHtml(question.allocationPlainHint || ALLOCATION_PLAIN_HINT)}</p>
      <p class="bm-allocation-sum${sumClass}">Total: <strong class="bm-allocation-sum-val">${total}%</strong> / ${targetSum}%</p>
      <div class="bm-allocation-grid" data-question-id="${escapeHtml(question.id)}">${rows}</div>
    </div>`;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Wire sliders on a container rendered by domAllocationQuestionHtml.
 * @param {HTMLElement} container
 * @param {object} engine host with answers, saveProgress
 * @param {object} question
 */
export function attachDomAllocationListeners(container, engine, question) {
  const targetSum = question.allocationTargetSum ?? 100;
  const members = question.allocationMembers || [];
  const ids = members.map((m) => m.id);
  let weights = getAllocationWeightsForQuestion(question, engine.answers?.[question.id]);

  const sumEl = container.querySelector('.bm-allocation-sum-val');
  const sumWrap = container.querySelector('.bm-allocation-sum');

  const persist = () => {
    engine.answers[question.id] = buildAllocationAnswer(ids, weights, targetSum);
    engine.saveProgress?.();
    const total = sumWeights(weights);
    if (sumEl) sumEl.textContent = `${total}%`;
    if (sumWrap) {
      sumWrap.classList.toggle('bm-allocation-sum--ok', total === targetSum);
    }
    container.querySelectorAll('.bm-allocation-slider').forEach((slider) => {
      const memberId = slider.getAttribute('data-member-id');
      const pctEl = slider.closest('.bm-allocation-row')?.querySelector('.bm-allocation-pct');
      if (memberId && pctEl && weights[memberId] != null) {
        pctEl.textContent = `${weights[memberId]}%`;
      }
    });
  };

  container.querySelectorAll('.bm-allocation-slider').forEach((slider) => {
    slider.addEventListener('input', () => {
      const memberId = slider.getAttribute('data-member-id');
      weights = redistributeOnChange(
        memberId,
        parseInt(slider.value, 10),
        weights,
        targetSum,
        ids
      );
      container.querySelectorAll('.bm-allocation-slider').forEach((s) => {
        const id = s.getAttribute('data-member-id');
        if (id && weights[id] != null) s.value = weights[id];
      });
      persist();
    });
  });
  persist();
}

export function isValidAllocationAnswer(answer, targetSum = 100) {
  if (!answer?.weights) return false;
  return sumWeights(answer.weights) === targetSum;
}

/**
 * Apply option.scores from allocation members weighted by answer (for sovereignty-style scoring).
 * Returns delta map applied; pass prior deltas to replace a previous application.
 */
export function applyAllocationScores(scoresObj, question, answer, priorDeltas = {}) {
  const members = question.allocationMembers || [];
  const target = answer?.sum ?? question.allocationTargetSum ?? 100;
  const weights = answer?.weights || {};
  Object.entries(priorDeltas).forEach(([key, delta]) => {
    if (scoresObj[key] !== undefined) scoresObj[key] -= delta;
  });
  const deltas = {};
  members.forEach((m) => {
    const pct = Number(weights[m.id]) || 0;
    if (pct <= 0 || !m.scores) return;
    const frac = pct / target;
    Object.entries(m.scores).forEach(([scoreKey, val]) => {
      const contribution = (Number(val) || 0) * frac;
      if (scoresObj[scoreKey] !== undefined) {
        scoresObj[scoreKey] += contribution;
      }
      if (scoreKey === 'cognitiveLevel' && scoresObj.cognitiveComplexity !== undefined) {
        const map = { low: 0, medium: 1, high: 2, very_high: 3 };
        const add =
          typeof val === 'number' ? val * frac : (map[val] ?? 0) * frac;
        scoresObj.cognitiveComplexity += add;
      }
      deltas[scoreKey] = (deltas[scoreKey] || 0) + contribution;
    });
  });
  return deltas;
}

export function applyAllocationToEngineAnswers(engine, question, payload) {
  const members = question.allocationMembers || [];
  const ids = members.map((m) => m.id);
  const weights = payload?.weights || {};
  engine.answers[question.id] = buildAllocationAnswer(ids, weights, question.allocationTargetSum ?? 100);
}
