import React from 'react'

const Elements = ({ type, content, data }) => {
  switch (type) {
    case 'paragraph':
    case 'block':
      return (
        <p className={`text-lg text-eerieBlack font-light`}>
          {content?.map((item) => (
            <Elements {...item} />
          ))}
        </p>
      )
    case 'text':
    default:
      if (data?.format === 'bold')
        return content?.map((item) => (
          <strong>
            <Elements {...item} />
          </strong>
        ))
      return Array.isArray(content) ? content?.map((item) => <Elements {...item} />) : content
  }
}

export const Text = ({ props }) => {
  const { type, data } = props

  switch (type) {
    case 'Section':
      return data?.st_text?.map((entry) => <Text props={{ type: 'Element', data: entry }} />)
    case 'Element':
      return <Elements type={data?.type} content={data?.content} />
    default:
      return <p>default</p>
  }
}
