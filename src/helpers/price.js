export const formatPrice = (product, isLoggedIn) => {
  if (!product?.price?.tax?.prices?.totalValue) {
    return null
  }
  if (isLoggedIn) {
    return product.price.tax.prices.totalValue.netValue
  } else {
    if (priceValid(product)) {
      return product.price.effectiveValue
    } else {
      return product.completePrices?.find(priceItem => priceItem.restrictions?.validity?.from !== null).tierValues[0].priceValue
    }
  }
}

export const priceValid = (product) => product.price.effectiveValue > 0.0001
