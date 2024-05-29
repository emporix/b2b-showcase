import React from 'react'
import { Outlet } from 'react-router-dom'

import './account.css'

const AccountPage = () => {
  return (
    <div className="page-wrapper">
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AccountPage
