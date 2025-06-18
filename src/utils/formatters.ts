export const formatCurrency = (amount: number): string => {
  const isSmallAmount = amount < 10;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: isSmallAmount ? 2 : 0,
    maximumFractionDigits: isSmallAmount ? 2 : 0,
  }).format(amount);
};


export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '–';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Ungültiges Datum';

  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `vor ${diffDays} Tagen`;

  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};