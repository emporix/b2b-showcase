import { useSelector } from 'react-redux'

import CartActionBar from '../cart/CartActionBar'
import CartTable from '../cart/CartTable'
import CartMobileContent from '../cart/CartMobileContent'
import React, { useState } from 'react'
import { createQuoteCall } from '../../services/quotes'
import { TENANT } from '../../constants/localstorage'
import { LargePrimaryButton } from '../../components/Utilities/button'
import './quote.css'
import QuoteSummary from './QuoteSummary'
import { useCart } from 'context/cart-provider'

const QuotePage = () => {
  const [quoteId, setQuoteId] = useState()
  const { getCartAccount, getCartList, cartAccount } = useCart()

  const createQuote = async () => {
    const tenant = localStorage.getItem(TENANT)
    const data = await createQuoteCall(tenant, cartAccount.id)
    setQuoteId(data.id)(getCartList(cartAccount.id))(
      getCartAccount(cartAccount.id)
    )
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-content">
        {!quoteId ? (
          <>
            <CartActionBar classname="lg:block hidden" view={true} />
            <CartTable
              classname="lg:block hidden"
              cartList={cartAccount.items}
            />

            <CartMobileContent
              className="lg:hidden"
              cartList={cartAccount.items}
            />
            <CartActionBar className="lg:hidden" />

            <div className="quote-cart-buttons">
              <LargePrimaryButton
                className="w-auto"
                title="REQUEST QUOTE"
                onClick={() => createQuote()}
              />
            </div>
          </>
        ) : (
          <QuoteSummary quoteId={quoteId} />
        )}
      </div>
    </div>
  )
}
export default QuotePage
