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

const CartProductInfo = ({ cart }) => {
  return (
    <div className="cart-product-info-wrapper flex gap-12">
      <div className="w-[52px]">
        <CartProductImage
          className="table-cart-product-image"
          src={cart?.product?.images[0]?.url}
        />
      </div>
      <div>
        <CartProductBasicInfo cart={cart} />
      </div>
    </div>
  )
}

const ReturnItemsTableModal = ({
  order,
  classname,
  incrementQty,
  decrementQty,
}) => {
  return (
    <TableContainer className={classname}>
      <Table>
        <TableHead>
          <TableRow className="!py-6">
            <TableCell align="left" className="cart-head-item">
              Product
            </TableCell>
            
            <TableCell align="left" className="cart-head-item">
              Quantity
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Price
            </TableCell>
            {/* <TableCell align="center" className="cart-head-item">
              Subtotal
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Discount
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              VAT
            </TableCell> */}
            <TableCell align="center" className="cart-head-item">
              Total Price
            </TableCell>
            <TableCell align="center" className="cart-head-item"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.entries.map((orderEntry, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ width: '356px' }}>
                <CartProductInfo cart={orderEntry} />
              </TableCell>
              
              <TableCell align="center">
                <div className="quantity-wrapper">
                  <Quantity
                    value={orderEntry.amount}
                    increase={() => incrementQty(orderEntry.id)}
                    decrease={() => decrementQty(orderEntry.id)}
                  />
                </div>
              </TableCell>
              <TableCell className="cart-row-item">
                <PriceExcludeVAT price={orderEntry.price.originalAmount} />
              </TableCell>

              {/* <TableCell className="cart-row-item">
                <PriceExcludeVAT
                  price={orderEntry.price.originalAmount * orderEntry.amount}
                />
              </TableCell>

              <TableCell className="cart-row-item">
                <PriceExcludeVAT price={0} />
              </TableCell>

              <TableCell className="cart-row-item">
                {orderEntry.itemTaxInfo && (
                  <PriceExcludeVAT
                    price={orderEntry.tax?.lines[0].amount || '-'}
                    caption={`${orderEntry.tax.lines[0].rate} %`}
                  />
                )}
              </TableCell> */}

              <TableCell className="cart-row-item">
                {orderEntry.tax ? (
                  <PriceExcludeVAT
                    price={
                      Math.trunc(
                        orderEntry.price.originalAmount *
                          orderEntry.amount *
                          (1 + orderEntry.tax.lines[0].rate / 100) *
                          100
                      ) / 100
                    }
                    caption="incl. VAT"
                  />
                ) : (
                  '-'
                )}
              </TableCell>

              <TableCell className="cart-row-item">
                <span
                  //   onClick={() => removeCartItem(cartItem)}
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

export default ReturnItemsTableModal
