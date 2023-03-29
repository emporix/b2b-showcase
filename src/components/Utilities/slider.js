import React, { Component } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './slider.css'

const PrevArrow = ({ onClick }) => {
  return (
    <div onClick={onClick} className="mr-6">
      <svg
        width="10"
        height="20"
        viewBox="0 0 10 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.72736 0.666748L10.0001 2.16041L3.22951 10.0001L10.0001 17.8398L8.72735 19.3334L0.666748 10L8.72736 0.666748Z"
          fill="black"
        />
      </svg>
    </div>
  )
}
const NextArrow = ({ onClick }) => {
  return (
    <div onClick={onClick} className="ml-6">
      <svg
        width="10"
        height="20"
        viewBox="0 0 10 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.27289 19.3333L0.00016216 17.8396L6.77073 9.99992L0.000162534 2.16024L1.27289 0.666584L9.3335 10L1.27289 19.3333Z"
          fill="black"
        />
      </svg>
    </div>
  )
}
const SliderComponent = ({ children }) => {
  const settings = {
    dots: false,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  }
  return (
    <div className="scroller-wrapper">
      <Slider {...settings}>{children}</Slider>
    </div>
  )
}

export default SliderComponent
