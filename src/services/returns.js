import { fetchReturnsUrl } from 'services/service.config'
import { api } from './axios'

export const fetchReturns = async () => {
  const { data, headers } = await api.get(fetchReturnsUrl())
  return data
}
