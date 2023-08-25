import { useAuth } from 'context/auth-provider'
import { useLanguage } from 'context/language-provider'
import { useContentfulApi } from 'hooks/useContentfulApi'
import React, { useEffect, useState } from 'react'

// this is just for demo purpose remove this afterwords
const DemoBanner = () => {
  const { userTenant, isLoggedIn } = useAuth()
  const { currentLanguage } = useLanguage()
  const { getEntry } = useContentfulApi()
  const [url, setUrl] = useState(null)
  useEffect(() => {
    ;(async () => {
      const { fields } = await getEntry('N4v7snAzNur6opPWQgTXA')
      setUrl(
        fields?.couponBanner?.fields?.file?.url
          ? `https:${fields?.couponBanner?.fields?.file?.url}`
          : null
      )
    })()
  }, [currentLanguage])

  if (userTenant !== 'powerzonecxp' || !url || !isLoggedIn) {
    return null
  }
  // return null
  return (
    <img src={url} className="w-full mt-[-20px] mb-[30px]" />
  )
}

export default DemoBanner
