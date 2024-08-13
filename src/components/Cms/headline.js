import React from 'react'

export const Headline = (props) => {
  const classId = props?.props?.sectionType || ''
  switch (props.props.data.st_headlineLevel) {
    default:
    case 'h2':
      return (
        <h2 data-preview-id={props?.props?.previewId} className={`fs-${classId} mt-10 text-3xl font-light text-eerieBlack`}>{props.props.data.st_headline}</h2>
      )
    case 'h3':
      return (
        <h3 data-preview-id={props?.props?.previewId} className={`fs-${classId} mt-10 text-2xl font-light text-eerieBlack`}>{props.props.data.st_headline}</h3>
      )
    case 'h4':
      return (
        <h4 data-preview-id={props?.props?.previewId} className={`fs-${classId} mt-10 text-1xl font-light text-eerieBlack`}>{props.props.data.st_headline}</h4>
      )
  }
}
