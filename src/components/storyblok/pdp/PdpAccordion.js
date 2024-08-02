import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import Accordion, { AccordionItem } from '../../Utilities/accordion'
import React from 'react'

const PdpAccordion = ({ blok, ...restProps }) => {
  return <div className="" {...storyblokEditable(blok)}>
    <Accordion>
      <AccordionItem index={0} title={blok.text}>
        <StoryblokComponent blok={blok.content[0]} {...restProps} />
      </AccordionItem>
    </Accordion>
  </div>
}

export default PdpAccordion
