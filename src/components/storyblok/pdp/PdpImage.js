import React from 'react'
import { storyblokEditable } from '@storyblok/react'

const PdpImage = ({blok, ...restProps} ) => {
  const product = restProps.product

  return (<div className="product-detail-image-content" {...storyblokEditable(blok)}>
    <div className="product-detail-main-image rounded">
      <img src={`${product.src}`} alt="product" className="w-full" />
    </div>
    <div className="product-detail-sub-images">
      {product.subImages.map((link, index) => {
        return (
          <div
            key={index}
            className="rounded product-detail-sub-image-item flex items-center"
          >
            <img
              src={`${link}`}
              alt="product_"
              className="w-full m-auto items-center"
            />
          </div>
        )
      })}
    </div>
  </div>)
}

export default PdpImage
