import ApiRequest from './index'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { customerManagementApi } from './service.config'
import { api } from './axios'

export const getCompanyAddresses = async (company) => {

  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${customerManagementApi()}/legal-entities`, { headers })
  return res.data.map(a => a.entitiesAddresses).flat(1)
}
