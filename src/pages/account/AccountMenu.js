import React from 'react'
import { Link } from 'react-router-dom'
import { addTenantToUrl } from '../../services/service.config'

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

const AccountMenu = ({ page, className }) => {
  
  const itemsKey = [
    'My Account',
    'Personal Details',
    'Company Details',
    'Manage Users',
    'Addresses',
    'My Orders',
    'All Quotes',
    'Replenishment Orders',
    'Saved Carts',
    'All Returns',
    'My Discounts',
    'My Subscriptions',
    'Locations',
    'Payment Methods',
  ]

  const itemsNames = [
    'My Account',
    'Personal Details',
    'Company Details',
    'Manage Users',
    'Addresses',
    'My Orders',
    'My Quotes',
    'Replenishment Orders',
    'Saved Carts',
    'My Returns',
    'My Discounts',
    'My Subscriptions',
    'Locations',
    'Payment Methods',
  ]
  const items_link = [
    'account-summary',
    'personal-details',
    'company-details',
    'manage-users',
    'addresses',
    'my-orders',
    'my-quotes',
    'replenishment-orders',
    'saved-carts',
    'returns',
    'discounts',
    'my-subscriptions',
    'locations',
    'payments',
  ]
  const itemsIcons = {
    'account-summary': accountSummary,
    'personal-details': personalDetails,
    'company-details': companyDetails,
    'manage-users': manageUsers,
    'my-orders': myOrders,
    'my-quotes': myQuotes,
    'replenishment-orders': replenishmentOrders,
    'saved-carts': savedCarts,
    'addresses' : locations,
    'my-subscriptions' : myOrders,
    returns: returns,
    discounts: discounts,
    locations: locations,
    payments: payments,
  }

  const requiredScopes = {
    'Manage Users': 'customer.customer_read_own'
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
    <ul className={className}>
      {itemsKey.map((value, index) =>
        hasRequiredScopes(value) &&
         (value !== '' ? (
          index === 0 ? (
            page === 'Index' ? (
              <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                <li
                  key={index}
                  className="index-item-active first-item flex items-center"
                >
                  <img
                    src={itemsIcons[items_link[index]]}
                    className="mr-4"
                    alt={items_link[index]}
                  />
                  {itemsNames[index]}
                  </li>
                </Link>
            ) : (
              <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                <li
                  key={index}
                  className={
                    value === page
                    ? 'item-active first-item flex items-center'
                    : 'first-item flex items-center'
                }
              >
                <img
                  src={itemsIcons[items_link[index]]}
                  className="mr-4"
                  alt={items_link[index]}
                />
                  {itemsNames[index]}
                  </li>
              </Link>
            )
          ) : (
            <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
              <li
                key={index}
                className={value === page ? 'item-active item flex items-center' : 'item flex items-center'}
              >
                <img
                  src={itemsIcons[items_link[index]]}
                  className="mr-4"
                  alt={items_link[index]}
                />
                {itemsNames[index]}
                </li>
            </Link>
          )
        ) : (
          <li key={index} className="item" />
        )
      )
      )}
    </ul>
  )
}

export default AccountMenu
