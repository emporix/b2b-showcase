import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { USER } from '../../constants/localstorage'
import { useCart } from 'context/cart-provider'
import { getShippingMethods } from 'services/shipping.service'


const AddressContext = createContext({})
export const useUserAddress = () => useContext(AddressContext)

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddressState] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [billingAddress, setBillingAddressState] = useState(null)
  const [locations, setLocations] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const { cartAccount } = useCart()

  const setSelectedAddress = (address) => {
    setSelectedAddressState({ ...address, type: 'SHIPPING' })
  }

  const setBillingAddress = (address) => {
    setBillingAddressState({ ...address, type: 'BILLING' })
  }

  useEffect(() => {
    setBillingAddress(selectedAddress)
    fetchShippingMethods(cartAccount,selectedAddress )
  }, [selectedAddress])

  useEffect(() => {
    const user = localStorage.getItem(USER)
    if (!user) {
      return
    }
    const addresses = JSON.parse(user).addresses
    setAddresses(addresses)
    const locations = JSON.parse(user).addresses.map((address) => {
      return {
        label: `${address.street} ${address.streetNumber},${address.city} ${address.zipCode}`,
        value: address.id,
      }
    })
    const defaultAddress = addresses.find((address) => address.isDefault)
    if (defaultAddress) {
      setDefaultAddress({
        label: `${defaultAddress.street} ${defaultAddress.streetNumber},${defaultAddress.city} ${defaultAddress.zipCode}`,
        value: defaultAddress.id,
      })
      setSelectedAddress({
        label: `${defaultAddress.street} ${defaultAddress.streetNumber},${defaultAddress.city} ${defaultAddress.zipCode}`,
        value: defaultAddress.id,
      })
      setBillingAddress(defaultAddress)
    }
    setLocations(locations)
    fetchShippingMethods(cartAccount,defaultAddress )
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
    setShippingMethods(filteredMethods)
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
        setShippingMethods
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
