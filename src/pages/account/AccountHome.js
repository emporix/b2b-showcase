import { MyAccountContent } from './MyAccount'
import React from 'react'
import AccountLayout from './AccountLayout'

const AccountHome = () => {
  return (
    <AccountLayout page="Index">
      {' '}
      <MyAccountContent />{' '}
    </AccountLayout>
  )
}

export default AccountHome
