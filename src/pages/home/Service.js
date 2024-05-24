import React, { useState } from 'react'
import logo from '../../assets/local_shipping.svg'
import electricBolt from '../../assets/electric_bolt.svg'
import star from '../../assets/stars.svg'
import verifiedUser from '../../assets/verified_user.svg'

const EachService = (props) => {
  return (
    <div className="text-white text-center items-center px-4 py-8 flex flex-col gap-6">
      <div className="w-fit">
        <img src={props.src} className="h-10 md:mx-auto filter-white" alt=""></img>
      </div>
      <div className="text-primary font-semibold text-2xl">{props.title}</div>
      <div className="font-normal text-lg text-balance">{props.content}</div>
    </div>
  )
}
const Service = () => {
  return (
    <div className="w-full bg-black grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 py-14 px-4 md:px-6 xl:px-36 gap-y-12 md:gap-14 lg:gap-x-4 xl:gap-12">
      <EachService
        src={logo}
        title="Kostenlose Lieferung"
        content="Kostenlose Lieferung ab einem Bestellwert von 50 €"
      />
      <EachService src={electricBolt} title="Schnelle Lieferung" content="Expresslieferung für schnellen Weingenuss." />
      <EachService src={star} title="Treueprämie" content="Sammeln und sparen mit unserem Treueprogramm." />
      <EachService
        src={verifiedUser}
        title="Garantie verlängern"
        content="Sichern Sie Ihren Kauf mit erweiterter Garantie."
      />
    </div>
  )
}

export default Service
