import React from 'react'
import JsonFormatter from 'react-json-formatter'

// for very simple lists only (glossary maybe)

export const SimpleList = (props) => {
  return (
    <div>
      <p className="mt-3 mr-6 ml-6 text-md text-left w-full text-eerieBlack font-light">
        <JsonFormatter json={props.props} />
      </p>
      <ul>
        <li>Item</li>
      </ul>
    </div>
  )
}
