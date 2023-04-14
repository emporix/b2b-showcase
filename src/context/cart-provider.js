import { USER } from 'constants/localstorage'
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { useSelector } from 'react-redux'
import productService from 'services/product/product.service'
import CartService from 'services/cart.service'
import { useAuth } from './auth-provider'
import { useSites } from './sites-provider'
import { useAppContext } from './app-context'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

const DEFAULT_CART = {
  items: [],
}

const getCartAccount = async ({ customerId, sessionId }) => {
  try {
    if (customerId) {
      const customerCart = await CartService.getUserCart(customerId)
      const cart2merge = localStorage.getItem('anonymousCart')
      if (cart2merge) {
        try {
          const anonymousCart = JSON.parse(cart2merge)
          await CartService.mergeCarts(customerCart.id, anonymousCart.id)
          const { data: updatedCustomerCart } = await CartService.getUserCart(
            customerId
          )
          return updatedCustomerCart
        } catch {
          console.error('merge cart error, removing annoymous cart id')
        } finally {
          // remove anonymous cart to merge
          localStorage.removeItem('anonymousCart')
          return customerCart
        }
      } else {
        return customerCart
      }
    } else {
      try {
        const anonymousCart = await CartService.getAnnonymousCart(sessionId)
        return anonymousCart
      } catch (err) {
        console.error(err)
        return DEFAULT_CART
      }
    }
  } catch (err) {
    console.error(err)
    return DEFAULT_CART
  }
}

const getCartList = async (items) => {
  const productYrns = items.map((cart) => cart.itemYrn)
  const products = await productService.getProductsWithYrns(productYrns)
  const cartListWithProduct = items.map((entry) => {
    const matchProduct = products.find(
      (product) => product.yrn === entry.itemYrn
    )
    if (matchProduct) {
      return {
        ...entry,
        product: { ...matchProduct, price: entry.price },
      }
    } else {
      return entry
    }
  })

  return cartListWithProduct
}

const CartProvider = ({ children }) => {
  const { context } = useAppContext()
  const { userTenant, sessionId } = useAuth()
  const [cartAccount, setCartAccount] = useState(DEFAULT_CART)
  const { currentSite } = useSites()
  const products = useMemo(() => {
    return cartAccount.items.map((cart) => {
      return {
        id: cart.product.id,
        name: cart.product.name,
        sku: cart.product.code,
        estimated_delivery: '23.05.2022',
        quantity: cart.quantity,
        src:
          cart.product?.media?.length > 0 ? cart.product.media[0]['url'] : '',
        price: cart.product.price.totalValue,
      }
    })
  }, [cartAccount])
  const discounts = useMemo(() => {
    return cartAccount.discounts
  }, [cartAccount.discounts])

  useEffect(() => {
    syncCart()
  }, [userTenant, currentSite, sessionId])

  const removeCartItem = async (item) => {
    await CartService.removeProductFromCart(cartAccount.id, item.id)
    setCartAccount((prev) => {
      const newItems = prev.items.filter((i) => i.id !== item.id)
      prev.items = newItems
      return { ...prev }
    })
    syncCart()
  }
  const incrementCartItemQty = useCallback(
    async (itemId) => {
      const item = cartAccount.items.find((item) => item.id === itemId)
      if (!item) {
        throw new Error(`No item with id ${itemId} in cart`)
      }
      item.quantity++
      const { quantity } = item

      await CartService.updateCartProduct(
        cartAccount.id,
        item.id,
        { quantity },
        true
      )
      syncCart()
    },
    [cartAccount]
  )
  const decrementCartItemQty = useCallback(
    async (itemId) => {
      const item = cartAccount.items.find((item) => item.id === itemId)
      if (!item) {
        throw new Error(`No item with id ${itemId} in cart`)
      }
      item.quantity--
      const { quantity } = item
      await CartService.updateCartProduct(
        cartAccount.id,
        item.id,
        { quantity },
        true
      )
      syncCart()
    },
    [cartAccount]
  )

  const clearCart = () => {
    setCartAccount({ items: [] })
  }

  useEffect(() => {
    changeCurrency(context.currency)
  }, [context.currency])

  const changeCurrency = useCallback(
    async (newCurrency) => {
      if (cartAccount.id) {
        await CartService.changeCurrency(newCurrency, cartAccount.id)
        await syncCart()
      }
    },
    [cartAccount?.id]
  )

  const applyDiscount = useCallback(
    async (code) => {
      if (cartAccount.id) {
        await CartService.applyDiscount(cartAccount.id, code)
        await syncCart()
      }
    },
    [cartAccount?.id]
  )

  const removeDiscount = useCallback(
    async (discountId) => {
      if (cartAccount.id) {
        await CartService.removeDiscount(cartAccount.id, discountId)
        await syncCart()
      }
    },
    [cartAccount?.id]
  )

  const putCartProduct = useCallback(
    async (product) => {
      const matchCart = cartAccount.items.filter((cart) => {
        return cart.itemYrn === product.itemYrn
      })
      if (matchCart.length === 0) {
        await CartService.addProductToCart(cartAccount.id, product)
        syncCart()
      }
    },
    [cartAccount.id, cartAccount]
  )

  const deleteCart = async (cartAccountId, cartItemId) => {
    await CartService.removeCart(cartAccountId, cartItemId)
    removeCartItem(cartItemId)
    syncCart()
  }

  const syncCart = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem(USER))
    let newCart = DEFAULT_CART
    if (user) {
      newCart = await getCartAccount({ customerId: user.customerNumber })
    } else {
      newCart = await getCartAccount({ sessionId })
    }
    const items = await getCartList(newCart.items || [])
    newCart.items = items
    setCartAccount(newCart)
  }, [sessionId])

  const value = {
    removeCartItem,
    changeCurrency,
    putCartProduct,
    applyDiscount,
    removeDiscount,
    deleteCart,
    clearCart,
    syncCart,
    incrementCartItemQty,
    decrementCartItemQty,
    cartAccount,
    products,
    discounts,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
