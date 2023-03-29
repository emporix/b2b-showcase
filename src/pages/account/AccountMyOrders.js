import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { OrderList } from './OrdersList'
import { getOrders } from '../../services/orders.service'

const AccountMyOrders = () => {
  const [orders, setOrders] = useState([])

  const fetchOrders = useCallback(async () => {
    const fetchedOrders = await getOrders()
    setOrders(fetchedOrders)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <AccountLayout page="My Orders">
      <OrderList orders={orders} invoiceAvailable={true} />
    </AccountLayout>
  )
}

export default AccountMyOrders
