import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  GridLayout,
  Container,
} from '../components/Utilities/common'
import { Heading2 } from '../components/Utilities/typography'
import Box from '@mui/material/Box'
import { homeUrl, loginUrl, signupUrl } from '../services/service.config'
import { TENANT } from '../constants/localstorage'
import { Logo } from '../components/Logo'
import { BackButton, LargePrimaryButton } from 'components/Utilities/button'
import { requestPasswordReset } from 'services/customer.service'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [emailError, setEmailError] = useState(false)

    const onChangeEmail = (e) => {
        const email = e.target.value
        setEmail(email)
    }

    const userTenant = localStorage.getItem(TENANT)

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        setEmailSent(false)
        setEmailError(false)
        try {
            const res = await requestPasswordReset(userTenant, email)
            setEmailSent(true)
            setEmail('')
        } catch (e) {
            console.error(e)
            setEmailError(true)
        }
    }

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
                    <Heading2 className="text-eerieBlack text-[24px]/[32px] font-semibold capitalize text-center">
                    Reset your password
                    </Heading2>
                    <form onSubmit={handlePasswordReset} className="display: block m-0">
                        <Box className="!pt-8 text-black text-base">
                            <label className="pb-2 text-[14px]/[22px]">E-mail</label>
                            <br />
                            <input
                                placeholder="example@gmail.com"
                                onChange={onChangeEmail}
                                value={email}
                                required
                                className="border rounded border-gray80 w-full px-3 py-2 mt-2"
                            />
                            {emailSent && <h6 style={{ color: 'green' }}>Reset password email sent</h6>}
                            {emailError && <h6 style={{ color: 'red' }}>Failed to send password reset email</h6>}
                        </Box>
                        <Box className="w-full !pt-8">
                            <LargePrimaryButton
                                className="w-full cta-button bg-yellow h-12"
                                disabled={!email}
                                title="Reset your password"
                            >
                            </LargePrimaryButton>
                        </Box>
                    </form>
                    <Box className="w-full !pt-8">
                            <BackButton
                                title="Back to login"
                                link={loginUrl()}
                            >
                            </BackButton>
                        </Box>
                </GridLayout>
            </GridLayout>
        </GridLayout>
    )
}
export default ForgotPassword