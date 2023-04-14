import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'

import { fetchReturns } from '../services/returns'
const ReturnsContext = createContext({})

export const useReturns = () => useContext(ReturnsContext)

const ReturnsProvider = ({ children }) => {
  const [returns, setReturns] = useState([])

  const syncReturns = useCallback(async () => {
    const fetchedReturns = await fetchReturns()
    setReturns(fetchedReturns)
  }, [])

  useEffect(() => {
    syncReturns()
  }, [])

  return (
    <ReturnsContext.Provider
      value={{
        returns,
        syncReturns,
      }}
    >
      {children}
    </ReturnsContext.Provider>
  )
}

export default ReturnsProvider
