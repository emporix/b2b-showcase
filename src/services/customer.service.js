import { customerApi } from './service.config'
import { api } from './axios'
import { getCompanyName } from './legal-entities.service'
import { ANONYMOUS_TOKEN } from 'constants/localstorage'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const getCustomers = async () => {
  const res = await api.get(`${customerApi()}/customers?pageSize=100`)
  return res.data
}

export const createCustomer = async (customer, preferredCurrency) => {
  const siteCode = localStorage.getItem('siteCode')
  const currentLanguage = localStorage.getItem('current-language')

  const companyName = await getCompanyName()
  const body = {
    ...customer,
    company: companyName,
    preferredSite: siteCode,
    preferredLanguage: currentLanguage,
    preferredCurrency: preferredCurrency.code,
  }
  const res = await api.post(`${customerApi()}/customers`, body)
  return res.data
}

export const updateCustomer = async (customerId, active) => {
  const body = {
    active: active,
  }
  const res = await api.patch(`${customerApi()}/customers/${customerId}`, body)
  return res.data
}

export const resetPassword = async (userTenant, password, token) => {
  const anonymousToken = localStorage.getItem(ANONYMOUS_TOKEN)
  const { data } = await axios.post(
    API_URL + `/customer/${userTenant}/password/reset/update`,
    {
      token: token,
      password: password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + anonymousToken,
      },
    }
  )
  return data
}
