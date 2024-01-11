import {fetchReturnsUrl, fetchSingleReturnUrl} from 'services/service.config'
import { api } from './axios'
import { SAAS_TOKEN } from 'constants/localstorage'

export const fetchReturns = async () => {
  const { data, headers } = await api.get(fetchReturnsUrl())
  return data
}

export const fetchSingleReturn = async (id) => {
  const { data, headers } = await api.get(fetchSingleReturnUrl(id))
  return data
}

export const createReturn = async (returnData) => {
  const saasToken = localStorage.getItem(SAAS_TOKEN)
  const headers = {
    'saas-token': saasToken,
  }
  const { data } = await api.post(fetchReturnsUrl(), returnData, { headers })
  return data
}
