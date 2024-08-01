import React from 'react'
import { Teaser } from './teaser'
import { ProductTeaser } from './productTeaser'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import Slider from 'react-slick'
import './teaserSlider.css'
import { nanoid } from '@reduxjs/toolkit'

const arrowStyles = 'absolute bg-primary text-aliceBlue rounded-full cursor-pointer z-20'

const PrevArrow = ({ onClick }) => {
  return (
    <div onClick={onClick} className={`${arrowStyles} -left-3 md:scale-150`}>
      <HiChevronLeft size={30} className="-translate-x-[1px]" />
    </div>
  )
}

const NextArrow = ({ onClick }) => {
  return (
    <div onClick={onClick} className={`${arrowStyles} -right-3 md:scale-150`}>
      <HiChevronRight size={30} className="translate-x-[1px]" />
    </div>
  )
}

export const TeaserSlider = ({ props }) => {
  const classId = props.sectionType || 'slide'
  const teasers = props.data.st_elements?.map((st_element) => st_element)

  const settings = {
    dots: true,
    adaptiveHeight: true,
    speed: 500,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    centerPadding: 0,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 9999,
        settings: {},
      },
      {
        breakpoint: 767,
        settings: {
          arrows: false,
        },
      },
    ],
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i) => (
      <div>
        <span></span>
      </div>
    ),
  }

  return (
    <div data-preview-id={props?.previewId} className={`fs-${classId}`}>
      <Slider {...settings}>
        {teasers.map((p) => {
          return (
            <div data-preview-id={p.previewId} className="min-w-full" key={nanoid()}>
              {p?.sectionType === 'teaser' ? <Teaser props={p} /> : null}
              {p?.sectionType === 'product_teaser' ? <ProductTeaser props={p} /> : null}
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
