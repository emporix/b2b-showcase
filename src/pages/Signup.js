import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { login, register } from '../redux/slices/authReducer'
import { setMessage } from '../redux/slices/messageReducer'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import PhoneField from '../components/Utilities/phoneinput/PhoneField'
import { GridLayout, Container } from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { TENANT } from '../constants/localstorage'
import { homeUrl } from '../services/service.config'

const Signup = (props) => {
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [openNotification, setOpenNotification] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const { isLoggedIn } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { message } = useSelector((state) => state.message)

  function isValidEmail(email) {
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

  const handleSignup = (e) => {
    e.preventDefault()

    if (password.length < 6) {
      dispatch(setMessage('password must have at least 6 characters!'))
      setOpenNotification(true)
    } else {
      if (userEmail && password && confirmPassword) {
        if (password === confirmPassword) {
          setLoading(true)
          dispatch(
            register(
              userEmail,
              password,
              firstName,
              lastName,
              tenant,
              company,
              phoneNumber
            )
          )
            .then(() => {
              dispatch(login(userEmail, password, tenant))
                .then(() => {
                  props.history.push(`/${tenant}`)
                  window.location.reload()
                  setOpenNotification(true)
                  setLoading(false)
                })
                .catch(() => {
                  setOpenNotification(true)
                  setLoading(false)
                })
            })
            .catch(() => {
              setOpenNotification(true)
              setLoading(false)
            })
        } else {
          dispatch(setMessage('Confirm password is incorrect!'))
          setOpenNotification(true)
        }
      } else {
        dispatch(setMessage('Please enter at least useremail and password'))
        setOpenNotification(true)
      }
    }
  }

  if (isLoggedIn) {
    return <Navigate to={homeUrl()} />
  }

  return (
    <GridLayout className="signup_container">
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
      <GridLayout className="md:w-[540px] w-[95%] mx-auto h-[740px] md:pt-[138px] pt-10">
        <Container className="w-full h-[110px] items-center  text-center text-white font-bold  text-7xl ">
          <Container className="mx-auto">
            <Link to={homeUrl()} className="flex">
              <img src="/login_atom.png" className="w-[78px] h-[86px] mr-5" />
              atom
            </Link>
          </Container>
        </Container>
        <GridLayout className="w-full bg-white p-12  shadow-2xl">
          <GridLayout className="text-center">
            <Heading2 className="text-lightBlue">
              Register as a New User
            </Heading2>
            <Heading4 className="text-darkGray pt-6">
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

            <Box className="w-full !pt-12">
              <button
                className="w-full text-white bg-tinBlue h-12 hover:bg-lightBlue"
                type="submit"
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
