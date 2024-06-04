import { React } from 'react'
import './teaser.css'

export const TextBanner = (props) => {
  const classId = props?.props?.sectionType || ''
  return (
    <div
      className={`fs-${classId} py-4 md:py-6 px-4 rounded-xl shadow-2xl bg-primary text-aliceBlue font-light text-center text-xl md:text-3xl`}
    >
      {props.props}
    </div>
  )
}
