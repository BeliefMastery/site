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
          <h2>Engine not found</h2>
          <p>Check route configuration in V3 engine mappings.</p>
        </article>
      </section>
    );
  }

  return <EngineAdapterView label={routeConfig.label} legacyPage={routeConfig.legacyPage} />;
}
