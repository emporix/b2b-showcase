import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { usePayment } from 'pages/checkout/PaymentProvider'
import { TextBold2 } from 'components/Utilities/typography'


const PaymentUnzerItem = ({ radioKey, props, paymentMode }) => {
  const { radioActive } = useContext(RadioContext)
  
  const { setPayment, payment } = usePayment()
  

  useEffect(() => {
    if(radioActive === radioKey) {
      const currentPayment =  {
          provider: 'payment-gateway',
          method: 'unzer',    
          displayName: 'Unzer'  
      }
      currentPayment.paymentMode = paymentMode
      currentPayment.customAttributes = {
          modeId : paymentMode.id,
          customer : props.customerId
      }
      setPayment(currentPayment)
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
            <TextBold2>Unzer</TextBold2>
          </div>
        </Container>
      </GridLayout>
    </div>
  )
}
export default PaymentUnzerItem
