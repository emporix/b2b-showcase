import { api } from './axios'

export const createQuoteCall = async (tenant, cartId, shipping, shippingAddressId, billingAddressId) => {
  const { data } = await api.post(`quote/${tenant}/quotes`, {
    cartId,
    shipping,
    shippingAddressId: shippingAddressId,
    billingAddressId: billingAddressId
  })
  return data
}

export const fetchQuotes = async (tenant) => {
  const resp = await api.get(
    `/quote/${tenant}/quotes?sort=metadata.createdAt:desc`
  )
  return resp.data
}

export const fetchQuoteDetails = async (tenant, quoteId) => {
  const resp = await api.get(`/quote/${tenant}/quotes/${quoteId}`)
  return resp.data
}

export const fetchQuoteReasons = async () => {
  const params = {
    pageSize: '60',
    pageNumber: '1',
    fields: 'code,message,type',
  }
  const resp = await api.get('/quote/{tenant}/quote-reasons', { params })
  return resp.data
}

export const patchQuoteById = async (tenant, id, status) => {
  const payload = [
    {
      op: 'replace',
      path: '/status',
      value: {
        value: status,
      },
    },
  ]
  return await api.patch(`/quote/${tenant}/quotes/${id}`, payload)
}

export const updateQuote = async (quoteId, quoteReasonId, type, comment) => {
  const payload = [
    {
      op: 'replace',
      path: '/status',
      value: {
        value: type,
        quoteReasonId,
        comment,
      },
    },
  ]
  return await api.patch(`/quote/{tenant}/quotes/${quoteId}`, payload)
}
