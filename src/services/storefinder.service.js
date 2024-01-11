const { fetchGraphqlApi } = require("graphql/utils/fetch-graphql-api")

const DealerQuery = `query DealerQuery($language: Language) {
  dealers(language: $language) {
    id
    name
    latitude
    longitude
    street
    houseNumber
    zipCode
    city
    country
    phoneNumber
    email
    website
  }
}
`


export const getDealers = async (language) => {
    const data = await fetchGraphqlApi(DealerQuery, { language })

    return data;
}