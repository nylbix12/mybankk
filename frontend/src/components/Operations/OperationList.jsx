import './OperationList.css';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function OperationList({ operations, onEdit, onDelete }) {
  if (operations.length === 0) {
    return (
      <div className="empty-state">
        <p>No operations yet. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="op-list">
      <div className="op-list-header">
        <span>Label</span>
        <span>Category</span>
        <span>Date</span>
        <span className="align-right">Amount</span>
        <span></span>
      </div>
      {operations.map((op) => (
        <div key={op.id} className="op-item">
          <span className="op-label">{op.label}</span>
          <span className="op-category">
            <span className="cat-badge">{op.category?.title}</span>
          </span>
          <span className="op-date">{formatDate(op.date)}</span>
          <span className={`op-amount ${parseFloat(op.amount) >= 0 ? 'positive' : 'negative'}`}>
            {parseFloat(op.amount) >= 0 ? '+' : ''}{parseFloat(op.amount).toFixed(2)} €
          </span>
          <div className="op-actions">
            <button onClick={() => onEdit(op)}>Edit</button>
            <button className="danger" onClick={() => onDelete(op.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
