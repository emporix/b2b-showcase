import { storyblokEditable } from '@storyblok/react'
import Quantity from '../../Utilities/quantity/quantity'
import React, { useCallback, useContext, useState } from 'react'
import LayoutContext from '../../../pages/context'
import { useCart } from '../../../context/cart-provider'
import { useLanguage } from '../../../context/language-provider'
import { AiOutlineShoppingCart } from 'react-icons/ai'

const PdpAddToCart = ({ blok, ...restProps }) => {
  const product = restProps.product
  const [quantity, setQuantity] = useState(1)
  const { setShowCart } = useContext(LayoutContext)
  const { putCartProduct } = useCart()
  const { currentLanguage } = useLanguage()

  const increaseQty = () => {
    setQuantity((prevState) => prevState + 1)
  }

  const decreaseQty = () => {
    if (quantity <= 1) return
    setQuantity((prevState) => prevState - 1)
  }

  const HandleProductAddToCart1 = useCallback((product, action, quantitiy) => {
    let newProduct = { ...product }
    newProduct.quantity = quantitiy
    putCartProduct(newProduct)
    action(true)
  }, [])

  return (<div className="flex flex-row" {...storyblokEditable()}>
    <div className="quantity">
      <Quantity
        value={quantity}
        increase={increaseQty}
        decrease={decreaseQty}
        onChange={(value) => {
          setQuantity(value)
        }}
      />
    </div>
    <div className="flex w-full">
      <button
        disabled={!product.price}
        className="ml-4 flex flex-row w-full max-w-[448px] h-[50px] place-items-center place-content-center bg-aldiBlue6 hover:bg-aldiBlue7 rounded text-white uppercase font-bold"
        onClick={() =>
          HandleProductAddToCart1(product, setShowCart, quantity)
        }
      >
        <AiOutlineShoppingCart size={27} />
        <div className="ml-3">{currentLanguage === 'de' ?
          'In den Warenkorb' :
          'add to cart'}</div>
      </button>
    </div>
  </div>)
}

export default PdpAddToCart
