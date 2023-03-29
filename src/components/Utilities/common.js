import React from 'react'
import './common.css'
import getSymbolFromCurrency from 'currency-symbol-map'
import { useCurrency } from 'context/currency-context'

export const LayoutBetween = ({ children, className }) => {
  return (
    <div
      className={
        'layout-between flex justify-between ' + (className ? className : '')
      }
    >
      {children}
    </div>
  )
}

export const GridLayout = ({ children, className }) => {
  return (
    <div
      className={'grid-layout grid grid-cols-1 ' + (className ? className : '')}
    >
      {children}
    </div>
  )
}

export const Item = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export const Center = ({ children, className }) => {
  return <div className={'text-center grid ' + className}>{children}</div>
}
export const Right = ({ children, className }) => {
  return <div className={'text-right grid ' + className}>{children}</div>
}

export const Container = ({ children, className }) => {
  return (
    <div className={'flex ' + (className ? className : '')}>{children}</div>
  )
}
export const MobileMDContainer = ({ children }) => {
  return <div className="md:hidden">{children}</div>
}
export const DesktopMDContainer = ({ children }) => {
  return <div className="md:block hidden">{children}</div>
}

export const MobileLGContainer = ({ children }) => {
  return <div className="lg:hidden">{children}</div>
}
export const DesktopLGContainer = ({ children }) => {
  return <div className="lg:block hidden">{children}</div>
}

export const MobileXLContainer = ({ children }) => {
  return <div className="xl:hidden">{children}</div>
}
export const DesktopXLContainer = ({ children }) => {
  return <div className="xl:block hidden">{children}</div>
}

export const CurrencyBeforeValue = ({ value, currency }) => {
  const { activeCurrency } = useCurrency()
  return (
    <>
      {currency ? getSymbolFromCurrency(currency) : activeCurrency.symbol}{' '}
      {Number(value) ? Number(value).toFixed(2) : value}
    </>
  )
}

export const CurrencyAfterValue = ({ value, currency }) => {
  const { activeCurrency } = useCurrency()
  return (
    <>
      {Number(value) ? Number(value).toFixed(2) : value}{' '}
      {currency ? getSymbolFromCurrency(currency) : activeCurrency.symbol}
    </>
  )
}

export const CurrencyBeforeComponent = (children) => {
  const { activeCurrency } = useCurrency()
  return <> {activeCurrency.symbol}</>
}

export const formatDateTime = (rawDate) => {
  const date = parseDate(rawDate)
  if (date instanceof Date) {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } else {
    return date
  }
}

export const formatDate = (rawDate) => {
  const date = parseDate(rawDate)
  if (date instanceof Date) {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } else {
    return date
  }
}

export const parseDate = (rawDate) => {
  let date = rawDate
  if (!(date instanceof Date)) {
    try {
      const dateTime = Date.parse(rawDate)
      date = new Date(dateTime)
    } catch {
      return rawDate.toLocaleString()
    }
  }
  return date
}
