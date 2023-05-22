import React from 'react'

const OutlinedButton = ({ children, onClick, className, disabled = false }) => {
  return (
    <button
      onClick={() => {
        !disabled && onClick()
      }}
      className={`
      h-12 w-full font-bold text-center
      ${
        !disabled
          ? 'bg-[#EFF0F2] hover:bg-[#EFF0F2]/[.9] text-[#214559] hover:brightness-95 border-[#214559] border'
          : 'bg-[#EFF0F2] text-[#ACAEB2] cursor-auto'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default OutlinedButton
