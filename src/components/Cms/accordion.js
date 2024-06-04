import React from 'react'
import { FsGenericComponentList } from '../../resolver/firstSpirit.resolver'
import Accordion, { AccordionItem } from '../Utilities/accordion'

// for very simple lists only (glossary maybe)

export const CMS_Accordion = (props) => {
  console.log(props.props)
  return (
    <Accordion>
      <AccordionItem index={0} title={props.props.displayName}>
        <FsGenericComponentList componentData={props.props.data.st_elements} />
      </AccordionItem>
    </Accordion>
  )
}
