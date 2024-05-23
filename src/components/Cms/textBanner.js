import { React } from 'react'
import './teaser.css'

export const TextBanner = (props) => {
  return (
    <div className="my-3 mx-6 py-4 md:py-6 px-2 rounded-xl shadow-2xl bg-primary text-aliceBlue font-light text-center text-xl md:text-3xl">
      {props.props}
    </div>
  )
}
