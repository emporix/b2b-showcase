import React from 'react'
import ReactPhoneInput from 'react-phone-input-material-ui'
import { TextField, withStyles } from '@material-ui/core'

const styles = (theme) => ({
  field: {
    margin: '10px 0',
  },
  countryList: {
    ...theme.typography.body1,
  },
})

function PhoneField(props) {
  const { value, defaultCountry, onChange, classes } = props
  return (
    <React.Fragment>
      {/* Configure more */}
      <ReactPhoneInput
        value={value}
        onChange={onChange}
        defaultCountry="no"
        excludeCountries={['us', 'ca']}
        component={TextField}
      />
    </React.Fragment>
  )
}
export default withStyles(styles)(PhoneField)
