import { createClient } from 'contentful'
import { useCallback } from 'react'
import { useLanguage } from '../context/language-provider'

const client = createClient({
  space: 'tcme1my38svm',
  accessToken: 'VA24nPhbDVBTvgeHXoKGxiBb11hDuSZp-8viYSAbOzM',
})
export const useContentfulApi = () => {
  const { currentLanguage } = useLanguage()
  const getEntry = useCallback(
    async (entryId) => {
      const { items } = await client.getLocales()
      const pickedLocale = items.find((locale) =>
        locale.code.includes(currentLanguage)
      ) || { code: 'en-GB' }
      return await client.getEntry(entryId, { locale: pickedLocale.code })
    },
    [currentLanguage]
  )

  const getAsset = useCallback(
    async (assetId) => {
      const asset = await client.getAsset(assetId)
      return asset
    },
    [currentLanguage]
  )

  return {
    getEntry,
    getAsset
  }
}
