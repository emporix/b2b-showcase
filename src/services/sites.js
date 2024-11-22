import { api } from './axios'

export const fetchSites = async (tenant) => {
  const { data } = await api.get(`site/${tenant}/sites?expand=mixin:*`, {
    headers: { 'X-Version': 'v2' },
  })
  return data
}

export const fetchSite = async (tenant, siteCode) => {
  const { data } = await api.get(`site/${tenant}/sites/${siteCode}`, {
    headers: { 'X-Version': 'v2' },
  })
  return data
}

