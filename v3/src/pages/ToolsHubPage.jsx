import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";

export default function ToolsHubPage() {
  return (
    <section className="stack">
      <article className="surface">
        <h2>Tools Hub</h2>
        <p>All assessment engines have been re-routed into the V3 application shell.</p>
        <ul className="tool-list">
          {engineRoutes.map((tool) => (
            <li key={tool.id}>
              <Link to={tool.path}>{tool.label}</Link>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
