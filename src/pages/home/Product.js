import React from 'react'
import { useSelector } from 'react-redux'
import Slider from 'react-animated-slider'
import ReactStars from 'react-stars'

import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { userSelector } from 'redux/slices/authReducer'
import 'react-animated-slider/build/horizontal.css'
import './slider-animation.css'
import './product.css'
import { useAuth } from 'context/auth-provider'

const EachProduct = (props) => {
  const { isLoggedIn } = useAuth()
  return (
    <div>
      <div className="w-full h-3 flex justify-between">
        <div
          className={
            props.stock === 'Low'
              ? 'text-emporixGold font-inter font-bold text-[12px] pt-[6px]'
              : 'text-brightGreen font-inter font-bold text-[12px] pt-[6px]'
          }
        >
          {props.stock} Stock
        </div>
        <div className="flex h-5">
          <ReactStars size={16} value={props.rating} color2={'#FBB13C'} />(
          {props.total_count})
        </div>
      </div>
      <div className="pt-[47px] w-[260px] h-[240px] items-center mx-auto ">
        <img src={props.src} className="h-full mx-auto" />
      </div>
      <div className="mt-11 w-full font-inter">
        <div className="text-left text-[12px] leading-[12px] text-gray">
          {props.category}
        </div>
        <div className="mt-2 text-left max-w-[240px] text-base font-bold">
          {props.name}
        </div>
      </div>
      <div
        className={
          props.auth
            ? 'w-full flex justify-between h-[56px] pt-2'
            : 'w-full pt-2 text-left h-[56px] font-bold'
        }
      >
        {props.auth ? (
          <>
            <div className="text-[12px] text-gray w-[117px] text-left">
              {isLoggedIn ? 'Your negotiated price' : 'List Price'}
              <CurrencyBeforeComponent>
                <del>{props.list_price} </del>
              </CurrencyBeforeComponent>
            </div>
            <div className="flex">
              <img src="/products/pen.png" className="w-4 h-4 mt-1" />
              <div className="text-[20px] leading-[24px] font-bold ml-1">
                <CurrencyBeforeValue value={props.price} />
                <span className="text-[12px] font-normal text-gray">
                  (Incl. VAT)
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-base  pt-4">
            <CurrencyBeforeValue value={props.price} />
            <span className="text-[12px] font-normal text-gray">
              (Incl. VAT)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const products = [
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/hp_laser_printer.png',
    category: 'TY2-B#M74A',
    name: 'HP LaserJet 1*500-sheet Paper Feeder and Cabinet',
    price: '341.89',
    list_price: '389.50',
  },

  {
    stock: 'In',
    rating: 4,
    count: 8,
    src: '/products/pc_stand.png',
    category: 'BB2-B3M987',
    name: 'RP9 Retail Compact Stand Silver PC Multimedia stand',
    price: '84.89',
    list_price: '94.10',
  },
  {
    stock: 'In',
    rating: 4,
    count: 8,
    src: '/products/stapler.png',
    category: 'BB2-B3M987',
    name: 'Zenith Plier stapler 548/E Silver',
    price: '27.50',
    list_price: '34.99',
  },
  {
    stock: 'Low',
    rating: 4,
    count: 8,
    src: '/products/comfort_chair.png',
    category: 'TY2-B#M74A',
    name: 'Comfort Ergo 2-Lever Operator Chairs',
    price: '53.59',
    list_price: '59.99',
  },
]

const ProductTitle = (props) => {
  return (
    <>
      {/* for dektop content */}
      <div className="desktop_only md:pt-24 font-inter font-bold text-2xl text-center">
        {/*{props.auth ? 'Products For You' : 'Browse Popular Products'}*/}
      </div>

      {/* for mobile content */}
      <div className="mobile_only pt-12 font-inter font-bold text-2xl text-center">
        {props.auth ? 'Products For You' : 'Browse Popular Products'}
      </div>
    </>
  )
}

const ProductSlider = ({ auth }) => {
  const { isLoggedIn } = useAuth()
  return (
    <Slider className="slider-wrapper">
      {products.map((item, index) => (
        <div key={index} className="slider-content">
          <div className="w-full h-3 flex justify-between">
            <div
              className={
                item.stock == 'Low'
                  ? 'text-emporixGold font-inter font-bold text-[12px] pt-[6px]'
                  : 'text-brightGreen font-inter font-bold text-[12px] pt-[6px]'
              }
            >
              {item.stock} Stock
            </div>
            <div className="flex h-5">
              <ReactStars size={16} value={item.rating} color2={'#FBB13C'} />(
              {item.count})
            </div>
          </div>
          <div className="pt-[47px] w-[260px] h-[240px] items-center mx-auto ">
            <img src={item.src} className="h-full mx-auto" />
          </div>
          <div className="mt-11 w-full font-inter">
            <div className="text-left text-[12px] leading-[12px] text-gray">
              {item.category}
            </div>
            <div className="mt-2 text-left w-[240px] text-base font-bold">
              {item.name}
            </div>
          </div>
          <div
            className={
              auth
                ? 'w-full flex justify-between h-[56px] pt-2'
                : 'w-full pt-2 text-left h-[56px] font-bold'
            }
          >
            {auth ? (
              <>
                <div className="text-[12px] text-gray w-[117px] text-left">
                  {isLoggedIn ? 'Your negotiated price' : 'List Price'}{' '}
                  <del>
                    <CurrencyBeforeValue value={item.list_price} />
                  </del>
                </div>
                <div className="flex">
                  <img src="/products/pencil.png" className="w-4 h-4 mt-1" />
                  <div className="text-[20px] leading-[24px] font-bold ml-1">
                    {item.price} <br />
                    <span className="text-[12px] font-normal text-gray">
                      (Incl. VAT)
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-base  pt-4">
                &#163; {item.price}{' '}
                <span className="text-[12px] font-normal text-gray">
                  (Incl. VAT)
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </Slider>
  )
}
const Product = () => {
  const currentUser = useSelector(userSelector)
  return (
    <div className="home_product">
      <ProductTitle auth={currentUser ? true : false} />
      {/* for mobile panel */}
      {/* for desktop panel */}
      <div className="desktop_only md:pt-9 max-w-screen-2xl mx-auto md:px-[5%] lg:px-[10%] w-full md:h-[456px] md:grid md:grid-cols-4 md:gap-x-6 text-black">
        {products.map((item, index) => (
          <EachProduct
            key={index}
            auth={currentUser}
            stock={item.stock}
            rating={item.rating}
            total_count={item.count}
            src={item.src}
            category={item.category}
            name={item.name}
            price={item.price}
            list_price={item.list_price}
          />
        ))}
      </div>
    </div>
  )
}

export default Product
