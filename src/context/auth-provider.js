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
  INDEX_NAME,
  SEARCH_KEY,
  TENANT,
} from 'constants/localstorage'
import { LoadingCircleProgress } from 'components/Utilities/progress'

import AccessToken from 'services/user/accessToken'

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
  const syncAuth = useCallback(async () => {
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
      const { algoliaCredentials } = await getAlgoliaSearchCredentials()
      localStorage.setItem(APPLICATION_ID, algoliaCredentials.applicationId)
      localStorage.setItem(INDEX_NAME, algoliaCredentials.indexName)
      localStorage.setItem(SEARCH_KEY, algoliaCredentials.searchKey)
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
