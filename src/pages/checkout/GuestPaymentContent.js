import React, { useEffect, useState } from 'react'
import { GridLayout } from '../../components/Utilities/common'
import { TextBold1 } from '../../components/Utilities/typography'
import { RadioGroup } from '../../components/Utilities/radio'
import './checkout.css'
import Checkbox from '../../components/Utilities/checkbox'
import { useUserAddress } from './AddressProvider'
import PaymentSpreedly from 'components/Checkout/PaymentSpreedly'
import {
  GuestAddressForm,
  INITIAL_ADDRESS,
  isAddressFilled,
  Input,
} from 'components/addresses/AddressesForm'

export const GuestPaymentContent = ({ cart }) => {
  const { selectedAddress, setBillingAddress } = useUserAddress()
  const [isTheSameAddress, setIsTheSameAddress] = useState(true)
  const [billlingAddressData, setBillingAddressData] = useState(INITIAL_ADDRESS)

  useEffect(() => {
    if ((selectedAddress && !isTheSameAddress) || isTheSameAddress) {
      setBillingAddress(selectedAddress)
    }
    if (!isTheSameAddress && !isAddressFilled(billlingAddressData)) {
      setBillingAddress(null)
    }
  }, [isTheSameAddress, selectedAddress])

  useEffect(() => {
    if (isAddressFilled(billlingAddressData)) {
      setBillingAddress({
        ...billlingAddressData,
        contactName: `${billlingAddressData.firstName} ${billlingAddressData.lastName}`,
      })
    } else {
      if (!isTheSameAddress) {
        setBillingAddress(INITIAL_ADDRESS)
      }
    }
  }, [billlingAddressData])

  return (
    <>
      <GridLayout className="payment-method-wrapper border border-quartz p-6 rounded gap-6">
        <TextBold1>Payment Methods</TextBold1>
        <RadioGroup active="radio1">
          <GridLayout className="gap-4  p-6">
            <PaymentSpreedly
              props={{
                customerId: cart.customerId,
                grossValue: cart.subtotalAggregate.grossValue,
                currency: cart.subtotalAggregate.currency,
              }}
            />
          </GridLayout>
        </RadioGroup>
      </GridLayout>
      <GridLayout className="billing-details-wrapper border border-quartz p-6 rounded gap-6">
        <TextBold1>Billing Details</TextBold1>
        <Checkbox
          value={isTheSameAddress}
          title="My billing address and shipping address are the same"
          onChange={(e) => {
            setIsTheSameAddress(e.target.checked)
          }}
        />
        {!isTheSameAddress && (
          <div>
            <GridLayout className="grid grid-cols-4 gap-2">
              <Input
                label="First Name"
                className="col-span-2"
                placeholder="First Name"
                value={billlingAddressData.firstName}
                action={(val) => {
                  const address = {
                    ...billlingAddressData,
                    firstName: val,
                  }
                  setBillingAddressData(address)
                }}
              />

              <Input
                label="Last Name"
                className="col-span-2"
                placeholder="Last Name"
                value={billlingAddressData.lastName}
                action={(val) => {
                  const address = {
                    ...billlingAddressData,
                    lastName: val,
                  }
                  setBillingAddressData(address)
                }}
              />
            </GridLayout>
            <GridLayout className="address-wrapper gap-6">
              <GuestAddressForm
                form={billlingAddressData}
                handleUpdate={(newAddress) => {
                  setBillingAddressData(newAddress)
                }}
              />
              {!isAddressFilled(billlingAddressData) && (
                <h6 style={{ color: 'red' }}>
                  Correct billing address must be provided
                </h6>
              )}
            </GridLayout>
          </div>
        )}
      </GridLayout>
    </>
  )
}
