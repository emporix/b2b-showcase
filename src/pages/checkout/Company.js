import React from 'react'
import { GridLayout } from '../../components/Utilities/common'
import { TextRegular1 } from '../../components/Utilities/typography'
import './checkout.css'
import companyDetails from '../../assets/company-details.svg'

const Company = ({ data }) => {
  return (
    <div
      className="company-grid"
      sx={{
        gridTemplateColumns: '50px 1fr !important',
      }}
    >
      <img className="home-pin" src={companyDetails} alt="homePin" />
      <>
        <TextRegular1>
          <b>{data?.name ?? ''}</b>
          <br />
          {data?.erpData!== undefined && <ul>
            <li><b>Ship To:</b> {data.erpData.shipTo}</li>
            <li><b>Sold To:</b> {data.erpData.soldTo}</li>
            <li><b>Sales org</b> {data.erpData.salesOrg}</li>
          </ul>
          }
        </TextRegular1>
      </>
    </div>
  )
}

export default Company
