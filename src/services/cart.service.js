import {
  cartApi,
  cartItemUrl,
  cartProductsApi,
  cartRemoveApi,
  getCartAccountApi,
  getCartById,
  getCartMergeUrl,
  getRedeemOptions,
  getRewardPoints, redeemCouponForPoints,
} from './service.config'
import ApiRequest from './index'
import { ACCESS_TOKEN } from '../constants/localstorage'
import { api } from './axios'
import { getLanguageFromLocalStorage } from '../context/language-provider'

const CartService = () => {
  const mergeCarts = async (targetCartId, sourceCartId) => {
    const headers = {
      'X-Version': 'v2',
    }
    const res = await api.post(
      getCartMergeUrl(targetCartId),
      {
        carts: [sourceCartId],
      },
      { headers }
    )
    return res
  }
  const getUserCart = (customerId) => getCart({ customerId })
  const getAnnonymousCart = (sessionId) => getCart({ sessionId })
  const getCart = async ({ sessionId, customerId }) => {
    const headers = {
      'X-Version': 'v2',
    }
    let params = {
      siteCode: localStorage.getItem('siteCode'),
      create: true,
    }
    if (customerId) {
      params['customerId'] = customerId
    } else if (sessionId) {
      params['sessionId'] = sessionId
    }

    const { data: cartByUser } = await api.get(getCartAccountApi(), {
      headers,
      params,
    })
    const { data: cart } = await api.get(getCartById(cartByUser.id), {
      headers,
      params: { expandCalculation: true },
    })
    return cart
  }

  const getRewardPointsForLoggedUser = async () => {
    try{
      const { data } = await api.get(getRewardPoints())
      return data
    } catch(e){
      return null;
    }
  }

  const getRedeemOptionsForLoggedUser = async () => {
    const { data } = await api.get(getRedeemOptions())
    return data
  }
  const getCouponForPointsForLoggedUser = async (optionId) => {
    const payload = { id: optionId }
    const params = {
      siteCode: localStorage.getItem('siteCode'),
    }
    const { data } = await api.post(redeemCouponForPoints(), payload, { params })
    console.log('returned coupon code: ', data)
    return data
  }

  const applyDiscount = async (cartAccountId, code) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': getLanguageFromLocalStorage(),
    }

    const res = await ApiRequest(
      `${cartProductsApi()}/${cartAccountId}/discounts`,
      'post',
      { code: code },
      headers
    )
    return res.data
  }
  const removeDiscount = async (cartAccountId, discountId) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': getLanguageFromLocalStorage(),
    }

    const res = await api.delete(
      `${cartProductsApi()}/${cartAccountId}/discounts/${discountId}`,
      { headers }
    )
    return res.data
  }

  const changeCurrency = async (newCurrency, cartAccountId) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': getLanguageFromLocalStorage(),
    }

    const res = await ApiRequest(
      `${cartProductsApi()}/${cartAccountId}/changeCurrency`,
      'post',
      { currency: newCurrency },
      headers
    )
    return res.datait
  }

  const removeCart = async (cartAccountId, cartItemId) => {
    const headers = {
      'X-Version': 'v2',
    }
    const url = `${cartRemoveApi()}/${cartAccountId}/items/${cartItemId}`
    const res = await api.delete(url, { headers })
    return res
  }

  const deleteAllProductsFromCart = async (cartAccountId) => {
    const headers = {
      'X-Version': 'v2',
    }
    const url = `${cartRemoveApi()}/${cartAccountId}/items`
    const res = await api.delete(url, { headers })
    return res
  }

  const addMultipleProductsToCart = async (cartAccountId, products) => {
    const url = `${cartProductsApi()}/${cartAccountId}/itemsBatch`
    const headers = {
      'X-Version': 'v2',
    }
    const data = products.map((product) => {
      return {
        itemYrn: product.yrn,
        price: {
          priceId: product.price.priceId,
          effectiveAmount:
            product.price.effectiveAmount || product.price.effectiveValue,
          originalAmount:
            product.price.originalAmount || product.price.originalValue,
          currency: product.price.currency,
          // "currency": 'EUR',
          measurementUnit: {
            quantity: product.quantity,
            unitCode: 'PC',
          },
        },
        quantity: product.quantity,
      }
    })
    const params = {
      siteCode: localStorage.getItem('siteCode'),
    }
    const res = await api.post(url, data, {
      headers,
      params,
    })
    return res.data
  }
  const removeProductFromCart = async (cartId, productId) => {
    const url = cartItemUrl(cartId, productId)
    await api.delete(url)
  }

  const addProductToCart = async (cartId, product) => {
    const url = `${cartProductsApi()}/${cartId}/items`
    const headers = {
      'X-Version': 'v2',
    }
    const data = {
      itemYrn: product.yrn,
      price: {
        priceId: product.price.priceId,
        effectiveAmount: product.price.effectiveValue,
        originalAmount: product.price.originalValue,
        currency: product.price.currency,
      },
      quantity: product.quantity,
    }
    const params = {
      siteCode: localStorage.getItem('siteCode'),
    }
    const res = await api.post(url, data, {
      headers,
      params,
    })
    return res.data
  }

  const updateCartProduct = async (
    cartAccountId,
    cartItemId,
    body,
    partial = true
  ) => {
    const url = `${cartApi()}/${cartAccountId}/items/${cartItemId}`
    const headers = {
      'X-Version': 'v2',
    }
    const params = { partial }

    await api.put(url, body, { headers, params })
  }

  const updateDeliveryWindow = async (
    cartAccountId,
    body,
    partial = true
  ) => {
    const url = `${cartApi()}/${cartAccountId}`
    const headers = {}
    const params = { partial }

    await api.put(url, body, { headers, params })
  }

  return {
    getCart,
    changeCurrency,
    applyDiscount,
    getUserCart,
    getAnnonymousCart,
    mergeCarts,
    addProductToCart,
    removeProductFromCart,
    removeDiscount,
    removeCart,
    deleteAllProductsFromCart,
    addMultipleProductsToCart,
    updateCartProduct,
    getRewardPointsForLoggedUser,
    getRedeemOptionsForLoggedUser,
    getCouponForPointsForLoggedUser,
    updateDeliveryWindow,
  }
}
export default CartService()
