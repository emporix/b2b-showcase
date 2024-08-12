import { storyblokEditable } from '@storyblok/react'
import { AccordionItem } from '../../Utilities/accordion'
import React, { Fragment } from 'react'
import HtmlTextBox from '../HtmlTextBox'
import { useLanguage } from '../../../context/language-provider'

const ignoreMixins = [
  'productCustomAttributes',
  'productAdditionalInformation',
  'productVariantAttributes',
  'Zus\u0061\u0308tzlicheProduktinformationen',
]

const PdpMixins = ({ blok, ...restProps }) => {
  const product = restProps.product
  const { currentLanguage } = useLanguage()
  const mixins = product.mixins && Object.entries(product.mixins).
    filter(entry => {
      return !ignoreMixins.includes(entry[0])
    })

  const additionalDocument = product.mixins?.['Zus\u0061\u0308tzlicheProduktinformationen']?.additionalDocument
  if (additionalDocument !== undefined) {
    const fieldName = currentLanguage === 'de' ? 'Dokumente' : 'Documents'
    const documents = product.mixins?.['Zus\u0061\u0308tzlicheProduktinformationen']?.additionalDocument.map(
      item => {
        const parts = item.split(',')
        const title = parts[0]
        const url = parts[1]
        return `<a href="${url}">${title}</a>`
      })
    const documentMixin = [
      fieldName, {
        [fieldName]: documents,
      },
    ]
    mixins.push(documentMixin)
  }

  console.log(mixins)

  return (<Fragment {...storyblokEditable}>
    {mixins && mixins.map((mixin, index) => (
      <AccordionItem index={index + restProps.startIndex} title={mixin[0]}
                     key={'PdpMixins' + index}>
        {mixin[1][mixin[0]]?.map((text, index) => (
          <div className="text-aldiBlue4" key={'PdpMixins-Item' + index}>
            <HtmlTextBox text={text} />
          </div>
        ))}
      </AccordionItem>
    ))}
  </Fragment>)
}

export default PdpMixins
