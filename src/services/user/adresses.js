import { api } from '../axios'

export const fetchAddresses = async () => {
  const { data } = await api.get('/customer/{tenant}/me/addresses')
  return data
}

export const createAddress = async (address) => {
  const { data } = await api.post('/customer/{tenant}/me/addresses', address)
  return data
}

export const updateAddress = async (address) => {
  const { data } = await api.put(
    '/customer/{tenant}/me/addresses/' + address.id,
    address
  )
  return data
}

export const deleteAddress = async (addressId) => {
  const { data } = await api.delete(
    '/customer/{tenant}/me/addresses/' + addressId
  )
  return data
}

export const fetchCountries = async () => {
  const { data } = await api.get(
    'country/{tenant}/countries?pageNumber=1&pageSize=300&sort=name%2Ccode%3Adesc&name=string&code=string&active=string&regions=string'
  )
  return data
}
