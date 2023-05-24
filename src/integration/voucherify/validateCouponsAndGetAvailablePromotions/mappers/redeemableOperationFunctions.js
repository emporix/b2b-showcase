export function getRedeemablesByStatus(redeemables, status) {
  return (redeemables ?? []).filter(
    (redeemable) => redeemable.status === status
  )
}

export function redeemablesToCodes(redeemables) {
  return (redeemables ?? []).map((redeemable) => redeemable.id)
}

export function stackableResponseToUnitTypeRedeemables(validatedCoupons) {
  let FREE_SHIPPING_UNIT_TYPE
  return validatedCoupons.redeemables.filter(
    (redeemable) =>
      redeemable.result?.discount?.type === 'UNIT' &&
      redeemable.result.discount.unit_type !== FREE_SHIPPING_UNIT_TYPE
  )
}

export function stackableRedeemablesResponseToUnitStackableRedeemablesResultDiscountUnitWithCodes(
  unitTypeRedeemables
) {
  const APPLICABLE_PRODUCT_EFFECT = ['ADD_MISSING_ITEMS', 'ADD_NEW_ITEMS']

  return unitTypeRedeemables.flatMap((unitTypeRedeemable) => {
    const discount = unitTypeRedeemable.result?.discount
    const orderItems = unitTypeRedeemable.order.items
    if (!discount) {
      return []
    }
    const freeUnits = (
      discount.units?.map((unit) => {
        return { ...unit, code: unitTypeRedeemable.id }
      }) || [
        {
          ...discount,
          code: unitTypeRedeemable.id,
        },
      ]
    )
      .map((freeUnit) => {
        return {
          ...freeUnit,
          code: unitTypeRedeemable.id,
          price: orderItems.find((orderItem) => {
            return (
              orderItem?.product?.source_id === freeUnit?.product?.source_id
            )
          })?.price,
        }
      })
      .filter((unit) => APPLICABLE_PRODUCT_EFFECT.includes(unit.effect))
    if (!freeUnits.length) {
      return []
    }
    return freeUnits
  })
}

export function unitTypeRedeemablesToOrderItems(unitTypeRedeemables) {
  return unitTypeRedeemables.flatMap((e) => e.order.items)
}

export function filterOutRedeemablesIfCodeIn(redeemables, forbiddenCodes) {
  return redeemables.filter(
    (redeemable) => !forbiddenCodes.includes(redeemable.id)
  )
}
