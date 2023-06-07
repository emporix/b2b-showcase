import { getOrder } from '../emporix/emporixApi'
import { mapEmporixItemsToVoucherifyProducts } from '../buildIntegrationCartFromEmporixCart'
import { buildIntegrationOrderFromEmporixOrder } from './buildIntegrationOrderFromEmporixOrder'
import { createOrder, redeemStackableVouchers } from './voucherifyApi'

export function buildRedeemStackableParamsForVoucherify(coupons, cart, items) {
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
      customer: cart.customer,
      amount: items.reduce((acc, item) => acc + item.amount, 0),
      discount_amount: 0,
      items,
    },
    customer: cart.customer,
  }
}

export const redeemCart = async ({
  emporixOrderId,
  customer,
  customerAdditionalMetadata,
}) => {
  if (!emporixOrderId) {
    return
  }
  const emporixOrder = await getOrder(emporixOrderId)
  console.log(emporixOrder)
  const order = buildIntegrationOrderFromEmporixOrder({
    emporixOrder,
    customer,
    customerAdditionalMetadata,
  })
  const request = buildRedeemStackableParamsForVoucherify(
    order.coupons,
    order,
    order.items
  )
  console.log(await redeemStackableVouchers(request))
}
