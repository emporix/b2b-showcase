import React from 'react'
import AccountLayout from './AccountLayout'
import { QuotesList } from './QuotesList'
import { useQuotes } from '../../context/quotes-context'

const AccountMyOrders = () => {
  const { quotes } = useQuotes()

  return (
    <AccountLayout page="All Quotes">
      <QuotesList data={quotes} />
    </AccountLayout>
  )
}

export default AccountMyOrders
