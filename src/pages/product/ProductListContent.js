import { CgMenuGridR } from 'react-icons/cg'
import { BiMenu } from 'react-icons/bi'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { IconContext } from 'react-icons'
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiChevronDown } from 'react-icons/hi'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'
import { availabilityDataSelector } from '../../redux/slices/availabilityReducer'
import { useProductList } from 'context/product-list-context'
import EachProduct from './EachProduct'
import EachProductRow from './EachProductRow'
import { useAuth } from 'context/auth-provider'

const ProductListViewSettingBar = ({
  changeDisplayType,
  productListCount,
  productListCountsPerPage,
  changePerPageCount,
  displayType,
}) => {
  return (
    <div className="view-setting-wrapper h-6">
      <div className="view-setting-bar gap-6">
        <div className="gap-2">
          <ul className="setting gap-6 flex justify-between h-[24px] font-inter text-base font-normal">
          <li className="per-page hidden xl:block">
              <div className="products-filter-name">
                Products Per Page: &nbsp;
                <select
                  className="products-filter-value"
                  onChange={changePerPageCount}
                >
                  {productListCountsPerPage.map((cnt) => (
                    <option key={cnt} value={cnt}>
                      {cnt}
                    </option>
                  ))}
                </select>
              </div>
            </li>
                        {/* <li className="product-result-caption hidden lg:block">
              Products found: {productListCount}
            </li> */}
            {/* <li className="product-result-caption  lg:hidden">
              {productListCount} Products
            </li> */}
            <li className="sort-by">
              <div className="products-filter-name">
                Sort:&nbsp;
                <select className="products-filter-value">
                  <option value="">Price (High to Low)</option>
                  <option value="">Price (Low to High)</option>
                  <option value="">Name (A-Z)</option>
                  <option value="">Name (Z-A)</option>
                </select>
              </div>
              <div className="md:hidden  flex">
                <div className="font-bold">Sort:</div>
                <HiChevronDown
                  size={20}
                  className="ml-1 mt-0 h-6 w-6 font-normal"
                  aria-hidden="true"
                />
              </div>
            </li>
            <li className="view-type">
              <div className="gap-4 flex">
                <div className="lg:block products-filter-name">View:</div>
                <div
                  id="grid-view"
                  className="cursor-pointer hover:text-yellow"
                  onClick={() => changeDisplayType(true)}
                >
                  <IconContext.Provider
                    value={{
                      size: 20,
                      color: displayType ? '#FAC420' : 'black',
                    }}
                  >
                    <>
                      <CgMenuGridR />
                    </>
                  </IconContext.Provider>
                </div>
                <div
                  id="list-view"
                  className="cursor-pointer"
                  onClick={() => changeDisplayType(false)}
                >
                  <IconContext.Provider
                    value={{
                      size: 20,
                      color: displayType ? 'black' : '#FAC420',
                    }}
                  >
                    <>
                      <BiMenu />
                    </>
                  </IconContext.Provider>
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
  let itemArr = []
  let subItemArr = []
  let ItemArrOnMobile = []
  let available
  if (displayType) {
    products.forEach((item, i) => {
      available = availability['k' + item.id]?.available

      switch ((i + 1) % 3) {
        case 1:
          subItemArr.push(
            <div key={i} className="w-1/3 mr-2 border border-quartz rounded">
              <EachProduct
                key={item.id}
                available={available}
                rating={4}
                productCount={8}
                item={item}
              />
            </div>
          )
          break
        case 2:
          subItemArr.push(
            <div
              key={i}
              className="w-1/3  mx-2 border border-quartz rounded"
            >
              <EachProduct
                key={item.id}
                available={available}
                rating={4}
                productCount={8}
                item={item}
              />
            </div>
          )
          break
        default:
          subItemArr.push(
            <div
              key={i}
              className="w-1/3 pb-4 border ml-2 border-quartz rounded"
            >
              <EachProduct
                key={item.id}
                available={available}
                rating={4}
                productCount={8}
                item={item}
              />
            </div>
          )
          itemArr.push(
            <div
              key={'row' + i.toString()}
              className="list-row flex lg:my-4 my-4"
            >
              {subItemArr}
            </div>
          )
          // if (i !== products.length - 1)
          //   itemArr.push(
          //     <div
          //       key={i}
          //       className="lg:my-12 my-6 split-line h-0 border-b border-bgWhite border-solid"
          //     ></div>
          //   )
          subItemArr = []
          break
      }
    })

    if (subItemArr.length) {
      itemArr.push(
        <div key="" className="list-row flex lg:my-12 my-6">
          {subItemArr}
        </div>
      )
      subItemArr = []
    }

    products.forEach((item, i) => {
      switch ((i + 1) % 2) {
        case 1:
          subItemArr.push(
            <div key={i} className="w-1/2 p-2">
              <EachProduct
                key={item.id}
                available={available}
                rating={4}
                productCount={8}
                item={item}
              />
            </div>
          )
          break
        default:
          subItemArr.push(
            <div
              key={i}
              className="w-1/2  p-2 border-l border-bgWhite border-solid"
            >
              <EachProduct
                key={item.id}
                available={available}
                rating={4}
                productCount={8}
                item={item}
              />
            </div>
          )
          ItemArrOnMobile.push(
            <div
              key={'rowMobile' + i.toString()}
              className="list-row flex lg:my-12 my-4"
            >
              {subItemArr}
            </div>
          )
          // if (i !== products.length - 1)
          //   ItemArrOnMobile.push(
          //     <div
          //       key={i}
          //       className="lg:my-12 my-6 split-line h-0 border-b border-bgWhite border-solid"
          //     ></div>
          //   )
          subItemArr = []
          break
      }
    })

    if (subItemArr.length) {
      ItemArrOnMobile.push(
        <div key="mobile" className="list-row flex lg:my-12 my-6">
          {subItemArr}
        </div>
      )
      subItemArr = []
    }
  } else {
    products.forEach((item, i) => {
      available = availability['k' + item.id]?.available
      itemArr.push(
        <div key={i} className="w-full my-4 items-center">
          <EachProductRow
            key={item.id}
            available={available}
            item={item}
          />
        </div>
      )
      // if (i !== products.length - 1)
      //   itemArr.push(
      //     <div
      //       key={'line' + i.toString()}
      //       className="lg:my-12 my-6 split-line h-0 border-b border-bgWhite border-solid"
      //     ></div>
      //   )
    })
  }
  return (
    <>
      <div className={displayType ? 'hidden lg:block' : ''}>{itemArr}</div>
      <div className="lg:hidden">{ItemArrOnMobile}</div>
    </>
  )
}

const ProductListPagination = ({
  changePageNumber,
  countPerPage,
  productListCount,
  pageNumber,
}) => {
  let totalPage = Math.round(productListCount / countPerPage)
  let previousPageitems = []
  let next_page_items = []

  if (totalPage < pageNumber) pageNumber = 1

  for (let i = pageNumber - 1; i > 1 && i > pageNumber - 3; i--)
    previousPageitems.unshift(
      <li
        key={i}
        className="cursor-pointer"
        onClick={() => changePageNumber(i)}
      >
        {i}
      </li>
    )

  for (let i = pageNumber + 1; i < totalPage && i < pageNumber + 3; i++)
    next_page_items.push(
      <li
        key={i}
        className="cursor-pointer"
        onClick={() => changePageNumber(i)}
      >
        {i}
      </li>
    )

  return (
    <div className="product-list-pagination items-center h-[24px] text-center w-full mx-auto">
      <div className="text-center items-center flex">
        <ul className="select-none gap-6 mx-auto items-center flex text-[18px] leading-[26px] font-inter text-gray">
          <li
            className="cursor-pointer"
            onClick={() => {
              if (pageNumber > 1) changePageNumber(pageNumber - 1)
            }}
          >
            <IconContext.Provider
              value={{
                size: 24,
                color: pageNumber === 1 ? '#ACAEB2' : 'black',
              }}
            >
              <HiOutlineArrowLeft />
            </IconContext.Provider>
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
            <li
              className="cursor-pointer"
              onClick={() => changePageNumber(totalPage)}
            >
              {totalPage}
            </li>
          )}
          <li
            className="cursor-pointer"
            onClick={() => {
              console.log('click')
              if (pageNumber < totalPage) {
                changePageNumber(pageNumber + 1)
              }
            }}
          >
            <IconContext.Provider
              value={{
                size: 24,
                color:
                  pageNumber === totalPage || totalPage === 0
                    ? '#ACAEB2'
                    : 'black',
              }}
            >
              <HiOutlineArrowRight />
            </IconContext.Provider>
          </li>
        </ul>
      </div>
    </div>
  )
}

const ProductListContent = () => {
  const { user } = useAuth()
  const [displayType, SetDisplayType] = useState(true)

  const {
    isProductsLoading,
    products,
    setPageNumber,
    pageNumber,
    productListCountsPerPage,
    productsPerPage,
    setProductsPerPage,
  } = useProductList()

  const productsWithoutVariants = useMemo(() => {
    return products.filter((p) => p.productType !== 'VARIANT')
  }, [products])

  const changeDisplayType = (status) => {
    SetDisplayType(status)
  }
  const changePageNumber = (number) => {
    setPageNumber(number)
  }
  const changePerPageCount = (event) => {
    setPageNumber(1)
    setProductsPerPage(event.target.value)
  }

  return (
    <>
      <ProductListViewSettingBar
        displayType={displayType}
        changePerPageCount={changePerPageCount}
        changeDisplayType={changeDisplayType}
        productListCount={productsWithoutVariants.length}
        productListCountsPerPage={productListCountsPerPage}
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
            productListCount={productsWithoutVariants.length}
            pageNumber={pageNumber}
          />
        </>
      )}
    </>
  )
}

export default ProductListContent
