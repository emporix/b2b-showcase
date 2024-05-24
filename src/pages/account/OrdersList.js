import React, { useCallback, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Status, { renderStatus } from './common'
import { CurrencyAfterValue, formatDate } from '../../components/Utilities/common'
import { Link, useNavigate } from 'react-router-dom'
import {
  myAccountMyOrdersInvoiceUrl,
  myAccountMyOrdersViewUrl,
  createReturnUrl,
  shippingApi,
} from '../../services/service.config'
import { useReturns } from 'context/returns-provider'
import ReturnInfoStatus from './ReturnInfoStatus'
import axios from 'axios'
import { ACCESS_TOKEN } from 'constants/localstorage'
import './OrderList.css'

const OrderListMobile = ({ orders }) => {
  return (
    <>
      {orders.map((row) => (
        <div key={row.id} className="py-6">
          <div className="flex justify-between">
            <Status
              width={108}
              height={24}
              title={row.status}
              color={row.status === 'SHIPPED' ? '#FFA800' : '#4BCB67'}
            />
            <div className="flex">
              <div className="font-inter font-semibold text-[14px] underline">
                <Link to={`${myAccountMyOrdersViewUrl()}${row.id}`}>View</Link>
              </div>
              <div className="font-inter font-semibold text-[14px] underline ml-6">
                <Link to={`${myAccountMyOrdersInvoiceUrl()}${row.id}`}>Invoice</Link>
              </div>
              <div className="font-inter font-semibold text-[14px] underline ml-6">
                <Link to={`${createReturnUrl()}${row.id}`}>Return</Link>
              </div>
            </div>
          </div>
          <div className="pt-2 font-bold">{row.id}</div>
          <div className="font-inter pt-2">
            <CurrencyAfterValue value={row.totalPrice} />
          </div>
          <div className="pt-2">{row.created}</div>
        </div>
      ))}
    </>
  )
}

export const OrderList = (props) => {
  const { orders, invoiceAvailable } = props
  const { returns } = useReturns()
  const navigate = useNavigate()

  const [showAlreadySubmittedError, setError] = useState(false)

  const downloadInvoice = (order) => {
    const invoiceUrl = order?.mixins?.invoice?.invoiceDocument.replace('mediaObject', 'customerMediaObject')
    const token = localStorage.getItem(ACCESS_TOKEN)
    axios({
      url: invoiceUrl,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const href = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', 'invoice_' + order.id + '.pdf')
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    })
  }

  const handleCreateReturn = useCallback(
    (id) => {
      setError(false)
      if (
        returns.some((r) => {
          return r.orders.some((order) => order.id === id)
        })
      ) {
        setError(true)
      } else {
        navigate(`${createReturnUrl()}${id}`, { replace: true })
      }
    },
    [returns]
  )

  const getShippingCost = (row) => {
    if (row && row.shipping && row.shipping.lines && row.shipping.lines.length > 0 && row.shipping.lines[0].amount) {
      return row.shipping.lines[0].amount
    }
    return 0
  }

  return (
    <div>
      {showAlreadySubmittedError && <ReturnInfoStatus status="INTERNAL_ALREADY_SUBMITTED" />}
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="!py-6">
              <TableCell className="grid-column-title">Order Number</TableCell>
              <TableCell className="grid-column-title">Status</TableCell>
              <TableCell className="grid-column-title">
                <div className="font-normal grid grid-cols-1">
                  <div className="">Total with shipping cost</div>
                  <div className="text-[12px]">incl. VAT</div>
                </div>
              </TableCell>
              <TableCell className="grid-column-title">Exp. Delivery Date</TableCell>
              <TableCell className="grid-column-title">Created</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" className="!font-bold !py-6">
                  {row.id}
                </TableCell>
                <TableCell className="!py-6">{renderStatus(row.status)}</TableCell>
                <TableCell className="!py-6">
                  <CurrencyAfterValue
                    value={
                      row.subTotalPrice + getShippingCost(row) + row.tax.lines.reduce((sum, el) => sum + el.amount, 0)
                    }
                    currency={row.currency}
                  />
                </TableCell>
                <TableCell className="!py-6">
                  {row.deliveryWindow?.deliveryDate ? formatDate(row.deliveryWindow?.deliveryDate) : '-'}
                </TableCell>
                <TableCell className="!py-6">{formatDate(row.created)}</TableCell>
                <TableCell className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline">
                      <Link to={`${myAccountMyOrdersViewUrl()}${row.id}`}>View</Link>
                    </div>
                    <div className="font-inter font-semibold text-[14px] underline ml-6">
                      <span onClick={() => handleCreateReturn(row.id)} className="cursor-pointer">
                        Return
                      </span>
                    </div>
                    {invoiceAvailable && (
                      <div className="font-inter font-semibold text-[14px] underline ml-6">
                        {row?.mixins?.invoice?.invoiceDocument && (
                          <a onClick={() => downloadInvoice(row)} className="download-invoice-link">
                            Download invoice
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mobile_only">
        <OrderListMobile orders={orders} />
      </div>
    </div>
  )
}
