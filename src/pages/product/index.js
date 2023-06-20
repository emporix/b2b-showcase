import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductPage from './ProductPage'
import ProductDetailPage from './ProductDetailPage'
import Layout from '../Layout'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'
import priceService from '../../services/product/price.service'
import { availabilityDataSelector } from '../../redux/slices/availabilityReducer'
import { useSelector } from 'react-redux'
import { minProductInStockCount } from '../../constants/page'
import {
  getRetrieveAllCategoriesWithResoureceId,
  getAllParentCategories,
} from '../../services/product/category.service'
import { useProducts } from '../../services/product/useProducts'
import { useSites } from '../../context/sites-provider'
import { useLanguage } from '../../context/language-provider'
import { getBrand } from 'services/product/brand.service'
import { getLabel } from 'services/product/labels'
import { useCurrency } from 'context/currency-context'
import { useAuth } from '../../context/auth-provider'
import { getQualificationsWithItemsExtended } from '../../integration/voucherify/voucherifyApi'
import { mapEmporixUserToVoucherifyCustomer } from '../../integration/voucherify/mappers/mapEmporixUserToVoucherifyCustomer'
import { getCustomerAdditionalMetadata } from '../../helpers/getCustomerAdditionalMetadata'

const ProductList = () => {
  return (
    <Layout title="Product">
      <ProductPage />
    </Layout>
  )
}

export const ProductDetails = () => {
  const { user } = useAuth()
  const { productId } = useParams()
  const [qualifications, setQualifications] = useState([])

  useEffect(() => {
    setQualifications([])
    ;(async () => {
      const customer = mapEmporixUserToVoucherifyCustomer(
        user,
        getCustomerAdditionalMetadata()
      )
      setQualifications(
        await getQualificationsWithItemsExtended(
          'PRODUCTS',
          [
            {
              quantity: 1,
              product_id: productId,
            },
          ],
          customer
        )
      )
    })()
  }, [productId])

  const [product, setProduct] = useState({
    loading: true,
    data: null,
  })
  const [brand, setBrand] = useState()
  const [labels, setLabels] = useState([])
  const availability = useSelector(availabilityDataSelector)
  const { getProduct } = useProducts()
  const { activeCurrency } = useCurrency()

  const { currentLanguage } = useLanguage()

  const { currentSite } = useSites()
  useEffect(() => {
    ;(async () => {
      if (!product.data) return
      const brandId = product.data.mixins.productCustomAttributes.brand
      const brand = await getBrand(brandId)
      setBrand(brand)
    })()
  }, [product.data])

  useEffect(() => {
    ;(async () => {
      if (!product.data) return
      const lableIds = product.data.mixins.productCustomAttributes.labels
      if (lableIds && lableIds.length > 0) {
        const labels = await Promise.all(
          lableIds.map(async (labelId) => {
            const label = await getLabel(labelId)
            return label
          })
        )
        setLabels(labels)
      }
    })()
  }, [product.data])

  useEffect(() => {
    ;(async () => {
      try {
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
          productId
        )
        if (category.length > 0) {
          let { data: categories } = await getAllParentCategories(
            category[0]['id']
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

  return (
    <Layout title={''}>
      {product.loading ? (
        <LoadingCircleProgress1 />
      ) : (
        <ProductDetailPage
          product={product.data}
          brand={brand}
          labels={labels}
          qualifications={qualifications}
        />
      )}
    </Layout>
  )
}

export default ProductList
