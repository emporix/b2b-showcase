import React, { useState } from 'react'
import logo from '../../assets/local_shipping.svg'
import electricBolt from '../../assets/electric_bolt.svg'
import star from '../../assets/stars.svg'
import verifiedUser from '../../assets/verified_user.svg'

const EachService = (props) => {
  return (
    <div className="text-white text-center md:text-center md:items-center h-[158px] w-[276px] md">
      <div className="w-full">
        <img src={props.src} className="h-10 md:mx-auto"></img>
      </div>
      <div className="text-primary md:text-[20px] leading-[24px] pt-7 text-[18px]/[30px] font-semibold">
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
    <div className="home_service h-[366px] bg-black text -white">
      <EachService
        src={logo}
        title="Kostenlose Lieferung"
        content="Kostenlose Lieferung ab einem Bestellwert von 50 €"
      />
      <EachService
        src={electricBolt}
        title="Schnelle Lieferung"
        content="Expresslieferung für schnellen Weingenuss."
      />
      <EachService
        src={star}
        title="Treueprämie"
        content="Sammeln und sparen mit unserem Treueprogramm."
      />
      <EachService
        src={verifiedUser}
        title="Garantie verlängern"
        content="Sichern Sie Ihren Kauf mit erweiterter Garantie."
      />
    </div>
  )
}

export default Service
