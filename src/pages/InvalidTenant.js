import { GridLayout, Center } from '../components/Utilities/common'
import { Heading4, Heading5 } from "../components/Utilities/typography";
import { TextInput } from '../components/Utilities/input'
import { LargePrimaryButton } from '../components/Utilities/button'
import { useCallback, useState } from 'react'
import { CLIENT_ID, TENANT } from 'constants/localstorage'
const DEVPORTAL_URL = process.env.REACT_APP_DEVPORTAL_URL
const InvalidTenant = () => {
  const [tenant, setTenant] = useState('')
  const [clientId, setClientID] = useState('')

  const saveTenantAndClientID = useCallback(() => {
    localStorage.setItem(CLIENT_ID, clientId)
    localStorage.setItem(TENANT, tenant)
    window.location.replace(`/${tenant}`)
  }, [clientId, tenant])

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
        <Heading5 className="text-black">You can obtain api keys <a target="_blank" className="text-tinBlue" href={DEVPORTAL_URL}>here</a> </Heading5>
      </GridLayout>
    </GridLayout>
  )
}
export default InvalidTenant
