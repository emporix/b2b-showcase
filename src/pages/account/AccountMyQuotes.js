import React, {
  useCallback,
  useEffect,
} from 'react'
import AccountLayout from './AccountLayout'
import { QuotesList } from './QuotesList'
import { useQuotes } from '../../context/quotes-context'
import { fetchQuotes } from 'services/quotes'
import { useAuth } from 'context/auth-provider'

const AccountMyOrders = () => {
  const { quotes, setQuotes } = useQuotes()
  const { userTenant } = useAuth()
  const syncQuotes = useCallback(async () => {
    const fetchedQuotes = await fetchQuotes(userTenant)
    setQuotes(fetchedQuotes)
  }, [userTenant])

  useEffect(() => {
    syncQuotes()
  }, [])

  return (
    <AccountLayout page="All Quotes">
      <QuotesList data={quotes} />
    </AccountLayout>
  )
}

export default AccountMyOrders
