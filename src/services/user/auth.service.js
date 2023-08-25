import axios from 'axios'
import ApiRequest from '..'
import {
  ANONYMOUS_TOKEN,
  CUSTOMER_TOKEN_EXPIRES_IN,
  CUSTOMER_TOKEN,
  SAAS_TOKEN,
} from 'constants/localstorage'
import CartService from '../cart.service'

const API_URL = process.env.REACT_APP_API_URL

export const register = async (
  email,
  password,
  firstName,
  lastName,
  tenantName,
  company,
  phoneNumber
) => {
  let response
  const anonymousToken = localStorage.getItem(ANONYMOUS_TOKEN)
  let headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + anonymousToken,
  }
  const payload = {
    email: email,
    password: password,
    customerDetails: {
      firstName: firstName,
      lastName: lastName,
      contactPhone: phoneNumber,
      company: company,
      contactEmail: email,
      preferredCurrency: 'EUR',
    },
    signup: {
      email: email,
      password: password,
    },
  }
  const signupApi = `${API_URL}/customer/${tenantName}/signup`
  response = await ApiRequest(signupApi, 'post', payload, headers)
  if (response.status === 201) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}

export const login = async (username, password, userTenant) => {
  let responseData = null
  const anonymousToken = localStorage.getItem(ANONYMOUS_TOKEN)
  const { data } = await axios.post(
    API_URL + `/customer/${userTenant}/login`,
    {
      email: username,
      password: password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + anonymousToken,
      },
    }
  )

  if (data.accessToken) {
    let now = Date.now()
    localStorage.setItem(
      'customer_accesstoken',
      JSON.stringify(data.accessToken)
    )
    localStorage.setItem(CUSTOMER_TOKEN, data.accessToken)
    localStorage.setItem(SAAS_TOKEN, data.saasToken)
    localStorage.setItem(CUSTOMER_TOKEN_EXPIRES_IN, now + data.expiresIn * 1000)

    let customerAccesstoken = data.accessToken

    const { data: me } = await axios.get(
      API_URL + `/customer/${userTenant}/me?expand=addresses,mixin:*`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + customerAccesstoken,
        },
      }
    )

    if (me.firstName) {
      responseData = me
    }
  }

  let userdata = {
    ...responseData,
    userTenant: userTenant,
    username: responseData.firstName + ' ' + responseData.lastName,
  }
  const anonCart = await CartService.getAnnonymousCart()
  // save anonymous cart to merge
  localStorage.setItem('anonymousCart', JSON.stringify(anonCart))
  localStorage.setItem('user', JSON.stringify(userdata))
  return responseData
}
