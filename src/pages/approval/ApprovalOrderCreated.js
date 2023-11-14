import React from 'react'
import Layout from '../Layout'
import { useNavigate } from 'react-router-dom'
import { loginUrl, homeUrl } from 'services/service.config'
import { useAuth } from 'context/auth-provider'

const ApprovalOrderCreated = () => {
  const title = `Order Created`
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate(loginUrl())
    }
  }, [isLoggedIn])
  return (
    <Layout title={title}>
      <div
        className="brand-page-wrapper text-center w-full"
        style={{ marginTop: 50 + 'px' }}
      >
        <div className="font-inter">
          <div className="border-b pb-12">
            <div className="md:flex justify-between">
              <div className="font-semibold text-[24px] px-6 py-0 w-full">
                The Order has been created
              </div>
            </div>
            <div>
              <button
                className="bg-yellow text-[white] px-6 py-0 h-[50px] text-[14px] leading-[14px] md:w-[400px] w-full"
                onClick={() => {
                  navigate(homeUrl())
                }}
              >
                BACK HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default ApprovalOrderCreated
