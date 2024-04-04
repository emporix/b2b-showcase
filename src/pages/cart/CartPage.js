import React from 'react'
import './cart.css'
import CartActionBar from './CartActionBar'
import CartTable from './CartTable'
import CartMobileContent from './CartMobileContent'
import { CartActionPanel } from '../../components/Cart/cart'
import { useCart } from 'context/cart-provider'

const CartPage = () => {
  const { cartAccount } = useCart()
  const subtotalWithoutVat =
    cartAccount.subtotalAggregate && cartAccount.subtotalAggregate.grossValue
      ? cartAccount.subtotalAggregate.grossValue
      : 0

  return (
    <div className="cart-page-wrapper ">
      <div className="cart-page-content">
        <CartActionBar view={true} />
        <div className="lg:block hidden">
          <CartTable cartList={cartAccount.items} />
        </div>

        <div className="lg:hidden">
          <CartMobileContent cartList={cartAccount.items} />
        </div>

        <div className="float-right">
          <div className="cart-action-panel-wrapper ml-auto">
            <CartActionPanel subtotalWithoutVat={subtotalWithoutVat} />
          </div>
        </div>
        <CartActionBar />
      </div>
    </div>
  )
}
export default CartPage
