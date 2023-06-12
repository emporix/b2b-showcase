import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { login } from '../services/user/auth.service'
import Snackbar from '@mui/material/Snackbar'
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

const Login = () => {
  const { syncAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [openNotification, setOpenNotification] = useState(false)
  const [password, setPassword] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const { isLoggedIn } = useAuth()
  const [message, setMessage] = useState()
  const navigate = useNavigate()

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
                <input type="checkbox" className='w-[18px] h-[18px]' />
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
