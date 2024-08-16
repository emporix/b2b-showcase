import React, { useState } from 'react'
import logo from '../../assets/local_shipping.svg'
import electricBolt from '../../assets/electric_bolt.svg'
import star from '../../assets/stars.svg'
import verifiedUser from '../../assets/verified_user.svg'
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation('homepage')

    return (
    <div className="w-full bg-black grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 py-14 px-4 md:px-6 xl:px-36 gap-y-12 md:gap-14 lg:gap-x-4 xl:gap-12">
      <EachService
        src={logo}
        title={t('delivery_header')}
        content={t('delivery_description')}
      />
      <EachService src={electricBolt} title={t('fast_delivery_header')} content={t('fast_delivery_description')} />
      <EachService src={star} title={t('fidelity_header')} content={t('fidelity_description')} />
      <EachService
        src={verifiedUser}
        title={t('warranty_header')}
        content={t('warranty_description')}
      />
    </div>
  )
}

export default Service
