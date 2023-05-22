import React, { useEffect } from 'react'
import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import QuotePage from './QuotePage'
import { useAuth } from 'context/auth-provider'

const QuoteCart = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) return
    navigate(loginUrl())
  }, [isLoggedIn])

  return (
    <Layout title="My Request Cart">
      <QuotePage />
    </Layout>
  )
}
export default QuoteCart
