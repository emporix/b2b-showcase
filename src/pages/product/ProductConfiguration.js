import React, { useCallback, useEffect, useState } from 'react'
import { useProducts } from '../../services/product/useProducts'
import { VariantAccordion, VariantHeader } from './VariantAccordion'
import { useSites } from '../../context/sites-provider'
import { useLanguage } from '../../context/language-provider'
import { useCurrency } from 'context/currency-context'
import { Button } from '@mui/material'
import { getLanguageFromLocalStorage } from 'context/language-provider'

export const ProductConfiguration = ({ product }) => {
  const { getVariantChildren } = useProducts()
  const { currentSite } = useSites()
  const [variants, setVariants] = useState([])
  const [availableVariants, setAvailableVariants] = useState([])
  const [configuredVariant, setConfiguredVariant] = useState(null)

  const [renderKey, setRenderKey] = useState([])

  const [selectedValues, setSelectedValues] = useState(null)

  const { currentLanguage } = useLanguage()

  const { activeCurrency } = useCurrency()

  useEffect(() => {
    ;(async () => {
      const templateValues = {}
      Object.keys(product.variantAttributes).map(key => {templateValues[key]= null})
      setSelectedValues(templateValues)

      const variants = await getVariantChildren(product.id)
      setVariants(variants)
      setAvailableVariants(variants)
    })()
  }, [product, currentSite, activeCurrency, currentLanguage])

  const findAttributeName = (key) => {

    return product.template.attributes.filter(attr => attr.key === key).map(attr => {
        if(attr.name) {
            if(attr.name[getLanguageFromLocalStorage()]) {
                return attr.name[getLanguageFromLocalStorage()]
            }
            if(attr.name['en']) {
                return attr.name['en']
            }
        }
    })
  }

  const activateAttributeValue = (attribute, value) => {
    selectedValues[attribute] = selectedValues[attribute] === value ? null : value

    const validVariants = variants.filter(variant => isVariantValid(variant))
    setAvailableVariants(validVariants)
    if(isVariantFullyConfigured()) {
      setConfiguredVariant(validVariants[0])
    } else {
      setConfiguredVariant(null)
    }
    setRenderKey(Math.random())
  }

  const isVariantValid = (variant) => {
    for (const [key, value] of Object.entries(selectedValues)) {
      if(value && variant.mixins.productVariantAttributes[key] !== value) {
        return false
      }
    }
    return true
  }

  const isVariantFullyConfigured = () => {
    return !Object.values(selectedValues).filter(value => !value).length > 0
  }

  const isAttributeAvailable = (attribute, value) => {
    return availableVariants.filter(variant => variant.mixins.productVariantAttributes[attribute] === value).length > 0
  }

  const isDisabled = (attribute, value) => {
    return selectedValues && !isAttributeAvailable(attribute, value)
  }

  const getClassnames = (attribute, value) => {
    return selectedValues && selectedValues[attribute] === value ? 'rgb(250, 196, 32)' : 'rgb(255, 255, 255)'
  }

  return (
    <>
      <p className='information-caption'>Product configuration</p>
      <div key={renderKey}>
        {
            Object.entries(product.variantAttributes).map(([key, value]) => 
              <>
              <div className='product-configuration-attribute'>
                  <div><b>{findAttributeName(key)}</b></div>
                  {value.map(attributeValue => 
                    <Button 
                      disabled={isDisabled(key, attributeValue.key)}
                      onClick={() => {activateAttributeValue(key, attributeValue.key)}}
                      sx={{
                        mt: 1,
                        mb: '14px',
                        borderRadius: 0,
                        border: '1px solid black',
                        padding: '5px',
                        margin: '5px',
                        'background-color': getClassnames(key, attributeValue.key),
                        '&:hover': {
                          backgroundColor: 'rgb(250, 196, 32)',
                        },
                      }}
                    >{attributeValue.key}</Button>
                  )}
                </div> 
              </>
            )
        }
        {
          configuredVariant && <VariantAccordion key={configuredVariant.id} variant={configuredVariant} expandedByDefault={true}></VariantAccordion>
        }
      </div>

    </>
  )
}
