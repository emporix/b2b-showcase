import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { fetchSites } from '../services/sites'
import { useAppContext } from './app-context'
import { useAuth } from './auth-provider'
import { TENANT } from 'constants/localstorage'
import { LoadingCircleProgress } from 'components/Utilities/progress'

const SiteContext = createContext({})
export const useSites = () => useContext(SiteContext)

export const SitesProvider = ({ children }) => {
  const { context } = useAppContext()
  const [sites, setSites] = useState([])
  const [currentSite, setCurrentSite] = useState()
  const [currentSiteObject, setCurrentSiteObject] = useState()
  const { accessToken } = useAuth()

  useEffect(() => {
    ;(async () => {
      if (!accessToken) {
        return
      }
      const tenant = localStorage.getItem(TENANT)
      const sites = await fetchSites(tenant)
      const defaultSite = sites.find((site) => site.default)?.code || 'main'
      setSites(sites)
      const defaultSiteCode =
        context.siteCode === 'default' ? defaultSite : context.siteCode
      localStorage.setItem('siteCode', defaultSiteCode)
      setCurrentSite(defaultSiteCode)
      const site = sites.find((site) => site.code === defaultSiteCode)
      setCurrentSiteObject(site)
    })()
  }, [accessToken, context.siteCode])

  const onSiteChange = useCallback(
    async (siteCode) => {
      localStorage.setItem('siteCode', siteCode)
      setCurrentSite(siteCode)
      const site = sites.find((site) => site.code === siteCode)
      setCurrentSiteObject(site)
    },
    [sites]
  )

  if (!currentSite) {
    return <LoadingCircleProgress />
  }

  return (
    <SiteContext.Provider
      value={{
        currentSiteObject,
        sites,
        onSiteChange,
        currentSite,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}
