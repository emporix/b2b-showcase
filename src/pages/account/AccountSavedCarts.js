import React from 'react'
import AccountLayout from './AccountLayout'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { CurrencyBeforeValue } from 'components/Utilities/common'

const savedCartsList = [
  {
    date: '11/05/2022',
    name: 'Basket Name',
    items: '24',
    total: '2,569.25',
  },
  {
    date: '11/05/2022',
    name: 'Basket Name',
    items: '17',
    total: '2,569.25',
  },
  {
    date: '11/05/2022',
    name: 'Basket Name',
    items: '4',
    total: '2,569.25',
  },
  {
    date: '11/05/2022',
    name: 'Basket Name',
    items: '24',
    total: '2,569.25',
  },
  {
    date: '11/05/2022',
    name: 'Basket Name',
    items: '24',
    total: '2,569.25',
  },
]

const MobileCartItem = ({ date, name, items, total }) => {
  return (
    <div className="py-6 border-t border-lightGray">
      <div className="flex justify-between">
        <span>{name}</span>
        <div className="flex">
          <div className="font-inter font-semibold text-[14px] underline">
            Edit
          </div>
          <div className="font-inter font-semibold text-[14px] underline ml-6">
            Cancel
          </div>
        </div>
      </div>
      <div className="pt-2">{items} items</div>
      <div className="pt-2">{date}</div>
      <div className="font-inter font-bold pt-2">{total}</div>
    </div>
  )
}

export const SavedCarts = () => {
  return (
    <div className="md:mt-20">
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                className="grid-column-title"
              >
                Date
              </TableCell>
              <TableCell
                align="left"
                className="grid-column-title"
              >
                Name
              </TableCell>
              <TableCell
                align="left"
                className="grid-column-title"
              >
                Items
              </TableCell>
              <TableCell
                align="left"
                className="grid-column-title"
              >
                Total
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedCartsList.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className="!py-6"
              >
                <TableCell component="th" scope="row" className="!py-6">
                  {row.date}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.name}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  {row.items}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <CurrencyBeforeValue value={row.total} />
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline">
                      Edit
                    </div>
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
        {savedCartsList.map((rows, index) => (
          <MobileCartItem
            key={index}
            name={rows.name}
            date={rows.date}
            items={rows.items}
            total={rows.total}
          />
        ))}
      </div>
    </div>
  )
}

const AccountSavedCarts = () => {
  return (
    <AccountLayout page="Saved Carts">
      <SavedCarts />
    </AccountLayout>
  )
}

export default AccountSavedCarts
