import { api } from '../axios'

export const fetchAddresses = async () => {
  const { data } = await api.get('/customer/{tenant}/me/addresses')
  return data
}

export const createAddress = async (address) => {
  const { data } = await api.post('/customer/{tenant}/me/addresses', address)
  return data
}
