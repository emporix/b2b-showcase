import React, { useContext, useEffect, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2 } from '../Utilities/typography'
import { usePayment } from 'pages/checkout/PaymentProvider'
import FilledButton from 'components/Utilities/FilledButton'
import { initializePayment } from 'services/service.config'
import { ACCESS_TOKEN } from 'constants/localstorage'
import { api } from 'services/axios'


const PaymentSpreedlySaferpayItem = ({ radioKey, props, paymentMode }) => {
  const { radioActive } = useContext(RadioContext)
  
  const { setPayment, payment } = usePayment()
  const [saferpayCardDetailsProvided, setSaferpayCardDetailsProvided] = useState(false)
  const [spreedlyToken, setSpreedlyToken ] = useState(null)

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
        setSaferpayCardDetailsProvided(true)
        setSpreedlyToken(token)

        const currentPayment =  {
          provider: 'payment-gateway',
          method: 'card',    
          displayName: 'Saferpay',
          requiresInitialization : true  
        }
        setPayment(currentPayment)
        window['SpreedlyExpress'].unload()
      });
    }
  }, [radioActive])

  const openModal = (e) => {
    window['SpreedlyExpress'].openView()
  }

  const executePayment = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    const body = {
      order : {
        id : props.orderId
      },
      paymentModeId: paymentMode.id,
      creditCardToken: spreedlyToken
    }
    const res = await api.post(`${initializePayment()}`, body, { headers })
    window.location.replace(res.data.externalPaymentRedirectURL)
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
            <TextBold2>Saferpay SIX</TextBold2>
          </div>
        </Container>
        <GridLayout className="gap-[2px]">
          {radioActive === radioKey ? (
            <>
              {!saferpayCardDetailsProvided && <button className='large-primary-btn' onClick={openModal}>Enter Payment Info</button>}
              {saferpayCardDetailsProvided && (
                <FilledButton
                    onClick={executePayment}
                    className="mt-4 w-auto bg-yellow text-eerieBlack"
                  >
                    PAY via Saferpay
                </FilledButton>)
              }
            </>
          ) : (<></>)}
        </GridLayout>
      </GridLayout>
    </div>
  )
}
export default PaymentSpreedlySaferpayItem
