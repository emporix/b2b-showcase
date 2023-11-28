import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";


const NavigationQuery = `query NavigationQuery {
    cmsNavigation {
        id
        parentIds
        label
        caasDocumentId
        seoRoute
      }
  }`

  export const getCmsNavigation = async () => {
    const data = await fetchGraphqlApi(NavigationQuery)
    return data;
}
