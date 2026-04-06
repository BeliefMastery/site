/**
 * Regression tests for outlier aptitude scoring (Node built-in runner).
 * Golden expectations document intended scale behavior after questionnaire + acuity blend.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreDimensionsFromAnswers,
  acuitySlidersToVector,
  blendQuestionnaireAndAcuity,
  computeRoleFit,
  buildSortedMarketProjection,
  pickDiverseTopRoles,
  ACUITY_PARTITION
} from '../outlier-aptitude-scoring.js';
import {
  APTITUDE_QUESTIONS,
  APTITUDE_DIMENSIONS,
  MARKET_PROJECTION_MATRIX,
  QUALIFICATION_ORDER,
  INDUSTRY_TO_SECTOR
} from '../outlier-aptitude-data.js';

const DIM_IDS = APTITUDE_DIMENSIONS.map(d => d.id);

test('ACUITY_PARTITION covers each aptitude dimension exactly once', () => {
  const seen = new Set();
  for (const dims of Object.values(ACUITY_PARTITION)) {
    for (const d of dims) {
      assert.ok(DIM_IDS.includes(d), `unknown dimension ${d}`);
      assert.ok(!seen.has(d), `duplicate dimension ${d}`);
      seen.add(d);
    }
  }
  assert.equal(seen.size, DIM_IDS.length);
});

test('scoreDimensionsFromAnswers: all neutral (3) maps to 3/5 on each dimension', () => {
  const answers = {};
  APTITUDE_QUESTIONS.forEach(q => {
    answers[q.id] = 3;
  });
  const scores = scoreDimensionsFromAnswers(answers, APTITUDE_QUESTIONS, DIM_IDS);
  assert.ok(Math.abs(scores.systems - 0.6) < 0.02, `systems ~0.6 got ${scores.systems}`);
  assert.ok(Math.abs(scores.eq - 0.6) < 0.02);
});

test('scoreDimensionsFromAnswers: golden all-strong (5) — key dimensions at ceiling', () => {
  const answers = {};
  APTITUDE_QUESTIONS.forEach(q => {
    answers[q.id] = 5;
  });
  const scores = scoreDimensionsFromAnswers(answers, APTITUDE_QUESTIONS, DIM_IDS);
  assert.equal(scores.systems, 1);
  assert.equal(scores.diagnostics, 1);
  assert.ok(scores.technical > 0.92);
});

test('blendQuestionnaireAndAcuity: alpha=0 ignores acuity', () => {
  const q = Object.fromEntries(DIM_IDS.map(id => [id, 0.4]));
  const a = Object.fromEntries(DIM_IDS.map(id => [id, 0.9]));
  const b = blendQuestionnaireAndAcuity(q, a, DIM_IDS, 0);
  assert.deepEqual(b, q);
});

test('acuitySlidersToVector: max sliders produce normalized vector', () => {
  const sliders = { iq: 10, eq: 10, sq: 10, aq: 10, cq: 10, tq: 10, oq: 10, lq: 10 };
  const v = acuitySlidersToVector(sliders);
  const mx = Math.max(...Object.values(v));
  assert.ok(Math.abs(mx - 1) < 1e-9);
});

test('computeRoleFit: mismatch penalty when user weak on heavily weighted role dimension', () => {
  const roleWeights = { systems: 0.9, technical: 0.85, eq: 0.2 };
  const userStrong = { systems: 0.9, technical: 0.88, eq: 0.5 };
  const userWeak = { systems: 0.15, technical: 0.88, eq: 0.5 };
  const strong = computeRoleFit(userStrong, roleWeights, {});
  const weak = computeRoleFit(userWeak, roleWeights, {});
  assert.ok(weak.mismatchPenalty > strong.mismatchPenalty);
  assert.ok(weak.composite < strong.composite);
  assert.ok(weak.matchRationale.includes('systems'));
});

/**
 * Golden integration: synthetic blended vector + early inputs.
 * If aptitude deltas or weights change materially, update expected rank-1 id after deliberate review.
 */
test('golden profile: STEM-heavy + tech industry + archetype ranks tech_001 first', () => {
  const user = Object.fromEntries(DIM_IDS.map(id => [id, 0.25]));
  for (const k of ['technical', 'systems', 'diagnostics', 'scientific', 'quantitative', 'learning']) {
    user[k] = 1;
  }
  const proj = buildSortedMarketProjection(
    user,
    MARKET_PROJECTION_MATRIX,
    { qualification: 'masters', industries: ['tech_software'], archetypes: ['Gamma Male'] },
    { qualOrder: QUALIFICATION_ORDER, industryToSector: INDUSTRY_TO_SECTOR }
  );
  assert.equal(proj[0].id, 'tech_001');
  assert.ok(proj.slice(0, 3).every(r => r.sector === 'technology'), 'top 3 should stay in technology sector');
});

test('golden profile: EQ-heavy vector surfaces healthcare sector at the top', () => {
  const user = Object.fromEntries(DIM_IDS.map(id => [id, 0.35]));
  for (const k of ['eq', 'situational_judgment', 'resilience']) {
    user[k] = 1;
  }
  const proj = buildSortedMarketProjection(
    user,
    MARKET_PROJECTION_MATRIX,
    { qualification: 'masters', industries: [], archetypes: [] },
    { qualOrder: QUALIFICATION_ORDER, industryToSector: INDUSTRY_TO_SECTOR }
  );
  assert.equal(proj[0].sector, 'healthcare');
  assert.ok(proj.slice(0, 5).every(r => r.sector === 'healthcare'));
});

test('buildSortedMarketProjection matches pickDiverseTopRoles smoke (diverse top includes multiple clusters)', () => {
  const user = Object.fromEntries(DIM_IDS.map(id => [id, 0.5]));
  const proj = buildSortedMarketProjection(
    user,
    MARKET_PROJECTION_MATRIX,
    { qualification: 'bachelors', industries: [], archetypes: [] },
    { qualOrder: QUALIFICATION_ORDER, industryToSector: INDUSTRY_TO_SECTOR }
  );
  const diverse = pickDiverseTopRoles(proj, 7, 2);
  const keys = new Set(diverse.map(r => r.clusterKey || r.sector));
  assert.ok(keys.size >= 3, 'neutral profile diverse shortlist should span several clusters');
});

test('pickDiverseTopRoles: caps per clusterKey', () => {
  const roles = [
    { id: 'a', clusterKey: 'tech', fitScore: 1 },
    { id: 'b', clusterKey: 'tech', fitScore: 0.99 },
    { id: 'c', clusterKey: 'tech', fitScore: 0.98 },
    { id: 'd', clusterKey: 'business', fitScore: 0.97 },
    { id: 'e', clusterKey: 'healthcare', fitScore: 0.96 },
    { id: 'f', clusterKey: 'creative', fitScore: 0.95 },
    { id: 'g', clusterKey: 'trades', fitScore: 0.94 },
    { id: 'h', clusterKey: 'education', fitScore: 0.93 }
  ];
  const top = pickDiverseTopRoles(roles, 7, 2);
  assert.equal(top.length, 7);
  const techN = top.filter(r => r.clusterKey === 'tech').length;
  assert.ok(techN <= 2);
});
