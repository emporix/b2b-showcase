import React from 'react'
import CheckoutPage from './CheckoutPage'
import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { AddressProvider } from './AddressProvider'
import { useAuth } from 'context/auth-provider'

const Checkout = () => {
  const title = `Checkout`
  const { isLoggedIn } = useAuth()

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate(loginUrl())
    }
  }, [isLoggedIn])
  return (
    <Layout title={title}>
      <AddressProvider>
        <CheckoutPage />
      </AddressProvider>
    </Layout>
  )
}
export default Checkout
