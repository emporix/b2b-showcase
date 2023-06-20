import { mapItemsToVoucherifyOrdersItems } from './validateCouponsAndGetAvailablePromotions/mappers/product'
import { VoucherifyServerSide } from '@voucherify/sdk'
import getContentfulEntryFields from './getContentfulEntryFields'

export function asyncMap(arr, asyncFn) {
  return Promise.all(arr.map(asyncFn))
}

export const getClient = () => {
  return VoucherifyServerSide({
    apiUrl: process.env.REACT_APP_VOUCHERIFY_API_URL,
    applicationId: process.env.REACT_APP_VOUCHERIFY_APP_ID,
    secretKey: process.env.REACT_APP_VOUCHERIFY_SECRET_KEY,
    dangerouslySetSecretKeyInBrowser: true,
  })
}

export const getValidationRule = async (validationRuleId) => {
  return await getClient().validationRules.get(validationRuleId)
}

const getQualificationsWithItems = async (
  scenario,
  items,
  customer,
  cursor
) => {
  const qualificationsResponse = await voucherifyFetchAPI({
    body: {
      scenario, // ALL, CUSTOMER_WALLET, AUDIENCE_ONLY, PRODUCTS, PRODUCTS_DISCOUNTS, PROMOTION_STACKS
      mode: 'ADVANCED', // hidden: BASIC, ADVANCED
      order: {
        items,
        customer,
      },
      customer,
      options: {
        limit: 100,
        ignore_rules_cache: true, // hidden,
        starting_after: cursor,
        filters: {},
      },
    },
    path: 'qualifications',
    method: 'POST',
  })
  if (qualificationsResponse.status !== 200) {
    return
  }
  const qualificationsResponseJSON = await qualificationsResponse.json()
  return qualificationsResponseJSON?.redeemables || {}
}

const getPromotionTiersOrVoucher = async (qualification) => {
  const { object } = qualification
  if (object === 'promotion_tier') {
    const response = await voucherifyFetchAPI({
      method: 'GET',
      path: `promotions/tiers/${encodeURIComponent(qualification.id)}`,
    })
    if (response.status !== 200) {
      return {}
    }
    return { ...(await response.json()), qualification }
  }
  if (object === 'voucher') {
    const response = await voucherifyFetchAPI({
      method: 'GET',
      path: `vouchers/${encodeURIComponent(qualification.id)}`,
    })
    if (response.status !== 200) {
      return {}
    }
    return { ...(await response.json()), qualification }
  }
  return {}
}

export const getPromotionTiersOrVoucherAddCMSEntryIfPossible = async (
  qualification
) => {
  const result = await getPromotionTiersOrVoucher(qualification)
  let contentfulEntryId
  if (result?.metadata?.contentfulEntryId) {
    contentfulEntryId = result.metadata?.contentfulEntryId
  }
  if (!contentfulEntryId && result?.campaign_id) {
    try {
      const campaign = await getClient().campaigns.get(result.campaign_id)
      contentfulEntryId = campaign?.metadata?.contentfulEntryId
    } catch (e) {
      console.log('error', e)
    }
  }
  if (contentfulEntryId) {
    const cmsFields = await getContentfulEntryFields(contentfulEntryId)
    if (cmsFields instanceof Object && Object.keys(cmsFields).length > 0) {
      result['cmsFields'] = cmsFields
    }
  }
  return result
}

export const getAllQualificationsWithItems = async (
  scenario, // ALL, CUSTOMER_WALLET, AUDIENCE_ONLY, PRODUCTS, PRODUCTS_DISCOUNTS, PROMOTION_STACKS
  items,
  customer
) => {
  let qualifications = []
  let cursor
  let has_more = true
  do {
    const qualificationsResult = await getQualificationsWithItems(
      scenario,
      items,
      customer,
      cursor
    )
    if (!qualificationsResult.data?.length) {
      break
    }
    qualifications = [...qualifications, ...qualificationsResult.data]
    has_more = qualificationsResult.has_more
    cursor = qualificationsResult.data.at(-1).created_at
  } while (has_more)

  return qualifications
}

export const getQualificationsWithItemsExtended = async (
  scenario, // ALL, CUSTOMER_WALLET, AUDIENCE_ONLY, PRODUCTS, PRODUCTS_DISCOUNTS, PROMOTION_STACKS
  items,
  customer
) => {
  let qualifications = []
  let cursor
  let has_more = true
  do {
    const qualificationsResult = await getQualificationsWithItems(
      scenario,
      items,
      customer,
      cursor
    )
    if (!qualificationsResult.data?.length) {
      break
    }
    qualifications = [...qualifications, ...qualificationsResult.data]
    has_more = qualificationsResult.has_more
    cursor = qualificationsResult.data.at(-1).created_at
  } while (has_more)

  const qualificationsExtended = await asyncMap(
    qualifications,
    getPromotionTiersOrVoucherAddCMSEntryIfPossible
  )
  return qualificationsExtended.filter(
    (promotionOrVoucher) => promotionOrVoucher?.id
  )
}

export const voucherifyFetchAPI = async ({ body, method = 'GET', path }) => {
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

export const validateStackableVouchers = async (request) => {
  return await getClient().validations.validateStackable(request)
}

export const redeemStackableVouchers = async (request) => {
  return await getClient().redemptions.redeemStackable(request)
}

export const createOrder = async (request) => {
  return await getClient().orders.create(request)
}

export const getAvailablePromotions = async (cart) => {
  const items = mapItemsToVoucherifyOrdersItems(cart.items)
  return (
    await asyncMap(
      (
        await getAllQualificationsWithItems('ALL', items, cart.customer)
      ).filter((qualification) => qualification?.object === 'promotion_tier'),
      getPromotionTiersOrVoucherAddCMSEntryIfPossible
    )
  ).filter((promotion_tier) => promotion_tier.id)
}

export const releaseValidationSession = async (codes, sessionKey) => {
  for await (const code of codes) {
    await getClient().vouchers.releaseValidationSession(code, sessionKey)
  }
}
