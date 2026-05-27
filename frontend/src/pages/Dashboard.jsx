import { useState, useEffect } from 'react';
import api from '../services/api';
import OperationForm from '../components/Operations/OperationForm';
import OperationList from '../components/Operations/OperationList';
import './Dashboard.css';

export default function Dashboard() {
  const [operations, setOperations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOp, setEditingOp] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [opsRes, catsRes] = await Promise.all([
        api.get('/api/operations'),
        api.get('/api/categories'),
      ]);
      setOperations(opsRes.data);
      setCategories(catsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaved = () => {
    setShowForm(false);
    setEditingOp(null);
    fetchData();
  };

  const handleEdit = (op) => {
    setEditingOp(op);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this operation?')) return;
    await api.delete(`/api/operations/${id}`);
    setOperations(operations.filter((o) => o.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOp(null);
  };

  const total = operations.reduce((sum, op) => sum + parseFloat(op.amount), 0);

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Operations</h1>
          <p className="dashboard-subtitle">
            {operations.length} transaction{operations.length !== 1 ? 's' : ''}
            {' · '}
            <span className={total >= 0 ? 'positive' : 'negative'}>
              {total >= 0 ? '+' : ''}{total.toFixed(2)} €
            </span>
          </p>
        </div>
        {!showForm && (
          <button className="btn-add" onClick={() => setShowForm(true)}>
            + Add operation
          </button>
        )}
      </div>

      {showForm && (
        <OperationForm
          operation={editingOp}
          categories={categories}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <OperationList
          operations={operations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
