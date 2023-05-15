import {
  ANONYMOUS_TOKEN,
  ANONYMOUS_TOKEN_EXPIRES_IN,
  CUSTOMER_TOKEN_EXPIRES_IN,
  CUSTOMER_TOKEN,
  TENANT,
  ACCESS_TOKEN,
  SESSION_ID,
  CLIENT_ID,
} from '../../constants/localstorage'

import { anonymousTokenApi } from '../service.config'
import ApiRequest from '..'

const AccessToken = async (tenant) => {
  let now = Date.now()
  let oldTenant = localStorage.getItem(TENANT)
  if (tenant === oldTenant) {
    // about customer token
    const customerTokenExpiresIn = localStorage.getItem(
      CUSTOMER_TOKEN_EXPIRES_IN
    )
    // if customer token is not expired yet, get it from localstorage.
    if (
      customerTokenExpiresIn !== undefined &&
      now < parseInt(customerTokenExpiresIn)
    ) {
      localStorage.setItem(ACCESS_TOKEN, localStorage.getItem(CUSTOMER_TOKEN))
      return localStorage.getItem(CUSTOMER_TOKEN)
    }

    // about anonymous token
    const anonymousTokenExpiresIn = localStorage.getItem(
      ANONYMOUS_TOKEN_EXPIRES_IN
    )
    // if customer token is not expired yet, get it from localstorage.
    if (
      anonymousTokenExpiresIn !== undefined &&
      now < parseInt(anonymousTokenExpiresIn)
    ) {
      localStorage.setItem(ACCESS_TOKEN, localStorage.getItem(ANONYMOUS_TOKEN))
      return localStorage.getItem(ANONYMOUS_TOKEN)
    }
  }

  const params = {
    client_id: localStorage.getItem(CLIENT_ID),
    'hybris-tenant': tenant,
  }
 if (params.client_id !== null) {
   try {
     const res = await ApiRequest(anonymousTokenApi(), 'get', {}, {}, params)
     localStorage.setItem(ANONYMOUS_TOKEN, res['data']['access_token'])
     localStorage.setItem(
         ANONYMOUS_TOKEN_EXPIRES_IN,
         now + res['data']['expires_in'] * 1000
     )
     localStorage.setItem(SESSION_ID, res.data.sessionId)
     localStorage.setItem(ACCESS_TOKEN, res['data']['access_token'])
     return res['data']['access_token']
   } catch (error) {
     console.error(error)
     localStorage.removeItem(CLIENT_ID)
     localStorage.removeItem(TENANT)
     window.location.replace(`/`)
     return ''
   }
 }
}
export default AccessToken
