import { fetchGraphqlApi } from 'graphql/utils/fetch-graphql-api'

const NavigationQuery = `query NavigationQuery {
    cmsNavigation {
        id
        parentIds
        label
        caasDocumentId
        seoRoute
      }
  }`
  const LocalizedNavigationQuery = `query NavigationQuery($language: Language) {
    cmsNavigation(language: $language) {
        id
        parentIds
        label
        caasDocumentId
        seoRoute
      }
  }`

  export const getLocalizedCmsNavigation = async (language) => {
    return await fetchGraphqlApi(LocalizedNavigationQuery,{language})
  }

  export const getCmsNavigation = async () => {
    return await fetchGraphqlApi(NavigationQuery)
  }
