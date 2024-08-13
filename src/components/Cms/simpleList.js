import React from 'react'
import { Text } from './text'
import { nanoid } from '@reduxjs/toolkit'

const TextFaq = ({ data }) => {
  const { st_question, st_answer } = data
  return (
    <>
      <h4 className="font-bold">{st_question}</h4>
      <div>
        <Text
          props={{
            type: 'Element',
            data: {
              content: [...st_answer],
            },
          }}
        />
      </div>
    </>
  )
}

export const SimpleList = ({ props }) => {
  const listEntries = props?.data?.st_elements || []
  if (!listEntries || !listEntries.length) {
    return
  }

  const classId = props?.sectionType || ''

  return (
    <div data-preview-id={props?.previewId}>
      <ul className={`fs-${classId}`}>
        {listEntries.map((entry) => {
          const sectionId = entry?.sectionType || 'text'
          return (
            <li className={`fs-${sectionId} mt-4`} key={nanoid()}>
              <TextFaq data={entry.data} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
