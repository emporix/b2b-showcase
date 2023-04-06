import React, {useCallback} from 'react'
import {
  CurrencyAfterValue,
} from 'components/Utilities/common'

import { TENANT } from 'constants/localstorage'
import { useNavigate } from 'react-router-dom'

const Product = (props) => {
  const navigate = useNavigate()
  const userTenant = localStorage.getItem(TENANT)
  const handleProductDetail = useCallback(() => {
    navigate(`/${userTenant}/product/details/${props.id}`)
  }, [userTenant, props.id])
  return (
    <div className="mx-3 hover:cursor-pointer" onClick={handleProductDetail}>
      <div className="pt-[47px] w-[260px] h-[240px] items-center mx-auto ">
        <img src={props.src} className="h-full mx-auto" />
      </div>
      <div className="mt-11 w-full font-inter flex flex-col items-center">
        <div className="text-left text-[12px] leading-[12px] font-bold">
          {props.code}
        </div>
        <div className="mt-2 text-left max-w-[240px] text-base text-gray">
          {props.name}
        </div>
      </div>
      <div className="w-full flex justify-center h-[56px] pt-2">
        <div className="flex">
          <div className="text-[20px] leading-[24px] font-bold ml-1">
            <CurrencyAfterValue value={props.price} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Product
