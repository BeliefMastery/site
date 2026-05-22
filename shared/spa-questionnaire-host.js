/**
 * Reusable SPA host helpers for questionnaire-style engines.
 */

import { EngineUIController } from './engine-ui-controller.js';
import {
  applySpaExternalOptions,
  spaEmit,
  spaSetPhase,
  shouldBootLegacyEngine,
  bootLegacyEngine,
} from './spa-engine-external.js';
import { emitQuestionSnapshot } from './spa-questionnaire-engine.js';

export function createSpaUi(instance, uiConfig) {
  if (!instance.externalUI) return new EngineUIController(uiConfig);
  return {
    transition(state) {
      const phase =
        state === 'assessment' ? 'assessment' : state === 'results' ? 'results' : 'idle';
      spaSetPhase(instance, phase);
    },
  };
}

export function finishSpaInit(instance) {
  if (!instance.externalUI) return;
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
export function attachDomQuestionSpaApi(EngineClass, cfg) {
  attachStandardSpaApi(EngineClass, cfg);
  EngineClass.prototype.usesDomQuestions = function usesDomQuestions() {
    return true;
  };
  EngineClass.prototype.setExternalQuestionMount = function setExternalQuestionMount(el) {
    this._externalQuestionMount = el;
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

export function legacyEngineBoot(markerId, bootFn) {
  if (shouldBootLegacyEngine(markerId)) bootLegacyEngine(markerId, bootFn);
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
