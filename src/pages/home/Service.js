import React, { useState } from 'react'
import logo from '../../assets/local_shipping.svg'
import electricBolt from '../../assets/electric_bolt.svg'
import star from '../../assets/stars.svg'
import verifiedUser from '../../assets/verified_user.svg'

const EachService = (props) => {
  return (
    <div className="text-eerieBlack text-center md:text-center md:items-center h-[158px] w-[276px] md">
      <div className="w-full">
        <img src={props.src} className="h-10 md:mx-auto"></img>
      </div>
      <div className="md:text-[20px] leading-[24px] pt-7 text-[18px]/[30px] font-semibold">
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
    <div className="home_service h-[366px]">
      <EachService
        src={logo}
        title="Free Shipping"
        content="Free delivery on qualifying orders of &#163;50+"
      />
      <EachService
        src={electricBolt}
        title="Fast Delivery"
        content="Magna massa acet turca tratto at fames."
      />
      <EachService
        src={star}
        title="Loyalty Reward"
        content="Tellus ornare at consequat ipsum, non labortis."
      />
      <EachService
        src={verifiedUser}
        title="Extend Warranty"
        content="Extend your warranty on selected items."
      />
    </div>
  )
}

export default Service
