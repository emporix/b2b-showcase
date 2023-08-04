import React, { useContext, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import './checkout.css'

const ShippingMethod = ({ radioKey, shippingmode, price, onClick }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)

  return (
    <div
    onChange={radioActive === radioKey  && onClick !== undefined ? onClick(radioKey): null}
      className={
        radioActive === radioKey
          ? 'shipping_method_selected'
          : 'shipping_method'
      }
    >
      <div className="flex justify-between w-full">
        <div className="flex">
          <RadioItem radioKey={radioKey} />
          <div className="pt-2 md:pt-0 pl-3">
            <div className=" font-bold text-base ">
              {shippingmode}{' '}
              <span className="underline font-semibold text-[14px]">+info</span>
            </div>
          </div>
        </div>

        <div className=" font-medium text-xl pt-2 md:pt-0">{price}</div>
      </div>
    </div>
  )
}

export default ShippingMethod
