const fetch = require('node-fetch')
const contentful = require('contentful-management')
require('dotenv').config()
const voucherifyFetchAPI = async ({ body, method = 'GET', path }) => {
  return await fetch(`https://dev.api.voucherify.io/v1/${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'X-App-Id': process.env.REACT_APP_VOUCHERIFY_APP_ID,
      'X-App-Token': process.env.REACT_APP_VOUCHERIFY_SECRET_KEY,
      'Content-Type': 'application/json',
    },
  })
}

const getPromotions = async (page) => {
  const limit = 100
  const resultRaw = await voucherifyFetchAPI({
    path: `promotions/tiers?is_available=true&limit=${limit}&page=${page}`,
    method: 'GET',
  })
  const result = await resultRaw.json()
  return result?.tiers || []
}

const getAllPromotions = async () => {
  let page = 1
  let allPromotions = []
  let promotions = []
  do {
    promotions = await getPromotions(page)
    allPromotions = [...allPromotions, ...promotions]
    page++
  } while (promotions.length !== 0)
  return allPromotions
}

const updatePromotionTiersMetadata = async (promotionId, metadata) => {
  await voucherifyFetchAPI({
    method: 'PUT',
    body: {
      metadata,
    },
    path: `promotions/tiers/${promotionId}`,
  })
}

const contentfulClient = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

let contentfulEnvironment, allAllContentfulLocales, promotionModelId

const getContentfulEnvironment = async () => {
  if (contentfulEnvironment) {
    return contentfulEnvironment
  }
  const spaceId = (await contentfulClient.getSpaces()).items.find(
    (space) => space?.name === 'Blank'
  )?.sys?.id
  const space = await contentfulClient.getSpace(spaceId)
  contentfulEnvironment = await space.getEnvironment('master')
  return contentfulEnvironment
}

const createContentfulEnvironment = async () => {
  await getContentfulEnvironment()
}

const getAllContentfulLocales = async () => {
  if (allAllContentfulLocales) {
    return allAllContentfulLocales
  }
  const allLocales = (await contentfulEnvironment.getLocales()).items.map(
    (item) => item.code
  )
  allAllContentfulLocales = allLocales
  return allLocales
}

const getPromotionModelId = async () => {
  if (promotionModelId) {
    return promotionModelId
  }
  promotionModelId = (await contentfulEnvironment.getContentTypes()).items.find(
    (item) => item.name === 'promotion_tier'
  )?.sys?.id
  return promotionModelId
}

const promotionModelSchema = [
  { type: 'Text', name: 'name' },
  { type: 'Text', name: 'description' },
  { type: 'Text', name: 'termsAndConditions' },
]

const createContent = async (
  environment,
  object,
  contentModelId,
  allLocales
) => {
  const allowedKeys = promotionModelSchema.map((type) => type.name)
  const deleteIfValueIsFalseFromObject = (object) => {
    if (!!object && typeof object === 'object')
      for (const key of Object.keys(object)) {
        if (!object[key]) {
          delete object[key]
        }
        if (typeof object[key] === 'object') {
          deleteIfValueIsFalseFromObject(object[key])
        }
      }
    return object
  }

  const result = {}
  for (const key of Object.keys(object)) {
    if (!object[key] || !allowedKeys.includes(key)) {
      continue
    }
    const resultKey = {}
    for (const locale of allLocales) {
      resultKey[locale] = object[key]
    }
    result[key] = resultKey
  }
  return await environment.createEntry(contentModelId, {
    fields: deleteIfValueIsFalseFromObject(result),
  })
}

;(async () => {
  const promotions = await getAllPromotions()
  await createContentfulEnvironment()
  for (const promotion of promotions) {
    if (promotion?.metadata?.contentfulEntryId) {
      continue
    }
    const name = promotion.banner || promotion.name || ''
    const contentfulEntry = await createContent(
      await getContentfulEnvironment(),
      { name },
      await getPromotionModelId(),
      await getAllContentfulLocales()
    )
    const contentfulEntryId = contentfulEntry?.sys?.id
    if (!contentfulEntryId) {
      continue
    }
    await updatePromotionTiersMetadata(promotion.id, {
      ...(promotion?.metadata || {}),
      contentfulEntryId,
    })
  }
})()
