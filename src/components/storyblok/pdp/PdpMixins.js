import { storyblokEditable } from '@storyblok/react'
import { AccordionItem } from '../../Utilities/accordion'
import React, { Fragment } from 'react'
import HtmlTextBox from '../HtmlTextBox'

const ignoreMixins = [
  'productCustomAttributes',
  'productAdditionalInformation',
  'productVariantAttributes']

const PdpMixins = ({ blok, ...restProps }) => {
  const product = restProps.product
  const mixins = Object.entries(product.mixins).
    filter(entry => !ignoreMixins.includes(entry[0]))

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
