import React from 'react'
import Layout from '../Layout'
import CreateReturnPage from './CreateReturn'

const CreateReturn = () => {
  const title = `Shopping Cart`
  return (
    <Layout title={title}>
      <CreateReturnPage />
    </Layout>
  )
}
export default CreateReturn
