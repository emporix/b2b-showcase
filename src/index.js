import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import Store from './redux/store'
import { AppContextProvider } from './context/app-context'
import { AuthProvider } from 'context/auth-provider'
import {
  CURRENT_LANGUAGE_KEY,
  LanguageProvider,
} from './context/language-provider'
import { SitesProvider } from './context/sites-provider'
import { QuotesProvider } from 'context/quotes-context'
import { ContentfulProvider } from './context/contentful-provider'
import CartProvider from 'context/cart-provider'
import CurrencyProvider from 'context/currency-context'
import ProductListProvider from 'context/product-list-context'

import { apiPlugin, storyblokInit } from '@storyblok/react'
import { componentList } from './components/storyblok/storyblok-components'

storyblokInit({
  accessToken: process.env.REACT_APP_STORYBLOK_DRAFT_TOKEN,
  use: [apiPlugin],
  components: componentList(),
})

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
  </Provider>,
)
