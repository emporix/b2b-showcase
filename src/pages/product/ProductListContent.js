import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { availabilityDataSelector } from '../../redux/slices/availabilityReducer'
import { useAuth } from 'context/auth-provider'
import { useProductList } from 'context/product-list-context'

import EachProduct from './EachProduct'
import EachProductRow from './EachProductRow'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'

import { HiOutlineArrowLeft, HiOutlineArrowRight, HiViewList, HiViewGrid } from 'react-icons/hi'
import NavDropdown from 'components/Utilities/dropdown/NavDropdown'

const productListBoxShadow = {
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
}

const ProductListViewSettingBar = ({
  changeDisplayType,
  productsPerPage,
  productListCountsPerPage,
  productSortingTypes,
  sortingTypeIndex,
  changeSortingTypeIndex,
  changePerPageCount,
  displayType,
}) => {
  return (
    <div
      className="view-setting-wrapper h-fit px-0 md:px-4 py-2 bg-aliceBlue rounded-xl mb-4"
      style={productListBoxShadow}
    >
      <div className="view-setting-bar">
        <div>
          <ul className="setting gap-2 flex justify-between font-inter text-base font-normal">
            <li className="per-page">
              <NavDropdown
                name="Products"
                small
                list={productListCountsPerPage.map((cnt) => ({
                  text: cnt + ' per page',
                  value: cnt,
                }))}
                onChangeHandler={changePerPageCount}
                currentValue={productsPerPage}
              />
            </li>
            {/* <li className="product-result-caption hidden lg:block">
              Products found: {productListCount}
            </li> */}
            {/* <li className="product-result-caption  lg:hidden">
              {productListCount} Products
            </li> */}
            <li className="sort-by">
              <NavDropdown
                name="Sort"
                small
                list={productSortingTypes.map((type, idx) => ({
                  text: type.name,
                  value: idx,
                }))}
                onChangeHandler={changeSortingTypeIndex}
                currentValue={sortingTypeIndex}
              />
            </li>
            <li className="view-type">
              <div className="gap-2 md:gap-4 flex p-1">
                <div className="lg:block products-filter-name">View:</div>
                <div
                  id="grid-view"
                  className="cursor-pointer hover:text-yellow"
                  onClick={() => changeDisplayType('grid')}
                >
                  <HiViewGrid size={20} color={displayType === 'grid' ? '#FAC420' : 'black'} />
                </div>
                <div id="list-view" className="cursor-pointer" onClick={() => changeDisplayType('list')}>
                  <HiViewList size={20} color={displayType === 'list' ? '#FAC420' : 'black'} />
                </div>
              </div>
            </li>
          </ul>
          {/* <div className="mt-2 split-line h-0 border-b border-bgWhite border-solid"></div> */}
        </div>
      </div>
    </div>
  )
}

const ProductListItems = ({ products, auth, displayType }) => {
  const availability = useSelector(availabilityDataSelector)

  const gridSys = displayType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'

  return (
    <div className={`grid gap-4 md:gap-8 auto-cols-max ${gridSys} mb-4 xl:mb-12`}>
      {products.map((item) => {
        return (
          <div key={item.id} className="hover:scale-[1.01] transition-all duration-150 ease-in">
            {React.createElement(displayType === 'grid' ? EachProduct : EachProductRow, {
              key: item.id,
              stockLevel: availability['k' + item.id]?.stockLevel || 0,
              item: item,
              rating: 4,
            })}
          </div>
        )
      })}
    </div>
  )
}

const ProductListPagination = ({ changePageNumber, countPerPage, productListCount, pageNumber }) => {
  let totalPage = Math.ceil(productListCount / countPerPage)
  let previousPageitems = []
  let next_page_items = []

  if (totalPage < pageNumber) pageNumber = 1

  for (let i = pageNumber - 1; i > 1 && i > pageNumber - 3; i--)
    previousPageitems.unshift(
      <li key={i} className="cursor-pointer" onClick={() => changePageNumber(i)}>
        {i}
      </li>
    )

  for (let i = pageNumber + 1; i < totalPage && i < pageNumber + 3; i++)
    next_page_items.push(
      <li key={i} className="cursor-pointer" onClick={() => changePageNumber(i)}>
        {i}
      </li>
    )

  return (
    <div className="product-list-pagination items-center h-[24px] text-center w-full mx-auto">
      <div className="text-center items-center flex">
        <ul className="select-none gap-6 mx-auto items-center flex text-[18px] leading-[26px] font-inter text-gray">
          <li
            className={pageNumber === 1 ? '' : 'cursor-pointer'}
            onClick={() => {
              if (pageNumber > 1) changePageNumber(pageNumber - 1)
            }}
          >
            <HiOutlineArrowLeft size={24} color={pageNumber === 1 ? '#ACAEB2' : 'black'} />
          </li>
          {pageNumber !== 1 && (
            <li className="cursor-pointer" onClick={() => changePageNumber(1)}>
              1
            </li>
          )}
          {pageNumber > 4 && <li>...</li>}
          {previousPageitems}
          <li className="font-bold text-black">{pageNumber}</li>
          {next_page_items}
          {pageNumber + 3 < totalPage && <li>...</li>}
          {pageNumber !== totalPage && totalPage !== 0 && (
            <li className="cursor-pointer" onClick={() => changePageNumber(totalPage)}>
              {totalPage}
            </li>
          )}
          <li
            className={pageNumber < totalPage ? 'cursor-pointer' : ''}
            onClick={() => {
              if (pageNumber < totalPage) {
                changePageNumber(pageNumber + 1)
              }
            }}
          >
            <HiOutlineArrowRight size={24} color={pageNumber === totalPage || totalPage === 0 ? '#ACAEB2' : 'black'} />
          </li>
        </ul>
      </div>
    </div>
  )
}

const ProductListContent = () => {
  const { user } = useAuth()
  const [displayType, setDisplayType] = useState('grid')

  const {
    productIds,
    isProductsLoading,
    products,
    setPageNumber,
    pageNumber,
    productListCountsPerPage,
    productsPerPage,
    setProductsPerPage,
    sortingTypes,
    sortingTypeIndex,
    setSortingTypeIndex,
    total,
  } = useProductList()
  // console.log({ products })

  const productsWithoutVariants = useMemo(() => {
    return products.filter((p) => p.productType !== 'VARIANT')
  }, [products])

  const changeDisplayType = (status) => {
    setDisplayType(status)
  }
  const changePageNumber = (number) => {
    setPageNumber(number)
  }
  const changePerPageCount = (event) => {
    setPageNumber(1)
    setProductsPerPage(parseInt(event.target.value))
  }

  const changeSortingType = (event) => {
    setPageNumber(1)
    setSortingTypeIndex(parseInt(event.target.value))
  }

  useEffect(() => {
    setPageNumber(1)
  }, [productIds, setPageNumber])

  return (
    <>
      <ProductListViewSettingBar
        displayType={displayType}
        changePerPageCount={changePerPageCount}
        changeDisplayType={changeDisplayType}
        productListCount={productsWithoutVariants.length}
        productListCountsPerPage={productListCountsPerPage}
        changeSortingTypeIndex={changeSortingType}
        sortingTypeIndex={sortingTypeIndex}
        productSortingTypes={sortingTypes}
        productsPerPage={productsPerPage}
      />
      {isProductsLoading ? (
        <LoadingCircleProgress1 />
      ) : (
        <>
          <ProductListItems
            products={productsWithoutVariants}
            auth={!!user}
            displayType={displayType}
            productListCount={productsWithoutVariants.length}
            pageNumber={pageNumber}
            countPerPage={productsPerPage}
          />
          <ProductListPagination
            changePageNumber={changePageNumber}
            countPerPage={productsPerPage}
            productListCount={total}
            pageNumber={pageNumber}
          />
        </>
      )}
    </>
  )
}

export default ProductListContent
