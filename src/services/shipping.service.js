import { ACCESS_TOKEN } from 'constants/localstorage'
import { shippingApi } from './service.config'
import { api } from './axios'
import { calculateTax } from './product/tax.service'

export const getShippingMethods = async (site) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${shippingApi()}/${site}/zones?expand=methods,fees`, { headers })
  return [
    ...new Set(
      [].concat(
        ...res.data.map((o) =>
          o.methods.map((m) => {
            m.zoneId = o.id
            m.shipTo = o.shipTo
            return m
          })
        )
      )
    ),
  ]
}

export const getActualDeliveryWindows = async (postalCode, country) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const params = {
    windowsLimit: 15
  }
  const res = await api.post(`${shippingApi()}/findSite`,
  {
    'postalCode': postalCode,
    'country': country
  },
  { headers, params })
  return res;
}

export const fetchFilteredShippingMethods = async (siteCode, totalPriceAmount, address) => {
  const methods = await getShippingMethods(siteCode)
  const filteredMethods = methods
    .filter((method) =>
      method.shipTo.some((e) => e.country === address?.country)
    )
    .filter(
      (method) =>
        method.maxOrderValue === undefined ||
        method.maxOrderValue.amount >= totalPriceAmount
    )
    .filter((method) => method.shippingTaxCode != null)
    .map((method) => ({
      ...method,
      fee: method.fees
        .filter(
          (feeEl) => feeEl.minOrderValue.amount <= totalPriceAmount
        )
        .sort((a, b) => a.cost.amount - b.cost.amount)[0]?.cost?.amount,
    }))
    .sort((a, b) => a.fee - b.fee)
    await Promise.all(filteredMethods.map(async (m) => {
      const grossPrice =  await calculateTax(m.fee, m.shippingTaxCode, address?.country)
      m.grossFee = grossPrice
      return m
  }))
  window.console.log("SHIPPING METHODS", methods, filteredMethods, address, totalPriceAmount)  
  return filteredMethods
}
