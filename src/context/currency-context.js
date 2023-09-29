import getSymbolFromCurrency from 'currency-symbol-map'
import React, { createContext, useContext, useEffect, useState } from 'react'
import currencyService from 'services/currency.service'
import cartService from 'services/cart.service'
import { useAppContext } from './app-context'
import { useSites } from './sites-provider'
import { useCart } from './cart-provider'

const CurrencyContext = createContext({})

export const useCurrency = () => useContext(CurrencyContext)

const CurrencyProvider = ({ children }) => {
  const { updateContext, context } = useAppContext()
  const { currentSite } = useSites()
  const { cartAccount } = useCart()
  const [currencyList, setCurrencyList] = useState([
    {
      code: 'EUR',
      symbol: getSymbolFromCurrency('EUR'),
    },
  ])

  const [activeCurrency, setActiveCurrency] = useState({
    code: 'EUR',
    symbol: getSymbolFromCurrency('EUR'),
  })

  const syncCurrencies = async () => {
    const currencies = await currencyService.getAllCurrencies()
    const currencyListWithSymbol = currencies.map((c) => {
      return {
        code: c.code,
        symbol: getSymbolFromCurrency(c.code),
      }
    })
    setCurrencyList(currencyListWithSymbol)

    if (currencyListWithSymbol.length > 0) {
      const activeCurrency =
        currencyListWithSymbol.find((cur) => {
          return cur.code === context.currency
        }) || currencyListWithSymbol[0]
      setActiveCurrency(activeCurrency)
    } else {
      throw new Error('currency list is empty')
    }
  }

  const updateCurrency = async (value, site) => {
    cartService.changeCurrency(value, cartAccount.id)
    setActiveCurrency({
      code: value,
      symbol: getSymbolFromCurrency(value),
    })

    await updateContext({
      currency: value,
      siteCode: site.code,
      targetLocation: site.homeBase.address.country,
    })
  }

  useEffect(() => {
    syncCurrencies()
  }, [])

  const value = {
    currencyList,
    activeCurrency,
    syncCurrencies,
    updateCurrency,
  }
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export default CurrencyProvider
