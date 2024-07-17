import React from 'react'
import ReactPhoneInput from 'react-phone-input-material-ui'
import { TextField } from '@mui/material'

function PhoneField(props) {
  const { value, defaultCountry, onChange, classes } = props
  return (
    <ReactPhoneInput
      inputClass={'h-15'}
      value={value}
      onChange={onChange}
      defaultCountry="jp"
      excludeCountries={['us', 'ca']}
      component={TextField}
      enableAreaCodes={true}
    />
  )
}
export default PhoneField
