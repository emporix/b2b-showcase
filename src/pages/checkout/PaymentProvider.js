import React, { createContext, useContext, useState } from 'react'

const PaymentContext = createContext({})
export const usePayment = () => useContext(PaymentContext)

export const PaymentProvider = ({ children }) => {
  const [payment, setPayment] = useState(null)

  const getPaymentMethods = () => {
    if(payment) {
      return [
        payment
      ]
    }
    return [
        {
          provider: 'stripe',
          customAttributes: {
            paymentType: 'paymentByInvoice',
          },
          method: 'invoice',
        },
      ]
  }

  return (
    <PaymentContext.Provider
      value={{
        payment,
        setPayment,
        getPaymentMethods
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}
