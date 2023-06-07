import { mapEmporixUserToVoucherifyCustomer } from './mappers/mapEmporixUserToVoucherifyCustomer'

const mapEmporixItemsToVoucherifyProducts = (items) => {
  if (!Array.isArray(items)) {
    return []
  }
  return (
    items?.map?.((item) => {
      const {
        itemTaxInfo,
        quantity,
        effectiveQuantity,
        itemYrn,
        totalDiscount,
        totalPrice,
      } = item
      const totalDiscountAmount = totalDiscount?.amount || 0
      const totalAmountAfterDiscount = totalPrice - totalDiscountAmount
      const source_id = itemYrn.split(';').at(-1)
      if (itemTaxInfo?.[0]?.grossValue) {
        const amount = Math.round(itemTaxInfo[0].grossValue * 100)
        const price = Math.round(amount / (effectiveQuantity || quantity))
        return {
          quantity: effectiveQuantity || quantity,
          price,
          amount,
        }
      }
      return {
        source_id,
        related_object: 'product',
        quantity: effectiveQuantity || quantity,
        price:
          Math.round(
            (totalAmountAfterDiscount / (effectiveQuantity || quantity)) * 100
          ) / 100,
        amount: Math.round(totalAmountAfterDiscount * 100) / 100,
      }
    }) || []
  )
}

export const buildIntegrationOrderFromEmporixOrder = ({
  emporixOrder,
  customer,
  customerAdditionalMetadata,
}) => {
  const currentlyAppliedCoupons = Array.isArray(
    emporixOrder?.mixins?.voucherify?.appliedCoupons
  )
    ? emporixOrder?.mixins?.voucherify?.appliedCoupons
    : []

  return {
    id: emporixOrder.id,
    customer: mapEmporixUserToVoucherifyCustomer(
      customer,
      customerAdditionalMetadata
    ),
    items: mapEmporixItemsToVoucherifyProducts(emporixOrder?.entries || []),
    coupons: currentlyAppliedCoupons,
    status: emporixOrder.status,
  }
}
