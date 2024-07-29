import React, { useState } from 'react'
import { AiOutlineInstagram } from 'react-icons/ai'
import { footerData } from './footer-data'
import payment from "../../assets/payment.png"

const Mobile_footer = () => {
  return (
    <>
      <div className="mobile_only_flex pt-6 pl-6 text-aldiBlue4">
        <div className="flex flex-col">
          {footerData.map((subject, index) => (
            <div className="flex flex-col w-full border-b border-white pt-6 pb-10">
              <span
                className="font-semibold text-xl mb-6">{subject.title}</span>
              {index === 1 ?
                <img className="w-fit" src={payment} /> :
                subject.items.map((item, index) => (
                  <span className="mb-2 leading-[23px]">{item.label}</span>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const Dektop_footer = () => {
  return (
    <div
      className="desktop_only_flex  md:py-10 max-w-screen-xl mx-auto text-aldiBlue4">
      <div className="grid w-full grid-cols-5">
        {footerData.map((subject, index) => (
          <div className="flex flex-col h-full border-r border-white pl-6">
            <span className="font-semibold text-xl mb-6">{subject.title}</span>
            {index === 1 ? <img src={payment} /> : subject.items.map((item, index) => (
              <span className="mb-2 leading-[23px]">{item.label}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div className="footer">
      <Mobile_footer />
      <Dektop_footer />
    </div>
  )
}
export default Footer
