export const getDiscountsValues = (applicableCoupons, items) => {
  const discounts = getDiscounts(applicableCoupons)
  return applyDiscount(discounts, items)
}

const getDiscounts = (applicableCoupons) => {
  if (applicableCoupons.length === 0) return []

  const discounts = []

  applicableCoupons.forEach((coupon) => {
    if (
      !coupon.result.discount?.effect ||
      coupon.result.discount.effect === 'APPLY_TO_ORDER'
    ) {
      discounts.push({
        target: true,
        centAmount:
          coupon?.order?.total_applied_discount_amount ||
          coupon.order?.applied_discount_amount ||
          0,
      })
      return
    }

    coupon.order.items.forEach((item) => {
      if (item.product_id === 'prod_5h1pp1ng') {
        return
      }

      if (item?.applied_discount_amount) {
        discounts.push({
          target: item?.product?.source_id || true,
          centAmount: item.applied_discount_amount,
        })
      }
    })
  })

  return discounts.sort((discount1, discount2) => {
    if (discount1?.target?.predicate === 'true') return 1
    if (discount2?.target?.predicate === 'true') return -1
    return -1
  })
}

const applyDiscount = (discounts, items) => {
  const products = items.map((item) => {
    return { ...item, discount: 0 }
  })
  discounts.forEach((coupon) => {
    let centAmount = coupon.centAmount || 0
    let productIndex
    if (coupon.target !== true) {
      products.map((product, index) => {
        if (product.source_id === coupon.target) {
          productIndex = index
        }
      })
    }
    if (productIndex) {
      const maxAllowedDiscount =
        products[productIndex].amount - products[productIndex].discount
      if (centAmount >= maxAllowedDiscount) {
        products[productIndex].discount = products[productIndex].amount
      } else {
        products[productIndex].discount = products[productIndex].discount +=
          centAmount
      }
    } else {
      while (centAmount) {
        const centAmountStart = centAmount
        const thisRound = Math.floor(centAmount / products.length)
        if (thisRound < products.length) {
          products.forEach((product, index) => {
            const maxAllowedDiscount =
              products[index].amount - products[index].discount
            if (centAmount && maxAllowedDiscount) {
              products[index].discount += 1
              centAmount -= 1
            }
          })
        } else {
          products.forEach((product, index) => {
            const maxAllowedDiscount =
              products[index].amount - products[index].discount
            if (thisRound >= maxAllowedDiscount) {
              products[index].discount = products[index].amount
              centAmount -= maxAllowedDiscount
            } else {
              products[index].discount = products[index].discount += thisRound
              centAmount -= thisRound
            }
          })
        }
        if (centAmount === centAmountStart) {
          break
        }
      }
    }
  })

  return products
}
