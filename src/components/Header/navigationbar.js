import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai'
import { CgNotes } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux'
import Badge from '@mui/material/Badge'
import AccountMenu from './accountmenu'
import { HiChevronLeft, HiChevronRight, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi'
import LayoutContext from '../../pages/context'
import { pageMenuSelector, putCmsNavigation } from '../../redux/slices/pageReducer'
import { addTenantToUrl, homeUrl, loginUrl } from '../../services/service.config'

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
import NavDropdown from '../Utilities/dropdown/NavDropdown'

const Navbar = () => {
  const { userTenant: tenant, logout } = useAuth()
  const { sites, onSiteChange, currentSiteObject } = useSites()
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

  const langMap = {
    de: 'Deutsch',
    en: 'English',
  }

  useEffect(() => {
    const cmsNavigationData = async () => {
      const result = await getLocalizedCmsNavigation(currentLanguage)
      const cmsNavigation = result.data?.cmsNavigation
      if (!cmsNavigation) {
        return
      }

      let contentEntries = cmsNavigation
        .filter((i) => i.seoRoute?.startsWith('/Inhalt') || i.seoRoute?.startsWith('/Content'))
        .filter((i) => !i.label.toLowerCase().startsWith('inhalt') && !i.label.toLowerCase().startsWith('content'))
        .map((i) => {
          return {
            title: i.label,
            url: i.seoRoute.startsWith('/') ? i.seoRoute.substring(1) : i.seoRoute,
            key: i.caasDocumentId,
          }
        })

      contentEntries.push({ title: t('glossary'), url: 'glossary' })

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

    cmsNavigationData()
  }, [currentLanguage, dispatch, t])

  const ParentBoard = () => {
    return (
      <>
        <div className="pt-12 pb-8 items-center ">
          {user ? (
            <>
              <div className="h-[75px] border-y w-full justify-between flex text-tinBlue text-center items-center">
                <div
                  className="flex cursor-pointer hover:text-primary"
                  onClick={() => navigate(`/${tenant}/my-account`)}
                >
                  <HiOutlineUserCircle size={24} />
                  <div className="pl-2">{user.username}</div>
                </div>
                <div className="flex ml-auto justify-center items-center gap-4">
                  <div className="text-gray">
                    <AiOutlineMail size={24} />
                  </div>
                  <div>
                    {quotesTotal !== 0 ? (
                      <Badge badgeContent={quotesTotal} color="error">
                        <CgNotes size={24} className="cursor-pointer" onClick={handleOpenQuotes} />
                      </Badge>
                    ) : (
                      <CgNotes size={24} className="cursor-pointer" onClick={handleOpenQuotes} />
                    )}
                  </div>
                  <div className="flex cursor-pointer" onClick={handleOpenCart}>
                    {cartTotal !== 0 ? (
                      <Badge badgeContent={cartTotal} color="error">
                        <AiOutlineShoppingCart size={24} />
                      </Badge>
                    ) : (
                      <AiOutlineShoppingCart size={24} />
                    )}
                    {/* <div id="cart-value" className="pl-3 text-gray flex">
                    <CurrencyBeforeValue value={cartTotalPrice} />
                  </div> */}
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="cursor-pointer flex justify-center mt-4 text-primary hover:text-highlight"
                  onClick={logout}
                >
                  <HiOutlineLogout size={24} />
                  {t('signout')}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              <Link to={loginUrl()} className="cta-primary inline-block w-full text-sm md:w-auto">
                <span>{`${t('login')} | ${t('register')}`}</span>
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
          <div className="flex justify-between py-6 border-b last:border-b-0 text-xl">
            {t('site')}
            <select
              value={currentSiteObject.code}
              className="text-tinBlue appearance-none"
              onChange={(e) => handleSiteChange(e.target.value)}
            >
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
        <div className="flex justify-between py-6 border-b last:border-b-0 text-xl">
          {t('language')}
          <select
            value={currentLanguage}
            className="text-tinBlue appearance-none"
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages
              .sort((a, b) => a.localeCompare(b))
              .map((item) => (
                <option key={item} value={item}>
                  {langMap[item]}
                </option>
              ))}
          </select>
        </div>
        <div className=" flex justify-between py-6 border-b last:border-b-0 text-xl">
          {t('currency')}
          <select
            value={activeCurrency.code !== undefined ? activeCurrency.code : ''}
            onChange={(e) => currencyChangeHandler(e.target.value, currentSiteObject)}
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
        className="flex justify-between py-6 border-b text-xl cursor-pointer"
        onClick={() => parentMenuClicked(item.title, item.items, item.url)}
      >
        {t(item.title)}
        <HiChevronRight size={18} className={item.items?.length ? 'h-8 w-8' : 'hidden'} />
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
              className="flex justify-between items-center pb-4 text-base text-eerieBlack cursor-pointer"
              onClick={() => parentMenuClicked(item.title, item.items, item.url)}
            >
              {t(item.title)}
            </li>
          </Link>
        ) : (
          <li
            key={item.title}
            className="flex justify-between items-center pb-4 text-base text-eerieBlack cursor-pointer"
            onClick={() => parentMenuClicked(item.title, item.items, item.url)}
          >
            {t(item.title)}
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
          className="w-full h-fit flex text-center items-center mt-12 mb-6 text-sm cursor-pointer"
          onClick={() => setDisplaySubItems(false)}
        >
          <HiChevronLeft size={20} className="h-12 w-8 pr-1" />
          {t('back')}
        </div>
        <div className="flex justify-between py-6 border-b text-xl">{title}</div>
        <div className="flex justify-between py-6 text-xl px-12">
          <ul>
            {subMenuItems.map((item, index) => (
              <SubMenu key={index} item={item} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  const parentMenuClicked = (title, items, url) => {
    if (items?.length > 0) {
      setTitle(title)
      setDisplaySubItems(true)
      setSubMenuItems([...items])
    } else {
      navigate(`/${tenant}/${url}`)
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
    setOpen((current) => !current)
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
    if (cartAccount && cartAccount.totalPrice && cartAccount.totalPrice.amount) {
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
              onChangeHandler={(e) => handleSiteChange(e.target.value)}
              currentValue={currentSiteObject.code}
            >
              <span className="world-icon absolute h-4 w-4 text-white"> </span>
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
              onChangeHandler={(e) => currencyChangeHandler(e.target.value, currentSiteObject)}
              currentValue={activeCurrency.code !== undefined ? activeCurrency.code : ''}
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
                {t('login')}
              </a>
            </li>
            |
            <li className="px-2">
              <a className="hover:text-emporixGold" href={`/${tenant}/signup`}>
                {t('signup')}
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
                  <CgNotes size={16} className="cursor-pointer" onClick={handleOpenQuotes} />
                </Badge>
              ) : (
                <CgNotes size={16} className="cursor-pointer" onClick={handleOpenQuotes} />
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
                <CurrencyBeforeValue currency={cartCurrency} value={cartTotalPrice} />
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
            <img src="/img/n11logo.png" alt="logo" />
          </Link>
        </div>

        <div className="w-1/2 flex justify-end gap-8">
          {/* TODO: Link to Search Screen? */}
          <div className="mobile_only">
            <AiOutlineSearch size={20} />
          </div>
          <div className="mobile_only_flex">
            {!open ? (
              <button onClick={handleNavOpen}>
                <AiOutlineMenu size={20} />
              </button>
            ) : null}
            {/* absolut mobile navigation */}
            <div
              className={`text-black fixed inset-0 bg-white p-4 text-center font-medium overflow-y-auto transform-all opacity-0 -translate-y-full duration-500 ease-out ${
                open ? 'translate-y-0 opacity-100' : ''
              }`}
            >
              <div className="h-10 justify-between flex">
                <div className="flex">
                  <Link to={loginUrl()} className="flex">
                    <img src="/img/n11logo.png" className="" alt=""></img>
                  </Link>
                </div>
                <button className="flex text-center items-center pr-4" onClick={handleNavOpen}>
                  <AiOutlineClose size={25} />
                </button>
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
