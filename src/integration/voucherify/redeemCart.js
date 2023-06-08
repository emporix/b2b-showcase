import { createOrder, redeemStackableVouchers } from './voucherifyApi'
import { buildIntegrationCartFromEmporixCart } from '../buildIntegrationCartFromEmporixCart'
import { buildValidationsValidateStackableParamsForVoucherify } from './validateCouponsAndGetAvailablePromotions/mappers/buildValidationsValidateStackableParamsForVoucherify'
import { mapItemsToVoucherifyOrdersItems } from './validateCouponsAndGetAvailablePromotions/mappers/product'

export const redeemCart = async ({ emporixCart, emporixOrderId, customer }) => {
  const cart = buildIntegrationCartFromEmporixCart({
    emporixCart,
    voucherifyCustomer: customer,
  })
  const request = buildValidationsValidateStackableParamsForVoucherify(
    cart.coupons,
    cart,
    mapItemsToVoucherifyOrdersItems(cart.items || []),
    emporixOrderId,
    'PAID'
  )
  await createOrder(request.order)
  if (cart.coupons?.length) {
    await redeemStackableVouchers(request)
  }
}
