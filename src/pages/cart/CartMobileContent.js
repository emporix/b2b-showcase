import Reactd from 'react'
import { GridLayout } from '../../components/Utilities/common'
import { CartProductCaption, CartMobileItem } from '../../components/Cart/cart'
import './cart.css'

const CartMobileContent = ({ cartList, className, cart }) => {
  return (
    <GridLayout className={`${className} gap-6`}>
      <CartProductCaption />
      {cartList.map((cartItem, idx) => (
        <CartMobileItem
          cartItem={cartItem}
          cart={cart}
          key={cartItem.id + idx}
        />
      ))}
    </GridLayout>
  )
}

export default CartMobileContent
