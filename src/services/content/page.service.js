import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";


const mockContentRef = "https://partner-caas-api.e-spirit.cloud/partner-prod/cec80194-9df9-42ac-921b-97af9c50d0ce.preview.content/93ad72ab-462c-4ff6-ae9c-0f93b64e6ea3.de_DE";

const PageQuery = `query PageQuery($contentReference: String!) {
    cmsContentReference(contentReference: $contentReference) {
      page
    }
  }`

  export const getPage = async (contentReference?) => {
    const data = await fetchGraphqlApi(PageQuery, {contentReference: mockContentRef})
    return data;
}


  