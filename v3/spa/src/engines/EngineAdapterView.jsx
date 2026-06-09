import EngineLayout from "./shared/EngineLayout";

/**
 * Dev-only fallback when an engine id has no native view registered.
 */
export default function EngineAdapterView({ label }) {
  return (
    <EngineLayout label={label} lead="This assessment is not registered in the V3 app shell.">
      <p className="v3-muted">
        Add an entry in <code>engineManifest.js</code> (see docs/ENGINE_SPA_HOST_CONTRACT.md).
      </p>
    </EngineLayout>
  );
}
