import { formatAmount, formatDate } from '../../utils/format';
import './Operations.scss';

export default function OperationTable({ operations, onEdit, onDelete }) {
  if (operations.length === 0) {
    return (
      <div className="op-empty">
        <p>No operations yet. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="op-table">
      <div className="op-table__head">
        <span>LABEL</span>
        <span>CATEGORY</span>
        <span>DATE</span>
        <span>AMOUNT</span>
        <span>ACTIONS</span>
      </div>
      {operations.map(op => (
        <div key={op.id} className="op-table__row">
          <span className="op-table__label">{op.label}</span>
          <span>
            <span className="op-badge" style={{ color: op.category?.color, backgroundColor: `${op.category?.color}1a` }}>
              {op.category?.title}
            </span>
          </span>
          <span className="op-table__date">{formatDate(op.date)}</span>
          <span className="op-table__amount">{formatAmount(op.amount)}</span>
          <span className="op-table__actions">
            <button className="op-table__btn-edit" onClick={() => onEdit(op)} title="Edit">✏️</button>
            <button className="op-table__btn-del" onClick={() => onDelete(op)} title="Delete">🗑️</button>
          </span>
        </div>
      ))}
    </div>
  );
}
