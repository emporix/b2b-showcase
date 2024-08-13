import React from 'react'
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineYoutube,
} from 'react-icons/ai'

const Mobile_footer = () => {
  return (
    <>
      <ul className="mobile_only text-primary font-bold text-base px-6">
        <li className="py-4 border-b">About Us</li>
        <li className="py-4 border-b">Support</li>
        <li className="py-4 border-b">My Account</li>
        <li className="py-4 border-b">Contact</li>
      </ul>
      <div className="mobile_only pt-4 pl-6 text-base text-white font-light">Call Us: +44123645678</div>
      <div className="mobile_only_flex pt-6 pl-6  text-white">
        <div className="pl-6 mt-[-2px] text-bgWhite">
          <AiOutlineInstagram size={30} />
        </div>
        <div className="pl-6 mt-[-2px] text-bgWhite">
          <AiOutlineFacebook size={30} />
        </div>
        <div className="pl-6 mt-[-2px] text-bgWhite">
          <AiOutlineYoutube size={30} />
        </div>
      </div>
    </>
  )
}

const Dektop_footer = () => {
  return (
    <div className="bg-aliceBlue">
      <div className="desktop_only_flex  md:py-12 max-w-screen-xl mx-auto ">
        <div className="mx-auto">
          <ul className="text-base">
            <li className="text-primary font-bold text-lg ">Alle Weine</li>
            <li className=" font-light pt-4">Rotwein</li>
            <li className=" font-light pt-4">Roséwein</li>
            <li className=" font-light pt-4">Weißwein</li>
          </ul>
        </div>
        <div className="mx-auto">
          <ul className="text-base">
            <li className="text-primary font-bold text-lg">Marken</li>
            <li className=" font-light pt-4">Tutorial</li>
            <li className=" font-light pt-4">Resources</li>
            <li className=" font-light pt-4">Guides</li>
            <li className=" font-light pt-4">Examples</li>
            <li className=" font-light pt-4">Docs</li>
          </ul>
        </div>
        <div className="mx-auto">
          <ul className="text-base">
            <li className="text-primary font-bold text-lg">Über Uns</li>
            <li className=" font-light pt-4">Stories</li>
            <li className=" font-light pt-4">Community</li>
            <li className=" font-light pt-4">Blog</li>
            <li className=" font-light pt-4">Careers</li>
            <li className=" font-light pt-4">Brand Assets</li>
          </ul>
        </div>
        <div className="mx-auto">
          <ul className="text-base">
            <li className="text-primary font-bold text-lg">Kontakt</li>
            <li className="font-light mt-5">
              Willy-Brand-Allee 2 <br /> 81829 München
            </li>
            <li className="font-light pt-4">
              Phone: <span className="text-primary">089 588084870</span>
            </li>
            <li className="font-light pt-4">
              Email: <span className="text-primary">info@neteleven.de</span>
            </li>
            <img src="/img/n11logo.png" className="mt-5 w-36" alt="neteleven logo"></img>
          </ul>
        </div>
      </div>
      <div className="p-4 bg-primary text-manatee flex justify-between align-center">
        <div>
          <p className="text-bgWhite font-bold ">Copyright 2023. Alle Rechte vorbehalten.</p>
        </div>
        <div className="flex">
          <div className="flex pl-6 mt-[-2px] text-bgWhite">
            <div className="pl-6 mt-[-2px] text-bgWhite flex items-center">
              <AiFillInstagram size={30} />
            </div>
            <div className="pl-6 mt-[-2px] text-bgWhite flex items-center">
              <AiFillFacebook size={30} />
            </div>
            <div className="pl-6 mt-[-2px] text-bgWhite flex items-center">
              <AiFillYoutube size={30} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div className="footer mt-auto">
      <Mobile_footer />
      <Dektop_footer />
    </div>
  )
}
export default Footer
