import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import { fetchSingleReturn } from '../../services/returns'
import {useParams} from "react-router-dom";
import {ReturnDetails} from "./ReturnDetails";
import ReturnInfoStatus from "./ReturnInfoStatus";
import {formatCurrency} from "../../helpers/currency";

const AccountReturnDetails = () => {
  const [singleReturn, setSingleReturn] = useState([])
  const { returnId } = useParams()

  const getSingleReturn = useCallback(async () => {
    const fetchedReturn = await fetchSingleReturn(returnId)
    setSingleReturn(fetchedReturn)
  }, [])

  useEffect(() => {
    getSingleReturn()
  }, [])

  return (
    <AccountLayout page={`Return Number ${singleReturn.id}`}>
      <ReturnInfoStatus status={singleReturn.approvalStatus} />
      <ReturnDetails data={singleReturn}/>
      <div className='flex justify-end'>
        <div
            className={`font-bold items-center text-center p-6 ${singleReturn.approvalStatus === 'REJECTED' && 'text-gray'}`}
            style={{backgroundColor: '#F7F8F8'}}
        >
            { singleReturn.approvalStatus === 'APPROVED' ? `Your Total Refund Amount` : `Total Amount`}
          <span className='ml-6'>
              {singleReturn.total && formatCurrency(singleReturn.total.currency, singleReturn.total.value)}
          </span>
        </div>
      </div>
    </AccountLayout>
  )
}

export default AccountReturnDetails
