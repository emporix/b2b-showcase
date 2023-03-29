import React from 'react'
import ReactStars from 'react-stars'
import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { useAuth } from 'context/auth-provider'

const Product = (props) => {
  const { isLoggedIn } = useAuth()
  return (
    <div className="mx-3">
      <div className="w-full h-3 flex justify-between ">
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
          {props.code}
        </div>
        <div className="mt-2 text-left max-w-[240px] text-base font-bold">
          {props.name}
        </div>
      </div>
      <div className="w-full flex justify-between h-[56px] pt-2">
        <div className="text-[12px] text-gray w-[150px] text-left">
          {isLoggedIn ? 'Your negotiated price' : 'List Price'}
          <CurrencyBeforeComponent>
            <del>{props.list_price}</del>
          </CurrencyBeforeComponent>
        </div>
        <div className="flex">
          <img src="/products/pencil.png" className="w-4 h-4 mt-1" />
          <div className="text-[20px] leading-[24px] font-bold ml-1">
            <CurrencyBeforeValue value={props.price} />
            <br />
            <span className="text-[12px] font-normal text-gray">
              (Incl. VAT)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Product
