import ApiRequest from './index'
import { ACCESS_TOKEN, SAAS_TOKEN } from 'constants/localstorage'
import { approvalsApi } from 'services/service.config'
import productService from './product/product.service'
import { api } from './axios'

const ApprovalService = () => {
  const triggerApproval = async (
    cartId,
    addresses,
    shipping,
    paymentMethods,
    approver,
    comment
  ) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const saasToken = localStorage.getItem(SAAS_TOKEN)

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'saas-token': saasToken,
    }
    const params = {
      siteCode: localStorage.getItem('siteCode'),
    }
    const payload = {
      resourceId: cartId,
      resourceType: 'CART',
      action: 'CHECKOUT',
      approver: approver,
      comment: comment,
      details: {
        currency: 'EUR',
        paymentMethods: paymentMethods,
        shipping: shipping,
        addresses: addresses,
      },
    }
    const { data } = await ApiRequest(
      approvalsApi(),
      'post',
      payload,
      headers,
      params
    )
    return data
  }

  const declineApproval = async (approvalId, comment) => {
    const payload = [
      {
        op: 'REPLACE',
        path: '/status',
        value: 'DECLINED',
      },
      {
        op: 'ADD',
        path: '/approverComment',
        value: comment,
      },
    ]
    return await api.patch(`${approvalsApi()}/${approvalId}`, payload)
  }

  const updateDeliveryWindow = async (approvalId, deliveryWindow) => {
    const payload = {
      op: 'REPLACE',
      path: '/resource/deliveryWindow',
      value: deliveryWindow,
    }
    return await api.patch(`${approvalsApi()}/${approvalId}`, payload)
  }

  const getPendingAndDeclinedApprovals = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
    const siteCode = localStorage.getItem('siteCode')

    const res = await api.get(
      `${approvalsApi()}?q=status:(PENDING,DECLINED) resource.siteCode:${siteCode}`,
      { headers }
    )
    return res.data
  }

  const getApproval = async (id) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }

    const approval = (await api.get(`${approvalsApi()}/${id}`, { headers }))
      .data
    approval.resource.items = await fetchProducts(approval.resource.items)
    return approval
  }

  const fetchProducts = async (items) => {
    const yrns = items.map((item) => item.itemYrn)
    const fetchedProducts = await productService.getProductsWithYrns(yrns)
    const productsWithMedia = items.map((product) => {
      const matchedProduct = fetchedProducts.find((prod) =>
        product.itemYrn.includes(prod.id)
      )
      product.name = matchedProduct.name
      product.id = matchedProduct.id
      product.code = matchedProduct.code
      const medias = matchedProduct.media
      product.media =
        Array.isArray(medias) && medias.length ? medias[0] : undefined
      return product
    })
    return productsWithMedia
  }

  return {
    triggerApproval,
    getPendingAndDeclinedApprovals,
    getApproval,
    updateDeliveryWindow,
    declineApproval
  }
}

export default ApprovalService()
