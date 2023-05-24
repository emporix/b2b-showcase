import {
  applyCouponOnCart,
  createCoupon,
  deleteDiscount,
  getCart,
  removeAllDiscountsFromCart,
  updateCartMetadataMixins,
} from './emporix/emporixApi'
import { buildCartFromEmporixCart } from './mappers/buildCartFromEmporixCart'
import { CartUpdateActions } from './voucherify/cartUpdateActions'
import { validateCouponsAndGetAvailablePromotions } from './voucherify/validateCouponsAndGetAvailablePromotions/validateCouponsAndGetAvailablePromotions'
import { getDiscountsValues } from './voucherify/mappers/getDiscountsValues'

export const updateCart = async ({
  emporixCartId,
  newCodes,
  codesToRemove,
  newPromotionCodes,
  customer,
}) => {
  const cartUpdateActions = new CartUpdateActions()
  if (!emporixCartId) {
    return {
      cart: {},
      inapplicableCoupons: [],
    }
  }
  const emporixCart = await getCart(emporixCartId)
  try {
    await validateCouponsAndGetAvailablePromotions(
      buildCartFromEmporixCart({
        emporixCart,
        newCodes,
        codesToRemove,
        newPromotionCodes,
        customer,
      }),
      cartUpdateActions
    )
  } catch (error) {
    console.log('error', error)
  }
  const validationResult = cartUpdateActions.getValidationResult() || {}
  const { applicableCoupons } = validationResult
  const { items } = buildCartFromEmporixCart({ emporixCart })
  const discountsDetails = getDiscountsValues(applicableCoupons, items)
  if (emporixCart.discounts?.length) {
    await removeAllDiscountsFromCart(emporixCart.id)
    emporixCart.discounts.forEach((discount) => {
      //don't wait
      deleteDiscount(discount.code)
    })
  }
  await updateCartMetadataMixins(
    emporixCart,
    validationResult,
    codesToRemove,
    discountsDetails
  )
  if (applicableCoupons.length > 0) {
    const createdCoupon = await createCoupon(
      emporixCart,
      validationResult.applicableCoupons
    )
    if (createdCoupon?.id) {
      await applyCouponOnCart(createdCoupon.id, emporixCart.id)
    }
  }
  return {
    cart: await getCart(emporixCartId),
    inapplicableCoupons: validationResult.inapplicableCoupons,
  }
}
