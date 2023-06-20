export function buildValidationsValidateStackableParamsForVoucherify(
  coupons,
  cart,
  items,
  orderId,
  status
) {
  return {
    // options?: StackableOptions;
    redeemables: coupons.map((code) => {
      return {
        object: code.type ? code.type : 'voucher',
        id: code.code,
      }
    }),
    session: {
      type: 'LOCK',
      ...(cart.sessionKey && { key: cart.sessionKey }),
    },
    order: {
      source_id: orderId || cart.id,
      customer: cart.customer,
      amount: items.reduce((acc, item) => acc + item.amount, 0),
      discount_amount: 0,
      items,
      status,
    },
    customer: cart.customer,
  }
}
