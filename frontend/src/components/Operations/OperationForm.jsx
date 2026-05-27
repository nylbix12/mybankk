import { useState, useEffect } from 'react';
import api from '../../services/api';
import './OperationForm.css';

export default function OperationForm({ operation, categories, onSaved, onCancel }) {
  const [form, setForm] = useState({
    label: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (operation) {
      setForm({
        label: operation.label,
        amount: operation.amount,
        date: operation.date?.split('T')[0] || operation.date,
        categoryId: operation.category?.id || '',
      });
    }
  }, [operation]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        label: form.label,
        amount: parseFloat(form.amount),
        date: form.date,
        categoryId: parseInt(form.categoryId),
      };
      if (operation) {
        await api.put(`/api/operations/${operation.id}`, payload);
      } else {
        await api.post('/api/operations', payload);
      }
      onSaved();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="op-form-card">
      <h2>{operation ? 'Edit operation' : 'New operation'}</h2>
      {errors.general && <div className="form-error">{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Label</label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="e.g. Groceries"
              required
            />
            {errors.label && <span className="field-error">{errors.label}</span>}
          </div>
          <div className="form-group">
            <label>Amount (€)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. -24.50"
              required
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
            {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : (operation ? 'Save changes' : 'Add operation')}
          </button>
        </div>
      </form>
    </div>
  );
}
