import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2, TextRegular2 } from '../Utilities/typography'
import { usePayment } from 'pages/checkout/PaymentProvider'


const PaymentSpreedlyCashOnDeliveryItem = ({ radioKey, props, paymentMode }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)

  const { setPayment, payment } = usePayment()
  

  useEffect(() => {
    if(radioActive === radioKey) {
      setPayment({
            provider: 'payment-gateway',
            method: 'cash_on_delivery',  
            displayName: 'Cash on delivery',    
            customAttributes : {
              modeId : paymentMode.id,
              customer : props.customerId
            }  
      })
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
            <TextBold2>Cash on delivery</TextBold2>
          </div>
        </Container>
      </GridLayout>
    </div>
  )
}
export default PaymentSpreedlyCashOnDeliveryItem
