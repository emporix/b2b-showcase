import React from 'react'
import './teaser.css'

const Text_Banner = (props) => {
  return (
    <div className="text-balance w-full h-fit bg-primary text-aliceBlue py-8 md:py-10 text-center text-3xl md:text-[48px]  font-light md:leading-[64px] leading-[56px]">
      {props.props}
    </div>
  )
}

export default Text_Banner
