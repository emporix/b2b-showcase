import React from 'react'
import CartPage from './CartPage'
import Layout from '../Layout'

const Cart = () => {
  const title = `Shopping Cart`
  return (
    <Layout title={title}>
      <CartPage />
    </Layout>
  )
}
export default Cart
