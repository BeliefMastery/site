import QuestionnaireEngineView from '../shared/QuestionnaireEngineView';
import { engineNativeCopy } from '../engineNativeConfig';

export default function NeedsDependencyEngineView({ label }) {
  return (
    <QuestionnaireEngineView
      label={label}
      engineId="needs-dependency"
      lead={engineNativeCopy['needs-dependency'].lead}
      explanation={
        <p>
          Four phases: gateway patterns, loop identification, need chains, and integration. Allow
          15–25 minutes for a full pass.
        </p>
      }
    />
  );
}
