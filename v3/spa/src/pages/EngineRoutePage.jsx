import { Suspense, lazy, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getEngineManifestEntry } from "@/engines/engineManifest";

const QuestionnaireEngineView = lazy(() => import("@/engines/shared/QuestionnaireEngineView"));
const ExternalShellEngineView = lazy(() => import("@/engines/shared/ExternalShellEngineView"));

function EngineLoading() {
  return (
    <section className="stack">
      <article className="surface">
        <p className="v3-muted">Loading assessment…</p>
      </article>
    </section>
  );
}

function NativeEngineView({ entry }) {
  const { label, id, viewType, hostClassName, loadingMessage, copy = {} } = entry;

  if (viewType === "externalShell") {
    return (
      <ExternalShellEngineView
        engineId={id}
        label={label}
        lead={copy.lead}
        hostClassName={hostClassName}
        loadingMessage={loadingMessage}
      />
    );
  }

  return (
    <QuestionnaireEngineView
      label={label}
      engineId={id}
      lead={copy.lead}
      selectionTitle={copy.selectionTitle}
      selectionHint={copy.selectionHint}
      defaultSelections={copy.defaultSelections}
      selectionAdapter={copy.selectionAdapter}
      sliderStep={copy.sliderStep}
      abandonMethod={copy.abandonMethod}
      showRefinementOffer={copy.showRefinementOffer}
      explanationTitle={copy.explanationTitle}
      explanationText={copy.explanationText}
      explanationParagraphs={copy.explanationParagraphs}
    />
  );
}

export default function EngineRoutePage() {
  const { engineId } = useParams();
  const entry = useMemo(() => getEngineManifestEntry(engineId), [engineId]);

  if (!entry) {
    return (
      <section className="stack">
        <article className="surface">
          <h2>Tool not found</h2>
          <p>That link may be out of date. Try the Tools page from the menu.</p>
        </article>
      </section>
    );
  }

  return (
    <Suspense fallback={<EngineLoading />}>
      <NativeEngineView entry={entry} />
    </Suspense>
  );
}
