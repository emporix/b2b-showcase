import { uniqBy } from 'lodash'
import { mapEmporixUserToVoucherifyCustomer } from './voucherify/mappers/mapEmporixUserToVoucherifyCustomer'

export const mapEmporixItemsToVoucherifyProducts = (items) => {
  if (!Array.isArray(items)) {
    return []
  }
  return (
    items?.map?.((item) => {
      const {
        itemTaxInfo,
        itemPrice,
        price,
        quantity,
        effectiveQuantity,
        itemYrn,
      } = item
      const source_id = itemYrn.split(';').at(-1)
      if (itemTaxInfo?.[0]?.grossValue) {
        const amount = Math.round(itemTaxInfo[0].grossValue * 100)
        const price = Math.round(amount / (effectiveQuantity || quantity))
        return {
          source_id,
          quantity: effectiveQuantity || quantity,
          price,
          amount,
        }
      }
      return {
        source_id,
        quantity: effectiveQuantity || quantity,
        price: Math.round(itemPrice.amount / (effectiveQuantity || quantity)),
        amount: Math.round(itemPrice.amount * 100),
      }
    }) || []
  )
}

export const buildIntegrationCartFromEmporixCart = ({
  emporixCart,
  newCodes,
  codesToRemove,
  newPromotionCodes,
  customer,
  customerAdditionalMetadata,
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
    customer: mapEmporixUserToVoucherifyCustomer(
      customer,
      customerAdditionalMetadata
    ),
    sessionKey: emporixCart?.mixins?.voucherify?.sessionKey,
    items: mapEmporixItemsToVoucherifyProducts(emporixCart?.items || []),
    coupons,
  }
}
