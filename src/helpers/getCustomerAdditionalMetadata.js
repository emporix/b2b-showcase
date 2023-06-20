import { CUSTOMER_ADDITIONAL_METADATA } from '../constants/localstorage'

export const getCustomerAdditionalMetadata = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_ADDITIONAL_METADATA))
  } catch (e) {
    console.log(
      'could not parse CUSTOMER_ADDITIONAL_METADATA key from local storage'
    )
  }
  return {}
}
