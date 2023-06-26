import Select from 'react-dropdown-select'
import { GridLayout } from '../common'
import { TextRegular1 } from '../typography'
import './dropdown.css'

const Dropdown = ({
  options,
  placeholder,
  onChange,
  defaultValue,
  style,
  className,
}) => {
  return (
    <Select
      options={options}
      searchable={true}
      values={defaultValue ? [defaultValue] : []}
      onChange={onChange}
      style={style}
      className={className}
      placeholder={placeholder !== undefined ? placeholder : 'Please select'}
      dropdownHandleRenderer={({ state }) => (
        <>
          {state.dropdown ? (
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 7L7 1L1 7"
                stroke="#ACAEB2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 0.999999L7 7L13 1"
                stroke="#ACAEB2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </>
      )}
    />
  )
}

export const DropdownWithLabel = ({
  label,
  options,
  placeholder,
  onChange,
  defaultValue,
  className,
}) => {
  return (
    <GridLayout className={`_dropdown_ ${className}`}>
      <TextRegular1>{label}</TextRegular1>
      <GridLayout className="mt-2">
        <Dropdown
          options={options}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
        />
      </GridLayout>
    </GridLayout>
  )
}

export const Dropdown1 = ({ options, placeholder }) => {
  return (
    <div className="dropdown1">
      <Dropdown options={options} placeholder={placeholder} />
    </div>
  )
}

export default Dropdown
