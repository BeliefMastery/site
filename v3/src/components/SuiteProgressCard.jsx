export default function SuiteProgressCard({ completed = 0, total = 11 }) {
  const pct = Math.round((completed / total) * 100);

  return (
    <article className="surface progress-card">
      <h3>Suite Progress</h3>
      <p>
        {completed}/{total} tools complete
      </p>
      <div className="progress-track" aria-label="Completion progress">
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </article>
  );
}
