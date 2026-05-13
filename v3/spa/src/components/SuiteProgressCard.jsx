import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSuiteCompletion } from "../../../../shared/suite-completion.js";
import { engineRoutes } from "@/routes";

function routeForToolId(id) {
  return engineRoutes.find((e) => e.id === id)?.path;
}

export default function SuiteProgressCard() {
  const [completion, setCompletion] = useState(() => getSuiteCompletion());

  useEffect(() => {
    const id = window.setInterval(() => setCompletion(getSuiteCompletion()), 2000);
    return () => window.clearInterval(id);
  }, []);

  const { completeCount, totalCount, items } = completion;
  const pct = Math.round((completeCount / totalCount) * 100);

  return (
    <article className="surface progress-card v3-section--breathable v3-section-band--gradient">
      <h2 className="v3-section-title">Your tools</h2>
      <p className="v3-muted">
        {completeCount} of {totalCount} completed
      </p>
      <div className="progress-track" aria-label="Completion progress">
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <ul className="suite-progress-list">
        {items.map((item) => {
          const to = routeForToolId(item.id);
          const status = item.completed ? "Complete" : "Pending";
          const icon = item.completed ? "✓" : "○";
          const label = (
            <>
              {icon} {item.label}
            </>
          );
          return (
            <li key={item.id}>
              {to ? (
                <Link to={to}>
                  {label} <span className="suite-progress-status">{status}</span>
                </Link>
              ) : (
                <a href={`/site/archive/v3-engines/${item.href}`}>
                  {label} <span className="suite-progress-status">{status}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
