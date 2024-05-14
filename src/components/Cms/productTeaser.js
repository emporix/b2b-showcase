import React, { useEffect, useState } from 'react'
import './productTeaser.css'
import productService from '../../services/product/product.service'
import { ProductMini } from '../Product/productMini'

export const ProductTeaser = (props) => {
  const [products, setProducts] = useState([]);
  const productData = props.props?.data?.st_product?.value[0].value;

  const fetchProducts = async ()=> {
    setProducts(await productService.getProductsWithIds([productData.id]));
  }

  useEffect(()=> {
    fetchProducts();
  },[]);

  return (
    products[0] && <div className="w-1/2 place-self-center">
        <ProductMini productInfo={products[0]} />
    </div>
  )
}

