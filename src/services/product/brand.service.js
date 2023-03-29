import ApiRequest from '../index'
import { ACCESS_TOKEN } from '../../constants/localstorage'
import { brandApi } from '../service.config'
import { api } from '../axios'

export const getBrand = async (brandId) => {
  const { data } = await api.get(`/brand/brands/${brandId}`)
  return data
}

const BrandService = () => {
  const getBrands = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      'X-Version': 'v2',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
    const res = await ApiRequest(brandApi(), 'get', {}, headers, {})
    return res.data
  }
  return {
    getBrands,
  }
}
export default BrandService()
