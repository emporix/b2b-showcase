import { SAAS_TOKEN } from '../constants/localstorage'
import { api } from './axios'
import { ordersApi, subscriptionsApi } from './service.config'

export const getSubscriptions = async (params = {}) => {
  const saasToken = localStorage.getItem(SAAS_TOKEN)
  const headers = {
    'saas-token': saasToken,
  }
  params = {
    ...params,
    pageNumber: '1',
    pageSize: '16',
    q: 'entries.product.metadata.mixins.subscription:exists'
  }

  const res = await api.get(ordersApi(), { headers, params })
  return res.data
}

export const getSubscription = async (orderId, productId) => {
  const saasToken = localStorage.getItem(SAAS_TOKEN)
  const headers = {
    'saas-token': saasToken,
  }
  const res = await api.get(`${ordersApi()}/${orderId}`, { headers })
  const order = res.data
  const entry = order.entries.filter(entry => entry.id === productId)[0]
  return {
    id : order.id,
    entry: entry
  }
}

export const updateSubscription = async (orderId, productId, payload) => {
  const saasToken = localStorage.getItem(SAAS_TOKEN)
  const headers = {
    'saas-token': saasToken,
  }

  const res = await api.put(`${subscriptionsApi()}/${orderId}/${productId}`, payload, { headers })
  return res
}
