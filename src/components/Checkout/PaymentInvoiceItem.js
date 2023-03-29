import React, { useContext } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import { Container, GridLayout } from '../Utilities/common'
import { TextBold2, TextRegular2 } from '../Utilities/typography'
import { Dropdown1 } from '../Utilities/dropdown'
import './checkout.css'

const PaymentInvoiceItem = ({ radioKey, title }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)
  const options = [
    {
      value: '970465640469',
      label: '970465640469',
    },
    {
      value: '7870465653469',
      label: '7870465653469',
    },
  ]
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
            <TextBold2>Invoice</TextBold2>
          </div>
        </Container>
        <GridLayout className="gap-[2px]">
          <TextRegular2>Enter your PO number</TextRegular2>
          <Dropdown1 placeholder="Please select" options={options} />
        </GridLayout>
      </GridLayout>
    </div>
  )
}
export default PaymentInvoiceItem
