import { useProductList } from 'context/product-list-context'
import React, { useMemo } from 'react'
import { useSites } from '../../context/sites-provider'

const ProductListBanner = ({ className }) => {
  const { currentSiteObject } = useSites()
  const { categoryDetails } = useProductList()
  const url = useMemo(() => {
    if (!categoryDetails?.media) {
      return
    }
    if (currentSiteObject && currentSiteObject.code) {
      let media = categoryDetails.media.find((item) =>
        item.customAttributes.name.includes(
          currentSiteObject.code.toUpperCase()
        )
      )
      if (!media) {
        media = categoryDetails.media.find((item) =>
          item.customAttributes.name.includes('USA')
        )
      }
      return media.url
    }
  }, [currentSiteObject, categoryDetails])

  if (!url) {
    return null
  }
  return <img src={url} className={`${className} `} alt="product-list-banner" />
}

export default ProductListBanner
