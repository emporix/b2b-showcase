import './radio.css'
import { styled } from '@mui/material/styles'
import Radio from '@mui/material/Radio'
import { useState, createContext, useContext } from 'react'

export const RadioContext = createContext()

export const RadioGroup = ({ children, active }) => {
  const [radioActive, setRadioActive] = useState(active)

  return (
    <div className="radio-group-wrapper">
      <RadioContext.Provider value={{ radioActive, setRadioActive }}>
        {children}
      </RadioContext.Provider>
    </div>
  )
}
const RadioIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 24,
  height: 24,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}))

const RadioCheckedIcon = styled(RadioIcon)({
  backgroundColor: '#137cbd',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    margin: 5.5,
    display: 'block',
    width: 13,
    height: 13,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
})

export const RadioItem = ({ radioKey }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)

  return (
    <Radio
      sx={{ '&:hover': { bgcolor: 'transparent' } }}
      disableRipple
      color="default"
      checkedIcon={<RadioCheckedIcon />}
      icon={<RadioIcon />}
      checked={radioKey == radioActive ? true : false}
      onClick={() => setRadioActive(radioKey)}
    />
  )
}
