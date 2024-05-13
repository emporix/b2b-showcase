import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import './product.css'
import ProductListBanner from './ProductListBanner'

const ProductPage = () => {
  return (
    <>
      <ProductListBanner className="w-screen pt-24 md:pt-64 px-4" />
      <div className="px-4 md:px-24 pb-12">
        <div className="mt-8 w-auto">
          <ProductList/>
        </div>
      </div>
    </>
  )
}

export default ProductPage
