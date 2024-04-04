import axios from 'axios'
import ApiRequest from '..'
import {
  ANONYMOUS_TOKEN,
  CUSTOMER_TOKEN_EXPIRES_IN,
  CUSTOMER_TOKEN,
  SAAS_TOKEN,
} from 'constants/localstorage'

const API_URL = process.env.REACT_APP_API_URL

const register = async (
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

  return response
}

const login = async (username, password, userTenant) => {
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
      API_URL + `/customer/${userTenant}/me?expand=addresses`,
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

  return responseData
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem(CUSTOMER_TOKEN)
  localStorage.removeItem(CUSTOMER_TOKEN_EXPIRES_IN)
}
const auth_services = {
  register,
  login,
  logout,
}
export default auth_services
