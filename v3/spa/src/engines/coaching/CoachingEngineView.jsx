import QuestionnaireEngineView from '../shared/QuestionnaireEngineView';
import { engineNativeCopy } from '../engineNativeConfig';

export default function CoachingEngineView({ label }) {
  const copy = engineNativeCopy.coaching;
  return (
    <QuestionnaireEngineView
      label={label}
      engineId="coaching"
      lead={copy.lead}
      selectionTitle="Select assessment sections"
      selectionHint={copy.selectionHint}
      defaultSelections={copy.defaultSelections}
      explanation={
        <p>
          Review the 15 obstacles to sovereignty and/or satisfaction across ten life domains. Higher
          obstacle scores mean greater constraints; higher domain scores mean greater satisfaction.
        </p>
      }
    />
  );
}
