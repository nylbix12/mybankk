function ExpenseList({ expenses = [] }) {
  if (!expenses.length) {
    return <p>Aucune dépense à afficher</p>;
  }

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          <article>
            <h3>{expense.label}</h3>
            <p>Amount: {expense.amount}</p>
            <p>Date: {expense.date}</p>
            <p>Category: {expense.category}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
