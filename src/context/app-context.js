import { LoadingCircleProgress } from 'components/Utilities/progress'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { fetchContext, patchContext } from '../services/context'
import { useAuth } from './auth-provider'

const AppContext = createContext({})

export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({ children }) => {
  const { userTenant, accessToken } = useAuth()
  const [context, setContext] = useState()
  const syncContext = useCallback(async () => {
    if (!accessToken) return
    const { data: context } = await fetchContext(userTenant)
    setContext(context)
  }, [userTenant, accessToken])
  const updateContext = useCallback(
    async (newContextValues) => {
      await patchContext(userTenant, { ...context, ...newContextValues })
      await syncContext()
    },
    [userTenant, context, syncContext]
  )
  useEffect(() => {
    syncContext()
  }, [accessToken, userTenant])

  if (!context) {
    return <LoadingCircleProgress />
  }
  return (
    <AppContext.Provider value={{ context, updateContext }}>
      {children}
    </AppContext.Provider>
  )
}
