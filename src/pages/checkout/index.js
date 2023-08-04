import React from 'react'
import CheckoutPage from './CheckoutPage'
import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { AddressProvider } from './AddressProvider'
import { useAuth } from 'context/auth-provider'
import { PaymentProvider } from './PaymentProvider'

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
        <PaymentProvider>
          <CheckoutPage />
        </PaymentProvider>  
      </AddressProvider>
    </Layout>
  )
}
export default Checkout
