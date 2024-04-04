import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { GridLayout } from '../../components/Utilities/common'
import { getOrder } from '../../services/orders.service'
import { useParams } from 'react-router-dom'
import OrderDetails from './OrderDetails'
import { myAccountMyOrders } from '../../services/service.config'
import { BackButton } from '../../components/Utilities/button'

const MyOrdersView = () => {
  const [order, setOrder] = useState({})
  const { orderId } = useParams()

  const fetchedOrder = useCallback(async () => {
    const fetchedOrder = await getOrder(orderId)
    setOrder(fetchedOrder)
  }, [orderId])

  useEffect(() => {
    fetchedOrder()
  }, [])

  return (
    <GridLayout className="mt-9 gap-12">
      <div className="pb-6 border-b border-bgWhite">
        <div className="lg:block hidden">
          <OrderDetails entries={order.entries} />
        </div>
      </div>
    </GridLayout>
  )
}

const AccountMyOrdersView = () => {
  return (
    <AccountLayout page="View" detail="#CMD-2022-0119-001">
      <BackButton link={myAccountMyOrders()} title={'Back to orders list'} />
      <MyOrdersView />
    </AccountLayout>
  )
}
export default AccountMyOrdersView
