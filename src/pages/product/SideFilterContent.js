import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import MultiRangeSlider from '../../components/MultiRangeSlider/'
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

const FilterItem = ({ item, handleItem }) => {
  const title = item.title
  const selectItems = item.items
  return (
    <div>
      <div className="font-inter font-medium pt-4 pb-6"> {item.title} </div>
      {selectItems.map((item, index) => (
        <SelectionFilterItem
          category={title}
          title={item}
          key={index}
          handleItem={handleItem}
        />
      ))}
    </div>
  )
}

const SelectionFilterItem = ({ category, title, handleItem }) => {
  const handleOnChange = (e) => {
    const val = e.target.value
    const item = { category: category, val: val }
    handleItem(item)
  }
  return (
    <div className="flex justify-between pb-4">
      <div>
        <input
          type="checkbox"
          name={title}
          value={title}
          onChange={handleOnChange}
        />
        <label> {title}</label>
      </div>
      <div className="text-lightGray pr-2">10</div>
    </div>
  )
}

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

const PriceRangeFilter = () => {
  return (
    <div className="pt-6">
      <div className="font-inter font-medium pb-8">Price Range</div>
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
  )
}

const RatingFilter = () => {
  return (
    <div className="pt-6">
      <div className="font-inter font-medium pb-8">Filters Group</div>
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
  )
}

const SideFilterContent = (props) => {
  const [filterItems, setFilterItems] = useState([])
  const handleItem = (newItem) => {
    if (!filterItems.some((item) => item.val === newItem.val)) {
      setFilterItems((prev) => [...prev, newItem])
    } else {
      setFilterItems(
        filterItems.filter((item) => {
          return item.val !== newItem.val
        })
      )
    }
  }
  const sidebarClass = props.isOpen ? 'sidebarFilter open ' : 'sidebarFilter'
  return (
    <div className={sidebarClass}>
      <div className="float-right">
        <AiOutlineClose onClick={props.toggleSidebar} />
      </div>
      <div className="pt-12">
        {filterList.map((item, index) => (
          <FilterItem key={index} item={item} handleItem={handleItem} />
        ))}
        <PriceRangeFilter />
        <RatingFilter />
      </div>

      <div className="mt-12 font-inter font-bold">
        <div
          className="w-full h-12 bg-tinBlue text-white  flex items-center "
          onClick={() => {
            props.setFilterItemFunc(filterItems)
            props.toggleSidebar()
          }}
        >
          <span className="text-center w-full">DONE </span>
        </div>
        <div className="w-full h-12 bg-bgWhite text-white  flex items-center mt-6">
          <span className="text-center text-tinBlue w-full">CLEAR ALL </span>
        </div>
      </div>
    </div>
  )
}

export default SideFilterContent
