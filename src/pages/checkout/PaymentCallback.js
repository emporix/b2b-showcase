import React from 'react'
import CheckoutPage from './CheckoutPage'
import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { AddressProvider } from './AddressProvider'
import { useAuth } from 'context/auth-provider'
import { PaymentProvider } from './PaymentProvider'
import { Container, GridLayout } from 'components/Utilities/common'

const PaymentCallback = () => {
  const title = `Payment`
  const { isLoggedIn, tenant } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate(loginUrl())
    }
  }, [isLoggedIn])
  return (
    <Layout title={title}>
      <div className="brand-page-wrapper text-center w-full" style={{marginTop: 50+'px'}}>
        <div className="font-inter">
          <div className="border-b pb-12">
            <div className="md:flex justify-between">
              <div className="font-semibold text-[24px] px-6 py-0 w-full">
                Thank you for the payment. We're processing the request. 
              </div>
            </div>
            <div>
                <button className="bg-primaryBlue text-[white] px-6 py-0 h-[50px] text-[14px] leading-[14px] md:w-[400px] w-full" 
                onClick={() => {
                  navigate(`/${tenant}/my-account/my-orders`)
                }}>
                  CHECK YOUR ORDERS
                </button>
              </div>
          </div>
        </div> 
      </div>
    </Layout>
  )
}
export default PaymentCallback
