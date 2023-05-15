import React, { useState } from 'react'
import './cart.css'
import '../index.css'
import { Link } from 'react-router-dom'
import {
  CurrencyBeforeValue,
  GridLayout,
  LayoutBetween,
} from 'components/Utilities/common'
import Quantity from 'components/Utilities/quantity/quantity'
import { cartUrl, checkoutUrl, quoteUrl } from 'services/service.config'
import { useCart } from 'context/cart-provider'

const CartProductContent = ({ children }) => {
  return <div className="cart-product-content">{children}</div>
}
export const CartProductCaption = () => {
  return <div className="h-10 border-bottom cart-product-caption">Products</div>
}
export const CartProductImage = ({ src, className }) => {
  return (
    <img
      src={src}
      className={'cart-product-image ' + (className ? className : '')}
    />
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
  const { incrementCartItemQty, decrementCartItemQty } = useCart()

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
              <div className="cart-product-name">{cartItem.product.name}</div>
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
  const { incrementCartItemQty, decrementCartItemQty } = useCart()
  return (
    <div className="cart-product-image-and-quantity">
      <GridLayout className="gap-4">
        <CartProductImage src={cartItem.product.src} />
        <Quantity
          value={cartItem.quantity}
          increase={() => incrementCartItemQty(cartItem.id)}
          decrease={() => decrementCartItemQty(cartItem.id)}
        />
      </GridLayout>
    </div>
  )
}

export const CartProductBasicInfo = ({ cart }) => {
  return (
    <div className="cart-product-basic-info">
      <GridLayout className="gap-2">
        <div className="cart-product-name">{cart.product.name}</div>
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
          <span className="cart-product-lead-time">Lead Time: 1 week</span>
        </div>
      </GridLayout>
    </div>
  )
}
const CartProductPriceExcludeVat = ({ price, currency }) => {
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
const CartProductInfo = ({ cartItem }) => {
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
      <span className="font-semibold">
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

export const CartVat = ({ value, taxPercentage, currency }) => {
  return (
    <>
      <span>
        VAT {taxPercentage}% of{' '}
        <CurrencyBeforeValue value={value} currency={currency} />
      </span>
      <span>
        <CurrencyBeforeValue
          value={Math.trunc(value * (taxPercentage / 100) * 100) / 100}
          currency={currency}
        />
      </span>
    </>
  )
}
export const CartShipingCost = () => {
  return (
    <>
      <span>Shipping Costs</span>
      <span>Free</span>
    </>
  )
}

export const CartTotalPrice = ({ totalValue, currency }) => {
  return (
    <>
      <span className="font-bold ">Total Price</span>
      <span className="font-bold">
        <CurrencyBeforeValue value={totalValue} currency={currency} />
      </span>
    </>
  )
}

const CartRequestQuote = () => {
  return (
    <Link to={quoteUrl()} className="w-full">
      <button className="cart-request-quote-btn">REQUEST QUOTE</button>
    </Link>
  )
}
const CartGoCheckout = () => {
  return (
    <Link to={checkoutUrl()} className="w-full">
      <button className="cart-go-checkout-btn">GO TO CHECKOUT</button>
    </Link>
  )
}
const CartGoCart = () => {
  return (
    <Link to={cartUrl()} className="w-full">
      <button className="cart-go-cart-btn">GO TO CART</button>
    </Link>
  )
}
export const CartActionPanel = ({ action }) => {
  const { cartAccount } = useCart()
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
              <span className="font-semibold text-green-600">
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
                  value={cartAccount.totalPrice.amount}
                  taxPercentage={cartAccount?.taxAggregate.lines[0].rate}
                  currency={cartAccount?.currency}
                />
              )}
          </LayoutBetween>
          <LayoutBetween>
            {cartAccount?.subtotalAggregate &&
              cartAccount?.subtotalAggregate.grossValue && (
                <CartSubTotalIncludeVat
                  grossValue={cartAccount.totalPrice.amount + cartAccount.totalPrice.amount * cartAccount?.taxAggregate.lines[0].rate / 100 }
                  currency={cartAccount.currency}
                />
              )}
          </LayoutBetween>
        </CartActionRow>

        <CartActionRow>
          <LayoutBetween>
            <CartShipingCost />
          </LayoutBetween>
        </CartActionRow>

        <CartActionRow>
          <div className="cart-total-price-wrapper">
            <LayoutBetween>
              {cartAccount.totalPrice && cartAccount.totalPrice.amount && (
                <CartTotalPrice
                  totalValue={
                    cartAccount.totalPrice.amount +
                      + cartAccount.totalPrice.amount * cartAccount?.taxAggregate.lines[0].rate / 100
                  }
                  currency={cartAccount.currency}
                />
              )}
            </LayoutBetween>
          </div>
        </CartActionRow>

        {action === undefined || action === true ? (
          <CartActionRow>
            <CartRequestQuote />
            <CartGoCart />
            <CartGoCheckout />
          </CartActionRow>
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
      {cartAccount?.subtotalAggregate
        ? cartAccount?.subtotalAggregate.grossValue && <CartActionPanel />
        : 'Error: Missing subtotal agregate. Some products are probably unavailiable on this site'}
    </>
  )
}
export default Cart
