import { Logo } from '../Logo'
import MegaNav from './MegaNav'
import { APPLICATION_ID } from '../../constants/localstorage'
import AlgoliaSearchbar from '../AlgoliaSearchbar'
import React, { useState } from 'react'

const Menu = ({ blok }) => {
  const [showMegaMenuContent, setShowMegaMenuContent] = useState(false)

  return (
    <div
      className="desktop_only_flex flex-row w-full h-[136px] fixed z-10 bg-aldiBlue1">
      <div className="absolute w-1/2 left-0 h-[136px] bg-aldiBlue4"></div>
      <div
        className="z-10 mx-4 xl:mx-auto w-full max-w-screen-xl mt-[56px] flex flex-row">
        <div
          className="flex w-[233px] h-full bg-aldiBlue4 justify-between items-center pr-[8px]">
          <Logo onMouseOver={() => setShowMegaMenuContent(false)} />
          <span
            className="hidden xl:block text-white font-aldiCondensed tracking-[2px] text-[42px]">ALDI</span>
        </div>
        <div
          className="flex w-full pl-[8px] justify-between items-center bg-aldiBlue1">
          <span
            className="hidden lg:block text-white font-bold font-aldiCondensed tracking-[2px] text-[42px]">ONLINESHOP</span>
          <div className="mt-[-10px]">
            <MegaNav
              blok={blok}
              showMegaMenuContent={showMegaMenuContent}
              setShowMegaMenuContent={setShowMegaMenuContent}
            />
          </div>
          <div
            className="hidden lg:flex ml-20"
            onMouseOver={() => setShowMegaMenuContent(false)}
          >
            <>
              {localStorage.getItem(APPLICATION_ID) &&
                (<AlgoliaSearchbar />)
              }
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
