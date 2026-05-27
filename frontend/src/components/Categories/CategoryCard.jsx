import { formatAmount } from '../../utils/format';
import './Categories.scss';

export default function CategoryCard({ category, opCount, opTotal, onEdit, onDelete }) {
  return (
    <div className="cat-card">
      <div className="cat-card__top">
        <div className="cat-card__title-row">
          <span className="cat-card__dot" style={{ backgroundColor: category.color }} />
          <span className="cat-card__title">{category.title}</span>
        </div>
        <div className="cat-card__actions">
          <button className="cat-card__btn" onClick={() => onEdit(category)} title="Edit">✏️</button>
          <button className="cat-card__btn cat-card__btn--del" onClick={() => onDelete(category)} title="Delete">🗑️</button>
        </div>
      </div>
      <p className="cat-card__stats">
        {opCount} operation{opCount !== 1 ? 's' : ''} · {formatAmount(opTotal)} total
      </p>
    </div>
  );
}
