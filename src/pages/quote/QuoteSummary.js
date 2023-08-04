import React from 'react'
import { Link } from 'react-router-dom'
import {homeUrl, myAccountMyOrders, myAccountQuotes} from '../../services/service.config'
import { LargePrimaryButton } from '../../components/Utilities/button'

const QuoteSummary = (props) => {
  const { quoteId } = props

  return (
    <div className="font-inter">
      <div className="border-b pb-12">
        <div className="md:flex justify-between">
          <div className="font-semibold text-[32px]">
            Your Request has been received
          </div>
        </div>
        <div className="pt-12 text-base">
          <div>
            Your quotation number is:
            <span className="font-bold"> #{quoteId}</span>
          </div>
        </div>
      </div>
      <div className="pt-12 grid md:grid-cols-2 grid-cols-1">
        <div className="md:border-r md:border-b-0 border-b md:pr-20 pb-12">
          <div className="font-semibod text-2xl">Quotation Status</div>
          <div className="pt-6">
            <span>
              You will soon receive an confirmation e-mail with details of
              your quotation and a link to track its progress.
            </span>
          </div>
        </div>
        <div className="md:pl-12 md:pt-0 pt-12">
          <div className="font-semibod text-2xl">Support</div>
          <div className="pt-6">Primary contacts for any questions</div>
          <div className="pt-6">
            <span>Atom HQ</span> <br />
            <span>Marsstraße 43,</span> <br />
            <span>80335 München,</span> <br />
            <span>Germany</span> <br />
          </div>
          <div className="pt-6">support@atom.com</div>
        </div>
      </div>
      <div className="pt-12 w-full flex gap-8 checkout-actions">
        <Link to={homeUrl()}>
          <LargePrimaryButton
            className="md:block hidden w-auto bg-yellow rounded text-eerieBlack"
            title="BACK TO HOME PAGE"
          />
        </Link>
        <Link to={myAccountQuotes()}>
          <LargePrimaryButton
            className="md:block hidden w-auto bg-yellow rounded text-eerieBlack"
            title="QUOTE OVERVIEW"
          />
        </Link>
      </div>
    </div>
  )
}

export default QuoteSummary
