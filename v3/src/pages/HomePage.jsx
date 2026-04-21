import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";
import SuiteProgressCard from "@/components/SuiteProgressCard";

export default function HomePage() {
  return (
    <section className="stack">
      <SuiteProgressCard />
      <article className="surface">
        <h2>Online Sovereignty Tools</h2>
        <p>A unified V3 interface for all cognitive and sovereignty engines.</p>
        <div className="grid">
          {engineRoutes.map((tool) => (
            <Link key={tool.id} to={tool.path} className="card-link">
              {tool.label}
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
