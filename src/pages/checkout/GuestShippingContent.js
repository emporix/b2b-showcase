import React, { useEffect, useState } from 'react'
import {
  CurrencyBeforeValue,
  DesktopMDContainer,
  GridLayout,
  LayoutBetween,
} from '../../components/Utilities/common'
import ShippingMethod from '../../components/Checkout/shiping_method'
import { Heading3, Heading4 } from '../../components/Utilities/typography'
import { RadioGroup } from '../../components/Utilities/radio'
import './checkout.css'
import { useUserAddress } from './AddressProvider'
import { useCart } from 'context/cart-provider'
import { isValidEmail } from 'services/addresses.service'
import {
  GuestAddressForm,
  INITIAL_ADDRESS,
  Input,
  isAddressFilled,
} from 'components/addresses/AddressesForm'

const isShippingAddressValid = (address) => {
  return (
    isAddressFilled(address) &&
    address.contactEmail.length > 0 &&
    isValidEmail(address.contactEmail) &&
    address.contactPhone.length > 0
  )
}

const GuestShippingContent = () => {
  const { setShippingMethod } = useCart()
  const [shippingAddressData, setShippingAddressData] =
    useState(INITIAL_ADDRESS)
  const {
    setSelectedAddress,
    shippingMethods,
    setSelectedDeliveryMethod,
    selectedAddress,
  } = useUserAddress()

  useEffect(() => {
    if (isShippingAddressValid(shippingAddressData)) {
      setSelectedAddress({
        ...shippingAddressData,
        contactName: `${shippingAddressData.firstName} ${shippingAddressData.lastName}`,
      })
    } else {
      setSelectedAddress(null)
    }
  }, [shippingAddressData])

  useEffect(() => {
    setShippingMethod(null)
  }, [])

  const onShippingChange = (value) => {
    const selectedShippingMethod = shippingMethods.filter(
      (method) => method.id === value
    )[0]
    setShippingMethod(selectedShippingMethod)
    setSelectedDeliveryMethod(selectedShippingMethod)
  }

  return (
    <>
      <GridLayout className="gap-4 border rounded border-quartz p-6">
        <GridLayout className="gap-2">
          <DesktopMDContainer>
            <LayoutBetween className="items-center">
              <Heading4>Personal Details</Heading4>
            </LayoutBetween>
          </DesktopMDContainer>
        </GridLayout>

        <GridLayout className="grid grid-cols-4 gap-2">

          <Input
            label="First Name"
            className="col-span-2"
            placeholder="First Name"
            value={shippingAddressData.firstName}
            action={(val) => {
              const address = {
                ...shippingAddressData,
                firstName: val,
              }
              setShippingAddressData(address)
            }}
          />

          <Input
            label="Last Name"
            className="col-span-2"
            placeholder="Last Name"
            value={shippingAddressData.lastName}
            action={(val) => {
              const address = {
                ...shippingAddressData,
                lastName: val,
              }
              setShippingAddressData(address)
            }}
          />
        </GridLayout>
        <GridLayout className="gap-2">
          <DesktopMDContainer>
            <LayoutBetween className="items-center">
              <Heading4>Contact Details</Heading4>
            </LayoutBetween>
          </DesktopMDContainer>
        </GridLayout>
        <GridLayout className="grid grid-cols-4 gap-2">
          <Input
            label="Email"
            className="col-span-2"
            placeholder="Email"
            value={shippingAddressData.contactEmail}
            action={(val) => {
              const address = {
                ...shippingAddressData,
                contactEmail: val,
              }
              setShippingAddressData(address)
            }}
          />

          <Input
            className="col-span-2"
            label="Contact Phone"
            placeholder="Contact Phone"
            value={shippingAddressData.contactPhone}
            action={(val) => {
              const address = {
                ...shippingAddressData,
                contactPhone: val,
              }
              setShippingAddressData(address)
            }}
          />
        </GridLayout>
        {shippingAddressData.contactEmail.length !== 0 &&
          !isValidEmail(shippingAddressData.contactEmail) && (
            <h6 style={{ color: 'red' }}>Email is invalid</h6>
          )}

        <LayoutBetween className="items-center">
          <Heading4>Shipping Details</Heading4>
        </LayoutBetween>

        <GuestAddressForm
          form={shippingAddressData}
          handleUpdate={(newAddress) => {
            setShippingAddressData(newAddress)
          }}
        />
        {!isShippingAddressValid(shippingAddressData) && (
          <h6 style={{ color: 'red' }}>
            Correct shipping address must be provided
          </h6>
        )}
      </GridLayout>

      <GridLayout className="gap-10 border rounded border-quartz p-6">
        <GridLayout className="gap-6">
          <Heading3>Shipping Method</Heading3>
          <RadioGroup>
            {shippingMethods.map((method) => {
              return (
                <ShippingMethod
                  key={method.id}
                  radioKey={method.id}
                  shippingmode={method.id}
                  date="Monday, June 6 - Tuesday June 7"
                  price={
                    method.fee === 0 ? (
                      'Free'
                    ) : (
                      <CurrencyBeforeValue value={method.grossFee} />
                    )
                  }
                  onClick={onShippingChange}
                />
              )
            })}
          </RadioGroup>
          {!selectedAddress?.contactEmail && (
            <h6 style={{ color: 'red' }}>
              Provide address information to choose shipping method
            </h6>
          )}
          {selectedAddress?.contactEmail && shippingMethods?.length === 0 && (
            <h6 style={{ color: 'red' }}>
              There is no shipping method for given country
            </h6>
          )}
        </GridLayout>
      </GridLayout>
    </>
  )
}

export default GuestShippingContent
