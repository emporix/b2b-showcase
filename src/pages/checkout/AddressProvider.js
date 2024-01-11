import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { USER } from '../../constants/localstorage'
import { useCart } from 'context/cart-provider'
import { getShippingMethods } from 'services/shipping.service'
import { getActualDeliveryWindows } from 'services/shipping.service'
import { calculateTax } from 'services/product/tax.service'


const AddressContext = createContext({})
export const useUserAddress = () => useContext(AddressContext)

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddressState] = useState(null)
  const [selectedDeliveryWindow, setSelectedDeliveryWindow] = useState(null)
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [billingAddress, setBillingAddressState] = useState(null)
  const [locations, setLocations] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const [deliveryWindows, setDeliveryWindows] = useState([])
  const { cartAccount } = useCart()

  const setSelectedAddress = (address) => {
    setSelectedAddressState({ ...address, type: 'SHIPPING' })
  }

  const setBillingAddress = (address) => {
    setBillingAddressState({ ...address, type: 'BILLING' })
  }

  useEffect(() => {
    setBillingAddress(selectedAddress)
    fetchShippingMethods(cartAccount, selectedAddress)
    if(selectedAddress) {
      fetchDeliveryWindows(selectedAddress.zipCode, selectedAddress.country)
    }
  }, [selectedAddress, cartAccount.siteCode])

  useEffect(() => {
    const user = localStorage.getItem(USER)
    if (!user) {
      return
    }
    const addresses = JSON.parse(user).addresses
    setAddresses(addresses)
    const locations = JSON.parse(user).addresses.map((address) => {
      return {
        label: `${address.street} ${address.streetNumber ?? ""},${address.city} ${address.zipCode}`,
        value: address.id,
      }
    })
    const defaultAddress = addresses.find((address) => address.isDefault)
    if (defaultAddress) {
      setDefaultAddress({
        label: `${defaultAddress.street} ${defaultAddress?.streetNumber ?? ""},${defaultAddress.city} ${defaultAddress.zipCode}`,
        value: defaultAddress.id,
      })
      setSelectedAddress({
        label: `${defaultAddress.street} ${defaultAddress?.streetNumber ?? ""},${defaultAddress.city} ${defaultAddress.zipCode}`,
        value: defaultAddress.id,
      })
      setBillingAddress(defaultAddress)
      fetchShippingMethods(cartAccount, defaultAddress)
      fetchDeliveryWindows(defaultAddress.zipCode, defaultAddress.country)
    }
    setLocations(locations)
  }, [])

  

  const fetchShippingMethods = useCallback(async (cart, address) => {
    const methods = await getShippingMethods(cart.siteCode)
    const filteredMethods = methods
      .filter((method) =>
        method.shipTo.some((e) => e.country === address?.country)
      )
      .filter(
        (method) =>
          method.maxOrderValue === undefined ||
          method.maxOrderValue.amount >= cart.totalPrice.amount
      )
      .filter((method) => method.shippingTaxCode != null)
      .map((method) => ({
        ...method,
        fee: method.fees
          .filter(
            (feeEl) => feeEl.minOrderValue.amount <= cart.totalPrice.amount
          )
          .sort((a, b) => a.cost.amount - b.cost.amount)[0]?.cost?.amount,
      }))
      .sort((a, b) => a.fee - b.fee)
      await Promise.all(filteredMethods.map(async (m) => {
          const grossPrice =  await calculateTax(m.fee, m.shippingTaxCode, address?.country)
          m.grossFee = grossPrice
          return m
      }))
    setShippingMethods(filteredMethods)
  }, [])

  const fetchDeliveryWindows = useCallback(async (zipCode, country) => {
    const deliveryWindows = await getActualDeliveryWindows(zipCode, country)
    setDeliveryWindows(deliveryWindows.data)
  }, [])

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        billingAddress,
        setBillingAddress,
        defaultAddress,
        locations,
        shippingMethods,
        setShippingMethods,
        deliveryWindows,
        setDeliveryWindows,
        selectedDeliveryWindow,
        setSelectedDeliveryWindow,
        selectedDeliveryMethod,
        setSelectedDeliveryMethod,
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
