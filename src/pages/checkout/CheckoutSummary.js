import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './checkout.css'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { homeUrl, myAccountMyOrders } from '../../services/service.config'
import { LargePrimaryButton } from '../../components/Utilities/button'
import { useAuth } from 'context/auth-provider'
import { usePayment } from './PaymentProvider'

const CheckoutSummary = ({ setFinal, order }) => {
  const { user } = useAuth()
  const { setPayment, payment } = usePayment()
  const [challenge, setChallenge] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate(loginUrl())
    }
  })


  useEffect(() => {
   if(payment?.paymentMode?.scaProviderToken && order?.paymentDetails?.authorizationToken) {
    var lifecycle = new window['Spreedly'].ThreeDS.Lifecycle({
      environmentKey: payment?.paymentMode?.environmentKey,
      hiddenIframeLocation: 'device-fingerprint', 
      challengeIframeLocation: 'challenge', 
      transactionToken: order?.paymentDetails?.authorizationToken,
      challengeIframeClasses: 'fitToModal'
    })
    var on3DSstatusUpdatesFn = function(threeDsStatusEvent) {
      if (threeDsStatusEvent.action === 'succeeded') {
        setChallenge(false)
    
      } else if (threeDsStatusEvent.action === 'error') {
        // present an error to the user to retry
      } else if (threeDsStatusEvent.action === 'finalization-timeout') {
        // present an error to the user to retry
      } else if (threeDsStatusEvent.action === 'challenge') {
        setChallenge(true)
        document.getElementById('challenge-modal').classList.remove('hidden');
      }
    }
    window['Spreedly'].on('3ds:status', on3DSstatusUpdatesFn)
    lifecycle.start()    
   } else {
    setChallenge(false)
   }
  }, [payment?.paymentMode?.scaProviderToken, order?.paymentDetails?.authorizationToken])


  return (
    <>
    {challenge ? 
      (<>
        <div id="device-fingerprint" className="hidden"></div>
        <div id="challenge-modal" className="hidden fitToModal">
          <div id="challenge" className=''></div>
        </div>
      </>) : 
      (
      <>
        <div className="font-inter mb-8">
            <div className="bordered-container p-6">
              <div className="md:flex justify-between">
                <div className="font-semibold text-[32px]">
      
                  {order?.paymentDetails?.externalPaymentRedirectURL ? 
                  (<>Your Order has been created but we are waiting for payment to be completed.</>) : 
                  (<>Your order has been received</>)}
                  
                </div>
                <div>
                  {order?.paymentDetails?.externalPaymentRedirectURL ? (
                      <button className="bg-primaryBlue text-[white] px-6 py-0 h-[50px] text-[14px] leading-[14px] md:w-[400px] w-full"
                      onClick={() => {
                        window.location.href = order?.paymentDetails?.externalPaymentRedirectURL
                      }}>
                        FINISH PAYMENT
                      </button>
                  ) : (
                    <button className="cta-button bg-yellow px-6 py-0 h-[50px] text-[14px] leading-[14px] md:w-[400px] w-full">
                    VIEW INVOICE
                      </button>
                  )}
                </div>
              </div>
              <div className="pt-12 text-base">
                <span className="font-bold">Thank you for your purchase!</span>
                <br />
                <span>
                  Your order number is:
                  <span className="font-bold"> #{order.orderId}</span>
                </span>
              </div>
            </div>
            <div className="pt-8 grid md:grid-cols-2 grid-cols-1">
              <div className="bordered-container p-6">
                <div className="font-semibod text-2xl">Order Status</div>
                <div className="pt-6">
                  <span>
                    You will soon receive an order confirmation e-mail with details of
                    your order and a link to track its progress.{' '}
                  </span>
                  <br />
                  <div className="pt-6">
                    <span>
                      You can check status of your order by using our delivery status
                      feature.{' '}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bordered-container p-6 ml-8">
                <div className="font-semibod text-2xl">Support</div>
                <div className="pt-6">Primary contacts for any questions</div>
                <div className="pt-6">
                  <span>Atom HQ</span> <br />
                  <span>Marsstraße 43,</span> <br />
                  <span>80335 München,</span> <br />
                  <span>Germany</span> <br />
                </div>
                <div className="pt-6">support@atom.com</div>
              </div>
            </div>
            <div className="pt-12 w-full flex gap-8 checkout-actions">
              <Link to={homeUrl()}>
                <LargePrimaryButton
                  className="md:block hidden cta-button bg-yellow"
                  title="BACK TO HOME PAGE"
                  onClick={() => setFinal(false)}
                />
              </Link>
              <Link to={myAccountMyOrders()}>
                <LargePrimaryButton
                  className="md:block hidden cta-button bg-yellow"
                  title="GO TO ORDERS"
                  onClick={() => setFinal(false)}
                />
              </Link>
            </div>
          </div>      
      </>
      )
    }
   </> 
  )
}

export default CheckoutSummary
