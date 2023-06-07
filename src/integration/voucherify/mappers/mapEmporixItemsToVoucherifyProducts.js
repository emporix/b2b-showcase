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
