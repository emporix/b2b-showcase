import React from 'react'
import {FsGenericComponentList} from '../../resolver/firstSpirit.resolver'
import Accordion, {AccordionItem} from '../Utilities/accordion'

// for very simple lists only (glossary maybe)

export const CMS_Accordion = (props) => {
  const { displayName, data } = props.props
  return (
      <Accordion previewId={props?.props?.previewId}>
          <AccordionItem index={0} title={displayName}>
              <FsGenericComponentList componentData={data.st_elements} />
          </AccordionItem>
      </Accordion>
  )
}
