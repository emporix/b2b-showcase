export const getEmporixAPIAccessToken = async () => {
  //This shall be stored in memory cache.
  //However, this is PoC based on React, so we must use localstorage to not lose data, after we close a cart.
  const accessToken = localStorage.getItem('emporixAccessToken')
  const expiresAt = parseInt(
    localStorage.getItem('emporixAccessTokenExpiresAt')
  )
  if (
    !isNaN(expiresAt) &&
    typeof expiresAt === 'number' &&
    new Date().getTime() <= expiresAt
  ) {
    return accessToken
  }
  const formData = {
    client_id: process.env.REACT_APP_EMPORIX_CLIENT_ID,
    client_secret: process.env.REACT_APP_EMPORIX_CLIENT_SECRET,
    grant_type: 'client_credentials',
  }
  try {
    const responseRaw = await fetch(`https://api.emporix.io/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
    })
    if (responseRaw.status !== 200) {
      throw {
        error: 'Could not get access token',
      }
    }
    const responseJSON = await responseRaw.json()
    const { expires_in, access_token: newAccessToken } = responseJSON
    const newExpiresAt = new Date().getTime() + (expires_in - 180) * 1000 //180 second error margin
    localStorage.setItem('emporixAccessToken', newAccessToken)
    localStorage.setItem('emporixAccessTokenExpiresAt', newExpiresAt.toString())
    return newAccessToken
  } catch (e) {
    console.log(e)
    throw 'could not get emporix access token'
  }
}
