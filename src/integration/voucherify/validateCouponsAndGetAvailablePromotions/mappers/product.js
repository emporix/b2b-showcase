export function getMetadata(attributes, metadataSchemaProperties) {
  return attributes
    ? Object.fromEntries(
        attributes
          .filter((attr) => metadataSchemaProperties.includes(attr.name))
          .map((attr) => [attr.name, attr.value])
      )
    : {}
}

export function mapItemsToVoucherifyOrdersItems(
  lineItems,
  metadataSchemaProperties = []
) {
  return lineItems
    .filter((item) => item.quantity > 0)
    .map((item) => {
      return {
        source_id: item?.source_id,
        related_object: 'product',
        quantity: getQuantity(item),
        price: item.price,
        amount: item.amount,
        product: {
          override: true,
          name: item.name,
        },
        sku: {
          override: true,
          sku: item.sku,
          metadata: metadataSchemaProperties
            ? getMetadata(item?.attributes, metadataSchemaProperties)
            : {},
        },
      }
    })
}

export function getQuantity(item) {
  const custom = item.custom?.fields?.applied_codes
  if (!custom) {
    return item?.quantity
  }

  return custom
    .map((code) => JSON.parse(code))
    .filter(
      (code) => code.type === 'UNIT' && code.effect !== 'ADD_MISSING_ITEMS'
    )
    .reduce((prevQuantity, code) => {
      return prevQuantity - code.totalDiscountQuantity
    }, item?.quantity)
}
