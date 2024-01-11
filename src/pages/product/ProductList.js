import React from 'react'
import ProductListContent from './ProductListContent'
import ProductListFilterPanel from './ProductListFilterPanel'

const ProductList = ({ handleSideFilterContent, filterItems }) => {
  const productListBoxShadow = {
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
  }

  return (
    <>
      <div className="flex lg:space-x-12">
        <div className="flex-auto lg:w-[23%] hidden lg:block bg-aliceBlue p-6 rounded-lg" style={productListBoxShadow} >
          <ProductListFilterPanel
            handleSideFilterContent={handleSideFilterContent}
            filterItems={filterItems}
            />
        </div>
        <div className="flex-auto lg:w-[77%] w-full">
          <ProductListContent />
        </div>
      </div>
    </>
  )
}

export default ProductList
