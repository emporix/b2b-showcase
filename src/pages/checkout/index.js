import React from 'react'
import CheckoutPage from './CheckoutPage'
import Layout from '../Layout'
import { userSelector } from 'redux/slices/authReducer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { AddressProvider } from './AddressProvider'

const Checkout = () => {
  const title = `Checkout`
  const currentUser = useSelector(userSelector)

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!currentUser) {
      navigate(loginUrl())
    }
  })
  return (
    <Layout title={title}>
      <AddressProvider>
        <CheckoutPage />
      </AddressProvider>
    </Layout>
  )
}
export default Checkout
