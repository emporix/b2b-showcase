import React, { useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { Navigate } from 'react-router-dom'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { getRecentOrders } from '../../services/orders.service'
import { SavedCarts } from './common'
import { OrderList } from './OrdersList'
import { useAuth } from 'context/auth-provider'
import { useTranslation } from 'react-i18next'

const AccountPersonalInfo = () => {
  const { user } = useAuth()
  const { t } = useTranslation('account')

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="account-card w-full md:w-1/2 pb-6">
      <div className="pb-6">
        <span className="account-caption inline-block align-middle">{t('personal')}</span>
      </div>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-row flex-1 w-full">
          {user.photoUrl ? (
            <img className="personal-photo" src={user.photoUrl} alt="profile photography" />
          ) : (
            <img className="personal-photo" src="/photo.png" alt="profile photography" />
          )}

          <div className="flex flex-col justify-center items-start pl-6">
            <div className="my-auto text-xl font-semibold">{user.username}</div>
            <span className="account-cta mt-auto">{t('edit')}</span>
          </div>
        </div>
        <div className="flex  gap-4">
          <div className="gap-4 flex flex-col text-darkGray">
            <p>{t('company')}</p>
            <p>{t('phone')}</p>
            <p>{t('mail')}</p>
          </div>
          <div className="gap-4 flex flex-col">
            <p>{user.company}</p>
            <p>{user.contactPhone ? user.contactPhone : '+1 (543) 234-76-43'}</p>
            <p>{user.contactEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
const PaymentProgressBar = () => {
  return (
    <div className="w-full h-6 bg-bgWhite rounded-xl border-gray">
      <div className="h-6 bg-primary rounded-xl dark:bg-primary" style={{ width: '45%' }} />
    </div>
  )
}
const PaymentStatus = () => {
  const { t } = useTranslation('account')

  return (
    <ul className="flex flex-col gap-4">
      <li className="">{t('total')}</li>
      <li className="text-xl font-bold">
        <CurrencyBeforeValue value={'2,540.28'} />
      </li>
      <li className="flex flex-col gap-4">
        <PaymentProgressBar />
        <div className="text-sm text-darkGray text-right">
          {t('limit')}: <CurrencyBeforeValue value={'10,000.00'} />
        </div>
      </li>
    </ul>
  )
}

const PaymentInfoDetails = () => {
  const { t } = useTranslation('account')

  return (
    <div className="w-full flex justify-around">
      <div className="flex gap-4 flex-col">
        <div className="text-base">{t('outstanding')}</div>
        <div className="text-xl font-bold">
          <CurrencyBeforeValue value={'1912.21'} />
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-base">{t('refunds')}</div>
        <div className="text-xl font-bold">
          <CurrencyBeforeValue value={'841.96'} />
        </div>
      </div>
    </div>
  )
}
const AccountSummary = () => {
  const { t } = useTranslation('account')

  return (
    <div className="account-card w-full md:w-1/2 flex flex-col gap-4">
      <div className="pb-6">
        <span className="account-caption">{t('summary')}</span>
      </div>
      <PaymentStatus />
      <PaymentInfoDetails />
    </div>
  )
}

const PortalCaptionBar = ({ title, action_title, action }) => {
  const handleOnClick = () => {
    typeof action === 'function' && action()
  }
  return (
    <div className="flex w-full justify-between items-center pb-6">
      <span className="account-caption">{title}</span>
      <span className="text-base text-dodgerBlue font-medium cursor-pointer" onClick={handleOnClick}>
        {action_title}
      </span>
    </div>
  )
}

const RecentOrders = () => {
  const [orders, setOrders] = useState([])
  const { t } = useTranslation('account')

  useEffect(() => {
    const getOrders = async () => {
      const fetchedOrders = await getRecentOrders()
      setOrders(fetchedOrders)
    }

    getOrders()
  }, [])

  return (
    <div className="account-card w-full">
      <PortalCaptionBar title={t('recent')} action_title={t('action')} action={() => {}} />
      <OrderList orders={orders} />
    </div>
  )
}

const RecentSavedCarts = () => {
  const { t } = useTranslation('account')
  const actions = [{ title: 'View' }]

  return (
    <div className="account-card">
      <PortalCaptionBar title={t('saved')} action_title={t('action')} action={() => {}} />
      <SavedCarts actions={actions} />
    </div>
  )
}

const AccountPersonalDetailsAndSummary = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <AccountPersonalInfo />
      <AccountSummary />
    </div>
  )
}
export const MyAccountContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <AccountPersonalDetailsAndSummary />
      <RecentOrders />
      <RecentSavedCarts />
    </div>
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
