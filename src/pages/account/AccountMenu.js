import React from 'react'
import { Link } from 'react-router-dom'
import { addTenantToUrl } from '../../services/service.config'

const AccountMenu = ({ page, className }) => {
  const items = [
    'My Account',
    'Personal Details',
    'Company Details',
    // '',
    'My Orders',
    'My Quotes',
    'Replenishment Orders',
    'Saved Carts',
    'My Returns',
    'My Discounts',
    'Locations',
    'Payment Methods',
  ]
  const items_link = [
    'account-summary',
    'personal-details',
    'company-details',
    // '',
    'my-orders',
    'my-quotes',
    'replenishment-orders',
    'saved-carts',
    'returns',
    'discounts',
    'locations',
    'payments',
  ]
  return (
    <ul className={className}>
      {items.map((value, index) =>
        value !== '' ? (
          index === 0 ? (
            page === 'Index' ? (
              <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                <li key={index} className="index-item-active first-item">
                  {value}
                </li>
              </Link>
            ) : (
              <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
                <li
                  key={index}
                  className={
                    value === page ? 'item-active first-item' : 'first-item'
                  }
                >
                  {value}
                </li>
              </Link>
            )
          ) : (
            <Link to={addTenantToUrl(`my-account/${items_link[index]}`)}>
              <li
                key={index}
                className={value === page ? 'item-active item' : 'item'}
              >
                {value}
              </li>
            </Link>
          )
        ) : (
          <li key={index} className="item" />
        )
      )}
    </ul>
  )
}

export default AccountMenu
