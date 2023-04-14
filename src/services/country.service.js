import ApiRequest from './index'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { countriesApi } from 'services/service.config'
import { api } from './axios'

export const getCountry = async (countryCode) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Accept-Language': '*',
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${countriesApi()}/${countryCode}`, { headers })
  return res.data
}
