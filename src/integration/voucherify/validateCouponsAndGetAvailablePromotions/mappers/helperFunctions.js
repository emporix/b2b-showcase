import { getAvailablePromotions } from '../../voucherifyApi'

export function checkIfAllInapplicableCouponsArePromotionTier(
  notApplicableCoupons
) {
  const inapplicableCouponsPromitonTier = notApplicableCoupons.filter(
    (notApplicableCoupon) => notApplicableCoupon.object === 'promotion_tier'
  )

  return notApplicableCoupons.length === inapplicableCouponsPromitonTier.length
}

export function calculateTotalDiscountAmount(validatedCoupons) {
  const allItems =
    validatedCoupons.redeemables?.flatMap(
      (redeemable) => redeemable?.order?.items || []
    ) || []
  const totalDiscountAmount = allItems.reduce((total, item) => {
    return (
      total + item?.total_applied_discount_amount ||
      item?.total_discount_amount ||
      0
    )
  }, 0)

  if (totalDiscountAmount === 0) {
    return (
      validatedCoupons.order?.total_applied_discount_amount ??
      validatedCoupons.order?.total_discount_amount ??
      0
    )
  }

  if (totalDiscountAmount > (validatedCoupons?.order?.amount ?? 0)) {
    return validatedCoupons.order.amount
  }
  return totalDiscountAmount
}

export const setBannerOnValidatedPromotions = (
  redeemables,
  promotions = []
) => {
  const promotionTiersWithBanner = redeemables
    .filter((redeemable) => redeemable.object === 'promotion_tier')
    .map((redeemable) => {
      const appliedPromotion = promotions.find(
        (promotion) => promotion.id === redeemable.id
      )
      if (appliedPromotion) {
        redeemable['banner'] = appliedPromotion?.banner
      }

      return redeemable
    })

  return [
    ...redeemables.filter((element) => element.object !== 'promotion_tier'),
    ...promotionTiersWithBanner,
  ]
}

export const getPromotions = async (cart, uniqCoupons) => {
  const promotions = (await getAvailablePromotions(cart)) ?? []

  const availablePromotions = promotions
    .filter((promo) => {
      if (!uniqCoupons.length) {
        return true
      }

      const codes = uniqCoupons
        .filter((coupon) => coupon.status !== 'DELETED')
        .map((coupon) => coupon.code)
      return !codes.includes(promo.id)
    })
    .map((promo) => {
      return {
        status: 'AVAILABLE',
        value: promo.discount_amount,
        banner: promo.banner,
        code: promo.id,
        type: promo.object,
      }
    })

  return { promotions, availablePromotions }
}
