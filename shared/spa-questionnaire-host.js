/**
 * Reusable SPA host helpers for questionnaire-style engines.
 */

import { ErrorHandler } from './utils.js';
import {
  applySpaExternalOptions,
  spaEmit,
  spaSetPhase,
} from './spa-engine-external.js';
import { emitQuestionSnapshot } from './spa-questionnaire-engine.js';
import { DEFAULT_ALLOCATION_TARGET } from './allocation-scales.js';
import {
  applyAllocationToEngineAnswers,
  isValidAllocationAnswer
} from './questionnaire-allocation.js';

export function createSpaUi(instance) {
  return {
    transition(state) {
      const phase =
        state === 'assessment' ? 'assessment' : state === 'results' ? 'results' : 'idle';
      spaSetPhase(instance, phase);
    },
  };
}

export function finishSpaInit(instance) {
  spaSetPhase(instance, instance.getPhase?.() || 'idle');
  spaEmit(instance, 'init');
}

export function standardGetPhase(instance, opts = {}) {
  const complete =
    instance[opts.completeFlag || 'reportComplete'] ||
    instance[opts.completeAlt || 'assessmentComplete'];
  if (complete || instance._spaPhase === 'results') return 'results';
  const idx = instance[opts.indexKey || 'currentQuestionIndex'] ?? 0;
  if (idx > 0 || instance._spaPhase === 'assessment') return 'assessment';
  return 'idle';
}

export function standardNextQuestion(instance, value) {
  const q = instance.questionSequence?.[instance.currentQuestionIndex];
  if (q && value !== undefined) instance.answers[q.id] = parseFloat(value);
  instance.currentQuestionIndex++;
  instance.saveProgress?.();
  if (instance.currentQuestionIndex < instance.questionSequence.length) {
    instance.renderCurrentQuestion();
  } else if (instance.completeAssessment) {
    instance.completeAssessment();
  } else if (instance.completeReport) {
    instance.completeReport();
  }
}

export function standardPrevQuestion(instance, value) {
  if (instance.currentQuestionIndex <= 0) return;
  const q = instance.questionSequence?.[instance.currentQuestionIndex];
  if (q && value !== undefined) instance.answers[q.id] = parseFloat(value);
  instance.currentQuestionIndex--;
  instance.saveProgress?.();
  instance.renderCurrentQuestion();
}

export async function showResultsExternal(instance, renderFn) {
  const container = instance._externalResultsMount;
  if (!container || !renderFn) return;
  await renderFn.call(instance, container);
  instance.reportComplete = true;
  instance.assessmentComplete = true;
  spaSetPhase(instance, 'results');
  spaEmit(instance, 'results');
}

/**
 * @param {Function} EngineClass
 * @param {{ legacyMarkerId: string, phaseOpts?: object }} cfg
 */
export function allocationNextQuestion(instance, payload) {
  const q = instance.questionSequence?.[instance.currentQuestionIndex];
  if (q?.type === 'allocation') {
    if (!payload?.weights || !isValidAllocationAnswer(
      { weights: payload.weights, sum: q.allocationTargetSum ?? DEFAULT_ALLOCATION_TARGET },
      q.allocationTargetSum ?? DEFAULT_ALLOCATION_TARGET
    )) {
      return false;
    }
    applyAllocationToEngineAnswers(instance, q, payload);
  } else if (q && payload !== undefined && typeof payload === 'number') {
    instance.answers[q.id] = payload;
  } else if (q && payload?.weights) {
    applyAllocationToEngineAnswers(instance, q, payload);
  }
  instance.currentQuestionIndex++;
  instance.saveProgress?.();
  if (instance.currentQuestionIndex < instance.questionSequence.length) {
    instance.renderCurrentQuestion();
  } else if (instance.completeAssessment) {
    instance.completeAssessment();
  } else if (instance.completePhase) {
    instance.completePhase();
  } else if (instance.completeReport) {
    instance.completeReport();
  }
  return true;
}

export function allocationPrevQuestion(instance, payload) {
  if (instance.currentQuestionIndex <= 0) return;
  const q = instance.questionSequence?.[instance.currentQuestionIndex];
  if (q?.type === 'allocation' && payload?.weights) {
    applyAllocationToEngineAnswers(instance, q, payload);
  } else if (q && payload !== undefined && typeof payload === 'number') {
    instance.answers[q.id] = payload;
  } else if (q && payload?.weights) {
    applyAllocationToEngineAnswers(instance, q, payload);
  }
  instance.currentQuestionIndex--;
  instance.saveProgress?.();
  instance.renderCurrentQuestion();
}

export function attachDomQuestionSpaApi(EngineClass, cfg) {
  attachStandardSpaApi(EngineClass, cfg);
  EngineClass.prototype.usesDomQuestions = function usesDomQuestions() {
    const q = this.questionSequence?.[this.currentQuestionIndex];
    return q?.type !== 'allocation';
  };
  EngineClass.prototype.setExternalQuestionMount = function setExternalQuestionMount(el) {
    this._externalQuestionMount = el;
  };
  EngineClass.prototype.nextQuestionFromExternal = function nextQuestionFromExternal(v) {
    if (!allocationNextQuestion(this, v)) {
      ErrorHandler.showUserError('Please distribute 100% across the options before continuing.');
    }
  };
  EngineClass.prototype.prevQuestionFromExternal = function prevQuestionFromExternal(v) {
    allocationPrevQuestion(this, v);
  };
}

export function attachStandardSpaApi(EngineClass, cfg) {
  EngineClass.prototype.getQuestionSnapshot = function getQuestionSnapshot() {
    return this._externalQuestionSnapshot;
  };

  EngineClass.prototype.getPhase = function getPhase() {
    return standardGetPhase(this, cfg.phaseOpts);
  };

  EngineClass.prototype.setExternalResultsMount = function setExternalResultsMount(el) {
    this._externalResultsMount = el;
  };

  EngineClass.prototype.nextQuestionFromExternal = function nextQuestionFromExternal(v) {
    standardNextQuestion(this, v);
  };

  EngineClass.prototype.prevQuestionFromExternal = function prevQuestionFromExternal(v) {
    standardPrevQuestion(this, v);
  };

  EngineClass.prototype.hydrateResultsView = async function hydrateResultsView(el) {
    this._externalResultsMount = el;
    const fn = this.renderResults || this.renderReport;
    if (fn) await showResultsExternal(this, fn);
  };
}

export function externalRenderQuestion(instance, question, overrides = {}) {
  if (!question) return false;
  if (!instance.externalUI) return false;
  const extra = { ...overrides };
  if (instance.getPhaseLabel && instance.currentPhase != null) {
    extra.badge = extra.badge || instance.getPhaseLabel(instance.currentPhase);
  }
  emitQuestionSnapshot(instance, question, extra);
  return true;
}

export { applySpaExternalOptions, spaEmit, spaSetPhase };
