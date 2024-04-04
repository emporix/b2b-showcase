import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useAlgolia } from '../services/algolia'
import InvalidTenant from '../pages/InvalidTenant'
import {
  APPLICATION_ID,
  CURRENCY_CODE,
  INDEX_NAME,
  SEARCH_KEY,
  TENANT,
} from 'constants/localstorage'
import { LoadingCircleProgress } from 'components/Utilities/progress'

import { logout } from '../redux/slices/authReducer'

import AccessToken from 'services/user/accessToken'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [userTenant, setUserTenant] = useState(localStorage.getItem(TENANT))
  const [accessToken, setAccessToken] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const { getAlgoliaSearchCredentials } = useAlgolia()

  const syncAuth = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(true)
    }
    if (userTenant === '') return
    const token = await AccessToken(userTenant)
    const oldTenant = localStorage.getItem(TENANT)

    const { algoliaCredentials } = await getAlgoliaSearchCredentials()
    localStorage.setItem(APPLICATION_ID, algoliaCredentials.applicationId)
    localStorage.setItem(INDEX_NAME, algoliaCredentials.indexName)
    localStorage.setItem(SEARCH_KEY, algoliaCredentials.searchKey)

    if (oldTenant !== userTenant) {
      localStorage.setItem(TENANT, userTenant)
      dispatch(logout())
      localStorage.removeItem(CURRENCY_CODE)
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
      value={{ accessToken, userTenant, setUserTenant, syncAuth, isLoggedIn }}
    >
      {isLoading ? <LoadingCircleProgress /> : children}
    </AuthContext.Provider>
  )
}
