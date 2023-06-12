import React from 'react'
import AccountLayout from './AccountLayout'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import {
  addReplenishmentOrdersUrl,
  editReplenishmentOrdersUrl,
} from '../../services/service.config'
import { CurrencyBeforeValue } from 'components/Utilities/common'

const repleishmentOrdersList = [
  {
    order_number: '#CMD-2022-0119-001',
    po: '199616',
    start_on: '2022-0119-001',
    frequency: 'Weekly',
    next_order_date: '19 Jan. 2022',
    total: '2,569.25',
  },
  {
    order_number: '#CMD-2022-0119-002',
    po: '199616',
    start_on: '2022-0119-001',
    frequency: 'Weekly',
    next_order_date: '19 Jan. 2022',
    total: '2,569.25',
  },
  {
    order_number: '#CMD-2022-0119-003',
    po: '199616',
    start_on: '2022-0119-001',
    frequency: 'Weekly',
    next_order_date: '19 Jan. 2022',
    total: '2,569.25',
  },
]

const RepleOrderItem = ({
  order_number,
  po,
  start_on,
  frequency,
  next_order_date,
  total,
}) => {
  return (
    <div className="py-6 border-t border-lightGray">
      <div className="flex justify-between">
        <span>{order_number}</span>
        <div className="flex">
          <div className="font-inter font-semibold text-[14px] underline">
            Edit
          </div>
          <div className="font-inter font-semibold text-[14px] underline ml-6">
            Cancel
          </div>
        </div>
      </div>
      <div className="pt-2">
        <span className="font-bold mr-2">Start On</span> {start_on}
      </div>

      <div className="pt-2">
        <span className="font-bold mr-2">Frequency</span> {frequency}
      </div>

      <div className="pt-2">
        <span className="font-bold mr-2">Next Order Date</span>{' '}
        {next_order_date}
      </div>
      <div className=" pt-2">
        <span className="font-bold mr-2">Total</span> {total}
      </div>
    </div>
  )
}

const ReplenishmentOrders = () => {
  return (
    <div>
      <Link to={addReplenishmentOrdersUrl()}>
        <div className="cta-button bg-yellow w-[278px] h-12 flex items-center my-12 md:mx-0 mx-auto">
          <span className="text-center  w-full">NEW REPLENISHMENT ORDER</span>
        </div>
      </Link>
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="!py-6">
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Order Number
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                PO#
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Start On
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Frequency
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Next Order Date
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Total
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repleishmentOrdersList.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" className="!py-6">
                  {row.order_number}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.po}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {' '}
                  {row.start_on}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.frequency}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.next_order_date}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <CurrencyBeforeValue value={row.total} />
                </TableCell>

                <TableCell align="left" className="!py-6">
                  <div className="flex">
                    <Link to={editReplenishmentOrdersUrl()}>
                      <div className="font-inter font-semibold text-[14px] underline">
                        Edit
                      </div>
                    </Link>
                    <div className="font-inter font-semibold text-[14px] underline ml-6">
                      Cancel
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="mobile_only">
        {repleishmentOrdersList.map((rows, index) => (
          <RepleOrderItem
            key={index}
            order_number={rows.order_number}
            po={rows.po}
            start_on={rows.start_on}
            frequency={rows.frequency}
            next_order_date={rows.next_order_date}
            total={rows.total}
          />
        ))}
      </div>
    </div>
  )
}

const AccountReplenishmentOrders = () => {
  return (
    <AccountLayout page="Replenishment Orders">
      {' '}
      <ReplenishmentOrders />
    </AccountLayout>
  )
}

export default AccountReplenishmentOrders
