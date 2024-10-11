import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../../context/language-provider'
import { useEffect, useState } from 'react'
import { useProducts } from '../../../services/product/useProducts'
import _ from 'lodash'
import { useNavigate } from 'react-router'
import { useAuth } from '../../../context/auth-provider'
import { cn } from '../../cssUtils'

const PdpVariantSelection = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const { getProduct, getVariantChildren } = useProducts()
  const [templateAttributes, setTemplateAttributes] = useState([])
  const [productVariantAttributes, setProductVariantAttributes] = useState()
  const navigate = useNavigate()
  const { userTenant } = useAuth()

  const isChildVariant = product.productType === 'VARIANT'

  useEffect(() => {
    if (isChildVariant) {
      getProduct(product.parentVariantId).
        then(parentProduct => {
          setTemplateAttributes(parentProduct.template.attributes.filter(
            attribute => attribute.metadata.variantAttribute === true))
          setProductVariantAttributes(product.mixins.productVariantAttributes)
        })
    }
  }, [product])

  const handleClick = (attribute, value) => {
    const newProductVariantAttributes = {
      ...productVariantAttributes,
      [attribute.key]: value.key,
    }
    getVariantChildren(product.parentVariantId).then((childProducts) => {
      const childProduct = childProducts.find(child =>
        _.isEqual(child.mixins.productVariantAttributes,
          newProductVariantAttributes,
        ),
      )
      navigate(`/${userTenant}/product/details/${childProduct.id}`)
    })
  }

  const isSelected = (attribute, value) => {
    return productVariantAttributes[attribute.key] === value.key
  }

  return (isChildVariant &&
    <div className="text-demoFontHighlightColor" {...storyblokEditable(blok)}>
      {templateAttributes.map(attribute => <div className="mb-3"
                                                key={'PdpVariantSelection_' +
                                                  attribute.key}>
        <div className="font-bold pb-2">{attribute.name[currentLanguage]}</div>
        <div className="flex gap-x-1">
          {attribute.values.map(
            value => <button className={cn('border rounded text-xs p-1', {
              'bg-demoFontHighlightColor text-white font-bold': isSelected(attribute, value),
            })}
                             key={'PdpVariantSelection_' + attribute.key +
                               value.key}
                             onClick={() => handleClick(attribute, value)}>
              {value.key}
            </button>)}</div>
      </div>)}
    </div>)
}

export default PdpVariantSelection
