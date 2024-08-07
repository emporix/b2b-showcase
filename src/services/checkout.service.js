import ApiRequest from './index'
import { ACCESS_TOKEN, SAAS_TOKEN, USER } from 'constants/localstorage'
import { triggerCheckoutApi } from 'services/service.config'

const CheckoutService = () => {
  const triggerCheckout = async (cartId, addresses, shipping, paymentMethods) => {
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
      paymentMethods : paymentMethods,
      currency: 'EUR',
      addresses: addresses,
      shipping: shipping,
      customer: getCustomerForCheckout(user, addresses),
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

  const getCustomerForCheckout = (user, addresses) => {
    if (user) {
      return {
        ...user,
        email: user.contactEmail,
      }
    } else {
      const customerData = addresses.find(
        (address) => address.type === 'SHIPPING'
      )
      return {
        email: customerData.contactEmail,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        guest: true,
      }
    }
  }

  const triggerCheckoutAsApprover = async (cartId, addresses, shipping, paymentMethods, requestorCustomer) => {
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
      paymentMethods : paymentMethods,
      currency: 'EUR',
      addresses: addresses,
      shipping: shipping,
      customer: {
        ...requestorCustomer,
        id: requestorCustomer.userId,
        company: user.company,
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
    triggerCheckoutAsApprover,
  }
}

export default CheckoutService()
