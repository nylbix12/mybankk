import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import CategoryCard from '../components/Categories/CategoryCard';
import CategoryModal from '../components/Categories/CategoryModal';
import DeleteCategoryModal from '../components/Categories/DeleteCategoryModal';
import CategoryHasOpsModal from '../components/Categories/CategoryHasOpsModal';
import './Categories.scss';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deletingCat, setDeletingCat] = useState(null);
  const [blockedMsg, setBlockedMsg] = useState('');

  const fetchData = async () => {
    const [catsRes, opsRes] = await Promise.all([api.get('/api/categories'), api.get('/api/operations')]);
    setCategories(catsRes.data);
    setOperations(opsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const statsMap = useMemo(() => {
    const map = {};
    categories.forEach(c => { map[c.id] = { count: 0, total: 0 }; });
    operations.forEach(op => {
      if (op.category && map[op.category.id]) {
        map[op.category.id].count += 1;
        map[op.category.id].total += parseFloat(op.amount);
      }
    });
    return map;
  }, [categories, operations]);

  const handleSaved = () => { setShowModal(false); setEditingCat(null); fetchData(); };
  const handleEdit = (cat) => { setEditingCat(cat); setShowModal(true); };

  const handleDeleteRequest = (cat) => {
    setDeletingCat(cat);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/categories/${deletingCat.id}`);
      setDeletingCat(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message;
      setDeletingCat(null);
      if (msg) setBlockedMsg(msg);
    }
  };

  return (
    <main className="categories-page">
      <div className="categories-page__inner">
        <div className="categories-page__header">
          <div>
            <h1>Categories</h1>
            <p>Organize your operations by category</p>
          </div>
          <button className="categories-page__add-btn" onClick={() => { setEditingCat(null); setShowModal(true); }}>
            + Add Category
          </button>
        </div>

        {loading ? (
          <p className="categories-page__loading">Loading...</p>
        ) : categories.length === 0 ? (
          <div className="categories-page__empty">No categories yet. Create your first one!</div>
        ) : (
          <div className="categories-page__grid">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                opCount={statsMap[cat.id]?.count ?? 0}
                opTotal={statsMap[cat.id]?.total ?? 0}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CategoryModal
          category={editingCat}
          onSaved={handleSaved}
          onClose={() => { setShowModal(false); setEditingCat(null); }}
        />
      )}

      {deletingCat && (
        <DeleteCategoryModal
          category={deletingCat}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingCat(null)}
        />
      )}

      {blockedMsg && (
        <CategoryHasOpsModal message={blockedMsg} onClose={() => setBlockedMsg('')} />
      )}
    </main>
  );
}
