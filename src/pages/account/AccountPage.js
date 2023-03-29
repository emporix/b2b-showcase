import React, { useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

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
