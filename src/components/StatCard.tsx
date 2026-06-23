interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: string;
}

export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
    </article>
  );
}
