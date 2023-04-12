import ApiRequest from '../index'
import { productApi, productApiWithYrn } from '../service.config'
import { ACCESS_TOKEN, TENANT } from '../../constants/localstorage'
import { getLanguageFromLocalStorage } from '../../context/language-provider'
import { api } from '../axios'

export const getProductsWithCode = async (codes) => {
  const params = {
    q: 'code:~(' + codes.join(',') + ')',
  }
  const headers = {
    'X-Version': 'v2',
    'Accept-Language': getLanguageFromLocalStorage(),
  }
  const { data } = await api.get(
    '/product/' + localStorage.getItem(TENANT) + '/products',
    {
      params,
      headers,
    }
  )
  return data
}

const ProductService = () => {
  const getProductsWithIds = async (ids = []) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': getLanguageFromLocalStorage(),
    }
    const params = {
      q: 'id:(' + ids.join(',') + ')',
    }
    const res = await ApiRequest(productApi(), 'get', {}, headers, params)
    return res.data
  }
  const getProductsWithCode = async (codes = []) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': getLanguageFromLocalStorage(),
    }
    const params = {
      q: 'code:~(' + codes.join(',') + ')',
    }
    const res = await ApiRequest(productApi(), 'get', {}, headers, params)
    return res.data
  }
  const getProductsWithYrns = async (yrns = []) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Accept-Language': getLanguageFromLocalStorage(),
      'Content-Type': 'application/json',
    }
    const data = {
      yrns: yrns,
    }
    const res = await ApiRequest(productApiWithYrn(), 'post', data, headers)
    const products = res.data.map((product) => {
      return {
        ...product,
        src:
          product.media !== undefined && product.media.length > 0
            ? product.media[0]['url']
            : '',
      }
    })
    return products
  }
  return {
    getProductsWithIds,

    getProductsWithYrns,
  }
}

export default ProductService()
