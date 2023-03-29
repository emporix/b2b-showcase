import { QuickOrderProvider } from 'context/quickorder-context'
import React from 'react'
import Layout from '../Layout'
import QuickOrderPage from './QuickOrderPage'

const QuickOrder = () => {
  const category = 'Quick Order'

  return (
    <Layout title={category}>
      <QuickOrderProvider>
        <QuickOrderPage />
      </QuickOrderProvider>
    </Layout>
  )
}

export default QuickOrder
