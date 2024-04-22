import React, { useEffect, useState } from 'react'
import {
  Container,
  CurrencyBeforeValue,
  DesktopLGContainer,
  DesktopMDContainer,
  DesktopXLContainer,
  GridLayout,
  LayoutBetween,
  MobileLGContainer,
  MobileMDContainer,
  MobileXLContainer,
} from '../../components/Utilities/common'
import {
  ProgressBar,
  ProgressBarItem,
} from '../../components/Utilities/progressbar'
import ShippingMethod from '../../components/Checkout/shiping_method'
import {
  Heading3,
  Heading4,
  TextBold1,
  TextBold3,
  TextRegular,
  TextRegular3,
  Underline,
} from '../../components/Utilities/typography'
import { USER } from 'constants/localstorage'
import { DropdownWithLabel } from '../../components/Utilities/dropdown'
import { RadioGroup } from '../../components/Utilities/radio'
import './checkout.css'
import Checkbox from '../../components/Utilities/checkbox'
import { useUserAddress } from './AddressProvider'
import Address from './Address'
import { useCart } from 'context/cart-provider'
import { usePayment } from './PaymentProvider'
import PaymentSpreedly from 'components/Checkout/PaymentSpreedly'
import { CartProductImageAndReadOnlyQuantity, CartProductInfo, } from 'components/Cart/cart'
import GuestShippingContent from './GuestShippingContent'
import { GuestPaymentContent } from './GuestPaymentContent'

const ShippingContent = () => {
  const { setShippingMethod } = useCart()
  const user = JSON.parse(localStorage.getItem(USER))

  const {
    locations,
    addresses,
    selectedAddress,
    setSelectedAddress,
    defaultAddress,
    shippingMethods,
    setSelectedDeliveryMethod,
  } = useUserAddress()

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
  user ? 
    (<>
      <GridLayout className="gap-10 border rounded border-quartz p-6">
        <GridLayout className="gap-4">
          <DesktopMDContainer>
            <LayoutBetween className="items-center">
              <Heading3>Shipping Details</Heading3>
              <TextRegular3>
                <Underline>Ship to multiple addresses</Underline>
              </TextRegular3>
            </LayoutBetween>
          </DesktopMDContainer>
          <MobileMDContainer>
          <GridLayout className="gap-6  border rounded border-quartz p-6">
              <Heading3>Shipping Details</Heading3>
              <TextRegular3>
                <Underline>Ship to multiple addresses</Underline>
              </TextRegular3>
            </GridLayout>
          </MobileMDContainer>
        </GridLayout>

        <GridLayout className="gap-6">
          <DropdownWithLabel
            label="Location"
            options={locations}
            defaultValue={defaultAddress}
            onChange={(e) => {
              const addressId = e[0].value
              const address = addresses.find(
                (address) => address.id === addressId
              )
              if (address !== undefined) {
                setSelectedAddress(address)
              }
            }}
          />
          {addresses.length === 0 && (
            <GridLayout className="text-xs text-red-600 text-center">
              Please check shipping address for your Company / User
            </GridLayout>
          )}
          <GridLayout className="location-info">
            {selectedAddress && <Address data={selectedAddress} />}
          </GridLayout>
        </GridLayout>
      </GridLayout>

      <GridLayout className="gap-10 border rounded border-quartz p-6">
        <GridLayout className="gap-6">
          <Heading3>Shipping Method</Heading3>
          <MobileMDContainer>
            <TextRegular3>
              <Underline>Ship to multiple addresses</Underline>
            </TextRegular3>
          </MobileMDContainer>
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
        </GridLayout>  
      </GridLayout>
    </>
    ) : <GuestShippingContent/>
  )
}

const PaymentContent = ({cart}) => {
  const {
    selectedAddress,
    billingAddresses,
    billingLocations,
    billingAddress,
    setBillingAddress,
  } = useUserAddress()
  const user = JSON.parse(localStorage.getItem(USER))
  const [isCustomAddressEnabled, setIsCustomAddressEnabled] = useState(true)

  useEffect(() => {
    if (selectedAddress && !isCustomAddressEnabled) {
      setBillingAddress(selectedAddress)
    }
  }, [isCustomAddressEnabled, selectedAddress])

  return (
    <>
      <GridLayout className="payment-method-wrapper gap-6">
        <TextBold1>Payment Methods</TextBold1>
        <RadioGroup active="radio1">
          <GridLayout className="gap-4 border border-quartz rounded p-6">
            <PaymentSpreedly props={{customerId : cart.customerId, grossValue : cart.subtotalAggregate.grossValue, currency: cart.subtotalAggregate.currency}} />
          </GridLayout>
        </RadioGroup>
      </GridLayout>
      {user && <GridLayout className="billing-details-wrapper gap-6">
        <TextBold1>Billing Details</TextBold1>
        <Checkbox
          value={isCustomAddressEnabled}
          title="My billing address and shipping address are the same"
          onChange={(e) => {
            setIsCustomAddressEnabled(e.target.checked)
          }}
        />
        {!isCustomAddressEnabled && (
          <GridLayout className="address-wrapper gap-6">
            <div className="address-dropdown-wrapper">
              <DropdownWithLabel
                label="Address"
                options={billingLocations}
                placeholder="Please select delivery address"
                defaultValue={billingAddress}
                onChange={(e) => {
                  const addressId = e[0].value
                  const address = billingAddresses.find(
                    (address) => address.id === addressId
                  )
                  setBillingAddress(address)
                }}
              />
            </div>

            <Address data={billingAddress} />
          </GridLayout>
        )}
      </GridLayout>}
    </>
  )
}

const ShipmentAddressContent = () => {
  const { selectedAddress } = useUserAddress()
  const { products } = useCart()
  return (
    <GridLayout>
      <div className="mb-3">
        <Heading4>Shipment</Heading4>
      </div>
      <Address data={selectedAddress} />
    </GridLayout>
  )
}
const ShipmentDeliveryContent = () => {
  const { selectedDeliveryWindow, selectedDeliveryMethod } = useUserAddress()

  return (
    <GridLayout className="gap-6 !h-18">
      <div>
        <div className="mb-6">
          <TextBold3>Estimated Delivery:</TextBold3> {selectedDeliveryWindow && (<TextRegular>{selectedDeliveryWindow.deliveryDayLabel} {selectedDeliveryWindow.deliveryTimeLabel}</TextRegular>)}
        </div>

        <TextBold3>Delivery Method:</TextBold3> {selectedDeliveryMethod && (<TextRegular>{selectedDeliveryMethod.id}</TextRegular>)}
      </div>
    </GridLayout>
  )
}
const ShipmentContent = () => {
  return (
    <GridLayout className="gap-6">
      <DesktopXLContainer>
        <Container className="gap-12">
          <ShipmentAddressContent />
          <ShipmentDeliveryContent />
        </Container>
      </DesktopXLContainer>
      <MobileXLContainer>
        <GridLayout className="gap-6">
          <ShipmentAddressContent />
          <ShipmentDeliveryContent />
        </GridLayout>
      </MobileXLContainer>
    </GridLayout>
  )
}

const ReviewOrderContent = (cart) => {
  const { billingAddress } = useUserAddress()
  const { payment } = usePayment()
  const { cartAccount } = useCart()

  return (
    <>
      <DesktopLGContainer>
      <LayoutBetween className="billing-information">
          <Container className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Billing Information</TextBold3>
            </div>
            <Address data={billingAddress} />
          </Container>
        </LayoutBetween>
      </DesktopLGContainer>

      <MobileLGContainer>
      <GridLayout className="billing-information gap-6">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Billing Information</TextBold3>
            </div>
          </LayoutBetween>
          <Address data={billingAddress} />
        </GridLayout>
      </MobileLGContainer>

      <MobileLGContainer>
      <GridLayout className="billing-information gap-6 ">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Shipping Information</TextBold3>
            </div>
          </LayoutBetween>
          <ShipmentContent />
        </GridLayout>
      </MobileLGContainer>

      <DesktopLGContainer>
        <LayoutBetween className="billing-information">
          <Container className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Shipping Information</TextBold3>
            </div>
            <ShipmentContent />
          </Container>
        </LayoutBetween>
      </DesktopLGContainer>

      <DesktopLGContainer>
        <LayoutBetween className="billing-information">
          <Container className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Payment Method</TextBold3>
            </div>
            <GridLayout>
              <TextBold3>{payment && payment.displayName}</TextBold3>
            </GridLayout>
          </Container>
        </LayoutBetween>
      </DesktopLGContainer>

      <MobileLGContainer>
        <GridLayout className="billing-information gap-2">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Payment Method</TextBold3>
            </div>
          </LayoutBetween>

          <GridLayout>
            <TextBold3>Invoice</TextBold3>
            <TextRegular>PO Number: 970465640469</TextRegular>
          </GridLayout>
        </GridLayout>
      </MobileLGContainer>

      <DesktopLGContainer>
        <LayoutBetween className="billing-information">
          <Container className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Your Products</TextBold3>
            </div>
            <GridLayout className="gap-4">
              {cartAccount?.items.map((cartItem, idx) => (
                <>
                  <div className="cart-product-item p-2">
                    <CartProductImageAndReadOnlyQuantity cartItem={cartItem} />
                    <CartProductInfo key={cartItem.id + idx} cartItem={cartItem} />
                  </div>
                </> 
              ))}
            </GridLayout>
          </Container>
        </LayoutBetween>
      </DesktopLGContainer>

      <MobileLGContainer>
        <GridLayout className="billing-information gap-6">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Your Products</TextBold3>
            </div>
          </LayoutBetween>
            <GridLayout className="gap-4">
              {cartAccount?.items.map((cartItem, idx) => (
                <>
                  <div className="cart-product-item p-2">
                    <CartProductImageAndReadOnlyQuantity cartItem={cartItem} />
                    <CartProductInfo key={cartItem.id + idx} cartItem={cartItem} />
                  </div>
                </> 
              ))}
            </GridLayout>  
        </GridLayout>
      </MobileLGContainer>
    </>
  )
}

const CheckoutContent = ({ status, cart, user }) => {
  return (
    <div className="checkout-content-wrapper">
      <GridLayout className="gap-8">
        <ProgressBar active={status} className="">
          <ProgressBarItem activeTab={status} status="shipping" title="Shipping" />
          <ProgressBarItem activeTab={status} status="payment" title="Payment" />
          <ProgressBarItem activeTab={status} status="review_order" title="Review Order" />
        </ProgressBar>
        {status === 'shipping' ? (
          <ShippingContent />
        ) : status === 'payment' ? (
          user ? <PaymentContent cart={cart}/> : <GuestPaymentContent cart={cart}/>
        ) : (
          <ReviewOrderContent cart={cart} />
        )}
      </GridLayout>
    </div>
  )
}

export default CheckoutContent
