import React, { useContext, useEffect, useState } from 'react'

import { fetchPaymentGatewayModes } from 'services/service.config'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { api } from 'services/axios'
import PaymentSpreedlyCreditCardItem from './PaymentSpreedlyCreditCardItem'
import PaymentSpreedlyInvoiceItem from './PaymentSpreedlyInvoiceItem'
import PaymentSpreedlySprelItem from './PaymentSpreedlySprelItem'
import PaymentSpreedlyCashOnDeliveryItem from './PaymentSpreedlyCashOnDeliveryItem'
import PaymentInvoiceItem from './PaymentInvoiceItem'
import PaymentMethodItem from './PaymentMethodItem'
import PaymentSpreedlyPaypalItem from './PaymentSpreedlyPaypalItem'


const PaymentSpreedly = ({cart}) => {
  
  const [paymentModes, setPaymentModes] = useState(null)
  
  useEffect(() => {
    ;(async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN)
      const headers = {
        Authorization: `Bearer ${accessToken}`
      }
      try {
        const res = await api.get(`${fetchPaymentGatewayModes()}`, { headers })
        setPaymentModes(res.data)   
      } catch(ex) {
        setPaymentModes([])
      }
    })()
  }, [])

  const isModeEnabled = (modeName) => {    
    return paymentModes && paymentModes.filter(paymentMode => paymentMode.code === modeName).length > 0;
  }

  const getPaymentMode = (modeName) => {
    return paymentModes.filter(paymentMode => paymentMode.code === modeName)[0];
  }

  return (
    <>
        {isModeEnabled('credit_card') && 
          (<PaymentSpreedlyCreditCardItem radioKey="credit_card" cart={cart} paymentMode={getPaymentMode('credit_card')} />)}      
        {isModeEnabled('invoice') && 
          (<PaymentSpreedlyInvoiceItem radioKey="invoice" cart={cart} paymentMode={getPaymentMode('invoice')} />)}
        {isModeEnabled('sprel') &&
          (<PaymentSpreedlySprelItem radioKey="sprel" cart={cart} paymentMode={getPaymentMode('sprel')} />)}        
        {isModeEnabled('cash_on_delivery') && 
          (<PaymentSpreedlyCashOnDeliveryItem radioKey="cash_on_delivery" cart={cart} paymentMode={getPaymentMode('cash_on_delivery')} />)}
        {isModeEnabled('paypal') && 
          (<PaymentSpreedlyPaypalItem radioKey="paypal" cart={cart} paymentMode={getPaymentMode('paypal')} />)}

        {paymentModes && paymentModes.length == 0 && (
          <>
            <PaymentInvoiceItem radioKey="radio1" />
            <PaymentMethodItem radioKey="radio2" title="Trevipay" />
            <PaymentMethodItem
              radioKey="radio3"
              title="Pre Payment (Bank Transfer)"/>
            <PaymentMethodItem radioKey="radio4" title="Credit / Debit Card" />
          </>
        )}
    </>
  )
}
export default PaymentSpreedly
