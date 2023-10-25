import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";


const mockContentRef = "https://partner-caas-api.e-spirit.cloud/partner-prod/cec80194-9df9-42ac-921b-97af9c50d0ce.preview.content/93ad72ab-462c-4ff6-ae9c-0f93b64e6ea3.de_DE";

const ImageQuery = `query GetImage($imageUrl: String!, $resolution: String!) {
    cmsImage(imageUrl: $imageUrl, resolution: $resolution) {
      url
      extension
      fileSize
      height
      width
      mimeType
    }
  }`

  export const getImage = async (imageUrl) => {
    const data = await fetchGraphqlApi(ImageQuery, {imageUrl, resolution: "ORIGINAL"})
    return data;
}


  