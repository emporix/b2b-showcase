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
  return (
    <TableContainer className={classname}>
    <div className="shopping-cart_table-title">your products</div>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className="!py-6">
            <TableCell align="left" className="cart-head-item">
              Product
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Price
            </TableCell>
            <TableCell align="left" className="cart-head-item">
              Quantity
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Subtotal
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Discount
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              VAT
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Total Price
            </TableCell>
            <TableCell align="center" className="cart-head-item"></TableCell>
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
              <TableCell className="cart-row-item">
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
                <span
                  onClick={() => removeCartItem(cartItem)}
                  className="cursor-pointer"
                >
                  &#10060;
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CartTable
