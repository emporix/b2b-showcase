import React, { useEffect, useState } from 'react'
import CartService from '../../services/cart.service'
import AccountLayout from './AccountLayout'
import MyDiscounts from './MyDiscounts'

const AccountMyDiscounts = () => {
  const [redeemOptions, setRedeemOptions] = useState([])
  const [rewardPoints, setRewardPoints] = useState(0)

  useEffect(() => {
    ;(async () => {
      const options = await CartService.getRedeemOptionsForLoggedUser()
      setRedeemOptions(options)
      const points = await CartService.getRewardPointsForLoggedUser()
      setRewardPoints(points)
    })()
  }, [])

  return (
    <AccountLayout page="My Discounts">
      <MyDiscounts redeemOptions={redeemOptions} rewardPoints={rewardPoints} />
    </AccountLayout>
  )
}

export default AccountMyDiscounts
