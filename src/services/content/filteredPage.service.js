import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";

const FilteredPageQuery = `query FilteredPageQuery($cmsFilteredPageId: String!, $type: CMSFilterType!) {
    cmsFilteredPage(id: $cmsFilteredPageId, type: $type) {
      page
    }
  }`

export const CMSFilterType = {
    PRODUCT: 'PRODUCT',
    CATEGORY: 'CATEGORY',
    PAGE_FOR_SEO_ROUTE: 'PAGE_FOR_SEO_ROUTE',
}

// Until the routing strategy is implemented, we need manual mapping between the FS Urls and our FE routes
export const ContentPageMapping = {
  homepage: "/Homepage/index-2.html"
}

  export const getCmsFilteredPage = async (cmsFilteredPageId, type) => {
    const data = await fetchGraphqlApi(FilteredPageQuery, { cmsFilteredPageId, type })
    return data;
}


  