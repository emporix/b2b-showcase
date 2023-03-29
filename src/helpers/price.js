export const formatPrice = (product, isLoggedIn) => {
  if (!product?.price?.tax?.prices?.totalValue) {
    return null
  }
  if (isLoggedIn) {
    return product.price.tax.prices.totalValue.netValue
  } else {
    return product.price.tax.prices.totalValue.grossValue
  }
}
