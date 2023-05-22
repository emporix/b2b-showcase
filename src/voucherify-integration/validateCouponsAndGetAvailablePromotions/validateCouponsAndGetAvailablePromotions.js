import {
  codesFromCoupons,
  couponsStatusDeleted,
  filterCouponsStatusAppliedAndNewByLimit,
  filterOutCouponsIfCodeIn,
  filterOutCouponsTypePromotionTier,
  uniqueCouponsByCodes,
} from './couponsOperationFunctions'
import {
  filterOutRedeemablesIfCodeIn,
  getRedeemablesByStatus,
  redeemablesToCodes,
  stackableRedeemablesResponseToUnitStackableRedeemablesResultDiscountUnitWithCodes,
  stackableResponseToUnitTypeRedeemables,
} from './redeemableOperationFunctions'
import { getCodesIfProductNotFoundIn } from './getCodesIfProductNotFoundIn'
import { buildValidationsValidateStackableParamsForVoucherify } from './buildValidationsValidateStackableParamsForVoucherify'
import { mapItemsToVoucherifyOrdersItems } from './product'
import { getProductsToAdd } from './getProductsToAdd'
import { getItemsWithCorrectedPrices } from './getItemsWithPricesCorrected'
import {
  calculateTotalDiscountAmount,
  getPromotions,
  setBannerOnValidatedPromotions,
} from './helperFunctions'
import { replaceCodesWithInapplicableCoupons } from './replaceCodesWithInapplicableCoupons'
import {
  releaseValidationSession,
  validateStackableVouchers,
} from '../voucherifyApi'

export const validateCouponsAndGetAvailablePromotions = async (
  cart,
  cartUpdateActions
) => {
  const {
    id,
    customerId,
    anonymousId,
    sessionKey,
    coupons: couponsFromRequest,
    items,
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

  if (typeof cartUpdateActions?.setAvailablePromotions === 'function') {
    cartUpdateActions.setAvailablePromotions(availablePromotions)
  }

  if (!uniqueCoupons.length) {
    console.log({
      msg: 'No coupons applied, skipping voucherify call',
    })
    return
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

    return
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
      cartUpdateActions.setInapplicableCoupons(inapplicableRedeemables)
      return
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

  if (
    typeof cartUpdateActions.setSessionKey === 'function' &&
    typeof cartUpdateActions.setTotalDiscountAmount === 'function' &&
    typeof cartUpdateActions.setApplicableCoupons === 'function' &&
    typeof cartUpdateActions.setInapplicableCoupons === 'function' &&
    typeof cartUpdateActions.setProductsToAdd === 'function'
  ) {
    cartUpdateActions.setSessionKey(validatedCoupons?.session?.key)
    cartUpdateActions.setTotalDiscountAmount(
      calculateTotalDiscountAmount(validatedCoupons)
    )
    cartUpdateActions.setApplicableCoupons(
      setBannerOnValidatedPromotions(
        filterOutRedeemablesIfCodeIn(
          getRedeemablesByStatus(validatedCoupons.redeemables, 'APPLICABLE'),
          codesWithMissingProductsToAdd
        ),
        promotions
      )
    )
    cartUpdateActions.setInapplicableCoupons([
      ...inapplicableRedeemables,
      ...replaceCodesWithInapplicableCoupons(codesWithMissingProductsToAdd),
    ])
    cartUpdateActions.setProductsToAdd(productsToAdd)
  }
}
