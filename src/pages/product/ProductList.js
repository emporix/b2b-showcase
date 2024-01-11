import React, { useEffect, useState } from 'react'
import ProductListContent from './ProductListContent'
import ProductListFilterPanel from './ProductListFilterPanel'
import Content from 'pages/home/Content'
import { CMSFilterType } from 'services/content/filteredPage.service'
import { getProductCategoryDetail } from 'services/product/category.service'
import { useProductList } from 'context/product-list-context'
import { useParams } from 'react-router-dom'
import { LoadingCircleProgress1 } from 'components/Utilities/progress'

const ProductList = ({ handleSideFilterContent, filterItems }) => {

  const {category: categoryTree} = useProductList()
  const [isLoading, setIsLoading] = useState(true)
  const [categoryId, setCategoryId] = useState("")
  const {maincategory, subcategory, category} = useParams()


  useEffect(() => {
    async function fetchFSContent() {
      setIsLoading(true);
      if (categoryTree && categoryTree.length > 0 && maincategory) {
        const { categoryId: catId } = await getProductCategoryDetail(
          maincategory,
          subcategory,
          category,
          categoryTree
          )
        if(catId) {
          setCategoryId(() => catId)
          setIsLoading(false)
        }
      }
    }
    fetchFSContent();
  }, [categoryTree, maincategory, subcategory, category])

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
      <div className="desktop-lg mt-4">
      {
        isLoading ? (
          <LoadingCircleProgress1 />
        ) :
        <Content type={CMSFilterType.CATEGORY} page={categoryId} />
      }
      </div>

    </>
  )
}

export default ProductList
