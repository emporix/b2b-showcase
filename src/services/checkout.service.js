import ApiRequest from './index'
import { ACCESS_TOKEN, SAAS_TOKEN, USER } from 'constants/localstorage'
import { triggerCheckoutApi } from 'services/service.config'

const CheckoutService = () => {
  const triggerCheckout = async (cartId, addresses) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const saasToken = localStorage.getItem(SAAS_TOKEN)
    const user = JSON.parse(localStorage.getItem(USER))

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'saas-token': saasToken,
    }
    const params = {
      siteCode: localStorage.getItem('siteCode'),
    }
    const payload = {
      cartId: cartId,
      paymentMethods: [
        {
          provider: 'stripe',
          customAttributes: {
            paymentType: 'paymentByInvoice',
          },
          method: 'invoice',
        },
      ],
      currency: 'EUR',
      addresses: addresses,
      customer: {
        ...user,
        email: user.contactEmail,
      },
    }
    const { data } = await ApiRequest(
      triggerCheckoutApi(),
      'post',
      payload,
      headers,
      params
    )
    return data
  }
  return {
    triggerCheckout,
  }
}

export default CheckoutService()
