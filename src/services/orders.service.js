import { SAAS_TOKEN } from '../constants/localstorage'
import { api } from './axios'
import { ordersApi } from './service.config'

export const getOrders = async (params = {}) => {
  const saasToken = localStorage.getItem(SAAS_TOKEN)
  const headers = {
    'saas-token': saasToken,
  }
  params = {
    ...params,
    pageNumber: '1',
    pageSize: '16',
  }

  const res = await api.get(ordersApi(), { headers, params })
  return res.data
}

export const getRecentOrders = async () => {
  const res = await getOrders({ pageSize: '5' })
  return res
}

export const getOrder = async (orderId) => {
  const saasToken = localStorage.getItem(SAAS_TOKEN)
  const headers = {
    'saas-token': saasToken,
  }
  const res = await api.get(`${ordersApi()}/${orderId}`, { headers })
  return res.data
}
