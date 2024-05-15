import React from 'react'
import ReactPhoneInput from 'react-phone-input-material-ui'
import { TextField } from '@mui/material'
import { styled } from '@mui/system'

function PhoneField(props) {
  const { value, defaultCountry, onChange, classes } = props
  return (
      <ReactPhoneInput
        value={value}
        onChange={onChange}
        defaultCountry="no"
        excludeCountries={['us', 'ca']}
        component={TextField}
      />
  )
}
export default PhoneField
