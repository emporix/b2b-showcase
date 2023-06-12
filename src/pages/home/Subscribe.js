import React, { useState } from 'react'

const Subscribe = () => {
  return (
    <div className="subscribe">
      <div className="pt-12 md:pt-24 w-2/3 max-w-[600px] capitalize font-semibold text-[32px] leading-[44px] md:text-[32px] md:leading-[48px] mx-auto">
        Subscribe to our Newsletter and get the latest news and offers
      </div>
      {/* <button className="bg-darkBlue mt-6 md:mt-12  h-12 px-[98.5px] md:px-[55px] py-[17px] md:w-[240px] text-center border border-white font-bold font-inter text-[14px] leading-[14px]"> */}
      <button className="px-6 py-3.5 font-semibold bg-yellow text-eerieBlack rounded mt-6 md:mt-12  h-12 md:px-[55px] md:w-[240px] text-center font-inter text-[14px] leading-[24px]">
        SUBSCRIBE NOW
      </button>
    </div>
  )
}

export default Subscribe
