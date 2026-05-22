import { Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import { engineRoutes, nativeEngineViews } from "@/routes";
import EngineAdapterView from "@/engines/EngineAdapterView";

function EngineLoading() {
  return (
    <section className="stack">
      <article className="surface">
        <p className="v3-muted">Loading assessment…</p>
      </article>
    </section>
  );
}

export default function EngineRoutePage() {
  const { engineId } = useParams();
  const routeConfig = useMemo(() => engineRoutes.find((entry) => entry.id === engineId), [engineId]);

  if (!routeConfig) {
    return (
      <section className="stack">
        <article className="surface">
          <h2>Tool not found</h2>
          <p>That link may be out of date. Try the Tools page from the menu.</p>
        </article>
      </section>
    );
  }

  const NativeView = engineId ? nativeEngineViews[engineId] : undefined;
  if (NativeView) {
    return (
      <Suspense fallback={<EngineLoading />}>
        <NativeView label={routeConfig.label} />
      </Suspense>
    );
  }

  return <EngineAdapterView label={routeConfig.label} legacyPage={routeConfig.legacyPage} />;
}
