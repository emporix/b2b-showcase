import React from 'react'
import AccountLayout from './AccountLayout'
import { GridLayout, Item } from '../../components/Utilities/common'
import CartTable from '../cart/CartTable'
import CartMobileContent from '../cart/CartMobileContent'
import { MediumPrimaryButton } from '../../components/Utilities/button'
import { Link } from 'react-router-dom'
import { DropdownWithLabel } from '../../components/Utilities/dropdown'
import { TextInput } from '../../components/Utilities/input'
import { frequencyOptions } from './config'
import { myAccountReplenishmentOrdersUrl } from '../../services/service.config'

const ReplenishmentAddOrders = () => {
  const product = [
    {
      id: 1,
      product: {
        name: 'Philips GC027/00 fabric shaver',
        code: '19881197',
        id: '19881197',
        src: 'https://res.cloudinary.com/saas-ag/image/upload/icecatimgstage/products/19881197_0540845491.jpeg',
        price: {
          effectiveValue: 2.4,
          originalAmount: 2.4,
          includesTax: false,
          totalValue: 2.4,
        },
      },
      quantity: 1,
    },
  ]

  return (
    <GridLayout className="mt-12 gap-12">
      <div className="pb-6 border-b border-bgWhite">
        <div className="lg:block hidden">
          <CartTable cartList={product} />
        </div>

        <div className="lg:hidden">
          <CartMobileContent cartList={product} />
        </div>
      </div>
      <GridLayout className="gap-10">
        <div className="gap-6 lg:flex grid grid-cols-1">
          <Item className="lg:w-1/4 w-full">
            <TextInput label="PO Number" placeholder="Placeholder" value="" />
          </Item>
          <Item className="lg:w-1/4 w-full">
            <DropdownWithLabel
              label="Frequency"
              placeholder="Weekly"
              options={frequencyOptions}
            />
          </Item>

          <Item className="lg:w-1/4 w-full">
            <DropdownWithLabel
              label="Delivery Day"
              placeholder="First working day"
              options={[
                { value: 'First working day', label: 'First working day' },
              ]}
            />
          </Item>
        </div>
        <div className="w-60 p-2">
          <Link to={myAccountReplenishmentOrdersUrl()}>
            <MediumPrimaryButton title="SAVE ORDER" />
          </Link>
        </div>
      </GridLayout>
    </GridLayout>
  )
}

const AccountReplenishmentAddOrders = () => {
  return (
    <AccountLayout page="New Replenishment Orders">
      <ReplenishmentAddOrders />
    </AccountLayout>
  )
}
export default AccountReplenishmentAddOrders
