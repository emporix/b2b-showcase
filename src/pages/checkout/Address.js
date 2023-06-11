import React from 'react'
import { GridLayout } from '../../components/Utilities/common'
import { TextRegular1 } from '../../components/Utilities/typography'
import './checkout.css'
import homePin from '../../assets/home_pin.svg'

const Address = ({ data }) => {
  return (
    <div
      className="address-grid"
      sx={{
        gridTemplateColumns: '50px 1fr !important',
      }}
    >
      <img className="home-pin" src={homePin} alt="homePin" />
      <>
        <TextRegular1>
          {data.streetAppending} {data.street}
          {data.streetNumber}
          {/* </TextRegular1> */}
          {/* <TextRegular1> */}
          <br />
          {data.zipCode} - {data.city}
        </TextRegular1>
        <TextRegular1>{data.coutry}</TextRegular1>
      </>
    </div>
  )
}

export default Address
