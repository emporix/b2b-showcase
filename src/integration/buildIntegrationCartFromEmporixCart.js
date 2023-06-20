import { uniqBy } from 'lodash'
import { mapEmporixUserToVoucherifyCustomer } from './voucherify/mappers/mapEmporixUserToVoucherifyCustomer'
import { mapEmporixItemsToVoucherifyProducts } from './voucherify/mappers/mapEmporixItemsToVoucherifyProducts'

export const buildIntegrationCartFromEmporixCart = ({
  emporixCart,
  newCodes,
  codesToRemove,
  newPromotionCodes,
  customer,
  customerAdditionalMetadata,
  voucherifyCustomer,
}) => {
  const newPromotionsObjects =
    newPromotionCodes?.map((code) => {
      return {
        code,
        status: 'NEW',
        type: 'promotion_tier',
      }
    }) || []
  const newCodesObjects =
    newCodes?.map((code) => {
      return {
        code,
        status: 'NEW',
      }
    }) || []
  const currentlyAppliedCoupons = Array.isArray(
    emporixCart?.mixins?.voucherify?.appliedCoupons
  )
    ? emporixCart?.mixins?.voucherify?.appliedCoupons
    : []
  const deletedCodesObjects =
    codesToRemove?.map((code) => {
      return {
        code,
        status: 'DELETED',
        type: currentlyAppliedCoupons
          .filter((coupon) => coupon.type === 'promotion_tier')
          .map((coupon) => coupon.code)
          .includes(code)
          ? 'promotion_tier'
          : 'voucher',
      }
    }) || []
  const coupons = uniqBy(
    [
      ...deletedCodesObjects,
      ...currentlyAppliedCoupons,
      ...newCodesObjects,
      ...newPromotionsObjects,
    ],
    'code'
  )

  return {
    id: emporixCart.id,
    customer:
      voucherifyCustomer ||
      mapEmporixUserToVoucherifyCustomer(customer, customerAdditionalMetadata),
    sessionKey: emporixCart?.mixins?.voucherify?.sessionKey,
    items: mapEmporixItemsToVoucherifyProducts(emporixCart?.items || []),
    coupons,
  }
}
