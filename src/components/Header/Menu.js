import { Logo } from '../Logo'
import MegaNav from './MegaNav'
import { APPLICATION_ID } from '../../constants/localstorage'
import AlgoliaSearchbar from '../AlgoliaSearchbar'
import React, { useState } from 'react'

const Menu = ({ blok }) => {
  const [showMegaMenuContent, setShowMegaMenuContent] = useState(false)

  return (
    <div
      className="desktop_only_flex flex-row w-full h-[136px] fixed z-10 bg-demoMainNavRightColor shadow-md">
      <div className="absolute w-1/2 left-0 h-[136px] bg-demoMainNavLeftColor shadow-md"></div>
      <div
        className="z-10 mx-4 xl:mx-auto w-full max-w-screen-xl mt-[56px] flex flex-row">
        <div
          className="flex w-[233px] h-full bg-demoMainNavLeftColor justify-between items-center pr-[8px]"
          onMouseLeave={() => setShowMegaMenuContent(false)}
        >
          <Logo onMouseOver={() => setShowMegaMenuContent(false)} />
        </div>
        <div
          className="flex w-full pl-[8px] justify-between items-center bg-demoMainNavRightColor"
          onMouseLeave={() => setShowMegaMenuContent(false)}
        >
          <span
            className="hidden lg:block text-demoActionColor font-bold tracking-[-0.075em] text-[46px] mt-[14px]"
            onMouseOver={() => setShowMegaMenuContent(true)}
          >
            Shop
          </span>
          <div className="mt-[2px]">
            <MegaNav
              blok={blok}
              showMegaMenuContent={showMegaMenuContent}
              setShowMegaMenuContent={setShowMegaMenuContent}
              onMouseLeave={() => setShowMegaMenuContent(false)}
            />
          </div>
          <div
            className="hidden lg:flex ml-20"
            onMouseOver={() => setShowMegaMenuContent(false)}
          >
            {localStorage.getItem(APPLICATION_ID) && (
              <AlgoliaSearchbar />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
