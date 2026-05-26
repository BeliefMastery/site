/**
 * Tests for shared allocation-scales redistribution helpers.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ALLOCATION_TARGET,
  redistributeOnChange,
  sumWeights
} from '../shared/allocation-scales.js';

const T = DEFAULT_ALLOCATION_TARGET;

test('redistributeOnChange splits remainder proportionally', () => {
  const w = redistributeOnChange('a', 400, { a: 500, b: 300, c: 200 }, T);
  assert.equal(w.a, 400);
  assert.equal(w.b, 360);
  assert.equal(w.c, 240);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange applies delta evenly when others match', () => {
  const w = redistributeOnChange('a', 700, { a: 800, b: 100, c: 100 }, T);
  assert.equal(w.a, 700);
  assert.equal(w.b, 150);
  assert.equal(w.c, 150);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange takes from sole non-zero other when lead increases and some are zero', () => {
  const w = redistributeOnChange('a', 500, { a: 400, b: 600, c: 0 }, T, ['a', 'b', 'c']);
  assert.equal(w.a, 500);
  assert.equal(w.b, 500);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange leaves zero axes at zero when all others are non-zero', () => {
  const w = redistributeOnChange('a', 500, { a: 400, b: 550, c: 50 }, T, ['a', 'b', 'c']);
  assert.equal(w.a, 500);
  assert.equal(w.b, 458);
  assert.equal(w.c, 42);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange gives to sole non-zero other when lead decreases and some are zero', () => {
  const w = redistributeOnChange('a', 500, { a: 600, b: 400, c: 0 }, T, ['a', 'b', 'c']);
  assert.equal(w.a, 500);
  assert.equal(w.b, 500);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange uses all member ids when weights object is partial', () => {
  const w = redistributeOnChange('a', 400, { a: 500, b: 250 }, T, ['a', 'b', 'c']);
  assert.equal(w.a, 400);
  assert.equal(w.b, 350);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 750);
});

test('redistributeOnChange tracks missing id at zero on full-sum state', () => {
  const w = redistributeOnChange('a', 400, { a: 500, b: 250, c: 250 }, T, ['a', 'b', 'c']);
  assert.equal(w.b, 300);
  assert.equal(w.c, 300);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange decreases proportionally when all others are non-zero', () => {
  const w = redistributeOnChange('a', 400, { a: 500, b: 300, c: 200 }, T, ['a', 'b', 'c']);
  assert.equal(w.b, 360);
  assert.equal(w.c, 240);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange keeps zero others when lead decreases and all others are zero', () => {
  const w = redistributeOnChange('a', 800, { a: 1000, b: 0, c: 0 }, T);
  assert.equal(w.a, 800);
  assert.equal(w.b, 0);
  assert.equal(w.c, 0);
  assert.equal(sumWeights(w), 800);
});

test('redistributeOnChange splits remainder evenly when lead increases and all others are zero', () => {
  const w = redistributeOnChange('a', 700, { a: 500, b: 0, c: 0 }, T, ['a', 'b', 'c']);
  assert.equal(w.a, 700);
  assert.equal(w.b, 150);
  assert.equal(w.c, 150);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange retracts proportionally when all others are non-zero', () => {
  const w = redistributeOnChange('a', 600, { a: 500, b: 300, c: 200 }, T, ['a', 'b', 'c']);
  assert.equal(w.a, 600);
  assert.equal(w.b, 240);
  assert.equal(w.c, 160);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange pins changed slider to requested value', () => {
  const w = redistributeOnChange('b', 330, { a: 340, b: 330, c: 330 }, T);
  assert.equal(w.b, 330);
});

test('redistributeOnChange moves all four axes on skewed multi-point drag', () => {
  const prior = { a: 600, b: 250, c: 100, d: 50 };
  const w = redistributeOnChange('a', 650, prior, T, ['a', 'b', 'c', 'd']);
  assert.equal(w.a, 650);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange keeps zero at zero on skewed drag with one zero axis', () => {
  const prior = { a: 600, b: 250, c: 100, d: 50, e: 0 };
  const w = redistributeOnChange('a', 550, prior, T, ['a', 'b', 'c', 'd', 'e']);
  assert.equal(w.a, 550);
  assert.equal(w.e, 0);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange moves all active others on heavy-tail multi-point drag', () => {
  const prior = { a: 700, b: 200, c: 70, d: 30 };
  const w = redistributeOnChange('a', 750, prior, T, ['a', 'b', 'c', 'd']);
  assert.equal(w.a, 750);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange spreads one percent across others on tenth-scale drag', () => {
  const prior = { a: 700, b: 200, c: 70, d: 30 };
  const w = redistributeOnChange('a', 710, prior, T, ['a', 'b', 'c', 'd']);
  assert.equal(w.a, 710);
  assert.notEqual(w.b, prior.b);
  assert.notEqual(w.c, prior.c);
  assert.notEqual(w.d, prior.d);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange may leave others unchanged on single-tenth small-axis drag', () => {
  const prior = { a: 700, b: 200, c: 90, d: 10 };
  const w = redistributeOnChange('d', 11, prior, T, ['a', 'b', 'c', 'd']);
  assert.equal(w.d, 11);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange moves multiple others on small-axis multi-point drag', () => {
  const prior = { a: 700, b: 200, c: 90, d: 10 };
  const w = redistributeOnChange('d', 50, prior, T, ['a', 'b', 'c', 'd']);
  assert.equal(w.d, 50);
  const changed = ['a', 'b', 'c'].filter((id) => w[id] !== prior[id]).length;
  assert.ok(changed >= 2);
  assert.equal(sumWeights(w), T);
});

test('redistributeOnChange stagnation guard spreads take across small weights', () => {
  const prior = { a: 900, b: 50, c: 30, d: 20 };
  const w = redistributeOnChange('b', 100, prior, T, ['a', 'b', 'c', 'd']);
  assert.equal(w.b, 100);
  assert.notEqual(w.a, prior.a);
  assert.notEqual(w.c, prior.c);
  assert.equal(sumWeights(w), T);
});
