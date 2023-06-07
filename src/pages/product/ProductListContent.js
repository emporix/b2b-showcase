import { CgMenuGridR } from 'react-icons/cg'
import { BiMenu } from 'react-icons/bi'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { IconContext } from 'react-icons'
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiChevronDown,
} from 'react-icons/hi'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'
import { availabilityDataSelector } from '../../redux/slices/availabilityReducer'
import { useProductList } from 'context/product-list-context'
import EachProduct from './EachProduct'
import EachProductRow from './EachProductRow'
import { useAuth } from 'context/auth-provider'
import { mapEmporixUserToVoucherifyCustomer } from '../../integration/voucherify/mappers/mapEmporixUserToVoucherifyCustomer'
import { getQualificationsWithItemsExtended } from '../../integration/voucherify/voucherifyApi'
import { getCustomerAdditionalMetadata } from '../../helpers/getCustomerAdditionalMetadata'

const ProductListViewSettingBar = ({
  changeDisplayType,
  productListCount,
  productListCountsPerPage,
  changePerPageCount,
  displayType,
}) => {
  return (
    <div className="view-setting-wrapper  h-8 mb-12">
      <div className="view-setting-bar gap-6">
        <div className="gap-2">
          <ul className="setting gap-6 flex justify-between h-[24px] font-inter text-base font-normal">
            <li className="view-type">
              <div className="gap-4 flex">
                <div className="hidden lg:block">View:</div>
                <div
                  className="cursor-pointer"
                  onClick={() => changeDisplayType(true)}
                >
                  <IconContext.Provider
                    value={{
                      size: 24,
                      color: displayType ? 'black' : '#828282',
                    }}
                  >
                    <>
                      <CgMenuGridR />
                    </>
                  </IconContext.Provider>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => changeDisplayType(false)}
                >
                  <IconContext.Provider
                    value={{
                      size: 24,
                      color: displayType ? 'black' : '#828282',
                    }}
                  >
                    <>
                      <BiMenu />
                    </>
                  </IconContext.Provider>
                </div>
              </div>
            </li>
            <li className="product-result-caption hidden lg:block">
              Products found: {productListCount}
            </li>
            <li className="product-result-caption  lg:hidden">
              {productListCount} Products
            </li>

            <li className="per-page hidden xl:block">
              <div>
                Per Page:&nbsp;
                <select
                  className="bg-[white] font-bold"
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
            <li className="sort-by">
              <div className="hidden md:block">
                Sort by:&nbsp;
                <select className="bg-[white] font-bold">
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
          </ul>
          <div className="mt-2 split-line h-0 border-b border-bgWhite border-solid"></div>
        </div>
      </div>
    </div>
  )
}

const ProductListItems = ({ products, auth, displayType }) => {
  const { user } = useAuth()
  const [qualifications, setQualifications] = useState([])
  useEffect(() => {
    const productsIds = products.map((product) => product.id)

    ;(async () => {
      const customer = mapEmporixUserToVoucherifyCustomer(
        user,
        getCustomerAdditionalMetadata()
      )
      const allQualifications = await getQualificationsWithItemsExtended(
        'PRODUCTS',
        productsIds.map((productId) => {
          return {
            quantity: 1,
            product_id: productId,
          }
        }),
        customer
      )
      let allQualificationsPerProducts = productsIds.map((productId) => {
        return {
          id: productId,
          qualifications: [],
        }
      })
      allQualifications.forEach((qualificationExtended) => {
        const applicable_to =
          qualificationExtended.qualification?.applicable_to?.data || []
        const sourceIds =
          applicable_to
            .map((applicableTo) => applicableTo.source_id)
            .filter((e) => e) || []
        sourceIds.forEach((sourceId) => {
          if (
            allQualificationsPerProducts.find(
              (allQualificationsPerProduct) =>
                allQualificationsPerProduct.id === sourceId
            )
          ) {
            allQualificationsPerProducts = allQualificationsPerProducts.map(
              (allQualificationsPerProducts) => {
                if (allQualificationsPerProducts.id === sourceId) {
                  allQualificationsPerProducts.qualifications = [
                    ...allQualificationsPerProducts.qualifications,
                    qualificationExtended,
                  ]
                }
                return allQualificationsPerProducts
              }
            )
          }
        })
      })
      setQualifications(allQualificationsPerProducts)
    })()
  }, [])

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
            <div key={i} className="w-1/3 p-6 ">
              <EachProduct
                key={item.id}
                available={available}
                item={item}
                qualifications={
                  qualifications.find(
                    (qualificationWithId) => qualificationWithId?.id === item.id
                  )?.qualifications || []
                }
              />
            </div>
          )
          break
        case 2:
          subItemArr.push(
            <div
              key={i}
              className="w-1/3  p-6 border-l border-bgWhite border-solid"
            >
              <EachProduct
                key={item.id}
                available={available}
                item={item}
                qualifications={
                  qualifications.find(
                    (qualificationWithId) => qualificationWithId?.id === item.id
                  )?.qualifications || []
                }
              />
            </div>
          )
          break
        default:
          subItemArr.push(
            <div
              key={i}
              className="w-1/3 p-6 border-l border-bgWhite border-solid"
            >
              <EachProduct
                key={item.id}
                available={available}
                item={item}
                qualifications={
                  qualifications.find(
                    (qualificationWithId) => qualificationWithId?.id === item.id
                  )?.qualifications || []
                }
              />
            </div>
          )
          itemArr.push(
            <div
              key={'row' + i.toString()}
              className="list-row flex lg:my-12 my-6"
            >
              {subItemArr}
            </div>
          )
          if (i !== products.length - 1)
            itemArr.push(
              <div
                key={i}
                className="lg:my-12 my-6 split-line h-0 border-b border-bgWhite border-solid"
              ></div>
            )
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
                item={item}
                qualifications={
                  qualifications.find(
                    (qualificationWithId) => qualificationWithId?.id === item.id
                  )?.qualifications || []
                }
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
                item={item}
                qualifications={
                  qualifications.find(
                    (qualificationWithId) => qualificationWithId?.id === item.id
                  )?.qualifications || []
                }
              />
            </div>
          )
          ItemArrOnMobile.push(
            <div
              key={'rowMobile' + i.toString()}
              className="list-row flex lg:my-12 my-6"
            >
              {subItemArr}
            </div>
          )
          if (i !== products.length - 1)
            ItemArrOnMobile.push(
              <div
                key={i}
                className="lg:my-12 my-6 split-line h-0 border-b border-bgWhite border-solid"
              ></div>
            )
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
        <div key={i} className="w-full h-[215px] lg:my-12 my-6 items-center">
          <EachProductRow key={item.id} available={available} item={item} />
        </div>
      )
      if (i !== products.length - 1)
        itemArr.push(
          <div
            key={'line' + i.toString()}
            className="lg:my-12 my-6 split-line h-0 border-b border-bgWhite border-solid"
          ></div>
        )
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
  let totalPage = Math.ceil(productListCount / countPerPage)
  let previousPageitems = []
  let next_page_items = []

  if (totalPage < pageNumber) {
    pageNumber = 1
  }

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
    total,
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
            productListCount={total}
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
