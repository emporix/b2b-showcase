import React from 'react'
import { Text } from './text'

export const SimpleList = (props) => {
  const listEntries = props.props.data.st_elements;
  if (!listEntries || !listEntries.length) {
    return;
  }
  return (
    <div>
      <ul>
        <li>
          {listEntries.map((entry, idx) => {
            return <Text props={entry} key={idx} />
          })}
        </li>
      </ul>
    </div>
  )
}
