import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { engineRoutes } from "@/routes";
import EngineAdapterView from "@/engines/EngineAdapterView";

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

  return <EngineAdapterView label={routeConfig.label} legacyPage={routeConfig.legacyPage} />;
}
