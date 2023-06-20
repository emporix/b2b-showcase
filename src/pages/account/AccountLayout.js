import React from 'react'
import AccountMenu from './AccountMenu'
import AccountSubTitle from './AccountSubTitle'

const AccountLayout = ({ children, page, detail }) => {

  return (
    <div className="content-wrapper">
      <div
        className={
          page !== 'Index'
            ? 'account-menu-items-left-panel left-menu-panel grey-rounded-container p-3'
            : 'account-menu-items-left-panel main-left-menu-panel grey-rounded-container p-3'
        }
      >
        <AccountMenu page={page} />
      </div>
      <div
        className={
          page !== 'Index'
            ? 'account-page-content content-panel md:pl-6'
            : 'account-page-content main-content-panel md:pl-6'
        }
      >
        {page === 'My Account' || page === 'Index' ? (
          <>{children}</>
        ) : (
          <>
            <AccountSubTitle className="mb-2" title={page} detail={detail} />
            {children}
          </>
        )}
      </div>
    </div>
  )
}

export default AccountLayout
