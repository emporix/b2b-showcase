import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAuth } from './auth-provider'
import { fetchQuotes } from '../services/quotes'
const QuoteContext = createContext()

export const useQuotes = () => useContext(QuoteContext)

export const QuotesProvider = ({ children }) => {
  const { userTenant, isLoggedIn } = useAuth()
  const [quotes, setQuotes] = useState([])

  const quotesTotal = useMemo(() => {
    return quotes.filter((quote) => quote.status.value === 'OPEN').length
  }, [quotes])

  useEffect(() => {
    const syncQuotes = async () => {
      const fetchedQuotes = await fetchQuotes(userTenant)
      setQuotes(fetchedQuotes)
    }

    if (isLoggedIn) {
      syncQuotes()
    }
  }, [isLoggedIn, userTenant])

  return <QuoteContext.Provider value={{ quotes, quotesTotal, setQuotes }}>{children}</QuoteContext.Provider>
}
