import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import api from '../../services/api';
import './Operations.scss';

export default function OperationModal({ operation, categories, onSaved, onClose }) {
  const isEdit = !!operation;
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({ label: '', amount: '', date: today, categoryId: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (operation) {
      setForm({
        label: operation.label,
        amount: operation.amount,
        date: operation.date?.split('T')[0] ?? operation.date,
        categoryId: operation.category?.id ?? '',
      });
    }
  }, [operation]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { label: form.label, amount: parseFloat(form.amount), date: form.date, categoryId: parseInt(form.categoryId) };
      if (isEdit) await api.put(`/api/operations/${operation.id}`, payload);
      else await api.post('/api/operations', payload);
      onSaved();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { general: 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit operation' : 'New operation'} onClose={onClose}>
      {errors.general && <p className="op-modal__error">{errors.general}</p>}
      <form onSubmit={handleSubmit} className="op-modal__form">
        <div className="form-group">
          <label>Label</label>
          <input name="label" value={form.label} onChange={handleChange} placeholder="e.g., Coffee at Starbucks" required />
          {errors.label && <span className="field-error">{errors.label}</span>}
        </div>
        <div className="form-group">
          <label>Amount</label>
          <div className="op-modal__amount-wrap">
            <span className="op-modal__currency">$</span>
            <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange} placeholder="0.00" required />
          </div>
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>
        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
        </div>
        <div className="op-modal__actions">
          <button type="button" className="btn-link" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-green" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Save changes' : 'Save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
