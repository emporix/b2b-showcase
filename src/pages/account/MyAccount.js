import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { SavedCarts } from './common'
import { Navigate } from 'react-router-dom'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { getRecentOrders } from '../../services/orders.service'
import { OrderList } from './OrdersList'
import { useAuth } from 'context/auth-provider'

const AccountPersonalInfo = () => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" />
  }
  return (
    <div className="account-personal-info-wrapper">
      <div className="account-personal-info-caption">
        <div className="account-personal-info flex">
          <div className="my-auto  flex w-full justify-between items-center">
            <span className="inline-block align-middle account-personal-caption">
              Personal Details
            </span>
            {/* <span className="inline-block align-middle account-edit-btn">
              Edit Profile&nbsp;&nbsp;
              <span className="profile-edit-btn-arrow">&gt;</span>
            </span> */}
          </div>
        </div>
      </div>
      <div className="account-profile">
        <div className="mx-auto flex flex-col gap-8 items-center">
          <div className="flex flex-row flex-1 w-full">
            <img
              className="personal-photo"
              src="/photo.png"
              alt="profile photography"
            />
            <div className="flex flex-col justify-start items-start pl-6">
              <div className="text-center m-auto text-[20px]/[28px] font-semibold">
                {user.username}
              </div>
              <span className="account-edit-btn cursor-pointer color-dodgerBlue">
                Edit Profile
              </span>
            </div>
          </div>
          <div className="profile-info flex gap-4">
            <div className="profile-items gap-2 flex flex-col justify-items-start">
              {/* <p>Name</p> */}
              <p>Company</p>
              <p>Phone</p>
              <p>Email</p>
            </div>
            <div className="profile-items-info gap-2 flex flex-col justify-items-start">
              {/* <p className="font-bold">{user.username}</p> */}
              <p>{user.company}</p>
              <p>
                {user.contactPhone ? user.contactPhone : '+1 (543) 234-76-43'}
              </p>
              <p>{user.contactEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const PaymentProgressBar = () => {
  return (
    <div className="w-full h-6 bg-bgWhite rounded-2xl dark:bg-bgWhite">
      <div
        className="h-6 bg-emporixGold rounded-2xl dark:bg-emporixGold"
        style={{ width: '45%' }}
      />
    </div>
  )
}
const PaymentStatus = () => {
  return (
    <ul className="flex flex-col gap-4">
      <li className="payment-title">Total spent in April</li>
      <li className="spent-amount">
        <CurrencyBeforeValue value={'2,540.28'} />
      </li>
      <li className="limit-bar-wrapper flex flex-col gap-2">
        <div className="limit-bar">
          <PaymentProgressBar />
        </div>
        <div className="limit-status-text text-right">
          Your monthly limit: <CurrencyBeforeValue value={'10,000.00'} />
        </div>
      </li>
    </ul>
  )
}

const PaymentInfoDetails = () => {
  return (
    <div className="flex">
      <div className="oustanding flex gap-4 flex-col">
        <div className="payment-title">Oustanding</div>
        <div className="price">
          <CurrencyBeforeValue value={'1912.21'} />
        </div>
      </div>
      <div className="refunds flex gap-4 flex-col">
        <div className="payment-title">Refunds</div>
        <div className="price">
          <CurrencyBeforeValue value={'841.96'} />
        </div>
      </div>
    </div>
  )
}
const AccountSummary = () => {
  return (
    <div className="account-summary-wrapper flex flex-col gap-6">
      <div className="account-summary-caption">
        <div className="account-summary-info flex">
          <div className="my-auto  flex w-full justify-between items-center">
            <span className="inline-block align-middle account-summary-title">
              Summary
            </span>
          </div>
        </div>
      </div>
      <PaymentStatus />
      <PaymentInfoDetails />
    </div>
  )
}

const PortalCaptionBar = ({ title, action_title }) => {
  return (
    <div className="portal-caption" key={title}>
      <div className="portal-caption-content flex">
        <div className="my-auto  flex w-full justify-between items-center">
          <span className="inline-block align-middle portal-title">
            {title}
          </span>
          <span className="text-[16px]/[24px] text-dodgerBlue font-medium">
            {action_title}
          </span>
        </div>
      </div>
    </div>
  )
}

const RecentOrders = () => {
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    const fetchedOrders = await getRecentOrders()
    setOrders(fetchedOrders)
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className="account-recent-orders-wrapper portal-wrapper">
      <PortalCaptionBar
        className="text-[16px]/[24px] text-dodgerBlue font-medium"
        title="Recent Orders"
        action_title="View All"
      />
      <OrderList orders={orders} />
    </div>
  )
}

const RecentSavedCarts = () => {
  const actions = [{ title: 'View' }]
  return (
    <div className="account-saved-carts-wrapper portal-wrapper border border-quartz rounded mt-8 p-6">
      <PortalCaptionBar
        className="text-[16px]/[24px] text-dodgerBlue font-medium"
        title="Saved Carts"
        action_title="View All"
      />
      <SavedCarts actions={actions} />
    </div>
  )
}

const AccountPersonalDetailsAndSummary = () => {
  return (
    <div className="personal-and-summary-content-wrapper">
      <div className="personal-and-summary-content md:flex">
        <AccountPersonalInfo />
        <AccountSummary />
      </div>
    </div>
  )
}
export const MyAccountContent = () => {
  return (
    <>
      <AccountPersonalDetailsAndSummary />
      <RecentOrders />
      <RecentSavedCarts />
    </>
  )
}
const MyAccount = () => {
  return (
    <AccountLayout page="My Account">
      <MyAccountContent />
    </AccountLayout>
  )
}

export default MyAccount
