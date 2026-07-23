export const formatNumberWithDots = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const rawDigits = String(val).replace(/\D/g, '');
  if (!rawDigits) return '';
  return Number(rawDigits).toLocaleString('id-ID');
};

export const parseNumberFromDots = (val) => {
  if (!val) return 0;
  const rawDigits = String(val).replace(/\D/g, '');
  return parseInt(rawDigits, 10) || 0;
};
