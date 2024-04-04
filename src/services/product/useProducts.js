import { TENANT } from 'constants/localstorage'
import { api } from 'services/axios'
import { getLanguageFromLocalStorage } from '../../context/language-provider'

const getTenant = () => localStorage.getItem(TENANT)

export const useProducts = () => {
  const getProduct = async (productId) => {
    const { data } = await api.get(
      `/product/${getTenant()}/products/${productId}`,
      {
        params: { expand: 'template' },
      }
    )
    return data
  }

  const getProductTemplate = async () => {
    const { data } = await api.get(`/product/${getTenant()}/product-templates`)
    return data
  }

  const getVariantChildren = async (parentId) => {
    const { data } = await api.get(`/product/${getTenant()}/products/`, {
      params: {
        pageNumber: 1,
        pageSize: 200,
        q: `parentVariantId:${parentId}`,
      },
    })

    return data
  }

  return {
    getProduct,
    getProductTemplate,
    getVariantChildren,
  }
}
