import React, { createContext, useContext, useState } from 'react'
import './accordion.css'
import { cn } from '../../cssUtils'

const AccordionContext = createContext()

export const AccordionItem = ({ index, title, children }) => {

  const { activeItem, setActiveItem } = useContext(AccordionContext)
  return (
    <div className="border-b border-demoGrayDarker py-6">
      <div
        className="cursor-pointer flex"
        onClick={() =>
          activeItem !== index ? setActiveItem(index) : setActiveItem(-1)
        }
      >
        <span
          className={cn('w-full font-bold hover:text-demoSecondaryDimmed text-demoHeadlines', {
            "pb-6": activeItem === index
          })}>{title}</span>
        <div className="stroke-demoSecondaryDimmed">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('mt-1 mr-1',
              { 'rotate-90': activeItem !== index },
              { '-rotate-90': activeItem === index },
            )}
          >
            <g fill="none" style={{ color: 'rgb0,82,194)' }}>
              <polyline
                fill="none"
                strokeWidth="3"
                points="7 1 18 12 7 23"
              ></polyline>
            </g>
          </svg>
        </div>
      </div>
      <div
        className={
          activeItem === index ? 'block' : 'hidden'
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
      <div
        className="grid grid-cols-1 border-t border-demoGrayDarker">{children}</div>
    </AccordionContext.Provider>
  )
}
export default Accordion
