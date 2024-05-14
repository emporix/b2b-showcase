import React from 'react'
import './productTeaser.css'
import { addTenantToUrl } from '../../services/service.config'
import { Link } from 'react-router-dom'
import JsonFormatter from 'react-json-formatter'
// for very simple lists only (glossary maybe)

export const ProductTeaser = (props) => {
  const productData = props.props?.data?.st_product?.value[0].value;
  if (!productData) return null;
  return (
    <Link to={addTenantToUrl(`product/details/${productData.id}`)}>
      <div className="bg-aliceBlue p-8 md:p-4 flex flex-col w-fit md:flex-row lg:flex-col gap-4 m-8 md:gap-8 standard_box_shadow rounded-xl">
        <div className="font-inter font-semibold text-2xl leading-[32px]">
          {productData.label}
        </div>
        <div>
          <img className="rounded-xl" src={productData.image} />
        </div>
        <JsonFormatter json={props.props} />
      </div>
    </Link>
  )
}
