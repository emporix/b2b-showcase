import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language-provider'
import SliderComponent from '../../Utilities/slider'
import productService from '../../../services/product/product.service'
import EachProduct from '../../../pages/product/EachProduct'
import { useSelector } from 'react-redux'
import {
  availabilityDataSelector,
} from '../../../redux/slices/availabilityReducer'
import priceService from '../../../services/product/price.service'

const PdpRelatedProducts = ({ blok, ...restProps }) => {
  const product = restProps.product
  const [relatedProducts, setRelatedProducts] = useState([])
  const { currentLanguage } = useLanguage()
  const availability = useSelector(availabilityDataSelector)
  const stockLevel = (product) => availability['k' + product.id]?.stockLevel
  const available = (product) => stockLevel(product) > 0

  useEffect(() => {
    const productIds = product.relatedItems?.map(item => item.refId)
    productService.getProductsWithIds(productIds).
      then(result => {
        priceService.getPriceWithProductIds(result.map(item => item.id)).then((prices) => {
          const newRelatedProducts = result.map((pi, index) => {
            return {...result[index], price: prices[index]}
          })
          setRelatedProducts(newRelatedProducts)
        })
      })
  }, [product])

  return (
    <div className="grid grid-cols-1">
      <div
        className="text-xl text-aldiBlue4 font-bold text-center w-full mb-10">{currentLanguage ===
      'de' ?
        'Das könnte dir auch gefallen' :
        'Related products'}</div>
      {relatedProducts.length > 0 ? (
        <div className="w-full">
          <SliderComponent>
            {relatedProducts.map((item, index) => (
              <div className="w-fit" key={'PdpRelatedProducts' + index}>
                <div className="mx-2 border rounded border-aldiGray2">
                  <EachProduct item={item} available={available(item)}
                               productCount={stockLevel(item)}
                               rating={item.rating} />
                </div>
              </div>
            ))}
          </SliderComponent>
        </div>
      ) : (
        <div className="w-full text-center">{currentLanguage === 'de' ?
          'Kein passendes Produkt gefunden' :
          'No matchig products'}</div>
      )}
    </div>
  )
}

export default PdpRelatedProducts
