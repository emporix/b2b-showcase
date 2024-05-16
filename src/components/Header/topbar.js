import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './navigationbar'
import { HiChevronDown } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { pageMenuSelector } from '../../redux/slices/pageReducer'
import './topbar.css'
import { addTenantToUrl, homeUrl } from '../../services/service.config'
import AlgoliaSearchbar from '../AlgoliaSearchbar'
import { useContentful } from '../../context/contentful-provider'
import { Logo } from '../Logo'

const MegaNav = ({ showMegaMenuContent, setShowMegaMenuContent }) => {
  const [subMenuItems, setSubMenuItems] = useState([])
  const [showMegaMenuRightContent, setShowMegaMenuRightContent] = useState(false)
  const [subMenuMegaContent, setSubMenuMegaContent] = useState([])

  const onShowMegaMenu = () => setShowMegaMenuContent(true)

  const overMenuItem = (items) => {
    setSubMenuItems(items)
    if (!showMegaMenuContent) {
      setShowMegaMenuContent(true)
    }
  }
  const hideMegaMenuContent = () => {
    setShowMegaMenuContent(false)
  }
  const menuList = useSelector(pageMenuSelector)

  const { fields } = useContentful()

  const LinkItem = ({ item, main }) => (
    <li key={item.key} className={`mega_content_${main ? 'category_li font-bold text-xl' : 'sub_cat_li font-normal'}`}>
      <Link replace to={addTenantToUrl(item.url)}>
        {item.title}
      </Link>
    </li>
  )

  return (
    <div id="topbar-buttons" className="dropdown flex text-base">
      {menuList.map((item) => (
        <button
          key={item.title}
          className="mega_menu_dropbtn"
          onMouseOver={() => {
            item.items?.length ? overMenuItem(item.items) : hideMegaMenuContent()
          }}
          onClick={() => {
            item.items?.length ? overMenuItem(item.items) : hideMegaMenuContent()
          }}
        >
          <Link to={!item.items?.length ? addTenantToUrl(item.url) : homeUrl}>
            <div className="whitespace-nowrap">
              {item.contentfulFieldName ? fields[item.contentfulFieldName] : item.title}
            </div>
          </Link>

          <HiChevronDown size={20} className={item.items?.length ? 'ml-2 mt-1 h-5 w-5' : 'hidden'} aria-hidden="true" />
        </button>
      ))}

      <button key="zendesk" className="mega_menu_dropbtn">
        <Link to="https://mach11.zendesk.com/hc/de-de" target="_blank">
          <div className="whitespace-nowrap">Help Center</div>
        </Link>
      </button>

      {showMegaMenuContent ? (
        <div
          className="header-mega_dropdown-content main_bg_gradient py-12 px-24"
          onMouseEnter={onShowMegaMenu}
          onClick={() => setShowMegaMenuContent(false)}
        >
          <div className="row w-full h-full flex">
            <div className="w-[24%] h-fit text-[16px] text-eerieBlack">
              {subMenuItems.map((item) => (
                <ul key={item.title}>
                  <LinkItem item={item} main />
                  {item.items.map((subItem) => (
                    <LinkItem item={subItem} key={subItem.title} />
                  ))}
                </ul>
              ))}
            </div>
            {/* TODO: no use case, remove below? */}
            <div
              className="h-fit w-[76%] grid grid-cols-4 overflow-y-auto gap-4 pl-[24px]"
              onMouseOver={() => setShowMegaMenuRightContent(true)}
            >
              {showMegaMenuRightContent
                ? subMenuMegaContent.map((item) => (
                    <div key={item.title}>
                      <ul className=" text-black text-base">
                        <Link to={addTenantToUrl(item.url)}>
                          <li className="mega_content_sub_cat_li font-bold">{item.title}</li>
                        </Link>
                        {item.items.map((eachItem) => (
                          <Link key={eachItem.title} to={addTenantToUrl(eachItem.url)}>
                            <li className="mega_content_sub_cat_li">{eachItem.title}</li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const TopNav = ({ title }) => {
  const nav_title_condition = title !== '' && title !== 'home' ? true : false
  const [showMegaMenuContent, setShowMegaMenuContent] = useState(false)

  return (
    <div
      className={
        title === 'home'
          ? 'desktop_only_flex w-full md:h-36 absolute z-10'
          : title === ''
          ? 'desktop_only_flex h-36'
          : 'w-full z-10'
      }
    >
      <div className="desktop_only_flex px-4 pt-[76px] pb-8 w-full xl:px-24">
        <div
          className="menu-wrapper flex w-full"
          onMouseLeave={() => {
            setShowMegaMenuContent(false)
          }}
        >
          <div className="flex justify-between w-full h-10">
            <Logo onMouseOver={() => setShowMegaMenuContent(false)} />

            <MegaNav showMegaMenuContent={showMegaMenuContent} setShowMegaMenuContent={setShowMegaMenuContent} />

            <div className="hidden lg:flex" onMouseOver={() => setShowMegaMenuContent(false)}>
              <AlgoliaSearchbar />
            </div>
          </div>
        </div>
      </div>
      {nav_title_condition && (
        <div className="text-center xl:text-left mt-20 xs:mt-28 md:mt-4 px-4 w-full sm:mx-auto sm:w-3/4 md:w-full xl:px-24 top-44 text-eerieBlack font-semibold text-[32px]/[32px]">
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
