// TODO: no direct export but rather through commerce layer
export const config = {
  authCookieName: process.env.REACT_APP_AUTH_COOKIE_NAME || 'X-Authenticaiton-Token',
  commerceURL: process.env.REACT_APP_GQL_API_URL || '',
  customerCookie: process.env.REACT_APP_CUSTOMER_COOKIE_NAME || ''
}
