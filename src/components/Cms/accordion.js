import React from 'react'

// for very simple lists only (glossary maybe)

export const Accordion = (props) => {
  return (
    <p className="mt-3 mr-6 ml-6 text-md text-left w-full text-eerieBlack font-light">
      {JSON.stringify(props.props)}
    </p>
  )
}
