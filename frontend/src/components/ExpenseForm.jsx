import { useState } from "react";

const initialValues = {
  label: "",
  amount: "",
  date: "",
  category: "",
};

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.amount) {
      return;
    }

    if (onAddExpense) {
      onAddExpense({
        ...formData,
        amount: Number(formData.amount),
      });
    }

    setFormData(initialValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="expense-label">Label</label>
        <input
          id="expense-label"
          name="label"
          type="text"
          value={formData.label}
          onChange={handleChange}
          placeholder="Expense label"
        />
      </div>

      <div>
        <label htmlFor="expense-amount">Amount</label>
        <input
          id="expense-amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="expense-category">Category</label>
        <input
          id="expense-category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          placeholder="Food, Housing..."
        />
      </div>

      <button type="submit">Add</button>
    </form>
  );
}

export default ExpenseForm;
