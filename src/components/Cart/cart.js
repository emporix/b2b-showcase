import React, { useState, useContext } from 'react'
import './cart.css'
import '../index.css'
import { Link } from 'react-router-dom'
import { CurrencyBeforeValue, GridLayout, LayoutBetween, LayoutFlexStart } from 'components/Utilities/common'
import Quantity from 'components/Utilities/quantity/quantity'
import { cartUrl, checkoutUrl, quoteUrl } from 'services/service.config'
import { useCart } from 'context/cart-provider'
import { PROCUREMENT_SYSTEM_URL } from 'constants/localstorage'
import { useLanguage } from 'context/language-provider'
import { useSelector } from 'react-redux'
import { availabilityDataSelector } from 'redux/slices/availabilityReducer'
import { useTranslation } from 'react-i18next'

import LayoutContext from '../../pages/context'
import { HiOutlineArrowCircleLeft, HiOutlineXCircle } from 'react-icons/hi'

export const CartProductCaption = () => {
  return <div className="h-10 border-bottom cart-product-caption">Products</div>
}
export const CartProductImage = ({ src, className }) => {
  return (
    <div className="rounded-xl w-full">
      <img src={src} className={'rounded-xl w-full' + (className ? className : '')} alt="product from cart" />
    </div>
  )
}
export const PriceExcludeVAT = ({ price, caption }) => {
  return (
    <div className="price-exclude-vat">
      <div className="">
        <CurrencyBeforeValue value={price} />
      </div>
      <div className="caption">{caption === undefined ? 'ex. VAT' : caption}</div>
    </div>
  )
}

export const PriceExcludeVAT1 = ({ price, caption }) => {
  return (
    <div className="price-exclude-vat1">
      <div className="price">
        <CurrencyBeforeValue value={price} />
      </div>
      <div className="caption">{caption === undefined ? 'ex. VAT' : caption}</div>
    </div>
  )
}

export const CartMobileItem = ({ cartItem }) => {
  const { incrementCartItemQty, decrementCartItemQty, setCartItemQty } = useCart()
  const { getLocalizedValue } = useLanguage()
  const { t } = useTranslation('page')
  const availability = useSelector(availabilityDataSelector)
  const { removeCartItem } = useCart()

  const available = availability?.['k' + cartItem.product.id]?.available

  return (
    <GridLayout className="gap-4 cart-for-mobile">
      <div className="flex gap-6">
        <div className="w-1/2 sm:w-1/3">
          <CartProductImage className="cart-product-image-mobile" src={cartItem.product.src} />
        </div>
        <div className="flex-auto gap-4">
          <LayoutBetween>
            <GridLayout className="gap-[10px]">
              <div className="cart-product-name font-bold">{getLocalizedValue(cartItem.product.name)}</div>
              <div className="cart-product-sku-wrapper">
                SKU:&nbsp;
                <span className="cart-product-sku">{cartItem.product.code}</span>
              </div>
            </GridLayout>
            <div>
              <div
                className="cursor-pointer text-primary hover:text-highlight"
                onClick={() => removeCartItem(cartItem)}
              >
                <HiOutlineXCircle size="2rem" />
              </div>
            </div>
          </LayoutBetween>
          <GridLayout className="gap-2 mt-4">
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">Unit Price: </span>
              <CurrencyBeforeValue value={cartItem.product.price.effectiveAmount} />
            </span>
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">Subtotal: : </span>
              <CurrencyBeforeValue value={cartItem.product.price.effectiveAmount * cartItem.quantity} />
            </span>
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">Discount: </span>
              <CurrencyBeforeValue value={0.0} />
            </span>
            <span className="cart-product-mobile-info-wrapper">
              <span className="font-bold">VAT: </span>
              <CurrencyBeforeValue value={Math.trunc(cartItem.product.price.originalAmount * 0.2 * 100) / 100} />
            </span>
          </GridLayout>
        </div>
      </div>
      <div className="cart-product-stock-wrapper flex">
        <span
          className={
            ' text-brightGreen font-bold cart-product-stock w-[80px] ' +
            (available ? 'text-limeGreen' : 'text-primaryBlue')
          }
        >
          {available ? t('in_stock') : t('out_stock')}
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
            price={Math.trunc(cartItem.quantity * cartItem.product.price.originalAmount * 1.2 * 100) / 100}
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
      <GridLayout className="gap-4">
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
        <div className="cart-product-sku-wrapper">Quantity: {cartItem.quantity}</div>
      </GridLayout>
    </div>
  )
}

export const CartProductBasicInfo = ({ cart }) => {
  const { t } = useTranslation('page')
  const { getLocalizedValue } = useLanguage()
  const availability = useSelector(availabilityDataSelector)
  const available = availability?.['k' + cart.product.id].available

  return (
    <div className="cart-product-basic-info">
      <GridLayout className="gap-2">
        <div className="cart-product-name">{getLocalizedValue(cart.product.name)}</div>
        {/* <div className="cart-product-sku-wrapper">
          SKU:&nbsp;
          <span className="cart-product-sku">{cart.product.code}</span>
        </div> */}
        <div className="cart-product-stock-wrapper">
          <span
            className={
              ' text-brightGreen font-bold cart-product-stock ' + (available ? 'text-limeGreen' : 'text-primaryBlue')
            }
          >
            {available ? t('in_stock') : t('out_stock')}
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
        <div>Exclu. VAT</div>
      </GridLayout>
    </div>
  )
}
export const CartProductInfo = ({ cartItem }) => {
  return (
    <div className="cart-product-info">
      <div className="gap-11 flex justify-between flex-col h-full">
        <CartProductBasicInfo cart={cartItem} />
        {cartItem.price.currency && cartItem.itemTaxInfo && (
          <CartProductPriceExcludeVat price={cartItem.itemTaxInfo[0].netValue} currency={cartItem.price.currency} />
        )}
      </div>
      <GridLayout className="gap-[22px]"></GridLayout>
    </div>
  )
}
const CartProductItem = ({ cartItem, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="cart-product-item p-4 rounded-xl bg-aliceBlue standard_box_shadow flex gap-4"
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
  const [, setIsHover] = useState(false)
  const { removeCartItem } = useCart()

  return (
    <div className="cart-product-wrapper" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <div className="cart-product-wrapper-btn" onClick={() => removeCartItem(cartItem)}>
        <HiOutlineXCircle size="2rem" />
      </div>

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
      <span className="font-semibold whitespace-nowrap">
        <CurrencyBeforeValue value={value} currency={currency} />
      </span>
    </>
  )
}
export const CartSubTotalIncludeVat = ({ grossValue, currency }) => {
  return (
    <>
      <span className="font-semibold">Subtotal with VAT</span>
      <span className="font-semibold whitespace-nowrap">
        <CurrencyBeforeValue value={grossValue} currency={currency} />
      </span>
    </>
  )
}

export const CartVat = ({ value, taxPercentage, currency, taxValue }) => {
  const effectiveTaxValue = taxValue ? taxValue : (value * (taxPercentage / 100)).toFixed(2)
  return (
    <>
      <span>
        VAT {taxPercentage}% of <CurrencyBeforeValue value={value} currency={currency} />
      </span>
      <span className="whitespace-nowrap">
        <CurrencyBeforeValue value={effectiveTaxValue} currency={currency} />
      </span>
    </>
  )
}
export const CartShipingCost = ({ shippingCost, currency }) => {
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
      <span className="font-bold  whitespace-nowrap">
        <CurrencyBeforeValue value={totalValue} currency={currency} />
      </span>
    </>
  )
}

const CartRequestQuote = () => {
  return (
    <Link to={quoteUrl()} className="w-full">
      <button className="cart-request-quote-btn py-[12px] px-[14px] bg-transparent rounded text-eerieBlack border border-gray80 hover:text-highlight hover:border-highlight">
        REQUEST QUOTE
      </button>
    </Link>
  )
}
const CartGoCheckout = () => {
  return (
    <Link to={checkoutUrl()} className="w-full">
      <button className="cart-go-checkout-btn py-[12px] px-[14px] bg-primary hover:bg-highlight rounded-xl !text-aliceBlue !text-lg">
        GO TO CHECKOUT
      </button>
    </Link>
  )
}
const CartGoCart = () => {
  return (
    <Link to={cartUrl()} className="w-full">
      <button className="cart-go-cart-btn py-[12px] px-[14px] bg-transparent rounded text-eerieBlack  border border-gray80 hover:text-highlight hover:border-highlight">
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

export const getShippingCost = (shippingMethod) => {
  return shippingMethod != null ? shippingMethod?.grossFee : 0
}

export const getTotalPrice = (cartAccount, shippingCost) => {
  return cartAccount?.subtotalAggregate ? cartAccount.subtotalAggregate.grossValue + +shippingCost : 0
}

export const CartActionPanel = ({ action, showShipping, hideGoCart }) => {
  const { cartAccount, shippingMethod } = useCart()
  const shippingCost = showShipping !== false ? getShippingCost(shippingMethod) : 0
  return (
    <div className="cart-action-panel standard_box_shadow">
      <GridLayout className="gap-4">
        <CartActionRow>
          <LayoutBetween>
            {cartAccount.subtotalAggregate?.netValue && (
              <CartSubTotalExcludeVat value={cartAccount.subtotalAggregate.netValue} currency={cartAccount.currency} />
            )}
          </LayoutBetween>
        </CartActionRow>

        {cartAccount.totalDiscount?.amount > 0 && (
          <CartActionRow>
            <LayoutBetween>
              <span className="font-semibold text-green-600">Discount amount</span>
              <span className="font-semibold text-green-600">
                <CurrencyBeforeValue
                  value={Math.trunc(cartAccount.totalDiscount.amount * 100) / 100}
                  currency={cartAccount.totalDiscount.currency}
                />
              </span>
            </LayoutBetween>
          </CartActionRow>
        )}

        {cartAccount &&
          cartAccount?.taxAggregate &&
          cartAccount?.taxAggregate.lines.length > 0 &&
          cartAccount?.taxAggregate.lines.map((taxItem) => {
            return (
              <CartActionRow key={cartAccount.subtotalAggregate.netValue}>
                <LayoutBetween>
                  <CartVat
                    value={cartAccount?.subtotalAggregate?.netValue}
                    taxPercentage={cartAccount?.taxAggregate.lines[0].rate}
                    currency={cartAccount?.currency}
                    taxValue={cartAccount?.subtotalAggregate?.taxValue}
                  />
                </LayoutBetween>
              </CartActionRow>
            )
          })}

        <CartActionRow>
          <LayoutBetween>
            {cartAccount?.subtotalAggregate && cartAccount?.subtotalAggregate.grossValue && (
              <CartSubTotalIncludeVat grossValue={getTotalPrice(cartAccount, 0)} currency={cartAccount.currency} />
            )}
          </LayoutBetween>
        </CartActionRow>

        {showShipping !== false && (
          <CartActionRow>
            <LayoutBetween>
              <CartShipingCost currency={cartAccount.currency} shippingCost={getShippingCost(shippingMethod)} />
            </LayoutBetween>
          </CartActionRow>
        )}

        <CartActionRow>
          <div className="cart-total-price-wrapper">
            <LayoutBetween>
              <CartTotalPrice totalValue={getTotalPrice(cartAccount, shippingCost)} currency={cartAccount.currency} />
            </LayoutBetween>
          </div>
        </CartActionRow>

        {(action === undefined || action === true) && !localStorage.getItem(PROCUREMENT_SYSTEM_URL) ? (
          <>
            <CartGoCheckout />
            {hideGoCart ? null : <CartGoCart />}
            <CartRequestQuote />
          </>
        ) : (
          <></>
        )}
        {(action === undefined || action === true) && localStorage.getItem(PROCUREMENT_SYSTEM_URL) ? (
          <>
            <CartGoProcurementSystem />
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
  const { setShowCart } = useContext(LayoutContext)

  return (
    <>
      <LayoutFlexStart className={'test'}>
        <span
          className="inline-block cursor-pointer text-darkGray hover:text-primary"
          onClick={() => setShowCart(false)}
        >
          <HiOutlineArrowCircleLeft size="2rem" />
        </span>
        <span className="cart-caption-font ml-4">My Cart</span>
        <span className="cart-caption-font ml-auto">{cartAccount?.items.length || 0} items</span>
      </LayoutFlexStart>
      <GridLayout className="gap-4">
        {cartAccount?.items.map((cartItem, idx) => (
          <CartProductWrapper key={cartItem.id + idx} cartItem={cartItem} />
        ))}
      </GridLayout>
      {<CartActionPanel showShipping={false} />}
    </>
  )
}
export default Cart
