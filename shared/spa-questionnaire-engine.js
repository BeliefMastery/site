/**
 * Shared questionnaire helpers for externalUI mode (used by multiple *-engine.js files).
 */

import { spaEmit } from './spa-engine-external.js';
import { createEmptyWeights } from './allocation-scales.js';

export function buildQuestionSnapshot(engine, question, overrides = {}) {
  if (!question) return null;
  const total =
    overrides.totalQuestions ??
    (Array.isArray(engine.questionSequence) ? engine.questionSequence.length : 0);

  if (question.type === 'allocation' && Array.isArray(question.allocationMembers)) {
    const memberIds = question.allocationMembers.map((m) => m.id);
    const stored = engine.answers?.[question.id];
    const weights = createEmptyWeights(memberIds);
    if (stored?.weights && typeof stored.weights === 'object') {
      Object.assign(weights, stored.weights);
    }
    return {
      question: {
        id: question.id,
        type: 'allocation',
        text: question.question || question.questionText || '',
        plainHint:
          question.allocationPlainHint ||
          question.description ||
          'Distribute 100% across the options. Moving one slider rebalances the others automatically.',
        badge: overrides.badge || 'Importance allocation',
        allocationMembers: question.allocationMembers.map((m) => ({
          id: m.id,
          label: m.label || m.mapsTo?.dimension || m.id,
          hint: m.question,
        })),
        allocationWeights: weights,
        allocationTargetSum: question.allocationTargetSum ?? 100,
      },
      currentIndex: engine.currentQuestionIndex ?? 0,
      totalQuestions: total,
    };
  }

  const text = question.questionText ?? question.question ?? '';
  const plainHint = question.plainLanguageHint ?? question.description ?? '';
  const initialValue = engine.answers?.[question.id] ?? 5;
  let badge = '';
  if (question.type === 'comorbidity_refinement' && question.groupName) {
    badge = `Refinement (${question.groupName})`;
  } else if (question.type === 'refinement' && question.disorder) {
    badge = `Additional detail for ${question.disorder}`;
  } else if (question.type === 'differential') {
    badge = 'Differential diagnosis question';
  }
  return {
    question: {
      id: question.id,
      type: question.type || 'scaled',
      text,
      plainHint,
      clinicalAnchor: question.clinicalAnchorText || '',
      badge,
      initialValue,
      sliderStep: question.sliderStep ?? 0.5,
    },
    currentIndex: engine.currentQuestionIndex ?? 0,
    totalQuestions: total,
  };
}

export function emitQuestionSnapshot(engine, question, overrides) {
  engine._externalQuestionSnapshot = buildQuestionSnapshot(engine, question, overrides);
  spaEmit(engine, 'question');
}

export function getProgressFromSnapshot(snapshot) {
  if (!snapshot?.totalQuestions) return 0;
  return Math.round(((snapshot.currentIndex + 1) / snapshot.totalQuestions) * 100);
}
