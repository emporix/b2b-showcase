import { nanoid } from '@reduxjs/toolkit'
import React from 'react'

const blockType = {
  paragraph: 'p',
  block: 'p',
}

export const Text = (props) => {
  const classId = props?.props?.sectionType || ''
  return props.props.data.st_text.map((block) => {
    return block.content.map((str, idx) => {
      return React.createElement(
        blockType?.[block?.type] || 'p',
        {
          className: `fs-${classId} text-lg text-eerieBlack font-light`,
          key: nanoid,
        },
        str.content
      )
    })
  })
}

//text-lg text-left text-eerieBlack font-light
