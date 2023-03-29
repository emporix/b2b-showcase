import React from 'react'
import AccountPage from './AccountPage'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Layout from '../Layout'
import { loginUrl } from '../../services/service.config'

const MobileAccountBar = ({ title }) => {
  return (
    <div className="mobile-bar-wrapper mobile_only">
      <div className="mobile-bar">
        <span>{title}</span>
      </div>
    </div>
  )
}
const Account = () => {
  const { user: currentUser } = useSelector((state) => state.auth)
  if (!currentUser) {
    return <Navigate to={loginUrl} />
  }
  const title = 'Welcome Back, ' + currentUser.username
  return (
    <Layout title={title}>
      <MobileAccountBar title={title} />
      <AccountPage page_info={title} />
    </Layout>
  )
}

export default Account
