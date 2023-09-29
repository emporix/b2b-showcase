import React, { useContext, useEffect, useState } from 'react'

import { fetchPaymentGatewayModes } from 'services/service.config'
import { ACCESS_TOKEN, TENANT } from 'constants/localstorage'
import { api } from 'services/axios'
import PaymentSpreedlyCreditCardItem from './PaymentSpreedlyCreditCardItem'
import PaymentSpreedlyInvoiceItem from './PaymentSpreedlyInvoiceItem'
import PaymentSpreedlySprelItem from './PaymentSpreedlySprelItem'
import PaymentSpreedlyCashOnDeliveryItem from './PaymentSpreedlyCashOnDeliveryItem'
import PaymentInvoiceItem from './PaymentInvoiceItem'
import PaymentMethodItem from './PaymentMethodItem'
import PaymentSpreedlyPaypalItem from './PaymentSpreedlyPaypalItem'
import { useSites } from 'context/sites-provider'
import { fetchSite } from 'services/sites'
import PaymentSpreedlyDeferredItem from './PaymentSpreedlyDeferredItem'
import PaymentSpreedlySaferpayItem from './PaymentSpreedlySaferpayItem'
import PaymentUnzerItem from './PaymentUnzerItem'


const PaymentSpreedly = ({props}) => {
  
  const [paymentModes, setPaymentModes] = useState(null)
  const { currentSite } = useSites()
  useEffect(() => {
    ;(async () => {

      const tenant = localStorage.getItem(TENANT)
      const sitePayments = (await fetchSite(tenant, currentSite)).payment.map(payment => payment.id)
  
      const accessToken = localStorage.getItem(ACCESS_TOKEN)
      const headers = {
        Authorization: `Bearer ${accessToken}`
      }
      try {
        const res = await api.get(`${fetchPaymentGatewayModes()}`, { headers })
        const availablePayments = res.data.filter(payment => sitePayments.includes(payment.id))
        setPaymentModes(availablePayments)   
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
          (<PaymentSpreedlyCreditCardItem radioKey="credit_card" props={props} paymentMode={getPaymentMode('credit_card')} />)}      
        {isModeEnabled('credit_card_3ds') && 
          (<PaymentSpreedlyCreditCardItem radioKey="credit_card_3ds" props={props} paymentMode={getPaymentMode('credit_card_3ds')} />)}      
        {isModeEnabled('invoice') && !props.deferred && 
          (<PaymentSpreedlyInvoiceItem radioKey="invoice" props={props} paymentMode={getPaymentMode('invoice')} />)}
        {isModeEnabled('sprel') &&
          (<PaymentSpreedlySprelItem radioKey="sprel" props={props} paymentMode={getPaymentMode('sprel')} />)}        
        {isModeEnabled('cash_on_delivery') && !props.deferred && 
          (<PaymentSpreedlyCashOnDeliveryItem radioKey="cash_on_delivery" props={props} paymentMode={getPaymentMode('cash_on_delivery')} />)}
        {isModeEnabled('paypal') && 
          (<PaymentSpreedlyPaypalItem radioKey="paypal" props={props} paymentMode={getPaymentMode('paypal')} />)}
        {isModeEnabled('saferpay') && props.deferred &&
          (<PaymentSpreedlySaferpayItem radioKey="saferpay" props={props} paymentMode={getPaymentMode('saferpay')} />)}
        {isModeEnabled('unzer') && props.deferred &&
          (<PaymentUnzerItem radioKey="unzer" props={props} paymentMode={getPaymentMode('unzer')} />)}
          
        {paymentModes && paymentModes.length > 0 && (
          <PaymentSpreedlyDeferredItem radioKey="deferred" props={props} />
        )}

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
