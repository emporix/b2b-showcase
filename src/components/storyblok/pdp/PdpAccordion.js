import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import Accordion, { AccordionItem } from '../../Utilities/accordion'
import React, { Fragment } from 'react'
import { useLanguage } from '../../../context/language-provider'


const PdpAccordion = ({ blok, ...restProps }) => {
  const { currentLanguage } = useLanguage()

  return <div className="" {...storyblokEditable(blok)}>
    <Accordion>
      {blok.content.map((item, index) => (
        <Fragment key={'PdpAccordion' + index}>
          {item.component === 'aec_pdp_description' &&
            <AccordionItem index={0} title={currentLanguage === "de" ? "Produktbeschreibung" : "Product description"}
                           >
              <StoryblokComponent blok={item} {...restProps} />
            </AccordionItem>}
          {item.component === 'aec_pdp_mixins' &&
            <StoryblokComponent blok={item} {...restProps} startIndex={index} />
          }
        </Fragment>
      ))}
    </Accordion>
  </div>
}

export default PdpAccordion
