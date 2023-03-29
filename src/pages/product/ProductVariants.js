import React, { useEffect, useState } from 'react'
import { useProducts } from '../../services/product/useProducts'
import { VariantAccordion, VariantHeader } from './VariantAccordion'
import { useSites } from '../../context/sites-provider'
import { useLanguage } from '../../context/language-provider'
import { useCurrency } from 'context/currency-context'

export const ProductVariants = ({ product }) => {
  const { getVariantChildren } = useProducts()
  const { currentSite } = useSites()
  const [variants, setVariants] = useState([])

  const { currentLanguage } = useLanguage()

  const { activeCurrency } = useCurrency()

  useEffect(() => {
    ;(async () => {
      const variants = await getVariantChildren(product.id)
      setVariants(variants)
    })()
  }, [product, currentSite, activeCurrency, currentLanguage])

  return (
    <>
      <VariantHeader />
      <div>
        {variants &&
          variants.length > 0 &&
          variants.map((variant) => <VariantAccordion variant={variant} />)}
      </div>
    </>
  )
}
