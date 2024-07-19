import axios from 'axios'

import { ZENDESK_ACCESS_TOKEN } from 'constants/localstorage'

export const registerZD = async ({ email, firstName, lastName, company, phoneNumber, address }) => {
  const accessToken = localStorage.getItem(ZENDESK_ACCESS_TOKEN)
  const signupApi = process.env.REACT_APP_ZENDESK_API_URL

  const payload = {
    user: {
      name: `${firstName} ${lastName}`,
      email: email,
      'user.organization': company,
      phone: '+49 170 12 45 789',
      user_fields: {
        ort: address.city,
        strasse: address.street,
        hausnummer: address.streetNumber,
        bundesland: address.state,
        land: address.country,
      },
    },
  }

  const config = {
    method: 'POST',
    url: signupApi,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data: payload,
  }

  axios(config)
    .then(function (response) {
      console.log('Response: ', JSON.stringify(response.data))
    })
    .catch(function (error) {
      console.log('Error: ', error)
    })

  return null
}

// const headers = {
//   Accept: 'application/json',
//   'Content-Type': 'application/json',
//   Authorization: 'Basic ' + accessToken,
// }

// const payload = {
//   user: {
//     name: `${firstName} ${lastName}`,
//     email: email,
//     organization: company,
//     phone: phoneNumber,
//     user_field: {
//       ort: address.city,
//       strasse: address.street,
//       hausnummer: address.streetNumber,
//       bundesland: address.state,
//       land: address.country,
//     },
//   },
// }
