// Helper utilities

// Generate unique ID
let counter = 0;
export function generateId(prefix = 'id') {
  counter++;
  return `${prefix}-${Date.now()}-${counter}`;
}

// Format date string
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Format date + time
export function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Format number with commas
export function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

// Format currency
export function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

// Days until a date
export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

// Deep clone (for undo operations)
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
