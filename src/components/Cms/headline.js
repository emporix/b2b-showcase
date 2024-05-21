import React from 'react'

export const Headline = (props) => {
  switch (props.props.data.st_headlineLevel) {
    default:
    case "h2":
      return <h2 className="mt-6 mr-6 ml-6 text-3xl text-left w-full text-eerieBlack font-light">
        {props.props.data.st_headline}
      </h2>
    case "h3":
      return <h3 className="mt-4 mr-4 ml-4 text-2xl text-left w-full text-eerieBlack font-light">
        {props.props.data.st_headline}
      </h3>
    case "h4":
      return <h4 className="mt-3 mr-3 ml-3 text-1xl text-left w-full text-eerieBlack font-light">
        {props.props.data.st_headline}
      </h4>
  }
}
