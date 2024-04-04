import React, { createContext, useContext, useEffect, useState } from 'react'
import { USER } from '../../constants/localstorage'

const AddressContext = createContext({})
export const useUserAddress = () => useContext(AddressContext)

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddressState] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [billingAddress, setBillingAddressState] = useState(null)
  const [locations, setLocations] = useState([])

  const setSelectedAddress = (address) => {
    setSelectedAddressState({ ...address, type: 'SHIPPING' })
  }

  const setBillingAddress = (address) => {
    setBillingAddressState({ ...address, type: 'BILLING' })
  }

  useEffect(() => {
    setBillingAddress(selectedAddress)
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
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
