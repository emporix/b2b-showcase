import React, { useCallback, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Status, { renderStatus } from './common'
import {
  CurrencyAfterValue,
  formatDate,
} from '../../components/Utilities/common'
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
import CreateReturnModal from 'pages/returns/CreateReturnModal'
import Dialog from 'components/Utilities/Dialog'

const OrderListMobile = ({ orders }) => {
  return (
    <>
      {orders.map((row) => (
        <div key={row.id} className="py-6 border-t border-lightGray">
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
                <Link to={`${myAccountMyOrdersInvoiceUrl()}${row.id}`}>
                  Invoice
                </Link>
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
  const RMA_MODAL = process.env.REACT_APP_RMA_MODAL
  const { orders, invoiceAvailable } = props
  const { returns } = useReturns()
  const navigate = useNavigate()
  const [showRMAModal, setShowRMAModal] = useState(false)
  const [RMAId, setRMAId] = useState(null)

  const [showAlreadySubmittedError, setError] = useState(false)

  const downloadInvoice = (order) => {
    const invoiceUrl = order?.mixins?.invoice?.invoiceDocument.replace(
      'mediaObject',
      'customerMediaObject'
    )
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

  const handleCloseRMAModal = useCallback(
    () => {
      setShowRMAModal(false)
      setRMAId(null)
    }
  )

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
        if(RMA_MODAL) {
          setShowRMAModal(true)
          setRMAId(id)
        } else {
          navigate(`${createReturnUrl()}${id}`, { replace: true })
        }
      }
    },
    [returns]
  )

  const getDiscountValue = (row) => {
    const totalDiscount = row.discounts?.find(discount => discount.code === "TOTAL")
    return totalDiscount ? totalDiscount.amount : 0
  }

  const getTaxValue = (entries) => {
    const taxValue = entries.reduce((totalTax, el) => {
      const hasIncludedTax = el.tax?.lines[0]?.inclusive
      const itemTaxValue = ((el.totalPrice - el.totalDiscount?.amount) * (el.tax?.lines[0]?.rate / 100))
      return !hasIncludedTax ? Number(itemTaxValue) + Number(totalTax) : Number(totalTax)
    }, 0)
    return Number(taxValue.toFixed(2))
  }

  return (
    <div>
      <Dialog
          maxWidth="xl"
          open={showRMAModal}
          onClose={handleCloseRMAModal}
        >
        <CreateReturnModal orderId={RMAId}></CreateReturnModal>
      </Dialog>
      {showAlreadySubmittedError && (
        <ReturnInfoStatus status="INTERNAL_ALREADY_SUBMITTED" />
      )}
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="!py-6">
              <TableCell align="center" className="grid-column-title">
                Order Number
              </TableCell>
              <TableCell align="center" className="grid-column-title">
                Status
              </TableCell>
              <TableCell align="center" className="grid-column-title">
                <div className="font-normal grid grid-cols-1 text-center">
                  <div className="">
                    Total with shipping cost
                  </div>
                  <div className="text-[12px]">
                     incl. VAT
                  </div>
                </div>
              </TableCell>
              <TableCell align="center" className="grid-column-title">
                Exp. Delivery Date
              </TableCell>
              <TableCell align="center" className="grid-column-title">
                Created
              </TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {row.id}
                </TableCell>
                <TableCell align="center" className="!py-6">
                  {renderStatus(row.status)}
                </TableCell>
                <TableCell align="center" className="!py-6">
                  <CurrencyAfterValue
                    value={row.subTotalPrice + getTaxValue(row.entries) + row.shipping?.total?.amount - getDiscountValue(row)}
                    currency={row.currency}
                  />
                </TableCell>
                <TableCell align="center" className="!py-6">
                  {row.deliveryWindow?.deliveryDate ? formatDate(row.deliveryWindow?.deliveryDate) : '-'}
                </TableCell>
                <TableCell align="center" className="!py-6">
                  {formatDate(row.created)}
                </TableCell>
                <TableCell align="center" className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline">
                      <Link to={`${myAccountMyOrdersViewUrl()}${row.id}`}>
                        View
                      </Link>
                    </div>
                    <div className="font-inter font-semibold text-[14px] underline ml-6">
                      <span
                        onClick={() => handleCreateReturn(row.id)}
                        className="cursor-pointer"
                      >
                        Return
                      </span>
                    </div>
                    {invoiceAvailable && (
                      <div className="font-inter font-semibold text-[14px] underline ml-6">
                        {row?.mixins?.invoice?.invoiceDocument && (
                          <a
                            onClick={() => downloadInvoice(row)}
                            className="download-invoice-link"
                          >
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
