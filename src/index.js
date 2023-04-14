import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import Store from './redux/store'
import { AppContextProvider } from './context/app-context'
import { AuthProvider } from 'context/auth-provider'
import { LanguageProvider } from './context/language-provider'
import { SitesProvider } from './context/sites-provider'
import { QuotesProvider } from 'context/quotes-context'
import { ContentfulProvider } from './context/contentful-provider'
import CartProvider from 'context/cart-provider'
import CurrencyProvider from 'context/currency-context'
import ProductListProvider from 'context/product-list-context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={Store}>
        <AuthProvider>
            <AppContextProvider>
                <SitesProvider>
                    <CartProvider>
                        <CurrencyProvider>
                            <QuotesProvider>
                                <LanguageProvider>
                                    <ContentfulProvider>
                                        <ProductListProvider>
                                            <App />
                                        </ProductListProvider>
                                    </ContentfulProvider>
                                </LanguageProvider>
                            </QuotesProvider>
                        </CurrencyProvider>
                    </CartProvider>
                </SitesProvider>
            </AppContextProvider>
        </AuthProvider>
    </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
