import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, gql } from "@apollo/client";

let client = null

export const getClient = () => {
  if (client != null) return client;

  client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      new HttpLink({
        uri: process.env.REACT_APP_GQL_API_URL || "test"
      })
    ]),
    name: '',
  })

  return client
}

export async function fetchGraphqlApi (
  query,
  variables,
  isMutation
) {

  const client = getClient()

  const context = {
    headers: {
      'accept-language': 'de_DE',
    }
  }

  let res 

  try {
    if (isMutation) {
      res = await client.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
        context
      })
    } else {
        res = await client.query({
          query: gql`
            ${query}
          `,
          variables,
          context,
        })
      }
  } catch(e) {
    console.error(
      'query failed:',
      query,
      'reason:',
      JSON.stringify(e)
    )
    throw e;
  }
  return res
}