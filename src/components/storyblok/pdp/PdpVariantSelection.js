import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { useEffect, useState } from 'react'
import productService from '../../../services/product/product.service'
import { useProducts } from '../../../services/product/useProducts'
import _ from 'lodash'
import { useNavigate } from 'react-router'
import { useAuth } from '../../../context/auth-provider'

const PdpVariantSelection = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const { getProduct, getVariantChildren } = useProducts()
  const [variantAttributes, setVariantAttributes] = useState([])
  const [productVariantAttributes, setProductVariantAttributes] = useState()
  const [templateAttributes, setTemplateAttributes] = useState([])
  const navigate = useNavigate()
  const { userTenant } = useAuth()

  const isVariant = (product) => product &&
    ['PARENT_VARIANT', 'VARIANT'].includes(product.productType)

  const defaultProductVariantAttributes = (variantAttributes) => {
    const result = Object.entries(variantAttributes).map(([k, v]) =>
      ({ [k]: v[0].key }))
    return Object.assign({}, ...result)
  }

  if (isVariant(product)) {
    if (product.productType === 'PARENT_VARIANT') {
      const newVariantAttributes = product.variantAttributes
      getVariantChildren(product.id).then((childProducts) => {
        const childProduct = childProducts.find(child =>
          _.isEqual(child.mixins.productVariantAttributes,
            defaultProductVariantAttributes(newVariantAttributes),
          ),
        )
        navigate(`/${userTenant}/product/details/${childProduct.id}`)
      })
    }
  }

  useEffect(() => {
    if (isVariant(product)) {
      if (product.productType === 'VARIANT') {
        getProduct(product.parentVariantId).
          then(parentProduct => {
            setVariantAttributes(parentProduct.variantAttributes)
            setProductVariantAttributes(product.mixins.productVariantAttributes)
            setTemplateAttributes(parentProduct.template.attributes)
          })
      }
    }
  }, [product])

  return (isVariant(product) &&
    <div className="text-aldiBlue4" {...storyblokEditable(blok)}>
      <pre>{JSON.stringify(variantAttributes, null, 2)}</pre>
      <pre>{JSON.stringify(productVariantAttributes, null, 2)}</pre>
      <pre>{JSON.stringify(templateAttributes, null, 2)}</pre>
    </div>)
}

export default PdpVariantSelection
