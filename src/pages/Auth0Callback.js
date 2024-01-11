import { ANONYMOUS_TOKEN } from 'constants/localstorage'
import { useAuth } from 'context/auth-provider'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from 'services/axios'
import { auth0TokenExchange } from 'services/service.config'
import { SAAS_TOKEN, CUSTOMER_TOKEN, CUSTOMER_TOKEN_EXPIRES_IN, TENANT, ACCESS_TOKEN } from 'constants/localstorage'

import Layout from './Layout'
import { loginBasedOnCustomerToken } from 'services/user/auth.service'

const Auth0Callback = () => {
  const title = `Social Login Authorization`
  const [searchParams] = useSearchParams();
  const { syncAuth } = useAuth()

  const insertLocalStorageValue = (key, value) => {
    if(value) {
      localStorage.setItem(key, value)
    }
  }
  
  const authorize = async (authorizationCode) => {
    const accessToken = localStorage.getItem(ANONYMOUS_TOKEN)
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    const params = {
      code : authorizationCode,
      anonymous_token: accessToken
    }
    try {
      const res = await api.post(`${auth0TokenExchange()}`, null, { headers, params })
      const tenant = localStorage.getItem(TENANT)
      insertLocalStorageValue(ANONYMOUS_TOKEN, res.data['access_token'])
      insertLocalStorageValue(ACCESS_TOKEN, res.data['access_token'])
      insertLocalStorageValue(CUSTOMER_TOKEN, res.data['access_token'])
      insertLocalStorageValue(CUSTOMER_TOKEN_EXPIRES_IN, res.data['expired_in'])
      insertLocalStorageValue(SAAS_TOKEN, res.data['saas_token'])
      await loginBasedOnCustomerToken({
        accessToken: res.data['access_token'],
        expiresIn : res.data['expired_in'],
        saasToken : res.data['saas_token']
      }, tenant)
      window.location.replace(`/${tenant}`)
    } catch(ex) {
     window.console.log('ex', ex)
    }
  }

  useEffect(() => {
      const authorizationCode = searchParams.get('code')
      authorize(authorizationCode)
  },[])

  return (
    <Layout title={title}>
      <div className="brand-page-wrapper text-center w-full" style={{marginTop: 50+'px'}}>
        <div className="font-inter">
          <div className="border-b pb-12">
            <div className="md:flex justify-between">
              <div className="font-semibold text-[24px] px-6 py-0 w-full">
                  <>We're authorizing the request...</>
                </div>          
              </div>
            </div>
            <div>
          </div>
        </div> 
      </div>
    </Layout>
  )
}
export default Auth0Callback
