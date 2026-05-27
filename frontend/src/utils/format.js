export function formatAmount(amount) {
  return `$${Math.abs(parseFloat(amount)).toFixed(2)}`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${year}-${month}-${day}`;
}

export function getInitials(name) {
  if (!name) return '??';
  return name.slice(0, 2).toUpperCase();
}

export function getDisplayName(email) {
  if (!email) return '';
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
}

export function getCurrentMonthTotal(operations) {
  const now = new Date();
  return operations
    .filter(op => {
      const d = new Date(op.date);
      return d.getUTCMonth() === now.getMonth() && d.getUTCFullYear() === now.getFullYear();
    })
    .reduce((sum, op) => sum + parseFloat(op.amount), 0);
}
