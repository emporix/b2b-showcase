import './button.css'
import { Link } from 'react-router-dom'
import React from 'react'

export const LargePrimaryButton = ({
  title,
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={'px-6 py-4 bg-blue text-white uppercase font-bold transition ease-in-out duration-300 hover:bg-blueHover w-full ' + (className ? className : '')}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export const MediumPrimaryButton = ({ title, onClick, className }) => {
  return (
    <button
      className={'medium-primary-btn ' + (className ? className : '')}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export const PrimaryBlueButton = ({ title, onClick, className }) => {
  return (
    <button
      className={'primary-blue-btn ' + (className ? className : '')}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export const SecondaryOutlineButton = ({ title, onClick, className }) => {
  return (
    <button
      className={'secondary-outline-btn ' + (className ? className : '')}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export const MediumSecondaryButton = ({ title, onClick, className }) => {
  return (
    <button
      className={'medium-secondary-btn ' + (className ? className : '')}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export const BackButton = ({ link, title, className }) => {
  return (
    <div className={`${className} font-inter font-semibold text-[14px]`}>
      <Link to={link}>
        <span>&#60;- </span>
        {title}
      </Link>
    </div>
  )
}

export const HirmerButton = ({ title, onClick, className }) => {
  return (
    <button
      className={'hirmer-btn ' + (className ? className : '')}
      onClick={onClick}
    >
      {title}
    </button>
  )
}
