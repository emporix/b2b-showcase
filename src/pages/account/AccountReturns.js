import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { fetchReturns } from '../../services/returns'
import { ReturnsList } from './ReturnsList'

const AccountReturns = () => {
  const [returns, setReturns] = useState([])

  const getReturns = useCallback(async () => {
    const fetchedReturns = await fetchReturns()
    setReturns(fetchedReturns)
  }, [])

  useEffect(() => {
    getReturns()
  }, [])

  return (
    <AccountLayout page="All Returns">
      <ReturnsList data={returns} invoiceAvailable={true} />
    </AccountLayout>
  )
}

export default AccountReturns
