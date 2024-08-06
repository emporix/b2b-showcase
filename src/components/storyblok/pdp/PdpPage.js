import { useParams } from 'react-router-dom'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  availabilityDataSelector,
} from '../../../redux/slices/availabilityReducer'
import { useProducts } from '../../../services/product/useProducts'
import { useCurrency } from '../../../context/currency-context'
import { useLanguage } from '../../../context/language-provider'
import { useSites } from '../../../context/sites-provider'
import { minProductInStockCount } from '../../../constants/page'
import priceService from '../../../services/product/price.service'
import {
  getAllParentCategories,
  getRetrieveAllCategoriesWithResoureceId,
} from '../../../services/product/category.service'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { LoadingCircleProgress1 } from '../../Utilities/progress'
import _ from 'lodash'

const PdpPage = ({ blok }) => {

  const { productId } = useParams()
  const [product, setProduct] = useState({
    loading: true,
    data: null,
  })
  const availability = useSelector(availabilityDataSelector)
  const { getProduct, getVariantChildren } = useProducts()
  const { activeCurrency } = useCurrency()
  const { currentLanguage } = useLanguage()
  const { currentSite } = useSites()

  useEffect(() => {
    ;(async () => {

      const defaultProductVariantAttributes = (variantAttributes) => {
        const result = Object.entries(variantAttributes).map(([k, v]) =>
          ({ [k]: v[0].key }))
        return Object.assign({}, ...result)
      }

      const getProductId = async () => {
        const newProduct = await getProduct(productId)
        if (newProduct.productType === 'PARENT_VARIANT') {
          const newVariantAttributes = newProduct.variantAttributes
          const childProduct = await getVariantChildren(productId).then((childProducts) => {
            return childProducts.find(child =>
              _.isEqual(child.mixins.productVariantAttributes,
                defaultProductVariantAttributes(newVariantAttributes),
              )
            )
          })
          return childProduct.id
         } else {
          return productId
        }
      }

      try {
        const productId = await getProductId()
        let res = await getProduct(productId)
        res.src = res.media[0] === undefined ? '' : res.media[0]['url']
        let stock,
          stockLevel = 0

        if (availability['k' + res.id] === undefined) {
          stock = 'Out Of'
        } else {
          stockLevel = parseInt(availability['k' + res.id]['stockLevel'])
          if (stockLevel < minProductInStockCount) stock = 'Low'
          else stock = 'In'
        }

        res.stock = stock
        res.estimatedDelivery = '23.05.2022'
        res.subImages = []
        res.rating = 4
        res.count = 4
        res.productCount = stockLevel
        res.media.forEach((row, index) => {
          if (!index) {
            return
          }
          res.subImages.push(row['url'])
        })

        setProduct({
          loading: true,
          data: res,
        })
        let prices = await priceService.getPriceWithProductIds([productId])

        // Set price...
        if (prices.length > 0) res.price = prices[0]
        const category = await getRetrieveAllCategoriesWithResoureceId(
          productId,
        )
        if (category.length > 0) {
          let { data: categories } = await getAllParentCategories(
            category[0]['id'],
          )
          categories.push(category[0])
          let rootCategory, subCategory
          let childCategories = {}
          for (let c in categories) {
            if (categories[c].parentId === undefined)
              rootCategory = categories[c]
            else childCategories[categories[c].parentId] = categories[c]
          }
          let productCategory = []
          productCategory.push(rootCategory.name)

          subCategory = childCategories[rootCategory.id]

          rootCategory = subCategory
          productCategory.push(subCategory.name)

          res.category = productCategory
          setProduct((prev) => ({ ...prev, data: res }))
        }
      } finally {
        setProduct((prev) => ({ ...prev, loading: false }))
      }
    })()
  }, [productId, currentSite, currentLanguage, activeCurrency])

  return product.loading ? (
    <LoadingCircleProgress1 />
  ) : (<main {...storyblokEditable(blok)}>
    {blok.body && blok.body.map((blok, index) => {
      return index !== 1 ?
        <StoryblokComponent blok={blok} key={blok._uid} product={product.data} /> :
        <Fragment key={blok._uid}>
          <div className="h-[80px] md:h-[136px]" />
          <StoryblokComponent blok={blok} product={product.data} />
        </Fragment>
    })}
  </main>)
}

export default PdpPage
