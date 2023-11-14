import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { USER } from '../../constants/localstorage'
import {
  getActualDeliveryWindows,
  fetchFilteredShippingMethods,
} from 'services/shipping.service'
const ApprovalAddressContext = createContext({})
export const useApprovalAddress = () => useContext(ApprovalAddressContext)

export const ApprovalAddressProvider = (props) => {
  const { children, approval } = props
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddressState] = useState(null)
  const [selectedDeliveryWindow, setSelectedDeliveryWindow] = useState(null)
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [billingAddress, setBillingAddressState] = useState(null)
  const [shippingAddress, setShippingAddress] = useState(null)
  const [locations, setLocations] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const [deliveryWindows, setDeliveryWindows] = useState([])
  const [selectedShippingMethod, setSelectedShippingMethod] = useState()

  const setSelectedAddress = (address) => {
    setSelectedAddressState({ ...address, type: 'SHIPPING' })
  }

  const setBillingAddress = (address) => {
    setBillingAddressState({ ...address, type: 'BILLING' })
  }

  useEffect(() => {
    if (!approval) {
      return
    }
    setBillingAddress(selectedAddress)
    fetchShippingMethods(approval, selectedAddress)
    if (selectedAddress) {
      initializeDeliveryWindows(
        selectedAddress.zipCode,
        selectedAddress.country,
        approval
      )
    }
  }, [selectedAddress, approval])

  useEffect(() => {
    const user = localStorage.getItem(USER)
    if (!user || !approval) {
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
    const shipping = approval.details.addresses.find(
      (element) => element.type === 'SHIPPING'
    )
    const billing = approval.details.addresses.find(
      (element) => element.type === 'BILLING'
    )

    setDefaultAddress({
      label: `${shipping.street} ${shipping.streetNumber},${shipping.city} ${shipping.zipCode}`,
      value: shipping.id,
    })
    setSelectedAddress({
      zipCode: shipping.zipCode,
      city: shipping.city,
      street: shipping.street,
      streetNumber: shipping.streetNumber,
      country: shipping.country,
      contactName: shipping.contactName,
    })
    setShippingAddress(shipping)
    setBillingAddress(billing ? billing : shipping)
    fetchShippingMethods(approval)
    setLocations(locations)
  }, [approval])

  const fetchShippingMethods = useCallback(async (approval) => {
    const shippingAddress = approval.details.addresses.find(
      (element) => element.type === 'SHIPPING'
    )
    const resource = approval.resource
    const filteredMethods = await fetchFilteredShippingMethods(
      resource.siteCode,
      resource.totalPrice.amount,
      shippingAddress
    )
    setShippingMethods(filteredMethods)
    if(!selectedShippingMethod){
      const method = filteredMethods.find((method) => method.id === approval.details.shipping.methodId)
      setSelectedShippingMethod(method)
      setSelectedDeliveryMethod(method)
    }

  }, [])

  const initializeDeliveryWindows = useCallback(
    async (zipCode, country, approval) => {
      const deliveryWindows = await getActualDeliveryWindows(zipCode, country)
      setDeliveryWindows(deliveryWindows.data)

      if (!selectedDeliveryWindow) {
        const deliveryWindow = transformDeliveryWindow(
          deliveryWindows.data
            .find((site) => site.id === 'DE')
            .zones.find((zone) =>
              zone.actualDeliveryWindows.find(
                (window) => window.id === approval.resource.deliveryWindow.id
              )
            )
            .actualDeliveryWindows.find(
              (window) => window.id === approval.resource.deliveryWindow.id
            )
        )
        setSelectedDeliveryWindow(deliveryWindow)
      }
    },
    []
  )

  function transformDeliveryWindow(deliveryWindow) {
    if (!deliveryWindow || !deliveryWindow.id || !deliveryWindow.deliveryDate) {
      return null
    }
    const dateObj = new Date(deliveryWindow.deliveryDate)
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const dayName = dayNames[dateObj.getUTCDay()]
    return {
      id: deliveryWindow.id,
      slotId: deliveryWindow.slotId,
      deliveryDate: deliveryWindow.deliveryDate,
      deliveryDayLabel: `${dayName} ${dateObj.toLocaleDateString()}`,
      deliveryTimeLabel: `${deliveryWindow.deliveryTimeRange.startTime} - ${deliveryWindow.deliveryTimeRange.endTime}`,
    }
  }

  return (
    <ApprovalAddressContext.Provider
      value={{
        approval,
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
        setShippingAddress,
        shippingAddress,
        selectedShippingMethod,
        setSelectedShippingMethod,
      }}
    >
      {children}
    </ApprovalAddressContext.Provider>
  )
}
