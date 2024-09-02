import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SignupZendesk from './pages/SignupZendesk'
import Home from './pages/home'
import Cart from './pages/cart'
import QuickOrder from './pages/quickorder'
import AboutUs from './pages/aboutus'
import Checkout from './pages/checkout'
import {ProductDetails} from './pages/product'
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
import {history} from './helpers/history'
import {clearMessage} from './redux/slices/messageReducer'
import QuoteCart from './pages/quote'
import AccountReturns from 'pages/account/AccountReturns'
import AccountReturnDetails from './pages/account/AccountReturnDetails'
import ReturnsProvider from 'context/returns-provider'
import UserAddressProvider from 'context/user-addresss-context'
import AccountMyDiscounts from 'pages/account/AccountMyDiscounts'
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
import StoreFinder from 'pages/storefinder'
import ContentOverview from './pages/content/ContentOverview'
import ContentPage from './pages/content/ContentPage'
import ProductsDescription from 'pages/chatbot/ProductsDescription'
import NewsPage from './pages/news/NewsPage'
import GlossaryPage from './pages/glossary/GlossaryPage'
import TechnicalPage from './pages/technical/TechnicalPage'
import SearchResultPage from './pages/search/SearchResultPage'

import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'


i18n.use(initReactI18next).init({
	resources: {
		en: {
			homepage: {
				experience: 'Experience',
				luxury: 'luxury',
				neteleven: 'with neteleven',
				wine: 'Wine',
				intro: 'Our exquisite, hand-picked wines reflect the elegance and quality you expect from neteleven',
				start_shopping: 'Start shopping',
				delivery_header: 'Free delivery',
				delivery_description: 'Free delivery on orders over €50',
				fast_delivery_header: 'Express delivery',
				fast_delivery_description: 'Express delivery for quick wine enjoyment.',
				fidelity_header: 'Loyalty bonus',
				fidelity_description: 'Collect and save with our loyalty program.',
				warranty_header: 'Extend warranty',
				warranty_description: 'Secure your purchase with an extended warranty.',
				newsletter: 'Subscribe to our newsletter and receive the latest news and offers',
				subscribe: 'subscribe now',
				name: 'First name',
			},
			page: {
				news: 'News',
				technical: 'Technical Page',
				content: 'Content',
				catalog: 'Catalog',
				about_us: 'About Us',
				contentPath: '/n11showcase/Content',
				back_to_overview: 'Back to Overview',
				show_all: 'Show all',
				all_countries: 'All Countries',
				categories: 'Categories',
				product: 'Products',
				all_wines: 'All Wines',
				white_wine: 'White Wine',
				red_wine: 'Red Wine',
				rose_wine: 'Rosé Wine',
				website: 'Go to website',
				mailto: 'Send Email',
				negotiated: 'Your negotiated price',
				public: 'List Price',
				excl_vat: 'Excl. VAT',
				incl_vat: 'Incl. VAT',
				in_stock: 'In Stock',
				out_stock: 'Out Of Stock',
				add_cart: 'add to cart',
				view_var: 'view variants',
				no_price: 'No Price',
				more_dtls: 'More Details',
				login: 'Login',
				register: 'Register',
				signup: 'Sign Up',
				signout: 'Sign Out',
				back: 'Back',
				site: 'Site',
				language: 'Language',
				currency: 'Currency',
				glossary: 'Glossary',
				glossary_term: 'Begriff',
				glossary_descr: 'Beschreibung',
				quantity: 'Quantity',
				unit_price: 'Unit Price',
				quantity_discount: 'Quantity Discount',
				wines: 'Wines'
			},
			account: {
				account: 'My Account',
				signout: 'Sign Out',
				personal: 'Personal Details',
				company: 'Company',
				phone: 'Phone',
				mail: 'Email',
				edit: 'Edit Profile',
				summary: 'Summary',
				total: 'Total spent in April',
				limit: 'Your monthly limit',
				outstanding: 'Outstanding',
				refunds: 'Refunds',
				recent: 'Recent Orders',
				saved: 'Saved Carts',
				action: 'View All',
			},
			cart: {
				mycart: 'My Cart',
				items: 'Items',
				checkout: 'go to checkout',
				goto_cart: 'go to cart',
				quote: 'request quote',
				total_price: 'Total Price',
				subtotal_vat: 'Subtotal with VAT',
				subtotal: 'Subtotal without VAT',
				vat: 'VAT',
				of: 'of',
				excluding: 'Excluding VAT',
				including: 'Including VAT',
				excluding_short: 'ex. VAT',
				including_short: 'incl. VAT',
				shipping_costs: 'Shipping Costs',
				procurement: 'Transfer to Procurementsystem',
				quantity: 'Quantity',
				discount: 'Discount amount',
				products: 'Products',
				product: 'Product',
				price: 'Price',
				shopping_cart: 'Shopping Cart',
				delivery_time: 'Est. delivery time',
				days: 'days',
				unit_price: 'Unit Price',
				subtotal_short: 'Subtotal',
				discount_short: 'Discount',
				save_cart: 'Save cart',
				load_cart: 'Load cart',
				empty_cart: 'Empty shopping cart',
				auto_replenish: 'Create Auto-Replenish Orders',
				share_cart: 'Share Cart',
			},
			address: {
				contact: 'Contact Name',
				street: 'Street',
				streetnumber: 'St. Number',
				strappendix: 'St. Appendix',
				zipcode: 'Zip Code',
				city: 'City',
				country: 'Country',
				state: 'State',
				tags: 'Tags',
				default: 'Is Default',
			},
			products: {
				description: 'Product Description',
				details: 'Details',
				additional_information: 'Additional Information',
				reviews: 'Reviews',
				related_products: 'Related products',
				no_matching_products: 'No matching products'
			},
			signup: {
				heading2: 'Register as a New User',
				heading4: 'Welcome! Please enter your details',
				heading2_z: 'Register for Help Center',
				heading4_z: 'Create your Help Center Account',
				email: 'E-mail address',
				email_ph: 'joe.doe@zendesk.com',
				email_err: 'Email is invalid',
				password: 'Password',
				password_ph: 'Strong password',
				password_err: 'Password must have at least 6 characters',
				password2: 'Confirm Password',
				password2_ph: 'Confirm Password',
				password2_err: 'Password must be the same',
				firstname: 'First Name',
				firstname_ph: 'Jon',
				firstname_err: 'First Name must be provided',
				lastname: 'Last Name',
				lastname_ph: 'Doe',
				lastname_err: 'Last Name must be provided',
				company: 'Company',
				company_ph: 'Company Name',
				registration: 'Registration Number',
				registration_ph: '123-456-789',
				registration_err: 'Registration Number must be provided',
				phone: 'Phone Number',
				phone_ph: 'Phone Number',
				address: 'Address',
				address_err: 'Correct address must be provided',
				address_ship: 'Shipping Address',
				address_ship_err: 'Correct shipping address must be provided',
				address_bill: 'Billing Address',
				address_bill_err: 'Correct billing address must be provided',
				signup: 'Sign Up',
			},
			search: {
				label: 'Search mach11.de',
				ascending: 'Ascending',
				descending: 'Descending',
				sortBy: 'Sort by:',
				more: 'Show more',
				less: 'Show less',
			}
		},
		de: {
			homepage: {
				experience: 'Erleben Sie den',
				luxury: 'Luxus',
				neteleven: 'mit neteleven',
				wine: 'Wein',
				intro: 'Unsere exquisiten, handverlesenen Weine spiegeln die Eleganz und Qualität wider, die Sie von neteleven erwarten',
				start_shopping: 'Beginn mit dem Einkauf',
				delivery_header: 'Kostenlose Lieferung',
				delivery_description: 'Kostenlose Lieferung ab einem Bestellwert von 50 €',
				fast_delivery_header: 'Schnelle Lieferung',
				fast_delivery_description: 'Expresslieferung für schnellen Weingenuss.',
				fidelity_header: 'Treueprämie',
				fidelity_description: 'Sammeln und sparen mit unserem Treueprogramm.',
				warranty_header: 'Garantie verlängern',
				warranty_description: 'Sichern Sie Ihren Kauf mit erweiterter Garantie.',
				newsletter: 'Abonnieren Sie unseren Newsletter und erhalten sie die neuesten Nachrichten und Angebote',
				subscribe: 'Jetzt Abonnieren',
				name: 'Vorname',
			},
			page: {
				news: 'Neuigkeiten',
				technical: 'Technische Seite',
				content: 'Inhalt',
				catalog: 'Katalog',
				about_us: 'Über uns',
				contentPath: '/n11showcase/Inhalt',
				back_to_overview: 'Zurück zur Übersicht',
				show_all: 'Alle anzeigen',
				all_countries: 'Alle Länder',
				all_wines: 'Alle Weine',
				categories: 'Kategorien',
				product: 'Produkte',
				white_wine: 'Weißwein',
				red_wine: 'Rotwein',
				rose_wine: 'Rosé',
				website: 'Webseite besuchen',
				mailto: 'Email anschreiben',
				negotiated: 'Ausgehandelter Preis',
				public: 'Katalogpreis',
				excl_vat: 'Exkl. MwSt.',
				incl_vat: 'Inkl. MwSt.',
				in_stock: 'Auf Lager',
				out_stock: 'Nicht verfügbar',
				add_cart: 'in den Warenkorb',
				view_var: 'mehr optionen',
				no_price: 'kein Preis',
				more_dtls: 'Weitere Info',
				login: 'Anmelden',
				register: 'Registrieren',
				signup: 'Konto erstellen',
				signout: 'Abmelden',
				back: 'Zurück',
				site: 'Land',
				language: 'Sprache',
				currency: 'Währung',
				glossary: 'Glossar',
				glossary_term: 'Begriff',
				glossary_descr: 'Beschreibung',
				quantity: 'Menge',
				unit_price: 'Preis pro Einheit',
				quantity_discount: 'Mengenrabatt',
				wines: 'Weine'
			},
			account: {
				account: 'Mein Konto',
				signout: 'Abmelden',
				personal: 'Personal Details',
				company: 'Company',
				phone: 'Phone',
				mail: 'Email',
				edit: 'Edit Profile',
				summary: 'Summary',
				total: 'Total spent in April',
				limit: 'Your monthly limit',
				outstanding: 'Outstanding',
				refunds: 'Refunds',
				recent: 'Recent Orders',
				saved: 'Saved Carts',
				action: 'View All',
			},
			cart: {
				mycart: 'Mein Warenkorb',
				items: 'Produkte',
				checkout: 'Zur Kasse gehen',
				goto_cart: 'Gehe zum Warenkorb',
				quote: 'Angebot anfordern',
				total_price: 'Gesamtpreis',
				subtotal_vat: 'Zwischensumme mit Mehrwertsteuer',
				subtotal: 'Zwischensumme ohne Mehrwertsteuer',
				vat: 'Mehrwertsteuer',
				of: 'von',
				excluding: 'ohne Mehrwertsteuer',
				including: 'mit Mehrwertsteuer',
				excluding_short: 'ohne MwSt.',
				including_short: 'incl. VAT',
				shipping_costs: 'Lieferkosten',
				procurement: 'Übertragung zum Beschaffungssystem',
				quantity: 'Menge',
				discount: 'Rabattbetrag',
				products: 'Produkte',
				product: 'Produkt',
				price: 'Preis',
				shopping_cart: 'Warenkorb',
				delivery_time: 'gesch. Lieferzeit',
				days: 'Tage',
				unit_price: 'Stückpreis',
				subtotal_short: 'Zwischensumme',
				discount_short: 'Rabatt',
				save_cart: 'Warenkorb speichern',
				load_cart: 'Warenkorb laden',
				empty_cart: 'Warenkorb leeren',
				auto_replenish: 'Erstellen Sie Bestellungen mit automatischer Auffüllung',
				share_cart: 'Warenkorb teilen',
			},
			address: {
				contact: 'Kontakte',
				street: 'Straße',
				streetnumber: 'Hausnummer',
				strappendix: 'Zusatz',
				zipcode: 'PLZ',
				city: 'Stadt',
				country: 'Land',
				state: 'Bundesland',
				tags: 'Tags',
				default: 'Ist Default',
			},
			products: {
				description: 'Produktbeschreibung',
				details: 'Details',
				additional_information: 'Zusätzliche Informationen',
				reviews: 'Bewertungen',
				related_products: 'Verwandte Produkte',
				no_matching_products: 'Keine passenden Produkte'
			},
			signup: {
				heading2: 'Register as a New User',
				heading4: 'Welcome! Please enter your details',
				heading2_z: 'Register for Help Center',
				heading4_z: 'Create your Help Center Account',
				email: 'E-mail address',
				email_ph: 'joe.doe@zendesk.com',
				email_err: 'Email is invalid',
				password: 'Password',
				password_ph: 'Strong password',
				password_err: 'Password must have at least 6 characters',
				password2: 'Confirm Password',
				password2_ph: 'Confirm Password',
				password2_err: 'Password must be the same',
				firstname: 'First Name',
				firstname_ph: 'Jon',
				firstname_err: 'First Name must be provided',
				lastname: 'Last Name',
				lastname_ph: 'Doe',
				lastname_err: 'Last Name must be provided',
				company: 'Company',
				company_ph: 'Company Name',
				registration: 'Registration Number',
				registration_ph: '123-456-789',
				registration_err: 'Registration Number must be provided',
				phone: 'Phone Number',
				phone_ph: 'Phone Number',
				address: 'Address',
				address_err: 'Correct address must be provided',
				address_ship: 'Shipping Address',
				address_ship_err: 'Correct shipping address must be provided',
				address_bill: 'Billing Address',
				address_bill_err: 'Correct billing address must be provided',
				signup: 'Sign Up',
			},
			search: {
				label: 'Durchsuche mach11.de',
				ascending: 'Aufsteigend',
				descending: 'Absteigend',
				sortBy: 'Sortieren nach:',
				more: 'Mehr anzeigen',
				less: 'Weniger anzeigen',
			}
		},
	},
	lng: 'de',
	fallbackLng: 'de',
	interpolation: {
		escapeValue: false,
	},
})

function App() {


  const dispatch = useDispatch()
  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage())
    })
    if (window.DqmHeadlessConnector && window.WE_API) {
      const dqmConnector = new window.DqmHeadlessConnector();
      dqmConnector.refreshDqmReport();
    }
  }, [dispatch])

	return (
		<Router>
			<Routes>
				<Route path="auth0" exact element={<Auth0Callback/>}/>
				<Route path="/:tenant">
					<Route index exact element={<Home/>}/>

					{/*<Route path="product/:maincategory" exact element={<ProductList />} />*/}
					{/*<Route path="product/:maincategory/:subcategory/" exact element={<ProductList />} />*/}
					{/*<Route path="product/:maincategory/:subcategory/:category" exact element={<ProductList />} />*/}
					<Route path="product/details/:productId" element={<ProductDetails/>}/>

					<Route path="login" exact element={<Login/>}/>
					<Route path="reset-password" exact element={<ResetPassword/>}/>
					<Route path="signup" exact element={<Signup/>}/>
					<Route path="brand" exact element={<Brand/>}/>
					<Route path="signup-helpcenter" exact element={<SignupZendesk/>}/>

					<Route path="cart" exact element={<Cart/>}/>
					<Route path="create-return/:orderId" exact element={<CreateReturn/>}/>
					<Route path="checkout" exact element={<Checkout/>}/>
					<Route path="saved-carts/:approvalId/checkout" exact element={<ApprovalCheckout/>}/>
					<Route path="approval-request" exact element={<ApprovalRequest/>}/>
					<Route path="approval-order-created" exact element={<ApprovalOrderCreated/>}/>

					<Route path="payment-callback" exact element={<PaymentCallback/>}/>
					<Route path="saferpay-callback" exact element={<SaferpayPaymentCallback/>}/>
					<Route path="quote" exact element={<QuoteCart/>}/>

					<Route
						path="my-account"
						element={
							<UserAddressProvider>
								<ReturnsProvider>
									<Account/>
								</ReturnsProvider>
							</UserAddressProvider>
						}
					>
						<Route index element={<AccountHome/>}/>
						<Route path="account-summary" element={<MyAccount/>}/>
						<Route path="personal-details" element={<AccountPersonalDetails/>}/>
						<Route path="manage-users" element={<AccountManageUsers/>}/>
						<Route path="addresses" element={<Addresses/>}/>
						<Route path="addresses/:addressId" element={<AddressEdit/>}/>
						<Route path="addresses/new" element={<AddressEdit/>}/>
						<Route path="company-details" element={<AccountCompanyDetails/>}/>
						<Route path="my-orders" exact element={<AccountMyOrders/>}/>
						<Route path="my-subscriptions" exact element={<AccountMySubscriptions/>}/>
						<Route path="my-quotes" exact element={<AccountMyQuotes/>}/>
						<Route path="discounts" exact element={<AccountMyDiscounts/>}/>

						<Route path="my-quotes/:quoteId" element={<AccountMyQuoteDetails/>}/>
						<Route path="my-orders/view/:orderId" exact element={<AccountMyOrdersView/>}/>
						<Route path="my-orders/invoice/:orderId" exact element={<AccountMyOrdersInvoice/>}/>
						<Route path="returns" exact element={<AccountReturns/>}/>
						<Route path="returns/:returnId" exact element={<AccountReturnDetails/>}/>
						<Route path="replenishment-orders" exact element={<AccountReplenishmentOrders/>}/>
						<Route path="replenishment-orders/add" exact element={<AccountReplenishmentAddOrders/>}/>
						<Route path="replenishment-orders/edit" exact element={<AccountReplenishmentEditOrders/>}/>
						<Route path="saved-carts" element={<AccountSavedCarts/>}/>
						<Route path="saved-carts/:approvalId" element={<AccountMyOrdersDetails/>}/>
						<Route path="locations" exact element={<AccountLocations/>}/>
						<Route path="my-subscriptions/:action/:orderId/:productId" exact
							   element={<SubscriptionDetails/>}/>
						<Route path="locations/add" exact element={<AccountAddLocations/>}/>
						<Route path="payments" exact element={<AccountPayments/>}/>
						<Route path="payments/edit_card_details" element={<AccountPaymentsEditCardDetails/>}/>
						<Route path="reviews" element={<AccountReviews/>}/>
					</Route>

					<Route path="quick_order" element={<QuickOrder/>}/>
					<Route path="aboutus" element={<AboutUs/>}/>
					<Route path="storefinder" element={<StoreFinder/>}/>

					<Route path="Content" element={<ContentOverview/>}/>
					<Route path="Inhalt" element={<ContentOverview/>}/>
					<Route path="Content/:contentName" element={<ContentPage/>}/>
					<Route path="Inhalt/:contentName" element={<ContentPage/>}/>

					<Route path="News" element={<NewsPage/>}/>
					<Route path="Neuigkeiten" element={<NewsPage/>}/>

					<Route path="Technical" element={<TechnicalPage/>}/>

					<Route path="Glossary" element={<GlossaryPage/>}/>
					<Route path="Glossar" element={<GlossaryPage/>}/>

					<Route path="catalog" element={<SearchResultPage/>}/>

					<Route path="products-description/:maincategory" element={<ProductsDescription lang="en"/>}/>
					<Route path="produkte-beschreibung/:maincategory" element={<ProductsDescription lang="de"/>}/>

					<Route path="*" element={<NoPage/>}/>
				</Route>
				<Route path="*" element={<Home/>}/>
			</Routes>
		</Router>
	)
}

export default App
