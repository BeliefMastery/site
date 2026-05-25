/**
 * Tests for shared allocation-scales redistribution helpers.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redistributeOnChange, sumWeights } from '../shared/allocation-scales.js';

test('redistributeOnChange splits remainder proportionally', () => {
  const w = redistributeOnChange('a', 40, { a: 50, b: 30, c: 20 });
  assert.equal(w.a, 40);
  assert.equal(w.b, 36);
  assert.equal(w.c, 24);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange applies delta evenly when others match', () => {
  const w = redistributeOnChange('a', 70, { a: 80, b: 10, c: 10 });
  assert.equal(w.a, 70);
  assert.equal(w.b, 15);
  assert.equal(w.c, 15);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange leaves zero axes at zero', () => {
  const w = redistributeOnChange('a', 50, { a: 60, b: 40, c: 0 });
  assert.equal(w.a, 50);
  assert.equal(w.b, 50);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange does not inflate zero others when all others are zero', () => {
  const w = redistributeOnChange('a', 80, { a: 100, b: 0, c: 0 });
  assert.equal(w.a, 80);
  assert.equal(w.b, 0);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 80);
});

test('redistributeOnChange pins changed slider to requested value', () => {
  const w = redistributeOnChange('b', 33, { a: 34, b: 33, c: 33 });
  assert.equal(w.b, 33);
});
