import React from 'react'
import './quantity.css'

const Quantity = ({
                    value, increase = () => {
  }, decrease = () => {
  }, onChange = (value) => {
  },
                  }) => {
  return (
    <div className="flex h-[50px] flex-row rounded border border-aldiGray3">
      <button
        id="quantity-decrease"
        className="w-[48px] flex flex-col items-center justify-center"
        onClick={() => decrease()}
      >
        <svg
          width="20"
          height="2"
          viewBox="0 0 20 2"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-aldiGray3 stroke-2 stroke-aldiGray3"
        >
          <path d="M 0 1 H 20 V 0 H 0 Z" />
        </svg>
      </button>
      <input
        className="w-[50px] text-center border border-x-1 border-y-0 border-aldiGray3"
        value={value} onChange={(ev) => {
        if (!ev.target.value) {
          onChange(1)
        } else if (!isNaN(ev.target.value)) {
          onChange(parseInt(ev.target.value))
        }
      }} />
      <button
        id="quantity-increase"
        className="w-[48px] flex flex-col items-center justify-center"
        onClick={() => increase()}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 21 21"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-aldiGray3 stroke-1 stroke-aldiGray3"
        >
          <path
            d="M 0 11 h 10 V 21 H 11 V 11 H 21 V 10 H 11 V 0 H 10 V 10 H 0 Z" />
        </svg>
      </button>
    </div>
  )
}

export default Quantity
