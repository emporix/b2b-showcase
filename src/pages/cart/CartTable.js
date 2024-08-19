import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Quantity from '../../components/Utilities/quantity/quantity'
import {
  CartProductBasicInfo,
  CartProductImage,
  PriceExcludeVAT,
} from '../../components/Cart/cart'

import './cart.css'
import { useCart } from 'context/cart-provider'
import {useTranslation} from "react-i18next";

const CartProductInfo = ({ cart }) => {
  return (
    <div className="cart-product-info-wrapper flex gap-6">
      <div className="">
        <CartProductImage
          className="table-cart-product-image"
          src={cart.product.src}
        />
      </div>
      <div>
        <CartProductBasicInfo cart={cart} />
      </div>
    </div>
  )
}

const CartTable = ({ cartList, classname }) => {
  const { removeCartItem, incrementCartItemQty, decrementCartItemQty, setCartItemQty } =
    useCart()
  const { t } = useTranslation('cart')
  return (
    <TableContainer className={classname}>
    {/* <div className="shopping-cart_table-title">Your products</div> */}
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className="!py-6">
            <TableCell align="left" className="cart-head-item">
              {t('product')}

            </TableCell>
            <TableCell align="left" className="cart-head-item">
              {t('price')}
            </TableCell>
            <TableCell align="left" className="cart-head-item">
              {t('quantity')}
            </TableCell>
            <TableCell align="left" className="cart-head-item">
              {t('subtotal_short')}
            </TableCell>
            <TableCell align="left" className="cart-head-item">
              {t('discount_short')}
            </TableCell>
            <TableCell align="left" className="cart-head-item">
              {t('vat')}
            </TableCell>
            <TableCell align="left" className="cart-head-item">
              {t('total_price')}
            </TableCell>
            <TableCell align="left" className="cart-head-item"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartList.map((cartItem, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ width: '356px' }}>
                <CartProductInfo cart={cartItem} />
              </TableCell>
              <TableCell className="cart-row-item" align='left'>
                <PriceExcludeVAT
                  price={cartItem.product.price.effectiveAmount}
                />
              </TableCell>
              <TableCell align="center">
                <div className="quantity-wrapper">
                  <Quantity
                    value={cartItem.quantity}
                    increase={() => incrementCartItemQty(cartItem.id)}
                    decrease={() => decrementCartItemQty(cartItem.id)}
                    onChange={(value) => setCartItemQty(cartItem.id, value)}
                  />
                </div>
              </TableCell>

              <TableCell className="cart-row-item">
                <PriceExcludeVAT
                  price={
                    cartItem.itemPrice.amount
                  }
                />
              </TableCell>

              <TableCell className="cart-row-item">
                <PriceExcludeVAT price={cartItem.totalDiscount?.amount} />
              </TableCell>

              <TableCell className="cart-row-item">
                {cartItem.itemTaxInfo && (
                  <PriceExcludeVAT
                    price={cartItem.itemTaxInfo[0].value.amount}
                    caption={`${cartItem.itemTaxInfo[0].rate} %`}
                  />
                )}
              </TableCell>

              <TableCell className="cart-row-item">
                <PriceExcludeVAT
                  price={cartItem.itemTaxInfo[0].grossValue}
                  caption="incl. VAT"
                />
              </TableCell>

              <TableCell className="cart-row-item">
                <div
                className="cart-product-wrapper-btn !top-0 !right-0 relative"
                onClick={() => removeCartItem(cartItem)}
                >
                  &#10006;
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CartTable
