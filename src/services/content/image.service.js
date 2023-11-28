import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";

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
