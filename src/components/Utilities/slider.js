import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.css'
import { HiChevronRight , HiChevronLeft } from "react-icons/hi";

const PrevArrow = ({onClick}) => {
    return (
        <div onClick={onClick} className="mr-6 cursor-pointer">
            <HiChevronLeft size={30}/>
        </div>
    )
}

const NextArrow = ({onClick}) => {
    return (
        <div onClick={onClick} className="ml-6 cursor-pointer">
            <HiChevronRight size={30}/>
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