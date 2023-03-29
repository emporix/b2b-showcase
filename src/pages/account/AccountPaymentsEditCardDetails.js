import React, { useState } from 'react'
import { MediumPrimaryButton } from '../../components/Utilities/button'
import { GridLayout, Container } from '../../components/Utilities/common'
import AccountLayout from './AccountLayout'
import { DropdownWithLabel } from '../../components/Utilities/dropdown'
import { TextInput } from '../../components/Utilities/input'
import { Link } from 'react-router-dom'
import { myAccountPaymentUrl } from '../../services/service.config'

const PaymentsEditCardDetails = () => {
  return (
    <GridLayout className="mt-12 justify-center gap-12">
      <GridLayout className="md:w-[65%] w-full gap-2 m-auto">
        <TextInput label="Name on Card" placeholder="placeholder" value="" />
        <TextInput label="Card Number" placeholder="placeholder" value="" />
        <div className="lg:flex grid gap-2">
          <TextInput
            label="Expiry Date"
            className="lg:w-1/3 w-full"
            placeholder="placeholder"
            value=""
          />
          <TextInput
            label="Security Code"
            className="lg:w-1/3 w-full"
            placeholder="placeholder"
            value=""
          />
        </div>
      </GridLayout>
      <Container className="text-center w-full">
        <Link to={myAccountPaymentUrl()} className="w-60 m-auto">
          <MediumPrimaryButton title="SAVE NEW CARD DETAIL" />
        </Link>
      </Container>
    </GridLayout>
  )
}

const AccountPaymentsEditCardDetails = () => {
  return (
    <AccountLayout page="Edit Card Details">
      {' '}
      <PaymentsEditCardDetails />
    </AccountLayout>
  )
}

export default AccountPaymentsEditCardDetails
