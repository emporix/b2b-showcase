import React from 'react'
import AccountLayout from './AccountLayout'
import { ReturnsList } from './ReturnsList'
import { useReturns } from 'context/returns-provider'

const AccountReturns = () => {
  const { returns } = useReturns()
  return (
    <AccountLayout page="All Returns">
      <ReturnsList data={returns} invoiceAvailable={true} />
    </AccountLayout>
  )
}

export default AccountReturns
