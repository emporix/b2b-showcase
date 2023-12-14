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
  registrationId,
  phoneNumber,
  currency
) => {
  let response
  const anonymousToken = localStorage.getItem(ANONYMOUS_TOKEN)
  let headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + anonymousToken,
  }
  const siteCode = localStorage.getItem('siteCode')
  const currentLanguage = localStorage.getItem('current-language')
  const b2bValue = registrationId
    ? { companyRegistrationId: registrationId }
    : null
  const payload = {
    email: email,
    password: password,
    customerDetails: {
      firstName: firstName,
      lastName: lastName,
      contactPhone: phoneNumber,
      company: company,
      b2b: b2bValue,
      contactEmail: email,
      preferredCurrency: currency.code,
      preferredSite: siteCode,
      preferredLanguage: currentLanguage
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
  return loginBasedOnCustomerToken(data, userTenant)
}

export const loginBasedOnCustomerToken = async (data, userTenant) => {
  let responseData = null
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

    setScopes(userTenant, customerAccesstoken)

    if (me) {
      responseData = me
    }
  }


  let userdata = {
    ...responseData,
    userTenant: userTenant,
    username: responseData.firstName + ' ' + responseData.lastName,
  }
  try {
    const anonCart = await CartService.getAnnonymousCart()
    // save anonymous cart to merge
    localStorage.setItem('anonymousCart', JSON.stringify(anonCart))
  } catch (ex) {}

  localStorage.setItem('user', JSON.stringify(userdata))
  return responseData
}

export const refreshCustomerData = async (userTenant) => {
  const { data: me } = await axios.get(
    API_URL + `/customer/${userTenant}/me?expand=addresses,mixin:*`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem(CUSTOMER_TOKEN)
      },
    }
  )
  let userdata = {
    ...me,
    userTenant: userTenant,
    username: me.firstName + ' ' + me.lastName,
  }
  localStorage.setItem('user', JSON.stringify(userdata)) 
}

const setScopes = async (tenant, customerAccessToken) => {
  const { data: scopeResponse } = await axios.get(
    API_URL + `/iam/${tenant}/users/me/scopes`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + customerAccessToken,
      },
    }
  )
  localStorage.setItem('scopes', scopeResponse.scopes.split(' '))
}
