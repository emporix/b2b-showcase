import { GridLayout, Center } from '../components/Utilities/common'
import { Heading4, Heading5 } from '../components/Utilities/typography'
import { TextInput } from '../components/Utilities/input'
import { LargePrimaryButton } from '../components/Utilities/button'
import { useCallback, useEffect, useState } from 'react'
import { CLIENT_ID, TENANT, PROCUREMENT_SYSTEM_URL, CUSTOMER_TOKEN, CUSTOMER_TOKEN_EXPIRES_IN, EXTERNAL_CUSTOMER_TOKEN, EXTERNAL_TOKEN_EXPIRIES_IN, EXTERNAL_SAAS_TOKEN } from 'constants/localstorage'
import { loginBasedOnCustomerToken } from 'services/user/auth.service'
import AccessToken from 'services/user/accessToken'
const DEVPORTAL_URL = process.env.REACT_APP_DEVPORTAL_URL
const InvalidTenant = () => {
  const [tenant, setTenant] = useState('')
  const [clientId, setClientID] = useState('')

  const saveTenantAndClientID = useCallback(() => {
    localStorage.clear()
    localStorage.setItem(CLIENT_ID, clientId)
    localStorage.setItem(TENANT, tenant)
    window.location.replace(`/${tenant}`)
  }, [clientId, tenant])

  const insertLocalStorageValue = (key, value) => {
    if(value) {
      localStorage.setItem(key, value)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tenantParam = urlParams.get("tenant")
    const clientIdParam = urlParams.get("clientId")
    if(tenantParam && clientIdParam) {
      localStorage.clear()
      localStorage.setItem(CLIENT_ID, clientIdParam)
      localStorage.setItem(TENANT, tenantParam)
      insertLocalStorageValue(EXTERNAL_CUSTOMER_TOKEN, urlParams.get('customerToken'))
      insertLocalStorageValue(EXTERNAL_TOKEN_EXPIRIES_IN, urlParams.get('customerTokenExpiresIn'))
      insertLocalStorageValue(EXTERNAL_SAAS_TOKEN, urlParams.get('saasToken'))
      insertLocalStorageValue(PROCUREMENT_SYSTEM_URL, urlParams.get('procurementSystemUrl'))
      window.location.replace(`/${tenantParam}`)
    }
  }, [])

  return (
    <GridLayout className="invalid-tenant-page bg-gray">
      <GridLayout className="gap-20 place-content-center">
        <Heading4 className="">
          You need to enter a valid tenant name in the URL.
        </Heading4>
        <Center className="gap-3 w-1/3 m-auto">
          <TextInput
            label="Tenant Name"
            value={tenant}
            placeholder="Please put tenant name"
            action={setTenant}
          />
          <TextInput
            label="Client ID"
            value={clientId}
            placeholder="Please put client id"
            action={setClientID}
          />
          <LargePrimaryButton
            title="MAIN PAGE"
            className="mt-8"
            onClick={() => saveTenantAndClientID()}
          />
        </Center>
        <Heading5 className="text-black">
          You can obtain api keys{' '}
          <a target="_blank" className="text-tinBlue" href={DEVPORTAL_URL}>
            here
          </a>{' '}
        </Heading5>
      </GridLayout>
    </GridLayout>
  )
}
export default InvalidTenant
