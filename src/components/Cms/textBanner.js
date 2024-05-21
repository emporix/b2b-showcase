import { React } from 'react'
import './teaser.css'

export const TextBanner = (props) => {
  return (
    <div className="text-balance mt-3 mb-3 mr-6 ml-6 rounded-xl shadow-2xl bg-primary text-aliceBlue py-4 md:py-6 text-center text-xl md:text-[32px]  font-light md:leading-[64px] leading-[56px]">
      {props.props}
    </div>
  )
}
