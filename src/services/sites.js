import { api } from './axios'

export const fetchSites = async (tenant) => {
  const { data } = await api.get(`site/${tenant}/sites`, {
    headers: { 'X-Version': 'v2' },
  })
  return data
}
