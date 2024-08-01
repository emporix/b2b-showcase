import React, { useEffect, useState } from 'react'
import productService from '../../services/product/product.service'
import { ProductMini } from '../Product/productMini'

export const ProductTeaser = (props) => {
  const [products, setProducts] = useState([])
  const productData = props.props?.data?.st_product?.value[0].value

  const classId = props?.props?.sectionType || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await productService.getProductsWithIds([productData.id]))
    }

    fetchProducts()
  }, [productData])

  return (
    products[0] && (
      <div data-preview-id={props?.props?.previewId} className={`fs-${classId} w-full mx-auto max-w-3xl`}>
        <ProductMini productInfo={products[0]} />
      </div>
    )
  )
}
