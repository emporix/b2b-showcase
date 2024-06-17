import React, { useState } from 'react'
import AccountMenu from './AccountMenu'
import AccountSubTitle from './AccountSubTitle'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'

const AccountLayout = ({ children, page, detail }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="content-wrapper relative flex-row">
      <div className="absolute -top-12 -left-6 w-6 h-6 lg:hidden">
        <button
          className={`text-darkGray hover:text-primary px-5 py-2.5`}
          onClick={() => setIsDrawerOpen((current) => !current)}
          title="Filter"
        >
          {isDrawerOpen ? <HiChevronDoubleLeft size={24} /> : <HiChevronDoubleRight size={24} />}
        </button>
      </div>
      <div
        className={`left-menu-panel min-h-max absolute lg:hidden standard_box_shadow bg-aliceBlue rounded-xl p-4 transition-transform duration-500 ${
          isDrawerOpen ? 'fixed top-0 left-0 z-10 w-full' : '-translate-x-[150%]'
        }`}
      >
        <AccountMenu page={page} />
      </div>
      <div
        className={`account-menu-items-left-panel left-menu-panel standard_box_shadow bg-aliceBlue rounded-xl p-4 hidden lg:block`}
      >
        <AccountMenu page={page} />
      </div>
      <div
        className={'account-page-content content-panel lg:ml-6 lg:mt-0 standard_box_shadow bg-aliceBlue rounded-xl p-4'}
      >
        {['My Account', 'Index', 'My Discounts'].includes(page) ? (
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
