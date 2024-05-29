import React, { useEffect, useState } from 'react'
import productService from '../../services/product/product.service'
import { ProductMini } from '../Product/productMini'

export const ProductTeaser = (props) => {
  const [products, setProducts] = useState([])
  const productData = props.props?.data?.st_product?.value[0].value

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await productService.getProductsWithIds([productData.id]))
    }

    fetchProducts()
  }, [productData])

  return (
    products[0] && (
      <div className="w-full mx-auto max-w-3xl">
        <ProductMini productInfo={products[0]} />
      </div>
    )
  )
}
