import React from 'react'
import QuickOrderContent from './QuickOrderContent'
import QuickOrderSelection from './QuickOrderSelection'
import './quickorder.css'
const QuickOrderPage = () => {
  return (
    <div className="quickorder-page-wrapper ml-[96px]">
      <div className="md:pt-24 pt-[58px] w-full gap-12 md:flex">
        <QuickOrderContent />
        <QuickOrderSelection />
      </div>
    </div>
  )
}

export default QuickOrderPage
