import {fetchReturnsUrl, fetchSingleReturnUrl} from 'services/service.config'
import { api } from './axios'

export const fetchReturns = async () => {
  const { data, headers } = await api.get(fetchReturnsUrl())
  return data
}

export const fetchSingleReturn = async (id) => {
  const { data, headers } = await api.get(fetchSingleReturnUrl(id))
  return data
}

export const createReturn = async (returnData) => {
  const { data, headers } = await api.post(fetchReturnsUrl(), returnData)
  return data
}
