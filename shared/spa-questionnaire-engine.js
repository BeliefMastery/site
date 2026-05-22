/**
 * Shared questionnaire helpers for externalUI mode (used by multiple *-engine.js files).
 */

import { spaEmit } from './spa-engine-external.js';

export function buildQuestionSnapshot(engine, question, overrides = {}) {
  if (!question) return null;
  const total =
    overrides.totalQuestions ??
    (Array.isArray(engine.questionSequence) ? engine.questionSequence.length : 0);
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
