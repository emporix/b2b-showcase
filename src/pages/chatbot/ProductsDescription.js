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
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

export const i18nProductCustomAttributesNS = 'productCustomAttributes'
export const i18nPCADescriptionSuffix = '_desc'

const subcategories = [
  { key: 'red_wine', sub: 'rotwein' },
  { key: 'white_wine', sub: 'weißwein' },
  { key: 'rose_wine', sub: 'roséwein' },
]

const ProductsDescription = ({ lang }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [contents, setContents] = useState({})
  const { setLanguage, currentLanguage } = useLanguage()
  const { t } = useTranslation('page')

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
  }, [maincategory, subcategory, category, categoryTree, setProductIds])

  useEffect(() => {
    const fetchIds = async ({ key, sub }) => {
      const { productIds } = await getProductCategoryDetail(maincategory, sub, category, categoryTree)

      if (productIds.length > 0) {
        const filteredProducts = productsAll.filter((product) => productIds.includes(product.id))

        setContents((cur) => {
          return {
            ...cur,
            [key]: filteredProducts,
          }
        })
      }
    }
    if (categoryTree && categoryTree?.length > 0 && maincategory) {
      subcategories.map((cat) => fetchIds(cat))
    }
  }, [maincategory, subcategory, category, categoryTree, setProductIds, productsAll])

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
      <Helmet>
        <meta name="robots" content="noindex"></meta>
      </Helmet>
      {isLoading ? (
        <LoadingCircleProgress1 />
      ) : (
        <section id="products">
          <h1>{t('product')}</h1>
          {subcategories.map((cat) => {
            return (
              <section key={cat.key}>
                <h2>{t(cat.key)}</h2>
                {subcategories.map((cat) => {
                  return contents?.[cat.key]?.map((item) => (
                    <ProductsDescriptionItems content={item} fsTitle={t('description')} key={nanoid()} />
                  ))
                })}
              </section>
            )
          })}
        </section>
      )}
    </div>
  )
}

export default ProductsDescription
