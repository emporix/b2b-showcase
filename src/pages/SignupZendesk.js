import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerZD } from 'services/user/zendesk.service'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import PhoneField from '../components/Utilities/phoneinput/PhoneField'
import { Container, GridLayout } from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { USER } from '../constants/localstorage'
import { homeUrl } from '../services/service.config'
import { Logo } from '../components/Logo'
import { LargePrimaryButton } from 'components/Utilities/button'
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

const SignupZendesk = (props) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [openNotification, setOpenNotification] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSignedUp, setIsSignedUp] = useState(false)
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

  const { t } = useTranslation('signup')
  const navigate = useNavigate()

  const isAddressValid = useMemo(() => {
    return addressValid(shippingAddress)
  }, [shippingAddress])

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNotification(false)
  }
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  })

  const isCreationBlocked = () => {
    const isCorrectEssentialData =
      loading ||
      !userEmail ||
      !isValidEmail(userEmail) ||
      !firstName ||
      !lastName ||
      !addressEmptyValid(shippingAddress)

    return company ? isCorrectEssentialData || !isAddressValid : isCorrectEssentialData
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!isSignedUp) {
        await registerZD({
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
          company: company,
          phoneNumber: phoneNumber,
          address: shippingAddress,
        })
        setIsSignedUp(true)
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

  useEffect(() => {
    const user = localStorage.getItem(USER)
    if (!user) return navigate(homeUrl())

    let userJS
    try {
      userJS = JSON.parse(user)
    } catch (err) {
      userJS = {}
    }

    setUserEmail(userJS?.contactEmail ?? '')
    setFirstName(userJS?.firstName ?? '')
    setLastName(userJS?.lastName ?? '')
    setCompany(userJS?.company ?? '')
    setPhoneNumber(userJS?.contactPhone ?? '')

    setShippingAddress((current) => ({ ...current, ...(userJS?.addresses?.[0] ?? current) }))
  }, [])

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
            <Heading2 className="text-eerieBlack text-[24px]/[32px] font-semibold">{t('heading2_z')}</Heading2>
            <Heading4 className="text-eerieBlack text-[16px]/[24px] font-semibold pt-6">{t('heading4_z')}</Heading4>
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
                label={t('phone')}
                placeholder={t('phone_ph')}
                className="col-span-4"
                value={phoneNumber}
                action={setPhoneNumber}
                type="tel"
                required
              />

              <Box className="col-span-4">
                <div className="mt-2 text-black text-lg">{t('address')}*</div>
                {((company && !addressValid(shippingAddress)) || !addressEmptyValid(shippingAddress)) && (
                  <h6 style={{ color: 'red' }}>{t('address_err')}</h6>
                )}
                <AddressForm
                  form={shippingAddress}
                  handleUpdate={(newAddress) => {
                    setShippingAddress(newAddress)
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
export default SignupZendesk
