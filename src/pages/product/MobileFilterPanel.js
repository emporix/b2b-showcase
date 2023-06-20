import React, { useState, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { HiChevronRight , HiChevronDown } from "react-icons/hi";
import MultiRangeSlider from "../../components/MultiRangeSlider/";
import ReactStars from 'react-stars'

const filterList = [
  {
    title: 'Arm Type',
    items: ['Adjustable Arms', 'Fixed', 'No Arms', 'With Arms'],
  },
  {
    title: 'Brand',
    items: ['Equipe', 'Jysk', 'Jenson', 'Techly', 'Hermann Miller', 'Botth'],
  },
  {
    title: 'Material',
    items: ['Leather', 'Fabric', 'Faux Leather', 'Mesh'],
  },
  {
    title: 'Back Height',
    items: ['High', 'Medium'],
  },
]

const ratingFilterList = [
  {
    rating: 5,
    total: 94,
  },
  {
    rating: 4,
    total: 84,
  },
  {
    rating: 3,
    total: 102,
  },
  {
    rating: 2,
    total: 4,
  },
  {
    rating: 1,
    total: 8,
  },
]

const RatingFilterItem = ({ rating, total }) => {
  return (
    <div className="flex justify-between pb-4">
      <div className="flex w-3/5 items-left">
        <input type="checkbox" />

        <label className="pl-2">
          <ReactStars
            size={30}
            value={rating}
            color2={'#FBB13C'}
            edit={false}
          />
        </label>
      </div>
      <div className="font-inter font-medium text-base text-lightGray pt-4">
        {total}
      </div>
    </div>
  )
}

const SelectionFilterItem = ({ title }) => {
  return (
    <div className="flex justify-between pb-4">
      <div>
        <input type="checkbox" name={title} value={title} />
        <label> {title}</label>
      </div>
      <div className="text-lightGray pr-2">10</div>
    </div>
  )
}

const FilterItem = ({ item }) => {
  const [clicked, setClicked] = useState(false)
  const contentEl = useRef()
  const { title, items } = item
  const handleToggle = () => {
    setClicked((prev) => !prev)
  }

  return (
    <li className={`accordion_item ${clicked ? 'active' : ''}`}>
      <button className="button" onClick={handleToggle}>
        {title}
        {clicked ? (
            <HiChevronDown size={20}  className="h-8" />
        ) : (
            <HiChevronRight size={20} className="h-8" />
        )}
      </button>

      <div
        ref={contentEl}
        className="content_wrapper"
        style={
          clicked
            ? { height: contentEl.current.scrollHeight }
            : { height: '0px' }
        }
      >
        <div className="content">
          {items.map((title, index) => (
            <SelectionFilterItem key={index} title={title} />
          ))}
        </div>
      </div>
    </li>
  )
}

const PriceRangeFilter = () => {
  const [clicked, setClicked] = useState(false)
  const contentEl = useRef()

  const handleToggle = () => {
    setClicked((prev) => !prev)
  }
  return (
    <li className={`accordion_item ${clicked ? 'active' : ''}`}>
      <button className="button" onClick={handleToggle}>
        Price Range
        {clicked ? (
            <HiChevronDown size={20} className="h-8" />
        ) : (
            <HiChevronRight size={20} className="h-8" />
        )}
      </button>
      <div
        ref={contentEl}
        className="content_wrapper"
        style={
          clicked
            ? { height: contentEl.current.scrollHeight }
            : { height: '0px' }
        }
      >
        <div className="content">
          <div className="flex justify-between text-black">
            <input
              className="w-[45%] border border-lightGray h-8"
              type="text"
              placeholder="From"
            />
            <span className="text-lightGray"> &#8212; </span>
            <input
              className="w-[45%] border border-lightGray h-8"
              type="text"
              placeholder="To"
            />
          </div>
          <div>
            <MultiRangeSlider
              min={0}
              max={1000}
              onChange={({ min, max }) =>
                console.log(`min = ${min}, max = ${max}`)
              }
            />
          </div>
        </div>
      </div>
    </li>
  )
}

const RatingFilter = () => {
  const [clicked, setClicked] = useState(false)
  const contentEl = useRef()
  const handleToggle = () => {
    setClicked((prev) => !prev)
  }

  return (
    <li className={`accordion_item ${clicked ? 'active' : ''}`}>
      <button className="button" onClick={handleToggle}>
        Rating
        {clicked ? (
            <HiChevronDown size={20} className="h-8" />
        ) : (
            <HiChevronRight size={20} className="h-8" />
        )}
      </button>
      <div
        ref={contentEl}
        className="content_wrapper"
        style={
          clicked
            ? { height: contentEl.current.scrollHeight }
            : { height: '0px' }
        }
      >
        <div className="content">
          {ratingFilterList.map((item, index) => (
            <RatingFilterItem
              key={index}
              rating={item.rating}
              total={item.total}
            />
          ))}
        </div>
      </div>
    </li>
  )
}

const MobileFilterPanel = (props) => {
  return (
    <div className="lg:hidden min-w-[375px] text-black fixed top-0 left-0 w-full  h-screen bg-white px-6 py-12  text-center font-medium overflow-y-auto z-50">
      <div className="justify-between flex pb-12 border-b">
        <div className="text-2xl leading-6 font-semibold items-center">
          Filters
        </div>
        <div className="flex text-center" onClick={props.closeNav}>
          <span className="pr-4">Close</span>
          <AiOutlineClose size={25} />
        </div>
      </div>
      <div>
        <ul className="accordion">
          {filterList.map((item, index) => (
            <FilterItem key={index} item={item} />
          ))}
          <PriceRangeFilter />
          <RatingFilter />
        </ul>
      </div>
      <div className="mt-12 font-inter font-bold">
        <div className="w-full h-12 bg-yellow text-eerieBlack  flex items-center cursor-pointer">
          <span className="text-center w-full">APPLY FILTER </span>
        </div>
        <div className="w-full h-12 bg-aliceBlue text-eerieBlack  flex items-center mt-6 cursor-pointer">
          <span className="text-center text-eerieBlack w-full">CLEAR ALL </span>
        </div>
      </div>
    </div>
  )
}

export default MobileFilterPanel
