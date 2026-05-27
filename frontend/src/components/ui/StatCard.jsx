import './StatCard.scss';

export default function StatCard({ label, value, icon, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <p className={`stat-card__value${accent ? ' stat-card__value--accent' : ''}`}>{value}</p>
      </div>
      <div className="stat-card__icon">{icon}</div>
    </div>
  );
}
