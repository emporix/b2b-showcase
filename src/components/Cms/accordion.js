import React from 'react'
import { FsGenericComponentList } from '../../resolver/firstSpirit.resolver'
import Accordion, { AccordionItem } from '../Utilities/accordion'

// for very simple lists only (glossary maybe)

export const CMS_Accordion = (props) => {
  return <>
    <div className="pt-3 pb-3 pl-3 pr-3 standard_box_shadow rounded-xl">
    <Accordion>
      <AccordionItem index={0} title={props.props.displayName}>
       <FsGenericComponentList componentData={props.props.data.st_elements} />
      </AccordionItem>
    </Accordion>
    </div>
  </>
}
