import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2, TextRegular2 } from '../Utilities/typography'
import { usePayment } from 'pages/checkout/PaymentProvider'


const PaymentSpreedlyDeferredItem = ({ radioKey, props, paymentMode }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)

  const { setPayment, payment, setDeferredPayment } = usePayment()
  

  useEffect(() => {
    if(radioActive === radioKey) {
      setPayment({
            provider: 'payment-gateway',
            displayName: 'Deferred',    
            customAttributes : {
              customer : props.customerId,
              deferred: true
            }  
      })
      setDeferredPayment(true)
    }
  }, [radioActive])

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
            <TextBold2>Deferred payment flow</TextBold2>
          </div>
        </Container>
      </GridLayout>
    </div>
  )
}
export default PaymentSpreedlyDeferredItem
