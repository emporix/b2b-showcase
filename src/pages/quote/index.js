import React, { useEffect } from 'react'
import Layout from '../Layout'
import { userSelector } from 'redux/slices/authReducer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import QuotePage from './QuotePage'

const QuoteCart = () => {
  const currentUser = useSelector(userSelector)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) return
    navigate(loginUrl())
  })

  return (
    <Layout title="My Request Cart">
      <QuotePage />
    </Layout>
  )
}
export default QuoteCart
