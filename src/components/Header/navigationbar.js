import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from 'react-icons/ai'
import { CgNotes } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux'
import Badge from '@mui/material/Badge'
import AccountMenu from './accountmenu'
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineUserCircle,
} from 'react-icons/hi'
import LayoutContext from '../../pages/context'
import { LargePrimaryButton } from '../Utilities/button'
import {
  pageMenuSelector,
  putCmsNavigation,
} from '../../redux/slices/pageReducer'
import {
  addTenantToUrl,
  homeUrl,
  loginUrl,
} from '../../services/service.config'

import { CurrencyBeforeValue } from 'components/Utilities/common'
import { useSites } from 'context/sites-provider'
import { useAuth } from 'context/auth-provider'
import { useLanguage } from '../../context/language-provider'
import { useQuotes } from 'context/quotes-context'
import { useContentful } from '../../context/contentful-provider'
import { useCart } from 'context/cart-provider'
import { useCurrency } from 'context/currency-context'
import { getLocalizedCmsNavigation } from 'services/content/navigation.service'
import { useTranslation } from 'react-i18next'
import NavDropdown from './NavDropdown'

const Navbar = () => {
  const { userTenant: tenant } = useAuth()
  const { sites, onSiteChange, currentSite, currentSiteObject } = useSites()
  const { languages, currentLanguage, setLanguage } = useLanguage()
  const { user } = useAuth()
  const { quotesTotal } = useQuotes()
  const [open, setOpen] = useState(false)

  const [displaySubItems, setDisplaySubItems] = useState(false)
  const [title, setTitle] = useState('')
  const [subMenuItems, setSubMenuItems] = useState([])

  const { setShowCart } = useContext(LayoutContext)
  const menuList = useSelector(pageMenuSelector)
  const navigate = useNavigate()
  const { currencyList, activeCurrency, updateCurrency } = useCurrency()
  const { cartAccount } = useCart()
  const dispatch = useDispatch()
  const { t } = useTranslation('page')
  const currencyChangeHandler = async (value, site) => {
    updateCurrency(value, site)
  }
  const cmsNavigationData = async () => {
    const result = await getLocalizedCmsNavigation(currentLanguage)
    const cmsNavigation = result.data?.cmsNavigation
    if (!cmsNavigation) {
      return
    }

    let contentEntries = cmsNavigation
      .filter(
        (i) =>
          i.seoRoute?.startsWith('/Inhalt') ||
          i.seoRoute?.startsWith('/Content')
      )
      .filter(
        (i) =>
          !i.label.toLowerCase().startsWith('inhalt') &&
          !i.label.toLowerCase().startsWith('content')
      )
      .map((i) => {
        return {
          title: i.label,
          url: i.seoRoute.startsWith('/')
            ? i.seoRoute.substring(1)
            : i.seoRoute,
          key: i.caasDocumentId,
        }
      })

    dispatch(
      putCmsNavigation([
        {
          title: t('content'),
          key: 'content',
          url: 'inhalt',
          items: contentEntries,
        },
      ])
    )
  }

  useEffect(() => {
    cmsNavigationData()
  }, [currentLanguage])

  const ParentBoard = () => {
    return (
      <>
        <div className="pt-12 pb-8 items-center ">
          {user ? (
            <div className="h-[75px] border-y w-full justify-between flex text-gray text-center items-center font-inter ">
              <div className="flex">
                <HiOutlineUserCircle size={25} />
                <div className="pl-2">{user.username}</div>
              </div>
              <div>
                <AiOutlineMail size={20} />
              </div>
            </div>
          ) : (
            <div className="w-full h-12 text-sm text-center items-center text-white">
              <Link to={loginUrl()}>
                <LargePrimaryButton
                  className="!bg-primary"
                  title="Login | Register"
                />
              </Link>
            </div>
          )}
        </div>
        <div className="w-full">
          <ul>
            {menuList.map((item, index) => (
              <ParentMenu key={index} item={item} />
            ))}
          </ul>
        </div>
        {user && (
          <div
            // className="w-full h-[59px] border-y flex justify-between items-center mt-6 font-inter text-base">
            className=" flex justify-between py-6 border-b last:border-b-0 text-xl"
          >
            Site
            <select className="text-tinBlue appearance-none">
              {sites
                .filter((s) => s.active)
                .sort((a, b) => a.code.localeCompare(b.code))
                .map((site) => {
                  return (
                    <option key={site.code} value={site.code}>
                      {site.name}
                    </option>
                  )
                })}
            </select>
          </div>
        )}
        <div
          // className="w-full h-[59px] border-y flex justify-between items-center mt-6 font-inter text-base">
          className=" flex justify-between py-6 border-b last:border-b-0 text-xl"
        >
          Language
          <select className="text-tinBlue appearance-none">
            <option value="Engish">English</option>
            <option value="Italian">Italian</option>
            <option value="French">French</option>
          </select>
        </div>
        <div
          // className="w-full h-[59px] border-y flex justify-between items-center">
          className=" flex justify-between py-6 border-b last:border-b-0 text-xl"
        >
          Currency
          <select
            value={activeCurrency.code !== undefined ? activeCurrency.code : ''}
            onChange={(e) =>
              currencyChangeHandler(e.target.value, currentSiteObject)
            }
            className="text-tinBlue appearance-none"
          >
            {currencyList.map((currency) => {
              return (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol}
                </option>
              )
            })}
          </select>
        </div>
      </>
    )
  }

  const ParentMenu = (props) => {
    const item = props.item
    return (
      <li
        key={item.title}
        className=" flex justify-between py-6 border-b text-xl"
        onClick={() => parentMenuClicked(item.title, item.items)}
      >
        {item.contentfulFieldName
          ? fields[item.contentfulFieldName]
          : item.title}
        <HiChevronRight
          size={18}
          className={item.items?.length ? 'h-8 w-8' : 'hidden'}
        />
      </li>
    )
  }

  const SubMenu = (props) => {
    const item = props.item
    return (
      <>
        {!item.items?.length ? (
          <Link to={addTenantToUrl(item.url)}>
            <li
              key={item.title}
              className=" flex justify-between items-center pb-4  text-base text-eerieBlack"
              onClick={() => parentMenuClicked(item.title, item.items)}
            >
              {item.title}
            </li>
          </Link>
        ) : (
          <li
            key={item.title}
            className=" flex justify-between items-center pb-4 text-base text-eerieBlack"
            onClick={() => parentMenuClicked(item.title, item.items)}
          >
            {item.title}
            <HiChevronRight size={20} className={'h-8 w-8'} />
          </li>
        )}
      </>
    )
  }

  const SubBoard = () => {
    return (
      <>
        <div
          className="w-full h-fit flex text-center items-center mt-12 pb-6 text-sm"
          onClick={() => setDisplaySubItems(false)}
        >
          <HiChevronLeft size={20} className="h-12 w-8 pr-1" />
          Back
        </div>
        <div className=" flex justify-between py-6 border-b text-xl">
          {title}
        </div>
        <div className=" flex justify-between py-6 text-xl px-12">
          <ul>
            {subMenuItems.map((item, index) => (
              <SubMenu key={index} item={item} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  const parentMenuClicked = (title, items) => {
    if (items.length) {
      setTitle(title)
      setDisplaySubItems(true)
      setSubMenuItems([...items])
    }
  }
  const handleOpenCart = () => {
    setShowCart(true)
  }

  const handleOpenQuotes = () => {
    navigate(`/${tenant}/my-account/my-quotes`)
  }
  // create a function for toggle mobile nav
  const handleNavOpen = () => {
    setOpen(!open)
  }
  const handleSiteChange = async (e) => {
    await onSiteChange(e.target.value)
    const site = sites.find((site) => site.code === e.target.value)
    await currencyChangeHandler(site.currency, site)
  }

  const [cartTotal, setCartTotal] = useState(0)
  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [cartCurrency, setCartCurrency] = useState('-')
  const { fields } = useContentful()
  useEffect(() => {
    setCartTotal(cartAccount.items.length || 0)
    if (
      cartAccount &&
      cartAccount.totalPrice &&
      cartAccount.totalPrice.amount
    ) {
      setCartTotalPrice(cartAccount.subTotalPrice.amount)
    } else {
      setCartTotalPrice(0)
    }
    if (cartAccount && cartAccount.currency) {
      setCartCurrency(cartAccount.currency)
    }
  }, [cartAccount])

  return (
    <header className="header">
      {/* Dektop language and currency selection */}
      <div className="desktop_only_flex font-inter text-sm text-white items-center">
        <ul className="flex items-center">
          <li className="mr-4">
            <NavDropdown
              name={fields.siteLabel}
              list={sites
                .filter((s) => s.active)
                .sort((a, b) => a.code.localeCompare(b.code))
                .map((item) => ({
                  text: item.name,
                  value: item.code,
                }))}
              onChangeHandler={handleSiteChange}
              currentValue={currentSiteObject.name}
            >
              <span className="world-icon absolute h-4 w-4 text-white"></span>
            </NavDropdown>
          </li>
          <li className="mr-4">
            <NavDropdown
              name={fields.languageLabel}
              list={languages
                .sort((a, b) => a.localeCompare(b))
                .map((item) => ({
                  text: item,
                  value: item,
                }))}
              onChangeHandler={(e) => setLanguage(e.target.value)}
              currentValue={currentLanguage}
            />
          </li>
          <li className="mr-4">
            <NavDropdown
              name={fields.currencyLabel}
              list={currencyList.map((item) => ({
                text: item.symbol,
                value: item.code,
              }))}
              onChangeHandler={(e) =>
                currencyChangeHandler(e.target.value, currentSiteObject)
              }
              currentValue={
                activeCurrency.symbol !== undefined ? activeCurrency.symbol : ''
              }
            />
          </li>
        </ul>
      </div>

      {/* Dektop navigation selection */}
      <div className="desktop_only_flex font-inter font-normal text-sm text-white">
        {!user ? (
          <ul className="flex items-center">
            <li className="px-4 flex cursor-pointer" onClick={handleOpenCart}>
              {cartTotal !== 0 ? (
                <Badge badgeContent={cartTotal} color="error">
                  <AiOutlineShoppingCart size={20} />
                </Badge>
              ) : (
                <AiOutlineShoppingCart size={20} />
              )}
              <div id="cart-value" className="pl-3 text-white flex">
                <CurrencyBeforeValue value={cartTotalPrice} />
              </div>
            </li>
            <li className="px-2">
              <a className="hover:text-emporixGold" href={`/${tenant}/login`}>
                Login
              </a>
            </li>
            |
            <li className="px-2">
              <a className="hover:text-emporixGold" href={`/${tenant}/signup`}>
                Sign Up
              </a>
            </li>
          </ul>
        ) : (
          <ul className="flex">
            <li className="px-4">
              <AiOutlineMail size={20} />
            </li>
            |
            <li className="px-4 pt-[2px]">
              {quotesTotal !== 0 ? (
                <Badge badgeContent={quotesTotal} color="error">
                  <CgNotes
                    size={16}
                    className="cursor-pointer"
                    onClick={handleOpenQuotes}
                  />
                </Badge>
              ) : (
                <CgNotes
                  size={16}
                  className="cursor-pointer"
                  onClick={handleOpenQuotes}
                />
              )}
            </li>
            |
            <li className="px-4 flex cursor-pointer" onClick={handleOpenCart}>
              {cartTotal !== 0 ? (
                <Badge badgeContent={cartTotal} color="warning">
                  <AiOutlineShoppingCart size={20} className="cursor-pointer" />
                </Badge>
              ) : (
                <AiOutlineShoppingCart size={20} />
              )}

              <div className="pl-[17.5px] text-white flex">
                <CurrencyBeforeValue
                  currency={cartCurrency}
                  value={cartTotalPrice}
                />
              </div>
            </li>
            |
            <li className="pl-4 flex">
              <AccountMenu name={user.username} />
            </li>
          </ul>
        )}
      </div>

      {/* mobile menu selection */}
      <div className="flex md:hidden items-center justify-between w-full pl-4 pr-8 py-2 bg-aliceBlue">
        <div className="mobile_only_flex w-2/5 sm:w-1/3">
          <Link to={homeUrl()} className="flex">
            <img src="/img/n11logo.png" />
          </Link>
        </div>

        <div className="w-1/2 flex justify-end gap-8">
          <div className="mobile_only">
            <AiOutlineSearch size={20} />
          </div>
          <div className="mobile_only_flex cursor-pointer">
            {!open ? <AiOutlineMenu size={20} onClick={handleNavOpen} /> : null}
            {/* absolut mobile navigation */}
            <div
              className={
                !open
                  ? 'hidden'
                  : ' text-black absolute top-0 left-0 w-full  h-screen bg-white p-4 text-center font-medium overflow-y-auto'
              }
            >
              <div className="h-10 justify-between flex">
                <div className="flex">
                  <Link to={loginUrl()} className="flex">
                    <img src="/img/n11logo.png" className="" alt=""></img>
                    {/* <div className="px-4 text-[25px] font-medium items-center">
                                        <span>{fields.companyNameLabel}</span>
                                    </div> */}
                  </Link>
                </div>
                <div
                  className="flex text-center items-center"
                  onClick={handleNavOpen}
                >
                  <span className="pr-4">Close</span>
                  <span className="text-xl">&#10006;</span>
                  {/* <AiOutlineClose size={25}/> */}
                </div>
              </div>
              {!displaySubItems ? <ParentBoard /> : <SubBoard />}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
