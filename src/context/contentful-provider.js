import React, { createContext, useContext, useEffect, useState } from 'react'
import { useContentfulApi } from '../hooks/useContentfulApi'
import { useLanguage } from './language-provider'

const ContentfulContext = createContext({ fields: {} })

export const useContentful = () => useContext(ContentfulContext)

export const ContentfulProvider = ({ children }) => {
  const [fields, setFields] = useState({})
  const { getEntry } = useContentfulApi()
  const { currentLanguage } = useLanguage()
  useEffect(() => {
    ;(async () => {
      const { fields } = await getEntry('8OpahJ7qnuJm8WGHwA9VT')
      setFields(fields)
    })()
  }, [currentLanguage])

  return (
    <ContentfulContext.Provider value={{ fields }}>
      {children}
    </ContentfulContext.Provider>
  )
}
