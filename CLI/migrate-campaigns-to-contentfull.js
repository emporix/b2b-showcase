const contentful = require('contentful-management')
require('dotenv').config()
const { VoucherifyServerSide } = require('@voucherify/sdk')

const voucherifyClient = VoucherifyServerSide({
  applicationId: process.env.REACT_APP_VOUCHERIFY_APP_ID,
  secretKey: process.env.REACT_APP_VOUCHERIFY_SECRET_KEY,
  apiUrl: process.env.REACT_APP_VOUCHERIFY_API_URL,
})

const getCampaigns = async (page, campaign_type) => {
  const limit = 100
  return (
    (
      await voucherifyClient.campaigns.list({
        limit,
        page,
        campaign_type,
      })
    )?.campaigns || []
  )
}

const updateCampaignMetadata = async (nameOrId, metadata) => {
  await voucherifyClient.campaigns.update(nameOrId, { metadata })
}

const getAllCampaigns = async () => {
  let page = 1
  let allCampaigns = []
  let campaigns = []
  let campaign_type = 'DISCOUNT_COUPONS'
  do {
    campaigns = await getCampaigns(page, campaign_type)
    allCampaigns = [...allCampaigns, ...campaigns]
    page++
  } while (campaigns.length !== 0)
  campaign_type = 'GIFT_VOUCHERS'
  page = 1
  do {
    campaigns = await getCampaigns(page, campaign_type)
    allCampaigns = [...allCampaigns, ...campaigns]
    page++
  } while (campaigns.length !== 0)
  campaign_type = 'REFERRAL_PROGRAM'
  page = 1
  do {
    campaigns = await getCampaigns(page, campaign_type)
    allCampaigns = [...allCampaigns, ...campaigns]
    page++
  } while (campaigns.length !== 0)
  return allCampaigns
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
    (item) => item.name === 'campaign'
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
  const campaigns = await getAllCampaigns()
  await getContentfulEnvironment()
  for (const campaign of campaigns.filter((campaign) => !campaign.protected)) {
    if (campaign?.metadata?.contentfulEntryId) {
      continue
    }
    const name = campaign.name
    const type = campaign?.voucher?.type || campaign?.type
    const contentfulEntry = await createContent(
      await getContentfulEnvironment(),
      { name, type },
      await getStandaloneVoucherModelId(),
      await getAllContentfulLocales()
    )
    const contentfulEntryId = contentfulEntry?.sys?.id
    if (!contentfulEntryId) {
      continue
    }
    try {
      await updateCampaignMetadata(campaign.id || campaign.name, {
        ...(campaign?.metadata || {}),
        contentfulEntryId,
      })
    } catch (e) {
      console.log('error', e)
    }
  }
})()
