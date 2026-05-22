import QuestionnaireEngineView from '../shared/QuestionnaireEngineView';
import { engineNativeCopy } from '../engineNativeConfig';

export default function SovereigntySpectrumEngineView({ label }) {
  return (
    <QuestionnaireEngineView
      label={label}
      engineId="sovereignty-spectrum"
      lead={engineNativeCopy['sovereignty-spectrum'].lead}
      explanation={
        <p>
          Rate paradigm alignment, intents and practicalities, and derailers to locate your position
          on the sovereignty spectrum.
        </p>
      }
    />
  );
}
