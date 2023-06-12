import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { login, register } from '../services/user/auth.service'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import PhoneField from '../components/Utilities/phoneinput/PhoneField'
import { GridLayout, Container } from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { TENANT } from '../constants/localstorage'
import { homeUrl } from '../services/service.config'
import { Logo } from '../components/Logo'
import { useAuth } from 'context/auth-provider'
import { createAddress } from 'services/user/adresses'

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
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
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

  const isAddressValid = useMemo(() => {
    return addressValid(shippingAddress) && addressValid(billingAddress)
  }, [shippingAddress, billingAddress])

  const { syncAuth } = useAuth()

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [shippingAddressCreated, setShippingAddressCreated] = useState(false)
  const [billingAddressCreated, setBillingAddressCreated] = useState(false)
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
    if (!isValidEmail(e.target.value)) {
      setEmailMessage('Email is invalid')
    } else {
      setEmailMessage(null)
    }
    setUserEmail(e.target.value)
  }
  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      if (password.length < 6) {
        setMessage('password must have at least 6 characters!')
        setOpenNotification(true)
      } else {
        if (userEmail && password && confirmPassword) {
          if (password === confirmPassword) {
            setLoading(true)
            if (!isSignedUp) {
              await register(
                userEmail,
                password,
                firstName,
                lastName,
                tenant,
                company,
                phoneNumber
              )
              await login(userEmail, password, tenant)
              syncAuth()
              setIsSignedUp(true)
            }
            if (!shippingAddressCreated) {
              await createAddress({ ...shippingAddress, tags: ['shipping'] })
              setShippingAddressCreated(true)
            }
            if (!billingAddressCreated) {
              await createAddress({ ...billingAddress, tags: ['billing'] })
              setBillingAddressCreated(true)
            }
            if (isSignedUp && shippingAddressCreated && billingAddressCreated) {
              props.history.replace(`/${tenant}`)
            }
            navigate('/{tenant}')
            setLoading(false)
          } else {
            setMessage('Confirm password is incorrect!')
            setOpenNotification(true)
          }
        } else {
          setMessage('Please enter at least useremail and password')
          setOpenNotification(true)
        }
      }
    } catch (e) {
      console.log(e)
      setMessage(e.response.data.message)
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
        <GridLayout className="w-full bg-white p-12 rounded">
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
                placeholder="Placeholder"
                onChange={onChangeUserEmail}
                value={userEmail}
                type="email"
                required
                className="border w-full px-3 py-2"
              />
              {emailMessage && <h6 style={{ color: 'red' }}>{emailMessage}</h6>}
            </Box>
            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Password</label>
              <br />
              <input
                placeholder="Placeholder"
                onChange={onChangePassword}
                value={password}
                type="password"
                required
                className="border w-full px-3 py-2"
              />
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Confirm Password</label>
              <br />
              <input
                placeholder="Placeholder"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                required
                className="border w-full px-3 py-2"
              />
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">First Name</label>
              <br />
              <input
                placeholder="Placeholder"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                className="border w-full px-3 py-2"
              />
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Last Name</label>
              <br />
              <input
                placeholder="Placeholder"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                className="border w-full px-3 py-2"
              />
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2">Company</label>
              <br />
              <input
                placeholder="Placeholder"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                type="text"
                className="border w-full px-3 py-2"
              />
            </Box>

            <Box className="!pt-6 w-full text-black text-base">
              <PhoneField
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
              />
            </Box>
            <div className="mt-2 text-black">Shipping Address</div>
            <AddressForm
              form={shippingAddress}
              handleUpdate={(newAddress) => {
                setShippingAddress(newAddress)
              }}
            />

            <div className="mt-2 text-black">Billing Address</div>
            <AddressForm
              form={billingAddress}
              handleUpdate={(newAddress) => {
                setBillingAddress(newAddress)
              }}
            />
            <Box className="w-full !pt-12">
              <button
                className="cta-button cursor-pointer bg-yellow w-full h-12 enabled:hover:bg-darkBlue disabled:bg-gray-400 disabled:lightGray"
                type="submit"
                disabled={loading || !isAddressValid}
              >
                {loading ? <CircularProgress color="secondary" /> : 'Sign Up'}
              </button>
            </Box>
          </form>
        </GridLayout>
      </GridLayout>
    </GridLayout>
  )
}
export default Signup
