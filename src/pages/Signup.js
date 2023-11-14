import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, register } from '../services/user/auth.service'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import PhoneField from '../components/Utilities/phoneinput/PhoneField'
import { GridLayout, Container } from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { TENANT } from '../constants/localstorage'
import { homeUrl } from '../services/service.config'
import { Logo } from '../components/Logo'
import { useAuth } from 'context/auth-provider'
import { createAddress } from 'services/user/adresses'
import { LargePrimaryButton } from 'components/Utilities/button'
import { useCurrency } from 'context/currency-context'

const Input = ({ label, value, action, className, placeholder }) => {
  return (
    <div className={`!pt-2 w-full text-black text-base ${className}`}>
      <label className="pb-2">{label}</label>
      <br />
      <input
        placeholder={placeholder}
        onChange={(e) => action(e.target.value)}
        value={value}
        type="text"
        className="border w-full px-3 py-2"
      />
    </div>
  )
}

const AddressForm = ({ form, handleUpdate }) => {
  return (
    <div className="grid grid-cols-4 gap-x-4">
      <Input
        label="Contact name"
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
        className="col-span-2"
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
        placeholder="Sreet Number"
        className="col-span-1"
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
        className="col-span-1"
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
        className="col-span-3"
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
        className="col-span-1"
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
    address.contactName.length == 0 &&
    address.street.length == 0 &&
    address.streetNumber.length == 0 &&
    address.zipCode.length == 0 &&
    address.city.length == 0 &&
    address.country.length == 0
  )
  || (
    address.contactName.length > 0 &&
    address.street.length > 0 &&
    address.streetNumber.length > 0 &&
    address.zipCode.length > 0 &&
    address.city.length > 0 &&
    address.country.length > 0
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
  const onChangeUserEmail = (e) => {
    setUserEmail(e.target.value)
  }
  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

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

    return company
      ? isCorrectEssentialData || !registrationId || !isAddressValid
      : isCorrectEssentialData
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
            <Link to={homeUrl()} className="flex">
              <Logo
                size={'w-[78px] h-[86px] mr-5'}
                text={'px-4 flex text-white text-[48px]'}
              />
            </Link>
          </Container>
        </Container>
        <GridLayout className="w-full bg-white p-12  rounded">
          <GridLayout className="text-center">
            <Heading2 className="text-eerieBlack text-[24px]/[32px] font-semibold">
              Register as a New User
            </Heading2>
            <Heading4 className="text-eerieBlack text-[16px]/[24px] font-semibold pt-6">
              Welcome! Please enter your details
            </Heading4>
          </GridLayout>
          <form onSubmit={handleSignup} className="display: block m-0">
            <Box className="!pt-12 text-black text-base">
              <label className="pb-2">E-mail address</label>
              <br />
              <input
                placeholder="jon.doe@emporix.com"
                onChange={onChangeUserEmail}
                value={userEmail}
                type="email"
                required
                className="border w-full px-3 py-2"
              />
              {!isValidEmail(userEmail) && (
                <h6 style={{ color: 'red' }}>Email is invalid</h6>
              )}
            </Box>
            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Password</label>
              <br />
              <input
                placeholder="Strong password"
                onChange={onChangePassword}
                value={password}
                type="password"
                required
                className="border w-full px-3 py-2"
              />
              {(!password || password.length < 6) && (
                <h6 style={{ color: 'red' }}>
                  Password must have at least 6 characters
                </h6>
              )}
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Confirm Password</label>
              <br />
              <input
                placeholder="Strong password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                required
                className="border w-full px-3 py-2"
              />
              {(!confirmPassword || confirmPassword.length < 6) && (
                <h6 style={{ color: 'red' }}>
                  Password must have at least 6 characters
                </h6>
              )}
              {password && confirmPassword && confirmPassword !== password && (
                <h6 style={{ color: 'red' }}>Passwords must be the same</h6>
              )}
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">First Name</label>
              <br />
              <input
                placeholder="Jon"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                className="border w-full px-3 py-2"
              />
              {!firstName && (
                <h6 style={{ color: 'red' }}>First Name must be provided</h6>
              )}
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Last Name</label>
              <br />
              <input
                placeholder="Doe"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                className="border w-full px-3 py-2"
              />
              {!lastName && (
                <h6 style={{ color: 'red' }}>Last Name must be provided</h6>
              )}
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Company</label>
              <br />
              <input
                placeholder="Company name"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                type="text"
                className="border w-full px-3 py-2"
              />
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Registration Number</label>
              <input
                placeholder="123-456-789"
                onChange={(e) => setRegistrationId(e.target.value)}
                value={registrationId}
                type="text"
                className="border w-full px-3 py-2"
              />
              {company && !registrationId && (
                <h6 style={{ color: 'red' }}>
                  Registration Number must be provided
                </h6>
              )}
            </Box>
            <Box className="!pt-6 w-full text-black text-base">
              <PhoneField
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
              />
            </Box>
            <br />
            <div className="mt-2 text-black">Shipping Address</div>
            {((company && !addressValid(shippingAddress)) ||
              (!addressEmptyValid(shippingAddress))) && (
              <h6 style={{ color: 'red' }}>
                Correct shipping address must be provided
              </h6>
            )}
            <AddressForm
              form={shippingAddress}
              handleUpdate={(newAddress) => {
                setShippingAddress(newAddress)
              }}
            />
            <br />
            <div className="mt-2 text-black">Billing Address</div>
            {((company && !addressValid(billingAddress)) ||
              (!addressEmptyValid(billingAddress))) && (
              <h6 style={{ color: 'red' }}>Correct billing address must be provided</h6>
            )}
            <AddressForm
              form={billingAddress}
              handleUpdate={(newAddress) => {
                setBillingAddress(newAddress)
              }}
            />
            <Box className="w-full !pt-12">
              <LargePrimaryButton
                className="w-full cta-button bg-yellow h-12"
                disabled={isCreationBlocked()}
                title="Sign Up"
              ></LargePrimaryButton>
            </Box>
          </form>
        </GridLayout>
      </GridLayout>
    </GridLayout>
  )
}
export default Signup
