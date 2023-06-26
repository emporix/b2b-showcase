import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { SubscriptionsList } from './SubscriptionsList'
import { getSubscriptions } from '../../services/subscriptions.service'

const AccountMySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])

  const fetchSubscriptions = useCallback(async () => {
    const fetchedSubscriptions = await getSubscriptions()
    setSubscriptions(fetchedSubscriptions)
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  return (
    <AccountLayout page="My Subscriptions">
      <SubscriptionsList subscriptions={subscriptions} invoiceAvailable={false} />
    </AccountLayout>
  )
}

export default AccountMySubscriptions
