import React, { useEffect, useState } from 'react'
import MobileFilterpanel from './MobileFilterPanel'
import SideFilterContent from './SideFilterContent'
import ProductList from './ProductList'
import './product.css'
import ProductListBanner from './ProductListBanner'

const FilterButton = (props) => {
  return (
    <div
      className="lg:hidden w-[327px] mb-12 h-12 mx-auto bg-tinBlue text-white flex items-center"
      onClick={props.onClick}
    >
      <div className="mx-auto flex">
        <img src="/adjust.png" className="w-4 h-4 mt-1" />
        <span className="px-4">Filters</span>
        <span>[{props.filtercount}]</span>
      </div>
    </div>
  )
}

const ProductPage = () => {
  const [showFilterContentForMobile, setShowFilterContentForMobile] =
    useState(false)
  const [showSideFilterContnet, setShowSideFilterContent] = useState(false)
  const [filterItems, setFilterItems] = useState([])
  const setFilterItemFunc = (data) => {
    setFilterItems(data)
  }

  const handleMobileFilterContentClose = () => {
    setShowFilterContentForMobile(false)
  }
  const handleSideFilterContent = () => {
    setShowSideFilterContent(!showSideFilterContnet)
  }
  return (
    <>
      {showFilterContentForMobile && (
        <MobileFilterpanel closeNav={handleMobileFilterContentClose} />
      )}

      <ProductListBanner className="w-screen pt-24 md:pt-64 px-4" />
      <div className="px-4 md:px-24 pb-12 ">
        <div
          className={`overlay ${showSideFilterContnet ? 'visible' : ''}`}
          onClick={handleSideFilterContent}
        />
        <SideFilterContent
          isOpen={showSideFilterContnet}
          toggleSidebar={handleSideFilterContent}
          setFilterItemFunc={setFilterItemFunc}
        />
        <div className="md:pt-16 mt-44 w-auto">
          <FilterButton
            filtercount={4}
            onClick={() => {
              setShowFilterContentForMobile(true)
            }}
          />
          <ProductList
            handleSideFilterContent={handleSideFilterContent}
            filterItems={filterItems}
          />
        </div>
      </div>
    </>
  )
}

export default ProductPage
