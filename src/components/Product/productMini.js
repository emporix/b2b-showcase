import React from 'react'
import { addTenantToUrl } from '../../services/service.config'
import { Link } from 'react-router-dom'
// for very simple lists only (glossary maybe)

export const ProductMini = (props) => {
  const { productInfo } = props

  return (
    <div className="grid grid-cols-2 bg-aliceBlue p-8 md:p-4 w-fit gap-4 m-8 md:gap-8 standard_box_shadow rounded-xl">
      <h2 className="font-semibold text-2xl mb-2 col-span-2">
        <Link to={addTenantToUrl(`product/details/${productInfo.id}`)}>{productInfo.name}</Link>
      </h2>
      <Link to={addTenantToUrl(`product/details/${productInfo.id}`)} className="col-span-2 mx-auto lg:col-span-1">
        <img
          className="rounded-xl"
          src={productInfo.media[(Math.random() * productInfo.media.length) | 0]?.url}
          alt="product"
        />
      </Link>
      <p className="col-span-2 lg:col-span-1">{productInfo.description}</p>
    </div>
  )
}
