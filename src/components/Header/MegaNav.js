import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { pageMenuSelector } from '../../redux/slices/pageReducer'
import { useContentful } from '../../context/contentful-provider'
import { Link } from 'react-router-dom'
import { addTenantToUrl, homeUrl } from '../../services/service.config'
import { HiChevronDown } from 'react-icons/hi'

const MegaNav = ({ showMegaMenuContent, setShowMegaMenuContent }) => {
  const [subMenuItems, setSubMenuItems] = useState([])
  const [showMegaMenuRightContent, setShowMegaMenuRightContent] =
    useState(false)
  const [subMenuMegaContent, setSubMenuMegaContent] = useState([])
  const onShowMegaMenu = () => setShowMegaMenuContent(true)
  const overMenuItem = (items) => {
    setSubMenuItems(items)
    if (!showMegaMenuContent) setShowMegaMenuContent(true)
  }
  const hideMegaMenuContent = () => {
    setShowMegaMenuContent(false)
  }
  const menuList = useSelector(pageMenuSelector)

  const { fields } = useContentful()
  return (
    <div id="topbar-buttons" className="dropdown flex text-base border border-red-600">
      {menuList.map((item, index) => (
        <button
          key={index}
          className="mega_menu_dropbtn"
          onMouseOver={() =>
            item.items.length !== 0
              ? overMenuItem(item.items)
              : hideMegaMenuContent()
          }
        >
          <Link to={!item.items.length ? addTenantToUrl(item.url) : homeUrl}>
            <div>
              {' '}
              {item.contentfulFieldName
                ? fields[item.contentfulFieldName]
                : item.title}
            </div>
          </Link>

          <HiChevronDown size={20}
                         className={item.items.length ? 'ml-2 mt-1 h-5 w-5' : 'hidden'}
                         aria-hidden="true"
          />
        </button>
      ))}
      {showMegaMenuContent ? (
        <div
          className="header-mega_dropdown-content"
          onMouseEnter={onShowMegaMenu}
          onClick={() => setShowMegaMenuContent(false)}
        >
          <div className="row w-full h-full flex">
            <div className="h-full w-[24%] text-[16px]/[24px] text-eerieBlack">
              <div className="pl-[76px] pt-[48px] overflow-y-auto max-h-full">
                <ul className="text-base font-bold">
                  {subMenuItems.map((item, index) => (
                    <Link replace key={index} to={addTenantToUrl(item.url)}>
                      <li
                        className="mega_content_category_li"
                        onMouseOver={() => {
                          setSubMenuMegaContent(item.items)
                          setShowMegaMenuRightContent(true)
                        }}
                        onMouseLeave={() => {
                          setShowMegaMenuRightContent(false)
                        }}
                      >
                        {item.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="h-full w-[76%] grid grid-cols-4 overflow-y-auto gap-4 pl-[24px] pt-[48px] max-h-full"
              onMouseOver={() => setShowMegaMenuRightContent(true)}
            >
              {showMegaMenuRightContent
                ? subMenuMegaContent.map((item) => (
                  <div key={item.categoryId}>
                    <ul className=" text-black text-base">
                      <Link to={addTenantToUrl(item.url)}>
                        <li className="mega_content_sub_cat_li font-bold">
                          {item.title}
                        </li>
                      </Link>
                      {item.items.map((eachItem) => (
                        <Link
                          key={eachItem.categoryId}
                          to={addTenantToUrl(eachItem.url)}
                        >
                          <li className="mega_content_sub_cat_li">
                            {eachItem.title}
                          </li>
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

export default MegaNav
