import { useEffect, useState } from 'react'
import { LoadingCircleProgress1 } from 'components/Utilities/progress'
import { useLanguage } from 'context/language-provider'
import { useProductList } from 'context/product-list-context'
import { getProductCategoryDetail } from 'services/product/category.service'
import { useParams } from 'react-router-dom'
import ProductsDescriptionItems from './ProductsDescriptionItems'
import i18next from 'i18next'
import { ACCESS_TOKEN } from '../../constants/localstorage'
import ApiRequest from 'services'
import { productSchemaApi } from 'services/service.config'
import { nanoid } from '@reduxjs/toolkit'

export const i18nProductCustomAttributesNS = 'productCustomAttributes'
export const i18nPCADescriptionSuffix = '_desc'

const ProductsDescription = ({ lang }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [contents, setContents] = useState([])
  const { setLanguage, currentLanguage } = useLanguage()

  const { maincategory, subcategory, category } = useParams()

  const { category: categoryTree, setProductIds, productsAll } = useProductList()

  useEffect(() => {
    setLanguage(lang)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      const { productIds } = await getProductCategoryDetail(maincategory, subcategory, category, categoryTree)
      productIds && setProductIds(productIds)
    }

    if (categoryTree && categoryTree?.length > 0 && maincategory) {
      setIsLoading(true)
      fetchProducts()
      setIsLoading(false)
    }
  }, [categoryTree, maincategory, subcategory, category, setProductIds])

  useEffect(() => {
    // const injectFS = productsAll?.length > 0 ? productsAll.map((product) => product) : []
    // console.log({ productsAll, injectFS })
    setContents(productsAll)
  }, [productsAll])

  useEffect(() => {
    const ensureAttributeNameTranslationIsPresent = async (lang) => {
      if (i18next.hasResourceBundle(lang, i18nProductCustomAttributesNS)) {
        return
      }

      const headers = {
        'X-Version': 'v2',
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        'Accept-Language': lang,
      }
      const res = await ApiRequest(productSchemaApi(), 'get', {}, headers, {})
      if (res.status !== 200) {
        return
      }

      const resp = res.data[0]

      // console.log({ resp })

      //reflect https://api.emporix.io/schema/n11showcase/schemas to i18next resource
      const resource = {}
      resource[resp.id] = resp.name[lang]
      resp.attributes.forEach((a) => {
        resource[a.key] = a.name[lang]
        resource[a.key + i18nPCADescriptionSuffix] = a.description[lang]
      })
      i18next.addResourceBundle(lang, i18nProductCustomAttributesNS, resource, false, true)
      i18next.changeLanguage(lang)
    }

    ensureAttributeNameTranslationIsPresent(currentLanguage)
  }, [currentLanguage])

  return (
    <div>
      {isLoading ? (
        <LoadingCircleProgress1 />
      ) : (
        <section>
          <h1>Products</h1>
          <h2>{maincategory}</h2>
          {contents?.map((content) => (
            <ProductsDescriptionItems content={content} key={nanoid()} />
          ))}
        </section>
      )}
    </div>
  )
}

export default ProductsDescription
