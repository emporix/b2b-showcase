import React, { useState } from 'react'

const EachService = (props) => {
  return (
    <div className="text-white text-left md:text-center md:items-center">
      <div className="w-full">
        <img
          src={props.src}
          className="w-12 h-12 md:w-16 md:h-16 md:mx-auto"
        ></img>{' '}
      </div>
      <div className="font-semibold text-[18px] md:text-[20px] leading-[24px] pt-6">
        {props.title}
      </div>
      <div className="font-inter font-normal text-[14px] leading-[24px] md:text-[16px] pt-2 md:pt-4 text-left">
        {props.content}
      </div>
    </div>
  )
}
const Service = () => {
  return (
    <div className="home_service">
      <EachService
        src="/free-shipping.png"
        title="Free Shipping"
        content="Free delivery on qualifying orders of &#163;50+"
      />
      <EachService
        src="/Delivery.png"
        title="Fast Delivery"
        content="Magna massa acet turca tratto at fames."
      />
      <EachService
        src="/gift.png"
        title="Loyalty Reward"
        content="Tellus ornare at consequat ipsum, non labortis."
      />
      <EachService
        src="/warranty.png"
        title="Extend Warranty"
        content="Extend your warranty on selected items."
      />
    </div>
  )
}

export default Service
