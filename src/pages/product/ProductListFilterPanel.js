import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LoadingCircleProgress1 } from '../../components/Utilities/progress'
import { getProductCategoryDetail } from '../../services/product/category.service'
import { useProductList } from 'context/product-list-context'
import { Checkbox } from '@mui/material'
import { useNavigate } from 'react-router'
import { TENANT } from '../../constants/localstorage'
import { useTranslation } from 'react-i18next'
import { MdFilterListOff } from 'react-icons/md'

const getTenant = () => localStorage.getItem(TENANT)

const SelectedFilter = ({ title, val }) => {
  return (
    <div className="flex font-inter pb-4">
      <img src="/del_filter.png" className="w-6 h-6" alt="delete icon" />
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
      <label className="category_pan_field_title" title={title.toLowerCase()}>
        {' '}
        {title.toLowerCase()}
      </label>
      {/* </div> */}
      <div className="text-manatee pl-3">{total}</div>
    </div>
  )
}

const Category = ({ item, activeSubCategory, activeCategory, setIsDrawerOpen }) => {
  const { categoryId, title, items, key, url } = item
  const navigate = useNavigate()
  const { t } = useTranslation('page')

  if (item.items.length === 0) return

  return (
    <li key={categoryId}>
      <span className="category_pan_title">{title}</span>
      <div>
        <div className="content content-center justify-center">
          <div
            className="w-[90%] text-eerieBlack text-[14px]/[22px] font-normal flex items-center border-b-[1px] border-spacing-3 border-eerieBlack cursor-pointer"
            onClick={() => {
              navigate(`/${localStorage.getItem(TENANT)}/${url}`)
              setTimeout(() => setIsDrawerOpen((current) => !current), 800)
            }}
          >
            <Checkbox
              defaultChecked={(key === activeSubCategory || !activeSubCategory) && !activeCategory}
              sx={{
                color: '#cccccc',
                '&.Mui-checked': {
                  color: '#E03F58',
                },
                '& .MuiSvgIcon-root': { fontSize: 18 },
              }}
              style={{ fill: 'white' }}
            />
            <div>{t('all_countries')}</div>
          </div>
          {items.map((item) => (
            <div className="flex" key={item.categoryId}>
              <div
                className="flex"
                onClick={() => {
                  navigate(`/${localStorage.getItem(TENANT)}/${item.url}`)
                  setTimeout(() => setIsDrawerOpen((current) => !current), 800)
                }}
              >
                <Checkbox
                  defaultChecked={
                    (item.key === activeCategory || !activeCategory) &&
                    (key === activeSubCategory || !activeSubCategory)
                  }
                  sx={{
                    color: '#cccccc',
                    '&.Mui-checked': {
                      color: '#E03F58',
                    },
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                  }}
                />
                <div className="category_pan_field">
                  <label className="category_pan_field_title cursor-pointer" title={item.title.toLowerCase()}>
                    {' '}
                    {item.title.toLowerCase()}
                  </label>
                  <div className="text-manatee pl-3 cursor-pointer">{item.total}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </li>
  )
}

const FilterListPanel = ({ filterItems, handleSideFilterContent }) => {
  const { t } = useTranslation('page')

  return (
    <div>
      <div className="flex justify-between flex-col xl:flex-row">
        <div className="flex">
          <img
            src="/filter_alt.svg"
            className="w-4 h-4 mt-1 mr-2"
            onClick={handleSideFilterContent}
            alt="filter icon"
          />
          <span className="mr-2">Filters</span>({filterItems.length})
        </div>
        <div>
          <button className="font-semibold text-manatee text-right">{t('show_all')}</button>
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

const CategoryPanel = ({ setIsDrawerOpen }) => {
  const { category: categoryTree } = useProductList()
  const [isLoading, setIsLoading] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const { maincategory, subcategory, category } = useParams()
  const { setProductIds } = useProductList()

  useEffect(() => {
    const getCategory = async (categoryTree, maincategory, subcategory, category) => {
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

    if (categoryTree && categoryTree.length > 0 && maincategory) {
      getCategory(categoryTree, maincategory, subcategory, category)
    }
  }, [categoryTree, maincategory, subcategory, category, setProductIds])

  return (
    <>
      {isLoading ? (
        <LoadingCircleProgress1 />
      ) : (
        <ul>
          {categoryList.map((item) => (
            <Category
              key={item.categoryId}
              item={item}
              activeSubCategory={subcategory}
              activeCategory={category}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          ))}
        </ul>
      )}
    </>
  )
}

const ProductListFilterPanel = ({ setIsDrawerOpen }) => {
  const { t } = useTranslation('page')
  return (
    <div className="relative">
      <div className="w-full text-right">
        <Link
          to={`/${getTenant()}/product/wein`}
          onClick={() => setTimeout(() => setIsDrawerOpen((current) => !current), 800)}
          className="inline-flex font-sm text-manatee hover:text-primary flex-row justify-end items-center gap-2"
        >
          <MdFilterListOff size={16} />
          {t('show_all')}
        </Link>
      </div>
      <CategoryPanel setIsDrawerOpen={setIsDrawerOpen} />
    </div>
  )
}

export default ProductListFilterPanel
