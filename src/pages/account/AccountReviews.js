import React, { useState } from 'react'
import AccountLayout from './AccountLayout'

const Reviews = () => {
  return <h1>Reviews</h1>
}

const AccountReviews = () => {
  return (
    <AccountLayout page="Reviews">
      {' '}
      <Reviews />
    </AccountLayout>
  )
}

export default AccountReviews
