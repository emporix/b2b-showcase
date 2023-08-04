import React, { useState, useEffect } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { renderStatus } from './common'
import { Link } from 'react-router-dom'
import {
  myAccountMySubscriptionsManage,
} from '../../services/service.config'
import { formatDate } from '../../components/Utilities/common'


export const SubscriptionsList = (props) => {
  const { subscriptions } = props

  const [subsriptionProducts, setSubscriptionProducts] = useState([])

  useEffect(() => {
    const extractedSubscriptions = subscriptions.map(subscription => subscription.entries.filter(entry => entry.product.mixins.subscription).map(subscriptionEntry => ({
      id : subscription.id,
      product : subscriptionEntry.product
    }))).flatMap(arr => arr)
    setSubscriptionProducts(extractedSubscriptions)
  }, [subscriptions])  

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
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Product name
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Start date
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                End date
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Billing period
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Duration
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Status
              </TableCell>
              <TableCell align="left" />
              <TableCell align="left" />
              
            </TableRow>
          </TableHead>
          <TableBody>
            {subsriptionProducts.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {row.product?.images[0]?.url ? <img src={row.product.images[0].url} height="64" width="64"/> : <></>}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {row.product.name}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {formatDate(row.product.mixins.subscription.start_date)}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {formatDate(row.product.mixins.subscription.end_date)}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.product.mixins.subscription.billing_periods}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.product.mixins.subscription.duration}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {renderStatus(row.product.mixins.subscription.status)}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline">
                      <Link to={`${myAccountMySubscriptionsManage()}manage/${row.id}/${row.product.id}`}>
                        Manage 
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline">
                    <Link to={`${myAccountMySubscriptionsManage()}view/${row.id}/${row.product.id}`}>
                         View
                      </Link>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
