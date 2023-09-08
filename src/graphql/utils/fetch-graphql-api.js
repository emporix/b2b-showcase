import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { APIAuthenticator } from "./api-authenticator";
import config from '../index'

let client = null

export const getClient = (config) => {
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

  const client = getClient(config)

  const apiAuthenticator = new APIAuthenticator(
    client
  )

  const token = await apiAuthenticator.getAccessToken()
  const sessionId = await apiAuthenticator.getSessionIdOrIdToken()

  const context = {
    headers: {
      'x-access-token': token,
      'accept-language': 'de_DE',
      'session-id': sessionId
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
      'query failed (with token: ' + token + '):',
      query,
      'reason:',
      JSON.stringify(e)
    )
    throw e;
  }
  return res
}