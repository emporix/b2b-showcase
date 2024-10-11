import ApiRequest from '../index'
import { ACCESS_TOKEN } from '../../constants/localstorage'
import { completePriceApi, priceApi } from '../service.config'

const PriceService = () => {
  const getPriceWithProductIds = async (product_ids = []) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
    let data = {
      items: [],
    }
    product_ids.forEach((id) => {
      data['items'].push({
        itemId: {
          itemType: 'PRODUCT',
          includesTax: false,
          id: id,
        },
        quantity: {
          quantity: 1,
        },
      })
    })
    const res = await ApiRequest(priceApi(), 'post', data, headers)
    return res.data
  }

  const getCompletePriceInfoForProducts = async (productIds) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
    const res = await Promise.all(productIds.map(productId => {
      const params = {
        itemId: productId
      }
      return ApiRequest(completePriceApi(), 'get', null, headers, params)
    }))
    return res.map(item => item.data)
  }

  return {
    getPriceWithProductIds,
    getCompletePriceInfoForProducts,
  }
}

export default PriceService()
