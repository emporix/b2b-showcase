export const formatPrice = (product, isLoggedIn) => {
  if (!product?.price?.tax?.prices?.totalValue) {
    return null
  }
  if (isLoggedIn) {
    return product.price.tax.prices.totalValue.netValue
  } else {
    if (isPriceValid(product)) {
      return product.price.effectiveValue
    } else {
      return product.completePrices?.find(
        priceItem => priceItem.restrictions?.validity?.from !==
          undefined).tierValues[0].priceValue
    }
  }
}

export const isPriceValid = (product) => product.price.effectiveValue > 0.0001

export const priceValidDate = (product) => {
  const priceWithValidityFrom = product.completePrices?.find(priceItem => priceItem.restrictions?.validity?.from !== undefined)
  return priceWithValidityFrom ? new Date(priceWithValidityFrom.restrictions.validity.from) : new Date()
}
