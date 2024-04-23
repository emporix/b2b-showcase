import { TENANT } from 'constants/localstorage'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { putShopItems } from 'redux/slices/pageReducer'
import { fetchCatalogs } from 'services/catalogs.service'
import {
  getCagegoryDetails,
  getCategoryId,
  getProductCategoryTrees,
} from 'services/product/category.service'
import { useSites } from './sites-provider'
import priceService from '../services/product/price.service'
import productService from '../services/product/product.service'
import { useCurrency } from './currency-context'
import { getLanguageFromLocalStorage, useLanguage } from './language-provider'
export const ProductListContext = createContext({})

export const useProductList = () => useContext(ProductListContext)

const getProductData = async (productIds, pageNumber, itemsPerPage, sortProp, sortDir) => {
  const products = await productService.getProductsWithIds(productIds)
  const prices = await priceService.getPriceWithProductIds(productIds)
  const prices_obj = {}
  prices.forEach((p) => {
    prices_obj[`p${p.itemId.id}`] = p
  })
  let price_id
  for (let i = 0; i < products.length; i++) {
    price_id = `p${products[i]['id']}`
    if (prices_obj[price_id] !== undefined) {
      products[i]['price'] = prices_obj[price_id]
      products[i]['priceTotalValue'] = prices_obj[price_id].totalValue
    }
  }
  const collator = new Intl.Collator([getLanguageFromLocalStorage()], {numeric: true});
  products.sort((a,b)=> collator.compare(a[sortProp], b[sortProp]) * sortDir)
  return products.slice(
    itemsPerPage * (pageNumber - 1),
    itemsPerPage * pageNumber
  )
}

const ProductListProvider = ({ children, id }) => {
  const productListCountsPerPage = [6, 9, 15]
  const { maincategory: categoryName } = useParams()
  const [categoryDetails, setCategoryDetails] = useState()
  const { currentSite: site } = useSites()
  const [category, setCategory] = useState([])
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [products, setProducts] = useState([])
  const [productIds, setProductIds] = useState([])
  const [productsPerPage, setProductsPerPage] = useState(
    productListCountsPerPage[0]
  )
  const sortingTypes =
    [{name:"Price (High to Low)", prop:"priceTotalValue", dir:-1},{name:"Price (Low to High)", prop:"priceTotalValue", dir:1},{name:"Name (A-Z)", prop:"name", dir:1},{name:"Name (Z-A)", prop:"name", dir:-1}]
  const [sortingTypeIndex, setSortingTypeIndex] = useState(0);

  const { currentSite } = useSites()
  const { activeCurrency } = useCurrency()
  const { currentLanguage } = useLanguage()
  const totalProducts = useMemo(() => productIds.length, [productIds.length])
  const dispatch = useDispatch()

  useEffect(() => {
    ;(async () => {
      const tenant = localStorage.getItem(TENANT)
      const catalogs = await fetchCatalogs(tenant, site)
      let rootCategoryIds = catalogs.flatMap((catalog) => {
        return catalog.categoryIds
      })
      const category = await getProductCategoryTrees(
        [...new Set(rootCategoryIds)],
        currentLanguage
      )
      setCategory(category)
      dispatch(putShopItems(category))
    })()
  }, [currentLanguage, currentSite])

  useEffect(() => {
    ;(async () => {
      if (!categoryName) {
        return
      }
      const categoryId = getCategoryId(categoryName)
      const categoryDetails = await getCagegoryDetails(categoryId)
      setCategoryDetails(categoryDetails)
    })()
  }, [categoryName])

  useEffect(() => {
    ;(async () => {
      try {
        setIsProductsLoading(true)
        const newProducts = await getProductData(
          productIds,
          pageNumber,
          productsPerPage,
          sortingTypes[sortingTypeIndex].prop,
          sortingTypes[sortingTypeIndex].dir
        )
        setProducts(newProducts)
      } catch (e) {
        console.error(e)
      } finally {
        setIsProductsLoading(false)
      }
    })()
  }, [
    productIds,
    productsPerPage,
    pageNumber,
    currentSite,
    activeCurrency,
    currentLanguage,
    sortingTypeIndex
  ])

  return (
    <ProductListContext.Provider
      value={{
        categoryDetails,
        category,
        total: totalProducts,
        isProductsLoading,
        products,
        setProductIds,
        productsPerPage,
        setProductsPerPage,
        pageNumber,
        setPageNumber,
        productListCountsPerPage,
        sortingTypes,
        sortingTypeIndex,
        setSortingTypeIndex
      }}
    >
      {children}
    </ProductListContext.Provider>
  )
}

export default ProductListProvider
