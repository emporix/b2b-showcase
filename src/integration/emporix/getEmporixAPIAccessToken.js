let emporixAccessToken
let emporixAccessTokenExpiresAt

export const getEmporixAPIAccessToken = async () => {
  if (
    !isNaN(emporixAccessTokenExpiresAt) &&
    typeof emporixAccessTokenExpiresAt === 'number' &&
    new Date().getTime() <= emporixAccessTokenExpiresAt &&
    emporixAccessToken
  ) {
    return emporixAccessToken
  }
  const formData = {
    client_id: process.env.REACT_APP_EMPORIX_CLIENT_ID,
    client_secret: process.env.REACT_APP_EMPORIX_CLIENT_SECRET,
    grant_type: 'client_credentials',
  }
  try {
    const responseRaw = await fetch(
      `${process.env.REACT_APP_API_URL}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      }
    )
    if (responseRaw.status !== 200) {
      throw {
        error: 'Could not get access token',
      }
    }
    const responseJSON = await responseRaw.json()
    const { expires_in, access_token: newAccessToken } = responseJSON
    emporixAccessToken = newAccessToken
    emporixAccessTokenExpiresAt =
      new Date().getTime() + (expires_in - 180) * 1000 //180 second error margin
    return newAccessToken
  } catch (e) {
    console.log(e)
    throw 'could not get emporix access token'
  }
}
