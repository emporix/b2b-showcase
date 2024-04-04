import React, { useContext } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import './checkout.css'

const ShippingMethod = ({ radioKey, shippingmode, date, price }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)
  return (
    <div
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
            <div className="desktop_only font-normal color-darkGray pt-2">
              Expected arrival on: {date}
            </div>
          </div>
        </div>

        <div className=" font-medium text-xl pt-2 md:pt-0">{price}</div>
      </div>

      <div className="mobile_only font-normal color-darkGray pt-2">
        Expected arrival on: {date}
      </div>
    </div>
  )
}

export default ShippingMethod
