import QuestionnaireEngineView from '../shared/QuestionnaireEngineView';
import { engineNativeCopy } from '../engineNativeConfig';

export default function ManipulationEngineView({ label }) {
  return (
    <QuestionnaireEngineView
      label={label}
      engineId="manipulation"
      lead={engineNativeCopy.manipulation.lead}
      explanation={
        <p>
          Screen vectors, prioritize areas of concern, then assess tactics and structural modifiers.
        </p>
      }
    />
  );
}
