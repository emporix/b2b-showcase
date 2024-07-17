import ApiRequest from '..'
import { ZENDESK_ACCESS_TOKEN } from 'constants/localstorage'

export const registerZD = async ({ email, firstName, lastName, company, phoneNumber, address }) => {
  let response
  const accessToken = localStorage.getItem(ZENDESK_ACCESS_TOKEN)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  }

  const payload = {
    user: {
      name: `${firstName} ${lastName}`,
      email: email,
      organization: company,
      phone: phoneNumber,
      user_field: {
        ort: address.city,
        strasse: address.street,
        hausnummer: address.streetNumber,
        bundesland: address.state,
        land: address.country,
      },
    },
  }

  const signupApi = process.env.REACT_APP_ZENDESK_API_URL

  response = await ApiRequest(signupApi, 'post', payload, headers)

  if (response.status === 201) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}
