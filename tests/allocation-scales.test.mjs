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

test('redistributeOnChange takes from sole non-zero other when lead increases and some are zero', () => {
  const w = redistributeOnChange('a', 50, { a: 40, b: 60, c: 0 }, 100, ['a', 'b', 'c']);
  assert.equal(w.a, 50);
  assert.equal(w.b, 50);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange leaves zero axes at zero when all others are non-zero', () => {
  const w = redistributeOnChange('a', 50, { a: 40, b: 55, c: 5 }, 100, ['a', 'b', 'c']);
  assert.equal(w.a, 50);
  assert.equal(w.b, 46);
  assert.equal(w.c, 4);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange gives to sole non-zero other when lead decreases and some are zero', () => {
  const w = redistributeOnChange('a', 50, { a: 60, b: 40, c: 0 }, 100, ['a', 'b', 'c']);
  assert.equal(w.a, 50);
  assert.equal(w.b, 50);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange uses all member ids when weights object is partial', () => {
  const w = redistributeOnChange('a', 40, { a: 50, b: 25 }, 100, ['a', 'b', 'c']);
  assert.equal(w.a, 40);
  assert.equal(w.b, 35);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 75);
});

test('redistributeOnChange tracks missing id at zero on full-sum state', () => {
  const w = redistributeOnChange('a', 40, { a: 50, b: 25, c: 25 }, 100, ['a', 'b', 'c']);
  assert.equal(w.b, 30);
  assert.equal(w.c, 30);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange decreases proportionally when all others are non-zero', () => {
  const w = redistributeOnChange('a', 40, { a: 50, b: 30, c: 20 }, 100, ['a', 'b', 'c']);
  assert.equal(w.b, 36);
  assert.equal(w.c, 24);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange keeps zero others when lead decreases and all others are zero', () => {
  const w = redistributeOnChange('a', 80, { a: 100, b: 0, c: 0 });
  assert.equal(w.a, 80);
  assert.equal(w.b, 0);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 80);
});

test('redistributeOnChange splits remainder evenly when lead increases and all others are zero', () => {
  const w = redistributeOnChange('a', 70, { a: 50, b: 0, c: 0 }, 100, ['a', 'b', 'c']);
  assert.equal(w.a, 70);
  assert.equal(w.b, 15);
  assert.equal(w.c, 15);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange retracts proportionally when all others are non-zero', () => {
  const w = redistributeOnChange('a', 60, { a: 50, b: 30, c: 20 }, 100, ['a', 'b', 'c']);
  assert.equal(w.a, 60);
  assert.equal(w.b, 24);
  assert.equal(w.c, 16);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange pins changed slider to requested value', () => {
  const w = redistributeOnChange('b', 33, { a: 34, b: 33, c: 33 });
  assert.equal(w.b, 33);
});

test('redistributeOnChange moves all four axes on skewed multi-point drag', () => {
  const prior = { a: 60, b: 25, c: 10, d: 5 };
  const w = redistributeOnChange('a', 65, prior, 100, ['a', 'b', 'c', 'd']);
  assert.equal(w.a, 65);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange keeps zero at zero on skewed drag with one zero axis', () => {
  const prior = { a: 60, b: 25, c: 10, d: 5, e: 0 };
  const w = redistributeOnChange('a', 55, prior, 100, ['a', 'b', 'c', 'd', 'e']);
  assert.equal(w.a, 55);
  assert.equal(w.e, 0);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange moves all active others on heavy-tail multi-point drag', () => {
  const prior = { a: 70, b: 20, c: 7, d: 3 };
  const w = redistributeOnChange('a', 75, prior, 100, ['a', 'b', 'c', 'd']);
  assert.equal(w.a, 75);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange may leave others unchanged on single-point small-axis drag', () => {
  const prior = { a: 70, b: 20, c: 9, d: 1 };
  const w = redistributeOnChange('d', 2, prior, 100, ['a', 'b', 'c', 'd']);
  assert.equal(w.d, 2);
  assert.equal(w.b, prior.b);
  assert.equal(w.c, prior.c);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange moves multiple others on small-axis multi-point drag', () => {
  const prior = { a: 70, b: 20, c: 9, d: 1 };
  const w = redistributeOnChange('d', 5, prior, 100, ['a', 'b', 'c', 'd']);
  assert.equal(w.d, 5);
  const changed = ['a', 'b', 'c'].filter((id) => w[id] !== prior[id]).length;
  assert.ok(changed >= 2);
  assert.equal(sumWeights(w), 100);
});

test('redistributeOnChange stagnation guard spreads take across small weights', () => {
  const prior = { a: 90, b: 5, c: 3, d: 2 };
  const w = redistributeOnChange('b', 10, prior, 100, ['a', 'b', 'c', 'd']);
  assert.equal(w.b, 10);
  assert.notEqual(w.a, prior.a);
  assert.notEqual(w.c, prior.c);
  assert.equal(sumWeights(w), 100);
});
