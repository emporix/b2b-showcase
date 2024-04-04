import React, { useState } from 'react'
import { GridLayout } from '../../components/Utilities/common'
import { CartProductCaption, CartMobileItem } from '../../components/Cart/cart'
import './cart.css'

const CartMobileContent = ({ cartList, className }) => {
  return (
    <GridLayout className={`${className} gap-6`}>
      <CartProductCaption />
      {cartList.map((cartItem) => (
        <CartMobileItem cartItem={cartItem} key={cartItem.id} />
      ))}
    </GridLayout>
  )
}

export default CartMobileContent
