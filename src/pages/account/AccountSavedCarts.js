import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import approvalService from 'services/approval.service'
import { formatDateTime } from 'components/Utilities/common'
import { useNavigate } from 'react-router-dom'
import { approvalCheckoutPage } from 'services/service.config'
import { USER } from 'constants/localstorage'

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

export const renderStatus = (status) => {
  switch (status) {
    case 'PENDING': {
      return (
        <ApprovalStatus
          status={status}
          bgColor={'rgba(255, 168, 0, 0.2)'}
          textColor={'#FFA800'}
        />
      )
    }
    case 'APPROVED': {
      return (
        <ApprovalStatus
          status={status}
          bgColor={'rgba(40, 164, 67, 0.15)'}
          textColor={'rgba(40, 164, 67, 1)'}
        />
      )
    }
    default: {
      return (
        <ApprovalStatus
          status={status}
          bgColor={'rgba(243, 3, 3, 0.15)'}
          textColor={'rgba(243, 3, 3, 1)'}
        />
      )
    }
  }
}

export const calculateTotalPrice = (approval) => {
  return (
    approval.resource.subtotalAggregate.grossValue +
    approval.details.shipping.amount
  )
}

const ApprovalStatus = ({ status, bgColor, textColor }) => {
  return (
    <div
      style={{
        height: `36px`,
        fontSize: '10px',
        backgroundColor: bgColor,
        color: textColor,
        padding: '8px 16px 8px 16px',
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
          backgroundColor: textColor,
          borderRadius: '50px',
        }}
      ></div>
      {status}
    </div>
  )
}

export const SavedCarts = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem(USER))
  const customerId = user.id
  const [savedCartsList, setSavedCartsList] = useState([])

  const getApprovals = useCallback(async () => {
    const fetchedPendingApprovals =
      await approvalService.getPendingAndDeclinedApprovals()
    setSavedCartsList(fetchedPendingApprovals)
  })

  const shouldNavigateToCheckout = (row) =>{
    return row.approver.userId === customerId && row.status === 'PENDING'
  }

  useEffect(() => {
    getApprovals()
  }, [])

  return (
    <div className="md:mt-[60px]">
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left" className="!font-bold grid-column-title">
                Date
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Requestor
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Approver
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Total
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedCartsList.map((row, index) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  shouldNavigateToCheckout(row)
                    ? navigate(approvalCheckoutPage(row.id))
                    : navigate(`${row.id}`)
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
                <TableCell align="left" className="!font-bold !py-6">
                  {`${row.requestor.firstName} ${row.requestor.lastName}`}
                </TableCell>
                <TableCell align="left" className="!font-bold !py-6">
                  {`${row.approver.firstName} ${row.approver.lastName}`}
                </TableCell>
                <TableCell align="left" className="!font-bold !py-6">
                  <CurrencyBeforeValue value={calculateTotalPrice(row)} />
                </TableCell>
                <TableCell align="left" className="!font-bold !py-6">
                  <div className="flex flex-row justify-left items-center">
                    {renderStatus(row.status)}
                    <div className="ml-2">
                      <LeftChevron />
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
