import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import {
  CurrencyBeforeValue,
  GridLayout,
  formatDate,
} from '../../components/Utilities/common'

const ProductInfo = ({ product }) => {
  return (
    <div className="flex gap-6">
      <div className="w-[52px] h-[52px]">
        {product && product.images[0] ? (
          <img src={product.images[0].url} className="p-0" />
        ) : (
          <div className="flex align-content-center h-[52px]">'No image'</div>
        )}
      </div>
      <div className="w-[200px]">
        <GridLayout className="gap-2">
          <div className="font-bold">{product.name}</div>
          <div className="text-[12px]">{`SKU: ${product.sku}`}</div>
        </GridLayout>
      </div>
    </div>
  )
}

const PriceWithInfo = ({ price, includeVat = false, caption }) => {
  return (
    <div className="font-normal grid grid-cols-1 text-center">
      <div id="price" className="">{price && <CurrencyBeforeValue value={price} />}</div>
      <div className="text-[12px] text-tinBlue">
        {caption ? caption : includeVat ? 'incl. VAT' : 'ex. VAT'}
      </div>
    </div>
  )
}

const OrderDetails = ({ order }) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className="!py-6">
            <TableCell align="left" className="cart-head-item">
              Product
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Price
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Quantity
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Subtotal
            </TableCell>
            <TableCell align="center" className="cart-head-item">
              Exp. Delivery
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
            <TableCell align="center" className="cart-head-item" />
          </TableRow>
        </TableHead>
        <TableBody>
          {order.entries &&
            order.entries.map((entry) => (
              <TableRow
                key={entry.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <ProductInfo product={entry.product} />
                </TableCell>
                <TableCell className="cart-row-item">
                  {entry.tax && entry.tax.lines[0] ? (
                    <PriceWithInfo
                      price={
                        (entry.totalPrice - entry.totalDiscount.amount) /
                        entry.effectiveQuantity
                      }
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="center">{entry.effectiveQuantity}</TableCell>
                <TableCell className="cart-row-item">
                  {entry.tax && entry.tax.lines[0] ? (
                    <PriceWithInfo
                      price={entry.totalPrice - entry.totalDiscount.amount}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="cart-row-item">
                  {order.deliveryWindow?.deliveryDate
                    ? formatDate(order.deliveryWindow?.deliveryDate)
                    : '-'}
                </TableCell>
                <TableCell className="cart-row-item">
                  <PriceWithInfo price={entry.totalDiscount.amount} />
                </TableCell>
                <TableCell className="cart-row-item">
                  {entry.tax && entry.tax.lines[0] ? (
                    <PriceWithInfo
                    price={
                      ((entry.totalPrice - entry.totalDiscount.amount) *
                        entry.tax.lines[0].rate) /
                      100
                    }
                      caption={`${entry.tax.lines[0].rate}%`}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="cart-row-item">
                  <PriceWithInfo
                    price={
                      entry.totalPrice -
                      entry.totalDiscount.amount +
                      (+(entry.totalPrice - entry.totalDiscount.amount) *
                        entry.tax.lines[0].rate) /
                        100
                    }
                    includeVat={true}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OrderDetails
