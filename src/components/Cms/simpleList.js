import React from 'react'

// for very simple lists only (glossary maybe)

export const SimpleList = (props) => {
  return (
    <div>
      <p className="mt-3 mr-6 ml-6 text-md text-left w-full text-eerieBlack font-light">
        {JSON.stringify(props.props)}
      </p>
      <ul>
        <li>Item</li>
      </ul>
    </div>
  )
}
