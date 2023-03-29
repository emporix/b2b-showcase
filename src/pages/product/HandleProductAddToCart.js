import { CART_PRODUCT } from '../../constants/localstorage'

const HandleProductAddToCart = (product, action, quantitiy) => {
  let cartProductList = localStorage.getItem(CART_PRODUCT)
  cartProductList = cartProductList === null ? {} : JSON.parse(cartProductList)
  const CartID = `Cart${product.id}`
  product.quantity = quantitiy

  if (cartProductList[CartID] === undefined) {
    cartProductList[CartID] = product
  } else {
    cartProductList[CartID].quantity += product.quantity
  }

  localStorage.setItem(CART_PRODUCT, JSON.stringify(cartProductList))
  action(true)
}
export default HandleProductAddToCart
