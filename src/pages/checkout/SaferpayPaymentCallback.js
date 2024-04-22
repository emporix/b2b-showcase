import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authorizePayment, initializePayment, loginUrl } from 'services/service.config'
import { useAuth } from 'context/auth-provider'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { api } from 'services/axios'

const SaferpayPaymentCallback = () => {
  const title = `Payment`
  const { isLoggedIn, tenant } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [authorizationFinished, setAuthorizationFinished ] = useState(false)
  const [authorizationSuccess, setAuthorizationSuccess ] = useState(false)

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate(loginUrl())
    }
  }, [isLoggedIn])

  const authorize = async (orderId, paymentModeId) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    const body = {
      order : {
        id : orderId
      },
      paymentModeId: paymentModeId
    }
    try {
      const res = await api.post(`${authorizePayment()}`, body, { headers })
      setAuthorizationFinished(true)
      setAuthorizationSuccess(res.data.successful)
    } catch(ex) {
      setAuthorizationFinished(true)
      setAuthorizationSuccess(false)
    }
  }

  useEffect(() => {
      const orderId = searchParams.get('orderId')
      const paymentModeId = searchParams.get('paymentModeId')
      authorize(orderId, paymentModeId)
  },[])

  return (
    <Layout title={title}>
      <div className="brand-page-wrapper text-center w-full" style={{marginTop: 50+'px'}}>
        <div className="font-inter">
          <div className="border-b pb-12">
            <div className="md:flex justify-between">
              <div className="font-semibold text-[24px] px-6 py-0 w-full">
                 {!authorizationFinished ? 
                  (
                    <>We're authorizing the request...</>
                  ) : 
                  (
                    <>
                      {authorizationSuccess ? (
                        <>
                          Authorization finished with success <br/>
                          <button className="bg-primaryBlue text-[white] px-6 py-0 h-[50px] text-[14px] leading-[14px] md:w-[400px] w-full" 
                          onClick={() => {
                            navigate(`/${tenant}/my-account/my-orders`)
                          }}>
                            CHECK YOUR ORDERS
                          </button>
           
                        </>
                      ) : (<>Authorization failed</>)} 
                    </>
                  ) 
                 }
                </div>          
              </div>
            </div>
            <div>
          </div>
        </div> 
      </div>
    </Layout>
  )
}
export default SaferpayPaymentCallback
