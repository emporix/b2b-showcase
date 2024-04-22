import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../services/user/auth.service'
import Snackbar from '@mui/material/Snackbar'
import { guestCheckoutUrl } from 'services/service.config'
import MuiAlert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import {
  LayoutBetween,
  GridLayout,
  Container,
} from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { homeUrl, signupUrl } from '../services/service.config'
import { useAuth } from 'context/auth-provider'
import { TENANT } from '../constants/localstorage'
import { Logo } from '../components/Logo'
import './login.css'

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID

const ORY_DOMAIN = process.env.REACT_APP_ORY_DOMAIN
const ORY_CLIENT_ID = process.env.REACT_APP_ORY_CLIENT_ID

const Login = () => {
  const { syncAuth, isLoggedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [openNotification, setOpenNotification] = useState(false)
  const [isFromCheckout, setIsFromCheckout] = useState(false)
  const [password, setPassword] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [message, setMessage] = useState()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get('process') === 'checkout') {
      setIsFromCheckout(true)
    }
  }, [])

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
  const onChangeUserEmail = (e) => {
    if (!isValidEmail(e.target.value)) {
      setEmailMessage('Email is invalid')
    } else {
      setEmailMessage(null)
    }
    setUserEmail(e.target.value)
  }
  function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2)
  }
  function generateState() {
    var array = new Uint32Array(56 / 2)
    window.crypto.getRandomValues(array)
    return Array.from(array, dec2hex).join('')
  }
  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }
  const userTenant = localStorage.getItem(TENANT)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      if (userEmail && password) {
        setLoading(true)
        const user = await login(userEmail, password, userTenant)
        syncAuth(user)
        navigate(`/${userTenant}`)
        setOpenNotification(true)
      }
    } catch (e) {
      console.error(e)
      setOpenNotification(true)
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    return <Navigate to={homeUrl()} />
  }

  return (
    <GridLayout className="login_container bg-aliceBlue">
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
        <Container className="w-full items-center text-center text-eerieBlack font-bold text-7xl ">
          <Container className="mx-auto">
            <Link to={homeUrl} className="flex">
              <Logo
                size={'w-[78px] h-[86px] mr-5'}
                text={'px-4 flex text-eerieBlack text-[48px]'}
              />
            </Link>
          </Container>
        </Container>
        <GridLayout className="w-full bg-white p-12 rounded">
          <GridLayout className="text-center">
            <Heading2 className="text-eerieBlack text-[24px]/[32px] font-semibold capitalize">
              Log in to your account
            </Heading2>
            <Heading4 className="text-manatee text-[16px]/[24px] font-normal pt-3">
              Welcome back! Please enter your details
            </Heading4>
          </GridLayout>
          <form onSubmit={handleLogin} className="display: block m-0">
            <Box className="!pt-8 text-black text-base">
              <label className="pb-2 text-[14px]/[22px]">E-mail</label>
              <br />
              <input
                id="email-input"
                placeholder="example@gmail.com"
                onChange={onChangeUserEmail}
                value={userEmail}
                type="email"
                required
                className="border rounded border-gray80 w-full px-3 py-2 mt-2"
              />
              {emailMessage && <h6 style={{ color: 'red' }}>{emailMessage}</h6>}
            </Box>
            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2 text-[14px]/[22px]">Password</label>
              <br />
              <input
                id="password-input"
                placeholder="your password"
                onChange={onChangePassword}
                value={password}
                type="password"
                required
                className="border rounded border-gray80 w-full px-3 py-2 mt-2"
              />
            </Box>
            <LayoutBetween className="pt-6 text-black text-base">
              <div className="flex items-center">
                <input type="checkbox" className="w-[18px] h-[18px]" />
                <label className="pl-2 text-[14px]/[22px]">Remember me</label>
              </div>
              <a className="text-[16px]/[24px] text-dodgerBlue cursor-pointer">
                Forgot Password
              </a>
            </LayoutBetween>
            <Box className="w-full !pt-8">
              <button
                className="w-full cta-button bg-yellow h-12"
                type="submit"
              >
                {loading ? <CircularProgress color="secondary" /> : 'LOG IN'}
              </button>
            </Box>
          </form>
          {isFromCheckout && (
            <GridLayout className="pt-6 w-full  items-center text-center text-base">
            <Box className="w-full !pt-8">
              <button
              onClick={() => navigate(guestCheckoutUrl())}
                className="w-full social-login-btn h-12"
              >
              <span className="guest-login-btn-label">Continue as a Guest</span>
              </button>
            </Box>
            </GridLayout>
          )}
          {AUTH0_DOMAIN && (
            <GridLayout className="pt-6 w-full  items-center text-center text-base">
              <Box className="w-full !pt-8">
                <button
                  className="w-full h-12 social-login-btn"
                  onClick={() => {
                    window.location.href = `${AUTH0_DOMAIN}/authorize?response_type=code&scope=profile email openid offline_access&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${window.location.origin}/auth0`
                  }}
                >
                  <img
                    src="https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.png"
                    width="32"
                  />
                  <span className="social-login-btn-label">Social Login</span>
                </button>
              </Box>
            </GridLayout>
          )}

          {ORY_DOMAIN && (
            <GridLayout className="pt-6 w-full  items-center text-center text-base">
              <Box className="w-full !pt-8">
                <button
                  className="w-full h-12 social-login-btn"
                  onClick={() => {
                    window.location.href = `${ORY_DOMAIN}/oauth2/auth?response_type=code&scope=openid%20offline_access%20email%20profile&client_id=${ORY_CLIENT_ID}&state=${generateState()}&redirect_uri=${
                      window.location.origin
                    }/ory`
                  }}
                >
                  <img
                    src="https://www.ory.sh/docs/img/logos/logo-docs-dark-2023-02-15.svg"
                    width="32"
                  />
                  <span className="social-login-btn-label">
                    Ory Social Login
                  </span>
                </button>
              </Box>
            </GridLayout>
          )}

          <GridLayout className="pt-6 w-full  items-center text-center text-base">
            <Box className="mx-auto">
              <span className="text-[146x]/[24px] text-eerieBlack">
                Don't have an account?
              </span>
              <Link to={signupUrl()}>
                <span className="pl-2 font-semibold hover:cursor-pointer text-[146x]/[24px] font-medium text-dodgerBlue hover:text-yellow">
                  Sign Up
                </span>
              </Link>
            </Box>
          </GridLayout>
        </GridLayout>
      </GridLayout>
    </GridLayout>
  )
}
export default Login
