import QuestionnaireEngineView from '../shared/QuestionnaireEngineView';
import { engineNativeCopy } from '../engineNativeConfig';

export default function ParadigmEngineView({ label }) {
  return (
    <QuestionnaireEngineView
      label={label}
      engineId="paradigm"
      lead={engineNativeCopy.paradigm.lead}
      explanation={
        <p>
          Three phases explore Good Life and God-perspective paradigms through scenarios, rankings, and
          scaled items.
        </p>
      }
    />
  );
}
