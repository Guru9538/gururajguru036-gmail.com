export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAttendanceBadgeColor(rate: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (rate >= 95) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Excellent' };
  }
  if (rate >= 85) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Good' };
  }
  if (rate >= 75) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Average' };
  }
  return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Low (<75%)' };
}

export function getGradeBadgeColor(letter: string): { bg: string; text: string } {
  switch (letter) {
    case 'A+':
    case 'A':
      return { bg: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-800' };
    case 'B+':
    case 'B':
      return { bg: 'bg-blue-100 text-blue-800', text: 'text-blue-800' };
    case 'C+':
    case 'C':
      return { bg: 'bg-amber-100 text-amber-800', text: 'text-amber-800' };
    case 'D':
      return { bg: 'bg-orange-100 text-orange-800', text: 'text-orange-800' };
    default:
      return { bg: 'bg-rose-100 text-rose-800', text: 'text-rose-800' };
  }
}
