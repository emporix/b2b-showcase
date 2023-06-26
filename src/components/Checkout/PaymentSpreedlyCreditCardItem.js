import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2 } from '../Utilities/typography'
import { usePayment } from 'pages/checkout/PaymentProvider'
import { fetchPaymentGatewayModes } from 'services/service.config'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { api } from 'services/axios'


const PaymentSpreedlyCreditCardItem = ({ radioKey, cart, paymentMode }) => {
  const { radioActive } = useContext(RadioContext)
  
  const { setPayment, payment } = usePayment()
  

  useEffect(() => {
    window['SpreedlyExpress'].init(paymentMode.environmentKey, {
      "amount": cart.subtotalAggregate.grossValue + ' ' + cart.subtotalAggregate.currency,
      "company_name": "PowerZone",
      "sidebar_bottom_description": "Total Price",
    }, {
      "customerId": cart.customerId
    });
  }, [cart])

  useEffect(() => {
    if(radioActive === radioKey) {
      setPayment({
            provider: 'payment-gateway',
            method: 'card',    
            displayName: 'Credit cart'  
      })
    }
  }, [radioActive])

  window['SpreedlyExpress'].onPaymentMethod(function(token, paymentMethod) {
    const currentPayment = payment
    currentPayment.customAttributes = {
      token : token,
      modeId : paymentMode.id,
      customer : cart.customerId
    }
    setPayment(currentPayment)
    window['SpreedlyExpress'].unload()
  });

  const openModal = (e) => {
    window['SpreedlyExpress'].openView()
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
            <TextBold2>Credit cart</TextBold2>
          </div>
        </Container>
        <GridLayout className="gap-[2px]">
          {radioActive === radioKey ? (
            <>
              <button className='large-primary-btn' onClick={openModal}>Enter Payment Info</button>
            </>
          ) : (<></>)}
        </GridLayout>
      </GridLayout>
    </div>
  )
}
export default PaymentSpreedlyCreditCardItem
