import { React } from 'react'
import './teaser.css'

export const Picture = (props) => {
  const classId = props?.props?.sectionType || ''
  return (
    <div className={`fs-${classId} mx-0 md:mx-24 rounded-none md:rounded-xl`}>
      <img
        className="object-fill rounded-none md:rounded-xl"
        src={props.props.data.st_picture.resolutions.ORIGINAL.url}
        alt={props.props.data.st_picture.description}
      />
    </div>
  )
}
