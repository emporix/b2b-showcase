import { config } from "../index"
import { fetchGraphqlApi } from "graphql/utils/fetch-graphql-api";
import { loginMutation } from "graphql/mutations/login-mutation";
import { setCookie } from "cookies-next";

export async function login(email, password) {
  console.log('Test')
  if(!(email && password)) {
    console.log("Invalid Request")
  }

  let response 

  try {
    const variables = {
      input: {
        email: email,
        password: password
      }
    }

    console.log(variables)

    response = await fetchGraphqlApi(
      loginMutation,
      variables,
      true
    )

    const {
      login: { accessToken, expiresIn, idToken }
    } = response.data

    const ticket = {
      authType: 'customer',
      ticket: {
        accessToken: accessToken,
        expiresIn: expiresIn,
        expiresAt: Date.now() + expiresIn * 1000,
        idToken: idToken
      }
    }

    setCookie(config.authCookieName, JSON.stringify(ticket))

  } catch(err) {
    console.log(err)
    return response.status(401).json({
      data: null,
      errors: [
        {
          message:
            'Cannot find an account that matches the provided credentials',
          code: 'invalid_credentials',
        },
      ],
    })

  }
  
  fetchGraphqlApi("query Products { products { title } }", null, false)
}
