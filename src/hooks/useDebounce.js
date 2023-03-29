import React, { useEffect, useRef } from 'react'

export const useDebounce = (delay) => {
  const timer = useRef(null)
  const debounce = (callback) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      callback()
    }, delay)
  }
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])
  return { debounce }
}
