import React from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { formatCurrency } from 'helpers/currency'
import {GridLayout} from "../../components/Utilities/common";

const ProductInfo = ({ product }) => {
  return (
      <div className="flex gap-6">
        <div className="w-[52px] h-[52px]">
          {product?.url ? (
              <img alt={product.name} src={product.url} className="p-0" />
          ) : (
              <div className="flex align-content-center h-[52px]">'No image'</div>
          )}
        </div>
        <div className="w-[200px]">
          <GridLayout className="gap-2">
            <div className="font-bold">{product.name}</div>
            <div className="text-[12px]">{`SKU: ${product.id}`}</div>
          </GridLayout>
        </div>
      </div>
  )
}

export const ReturnDetails = ({ data }) => {
  return (
    <div className="md:mt-[60px]">
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="!py-6">
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Product
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Price
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Quantity
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Refund Amount
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {data.orders && data.orders[0].items.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-slate-100"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" className="!py-6">
                  <ProductInfo product={row} />
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {formatCurrency(row.unitPrice.currency, row.unitPrice.value)}
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {row.quantity}
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {formatCurrency(row.total.currency, row.total.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
