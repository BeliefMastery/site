/**
 * Pure scoring helpers for Outlier Aptitude (testable, no DOM).
 * @see outlier-aptitude-engine.js
 */

/** Each acuity domain maps to disjoint aptitude dimensions (no double-counting). */
export const ACUITY_PARTITION = {
  iq: ['scientific', 'fluid', 'quantitative', 'critical_thinking', 'spatial'],
  eq: ['eq', 'situational_judgment'],
  sq: ['systems', 'diagnostics', 'metacognition'],
  aq: ['field', 'mechanical'],
  cq: ['creativity', 'artistic'],
  tq: ['technical', 'processing'],
  oq: ['organization', 'management', 'self_regulation', 'grit', 'achievement'],
  lq: ['learning', 'linguistic', 'crystallized', 'adaptability', 'resilience', 'clerical']
};

const ACUITY_DOMAIN_IDS = Object.keys(ACUITY_PARTITION);

/**
 * @param {Record<string, number>} answers questionId -> 1-5
 * @param {Array<{ id: string, weights?: Record<string, number> }>} questions
 * @param {string[]} dimensionIds
 * @returns {Record<string, number>} 0-1 per dimension
 */
export function scoreDimensionsFromAnswers(answers, questions, dimensionIds) {
  const scores = {};
  const totals = {};
  dimensionIds.forEach(id => {
    scores[id] = 0;
    totals[id] = 0;
  });
  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer == null) return;
    Object.entries(question.weights || {}).forEach(([dimId, weight]) => {
      if (scores[dimId] === undefined) return;
      scores[dimId] += answer * weight;
      totals[dimId] += weight * 5;
    });
  });
  const normalized = {};
  dimensionIds.forEach(dimId => {
    normalized[dimId] = totals[dimId] ? scores[dimId] / totals[dimId] : 0;
  });
  return normalized;
}

/**
 * Map acuity sliders (0-10) to a 0-1 vector over aptitude dimensions.
 * @param {Record<string, number>} sliderScores domainId -> 0-10
 */
export function acuitySlidersToVector(sliderScores) {
  const acc = {};
  ACUITY_DOMAIN_IDS.forEach(domainId => {
    const raw = sliderScores[domainId];
    const s = raw !== undefined && raw !== null ? Math.max(0, Math.min(10, Number(raw))) / 10 : 0.5;
    const dims = ACUITY_PARTITION[domainId] || [];
    if (dims.length === 0) return;
    const slice = s / dims.length;
    dims.forEach(dim => {
      acc[dim] = (acc[dim] || 0) + slice;
    });
  });
  let mx = 0;
  Object.values(acc).forEach(v => {
    if (v > mx) mx = v;
  });
  if (mx > 0) {
    Object.keys(acc).forEach(k => {
      acc[k] /= mx;
    });
  }
  return acc;
}

/**
 * Convex blend: questionnaire is primary signal; acuity adjusts.
 * @param {Record<string, number>} questionnaire 0-1
 * @param {Record<string, number>} acuityVector 0-1
 * @param {string[]} dimensionIds
 * @param {number} acuityWeight 0-1 share for acuity (default 0.28)
 */
export function blendQuestionnaireAndAcuity(questionnaire, acuityVector, dimensionIds, acuityWeight = 0.28) {
  const a = Math.max(0, Math.min(1, acuityWeight));
  const out = {};
  dimensionIds.forEach(dimId => {
    const q = questionnaire[dimId] ?? 0;
    const av = acuityVector[dimId] ?? 0;
    out[dimId] = (1 - a) * q + a * av;
  });
  return out;
}

/**
 * @param {Record<string, number>} userScores blended 0-1
 * @param {Record<string, number>} roleWeights role aptitude profile 0-1
 * @param {object} opts
 */
export function computeRoleFit(userScores, roleWeights, opts = {}) {
  const {
    qualFactor = 1,
    archetypeFactor = 1,
    sectorFactor = 1,
    topKForMismatch = 3,
    mismatchScale = 0.22
  } = opts;

  const entries = Object.entries(roleWeights || {}).filter(([, w]) => w > 0);
  if (entries.length === 0) {
    return {
      meanSim: 0,
      mismatchPenalty: 0,
      composite: 0,
      topContributors: [],
      matchRationale: ''
    };
  }

  let rawFit = 0;
  let weightSum = 0;
  entries.forEach(([dimId, w]) => {
    rawFit += (userScores[dimId] || 0) * w;
    weightSum += w;
  });
  const meanSim = weightSum > 0 ? rawFit / weightSum : 0;

  const sortedByWeight = [...entries].sort((a, b) => b[1] - a[1]);
  const topDims = sortedByWeight.slice(0, topKForMismatch);
  let mismatchPenalty = 0;
  topDims.forEach(([dimId, w]) => {
    const u = userScores[dimId] || 0;
    if (w > 0.5 && u + 0.12 < w) {
      mismatchPenalty += (w - u) * mismatchScale;
    }
  });
  mismatchPenalty = Math.min(0.45, mismatchPenalty);

  let composite = meanSim * (1 - mismatchPenalty) * qualFactor * archetypeFactor * sectorFactor;
  composite = Math.min(1, Math.max(0, composite));

  const contributors = sortedByWeight
    .map(([dimId, w]) => ({ dimId, w, user: userScores[dimId] || 0, product: (userScores[dimId] || 0) * w }))
    .sort((a, b) => b.product - a.product)
    .slice(0, 3);

  const topContributors = contributors.map(c => c.dimId);
  const rationaleParts = contributors.map(c => `${c.dimId.replace(/_/g, ' ')} (${(c.user * 100).toFixed(0)}% vs role emphasis ${(c.w * 100).toFixed(0)}%)`);

  return {
    meanSim,
    mismatchPenalty,
    composite,
    topContributors,
    matchRationale: rationaleParts.join('; ')
  };
}

/**
 * Full career ranking from blended aptitude vector + early inputs (engine parity for tests / tooling).
 * @param {Record<string, number>} blendedScores
 * @param {object[]} roles MARKET_PROJECTION_MATRIX rows
 * @param {object} earlyInputs qualification, industries, archetypes
 * @param {object} [options]
 * @param {string[]} [options.qualOrder]
 * @param {Record<string, string>} [options.industryToSector]
 */
export function buildSortedMarketProjection(blendedScores, roles, earlyInputs = {}, options = {}) {
  const qualOrder = options.qualOrder || [];
  const industryToSector = options.industryToSector || {};
  const archetypePerMatch = options.archetypePerMatch ?? 0.04;
  const sectorMult = options.sectorMult ?? 1.1;

  const early = earlyInputs || {};
  const userQualIdx = qualOrder.indexOf(early.qualification);
  const userIndustrySectors = new Set((early.industries || []).map(id => industryToSector[id] || id));
  const userArchetypes = new Set((early.archetypes || []).map(a => String(a).trim()).filter(Boolean));

  const mapped = roles.map(role => {
    let qualFactor = 1;
    if (role.educationMin && early.qualification) {
      const reqIdx = qualOrder.indexOf(role.educationMin);
      if (reqIdx >= 0 && userQualIdx >= 0 && userQualIdx < reqIdx) {
        const gap = reqIdx - userQualIdx;
        qualFactor = Math.max(0.5, 1 - gap * 0.15);
      }
    }

    let archetypeFactor = 1;
    if (role.archetypeFit?.length && userArchetypes.size) {
      const matches = role.archetypeFit.filter(a => userArchetypes.has(a)).length;
      if (matches) archetypeFactor = 1 + matches * archetypePerMatch;
    }

    let sectorFactor = 1;
    if (role.sector && userIndustrySectors.has(role.sector)) {
      sectorFactor = sectorMult;
    }

    const fit = computeRoleFit(blendedScores, role.aptitudes, {
      qualFactor,
      archetypeFactor,
      sectorFactor
    });

    let educationReachBonus = 0;
    if (role.educationMin && early.qualification) {
      const reqIdx = qualOrder.indexOf(role.educationMin);
      if (reqIdx >= 0 && userQualIdx >= 0 && userQualIdx >= reqIdx) {
        educationReachBonus = 0.02;
      }
    }

    return {
      ...role,
      fitScore: fit.composite,
      meanSim: fit.meanSim,
      mismatchPenalty: fit.mismatchPenalty,
      matchRationale: fit.matchRationale,
      topFitDimensions: fit.topContributors,
      educationReachBonus
    };
  });

  mapped.sort((a, b) => {
    const df = (b.fitScore || 0) - (a.fitScore || 0);
    if (Math.abs(df) > 1e-6) return df;
    const da = (b.automationResistanceScore || 0) - (a.automationResistanceScore || 0);
    if (Math.abs(da) > 1e-6) return da;
    return (b.educationReachBonus || 0) - (a.educationReachBonus || 0);
  });

  return mapped;
}

/**
 * Greedy diversity: cap how many roles from the same clusterKey appear in the shortlist.
 * @param {Array<object>} sortedRoles already sorted by fit descending (compositeScore or fitScore)
 * @param {number} n target count
 * @param {number} maxPerCluster max per clusterKey
 */
export function pickDiverseTopRoles(sortedRoles, n = 7, maxPerCluster = 2) {
  const picked = [];
  const clusterCount = {};
  const usedIds = new Set();

  for (const role of sortedRoles) {
    if (picked.length >= n) break;
    const key = role.clusterKey || role.sector || 'other';
    if ((clusterCount[key] || 0) >= maxPerCluster) continue;
    picked.push(role);
    usedIds.add(role.id);
    clusterCount[key] = (clusterCount[key] || 0) + 1;
  }

  if (picked.length < n) {
    for (const role of sortedRoles) {
      if (picked.length >= n) break;
      if (usedIds.has(role.id)) continue;
      picked.push(role);
      usedIds.add(role.id);
    }
  }

  return picked;
}
