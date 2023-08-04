import React, { useState, useContext } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container } from '../Utilities/common'
import { TextBold2 } from '../Utilities/typography'
import './checkout.css'

const PaymentMethodItem = ({ radioKey, title, onChange }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)
  return (
    <div
      className={
        'payment-method-item-wrapper ' +
        (radioActive === radioKey ? 'active' : '')
      }
    >
      <Container className="gap-4 items-center">
        <RadioItem radioKey={radioKey} onChange={onChange} />
        <div className="brand-blue">
          <TextBold2>{title}</TextBold2>
        </div>
      </Container>
    </div>
  )
}
export default PaymentMethodItem
