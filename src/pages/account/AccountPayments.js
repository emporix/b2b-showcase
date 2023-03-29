import React, { useState } from 'react'
import {
  MediumPrimaryButton,
  MediumSecondaryButton,
} from '../../components/Utilities/button'
import {
  Container,
  GridLayout,
  LayoutBetween,
} from '../../components/Utilities/common'
import AccountLayout from './AccountLayout'
import Switch from '@mui/material/Switch'
import { Link } from 'react-router-dom'
import {
  TextBold2,
  TextBold7,
  Underline,
  TextRegular6,
  TextBold8,
  TextBold9,
} from '../../components/Utilities/typography'
import './account.css'
import { paymentEditCardDetailUrl } from '../../services/service.config'

const PayItem = ({ title, itemKey, className, children, logo }) => {
  const [active, setActive] = useState(true)
  return (
    <GridLayout
      className={
        'p-6 gap-4 border border-bgWhite ' +
        (active ? 'bg-bgWhite border-tinBlue' : '')
      }
    >
      <LayoutBetween>
        <Container className="gap-6 items-center">
          <Switch
            className="switch-item"
            defaultChecked
            onClick={() => setActive(!active)}
          />
          <TextBold2 className="text-tinBlue">{title}</TextBold2>
        </Container>
        {logo !== undefined ? <img src={logo} className="w-[60px]" /> : <></>}
      </LayoutBetween>

      {children}
    </GridLayout>
  )
}
const Payments = () => {
  return (
    <GridLayout className="mt-20 gap-20">
      <GridLayout className="gap-6 p-2 xl:w-[55%] lg:w-[65%] w-full m-auto">
        <PayItem
          title="Pay by Credit Card"
          itemKey="credit_card"
          logo="/mastercard.svg"
        >
          <TextBold7 className="text-darkGray">Card Details</TextBold7>
          <Container>
            <TextRegular6 className="text-blueGray w-40">
              Card Number
            </TextRegular6>
            <TextBold8 className="text-lightBlue">
              {' '}
              1111 2222 3333 4444
            </TextBold8>
          </Container>
          <Container>
            <TextRegular6 className="text-blueGray w-40">
              Card Holder Name
            </TextRegular6>
            <TextBold8 className="text-lightBlue"> Joe W</TextBold8>
          </Container>
          <TextBold9 className="justify-end flex">
            <Link to={paymentEditCardDetailUrl()}>
              <Underline className="text-blue">Edit Card Detail</Underline>
            </Link>
          </TextBold9>
        </PayItem>
        <PayItem title="Pay by Invoice" itemKey="invoice" />
      </GridLayout>
      <GridLayout className="w-full gap-6 ">
        <MediumPrimaryButton title="SAVE" className="w-60 m-auto" />
        <MediumSecondaryButton title="CANCEL" className="w-60 m-auto" />
      </GridLayout>
    </GridLayout>
  )
}

const AccountPayments = () => {
  return (
    <AccountLayout page="Payment Methods">
      <Payments />
    </AccountLayout>
  )
}

export default AccountPayments
