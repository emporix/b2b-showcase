import { GridLayout } from '../components/Utilities/common'
import { useEffect } from 'react'
import { CLIENT_ID, TENANT } from 'constants/localstorage'
const InvalidTenant = () => {
  useEffect(() => {
    const tenant = process.env.REACT_APP_EMPORIX_TENANT
    localStorage.setItem(
      CLIENT_ID,
      process.env.REACT_APP_EMPORIX_STOREFRONT_API
    )
    localStorage.setItem(TENANT, tenant)
    window.location.replace(`/${tenant}`)
  }, [])

  return (
    <GridLayout className="invalid-tenant-page bg-gray">
      <GridLayout className="gap-20 place-content-center">
        Redirecting...
      </GridLayout>
    </GridLayout>
  )
}
export default InvalidTenant
