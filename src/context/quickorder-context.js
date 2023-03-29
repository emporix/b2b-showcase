import React, { createContext, useContext, useCallback, useState } from 'react'
import { getProductsWithCode } from 'services/product/product.service'
import priceService from 'services/product/price.service'

export const QuickOrderContext = createContext()

export const useQuickOrder = () => useContext(QuickOrderContext)

const mergeProducts = (a, b) => {
  const result = a
  b.forEach((entry) => {
    const existant = result.find((i) => {
      return i.code === entry.code
    })
    if (existant) {
      existant.quantity += entry.quantity
    } else {
      result.push(entry)
    }
  })
  return result
}

export const QuickOrderProvider = ({ children }) => {
  const [productsSuggestions, setProductsSuggestions] = useState([])
  const [newProduct, setNewProduct] = useState({
    quantity: 1,
  })
  const [tempProductList, setTempProductList] = useState([])

  const handleAddItem = useCallback(async () => {
    setTempProductList((prev) => {
      return mergeProducts([...prev], [newProduct])
    })
  }, [newProduct])

  const fetchProductsByCode = async (code) => {
    const products = await getProductsWithCode([code])
    setProductsSuggestions(products)
  }

  const handleBatchAddItem = useCallback(async (entries) => {
    const rawProducts = await Promise.all(
      entries.map(async (product) => {
        const prods = await getProductsWithCode([product.code])
        if (prods.length > 0) {
          return prods[0]
        }
      })
    )
    const products = await Promise.all(
      rawProducts.map(async (product, idx) => {
        const prices = await priceService.getPriceWithProductIds([product.id])
        return { ...product, price: prices[0], quantity: entries[idx].quantity }
      })
    )

    setTempProductList((prev) => mergeProducts([...prev], [...products]))
  }, [])

  const updateQuantity = (quantity, code) => {
    setTempProductList((prev) => {
      return prev.map((product) => {
        if (product.code === code) {
          const newProduct = {
            ...product,
            quantity,
          }
          return newProduct
        }
        return product
      })
    })
  }

  return (
    <QuickOrderContext.Provider
      value={{
        fetchProductsByCode,
        productsSuggestions,
        newProduct,
        setNewProduct,
        tempProductList,
        handleAddItem,
        handleBatchAddItem,
        updateQuantity,
        setTempProductList,
      }}
    >
      {children}
    </QuickOrderContext.Provider>
  )
}
