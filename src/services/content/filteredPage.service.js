import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";

const FilteredPageQuery = `query FilteredPageQuery($cmsFilteredPageId: String!, $type: CMSFilterType!, $language: Language) {
  cmsFilteredPage(id: $cmsFilteredPageId, type: $type, language: $language) {
    page
  }
}
`

export const CMSFilterType = {
    PRODUCT: 'PRODUCT',
    CATEGORY: 'CATEGORY',
    NAME: 'NAME'
}

// Until the routing strategy is implemented, we need manual mapping between the FS Urls and our FE routes
export const ContentPageMapping = {
  homepage: "homepage"
}

  export const getCmsFilteredPage = async (cmsFilteredPageId, type, language) => {
    console.log(cmsFilteredPageId, type, language)
    const data = await fetchGraphqlApi(FilteredPageQuery, { cmsFilteredPageId, type, language })
    return data;
}


  