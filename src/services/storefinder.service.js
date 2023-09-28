const { fetchGraphqlApi } = require("graphql/utils/fetch-graphql-api")

const DealerQuery = `query DealerQuery {
    dealers {
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
  }`


export const getDealers = async () => {
    const data = await fetchGraphqlApi(DealerQuery)

    return data;
}