import { useRef, useState, useEffect } from 'react'
import { HiChevronDown } from 'react-icons/hi'

export default function NavDropdown({
  name,
  small,
  list = [],
  currentValue,
  onChangeHandler = () => {},
  children,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef()

  const handleClick = (event, selected) => {
    setIsOpen(false)
    onChangeHandler(event)
  }

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
    <div
      ref={selectRef}
      className="relative max-w-fit inline-block text-left whitespace-nowrap"
    >
      <button
        className="flex flex-row items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {children}
        <span
          className={`flex flex-row items-center ${small ? 'text-sm' : ''}`}
        >
          {name ? (
            <span
              className={`hidden lg:inline-block pl-2 ${
                small ? 'text-sm' : ''
              }`}
            >
              {name}:{' '}
            </span>
          ) : null}
          <span className="inline-block pl-2">
            {list.find((item) => item.value === currentValue)?.text}
          </span>
          <HiChevronDown
            size={20}
            className="-mr-1 ml-1 h-5 w-5"
            aria-hidden="true"
            style={{ transform: 'translateY(1px)' }}
          />
        </span>
      </button>
      {list && list?.length > 0 ? (
        <div
          className={`${
            isOpen ? 'opacity-100' : 'invisible opacity-0'
          } absolute mt-1 min-w-full origin-top-right right-0 rounded-md shadow-lg bg-white ring-black ring-opacity-5 focus:outline-none transition-opacity duration-600 z-50`}
        >
          <div className="py-1">
            {list.map((item) => (
              <button
                key={item.value}
                value={item.value}
                onClick={(e) => handleClick(e, item.value)}
                className="text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm whitespace-nowrap"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
