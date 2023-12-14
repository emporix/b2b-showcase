import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/home'
import Cart from './pages/cart'
import QuickOrder from './pages/quickorder'
import AboutUs from './pages/aboutus'
import Checkout from './pages/checkout'
import ProductList, { ProductDetails } from './pages/product'
import Account from './pages/account'
import AccountHome from './pages/account/AccountHome'
import MyAccount from './pages/account/MyAccount'
import AccountPersonalDetails from './pages/account/AccountPersonalDetails'
import AccountCompanyDetails from './pages/account/AccountCompanyDetails'
import AccountMyOrders from './pages/account/AccountMyOrders'
import AccountMyQuotes from './pages/account/AccountMyQuotes'
import AccountMyQuoteDetails from './pages/account/AccountMyQuoteDetails'
import AccountMyOrdersView from './pages/account/AccountMyOrdersView'
import AccountMyOrdersInvoice from './pages/account/AccountMyOrdersInvoice'
import AccountReplenishmentOrders from './pages/account/AccountReplenishmentOrders'
import AccountReplenishmentAddOrders from './pages/account/AccountReplenishmentAddOrders'
import AccountReplenishmentEditOrders from './pages/account/AccountReplenishmentEditOrders'
import AccountSavedCarts from './pages/account/AccountSavedCarts'
import AccountMyOrdersDetails from 'pages/account/AccountSavedCartDetails'
import AccountLocations from './pages/account/AccountLocations'
import Brand from './pages/brand'
import CreateReturn from './pages/returns/Return'
import AccountAddLocations from './pages/account/AccountAddLocations'
import AccountPayments from './pages/account/AccountPayments'
import AccountReviews from './pages/account/AccountReviews'
import AccountPaymentsEditCardDetails from './pages/account/AccountPaymentsEditCardDetails'
import NoPage from './pages/NoPage'
import { history } from './helpers/history'
import { clearMessage } from './redux/slices/messageReducer'
import InvalidTenant from './pages/InvalidTenant'
import QuoteCart from './pages/quote'
import AccountReturns from 'pages/account/AccountReturns'
import AccountReturnDetails from './pages/account/AccountReturnDetails'
import ReturnsProvider from 'context/returns-provider'
import UserAddressProvider from 'context/user-addresss-context'
import MyDiscounts from 'pages/account/MyDiscounts'
import Addresses from 'pages/account/addresses/Addresses'
import AddressEdit from 'pages/account/addresses/AddressEdit'
import AccountMySubscriptions from 'pages/account/AccountMySubscriptions'
import SubscriptionDetails from 'pages/account/SubscriptionDetails'
import PaymentCallback from 'pages/checkout/PaymentCallback'
import SaferpayPaymentCallback from 'pages/checkout/SaferpayPaymentCallback'
import ApprovalRequest from 'pages/checkout/ApprovalRequest'
import ApprovalCheckout from 'pages/approval'
import ApprovalOrderCreated from 'pages/approval/ApprovalOrderCreated'
import AccountManageUsers from 'pages/account/AccountManageUsers'
import ResetPassword from 'pages/ResetPassword'
import Auth0Callback from 'pages/Auth0Callback'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage())
    })
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route
            path="auth0"
            exact
            element={<Auth0Callback />}
          />
        <Route path="/:tenant">
          <Route index exact element={<Home />} />

          <Route path="product/:maincategory" exact element={<ProductList />} />
          <Route
            path="product/:maincategory/:subcategory/"
            exact
            element={<ProductList />}
          />
          <Route
            path="product/:maincategory/:subcategory/:category"
            exact
            element={<ProductList />}
          />
          <Route
            path="product/details/:productId"
            element={<ProductDetails />}
          />
          <Route path="login" exact element={<Login />} />
          <Route path="reset-password" exact element={<ResetPassword />} />
          <Route path="signup" exact element={<Signup />} />
          <Route path="brand" exact element={<Brand />} />
          <Route path="cart" exact element={<Cart />} />
          <Route
            path="create-return/:orderId"
            exact
            element={<CreateReturn />}
          />
          <Route path="checkout" exact element={<Checkout />} />
          <Route path="saved-carts/:approvalId/checkout" exact element={<ApprovalCheckout />} />
          <Route path="approval-request" exact element={<ApprovalRequest />} />
          <Route path="approval-order-created" exact element={<ApprovalOrderCreated />} />

          <Route path="payment-callback" exact element={<PaymentCallback />} />
          <Route
            path="saferpay-callback"
            exact
            element={<SaferpayPaymentCallback />}
          />
          <Route path="quote" exact element={<QuoteCart />} />
          <Route
            path="my-account"
            element={
              <UserAddressProvider>
                <ReturnsProvider>
                  <Account />
                </ReturnsProvider>
              </UserAddressProvider>
            }
          >
            <Route index element={<AccountHome />} />
            <Route path="account-summary" element={<MyAccount />} />
            <Route
              path="personal-details"
              element={<AccountPersonalDetails />}
            />
            <Route path="manage-users" element={<AccountManageUsers />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="addresses/:addressId" element={<AddressEdit />} />
            <Route path="addresses/new" element={<AddressEdit />} />
            <Route path="company-details" element={<AccountCompanyDetails />} />
            <Route path="my-orders" exact element={<AccountMyOrders />} />
            <Route
              path="my-subscriptions"
              exact
              element={<AccountMySubscriptions />}
            />
            <Route path="my-quotes" exact element={<AccountMyQuotes />} />
            <Route path="discounts" exact element={<MyDiscounts />} />

            <Route
              path="my-quotes/:quoteId"
              element={<AccountMyQuoteDetails />}
            />
            <Route
              path="my-orders/view/:orderId"
              exact
              element={<AccountMyOrdersView />}
            />
            <Route
              path="my-orders/invoice/:orderId"
              exact
              element={<AccountMyOrdersInvoice />}
            />
            <Route path="returns" exact element={<AccountReturns />} />
            <Route
              path="returns/:returnId"
              exact
              element={<AccountReturnDetails />}
            />
            <Route
              path="replenishment-orders"
              exact
              element={<AccountReplenishmentOrders />}
            />
            <Route
              path="replenishment-orders/add"
              exact
              element={<AccountReplenishmentAddOrders />}
            />
            <Route
              path="replenishment-orders/edit"
              exact
              element={<AccountReplenishmentEditOrders />}
            />
            <Route path="saved-carts" element={<AccountSavedCarts />} />
            <Route
              path="saved-carts/:approvalId"
              element={<AccountMyOrdersDetails />}
            />
            <Route path="locations" exact element={<AccountLocations />} />
            <Route
              path="my-subscriptions/:action/:orderId/:productId"
              exact
              element={<SubscriptionDetails />}
            />
            <Route
              path="locations/add"
              exact
              element={<AccountAddLocations />}
            />
            <Route path="payments" exact element={<AccountPayments />} />
            <Route
              path="payments/edit_card_details"
              element={<AccountPaymentsEditCardDetails />}
            />
            <Route path="reviews" element={<AccountReviews />} />
          </Route>
          <Route path="quick_order" element={<QuickOrder />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="*" element={<InvalidTenant />} />
      </Routes>
    </Router>
  )
}
export default App
