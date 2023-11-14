import CartActionBar from '../cart/CartActionBar'
import CartTable from '../cart/CartTable'
import CartMobileContent from '../cart/CartMobileContent'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { createQuoteCall } from '../../services/quotes'
import { TENANT } from '../../constants/localstorage'
import { LargePrimaryButton } from '../../components/Utilities/button'
import './quote.css'
import QuoteSummary from './QuoteSummary'
import { useCart } from 'context/cart-provider'
import { DropdownWithLabel } from '../../components/Utilities/dropdown'
import ShippingMethod from 'components/Checkout/shiping_method'
import {
  CurrencyBeforeValue,
  GridLayout,
} from '../../components/Utilities/common'
import { Heading3, TextBold1 } from '../../components/Utilities/typography'
import Checkbox from 'components/Utilities/checkbox'
import { RadioGroup } from 'components/Utilities/radio'
import Address from 'pages/checkout/Address'
import { getShippingMethods } from 'services/shipping.service'
import { getCompanyAddresses } from 'services/legal-entities.service'
import { useNavigate } from 'react-router-dom'
import { quoteIdUrl } from 'services/service.config'
import cartService from 'services/cart.service'
import { calculateTax } from 'services/product/tax.service'

const QuotePage = () => {
  const [quoteId, setQuoteId] = useState()
  const { cartAccount, syncCart } = useCart()
  const [shippingMethods, setShippingMethods] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null)
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null)
  const [selectedShippingId, setSelectedShippingId] = useState(null)
  const [locations, setLocations] = useState([])
  const [cartValue, setCartValue] = useState(null)
  const [isDifferentBilling, setIsDifferentBilling] = useState(false)
  const navigate = useNavigate()

  const createQuote = async () => {
    const tenant = localStorage.getItem(TENANT)
    const selectedShippingMethod = shippingMethods.filter(
      (method) => method.id === selectedShippingId
    )[0]
    const shipping = {
      value: selectedShippingMethod.fees[0].cost.amount,
      methodId: selectedShippingId,
      zoneId: selectedShippingMethod.zoneId,
      shippingTaxCode: selectedShippingMethod.shippingTaxCode,
    }
    const data = await createQuoteCall(
      tenant,
      cartAccount.id,
      shipping,
      selectedShippingAddress.id,
      selectedBillingAddress.id
    )
    setQuoteId(data.id)
    await cartService.deleteAllProductsFromCart(cartAccount.id)
    syncCart()
  }

  useEffect(() => {
    fetchShippingMethods(cartAccount, selectedShippingAddress)
    fetchCompanyAddresses(cartAccount.company)
  }, [selectedShippingAddress, cartValue])

  useEffect(() => {
    setCartValue(cartAccount?.totalPrice?.amount)
  }, [cartAccount])

  const fetchShippingMethods = useCallback(async (cart, address) => {
    const methods = await getShippingMethods(cart.siteCode)
    const filteredMethods = methods
      .filter((method) =>
        method.shipTo.some(
          (e) => e.country === address?.contactDetails?.countryCode
        )
      )
      .filter(
        (method) =>
          method.maxOrderValue === undefined ||
          method.maxOrderValue.amount >= cart.totalPrice?.amount
      )
      .filter((method) => method.shippingTaxCode != null)
      .map((method) => ({
        ...method,
        fee: method.fees
          .filter(
            (feeEl) => feeEl.minOrderValue.amount <= cart.totalPrice.amount
          )
          .sort((a, b) => a.cost.amount - b.cost.amount)[0].cost.amount,
      }))
      .sort((a, b) => a.fee - b.fee)
      await Promise.all(filteredMethods.map(async (m) => {
        const grossPrice =  await calculateTax(m.fee, m.shippingTaxCode, address?.contactDetails?.countryCode)
        m.grossFee = grossPrice
        return m
    }))
    setShippingMethods(filteredMethods)
  }, [])

  const fetchCompanyAddresses = useCallback(async (company) => {
    const addresses = await getCompanyAddresses(company)
    setAddresses(addresses)
    const locations = addresses.map((address) => {
      return {
        label: [
          address.contactDetails.addressLine1,
          address.contactDetails.addressLine2,
          address.contactDetails.city,
          address.contactDetails.postcode,
        ].join(' '),
        value: address.id,
      }
    })
    setLocations(locations)
  }, [])
  const onShippingChange = (value) => {
    setSelectedShippingId(value)
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-content">
        {!quoteId ? (
          <>
            <CartActionBar classname="lg:block hidden" view={true} />
            <CartTable
              classname="lg:block hidden"
              cartList={cartAccount.items}
            />
            <GridLayout className="address-wrapper gap-6 grid-cols-2">
              <GridLayout className=" gap-3">
                <TextBold1 className="gap-3">Shipping Details</TextBold1>
                <div className="address-dropdown-wrapper">
                  <DropdownWithLabel
                    label="Location"
                    options={locations}
                    defaultValue={locations[0]}
                    onChange={(e) => {
                      const addressId = e[0].value
                      const address = addresses.find(
                        (address) => address.id === addressId
                      )
                      if (address !== undefined) {
                        if (!isDifferentBilling) {
                          setSelectedBillingAddress(address)
                        }
                        setSelectedShippingAddress(address)
                      }
                    }}
                  />
                  {addresses.length === 0 && (
                    <GridLayout className="text-xs text-red-600 text-center">
                      Must have at least one address to request your quote
                    </GridLayout>
                  )}
                  <GridLayout className="location-info">
                    {selectedShippingAddress && (
                      <Address
                        data={{
                          city: selectedShippingAddress.contactDetails.city,
                          street: [
                            selectedShippingAddress.contactDetails.addressLine1,
                            selectedShippingAddress.contactDetails.addressLine2,
                          ].join(' '),
                          zipCode:
                            selectedShippingAddress.contactDetails.postcode,
                          coutry:
                            selectedShippingAddress.contactDetails.countryCode,
                        }}
                      />
                    )}
                  </GridLayout>
                </div>
              </GridLayout>
              <GridLayout className="billing-details-wrapper gap-3">
                <TextBold1>Billing Details</TextBold1>
                <Checkbox
                  value={!isDifferentBilling}
                  title="My billing address and shipping address are the same"
                  onChange={(e) => {
                    setIsDifferentBilling(!e.target.checked)
                    if (!e.target.checked) {
                      setSelectedBillingAddress(selectedShippingAddress)
                    }
                  }}
                />
                {isDifferentBilling && (
                  <GridLayout className="gap-3">
                    <div className="address-dropdown-wrapper">
                      <DropdownWithLabel
                        label="Address"
                        options={locations}
                        placeholder="Please select delivery address"
                        defaultValue={locations[0]}
                        onChange={(e) => {
                          const addressId = e[0].value
                          const address = addresses.find(
                            (address) => address.id === addressId
                          )
                          setSelectedBillingAddress(address)
                        }}
                      />
                    </div>
                    {selectedBillingAddress && (
                      <Address
                        data={{
                          city: selectedBillingAddress.contactDetails.city,
                          street: [
                            selectedShippingAddress.contactDetails.addressLine1,
                            selectedShippingAddress.contactDetails.addressLine2,
                          ].join(' '),
                          zipCode:
                            selectedBillingAddress.contactDetails.postcode,
                          coutry:
                            selectedBillingAddress.contactDetails.countryCode,
                        }}
                      />
                    )}
                  </GridLayout>
                )}
              </GridLayout>
            </GridLayout>
            <GridLayout className="gap-6">
              <Heading3>Shipping Method</Heading3>
              <RadioGroup>
                {shippingMethods.map((method) => {
                  return (
                    <ShippingMethod
                      key={method.id}
                      radioKey={method.id}
                      shippingmode={method.id}
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
            <CartMobileContent
              className="lg:hidden"
              cartList={cartAccount.items}
            />
            <CartActionBar className="lg:hidden" />

            <div className="quote-cart-buttons">
              <LargePrimaryButton
                className="w-auto bg-yellow rounded text-eerieBlack"
                disabled={selectedShippingId === null}
                title="REQUEST QUOTE"
                onClick={() => createQuote()}
              />
            </div>
          </>
        ) : (
          <QuoteSummary quoteId={quoteId} />
        )}
      </div>
    </div>
  )
}
export default QuotePage
