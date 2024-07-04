import React from 'react'
import { useTranslation } from 'react-i18next'

export const StockLevel = ({stockLevel} ) => {
  const { t } = useTranslation('page')

  if (stockLevel > 0 ) {
    return <span className="product-available">{stockLevel} {t('in_stock')}</span>
  }
  return <span className="product-unavailable">{t('out_stock')}</span>
}