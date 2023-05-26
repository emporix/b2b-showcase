const contentful = require('contentful-management')
require('dotenv').config()
const { VoucherifyServerSide } = require('@voucherify/sdk')

const voucherifyClient = VoucherifyServerSide({
  applicationId: process.env.REACT_APP_VOUCHERIFY_APP_ID,
  secretKey: process.env.REACT_APP_VOUCHERIFY_SECRET_KEY,
  apiUrl: process.env.REACT_APP_VOUCHERIFY_API_URL,
})

const getVouchers = async (page) => {
  const limit = 100
  return (
    (
      await voucherifyClient.vouchers.list({
        limit,
        page,
        filters: {
          campaigns: {
            conditions: {
              $is_unknown: [true],
            },
          },
        },
      })
    )?.vouchers || []
  )
}

const getAllVouchers = async () => {
  let page = 1
  let allVouchers = []
  let vouchers = []
  do {
    vouchers = await getVouchers(page)
    allVouchers = [...allVouchers, ...vouchers]
    page++
  } while (vouchers.length !== 0)
  return allVouchers
}

const updateVoucherMetadata = async (code, metadata) => {
  await voucherifyClient.vouchers.update({ code, metadata })
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

const getStandaloneVoucherModelId = async () => {
  if (promotionModelId) {
    return promotionModelId
  }
  promotionModelId = (await contentfulEnvironment.getContentTypes()).items.find(
    (item) => item.name === 'standalone voucher'
  )?.sys?.id
  return promotionModelId
}

const promotionModelSchema = [
  { type: 'Text', name: 'code' },
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
  const vouchers = await getAllVouchers()
  await createContentfulEnvironment()
  for (const voucher of vouchers) {
    if (voucher?.metadata?.contentfulEntryId) {
      continue
    }
    const code = voucher.code
    const contentfulEntry = await createContent(
      await getContentfulEnvironment(),
      { code },
      await getStandaloneVoucherModelId(),
      await getAllContentfulLocales()
    )
    const contentfulEntryId = contentfulEntry?.sys?.id
    if (!contentfulEntryId) {
      continue
    }
    await updateVoucherMetadata(code, {
      ...(voucher?.metadata || {}),
      contentfulEntryId,
    })
  }
})()
