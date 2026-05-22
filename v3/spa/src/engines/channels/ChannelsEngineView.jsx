import QuestionnaireEngineView from '../shared/QuestionnaireEngineView';
import { engineNativeCopy } from '../engineNativeConfig';

export default function ChannelsEngineView({ label }) {
  return (
    <QuestionnaireEngineView
      label={label}
      engineId="channels"
      lead={engineNativeCopy.channels.lead}
      explanation={
        <p>
          Four phases map node abundance, channel priorities, channel depth, and remediation
          strategies.
        </p>
      }
    />
  );
}
