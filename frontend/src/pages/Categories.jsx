import { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryForm from '../components/Categories/CategoryForm';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSaved = () => {
    setShowForm(false);
    setEditingCat(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Associated operations will also be removed.')) return;
    await api.delete(`/api/categories/${id}`);
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <main className="categories-page">
      <div className="categories-header">
        <div>
          <h1>Categories</h1>
          <p className="categories-subtitle">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        {!showForm && (
          <button className="btn-add" onClick={() => setShowForm(true)}>
            + Add category
          </button>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCat}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditingCat(null); }}
        />
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <p>No categories yet. Create your first one!</p>
        </div>
      ) : (
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat.id} className="category-item">
              <span className="cat-title">{cat.title}</span>
              <div className="cat-actions">
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(cat.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
