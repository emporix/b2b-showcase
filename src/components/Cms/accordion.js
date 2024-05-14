import React from 'react'
import JsonFormatter from 'react-json-formatter'

// for very simple lists only (glossary maybe)

export const Accordion = (props) => {
  return (
    <p className="mt-3 mr-6 ml-6 text-md text-left w-full text-eerieBlack font-light">
      <JsonFormatter json={props.props} />
    </p>
  )
}
