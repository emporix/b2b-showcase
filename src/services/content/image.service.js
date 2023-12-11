import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";

const ImageQuery = `query GetImage($imageUrl: String!, $resolution: String!, $language: Language) {
    cmsImage(imageUrl: $imageUrl, resolution: $resolution, language: $language) {
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


  