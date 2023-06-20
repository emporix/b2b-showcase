import {
  categoryApi,
  retrievResourceApi,
  resourceReferenceApi,
  parentCategoriesApi,
} from '../service.config'
import { PRODUCT_CATEGORY_TREE, TENANT } from '../../constants/localstorage'
import { maxCategoryResourceBatchCount } from '../../constants/service'
import { api } from '../axios'

export const getCategoryId = (key) => {
  const categoryTrees = JSON.parse(localStorage.getItem(PRODUCT_CATEGORY_TREE))
  let category = categoryTrees.find((category) => category.key === key)
  return category?.categoryId
}

export const getCagegoryDetails = async (categoryId) => {
  const tenant = localStorage.getItem(TENANT)
  const { data } = await api.get(
    `/category/${tenant}/categories/${categoryId}`,
    {
      headers: {
        'X-Version': 'v2',
      },
    }
  )

  return data
}

export const retrievResourceAssignedToCategory = async (categoryId) => {
  const resourceApi = `${retrievResourceApi(
    categoryId
  )}?withSubcategories=true&pageSize=${maxCategoryResourceBatchCount}`
  const headers = {
    'X-Version': 'v2',
    'X-Total-Count': true,
  }
  const { data } = await api.get(resourceApi, { headers })
  return data
}

export const putProductCount = (cat, prodCounts) => {
  let total = prodCounts[cat.categoryId] || 0
  const newItems = cat.items.map((item) => {
    return putProductCount(item, prodCounts)
  })
  return { ...cat, items: newItems, total }
}

export const getProductCategoryDetail = async (
  mainCategoryKey,
  subCategoryKey,
  categoryKey,
  categoryTrees
) => {
  let matchMainCategory = categoryTrees.find(
    (category) => category.key === mainCategoryKey
  )

  if (!matchMainCategory) {
    throw new Error('no match main category')
  }
  const resources = await retrievResourceAssignedToCategory(
    matchMainCategory.categoryId
  )
  let productCounts = {}

  resources.forEach((res) => {
    if (res.ref.type === 'product')
      productCounts[res.categoryId] =
        productCounts[res.categoryId] === undefined
          ? 1
          : productCounts[res.categoryId] + 1
  })
  matchMainCategory = putProductCount(matchMainCategory, productCounts)
  let resTitle, resCategories, resCategoryId
  let products = []

  if (subCategoryKey === undefined) {
    resTitle = matchMainCategory.title
    resCategories = matchMainCategory.items
    resCategoryId = matchMainCategory.categoryId
  } else {
    let matchSubCategory = matchMainCategory.items.filter(
      (category) => category.key === subCategoryKey
    )
    matchSubCategory = matchSubCategory.length > 0 ? matchSubCategory[0] : []

    if (categoryKey === undefined) {
      resTitle = matchSubCategory.title
      resCategories = matchMainCategory.items
      resCategoryId = matchSubCategory.categoryId
    } else {
      let matchCategory = matchSubCategory.items.filter(
        (category) => category.key === categoryKey
      )
      matchCategory = matchCategory.length > 0 ? matchCategory[0] : []

      resTitle = matchCategory.title
      resCategories = matchMainCategory.items
      resCategoryId = matchCategory.categoryId
    }
  }

  const productResources = await retrievResourceAssignedToCategory(
    resCategoryId
  )
  productResources.map((res) => {
    if (res.ref.type === 'product') products.push(res.ref.id)
    return []
  })

  return {
    title: resTitle,
    categories: resCategories,
    productIds: products,
    categoryId: resCategoryId,
  }
}

export const getAllCategories = async () => {
  const headers = {
    'X-Version': 'v2',
  }
  const { data } = await api.get(categoryApi(), { headers })
  return data
}

const getCategoryTree = (categories, layer, parenturl = 'product', lang) => {
  return categories.map((category) => {
    const categoryKey = category.name.toLowerCase().replaceAll(' ', '_')
    const url = `${parenturl}/${categoryKey}`
    const items =
      category.subcategories !== undefined
        ? getCategoryTree(category.subcategories, layer + 1, url, lang)
        : []

    let title = category.name
    if (lang && category.localizedName['it']) {
      title = category.localizedName[lang]
    }

    return {
      title,
      items: items,
      key: categoryKey,
      categoryId: category.id,
      url: url,
      total: 0,
    }
  })
}

export const getProductCategoryTrees = async (rootCategoriesIds, lang) => {
  const categories = await getAllCategories()
  const sortedCategories = categories.filter((category) =>
    rootCategoriesIds.includes(category.id)
  )
  const categoryTrees = getCategoryTree(sortedCategories, 1, 'product', lang)

  categoryTrees.sort((a, b) => a.key.localeCompare(b.key))
  localStorage.setItem(PRODUCT_CATEGORY_TREE, JSON.stringify(categoryTrees))
  return categoryTrees
}

export const getRetrieveAllCategoriesWithResoureceId = async (resourceId) => {
  const headers = {
    'X-Version': 'v2',
    'X-Total-Count': true,
  }
  const url = `${resourceReferenceApi()}/${resourceId}`
  const { data } = await api.get(url, { headers })
  return data
}

export const getAllParentCategories = async (categoryId) => {
  const headers = {
    'X-Version': 'v2',
    'X-Total-Count': true,
  }
  const url = `${parentCategoriesApi()}/${categoryId}/parents`
  const categories = await api.get(url, { headers })
  return categories
}
