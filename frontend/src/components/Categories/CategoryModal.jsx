import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import ColorPicker from '../ui/ColorPicker';
import api from '../../services/api';
import './Categories.scss';

export default function CategoryModal({ category, onSaved, onClose }) {
  const isEdit = !!category;
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#00C49A');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) { setTitle(category.title); setColor(category.color ?? '#00C49A'); }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await api.put(`/api/categories/${category.id}`, { title, color });
      else await api.post('/api/categories', { title, color });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.errors?.title || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit category' : 'New category'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="cat-modal__form">
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
            placeholder="e.g., Food, Transport, Leisure" required autoFocus />
          {error && <span className="field-error">{error}</span>}
        </div>
        <div className="form-group">
          <label>Color</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <div className="cat-modal__actions">
          <button type="button" className="btn-link" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-green" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Save changes' : 'Save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
