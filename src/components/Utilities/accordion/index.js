import React, { useState, createContext, useContext } from 'react'
import './accordion.css'

const AccordionContext = createContext()

export const AccordionItem = ({ index, title, children }) => {
  const { activeItem, setActiveItem } = useContext(AccordionContext)
  return (
    <div className="accordiion-item-wrapper">
      <div
        className={
          activeItem == index
            ? 'accordion-title active cursor-pointer'
            : 'cursor-pointer accordion-title'
        }
        onClick={() =>
          activeItem != index ? setActiveItem(index) : setActiveItem(-1)
        }
      >
        <span className="w-full text-center">{title}</span>
        <div className="accordion-arrow-action">
          {activeItem == index ? (
            <svg
              width="15"
              height="8"
              viewBox="0 0 15 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 1L7.5 7L13.5 1"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="9"
              height="14"
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 13L7.5 7L1.5 1"
                stroke="#ACAEB2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <div
        className={
          activeItem == index ? 'accordion-content' : 'accordion-content hidden'
        }
      >
        {children}
      </div>
    </div>
  )
}
const Accordion = ({ children }) => {
  const [activeItem, setActiveItem] = useState(0)
  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem }}>
      <div className="accordition-wrapper">{children}</div>
    </AccordionContext.Provider>
  )
}
export default Accordion
