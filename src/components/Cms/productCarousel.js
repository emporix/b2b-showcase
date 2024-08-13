import React, { useEffect, useRef, useState } from 'react'
import productService from '../../services/product/product.service'
import Slider from 'react-slick'
import './productCarousel.css'
import { addTenantToUrl } from '../../services/service.config'
import { useNavigate } from 'react-router-dom'

export const ProductCarousel = (props) => {
  const productSlider = useRef()
  const [products, setProducts] = useState([])

  const navigate = useNavigate()

  const productIds = props.props?.data?.st_elements?.map((st_element) => {
    return st_element.data.st_product?.value[0]?.identifier
  })

  const settings = {
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 250,
    variableWidth: true,
    arrows: false,
    swipeToSlide: true,
    beforeChange: () => {
      productSlider.current.innerSlider.clickable = false
    },
    responsive: [
      { breakpoint: 940, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  }

  const handleClick = (direction) => {
    productSlider.current.innerSlider.clickable && navigate(direction)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await productService.getProductsWithIds(productIds))
    }
    fetchProducts()
  }, [])

  if (!productIds || !productIds.length) {
    return
  }

  return (
    <div data-preview-id={props?.props?.previewId}>
      <Slider ref={productSlider} {...settings} className="product-carousel">
        {products.map((p) => {
          return (
            <img
              key={p.id}
              className="cursor-pointer rounded-xl"
              src={p.media[0]?.url}
              alt={p?.name}
              onClick={() => handleClick(addTenantToUrl(`product/details/${p.id}`))}
            />
          )
        })}
        {products.length <= 3 &&
          products.map((p) => {
            return (
              <img
                key={p.id + '_clone'}
                className="cursor-pointer rounded-xl"
                src={p.media[0]?.url}
                alt={p?.name}
                onClick={() => handleClick(addTenantToUrl(`product/details/${p.id}`))}
              />
            )
          })}
      </Slider>
    </div>
  )
}
