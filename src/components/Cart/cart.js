import React, { useState } from 'react'
import './cart.css'
import '../index.css'
import { Link } from 'react-router-dom'
import {
  CurrencyBeforeValue,
  GridLayout,
  LayoutBetween,
} from 'components/Utilities/common'
import { USER } from 'constants/localstorage'
import Quantity from 'components/Utilities/quantity/quantity'
import { cartUrl, checkoutUrl, guestCheckoutUrl, quoteUrl } from 'services/service.config'
import { useCart } from 'context/cart-provider'
import { border } from '@mui/system'
import { PROCUREMENT_SYSTEM_URL } from 'constants/localstorage'
import { useLanguage } from 'context/language-provider'

const CartProductContent = ({ children }) => {
  return <div className="cart-product-content">{children}</div>
}
export const CartProductCaption = () => {
  return <div className="h-10 border-bottom cart-product-caption">Products</div>
}
export const CartProductImage = ({ src, className }) => {
  return (
    <div className="border border-quartz rounded p-4 w-[84px] h-[84px]">
      <img
        src={src}
        className={'cart-product-image ' + (className ? className : '')}
        alt="product from cart"
      />
    </div>
  )
}
export const PriceExcludeVAT = ({ price, caption }) => {
  return (
    <div className="price-exclude-vat">
      <div className="">
        <CurrencyBeforeValue value={price} />
      </div>
      <div className="caption">
        {caption === undefined ? 'ex. VAT' : caption}
      </div>
    </div>
  )
}

export const PriceExcludeVAT1 = ({ price, caption }) => {
  return (
    <div className="price-exclude-vat1">
      <div className="price">
        <CurrencyBeforeValue value={price} />
      </div>
      <div className="caption">
        {caption === undefined ? 'ex. VAT' : caption}
      </div>
    </div>
  )
}

export const CartMobileItem = ({ cartItem }) => {
  const { incrementCartItemQty, decrementCartItemQty, setCartItemQty } = useCart()
  const { getLocalizedValue } = useLanguage()

  return (
    <GridLayout className="gap-4">
      <div className="flex gap-6">
        <div className="w-[56px]">
          <CartProductImage
            className="cart-product-image-mobile"
            src={cartItem.product.src}
          />
        </div>
        <div className="flex-auto gap-4">
          <LayoutBetween>
            <GridLayout className="gap-[10px]">
              <div className="cart-product-name">{getLocalizedValue(cartItem.product.name)}</div>
              <div className="cart-product-sku-wrapper">
                SKU:&nbsp;
                <span className="cart-product-sku">
                  {cartItem.product.code}
                </span>
              </div>
            </GridLayout>
            <div>
              <svg
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.8956 0.818182L4.94886 4.28835H5.02841L7.09162 0.818182H9.52273L6.41548 5.90909L9.59233 11H7.11648L5.02841 7.52486H4.94886L2.8608 11H0.394886L3.58168 5.90909L0.454545 0.818182H2.8956Z"
                  fill="black"
                />
                <path
                  d="M-0.0078125 13.7841H9.99503V14.7386H-0.0078125V13.7841Z"
                  fill="black"
                />
              </svg>
            </div>
          </LayoutBetween>
          <GridLayout className="gap-2 mt-4">
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">Unit Price: </span>
              <CurrencyBeforeValue
                value={cartItem.product.price.effectiveValue}
              />
            </span>
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">Subtotal: : </span>
              <CurrencyBeforeValue
                value={
                  cartItem.product.price.effectiveValue * cartItem.quantity
                }
              />
            </span>
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">Discount: </span>
              <CurrencyBeforeValue value={0.0} />
            </span>
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">VAT: </span>
              <CurrencyBeforeValue
                value={
                  Math.trunc(
                    cartItem.product.price.originalAmount * 0.2 * 100
                  ) / 100
                }
              />
            </span>
          </GridLayout>
        </div>
      </div>
      <div className="cart-product-stock-wrapper flex">
        <span
          className={
            'cart-product-stock w-[80px] ' +
            (cartItem.product.stock === 'Low'
              ? 'text-emporixGold'
              : cartItem.product.stock === 'In'
              ? 'text-brightGreen '
              : 'text-primaryBlue')
          }
        >
          {cartItem.product.stock} Stock
        </span>
        <span className="">Est. delivery time: 3 days</span>
      </div>
      <LayoutBetween className="items-center">
        <div className="w-[67px]">
          <Quantity
            value={cartItem.quantity}
            increase={() => incrementCartItemQty(cartItem.id)}
            decrease={() => decrementCartItemQty(cartItem.id)}
            onChange={(value) => setCartItemQty(cartItem.id, value)}
          />
        </div>
        <div className="!font-bold">
          <PriceExcludeVAT1
            price={
              Math.trunc(
                cartItem.quantity *
                  cartItem.product.price.originalAmount *
                  1.2 *
                  100
              ) / 100
            }
            caption="incl. VAT"
          />
        </div>
      </LayoutBetween>
    </GridLayout>
  )
}

const CartProductImageAndQuantity = ({ cartItem }) => {
  const { incrementCartItemQty, decrementCartItemQty, setCartItemQty } = useCart()
  return (
    <div className="cart-product-image-and-quantity">
      <GridLayout className="gap-11">
        <CartProductImage src={cartItem.product.src} />
        <Quantity
          value={cartItem.quantity}
          increase={() => incrementCartItemQty(cartItem.id)}
          decrease={() => decrementCartItemQty(cartItem.id)}
          onChange={(value) => setCartItemQty(cartItem.id, value)}
        />
      </GridLayout>
    </div>
  )
}

export const CartProductImageAndReadOnlyQuantity = ({ cartItem }) => {
  return (
    <div className="cart-product-image-and-quantity">
      <GridLayout className="gap-11">
        <CartProductImage src={cartItem.product.src} />
        <div className='cart-product-sku-wrapper'>
          Quantity: {cartItem.quantity}
        </div>
      </GridLayout>
    </div>
  )
}

export const CartProductBasicInfo = ({ cart }) => {
  const { getLocalizedValue } = useLanguage()
  return (
    <div className="cart-product-basic-info">
      <GridLayout className="gap-2">
        <div className="cart-product-name">{getLocalizedValue(cart.product.name)}</div>
        <div className="cart-product-sku-wrapper">
          SKU:&nbsp;
          <span className="cart-product-sku">{cart.product.code}</span>
        </div>
        <div className="cart-product-stock-wrapper">
          <span
            className={
              'cart-product-stock ' +
              (cart.product.stock === 'Low'
                ? 'text-emporixGold'
                : cart.product.stock === 'In'
                ? 'text-brightGreen '
                : 'text-primaryBlue')
            }
          >
            {cart.product.stock} Stock
          </span>
          {/* <span className="cart-product-lead-time">Lead Time: 1 week</span> */}
        </div>
      </GridLayout>
    </div>
  )
}
export const CartProductPriceExcludeVat = ({ price, currency }) => {
  return (
    <div className="text-right">
      <GridLayout>
        <div className="cart-product-price-except-vat">
          <CurrencyBeforeValue value={price} currency={currency} />
        </div>
        <div>exclu. VAT</div>
      </GridLayout>
    </div>
  )
}
export const CartProductInfo = ({ cartItem }) => {
  return (
    <div className="cart-product-info">
      <GridLayout className="gap-[22px]">
        <CartProductBasicInfo cart={cartItem} />
        {cartItem.price.currency && cartItem.itemTaxInfo && (
          <CartProductPriceExcludeVat
            price={cartItem.itemTaxInfo[0].netValue}
            currency={cartItem.price.currency}
          />
        )}
      </GridLayout>
    </div>
  )
}
const CartProductItem = ({ cartItem, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="cart-product-item p-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {cartItem && (
        <>
          <CartProductImageAndQuantity cartItem={cartItem} />
          <CartProductInfo cartItem={cartItem} />
        </>
      )}
    </div>
  )
}
const CartProductWrapper = ({ cartItem }) => {
  const [isHover, setIsHover] = useState(false)
  const { removeCartItem } = useCart()

  return (
    <div
      className="cart-product-wrapper"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover && (
        <div
          className="cart-product-wrapper-btn"
          onClick={() => removeCartItem(cartItem)}
        >
          &#10006;
        </div>
      )}
      <CartProductItem cartItem={cartItem} />
    </div>
  )
}
export const CartActionRow = ({ children }) => {
  return <div className="cart-action-row">{children}</div>
}
export const CartSubTotalExcludeVat = ({ value, currency }) => {
  return (
    <>
      <span className="font-semibold">Subtotal without VAT</span>
      <span id="subtotal-without-vat" className="font-semibold">
        <CurrencyBeforeValue
          value={Math.trunc(value * 100) / 100}
          currency={currency}
        />
      </span>
    </>
  )
}
export const CartSubTotalIncludeVat = ({ grossValue, currency }) => {
  return (
    <>
      <span className="font-semibold">Subtotal with VAT</span>
      <span className="font-semibold">
        <CurrencyBeforeValue value={grossValue} currency={currency} />
      </span>
    </>
  )
}

export const CartVat = ({ value, taxPercentage, currency, taxValue }) => {
  const effectiveTaxValue = (value * (taxPercentage / 100)).toFixed(2)
  return (
    <>
      <span>
        VAT {taxPercentage}% of{' '}
        <CurrencyBeforeValue value={value} currency={currency} />
      </span>
      <span>
        <CurrencyBeforeValue
          value={effectiveTaxValue}
          currency={currency}
        />
      </span>
    </>
  )
}
export const CartShipingCost = ({shippingCost, currency}) => {
  return (
    <>
      <span>Shipping Costs</span>
      <CurrencyBeforeValue value={shippingCost} currency={currency} />
    </>
  )
}

export const CartTotalPrice = ({ totalValue, currency }) => {
  return (
    <>
      <span className="font-bold ">Total Price</span>
      <span id="cart-total-price" className="font-bold">
        <CurrencyBeforeValue value={totalValue} currency={currency} />
      </span>
    </>
  )
}

const CartRequestQuote = () => {
  return (
    <Link to={quoteUrl()} className="w-full">
      <button className="cart-request-quote-btn py-[12px] px-[14px] bg-transparent rounded text-eerieBlack border border-gray80">
        REQUEST QUOTE
      </button>
    </Link>
  )
}
const CartGoGuestCheckout = () => {
    return (
      <Link to={guestCheckoutUrl()} className="w-full">
        <button className="cart-go-cart-btn py-[12px] px-[14px] bg-transparent rounded text-eerieBlack border border-gray80">
          CONTINUE AS A GUEST
        </button>
      </Link>
    )
  }

const CartGoCheckout = () => {
  return (
    <Link to={checkoutUrl()} className="w-full">
      <button className="cart-go-checkout-btn py-[12px] px-[14px] bg-yellow rounded text-eerieBlack">
        GO TO CHECKOUT
      </button>
    </Link>
  )
}

const CartGoCart = () => {
  return (
    <Link to={cartUrl()} className="w-full">
      <button className="cart-go-cart-btn py-[12px] px-[14px] bg-transparent rounded text-eerieBlack border border-gray80">
        GO TO CART
      </button>
    </Link>
  )
}
const CartGoProcurementSystem = () => {
  return (
    <Link to={localStorage.getItem(PROCUREMENT_SYSTEM_URL)} className="w-full">
      <button className="cart-go-checkout-btn py-[12px] px-[14px] bg-yellow rounded text-eerieBlack">
        TRANSFER TO PROCUREMENT SYSTEM
      </button>
    </Link>
  )
}

export const getShippingCost = (shippingMethod, cartAccount) => {
  return (shippingMethod != null && !hasFreeShipping(cartAccount)) ? shippingMethod?.grossFee : 0
}

export const getTotalPrice = (value, taxPercentage, shippingCost) => {
  const price = getSubtotalWithVat(value, taxPercentage)
  return !isNaN(price) ? (Number(price) + shippingCost) : 0
}

export const getSubtotalWithVat = (value, taxPercentage) => {
  const taxValue = value * (taxPercentage / 100)
  return (value + taxValue).toFixed(2)
}

export const hasFreeShipping = (cartAccount) => {
  return cartAccount?.discounts?.some(discount => discount.discountType === "FREE_SHIPPING")
}

export const CartActionPanel = ({ action, showShipping }) => {
  const { cartAccount, shippingMethod } = useCart()
  const user = JSON.parse(localStorage.getItem(USER))
  const shippingCost = showShipping !== false ? getShippingCost(shippingMethod, cartAccount) : 0
  return (
    <div className="cart-action-panel">
      <GridLayout className="gap-4">
        <CartActionRow>
          <LayoutBetween>
            {cartAccount.subtotalAggregate?.netValue && (
              <CartSubTotalExcludeVat
                value={cartAccount.subtotalAggregate.netValue}
                currency={cartAccount.currency}
              />
            )}
          </LayoutBetween>
        </CartActionRow>

        {cartAccount.totalDiscount?.amount > 0 && (
          <CartActionRow>
            <LayoutBetween>
              <span className="font-semibold text-green-600">
                Discount amount
              </span>
              <span id="discount-value" className="font-semibold text-green-600">
                <CurrencyBeforeValue
                  value={
                    Math.trunc(cartAccount.totalDiscount.amount * 100) / 100
                  }
                  currency={cartAccount.totalDiscount.currency}
                />
              </span>
            </LayoutBetween>
          </CartActionRow>
        )}

        <CartActionRow>
          <LayoutBetween>
            {cartAccount &&
              cartAccount?.taxAggregate &&
              cartAccount?.taxAggregate.lines.length > 0 && (
                <CartVat
                  value={cartAccount?.totalPrice?.amount}
                  taxPercentage={cartAccount?.taxAggregate.lines[0].rate}
                  currency={cartAccount?.currency}
                  taxValue={cartAccount?.subtotalAggregate?.taxValue}
                />
              )}
          </LayoutBetween>
          <LayoutBetween>
            {cartAccount?.subtotalAggregate &&
              cartAccount?.subtotalAggregate.grossValue && (
                <CartSubTotalIncludeVat
                  grossValue={getSubtotalWithVat(cartAccount?.totalPrice?.amount, cartAccount?.taxAggregate?.lines[0].rate)}
                  currency={cartAccount.currency}
                />
              )}
          </LayoutBetween>
        </CartActionRow>

        {showShipping !== false && (
        <CartActionRow>
          <LayoutBetween>
            <CartShipingCost currency={cartAccount.currency} shippingCost={getShippingCost(shippingMethod, cartAccount)}/>
          </LayoutBetween>
        </CartActionRow>
        )}

        <CartActionRow>
          <div className="cart-total-price-wrapper">
            <LayoutBetween>
              <CartTotalPrice
                totalValue={getTotalPrice(cartAccount?.totalPrice?.amount, cartAccount?.taxAggregate?.lines[0].rate, shippingCost)}
                currency={cartAccount.currency}
              />
            </LayoutBetween>
          </div>
        </CartActionRow>

        {(action === undefined || action === true) && !localStorage.getItem(PROCUREMENT_SYSTEM_URL) ? (
            
            <>
                <CartGoCheckout />
                {!user && <CartGoGuestCheckout />}
                <CartGoCart />
                <CartRequestQuote />
            </>
        ) : (
          <></>
        )}
        {(action === undefined || action === true) && localStorage.getItem(PROCUREMENT_SYSTEM_URL) ? (
            
            <>
                <CartGoProcurementSystem/>
            </>
        ) : (
          <></>
        )}
      </GridLayout>
    </div>
  )
}
const Cart = () => {
  const { cartAccount } = useCart()
  return (
    <>
      <LayoutBetween>
        <span className="cart-caption-font">My Cart</span>
        <span className="cart-caption-font">
          {cartAccount?.items.length || 0} items
        </span>
      </LayoutBetween>
      <CartProductContent>
        <GridLayout className="gap-4">
          {cartAccount?.items.map((cartItem, idx) => (
            <CartProductWrapper key={cartItem.id + idx} cartItem={cartItem} />
          ))}
        </GridLayout>
      </CartProductContent>
      {<CartActionPanel showShipping={false}/>}
    </>
  )
}
export default Cart
