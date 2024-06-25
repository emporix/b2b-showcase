import { React } from 'react'
import './teaser.css'

export const TextBanner = (props) => {
  const classId = props?.props?.sectionType || 'text-banner'

  return (
    <div
      className={`fs-${classId} py-4 md:py-6 px-4 mx-4 mx-adjust rounded-xl shadow-2xl bg-primary text-aliceBlue text-center text-xl md:text-3xl`}
    >
      {props.props}
    </div>
  )
}
