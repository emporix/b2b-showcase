import {
  codesFromCoupons,
  couponsStatusDeleted,
  filterCouponsStatusAppliedAndNewByLimit,
  filterOutCouponsIfCodeIn,
  filterOutCouponsTypePromotionTier,
  uniqueCouponsByCodes,
} from './mappers/couponsOperationFunctions'
import {
  filterOutRedeemablesIfCodeIn,
  getRedeemablesByStatus,
  redeemablesToCodes,
  stackableRedeemablesResponseToUnitStackableRedeemablesResultDiscountUnitWithCodes,
  stackableResponseToUnitTypeRedeemables,
} from './mappers/redeemableOperationFunctions'
import { getCodesIfProductNotFoundIn } from './mappers/getCodesIfProductNotFoundIn'
import { buildValidationsValidateStackableParamsForVoucherify } from './mappers/buildValidationsValidateStackableParamsForVoucherify'
import { mapItemsToVoucherifyOrdersItems } from './mappers/product'
import { getItemsWithCorrectedPrices } from './mappers/getItemsWithPricesCorrected'
import {
  calculateTotalDiscountAmount,
  checkIfAllInapplicableCouponsArePromotionTier,
  getPromotions,
  setBannerOnValidatedPromotions,
} from './mappers/helperFunctions'
import { replaceCodesWithInapplicableCoupons } from './mappers/replaceCodesWithInapplicableCoupons'
import {
  getClient,
  releaseValidationSession,
  validateStackableVouchers,
} from '../voucherifyApi'

const defaultResponse = {
  availablePromotions: [],
  totalDiscountAmount: 0,
  productsToAdd: [],
  applicableCoupons: [],
  inapplicableCoupons: [],
  sessionKey: undefined,
  allInapplicableCouponsArePromotionTier: undefined,
}

export const validateCouponsAndGetAvailablePromotions = async (cart) => {
  const {
    id,
    customerId,
    anonymousId,
    sessionKey,
    coupons: couponsFromRequest,
    items,
    customer,
  } = cart

  const uniqueCoupons = uniqueCouponsByCodes(couponsFromRequest)
  if (couponsFromRequest.length !== uniqueCoupons.length) {
    console.log({
      msg: 'COUPONS: Duplicates found and deleted',
    })
  }

  const { promotions, availablePromotions } = await getPromotions(
    cart,
    uniqueCoupons
  )

  if (!uniqueCoupons.length) {
    console.log({
      msg: 'No coupons applied, skipping voucherify call',
    })
    return { ...defaultResponse, availablePromotions }
  }

  const deletedCoupons = couponsStatusDeleted(uniqueCoupons)
  //don't wait
  releaseValidationSession(
    codesFromCoupons(filterOutCouponsTypePromotionTier(deletedCoupons)),
    sessionKey
  )

  if (deletedCoupons.length === uniqueCoupons.length) {
    console.log({
      msg: 'Deleting coupons only, skipping voucherify call',
    })

    return { ...defaultResponse, availablePromotions }
  }

  const couponsAppliedAndNewLimitedByConfig =
    filterCouponsStatusAppliedAndNewByLimit(
      uniqueCoupons,
      5 //Voucherify max limit
    )
  let validatedCoupons = await validateStackableVouchers(
    buildValidationsValidateStackableParamsForVoucherify(
      couponsAppliedAndNewLimitedByConfig,
      cart,
      mapItemsToVoucherifyOrdersItems(items)
    )
  )

  const inapplicableRedeemables = getRedeemablesByStatus(
    validatedCoupons.redeemables,
    'INAPPLICABLE'
  )
  const inapplicableCodes = redeemablesToCodes(inapplicableRedeemables)

  if (validatedCoupons.valid === false) {
    const applicableCodes = couponsAppliedAndNewLimitedByConfig.filter(
      (coupon) => !inapplicableCodes.includes(coupon.code)
    )
    if (applicableCodes.length === 0) {
      return {
        ...defaultResponse,
        availablePromotions,
        inapplicableCoupons: inapplicableRedeemables,
      }
    }
    //We need to do another call to V% if there is any applicable coupon in the cart
    //to get definitions of discounts we should apply on the cart
    validatedCoupons = await validateStackableVouchers(
      buildValidationsValidateStackableParamsForVoucherify(
        applicableCodes,
        cart,
        mapItemsToVoucherifyOrdersItems(items)
      )
    )
  }

  const unitTypeRedeemables =
    stackableResponseToUnitTypeRedeemables(validatedCoupons)
  const stackableRedeemablesResultDiscountUnitWithPriceAndCodes =
    stackableRedeemablesResponseToUnitStackableRedeemablesResultDiscountUnitWithCodes(
      unitTypeRedeemables
    )

  const { found: currentPricesOfProducts, notFound: notFoundProductSourceIds } =
    { found: [], notFound: [] }

  const codesWithMissingProductsToAdd = getCodesIfProductNotFoundIn(
    stackableRedeemablesResultDiscountUnitWithPriceAndCodes,
    notFoundProductSourceIds
  )

  const pricesIncorrect = []

  //don't wait
  releaseValidationSession(
    codesWithMissingProductsToAdd,
    validatedCoupons?.session?.key ?? sessionKey
  )

  if (
    filterOutCouponsIfCodeIn(
      couponsAppliedAndNewLimitedByConfig,
      codesWithMissingProductsToAdd
    ).length > 0 &&
    pricesIncorrect.length
  ) {
    const itemsWithPricesCorrected = getItemsWithCorrectedPrices(
      validatedCoupons.order.items,
      items,
      pricesIncorrect
    )

    validatedCoupons = await validateStackableVouchers(
      buildValidationsValidateStackableParamsForVoucherify(
        filterOutCouponsIfCodeIn(
          couponsAppliedAndNewLimitedByConfig,
          codesWithMissingProductsToAdd
        ),
        cart,
        itemsWithPricesCorrected
      )
    )
  }

  const productsToAdd = [] //getProductsToAdd(validatedCoupons, [])

  const applicableCoupons = setBannerOnValidatedPromotions(
    filterOutRedeemablesIfCodeIn(
      getRedeemablesByStatus(validatedCoupons.redeemables, 'APPLICABLE'),
      codesWithMissingProductsToAdd
    ),
    promotions
  )
  const inapplicableCoupons = [
    ...inapplicableRedeemables,
    ...replaceCodesWithInapplicableCoupons(codesWithMissingProductsToAdd),
  ]

  return {
    ...defaultResponse,
    availablePromotions,
    applicableCoupons,
    inapplicableCoupons,
    newSessionKey: validatedCoupons?.session?.key ?? null,
    totalDiscountAmount: calculateTotalDiscountAmount(validatedCoupons),
    productsToAdd,
    allInapplicableCouponsArePromotionTier:
      applicableCoupons.length || inapplicableCoupons.length
        ? checkIfAllInapplicableCouponsArePromotionTier(inapplicableCoupons)
        : undefined,
  }
}
