import { api } from './axios'

export const createQuoteCall = async (tenant, cartId) => {
  const { data } = await api.post(`quote/${tenant}/quotes`, {
    cartId,
  })
  return data
}

export const fetchQuotes = async (tenant) => {
  const resp = await api.get(`/quote/${tenant}/quotes?sort=metadata.createdAt:desc`)
  return resp.data
}

export const fetchQuoteDetails = async (tenant, quoteId) => {
  const resp = await api.get(`/quote/${tenant}/quotes/${quoteId}`)
  return resp.data
}

export const patchQuoteById = async (tenant, id, status) => {
  const payload = [
    {
      op: 'replace',
      path: '/status',
      value: status,
    },
  ]
  return await api.patch(`/quote/${tenant}/quotes/${id}`, payload)
}
