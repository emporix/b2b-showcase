export const loginMutation = /* GraphQL */ `
  mutation Login($input) {
    login(input: $input) {
      accessToken
      expiresIn
      idToken
    }
  }
`