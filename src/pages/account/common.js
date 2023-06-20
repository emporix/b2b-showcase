import classNames from 'classnames'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import React from 'react'

export const GrayStatus = ({ status }) => {
  return (
    <div
      style={{
        width: `108px`,
        height: `36px`,
        fontSize: '10px',
        backgroundColor: '#C4C4C4',
        color: `white`,
        padding: '8px 16px',
        fontWeight: 'bold',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          marginRight: '8px',
          backgroundColor: `white`,
          borderRadius: '50px',
        }}
      ></div>
      {status}
    </div>
  )
}

export const GreenStatus = ({ status }) => {
  return (
    <div
      style={{
        width: `108px`,
        height: `36px`,
        fontSize: '10px',
        backgroundColor: 'rgba(75, 203, 103, 0.2)',
        color: `#4BCB67`,
        padding: '8px 16px',
        fontWeight: 'bold',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          marginRight: '8px',
          backgroundColor: `#4BCB67`,
          borderRadius: '50px',
        }}
      ></div>
      {status}
    </div>
  )
}

export const OrangeStatus = ({ status }) => {
  return (
    <div
      style={{
        width: `108px`,
        height: `36px`,
        fontSize: '10px',
        backgroundColor: 'rgba(255, 168, 0, 0.2)',
        color: '#FFA800',
        padding: '8px 16px',
        fontWeight: 'bold',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          marginRight: '8px',
          backgroundColor: '#FFA800',
          borderRadius: '50px',
        }}
      ></div>
      {status}
    </div>
  )
}

export const renderStatus = (status) => {
  switch (status) {
    case 'CREATED': {
      return <GrayStatus status={status} />
    }
    case 'DECLINED':
    case 'CANCELED': {
      return <OrangeStatus status={status} />
    }
    case 'CONFIRMED': {
      return <GreenStatus status={status} />
    }
    default: {
      return <GrayStatus status={status} />
    }
  }
}

export const Status = ({ width, height, color, title }) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: '10px',
        backgroundColor: classNames(
          title === 'SHIPPED'
            ? `rgba(255, 168, 0, 0.2)`
            : `rgba(75, 203, 103, 0.2)`
        ),
        color: `${color}`,
        padding: '8px 16px',
        fontWeight: 'bold',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          marginRight: '8px',
          backgroundColor: `${color}`,
          borderRadius: '50px',
        }}
      ></div>
      {title}
    </div>
  )
}
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
        <div className="">{items} items</div>
      </div>
      <div className="flex justify-between pt-2">
        <div className="font-inter font-bold">
          <CurrencyBeforeValue value={total} />
        </div>
        <div className="">{date}</div>
      </div>
    </div>
  )
}

export const SavedCarts = ({ actions }) => {
  return (
    <div className="">
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
                    {actions.map((row, index) => (
                      <div
                        key={index}
                        className={
                          index > 0
                            ? 'font-inter font-semibold text-[14px] underline ml-6'
                            : 'font-inter font-semibold text-[14px] underline'
                        }
                      >
                        {row.title}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mobile_only">
        <div className="flex py-[5px] justify-between SavedCarts-Mobile-Header">
          <div>Date</div>
          <div className="">Name</div>
        </div>
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

export default Status
