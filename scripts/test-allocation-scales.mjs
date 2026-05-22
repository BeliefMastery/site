/**
 * Golden-sample checks for allocation-scales helpers (run: node scripts/test-allocation-scales.mjs)
 */
import {
  normalizeAllocation,
  redistributeOnChange,
  allocationWeightToScale7,
  buildAllocationAnswer,
  sumWeights,
} from '../shared/allocation-scales.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const ids = ['a', 'b', 'c', 'd'];
let w = { a: 25, b: 25, c: 25, d: 25 };
assert(sumWeights(w) === 100, 'initial sum 100');

w = redistributeOnChange('a', 40, w);
assert(w.a === 40, 'changed id is 40');
assert(sumWeights(w) === 100, 'redistribute preserves 100');

const norm = normalizeAllocation({ a: 10, b: 20, c: 30, d: 50 });
assert(sumWeights(norm) === 100, 'normalize sums to 100');

const scale7 = allocationWeightToScale7(100);
assert(Math.abs(scale7 - 7) < 0.01, '100% maps to 7');
assert(Math.abs(allocationWeightToScale7(0) - 1) < 0.01, '0% maps to 1');

const answer = buildAllocationAnswer(ids, { a: 50, b: 20, c: 20, d: 10 });
assert(answer.version && answer.weights.a === 50, 'buildAllocationAnswer shape');

console.log('allocation-scales: all checks passed');
