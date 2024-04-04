import { LoadingCircleProgress } from 'components/Utilities/progress'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSites } from './sites-provider'

export const CURRENT_LANGUAGE_KEY = 'current-language'

export const getLanguageFromLocalStorage = () => {
  return localStorage.getItem(CURRENT_LANGUAGE_KEY)
    ? localStorage.getItem(CURRENT_LANGUAGE_KEY)
    : 'en'
}

const LanguageContext = createContext({ languages: [] })
export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState([])
  const { currentSite, sites } = useSites()
  const [currentLanguage, setCurrentLanguage] = useState()

  const setLanguage = (lang) => {
    setCurrentLanguage(lang)
    localStorage.setItem(CURRENT_LANGUAGE_KEY, lang)
  }

  useEffect(() => {
    if (currentSite && sites.length > 0) {
      let currentSiteObject = sites.find((site) => site.code === currentSite)

      if (currentSiteObject && currentSiteObject.languages) {
        setLanguages(currentSiteObject.languages)
        if (currentSiteObject.defaultLanguage) {
          setLanguage(currentSiteObject.defaultLanguage)
        }
      }
    }
  }, [currentSite, sites.length])

  if (!currentLanguage) {
    return <LoadingCircleProgress />
  }
  return (
    <LanguageContext.Provider
      value={{
        languages,
        currentLanguage,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
