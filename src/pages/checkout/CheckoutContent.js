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
import PaymentMethodItem from '../../components/Checkout/PaymentMethodItem'
import PaymentInvoiceItem from '../../components/Checkout/PaymentInvoiceItem'
import {
  Heading3,
  Heading4,
  TextBold1,
  TextBold3,
  TextBold4,
  TextRegular,
  TextRegular1,
  TextRegular3,
  Underline,
} from '../../components/Utilities/typography'
import { DropdownWithLabel } from '../../components/Utilities/dropdown'
import { RadioGroup } from '../../components/Utilities/radio'
import './checkout.css'
import Checkbox from '../../components/Utilities/checkbox'
import { useUserAddress } from './AddressProvider'
import Address from './Address'
import ProductContent from './ProductsContent'
import { useCart } from 'context/cart-provider'

const ShippingContent = () => {
  const {
    locations,
    addresses,
    selectedAddress,
    setSelectedAddress,
    defaultAddress,
  } = useUserAddress()
  return (
    <>
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
            <GridLayout className="gap-6">
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
              Must have at least one address to finalise your order
            </GridLayout>
          )}
          <GridLayout className="location-info">
            {selectedAddress && <Address data={selectedAddress} />}
          </GridLayout>
        </GridLayout>
      </GridLayout>
      <GridLayout className="gap-6  border rounded border-quartz p-6">
        <Heading3>Shipping Method</Heading3>
        <MobileMDContainer>
          <TextRegular3>
            <Underline>Ship to multiple addresses</Underline>
          </TextRegular3>
        </MobileMDContainer>
        <RadioGroup active="radio1">
          <ShippingMethod
            radioKey="radio1"
            shippingmode="Standard Shipping"
            date="Monday, June 6 - Tuesday June 7"
            price="Free"
          />
          <ShippingMethod
            radioKey="radio2"
            shippingmode="Freight Carrier: LTL"
            date="Friday , June 3"
            price={<CurrencyBeforeValue value={'124.90'} />}
          />
          <ShippingMethod
            radioKey="radio3"
            shippingmode="Freight Carrier : FTL"
            date="Friday , June 3"
            price={<CurrencyBeforeValue value={'349.90'} />}
          />
        </RadioGroup>
      </GridLayout>
    </>
  )
}

const PaymentContent = () => {
  const {
    selectedAddress,
    addresses,
    locations,
    billingAddress,
    setBillingAddress,
  } = useUserAddress()

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
            <PaymentInvoiceItem radioKey="radio1" />
            <PaymentMethodItem radioKey="radio2" title="Trevipay" />
            <PaymentMethodItem
              radioKey="radio3"
              title="Pre Payment (Bank Transfer)"
            />
            <PaymentMethodItem radioKey="radio4" title="Credit / Debit Card" />
          </GridLayout>
        </RadioGroup>
      </GridLayout>
      <GridLayout className="billing-details-wrapper gap-6">
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
                options={locations}
                placeholder="Please select delivery address"
                defaultValue={billingAddress}
                onChange={(e) => {
                  const addressId = e[0].value
                  const address = addresses.find(
                    (address) => address.id === addressId
                  )
                  setBillingAddress(address)
                }}
              />
            </div>

            <Address data={billingAddress} />
          </GridLayout>
        )}
      </GridLayout>
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
      <TextBold3>{products?.length} items</TextBold3>
      <TextRegular1>Name Lastname</TextRegular1>

      <Address data={selectedAddress} />
    </GridLayout>
  )
}
const ShipmentDeliveryContent = () => {
  return (
    <GridLayout className="gap-6 !h-18">
      <div>
        <div className="mb-6">
          <TextBold3>Estimated Delivery: 06.11.2022</TextBold3>
        </div>

        <TextRegular>Delivery Method: Priority</TextRegular>
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

const ReviewOrderContent = () => {
  const { billingAddress } = useUserAddress()
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
          <TextBold4>
            <Underline className='edit-button'>Edit</Underline>
          </TextBold4>
        </LayoutBetween>
      </DesktopLGContainer>

      <MobileLGContainer>
        <GridLayout className="billing-information gap-6">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Billing Information</TextBold3>
            </div>
            <TextBold4>
              <Underline className='edit-button'>Edit</Underline>
            </TextBold4>
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
            <TextBold4>
              <Underline className='edit-button'>Edit</Underline>
            </TextBold4>
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
          <TextBold4>
            <Underline className='edit-button'>Edit</Underline>
          </TextBold4>
        </LayoutBetween>
      </DesktopLGContainer>

      <DesktopLGContainer>
        <LayoutBetween className="billing-information">
          <Container className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Payment Method</TextBold3>
            </div>
            <GridLayout>
              <TextBold3>Invoice</TextBold3>
              <TextRegular>PO Number: 970465640469</TextRegular>
            </GridLayout>
          </Container>
          <TextBold4>
            <Underline className='edit-button'>Edit</Underline>
          </TextBold4>
        </LayoutBetween>
      </DesktopLGContainer>

      <MobileLGContainer>
        <GridLayout className="billing-information gap-2">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Payment Method</TextBold3>
            </div>
            <TextBold4>
              <Underline className='edit-button'>Edit</Underline>
            </TextBold4>
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
            <ProductContent />
          </Container>
          <TextBold4>
            <Underline className='edit-button'>Edit</Underline>
          </TextBold4>
        </LayoutBetween>
      </DesktopLGContainer>

      <MobileLGContainer>
        <GridLayout className="billing-information gap-6">
          <LayoutBetween className="gap-8">
            <div className="property-wrapper">
              <TextBold3>Your Products</TextBold3>
            </div>
            <TextBold4>
              <Underline className='edit-button'>Edit</Underline>
            </TextBold4>
          </LayoutBetween>
          <ProductContent />
        </GridLayout>
      </MobileLGContainer>
    </>
  )
}

const CheckoutContent = ({ status }) => {
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
          <PaymentContent />
        ) : (
          <ReviewOrderContent />
        )}
      </GridLayout>
    </div>
  )
}

export default CheckoutContent
