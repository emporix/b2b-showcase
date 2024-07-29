import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './navigationbar'
import { HiChevronDown } from "react-icons/hi";
import { useSelector } from 'react-redux'
import { pageMenuSelector } from '../../redux/slices/pageReducer'
import './topbar.css'
import { addTenantToUrl, homeUrl } from '../../services/service.config'
import AlgoliaSearchbar from '../AlgoliaSearchbar'
import { useContentful } from '../../context/contentful-provider'
import {Logo} from "../Logo";
import { APPLICATION_ID } from '../../constants/localstorage'
import MegaNav from './MegaNav'

const TopNav = ({ title }) => {
  const nav_title_condition = title !== '' && title !== 'home' ? true : false
  const [showMegaMenuContent, setShowMegaMenuContent] = useState(false)

  return (
    <div
      className={
        title === 'home'
          ? 'desktop_only_flex w-full md:h-[136px] absolute z-10 bg-aldiBlue1'
          : title === ''
          ? 'desktop_only_flex w-full h-[136px] bg-aldiBlue1'
          : 'desktop_only_flex w-full md:h-60 absolute z-10 bg-aldiBlue1'
      }
    >
      <div className="px-10 pt-[76px] w-full  flex xl:px-24  h-[136px] border border-aldiBlue1">
        <div
          className="menu-wrapper flex w-full"
          onMouseLeave={() => {
            setShowMegaMenuContent(false)
          }}
        >
          <div className="flex w-full h-10">
            <div className="flex flex-row justify-between pr-[8px] w-[470px] ml-[-97px] pl-[140px] bg-aldiBlue4 h-[81px] mt-[-21px]">
              <div className="mt-[12px]">
                <Logo onMouseOver={() => setShowMegaMenuContent(false)} />
              </div>
              <span className="text-white font-aldiCondensed tracking-[2px] mt-[8px] text-[42px]">ALDI</span>
            </div>
            <span className="ml-[8px] mt-[-13px] text-white font-bold font-aldiCondensed tracking-[2px] text-[42px]">ONLINESHOP</span>

            <div
              className="hidden lg:flex ml-20"
              onMouseOver={() => setShowMegaMenuContent(false)}
            >
              <>
                {localStorage.getItem(APPLICATION_ID) && (<AlgoliaSearchbar />)
                }
              </>
            </div>
          </div>
        </div>
      </div>
      {nav_title_condition && (
        <div className="md:absolute top-44 left-24 text-eerieBlack   font-semibold text-[24px]/[32px]">
        {title}
        </div>
      )}
    </div>
  )
}

const Topbar = ({ title }) => {
  return (
    <>
      <Navbar />
      <TopNav title={title} />
    </>
  )
}

export default Topbar
