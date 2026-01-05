// DSM-5 Diagnostic Criteria Database - Main Index
// Modular structure for comprehensive coverage and performance

import { MOOD_DISORDERS } from './mood.js';
import { ANXIETY_DISORDERS } from './anxiety.js';
import { TRAUMA_DISORDERS } from './trauma.js';
import { PERSONALITY_DISORDERS } from './personality.js';
import { OCD_DISORDERS } from './ocd.js';
import { EATING_DISORDERS } from './eating.js';
import { SUBSTANCE_DISORDERS } from './substance.js';
import { NEUROCOGNITIVE_DISORDERS } from './neurocognitive.js';
import { NEURODEVELOPMENTAL_DISORDERS } from './neurodevelopmental.js';
import { SLEEP_DISORDERS } from './sleep.js';
import { SEXUAL_DISORDERS } from './sexual.js';
import { DISSOCIATIVE_DISORDERS } from './dissociative.js';
import { SOMATIC_DISORDERS } from './somatic.js';
import { SCHIZOPHRENIA_DISORDERS } from './schizophrenia.js';

export const DSM5_CATEGORIES = {
  mood: MOOD_DISORDERS,
  anxiety: ANXIETY_DISORDERS,
  trauma: TRAUMA_DISORDERS,
  personality: PERSONALITY_DISORDERS,
  ocd: OCD_DISORDERS,
  eating: EATING_DISORDERS,
  substance: SUBSTANCE_DISORDERS,
  neurocognitive: NEUROCOGNITIVE_DISORDERS,
  neurodevelopmental: NEURODEVELOPMENTAL_DISORDERS,
  sleep: SLEEP_DISORDERS,
  sexual: SEXUAL_DISORDERS,
  dissociative: DISSOCIATIVE_DISORDERS,
  somatic: SOMATIC_DISORDERS,
  schizophrenia: SCHIZOPHRENIA_DISORDERS
};

// Question templates exported from separate file for better organization
export { QUESTION_TEMPLATES } from './question-templates.js';
export { VALIDATION_PAIRS } from './validation-pairs.js';
export { SCORING_THRESHOLDS } from './scoring-thresholds.js';
export { SUB_INQUIRY_QUESTIONS } from './sub-inquiry-questions.js';

