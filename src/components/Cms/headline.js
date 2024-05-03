import React from 'react'

export const Headline = (props) => {
  return (
    <h2 className="mt-6 mr-6 ml-6 text-3xl text-left w-full text-eerieBlack font-light">
      {props.props.data.st_headline}
      {/* TODO implement headline properties */}
      {/* {JSON.stringify(props.props.data.st_headlineLevel)} */}
    </h2>
  )
}
