import React, { useState, useRef, useEffect } from 'react'
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useParams } from 'react-router-dom'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'
import { getProductCategoryDetail } from '../../services/product/category.service'
import { useProductList } from 'context/product-list-context'
import { Checkbox } from '@mui/material'

const SelectedFilter = ({ title, val }) => {
  return (
    <div className="flex font-inter pb-4">
      <img src="/del_filter.png" className="w-6 h-6" alt="delete icon"/>
      <span className="font-bold ml-2">{title}: &nbsp;</span>
      <span className="font-normal">{val}</span>
    </div>
  )
}

const SelectionField = ({ title, total }) => {
  return (
    // <div className="flex justify-between pb-4 font-inter font-medium text-base">
    <div className="category_pan_field">
      {/* <div c> */}
        <label className='category_pan_field_title' title={title.toLowerCase()}> {title.toLowerCase()}</label>
      {/* </div> */}
      <div className="text-manatee pl-3">{total}</div>
    </div>
  )
}

const Category = ({ item }) => {
  const [clicked, setClicked] = useState(false)
  const contentEl = useRef()
  const { title, items } = item
  const handleToggle = () => {
    setClicked((prev) => !prev)
  }

  if (item.items.length === 0) return

  return (
    <li className={`cat_accordion_item ${clicked ? 'active' : ''}`}>
      <button className="category_pan" onClick={handleToggle}>
        <span className="category_pan_title">{title}</span>
        {/* {clicked ? (
          <HiChevronDown size={20} className="h-4" />
        ) : (
          <HiChevronUp size={20} className="h-4" />
        )} */}
      </button>
      <div
        ref={contentEl}
        className="content_wrapper h-auto"
        // style={
        //   clicked
        //     ? { height: contentEl.current.scrollHeight }
        //     : { height: '0px' }
        // }
      >
        <div className="content content-center justify-center">
          <div className="w-[90%] text-eerieBlack text-[14px]/[22px] font-normal flex items-center">
            <Checkbox defaultChecked sx={{
                  color: "#cccccc",
                  '&.Mui-checked': {
                    color:"#FAC420",
                  },
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }} iconStyle={{fill: 'white'}} />
            <div>Select All</div>
          </div>
          {items.map((item, index) => (
            <div className="flex">
              <Checkbox
                defaultChecked
                sx={{
                  color: "#cccccc",
                  '&.Mui-checked': {
                    color:"#FAC420",
                  },
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }}
              />
              <SelectionField
                key={index}
                title={item.title}
                total={item.total}
              />
            </div>
          ))}
        </div>
      </div>
    </li>
  )
}

const FilterListPanel = ({ filterItems, handleSideFilterContent }) => {
  return (
    <div className="pr-6">
      <div className="flex justify-between">
        <div className="flex">
          <img
            src="/filter_alt.svg"
            className="w-4 h-4 mt-1 mr-2"
            onClick={handleSideFilterContent}
            alt="filter"
          />
          <span className="mr-2">Filters</span>({filterItems.length})
        </div>
        <div>
          <a className="font-inter font-semibold font-[14px] text-manatee">
            Clear Filters
          </a>
        </div>
      </div>
      <div className="pt-6 pb-2">
        {filterItems.map((item, index) => (
          <SelectedFilter title={item.category} val={item.val} key={index} />
        ))}
      </div>
    </div>
  )
}

const CategoryPanel = () => {
  const { category: categoryTree } = useProductList()
  const [isLoading, setIsLoading] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const { maincategory, subcategory, category } = useParams()
  const { setProductIds } = useProductList()
  const getCategory = async (
    categoryTree,
    maincategory,
    subcategory,
    category
  ) => {
    setIsLoading(true)
    const { categories, productIds } = await getProductCategoryDetail(
      maincategory,
      subcategory,
      category,
      categoryTree
    )
    setProductIds(productIds)
    setCategoryList(categories)
    setIsLoading(false)
  }

  useEffect(() => {
    if (categoryTree && categoryTree.length > 0 && maincategory) {
      getCategory(categoryTree, maincategory, subcategory, category)
    }
  }, [JSON.stringify(categoryTree), maincategory, subcategory, category])

  return (
    <>
      {isLoading ? (
        <LoadingCircleProgress1 />
      ) : (
        <ul className="category_accordion pr-6">
          {categoryList.map((item, index) => (
            <Category key={index} item={item} />
          ))}
        </ul>
      )}
    </>
  )
}

const ProductListFilterPanel = ({ handleSideFilterContent, filterItems }) => {
  return (
    <div>
      <FilterListPanel
        filterItems={filterItems}
        handleSideFilterContent={handleSideFilterContent}
      />
      <CategoryPanel />
    </div>
  )
}

export default ProductListFilterPanel
