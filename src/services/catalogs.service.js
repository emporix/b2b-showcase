import { api } from './axios'

export const fetchCatalogs = async (tenant, site) => {
  const { data } = await api.get(`/catalog/${tenant}/catalogs`, {
    headers: {
      'x-total-count': true,
    },
    params: {
      publishedSite: site
    }
  })
  return data
}
