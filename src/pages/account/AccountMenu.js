import React from 'react'
import { Link } from 'react-router-dom'
import { addTenantToUrl } from '../../services/service.config'
import { useLanguage } from 'context/language-provider'

import accountSummary from '../../assets/account-summary.svg'
import personalDetails from '../../assets/personal-details.svg'
import companyDetails from '../../assets/company-details.svg'
import myOrders from '../../assets/my-orders.svg'
import myQuotes from '../../assets/my-quotes.svg'
import replenishmentOrders from '../../assets/replenishment-orders.svg'
import savedCarts from '../../assets/saved-carts.svg'
import returns from '../../assets/returns.svg'
import discounts from '../../assets/discounts.svg'
import locations from '../../assets/locations.svg'
import payments from '../../assets/payments.svg'
import manageUsers from '../../assets/manage-users.svg'

const menuItems = [
  { key: 'My Account', en: 'My Account', de: 'Mein Konto', link: 'account-summary', icon: accountSummary },
  {
    key: 'Personal Details',
    en: 'Personal Details',
    de: 'Persoeninformationen',
    link: 'personal-details',
    icon: personalDetails,
  },
  {
    key: 'Company Details',
    en: 'Company Details',
    de: 'Firmeninformationen',
    link: 'company-details',
    icon: companyDetails,
  },
  { key: 'Manage Users', en: 'Manage Users', de: 'Benutzer verwalten', link: 'manage-users', icon: manageUsers },
  { key: 'Addresses', en: 'Addresses', de: 'Adressen', link: 'addresses', icon: locations },
  { key: 'My Orders', en: 'My Orders', de: 'Meine Bestellungen', link: 'my-orders', icon: myOrders },
  { key: 'All Quotes', en: 'My Quotes', de: 'Meine Angebote', link: 'my-quotes', icon: myQuotes },
  {
    key: 'Replenishment Orders',
    en: 'Replenishment Orders',
    de: 'Nachbestellungen',
    link: 'replenishment-orders',
    icon: replenishmentOrders,
  },
  { key: 'Saved Carts', en: 'Saved Carts', de: 'Gespeicherte Einkaufswagen', link: 'saved-carts', icon: savedCarts },
  { key: 'All Returns', en: 'My Returns', de: 'Meine Rücksendungen', link: 'returns', icon: returns },
  { key: 'My Discounts', en: 'My Discounts', de: 'Meine Rabatte', link: 'discounts', icon: discounts },
  {
    key: 'My Subscriptions',
    en: 'My Subscriptions',
    de: 'Meine Abonnements',
    link: 'my-subscriptions',
    icon: myOrders,
  },
  { key: 'Locations', en: 'Locations', de: 'Standorten', link: 'locations', icon: locations },
  { key: 'Payment Methods', en: 'PaymentMethods', de: 'Zahlungsarten', link: 'payments', icon: payments },
]

const AccountMenu = ({ page, className }) => {
  const { currentLanguage } = useLanguage()
  const requiredScopes = {
    'Manage Users': 'customer.customer_read_own',
  }

  const hasRequiredScopes = (value) => {
    if (requiredScopes[value]) {
      const scopes = localStorage.getItem('scopes')
      if (scopes) {
        return scopes.includes(requiredScopes[value])
      }
      return false
    }
    return true
  }

  return (
    <ul className={`${className ? className : ''}`}>
      {menuItems.map((item) => {
        const isActive = (page === 'Index' && item.key === 'My Account') || item.key === page

        return hasRequiredScopes(item.key) && item.key !== '' ? (
          <Link key={item.key} to={addTenantToUrl(`my-account/${item.link}`)}>
            <li className={`${isActive ? 'item-active' : ''} item flex items-center `}>
              <img src={item.icon} className="mr-4" alt={item.key} />
              <span className="">{item[currentLanguage]}</span>
            </li>
          </Link>
        ) : null
      })}
    </ul>
  )
}

export default AccountMenu
