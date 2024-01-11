import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2 } from '../Utilities/typography'
import { usePayment } from 'pages/checkout/PaymentProvider'


const PaymentSpreedlyCreditCardItem = ({ radioKey, props, paymentMode }) => {
  const { radioActive } = useContext(RadioContext)
  
  const { setPayment, payment } = usePayment()
  

  useEffect(() => {
    if(radioActive === radioKey) {

      window['SpreedlyExpress'].init(paymentMode.environmentKey, {
        "amount": props.grossValue + ' ' + props.currency,
        "company_name": "PowerZone",
        "sidebar_bottom_description": "Total Price",
      }, {
        "customerId": props.customerId
      });

      window['SpreedlyExpress'].onPaymentMethod(function(token, paymentMethod) {
        let browserInfo = paymentMode.scaProviderToken ? window['Spreedly'].ThreeDS.serialize('4') : null
    
        const currentPayment =  {
          provider: 'payment-gateway',
          method: 'card',    
          displayName: 'Credit cart'  
        }
        currentPayment.paymentMode = paymentMode
        currentPayment.customAttributes = {
          token : token,
          modeId : paymentMode.id,
          customer : props.customerId,
          browserInfo : browserInfo,
        }
        setPayment(currentPayment)
        window['SpreedlyExpress'].unload()
      });
    }
  }, [radioActive])

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
            <TextBold2>{paymentMode.scaProviderToken ? (<>Credit cart (3D Secure)</>) : (<>Credit cart</>)}</TextBold2>
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
