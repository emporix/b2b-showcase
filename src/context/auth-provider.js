import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { useAlgolia } from '../services/algolia'
import InvalidTenant from '../pages/InvalidTenant'
import {
  APPLICATION_ID,
  CURRENCY_CODE,
  CUSTOMER_TOKEN,
  CUSTOMER_TOKEN_EXPIRES_IN,
  EXTERNAL_CUSTOMER_TOKEN,
  EXTERNAL_SAAS_TOKEN,
  EXTERNAL_TOKEN_EXPIRIES_IN,
  INDEX_NAME,
  SEARCH_KEY,
  TENANT,
} from 'constants/localstorage'
import { LoadingCircleProgress } from 'components/Utilities/progress'

import AccessToken from 'services/user/accessToken'
import { loginBasedOnCustomerToken } from 'services/user/auth.service'
import cartService from 'services/cart.service'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

const getUser = () => {
  return (
    localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  )
}
const getSessionId = () => {
  return localStorage.getItem('sessionId')
}

export const AuthProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(getSessionId())
  const [user, setUser] = useState(getUser())
  const [userTenant, setUserTenant] = useState(localStorage.getItem(TENANT))
  const [accessToken, setAccessToken] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { getAlgoliaSearchCredentials } = useAlgolia()
  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem(CUSTOMER_TOKEN)
    localStorage.removeItem(CUSTOMER_TOKEN_EXPIRES_IN)
  }
  
  const insertLocalStorageValue = (key, value) => {
    if(value) {
      localStorage.setItem(key, value)
    }
  }

  const syncAuth = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search)
    
    insertLocalStorageValue(EXTERNAL_CUSTOMER_TOKEN, urlParams.get('customerToken'))
    insertLocalStorageValue(EXTERNAL_TOKEN_EXPIRIES_IN, urlParams.get('customerTokenExpiresIn'))
    insertLocalStorageValue(EXTERNAL_SAAS_TOKEN, urlParams.get('saasToken'))
        
    setUser(getUser())
    setSessionId(getSessionId())
    setIsLoggedIn(!!getUser())
    if (!accessToken) {
      setIsLoading(true)
    }
    if (userTenant === '') return

    const token = await AccessToken(userTenant)
    const oldTenant = localStorage.getItem(TENANT)

    if (userTenant) {
      try {
        const { algoliaCredentials } = await getAlgoliaSearchCredentials()
        localStorage.setItem(APPLICATION_ID, algoliaCredentials.applicationId)
        localStorage.setItem(INDEX_NAME, algoliaCredentials.indexName)
        localStorage.setItem(SEARCH_KEY, algoliaCredentials.searchKey)
      } catch (error) {
        console.error(error)
      }
    }

    if (oldTenant !== userTenant) {
      setIsLoggedIn(false)
      localStorage.setItem(TENANT, userTenant)
      logout()
      localStorage.removeItem(CURRENCY_CODE)
      return
    }
    setAccessToken(token)
    setIsLoading(false)
    const externalCustomerToken = localStorage.getItem(EXTERNAL_CUSTOMER_TOKEN)
    const externalExpiresIn = localStorage.getItem(EXTERNAL_TOKEN_EXPIRIES_IN)
    const externalSaasToken = localStorage.getItem(EXTERNAL_SAAS_TOKEN)

    if(externalCustomerToken && externalExpiresIn && externalSaasToken) {
      const response = await loginBasedOnCustomerToken({
        accessToken: externalCustomerToken,
        expiresIn : externalExpiresIn,
        saasToken : externalSaasToken
      }, userTenant)
      localStorage.removeItem(EXTERNAL_CUSTOMER_TOKEN)
      localStorage.removeItem(EXTERNAL_TOKEN_EXPIRIES_IN)
      localStorage.removeItem(EXTERNAL_SAAS_TOKEN)
      localStorage.setItem('user', JSON.stringify({
        ...response,
        userTenant: userTenant,
        username: response.firstName + ' ' + response.lastName,
      }))
      syncAuth()
    }
  }, [userTenant, accessToken])

  useEffect(() => {
    syncAuth()
  }, [])
  if (!userTenant) return <InvalidTenant />
  if (!accessToken) return <LoadingCircleProgress />
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userTenant,
        setUserTenant,
        syncAuth,
        isLoggedIn,
        setIsLoggedIn,
        user,
        sessionId,
        logout,
      }}
    >
      {isLoading ? <LoadingCircleProgress /> : children}
    </AuthContext.Provider>
  )
}
