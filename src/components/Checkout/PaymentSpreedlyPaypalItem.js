import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2 } from '../Utilities/typography'
import { usePayment } from 'pages/checkout/PaymentProvider'
import axios from 'axios'


const PaymentSpreedlyPaypalItem = ({ radioKey, cart, paymentMode }) => {
  const { radioActive } = useContext(RadioContext)
  
  const { setPayment, payment } = usePayment()
  
  useEffect(() => {
    if(radioActive === radioKey) {
      generateToken()
    }
  }, [radioActive])

  const generateToken = () => {
    window.console.log("MODE", paymentMode)
    var formData = new FormData();
    formData.append("redirect_url", window.location.href)
    formData.append("environment_key", paymentMode.environmentKey)
    formData.append("payment_method_type", "paypal")
    
    axios({
      method: "post",
      url: "https://core.spreedly.com/v1/payment_methods.json",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        storeToken(response)
      })
      .catch(function (response) {
        storeToken(response)
      });
  }

  const storeToken = (response) => {
    const url = new URL(response.request.responseURL)
    const token = url.searchParams.get("token")
    window.console.log("TOKEN", token)
    setPayment({
      provider: 'payment-gateway',
      mode: "offsite",
      method: 'paypal',
      displayName: 'Paypal',  
      customAttributes:  {
        token : token,
        modeId : paymentMode.id,
        customer : cart.customerId
      }
    })
  }

  return (
    <div
      className={
        'payment-method-item-wrapper ' +
        (radioActive === radioKey ? 'active' : '')
      }
    >
      <GridLayout className="gap-4">
        <Container className="gap-4 items-center">
          <RadioItem radioKey={radioKey} />
          <div className="brand-blue">
            <TextBold2>Paypal (Test offsite payment)</TextBold2>
          </div>
        </Container>
      </GridLayout>
    </div>
  )
}
export default PaymentSpreedlyPaypalItem
