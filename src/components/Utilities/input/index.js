import { GridLayout } from '../common'
import { TextRegular1 } from '../typography'
import './input.css'

export const TextInput = ({ label, value, placeholder, action, className, id }) => {
  return (
    <GridLayout className="">
      <TextRegular1 className="text-left">{label}</TextRegular1>
      <GridLayout className="mt-2">
        <input
          id={id}
          value={value}
          onChange={(e) => {
            if (action !== undefined) action(e.target.value)
          }}
          placeholder={placeholder}
          className={
            'text-input-normal ' + (className !== undefined ? className : '')
          }
        />
      </GridLayout>
    </GridLayout>
  )
}
export const TextInputOnly = ({
  value,
  placeholder,
  action,
  className,
  onFocus,
  onBlur,
  autoFocus,
}) => {
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => {
        if (action !== undefined) {
          action(e.target.value)
        }
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return
        if (action !== undefined) action(e.target.value)
      }}
      onFocus={(e) => {
        if (onFocus !== undefined) onFocus()
      }}
      onBlur={(e) => {
        if (onBlur !== undefined) onBlur()
      }}
      placeholder={placeholder}
      className={
        'text-input-normal ' + (className !== undefined ? className : '')
      }
    />
  )
}
export const TextInputOnlyWithEnterKey = ({
  value,
  placeholder,
  action,
  className,
}) => {
  return (
    <input
      value={value}
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return
        if (action !== undefined) action(e.target.value)
      }}
      placeholder={placeholder}
      className={
        'text-input-normal ' + (className !== undefined ? className : '')
      }
    />
  )
}
