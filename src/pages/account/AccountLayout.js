import React from 'react'
import AccountMenu from './AccountMenu'
import AccountSubTitle from './AccountSubTitle'

const AccountLayout = ({ children, page, detail }) => {
  return (
    <div className="content-wrapper">
      <div
        className={ 
          page !== 'Index'
          ? 'account-menu-items-left-panel left-menu-panel standard_box_shadow bg-aliceBlue rounded-xl p-4'
          : 'account-menu-items-left-panel main-left-menu-panel standard_box_shadow bg-aliceBlue rounded-xl p-4'
        }
      >
        <AccountMenu page={page} />
      </div>
      <div
        className={
          page !== 'Index'
            ? 'account-page-content content-panel md:!ml-12 standard_box_shadow bg-aliceBlue rounded-xl p-4'
            : 'account-page-content main-content-panel md:!ml-12 standard_box_shadow bg-aliceBlue rounded-xl p-4'
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
