import React from 'react'
import { Link } from 'react-router-dom'
import { addTenantToUrl } from '../../services/service.config'

const AccountMenu = ({ page, className }) => {
  const items = [
    'My Account',
    'Personal Details',
    'Company Details',
    '',
    'My Orders',
    'My Quotes',
    'Replenishment Orders',
    'Saved Carts',
    'My Returns',
    'Locations',
    'Payment Methods',
  ]
  const items_link = [
    'account-summary',
    'personal-details',
    'company-details',
    '',
    'my-orders',
    'my-quotes',
    'replenishment-orders',
    'saved-carts',
    'returns',
    'locations',
    'payments',
  ]
  return (
    <ul className={className}>
      {items.map((value, index) =>
        value !== '' ? (
          index === 0 ? (
            page === 'Index' ? (
              <li key={index} className="index-item-active first-item">
                <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                  {value}
                </Link>
              </li>
            ) : (
              <li
                key={index}
                className={
                  value === page ? 'item-active first-item' : 'first-item'
                }
              >
                <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                  {value}
                </Link>
              </li>
            )
          ) : (
            <li
              key={index}
              className={value === page ? 'item-active item' : 'item'}
            >
              <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                {value}
              </Link>
            </li>
          )
        ) : (
          <li key={index} className="item-divide-line" />
        )
      )}
    </ul>
  )
}

export default AccountMenu
