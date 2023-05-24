import { getEmporixAPIAccessToken } from './getEmporixAPIAccessToken'

export const deleteDiscount = async (code) => {
  await fetch(`https://api.emporix.io/coupon-v2/piotr/coupons/${code}`, {
    method: 'Delete',
    headers: {
      Authorization: `Bearer ${await getEmporixAPIAccessToken()}`,
    },
  })
}

export const getProduct = async (productId) => {
  const resultRaw = await fetch(
    `https://api.emporix.io/product/piotr/products/${productId}`,
    {
      method: 'Get',
      headers: {
        Authorization: `Bearer ${await getEmporixAPIAccessToken()}`,
      },
    }
  )
  if (resultRaw.status !== 200) {
    console.log({ error: `product could not be retrieved` })
    return
  }
  return await resultRaw.json()
}

export const removeAllDiscountsFromCart = async (cartId) => {
  const resultRaw = await fetch(
    `https://api.emporix.io/cart/piotr/carts/${cartId}/discounts`,
    {
      method: 'Delete',
      headers: {
        Authorization: `Bearer ${await getEmporixAPIAccessToken()}`,
      },
    }
  )
  if (resultRaw.status !== 204) {
    console.log({ error: `coupons could not be removed from cart` })
  }
}

export const applyCouponOnCart = async (code, cartId) => {
  const resultRaw = await fetch(
    `https://api.emporix.io/cart/piotr/carts/${cartId}/discounts`,
    {
      method: 'Post',
      headers: {
        Authorization: `Bearer ${await getEmporixAPIAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        calculationType: 'ApplyDiscountAfterTax',
      }),
    }
  )
  if (resultRaw.status !== 201) {
    console.log({ error: `coupon "${code}" could not be applied` })
  }
}

export const createCoupon = async (emporixCart, applicableCoupons) => {
  const amount = applicableCoupons.reduce(
    (accumulator, currentValue) =>
      accumulator +
      (currentValue.order.total_applied_discount_amount ||
        currentValue.order.applied_discount_amount ||
        0) /
        100,
    0
  )
  if (!amount) {
    return undefined
  }
  const couponRaw = await fetch(
    `https://api.emporix.io/coupon-v2/piotr/coupons`,
    {
      method: 'Post',
      headers: {
        Authorization: `Bearer ${await getEmporixAPIAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Voucherify coupon',
        discountType: 'ABSOLUTE',
        discountAbsolute: {
          amount,
          currency: emporixCart.currency,
        },
        allowAnonymous: true,
        maxRedemptions: 1,
        categoryRestricted: false,
        issuedTo: emporixCart.customerId,
      }),
    }
  )
  return await couponRaw.json()
}

export const updateCartMetadataMixins = async (
  emporixCart,
  validationResult,
  deletedCodes,
  discountsDetails
) => {
  const { newSessionKey, applicableCoupons, availablePromotions } =
    validationResult
  const mixins = {
    ...(emporixCart.metadata?.mixins || {}),
    sessionKey: newSessionKey || emporixCart.metadata?.mixins?.sessionKey,
    appliedCoupons: applicableCoupons
      .filter((coupon) => {
        if (!deletedCodes) {
          return true
        }
        return !deletedCodes.includes(coupon.id)
      })
      .map((coupon) => {
        return {
          code: coupon.id,
          status: 'APPLIED',
          type: coupon.object,
          banner: coupon.banner,
        }
      }),
    availablePromotions,
    discountsDetails,
  }
  const emporixAccessToken = await getEmporixAPIAccessToken()
  const cartUpdate = await fetch(
    `https://api.emporix.io/cart/piotr/carts/${emporixCart.id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${emporixAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: {
          mixins,
        },
      }),
    }
  )
  if (cartUpdate.status !== 204) {
    throw {
      error: `Could not update cart with id: ${emporixCart.id}`,
    }
  }
}

export const getCart = async (cartId) => {
  const emporixAccessToken = await getEmporixAPIAccessToken()
  const cartRaw = await fetch(
    `https://api.emporix.io/cart/piotr/carts/${cartId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${emporixAccessToken}`,
      },
    }
  )
  if (cartRaw.status !== 200) {
    throw {
      error: `Could not find cart with id: ${cartId}`,
    }
  }
  return await cartRaw.json()
}
