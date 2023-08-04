import ApiRequest from './index'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { shippingApi } from './service.config'
import { api } from './axios'

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
