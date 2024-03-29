import React from 'react'
import './cart.css'
import CartActionBar from './CartActionBar'
import CartTable from './CartTable'
import CartMobileContent from './CartMobileContent'
import { CartActionPanel } from '../../components/Cart/cart'
import { useCart } from 'context/cart-provider'

const CartPage = () => {
  const { cartAccount } = useCart()
  return (
    <div className="cart-page-wrapper ">
      <div className="cart-page-content">
        <CartActionBar view={true} />
        <div className="lg:block hidden border rounded border-quartz p-6">
          <CartTable cartList={cartAccount.items} />
        </div>

        <div className="lg:hidden">
          <CartMobileContent cartList={cartAccount.items} />
        </div>

        <div className="float-right">
          <div className="cart-action-panel-wrapper ml-auto">
            <CartActionPanel showShipping={false}/>
          </div>
        </div>
        <CartActionBar />
      </div>
    </div>
  )
}
export default CartPage
