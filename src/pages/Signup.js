import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, register, refreshCustomerData } from '../services/user/auth.service'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import PhoneField from '../components/Utilities/phoneinput/PhoneField'
import { Container, GridLayout } from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { TENANT } from '../constants/localstorage'
import { homeUrl } from '../services/service.config'
import { Logo } from '../components/Logo'
import { useAuth } from 'context/auth-provider'
import { createAddress } from 'services/user/adresses'
import { LargePrimaryButton } from 'components/Utilities/button'
import { useCurrency } from 'context/currency-context'
import { useTranslation } from 'react-i18next'

const Input = ({ isValid, errorText, label, value, action, className, placeholder, type, required, ...rest }) => {
  return (
    <div className={`!pt-2 w-full text-black text-base ${className}`}>
      <label htmlFor={label} className="inline-block w-full pb-0 truncate">
        {label}
        {required ? '*' : ''}
      </label>

      {type === 'tel' ? (
        <PhoneField value={value} onChange={(value) => action(value)} classes={'h-5'} />
      ) : (
        <input
          name={label}
          id={label}
          placeholder={placeholder}
          onChange={(e) => action(e.target.value)}
          value={value}
          type={type ? type : 'text'}
          className="border w-full px-3 py-3 h-15 rounded border-gray hover:border-black"
          required={required ? true : false}
          {...rest}
        />
      )}
      {!isValid ? <h6 className={'text-red-500'}>{errorText}</h6> : null}
    </div>
  )
}

const AddressForm = ({ form, handleUpdate }) => {
  const { t } = useTranslation('address')
  return (
    <div className="grid grid-cols-4 gap-x-4">
      <Input
        label={t('contact')}
        className="col-span-4"
        placeholder="Contact name"
        value={form.contactName}
        action={(val) =>
          handleUpdate({
            ...form,
            contactName: val,
          })
        }
      />
      <Input
        label="Street"
        className="col-span-4 md:col-span-2"
        placeholder="Street"
        value={form.street}
        action={(val) =>
          handleUpdate({
            ...form,
            street: val,
          })
        }
      />
      <Input
        label="St. Number"
        placeholder="Street Number"
        className="col-span-2 md:col-span-1"
        value={form.streetNumber}
        action={(val) =>
          handleUpdate({
            ...form,
            streetNumber: val,
          })
        }
      />
      <Input
        label="St. Appendix"
        className="col-span-2 md:col-span-1"
        value={form.streetAppendix}
        action={(val) =>
          handleUpdate({
            ...form,
            streetAppendix: val,
          })
        }
      />
      <Input
        label="Zip Code"
        placeholder="Zip Code"
        className="col-span-2"
        value={form.zipCode}
        action={(val) =>
          handleUpdate({
            ...form,
            zipCode: val,
          })
        }
      />
      <Input
        label="City"
        placeholder="City"
        className="col-span-2"
        value={form.city}
        action={(val) =>
          handleUpdate({
            ...form,
            city: val,
          })
        }
      />
      <Input
        label="State"
        placeholder="State"
        className="col-span-2"
        value={form.state}
        action={(val) =>
          handleUpdate({
            ...form,
            state: val,
          })
        }
      />
      <Input
        label="Country"
        placeholder="Country"
        className="col-span-2"
        value={form.country}
        action={(val) =>
          handleUpdate({
            ...form,
            country: val,
          })
        }
      />
    </div>
  )
}

const addressValid = (address) => {
  return (
    address.contactName.length > 0 &&
    address.street.length > 0 &&
    address.streetNumber.length > 0 &&
    address.zipCode.length > 0 &&
    address.city.length > 0 &&
    address.country.length > 0
  )
}

const addressEmptyValid = (address) => {
  return (
    (address.contactName.length == 0 &&
      address.street.length == 0 &&
      address.streetNumber.length == 0 &&
      address.zipCode.length == 0 &&
      address.city.length == 0 &&
      address.country.length == 0) ||
    (address.contactName.length > 0 &&
      address.street.length > 0 &&
      address.streetNumber.length > 0 &&
      address.zipCode.length > 0 &&
      address.city.length > 0 &&
      address.country.length > 0)
  )
}

const Signup = (props) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [openNotification, setOpenNotification] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [registrationId, setRegistrationId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState({
    contactName: '',
    street: '',
    streetNumber: '',
    streetAppendix: '',
    zipCode: '',
    country: '',
    state: '',
    city: '',
  })
  const [billingAddress, setBillingAddress] = useState({
    contactName: '',
    street: '',
    streetNumber: '',
    streetAppendix: '',
    zipCode: '',
    country: '',
    state: '',
    city: '',
  })
  const { activeCurrency } = useCurrency()
  const { t } = useTranslation('signup')

  const isAddressValid = useMemo(() => {
    return addressValid(shippingAddress) && addressValid(billingAddress)
  }, [shippingAddress, billingAddress])

  const { syncAuth } = useAuth()

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }
  const [isSignedUp, setIsSignedUp] = useState(false)
  const navigate = useNavigate()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNotification(false)
  }
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  })

  const tenant = localStorage.getItem(TENANT)

  const isCreationBlocked = () => {
    const isCorrectEssentialData =
      loading ||
      !password ||
      !confirmPassword ||
      confirmPassword !== password ||
      !userEmail ||
      !isValidEmail(userEmail) ||
      !firstName ||
      !lastName ||
      !addressEmptyValid(billingAddress) ||
      !addressEmptyValid(shippingAddress)

    return company ? isCorrectEssentialData || !registrationId || !isAddressValid : isCorrectEssentialData
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!isSignedUp) {
        await register(
          userEmail,
          password,
          firstName,
          lastName,
          tenant,
          company,
          registrationId,
          phoneNumber,
          activeCurrency
        )
        await login(userEmail, password, tenant)
        syncAuth()
        setIsSignedUp(true)
      }
      if (addressValid(shippingAddress)) {
        await createAddress({ ...shippingAddress, tags: ['shipping'] })
      }
      if (addressValid(billingAddress)) {
        await createAddress({ ...billingAddress, tags: ['billing'] })
      }
      await refreshCustomerData(tenant)
      if (isSignedUp) {
        props.history.replace(`/${tenant}`)
      }
      navigate(homeUrl())
      setLoading(false)
    } catch (e) {
      console.log(e)
      setMessage(e?.response?.data?.message)
      setOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GridLayout className="signup_container bg-aliceBlue">
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <GridLayout className="md:w-[540px] w-[95%] mx-auto h-[740px]">
        <Container className="w-full h-[110px] items-center  text-center text-white font-bold  text-7xl ">
          <Container className="mx-auto">
            <Logo size={'w-[78px] h-[86px] mr-5'} text={'px-4 flex text-white text-[48px]'} />
          </Container>
        </Container>
        <GridLayout className="w-full bg-white p-12  rounded">
          <GridLayout className="text-center">
            <Heading2 className="text-eerieBlack text-[24px]/[32px] font-semibold">{t('heading2')}</Heading2>
            <Heading4 className="text-eerieBlack text-[16px]/[24px] font-semibold pt-6">{t('heading4')}</Heading4>
          </GridLayout>

          <form onSubmit={handleSignup} className="display: block m-0">
            <div className="grid grid-cols-4 gap-x-4">
              <Input
                label="E-mail address"
                placeholder="jon.doe@zendesk.com"
                className="col-span-4"
                value={userEmail}
                action={setUserEmail}
                type="email"
                required
                isValid={!userEmail || isValidEmail(userEmail)}
                errorText={t('email_err')}
              />
              <Input
                label={t('password')}
                placeholder={t('password_ph')}
                className="col-span-4"
                value={password}
                action={setPassword}
                type="password"
                required
                isValid={!password || password.length >= 6}
                errorText={t('password_err')}
              />
              <Input
                label={t('password2')}
                placeholder={t('password2_ph')}
                className="col-span-4"
                value={confirmPassword}
                action={setConfirmPassword}
                type="password"
                required
                isValid={!password || password.length >= 6}
                errorText={t('password_err')}
              />
              {password && confirmPassword && confirmPassword !== password && (
                <h6 className={'text-red-500 col-span-4'}>{t('password2_err')}</h6>
              )}
              <Input
                label={t('firstname')}
                placeholder={t('firstname_ph')}
                className="col-span-4"
                value={firstName}
                action={setFirstName}
                type="text"
                required
                isValid={!firstName || firstName.length > 1}
                errorText={t('firstname_err')}
              />
              <Input
                label={t('lastname')}
                placeholder={t('lastname_ph')}
                className="col-span-4"
                value={lastName}
                action={setLastName}
                type="text"
                required
                isValid={!lastName || lastName.length > 1}
                errorText={t('lastname_err')}
              />

              <Input
                label={t('company')}
                placeholder={t('company_ph')}
                className="col-span-4"
                value={company}
                action={setCompany}
                type="text"
              />
              <Input
                label={t('registration')}
                placeholder={t('registration_ph')}
                className="col-span-4"
                value={registrationId}
                action={setRegistrationId}
                type="text"
                isValid={(!company && !registrationId) || (company && registrationId)}
                errorText={t('registration_err')}
              />

              <Input
                label={t('phone')}
                placeholder={t('phone_ph')}
                className="col-span-4"
                value={phoneNumber}
                action={setPhoneNumber}
                type="tel"
                required
              />

              <Box className="col-span-4">
                <div className="mt-2 text-black text-lg">{t('address_ship')}*</div>
                {((company && !addressValid(shippingAddress)) || !addressEmptyValid(shippingAddress)) && (
                  <h6 style={{ color: 'red' }}>{t('address_ship_err')}</h6>
                )}
                <AddressForm
                  form={shippingAddress}
                  handleUpdate={(newAddress) => {
                    setShippingAddress(newAddress)
                  }}
                />
                <br />
                <div className="mt-2 text-black text-lg">{t('address_bill')}*</div>
                {((company && !addressValid(billingAddress)) || !addressEmptyValid(billingAddress)) && (
                  <h6 style={{ color: 'red' }}>{t('address_bill_err')}</h6>
                )}
                <AddressForm
                  form={billingAddress}
                  handleUpdate={(newAddress) => {
                    setBillingAddress(newAddress)
                  }}
                />
              </Box>
              <Box className="mt-8 col-span-4">
                <LargePrimaryButton
                  className="w-full cta-button !bg-primary h-12 !text-white"
                  disabled={isCreationBlocked()}
                  title={t('signup')}
                ></LargePrimaryButton>
              </Box>
            </div>
          </form>
        </GridLayout>
      </GridLayout>
    </GridLayout>
  )
}
export default Signup
