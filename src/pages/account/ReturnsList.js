import React, { useMemo } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { formatDate } from '../../components/Utilities/common'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from 'helpers/currency'
import ReturnStatus from './ReturnStatus'

export const ReturnsList = ({ data }) => {
  const navigate = useNavigate()

  const sortedData = useMemo(() => {
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
                Return number
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Return Date
              </TableCell>
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
                Status
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Total
              </TableCell>
              <TableCell
                align="left"
                className="font-inter !font-bold text-base"
              >
                Status Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  navigate(`${row.id}`)
                }}
                className="cursor-pointer hover:bg-slate-100"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" className="!py-6">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {formatDate(row.expiryDate)}
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {row.orders[0].id}
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  <ReturnStatus status={row.approvalStatus} />
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {formatCurrency(row.total.currency, row.total.value)}
                </TableCell>
                <TableCell component="th" scope="row" className="!py-6">
                  {formatDate(row.metadata.modifiedAt)}
                </TableCell>
                <TableCell align="left" className="!py-6 underline !font-bold">
                  View
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
