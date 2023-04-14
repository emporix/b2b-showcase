import React, { useCallback } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Status from './common'
import { formatDateTime } from '../../components/Utilities/common'
import { useNavigate } from 'react-router-dom'
import QuoteStatus from './QuoteStatus'

const LeftChevron = () => {
  return (
    <svg
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.125 5.21484C6.37109 4.96875 6.37109 4.55859 6.125 4.28516L2.40625 0.566406C2.13281 0.320312 1.72266 0.320312 1.47656 0.566406L0.847656 1.19531C0.601562 1.46875 0.601562 1.87891 0.847656 2.125L3.5 4.77734L0.847656 7.40234C0.601562 7.64844 0.601562 8.05859 0.847656 8.33203L1.47656 8.93359C1.72266 9.20703 2.13281 9.20703 2.40625 8.93359L6.125 5.21484Z"
        fill="#0380F3"
      />
    </svg>
  )
}

const QuotesListMobile = ({ data }) => {
  return (
    <>
      {data.map((row) => (
        <div key={row.id} className="py-6 border-t border-lightGray">
          <div className="flex justify-between">
            <Status
              width={108}
              height={24}
              title={row.status.value}
              color={row.status.value === 'SHIPPED' ? '#FFA800' : '#4BCB67'}
            />
          </div>
          <div className="pt-2 font-bold">{row.id}</div>
          <div className="pt-2">{row.created}</div>
        </div>
      ))}
    </>
  )
}

export const QuotesList = (props) => {
  const { data } = props
  const navigate = useNavigate()

  const sortedData = useCallback(() => {
    return data.sort((a, b) => {
      const x = a.metadata.createdAt
      const y = b.metadata.createdAt
      return x < y ? 1 : x > y ? -1 : 0
    })
  }, [data])

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
                Created at
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Created By
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Quote number
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Valid until
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Contact
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData().map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  navigate(`${row.id}`)
                }}
                className="cursor-pointer hover:bg-slate-100"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {formatDateTime(row.metadata.createdAt)}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {`${row.customer.firstName} ${row.customer.lastName}`}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {row.id}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  {formatDateTime(row.validTo)}
                </TableCell>{' '}
                <TableCell
                  component="th"
                  scope="row"
                  className="!font-bold !py-6"
                >
                  Power Zone
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <div className="flex flex-row justify-center items-center">
                    <QuoteStatus status={row.status.value} className="mr-2" />
                    <LeftChevron />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mobile_only">
        <QuotesListMobile data={data} />
      </div>
    </div>
  )
}
