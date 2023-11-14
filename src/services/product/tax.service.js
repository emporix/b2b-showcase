import { TENANT } from 'constants/localstorage'
import { api } from '../axios'

export const calculateTax = async (netPrice, taxCode, country) => {
  if (!netPrice || !taxCode || !country) {
    return netPrice
  }
  const tenant = localStorage.getItem(TENANT)
  const body = {
    input: {
      targetLocation: {
        countryCode: country,
      },
      targetTaxClass: taxCode,
      includesTax: false,
      price: netPrice,
    },
  }
  const { data } = await api.put(
    `tax/${tenant}/taxes/calculation-commands`,
    body
  )
  return data.output.grossPrice
}
