import React from 'react'
import { GridLayout } from '../../components/Utilities/common'
import { TextRegular1 } from '../../components/Utilities/typography'
import './checkout.css'

const Address = ({ data }) => {
  return (
    <GridLayout>
      <TextRegular1>
        {data.streetAppending} {data.street}
        {data.streetNumber}
      </TextRegular1>
      <TextRegular1>
        {data.zipCode} - {data.city}
      </TextRegular1>
      <TextRegular1>{data.coutry}</TextRegular1>
    </GridLayout>
  )
}

export default Address
