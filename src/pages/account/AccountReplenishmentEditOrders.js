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

const ReplenishmentEditOrders = () => {
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
      <GridLayout className="gap-10">
        <div className="gap-6 lg:flex grid grid-cols-1 items-end p-2 border-b border-bgWhite">
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

          <Item className="xl:w-1/2 lg:w-1/3 w-full">
            <DropdownWithLabel
              label="Delivery Day"
              placeholder="First working day"
              options={[
                { value: 'First working day', label: 'First working day' },
              ]}
            />
          </Item>
          <Item className="lg:w-1/4 w-full">
            <Link to={myAccountReplenishmentOrdersUrl}>
              <MediumPrimaryButton title="Add" />
            </Link>
          </Item>
        </div>
      </GridLayout>
      <div className="pb-6 border-b border-bgWhite">
        <div className="lg:block hidden">
          <CartTable cartList={product} />
        </div>
        <div className="lg:hidden">
          <CartMobileContent cartList={product} />
        </div>
      </div>
    </GridLayout>
  )
}

const AccountReplenishmentEditOrders = () => {
  return (
    <AccountLayout page="Order Number" detail="#CMD-2022-0119-001">
      {' '}
      <ReplenishmentEditOrders />
    </AccountLayout>
  )
}
export default AccountReplenishmentEditOrders
