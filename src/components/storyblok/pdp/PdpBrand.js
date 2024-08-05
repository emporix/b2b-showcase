import { storyblokEditable } from '@storyblok/react'
import { useEffect, useState } from 'react'
import { getBrand } from '../../../services/product/brand.service'

const PdpBrand = ({ blok, ...restProps }) => {
  const product = restProps.product
  const [brand, setBrand] = useState()

  useEffect(() => {
    const brandId = product?.mixins?.productCustomAttributes?.brand
    brandId && getBrand(brandId).then((data) => {
      setBrand(data)
    })
  }, [product])

  return (<div
    className="text-aldiGray4 uppercase font-bold text-[14px] " {...storyblokEditable(
    blok)}>
    {blok.showPicture ? <img src={brand?.image} alt="" /> : brand?.name}
  </div>)
}

export default PdpBrand
