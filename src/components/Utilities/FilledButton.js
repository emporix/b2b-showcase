import React from 'react'

const FilledButton = ({ children, onClick, className, disabled = false }) => {
  return (
    <button
      onClick={() => {
        !disabled && onClick()
      }}
      className={`
      w-full text-[16px] leading-[16px] text-center font-semibold h-12 px-6
      ${
        !disabled
          ? 'bg-tinBlue hover:bg-tinBlue/[.9] text-white'
          : 'bg-[#EFF0F2] text-[#ACAEB2] cursor-auto'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default FilledButton
