import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { USER } from '../../constants/localstorage'
import { useCart } from 'context/cart-provider'
import { getShippingMethods } from 'services/shipping.service'
import { getActualDeliveryWindows } from 'services/shipping.service'
import { calculateTax } from 'services/product/tax.service'
import {
  mapAddressToLocations,
  getShippingAddressesForCheckout,
  getBillingAddressesForCheckout,
  mapCompany, getCompanyShippingAddressesForCheckout
} from 'services/addresses.service'
import {getCompanies} from "../../services/legal-entities.service";


const AddressContext = createContext({})
export const useUserAddress = () => useContext(AddressContext)

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([])
  const [billingAddresses, setBillingAddresses] = useState([])
  const [selectedAddressItem, setSelectedAddressItemState] = useState([])
  const [selectedAddress, setSelectedAddressState] = useState(null)
  const [selectedCompany, setSelectedCompanyState] = useState(null)
  const [selectedDeliveryWindow, setSelectedDeliveryWindow] = useState(null)
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [defaultCompany, setDefaultCompany] = useState(null)
  const [billingAddress, setBillingAddressState] = useState(null)
  const [locations, setLocations] = useState([])
  const [companies, setCompanies] = useState([])
  const [availableCompanies, setAvailableCompanies] = useState([])
  const [billingLocations, setBillingLocations] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const [deliveryWindows, setDeliveryWindows] = useState([])
  const { cartAccount } = useCart()
  const setSelectedCompany = (company) => {
      setSelectedCompanyState({ ...company })
  }
  const setSelectedAddress = (address) => {
    setSelectedAddressState({ ...address, type: 'SHIPPING' })
  }

  const setSelectedAddressItem = (address) => {setSelectedAddressItemState(address)}

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
    initCompanies();
  }, [])

  useEffect(() => {
    if(selectedCompany){
      setSelectedAddress(null);
      setSelectedDeliveryWindow(null);
      setSelectedAddressItem(null)
      initAddresses()
    }
  }, [selectedCompany])

  const initCompanies = useCallback(async () => {
    const companiesFetched = await getCompanies();
    setAvailableCompanies(companiesFetched);
    setCompanies(companiesFetched.map((company)=>mapCompany(company)))
  },[])

  const initAddresses = useCallback(async () => {
    const addresses = getCompanyShippingAddressesForCheckout(selectedCompany)

    setAddresses(addresses)
    const locations = addresses.map((address) => mapAddressToLocations(address))
    const billingAddresses = await getBillingAddressesForCheckout()
    setBillingAddresses(billingAddresses)
    const billingLocations = billingAddresses.map((address) => mapAddressToLocations(address))
    const defaultAddress = addresses.find((address) => address.isDefault)

    if (defaultAddress) {
      setDefaultAddress(mapAddressToLocations(defaultAddress))
      setSelectedAddress(mapAddressToLocations(defaultAddress))
      setBillingAddress(defaultAddress)
      fetchShippingMethods(cartAccount, defaultAddress)
      fetchDeliveryWindows(defaultAddress.zipCode, defaultAddress.country)
    }else {
      setDefaultAddress(null)
    }
    setLocations(locations)
    setBillingLocations(billingLocations)
  }, [selectedCompany])


  const fetchShippingMethods = useCallback(async (cart, address) => {
    const methods = await getShippingMethods(cart.siteCode)
    const filteredMethods = methods
      .filter((method) =>
        method.shipTo.some((e) => e.country === address?.country)
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
            (feeEl) => feeEl.minOrderValue.amount <= cart.totalPrice?.amount
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
        selectedCompany,
        setSelectedCompany,
        setSelectedAddress,
        setSelectedAddressItem,
        selectedAddressItem,
        billingAddress,
        billingLocations,
        billingAddresses,
        setBillingAddress,
        defaultAddress,
        defaultCompany,
        locations,
        availableCompanies,
        companies,
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
