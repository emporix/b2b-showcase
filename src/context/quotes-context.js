import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { useAuth } from './auth-provider'
import { fetchQuotes } from '../services/quotes'
const QuoteContext = createContext()

export const useQuotes = () => useContext(QuoteContext)

export const QuotesProvider = ({ children }) => {
  const { userTenant, isLoggedIn } = useAuth()
  const [quotes, setQuotes] = useState([])
  const syncQuotes = useCallback(async () => {
    const fetchedQuotes = await fetchQuotes(userTenant)
    setQuotes(fetchedQuotes)
  }, [userTenant])

  const quotesTotal = useMemo(() => {
    return quotes.filter((quote) => quote.status === 'OPEN').length
  }, [quotes])

  useEffect(() => {
    if (isLoggedIn) {
      syncQuotes()
    }
  }, [isLoggedIn])
  return (
    <QuoteContext.Provider value={{ quotes, quotesTotal }}>
      {children}
    </QuoteContext.Provider>
  )
}
