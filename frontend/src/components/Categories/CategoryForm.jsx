import { useState, useEffect } from 'react';
import api from '../../services/api';
import './CategoryForm.css';

export default function CategoryForm({ category, onSaved, onCancel }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) setTitle(category.title);
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (category) {
        await api.put(`/api/categories/${category.id}`, { title });
      } else {
        await api.post('/api/categories', { title });
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.errors?.title || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cat-form-card">
      <h2>{category ? 'Edit category' : 'New category'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            placeholder="e.g. Food & Drinks"
            required
            autoFocus
          />
          {error && <span className="field-error">{error}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : (category ? 'Save changes' : 'Add category')}
          </button>
        </div>
      </form>
    </div>
  );
}
