import { TENANT } from '../constants/localstorage'
export const grantType = 'client_credentials'

const API_URL = process.env.REACT_APP_API_URL

const getTenant = () => localStorage.getItem(TENANT)

export const serviceTokenApi = () => `${API_URL}/oauth/token`
export const categoryApi = () =>
  `${API_URL}/category/${getTenant()}/category-trees`
export const productApi = () => `${API_URL}/product/${getTenant()}/products`
export const retrievResourceApi = (categoryId) =>
  `${API_URL}/category/${getTenant()}/categories/${categoryId}/assignments`
export const availabilityApi = () =>
  `${API_URL}/availability/${getTenant()}/availability`
export const productApiWithYrn = () =>
  `${API_URL}/product/${getTenant()}/search`
export const anonymousTokenApi = () =>
  `${API_URL}/customerlogin/auth/anonymous/login`
export const brandApi = () => `${API_URL}/brand/brands`
export const ordersApi = () => `${API_URL}/order-v2/${getTenant()}/orders`
export const resourceReferenceApi = () =>
  `${API_URL}/category/${getTenant()}/assignments/references`
export const parentCategoriesApi = () =>
  `${API_URL}/category/${getTenant()}/categories`
export const getCartAccountApi = () => `${API_URL}/cart/${getTenant()}/carts`
export const getCartById = (cartId) =>
  `${API_URL}/cart/${getTenant()}/carts/${cartId}`
export const getCartMergeUrl = (cartId) =>
  `${API_URL}/cart/${getTenant()}/carts/${cartId}/merge`
export const getRewardPoints = () => `${API_URL}/reward-points/public/customer`
export const getRedeemOptions = () => `${API_URL}/reward-points/public/customer/redeemOptions`
export const redeemCouponForPoints = () => `${API_URL}/reward-points/public/customer/redeem`
export const cartItemApi = () => `${API_URL}/cart/${getTenant()}/carts`
export const cartApi = () => `${API_URL}/cart/${getTenant()}/carts`
export const cartProductsApi = () => `${API_URL}/cart/${getTenant()}/carts`
export const cartRemoveApi = () => `${API_URL}/cart/${getTenant()}/carts`
export const cartItemUrl = (cartId, itemId) => {
  return `${API_URL}/cart/${getTenant()}/carts/${cartId}/items/${itemId}`
}
export const priceApi = () =>
  `${API_URL}/price/${getTenant()}/match-prices-by-context`
export const currencyApi = () => `${API_URL}/currency/${getTenant()}/currencies`
export const triggerCheckoutApi = () =>
  `${API_URL}/checkout/${getTenant()}/checkouts/order`
export const countriesApi = () =>
  `${API_URL}/country/${getTenant()}/countries`
// URLS
export const addLocationUrl = () => `/${getTenant()}/my-account/locations/add`
export const myAccountLocationUrl = () => `/${getTenant()}/my-account/locations`
export const paymentEditCardDetailUrl = () =>
  `/${getTenant()}/my-account/payments/edit_card_details`
export const myAccountPaymentUrl = () => `/${getTenant()}/my-account/payments`
export const myAccountReplenishmentOrdersUrl = () =>
  `/${getTenant()}/my-account/replenishment-orders`
export const addReplenishmentOrdersUrl = () =>
  `/${getTenant()}/my-account/replenishment-orders/add`
export const editReplenishmentOrdersUrl = () =>
  `/${getTenant()}/my-account/replenishment-orders/edit`
export const myAccountQuotes = () => `/${getTenant()}/my-account/my-quotes`
export const myAccountMyOrders = () => `/${getTenant()}/my-account/my-orders`
export const myAccountMyOrdersViewUrl = () =>
  `/${getTenant()}/my-account/my-orders/view/`
export const myAccountMyOrdersInvoiceUrl = () =>
  `/${getTenant()}/my-account/my-orders/invoice/`
  export const createReturnUrl = () =>
  `/${getTenant()}/create-return/`
export const checkoutUrl = () => `/${getTenant()}/checkout`
export const quoteUrl = () => `/${getTenant()}/quote`
export const cartUrl = () => `/${getTenant()}/cart`
export const loginUrl = () => `/${getTenant()}/login`
export const homeUrl = () => `/${getTenant()}`
export const signupUrl = () => `/${getTenant()}/signup`
export const productUrl = () => `/${getTenant()}/product`
export const addTenantToUrl = (url) => `/${getTenant()}/${url}`

export const fetchReturnsUrl = () => `/return/${getTenant()}/returns`
export const fetchSingleReturnUrl = (id) => `/return/${getTenant()}/returns/${id}`
