import React, { useState } from 'react'
import { Teaser } from './teaser'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export const TeaserSlider = (props) => {

  const teasers = props.props?.data?.st_elements?.map(st_element=>st_element);

  return <>
    <div className="flex justify-center items-center">
      <Slider>
        {teasers.map((p)=> {return <SliderItem><Teaser props={p}/></SliderItem>})}
      </Slider>
    </div>
  </>
}

const SliderItem = ({children}) => {
  return <div className="min-w-full">
    {children}
  </div>
}

const Slider = ({ children }) => {

  const[curr, setCurr] = useState(0)

  const prev = ()=>{
    if (curr <= 0) {
      setCurr(children.length - 1)
    } else {
      setCurr(curr-1)
    }
  }

  const next = ()=>{
    if (curr >= children.length -1) {
      setCurr(0)
    } else {
      setCurr(curr+1)
    }
  }

  return<>
    <div className="overflow-hidden relative">
      <div className="flex transition-transform ease-out duration-500" style={{transform:`translatex(-${curr*100}%`}}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button onClick={prev} className="p1 rounded-full shadow text-6xl bg-primary text-white hover:bg-white hover:text-white">
          <HiChevronLeft />
        </button>
        <button onClick={next} className="p1 rounded-full shadow text-6xl bg-primary text-white hover:bg-white hover:text-primary">
          <HiChevronRight />
        </button>
      </div>
      <div className="absolute bottom-5 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {children.map((c, idx)=> {
            return <div key={idx} className={`transition-all rounded-b-none ${curr===idx ? "bg-primary w-3 h-3" : "bg-black w-1.5 h-1.5"}`} />
          })}
        </div>
      </div>
    </div>
  </>
}