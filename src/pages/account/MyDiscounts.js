import React, {useEffect, useState} from 'react'
import AccountMenu from './AccountMenu'
import CartService from "../../services/cart.service";

const Card = (props) => {
  return (
      <div
          className='border-lightGray border-[1px]  p-2 flex flex-col w-48'
      >
        <div className="font-bold">{props.name}</div>
        <div className="text-md text-xs pt-2 pb-2">{props.description}</div>
        <div className="text-md text-sm mt-auto">
          <span className="font-bold">COST: </span>
          <span className="text-tinBlue">{props.points}</span>
        </div>
        <div className="mt-1 flex self-end">
          <div className="text-[#5F8FAA] text-xs font-bold">
            {props.coupon.discountType}
          </div>
        </div>
      </div>
  )
}

const MyDiscounts = () => {
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
    <div className="content-wrapper">
      <div className={'account-menu-items-left-panel left-menu-panel'}>
        <AccountMenu page={'page'} />
      </div>
      <div
        className={'account-page-content content-panel md:pl-6 flex flex-col'}
      >
        <div className="pb-4">
          <div className="font-inter font-bold text-xl text-tinBlue mb-2">
            Available Coupons:
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {redeemOptions.length &&
              redeemOptions.map((card) => <Card key={card.id} {...card} />)}
        </div>
        <div className="mt-6">
          <div className="font-inter font-bold text-xl text-tinBlue">
            Points:
          </div>
        </div>
        <div className="mt-2 mb-4 p-1 flex">
          <div className="border-[1px] border-lightGray p-2">
            {JSON.stringify(rewardPoints)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyDiscounts
