import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GridLayout,
  Container,
} from '../components/Utilities/common'
import { Heading2, Heading4 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { homeUrl, signupUrl } from '../services/service.config'
import { TENANT } from '../constants/localstorage'
import { Logo } from '../components/Logo'
import { LargePrimaryButton } from 'components/Utilities/button'
import { resetPassword } from 'services/customer.service'

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [search, setSearch] = useState(window.location.search)
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const onChangeConfirmPassword = (e) => {
    const password = e.target.value
    setConfirmPassword(password)
  }
  const userTenant = localStorage.getItem(TENANT)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      if (password && confirmPassword) {
        setLoading(true)
        const res = await resetPassword(userTenant, password, token)
        navigate(homeUrl())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(search)
    setToken(params?.get('token'))
  }, [search])

  return (
    <GridLayout className="login_container bg-aliceBlue">
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
              Reset your password
            </Heading2>
          </GridLayout>
          <form onSubmit={handleLogin} className="display: block m-0">
            <Box className="!pt-8 text-black text-base">
              <label className="pb-2 text-[14px]/[22px]">Password</label>
              <br />
              <input
                placeholder="your Password"
                onChange={onChangePassword}
                value={password}
                type="password"
                required
                className="border rounded border-gray80 w-full px-3 py-2 mt-2"
              />
              {(!password || password.length < 6) && <h6 style={{ color: 'red' }}>Password must have at least 6 characters</h6>}
            </Box>
            <Box className="!pt-6 w-full text-black text-base">
              <label className="pb-2 text-[14px]/[22px]">Repeat your password</label>
              <br />
              <input
                placeholder="your password"
                onChange={onChangeConfirmPassword}
                value={confirmPassword}
                type="password"
                required
                className="border rounded border-gray80 w-full px-3 py-2 mt-2"
              />
              {(!confirmPassword || confirmPassword.length <6) && <h6 style={{ color: 'red' }}>Password must have at least 6 characters</h6>}
              {password && confirmPassword && confirmPassword !== password && <h6 style={{ color: 'red' }}>Passwords must be the same</h6>}
              {!token && <h6 style={{ color: 'red' }}>Token query param must be provided</h6>}
            </Box>
            <Box className="w-full !pt-8">
              <LargePrimaryButton
                className="w-full cta-button bg-yellow h-12"
                disabled={!token && !loading && !password || !confirmPassword || confirmPassword !== password}
                title="Reset your Password"
              >
              </LargePrimaryButton>
            </Box>
          </form>
        </GridLayout>
      </GridLayout>
    </GridLayout>
  )
}
export default ResetPassword
