import React, { useState } from 'react'
import { AiOutlineInstagram } from 'react-icons/ai'

const Mobile_footer = () => {
  return (
    <>
      <ul className="mobile_only text-emporixGold font-inter font-bold text-base px-6">
        <li className="py-4 border-b">About Us</li>
        <li className="py-4 border-b">Support</li>
        <li className="py-4 border-b">My Account</li>
        <li className="py-4 border-b">Contact</li>
      </ul>
      <div className="mobile_only pt-4 pl-6 text-base text-black font-light">
        Call Us: +44123645678
      </div>
      <div className="mobile_only_flex pt-6 pl-6  text-black">
        <div>
          <img src="/facebook.png" />
        </div>

        <div className="pl-6 mt-[-2px]">
          <AiOutlineInstagram size={30} />
        </div>
      </div>
    </>
  )
}

const Dektop_footer = () => {
  return (
    <div className="desktop_only_flex  md:pt-24 max-w-screen-xl mx-auto ">
      <div className="mx-auto">
        <ul className="font-inter text-base text-black">
          <li className="text-emporixGold font-bold ">About Us</li>
          <li className=" font-light pt-4">Who we are</li>
          <li className=" font-light pt-4">Quality in the details</li>
          <li className=" font-light pt-4">Customer Reviews</li>
        </ul>
      </div>
      <div className="mx-auto">
        <ul className="font-inter text-base text-black">
          <li className="text-emporixGold font-bold ">Support</li>
          <li className=" font-light pt-4">Delivery</li>
          <li className=" font-light pt-4">Returns</li>
          <li className=" font-light pt-4">F.A.Q.</li>
          <li className=" font-light pt-4">Customer Support</li>
        </ul>
      </div>
      <div className="mx-auto">
        <ul className="font-inter text-base text-black">
          <li className="text-emporixGold font-bold ">My Account</li>
          <li className=" font-light pt-4">Sign In</li>
          <li className=" font-light pt-4">Register</li>
          <li className=" font-light pt-4">Quick Order</li>
          <li className=" font-light pt-4">My orders</li>
        </ul>
      </div>
      <div className="mx-auto">
        <ul className="font-inter text-base text-black">
          <li className="text-emporixGold font-bold ">Contact</li>
          <li className=" font-light pt-4">Call Us: +44123645678</li>
        </ul>
        <div className="pt-6  text-black flex">
          <div>
            <img src="/facebook.png" />
          </div>

          <div className="pl-6 mt-[-2px]">
            <AiOutlineInstagram size={30} />
          </div>
        </div>
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
