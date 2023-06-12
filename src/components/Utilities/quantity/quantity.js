import React, { useMemo, useState } from 'react'
import './quantity.css'
import { TextField } from '@material-ui/core'
import { debounce } from 'lodash'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const Quantity = ({ value, increase, decrease, changeCartItemQty }) => {
  const debounceHandler = useMemo(
    () =>
      debounce((quantity) => {
        if (quantity === '') {
          changeCartItemQty(1)
          return setQuantity(1)
        }
        changeCartItemQty(quantity)
      }, 700),
    []
  )

  const [quantity, setQuantity] = useState(value)
  const setQuantityHelper = (quantity) => {
    if (quantity === '') {
      setQuantity('')
      debounceHandler('')
      return
    }
    if (isNaN(parseInt(quantity)) || quantity.includes('-')) {
      return
    }
    const newQuantity = parseInt(quantity)
    if (newQuantity > 10000) {
      setQuantity(10000)
      debounceHandler(10000)
      return
    }
    if (newQuantity < 0) {
      debounceHandler(0)
      return setQuantity(0)
    }
    debounceHandler(newQuantity)
    return setQuantity(newQuantity)
  }

  return (
    <Box className="quantity-input rounded border border-quartz" sx={{ width: '84px' }} >
      {typeof increase !== 'function' && typeof decrease !== 'function' ? (
        <TextField
          variant="standard"
          value={quantity}
          onChange={(event) => setQuantityHelper(event.target.value)}
        />
      ) : (
        <>
          <button
            className="quantity-input_modifier quantity-input__modifier--left"
            onClick={() => decrease()}
          >
            <svg
              width="10"
              height="3"
              viewBox="0 0 10 3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 0.908417V2.47092H0V0.908417H10Z" fill="#818385" />
            </svg>
          </button>
          <div className="quantity-input_screen">{value}</div>

          <button
            className="quantity-input_modifier quantity-input__modifier--right"
            onClick={() => increase()}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.89205 9.37717V0.00216675H5.48295V9.37717H3.89205ZM0 5.48512V3.89421H9.375V5.48512H0Z"
                fill="#818385"
              />
            </svg>
          </button>
        </>
      )}
    </Box>
  )
}
export default Quantity
