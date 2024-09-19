import { ACCESS_TOKEN } from 'constants/localstorage'
import { customerManagementApi } from './service.config'
import { api } from './axios'

export const getCompanyAddresses = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${customerManagementApi()}/legal-entities`, {
    headers,
  })
  return res?.data
    ?.map((legalEntity) => {
      return legalEntity.entitiesAddresses?.map(address => {
        return {...address, companyName: legalEntity.name, shipTo: legalEntity?.mixins?.erpData?.shipTo}
      })
    })
    ?.flat(1)
}

export const getCompanies = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${customerManagementApi()}/legal-entities`, {
    headers,
  })
  return res?.data?.map((company)=>{
    return {id:company.id,name:company.name, addresses:company.entitiesAddresses, erpData:company.mixins.erpData}
  })
}

export const getCompanyName = async () => {
  return (await getCompany())?.name
}

export const getCompany = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const headers = {
    'X-Version': 'v2',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const res = await api.get(`${customerManagementApi()}/legal-entities`, {
    headers,
  })
  return res.data[0]
}
