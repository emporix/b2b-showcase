import React, { useEffect, useState } from 'react'
import ProductListContent from './ProductListContent'
import ProductListFilterPanel from './ProductListFilterPanel'
import Content from 'pages/home/Content'
import { CMSFilterType } from 'services/content/filteredPage.service'
import { getProductCategoryDetail } from 'services/product/category.service'
import { useProductList } from 'context/product-list-context'
import { useParams } from 'react-router-dom'
import { LoadingCircleProgress1 } from 'components/Utilities/progress'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'

const ProductList = () => {
  const { category: categoryTree } = useProductList()
  const [isLoading, setIsLoading] = useState(true)
  const [categoryId, setCategoryId] = useState('')
  const { maincategory, subcategory, category } = useParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    async function fetchFSContent() {
      setIsLoading(true)
      if (categoryTree && categoryTree.length > 0 && maincategory) {
        const { categoryId: catId } = await getProductCategoryDetail(maincategory, subcategory, category, categoryTree)
        if (catId) {
          setCategoryId(() => catId)
          setIsLoading(false)
        }
      }
    }
    fetchFSContent()
  }, [categoryTree, maincategory, subcategory, category])

  const productListBoxShadow = {
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  }

  return (
    <>
      <div className="absolute -top-10 -left-6">
        <button
          className={`text-darkGray hover:text-primary px-5 py-2.5 lg:hidden`}
          onClick={() => setIsDrawerOpen((current) => !current)}
          title="Filter"
        >
          {isDrawerOpen ? <HiChevronDoubleLeft size={24} /> : <HiChevronDoubleRight size={24} />}
        </button>
      </div>
      <div className="flex gap-4 xl:gap-12">
        <div
          id="filter-drawer"
          className={`absolute transition-transform duration-500 flex-auto w-full h-full bg-aliceBlue p-4 rounded-xl lg:hidden ${
            isDrawerOpen ? 'fixed top-0 left-0 z-10' : '-translate-x-[150%]'
          }`}
          style={productListBoxShadow}
        >
          <ProductListFilterPanel setIsDrawerOpen={setIsDrawerOpen} />
        </div>
        <div className="flex-auto lg:w-[23%] bg-aliceBlue p-4 rounded-xl hidden lg:block">
          <ProductListFilterPanel setIsDrawerOpen={setIsDrawerOpen} />
        </div>
        <div className="flex-auto lg:w-[77%] w-full gap-y-4 xl:gap-y-12">
          <ProductListContent />
        </div>
      </div>
      <div className="desktop-lg mt-4">
        {isLoading ? <LoadingCircleProgress1 /> : <Content type={CMSFilterType.CATEGORY} page={categoryId} />}
      </div>
    </>
  )
}

export default ProductList
