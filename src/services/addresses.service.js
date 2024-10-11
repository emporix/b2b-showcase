import { getCompanyAddresses } from './legal-entities.service'
import { USER } from 'constants/localstorage'

export const getShippingAddressesForCheckout = async () => {
  let addresses = await getFilteredAddresses('SHIPPING')
  if (addresses.length === 0) {
    const user = localStorage.getItem(USER)
    addresses = JSON.parse(user).addresses
  }
  return addresses
}

export const getBillingAddressesForCheckout = async () => {
  let addresses = await getFilteredAddresses('BILLING')
  if (addresses.length === 0) {
    const user = localStorage.getItem(USER)
    addresses = JSON.parse(user).addresses
  }
  return addresses
}

export const getShippingAddressesForQuotes = async () => {
  return getFilteredAddresses('SHIPPING')
}

export const getBillingAddressesForQuotes = async () => {
  return getFilteredAddresses('BILLING')
}

export const mapAddressToLocations = (address) => {
  return {
    label: `${address.street} ${address.streetNumber ?? ''},${address.city} ${
      address.zipCode
    }`,
    value: address.id,
  }
}

export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

const getFilteredAddresses = async (addressType) => {
  let addresses = (await getCompanyAddresses())
    .filter((location) =>
      location?.contactDetails?.tags?.find(
        (tag) => tag.toUpperCase() === addressType
      )
    )
    .map((location) => {
      return {
        ...location,
        street: location?.contactDetails?.addressLine1,
        streetNumber: location?.contactDetails?.addressLine2 ?? '',
        streetAppending: '',
        city: location?.contactDetails?.city,
        zipCode: location?.contactDetails?.postcode,
        country: location?.contactDetails?.countryCode,
        contactName: location?.companyName,
        state: location?.contactDetails?.countryCode,
        id: location?.id,
      }
    })
  return addresses
}
