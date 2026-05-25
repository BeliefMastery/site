/**
 * Tests for shared questionnaire allocation helpers.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scenarioOptionsToAllocationQuestion,
  familiesFromAllocationAnswer,
  forEachWeightedMapsTo,
  isValidAllocationAnswer,
  applyAllocationScores
} from '../shared/questionnaire-allocation.js';
import { buildAllocationAnswer, createEmptyWeights } from '../shared/allocation-scales.js';

test('scenarioOptionsToAllocationQuestion maps options to members', () => {
  const q = scenarioOptionsToAllocationQuestion({
    id: 'gate',
    type: 'scenario',
    question: 'Which area?',
    options: [
      { text: 'Relationships', mapsTo: { families: ['CONNECTION'] } },
      { text: 'Energy', mapsTo: { families: ['PHYSICAL'] } }
    ]
  });
  assert.equal(q.type, 'allocation');
  assert.equal(q.allocationMembers.length, 2);
  assert.equal(q.allocationMembers[0].label, 'Relationships');
});

test('familiesFromAllocationAnswer uses threshold and top-N fallback', () => {
  const members = [
    { id: 'a', mapsTo: { families: ['CONNECTION'] } },
    { id: 'b', mapsTo: { families: ['PHYSICAL'] } },
    { id: 'c', mapsTo: { families: ['PEACE'] } }
  ];
  const answer = buildAllocationAnswer(
    ['a', 'b', 'c'],
    { a: 50, b: 30, c: 20 }
  );
  const families = familiesFromAllocationAnswer(answer, members, 12, 2);
  assert.ok(families.has('CONNECTION'));
  assert.ok(families.has('PHYSICAL'));
});

test('forEachWeightedMapsTo scales mapsTo by weight fraction', () => {
  const members = [
    { id: 'x', mapsTo: { loops: ['A'], sourcing: 'compulsive' } },
    { id: 'y', mapsTo: { loops: ['B'], sourcing: 'avoidant' } }
  ];
  const answer = buildAllocationAnswer(['x', 'y'], { x: 100, y: 0 });
  const seen = [];
  forEachWeightedMapsTo(answer, members, (mapsTo, frac) => {
    seen.push({ loops: mapsTo.loops, frac });
  });
  assert.equal(seen.length, 1);
  assert.deepEqual(seen[0].loops, ['A']);
  assert.ok(Math.abs(seen[0].frac - 1) < 1e-6);
});

test('isValidAllocationAnswer requires exact target sum', () => {
  const w = createEmptyWeights(['a', 'b']);
  assert.equal(isValidAllocationAnswer({ weights: w, sum: 100 }, 100), true);
  w.a = 60;
  w.b = 30;
  assert.equal(isValidAllocationAnswer({ weights: w, sum: 100 }, 100), false);
});

test('applyAllocationScores applies weighted option scores', () => {
  const scores = { dependency: 0, cognitiveComplexity: 0 };
  const question = {
    allocationTargetSum: 100,
    allocationMembers: [
      { id: 'a', scores: { dependency: 10 } },
      { id: 'b', scores: { dependency: 20 } }
    ]
  };
  const answer = buildAllocationAnswer(['a', 'b'], { a: 100, b: 0 });
  applyAllocationScores(scores, question, answer);
  assert.equal(scores.dependency, 10);
});
