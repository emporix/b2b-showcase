import React from 'react'
import ProductListContent from './ProductListContent'
import ProductListFilterPanel from './ProductListFilterPanel'

const ProductList = ({ handleSideFilterContent, filterItems }) => {
  return (
    <div className="flex lg:space-x-12 ">
      <div className="flex-auto lg:w-[23%] hidden lg:block bg-aliceBlue p-4 rounded">
        <ProductListFilterPanel
          handleSideFilterContent={handleSideFilterContent}
          filterItems={filterItems}
        />
      </div>
      <div className="flex-auto lg:w-[77%] w-full">
        <ProductListContent />
      </div>
    </div>
  )
}

export default ProductList
