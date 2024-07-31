import { nanoid } from '@reduxjs/toolkit'
import React from 'react'

const Elements = ({ type, content, data }) => {
  switch (type) {
    case 'paragraph':
    case 'block':
      return (
        <p className={`text-lg text-eerieBlack font-light`} key={nanoid()}>
          {content?.map((item) => (
            <Elements {...item} key={nanoid()} />
          ))}
        </p>
      )
    case 'text':
    default:
      if (data?.format === 'bold')
        return content?.map((item) => (
          <strong key={nanoid()}>
            <Elements {...item} />
          </strong>
        ))
      return Array.isArray(content) ? content?.map((item) => <Elements {...item} key={nanoid()} />) : content
  }
}

export const Text = ({ props }) => {
  const { type, data, previewId } = props

  switch (type) {
    case 'Section':
      return (
          <div data-preview-id={previewId}>
            {data?.st_text?.map((entry) => <Text props={{ type: 'Element', data: entry }} key={nanoid()} />)}
          </div>
      )
    case 'Element':
      return <Elements type={data?.type} content={data?.content} key={nanoid()} />
    default:
      return null
  }
}
