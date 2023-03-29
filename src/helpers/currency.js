

export const formatCurrency = (
  currency,
  value
) => {
  if (value === undefined || currency === undefined || currency.length === 0) {
    return '-'
  } else {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    }).format(value)
  }
}
