import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/ui/StatCard';
import OperationTable from '../components/Operations/OperationTable';
import OperationModal from '../components/Operations/OperationModal';
import DeleteOperationModal from '../components/Operations/DeleteOperationModal';
import { formatAmount, getDisplayName, getCurrentMonthTotal } from '../utils/format';
import './Dashboard.scss';

export default function Dashboard() {
  const { user } = useAuth();
  const [operations, setOperations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOp, setEditingOp] = useState(null);
  const [deletingOp, setDeletingOp] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const fetchData = async () => {
    const [opsRes, catsRes] = await Promise.all([api.get('/api/operations'), api.get('/api/categories')]);
    setOperations(opsRes.data);
    setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => operations.filter(op => {
    const matchSearch = op.label.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || op.category?.id === parseInt(filterCat);
    return matchSearch && matchCat;
  }), [operations, search, filterCat]);

  const total = operations.reduce((s, op) => s + parseFloat(op.amount), 0);
  const monthTotal = getCurrentMonthTotal(operations);
  const displayName = getDisplayName(user?.email);

  const handleSaved = () => { setShowModal(false); setEditingOp(null); fetchData(); };
  const handleEdit = (op) => { setEditingOp(op); setShowModal(true); };
  const handleDeleteConfirm = async () => {
    await api.delete(`/api/operations/${deletingOp.id}`);
    setDeletingOp(null);
    fetchData();
  };

  return (
    <main className="dashboard">
      <div className="dashboard__inner">
        <div className="dashboard__greeting">
          <h1>Hello, {displayName}</h1>
          <p>Here's an overview of your expenses</p>
        </div>

        <div className="dashboard__stats">
          <StatCard label="Total expenses" value={formatAmount(total)} icon="$" />
          <StatCard label="This month" value={formatAmount(monthTotal)} icon="📈" accent />
          <StatCard label="Number of operations" value={operations.length} icon="📄" />
        </div>

        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>My operations</h2>
            <div className="dashboard__controls">
              <div className="dashboard__search">
                <span className="dashboard__search-icon">🔍</span>
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="dashboard__filter">
                <option value="">All categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <button className="dashboard__add-btn" onClick={() => { setEditingOp(null); setShowModal(true); }}>
                + Add Operation
              </button>
            </div>
          </div>

          {loading ? <p className="dashboard__loading">Loading...</p> : (
            <OperationTable operations={filtered} onEdit={handleEdit} onDelete={setDeletingOp} />
          )}
        </div>
      </div>

      {showModal && (
        <OperationModal
          operation={editingOp}
          categories={categories}
          onSaved={handleSaved}
          onClose={() => { setShowModal(false); setEditingOp(null); }}
        />
      )}

      {deletingOp && (
        <DeleteOperationModal
          operation={deletingOp}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingOp(null)}
        />
      )}
    </main>
  );
}
