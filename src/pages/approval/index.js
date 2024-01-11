import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUrl } from 'services/service.config'
import { useAuth } from 'context/auth-provider'
import ApprovalCheckoutSummary from './ApprovalCheckoutSummary'
import { useParams } from 'react-router-dom'
import { ApprovalAddressProvider } from 'pages/approval/ApprovalAddressProvider'
import approvalService from 'services/approval.service'
import Layout from 'pages/Layout'

const ApprovalCheckout = () => {
  const { userTenant, isLoggedIn } = useAuth()
  const { approvalId } = useParams()
  const [approval, setApproval] = useState()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const title = `Checkout`

  const getApproval = useCallback(async () => {
    try {
      setIsLoading(true)
      const approval = await approvalService.getApproval(approvalId)
      setApproval(approval)
    } finally {
      setIsLoading(false)
    }
  }, [userTenant, approvalId])

  useEffect(() => {
    if (isLoggedIn) return
    navigate(loginUrl())
  }, [isLoggedIn])

  useEffect(() => {
    getApproval()
  }, [])

  return (
    <Layout title={title}>
      <ApprovalAddressProvider approval={approval}>
        <ApprovalCheckoutSummary />
      </ApprovalAddressProvider>
    </Layout>
  )
}
export default ApprovalCheckout
