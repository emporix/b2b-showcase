import React, { useEffect, useMemo } from 'react'
import AccountPage from './AccountPage'
import { useNavigate } from 'react-router-dom'
import Layout from '../Layout'
import { useAuth } from 'context/auth-provider'

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
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/{tenant}', { replace: true })
    }
  }, [isLoggedIn])
  const title = useMemo(() => {
    return 'Welcome Back, ' + user?.username
  }, [user?.username])
  return (
    <Layout title={title}>
      <MobileAccountBar title={title} />
      <AccountPage page_info={title} />
    </Layout>
  )
}

export default Account
