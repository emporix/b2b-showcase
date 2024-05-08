import { useRef, useState, useEffect } from 'react'
import { HiChevronDown } from 'react-icons/hi'

export default function NavDropdown({
  name,
  list = [],
  currentValue,
  onSelect = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef()

  const handleClickOutside = (event) => {
    selectRef.current &&
      !selectRef.current.contains(event.target) &&
      setIsOpen(false)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [selectRef])

  return (
    <div ref={selectRef} className="flex relative text-left">
      <button
        className="flex flex-row"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="pl-2">{name}: </span>
        <span className="pl-2">{currentValue}</span>
        <HiChevronDown
          size={20}
          className="-mr-1 ml-2 h-5 w-5"
          aria-hidden="true"
        />
      </button>
      <div
        className={`absolute top-5 right-0 ${
          isOpen ? 'opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="py-1">
          {list &&
            list.map((item) => (
              <button
                key={item.value}
                value={item.value}
                className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm"
              >
                {item.text}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
